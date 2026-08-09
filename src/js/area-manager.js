const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modalTitle');
const modalEyebrow = document.getElementById('modalEyebrow');
const modalDescription = document.getElementById('modalDescription');
const modalFields = document.getElementById('modalFields');
const saveButton = document.getElementById('saveReview');
const cancelButton = document.getElementById('cancelModal');
const toast = document.getElementById('toast');
const pageContent = document.querySelector('.page-content');
const overviewHTML = pageContent.innerHTML;

const branches = [
  {id:'BR-001',name:'Pulilan, Bulacan',region:'Bulacan',manager:'Andrea Cruz',report:'Submitted 8:42 AM',score:96,status:'Strong',note:''},
  {id:'BR-003',name:'Pandi, Bulacan',region:'Bulacan',manager:'Luis Santos',report:'Submitted 9:05 AM',score:94,status:'Strong',note:''},
  {id:'BR-006',name:'Mexico, Pampanga',region:'Pampanga',manager:'Camille Reyes',report:'Submitted 10:10 AM',score:91,status:'Good',note:''},
  {id:'BR-008',name:'Paombong, Bulacan',region:'Bulacan',manager:'Marco Lim',report:'Pending',score:78,status:'Needs Attention',note:''},
  {id:'BR-004',name:'Malolos, Bulacan',region:'Bulacan',manager:'Nina Flores',report:'Pending',score:87,status:'Good',note:''}
];

const dailyReports = [
  {id:'DR-0720-001',branch:'Pulilan, Bulacan',submitted:'8:42 AM',sales:'Above target',operations:'No issues',status:'Reviewed',note:'Operations remained stable. The staffing gap was resolved before the evening peak.',managerNote:'Reviewed and acknowledged.'},
  {id:'DR-0720-003',branch:'Pandi, Bulacan',submitted:'9:05 AM',sales:'On target',operations:'Minor staffing note',status:'For Review',note:'Reliever assigned to the afternoon shift.',managerNote:''},
  {id:'DR-0720-006',branch:'Mexico, Pampanga',submitted:'10:10 AM',sales:'On target',operations:'POS issue monitored',status:'For Review',note:'Backup terminal remained available during diagnostics.',managerNote:''},
  {id:'DR-0720-008',branch:'Paombong, Bulacan',submitted:'Pending',sales:'—',operations:'—',status:'Pending',note:'',managerNote:'',reminderSent:false}
];

const incidents = [
  {id:'INC-2026-0719',title:'Freezer temperature fluctuation',branch:'Paombong, Bulacan',reported:'Today, 9:12 AM',priority:'High',status:'Under Investigation',owner:'Marco Lim',note:''},
  {id:'INC-2026-0718',title:'Delayed opening due to staffing',branch:'Malolos, Bulacan',reported:'Yesterday, 7:45 AM',priority:'High',status:'Action Required',owner:'Nina Flores',note:''},
  {id:'INC-2026-0716',title:'POS terminal intermittent error',branch:'Mexico, Pampanga',reported:'July 18, 2026',priority:'Medium',status:'Monitoring',owner:'Camille Reyes',note:''}
];

const correctiveActions = [
  {id:'CA-2026-041',title:'Inspect and recalibrate freezer sensors',branch:'Paombong, Bulacan',owner:'Marco Lim',due:'2026-07-20',progress:40,status:'Overdue',note:''},
  {id:'CA-2026-039',title:'Submit opening-shift staffing contingency plan',branch:'Malolos, Bulacan',owner:'Nina Flores',due:'2026-07-21',progress:70,status:'In Progress',note:''},
  {id:'CA-2026-037',title:'Complete POS terminal diagnostics',branch:'Mexico, Pampanga',owner:'Camille Reyes',due:'2026-07-22',progress:85,status:'Monitoring',note:''}
];

const performanceRows = [
  {id:'BR-001',branch:'Pulilan, Bulacan',summary:'Excellent operational consistency',score:96,status:'Strong',reports:'7 / 7',incidents:0,compliance:'98%',trend:'Improving',note:''},
  {id:'BR-003',branch:'Pandi, Bulacan',summary:'Stable month-on-month results',score:94,status:'Strong',reports:'7 / 7',incidents:1,compliance:'95%',trend:'Stable',note:''},
  {id:'BR-006',branch:'Mexico, Pampanga',summary:'Highest monthly improvement',score:91,status:'Good',reports:'7 / 7',incidents:1,compliance:'92%',trend:'Improving',note:''},
  {id:'BR-008',branch:'Paombong, Bulacan',summary:'Incident resolution needs attention',score:78,status:'Needs Attention',reports:'6 / 7',incidents:3,compliance:'84%',trend:'Declining',note:''}
];

const activityHistory = [
  ['Daily report submitted','Pulilan, Bulacan completed its operations report.','12 minutes ago','green'],
  ['New incident reported','Equipment issue logged by Paombong, Bulacan.','38 minutes ago','red'],
  ['Corrective action updated','Pandi, Bulacan submitted improvement evidence.','1 hour ago','yellow'],
  ['Branch manager comment','Mexico, Pampanga responded to your review note.','2 hours ago','gray'],
  ['Daily report reviewed','Pandi’s July 19 report was accepted.','Yesterday, 4:35 PM','green'],
  ['Reminder sent','Malolos received a missing-report reminder.','Yesterday, 3:10 PM','yellow']
];

let currentSection = 'overview';
let activeWorkflow = null;
let reportDate = '2026-07-20';
let performancePeriod = '2026-07';

const escapeHtml = value => String(value == null ? '' : value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const icon = name => `<i data-lucide="${name}"></i>`;
const branchOptions = selected => branches.map(branch => `<option value="${branch.id}" ${branch.id===selected?'selected':''}>${escapeHtml(branch.name)}</option>`).join('');
const statusClass = status => ({'Strong':'strong','Good':'good','Needs Attention':'attention'}[status] || 'good');
const tableStatusClass = status => ['Action Required','Overdue','Pending'].includes(status) ? 'action' : ['Under Investigation','For Review','In Progress'].includes(status) ? 'investigating' : 'monitoring';
const formatDate = value => new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(`${value}T00:00:00`));
const formatMonth = value => new Intl.DateTimeFormat('en-US',{month:'long',year:'numeric'}).format(new Date(`${value}-01T00:00:00`));

function branchesTemplate(){
  return `<div class="welcome-row"><div><p class="eyebrow">BRANCH NETWORK</p><h1>Branches</h1><p>Monitor all franchise branches assigned to Bea Hernandez.</p></div><button class="primary-btn compact" type="button" data-area-action="branch-note">${icon('message-square-plus')} Add Branch Note</button></div>
  <div class="stats-grid">
    <article class="stat-card"><div class="stat-icon red">${icon('store')}</div><div><span>Total Branches</span><strong>8</strong><small>All currently active</small></div></article>
    <article class="stat-card"><div class="stat-icon green">${icon('badge-check')}</div><div><span>Strong Performing</span><strong>5</strong><small>Score of 90% or above</small></div></article>
    <article class="stat-card"><div class="stat-icon yellow">${icon('clock-3')}</div><div><span>Reports Pending</span><strong>${dailyReports.filter(report=>report.status==='Pending').length}</strong><small>Due before 5:00 PM</small></div></article>
    <article class="stat-card"><div class="stat-icon orange">${icon('circle-alert')}</div><div><span>Needs Attention</span><strong>1</strong><small>Paombong, Bulacan</small></div></article>
  </div>
  <section class="panel"><div class="panel-heading"><div><h2>Assigned Franchise Branches</h2><p>Operational status, manager, and latest report</p></div></div><div class="table-wrap"><table><thead><tr><th>Branch</th><th>Branch Manager</th><th>Daily Report</th><th>Performance</th><th>Status</th><th></th></tr></thead><tbody>
    ${branches.map(branch=>`<tr data-search="${escapeHtml(`${branch.name} ${branch.region} ${branch.manager} ${branch.status}`)}"><td><strong>${escapeHtml(branch.name)}</strong><span>${branch.id} • ${escapeHtml(branch.region)}</span></td><td>${escapeHtml(branch.manager)}</td><td>${escapeHtml(branch.report)}</td><td>${branch.score}%</td><td><span class="status ${statusClass(branch.status)}">${escapeHtml(branch.status)}</span></td><td><button class="review-btn" type="button" data-area-action="branch-detail" data-id="${branch.id}">View</button></td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function reportsTemplate(){
  const reviewed=dailyReports.filter(report=>report.status==='Reviewed').length;
  const pending=dailyReports.filter(report=>report.status==='Pending').length;
  return `<div class="welcome-row"><div><p class="eyebrow">DAILY OPERATIONS</p><h1>Daily Reports</h1><p>Review branch submissions, sales summaries, staffing, and operational notes.</p></div><button class="date-control" type="button" data-area-action="report-date">${icon('calendar-days')}<span>${formatDate(reportDate)}</span></button></div>
  <div class="stats-grid"><article class="stat-card"><div class="stat-icon green">${icon('file-check-2')}</div><div><span>Submitted</span><strong>${dailyReports.length-pending}</strong><small>Out of 8 branches</small></div></article><article class="stat-card"><div class="stat-icon yellow">${icon('hourglass')}</div><div><span>Pending</span><strong>${pending}</strong><small>Missing daily submissions</small></div></article><article class="stat-card"><div class="stat-icon red">${icon('receipt-text')}</div><div><span>For Review</span><strong>${dailyReports.filter(report=>report.status==='For Review').length}</strong><small>Flagged operational notes</small></div></article><article class="stat-card"><div class="stat-icon green">${icon('circle-check-big')}</div><div><span>Reviewed</span><strong>${reviewed}</strong><small>Completed by Bea</small></div></article></div>
  <section class="panel"><div class="panel-heading"><div><h2>Branch Reports for ${formatDate(reportDate)}</h2><p>Open a submission to inspect and record the management review</p></div></div><div class="table-wrap"><table><thead><tr><th>Branch</th><th>Submitted</th><th>Sales Status</th><th>Operations</th><th>Review Status</th><th></th></tr></thead><tbody>
  ${dailyReports.map(report=>`<tr data-search="${escapeHtml(`${report.branch} ${report.status} ${report.sales} ${report.operations}`)}"><td><strong>${escapeHtml(report.branch)}</strong><span>${report.id}</span></td><td>${escapeHtml(report.submitted)}</td><td>${escapeHtml(report.sales)}</td><td>${escapeHtml(report.operations)}</td><td><span class="table-status ${tableStatusClass(report.status)}">${escapeHtml(report.status)}</span></td><td>${report.status==='Pending'?`<button class="review-btn" type="button" data-area-action="send-reminder" data-id="${report.id}" ${report.reminderSent?'disabled':''}>${report.reminderSent?'Reminder Sent':'Send Reminder'}</button>`:`<button class="review-btn" type="button" data-area-action="report-review" data-id="${report.id}">${report.status==='Reviewed'?'Open':'Review'}</button>`}</td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function incidentsTemplate(){
  return `<div class="welcome-row"><div><p class="eyebrow">RISK &amp; COMPLIANCE</p><h1>Incident Logs</h1><p>Track reported operational incidents and management decisions.</p></div><button class="primary-btn compact" type="button" data-area-action="incident-create">${icon('plus')} Log Incident</button></div>
  <div class="alert-banner"><div class="alert-icon">${icon('triangle-alert')}</div><div><strong>${incidents.filter(item=>item.priority==='High'&&item.status!=='Resolved').length} high-priority incidents need action</strong><span>Review ownership and corrective steps before end of day.</span></div></div>
  <section class="panel"><div class="panel-heading"><div><h2>Incident Register</h2><p>Open, monitored, and recently resolved incidents</p></div></div><div class="table-wrap"><table><thead><tr><th>Incident</th><th>Branch</th><th>Reported</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>
  ${incidents.map(item=>`<tr data-search="${escapeHtml(`${item.title} ${item.branch} ${item.priority} ${item.status}`)}"><td><strong>${escapeHtml(item.title)}</strong><span>${item.id}</span></td><td>${escapeHtml(item.branch)}</td><td>${escapeHtml(item.reported)}</td><td><span class="priority ${item.priority.toLowerCase()}">${escapeHtml(item.priority)}</span></td><td><span class="table-status ${tableStatusClass(item.status)}">${escapeHtml(item.status)}</span></td><td><button class="review-btn" type="button" data-area-action="incident-review" data-id="${item.id}">Review</button></td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function actionsTemplate(){
  return `<div class="welcome-row"><div><p class="eyebrow">IMPROVEMENT TRACKING</p><h1>Corrective Actions</h1><p>Follow up action plans assigned after incidents and branch reviews.</p></div><button class="primary-btn compact" type="button" data-area-action="action-create">${icon('plus')} Create Action</button></div>
  <div class="stats-grid"><article class="stat-card"><div class="stat-icon red">${icon('clipboard-list')}</div><div><span>Open Actions</span><strong>${correctiveActions.filter(item=>item.status!=='Completed').length}</strong><small>Current action register</small></div></article><article class="stat-card"><div class="stat-icon orange">${icon('alarm-clock')}</div><div><span>Overdue</span><strong>${correctiveActions.filter(item=>item.status==='Overdue').length}</strong><small>Immediate follow-up</small></div></article><article class="stat-card"><div class="stat-icon yellow">${icon('loader-circle')}</div><div><span>In Progress</span><strong>${correctiveActions.filter(item=>item.status==='In Progress').length}</strong><small>Owners actively updating</small></div></article><article class="stat-card"><div class="stat-icon green">${icon('badge-check')}</div><div><span>Completed</span><strong>${correctiveActions.filter(item=>item.status==='Completed').length}</strong><small>Recorded in this view</small></div></article></div>
  <section class="panel"><div class="panel-heading"><div><h2>Action Plan Tracker</h2><p>Ownership, due dates, and progress</p></div></div><div class="table-wrap"><table><thead><tr><th>Corrective Action</th><th>Branch</th><th>Owner</th><th>Due Date</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
  ${correctiveActions.map(item=>`<tr data-search="${escapeHtml(`${item.title} ${item.branch} ${item.owner} ${item.status}`)}"><td><strong>${escapeHtml(item.title)}</strong><span>${item.id}</span></td><td>${escapeHtml(item.branch)}</td><td>${escapeHtml(item.owner)}</td><td>${formatDate(item.due)}</td><td>${item.progress}%</td><td><span class="table-status ${tableStatusClass(item.status)}">${escapeHtml(item.status)}</span></td><td><button class="review-btn" type="button" data-area-action="action-edit" data-id="${item.id}">Update</button></td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function performanceTemplate(){
  return `<div class="welcome-row"><div><p class="eyebrow">PERFORMANCE ANALYTICS</p><h1>Performance</h1><p>Compare branch operations and identify improvement opportunities.</p></div><div class="area-heading-actions"><button class="secondary-btn compact" type="button" data-area-action="performance-compare">Compare Branches</button><button class="date-control" type="button" data-area-action="performance-period">${icon('calendar-range')}<span>${formatMonth(performancePeriod)}</span></button></div></div>
  <div class="stats-grid"><article class="stat-card"><div class="stat-icon green">${icon('trending-up')}</div><div><span>Area Average</span><strong>91%</strong><small><b>+3.2%</b> vs. last month</small></div></article><article class="stat-card"><div class="stat-icon red">${icon('trophy')}</div><div><span>Top Branch</span><strong>96%</strong><small>Pulilan, Bulacan</small></div></article><article class="stat-card"><div class="stat-icon yellow">${icon('star')}</div><div><span>Target Met</span><strong>6/8</strong><small>Two branches below 90%</small></div></article><article class="stat-card"><div class="stat-icon orange">${icon('arrow-up-right')}</div><div><span>Most Improved</span><strong>+8%</strong><small>Mexico, Pampanga</small></div></article></div>
  <div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><h2>Branch Ranking</h2><p>Composite score from reports, incidents, and compliance</p></div></div><div class="branch-list">
    ${performanceRows.map((item,index)=>`<article class="branch-row performance-branch-row" data-search="${escapeHtml(`${item.branch} ${item.status} ${item.trend}`)}"><div class="branch-rank">${index+1}</div><div class="branch-name"><strong>${escapeHtml(item.branch)}</strong><span>${escapeHtml(item.summary)}</span></div><div class="score"><strong>${item.score}%</strong><div><span style="width:${item.score}%"></span></div></div><span class="status ${statusClass(item.status)}">${escapeHtml(item.status)}</span><button class="review-btn" type="button" data-area-action="performance-detail" data-id="${item.id}">View</button></article>`).join('')}
  </div></section><section class="panel"><div class="panel-heading"><div><h2>Area Manager Focus</h2><p>Recommended priorities</p></div></div><div class="timeline"><div class="timeline-item"><span class="dot red">${icon('triangle-alert')}</span><div><strong>Resolve Paombong equipment incident</strong><p>Confirm technician visit and food-safety controls.</p><small>High priority</small></div></div><div class="timeline-item"><span class="dot yellow">${icon('users')}</span><div><strong>Review Malolos staffing plan</strong><p>Prevent another delayed branch opening.</p><small>Due tomorrow</small></div></div><div class="timeline-item"><span class="dot green">${icon('award')}</span><div><strong>Recognize Pulilan performance</strong><p>Share branch practices with the area network.</p><small>Recommended</small></div></div></div></section></div>`;
}

const sectionTemplates = {branches:branchesTemplate,reports:reportsTemplate,incidents:incidentsTemplate,actions:actionsTemplate,performance:performanceTemplate,settings:()=>`
  <div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Bea Hernandez's Area Manager dashboard preferences.</p></div></div>
  <div class="settings-grid"><section class="panel settings-card"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in reports and management reviews</p></div></div><div class="settings-form"><label>Full Name</label><input value="Bea Hernandez"><label>Role</label><input value="Area Manager" disabled><label>Email Address</label><input value="bea.hernandez@5joys.com"><button class="primary-btn compact save-settings" type="button">Save Changes</button></div></section><section class="panel settings-card"><div class="panel-heading"><div><h2>Notifications</h2><p>Select the updates you want to receive</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> High-priority incident alerts</label><label><input type="checkbox" checked> Missing daily report reminders</label><label><input type="checkbox" checked> Corrective action due-date alerts</label><label><input type="checkbox"> Weekly performance summary email</label><button class="primary-btn compact save-settings" type="button">Update Preferences</button></div></section></div>`};

function initIcons(){ if(window.lucide) window.lucide.createIcons(); }
function showToast(message='Changes saved successfully.'){
  toast.querySelector('span').textContent=message;
  toast.classList.add('show');
  window.setTimeout(()=>toast.classList.remove('show'),2600);
}
function applySearch(query=document.getElementById('globalSearch').value){
  const normalized=query.trim().toLowerCase();
  document.querySelectorAll('.page-content [data-search]').forEach(item=>item.classList.toggle('hidden-by-search',Boolean(normalized)&&!item.dataset.search.toLowerCase().includes(normalized)));
}
function renderSection(section=currentSection){
  currentSection=section;
  pageContent.innerHTML=section==='overview'?overviewHTML:sectionTemplates[section]();
  pageContent.dataset.currentSection=section;
  applySearch();
  initIcons();
  window.scrollTo({top:0,behavior:'smooth'});
}
function rerender(){ renderSection(currentSection); }

function fieldGrid(contents){ return `<div class="area-modal-grid">${contents}</div>`; }
function openDialog(kind,id){
  activeWorkflow={kind,id};
  cancelButton.hidden=false;
  saveButton.textContent='Save Update';
  modalEyebrow.textContent='AREA MANAGEMENT';
  let title='Area Management Update';
  let description='Review the record and save your management update.';
  let fields='';

  if(kind==='activity-history'){
    title='Recent Activity History'; description='Review the latest operational updates across assigned branches.'; saveButton.textContent='Done'; cancelButton.hidden=true;
    fields=`<div class="area-activity-list">${activityHistory.map(item=>`<article><span class="dot ${item[3]}">${icon(item[3]==='red'?'triangle-alert':item[3]==='green'?'check':'clock-3')}</span><div><strong>${escapeHtml(item[0])}</strong><p>${escapeHtml(item[1])}</p><small>${escapeHtml(item[2])}</small></div></article>`).join('')}</div>`;
  }
  if(kind==='branch-note'){
    title='Add Branch Note'; description='Record a coaching note or operational instruction for an assigned branch.'; saveButton.textContent='Save Note';
    fields=fieldGrid(`<label>Branch<select id="areaBranch" required>${branchOptions('BR-001')}</select></label><label class="full">Area Manager Note<textarea id="areaNote" rows="5" required placeholder="Enter the observation, instruction, or follow-up..."></textarea></label>`);
  }
  if(kind==='branch-detail'){
    const branch=branches.find(item=>item.id===id); title=branch.name; description=`${branch.id} • ${branch.region} branch overview`; saveButton.textContent='Save Branch Note';
    fields=`<div class="area-detail-summary"><div><span>Branch Manager</span><strong>${escapeHtml(branch.manager)}</strong></div><div><span>Daily Report</span><strong>${escapeHtml(branch.report)}</strong></div><div><span>Performance</span><strong>${branch.score}%</strong></div><div><span>Status</span><strong>${escapeHtml(branch.status)}</strong></div></div><label>Area Manager Note<textarea id="areaNote" rows="5" placeholder="Add a coaching note or follow-up instruction...">${escapeHtml(branch.note)}</textarea></label>`;
  }
  if(kind==='report-date'){
    title='Select Reporting Date'; description='Choose the operating date displayed in Daily Reports.'; saveButton.textContent='Apply Date';
    fields=fieldGrid(`<label>Reporting Date<input id="areaReportDate" type="date" value="${reportDate}" required></label>`);
  }
  if(kind==='report-review'){
    const report=dailyReports.find(item=>item.id===id); title=`${report.branch} Daily Report`; description=`${report.id} • Submitted ${report.submitted}`; saveButton.textContent='Save Review';
    fields=`<div class="area-detail-summary"><div><span>Sales Status</span><strong>${escapeHtml(report.sales)}</strong></div><div><span>Operations</span><strong>${escapeHtml(report.operations)}</strong></div><div class="wide"><span>Store Manager Note</span><strong>${escapeHtml(report.note)}</strong></div></div>${fieldGrid(`<label>Review Status<select id="areaStatus"><option ${report.status==='For Review'?'selected':''}>For Review</option><option ${report.status==='Reviewed'?'selected':''}>Reviewed</option><option ${report.status==='Action Required'?'selected':''}>Action Required</option></select></label><label class="full">Area Manager Note<textarea id="areaNote" rows="5" required placeholder="Enter your review or instruction...">${escapeHtml(report.managerNote)}</textarea></label>`)}`;
  }
  if(kind==='incident-create'){
    title='Log Incident'; description='Create an incident record and assign the initial review owner.'; saveButton.textContent='Create Incident';
    fields=fieldGrid(`<label class="full">Incident Title<input id="areaTitle" required placeholder="Describe the operational incident"></label><label>Branch<select id="areaBranch" required>${branchOptions('BR-008')}</select></label><label>Priority<select id="areaPriority"><option>High</option><option>Medium</option><option>Low</option></select></label><label>Initial Status<select id="areaStatus"><option>Under Investigation</option><option>Action Required</option><option>Monitoring</option></select></label><label>Assigned Owner<input id="areaOwner" required placeholder="Name or responsible team"></label><label class="full">Incident Details<textarea id="areaNote" rows="5" required placeholder="Record what happened and the immediate controls taken..."></textarea></label>`);
  }
  if(kind==='incident-review'){
    const item=incidents.find(incident=>incident.id===id); title=item.title; description=`${item.id} • ${item.branch} • Reported ${item.reported}`; saveButton.textContent='Save Review';
    fields=fieldGrid(`<label>Priority<select id="areaPriority"><option ${item.priority==='High'?'selected':''}>High</option><option ${item.priority==='Medium'?'selected':''}>Medium</option><option ${item.priority==='Low'?'selected':''}>Low</option></select></label><label>Status<select id="areaStatus"><option ${item.status==='Under Investigation'?'selected':''}>Under Investigation</option><option ${item.status==='Action Required'?'selected':''}>Action Required</option><option ${item.status==='Monitoring'?'selected':''}>Monitoring</option><option ${item.status==='Resolved'?'selected':''}>Resolved</option></select></label><label class="full">Corrective Action Owner<input id="areaOwner" value="${escapeHtml(item.owner)}" required></label><label class="full">Area Manager Note<textarea id="areaNote" rows="5" required placeholder="Enter your review, instruction, or closure basis...">${escapeHtml(item.note)}</textarea></label>`);
  }
  if(kind==='action-create'||kind==='action-edit'){
    const item=kind==='action-edit'?correctiveActions.find(action=>action.id===id):{title:'',branch:'BR-008',owner:'',due:'2026-07-21',progress:0,status:'In Progress',note:''};
    const selectedBranch=branches.find(branch=>branch.name===item.branch)?.id||item.branch;
    title=kind==='action-create'?'Create Corrective Action':item.title; description=kind==='action-create'?'Assign an accountable owner, due date, and expected corrective outcome.':`${item.id} • Update ownership and completion progress.`; saveButton.textContent=kind==='action-create'?'Create Action':'Save Action';
    fields=fieldGrid(`<label class="full">Corrective Action<input id="areaTitle" value="${escapeHtml(item.title)}" required placeholder="Describe the required corrective action"></label><label>Branch<select id="areaBranch" required>${branchOptions(selectedBranch)}</select></label><label>Owner<input id="areaOwner" value="${escapeHtml(item.owner)}" required></label><label>Due Date<input id="areaDue" type="date" value="${item.due}" required></label><label>Progress<input id="areaProgress" type="number" min="0" max="100" value="${item.progress}" required></label><label>Status<select id="areaStatus"><option ${item.status==='In Progress'?'selected':''}>In Progress</option><option ${item.status==='Monitoring'?'selected':''}>Monitoring</option><option ${item.status==='Overdue'?'selected':''}>Overdue</option><option ${item.status==='Completed'?'selected':''}>Completed</option></select></label><label class="full">Follow-up Note<textarea id="areaNote" rows="4" placeholder="Add evidence requirements or follow-up guidance...">${escapeHtml(item.note)}</textarea></label>`);
  }
  if(kind==='performance-period'){
    title='Performance Period'; description='Select the reporting month used by the performance dashboard.'; saveButton.textContent='Apply Period';
    fields=fieldGrid(`<label>Reporting Month<input id="areaPeriod" type="month" value="${performancePeriod}" required></label>`);
  }
  if(kind==='performance-compare'){
    title='Branch Performance Comparison'; description=`Composite operational indicators for ${formatMonth(performancePeriod)}.`; saveButton.textContent='Done'; cancelButton.hidden=true;
    fields=`<div class="area-comparison">${performanceRows.map(item=>`<article><div><strong>${escapeHtml(item.branch)}</strong><span>${escapeHtml(item.trend)}</span></div><b>${item.score}%</b><div class="area-comparison-bar"><span style="width:${item.score}%"></span></div></article>`).join('')}</div>`;
  }
  if(kind==='performance-detail'){
    const item=performanceRows.find(row=>row.id===id); title=`${item.branch} Performance`; description=`${formatMonth(performancePeriod)} • ${item.summary}`; saveButton.textContent='Save Coaching Note';
    fields=`<div class="area-detail-summary"><div><span>Composite Score</span><strong>${item.score}%</strong></div><div><span>Reports Submitted</span><strong>${item.reports}</strong></div><div><span>Open Incidents</span><strong>${item.incidents}</strong></div><div><span>Compliance</span><strong>${item.compliance}</strong></div><div class="wide"><span>Trend</span><strong>${escapeHtml(item.trend)}</strong></div></div><label>Coaching / Recognition Note<textarea id="areaNote" rows="5" placeholder="Record the next coaching step or recognition note...">${escapeHtml(item.note)}</textarea></label>`;
  }

  modalEyebrow.textContent=kind.includes('incident')?'RISK & COMPLIANCE':kind.includes('report')?'DAILY OPERATIONS':kind.includes('action')?'IMPROVEMENT TRACKING':kind.includes('performance')?'PERFORMANCE ANALYTICS':kind.includes('branch')?'BRANCH NETWORK':'AREA OPERATIONS';
  modalTitle.textContent=title;
  modalDescription.textContent=description;
  modalFields.innerHTML=fields;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  initIcons();
  window.setTimeout(()=>modalFields.querySelector('input:not([disabled]), select, textarea')?.focus(),0);
}

function closeDialog(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  activeWorkflow=null;
}
function value(id){ return document.getElementById(id)?.value.trim()||''; }
function validateDialog(){
  const invalid=[...modalFields.querySelectorAll('[required]')].find(field=>!field.checkValidity());
  if(invalid){ invalid.reportValidity(); invalid.focus(); return false; }
  return true;
}
function recordActivity(title,description){ activityHistory.unshift([title,description,'Just now','green']); }

function saveDialog(){
  if(!activeWorkflow||!validateDialog()) return;
  const {kind,id}=activeWorkflow;
  if(['activity-history','performance-compare'].includes(kind)){ closeDialog(); return; }
  if(kind==='branch-note'){
    const branch=branches.find(item=>item.id===value('areaBranch')); branch.note=value('areaNote'); recordActivity('Branch note added',`${branch.name}: ${branch.note}`); closeDialog(); showToast('Branch note saved successfully.'); return;
  }
  if(kind==='branch-detail'){
    const branch=branches.find(item=>item.id===id); branch.note=value('areaNote'); recordActivity('Branch note updated',`${branch.name} received a management note.`); closeDialog(); showToast('Branch details updated successfully.'); return;
  }
  if(kind==='report-date'){ reportDate=value('areaReportDate'); closeDialog(); rerender(); showToast(`Showing reports for ${formatDate(reportDate)}.`); return; }
  if(kind==='report-review'){
    const report=dailyReports.find(item=>item.id===id); report.status=value('areaStatus'); report.managerNote=value('areaNote'); recordActivity('Daily report reviewed',`${report.branch} was marked ${report.status}.`); closeDialog(); rerender(); showToast('Daily report review saved successfully.'); return;
  }
  if(kind==='incident-create'){
    const branch=branches.find(item=>item.id===value('areaBranch')); const incident={id:`INC-2026-${String(720+incidents.length).padStart(4,'0')}`,title:value('areaTitle'),branch:branch.name,reported:'Just now',priority:value('areaPriority'),status:value('areaStatus'),owner:value('areaOwner'),note:value('areaNote')}; incidents.unshift(incident); recordActivity('New incident logged',`${incident.title} — ${incident.branch}.`); closeDialog(); rerender(); showToast(`${incident.id} created successfully.`); return;
  }
  if(kind==='incident-review'){
    const incident=incidents.find(item=>item.id===id); Object.assign(incident,{priority:value('areaPriority'),status:value('areaStatus'),owner:value('areaOwner'),note:value('areaNote')}); recordActivity('Incident review updated',`${incident.id} was marked ${incident.status}.`); closeDialog(); rerender(); showToast('Incident review saved successfully.'); return;
  }
  if(kind==='action-create'){
    const branch=branches.find(item=>item.id===value('areaBranch')); const action={id:`CA-2026-${String(42+correctiveActions.length).padStart(3,'0')}`,title:value('areaTitle'),branch:branch.name,owner:value('areaOwner'),due:value('areaDue'),progress:Number(value('areaProgress')),status:value('areaStatus'),note:value('areaNote')}; correctiveActions.unshift(action); recordActivity('Corrective action created',`${action.id} assigned to ${action.owner}.`); closeDialog(); rerender(); showToast(`${action.id} created successfully.`); return;
  }
  if(kind==='action-edit'){
    const action=correctiveActions.find(item=>item.id===id); const branch=branches.find(item=>item.id===value('areaBranch')); Object.assign(action,{title:value('areaTitle'),branch:branch.name,owner:value('areaOwner'),due:value('areaDue'),progress:Number(value('areaProgress')),status:value('areaStatus'),note:value('areaNote')}); recordActivity('Corrective action updated',`${action.id} is ${action.progress}% complete.`); closeDialog(); rerender(); showToast('Corrective action updated successfully.'); return;
  }
  if(kind==='performance-period'){ performancePeriod=value('areaPeriod'); closeDialog(); rerender(); showToast(`Performance period changed to ${formatMonth(performancePeriod)}.`); return; }
  if(kind==='performance-detail'){
    const item=performanceRows.find(row=>row.id===id); item.note=value('areaNote'); recordActivity('Performance note saved',`${item.branch} received a coaching or recognition note.`); closeDialog(); showToast('Performance note saved successfully.');
  }
}

document.getElementById('menuBtn').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.querySelectorAll('.nav-item[data-section]').forEach(item=>item.addEventListener('click',()=>{
  document.querySelectorAll('.nav-item[data-section]').forEach(nav=>nav.classList.remove('active'));
  item.classList.add('active'); sidebar.classList.remove('open'); renderSection(item.dataset.section);
}));

document.addEventListener('click',event=>{
  const opener=event.target.closest('[data-open-section]');
  if(opener){ document.querySelector(`.nav-item[data-section="${opener.dataset.openSection}"]`)?.click(); return; }
  const legacyIncident=event.target.closest('[data-incident]');
  if(legacyIncident){ const incident=incidents.find(item=>item.title===legacyIncident.dataset.incident); if(incident) openDialog('incident-review',incident.id); return; }
  const action=event.target.closest('[data-area-action]');
  if(action){
    if(action.dataset.areaAction==='send-reminder'){
      const report=dailyReports.find(item=>item.id===action.dataset.id); report.reminderSent=true; recordActivity('Report reminder sent',`${report.branch} was reminded to submit ${report.id}.`); rerender(); showToast(`Reminder sent to ${report.branch}.`); return;
    }
    openDialog(action.dataset.areaAction,action.dataset.id); return;
  }
  if(event.target.closest('.save-settings')) showToast('Settings updated successfully.');
});

document.getElementById('closeModal').addEventListener('click',closeDialog);
cancelButton.addEventListener('click',closeDialog);
saveButton.addEventListener('click',saveDialog);
modal.addEventListener('click',event=>{ if(event.target===modal) closeDialog(); });
document.addEventListener('keydown',event=>{ if(event.key==='Escape'&&modal.classList.contains('open')) closeDialog(); });
document.getElementById('globalSearch').addEventListener('input',event=>applySearch(event.target.value));
document.getElementById('logoutBtn').addEventListener('click',()=>{ localStorage.removeItem('b2bUserRole'); localStorage.removeItem('b2bUserName'); window.location.href='index.html'; });
initIcons();
