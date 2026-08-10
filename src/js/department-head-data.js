window.departmentHeadData={
  users:{Operations:{name:'Daniel Reyes',initials:'DR',email:'daniel.reyes@5joys.com'},Legal:{name:'Atty. Maya Santos',initials:'MS',email:'maya.santos@5joys.com'},Finance:{name:'Carlo Lim',initials:'CL',email:'carlo.lim@5joys.com'},Engineering:{name:'Engr. Nina Cruz',initials:'NC',email:'nina.cruz@5joys.com'}},
  profiles:{
    Operations:{
      eyebrow:'OPERATIONS APPROVAL WORKSPACE',
      title:'Operations Head Dashboard',
      subtitle:'Coordinate site viability, service readiness, and the final operating recommendation.',
      focusTitle:'Operational Readiness Focus',
      focusSubtitle:'Launch risks that need an Operations decision',
      metrics:[['Assigned Proposals','files','red','6','Active site pipeline'],['Pending Review','clock-3','yellow','2','Awaiting your review'],['Revision Requested','rotate-ccw','orange','1','Needs updated evidence'],['Approved','badge-check','green','1','Ready for next stage'],['Overdue Reviews','clock-alert','red','1','Escalate today']],
      focus:[['SM City Fairview Annex','Back-of-house plan needs revision before operating endorsement.','Revision Requested','warning'],['Marikina Riverbanks','Validate flood mitigation and delivery access assumptions.','Under Review','info'],['Antipolo Vista Mall','Zoning clearance is holding the launch recommendation.','Overdue','danger']]
    },
    Legal:{
      eyebrow:'LEGAL CONTROL CENTER',
      title:'Legal Head Dashboard',
      subtitle:'Protect every site decision with complete ownership, lease, zoning, and permit evidence.',
      focusTitle:'Legal Due Diligence Focus',
      focusSubtitle:'Documents and exceptions that can expose the business to risk',
      metrics:[['Legal Reviews','scale','red','6','Active legal queue'],['Pending Verification','file-check-2','yellow','3','Documents to validate'],['Contract Exceptions','file-warning','orange','2','Require legal position'],['Cleared for Endorsement','shield-check','green','3','No material exceptions'],['Overdue Reviews','clock-alert','red','1','Escalate today']],
      focus:[['Antipolo Vista Mall','Zoning clearance is missing and the legal review is overdue.','Overdue','danger'],['Ayala Malls Manila Bay','Lease information is pending final verification.','Needs Clarification','warning'],['Circuit Makati','Ownership and lease documents are cleared with no material exceptions.','Approved','success']]
    },
    Finance:{
      eyebrow:'FINANCE CONTROL CENTER',
      title:'Finance Head Dashboard',
      subtitle:'Validate investment exposure, returns, operating costs, and budget fit before commitment.',
      focusTitle:'Financial Review Focus',
      focusSubtitle:'Investment decisions and assumptions that need Finance attention',
      metrics:[['Financial Reviews','wallet-cards','red','6','Active finance queue'],['Models Pending','calculator','yellow','2','Awaiting validation'],['Budget Exceptions','badge-dollar-sign','orange','1','Needs escalation'],['Investment Cleared','badge-check','green','3','Passed hurdle rate'],['Overdue Reviews','clock-alert','red','0','No overdue finance reviews']],
      focus:[['Evia Lifestyle Center','Fit-out contribution is not finalized; confirm total investment exposure.','Pending Review','warning'],['Ayala Malls Manila Bay','Premium lease rate requires a five-year rent-cap scenario.','Needs Clarification','warning'],['Circuit Makati','Returns exceed the investment hurdle and finance approval is complete.','Approved','success']]
    },
    Engineering:{
      eyebrow:'ENGINEERING CONTROL CENTER',
      title:'Engineering Head Dashboard',
      subtitle:'Confirm site dimensions, utilities, safety, and facility compliance before construction handoff.',
      focusTitle:'Technical Readiness Focus',
      focusSubtitle:'Site evidence and buildability issues that need an Engineering decision',
      metrics:[['Technical Reviews','ruler','red','6','Active engineering queue'],['Site Evidence Pending','file-check-2','yellow','2','Assessments to validate'],['Safety Exceptions','triangle-alert','orange','1','Needs mitigation plan'],['Build-Ready Sites','hard-hat','green','2','Cleared for handoff'],['Overdue Reviews','clock-alert','red','0','No overdue engineering reviews']],
      focus:[['Marikina Riverbanks','Flood mitigation and drainage evidence require technical validation.','Under Review','info'],['SM City Fairview Annex','Revised back-of-house layout is incomplete.','Revision Requested','warning'],['Circuit Makati','Site, utilities, and facility requirements are compliant.','Approved','success']]
    }
  },
  requirements:{
    Operations:['Regional expansion alignment','Operational capacity','Staffing feasibility','Accessibility and service potential','Store operating suitability'],
    Legal:['Ownership verification','Lease agreement validity','Zoning compliance','Permit requirements','Contractual risks'],
    Finance:['Projected investment','Expected return','Operating cost estimate','Financial feasibility','Budget availability'],
    Engineering:['Site dimensions','Utility availability','Construction suitability','Safety requirements','Facility compliance']
  },
  proposals:[
    {id:'PROP-2026-014',site:'Pulilan Junction',location:'Pulilan, Bulacan',submittedBy:'Juan Dela Cruz',score:88,classification:'Highly Viable',stage:'Operations Review',status:'Pending Review',submitted:'2026-07-18',deadline:'2026-07-25',opening:'2026-08-01',address:'Longos, Pulilan, Bulacan',strengths:'High-visibility junction, strong local traffic, and direct DRT Highway access.',risks:'Final POS delivery and exterior-signage timing require launch coordination.',recommendations:'Proceed with departmental approval and retain the mandatory POS dependency in launch controls.',documents:[['Site Proposal','Proposal','Jul 18','Verified'],['Market Evaluation','Research','Jul 18','Verified'],['Ownership & Lease Documents','Legal','Jul 18','Verified'],['Site and Utility Assessment','Engineering','Jul 19','Verified'],['Financial Feasibility Report','Finance','Jul 19','Verified']],history:[['Business Development','Juan Dela Cruz','Completed','Pulilan Junction endorsed with an 88% Highly Viable result.','Jul 18, 2:14 PM'],['Legal','Atty. Maya Santos','Approved','Ownership, lease, zoning, and permit evidence verified.','Jul 19, 10:35 AM'],['Engineering','Engr. Nina Cruz','Approved','Site dimensions, drainage, utilities, and safety requirements cleared.','Jul 20, 9:20 AM'],['Finance','Carlo Lim','Approved','Investment exposure and projected returns meet the approval threshold.','Jul 20, 2:05 PM']]},
    {id:'SP-2026-038',site:'Marikina Riverbanks',location:'Marikina City',submittedBy:'Paolo Garcia',score:84,classification:'Viable',stage:'Engineering Review',status:'Under Review',submitted:'2026-07-14',deadline:'2026-07-22',opening:'2026-10-28',address:'A. Bonifacio Ave., Marikina City',strengths:'Strong family market and favorable floor area.',risks:'Flood mitigation documentation requires validation.',recommendations:'Complete drainage assessment before final approval.',documents:[['Site Proposal','Proposal','Jul 14','Verified'],['Location Photos','Media','Jul 13','Verified'],['Engineering Assessment','Engineering','Jul 18','Pending Verification']],history:[['Business Development','Paolo Garcia','Completed','Demand indicators meet threshold.','Jul 14, 4:21 PM']]},
    {id:'SP-2026-035',site:'SM City Fairview Annex',location:'Quezon City',submittedBy:'Lea Ramos',score:89,classification:'Highly Viable',stage:'Operations Review',status:'Revision Requested',submitted:'2026-07-10',deadline:'2026-07-19',opening:'2026-09-30',address:'Quirino Highway, Quezon City',strengths:'Established mall traffic and strong delivery coverage.',risks:'Back-of-house space is below standard.',recommendations:'Revise layout to protect cold storage and staff circulation.',documents:[['Site Proposal','Proposal','Jul 10','Verified'],['Market Evaluation','Research','Jul 9','Verified'],['Revised Floor Plan','Engineering','—','Incomplete']],history:[['Engineering','Engr. Nina Cruz','Revision Requested','Submit a revised back-of-house layout.','Jul 15, 3:05 PM'],['Operations','Daniel Reyes','Revision Requested','Confirm safe service and inventory flow.','Jul 18, 11:42 AM']]},
    {id:'SP-2026-029',site:'Circuit Makati',location:'Makati City',submittedBy:'Anton Dela Cruz',score:95,classification:'Highly Viable',stage:'Final Approval',status:'Approved',submitted:'2026-07-04',deadline:'2026-07-16',opening:'2026-09-18',address:'Circuit Lane, Hippodromo, Makati City',strengths:'Excellent market fit, visibility, and unit economics.',risks:'Limited overnight delivery window.',recommendations:'Proceed with launch planning and booked delivery slots.',documents:[['Site Proposal','Proposal','Jul 4','Verified'],['Ownership Document','Legal','Jul 4','Verified'],['Engineering Assessment','Engineering','Jul 7','Verified'],['Financial Feasibility Report','Finance','Jul 8','Verified']],history:[['Legal','Atty. Maya Santos','Approved','No material legal exceptions.','Jul 8, 9:10 AM'],['Engineering','Engr. Nina Cruz','Approved','Site and utilities compliant.','Jul 10, 1:25 PM'],['Finance','Carlo Lim','Approved','Returns exceed investment hurdle.','Jul 12, 4:18 PM'],['Operations','Daniel Reyes','Approved','Operational requirements satisfied.','Jul 15, 10:02 AM']]},
    {id:'SP-2026-027',site:'Antipolo Vista Mall',location:'Antipolo City',submittedBy:'Gina Yu',score:76,classification:'Conditionally Viable',stage:'Legal Review',status:'Overdue',submitted:'2026-07-01',deadline:'2026-07-15',opening:'2026-11-08',address:'Manila East Road, Antipolo City',strengths:'Growing residential catchment and reasonable rent.',risks:'Zoning clearance has not been supplied.',recommendations:'Hold endorsement until zoning evidence is verified.',documents:[['Site Proposal','Proposal','Jul 1','Verified'],['Ownership Document','Legal','Jul 1','Verified'],['Zoning Clearance','Legal','—','Incomplete']],history:[['Business Development','Gina Yu','Completed','Conditional endorsement.','Jul 2, 9:44 AM']]},
    {id:'SP-2026-044',site:'Evia Lifestyle Center',location:'Las Piñas City',submittedBy:'Miguel Tan',score:87,classification:'Viable',stage:'Finance Review',status:'Pending Review',submitted:'2026-07-19',deadline:'2026-07-25',opening:'2026-11-15',address:'Daang Hari Road, Las Piñas City',strengths:'Strong target market and good parking access.',risks:'Fit-out contribution not finalized.',recommendations:'Validate full investment exposure and landlord contribution.',documents:[['Site Proposal','Proposal','Jul 19','Verified'],['Market Evaluation','Research','Jul 18','Verified'],['Financial Feasibility Report','Finance','Jul 19','Verified']],history:[['Business Development','Miguel Tan','Completed','Recommended for department review.','Jul 19, 5:02 PM']]}
  ],
  progress:['Business Development','Legal','Engineering','Finance','Operations','Final Approval']
};
