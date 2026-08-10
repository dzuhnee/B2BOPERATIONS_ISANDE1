/** Operations-specific identity, metrics, review focus, and requirements. */
const operationsHeadConfig = {
    department: 'Operations',
    user: {
        name: 'Daniel Reyes',
        initials: 'DR',
        email: 'daniel.reyes@5joys.com'
    },
    profile: {
        eyebrow: 'OPERATIONS APPROVAL WORKSPACE',
        title: 'Operations Head Dashboard',
        subtitle: 'Coordinate site viability, service readiness, and the final operating recommendation.',
        focusTitle: 'Operational Readiness Focus',
        focusSubtitle: 'Launch risks that need an Operations decision',
        metrics: [
            ['Assigned Proposals', 'files', 'red', '6', 'Active site pipeline'],
            ['Pending Review', 'clock-3', 'yellow', '2', 'Awaiting your review'],
            ['Revision Requested', 'rotate-ccw', 'orange', '1', 'Needs updated evidence'],
            ['Approved', 'badge-check', 'green', '1', 'Ready for next stage'],
            ['Overdue Reviews', 'clock-alert', 'red', '1', 'Escalate today']
        ],
        focus: [
            ['Pulilan Junction', 'Legal, Engineering, and Finance are cleared; record the final Operations endorsement.', 'Pending Review', 'warning'],
            ['Marikina Riverbanks', 'Validate flood mitigation and delivery access assumptions.', 'Under Review', 'info'],
            ['Antipolo Vista Mall', 'Zoning clearance is holding the launch recommendation.', 'Overdue', 'danger']
        ]
    },
    requirements: [
        'Regional expansion alignment',
        'Operational capacity',
        'Staffing feasibility',
        'Accessibility and service potential',
        'Store operating suitability'
    ]
};

function initializeOperationsHeadDashboard() {
    B2BDepartmentHead.initialize(operationsHeadConfig);
}

initializeOperationsHeadDashboard();
