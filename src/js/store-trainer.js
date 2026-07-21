const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modalTitle');
const note = document.getElementById('trainerNote');
const toast = document.getElementById('toast');
const pageContent = document.querySelector('.page-content');
const overviewHTML = pageContent.innerHTML;

const sectionTemplates = {
  batches: `
    <div class="welcome-row"><div><p class="eyebrow">TRAINING MANAGEMENT</p><h1>Training Batches</h1><p>View the employee batches assigned to Michael Dela Cruz.</p></div><button class="primary-btn compact">+ Add Batch Note</button></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="users"></i></div><div><span>Assigned Batches</span><strong>4</strong><small>For current store openings</small></div></article>
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="play-circle"></i></div><div><span>Active Batches</span><strong>2</strong><small>Currently undergoing training</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="calendar-clock"></i></div><div><span>Scheduled</span><strong>1</strong><small>Beginning next week</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="triangle-alert"></i></div><div><span>Needs Attention</span><strong>1</strong><small>Below expected progress</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Assigned Training Batches</h2><p>Training schedule, trainee count, and completion progress</p></div></div><div class="table-wrap"><table><thead><tr><th>Training Batch</th><th>Branch</th><th>Trainees</th><th>Training Period</th><th>Progress</th><th>Status</th></tr></thead><tbody>
      <tr data-search="Taft Crew Batch A Manila 12 trainees ongoing"><td><strong>Taft Crew Batch A</strong><span>TRN-2607-A</span></td><td>Taft, Manila</td><td>12</td><td>July 15–29</td><td>75%</td><td><span class="status good">Ongoing</span></td></tr>
      <tr data-search="Makati Crew Batch B 12 trainees in progress"><td><strong>Makati Crew Batch B</strong><span>TRN-2607-B</span></td><td>Makati Central</td><td>12</td><td>July 18–August 1</td><td>60%</td><td><span class="status good">In Progress</span></td></tr>
      <tr data-search="Quezon Crew Batch D 11 trainees needs attention"><td><strong>Quezon Crew Batch D</strong><span>TRN-2607-D</span></td><td>Quezon Avenue</td><td>11</td><td>July 16–30</td><td>45%</td><td><span class="status attention">Needs Attention</span></td></tr>
      <tr data-search="Pasay Crew Batch C completed certified"><td><strong>Pasay Crew Batch C</strong><span>TRN-2606-C</span></td><td>Pasay Central</td><td>10</td><td>June 25–July 10</td><td>100%</td><td><span class="status strong">Completed</span></td></tr>
    </tbody></table></div></section>`,

  sessions: `
    <div class="welcome-row"><div><p class="eyebrow">TRAINING SCHEDULE</p><h1>Training Sessions</h1><p>Manage scheduled sessions and record trainee attendance.</p></div><div class="date-control"><i data-lucide="calendar-days"></i><span>July 21, 2026</span></div></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="calendar"></i></div><div><span>Sessions Today</span><strong>2</strong><small>Kitchen and service training</small></div></article>
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="circle-check-big"></i></div><div><span>Completed</span><strong>8</strong><small>This training cycle</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="clock-3"></i></div><div><span>Upcoming</span><strong>2</strong><small>Scheduled this week</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="user-x"></i></div><div><span>Absences</span><strong>2</strong><small>Require follow-up</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Scheduled Training Sessions</h2><p>Open a session to record attendance and completion</p></div></div><div class="table-wrap"><table><thead><tr><th>Session</th><th>Batch</th><th>Schedule</th><th>Attendance</th><th>Status</th><th></th></tr></thead><tbody>
      <tr data-search="Kitchen Operations Taft Crew Batch A today"><td><strong>Kitchen Operations</strong><span>SES-2607-018</span></td><td>Taft Crew Batch A</td><td>Today, 9:00 AM</td><td>11/12 Present</td><td><span class="table-status monitoring">Completed</span></td><td><button class="review-btn session-btn">View Attendance</button></td></tr>
      <tr data-search="Customer Service Makati Crew Batch B today ongoing"><td><strong>Customer Service Simulation</strong><span>SES-2607-019</span></td><td>Makati Crew Batch B</td><td>Today, 2:00 PM</td><td>12 Expected</td><td><span class="table-status investigating">Scheduled</span></td><td><button class="review-btn session-btn">Open Session</button></td></tr>
      <tr data-search="Food Safety Quezon Crew Batch D tomorrow"><td><strong>Food Safety and Cleanliness</strong><span>SES-2607-020</span></td><td>Quezon Crew Batch D</td><td>July 22, 10:00 AM</td><td>11 Expected</td><td><span class="table-status action">Upcoming</span></td><td><button class="review-btn session-btn">View</button></td></tr>
    </tbody></table></div></section>`,

  assessments: `
    <div class="welcome-row"><div><p class="eyebrow">COMPETENCY EVALUATION</p><h1>Assessments</h1><p>Evaluate trainee performance using standardized criteria.</p></div><button class="primary-btn compact">+ New Assessment</button></div>
    <div class="alert-banner"><div class="alert-icon"><i data-lucide="clipboard-alert"></i></div><div><strong>3 assessments remain incomplete</strong><span>Complete the evaluations before final certification.</span></div></div>
    <section class="panel"><div class="panel-heading"><div><h2>Competency Assessment List</h2><p>Kitchen, service, and operational competency results</p></div></div><div class="table-wrap"><table><thead><tr><th>Trainee</th><th>Batch</th><th>Kitchen</th><th>Customer Service</th><th>Overall Result</th><th></th></tr></thead><tbody>
      <tr data-search="Nicole Garcia Taft pending assessment"><td><strong>Nicole Garcia</strong><span>EMP-26124 • Service Crew</span></td><td>Taft Crew Batch A</td><td>Pending</td><td>Pending</td><td><span class="table-status action">Not Assessed</span></td><td><button class="review-btn" data-trainee="Nicole Garcia">Assess</button></td></tr>
      <tr data-search="Andrea Reyes Makati passed assessment"><td><strong>Andrea Reyes</strong><span>EMP-26121 • Service Crew</span></td><td>Makati Crew Batch B</td><td>88%</td><td>92%</td><td><span class="table-status monitoring">Passed</span></td><td><button class="review-btn" data-trainee="Andrea Reyes">Review</button></td></tr>
      <tr data-search="Joshua Lim Taft requires coaching"><td><strong>Joshua Lim</strong><span>EMP-26127 • Kitchen Crew</span></td><td>Taft Crew Batch A</td><td>68%</td><td>81%</td><td><span class="table-status investigating">Requires Coaching</span></td><td><button class="review-btn" data-trainee="Joshua Lim">Review</button></td></tr>
      <tr data-search="Carlo Mendoza Makati passed"><td><strong>Carlo Mendoza</strong><span>EMP-26118 • Kitchen Crew</span></td><td>Makati Crew Batch B</td><td>91%</td><td>87%</td><td><span class="table-status monitoring">Passed</span></td><td><button class="review-btn" data-trainee="Carlo Mendoza">Review</button></td></tr>
    </tbody></table></div></section>`,
    
    certifications: `
    <div class="welcome-row"><div><p class="eyebrow">DEPLOYMENT ELIGIBILITY</p><h1>Certifications</h1><p>Confirm whether employees are certified or require retraining.</p></div></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Certified</span><strong>21</strong><small>Eligible for deployment</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="clock-3"></i></div><div><span>For Certification</span><strong>3</strong><small>Awaiting final decision</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="rotate-ccw"></i></div><div><span>Requires Retraining</span><strong>2</strong><small>Additional coaching needed</small></div></article>
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="shield-alert"></i></div><div><span>Not Eligible</span><strong>5</strong><small>Certification incomplete</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Employee Certification Status</h2><p>Only certified employees may be deployed to active stores</p></div></div><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Batch</th><th>Assessment Score</th><th>Certification Status</th><th>Deployment</th><th></th></tr></thead><tbody>
      <tr data-search="Andrea Reyes awaiting certification eligible"><td><strong>Andrea Reyes</strong><span>EMP-26121 • Service Crew</span></td><td>Makati Crew Batch B</td><td>90%</td><td><span class="table-status investigating">For Certification</span></td><td>Not Yet Eligible</td><td><button class="review-btn certify-btn" data-name="Andrea Reyes">Certify</button></td></tr>
      <tr data-search="Carlo Mendoza certified deployment ready"><td><strong>Carlo Mendoza</strong><span>EMP-26118 • Kitchen Crew</span></td><td>Makati Crew Batch B</td><td>89%</td><td><span class="table-status monitoring">Certified</span></td><td>Ready for Deployment</td><td><button class="review-btn">View</button></td></tr>
      <tr data-search="Joshua Lim requires retraining not eligible"><td><strong>Joshua Lim</strong><span>EMP-26127 • Kitchen Crew</span></td><td>Taft Crew Batch A</td><td>74%</td><td><span class="table-status action">Requires Retraining</span></td><td>Not Eligible</td><td><button class="review-btn">Assign Coaching</button></td></tr>
    </tbody></table></div></section>`,

  progress: `
    <div class="welcome-row"><div><p class="eyebrow">TRAINING ANALYTICS</p><h1>Training Progress</h1><p>Monitor completion rates, certification results, and coaching needs.</p></div><div class="date-control"><i data-lucide="calendar-range"></i><span>July 2026</span></div></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="trending-up"></i></div><div><span>Overall Completion</span><strong>82%</strong><small><b>+6%</b> from last month</small></div></article>
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="badge-check"></i></div><div><span>Certification Rate</span><strong>88%</strong><small>21 certified trainees</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="users"></i></div><div><span>Coaching Needed</span><strong>4</strong><small>Across two batches</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="file-check-2"></i></div><div><span>Reports Submitted</span><strong>3/4</strong><small>One report still pending</small></div></article>
    </div>
    <div class="dashboard-grid"><section class="panel"><div class="panel-heading"><div><h2>Batch Completion Ranking</h2><p>Current completion percentage by training batch</p></div></div><div class="branch-list">
      <article class="branch-row"><div class="branch-rank">1</div><div class="branch-name"><strong>Pasay Crew Batch C</strong><span>Training and certification completed</span></div><div class="score"><strong>100%</strong><div><span style="width:100%"></span></div></div><span class="status strong">Completed</span></article>
      <article class="branch-row"><div class="branch-rank">2</div><div class="branch-name"><strong>Taft Crew Batch A</strong><span>Assessment stage in progress</span></div><div class="score"><strong>75%</strong><div><span style="width:75%"></span></div></div><span class="status good">Ongoing</span></article>
      <article class="branch-row"><div class="branch-rank">3</div><div class="branch-name"><strong>Makati Crew Batch B</strong><span>Service simulations ongoing</span></div><div class="score"><strong>60%</strong><div><span style="width:60%"></span></div></div><span class="status good">In Progress</span></article>
      <article class="branch-row"><div class="branch-rank">4</div><div class="branch-name"><strong>Quezon Crew Batch D</strong><span>Attendance and coaching concerns</span></div><div class="score"><strong>45%</strong><div><span style="width:45%"></span></div></div><span class="status attention">Needs Attention</span></article>
    </div></section><section class="panel"><div class="panel-heading"><div><h2>Trainer Focus</h2><p>Recommended training priorities</p></div></div><div class="timeline">
      <div class="timeline-item"><span class="dot red"><i data-lucide="clipboard-alert"></i></span><div><strong>Complete pending assessments</strong><p>Three trainees still need competency evaluation.</p><small>High priority</small></div></div>
      <div class="timeline-item"><span class="dot yellow"><i data-lucide="rotate-ccw"></i></span><div><strong>Coach trainees below standard</strong><p>Review kitchen simulation results and schedule coaching.</p><small>Due this week</small></div></div>
      <div class="timeline-item"><span class="dot green"><i data-lucide="file-check-2"></i></span><div><strong>Submit completion report</strong><p>Finalize the Pasay Crew Batch C training report.</p><small>Ready for submission</small></div></div>
    </div></section></div>`,

  settings: `
    <div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Michael Dela Cruz's Store Trainer dashboard preferences.</p></div></div>
    <div class="settings-grid"><section class="panel settings-card"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in training and certification reports</p></div></div><div class="settings-form"><label>Full Name</label><input value="Michael Dela Cruz"><label>Role</label><input value="Store Trainer" disabled><label>Email Address</label><input value="michael.delacruz@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel settings-card"><div class="panel-heading"><div><h2>Notifications</h2><p>Select the training updates you want to receive</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> Upcoming training session reminders</label><label><input type="checkbox" checked> Pending assessment alerts</label><label><input type="checkbox" checked> Certification deadline reminders</label><label><input type="checkbox"> Weekly training progress summary</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`
};

function initIcons() {
  if (window.lucide) lucide.createIcons();
}

function openReview(title) {
  modalTitle.textContent = title;
  note.value = '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function closeReview() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function showToast(message = 'Changes saved successfully.') {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderSection(section) {
  pageContent.innerHTML =
    section === 'overview'
      ? overviewHTML
      : sectionTemplates[section];

  pageContent.dataset.currentSection = section;

  initIcons();

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

document
  .getElementById('menuBtn')
  .addEventListener('click', () => sidebar.classList.toggle('open'));

document
  .querySelectorAll('.nav-item[data-section]')
  .forEach(item =>
    item.addEventListener('click', () => {
      document
        .querySelectorAll('.nav-item[data-section]')
        .forEach(nav => nav.classList.remove('active'));

      item.classList.add('active');
      sidebar.classList.remove('open');

      renderSection(item.dataset.section);
    })
  );

document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open-section]');

  if (opener) {
    const target = document.querySelector(
      `.nav-item[data-section="${opener.dataset.openSection}"]`
    );

    if (target) target.click();
  }

  const trainee = e.target.closest('[data-trainee]');

  if (trainee) {
    openReview(
      `${trainee.dataset.trainee} Assessment`
    );
  }

  const certify = e.target.closest('.certify-btn');

  if (certify) {
    showToast('Employee certified successfully.');
  }

  if (e.target.closest('.session-btn')) {
    showToast('Training session opened.');
  }

  if (e.target.closest('.save-settings')) {
    showToast('Settings updated successfully.');
  }
});

document
  .getElementById('closeModal')
  .addEventListener('click', closeReview);

document
  .getElementById('cancelModal')
  .addEventListener('click', closeReview);

modal.addEventListener('click', event => {
  if (event.target === modal) closeReview();
});

document
  .getElementById('saveReview')
  .addEventListener('click', () => {
    closeReview();
    showToast('Assessment saved successfully.');
  });

document
  .getElementById('globalSearch')
  .addEventListener('input', event => {
    const query = event.target.value
      .trim()
      .toLowerCase();

    document
      .querySelectorAll('[data-search]')
      .forEach(item =>
        item.classList.toggle(
          'hidden-by-search',
          query &&
            !item.dataset.search
              .toLowerCase()
              .includes(query)
        )
      );
  });

document
  .getElementById('logoutBtn')
  .addEventListener('click', () => {
    localStorage.removeItem('b2bUserRole');
    localStorage.removeItem('b2bUserName');
    window.location.href = 'index.html';
  });

initIcons();