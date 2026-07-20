const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modalTitle');
const note = document.getElementById('managerNote');
const toast = document.getElementById('toast');
const pageContent = document.querySelector('.page-content');
const overviewHTML = pageContent.innerHTML;

const sectionTemplates = {
  branches: `
    <div class="welcome-row"><div><p class="eyebrow">BRANCH NETWORK</p><h1>Branches</h1><p>Monitor all franchise branches assigned to Bea Hernandez.</p></div><button class="primary-btn compact">+ Add Branch Note</button></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="store"></i></div><div><span>Total Branches</span><strong>8</strong><small>All currently active</small></div></article>
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Strong Performing</span><strong>5</strong><small>Score of 90% or above</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="clock-3"></i></div><div><span>Reports Pending</span><strong>2</strong><small>Due before 5:00 PM</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="circle-alert"></i></div><div><span>Needs Attention</span><strong>1</strong><small>Pasig Capitol</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Assigned Franchise Branches</h2><p>Operational status, manager, and latest report</p></div></div><div class="table-wrap"><table><thead><tr><th>Branch</th><th>Branch Manager</th><th>Daily Report</th><th>Performance</th><th>Status</th></tr></thead><tbody>
      <tr data-search="BGC High Street Taguig Andrea Cruz"><td><strong>BGC High Street</strong><span>Branch 001 • Taguig</span></td><td>Andrea Cruz</td><td>Submitted 8:42 AM</td><td>96%</td><td><span class="status strong">Strong</span></td></tr>
      <tr data-search="Makati Central Makati Luis Santos"><td><strong>Makati Central</strong><span>Branch 003 • Makati</span></td><td>Luis Santos</td><td>Submitted 9:05 AM</td><td>94%</td><td><span class="status strong">Strong</span></td></tr>
      <tr data-search="Quezon Avenue Quezon City Camille Reyes"><td><strong>Quezon Avenue</strong><span>Branch 006 • Quezon City</span></td><td>Camille Reyes</td><td>Submitted 10:10 AM</td><td>91%</td><td><span class="status good">Good</span></td></tr>
      <tr data-search="Pasig Capitol Pasig Marco Lim"><td><strong>Pasig Capitol</strong><span>Branch 008 • Pasig</span></td><td>Marco Lim</td><td>Pending</td><td>78%</td><td><span class="status attention">Needs Attention</span></td></tr>
      <tr data-search="Ortigas Center Mandaluyong Nina Flores"><td><strong>Ortigas Center</strong><span>Branch 004 • Mandaluyong</span></td><td>Nina Flores</td><td>Pending</td><td>87%</td><td><span class="status good">Good</span></td></tr>
    </tbody></table></div></section>`,
  reports: `
    <div class="welcome-row"><div><p class="eyebrow">DAILY OPERATIONS</p><h1>Daily Reports</h1><p>Review branch submissions, sales summaries, staffing, and operational notes.</p></div><div class="date-control"><i data-lucide="calendar-days"></i><span>July 20, 2026</span></div></div>
    <div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="file-check-2"></i></div><div><span>Submitted</span><strong>6</strong><small>Out of 8 branches</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="hourglass"></i></div><div><span>Pending</span><strong>2</strong><small>Ortigas and Pasig</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="receipt-text"></i></div><div><span>For Review</span><strong>3</strong><small>Flagged operational notes</small></div></article><article class="stat-card"><div class="stat-icon green"><i data-lucide="circle-check-big"></i></div><div><span>Reviewed</span><strong>3</strong><small>Completed by Bea</small></div></article></div>
    <section class="panel"><div class="panel-heading"><div><h2>Today's Branch Reports</h2><p>Click Review to inspect a submitted report</p></div></div><div class="table-wrap"><table><thead><tr><th>Branch</th><th>Submitted</th><th>Sales Status</th><th>Operations</th><th>Review Status</th><th></th></tr></thead><tbody>
    <tr data-search="BGC High Street submitted reviewed"><td><strong>BGC High Street</strong><span>DR-0720-001</span></td><td>8:42 AM</td><td>Above target</td><td>No issues</td><td><span class="table-status monitoring">Reviewed</span></td><td><button class="review-btn report-review" data-incident="BGC High Street Daily Report">Open</button></td></tr>
    <tr data-search="Makati Central submitted for review"><td><strong>Makati Central</strong><span>DR-0720-003</span></td><td>9:05 AM</td><td>On target</td><td>Minor staffing note</td><td><span class="table-status investigating">For Review</span></td><td><button class="review-btn report-review" data-incident="Makati Central Daily Report">Review</button></td></tr>
    <tr data-search="Quezon Avenue submitted for review"><td><strong>Quezon Avenue</strong><span>DR-0720-006</span></td><td>10:10 AM</td><td>On target</td><td>POS issue monitored</td><td><span class="table-status investigating">For Review</span></td><td><button class="review-btn report-review" data-incident="Quezon Avenue Daily Report">Review</button></td></tr>
    <tr data-search="Pasig Capitol pending"><td><strong>Pasig Capitol</strong><span>DR-0720-008</span></td><td>Pending</td><td>—</td><td>—</td><td><span class="table-status action">Pending</span></td><td><button class="review-btn">Send Reminder</button></td></tr>
    </tbody></table></div></section>`,
  incidents: `
    <div class="welcome-row"><div><p class="eyebrow">RISK &amp; COMPLIANCE</p><h1>Incident Logs</h1><p>Track reported operational incidents and management decisions.</p></div><button class="primary-btn compact">+ Log Incident</button></div>
    <div class="alert-banner"><div class="alert-icon"><i data-lucide="triangle-alert"></i></div><div><strong>2 high-priority incidents need action</strong><span>Review ownership and corrective steps before end of day.</span></div></div>
    <section class="panel"><div class="panel-heading"><div><h2>Incident Register</h2><p>Open, monitored, and recently resolved incidents</p></div></div><div class="table-wrap"><table><thead><tr><th>Incident</th><th>Branch</th><th>Reported</th><th>Priority</th><th>Status</th><th></th></tr></thead><tbody>
    <tr data-search="Freezer temperature fluctuation Pasig Capitol high"><td><strong>Freezer temperature fluctuation</strong><span>INC-2026-0719</span></td><td>Pasig Capitol</td><td>Today, 9:12 AM</td><td><span class="priority high">High</span></td><td><span class="table-status investigating">Under Investigation</span></td><td><button class="review-btn" data-incident="Freezer temperature fluctuation">Review</button></td></tr>
    <tr data-search="Delayed opening staffing Ortigas Center high"><td><strong>Delayed opening due to staffing</strong><span>INC-2026-0718</span></td><td>Ortigas Center</td><td>Yesterday, 7:45 AM</td><td><span class="priority high">High</span></td><td><span class="table-status action">Action Required</span></td><td><button class="review-btn" data-incident="Delayed opening due to staffing">Review</button></td></tr>
    <tr data-search="POS terminal error Quezon Avenue medium"><td><strong>POS terminal intermittent error</strong><span>INC-2026-0716</span></td><td>Quezon Avenue</td><td>July 18, 2026</td><td><span class="priority medium">Medium</span></td><td><span class="table-status monitoring">Monitoring</span></td><td><button class="review-btn" data-incident="POS terminal intermittent error">Review</button></td></tr>
    </tbody></table></div></section>`,
  actions: `
    <div class="welcome-row"><div><p class="eyebrow">IMPROVEMENT TRACKING</p><h1>Corrective Actions</h1><p>Follow up action plans assigned after incidents and branch reviews.</p></div><button class="primary-btn compact">+ Create Action</button></div>
    <div class="stats-grid"><article class="stat-card"><div class="stat-icon red"><i data-lucide="clipboard-list"></i></div><div><span>Open Actions</span><strong>7</strong><small>Across 4 branches</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="alarm-clock"></i></div><div><span>Overdue</span><strong>1</strong><small>Immediate follow-up</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="loader-circle"></i></div><div><span>In Progress</span><strong>4</strong><small>Owners actively updating</small></div></article><article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Completed</span><strong>12</strong><small>This month</small></div></article></div>
    <section class="panel"><div class="panel-heading"><div><h2>Action Plan Tracker</h2><p>Ownership, due dates, and progress</p></div></div><div class="table-wrap"><table><thead><tr><th>Corrective Action</th><th>Branch</th><th>Owner</th><th>Due Date</th><th>Progress</th><th>Status</th></tr></thead><tbody>
    <tr data-search="Inspect freezer sensors Pasig"><td><strong>Inspect and recalibrate freezer sensors</strong><span>CA-2026-041</span></td><td>Pasig Capitol</td><td>Marco Lim</td><td>July 20</td><td>40%</td><td><span class="table-status action">Overdue</span></td></tr>
    <tr data-search="staffing contingency Ortigas"><td><strong>Submit opening-shift staffing contingency plan</strong><span>CA-2026-039</span></td><td>Ortigas Center</td><td>Nina Flores</td><td>July 21</td><td>70%</td><td><span class="table-status investigating">In Progress</span></td></tr>
    <tr data-search="POS diagnostics Quezon"><td><strong>Complete POS terminal diagnostics</strong><span>CA-2026-037</span></td><td>Quezon Avenue</td><td>Camille Reyes</td><td>July 22</td><td>85%</td><td><span class="table-status monitoring">Monitoring</span></td></tr>
    </tbody></table></div></section>`,
  performance: `
    <div class="welcome-row"><div><p class="eyebrow">PERFORMANCE ANALYTICS</p><h1>Performance</h1><p>Compare branch operations and identify improvement opportunities.</p></div><div class="date-control"><i data-lucide="calendar-range"></i><span>July 2026</span></div></div>
    <div class="stats-grid"><article class="stat-card"><div class="stat-icon green"><i data-lucide="trending-up"></i></div><div><span>Area Average</span><strong>91%</strong><small><b>+3.2%</b> vs. last month</small></div></article><article class="stat-card"><div class="stat-icon red"><i data-lucide="trophy"></i></div><div><span>Top Branch</span><strong>96%</strong><small>BGC High Street</small></div></article><article class="stat-card"><div class="stat-icon yellow"><i data-lucide="star"></i></div><div><span>Target Met</span><strong>6/8</strong><small>Two branches below 90%</small></div></article><article class="stat-card"><div class="stat-icon orange"><i data-lucide="arrow-up-right"></i></div><div><span>Most Improved</span><strong>+8%</strong><small>Quezon Avenue</small></div></article></div>
    <div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><h2>Branch Ranking</h2><p>Composite score from reports, incidents, and compliance</p></div></div><div class="branch-list">
      <article class="branch-row"><div class="branch-rank">1</div><div class="branch-name"><strong>BGC High Street</strong><span>Excellent operational consistency</span></div><div class="score"><strong>96%</strong><div><span style="width:96%"></span></div></div><span class="status strong">Strong</span></article>
      <article class="branch-row"><div class="branch-rank">2</div><div class="branch-name"><strong>Makati Central</strong><span>Stable month-on-month results</span></div><div class="score"><strong>94%</strong><div><span style="width:94%"></span></div></div><span class="status strong">Strong</span></article>
      <article class="branch-row"><div class="branch-rank">3</div><div class="branch-name"><strong>Quezon Avenue</strong><span>Highest monthly improvement</span></div><div class="score"><strong>91%</strong><div><span style="width:91%"></span></div></div><span class="status good">Good</span></article>
      <article class="branch-row"><div class="branch-rank">8</div><div class="branch-name"><strong>Pasig Capitol</strong><span>Incident resolution needs attention</span></div><div class="score"><strong>78%</strong><div><span style="width:78%"></span></div></div><span class="status attention">Needs Attention</span></article>
    </div></section><section class="panel"><div class="panel-heading"><div><h2>Area Manager Focus</h2><p>Recommended priorities</p></div></div><div class="timeline"><div class="timeline-item"><span class="dot red"><i data-lucide="triangle-alert"></i></span><div><strong>Resolve Pasig equipment incident</strong><p>Confirm technician visit and food-safety controls.</p><small>High priority</small></div></div><div class="timeline-item"><span class="dot yellow"><i data-lucide="users"></i></span><div><strong>Review Ortigas staffing plan</strong><p>Prevent another delayed branch opening.</p><small>Due tomorrow</small></div></div><div class="timeline-item"><span class="dot green"><i data-lucide="award"></i></span><div><strong>Recognize BGC performance</strong><p>Share branch practices with the area network.</p><small>Recommended</small></div></div></div></section></div>`,
  settings: `
    <div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Bea Hernandez's Area Manager dashboard preferences.</p></div></div>
    <div class="settings-grid"><section class="panel settings-card"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in reports and management reviews</p></div></div><div class="settings-form"><label>Full Name</label><input value="Bea Hernandez"><label>Role</label><input value="Area Manager" disabled><label>Email Address</label><input value="bea.hernandez@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel settings-card"><div class="panel-heading"><div><h2>Notifications</h2><p>Select the updates you want to receive</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> High-priority incident alerts</label><label><input type="checkbox" checked> Missing daily report reminders</label><label><input type="checkbox" checked> Corrective action due-date alerts</label><label><input type="checkbox"> Weekly performance summary email</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`
};

function initIcons(){ if (window.lucide) lucide.createIcons(); }
function openReview(title) { modalTitle.textContent = title; note.value = ''; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); }
function closeReview() { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
function showToast(message='Changes saved successfully.') { toast.querySelector('span').textContent=message; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),2600); }
function renderSection(section){
  pageContent.innerHTML = section === 'overview' ? overviewHTML : sectionTemplates[section];
  pageContent.dataset.currentSection = section;
  initIcons();
  window.scrollTo({top:0,behavior:'smooth'});
}

document.getElementById('menuBtn').addEventListener('click', () => sidebar.classList.toggle('open'));
document.querySelectorAll('.nav-item[data-section]').forEach(item => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item[data-section]').forEach(nav => nav.classList.remove('active'));
  item.classList.add('active'); sidebar.classList.remove('open'); renderSection(item.dataset.section);
}));

document.addEventListener('click', e => {
  const opener=e.target.closest('[data-open-section]');
  if(opener){ const target=document.querySelector(`.nav-item[data-section="${opener.dataset.openSection}"]`); if(target) target.click(); }
  const review=e.target.closest('[data-incident]'); if(review) openReview(review.dataset.incident);
  if(e.target.closest('.save-settings')) showToast('Settings updated successfully.');
});

document.getElementById('closeModal').addEventListener('click', closeReview);
document.getElementById('cancelModal').addEventListener('click', closeReview);
modal.addEventListener('click', event => { if (event.target === modal) closeReview(); });
document.getElementById('saveReview').addEventListener('click', () => { closeReview(); showToast('Review saved successfully.'); });
document.getElementById('globalSearch').addEventListener('input', event => { const query=event.target.value.trim().toLowerCase(); document.querySelectorAll('[data-search]').forEach(item=>item.classList.toggle('hidden-by-search',query && !item.dataset.search.toLowerCase().includes(query))); });
document.getElementById('logoutBtn').addEventListener('click', () => { localStorage.removeItem('b2bUserRole'); localStorage.removeItem('b2bUserName'); window.location.href='index.html'; });
initIcons();
