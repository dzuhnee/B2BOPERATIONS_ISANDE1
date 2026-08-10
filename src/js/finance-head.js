/** Finance-specific identity, metrics, review focus, and requirements. */
const financeHeadConfig = {
    department: 'Finance',
    user: {
        name: 'Carlo Lim',
        initials: 'CL',
        email: 'carlo.lim@5joys.com'
    },
    profile: {
        eyebrow: 'FINANCE CONTROL CENTER',
        title: 'Finance Head Dashboard',
        subtitle: 'Validate investment exposure, returns, operating costs, and budget fit before commitment.',
        focusTitle: 'Financial Review Focus',
        focusSubtitle: 'Investment decisions and assumptions that need Finance attention',
        metrics: [
            ['Financial Reviews', 'wallet-cards', 'red', '6', 'Active finance queue'],
            ['Models Pending', 'calculator', 'yellow', '2', 'Awaiting validation'],
            ['Budget Exceptions', 'badge-dollar-sign', 'orange', '1', 'Needs escalation'],
            ['Investment Cleared', 'badge-check', 'green', '3', 'Passed hurdle rate'],
            ['Overdue Reviews', 'clock-alert', 'red', '0', 'No overdue finance reviews']
        ],
        focus: [
            ['Pulilan Junction', 'Validate the Pulilan investment, lease exposure, and projected operating return.', 'Pending Review', 'warning'],
            ['Ayala Malls Manila Bay', 'Premium lease rate requires a five-year rent-cap scenario.', 'Needs Clarification', 'warning'],
            ['Circuit Makati', 'Returns exceed the investment hurdle and finance approval is complete.', 'Approved', 'success']
        ]
    },
    requirements: [
        'Projected investment',
        'Expected return',
        'Operating cost estimate',
        'Financial feasibility',
        'Budget availability'
    ]
};

function initializeFinanceHeadDashboard() {
    B2BDepartmentHead.initialize(financeHeadConfig);
}

initializeFinanceHeadDashboard();
