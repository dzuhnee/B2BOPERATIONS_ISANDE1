const pageContent = document.getElementById('pageContent');
const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('recordModal');
const modalTitle = document.getElementById('modalTitle');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalDescription = document.getElementById('modalDescription');
const modalBody = document.getElementById('modalBody');
const toast = document.getElementById('toast');

const readinessItems = [
  {id:1, requirement:'Equipment installation', category:'Equipment', owner:'Technical Team', mandatory:true, evidence:'Installation report', status:'Complete', remarks:'All major equipment installed and tested.'},
  {id:2, requirement:'POS installation and testing', category:'Systems', owner:'IT Team', mandatory:true, evidence:'Test confirmation', status:'In Progress', remarks:'Terminal installed; final transaction test pending.'},
  {id:3, requirement:'Facility preparation', category:'Facility', owner:'Contractor', mandatory:true, evidence:'Inspection photos', status:'Complete', remarks:'Dining, counter, utilities, and sanitation areas cleared.'},
  {id:4, requirement:'Certified crew assignment', category:'Staffing', owner:'Store Trainer', mandatory:true, evidence:'Certification roster', status:'Complete', remarks:'Required deployment-ready crew have been certified and assigned.'},
  {id:5, requirement:'Initial supply delivery confirmation', category:'Logistics', owner:'Logistics Team', mandatory:false, evidence:'Delivery receipt', status:'Complete', remarks:'Initial supplies delivered and acknowledged.'},
  {id:6, requirement:'Exterior signage installation', category:'Facility', owner:'Contractor', mandatory:false, evidence:'Completion photo', status:'Pending', remarks:'Non-mandatory installation delayed; opening clearance is not blocked.'}
];

const tasks = [
  {id:1, task:'Complete final POS transaction test', category:'Systems', owner:'IT Team', due:'Today', priority:'High', status:'In Progress'},
  {id:2, task:'Upload certified crew roster', category:'Staffing', owner:'Store Trainer', due:'Today', priority:'High', status:'Complete'},
  {id:3, task:'Install exterior branch signage', category:'Facility', owner:'Contractor', due:'Jul 22', priority:'Medium', status:'Pending'},
  {id:4, task:'Confirm utilities and internet stability', category:'Facility', owner:'Store Manager', due:'Jul 22', priority:'Medium', status:'Complete'},
  {id:5, task:'Prepare opening-day coordination brief', category:'Operations', owner:'Store Manager', due:'Jul 23', priority:'Low', status:'In Progress'}
];

const issues = [
  {id:1, title:'POS activation delayed', category:'Systems', owner:'IT Team', priority:'Critical', reported:'Jul 21, 9:10 AM', status:'In Progress', details:'Activation credentials have not yet been released.'},
  {id:2, title:'Exterior signage installation delayed', category:'Facility', owner:'Contractor', priority:'High', reported:'Jul 20, 3:30 PM', status:'Open', details:'Installer rescheduled due to material delivery delay.'},
  {id:3, title:'Air-conditioning test produced abnormal noise', category:'Equipment', owner:'Technical Team', priority:'Medium', reported:'Jul 19, 11:40 AM', status:'Resolved', details:'Loose panel was secured and the unit was retested.'}
];

const dailyOperationsReport = {
  reportId:'DOR-2026-0720-001',
  branch:'BR-001 — Pulilan, Bulacan',
  reportingDate:'2026-07-20',
  submissionTime:'08:42',
  salesStatus:'Above Target',
  salesSummary:'₱128,450.00',
  attendancePresent:18,
  attendanceScheduled:19,
  checklistComplete:'Yes',
  managerNote:'Operations remained stable. The staffing gap was resolved before the evening peak.',
  saved:false
};

const operationalLog = [
  {time:'07:00',activity:'Opening checklist and food-safety controls completed.',status:'Complete',evidence:'EV-0720-001'},
  {time:'10:30',activity:'Peak service period completed within target ticket time.',status:'Normal',evidence:'LOG-0720-003'},
  {time:'13:15',activity:'One crew member absent; reliever assigned.',status:'Resolved',evidence:'ATT-0720-001'},
  {time:'16:20',activity:'Cold-storage temperature verification completed.',status:'Compliant',evidence:'EV-0720-007'}
];

let operationalLogSaved = false;

let branchStage = 'pre-launch';
let clearanceStatus = 'Conditional Clearance';
let clearanceRemarks = 'Pulilan is 92% complete. Full opening clearance remains conditional until the remaining two POS terminals are received and activation is verified. Exterior signage is non-mandatory and continues to be monitored.';
let proposedOpeningDate = '2026-08-01';
let clearanceReviewUpdated = '';
let activeSection = 'overview';
let activeModal = null;

const icon = name => `<i data-lucide="${name}"></i>`;
const escapeStoreHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[character]));
const statusClass = status => ({Complete:'strong',Resolved:'strong',Approved:'strong','Full Clearance Requested':'good','Conditional Clearance':'attention','In Progress':'good',Pending:'attention',Open:'attention',Submitted:'good'}[status] || 'attention');
const priorityClass = priority => ({Critical:'high',High:'high',Medium:'medium',Low:'low'}[priority] || 'medium');
const readinessPercent = () => {
  const posComplete = readinessItems.find(item => item.id === 2)?.status === 'Complete';
  const signageComplete = readinessItems.find(item => item.id === 6)?.status === 'Complete';
  if (posComplete && signageComplete) return 100;
  if (posComplete) return 96;
  return 92;
};
const mandatoryComplete = () => readinessItems.filter(item => item.mandatory && item.status === 'Complete').length;
const mandatoryTotal = () => readinessItems.filter(item => item.mandatory).length;
const openIssues = () => issues.filter(issue => issue.status !== 'Resolved');
const canRequestClearance = () => mandatoryComplete() === mandatoryTotal() && !issues.some(issue => issue.priority === 'Critical' && issue.status !== 'Resolved');
const buildClearanceSummary = () => canRequestClearance()
  ? 'Pulilan has completed all mandatory readiness requirements and has no unresolved critical launch issues. I recommend submitting the branch for full opening clearance while the non-mandatory exterior signage item continues to be monitored.'
  : 'Pulilan is 92% complete. Full opening clearance remains conditional until the remaining two POS terminals are received and activation is verified. Exterior signage is non-mandatory and continues to be monitored.';

function initIcons(){ if(window.lucide) lucide.createIcons(); }
function showToast(message){ toast.querySelector('span').textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); }
function updateBadges(){ document.getElementById('readinessBadge').textContent = readinessItems.filter(item => item.status !== 'Complete').length; document.getElementById('issueBadge').textContent = openIssues().length; }
function header(eyebrow, title, description, action=''){ return `<div class="welcome-row"><div><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${description}</p></div>${action}</div>`; }

function overviewTemplate(){
  const percent = readinessPercent();
  return `${header('PULILAN, BULACAN • LAUNCH PREPARATION','Good morning, Ruth!','Monitor branch readiness, resolve launch issues, and prepare the store for opening.','<div class="date-control">'+icon('calendar-days')+'<span>July 21, 2026</span></div>')}
  <div class="alert-banner"><div class="alert-icon">${icon('triangle-alert')}</div><div><strong>${readinessItems.filter(i=>i.status!=='Complete').length} launch requirements still need attention</strong><span>Complete all mandatory requirements and resolve critical issues before requesting opening clearance.</span></div><button data-open-section="readiness">Review readiness ${icon('arrow-right')}</button></div>
  <div class="stats-grid">
    <article class="stat-card"><div class="stat-icon green">${icon('clipboard-check')}</div><div><span>Launch Readiness</span><strong>${percent}%</strong><small><b>${readinessItems.filter(i=>i.status==='Complete').length} of ${readinessItems.length}</b> requirements complete</small></div></article>
    <article class="stat-card"><div class="stat-icon yellow">${icon('list-checks')}</div><div><span>Remaining Tasks</span><strong>${tasks.filter(t=>t.status!=='Complete').length}</strong><small>${tasks.filter(t=>t.priority==='High'&&t.status!=='Complete').length} high-priority tasks</small></div></article>
    <article class="stat-card"><div class="stat-icon orange">${icon('triangle-alert')}</div><div><span>Open Issues</span><strong>${openIssues().length}</strong><small>${issues.filter(i=>i.priority==='Critical'&&i.status!=='Resolved').length} critical issue</small></div></article>
    <article class="stat-card"><div class="stat-icon red">${icon('badge-check')}</div><div><span>Clearance Status</span><strong style="font-size:1.35rem">${clearanceStatus}</strong><small>${canRequestClearance()?'Ready for submission':'Requirements incomplete'}</small></div></article>
  </div>
  <div class="dashboard-grid">
    <section class="panel branch-panel"><div class="panel-heading"><div><h2>Launch Timeline</h2><p>Current progress toward opening approval</p></div><button class="text-btn" data-open-section="clearance">View clearance ${icon('arrow-up-right')}</button></div><div class="branch-list">
      ${['Site turnover|Complete','Equipment installation|Complete','Certified staff assignment|Complete','Final facility verification|Complete','Opening clearance|'+clearanceStatus].map((entry,index)=>{const [name,status]=entry.split('|');return `<article class="branch-row" data-search="${name} ${status}"><div class="branch-rank">${status==='Complete'?icon('check'):index+1}</div><div class="branch-name"><strong>${name}</strong><span>${status==='Complete'?'Verified and recorded':'Requires follow-up before opening'}</span></div><span class="status ${statusClass(status)}">${status}</span></article>`}).join('')}
    </div></section>
    <section class="panel activity-panel"><div class="panel-heading"><div><h2>Today's Priorities</h2><p>Tasks that may affect the opening schedule</p></div><button class="text-btn" data-open-section="tasks">View all ${icon('arrow-right')}</button></div><div class="timeline">
      ${tasks.filter(t=>t.status!=='Complete').slice(0,4).map(t=>`<div class="timeline-item" data-search="${t.task} ${t.owner}"><span class="dot ${t.priority==='High'?'red':'yellow'}">${icon(t.priority==='High'?'alert-circle':'clock-3')}</span><div><strong>${t.task}</strong><p>${t.owner} • ${t.status}</p><small>Due ${t.due}</small></div></div>`).join('')}
    </div></section>
  </div>
  <section class="panel incident-panel"><div class="panel-heading"><div><h2>Launch Issues Requiring Attention</h2><p>Coordinate with responsible teams and track each issue until resolved</p></div><button class="text-btn" data-open-section="issues">View issue register ${icon('arrow-right')}</button></div>${issueTable(openIssues().slice(0,3))}</section>`;
}

function readinessTemplate(){ return `${header('PRE-OPENING CHECKLIST','Launch Readiness','Verify equipment, systems, facilities, staffing, and other branch requirements.','<button class="primary-btn" data-add-readiness>'+icon('plus')+' Add Requirement</button>')}
<div class="stats-grid"><article class="stat-card"><div class="stat-icon green">${icon('circle-check-big')}</div><div><span>Overall Completion</span><strong>${readinessPercent()}%</strong><small>${readinessItems.filter(i=>i.status==='Complete').length} requirements verified</small></div></article><article class="stat-card"><div class="stat-icon yellow">${icon('asterisk')}</div><div><span>Mandatory Complete</span><strong>${mandatoryComplete()}<span>/${mandatoryTotal()}</span></strong><small>Required before clearance</small></div></article><article class="stat-card"><div class="stat-icon orange">${icon('clock-3')}</div><div><span>Pending Verification</span><strong>${readinessItems.filter(i=>i.status!=='Complete').length}</strong><small>Needs status or evidence</small></div></article><article class="stat-card"><div class="stat-icon red">${icon('shield-alert')}</div><div><span>Critical Blockers</span><strong>${issues.filter(i=>i.priority==='Critical'&&i.status!=='Resolved').length}</strong><small>Must be resolved first</small></div></article></div>
<section class="panel"><div class="panel-heading"><div><h2>Digital Pre-Opening Checklist</h2><p>Update requirement status, evidence, and remarks</p></div></div><div class="table-wrap"><table><thead><tr><th>Requirement</th><th>Category</th><th>Responsible Team</th><th>Evidence</th><th>Status</th><th></th></tr></thead><tbody>${readinessItems.map(item=>`<tr data-search="${item.requirement} ${item.category} ${item.owner} ${item.status}"><td><strong>${item.requirement}</strong><span>${item.mandatory?'Mandatory requirement':'Supporting requirement'}</span></td><td>${item.category}</td><td>${item.owner}</td><td>${item.evidence}</td><td><span class="table-status ${statusClass(item.status)}">${item.status}</span></td><td><button class="review-btn" data-edit-readiness="${item.id}">Update</button></td></tr>`).join('')}</tbody></table></div></section>`; }

function tasksTemplate(){ return `${header('LAUNCH COORDINATION','Readiness Tasks','Track preparation activities, assigned teams, due dates, and completion progress.','<button class="primary-btn" data-add-task>'+icon('plus')+' Add Task</button>')}<section class="panel"><div class="panel-heading"><div><h2>Assigned Launch Tasks</h2><p>Coordinate work without replacing specialist team systems</p></div></div><div class="table-wrap"><table><thead><tr><th>Task</th><th>Category</th><th>Owner</th><th>Due</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${tasks.map(task=>`<tr data-search="${task.task} ${task.category} ${task.owner} ${task.status}"><td><strong>${task.task}</strong><span>Task #SM-${String(task.id).padStart(3,'0')}</span></td><td>${task.category}</td><td>${task.owner}</td><td>${task.due}</td><td><span class="priority ${priorityClass(task.priority)}">${task.priority}</span></td><td><span class="table-status ${statusClass(task.status)}">${task.status}</span></td><td><button class="review-btn" data-edit-task="${task.id}">Update</button></td></tr>`).join('')}</tbody></table></div></section>`; }

function issueTable(list){ return `<div class="table-wrap"><table><thead><tr><th>Issue</th><th>Category</th><th>Responsible Team</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>${list.map(issue=>`<tr data-search="${issue.title} ${issue.category} ${issue.owner} ${issue.status}"><td><strong>${issue.title}</strong><span>${issue.reported}</span></td><td>${issue.category}</td><td>${issue.owner}</td><td><span class="priority ${priorityClass(issue.priority)}">${issue.priority}</span></td><td><span class="table-status ${statusClass(issue.status)}">${issue.status}</span></td><td><button class="review-btn" data-edit-issue="${issue.id}">Update</button></td></tr>`).join('')}</tbody></table></div>`; }
function issuesTemplate(){ return `${header('ISSUE RESOLUTION','Launch Issues','Report launch blockers, assign follow-ups, and monitor resolution before opening.','<button class="primary-btn" data-add-issue>'+icon('plus')+' Report Issue</button>')}<div class="alert-banner"><div class="alert-icon">${icon('shield-alert')}</div><div><strong>${openIssues().length} unresolved launch issues</strong><span>Critical issues prevent the opening clearance request from being submitted.</span></div></div><section class="panel"><div class="panel-heading"><div><h2>Launch Issue Register</h2><p>Open, monitored, and resolved pre-opening concerns</p></div></div>${issueTable(issues)}</section>`; }

function clearanceTemplate(){
  const allowed=canRequestClearance();
  const mandatoryPassed=mandatoryComplete()===mandatoryTotal();
  const criticalPassed=!issues.some(issue=>issue.priority==='Critical'&&issue.status!=='Resolved');
  const actionLabel=allowed
    ? (clearanceStatus==='Full Clearance Requested'?'Update Clearance Request':'Request Full Opening Clearance')
    : (clearanceReviewUpdated?'Update Conditional Review':'Save Conditional Clearance Review');
  return `${header('FINAL APPROVAL','Opening Clearance','Review the Pulilan readiness summary, record the Store Manager assessment, and submit the appropriate clearance state.','')}
  <div class="stats-grid">
    <article class="stat-card"><div class="stat-icon green">${icon('wrench')}</div><div><span>Equipment & Systems</span><strong>${Math.round(readinessItems.filter(i=>['Equipment','Systems'].includes(i.category)&&i.status==='Complete').length/readinessItems.filter(i=>['Equipment','Systems'].includes(i.category)).length*100)}%</strong><small>Installation and testing</small></div></article>
    <article class="stat-card"><div class="stat-icon yellow">${icon('building-2')}</div><div><span>Facility</span><strong>${Math.round(readinessItems.filter(i=>i.category==='Facility'&&i.status==='Complete').length/readinessItems.filter(i=>i.category==='Facility').length*100)}%</strong><small>Signage is non-mandatory</small></div></article>
    <article class="stat-card"><div class="stat-icon orange">${icon('users')}</div><div><span>Staffing</span><strong>${Math.round(readinessItems.filter(i=>i.category==='Staffing'&&i.status==='Complete').length/Math.max(1,readinessItems.filter(i=>i.category==='Staffing').length)*100)}%</strong><small>Certified crew assigned</small></div></article>
    <article class="stat-card"><div class="stat-icon red">${icon('triangle-alert')}</div><div><span>Unresolved Issues</span><strong>${openIssues().length}</strong><small>${issues.filter(i=>i.priority==='Critical'&&i.status!=='Resolved').length} critical blocker</small></div></article>
  </div>
  <div class="clearance-layout">
    <section class="panel clearance-validation-card">
      <div class="panel-heading"><div><h2>Clearance Validation</h2><p>System checks applied before full opening clearance</p></div><span class="status ${allowed?'strong':'attention'}">${allowed?'Ready':'Conditional'}</span></div>
      <div class="branch-list">
        <article class="branch-row"><div class="branch-rank ${mandatoryPassed?'validation-pass':'validation-block'}">${icon(mandatoryPassed?'check':'x')}</div><div class="branch-name"><strong>Mandatory requirements completed</strong><span>${mandatoryComplete()} of ${mandatoryTotal()} verified</span></div><span class="status ${mandatoryPassed?'strong':'attention'}">${mandatoryPassed?'Passed':'Incomplete'}</span></article>
        <article class="branch-row"><div class="branch-rank ${criticalPassed?'validation-pass':'validation-block'}">${icon(criticalPassed?'check':'x')}</div><div class="branch-name"><strong>No unresolved critical issue</strong><span>Critical launch blockers must be closed</span></div><span class="status ${criticalPassed?'strong':'attention'}">${criticalPassed?'Passed':'Blocked'}</span></article>
        <article class="branch-row"><div class="branch-rank validation-pass">${icon('file-check-2')}</div><div class="branch-name"><strong>Readiness summary generated</strong><span>Checklist, evidence, issues, and responsible teams included</span></div><span class="status strong">Ready</span></article>
      </div>
      ${!allowed?`<div class="clearance-blocker-note"><span>${icon('shield-alert')}</span><div><strong>Full clearance remains blocked</strong><p>Complete POS installation and resolve the critical POS activation issue. You can still save this review as Conditional Clearance.</p></div></div>`:''}
    </section>
    <section class="panel clearance-request-card">
      <div class="clearance-status-strip ${allowed?'ready':'conditional'}"><span>${icon(allowed?'badge-check':'shield-alert')}</span><div><small>CURRENT DECISION</small><strong>${escapeStoreHtml(clearanceStatus)}</strong><p>${allowed?'All mandatory controls have passed.':'Pulilan may not receive full opening clearance yet.'}</p></div></div>
      <div class="clearance-form">
        <label class="clearance-date-field"><span>Proposed Opening Date</span><input id="proposedOpeningDate" type="date" value="${proposedOpeningDate}"></label>
        <div class="clearance-remarks-field">
          <div class="remarks-heading"><label for="clearanceRemarks">Store Manager Remarks</label><button type="button" id="useClearanceSummary">Use readiness summary</button></div>
          <textarea id="clearanceRemarks" maxlength="500" rows="7" placeholder="Summarize readiness, remaining blockers, and the recommended clearance decision...">${escapeStoreHtml(clearanceRemarks)}</textarea>
          <div class="remarks-footer"><span>${icon('info')} Include the decision rationale and any remaining dependency.</span><strong id="clearanceRemarksCount">${clearanceRemarks.length}/500</strong></div>
        </div>
        ${clearanceReviewUpdated?`<div class="clearance-saved-note">${icon('check-circle-2')} Conditional review saved ${clearanceReviewUpdated}</div>`:''}
        <button class="primary-btn clearance-submit-btn" id="requestClearance">${icon(allowed?'send':'save')} ${actionLabel}</button>
        <small class="clearance-submit-help">${allowed?'This sends the branch for full opening-clearance approval.':'This records the Store Manager review while retaining Conditional Clearance.'}</small>
      </div>
    </section>
  </div>`;
}

function postLaunchTemplate(){
  const locked=branchStage!=='post-launch';
  const reportStatus=dailyOperationsReport.saved?'Updated':'Draft';
  const logStatus=operationalLogSaved?'Updated':String(operationalLog.length);
  const actions=[
    {title:'Daily Operations Report',description:'Encode Pulilan sales, attendance, operational controls, and the Store Manager note.',icon:'file-up',button:'Open'},
    {title:'Operational Log',description:'Maintain the four timestamped Pulilan operating-day entries and evidence references.',icon:'notebook-pen',button:'Open'},
    {title:'Incident Report',description:'No Pulilan incident was reported for July 20, 2026.',icon:'shield-check',button:'No Incident',unavailable:true},
    {title:'Corrective Actions',description:'View and update tasks assigned by the Area Manager.',icon:'clipboard-check',button:'View'}
  ];

  return `${header('AFTER OPENING','Post-Launch Reports','Submit operational information required by the Area Manager without duplicating POS or ERP functions.','')}
    ${locked?`<div class="alert-banner"><div class="alert-icon">${icon('lock-keyhole')}</div><div><strong>Post-launch reporting is currently locked</strong><span>This section becomes available after opening clearance is approved.</span></div><button data-demo-open>Preview Mode</button></div>`:''}
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon green">${icon('file-text')}</div><div><span>Daily Operations Report</span><strong>${locked?'Locked':reportStatus}</strong><small>DOR-2026-0720-001</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow">${icon('notebook-tabs')}</div><div><span>Operational Log</span><strong>${locked?'—':logStatus}</strong><small>Four recorded updates</small></div></article>
      <article class="stat-card"><div class="stat-icon orange">${icon('shield-check')}</div><div><span>Incident Reports</span><strong>${locked?'—':'0'}</strong><small>No Pulilan incident recorded</small></div></article>
      <article class="stat-card"><div class="stat-icon red">${icon('clipboard-list')}</div><div><span>Corrective Actions</span><strong>${locked?'—':'2'}</strong><small>Assigned by Area Manager</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Reporting Actions</h2><p>Lightweight workflows connected to Area Manager review</p></div></div><div class="branch-list">
      ${actions.map((item,index)=>`<article class="branch-row"><div class="branch-rank">${icon(item.icon)}</div><div class="branch-name"><strong>${item.title}</strong><span>${item.description}</span></div><button class="review-btn" data-post-action="${index}" ${locked||item.unavailable?'disabled':''}>${item.button}</button></article>`).join('')}
    </div></section>`;
}

function settingsTemplate(){ return `${header('ACCOUNT PREFERENCES','Settings','Manage Ruth Torres’s Store Manager dashboard preferences.','')}<div class="settings-grid"><section class="panel settings-card"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in readiness and clearance records</p></div></div><div class="settings-form"><label>Full Name</label><input value="Ruth Torres"><label>Role</label><input value="Store Manager" disabled><label>Assigned Branch</label><input value="Pulilan, Bulacan" disabled><label>Email Address</label><input value="ruth.torres@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel settings-card"><div class="panel-heading"><div><h2>Notifications</h2><p>Select the launch updates you want to receive</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> Pending and overdue readiness tasks</label><label><input type="checkbox" checked> Critical launch issue alerts</label><label><input type="checkbox" checked> Staff certification updates</label><label><input type="checkbox" checked> Opening clearance decisions</label><label><input type="checkbox"> Daily launch summary email</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`; }

const templates = {overview:overviewTemplate, readiness:readinessTemplate, tasks:tasksTemplate, issues:issuesTemplate, clearance:clearanceTemplate, postlaunch:postLaunchTemplate, settings:settingsTemplate};
function renderSection(section=activeSection){ activeSection=section; pageContent.innerHTML=templates[section](); pageContent.dataset.currentSection=section; updateBadges(); initIcons(); applySearch(document.getElementById('globalSearch').value); window.scrollTo({top:0,behavior:'smooth'}); }

function modalFields(type, data={}){
  if(type==='readiness') return `<label>Requirement</label><input id="modalName" value="${data.requirement||''}" ${data.id?'disabled':''}><label>Status</label><select id="modalStatus"><option ${data.status==='Pending'?'selected':''}>Pending</option><option ${data.status==='In Progress'?'selected':''}>In Progress</option><option ${data.status==='Complete'?'selected':''}>Complete</option></select><label>Evidence / Verification</label><input id="modalEvidence" value="${data.evidence||''}" placeholder="e.g., Completion photo"><label>Remarks</label><textarea id="modalRemarks" rows="4">${data.remarks||''}</textarea>`;
  if(type==='task') return `<label>Task</label><input id="modalName" value="${data.task||''}"><label>Owner</label><input id="modalOwner" value="${data.owner||''}"><label>Status</label><select id="modalStatus"><option ${data.status==='Pending'?'selected':''}>Pending</option><option ${data.status==='In Progress'?'selected':''}>In Progress</option><option ${data.status==='Complete'?'selected':''}>Complete</option></select><label>Priority</label><select id="modalPriority"><option ${data.priority==='Low'?'selected':''}>Low</option><option ${data.priority==='Medium'?'selected':''}>Medium</option><option ${data.priority==='High'?'selected':''}>High</option></select>`;
  if(type==='issue') return `<label>Issue</label><input id="modalName" value="${data.title||''}"><label>Responsible Team</label><input id="modalOwner" value="${data.owner||''}"><label>Priority</label><select id="modalPriority"><option ${data.priority==='Medium'?'selected':''}>Medium</option><option ${data.priority==='High'?'selected':''}>High</option><option ${data.priority==='Critical'?'selected':''}>Critical</option></select><label>Status</label><select id="modalStatus"><option ${data.status==='Open'?'selected':''}>Open</option><option ${data.status==='In Progress'?'selected':''}>In Progress</option><option ${data.status==='Resolved'?'selected':''}>Resolved</option></select><label>Resolution Notes</label><textarea id="modalRemarks" rows="4">${data.details||''}</textarea>`;
  if(type==='daily-report') return `<div class="post-launch-form daily-report-form">
    <div class="form-grid">
      <label>Report ID<input id="dailyReportId" value="${escapeStoreHtml(dailyOperationsReport.reportId)}" required></label>
      <label>Branch<input id="dailyBranch" value="${escapeStoreHtml(dailyOperationsReport.branch)}" required></label>
      <label>Reporting Date<input id="dailyReportingDate" type="date" value="${escapeStoreHtml(dailyOperationsReport.reportingDate)}" required></label>
      <label>Submission Time<input id="dailySubmissionTime" type="time" value="${escapeStoreHtml(dailyOperationsReport.submissionTime)}" required></label>
      <label>Sales Status<select id="dailySalesStatus"><option ${dailyOperationsReport.salesStatus==='Above Target'?'selected':''}>Above Target</option><option ${dailyOperationsReport.salesStatus==='On Target'?'selected':''}>On Target</option><option ${dailyOperationsReport.salesStatus==='Below Target'?'selected':''}>Below Target</option></select></label>
      <label>Sales Summary<input id="dailySalesSummary" value="${escapeStoreHtml(dailyOperationsReport.salesSummary)}" required></label>
    </div>
    <fieldset class="report-fieldset"><legend>Attendance</legend><div class="attendance-grid">
      <label>Present<input id="dailyAttendancePresent" type="number" min="0" value="${dailyOperationsReport.attendancePresent}" required></label>
      <label>Scheduled<input id="dailyAttendanceScheduled" type="number" min="0" value="${dailyOperationsReport.attendanceScheduled}" required></label>
      <div class="attendance-preview"><span>Recorded Attendance</span><strong>${dailyOperationsReport.attendancePresent} present / ${dailyOperationsReport.attendanceScheduled} scheduled</strong></div>
    </div></fieldset>
    <label>Operations — Checklist Complete<select id="dailyChecklistComplete"><option ${dailyOperationsReport.checklistComplete==='Yes'?'selected':''}>Yes</option><option ${dailyOperationsReport.checklistComplete==='No'?'selected':''}>No</option></select></label>
    <label>Manager Note<textarea id="dailyManagerNote" rows="5" required>${escapeStoreHtml(dailyOperationsReport.managerNote)}</textarea></label>
  </div>`;
  if(type==='operational-log') return `<div class="post-launch-form operational-log-form">
    <div class="operational-log-heading"><div><strong>July 20, 2026 — Pulilan, Bulacan</strong><span>Encode the time, activity, outcome, and evidence reference for each operating-day update.</span></div><span>${operationalLog.length} entries</span></div>
    <div class="operational-log-editor">${operationalLog.map((entry,index)=>`<article class="operational-log-entry" data-log-index="${index}">
      <div class="log-entry-number">${String(index+1).padStart(2,'0')}</div>
      <div class="log-entry-fields">
        <label>Time<input data-log-field="time" type="time" value="${escapeStoreHtml(entry.time)}" required></label>
        <label>Operational Activity<textarea data-log-field="activity" rows="2" required>${escapeStoreHtml(entry.activity)}</textarea></label>
        <label>Status<select data-log-field="status">${['Complete','Normal','Resolved','Compliant','Action Required'].map(status=>`<option ${entry.status===status?'selected':''}>${status}</option>`).join('')}</select></label>
        <label>Evidence Reference<input data-log-field="evidence" value="${escapeStoreHtml(entry.evidence)}" required></label>
      </div>
    </article>`).join('')}</div>
  </div>`;
  return `<label>Report Type</label><input value="${data.name||'Operational Report'}" disabled><label>Operational Summary</label><textarea id="modalRemarks" rows="6" placeholder="Enter the information to be submitted to the Area Manager..."></textarea>`;
}
function openModal(type, id=null, title='Update Record'){
  const collection={readiness:readinessItems,task:tasks,issue:issues}[type];
  const data=collection&&id?collection.find(item=>item.id===id):{};
  const isPostLaunch=['report','daily-report','operational-log'].includes(type);
  activeModal={type,id};
  modalEyebrow.textContent=isPostLaunch?'POST-LAUNCH REPORT':'STORE UPDATE';
  modalTitle.textContent=title;
  modalDescription.textContent=type==='daily-report'?'Encode the Daily Operations Report submitted to Area Management.':type==='operational-log'?'Encode Pulilan’s timestamped operational activities and supporting evidence.':'Update the selected store readiness record and save your changes.';
  modalBody.innerHTML=modalFields(type,data);
  modal.classList.toggle('post-launch-report-modal',['daily-report','operational-log'].includes(type));
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  setTimeout(()=>modalBody.querySelector('input,select,textarea')?.focus(),0);
  initIcons();
}
function closeModal(){ modal.classList.remove('open','post-launch-report-modal'); modal.setAttribute('aria-hidden','true'); activeModal=null; }
function saveModal(){ if(!activeModal)return; const {type,id}=activeModal; const name=document.getElementById('modalName')?.value.trim(); const status=document.getElementById('modalStatus')?.value; const owner=document.getElementById('modalOwner')?.value.trim(); const priority=document.getElementById('modalPriority')?.value; const remarks=document.getElementById('modalRemarks')?.value.trim();
  if(type==='readiness'){ if(id){const item=readinessItems.find(i=>i.id===id); item.status=status; item.evidence=document.getElementById('modalEvidence').value.trim(); item.remarks=remarks;} else readinessItems.push({id:Date.now(),requirement:name||'New requirement',category:'Other',owner:'Store Manager',mandatory:false,evidence:document.getElementById('modalEvidence').value.trim()||'Pending evidence',status,remarks}); }
  if(type==='task'){ if(id){const item=tasks.find(i=>i.id===id); item.task=name; item.owner=owner; item.status=status; item.priority=priority;} else tasks.push({id:Date.now(),task:name||'New readiness task',category:'Operations',owner:owner||'Store Manager',due:'TBD',priority,status}); }
  if(type==='issue'){ if(id){const item=issues.find(i=>i.id===id); item.title=name; item.owner=owner; item.status=status; item.priority=priority; item.details=remarks;} else issues.push({id:Date.now(),title:name||'New launch issue',category:'Other',owner:owner||'Store Manager',priority,status,reported:'Just now',details:remarks}); }
  if(type==='daily-report'){
    Object.assign(dailyOperationsReport,{
      reportId:document.getElementById('dailyReportId').value.trim(),
      branch:document.getElementById('dailyBranch').value.trim(),
      reportingDate:document.getElementById('dailyReportingDate').value,
      submissionTime:document.getElementById('dailySubmissionTime').value,
      salesStatus:document.getElementById('dailySalesStatus').value,
      salesSummary:document.getElementById('dailySalesSummary').value.trim(),
      attendancePresent:Number(document.getElementById('dailyAttendancePresent').value),
      attendanceScheduled:Number(document.getElementById('dailyAttendanceScheduled').value),
      checklistComplete:document.getElementById('dailyChecklistComplete').value,
      managerNote:document.getElementById('dailyManagerNote').value.trim(),
      saved:true
    });
  }
  if(type==='operational-log'){
    document.querySelectorAll('.operational-log-entry').forEach(entry=>{
      const record=operationalLog[Number(entry.dataset.logIndex)];
      entry.querySelectorAll('[data-log-field]').forEach(field=>record[field.dataset.logField]=field.value.trim());
    });
    operationalLogSaved=true;
  }
  closeModal();
  renderSection();
  const message=type==='daily-report'?'Daily Operations Report updated successfully.':type==='operational-log'?'Operational Log updated successfully.':type==='report'?'Report saved successfully.':'Store update saved successfully.';
  showToast(message);
}

function applySearch(value){ const query=value.trim().toLowerCase(); document.querySelectorAll('[data-search]').forEach(item=>item.classList.toggle('hidden-by-search',query&&!item.dataset.search.toLowerCase().includes(query))); }

document.getElementById('menuBtn').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.querySelectorAll('.nav-item[data-section]').forEach(item=>item.addEventListener('click',()=>{document.querySelectorAll('.nav-item[data-section]').forEach(nav=>nav.classList.remove('active'));item.classList.add('active');sidebar.classList.remove('open');renderSection(item.dataset.section);}));
document.addEventListener('click',event=>{
  const opener=event.target.closest('[data-open-section]'); if(opener){document.querySelector(`.nav-item[data-section="${opener.dataset.openSection}"]`)?.click();return;}
  const editReadiness=event.target.closest('[data-edit-readiness]'); if(editReadiness){openModal('readiness',Number(editReadiness.dataset.editReadiness),'Update Readiness Requirement');return;}
  const editTask=event.target.closest('[data-edit-task]'); if(editTask){openModal('task',Number(editTask.dataset.editTask),'Update Readiness Task');return;}
  const editIssue=event.target.closest('[data-edit-issue]'); if(editIssue){openModal('issue',Number(editIssue.dataset.editIssue),'Update Launch Issue');return;}
  if(event.target.closest('[data-add-readiness]')){openModal('readiness',null,'Add Readiness Requirement');return;}
  if(event.target.closest('[data-add-task]')){openModal('task',null,'Add Readiness Task');return;}
  if(event.target.closest('[data-add-issue]')){openModal('issue',null,'Report Launch Issue');return;}
  if(event.target.closest('#useClearanceSummary')){
    const remarksField=document.getElementById('clearanceRemarks');
    if(remarksField){remarksField.value=buildClearanceSummary();remarksField.dispatchEvent(new Event('input',{bubbles:true}));remarksField.focus();}
    return;
  }
  const postAction=event.target.closest('[data-post-action]');
  if(postAction){
    const action=Number(postAction.dataset.postAction);
    if(action===0)openModal('daily-report',null,'Daily Operations Report');
    if(action===1)openModal('operational-log',null,'Operational Log');
    if(action===3)openModal('report',null,'Corrective Actions');
    return;
  }
  if(event.target.closest('#requestClearance')){
    const remarksField=document.getElementById('clearanceRemarks');
    const dateField=document.getElementById('proposedOpeningDate');
    const remarks=remarksField?.value.trim()||'';
    if(remarks.length<20){showToast('Add a clear Store Manager rationale before saving the review.');remarksField?.focus();return;}
    if(!dateField?.value){showToast('Select the proposed opening date before saving.');dateField?.focus();return;}
    clearanceRemarks=remarks;
    proposedOpeningDate=dateField.value;
    if(canRequestClearance()){
      clearanceStatus='Full Clearance Requested';
      clearanceReviewUpdated='';
      renderSection('clearance');
      showToast('Full opening clearance request submitted for Pulilan.');
    }else{
      clearanceStatus='Conditional Clearance';
      clearanceReviewUpdated='just now';
      renderSection('clearance');
      showToast('Conditional Clearance review saved with Store Manager remarks.');
    }
    return;
  }
  if(event.target.closest('[data-demo-open]')){branchStage='post-launch';renderSection('postlaunch');showToast('Post-launch preview mode enabled.');return;}
  if(event.target.closest('.save-settings'))showToast('Settings updated successfully.');
});
document.getElementById('closeModal').addEventListener('click',closeModal);
document.getElementById('cancelModal').addEventListener('click',closeModal);
document.getElementById('saveModal').addEventListener('click',saveModal);
modal.addEventListener('click',event=>{if(event.target===modal)closeModal();});
document.getElementById('globalSearch').addEventListener('input',event=>applySearch(event.target.value));
document.addEventListener('input',event=>{
  if(event.target.id==='clearanceRemarks'){
    const counter=document.getElementById('clearanceRemarksCount');
    if(counter)counter.textContent=`${event.target.value.length}/500`;
  }
});
document.getElementById('logoutBtn').addEventListener('click',()=>{localStorage.removeItem('b2bUserRole');localStorage.removeItem('b2bUserName');window.location.href='index.html';});
renderSection('overview');
