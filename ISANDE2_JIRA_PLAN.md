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

## Codebase evidence used for planning

- `src/index.html` authenticates by matching an email in a client-side `USERS` map and saves the selected user in `localStorage`; role pages check that browser value.
- `src/README.md` says Supply Chain controls use front-end demo state and require backend/API integration for permanent updates.
- Department dashboards share `src/js/department-head-dashboard.js` and sample records in `src/js/department-head-data.js`.
- The repo has separate HTML dashboards for the listed roles, while the two Store Manager stakeholders share one implementation.

Jira setup: create a Scrum board with the exact title above, add the three sprints and 13 issue summaries, then assign actual Jira users after checking team account identities. The table owner names are planning labels until those accounts are verified.
