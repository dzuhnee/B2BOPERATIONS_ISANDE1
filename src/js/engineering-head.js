/** Engineering-specific identity, metrics, review focus, and requirements. */
const engineeringHeadConfig = {
    department: 'Engineering',
    user: {
        name: 'Engr. Nina Cruz',
        initials: 'NC',
        email: 'nina.cruz@5joys.com'
    },
    profile: {
        eyebrow: 'ENGINEERING CONTROL CENTER',
        title: 'Engineering Head Dashboard',
        subtitle: 'Confirm site dimensions, utilities, safety, and facility compliance before construction handoff.',
        focusTitle: 'Technical Readiness Focus',
        focusSubtitle: 'Site evidence and buildability issues that need an Engineering decision',
        metrics: [
            ['Technical Reviews', 'ruler', 'red', '6', 'Active engineering queue'],
            ['Site Evidence Pending', 'file-check-2', 'yellow', '2', 'Assessments to validate'],
            ['Safety Exceptions', 'triangle-alert', 'orange', '1', 'Needs mitigation plan'],
            ['Build-Ready Sites', 'hard-hat', 'green', '2', 'Cleared for handoff'],
            ['Overdue Reviews', 'clock-alert', 'red', '0', 'No overdue engineering reviews']
        ],
        focus: [
            ['Pulilan Junction', 'Validate site dimensions, drainage, utilities, and facility compliance for Pulilan.', 'Pending Review', 'warning'],
            ['SM City Fairview Annex', 'Revised back-of-house layout is incomplete.', 'Revision Requested', 'warning'],
            ['Circuit Makati', 'Site, utilities, and facility requirements are compliant.', 'Approved', 'success']
        ]
    },
    requirements: [
        'Site dimensions',
        'Utility availability',
        'Construction suitability',
        'Safety requirements',
        'Facility compliance'
    ]
};

function initializeEngineeringHeadDashboard() {
    B2BDepartmentHead.initialize(engineeringHeadConfig);
}

initializeEngineeringHeadDashboard();
