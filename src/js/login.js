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

    if (role === 'Department Head') {
        localStorage.setItem('b2bUserRole', role);
        localStorage.setItem('b2bUserName', 'Daniel Reyes');
        localStorage.setItem('b2bDepartment', localStorage.getItem('b2bDepartment') || 'Operations');
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
