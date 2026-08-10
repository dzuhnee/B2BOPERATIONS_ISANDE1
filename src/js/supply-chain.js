const sidebar = document.getElementById('sidebar');
const page = document.querySelector('.page-content');
const overview = page.innerHTML;
const modal = document.getElementById('deliveryModal');
const modalTitle = document.getElementById('modalTitle');
const toast = document.getElementById('toast');

const deliveryRecords = [
  {id:'DEL-2026-0731',item:'POS Terminals',branch:'Pulilan, Bulacan',supplier:'TechPro Systems',expected:4,received:2,schedule:'Revised: July 24',date:'2026-07-24',status:'Incomplete',note:'Two terminals are missing. TechPro confirmed an expedited corrective delivery.'},
  {id:'DEL-2026-0734',item:'Kitchen Equipment Package',branch:'Pulilan, Bulacan',supplier:'EquipServe PH',expected:14,received:14,schedule:'Received July 20',date:'2026-07-20',status:'Received',note:'All units verified in good condition.'},
  {id:'DEL-2026-0725',item:'Opening Inventory Batch B',branch:'Pulilan, Bulacan',supplier:'FoodHub Distribution',expected:100,received:94,schedule:'July 22',date:'2026-07-22',status:'Incomplete',note:'Six packaging items remain pending.'},
  {id:'DEL-2026-0735',item:'Packaging & Consumables',branch:'Pulilan, Bulacan',supplier:'PackRight PH',expected:86,received:0,schedule:'July 23',date:'2026-07-23',status:'Scheduled',note:'Arrival window is 3:00–5:00 PM.'}
];

let activeRecordId = null;
let activeSection = 'overview';

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const statusClass = status => ({Received:'monitoring',Complete:'monitoring',Scheduled:'investigating','In Transit':'investigating',Incomplete:'investigating',Delayed:'action',Damaged:'action',Open:'action'}[status] || 'investigating');
const icons = () => { if (window.lucide) lucide.createIcons(); };
const show = message => { toast.querySelector('span').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); };
const formatDate = value => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-US',{month:'long',day:'numeric'}) : 'Schedule TBD';

function deliveriesTemplate(){
  const scheduled = deliveryRecords.filter(record => record.status === 'Scheduled').length;
  const inTransit = deliveryRecords.filter(record => record.status === 'In Transit').length;
  const exceptions = deliveryRecords.filter(record => ['Incomplete','Delayed','Damaged'].includes(record.status)).length;
  const completed = deliveryRecords.filter(record => record.status === 'Received').length;
  return `<div class="welcome-row"><div><p class="eyebrow">PULILAN DELIVERY TRACKING</p><h1>Deliveries</h1><p>Compare expected quantities against what was actually received for the Pulilan opening.</p></div><button class="primary-btn compact new-delivery">+ Schedule Delivery</button></div>
  <div class="stats-grid">
    <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="calendar-days"></i></div><div><span>Scheduled</span><strong>${scheduled}</strong><small>Awaiting dispatch or arrival</small></div></article>
    <article class="stat-card"><div class="stat-icon red"><i data-lucide="truck"></i></div><div><span>In Transit</span><strong>${inTransit}</strong><small>Track supplier arrival</small></div></article>
    <article class="stat-card"><div class="stat-icon orange"><i data-lucide="clock-alert"></i></div><div><span>Exceptions</span><strong>${exceptions}</strong><small>Incomplete, delayed, or damaged</small></div></article>
    <article class="stat-card"><div class="stat-icon green"><i data-lucide="package-check"></i></div><div><span>Completed</span><strong>${completed}</strong><small>Verified Pulilan deliveries</small></div></article>
  </div>
  <section class="panel"><div class="panel-heading"><div><h2>Pulilan Delivery Schedule</h2><p>Update any row and the expected-versus-received result will refresh immediately</p></div></div><div class="table-wrap"><table><thead><tr><th>Delivery</th><th>Branch</th><th>Supplier</th><th>Schedule</th><th>Status</th><th></th></tr></thead><tbody id="deliveryRows">
    ${deliveryRecords.map(record => `<tr data-search="${escapeHtml(`${record.item} ${record.branch} ${record.supplier} ${record.status}`)}"><td><strong>${escapeHtml(record.item)} × ${record.expected}</strong><span>${record.id} • ${record.received} of ${record.expected} received</span></td><td>${escapeHtml(record.branch)}</td><td>${escapeHtml(record.supplier)}</td><td>${escapeHtml(record.schedule)}</td><td><span class="table-status ${statusClass(record.status)}">${escapeHtml(record.status)}</span></td><td><button class="review-btn edit-delivery" data-id="${record.id}">${record.status === 'Received' ? 'View / Update' : 'Update'}</button></td></tr>`).join('')}
  </tbody></table></div></section>`;
}

const sections = {
  readiness: () => `<div class="welcome-row"><div><p class="eyebrow">PRE-OPENING CONTROL</p><h1>Supply Readiness</h1><p>Verify Pulilan equipment, inventory, fixtures, and supplies before opening.</p></div><button class="primary-btn compact confirm-ready">Confirm Selected Branch</button></div>
  <div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Overall</span><strong>92%</strong><small>Conditional supply readiness</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="triangle-alert"></i></div><div><span>Launch Blocker</span><strong>1</strong><small>POS terminal shortage</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="package-minus"></i></div><div><span>Missing Units</span><strong>2</strong><small>Of 4 required terminals</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="calendar-clock"></i></div><div><span>Opening</span><strong>Aug 1</strong><small>Pulilan, Bulacan</small></div></article></div>
  <section class="panel"><div class="panel-heading"><div><h2>Pulilan Supply Readiness Checklist</h2><p>The POS exception remains visible despite high overall completion</p></div></div><div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Required</th><th>Available</th><th>Pending</th><th>Readiness</th><th>Status</th></tr></thead><tbody><tr data-search="Pulilan kitchen equipment complete"><td><strong>Kitchen Equipment</strong><span>Pulilan, Bulacan</span></td><td>14</td><td>14</td><td>0</td><td>100%</td><td><span class="status strong">Complete</span></td></tr><tr data-search="Pulilan POS terminals blocker"><td><strong>POS Terminals</strong><span>Mandatory opening requirement</span></td><td>4</td><td>2</td><td>2</td><td>50%</td><td><span class="status attention">Launch Blocker</span></td></tr><tr data-search="Pulilan inventory on track"><td><strong>Opening Inventory</strong><span>Food and packaging supplies</span></td><td>100</td><td>94</td><td>6</td><td>94%</td><td><span class="status good">On Track</span></td></tr></tbody></table></div></section>`,

  deliveries: deliveriesTemplate,

  receiving: () => `<div class="welcome-row"><div><p class="eyebrow">GOODS RECEIPT</p><h1>Receiving</h1><p>Separate physical arrival from quantity and condition verification.</p></div><button class="primary-btn compact receive-btn">+ Record Receipt</button></div><section class="panel"><div class="panel-heading"><div><h2>Pulilan Receipts</h2><p>Select a shipment to record its verified quantity</p></div></div><div class="table-wrap"><table><thead><tr><th>Delivery</th><th>Branch</th><th>Expected Qty</th><th>Received Qty</th><th>Verification</th><th></th></tr></thead><tbody>${deliveryRecords.map(record => `<tr data-search="${escapeHtml(`${record.item} Pulilan ${record.status}`)}"><td><strong>${escapeHtml(record.item)}</strong><span>${record.id}</span></td><td>Pulilan, Bulacan</td><td>${record.expected}</td><td>${record.received}</td><td><span class="table-status ${statusClass(record.status)}">${record.received === record.expected ? 'Verified' : record.status}</span></td><td><button class="review-btn edit-delivery" data-id="${record.id}">${record.received ? 'Update Receipt' : 'Receive'}</button></td></tr>`).join('')}</tbody></table></div></section>`,

  inventory: () => `<div class="welcome-row"><div><p class="eyebrow">STOCK CONTROL</p><h1>Inventory</h1><p>Show required, available, and pending quantities for the Pulilan launch.</p></div><button class="primary-btn compact inventory-update">+ Update Stock</button></div><div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="boxes"></i></div><div><span>Available</span><strong>1,284</strong><small>Pulilan launch inventory</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="package-open"></i></div><div><span>Pending</span><strong>8</strong><small>2 POS and 6 packaging units</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="package-minus"></i></div><div><span>Shortages</span><strong>2</strong><small>Visible until verified</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="refresh-cw"></i></div><div><span>Last Updated</span><strong>10:42</strong><small>Today</small></div></article></div><section class="panel"><div class="panel-heading"><div><h2>Pulilan Inventory Availability</h2><p>Current stock compared with required opening quantities</p></div></div><div class="table-wrap"><table><thead><tr><th>Item</th><th>Required</th><th>Available</th><th>Pending</th><th>Variance</th><th>Status</th></tr></thead><tbody><tr data-search="POS terminals Pulilan shortage"><td><strong>POS Terminals</strong><span>Mandatory equipment</span></td><td>4</td><td>2</td><td>2</td><td>-2</td><td><span class="status attention">Shortage</span></td></tr><tr data-search="Packaging Pulilan pending"><td><strong>Packaging Materials</strong><span>Opening inventory</span></td><td>100</td><td>94</td><td>6</td><td>0</td><td><span class="status good">On Track</span></td></tr><tr data-search="Kitchen Pulilan complete"><td><strong>Kitchen Equipment</strong><span>Installed and verified</span></td><td>14</td><td>14</td><td>0</td><td>0</td><td><span class="status strong">Complete</span></td></tr></tbody></table></div></section>`,

  issues: () => `<div class="welcome-row"><div><p class="eyebrow">SUPPLIER EXCEPTIONS</p><h1>Supplier Issues</h1><p>Document incomplete Pulilan deliveries and their corrective actions.</p></div><button class="primary-btn compact issue-btn">+ Report Issue</button></div><div class="alert-banner"><div class="alert-icon"><i data-lucide="triangle-alert"></i></div><div><strong>POS short shipment blocks full opening clearance</strong><span>Two missing terminals remain assigned to TechPro Systems for corrective delivery.</span></div></div><section class="panel"><div class="panel-heading"><div><h2>Issue & Corrective Action Log</h2><p>Supplier contact, revised schedule, and current resolution status</p></div></div><div class="table-wrap"><table><thead><tr><th>Issue</th><th>Supplier</th><th>Branch</th><th>Corrective Action</th><th>Revised Date</th><th>Status</th><th></th></tr></thead><tbody><tr data-search="POS incomplete TechPro Pulilan"><td><strong>2 of 4 POS terminals received</strong><span>ISS-2026-017</span></td><td>TechPro Systems</td><td>Pulilan, Bulacan</td><td>Expedited delivery of 2 missing units</td><td>July 24</td><td><span class="table-status action">Open</span></td><td><button class="review-btn edit-delivery" data-id="DEL-2026-0731">Update</button></td></tr><tr data-search="Packaging incomplete FoodHub Pulilan"><td><strong>6 packaging units pending</strong><span>ISS-2026-018</span></td><td>FoodHub Distribution</td><td>Pulilan, Bulacan</td><td>Include units in next scheduled run</td><td>July 22</td><td><span class="table-status investigating">Monitoring</span></td><td><button class="review-btn edit-delivery" data-id="DEL-2026-0725">Update</button></td></tr></tbody></table></div></section>`,

  launch: () => `<div class="welcome-row"><div><p class="eyebrow">FINAL SUPPLY APPROVAL</p><h1>Launch Confirmation</h1><p>Verify the final supply controls and communicate their impact on the Pulilan opening decision.</p></div></div>
  <div class="settings-grid launch-confirmation-grid">
    <section class="panel launch-checklist-panel">
      <div class="panel-heading"><div><h2>Pulilan, Bulacan</h2><p>Proposed opening August 1, 2026</p></div><span class="status good">92% Conditional</span></div>
      <div class="settings-form toggles launch-checklist">
        <label><input type="checkbox" checked><span><strong>Major equipment received and tested</strong><small>Kitchen and facility equipment verified</small></span></label>
        <label class="supply-check-blocked"><input type="checkbox"><span><strong>All 4 POS terminals received and verified</strong><small>Only 2 units are currently available</small></span><em>BLOCKER</em></label>
        <label><input type="checkbox" checked><span><strong>Opening inventory substantially verified</strong><small>Remaining packaging items are scheduled</small></span></label>
        <label><input type="checkbox" checked><span><strong>Packaging and smallwares on track</strong><small>No mandatory shortage recorded</small></span></label>
        <div class="launch-dependency-card">
          <div class="launch-dependency-icon"><i data-lucide="shield-alert"></i></div>
          <div class="launch-dependency-content">
            <span>MANDATORY LAUNCH DEPENDENCY</span>
            <strong>2 POS terminals are still missing</strong>
            <p>Pulilan remains under Conditional Clearance until all four terminals arrive and their quantities and condition are verified.</p>
            <div class="launch-pos-progress"><div><span>POS fulfillment</span><strong>2 of 4 received</strong></div><div class="capacity-bar"><span style="width:50%"></span></div><small>50% complete • 2 units pending from TechPro Systems</small></div>
          </div>
        </div>
        <button class="primary-btn compact launch-confirm">Confirm Supply Readiness & Notify Store Manager</button>
      </div>
    </section>
    <section class="panel launch-notification-panel">
      <div class="panel-heading"><div><h2>Notification Preview</h2><p>Shared dependency shown to the Store Manager</p></div><span class="status attention">Action Required</span></div>
      <div class="settings-form launch-message-form"><label>Recipient</label><input value="Ruth Torres — Store Manager" disabled><label>Subject</label><input value="Conditional Supply Readiness — Pulilan, Bulacan"><label>Message</label><textarea class="launch-message-preview">Pulilan is 92% supply-ready. Two of four mandatory POS terminals were received. Full supply readiness will be confirmed after the remaining two units are delivered and verified.</textarea><div class="launch-message-impact"><i data-lucide="link-2"></i><span><strong>Opening-clearance impact</strong><small>This supply exception remains visible on the Store Manager dashboard.</small></span></div></div>
    </section>
  </div>`,

  settings: () => `<div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Supply Chain Officer profile and alert preferences.</p></div></div><div class="settings-grid"><section class="panel"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in delivery and readiness records</p></div></div><div class="settings-form"><label>Full Name</label><input value="Lara Mendoza"><label>Role</label><input value="Supply Chain Officer" disabled><label>Assigned Launch</label><input value="Pulilan, Bulacan" disabled><label>Email Address</label><input value="lara.mendoza@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel"><div class="panel-heading"><div><h2>Notifications</h2><p>Select operational alerts</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> Delivery delay alerts</label><label><input type="checkbox" checked> Damaged or incomplete shipment alerts</label><label><input type="checkbox" checked> Launch readiness deadline reminders</label><label><input type="checkbox"> Daily inventory summary</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`
};

function render(section = activeSection){
  activeSection = section;
  page.innerHTML = section === 'overview' ? overview : sections[section]();
  page.dataset.currentSection = section;
  icons();
  applySearch(document.getElementById('globalSearch').value);
  window.scrollTo({top:0,behavior:'smooth'});
}

function openDelivery(id = null, title = 'Schedule Pulilan Delivery'){
  activeRecordId = id;
  const record = deliveryRecords.find(item => item.id === id) || {item:'',branch:'Pulilan, Bulacan',supplier:'',expected:4,received:0,date:'',status:'Scheduled',note:''};
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

function saveDelivery(){
  const item = document.getElementById('deliveryItem').value.trim();
  const branch = document.getElementById('deliveryBranch').value.trim() || 'Pulilan, Bulacan';
  const supplier = document.getElementById('deliverySupplier').value.trim();
  const expected = Math.max(1, Number(document.getElementById('expectedQty').value) || 1);
  const received = Math.max(0, Number(document.getElementById('receivedQty').value) || 0);
  const date = document.getElementById('revisedDate').value;
  let status = document.getElementById('deliveryStatus').value;
  const note = document.getElementById('deliveryNote').value.trim();
  if (!item || !supplier){ show('Enter the delivery item and supplier before saving.'); return; }
  if (received < expected && status === 'Received') status = 'Incomplete';
  if (received >= expected && status === 'Incomplete') status = 'Received';
  let record = deliveryRecords.find(entry => entry.id === activeRecordId);
  if (!record){
    const number = Math.max(...deliveryRecords.map(entry => Number(entry.id.split('-').pop()))) + 1;
    record = {id:`DEL-2026-${String(number).padStart(4,'0')}`};
    deliveryRecords.unshift(record);
  }
  Object.assign(record,{item,branch,supplier,expected,received,date,status,note,schedule:date ? `${activeRecordId ? 'Revised: ' : ''}${formatDate(date)}` : record.schedule || 'Schedule TBD'});
  const savedId = record.id;
  close();
  render('deliveries');
  show(`${savedId} saved — ${received} of ${expected} received.`);
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
  if (event.target.closest('.receive-btn')){ openDelivery(null,'Record Pulilan Receipt'); return; }
  if (event.target.closest('.issue-btn')){ openDelivery('DEL-2026-0731','Update Pulilan Supply Issue'); return; }
  if (event.target.closest('.inventory-update')){ openDelivery('DEL-2026-0725','Update Pulilan Inventory'); return; }
  if (event.target.closest('.confirm-ready')){ show('Pulilan remains conditionally ready: 2 mandatory POS terminals are still missing.'); return; }
  if (event.target.closest('.launch-confirm')){
    const allChecked = [...document.querySelectorAll('.settings-form.toggles input[type="checkbox"]')].every(input => input.checked);
    show(allChecked ? 'Full supply readiness confirmed and Store Manager notified.' : 'Cannot confirm full readiness: verify the 2 missing POS terminals first.');
    return;
  }
  if (event.target.closest('.save-settings')) show('Settings updated successfully.');
});

document.getElementById('closeModal').addEventListener('click',close);
document.getElementById('cancelModal').addEventListener('click',close);
document.getElementById('saveDelivery').addEventListener('click',saveDelivery);
modal.addEventListener('click',event => { if (event.target === modal) close(); });
document.getElementById('globalSearch').addEventListener('input',event => applySearch(event.target.value));
document.getElementById('logoutBtn').addEventListener('click',() => { localStorage.clear(); location.href = 'index.html'; });
icons();
