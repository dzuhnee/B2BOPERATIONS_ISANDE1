# Bee-to-Bee Operations System

## Detailed Demo Script — “From Site to Store”

This runbook expands the original ten-scene presentation into a click-by-click demo for all twelve user accounts. It is based on the pages and controls that currently exist in `src/`.

## 1. Demo objective

The demonstration follows one proposed branch—**Bee-to-Bee Balagtas Junction**—through five business modules:

1. Site application and viability evaluation
2. Cross-department review and approval
3. Recruitment, training, certification, and deployment readiness
4. Pre-opening readiness, supply resolution, and opening clearance
5. Post-opening reporting, corrective action, and executive monitoring

Use one identifier consistently on every screen:

- Project ID: `PRJ-2026-052`
- Site proposal ID: `SP-2026-052`
- Branch ID: `BR-025`
- Branch name: `Bee-to-Bee Balagtas Junction`
- Training batch: `TRN-2608-B`
- Delivery: `DEL-2026-0742`
- Launch issue: `ISS-2026-021`
- Post-opening incident: `INC-2026-0808`
- Corrective action: `CA-2026-052`

Do not call the proposed site “Balagtas Public Market.” The present Business Development fixtures already contain an archived `SP-2026-044 — Balagtas Public Market` with a score of 63%. The new demo site must be visually distinct.

## 2. Cast, accounts, and scene ownership

| Presenter | Demo responsibility | Login account | Implemented page |
|---|---|---|---|
| ZEL | Business Development Officer | `sophia.ramirez@5joys.com` | `business-development.html` |
| ZEL | HR Specialist | `angela.santos@5joys.com` | `hr-specialist.html` |
| ZEL | Legal Head | `atty.maya.santos@5joys.com` | `legal-head.html` |
| LIA | Operations Head | `carlos.reyes@5joys.com` | `operations-head.html` |
| LIA | Store Trainer | `michael.dela.cruz@5joys.com` | `store-trainer.html` |
| LIA | Engineering Head | `engr.nina.cruz@5joys.com` | `engineering-head.html` |
| JN | Pre-opening Store Manager | `ruth.reyes@5joys.com` | `store-manager.html` |
| JN | Supply Chain Officer | `joel.navarro@5joys.com` | `supply-chain.html` |
| JN | Finance Head | `carlo.lim@5joys.com` | `finance-head.html` |
| ELLA | Area Manager | `bea.hernandez@5joys.com` | `area-manager.html` |
| ELLA | Executive Management | `maria.santos@5joys.com` | `executive-management.html` |
| ELLA | Post-opening Store Manager | `ruth.torres@5joys.com` | `store-manager.html` |

## 3. Read this before presenting

### What the prototype currently does

- The login form recognizes all twelve email addresses. Any non-empty password passes because the password is not validated.
- Most dashboards use static JavaScript fixture data.
- Business Development, department decisions, HR actions, and Store Manager updates can change the current page’s in-memory data.
- Those changes disappear after a reload and are not shared with another role.
- Several controls display a success message without changing a record.
- **Export Report** opens a role-authorized report selector and generates a printable A4 report in a new window.

### Claims to avoid unless the implementation is changed

| Original story claim | Current implementation |
|---|---|
| A submitted site automatically appears for all department heads | It is added only to the Business Development page’s in-memory array. Department pages load a separate fixture file. |
| Each department approval is retained and advances the workflow | A decision changes the current department page only and is lost on reload. It does not advance the stage or update another role. |
| Operations performs a separate final approval | There is no dedicated **Final Approve** control. Operations has the same **Approve**, **Request Revision**, and **Reject** controls as the other heads. |
| HR-created batches and assignments appear for the Store Trainer | HR and Store Trainer use separate fixture data. |
| Trainer attendance, scores, retraining, and certification are fully editable | Assessment notes produce a toast; only the displayed **Certify** action produces a success toast and does not change the row. |
| Supply updates notify and update the Store Manager | Supply actions show success messages only. They do not modify the visible delivery row or another dashboard. |
| Post-launch reports appear automatically for the Area Manager | Store Manager reports and Area Manager reports use separate local fixtures. |
| Area Manager can assign a corrective action | **+ Create Action** is displayed but has no handler. **Save Review** records no persistent action. |
| Executive Management can drill into Modules 1–5 | The page provides Executive Overview, Branch Expansion, Performance Analytics, Alerts, Reports, and role-authorized report export; there are no module drill-down pages. |

### Recommended demo setup

1. Serve the `src` directory over HTTP. Do not rely on opening the HTML files directly, because the maps and location lookup use network requests.
2. Confirm that OpenStreetMap tiles and Nominatim location search are available.
3. Allow browser pop-ups if **Export Report** will be shown.
4. Pre-encode the Balagtas records in every role-specific fixture listed in Section 7.
5. Open one tab per account before the panel arrives. This avoids losing in-memory changes during a same-tab role switch.
6. Keep two Store Manager tabs: Ruth Reyes for pre-opening and Ruth Torres for post-opening.
7. Never reload a page after a live edit.
8. Prepare two trainer states if the panel must see “Retraining Required” become “Certified”; the current trainer page cannot make that state transition.
9. Put the supporting PDF/JPG/PNG files in an easy-to-find demo folder.

### Known identity mismatches to correct before the demo

| Account | Current mismatch |
|---|---|
| Sophia Ramirez | Business Development fixture initially says Juan Dela Cruz; the login script later replaces the header, but fixture attribution can still say Juan. |
| Carlos Reyes | Operations header can be replaced with Carlos after login, but decisions are attributed to the configured reviewer Daniel Reyes. |
| Angela Santos | Header says Angela, while Settings and HR fixture identity say Camille Navarro. |
| Michael Dela Cruz | Settings uses `michael.delacruz@5joys.com`, not the login email with `dela.cruz`. |
| Ruth Reyes | Both Store Manager accounts open a dashboard hard-coded for Ruth Torres and Pasig Capitol. |
| Joel Navarro | Header says Joel, but greeting and Settings say Lara Mendoza. |
| Engr. Nina Cruz | Settings/config email omits the `engr.` prefix. |
| Atty. Maya Santos | Settings/config email omits the `atty.` prefix. |

These are visible during a page-by-page demo. Fix or stage them before presenting.

## 4. Master data to encode

### 4.1 Site proposal

| System field | Demo value | Presenter note |
|---|---|---|
| Site name/search | `Bee-to-Bee Balagtas Junction, MacArthur Highway, Balagtas, Bulacan` | Use a returned map result, then confirm the pin. |
| Latitude | System-generated from selected map result | Read-only on the form. |
| Longitude | System-generated from selected map result | Read-only on the form. |
| Selected address | System-generated from selected map result | Read-only on the form. |
| Municipality / City | `Balagtas` | Required. Correct it after map search if the whole search phrase is copied into this field. |
| Province / Region | `Bulacan / Central Luzon` | Optional in the current form, but required for the unified demo record. |
| Monthly rent | `95000` | PHP. |
| Lease term | `5` | Years. |
| Annual escalation | `5` | Percent. |
| Advance and deposit | `4` | Months. |
| Security deposit | `190000` | PHP. |
| Target availability | `2026-09-01` | Use the same date in legal and launch data. |
| Total lot area | `420` | Square meters. |
| Usable floor area | `210` | Square meters. |
| Frontage | `18` | Meters. |
| Parking slots | `10` | Slots. |
| Property type | `Commercial Strip` | Select the implemented `commercial-strip` option. |
| Road access | `Major Road` | Select the implemented `major-road` option. |
| Property notes | `High-visibility MacArthur Highway frontage near the Balagtas commercial center; separate delivery access; three-phase power and water available; drainage plan attached; landlord permits exterior signage.` | Use as the consistent operational summary. |
| Analysis radius | `1.5 km` | Default value; mention that it scopes nearby commercial drivers. |
| Seeded viability score | `88%` | The live assessment is randomized, so read the actual live score or seed 88 for repeatability. |
| Classification | `Highly Viable` | Department pages use this label. |
| Strengths | `High highway visibility, strong commuter and residential catchment, suitable floor area, and adequate parking.` | Department proposal overview. |
| Risks | `Peak-hour ingress and drainage performance require monitoring.` | Department proposal overview. |
| Recommendation | `Proceed to cross-department review, subject to verified drainage and delivery-access evidence.` | Department proposal overview. |
| Proposed opening | `2026-10-15` | Use throughout approval, staffing, supply, and clearance records. |
| Submitted date | `2026-08-10` | Use a coherent demo timeline if dates are updated from the existing July fixtures. |
| Review deadline | `2026-08-14` | Same across department fixtures. |

### 4.2 Supporting files

Upload at least one file during the live Business Development scene. Pre-encode all seven in the departmental review fixture:

| Filename | Document label | Department | Initial status |
|---|---|---|---|
| `SP-2026-052_Site-Proposal.pdf` | Site Proposal | Business Development | Verified |
| `SP-2026-052_Market-Evaluation.pdf` | Market Evaluation | Business Development | Verified |
| `SP-2026-052_Title-and-Tax-Declaration.pdf` | Ownership Document | Legal | Verified |
| `SP-2026-052_Draft-Lease.pdf` | Lease Information | Legal / Finance | Verified |
| `SP-2026-052_Zoning-and-Permit-Checklist.pdf` | Zoning and Permit Checklist | Legal | Verified |
| `SP-2026-052_Engineering-Site-Assessment.pdf` | Engineering Assessment | Engineering | Verified |
| `SP-2026-052_Financial-Feasibility.pdf` | Financial Feasibility Report | Finance | Verified |

The current proposal form labels its upload area **Land Title Documents**, accepts PDF/JPG/JPEG/PNG, permits multiple files, and requires at least one file.

### 4.3 Department decisions

All five checklist choices should read **Satisfied** before approval. The third item defaults to **Needs Clarification** on every department page, so the presenter must change it manually.

| Department | Reviewer account | Approval remark to encode/type |
|---|---|---|
| Legal | Atty. Maya Santos | `Ownership, lease, zoning, and permit evidence are complete. No material legal exception prevents endorsement.` |
| Engineering | Engr. Nina Cruz | `Dimensions, utilities, drainage mitigation, safety, and facility requirements are acceptable for build-out.` |
| Finance | Carlo Lim | `Projected investment and operating costs meet the approved budget and return threshold.` |
| Operations | Carlos Reyes | `Staffing, service access, operating capacity, and launch assumptions meet Operations requirements.` |
| Final approval | Executive Management or designated approver | `All mandatory departmental endorsements are complete. SP-2026-052 is approved for branch development.` |

Recommended staged approval history:

| Sequence | Date/time | Result |
|---|---|---|
| Business Development submission | Aug 10, 2026, 9:00 AM | Completed |
| Legal | Aug 10, 2026, 11:00 AM | Approved |
| Engineering | Aug 10, 2026, 1:30 PM | Approved |
| Finance | Aug 10, 2026, 3:00 PM | Approved |
| Operations | Aug 11, 2026, 9:15 AM | Approved |
| Final approval | Aug 11, 2026, 10:00 AM | Approved |

### 4.4 Recruitment and training

Encode the same people in both HR and Store Trainer fixtures.

| Applicant ID | Employee ID | Employee | Position | Recruitment result | Training result |
|---|---|---|---|---|---|
| `APP-26091` | `EMP-26124` | Nicole Garcia | Service Crew | Hired | 94%, Certified |
| `APP-26092` | `EMP-26121` | Andrea Reyes | Cashier | Hired | 90%, Certified |
| `APP-26093` | `EMP-26127` | Joshua Lim | Kitchen Crew | Hired | 68% first attempt; 86% reassessment; Certified |
| `APP-26094` | `EMP-26130` | Carlo Mendoza | Kitchen Crew | Hired | 91%, Certified |

Common applicant fields:

- Preferred branch: `Bee-to-Bee Balagtas Junction`
- Documents: `Verified`
- Interview status before the live HR action: `Interview Completed`
- Interview score: `88` or higher
- Final status after hire: `Hired`
- Batch after assignment: `TRN-2608-B`
- Certification before trainer review: `In Training`

Training batch fields:

| Field | Value |
|---|---|
| Batch ID | `TRN-2608-B` |
| Batch name | `Balagtas Opening Team — Batch A` |
| Store Trainer | `Michael Dela Cruz` |
| Location | `5Joys Training Hub — Bulacan` |
| Start | `2026-09-14` |
| End | `2026-09-25` |
| Capacity | `12` |
| Assigned | `4` for the focused demo, or the full opening roster if available |
| Status before assessment | `Ongoing` |
| Status after certification | `Completed` |

Joshua Lim’s retraining record:

- Failed competency: `Food Preparation and Safety`
- First score: `68%`
- Threshold: `80%`
- Status: `Retraining Required`
- Trainer note: `Repeat temperature-control, cross-contamination, and closing-sanitation modules before reassessment.`
- Reassessment score: `86%`
- Final result: `Passed`
- Certification: `Certified`
- Deployment eligibility: `Ready for Deployment`

### 4.5 Launch readiness and supply

| Readiness requirement | Category | Owner | Mandatory | Evidence | Initial status | Final status |
|---|---|---|---|---|---|---|
| Equipment installation and test | Equipment | Engineering / Technical Team | Yes | Installation report | In Progress | Complete |
| POS installation and transaction test | Systems | IT Team | Yes | POS test confirmation | Complete | Complete |
| Facility and sanitation inspection | Facility | Engineering / Store Manager | Yes | Inspection photos | Complete | Complete |
| Certified crew assignment | Staffing | HR / Store Trainer | Yes | Certification roster | Complete | Complete |
| Opening inventory delivery | Logistics | Supply Chain | Yes | Delivery receipt | Complete | Complete |
| Upright freezer delivery | Equipment | Supply Chain | Yes | `DEL-2026-0742` receipt | Delayed | Complete |
| Exterior signage | Facility | Contractor | No | Completion photo | Complete | Complete |
| Occupancy and operating documents | Documents | Legal | Yes | Permit checklist | Complete | Complete |

Delayed delivery record:

| Field | Initial value | Resolved value |
|---|---|---|
| Delivery ID | `DEL-2026-0742` | Same |
| Item | `Upright Freezer × 1` | Same |
| Branch | `Bee-to-Bee Balagtas Junction` | Same |
| Supplier | `ColdLine Equipment` | Same |
| Expected quantity | `1` | `1` |
| Received quantity | `0` | `1` |
| Original date | `2026-10-05` | Same |
| Revised date | `2026-10-08` | Same |
| Status | `Delayed` | `Received` |
| Corrective action | `Supplier confirmed expedited delivery; Store Manager notified; temporary opening sequence adjusted.` | `Unit received in good condition, installed, tested, and acknowledged by Store Manager.` |

Launch issue:

- ID: `ISS-2026-021`
- Title: `Upright freezer delivery delayed`
- Owner: `Supply Chain Officer — Joel Navarro`
- Priority: `Critical`
- Initial status: `In Progress`
- Final status: `Resolved`
- Resolution note: `DEL-2026-0742 received on Oct 8; quantity and condition verified; equipment test passed.`

Opening clearance:

- Proposed opening date: `2026-10-15`
- Store Manager remark: `All mandatory launch requirements are complete. Certified staffing, permits, equipment, systems, and opening inventory have been verified. DEL-2026-0742 is received and ISS-2026-021 is resolved.`
- Readiness: `100%`
- Clearance status after submission: `Submitted`

### 4.6 Post-opening reporting

Daily Operations Report:

| Field | Value |
|---|---|
| Report ID | `DOR-2026-1016-025` |
| Branch | `BR-025 — Bee-to-Bee Balagtas Junction` |
| Reporting date | `2026-10-16` |
| Sales status | `On target` |
| Sales summary | `₱118,450 gross sales; 624 transactions; ₱189.82 average ticket` |
| Attendance | `17 present / 18 scheduled; one reliever assigned` |
| Operations | `Opening, food-safety, cash-control, and closing checklists completed` |
| Manager note | `Stable first full day. Peak queue reached nine minutes from 12:10–12:35 PM; second cashier deployed.` |
| Status | `Submitted / For Area Manager Review` |

Incident and corrective action:

| Field | Value |
|---|---|
| Incident ID | `INC-2026-0808` |
| Incident | `Upright freezer temperature fluctuation` |
| Category | `Equipment` |
| Priority | `High` |
| Reported by | `Ruth Torres — Store Manager` |
| Status | `Action Required` |
| Immediate control | `Affected stock transferred to backup freezer; holding temperatures verified.` |
| Corrective action ID | `CA-2026-052` |
| Corrective action | `Inspect controller and door seal, recalibrate the unit, and attach 48-hour compliant temperature readings.` |
| Owner | `Ruth Torres / Technical Team` |
| Due date | `2026-10-19` |
| Area Manager note | `Maintain alternate cold storage until two full days of compliant readings are attached.` |
| Final status | `Monitoring`, then `Resolved` after evidence is attached |

### 4.7 Executive lifecycle record

Encode one consolidated row:

| Field | Value |
|---|---|
| Project / Branch | `PRJ-2026-052 / BR-025` |
| Site / Region | `Bee-to-Bee Balagtas Junction / Central Luzon` |
| Target / Actual opening | `2026-10-15 / 2026-10-15` |
| Approval | `100%` |
| Staffing | `100%` |
| Supply | `100%` |
| Launch | `100%` |
| Early performance | `91%` |
| Project status | `Operational — First 90 Days` |
| Risk | `Medium` |
| Management attention | `Monitor INC-2026-0808 and CA-2026-052 until 48-hour temperature evidence is complete.` |

## 5. Full live presentation script

## Scene 1 — The opportunity

### ELLA — Executive Management

Account: `maria.santos@5joys.com`

1. Start on the login page.
2. Enter Maria’s email and any non-empty demo password.
3. Click **LOGIN**.
4. On **Executive Overview**, pause on the four KPI cards: Total Projects, Approved Sites, Active Projects, and High Risk.
5. Click the `Q3 2026` control and briefly show that Q1–Q4 can be selected. Return it to Q3.
6. Point to **Franchise Expansion Pipeline**, **Executive Summary**, **Regional Performance**, and **Executive Alerts**.
7. Do not imply that Balagtas is already present unless the executive fixture has been encoded.

Suggested narration:

> “We have identified an opportunity to open a new Bee-to-Bee branch in Balagtas. This command center gives management an organization-wide view, but the lifecycle begins with a properly documented site application. We must evaluate the location, secure four departmental endorsements, recruit and certify the team, complete launch readiness, and monitor the store after opening. Business Development, the site is yours.”

Handoff: ELLA to ZEL.

## Scene 2 — Module 1: Site application and evaluation

### ZEL — Business Development Officer

Account: `sophia.ramirez@5joys.com`

#### Page walkthrough

1. Log in and confirm the top-right identity says Sophia Ramirez / Business Development.
2. On **Overview**, explain:
   - Total Applications: all proposals in the pipeline.
   - Active Sites: proposals still moving through evaluation or approval.
   - Average AI Score: aggregate viability indicator.
   - Pending Analysis: applications that still require assessment.
   - **Recent Site Applications**: a quick visual sample of the current pipeline.
3. Click **Site Applications**. Explain that each card shows location, municipality, status, site photo, viability score, schools, foot traffic, and commercial activity. Point out the existing archived Balagtas Public Market only to distinguish it from the new Balagtas Junction proposal.
4. Click **Viability Analysis**. Explain the independent analysis workspace: location search, map pin, viability result, and factor breakdown. Do not spend time running this separate screen if the main proposal modal will be used.
5. Click **Recommendations**. Explain that high-potential sites can be summarized for endorsement.
6. Click **Archived Sites**. Explain that rejected or low-potential locations remain available for audit/reference.
7. Return to **Overview**.

#### Create the Balagtas proposal

1. Click **New Site Proposal**.
2. In **Site Location**, type `Bee-to-Bee Balagtas Junction, MacArthur Highway, Balagtas, Bulacan`.
3. Click **Search Map**.
4. Confirm the map moves and the latitude, longitude, and selected address fields populate.
5. Set Municipality / City to `Balagtas` and Province / Region to `Bulacan / Central Luzon`.
6. Explain **Use current location** as an alternative pinning method, but do not click it unless location permission has been tested.
7. Explain that clicking the map or dragging the marker refines the exact proposed premises.
8. Enter all Lease Parameters from Section 4.1.
9. Enter all Property Dimensions from Section 4.1.
10. Select **Commercial Strip** and **Major Road**.
11. Paste the property notes.
12. Click the Land Title Documents upload zone and select the prepared files. Point to the uploaded filename and size list.
13. Leave Analysis Radius at `1.5 km`, and explain that it controls how far the nearby-site scan looks.
14. Click **Assess Viability**. The system first validates all required fields.
15. In the confirmation dialog, click **Run Analysis**.
16. Point to:
    - Nearby Commercial Drivers
    - competitor, mall, school, and transport counts
    - Foot Traffic and Accessibility scores
    - overall Viability Score and status
    - factor breakdown for foot traffic, accessibility, competition, lease, and property
17. Say the actual displayed score. Do not promise exactly 88% unless the scoring has been made deterministic; the present code uses random inputs.
18. Click **Submit Proposal**.
19. In the success dialog, read the generated site ID and submitted viability status.
20. Click **View Application**. Confirm that the new card appears first on Site Applications.

Suggested narration:

> “The application captures more than an address. It combines the exact map location, lease exposure, property dimensions, access, evidence, and local commercial indicators. The assessment explains the score by factor, so the recommendation is reviewable rather than just a single number. I will now submit the site for cross-department review.”

Important presenter cue: the generated ID is time-based and will not be `SP-2026-052` unless the fixture or ID logic is changed. Use the generated ID only for the live submission; use the seeded `SP-2026-052` record in subsequent role tabs.

Optional reporting:

1. Click **Export Report**.
2. Show the two authorized types: Site Viability Evaluation Report and Cross-Department Approval Status and Decision Report.
3. Set reporting period and scope to `SP-2026-052 — Bee-to-Bee Balagtas Junction`.
4. Click **Generate Report**, then **Print / Save as PDF** if needed.

Handoff: ZEL to LIA.

## Scene 3 — Module 2: Departmental approval

All four department pages share the same layout:

- **Overview**: role-specific KPIs, assigned proposal table, and attention cards.
- **Assigned Proposals/Assigned Reviews**: proposal register without the overview KPIs.
- **Approval Progress**: Business Development, Legal, Engineering, Finance, Operations, and Final Approval stages.
- **Needs Attention**: department-specific risk cards.
- **Settings**: profile and review-notification controls.
- Proposal filters: search, status, location, and sort order.
- Proposal detail: overview, department checklist, supporting documents, approval progress, prior comments, and decision controls.

### LIA — Operations Head, initial review

Account: `carlos.reyes@5joys.com`

1. Open **Overview** and explain the five KPI cards: Assigned Proposals, Pending Review, Revision Requested, Approved, and Overdue Reviews.
2. Click **Review now** in the alert banner to show **Needs Attention**; explain that the cards isolate operating risks.
3. Click **Assigned Proposals**.
4. Search `SP-2026-052` or `Balagtas`.
5. Demonstrate the Status and Location filters, then clear them.
6. Change sort from **Newest submitted** to **Earliest deadline**, then return to the desired order.
7. Click **Review Proposal** for Balagtas.
8. Discuss the address, opening date, submitting officer, viability score, classification, strengths, risks, and recommendation.
9. In Supporting Documents, click one eye icon. The current build only displays “Document preview is ready for backend file integration,” so describe the intended evidence preview without claiming the file opened.
10. Read the Operations checklist:
    - Regional expansion alignment
    - Operational capacity
    - Staffing feasibility
    - Accessibility and service potential
    - Store operating suitability
11. Change **Staffing feasibility** from its default **Needs Clarification** to **Satisfied**.
12. For the first pass, do not submit a decision yet. Click outside the modal or its X to close it.
13. Click **Approval Progress** and explain that the dashboard consolidates the intended cross-functional stages.

Suggested narration:

> “Operations checks whether this is not only a viable location, but an operable store. We review service capacity, staffing feasibility, access, and the proposed operating model. I can also see the intended approval chain and earlier comments in the same review.”

Handoff: LIA to ZEL.

### ZEL — Legal Head

Account: `atty.maya.santos@5joys.com`

1. On **Overview**, explain Legal Reviews, Pending Verification, Contract Exceptions, Cleared for Endorsement, and Overdue Reviews.
2. Open **Assigned Reviews**, search `Balagtas`, and click **Review Proposal**.
3. Review the title/tax declaration, draft lease, and zoning/permit checklist entries.
4. Read the Legal checklist:
   - Ownership verification
   - Lease agreement validity
   - Zoning compliance
   - Permit requirements
   - Contractual risks
5. Change **Zoning compliance** from **Needs Clarification** to **Satisfied**.
6. Enter the Legal approval remark from Section 4.3.
7. Click **Approve**.
8. In **Confirm Approved?**, explain that the confirmation prevents accidental decisions.
9. Click **Confirm Submission**.
10. Wait for the success toast and show the row as Approved in this tab.
11. If desired, open **Approval Progress** to show the staged lifecycle view.

Buttons not used in the happy path:

- **Request Revision** requires remarks and records `Revision Requested`.
- **Reject** requires remarks and records `Rejected`.
- **Cancel** or X closes the confirmation without saving.

Suggested narration:

> “Legal validates ownership, lease enforceability, zoning, permits, and contractual exposure. The required evidence is complete, so I am recording Legal’s approval with an auditable rationale.”

Handoff: ZEL to JN.

### JN — Finance Head

Account: `carlo.lim@5joys.com`

1. Explain Financial Reviews, Models Pending, Budget Exceptions, Investment Cleared, and Overdue Reviews.
2. Open **Assigned Reviews**, search `Balagtas`, and click **Review Proposal**.
3. Discuss the `₱95,000` monthly rent, five-year lease, escalation, deposit, expected sales, investment exposure, and financial-feasibility document.
4. Read the Finance checklist:
   - Projected investment
   - Expected return
   - Operating cost estimate
   - Financial feasibility
   - Budget availability
5. Change **Operating cost estimate** to **Satisfied**.
6. Enter the Finance approval remark.
7. Click **Approve** and **Confirm Submission**.
8. Confirm the success toast and Approved row.

Optional report: **Export Report** offers the Approval Status report and Executive Franchise Expansion Summary. Explain that the current exported content is a separate hard-coded sample unless it has been updated to Balagtas.

Suggested narration:

> “Finance checks whether the opportunity remains attractive after lease, fit-out, opening inventory, staffing, and continuing operating costs. The model meets the approved return and budget thresholds, so Finance approves the investment.”

Handoff: JN to LIA.

### LIA — Engineering Head

Account: `engr.nina.cruz@5joys.com`

1. Explain Technical Reviews, Site Evidence Pending, Safety Exceptions, Build-Ready Sites, and Overdue Reviews.
2. Open **Assigned Reviews**, search `Balagtas`, and click **Review Proposal**.
3. Review the engineering assessment and discuss floor area, frontage, utilities, drainage, service access, and safety.
4. Read the Engineering checklist:
   - Site dimensions
   - Utility availability
   - Construction suitability
   - Safety requirements
   - Facility compliance
5. Change **Construction suitability** to **Satisfied**.
6. Enter the Engineering approval remark.
7. Click **Approve** and **Confirm Submission**.
8. Confirm the success toast and Approved row.

Suggested narration:

> “Engineering confirms that the approved concept can actually be built and operated safely at this location. The dimensions, utilities, drainage plan, and facility requirements are acceptable, so Engineering endorses the site.”

### LIA — Operations Head, final operating endorsement

Return to the already-open Carlos Reyes tab. Do not reload it.

1. Open `SP-2026-052` again.
2. Confirm all Operations checklist items are **Satisfied**.
3. Enter the Operations approval remark.
4. Click **Approve**, then **Confirm Submission**.
5. Show the Approved state in the Operations tab.
6. Open **Approval Progress** and point to the staged approvals.

Suggested narration:

> “Legal, Finance, Engineering, and Operations have completed their required reviews. I am recording the final Operations endorsement. In the target workflow, the proposal now advances to Final Approval and branch development.”

Accuracy cue: do not say that this button is a dedicated final approval. It is the Operations department’s normal **Approve** action. Show a pre-encoded Final Approval state or let Executive Management provide the final narrative.

Handoff: LIA to ZEL.

## Scene 4 — Module 3: Recruitment

### ZEL — HR Specialist

Account: `angela.santos@5joys.com`

#### Page walkthrough

1. On **Overview**, explain the seven KPI cards: Total Applicants, For Screening, Interview Scheduled, Hired, In Training, Certified, and Not Deployment Ready.
2. Explain the Applicant Pipeline stages.
3. Point to the deployment-readiness alert and click **Review readiness** to open **Deployment Readiness**. Explain that uncertified employees are blocked.
4. Open **Applicants**.
5. Demonstrate applicant search and the Status, Position, Branch, and Certification filters. Filter Branch to Balagtas.

#### Hire a qualified applicant

1. Click **View Applicant** for Nicole Garcia or another staged Balagtas applicant.
2. Discuss Applicant Profile, Submitted Documents, Recruitment History, and Available Actions.
3. Briefly explain every action:
   - **Schedule Interview** captures date, time, method/location, interviewer, and notes.
   - **Record Result** captures score, recommendation, remarks, and final decision.
   - **Mark as Hired** requires HR remarks and generates an employee record.
   - **Reject Applicant** requires a rejection remark.
   - **Assign to Training** is enabled only after an employee record exists and the employee is unassigned.
4. For the live path, click **Record Result**.
5. Enter score `92`, Recommendation `Recommended`, remarks `Strong service orientation and passed branch-readiness interview`, and Final Decision `Hired`.
6. Click **Record Result** in the workflow modal.
7. Confirm the toast states that the applicant was hired and an employee record was generated.

Alternative shorter path: click **Mark as Hired**, enter the HR approval remark, and click **Generate Employee Record**.

#### Create and fill the training batch

1. Open **Training Batches**.
2. Explain each card’s trainer, location, schedule, capacity, assigned count, available slots, and status.
3. Explain **View Batch**; in the current build it has no action.
4. Explain **Edit Schedule**; it only shows an API-integration toast.
5. Click **+ Create Batch**.
6. Enter the batch values from Section 4.4 and click **Create Batch**.
7. On the new Balagtas batch card, click **Assign Employees**.
8. Select the four staged employees and confirm `TRN-2608-B`.
9. Click **Confirm Assignment**.
10. Confirm the toast says the employees and trainer were notified.
11. Open **Certification** to explain current attendance, assessment, certification, and the Release gate.
12. Open **Deployment Readiness** and show that employees remain blocked until certified.

Suggested narration:

> “HR keeps the full recruitment trail together: documents, interview, decision, employee ID, training assignment, certification, and deployment eligibility. Hiring alone does not make an employee deployable. The employee must complete the assigned training and become Certified.”

Handoff: ZEL to LIA.

## Scene 5 — Training and certification

### LIA — Store Trainer

Account: `michael.dela.cruz@5joys.com`

#### Page walkthrough

1. On **Overview**, explain Assigned Trainees, Sessions Completed, Pending Assessments, Certification Rate, Training Batch Progress, Recent Activity, and Trainees Requiring Action.
2. Click **Review now** or **View assessments** to open **Assessments**.
3. Open **Training Batches** and identify `TRN-2608-B — Balagtas Opening Team — Batch A`.
4. Explain **+ Add Batch Note**. It is displayed but not wired in the current build.
5. Open **Training Sessions**.
6. Explain that **View Attendance**, **Open Session**, and **View** represent attendance/session handling. Current session buttons only show `Training session opened`.
7. Return to **Assessments**.

#### Demonstrate failure and retraining

1. Click **Assess** for the pending trainee and enter a short assessment note; click **Save Assessment**.
2. Click **Review** for Joshua Lim.
3. Enter: `First assessment 68%. Repeat temperature-control, cross-contamination, and closing-sanitation modules before reassessment.`
4. Click **Save Assessment** and show the success toast.
5. Explain the displayed `Requires Coaching` / `Requires Retraining` state.
6. Open **Certifications**.
7. Point to:
   - For Certification
   - Certified
   - Requires Retraining
   - Not Eligible
8. Click **Assign Coaching** for Joshua only if it has been wired before the demo. In the current build that button has no action.
9. Move to the pre-staged reassessment state showing Joshua at 86% and Certified.
10. For an eligible employee with a **Certify** button, click **Certify** and show the success toast.
11. Open **Training Progress** and discuss overall completion, certification rate, coaching needed, reports submitted, batch ranking, and trainer priorities.

Suggested narration:

> “Attendance alone is not enough. The Store Trainer evaluates competency and records coaching when a trainee falls below the 80% threshold. Joshua initially scored 68%, so deployment remained blocked. After focused retraining he scored 86% and became Certified. The Balagtas roster is now ready for deployment.”

Important presenter cue: the current **Save Assessment** and **Certify** controls only display confirmation messages. Use encoded before/after states; do not claim that the visible table was recalculated unless that functionality is added.

Optional reporting: open **Export Report** and select Training Completion and Certification Report. The current report body is a hard-coded Pulilan sample unless updated.

Handoff: LIA to JN.

## Scene 6 — Module 4: Launch readiness

### JN — Store Manager, pre-opening

Account: `ruth.reyes@5joys.com`

#### Page walkthrough

1. Confirm the page has been staged to show Ruth Reyes and Bee-to-Bee Balagtas Junction. The current unmodified page instead shows Ruth Torres / Pasig Capitol.
2. On **Overview**, explain Launch Readiness percentage, Remaining Tasks, Open Issues, Clearance Status, Launch Timeline, Today’s Priorities, and Launch Issues Requiring Attention.
3. Click **Review readiness**.
4. On **Launch Readiness**, explain:
   - overall completion
   - mandatory completion
   - pending verification
   - critical blockers
   - requirement, category, responsible team, evidence, and status columns
5. Explain **+ Add Requirement** and every row’s **Update** button.
6. Open the upright-freezer requirement and show status `In Progress` or `Pending`, delivery reference `DEL-2026-0742`, and the delay remark. Click **Cancel** so it remains unresolved.
7. Open **Readiness Tasks**. Explain **+ Add Task** and each row’s **Update** action for task, owner, status, and priority.
8. Open **Launch Issues**. Explain that **Report Issue** creates a launch blocker with owner, priority, status, and resolution notes.
9. Open `ISS-2026-021 — Upright freezer delivery delayed`, then leave it Critical / In Progress.
10. Open **Opening Clearance**. Show that the request is disabled because a mandatory requirement is incomplete and a critical issue remains unresolved.

Suggested narration:

> “The launch checklist brings staffing, equipment, systems, facilities, documents, and supply evidence into one readiness view. The freezer delivery is mandatory and the linked issue is Critical, so opening clearance is correctly blocked.”

Handoff: JN Store Manager to JN Supply Chain Officer.

### JN — Supply Chain Officer

Account: `joel.navarro@5joys.com`

#### Page walkthrough

1. On **Overview**, explain Branches Preparing, Incoming Deliveries, Delayed/Incomplete, Supply Ready, Launch Supply Readiness, Recent Supply Activity, and Deliveries Requiring Action.
2. Click **Review issues** to open **Supplier Issues**.
3. Explain **+ Report Issue** and the Issue & Corrective Action Log.
4. Open **Supply Readiness** and identify Balagtas. Explain equipment, opening inventory, fixtures/supplies, and overall readiness.
5. Explain **Confirm Selected Branch**. In the current build it shows only a confirmation toast and no branch selection mechanism.
6. Open **Deliveries** and locate `DEL-2026-0742`.

#### Record the delay

1. Click **Update**.
2. Set Delivery Status to `Delayed`.
3. Received Quantity: `0`.
4. Revised Delivery Date: `2026-10-08`.
5. Condition / Corrective Action: `Supplier confirmed expedited delivery; Store Manager notified; temporary opening sequence adjusted.`
6. Click **Save Update** and show the success toast.

#### Record receipt

1. Reopen the same delivery in the staged resolved state.
2. Set Delivery Status to `Received`.
3. Received Quantity: `1`.
4. Revised Delivery Date: `2026-10-08`.
5. Note: `Unit received in good condition, installed, tested, and acknowledged by Store Manager.`
6. Click **Save Update**.
7. Open **Receiving** and explain **+ Record Receipt**, **Receive**, and **Verify**.
8. Open **Inventory** and explain **+ Update Stock**, required, available, pending, variance, and status.
9. Open **Launch Confirmation**.
10. Check the final unresolved supply item if the staged Balagtas fixture uses a checklist.
11. Review Recipient, Subject, and Message.
12. Click **Confirm Supply Readiness & Notify Store Manager** and show the success toast.

Suggested narration:

> “Supply Chain records both the exception and its corrective action. Once the actual quantity and condition are verified, we change the delivery to Received and send the readiness confirmation back to the Store Manager.”

Accuracy cue: **Save Update** and **Notify Store Manager** currently show toasts only. Use a pre-staged received row for the second half.

#### Return to JN — Store Manager

Return to the open Ruth Reyes tab without reloading.

1. Open **Launch Issues**, click **Update** for `ISS-2026-021`, set Status to `Resolved`, enter the resolution note, and click **Save Update**.
2. Open **Launch Readiness**, click **Update** for Upright Freezer Delivery, set Status to `Complete`, enter the delivery receipt evidence, and click **Save Update**.
3. Update every remaining mandatory requirement to `Complete` using the same **Update** modal.
4. Confirm Overall Completion is `100%`, Mandatory Complete equals Mandatory Total, Pending Verification is `0`, and Critical Blockers is `0`.
5. Open **Opening Clearance**.
6. Confirm both validation rows pass.
7. Confirm Proposed Opening Date `2026-10-15`.
8. Enter the clearance remark from Section 4.5.
9. Click **Request Opening Clearance**.
10. Show Current Status `Submitted` and the success toast.

Suggested narration:

> “The supply exception is closed, its evidence is attached to the readiness requirement, and every mandatory item is complete. The validation has moved from Blocked to Passed, so I can now request opening clearance for October 15.”

Handoff: JN to ELLA.

## Scene 7 — Store reporting

### ELLA — Store Manager, post-opening

Account: `ruth.torres@5joys.com`

1. Confirm the page is staged for Ruth Torres and the Balagtas branch.
2. Open **Post-Launch Reports**.
3. If the page says reporting is locked, click **Preview Mode**. Explain that the target system unlocks this area only after opening clearance is approved.
4. Discuss the four report cards:
   - Daily Operations Report
   - Operational Log
   - Incident Reports
   - Corrective Actions
5. Click **Open** for Daily Operations Report.
6. Enter the operational summary from Section 4.6 and click **Save Update**.
7. Click **Open** for Operational Log, enter the peak-hour queue update, and save.
8. Click **Open** for Incident Report.
9. Enter the freezer temperature incident and immediate control, then save.
10. Click **View** for Corrective Actions and explain that the same generic report modal opens in the current prototype.
11. Optionally click **Export Report** and choose Daily Branch Operations Report or Incident and Corrective Action Report.

Suggested narration:

> “Opening the store does not end the process. The Store Manager submits the operating summary, meaningful daily events, and incidents in the same system. Here we are escalating a freezer temperature fluctuation after securing the affected stock.”

Accuracy cue: these reports are not transmitted to the Area Manager page. The Area Manager’s matching Balagtas report and incident must be pre-encoded.

## Scene 8 — Module 5: Post-opening monitoring

### ELLA — Area Manager

Account: `bea.hernandez@5joys.com`

#### Page walkthrough

1. On **Overview**, explain Branches Monitored, Reports Submitted, Open Incidents, Average Performance, Branch Performance, Recent Activity, and Incidents Requiring Review.
2. Click **Branches** and locate `BR-025 — Bee-to-Bee Balagtas Junction`. Explain manager, daily report, performance, and status.
3. Explain **+ Add Branch Note**. It is displayed but not wired.
4. Open **Daily Reports**.
5. Locate `DOR-2026-1016-025` and click **Review**.
6. Enter: `First-day controls verified. Continue peak-hour queue monitoring for the next seven days.`
7. Click **Save Review**.
8. Open **Incident Logs**, locate `INC-2026-0808`, and click **Review**.
9. Enter the Area Manager note from Section 4.6.
10. Click **Save Review**.
11. Open **Corrective Actions** and identify `CA-2026-052`.
12. Explain owner, due date, progress, and status.
13. Open **Performance** and discuss area average, top branch, target attainment, most improved branch, branch ranking, and manager priorities.

Suggested narration:

> “The Area Manager receives one consolidated operating view across assigned branches. I can review the Balagtas daily report and incident immediately, record management instructions, and track the corrective action until the evidence supports closure.”

Accuracy cue: **+ Log Incident**, **+ Create Action**, **+ Add Branch Note**, and **Send Reminder** are displayed but have no click handlers. Phrase the action as pre-encoded tracking unless those controls are implemented. **Save Review** only shows a toast.

Handoff: ELLA remains in control and switches to Executive Management.

## Scene 9 — Executive view

### ELLA — Executive Management

Account: `maria.santos@5joys.com`

1. Return to **Executive Overview**.
2. Point to the KPI cards and the Franchise Expansion Pipeline.
3. Open **Branch Expansion** and locate or narrate the Balagtas staged lifecycle row.
4. Explain the pipeline counts from Applications through Operational.
5. Open **Performance Analytics** and discuss revenue growth, active franchises, pending approvals, expansion goal, regional ranking, and executive priorities.
6. Open **Executive Alerts** and identify the Balagtas incident/corrective-action risk if staged.
7. Open **Reports** and explain consolidated management reporting.
8. Click **Export Report**.
9. Scroll through the ten authorized report types:
   - Site Viability Evaluation Report
   - Cross-Department Approval Status and Decision Report
   - Recruitment Pipeline and Applicant Status Report
   - Training Completion and Certification Report
   - Store Launch Readiness and Opening Clearance Report
   - Supply Readiness and Delivery Exception Report
   - Daily Branch Operations Report
   - Incident and Corrective Action Report
   - Branch Performance Summary Report
   - Executive Franchise Expansion Summary Report
10. Select **Executive Franchise Expansion Summary Report**, set the period and Balagtas scope, and click **Generate Report**.
11. Explain that this represents the management-level lifecycle summary.

Suggested narration:

> “Executive Management sees the complete management picture: the expansion pipeline, departmental decisions, staffing and certification readiness, launch dependencies, operational performance, and active risks. The Balagtas project is now Operational and remains monitored through its first 90 days.”

Accuracy cue: the current Executive page does not offer direct Module 1–5 drill-downs, and the exported report contains static sample rows unless re-encoded.

## Scene 10 — Final statement

All four presenters stand together.

ZEL:

> “Module 1 identifies and evaluates the right site, and Module 3 builds a documented recruitment path from applicant to deployable employee.”

LIA:

> “Module 2 gives every required department a structured review, while training turns hired employees into certified store teams.”

JN:

> “Module 4 coordinates the branch, its tasks, equipment, supplies, issues, and evidence before opening clearance.”

ELLA:

> “Module 5 keeps branch operations visible after launch and gives management a consolidated view of performance and risk.”

ALL:

> “Bee-to-Bee Operations does not just manage a branch—it manages the entire journey from site to store.”

## 6. Per-user page and button reference

This section is the operator’s backup guide if a panelist asks to open another page or explain a control.

### Common shell and modal controls

- **LOGIN** checks the email against the twelve-account list and requires only that the password field is non-empty. An unknown email displays `Unauthorized User`.
- The **menu** icon opens/closes the sidebar on narrow screens.
- The top **search** field filters only elements on the currently displayed page that were given search metadata; it is not a system-wide database search.
- The **notification bell** is a visual control on most pages. Only the Area Manager bell opens a notification dropdown.
- The **user profile / chevron** is visual only; it does not open an account menu.
- **Export Report** is injected after login. It opens Report Type, Period From, Period To, and Branch/Project/Regional Scope fields.
- **Generate Report** opens a new printable report window. **Print / Save as PDF** invokes the browser print dialog.
- **Cancel**, X, clicking a modal backdrop, and—in shared utility modals—Escape close a dialog without applying the pending action.
- **Log Out** navigates to the login page. Logout cleanup is inconsistent between pages, so use a fresh login submission before opening the next role.

### 6.1 Sophia Ramirez — Business Development

Pages:

- **Overview**: KPIs, recent applications, and **New Site Proposal**.
- **Site Applications**: all proposal cards and viability summaries.
- **Viability Analysis**: standalone location analysis with **Analyze Location**.
- **Recommendations**: high-potential recommendations.
- **Archived Sites**: archived site cards and reasons.
- **Settings**: currently falls back to Overview because no Settings render case is implemented.

Buttons and results:

- **New Site Proposal** opens the proposal modal.
- **Search Map** geocodes the query and fills map/coordinates/address.
- Map click or marker drag changes the proposed pin.
- **Use current location** requests browser geolocation.
- Upload zone lists selected supported files.
- Analysis-radius slider updates the radius label/circle.
- **Assess Viability** validates required proposal fields and opens the analysis confirmation.
- **Run Analysis** generates randomized factor scores and enables Submit.
- **Submit Proposal** adds a current-session application and opens the success dialog.
- **View Application** opens Site Applications.
- **Cancel**, X, clicking outside a modal, or Escape closes the relevant modal.
- **Export Report** offers Site Viability and Approval Status reports.
- Top search is not wired on this page.
- Notification bell has no implemented action.
- **Log Out** returns to login, although it does not remove `loggedInUser` in the shared shell.

### 6.2 Carlos Reyes — Operations Head

Pages: Overview, Assigned Proposals, Approval Progress, Needs Attention, Settings.

Review controls:

- **Review now** opens Needs Attention.
- **Review Proposal / Continue Review / View Decision / Open review / View** opens proposal details.
- Search, status filter, location filter, and sort update the table.
- Document eye shows an integration toast, not a document.
- Checklist selectors: Satisfied, Needs Clarification, Incomplete, Not Applicable.
- **Approve** can be submitted without remarks.
- **Request Revision** and **Reject** require remarks.
- **Confirm Submission** updates only this page’s current in-memory proposal.
- **Cancel** or X abandons confirmation.
- **Save Changes / Update Preferences** shows a saved toast only.
- **Export Report** offers Approval, Launch, Supply, Incident, Performance, and Executive reports.
- Notification bell and user-profile chevron have no action.
- **Log Out** returns to login.

### 6.3 Angela Santos — HR Specialist

Pages: Overview, Applicants, Training Batches, Certification, Deployment Readiness, Settings.

Buttons and results:

- **Review readiness** opens Deployment Readiness.
- **+ Schedule Interview** opens applicant/date/time/method/interviewer/notes fields.
- **View Applicant** opens profile, documents, history, and actions.
- Document eye buttons have no handler.
- **Schedule Interview** records a current-session schedule.
- **Record Result** records score/recommendation/remarks/decision and can create an employee ID.
- **Mark as Hired** creates an employee record.
- **Reject Applicant** records rejection.
- **Assign to Training** is enabled only for hired, unassigned employees.
- **+ Create Batch** creates a current-session batch.
- **View Batch** has no action.
- **Assign Employees** checks capacity and assigns selected employees in the current session.
- **Edit Schedule** shows an API-integration toast.
- **Release** is disabled unless Certification is `Certified`; enabled Release sets a current-session deployment flag.
- **Save Changes / Update Preferences** shows a toast only.
- **Export Report** offers Recruitment Pipeline and Training Completion reports.
- Notification bell and user-profile chevron have no action.
- **Log Out** returns to login.

### 6.4 Michael Dela Cruz — Store Trainer

Pages: Overview, Training Batches, Training Sessions, Assessments, Certifications, Training Progress, Settings.

Buttons and results:

- **Review now / View assessments** opens Assessments.
- **View all** opens Training Batches.
- **Assess / Review** on rows with a `data-trainee` attribute opens the assessment note modal.
- **Save Assessment** closes the modal and shows a toast; it does not update score/status.
- **View Attendance / Open Session / View** on session rows shows `Training session opened`.
- **Certify** shows a success toast; it does not update the row.
- **+ Add Batch Note**, **+ New Assessment**, **Assign Coaching**, and generic **View** certification buttons have no handler.
- **Save Changes / Update Preferences** shows a toast.
- Global search filters only currently rendered elements carrying search metadata.
- **Export Report** offers Recruitment Pipeline and Training Completion reports.
- Notification bell and user-profile chevron have no action.
- **Log Out** returns to login.

### 6.5 Ruth Reyes — Store Manager, pre-opening

Pages: Overview, Launch Readiness, Readiness Tasks, Launch Issues, Opening Clearance, Post-Launch Reports, Settings.

Buttons and results:

- Overview shortcuts open Readiness, Tasks, Issues, or Clearance.
- **+ Add Requirement / Update** opens editable requirement status, evidence, and remarks.
- **+ Add Task / Update** opens task, owner, status, and priority.
- **Report Issue / Update** opens issue, owner, priority, status, and resolution notes.
- **Save Update** changes in-memory Store Manager data and recalculates badges/readiness.
- **Request Opening Clearance** is enabled only when all mandatory items are Complete and no unresolved Critical issue exists.
- **Preview Mode** unlocks post-launch actions for the current session.
- Post-launch **Open/View** buttons open one generic report-summary modal.
- **Save Changes / Update Preferences** shows a toast only.
- **Export Report** offers Recruitment, Training, Launch, Supply, Daily, and Incident reports.
- Notification bell and user-profile chevron have no action.
- Both Ruth accounts currently show Ruth Torres / Pasig Capitol unless corrected.

### 6.6 Joel Navarro — Supply Chain Officer

Pages: Overview, Supply Readiness, Deliveries, Receiving, Inventory, Supplier Issues, Launch Confirmation, Settings.

Buttons and results:

- Overview **Review issues**, **View all**, and **Open delivery tracker** navigate to their sections.
- **Confirm Selected Branch** shows a toast; there is no branch selector or saved confirmation.
- **+ Schedule Delivery / Update / Resolve / + Record Receipt / Receive / Verify / + Update Stock / + Report Issue** all open the same supply-record modal.
- Modal fields: Delivery Status, Received Quantity, Revised Delivery Date, and Condition/Corrective Action.
- **Save Update** closes the modal and shows a toast; displayed data is unchanged.
- **Confirm Supply Readiness & Notify Store Manager** shows a toast; no notification is transmitted.
- **Save Changes / Update Preferences** shows a toast.
- **Export Report** offers Launch Readiness and Supply Readiness reports.
- Notification bell and user-profile chevron have no action.
- **Log Out** clears all local storage and returns to login.

### 6.7 Bea Hernandez — Area Manager

Pages: Overview, Branches, Daily Reports, Incident Logs, Corrective Actions, Performance, Settings.

Buttons and results:

- Overview **Review now**, **View all**, and **View incident log** navigate to the relevant section.
- Incident **Review** and report **Open/Review** buttons open the review-note modal.
- **Save Review** closes the modal and shows a toast; the row does not change.
- Notification bell opens a real dropdown on this page.
- Global search filters visible rows with search metadata.
- **+ Add Branch Note**, **Send Reminder**, **+ Log Incident**, and **+ Create Action** have no handler.
- **Save Changes / Update Preferences** shows a toast.
- **Export Report** offers Recruitment, Training, Launch, Supply, Daily, Incident, and Performance reports.
- User-profile chevron has no action.
- **Log Out** returns to login.

### 6.8 Ruth Torres — Store Manager, post-opening

Ruth Torres uses the same page and controls as Ruth Reyes. For this scene focus on:

- **Post-Launch Reports**
- **Preview Mode** if the section is locked
- Daily Operations Report **Open**
- Operational Log **Open**
- Incident Report **Open**
- Corrective Actions **View**
- Generic **Save Update**
- Daily or Incident **Export Report**

The two accounts do not have different branch assignments in the current code.

### 6.9 Engr. Nina Cruz — Engineering Head

Pages and controls are the same shared department-review interface described for Operations.

Engineering-specific review:

- Checklist: Site dimensions, Utility availability, Construction suitability, Safety requirements, Facility compliance.
- Attention cards focus on technical evidence, layout, flood/drainage, and buildability.
- **Export Report** offers Approval Status and Launch Readiness reports.
- Decision attribution uses Engr. Nina Cruz.

### 6.10 Maria Santos — Executive Management

Pages: Executive Overview, Branch Expansion, Performance Analytics, Executive Alerts, Reports, Settings.

Buttons and results:

- Q1/Q2/Q3/Q4 selector updates all four overview KPIs.
- Overview **Review** opens Executive Alerts.
- **View pipeline** opens Branch Expansion.
- **View analytics** opens Performance Analytics.
- Sidebar opens the five executive sections.
- The alert and report tables have no row action buttons.
- The review modal exists in HTML but no current control opens it.
- Global search has little/no effect because most executive rows lack search metadata.
- **Save Changes / Update Preferences** displays a browser alert.
- **Export Report** offers all ten report types in the current report catalog.
- Notification bell and user-profile chevron have no action.
- **Log Out** returns to login.

### 6.11 Carlo Lim — Finance Head

Pages and controls are the shared department-review interface.

Finance-specific review:

- Checklist: Projected investment, Expected return, Operating cost estimate, Financial feasibility, Budget availability.
- Attention cards focus on lease rates, fit-out contribution, investment exposure, and hurdle rates.
- **Export Report** offers Approval Status and Executive Franchise Expansion Summary reports.
- Decision attribution uses Carlo Lim.

### 6.12 Atty. Maya Santos — Legal Head

Pages and controls are the shared department-review interface.

Legal-specific review:

- Checklist: Ownership verification, Lease agreement validity, Zoning compliance, Permit requirements, Contractual risks.
- Attention cards focus on zoning, lease evidence, ownership, and exceptions.
- **Export Report** offers only the Cross-Department Approval Status and Decision Report.
- Decision attribution uses Atty. Maya Santos.

## 7. Fixture encoding map

Because the prototype does not have a backend, the Balagtas story must be duplicated across these sources:

| Data to stage | Current source |
|---|---|
| Business Development identity, cards, recommendation, archive distinction | `src/js/business-development-data.js` |
| Department proposal, documents, stage, history, and progress | `src/js/department-head-data.js` |
| Operations identity and role checklist | `src/js/operations-head.js` |
| Legal identity and role checklist | `src/js/legal-head.js` |
| Finance identity and role checklist | `src/js/finance-head.js` |
| Engineering identity and role checklist | `src/js/engineering-head.js` |
| HR identity, applicants, employees, and batches | `src/js/hr-specialist-data.js` |
| Trainer batches, sessions, assessments, and certifications | `src/js/store-trainer.js` and `src/store-trainer.html` |
| Pre/post-opening branch, requirements, tasks, issues, clearance, reports | `src/js/store-manager.js` and `src/store-manager.html` |
| Balagtas deliveries, receipts, inventory, supplier issue, confirmation | `src/js/supply-chain.js` and `src/supply-chain.html` |
| Balagtas branch, report, incident, action, and performance | `src/js/area-manager.js` and `src/area-manager.html` |
| Executive Balagtas lifecycle, performance, alert, and report row | `src/js/executive-management.js` and `src/executive-management.html` |
| Exported Balagtas reports for all roles | `src/js/report-export.js` |
| Login names, roles, and routes | `src/index.html` |

## 8. Final rehearsal checklist

- [ ] All twelve emails log in to the expected pages.
- [ ] Visible account names, initials, email addresses, roles, and branch assignments match the cast.
- [ ] `SP-2026-052` appears on all four department pages.
- [ ] The proposal is not confused with archived `SP-2026-044`.
- [ ] All department checklists can be changed to Satisfied.
- [ ] The confirmation modal and success toast work for all four reviewers.
- [ ] HR can hire at least one Balagtas applicant and create/assign `TRN-2608-B` without exceeding capacity.
- [ ] Trainer before/after states are ready for Joshua Lim’s retraining story.
- [ ] Store Manager can reach 100% and clear every Critical issue in one unreloaded tab.
- [ ] Supply Chain has both Delayed and Received Balagtas states ready.
- [ ] Ruth Torres can unlock Post-Launch Reports with Preview Mode.
- [ ] Area Manager has the matching Balagtas daily report, incident, and corrective action pre-encoded.
- [ ] Executive Management has the consolidated Balagtas lifecycle row.
- [ ] Pop-ups are allowed and exported reports contain Balagtas rather than the present Pulilan sample.
- [ ] No presenter claims persistent cross-role synchronization in the current prototype.
- [ ] Each presenter knows which buttons are visual placeholders.
