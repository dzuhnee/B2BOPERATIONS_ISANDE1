const sidebar = document.getElementById('sidebar');
const modal = document.getElementById('reviewModal');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const note = document.getElementById('trainerNote');
const toast = document.getElementById('toast');
const pageContent = document.querySelector('.page-content');
const overviewHTML = pageContent.innerHTML;

// Tracks what the review modal is currently being used for, since it is
// reused across "Assess", "Add Batch Note", "New Assessment", "Assign Coaching", and Sessions.
let modalMode = null;
let modalContext = {};

// Trainee rosters per session, used to power "View Attendance" / "Open Session" / "View".
// mode: 'completed' (already happened, has attendance), 'scheduled' (happening today, take attendance now),
// 'upcoming' (hasn't happened yet, show expected list only). Mutated in place once attendance is taken.
const sessionRosters = {
  'Kitchen Operations': {
    batch: 'Pulilan Crew Batch A',
    mode: 'completed',
    trainees: ['Nicole Garcia', 'Joshua Lim', 'Paolo Cruz', 'Miguel Santos', 'Bea Fernandez', 'Ramon Torres', 'Ella Bautista', 'Kevin Aquino', 'Grace Villanueva', 'Mark Ramos', 'Jasmine Cruz', 'Louie Domingo'],
    absentees: ['Paolo Cruz']
  },
  'Customer Service Simulation': {
    batch: 'Calumpit Crew Batch B',
    mode: 'scheduled',
    trainees: ['Andrea Reyes', 'Carlo Mendoza', 'Patricia Gomez', 'Julian Reyes', 'Samantha Lopez', 'Enzo Marquez', 'Faith Navarro', 'Rico Salazar', 'Dianne Castillo', 'Aldrin Pascual', 'Kristine Ocampo', 'Noel Rivera'],
    absentees: []
  },
  'Food Safety and Cleanliness': {
    batch: 'Malolos Crew Batch D',
    mode: 'upcoming',
    trainees: ['Trisha Manalo', 'Kyle Espino', 'Angela Ferrer', 'Vince Alonzo', 'Camille Sarmiento', 'Renz Buenaventura', 'Joy Delos Santos', 'Arnel Tolentino', 'Michelle Uy', 'Paul Beltran', 'Ivy Cabrera'],
    absentees: []
  }
};

const sectionTemplates = {
  batches: `
    <div class="welcome-row"><div><p class="eyebrow">TRAINING MANAGEMENT</p><h1>Training Batches</h1><p>View the employee batches assigned to Michael Dela Cruz.</p></div><button class="primary-btn compact add-batch-note-btn">+ Add Batch Note</button></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="users"></i></div><div><span>Assigned Batches</span><strong>4</strong><small>For current store openings</small></div></article>
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="play-circle"></i></div><div><span>Active Batches</span><strong>2</strong><small>Currently undergoing training</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="calendar-clock"></i></div><div><span>Scheduled</span><strong>1</strong><small>Beginning next week</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="triangle-alert"></i></div><div><span>Needs Attention</span><strong>1</strong><small>Below expected progress</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Assigned Training Batches</h2><p>Training schedule, trainee count, and completion progress</p></div></div><div class="table-wrap"><table><thead><tr><th>Training Batch</th><th>Branch</th><th>Trainees</th><th>Training Period</th><th>Progress</th><th>Status</th><th>Notes</th></tr></thead><tbody id="batchesTableBody">
      <tr data-search="Pulilan Crew Batch A Manila 12 trainees ongoing" data-batch-name="Pulilan Crew Batch A"><td><strong>Pulilan Crew Batch A</strong><span>TRN-2607-A</span></td><td>Pulilan, Manila</td><td>12</td><td>July 15–29</td><td>75%</td><td><span class="status good">Ongoing</span></td><td class="batch-notes" data-empty="true">—</td></tr>
      <tr data-search="Calumpit Crew Batch B 12 trainees in progress" data-batch-name="Calumpit Crew Batch B"><td><strong>Calumpit Crew Batch B</strong><span>TRN-2607-B</span></td><td>Calumpit Central</td><td>12</td><td>July 18–August 1</td><td>60%</td><td><span class="status good">In Progress</span></td><td class="batch-notes" data-empty="true">—</td></tr>
      <tr data-search="Malolos Crew Batch D 11 trainees needs attention" data-batch-name="Malolos Crew Batch D"><td><strong>Malolos Crew Batch D</strong><span>TRN-2607-D</span></td><td>Malolos Avenue</td><td>11</td><td>July 16–30</td><td>45%</td><td><span class="status attention">Needs Attention</span></td><td class="batch-notes" data-empty="true">—</td></tr>
      <tr data-search="Mexico, Pampanga Crew Batch C completed certified" data-batch-name="Mexico, Pampanga Crew Batch C"><td><strong>Mexico, Pampanga Crew Batch C</strong><span>TRN-2606-C</span></td><td>Mexico, Pampanga Central</td><td>10</td><td>June 25–July 10</td><td>100%</td><td><span class="status strong">Completed</span></td><td class="batch-notes" data-empty="true">—</td></tr>
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
      <tr data-search="Kitchen Operations Pulilan Crew Batch A today"><td><strong>Kitchen Operations</strong><span>SES-2607-018</span></td><td>Pulilan Crew Batch A</td><td>Today, 9:00 AM</td><td>11/12 Present</td><td><span class="table-status monitoring">Completed</span></td><td><button class="review-btn session-btn" data-session="Kitchen Operations">View Attendance</button></td></tr>
      <tr data-search="Customer Service Calumpit Crew Batch B today ongoing"><td><strong>Customer Service Simulation</strong><span>SES-2607-019</span></td><td>Calumpit Crew Batch B</td><td>Today, 2:00 PM</td><td>12 Expected</td><td><span class="table-status investigating">Scheduled</span></td><td><button class="review-btn session-btn" data-session="Customer Service Simulation">Open Session</button></td></tr>
      <tr data-search="Food Safety Malolos Crew Batch D tomorrow"><td><strong>Food Safety and Cleanliness</strong><span>SES-2607-020</span></td><td>Malolos Crew Batch D</td><td>July 22, 10:00 AM</td><td>11 Expected</td><td><span class="table-status action">Upcoming</span></td><td><button class="review-btn session-btn" data-session="Food Safety and Cleanliness">View</button></td></tr>
    </tbody></table></div></section>`,

 assessments: `
  <div class="welcome-row"><div><p class="eyebrow">COMPETENCY EVALUATION</p><h1>Assessments</h1><p>Evaluate trainee performance using standardized criteria.</p></div><button class="primary-btn compact new-assessment-btn">+ New Assessment</button></div>
  <div class="alert-banner"><div class="alert-icon"><i data-lucide="clipboard-alert"></i></div><div><strong id="assessmentAlertCount">3 assessments remain incomplete</strong><span>Complete the evaluations before final certification.</span></div></div>

  <section class="panel">
    <div class="panel-heading">
      <div>
        <h2>Competency Assessment List</h2>
        <p>Evaluate trainees based on their assigned training type.</p>
      </div>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Batch</th>
            <th>Training Type</th>
            <th>Training Score</th>
            <th>Overall Result</th>
            <th></th>
          </tr>
        </thead>

        <tbody id="assessmentsTableBody">
          <tr data-search="Nicole Garcia Pulilan cooking pending assessment">
            <td><strong>Nicole Garcia</strong><span>EMP-26124 • Service Crew</span></td>
            <td>Pulilan Crew Batch A</td>
            <td>Cooking</td>
            <td>Pending</td>
            <td><span class="table-status action">Not Assessed</span></td>
            <td><button class="review-btn" data-trainee="Nicole Garcia">Assess</button></td>
          </tr>

          <tr data-search="Andrea Reyes Calumpit register passed assessment">
            <td><strong>Andrea Reyes</strong><span>EMP-26121 • Service Crew</span></td>
            <td>Calumpit Crew Batch B</td>
            <td>Register</td>
            <td>88%</td>
            <td><span class="table-status monitoring">Passed</span></td>
            <td><button class="review-btn" data-trainee="Andrea Reyes">Review</button></td>
          </tr>

          <tr data-search="Joshua Lim Pulilan food preparation requires coaching">
            <td><strong>Joshua Lim</strong><span>EMP-26127 • Kitchen Crew</span></td>
            <td>Pulilan Crew Batch A</td>
            <td>Food Preparation</td>
            <td>68%</td>
            <td><span class="table-status investigating">Requires Coaching</span></td>
            <td><button class="review-btn" data-trainee="Joshua Lim">Review</button></td>
          </tr>

          <tr data-search="Carlo Mendoza Calumpit dining passed">
            <td><strong>Carlo Mendoza</strong><span>EMP-26118 • Kitchen Crew</span></td>
            <td>Calumpit Crew Batch B</td>
            <td>Dining</td>
            <td>91%</td>
            <td><span class="table-status monitoring">Passed</span></td>
            <td><button class="review-btn" data-trainee="Carlo Mendoza">Review</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>`,

    certifications: `
    <div class="welcome-row"><div><p class="eyebrow">DEPLOYMENT ELIGIBILITY</p><h1>Certifications</h1><p>Confirm whether employees are certified or require retraining.</p></div></div>
    <div class="stats-grid">
      <article class="stat-card"><div class="stat-icon green"><i data-lucide="badge-check"></i></div><div><span>Certified</span><strong>21</strong><small>Eligible for deployment</small></div></article>
      <article class="stat-card"><div class="stat-icon yellow"><i data-lucide="clock-3"></i></div><div><span>For Certification</span><strong>3</strong><small>Awaiting final decision</small></div></article>
      <article class="stat-card"><div class="stat-icon orange"><i data-lucide="rotate-ccw"></i></div><div><span>Requires Retraining</span><strong>2</strong><small>Additional coaching needed</small></div></article>
      <article class="stat-card"><div class="stat-icon red"><i data-lucide="shield-alert"></i></div><div><span>Not Eligible</span><strong>5</strong><small>Certification incomplete</small></div></article>
    </div>
    <section class="panel"><div class="panel-heading"><div><h2>Employee Certification Status</h2><p>Only certified employees may be deployed to active stores</p></div></div><div class="table-wrap"><table><thead><tr><th>Employee</th><th>Batch</th><th>Assessment Score</th><th>Certification Status</th><th>Deployment</th><th></th></tr></thead><tbody>
      <tr data-search="Andrea Reyes awaiting certification eligible">
        <td><strong>Andrea Reyes</strong><span>EMP-26121 • Service Crew</span></td>
        <td>Calumpit Crew Batch B</td>
        <td>90%</td>
        <td><span class="table-status investigating cert-status">For Certification</span></td>
        <td class="deployment-cell">Not Yet Eligible</td>
        <td><button class="review-btn certify-btn" data-name="Andrea Reyes" data-batch="Calumpit Crew Batch B" data-score="90%" data-role="Service Crew">Certify</button></td>
      </tr>
      <tr data-search="Carlo Mendoza certified deployment ready">
        <td><strong>Carlo Mendoza</strong><span>EMP-26118 • Kitchen Crew</span></td>
        <td>Calumpit Crew Batch B</td>
        <td>89%</td>
        <td><span class="table-status monitoring cert-status">Certified</span></td>
        <td class="deployment-cell">Ready for Deployment</td>
        <td><button class="review-btn cert-download-btn" data-name="Carlo Mendoza" data-batch="Calumpit Crew Batch B" data-score="89%" data-role="Kitchen Crew">Download Certificate</button></td>
      </tr>
      <tr data-search="Joshua Lim requires retraining not eligible">
        <td><strong>Joshua Lim</strong><span>EMP-26127 • Kitchen Crew</span></td>
        <td>Pulilan Crew Batch A</td>
        <td>74%</td>
        <td><span class="table-status action cert-status">Requires Retraining</span></td>
        <td class="deployment-cell">Not Eligible</td>
        <td><button class="review-btn coach-btn" data-name="Joshua Lim" data-batch="Pulilan Crew Batch A">Assign Coaching</button></td>
      </tr>
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
      <article class="branch-row"><div class="branch-rank">1</div><div class="branch-name"><strong>Mexico, Pampanga Crew Batch C</strong><span>Training and certification completed</span></div><div class="score"><strong>100%</strong><div><span style="width:100%"></span></div></div><span class="status strong">Completed</span></article>
      <article class="branch-row"><div class="branch-rank">2</div><div class="branch-name"><strong>Pulilan
       Crew Batch A</strong><span>Assessment stage in progress</span></div><div class="score"><strong>75%</strong><div><span style="width:75%"></span></div></div><span class="status good">Ongoing</span></article>
      <article class="branch-row"><div class="branch-rank">3</div><div class="branch-name"><strong>Calumpit
       Crew Batch B</strong><span>Service simulations ongoing</span></div><div class="score"><strong>60%</strong><div><span style="width:60%"></span></div></div><span class="status good">In Progress</span></article>
      <article class="branch-row"><div class="branch-rank">4</div><div class="branch-name"><strong>Malolos
       Crew Batch D</strong><span>Attendance and coaching concerns</span></div><div class="score"><strong>45%</strong><div><span style="width:45%"></span></div></div><span class="status attention">Needs Attention</span></article>
    </div></section><section class="panel"><div class="panel-heading"><div><h2>Trainer Focus</h2><p>Recommended training priorities</p></div></div><div class="timeline">
      <div class="timeline-item"><span class="dot red"><i data-lucide="clipboard-alert"></i></span><div><strong>Complete pending assessments</strong><p>Three trainees still need competency evaluation.</p><small>High priority</small></div></div>
      <div class="timeline-item"><span class="dot yellow"><i data-lucide="rotate-ccw"></i></span><div><strong>Coach trainees below standard</strong><p>Review kitchen simulation results and schedule coaching.</p><small>Due this week</small></div></div>
      <div class="timeline-item"><span class="dot green"><i data-lucide="file-check-2"></i></span><div><strong>Submit completion report</strong><p>Finalize the Mexico, Pampanga Crew Batch C training report.</p><small>Ready for submission</small></div></div>
    </div></section></div>`,

  settings: `
    <div class="welcome-row"><div><p class="eyebrow">ACCOUNT PREFERENCES</p><h1>Settings</h1><p>Manage Michael Dela Cruz's Store Trainer dashboard preferences.</p></div></div>
    <div class="settings-grid"><section class="panel settings-card"><div class="panel-heading"><div><h2>Profile Information</h2><p>Displayed in training and certification reports</p></div></div><div class="settings-form"><label>Full Name</label><input value="Michael Dela Cruz"><label>Role</label><input value="Store Trainer" disabled><label>Email Address</label><input value="michael.delacruz@5joys.com"><button class="primary-btn compact save-settings">Save Changes</button></div></section><section class="panel settings-card"><div class="panel-heading"><div><h2>Notifications</h2><p>Select the training updates you want to receive</p></div></div><div class="settings-form toggles"><label><input type="checkbox" checked> Upcoming training session reminders</label><label><input type="checkbox" checked> Pending assessment alerts</label><label><input type="checkbox" checked> Certification deadline reminders</label><label><input type="checkbox"> Weekly training progress summary</label><button class="primary-btn compact save-settings">Update Preferences</button></div></section></div>`
};

function initIcons() {
  if (window.lucide) lucide.createIcons();
}

function openReview(title, description, saveLabel) {
  modalTitle.textContent = title;
  if (modalDescription) {
    modalDescription.textContent = description || 'Review the trainee\u2019s competency results and record any coaching or certification remarks.';
  }
  note.value = '';
  const saveBtn = document.getElementById('saveReview');
  if (saveBtn) saveBtn.textContent = saveLabel || 'Save Assessment';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  note.focus();
}

function closeReview() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  modalMode = null;
  modalContext = {};

  const batchField = document.getElementById('modalBatchField');
  const listField = document.getElementById('modalListField');
  if (batchField) batchField.style.display = 'none';
  if (listField) listField.style.display = 'none';
  note.placeholder = 'Enter assessment remarks or coaching instructions...';

  const saveBtn = document.getElementById('saveReview');
  if (saveBtn) saveBtn.textContent = 'Save Assessment';
}

// Names of every batch currently listed in the Assigned Training Batches table.
function getBatchNames() {
  return Array.from(pageContent.querySelectorAll('#batchesTableBody tr[data-batch-name]'))
    .map(tr => tr.dataset.batchName);
}

// Renders a roster of trainees inside the modal's list area.
// mode: 'record' (read-only present/absent), 'mark' (interactive checkboxes), 'expected' (read-only, hasn't happened yet)
function renderRosterList(names, mode, absentees = []) {
  if (mode === 'expected') {
    return names.map(n => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 0;border-bottom:1px solid #eee;font-size:14px;">
        <span>${n}</span>
        <span style="font-size:12px;color:#b8860b;font-weight:600;">Expected</span>
      </div>`).join('');
  }

  const readOnly = mode === 'record';
  return names.map(n => {
    const isAbsent = absentees.includes(n);
    return `
      <label style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #eee;font-size:14px;cursor:${readOnly ? 'default' : 'pointer'};">
        <input type="checkbox" class="attendance-check" data-name="${n}" ${isAbsent ? '' : 'checked'} ${readOnly ? 'disabled' : ''}>
        <span style="flex:1;">${n}</span>
        <span class="att-tag" style="font-size:12px;font-weight:600;color:${isAbsent ? '#c0392b' : '#2e7d32'};">${isAbsent ? 'Absent' : 'Present'}</span>
      </label>`;
  }).join('');
}

function openBatchNoteModal() {
  const batchField = document.getElementById('modalBatchField');
  const select = document.getElementById('modalBatchSelect');
  const names = getBatchNames();

  if (select) {
    select.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join('');
  }
  if (batchField) batchField.style.display = 'block';

  note.placeholder = 'Enter the note to add to this batch...';
  modalMode = 'batchnote';
  modalContext = {};
  openReview('Add Batch Note', 'Select a batch and add a note visible to trainers and store managers.', 'Save Note');
}

function openSessionModal(sessionName, sessionRow) {
  const roster = sessionRosters[sessionName];
  if (!roster) {
    showToast(`${sessionName} opened.`);
    return;
  }

  const listField = document.getElementById('modalListField');
  const listLabel = document.getElementById('modalListLabel');
  const listContent = document.getElementById('modalListContent');

  let title, desc, listLabelText, listMode, saveLabel;

  if (roster.mode === 'completed') {
    title = `Attendance \u2014 ${sessionName}`;
    desc = `${roster.batch} \u2022 ${roster.trainees.length} trainees`;
    listLabelText = 'Attendance Record';
    listMode = 'record';
    saveLabel = 'Close Record';
    note.placeholder = 'Add a follow-up remark about this session (optional)...';
  } else if (roster.mode === 'scheduled') {
    title = `Open Session \u2014 ${sessionName}`;
    desc = `${roster.batch} \u2022 mark today's attendance`;
    listLabelText = 'Mark Attendance';
    listMode = 'mark';
    saveLabel = 'Save Attendance';
    note.placeholder = 'Add session notes (optional)...';
  } else {
    title = `Upcoming Session \u2014 ${sessionName}`;
    desc = `${roster.batch} \u2022 ${roster.trainees.length} trainees expected`;
    listLabelText = 'Expected Trainees';
    listMode = 'expected';
    saveLabel = 'Save Prep Notes';
    note.placeholder = 'Add preparation notes (optional)...';
  }

  if (listLabel) listLabel.textContent = listLabelText;
  if (listContent) {
    listContent.innerHTML = renderRosterList(roster.trainees, listMode, roster.absentees);

    // Live-update the Present/Absent tag as the trainer checks/unchecks someone.
    listContent.querySelectorAll('.attendance-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const tag = cb.closest('label').querySelector('.att-tag');
        if (!tag) return;
        tag.textContent = cb.checked ? 'Present' : 'Absent';
        tag.style.color = cb.checked ? '#2e7d32' : '#c0392b';
      });
    });
  }
  if (listField) listField.style.display = 'block';

  modalMode = 'session';
  modalContext = { sessionName, sessionType: roster.mode, sessionRow };
  openReview(title, desc, saveLabel);
}

function showToast(message = 'Changes saved successfully.') {
  toast.querySelector('span').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}

// Adjusts a stat card's number by `delta`, matched by its <span> label text.
// Only touches simple numeric/percent cards (safe for the cards used here).
function bumpStat(label, delta) {
  const cards = pageContent.querySelectorAll('.stat-card');
  cards.forEach(card => {
    const span = card.querySelector('span');
    const strong = card.querySelector('strong');
    if (!span || !strong || span.textContent.trim() !== label) return;
    const isPercent = strong.textContent.trim().endsWith('%');
    const current = parseInt(strong.textContent, 10) || 0;
    const next = Math.max(0, current + delta);
    strong.textContent = next + (isPercent ? '%' : '');
  });
}

function bumpAssessmentBadge(delta) {
  const badge = document.querySelector('.nav-item[data-section="assessments"] em');
  if (badge) {
    const next = Math.max(0, (parseInt(badge.textContent, 10) || 0) + delta);
    badge.textContent = next;
  }
  const alertCount = document.getElementById('assessmentAlertCount');
  if (alertCount) {
    const n = parseInt(alertCount.textContent, 10) || 0;
    const next = Math.max(0, n + delta);
    alertCount.textContent = `${next} assessment${next === 1 ? '' : 's'} remain incomplete`;
  }
}

// ---- Certificate generation (jsPDF) ----
function generateCertificatePDF({ name, batch, score, role }) {
  if (!window.jspdf) {
    showToast('Certificate library failed to load. Check your connection and try again.');
    return false;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background
  doc.setFillColor(255, 250, 240);
  doc.rect(0, 0, w, h, 'F');

  // Border
  doc.setDrawColor(196, 155, 33);
  doc.setLineWidth(4);
  doc.rect(24, 24, w - 48, h - 48);
  doc.setLineWidth(1);
  doc.setDrawColor(150, 110, 20);
  doc.rect(34, 34, w - 68, h - 68);

  // Header
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(178, 34, 34);
  doc.text('BEE-TO-BEE OPERATIONS', w / 2, 75, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text('Employee Training & Certification Program', w / 2, 93, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(30, 30, 30);
  doc.text('Certificate of Completion', w / 2, 140, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text('This certifies that', w / 2, 175, { align: 'center' });

  doc.setFont('times', 'bolditalic');
  doc.setFontSize(34);
  doc.setTextColor(178, 34, 34);
  doc.text(name, w / 2, 215, { align: 'center' });

  doc.setDrawColor(196, 155, 33);
  doc.setLineWidth(0.75);
  doc.line(w / 2 - 130, 224, w / 2 + 130, 224);

  doc.setFont('times', 'normal');
  doc.setFontSize(13.5);
  doc.setTextColor(40, 40, 40);
  doc.text(`has successfully completed the ${batch} training program`, w / 2, 250, { align: 'center' });
  doc.text(`with an assessment score of ${score}, meeting all competency`, w / 2, 270, { align: 'center' });
  doc.text(`requirements for deployment as ${role || 'Crew'}.`, w / 2, 290, { align: 'center' });

  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  doc.setFontSize(10.5);
  doc.setTextColor(90, 90, 90);
  doc.text(`Issued on ${dateStr}`, w / 2, 315, { align: 'center' });

  // Signatures
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.6);

  const leftX = w * 0.22;
  doc.line(leftX - 75, h - 88, leftX + 75, h - 88);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Michael Dela Cruz', leftX, h - 74, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text('Store Trainer', leftX, h - 61, { align: 'center' });

  const rightX = w * 0.78;
  doc.line(rightX - 75, h - 88, rightX + 75, h - 88);
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Operations Manager', rightX, h - 74, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text('Bee-to-Bee Operations', rightX, h - 61, { align: 'center' });

  doc.save(`Certificate_${name.replace(/\s+/g, '_')}.pdf`);
  return true;
}

function certifyEmployee(row, btn) {
  const name = btn.dataset.name;
  const batch = btn.dataset.batch;
  const score = btn.dataset.score;
  const role = btn.dataset.role;

  const ok = generateCertificatePDF({ name, batch, score, role });
  if (!ok) return;

  // Flip the row to a certified state
  const statusEl = row.querySelector('.cert-status');
  if (statusEl) {
    statusEl.textContent = 'Certified';
    statusEl.classList.remove('investigating');
    statusEl.classList.add('monitoring');
  }
  const deploymentCell = row.querySelector('.deployment-cell');
  if (deploymentCell) deploymentCell.textContent = 'Ready for Deployment';

  btn.textContent = 'Download Certificate';
  btn.classList.remove('certify-btn');
  btn.classList.add('cert-download-btn');

  bumpStat('Certified', 1);
  bumpStat('For Certification', -1);

  showToast(`${name} certified — certificate downloaded.`);
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
    return;
  }

  // --- Certifications: certify (generates + downloads a certificate) ---
  const certifyBtn = e.target.closest('.certify-btn');
  if (certifyBtn) {
    const row = certifyBtn.closest('tr');
    certifyEmployee(row, certifyBtn);
    return;
  }

  // --- Certifications: re-download certificate for an already-certified employee ---
  const downloadBtn = e.target.closest('.cert-download-btn');
  if (downloadBtn) {
    const { name, batch, score, role } = downloadBtn.dataset;
    const ok = generateCertificatePDF({ name, batch, score, role });
    if (ok) showToast(`Certificate for ${name} downloaded.`);
    return;
  }

  // --- Certifications: assign coaching to an employee who needs retraining ---
  const coachBtn = e.target.closest('.coach-btn');
  if (coachBtn) {
    modalMode = 'coaching';
    modalContext = { name: coachBtn.dataset.name, batch: coachBtn.dataset.batch };
    openReview(
      `Assign Coaching — ${coachBtn.dataset.name}`,
      `Record a coaching plan for ${coachBtn.dataset.name} (${coachBtn.dataset.batch}) before their next certification review.`
    );
    return;
  }

  // --- Batches: add a note to a specific batch (appears in the Assigned Training Batches list) ---
  const addNoteBtn = e.target.closest('.add-batch-note-btn');
  if (addNoteBtn) {
    openBatchNoteModal();
    return;
  }

  // --- Assessments: create a new assessment entry ---
  const newAssessmentBtn = e.target.closest('.new-assessment-btn');
  if (newAssessmentBtn) {
    const name = window.prompt('Trainee full name for the new assessment:');
    if (!name || !name.trim()) return;
    modalMode = 'newassessment';
    modalContext = { name: name.trim() };
    openReview(`New Assessment — ${name.trim()}`, `Set up a new competency assessment for ${name.trim()}.`);
    return;
  }

  // --- Assessments/incident table: assess or review a specific trainee ---
  const trainee = e.target.closest('[data-trainee]');
  if (trainee) {
    modalMode = 'assessment';
    modalContext = { name: trainee.dataset.trainee };
    openReview(`${trainee.dataset.trainee} Assessment`);
    return;
  }

  // --- Sessions: view attendance / open session / view upcoming session ---
  const sessionBtn = e.target.closest('.session-btn');
  if (sessionBtn) {
    openSessionModal(sessionBtn.dataset.session, sessionBtn.closest('tr'));
    return;
  }

  // --- Settings: save profile/notification changes ---
  if (e.target.closest('.save-settings')) {
    showToast('Settings updated successfully.');
    return;
  }

  // --- Topbar: notification bell ---
  if (e.target.closest('.notification-btn')) {
    showToast('You have 3 items requiring your attention.');
    return;
  }

  // --- Overview: "more options" on the activity panel ---
  if (e.target.closest('.activity-more-btn')) {
    showToast('No additional activity options right now.');
    return;
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
    const mode = modalMode;
    const context = modalContext;

    switch (mode) {
      case 'batchnote': {
        const select = document.getElementById('modalBatchSelect');
        const batchName = select ? select.value : null;
        const noteText = note.value.trim();

        if (!batchName || !noteText) {
          showToast('Select a batch and enter a note before saving.');
          return;
        }

        const row = pageContent.querySelector(`#batchesTableBody tr[data-batch-name="${CSS.escape(batchName)}"]`);
        const cell = row ? row.querySelector('.batch-notes') : null;

        if (cell) {
          if (cell.dataset.empty === 'true') {
            cell.dataset.empty = 'false';
            cell.innerHTML = '<ul style="margin:0;padding-left:16px;font-size:13px;line-height:1.5;"></ul>';
          }
          const list = cell.querySelector('ul');
          const li = document.createElement('li');
          const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          li.innerHTML = `<b>${dateStr}:</b> ${noteText}`;
          list.appendChild(li);
        }

        closeReview();
        showToast(`Note added to ${batchName}.`);
        break;
      }

      case 'session': {
        const { sessionName, sessionType, sessionRow } = context;
        const roster = sessionRosters[sessionName];

        if (sessionType === 'scheduled') {
          const checks = document.querySelectorAll('#modalListContent .attendance-check');
          const absentees = [];
          let present = 0;
          checks.forEach(cb => {
            if (cb.checked) present++;
            else absentees.push(cb.dataset.name);
          });
          const total = checks.length;

          if (roster) {
            roster.mode = 'completed';
            roster.absentees = absentees;
          }

          if (sessionRow) {
            const statusEl = sessionRow.querySelector('.table-status');
            if (statusEl) {
              statusEl.textContent = 'Completed';
              statusEl.className = 'table-status monitoring';
            }
            const attendanceCell = sessionRow.children[3];
            if (attendanceCell) attendanceCell.textContent = `${present}/${total} Present`;
            const btn = sessionRow.querySelector('.session-btn');
            if (btn) btn.textContent = 'View Attendance';
          }

          bumpStat('Completed', 1);
          closeReview();
          showToast(`Attendance recorded: ${present}/${total} present for ${sessionName}.`);
        } else if (sessionType === 'completed') {
          closeReview();
          showToast(`Attendance record for ${sessionName} noted.`);
        } else {
          closeReview();
          showToast(`Preparation notes saved for ${sessionName}.`);
        }
        break;
      }

      case 'coaching':
        closeReview();
        showToast(`Coaching plan assigned to ${context.name}.`);
        break;

      case 'newassessment': {
        const tbody = document.getElementById('assessmentsTableBody');
        if (tbody) {
          const tr = document.createElement('tr');
          tr.dataset.search = `${context.name} new assessment pending`.toLowerCase();
          tr.innerHTML = `
            <td><strong>${context.name}</strong><span>New Trainee</span></td>
            <td>—</td>
            <td>—</td>
            <td>Pending</td>
            <td><span class="table-status action">Not Assessed</span></td>
            <td><button class="review-btn" data-trainee="${context.name}">Assess</button></td>
          `;
          tbody.appendChild(tr);
          bumpAssessmentBadge(1);
        }
        closeReview();
        showToast(`Assessment created for ${context.name}.`);
        break;
      }

      case 'assessment':
      default:
        closeReview();
        showToast('Assessment saved successfully.');
        break;
    }
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
