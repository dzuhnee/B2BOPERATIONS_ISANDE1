# 5.0 Design Strategy

This chapter presents the design of Bee-to-Bee Operations, the proposed Cross-Functional Franchise Launch and Operations Transaction Processing System for 5Joys Corporation. The design translates the user requirements, user stories, and task analyses identified in Chapter 4 into a consistent visual system, role-based user interfaces, transaction forms, and management reports. The strategy prioritizes clarity, operational visibility, traceability, and prevention of incomplete transactions because the proposed system will be used by several departments throughout the franchise lifecycle.

## 5.1 Design Strategy

The overall design strategy of Bee-to-Bee Operations follows a role-centered and transaction-oriented approach. Each user is shown the information and actions relevant to his or her responsibility, while all modules use a common interface structure so that users moving between processes encounter familiar controls. The system combines a fixed navigation area, a searchable workspace, dashboard summaries, status indicators, tables, forms, modal dialogs, and confirmation messages. This approach supports the five major stages covered by the proposed system: site application and evaluation, cross-functional approval, recruitment and training, launch readiness, and post-opening monitoring.

The interface is designed around the following principles:

1. **Consistency.** Navigation, page headings, cards, tables, forms, buttons, alerts, and status labels follow the same visual rules across user roles.
2. **Role relevance.** Each dashboard presents only the modules, transactions, alerts, and decisions appropriate to the signed-in user's position.
3. **Visibility of status.** Counts, percentages, progress indicators, due dates, alert banners, and colored status labels allow users to determine the condition of a transaction without opening every record.
4. **Traceable decisions.** Proposal reviews, applicant decisions, assessments, delivery updates, incidents, and corrective actions include identifying information, remarks, dates, statuses, and responsible users.
5. **Error prevention.** Required fields, constrained input types, checklists, confirmation dialogs, and workflow restrictions reduce incomplete submissions. For example, an employee who has not been certified cannot be released for deployment, and a branch with incomplete mandatory requirements or unresolved critical issues cannot request opening clearance.
6. **Responsive use.** The interface reorganizes the sidebar, grids, tables, and forms at smaller screen widths so that authorized users can review operational information on desktop and mobile devices.

### 5.1.1 Language and Communication Style

English is used as the primary interface language because it is the language used in the organization's forms, position titles, operational terms, and project documentation. Labels use familiar business terms such as *Site Applications*, *Approval Progress*, *Training Batches*, *Launch Readiness*, *Daily Reports*, and *Corrective Actions*. Buttons begin with direct action words such as *Submit*, *Review*, *Approve*, *Reject*, *Request Revision*, *Assign*, *Confirm*, *Update*, and *Save*. Supporting instructions are concise and placed close to the applicable field or control.

The language distinguishes between informative and consequential actions. Informative controls use labels such as *View*, *Open*, or *Review*, while controls that change a transaction use labels such as *Submit Recommendation*, *Mark as Hired*, *Certify*, or *Confirm Supply Readiness*. Validation messages and workflow notices explain why an action is unavailable and what the user must complete next. This communication style reduces ambiguity in cross-departmental transactions.

### 5.1.2 Color

The color palette uses red and yellow as the primary brand colors, supported by warm neutral backgrounds and semantic status colors. The palette is consistent with the visual identity already applied in the prototype while providing sufficient differentiation between navigation, content, and transaction status.

| Color | Hexadecimal value | Primary use and meaning |
|---|---:|---|
| Primary red | `#E31937` | Main brand color, primary actions, active accents, headings, and notifications |
| Dark red | `#B5122A` | Button hover states and strong brand contrast |
| Sidebar red | `#9D0E25` | Main dashboard navigation |
| Deep sidebar red | `#790B1D` | Gradient endpoint and visual depth in navigation |
| Yellow | `#FFC72C` | Attention badges, deadlines, and brand accent |
| Warm white | `#FFF8F2` | Login and general application background |
| Dashboard neutral | `#F8F6F3` | Main dashboard canvas |
| White | `#FFFFFF` | Cards, forms, tables, top bar, and modal surfaces |
| Primary text | `#2E2E2E` / `#282323` | Headings and body content |
| Muted gray | `#707070` / `#7D7775` | Secondary descriptions, labels, and metadata |
| Green | `#1D9B68` | Completed, approved, certified, ready, and resolved transactions |
| Orange | `#E47D24` | At-risk, delayed, incomplete, or attention-required transactions |

Red is reserved for branding, primary actions, and critical attention so that it does not compete unnecessarily with ordinary data. Green communicates positive completion states, while yellow and orange identify transactions that require monitoring or intervention. Status is also communicated through text labels and icons rather than color alone.

### 5.1.3 Shape and Layout

The visual language uses rounded rectangular forms to create an organized but approachable operational interface. Input fields and buttons generally use a 10-pixel corner radius, navigation items use an 11-pixel radius, alert banners use a 14-pixel radius, and major cards and panels use approximately 15 to 18 pixels. Circular shapes are used for user avatars, notification indicators, timeline markers, map pins, and selected icon backgrounds.

The desktop layout contains a 260-pixel fixed sidebar, a sticky top bar, and a flexible content area. The sidebar establishes role-specific navigation, while the top bar contains search, notifications, and the active user's profile. Within the content area, information is organized into a repeated hierarchy: page title and description, critical alert, key performance indicators, detailed panels, and transaction tables. Modal dialogs are used for focused tasks such as proposal review, applicant processing, competency assessment, delivery updates, and report submission without removing the user from the current context.

White space, subtle borders, and low-opacity shadows separate information groups without making the interface visually heavy. Tables are used for transaction registers and comparison tasks, cards are used for summaries, timelines are used for histories and recent activity, and progress indicators are used for completion and readiness.

### 5.1.4 Imagery

Imagery is used selectively because Bee-to-Bee Operations is an operational system rather than a promotional website. The login screen emphasizes the product logo, while the Business Development module uses branch and site photographs to support location evaluation. Map imagery and interactive location markers help users connect coordinates and addresses with the actual proposed site. Other modules prioritize documentary evidence, icons, tables, and status indicators because these elements are more useful for transaction processing than decorative photographs.

Where uploaded images or files are presented, they function as evidence for a site proposal, delivery issue, operational incident, or corrective action. This ensures that imagery supports verification and decision-making.

### 5.1.5 Typography

Poppins is used throughout the system in weights from 300 to 700. Its clean geometric construction remains readable in dashboard cards, tables, forms, and small labels while giving the system a contemporary and professional appearance. Larger and heavier weights are assigned to page headings and key values, medium weights are used for field labels and action controls, and regular or light weights are used for descriptions and secondary information. Uppercase eyebrow labels with increased letter spacing identify the current functional context, such as *Employee Training*, *Delivery Tracking*, or *Executive Reporting*.

### 5.1.6 Icons

The system uses Lucide line icons because they have a consistent stroke, are recognizable at small sizes, and cover the operational concepts required by the system. Examples include a map pin for site applications, files for proposals, a badge-check for certification, a truck for deliveries, a clipboard-check for readiness, a triangle-alert for incidents, a chart for performance, and a building for expansion projects. Icons accompany text instead of replacing it, thereby improving recognition without reducing clarity.

### 5.1.7 Mood Board

The mood board consolidates the product's intended qualities: coordinated, active, dependable, organized, warm, and operationally focused. It combines the Bee-to-Bee logo, red-and-yellow brand colors, warm neutral surfaces, Poppins typography, rounded cards and controls, Lucide icons, branch photographs, map markers, checklists, progress bars, approval statuses, and dashboard tables. Together, these elements communicate a system that connects several departments while keeping each operational transaction visible and actionable.

| Mood-board element | Visual direction | Intended impression |
|---|---|---|
| Logo and bee symbol | Active bee form combined with the product name | Movement, teamwork, and continuous activity |
| Red and yellow accents | Strong brand colors used with restraint | Energy, urgency, and connection to food-service operations |
| Warm white and neutral backgrounds | Soft, low-contrast application canvas | Approachability and reduced visual fatigue |
| Poppins typeface | Geometric sans-serif with clear hierarchy | Modern, readable, and professional |
| Rounded cards and pills | Soft corners, subtle borders, and status chips | Organized and approachable transactions |
| Line icons | Consistent Lucide icon family | Fast recognition across roles and modules |
| Maps and branch imagery | Site pins, location views, and establishment photos | Grounding decisions in actual franchise locations |
| Tables, checklists, and progress indicators | Structured operational data | Control, traceability, and completion awareness |

**Figure 5.1. Bee-to-Bee Operations Mood Board.** The final manuscript should place the composed mood board here and size it within the institution's figure requirements.

### 5.1.8 Product Name, Logo, and Tagline

The name **Bee-to-Bee Operations** was selected to represent the movement of work between the departments involved in opening and stabilizing a franchise branch. The word *Bee* serves as a memorable reference to coordinated activity and teamwork, while *to-Bee* suggests progression from a proposed site toward a branch that is ready to operate. The name also supports the shortened visual form “Bee 2 Bee,” which is used in the product logo. The word *Operations* clarifies that the product is designed for internal franchise launch and operational transactions rather than customer ordering.

The logo combines a stylized bee with the initial letter **B**, the numeral **2**, and the words **Bee 2 Bee Operations**. The bee communicates activity and collaboration, the numeral connects the two uses of *Bee*, and the red accent creates continuity with the system's primary interface color. The white logo variant remains visible against the red gradient used in the login panel and dashboard sidebar. The logo is positioned prominently on the login screen and repeated in the navigation area to maintain product recognition across roles.

The formal product descriptor remains **“A Cross-Functional Franchise Launch and Operations Transaction Processing System for 5Joys Corporation.”** For shorter promotional and interface applications, the proposed tagline is:

> **From Site to Service, Every Step Connected.**

The tagline summarizes the system boundary established in the study: Bee-to-Bee Operations begins with site identification and continues through approval, staffing, launch preparation, and the first ninety days of branch operations. The phrase *every step connected* reinforces the objective of replacing fragmented documents and communication channels with a shared, traceable workflow.

**Figure 5.2. Bee-to-Bee Operations Logo, Product Name, and Tagline.**

## 5.2 User Interface Design

Bee-to-Bee Operations uses role-based access to present different screens to Business Development Officers, Department Heads, HR Specialists, Store Trainers, Store Managers, Supply Chain Officers, Area Managers, and Executive Management. All role dashboards share the same application shell: the product logo and navigation on the left, search and user controls in the top bar, and task-specific information in the main workspace. The following descriptions document the principal screens and forms represented in the proposed system.

Screenshots placed in the final manuscript should be cropped to the relevant screen or form and must not exceed 5 × 5 inches. Complete screen images may be placed in the system prototype appendix when additional detail is required.

### 5.2.1 Shared Access Interface

**Name**  
: Login Screen

**Description**  
: The Login Screen is the entry point to Bee-to-Bee Operations. Its left panel presents the logo, formal system description, and the five principal capabilities of the system. Its right panel contains fields for email address and password, a user-role selector, an inline validation message, and the **Login** button. After successful authentication, the selected role is directed to its authorized dashboard. The layout adapts into a stacked arrangement at smaller screen widths.

**Layout**  
: Figure 5.3. Login Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

### 5.2.2 Franchise Site Application and Evaluation Interfaces

**Name**  
: Business Development Overview Screen

**Description**  
: This screen summarizes the Business Development Officer's site-development workload. It presents key site-application counts, recent activity, locations requiring attention, viability information, and direct navigation to Site Applications, Viability Analysis, Recommendations, and Archived Sites. The global search field allows the officer to locate applications using the site name, location, or application identifier. The **New Site Proposal** action opens the application form.

**Layout**  
: Figure 5.4. Business Development Overview Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Site Application Register Screen

**Description**  
: The Site Application Register displays proposed locations as searchable transaction records. Each record includes the site or application identifier, location, submission information, viability or workflow status, and an action for opening the record. Users may review active applications, monitor their progress, and identify records that require completion or follow-up. The screen also provides access to the New Site Proposal form.

**Layout**  
: Figure 5.5. Site Application Register Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: New Site Proposal Form

**Description**  
: The New Site Proposal form collects the information required to evaluate a prospective franchise location. The form is organized into numbered sections for Site Location, Lease Parameters, Property Dimensions, Supporting Documents, and Location Intelligence. Users may search for an address, position a map pin, and capture the selected address, latitude, longitude, municipality, and province or region. Lease fields include monthly rent, lease term, annual escalation, advance and deposit, security deposit, and target availability date. Property fields include total lot area, usable floor area, frontage, parking slots, property type, road access, and property notes. The supporting-document control accepts PDF, JPG, JPEG, and PNG files. Required fields, numeric limits, read-only coordinates, and file-type restrictions support validation. The user may save a draft, cancel, or submit the information for viability analysis; a unique Site ID is generated after successful submission.

**Layout**  
: Figure 5.6. New Site Proposal Form. *(Insert screenshot; maximum size: 5 × 5 inches. A full-length version may be placed in the appendix.)*

**Name**  
: Site Viability Analysis Screen

**Description**  
: This screen evaluates the selected location using location and property information. It provides a site selector, location search, interactive map, analysis radius, nearby-location information, and scoring results. The output presents the overall viability score and classification together with contributing factors, strengths, risks, and system recommendations. The map can be used to verify or reposition the selected site before recalculation. The officer may return to the application, revise the information, or proceed to create a recommendation.

**Layout**  
: Figure 5.7. Site Viability Analysis Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Site Recommendations Screen

**Description**  
: The Site Recommendations screen lists evaluated locations and the Business Development Officer's recommended next action. It presents the site identity, viability result, classification, key strengths and risks, and recommendation status. The officer may open a result, generate or confirm a recommendation, and submit a qualified proposal to the cross-functional approval workflow.

**Layout**  
: Figure 5.8. Site Recommendations Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Archived Sites Screen

**Description**  
: This screen contains inactive, rejected, or otherwise archived site records. It enables the Business Development Officer to retrieve historical information without mixing closed records with active applications. Search and record-view controls support later comparison, audit, and reference.

**Layout**  
: Figure 5.9. Archived Sites Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

### 5.2.3 Cross-Functional Approval Interfaces

**Name**  
: Department Head Overview and Assigned Proposals Screen

**Description**  
: The Department Head interface changes its context according to the active Operations, Legal, Finance, or Engineering role. It presents department-specific workload indicators, an assigned-proposal table, deadlines, viability results, and items that require attention. Search, status, location, and sorting controls help the reviewer locate and prioritize proposals. Selecting **Review Proposal** opens the detailed Proposal Review form.

**Layout**  
: Figure 5.10. Department Head Overview and Assigned Proposals Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Site Proposal Review and Decision Form

**Description**  
: The form displays the proposal address, proposed opening, submitting officer, viability score, classification, strengths, risks, and recommendations. It also presents submitted documents, the cross-department approval sequence, and previous comments and decisions. A department-specific checklist allows each requirement to be marked **Satisfied**, **Needs Clarification**, **Incomplete**, or **Not Applicable**. The reviewer must enter decision remarks before selecting **Approve**, **Request Revision**, or **Reject**. A confirmation dialog prevents accidental decisions, after which the system updates the workflow, records the decision history, and notifies relevant users.

**Layout**  
: Figure 5.11. Site Proposal Review and Decision Form. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Approval Progress and Needs Attention Screen

**Description**  
: The Approval Progress view compares each site proposal against the required approval stages and shows whether each stage is completed, pending, under review, overdue, approved, or rejected. The Needs Attention view isolates overdue, incomplete, or clarification-dependent transactions. From either view, the Department Head can open the underlying proposal and continue the review.

**Layout**  
: Figure 5.12. Approval Progress and Needs Attention Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

### 5.2.4 Recruitment and Training Interfaces

**Name**  
: Recruitment and Training Dashboard

**Description**  
: The HR Specialist dashboard summarizes the number of applicants, records for screening, scheduled interviews, hired applicants, employees in training, certified employees, and employees who are not deployment-ready. An applicant pipeline shows the distribution of records across recruitment stages. The Applicant Register provides search and filters for status, position, branch, and certification, together with an action for opening each applicant record.

**Layout**  
: Figure 5.13. Recruitment and Training Dashboard. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Applicant Profile and Recruitment History Screen

**Description**  
: This screen displays the applicant's contact information, position, preferred branch, application date, current status, generated employee identifier when applicable, submitted-document status, and recruitment history. Available controls allow the HR Specialist to schedule an interview, record a result, mark the applicant as hired, reject the applicant, or assign an eligible hire to training. A deployment restriction notice appears when certification is incomplete.

**Layout**  
: Figure 5.14. Applicant Profile and Recruitment History Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Interview, Hiring, and Training Assignment Form

**Description**  
: This modal form changes according to the selected HR transaction. Interview scheduling captures the applicant, date, time, method or location, interviewer, and notes. Interview results capture a numeric score, recommendation, remarks, and final decision. Hiring creates an employee record after confirmation. Training assignment allows one or more eligible employees to be assigned to a batch with available capacity. The system prevents assignment beyond batch capacity and prevents uncertified employees from being released for deployment.

**Layout**  
: Figure 5.15. Interview, Hiring, and Training Assignment Form. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Training Batch and Deployment Readiness Screen

**Description**  
: The Training Batch view presents each batch's name, identifier, assigned trainer, location, schedule, capacity, assigned count, and status. The HR Specialist can create a batch, assign eligible employees, or review batch capacity. Certification and Deployment Readiness views consolidate attendance, assessment, certification, and deployment eligibility. The **Release for Deployment** control is enabled only for certified employees.

**Layout**  
: Figure 5.16. Training Batch and Deployment Readiness Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Store Trainer Dashboard and Training Sessions Screen

**Description**  
: The Store Trainer dashboard presents assigned trainees, active batches, pending assessments, certification progress, recent training activity, and trainees requiring action. The Training Sessions view lists the session identifier, batch, schedule, expected or recorded attendance, and session status. The trainer can open a session to view attendance and record its completion.

**Layout**  
: Figure 5.17. Store Trainer Dashboard and Training Sessions Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Competency Assessment and Certification Form

**Description**  
: The assessment interface lists the trainee, batch, training type, score, and result. Opening a record presents the assessment form and remarks area used to document the trainee's performance. The trainer records standardized evaluation results, identifies coaching or retraining needs, and saves the assessment. The Certification view shows the assessment score, certification status, and deployment eligibility. Eligible employees may be certified, while employees below the standard remain unavailable for deployment and may be assigned additional coaching.

**Layout**  
: Figure 5.18. Competency Assessment and Certification Form. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Training Progress Screen

**Description**  
: This analytical screen summarizes overall completion, certification rate, employees requiring coaching, and submitted training reports. It ranks batches by completion percentage and identifies recommended trainer priorities, including pending assessments, coaching, and completion-report submission.

**Layout**  
: Figure 5.19. Training Progress Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

### 5.2.5 Store Launch Readiness Interfaces

**Name**  
: Store Manager Pre-Opening Overview Screen

**Description**  
: The Store Manager overview summarizes branch launch readiness, completed mandatory requirements, pending tasks, unresolved issues, staffing readiness, supply status, and opening-clearance eligibility. Alert banners identify critical blockers. Navigation provides access to Launch Readiness, Readiness Tasks, Launch Issues, Opening Clearance, and Post-Launch Reports.

**Layout**  
: Figure 5.20. Store Manager Pre-Opening Overview Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Launch Readiness Checklist Screen

**Description**  
: This screen lists equipment, systems, facilities, staffing, safety, and other pre-opening requirements. Each record shows the requirement, category, responsible owner, whether it is mandatory, and its completion status. The Store Manager may add a requirement or update an existing item. Completion percentages are recalculated from the checklist and contribute to opening-clearance eligibility.

**Layout**  
: Figure 5.21. Launch Readiness Checklist Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Readiness Task and Launch Issue Form

**Description**  
: The task interface records the task name, category, responsible owner, due date, priority, status, and remarks. The issue interface records a launch problem, category, responsible team, priority, status, and resolution details. Users may create or update records, while critical unresolved issues are displayed as clearance blockers. Saved changes update the relevant table and dashboard badges.

**Layout**  
: Figure 5.22. Readiness Task and Launch Issue Form. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Opening Clearance Screen

**Description**  
: The Opening Clearance screen consolidates readiness percentage, mandatory-requirement completion, staffing certification, supply readiness, and unresolved critical issues. The request control remains unavailable until all mandatory requirements are completed and all critical issues are resolved. Once eligible, the Store Manager can submit the branch for final opening approval and monitor the resulting decision.

**Layout**  
: Figure 5.23. Opening Clearance Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Supply Chain Overview and Supply Readiness Screen

**Description**  
: The Supply Chain Officer dashboard presents upcoming openings, active deliveries, received items, exceptions, launch supply completion, and shipments requiring action. The Supply Readiness view compares each branch's equipment, opening inventory, fixtures, and overall completion against its opening date. The officer can select a branch and confirm readiness when requirements are complete.

**Layout**  
: Figure 5.24. Supply Chain Overview and Supply Readiness Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Delivery, Receiving, and Inventory Screen

**Description**  
: The Deliveries view lists delivery identifiers, branches, suppliers, schedules, and statuses such as Scheduled, In Transit, Received, Incomplete, Delayed, or Damaged. The update form captures delivery status, received quantity, revised delivery date, condition, and corrective action. The Receiving view supports physical verification of expected and received quantities. The Inventory view compares required, available, pending, and variance quantities for launch stock categories. These functions monitor launch supplies without replacing the organization's routine inventory-management system.

**Layout**  
: Figure 5.25. Delivery, Receiving, and Inventory Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Supplier Issues and Launch Confirmation Screen

**Description**  
: The Supplier Issues view records incomplete, delayed, missing, or damaged deliveries, including the supplier, affected branch, corrective action, revised date, and resolution status. The Launch Confirmation view provides a final supply checklist and a notification preview addressed to the Store Manager. The Supply Chain Officer confirms supply readiness and sends the notification after required items have been verified.

**Layout**  
: Figure 5.26. Supplier Issues and Launch Confirmation Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

### 5.2.6 Post-Opening Monitoring Interfaces

**Name**  
: Store Manager Post-Launch Reports Screen and Submission Form

**Description**  
: This screen becomes available after opening clearance. It provides actions for a Daily Operations Report, Operational Log, Incident Report, and assigned Corrective Actions. The reporting form identifies the report type and provides an operational-summary field for information submitted to the Area Manager. The interface is intentionally limited to operational summaries and does not duplicate the official POS, accounting, payroll, or enterprise inventory systems.

**Layout**  
: Figure 5.27. Store Manager Post-Launch Reports Screen and Submission Form. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Area Manager Overview and Branches Screen

**Description**  
: The Area Manager dashboard summarizes assigned branches, submitted and pending daily reports, open incidents, performance standing, and recent activity. The Branches view lists the branch, Store Manager, latest daily-report status, performance percentage, and operational status. Search and direct navigation allow the Area Manager to identify branches that require support.

**Layout**  
: Figure 5.28. Area Manager Overview and Branches Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Daily Report Review Screen

**Description**  
: The screen lists each branch report, submission time, sales status, operational note, and review status. Selecting **Open** or **Review** displays the selected report and a management-note area. The Area Manager records feedback or instructions and saves the review, after which the report status is updated.

**Layout**  
: Figure 5.29. Daily Report Review Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Incident Log and Corrective Action Screen

**Description**  
: The Incident Log records the incident identifier, affected branch, reporting time, priority, status, and supporting details. The Area Manager may assess severity, assign an owner, record a management note, and create a corrective action with a priority and deadline. The Corrective Actions view monitors open, monitored, and completed actions and supports follow-up on recurring operational issues.

**Layout**  
: Figure 5.30. Incident Log and Corrective Action Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Branch Performance Screen

**Description**  
: This screen compares branches using performance scores, report compliance, incident information, attendance or staffing indicators, and operational trends. Rankings and status labels distinguish strong, stable, and attention-required branches. The information helps the Area Manager identify coaching and intervention priorities.

**Layout**  
: Figure 5.31. Branch Performance Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

### 5.2.7 Executive Monitoring Interfaces

**Name**  
: Executive Management Overview Screen

**Description**  
: The Executive Management dashboard serves as the consolidated command center for the franchise lifecycle. It presents project counts, approved sites, active projects, high-risk items, the franchise expansion pipeline, completion indicators, pending decisions, delayed projects, regional performance, and executive alerts. A quarter selector updates the high-level indicators, while navigation provides access to Branch Expansion, Performance Analytics, Executive Alerts, and Reports.

**Layout**  
: Figure 5.32. Executive Management Overview Screen. *(Insert screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Branch Expansion and Corporate Performance Screen

**Description**  
: The Branch Expansion view consolidates applications, approvals, construction, training, launch, and operational stages. The Corporate Performance view presents organization-wide growth and operational indicators for the selected period. Together, these screens allow executives to compare regional progress, identify delayed projects, and determine which branches require intervention.

**Layout**  
: Figure 5.33. Branch Expansion and Corporate Performance Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

**Name**  
: Executive Alerts and Management Reports Screen

**Description**  
: The Executive Alerts screen isolates high-priority decisions, risks, delayed openings, and other matters requiring management attention. The Management Reports screen summarizes the number of generated, pending, and validation-dependent reports and lists the latest reports by report identifier, responsible department, date, and completion status. Executive notes may be entered through the review dialog.

**Layout**  
: Figure 5.34. Executive Alerts and Management Reports Screen. *(Insert representative screenshot; maximum size: 5 × 5 inches.)*

## 5.3 Report Design

The report design converts transactions recorded across the five modules into consistent operational and management outputs. Reports are generated from authorized system records so that users do not have to manually consolidate separate spreadsheets, messages, and documents. Each report displays the Bee-to-Bee Operations logo, report title, unique report or transaction identifier, reporting period, date and time generated, responsible user or department, applicable branch or project, page number, and confidentiality notice.

Unless otherwise stated, portrait reports use A4 paper measuring 210 × 297 millimeters, while reports containing several comparison columns use A4 landscape measuring 297 × 210 millimeters. Text fields are left-aligned, numeric fields are right-aligned, dates use a consistent month-day-year presentation, currency is displayed in Philippine pesos, and percentages include the percent symbol. Repeated table headers appear on every page. Status values are written as text even when a colored indicator is also used.

The layouts below are report specifications for the proposed system. Sample actual reports generated from representative prototype data should be placed in **Appendix E: Sample Actual Reports of the Proposed System**. The appendix should contain the full-size output, while this section presents the purpose, ownership, volume, frequency, data types, and number of detail lines per page.

### 5.3.1 Site Viability Evaluation Report

**Report Name**  
: Site Viability Evaluation Report

**Description**  
: Presents the proposed site's identifying information, address, coordinates, lease and property data, overall viability score, classification, factor scores, strengths, risks, and system-generated recommendations. It supports the Business Development Officer's decision to archive, revise, or recommend a site.

**Prepared By**  
: Business Development Officer; calculated and formatted by Bee-to-Bee Operations.

**Used By**  
: Business Development Officer, Department Heads, and Executive Management.

**Volume and Frequency**  
: One report for every submitted site application and a revised version whenever evaluation inputs are materially changed; generated on demand.

**Layout**  
: A4 portrait. The header occupies approximately 35 millimeters; the body contains one site-information block, one viability-summary block, and up to 10 factor or finding detail lines on the first page. Data types include alphanumeric Site ID, text address and classification, decimal latitude and longitude, currency lease values, integer area and parking values, date availability, percentage scores, and long-text strengths, risks, and recommendations. Additional findings continue on a second page with the table header repeated. See Appendix E.1.

### 5.3.2 Cross-Department Approval Status and Decision Report

**Report Name**  
: Cross-Department Approval Status and Decision Report

**Description**  
: Consolidates the approval status of a site proposal across Legal, Engineering, Finance, and Operations. It includes reviewer names, checklist results, decision remarks, decision dates, revision requests, final proposal status, and an audit history.

**Prepared By**  
: Respective Department Heads; consolidated and formatted by Bee-to-Bee Operations.

**Used By**  
: Business Development Officer, Department Heads, Executive Management, and authorized audit personnel.

**Volume and Frequency**  
: Updated after every departmental decision and finalized when all required approvals are completed; available on demand for each proposal.

**Layout**  
: A4 portrait. The proposal summary is followed by four department decision lines and an audit table containing up to 15 detail lines per page. Data types include alphanumeric Proposal ID, text site and reviewer names, enumerated checklist and decision statuses, date-time action stamps, Boolean requirement-completion values, and long-text remarks. See Appendix E.2.

### 5.3.3 Recruitment Pipeline and Applicant Status Report

**Report Name**  
: Recruitment Pipeline and Applicant Status Report

**Description**  
: Lists applicants for a selected branch or recruitment period and summarizes their positions, document completeness, recruitment stages, interview schedules and results, hiring decisions, employee identifiers, training assignments, and certification status.

**Prepared By**  
: HR Specialist; compiled by Bee-to-Bee Operations.

**Used By**  
: HR Specialist, Store Trainer, Store Manager, Area Manager, and Executive Management in summarized form.

**Volume and Frequency**  
: Generated weekly during recruitment, before each training assignment, and on demand by branch, position, or applicant status.

**Layout**  
: A4 landscape with up to 20 applicant detail lines per page. Data types include alphanumeric Applicant and Employee IDs, text applicant name, position and branch, date application and interview values, integer or percentage interview score, and enumerated document, recruitment, batch, certification, and deployment statuses. Summary counts appear above the detail table. See Appendix E.3.

### 5.3.4 Training Completion and Certification Report

**Report Name**  
: Training Completion and Certification Report

**Description**  
: Documents a training batch's schedule, trainer, location, trainee attendance, competency scores, assessment remarks, certification results, retraining recommendations, and deployment eligibility.

**Prepared By**  
: Store Trainer; verified by the HR Specialist and compiled by Bee-to-Bee Operations.

**Used By**  
: Store Trainer, HR Specialist, Store Manager, Area Manager, and Executive Management.

**Volume and Frequency**  
: One completion report per training batch, with interim versions after assessment sessions and a final version after certification.

**Layout**  
: A4 landscape with a batch summary and up to 20 trainee detail lines per page. Data types include alphanumeric Batch and Employee IDs, text trainee name and position, date training period, integer attendance counts, percentage assessment score, enumerated result and certification status, Boolean deployment eligibility, and long-text coaching remarks. See Appendix E.4.

### 5.3.5 Store Launch Readiness and Opening Clearance Report

**Report Name**  
: Store Launch Readiness and Opening Clearance Report

**Description**  
: Summarizes the branch's pre-opening requirements, responsible departments, due dates, completion status, staffing certification, supply readiness, open issues, overall completion percentage, and opening-clearance decision.

**Prepared By**  
: Store Manager, with contributing updates from responsible departments; compiled by Bee-to-Bee Operations.

**Used By**  
: Store Manager, Operations Head, Area Manager, Supply Chain Officer, and Executive Management.

**Volume and Frequency**  
: Generated daily during the final launch-preparation period, upon clearance request, and after the final clearance decision; one active report per branch with version history.

**Layout**  
: A4 portrait with a readiness summary followed by up to 25 checklist detail lines per page. Data types include alphanumeric Branch and Requirement IDs, text category and owner, date due and completion values, Boolean mandatory and completed indicators, enumerated status and priority, percentage overall completion, and long-text issue or decision remarks. See Appendix E.5.

### 5.3.6 Supply Readiness and Delivery Exception Report

**Report Name**  
: Supply Readiness and Delivery Exception Report

**Description**  
: Presents equipment and opening-inventory requirements, scheduled and received deliveries, suppliers, expected and actual quantities, item condition, shortages, delayed or incomplete shipments, revised schedules, corrective actions, and final supply-readiness status.

**Prepared By**  
: Supply Chain Officer; compiled by Bee-to-Bee Operations.

**Used By**  
: Supply Chain Officer, Store Manager, Operations Head, Area Manager, and Executive Management.

**Volume and Frequency**  
: Generated daily for branches approaching launch and immediately when a delivery exception is recorded; finalized upon supply-readiness confirmation.

**Layout**  
: A4 landscape with up to 20 delivery or item detail lines per page. Data types include alphanumeric Delivery and Issue IDs, text item, supplier and branch, integer expected and received quantities, date-time schedule and receipt values, enumerated delivery and condition statuses, integer variance, and long-text corrective action. See Appendix E.6.

### 5.3.7 Daily Branch Operations Report

**Report Name**  
: Daily Branch Operations Report

**Description**  
: Records the branch's daily operational status during the first ninety days after opening. It contains the branch and reporting date, sales summary reference, employee attendance summary, checklist completion, significant operational activities, compliance observations, reported incidents, supporting evidence references, and Store Manager remarks. It records operational summaries only and does not replace the official POS, accounting, payroll, or inventory systems.

**Prepared By**  
: Store Manager.

**Used By**  
: Area Manager and Executive Management in consolidated form.

**Volume and Frequency**  
: One report per branch per operating day for the first ninety days after opening. A branch therefore produces up to 90 daily reports within the study's monitoring period.

**Layout**  
: A4 portrait. One branch-day is presented per report. The first page contains fixed summary sections and up to 10 operational activity or incident detail lines; overflow continues on succeeding pages. Data types include alphanumeric Report and Branch IDs, date reporting period, time submission, currency or decimal sales summary, integer scheduled and present employee counts, Boolean checklist indicators, enumerated operational and review statuses, and long-text activities, incidents, and remarks. See Appendix E.7.

### 5.3.8 Incident and Corrective Action Report

**Report Name**  
: Incident and Corrective Action Report

**Description**  
: Documents operational incidents, affected branches, categories, severity, evidence references, assigned owners, required actions, deadlines, status changes, resolution details, and Area Manager feedback. It supports escalation and identification of recurring issues.

**Prepared By**  
: Store Manager for the original incident; Area Manager for severity, assignment, and corrective-action review.

**Used By**  
: Store Manager, Area Manager, Operations Head, and Executive Management.

**Volume and Frequency**  
: Generated whenever an incident is reported or updated. A consolidated register is produced weekly and on demand by branch, category, severity, status, or date range.

**Layout**  
: Individual incident reports use A4 portrait with one incident per report. The consolidated register uses A4 landscape with up to 20 incident detail lines per page. Data types include alphanumeric Incident and Action IDs, text branch, category and owner, date-time reported and resolved values, enumerated severity and status, date deadline, file-reference evidence, and long-text description, action, and resolution. See Appendix E.8.

### 5.3.9 Branch Performance Summary Report

**Report Name**  
: Branch Performance Summary Report

**Description**  
: Compares branches using submitted daily reports, operational status, attendance and certification indicators, incident counts, corrective-action completion, compliance observations, and performance trends. It identifies strong-performing branches and those requiring coaching or intervention.

**Prepared By**  
: Area Manager; calculated and formatted by Bee-to-Bee Operations from approved operational records.

**Used By**  
: Area Manager, Operations Head, and Executive Management.

**Volume and Frequency**  
: Generated weekly during the first ninety days of branch operations, monthly for management review, and on demand for a selected region or date range.

**Layout**  
: A4 landscape with a regional summary and up to 15 branch detail lines per page. Data types include alphanumeric Branch ID, text branch and manager names, integer submitted-report and incident counts, percentage performance and compliance values, enumerated trend and attention status, and long-text coaching recommendation. See Appendix E.9.

### 5.3.10 Executive Franchise Expansion Summary Report

**Report Name**  
: Executive Franchise Expansion Summary Report

**Description**  
: Consolidates information from all five modules to show the number and status of site applications, approval progress, recruitment and certification readiness, launch completion, supply status, newly opened branch performance, unresolved high-priority incidents, and projects requiring executive attention.

**Prepared By**  
: Automatically compiled by Bee-to-Bee Operations from authorized departmental transactions.

**Used By**  
: Executive Management and authorized Department Heads.

**Volume and Frequency**  
: Generated weekly, monthly, quarterly, and on demand. The reporting period and regional scope are selected before generation.

**Layout**  
: A4 landscape. The first page contains key indicators, pipeline totals, and risk summaries. Succeeding pages contain up to 15 franchise-project detail lines per page. Data types include alphanumeric Project and Branch IDs, text site and region, dates for target and actual milestones, integer stage counts, percentage approval, staffing, supply and launch completion, enumerated project and risk statuses, and long-text management attention note. See Appendix E.10.

The actual-size samples listed as Appendices E.1 to E.10 should use representative but non-sensitive data from the proposed system. Every sample should show its full header, detail area, approval or signature area where applicable, footer, page number, and generation date so the reader can evaluate both the information content and the physical report layout.
