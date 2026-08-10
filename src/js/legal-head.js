/** Legal-specific identity, metrics, review focus, and requirements. */
const legalHeadConfig = {
    department: 'Legal',
    user: {
        name: 'Atty. Maya Santos',
        initials: 'MS',
        email: 'maya.santos@5joys.com'
    },
    profile: {
        eyebrow: 'LEGAL CONTROL CENTER',
        title: 'Legal Head Dashboard',
        subtitle: 'Protect every site decision with complete ownership, lease, zoning, and permit evidence.',
        focusTitle: 'Legal Due Diligence Focus',
        focusSubtitle: 'Documents and exceptions that can expose the business to risk',
        metrics: [
            ['Legal Reviews', 'scale', 'red', '6', 'Active legal queue'],
            ['Pending Verification', 'file-check-2', 'yellow', '3', 'Documents to validate'],
            ['Contract Exceptions', 'file-warning', 'orange', '2', 'Require legal position'],
            ['Cleared for Endorsement', 'shield-check', 'green', '3', 'No material exceptions'],
            ['Overdue Reviews', 'clock-alert', 'red', '1', 'Escalate today']
        ],
        focus: [
            ['Pulilan Junction', 'Verify ownership, lease, zoning, and permit evidence for the Pulilan proposal.', 'Pending Review', 'warning'],
            ['Ayala Malls Manila Bay', 'Lease information is pending final verification.', 'Needs Clarification', 'warning'],
            ['Circuit Makati', 'Ownership and lease documents are cleared with no material exceptions.', 'Approved', 'success']
        ]
    },
    requirements: [
        'Ownership verification',
        'Lease agreement validity',
        'Zoning compliance',
        'Permit requirements',
        'Contractual risks'
    ]
};

function initializeLegalHeadDashboard() {
    B2BDepartmentHead.initialize(legalHeadConfig);
}

initializeLegalHeadDashboard();
