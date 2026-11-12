# [ISANDE2] Group 2-S30B: 5Joys

Scrum board plan for **10–30 November 2026** (Asia/Manila). Create three seven-day sprints. Issue owners below are proposed team owners; the email addresses identify the business stakeholders represented by each dashboard, not Jira assignee accounts.

## Delegation

| Team member | Three stakeholder roles and reference emails |
| --- | --- |
| Ela | Business Development — sophia.ramirez@5joys.com; Operations Head — carlos.reyes@5joys.com; Executive Management — maria.santos@5joys.com |
| Zel | Engineering Head — engr.nina.cruz@5joys.com; Supply Chain Officer — joel.navarro@5joys.com; Finance Head — carlo.lim@5joys.com |
| JN | HR Specialist — angela.santos@5joys.com; Store Trainer — michael.dela.cruz@5joys.com; Store Manager — ruth.reyes@5joys.com |
| Lia | Area Manager — bea.hernandez@5joys.com; Store Manager — ruth.torres@5joys.com; Legal Head — atty.maya.santos@5joys.com |

The two Store Manager emails are separate stakeholder accounts sharing the same `src/store-manager.html` dashboard. Confirm this provisional team allocation before assigning Jira users.

### Dashboard development delegation (actual)

Set on 10 November 2026 in Jira (comment on IG2S5-1, IG2S5-14 and IG2S5-27). It replaces the stakeholder-to-member split above **for dashboard development only**; it does not change the academic Gantt assignments. Each owner implements both the frontend and backend flows for their roles.

| Jira issue | Roles | Jira assignee |
| --- | --- | --- |
| IG2S5-39 | Executive Management; Business Development Officer | Daniella De Guzman |
| IG2S5-40 | Operations Head; HR Specialist; Finance Head | Gracezel Castrence (Zel) |
| IG2S5-41 | Store Trainer; Store Manager (before and after); Engineering Head | Juliana Leofando |
| IG2S5-42 | Area Manager; Supply Chain Officer; Legal Head | Jose Pastrana (JN) |

Matching Report Design issues: IG2S5-44 to IG2S5-47, one per group above, in the same order.

## Sprint 1 — Foundation and core workflows (10–16 November)

| Work area / issue summary | Owner | Acceptance criteria |
| --- | --- | --- |
| Application Development — connect role dashboards to persistent API data | Zel | Document API contracts for proposals, approvals, inventory, and users; replace demo-only writes in one end-to-end workflow; refresh retains the result. |
| Data Conversion — inventory and map sample data | Ela | List sample records in `src/js/*-data.js` and inline page scripts; define target fields, IDs, validation, and migration sequence; provide a small verified import fixture. |
| System Security — authenticate and authorize each role | Lia | Replace email-only login in `src/index.html`; server validates session and role for reads and writes; unauthorized direct page/API access is denied. |
| Documentation — architecture and role guide | JN | Explain local setup, data flow, supported roles, demo limitations, and dashboard entry points; document one workflow per delegated role. |

## Sprint 2 — Quality and launch preparation (17–23 November)

| Work area / issue summary | Owner | Acceptance criteria |
| --- | --- | --- |
| Testing — exercise role workflows and regression checks | Lia | Test all 12 stakeholder accounts, shared Store Manager view, approval and inventory flows, access control, and reload persistence; record defects and retest results. |
| Training — prepare role-based walkthroughs | JN | Create short guides for store managers, trainers, HR, and cross-role handoffs; run a rehearsal and capture questions. |
| System Performance Management — establish baseline | Zel | Measure page load and key interaction times on representative dashboards; set thresholds; fix the most consequential bottleneck or log a prioritized issue. |
| Backup and Recovery — protect persistent data | Zel | Define backup frequency and retention; perform a backup and restore drill in a nonproduction environment; record recovery time and missing-data window. |
| System Changeover — rehearse launch | Ela | Write cutover checklist with data freeze, import, smoke checks, owner signoff, rollback trigger, and rollback steps; complete a dry run. |

## Sprint 3 — Adoption and operating model (24–30 November)

| Work area / issue summary | Owner | Acceptance criteria |
| --- | --- | --- |
| User Support — establish intake and escalation | JN | Publish contact path, issue template, severity levels, owner rota, and response targets; trial one reported issue through resolution. |
| Maintenance Tasks — resolve launch defects | Lia | Triage Sprint 2 defects, fix launch-blocking items, and record verification and remaining known issues. |
| Maintenance Management — own release and change process | Ela | Define change request, review, release, rollback, and incident ownership; maintain versioned release notes and a maintenance calendar. |
| System Obsolescence — review dependencies and browser support | Zel | Inventory external scripts, libraries, browser assumptions, and unmaintained code; record upgrade or replacement decisions with target dates. |

## IG2S5-42 — Frontend & Backend Flows: Area Manager + Supply Chain Officer + Legal Head (JN)

Related overarching work: IG2S5-1 (persistent API data), IG2S5-18 (module development), IG2S5-27 (system integration and testing).

| Role | Frontend flow | Backend flow |
| --- | --- | --- |
| Area Manager | Implement and verify the dashboard screens, navigation, actions, and feedback states. | Integrate dashboard actions with appropriate persistent API data, role authorization, validation, and error handling. |
| Supply Chain Officer | Implement and verify the dashboard screens, navigation, actions, and feedback states. | Integrate dashboard actions with appropriate persistent API data, role authorization, validation, and error handling. |
| Legal Head | Implement and verify the dashboard screens, navigation, actions, and feedback states. | Integrate dashboard actions with appropriate persistent API data, role authorization, validation, and error handling. |

Acceptance criteria:

- Each delegated dashboard's frontend actions can be exercised end-to-end.
- Backend/API interactions are validated, authorized for the role, and persist across reloads.
- Demo limitations, test outcomes, and any blocked integration points are recorded.

Implementation (12 November 2026):

| Dashboard | Persisted actions | Firestore collections |
| --- | --- | --- |
| Area Manager | Branch notes, daily report reviews, report reminders, incident create/review, corrective action create/update, performance notes, settings | `areaBranches`, `areaDailyReports`, `areaIncidents`, `areaCorrectiveActions`, `areaPerformance`, `areaActivity`, `userSettings` |
| Supply Chain Officer | Delivery schedule/update, receipts, supplier issues, launch readiness confirmation, settings; Readiness, Inventory, Issues and Launch are calculated from delivery records | `supplyDeliveries`, `supplyLaunchConfirmations`, `userSettings` |
| Legal Head | Approve / request revision / reject with requirement checklist and decision history; decision mirrored to `siteApplications/{id}.workflowStatus.legal` (visible to Executive Management); settings | `legalReviews`, `siteApplications` (Legal status only), `userSettings` |

- **Authorization:** each page confirms the Firebase account matches its role (`src/js/role-backend.js`) and Log Out ends the Firebase session. Server-side role and field validation are in `firestore.rules` (not yet deployed).
- **Validation:** required fields, length limits, allowed status values, whole-number ranges (received ≤ expected, progress 0–100), valid dates; Legal cannot approve while a requirement is Incomplete or Needs Clarification.
- **Feedback:** buttons show "Saving…" while writing; errors keep the dialog open and explain the cause (permission denied, offline, invalid input).
- **Seeding:** an empty collection is filled once from the dashboard's bundled demo records.

Demo limitations and blocked integration points:

- `firestore.rules` must be merged with the rules in the Firebase console and published; until then, role enforcement is client-side only.
- Not yet exercised against live Firebase: needs a sign-in with each role's password. Test each action, then reload to confirm it persists.
- Overview pages, Area Manager stat cards, Legal metric cards, and Inventory "Available 1,284" remain static demo figures.
- Supply launch confirmation is stored but not yet shown on the Store Manager dashboard (IG2S5-41).
- Legal shares one proposal status with the other department-head pages, which still save in memory only (IG2S5-40, IG2S5-41).

## Codebase evidence used for planning

- `src/index.html` authenticates by matching an email in a client-side `USERS` map and saves the selected user in `localStorage`; role pages check that browser value.
- `src/README.md` says Supply Chain controls use front-end demo state and require backend/API integration for permanent updates.
- Department dashboards share `src/js/department-head-dashboard.js` and sample records in `src/js/department-head-data.js`.
- The repo has separate HTML dashboards for the listed roles, while the two Store Manager stakeholders share one implementation.

Jira setup: create a Scrum board with the exact title above, add the three sprints and 13 issue summaries, then assign actual Jira users after checking team account identities. The table owner names are planning labels until those accounts are verified.
