(function () {
  'use strict';

  const currentUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
  if (!currentUser) return;
  const reportScriptUrl = document.currentScript ? document.currentScript.src : new URL('js/report-export.js', window.location.href).href;

  const REPORTS = {
    site: {
      code: 'SVR', title: 'Site Viability Evaluation Report', orientation: 'portrait', owner: 'Business Development Officer',
      summary: [['Site ID', 'SITE-2026-014'], ['Proposed Site', 'Pulilan Junction'], ['Address', 'Longos, Pulilan, Bulacan'], ['Coordinates', '14.9012, 120.8496'], ['Monthly Lease', '₱85,000.00'], ['Floor Area / Parking', '165 sqm / 8 slots'], ['Availability', '08-15-2026'], ['Classification', 'Highly Viable'], ['Overall Viability', '88%'], ['Recommendation', 'Recommend for cross-department review']],
      columns: ['Factor / Finding', 'Weight', 'Score', 'Status', 'Evaluation Note'],
      rows: [
        ['Market potential', '25%', '92%', 'Strong', 'High residential density and commuter traffic'],
        ['Accessibility', '15%', '90%', 'Strong', 'Visible frontage with two public transport routes'],
        ['Property suitability', '15%', '86%', 'Acceptable', 'Layout supports required service and storage zones'],
        ['Financial viability', '20%', '84%', 'Acceptable', 'Lease ratio is within the approved threshold'],
        ['Competitive position', '10%', '82%', 'Acceptable', 'Two indirect competitors within three kilometers'],
        ['Risk assessment', '15%', '86%', 'Low Risk', 'Drainage verification required before final approval']
      ],
      notes: [['Strengths', 'Strong traffic, suitable floor area, and favorable lease terms.'], ['Risks', 'Confirm drainage capacity and peak-hour ingress.'], ['System Recommendation', 'Advance the proposal to Legal, Engineering, Finance, and Operations review.']],
      signatures: ['Prepared by: Business Development Officer', 'Reviewed by: Department Head']
    },
    approvals: {
      code: 'ADR', title: 'Cross-Department Approval Status and Decision Report', orientation: 'portrait', owner: 'Department Heads',
      summary: [['Proposal ID', 'PROP-2026-014'], ['Site', 'Pulilan Junction'], ['Project', 'North Luzon Expansion'], ['Submitted', '07-18-2026'], ['Final Proposal Status', 'For Final Approval'], ['Requirements Complete', 'Yes']],
      columns: ['Department', 'Reviewer', 'Checklist', 'Decision', 'Decision Date', 'Remarks'],
      rows: [
        ['Legal', 'Atty. Maya Santos', 'Complete', 'Approved', '07-19-2026 10:15 AM', 'Lease terms are acceptable.'],
        ['Engineering', 'Engr. Nina Cruz', 'Complete', 'Approved with Condition', '07-20-2026 02:40 PM', 'Submit final drainage plan.'],
        ['Finance', 'Carlo Lim', 'Complete', 'Approved', '07-20-2026 04:05 PM', 'Investment is within threshold.'],
        ['Operations', 'Carlos Reyes', 'Complete', 'Approved', '07-21-2026 09:20 AM', 'Operating plan is feasible.']
      ],
      notes: [['Revision Request', 'Engineering drainage plan must be attached before clearance.'], ['Audit History', 'Submitted 07-18-2026; four department decisions recorded; status advanced 07-21-2026.']],
      signatures: ['Consolidated by: Bee-to-Bee Operations', 'Final approval: Executive Management']
    },
    recruitment: {
      code: 'RPR', title: 'Recruitment Pipeline and Applicant Status Report', orientation: 'landscape', owner: 'HR Specialist',
      summary: [['Branch', 'Pulilan, Bulacan'], ['Recruitment Period', '07-01-2026 to 07-31-2026'], ['Total Applicants', '24'], ['For Screening', '6'], ['Interviewed', '12'], ['Hired', '8'], ['Deployment Ready', '5']],
      columns: ['Applicant ID', 'Applicant', 'Position', 'Applied', 'Documents', 'Stage', 'Interview / Score', 'Decision', 'Employee ID', 'Training / Certification'],
      rows: [
        ['APP-26071', 'Ana Mercado', 'Service Crew', '07-03-2026', 'Complete', 'Hired', '07-10-2026 / 91%', 'Hire', 'EMP-26042', 'Batch TR-014 / Certified'],
        ['APP-26074', 'Joshua Lim', 'Kitchen Crew', '07-04-2026', 'Complete', 'In Training', '07-11-2026 / 88%', 'Hire', 'EMP-26045', 'Batch TR-014 / In Training'],
        ['APP-26078', 'Mika Reyes', 'Cashier', '07-06-2026', 'Complete', 'Interviewed', '07-15-2026 / 86%', 'For Review', '—', 'Unassigned'],
        ['APP-26083', 'Paolo Cruz', 'Service Crew', '07-09-2026', 'Incomplete', 'For Screening', '—', 'Pending', '—', 'Not Assigned'],
        ['APP-26088', 'Lara Flores', 'Shift Leader', '07-12-2026', 'Complete', 'Certified', '07-18-2026 / 94%', 'Hire', 'EMP-26051', 'Batch TR-013 / Certified']
      ],
      notes: [['Filter', 'All positions and applicant statuses'], ['HR Note', 'Applicants with incomplete documents cannot advance to deployment.']],
      signatures: ['Prepared by: HR Specialist', 'Noted by: Area Manager']
    },
    training: {
      code: 'TCR', title: 'Training Completion and Certification Report', orientation: 'landscape', owner: 'Store Trainer',
      summary: [['Batch ID', 'TR-2026-014'], ['Branch Assignment', 'Pulilan, Bulacan'], ['Training Period', '07-13-2026 to 07-18-2026'], ['Trainer', 'Michael Dela Cruz'], ['Location', 'Bulacan Training Hub'], ['Trainees', '8'], ['Certified', '6']],
      columns: ['Employee ID', 'Trainee', 'Position', 'Attendance', 'Assessment', 'Result', 'Certification', 'Deployment Eligible', 'Coaching Remarks'],
      rows: [
        ['EMP-26042', 'Ana Mercado', 'Service Crew', '6 / 6', '93%', 'Passed', 'Certified', 'Yes', 'Ready for deployment.'],
        ['EMP-26045', 'Joshua Lim', 'Kitchen Crew', '6 / 6', '88%', 'Passed', 'Certified', 'Yes', 'Reinforce closing procedures.'],
        ['EMP-26047', 'Ella Santos', 'Cashier', '5 / 6', '79%', 'For Reassessment', 'Pending', 'No', 'Repeat cash-control assessment.'],
        ['EMP-26049', 'Noel Garcia', 'Service Crew', '6 / 6', '91%', 'Passed', 'Certified', 'Yes', 'Strong service simulation result.']
      ],
      notes: [['Retraining Recommendation', 'EMP-26047 requires a focused cash-control session before reassessment.'], ['Verification', 'Attendance and competency records verified against the training batch log.']],
      signatures: ['Prepared by: Store Trainer', 'Verified by: HR Specialist']
    },
    launch: {
      code: 'LCR', title: 'Store Launch Readiness and Opening Clearance Report', orientation: 'portrait', owner: 'Store Manager', wideColumn: 1,
      summary: [['Branch ID', 'BR-2026-021'], ['Branch', 'Pulilan, Bulacan'], ['Project', 'North Luzon Expansion'], ['Target Opening', '08-01-2026'], ['Overall Completion', '92%'], ['Opening Clearance', 'Conditional Clearance']],
      columns: ['Req. ID', 'Category / Requirement', 'Owner', 'Due Date', 'Mandatory', 'Status', 'Completed'],
      rows: [
        ['REQ-101', 'Facility / Occupancy permit', 'Legal', '07-24-2026', 'Yes', 'Complete', '07-22-2026'],
        ['REQ-102', 'Equipment / POS activation', 'Operations', '07-25-2026', 'Yes', 'In Progress', '—'],
        ['REQ-103', 'Staffing / Crew certification', 'HR', '07-26-2026', 'Yes', 'Complete', '07-24-2026'],
        ['REQ-104', 'Supply / Opening inventory', 'Supply Chain', '07-27-2026', 'Yes', 'Complete', '07-25-2026'],
        ['REQ-105', 'Facility / Exterior signage', 'Engineering', '07-27-2026', 'No', 'Delayed', '—']
      ],
      notes: [['Open Issues', 'POS activation and exterior signage remain open.'], ['Clearance Decision', 'Branch may open after mandatory POS activation is verified.']],
      signatures: ['Prepared by: Store Manager', 'Opening clearance: Operations Head']
    },
    supply: {
      code: 'SDR', title: 'Supply Readiness and Delivery Exception Report', orientation: 'landscape', owner: 'Supply Chain Officer',
      summary: [['Branch', 'Pulilan, Bulacan'], ['Readiness Status', 'Conditionally Ready'], ['Expected Deliveries', '12'], ['Received Complete', '10'], ['Open Exceptions', '2'], ['Report Date', '07-25-2026']],
      columns: ['Delivery / Issue ID', 'Item', 'Supplier', 'Scheduled / Received', 'Expected', 'Received', 'Variance', 'Condition / Status', 'Corrective Action'],
      rows: [
        ['DEL-26081', 'Upright freezer', 'Prime Kitchen Supply', '07-23-2026 09:00 AM / 10:18 AM', '2', '2', '0', 'Good / Received', 'No action required.'],
        ['ISS-26022', 'POS terminal', 'RetailTech PH', '07-24-2026 01:00 PM / —', '4', '2', '-2', 'Incomplete / Delayed', 'Balance rescheduled for 07-27-2026.'],
        ['DEL-26086', 'Opening dry inventory', 'Five Joys Commissary', '07-25-2026 08:00 AM / 08:35 AM', '125', '123', '-2', 'Good / Short', 'Two cases to follow on next route.'],
        ['DEL-26089', 'Dining furniture set', 'Metro Fixtures', '07-25-2026 02:00 PM / 01:42 PM', '18', '18', '0', 'Good / Received', 'Verified by Store Manager.']
      ],
      notes: [['Exception Summary', 'Four POS terminals are mandatory; two outstanding units require expedited delivery.'], ['Final Status', 'Confirm remaining POS units before unconditional supply-readiness approval.']],
      signatures: ['Prepared by: Supply Chain Officer', 'Confirmed by: Store Manager']
    },
    daily: {
      code: 'DOR', title: 'Daily Branch Operations Report', orientation: 'portrait', owner: 'Store Manager', wideColumn: 2,
      summary: [['Report ID', 'DOR-2026-0720-001'], ['Branch ID', 'BR-001'], ['Branch', 'Pulilan, Bulacan'], ['Reporting Date', '07-20-2026'], ['Submission Time', '08:42 AM'], ['Sales Summary', '₱128,450.00 / Above Target'], ['Attendance', '18 present / 19 scheduled'], ['Checklist Complete', 'Yes'], ['Review Status', 'Reviewed']],
      columns: ['Time', 'Type', 'Operational Activity / Incident', 'Status', 'Evidence Reference'],
      rows: [
        ['07:00 AM', 'Opening', 'Opening checklist and food-safety controls completed.', 'Complete', 'EV-0720-001'],
        ['10:30 AM', 'Operations', 'Peak service period completed within target ticket time.', 'Normal', 'LOG-0720-003'],
        ['01:15 PM', 'Staffing', 'One crew member absent; reliever assigned.', 'Resolved', 'ATT-0720-001'],
        ['04:20 PM', 'Compliance', 'Cold-storage temperature verification completed.', 'Compliant', 'EV-0720-007']
      ],
      notes: [['Store Manager Remarks', 'Operations remained stable. The staffing gap was resolved before the evening peak.'], ['Scope Notice', 'This operational summary does not replace official POS, accounting, payroll, or inventory records.']],
      signatures: ['Prepared by: Store Manager', 'Reviewed by: Area Manager']
    },
    incident: {
      code: 'ICR', title: 'Incident and Corrective Action Report', orientation: 'portrait', owner: 'Store Manager / Area Manager', wideColumn: 1,
      summary: [['Incident ID', 'INC-2026-0719'], ['Branch', 'Paombong, Bulacan'], ['Category', 'Equipment'], ['Severity', 'High'], ['Reported', '07-19-2026 09:12 AM'], ['Assigned Owner', 'Technical Team'], ['Deadline', '07-21-2026'], ['Current Status', 'Monitoring']],
      columns: ['Action ID', 'Required Action', 'Owner', 'Deadline', 'Status', 'Status Date'],
      rows: [
        ['ACT-0719-01', 'Inspect freezer controls and compressor.', 'Technical Team', '07-19-2026', 'Completed', '07-19-2026 03:35 PM'],
        ['ACT-0719-02', 'Transfer affected stock and verify holding temperature.', 'Store Manager', '07-19-2026', 'Completed', '07-19-2026 10:05 AM'],
        ['ACT-0719-03', 'Record 48-hour temperature trend.', 'Store Manager', '07-21-2026', 'Monitoring', '07-20-2026 08:00 AM']
      ],
      notes: [['Incident Description', 'Freezer temperature fluctuated above the approved holding range. No unsafe product was served.'], ['Resolution Details', 'Controller connection was secured; unit remains under 48-hour monitoring.'], ['Area Manager Feedback', 'Close only after two full days of compliant readings are attached.']],
      signatures: ['Reported by: Store Manager', 'Corrective-action review: Area Manager']
    },
    performance: {
      code: 'BPS', title: 'Branch Performance Summary Report', orientation: 'landscape', owner: 'Area Manager',
      summary: [['Region', 'Central Luzon'], ['Reporting Period', '07-13-2026 to 07-19-2026'], ['Branches', '8'], ['Average Performance', '91%'], ['Reports Submitted', '54 / 56'], ['Open Incidents', '5']],
      columns: ['Branch ID', 'Branch / Manager', 'Reports', 'Attendance', 'Certification', 'Incidents', 'Actions Complete', 'Compliance', 'Performance / Trend', 'Attention / Coaching'],
      rows: [
        ['BR-001', 'Pulilan / Ruth Reyes', '7 / 7', '96%', '100%', '0', '100%', '98%', '96% / Improving', 'Strong performer; share opening controls.'],
        ['BR-003', 'Pandi / Leo Mercado', '7 / 7', '94%', '100%', '1', '100%', '95%', '94% / Stable', 'Continue weekly coaching cadence.'],
        ['BR-006', 'Mexico / Ruth Torres', '7 / 7', '91%', '94%', '1', '100%', '92%', '91% / Improving', 'Monitor POS stability.'],
        ['BR-008', 'Paombong / Tina Cruz', '6 / 7', '88%', '92%', '3', '67%', '84%', '78% / Declining', 'Immediate equipment and compliance review.']
      ],
      notes: [['Calculation Basis', 'Approved daily reports, attendance and certification indicators, incidents, corrective actions, and compliance observations.'], ['Area Recommendation', 'Paombong requires an on-site coaching visit during the next reporting week.']],
      signatures: ['Prepared by: Area Manager', 'Reviewed by: Operations Head']
    },
    executive: {
      code: 'EFS', title: 'Executive Franchise Expansion Summary Report', orientation: 'landscape', owner: 'Bee-to-Bee Operations',
      summary: [['Reporting Period', '07-01-2026 to 07-31-2026'], ['Regional Scope', 'All Regions'], ['Site Applications', '18'], ['Department Approved', '9'], ['Launch Ready', '4'], ['Newly Opened', '3'], ['High-Priority Incidents', '2']],
      columns: ['Project / Branch ID', 'Site / Region', 'Target / Actual', 'Approval', 'Staffing', 'Supply', 'Launch', 'Performance', 'Project Status', 'Risk', 'Management Attention'],
      rows: [
        ['PRJ-026 / BR-001', 'Pulilan / Central Luzon', '08-01-2026 / —', '100%', '88%', '92%', '92%', '—', 'Pre-Opening', 'Medium', 'Close POS delivery exception.'],
        ['PRJ-021 / BR-003', 'Pandi / Central Luzon', '06-15-2026 / 06-15-2026', '100%', '100%', '100%', '100%', '94%', 'Operational', 'Low', 'No executive action required.'],
        ['PRJ-018 / BR-006', 'Mexico / Central Luzon', '05-20-2026 / 05-22-2026', '100%', '100%', '100%', '100%', '91%', 'Operational', 'Low', 'Monitor POS corrective action.'],
        ['PRJ-031 / —', 'San Jose del Monte / Central Luzon', '09-10-2026 / —', '75%', '42%', '65%', '58%', '—', 'In Development', 'High', 'Engineering revision and lease decision.']
      ],
      notes: [['Risk Summary', 'One development project and one operating branch require executive attention.'], ['Management Note', 'Prioritize mandatory launch dependencies and close overdue corrective actions before approving additional commitments.']],
      signatures: ['Automatically compiled by: Bee-to-Bee Operations', 'Reviewed by: Executive Management']
    }
  };

  const ACCESS = {
    'Business Development': ['site', 'approvals'],
    'Operations Head': ['approvals', 'launch', 'supply', 'incident', 'performance', 'executive'],
    'HR Specialist': ['recruitment', 'training'],
    'Store Trainer': ['recruitment', 'training'],
    'Store Manager': ['recruitment', 'training', 'launch', 'supply', 'daily', 'incident'],
    'Supply Chain Officer': ['launch', 'supply'],
    'Area Manager': ['recruitment', 'training', 'launch', 'supply', 'daily', 'incident', 'performance'],
    'Engineering Head': ['approvals', 'launch'],
    'Executive Management': Object.keys(REPORTS),
    'Finance Head': ['approvals', 'executive'],
    'Legal Head': ['approvals']
  };

  const allowed = ACCESS[currentUser.role] || [];
  if (!allowed.length) return;

  const escapeHtml = (value) => String(value == null ? '' : value).replace(/[&<>'"]/g, (char) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[char]));
  const formatDate = (date) => `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
  const formatDateTime = (date) => `${formatDate(date)} ${new Intl.DateTimeFormat('en-US', {hour: '2-digit', minute: '2-digit'}).format(date)}`;
  const reportId = (report) => `${report.code}-${formatDate(new Date()).replaceAll('-', '')}-${String(Date.now()).slice(-6)}`;

  function reportCss(orientation) {
    return `
      @page { size: A4 ${orientation}; margin: 13mm 12mm 15mm; }
      * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      body { margin: 0; color: #202124; font: 9.5pt Arial, sans-serif; background: #fff; }
      .report { width: 100%; }
      .report-header { min-height: 35mm; display: grid; grid-template-columns: 34mm 1fr auto; gap: 6mm; align-items: center; border-bottom: 2.5px solid #e31937; padding-bottom: 4mm; }
      .report-logo { position: relative; width: 34mm; height: 28mm; overflow: hidden; border-radius: 2mm; background: #191919; }
      .report-logo img { position: absolute; top: -5mm; left: 1mm; width: 54mm; max-width: none; max-height: none; }
      h1 { margin: 0 0 2mm; color: #191919; font-size: 17pt; line-height: 1.15; }
      .system-name { color: #e31937; font-size: 9pt; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
      .header-id { text-align: right; white-space: nowrap; }
      .header-id strong { display: block; font-size: 10pt; }
      .header-id span { color: #666; font-size: 8.5pt; }
      .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm 5mm; margin: 5mm 0; padding: 3.5mm; background: #f7f7f7; border: 1px solid #ddd; }
      .meta div, .summary-item { min-width: 0; }
      .label { display: block; color: #666; font-size: 7.5pt; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 1mm; }
      .value { font-weight: 600; overflow-wrap: anywhere; }
      .summary { display: grid; grid-template-columns: repeat(${orientation === 'landscape' ? 4 : 3}, 1fr); border: 1px solid #d9d9d9; margin-bottom: 5mm; }
      .summary-item { min-height: 14mm; padding: 3mm; border-right: 1px solid #ddd; border-bottom: 1px solid #ddd; }
      .summary-item:nth-child(${orientation === 'landscape' ? '4n' : '3n'}) { border-right: 0; }
      h2 { margin: 5mm 0 2mm; font-size: 11pt; }
      table { width: 100%; border-collapse: collapse; table-layout: fixed; }
      thead { display: table-header-group; }
      tr { break-inside: avoid; page-break-inside: avoid; }
      th { padding: 2.2mm 1.5mm; background: #292929; color: #fff; text-align: left; font-size: 7.2pt; line-height: 1.2; }
      td { padding: 2.1mm 1.5mm; border: 1px solid #d8d8d8; vertical-align: top; line-height: 1.3; overflow-wrap: anywhere; }
      th.wide, td.wide { width: 30%; }
      tbody tr:nth-child(even) { background: #fafafa; }
      td.number, td.currency, td.percent { text-align: right; white-space: nowrap; }
      td.status { font-weight: 700; color: #333; }
      .notes { margin-top: 5mm; display: grid; gap: 2mm; }
      .note { border-left: 3px solid #e31937; background: #fafafa; padding: 2.5mm 3mm; }
      .note strong { display: block; margin-bottom: 1mm; font-size: 8pt; }
      .signatures { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15mm; margin-top: 13mm; break-inside: avoid; }
      .signature { border-top: 1px solid #555; padding-top: 2mm; color: #555; font-size: 8.5pt; }
      .footer-space { height: 14mm; }
      .report-footer { position: fixed; bottom: 0; left: 0; right: 0; display: grid; grid-template-columns: 1fr auto 1fr; padding-top: 2mm; border-top: 1px solid #aaa; color: #666; font-size: 7.5pt; }
      .report-footer span:nth-child(2) { text-align: center; }
      .report-footer span:last-child { text-align: right; }
      .page-number::after { content: "1"; }
      .no-print { position: fixed; top: 12px; right: 12px; padding: 10px 16px; border: 0; border-radius: 7px; color: #fff; background: #e31937; font-weight: 700; cursor: pointer; box-shadow: 0 3px 12px #999; }
      @media screen { body { background: #e8e8e8; padding: 12mm; } .report { width: ${orientation === 'landscape' ? '297mm' : '210mm'}; min-height: ${orientation === 'landscape' ? '210mm' : '297mm'}; margin: 0 auto; padding: 13mm 12mm 15mm; background: white; box-shadow: 0 2px 14px #bbb; } .report-footer { left: 12mm; right: 12mm; bottom: 12mm; } }
      @media print { .no-print { display: none; } .page-number::after { content: counter(page); } }
    `;
  }

  function numericClass(value) {
    const text = String(value);
    if (/^₱/.test(text)) return 'currency';
    if (/^-?[\d,.]+%$/.test(text)) return 'percent';
    if (/^-?[\d,.]+(?:\s*\/\s*[\d,.]+)?$/.test(text)) return 'number';
    if (/^(Approved|Complete|Completed|Certified|Pending|Delayed|Monitoring|Strong|Acceptable|Normal|Compliant|Resolved|In Progress|For Review|Low|Medium|High|Yes|No)/i.test(text)) return 'status';
    return '';
  }

  function buildReport(reportKey, period, scope) {
    const report = REPORTS[reportKey];
    const now = new Date();
    const id = reportId(report);
    const logoUrl = new URL('../images/b2blogo.png', reportScriptUrl).href;
    const summary = report.summary.map(([label, value]) => `<div class="summary-item"><span class="label">${escapeHtml(label)}</span><span class="value">${escapeHtml(value)}</span></div>`).join('');
    const wideColumn = Number.isInteger(report.wideColumn) ? report.wideColumn : report.columns.length - 1;
    const headers = report.columns.map((column, index) => `<th class="${index === wideColumn ? 'wide' : ''}">${escapeHtml(column)}</th>`).join('');
    const rows = report.rows.map((row) => `<tr>${row.map((cell, index) => `<td class="${numericClass(cell)} ${index === wideColumn ? 'wide' : ''}">${escapeHtml(cell)}</td>`).join('')}</tr>`).join('');
    const notes = report.notes.map(([label, value]) => `<div class="note"><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</div>`).join('');
    const signatures = report.signatures.map((label) => `<div class="signature">${escapeHtml(label)}</div>`).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(report.title)} — ${id}</title><style>${reportCss(report.orientation)}</style></head><body>
      <button class="no-print" onclick="window.print()">Print / Save as PDF</button>
      <main class="report">
        <header class="report-header">
          <div class="report-logo"><img src="${logoUrl}" alt="Bee-to-Bee Operations logo"></div>
          <div><div class="system-name">Bee-to-Bee Operations</div><h1>${escapeHtml(report.title)}</h1><span>Authorized operational and management report</span></div>
          <div class="header-id"><span>Report Identifier</span><strong>${id}</strong></div>
        </header>
        <section class="meta">
          <div><span class="label">Reporting Period</span><span class="value">${escapeHtml(period)}</span></div>
          <div><span class="label">Generated</span><span class="value">${escapeHtml(formatDateTime(now))}</span></div>
          <div><span class="label">Responsible User</span><span class="value">${escapeHtml(currentUser.name)} · ${escapeHtml(currentUser.role)}</span></div>
          <div><span class="label">Responsible Department</span><span class="value">${escapeHtml(report.owner)}</span></div>
          <div><span class="label">Branch / Project / Scope</span><span class="value">${escapeHtml(scope)}</span></div>
          <div><span class="label">Layout</span><span class="value">A4 ${escapeHtml(report.orientation)}</span></div>
        </section>
        <h2>Report Summary</h2><section class="summary">${summary}</section>
        <h2>Detail Area</h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
        <section class="notes">${notes}</section>
        <section class="signatures">${signatures}</section><div class="footer-space"></div>
        <footer class="report-footer"><span>CONFIDENTIAL — Authorized Bee-to-Bee Operations users only</span><span>Page <span class="page-number"></span></span><span>Generated ${escapeHtml(formatDateTime(now))}</span></footer>
      </main>
    </body></html>`;
  }

  function openExportDialog() {
    const dialog = document.getElementById('reportExportDialog');
    if (!dialog) return;
    dialog.classList.add('open');
    dialog.setAttribute('aria-hidden', 'false');
    dialog.querySelector('select').focus();
  }

  function closeExportDialog() {
    const dialog = document.getElementById('reportExportDialog');
    if (!dialog) return;
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
  }

  function exportSelectedReport(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const reportKey = form.elements.report.value;
    const from = form.elements.from.value ? formatDate(new Date(`${form.elements.from.value}T00:00:00`)) : 'All authorized records';
    const to = form.elements.to.value ? formatDate(new Date(`${form.elements.to.value}T00:00:00`)) : 'Current';
    const scope = form.elements.scope.value.trim() || 'All authorized branches and projects';
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('The report window was blocked. Please allow pop-ups for this site and try again.');
      return;
    }
    reportWindow.document.open();
    reportWindow.document.write(buildReport(reportKey, `${from} to ${to}`, scope));
    reportWindow.document.close();
    closeExportDialog();
  }

  function initialize() {
    const actions = document.querySelector('.topbar-actions');
    if (!actions || document.getElementById('exportReportBtn')) return;
    const button = document.createElement('button');
    button.id = 'exportReportBtn';
    button.className = 'report-export-btn';
    button.type = 'button';
    button.innerHTML = '<span aria-hidden="true">⇩</span><span>Export Report</span>';
    actions.insertBefore(button, actions.firstChild);

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const toInput = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const dialog = document.createElement('div');
    dialog.id = 'reportExportDialog';
    dialog.className = 'report-export-dialog';
    dialog.setAttribute('aria-hidden', 'true');
    dialog.innerHTML = `<div class="report-export-card" role="dialog" aria-modal="true" aria-labelledby="reportExportTitle">
      <button class="report-export-close" type="button" aria-label="Close report export">×</button>
      <p class="eyebrow">AUTHORIZED REPORTING</p>
      <h2 id="reportExportTitle">Export Report</h2>
      <p>Select a report and reporting scope. The generated A4 view can be printed or saved as PDF.</p>
      <form class="report-export-form">
        <label>Report Type<select name="report" required>${allowed.map((key) => `<option value="${key}">${escapeHtml(REPORTS[key].title)} · A4 ${REPORTS[key].orientation}</option>`).join('')}</select></label>
        <div class="report-date-grid"><label>Period From<input name="from" type="date" value="${toInput(monthStart)}"></label><label>Period To<input name="to" type="date" value="${toInput(today)}"></label></div>
        <label>Branch / Project / Regional Scope<input name="scope" value="All authorized branches and projects" maxlength="120"></label>
        <div class="report-access-note"><strong>${escapeHtml(currentUser.name)}</strong><span>${allowed.length} report type${allowed.length === 1 ? '' : 's'} authorized for ${escapeHtml(currentUser.role)}</span></div>
        <div class="report-export-actions"><button class="secondary-btn report-cancel" type="button">Cancel</button><button class="primary-btn" type="submit">Generate Report</button></div>
      </form>
    </div>`;
    document.body.appendChild(dialog);

    button.addEventListener('click', openExportDialog);
    dialog.querySelector('.report-export-close').addEventListener('click', closeExportDialog);
    dialog.querySelector('.report-cancel').addEventListener('click', closeExportDialog);
    dialog.querySelector('form').addEventListener('submit', exportSelectedReport);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeExportDialog(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeExportDialog(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
