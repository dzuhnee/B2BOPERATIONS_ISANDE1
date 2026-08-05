document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const role = document.getElementById('role').value.trim();
    const message = document.getElementById('loginMessage');

    if (role === 'Supply Chain Officer') {
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', 'Lara Mendoza');
        window.location.href = 'supply-chain.html';
        return;
    }

    if (role === 'Area Manager') {
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', 'Bea Hernandez');
        window.location.href = 'area-manager.html';
        return;
    }

    const departmentRoles = {
        'Operations Head': {
            department: 'Operations',
            name: 'Daniel Reyes',
            page: 'operations-head.html'
        },
        'Department Head': {
            department: 'Operations',
            name: 'Daniel Reyes',
            page: 'operations-head.html'
        },
        'Legal Head': {
            department: 'Legal',
            name: 'Atty. Maya Santos',
            page: 'legal-head.html'
        },
        'Finance Head': {
            department: 'Finance',
            name: 'Carlo Lim',
            page: 'finance-head.html'
        },
        'Engineering Head': {
            department: 'Engineering',
            name: 'Engr. Nina Cruz',
            page: 'engineering-head.html'
        }
    };

    if (departmentRoles[role]) {
        const { department, name, page } = departmentRoles[role];
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', name);
        localStorage.setItem('b2bDepartment', department);
        window.location.href = page;
        return;
    }

    if (role === 'HR Specialist') {
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', 'Angela Santos');
        window.location.href = 'hr-specialist.html';
        return;
    }

    message.textContent = role
        ? 'A dashboard for this role has not been connected yet.'
        : 'Please select a user role.';
});
