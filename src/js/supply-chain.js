/* Supply Chain Officer dashboard. Records persist in Firestore (see role-backend.js):
   supplyDeliveries/{DEL-…}          delivery and receipt records (source of truth)
   supplyLaunchConfirmations/pulilan final supply-readiness confirmation
   userSettings/{uid}                Settings section values
   Readiness, Inventory, Supplier Issues and Launch Confirmation are derived from
   the delivery records, so updating a delivery updates every section. */
import {
  ValidationError, applySettingsForm, createWithSequence, describeError, formatWhen,
  highestNumber, isoDate, loadSettings, optionalText, oneOf, readSettingsForm, requireRole,
  requiredText, saveRecord, saveSettings, watchCollection, wholeNumber
} from './role-backend.js';

const sidebar = document.getElementById('sidebar');
const page = document.querySelector('.page-content');
const overview = page.innerHTML;
const modal = document.getElementById('deliveryModal');
const modalTitle = document.getElementById('modalTitle');
const saveButton = document.getElementById('saveDelivery');
const toast = document.getElementById('toast');

const deliveryRecords = [
  {id:'DEL-2026-0731',issueId:'ISS-2026-017',item:'POS Terminals',branch:'Pulilan, Bulacan',supplier:'TechPro Systems',expected:4,received:2,schedule:'Revised: July 24',date:'2026-07-24',status:'Incomplete',note:'Two terminals are missing. TechPro confirmed an expedited corrective delivery.'},
  {id:'DEL-2026-0734',item:'Kitchen Equipment Package',branch:'Pulilan, Bulacan',supplier:'EquipServe PH',expected:14,received:14,schedule:'Received July 20',date:'2026-07-20',status:'Received',note:'All units verified in good condition.'},
  {id:'DEL-2026-0725',issueId:'ISS-2026-018',item:'Opening Inventory Batch B',branch:'Pulilan, Bulacan',supplier:'FoodHub Distribution',expected:100,received:94,schedule:'July 22',date:'2026-07-22',status:'Incomplete',note:'Six packaging items remain pending.'},
  {id:'DEL-2026-0735',item:'Packaging & Consumables',branch:'Pulilan, Bulacan',supplier:'PackRight PH',expected:86,received:0,schedule:'July 23',date:'2026-07-23',status:'Scheduled',note:'Arrival window is 3:00–5:00 PM.'}
];
const deliverySeed = structuredClone(deliveryRecords);

const DELIVERY_STATUSES = ['Scheduled','In Transit','Received','Incomplete','Delayed','Damaged'];
const EXCEPTION_STATUSES = ['Incomplete','Delayed','Damaged'];
const LAUNCH_DOC = 'pulilan';

// Opening requirements and the delivery record that fulfils each one.
const LAUNCH_ITEMS = [
  {key:'kitchen',id:'DEL-2026-0734',match:/kitchen/i,label:'Kitchen Equipment',detail:'Pulilan, Bulacan',inventoryLabel:'Kitchen Equipment',inventoryDetail:'Installed and verified',mandatory:true},
  {key:'pos',id:'DEL-2026-0731',match:/\bpos\b/i,label:'POS Terminals',detail:'Mandatory opening requirement',inventoryLabel:'POS Terminals',inventoryDetail:'Mandatory equipment',mandatory:true,blocker:true},
  {key:'inventory',id:'DEL-2026-0725',match:/inventory/i,label:'Opening Inventory',detail:'Food and packaging supplies',inventoryLabel:'Packaging Materials',inventoryDetail:'Opening inventory',mandatory:false}
];

let session = null;
let savedSettings = null;
let launchConfirmation = null;
let activeRecordId = null;
let activeSection = 'overview';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const statusClass = status => ({Received:'monitoring',Complete:'monitoring',Scheduled:'investigating','In Transit':'investigating',Incomplete:'investigating',Delayed:'action',Damaged:'action',Open:'action'}[status] || 'investigating');
const icons = () => { if (window.lucide) lucide.createIcons(); };
const show = message => { toast.querySelector('span').textContent = message; toast.classList.add('show'); clearTimeout(toast._timer); toast._timer = setTimeout(() => toast.classList.remove('show'), 2800); };
const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric'}) : 'Schedule TBD';
const isMandatory = record => LAUNCH_ITEMS.some(item => item.mandatory && launchRecord(item) === record);

function launchRecord(item){
  return deliveryRecords.find(record => record.id === item.id) || deliveryRecords.find(record => item.match.test(record.item));
}

/** Readiness figures derived from the delivery records. */
function launchState(){
  const rows = LAUNCH_ITEMS.map(item => {
    const record = launchRecord(item);
    const required = record ? record.expected : 0;
    const available = record ? Math.min(record.received, required) : 0;
    return {...item, record, required, available, pending:Math.max(required - available, 0), percent:required ? Math.round(available / required * 100) : 0};
  });
  const required = rows.reduce((sum, row) => sum + row.required, 0);
  const available = rows.reduce((sum, row) => sum + row.available, 0);
  const pos = rows.find(row => row.key === 'pos');
  const posComplete = Boolean(pos.record) && pos.pending === 0 && pos.record.status === 'Received';
  const blockers = rows.filter(row => row.blocker && (row.pending > 0 || row.record?.status !== 'Received'));
  return {rows, pos, posComplete, blockers, overall:required ? Math.floor(available / required * 100) : 0, pendingUnits:rows.reduce((sum, row) => sum + row.pending, 0)};
}

function readinessStatus(row){
  if (row.pending === 0 && row.record?.status === 'Received') return ['Complete','strong'];
  if (row.blocker) return ['Launch Blocker','attention'];
  return ['On Track','good'];
}

function supplierIssues(){
  return deliveryRecords.filter(record => EXCEPTION_STATUSES.includes(record.status)).map(record => {
    const title = record.status === 'Incomplete'
      ? `${record.received} of ${record.expected} ${record.item} received`
      : `${record.item} ${record.status.toLowerCase()}`;
    const status = record.status !== 'Incomplete' || isMandatory(record) ? 'Open' : 'Monitoring';
    return {record, id:record.issueId || record.id, title, status};
  });
}

function lastUpdated(){
  const times = deliveryRecords.map(record => record.updatedAt?.toDate?.()).filter(Boolean);
  if (!times.length) return {time:'10:42', day:'Today'};
  const latest = new Date(Math.max(...times));
  return {time:latest.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}), day:latest.toLocaleDateString('en-US',{month:'short',day:'numeric'})};
}

function deliveriesTemplate(){
  const scheduled = deliveryRecords.filter(record => record.status === 'Scheduled').length;
  const inTransit = deliveryRecords.filter(record => record.status === 'In Transit').length;
  const exceptions = deliveryRecords.filter(record => EXCEPTION_STATUSES.includes(record.status)).length;
  const completed = deliveryRecords.filter(record => record.status === 'Received').length;
  return `<div class="welcome-row"><div><p class="eyebrow">PULILAN DELIVERY TRACKING</p><h1>Deliveries</h1><p>Compare expected quantities against what was actually received for the Pulilan opening.</p></div><button class="primary-btn compact new-delivery">+ Schedule Delivery</button></div>
  <div class="stats-grid">
    <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="calendar-days"></i></div><div><span>Scheduled</span><strong>${scheduled}</strong><small>Awaiting dispatch or arrival</small></div></article>
    <article class="stat-card"><div class="stat-icon red"><i data-lucide="truck"></i></div><div><span>In Transit</span><strong>${inTransit}</strong><small>Track supplier arrival</small></div></article>
    <article class="stat-card"><div class="stat-icon orange"><i data-lucide="clock-alert"></i></div><div><span>Exceptions</span><strong>${exceptions}</strong><small>Incomplete, delayed, or damaged</small></div></article>
    <article class="stat-card"><div class="stat-icon green"><i data-lucide="package-check"></i></div><div><span>Completed</span><strong>${completed}</strong><small>Verified Pulilan deliveries</small></div></article>
  </div>
  <section class="panel"><div class="panel-heading"><div><h2>Pulilan Delivery Schedule</h2><p>Updates are saved to Firebase and refresh every supply section</p></div></div><div class="table-wrap"><table><thead><tr><th>Delivery</th><th>Branch</th><th>Supplier</th><th>Schedule</th><th>Status</th><th></th></tr></thead><tbody id="deliveryRows">
    ${deliveryRecords.map(record => `<tr data-search="${escapeHtml(`${record.item} ${record.branch} ${record.supplier} ${record.status}`)}"><td><strong>${escapeHtml(record.item)} × ${record.expected}</strong><span>${escapeHtml(record.id)} • ${record.received} of ${record.expected} received</span></td><td>${escapeHtml(record.branch)}</td><td>${escapeHtml(record.supplier)}</td><td>${escapeHtml(record.schedule)}</td><td><span class="table-status ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td><button class="review-btn edit-delivery" data-id="${escapeHtml(record.id)}">${record.status === 'Received' ? 'View / Update' : 'Update'}</button></td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function readinessTemplate(){
  const state = launchState();
  const blocker = state.blockers[0];
  return `<div class="welcome-row"><div><p class="eyebrow">PRE-OPENING CONTROL</p><h1>Supply Readiness</h1><p>Verify Pulilan equipment, inventory, fixtures, and supplies before opening.</p></div><button class="primary-btn compact confirm-ready">Confirm Selected Branch</button></div>
  <div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Overall</span><strong>${state.overall}%</strong><small>${state.posComplete ? 'Full supply readiness' : 'Conditional supply readiness'}</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="triangle-alert"></i></div><div><span>Launch Blocker</span><strong>${state.blockers.length}</strong><small>${blocker ? `${escapeHtml(blocker.label)} shortage` : 'No mandatory shortage'}</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="package-minus"></i></div><div><span>Missing Units</span><strong>${state.pos.pending}</strong><small>Of ${state.pos.required} required terminals</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="calendar-clock"></i></div><div><span>Opening</span><strong>Aug 1</strong><small>Pulilan, Bulacan</small></div></article></div>
  <section class="panel"><div class="panel-heading"><div><h2>Pulilan Supply Readiness Checklist</h2><p>${state.posComplete ? 'All mandatory opening requirements are verified' : 'The POS exception remains visible despite high overall completion'}</p></div></div><div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Required</th><th>Available</th><th>Pending</th><th>Readiness</th><th>Status</th></tr></thead><tbody>
    ${state.rows.map(row => { const [label, tone] = readinessStatus(row); return `<tr data-search="${escapeHtml(`Pulilan ${row.label} ${label}`)}"><td><strong>${escapeHtml(row.label)}</strong><span>${escapeHtml(row.detail)}</span></td><td>${row.required}</td><td>${row.available}</td><td>${row.pending}</td><td>${row.percent}%</td><td><span class="status ${tone}">${label}</span></td></tr>`; }).join('')}
  </tbody></table></div></section>`;
}

function receivingTemplate(){
  return `<div class="welcome-row"><div><p class="eyebrow">GOODS RECEIPT</p><h1>Receiving</h1><p>Separate physical arrival from quantity and condition verification.</p></div><button class="primary-btn compact receive-btn">+ Record Receipt</button></div><section class="panel"><div class="panel-heading"><div><h2>Pulilan Receipts</h2><p>Select a shipment to record its verified quantity</p></div></div><div class="table-wrap"><table><thead><tr><th>Delivery</th><th>Branch</th><th>Expected Qty</th><th>Received Qty</th><th>Verification</th><th></th></tr></thead><tbody>${deliveryRecords.map(record => `<tr data-search="${escapeHtml(`${record.item} ${record.branch} ${record.status}`)}"><td><strong>${escapeHtml(record.item)}</strong><span>${escapeHtml(record.id)}</span></td><td>${escapeHtml(record.branch)}</td><td>${record.expected}</td><td>${record.received}</td><td><span class="table-status ${statusClass(record.status)}">${record.received === record.expected && record.status === 'Received' ? 'Verified' : escapeHtml(record.status)}</span></td><td><button class="review-btn edit-delivery" data-id="${escapeHtml(record.id)}">${record.received ? 'Update Receipt' : 'Receive'}</button></td></tr>`).join('')}</tbody></table></div></section>`;
}

function inventoryTemplate(){
  const state = launchState();
  const updated = lastUpdated();
  return `<div class="welcome-row"><div><p class="eyebrow">STOCK CONTROL</p><h1>Inventory</h1><p>Show required, available, and pending quantities for the Pulilan launch.</p></div><button class="primary-btn compact inventory-update">+ Update Stock</button></div><div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="boxes"></i></div><div><span>Available</span><strong>1,284</strong><small>Pulilan launch inventory</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="package-open"></i></div><div><span>Pending</span><strong>${state.pendingUnits}</strong><small>${state.rows.filter(row => row.pending).map(row => `${row.pending} ${row.inventoryLabel.toLowerCase()}`).join(' and ') || 'Nothing pending'}</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="package-minus"></i></div><div><span>Shortages</span><strong>${state.pos.pending}</strong><small>Visible until verified</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="refresh-cw"></i></div><div><span>Last Updated</span><strong>${escapeHtml(updated.time)}</strong><small>${escapeHtml(updated.day)}</small></div></article></div><section class="panel"><div class="panel-heading"><div><h2>Pulilan Inventory Availability</h2><p>Current stock compared with required opening quantities</p></div></div><div class="table-wrap"><table><thead><tr><th>Item</th><th>Required</th><th>Available</th><th>Pending</th><th>Variance</th><th>Status</th></tr></thead><tbody>
    ${[...state.rows].sort((left, right) => Number(Boolean(right.blocker)) - Number(Boolean(left.blocker))).map(row => { const [label, tone] = readinessStatus(row); const inventoryLabel = label === 'Launch Blocker' ? 'Shortage' : label; return `<tr data-search="${escapeHtml(`${row.inventoryLabel} Pulilan ${inventoryLabel}`)}"><td><strong>${escapeHtml(row.inventoryLabel)}</strong><span>${escapeHtml(row.inventoryDetail)}</span></td><td>${row.required}</td><td>${row.available}</td><td>${row.pending}</td><td>${row.available - row.required}</td><td><span class="status ${tone}">${inventoryLabel}</span></td></tr>`; }).join('')}
  </tbody></table></div></section>`;
}

function issuesTemplate(){
  const issues = supplierIssues();
  const open = issues.filter(issue => issue.status === 'Open');
  const banner = open.length
    ? `<div class="alert-banner"><div class="alert-icon"><i data-lucide="triangle-alert"></i></div><div><strong>${open.length} open supplier ${open.length === 1 ? 'issue blocks' : 'issues block'} full opening clearance</strong><span>${open.map(issue => `${escapeHtml(issue.record.item)} — ${escapeHtml(issue.record.supplier)}`).join('; ')}</span></div></div>`
    : '';
  const rows = issues.length
    ? issues.map(issue => `<tr data-search="${escapeHtml(`${issue.title} ${issue.record.supplier} ${issue.record.branch} ${issue.status}`)}"><td><strong>${escapeHtml(issue.title)}</strong><span>${escapeHtml(issue.id)}</span></td><td>${escapeHtml(issue.record.supplier)}</td><td>${escapeHtml(issue.record.branch)}</td><td>${escapeHtml(issue.record.note || 'No corrective action recorded')}</td><td>${escapeHtml(formatDate(issue.record.date))}</td><td><span class="table-status ${issue.status === 'Open' ? 'action' : 'investigating'}">${issue.status}</span></td><td><button class="review-btn edit-delivery" data-id="${escapeHtml(issue.record.id)}">Update</button></td></tr>`).join('')
    : '<tr><td colspan="7">No open supplier issues. Every delivery is scheduled, in transit, or received.</td></tr>';
  return `<div class="welcome-row"><div><p class="eyebrow">SUPPLIER EXCEPTIONS</p><h1>Supplier Issues</h1><p>Document incomplete Pulilan deliveries and their corrective actions.</p></div><button class="primary-btn compact issue-btn">+ Report Issue</button></div>${banner}<section class="panel"><div class="panel-heading"><div><h2>Issue & Corrective Action Log</h2><p>Incomplete, delayed, or damaged deliveries; resolved when marked Received</p></div></div><div class="table-wrap"><table><thead><tr><th>Issue</th><th>Supplier</th><th>Branch</th><th>Corrective Action</th><th>Revised Date</th><th>Status</th><th></th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function launchTemplate(){
  const state = launchState();
  const kitchen = state.rows.find(row => row.key === 'kitchen');
  const inventory = state.rows.find(row => row.key === 'inventory');
  const pos = state.pos;
  const subject = state.posComplete ? 'Full Supply Readiness — Pulilan, Bulacan' : 'Conditional Supply Readiness — Pulilan, Bulacan';
  const message = state.posComplete
    ? `Pulilan is fully supply-ready. All ${pos.required} mandatory POS terminals were received and verified.`
    : `Pulilan is ${state.overall}% supply-ready. ${pos.available} of ${pos.required} mandatory POS terminals were received. Full supply readiness will be confirmed after the remaining ${pos.pending} units are delivered and verified.`;
  const confirmed = launchConfirmation
    ? `<p class="launch-confirmed-note"><strong>Last confirmed:</strong> ${escapeHtml(launchConfirmation.confirmedByName || launchConfirmation.updatedBy)} • ${escapeHtml(formatWhen(launchConfirmation.updatedAt))}</p>`
    : '';
  const dependency = state.posComplete
    ? `<div class="launch-dependency-card"><div class="launch-dependency-icon"><i data-lucide="shield-check"></i></div><div class="launch-dependency-content"><span>MANDATORY LAUNCH DEPENDENCY</span><strong>All ${pos.required} POS terminals verified</strong><p>The POS dependency is cleared. Confirm the checklist to notify the Store Manager.</p><div class="launch-pos-progress"><div><span>POS fulfillment</span><strong>${pos.available} of ${pos.required} received</strong></div><div class="capacity-bar"><span style="width:100%"></span></div><small>100% complete</small></div></div></div>`
    : `<div class="launch-dependency-card"><div class="launch-dependency-icon"><i data-lucide="shield-alert"></i></div><div class="launch-dependency-content"><span>MANDATORY LAUNCH DEPENDENCY</span><strong>${pos.pending} POS terminals are still missing</strong><p>Pulilan remains under Conditional Clearance until all ${pos.required} terminals arrive and their quantities and condition are verified.</p><div class="launch-pos-progress"><div><span>POS fulfillment</span><strong>${pos.available} of ${pos.required} received</strong></div><div class="capacity-bar"><span style="width:${pos.percent}%"></span></div><small>${pos.percent}% complete • ${pos.pending} units pending from ${escapeHtml(pos.record?.supplier || 'the supplier')}</small></div></div></div>`;
  return `<div class="welcome-row"><div><p class="eyebrow">FINAL SUPPLY APPROVAL</p><h1>Launch Confirmation</h1><p>Verify the final supply controls and communicate their impact on the Pulilan opening decision.</p></div></div>
  <div class="settings-grid launch-confirmation-grid">
    <section class="panel launch-checklist-panel">
      <div class="panel-heading"><div><h2>Pulilan, Bulacan</h2><p>Proposed opening August 1, 2026</p></div><span class="status ${state.posComplete ? 'strong' : 'good'}">${state.overall}% ${state.posComplete ? 'Ready' : 'Conditional'}</span></div>
      <div class="settings-form toggles launch-checklist">
        <label><input type="checkbox" ${kitchen.pending === 0 ? 'checked' : ''}><span><strong>Major equipment received and tested</strong><small>${kitchen.available} of ${kitchen.required} kitchen units verified</small></span></label>
        <label class="${state.posComplete ? '' : 'supply-check-blocked'}"><input type="checkbox" ${state.posComplete ? 'checked' : ''}><span><strong>All ${pos.required} POS terminals received and verified</strong><small>${state.posComplete ? 'Quantity and condition verified' : `Only ${pos.available} units are currently available`}</small></span>${state.posComplete ? '' : '<em>BLOCKER</em>'}</label>
        <label><input type="checkbox" ${inventory.percent >= 90 ? 'checked' : ''}><span><strong>Opening inventory substantially verified</strong><small>${inventory.pending ? `${inventory.pending} remaining items are scheduled` : 'All opening inventory verified'}</small></span></label>
        <label><input type="checkbox" checked><span><strong>Packaging and smallwares on track</strong><small>No mandatory shortage recorded</small></span></label>
        ${dependency}
        <button class="primary-btn compact launch-confirm">Confirm Supply Readiness & Notify Store Manager</button>
        ${confirmed}
      </div>
    </section>
    <section class="panel launch-notification-panel">
      <div class="panel-heading"><div><h2>Notification Preview</h2><p>Shared dependency shown to the Store Manager</p></div><span class="status ${state.posComplete ? 'strong' : 'attention'}">${state.posComplete ? 'Ready to Send' : 'Action Required'}</span></div>
      <div class="settings-form launch-message-form"><label>Recipient</label><input value="Ruth Torres — Store Manager" disabled><label>Subject</label><input id="launchSubject" value="${escapeHtml(subject)}" maxlength="160"><label>Message</label><textarea id="launchMessage" class="launch-message-preview" maxlength="1000">${escapeHtml(message)}</textarea><div class="launch-message-impact"><i data-lucide="link-2"></i><span><strong>Opening-clearance impact</strong><small>This supply exception remains visible on the Store Manager dashboard.</small></span></div></div>
    </section>
  </div>`;
}

const sections = {
  readiness: readinessTemplate,
  deliveries: deliveriesTemplate,
  receiving: receivingTemplate,
  inventory: inventoryTemplate,
  issues: issuesTemplate,
  launch: launchTemplate,
  settings: () => `<div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Supply Chain Officer profile and alert preferences.</p></div></div><div class="settings-grid"><section class="panel"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in delivery and readiness records</p></div></div><div class="settings-form"><label>Full Name</label><input value="Joel Navarro"><label>Role</label><input value="Supply Chain Officer" disabled><label>Assigned Launch</label><input value="Pulilan, Bulacan" disabled><label>Email Address</label><input value="joel.navarro@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel"><div class="panel-heading"><div><h2>Notifications</h2><p>Select operational alerts</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> Delivery delay alerts</label><label><input type="checkbox" checked> Damaged or incomplete shipment alerts</label><label><input type="checkbox" checked> Launch readiness deadline reminders</label><label><input type="checkbox"> Daily inventory summary</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`
};

function render(section = activeSection, {scroll = true} = {}){
  activeSection = section;
  page.innerHTML = section === 'overview' ? overview : sections[section]();
  page.dataset.currentSection = section;
  if (section === 'settings') applySettingsForm(page, savedSettings);
  icons();
  applySearch(document.getElementById('globalSearch').value);
  if (scroll) window.scrollTo({top:0,behavior:'smooth'});
}

function updateBadges(){
  const deliveriesBadge = document.querySelector('.nav-item[data-section="deliveries"] em');
  const issuesBadge = document.querySelector('.nav-item[data-section="issues"] em');
  if (deliveriesBadge) deliveriesBadge.textContent = deliveryRecords.filter(record => EXCEPTION_STATUSES.includes(record.status)).length;
  if (issuesBadge) issuesBadge.textContent = supplierIssues().filter(issue => issue.status === 'Open').length;
}

/** Redraws live data without discarding unsaved typing (Settings and the launch message). */
function refreshView(){
  updateBadges();
  if (!['overview','settings','launch'].includes(activeSection)) render(activeSection, {scroll:false});
}

function openDelivery(id = null, title = 'Schedule Pulilan Delivery', defaults = {}){
  activeRecordId = id;
  const record = deliveryRecords.find(item => item.id === id) || {item:'',branch:'Pulilan, Bulacan',supplier:'',expected:4,received:0,date:'',status:'Scheduled',note:'',...defaults};
  modalTitle.textContent = id ? `Update ${id}` : title;
  document.getElementById('deliveryItem').value = record.item;
  document.getElementById('deliveryBranch').value = record.branch;
  document.getElementById('deliverySupplier').value = record.supplier;
  document.getElementById('expectedQty').value = record.expected;
  document.getElementById('receivedQty').value = record.received;
  document.getElementById('deliveryStatus').value = record.status;
  document.getElementById('revisedDate').value = record.date;
  document.getElementById('deliveryNote').value = record.note;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  setTimeout(() => document.getElementById('deliveryItem').focus(), 0);
}

function close(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); activeRecordId = null; }

function setBusy(button, busy, label = 'Saving…'){
  if (!button) return;
  if (busy){ button.dataset.label = button.textContent; button.textContent = label; }
  else if (button.dataset.label){ button.textContent = button.dataset.label; }
  button.disabled = busy;
}

function ensureConnected(){
  if (session) return true;
  show('Still connecting to Firebase. Try again in a moment.');
  return false;
}

/** Reads and validates the delivery form. */
function readDeliveryForm(){
  const field = id => document.getElementById(id).value;
  const expected = wholeNumber(field('expectedQty'), 'Expected quantity', 1, 100000);
  const received = wholeNumber(field('receivedQty'), 'Received quantity', 0, 100000);
  if (received > expected) throw new ValidationError('Received quantity cannot exceed the expected quantity. Record any surplus in the note.');
  let status = oneOf(field('deliveryStatus'), DELIVERY_STATUSES, 'Delivery status');
  if (received < expected && status === 'Received') status = 'Incomplete';
  if (received === expected && status === 'Incomplete') status = 'Received';
  const date = isoDate(field('revisedDate'), 'Revised delivery date', {required:false});
  const note = optionalText(field('deliveryNote'), 'Condition / corrective action');
  if (['Delayed','Damaged'].includes(status) && !note) throw new ValidationError(`Describe the corrective action for a ${status.toLowerCase()} delivery.`);
  return {
    item:requiredText(field('deliveryItem'), 'Delivery item', 80),
    branch:requiredText(field('deliveryBranch') || 'Pulilan, Bulacan', 'Branch', 80),
    supplier:requiredText(field('deliverySupplier'), 'Supplier', 80),
    expected, received, status, date, note
  };
}

async function saveDelivery(){
  if (!ensureConnected()) return;
  let data;
  try {
    data = readDeliveryForm();
  } catch (error){
    show(describeError(error));
    return;
  }

  const existing = deliveryRecords.find(entry => entry.id === activeRecordId);
  data.schedule = data.date ? `${existing ? 'Revised: ' : ''}${formatDate(data.date)}` : existing?.schedule || 'Schedule TBD';

  setBusy(saveButton, true);
  try {
    const savedId = existing
      ? (await saveRecord('supplyDeliveries', existing.id, data, session), existing.id)
      : await createWithSequence('supplyDeliveries', {counter:'supplyDeliveries', start:highestNumber(deliveryRecords, /^DEL-2026-(\d+)$/) + 1, format:n => `DEL-2026-${String(n).padStart(4,'0')}`}, data, session);
    close();
    if (!['deliveries','receiving','issues','inventory','readiness'].includes(activeSection)) render('deliveries');
    show(`${savedId} saved — ${data.received} of ${data.expected} received.`);
  } catch (error){
    console.error('Could not save delivery:', error);
    show(describeError(error, 'save this delivery'));
  } finally {
    setBusy(saveButton, false);
  }
}

async function confirmLaunch(button){
  if (!ensureConnected()) return;
  const state = launchState();
  const allChecked = [...page.querySelectorAll('.launch-checklist input[type="checkbox"]')].every(input => input.checked);
  if (!state.posComplete){
    show(`Cannot confirm full readiness: verify the ${state.pos.pending || 'remaining'} missing POS terminals first.`);
    return;
  }
  if (!allChecked){
    show('Tick every checklist item before confirming supply readiness.');
    return;
  }
  let subject, message;
  try {
    subject = requiredText(document.getElementById('launchSubject')?.value, 'Subject', 160);
    message = requiredText(document.getElementById('launchMessage')?.value, 'Message', 1000);
  } catch (error){
    show(describeError(error));
    return;
  }

  setBusy(button, true);
  try {
    await saveRecord('supplyLaunchConfirmations', LAUNCH_DOC, {
      branch:'Pulilan, Bulacan',
      status:'Full Supply Readiness',
      readiness:state.overall,
      recipient:'Ruth Torres — Store Manager',
      subject, message,
      confirmedByName:session.name
    }, session);
    show('Full supply readiness confirmed and Store Manager notification recorded.');
  } catch (error){
    console.error('Could not confirm launch readiness:', error);
    show(describeError(error, 'confirm supply readiness'));
  } finally {
    setBusy(button, false);
  }
}

async function saveSettingsSection(button){
  if (!ensureConnected()) return;
  setBusy(button, true);
  try {
    const settings = readSettingsForm(page);
    await saveSettings(session, settings);
    savedSettings = settings;
    show('Settings saved.');
  } catch (error){
    if (!(error instanceof ValidationError)) console.error('Could not save settings:', error);
    show(describeError(error, 'save your settings'));
  } finally {
    setBusy(button, false);
  }
}

function applySearch(value){
  const query = value.trim().toLowerCase();
  document.querySelectorAll('[data-search]').forEach(item => item.classList.toggle('hidden-by-search', Boolean(query) && !item.dataset.search.toLowerCase().includes(query)));
}

document.getElementById('menuBtn').addEventListener('click',() => sidebar.classList.toggle('open'));
document.querySelectorAll('.nav-item[data-section]').forEach(nav => nav.addEventListener('click',() => {
  document.querySelectorAll('.nav-item[data-section]').forEach(item => item.classList.remove('active'));
  nav.classList.add('active');
  sidebar.classList.remove('open');
  render(nav.dataset.section);
}));

document.addEventListener('click',event => {
  const jump = event.target.closest('[data-open-section]');
  if (jump){ document.querySelector(`[data-section="${jump.dataset.openSection}"]`)?.click(); return; }
  const edit = event.target.closest('.edit-delivery');
  if (edit){ openDelivery(edit.dataset.id); return; }
  if (event.target.closest('.new-delivery')){ openDelivery(); return; }
  if (event.target.closest('.receive-btn')){ openDelivery(null,'Record Pulilan Receipt',{status:'Received'}); return; }
  if (event.target.closest('.issue-btn')){ openDelivery(null,'Report Supplier Issue',{status:'Incomplete'}); return; }
  if (event.target.closest('.inventory-update')){ openDelivery(launchRecord(LAUNCH_ITEMS[2])?.id || null,'Update Pulilan Inventory'); return; }
  if (event.target.closest('.confirm-ready')){
    const state = launchState();
    show(state.posComplete ? `Pulilan is ${state.overall}% supply-ready with no mandatory shortage. Confirm it under Launch Confirmation.` : `Pulilan remains conditionally ready: ${state.pos.pending} mandatory POS terminals are still missing.`);
    return;
  }
  const launch = event.target.closest('.launch-confirm');
  if (launch){ confirmLaunch(launch); return; }
  const settingsButton = event.target.closest('.save-settings');
  if (settingsButton) saveSettingsSection(settingsButton);
});

document.getElementById('closeModal').addEventListener('click',close);
document.getElementById('cancelModal').addEventListener('click',close);
saveButton.addEventListener('click',saveDelivery);
modal.addEventListener('click',event => { if (event.target === modal) close(); });
document.addEventListener('keydown',event => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
document.getElementById('globalSearch').addEventListener('input',event => applySearch(event.target.value));
// Fallback only: once requireRole() resolves, role-backend.js handles logout and also ends the Firebase session.
document.getElementById('logoutBtn').addEventListener('click',() => { localStorage.clear(); location.href = 'index.html'; });
icons();

async function connectBackend(){
  session = await requireRole('Supply Chain Officer');
  loadSettings(session).then(settings => { savedSettings = settings; if (activeSection === 'settings') render('settings', {scroll:false}); })
    .catch(error => console.error('Could not load settings:', error));

  watchCollection('supplyDeliveries', deliverySeed, records => {
    deliveryRecords.splice(0, deliveryRecords.length, ...records);
    refreshView();
  }, error => {
    console.error('Firestore supplyDeliveries listener failed:', error);
    show(describeError(error, 'load delivery records'));
  });

  watchCollection('supplyLaunchConfirmations', [], records => {
    launchConfirmation = records.find(record => record.id === LAUNCH_DOC) || null;
    if (activeSection === 'launch') render('launch', {scroll:false});
  }, error => console.error('Firestore supplyLaunchConfirmations listener failed:', error));
}

connectBackend().catch(error => {
  console.error('Could not connect the Supply Chain dashboard to Firebase:', error);
  show('Could not connect to Firebase. Changes will not be saved.');
});
