document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const role = document.getElementById('role').value;
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
        'Operations Head': ['Operations', 'Daniel Reyes'],
        'Legal Head': ['Legal', 'Atty. Maya Santos'],
        'Finance Head': ['Finance', 'Carlo Lim'],
        'Engineering Head': ['Engineering', 'Engr. Nina Cruz']
    };

    if (departmentRoles[role]) {
        const [department, name] = departmentRoles[role];
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', name);
        localStorage.setItem('b2bDepartment', department);
        window.location.href = 'department-head.html';
        return;
    }

    if (role === 'HR Specialist') {
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', 'Camille Navarro');
        window.location.href = 'hr-specialist.html';
        return;
    }

    message.textContent = role
        ? 'A dashboard for this role has not been connected yet.'
        : 'Please select a user role.';
});
