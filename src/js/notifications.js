(function () {
  'use strict';

  const NOTIFICATIONS = {
    'Business Development': [
      { id: 'site-review', icon: 'map-pin-check', title: 'Site ready for analysis', message: 'Pulilan Junction has complete location and property details for evaluation.', time: '12 minutes ago', section: 'analysis' },
      { id: 'site-revision', icon: 'file-pen-line', title: 'Proposal needs revision', message: 'The Calumpit site proposal requires an updated traffic assessment.', time: '1 hour ago', section: 'applications' },
      { id: 'site-approved', icon: 'circle-check', title: 'Department review completed', message: 'Legal approved the Pulilan Junction proposal.', time: 'Yesterday', section: 'recommendations' }
    ],
    'Operations Head': [
      { id: 'ops-clearance', icon: 'clipboard-check', title: 'Opening clearance for review', message: 'Pulilan has completed 92% of its mandatory launch requirements.', time: '8 minutes ago', section: 'attention' },
      { id: 'ops-decision', icon: 'git-pull-request', title: 'Proposal decision submitted', message: 'Engineering submitted a conditional approval for PROP-2026-014.', time: '42 minutes ago', section: 'proposals' },
      { id: 'ops-progress', icon: 'chart-no-axes-combined', title: 'Approval progress updated', message: 'Four department decisions are now recorded for Pulilan Junction.', time: 'Today', section: 'progress' }
    ],
    'HR Specialist': [
      { id: 'hr-interviews', icon: 'calendar-clock', title: 'Interviews scheduled today', message: 'Three applicants are due for interview and scoring.', time: '10 minutes ago', section: 'applicants' },
      { id: 'hr-batch', icon: 'users', title: 'Training batch nearing capacity', message: 'Batch TR-2026-014 has two remaining trainee slots.', time: '36 minutes ago', section: 'batches' },
      { id: 'hr-certificate', icon: 'badge-check', title: 'Certification results available', message: 'Six trainee certification results are ready for verification.', time: 'Today', section: 'certification' }
    ],
    'Store Trainer': [
      { id: 'trainer-session', icon: 'calendar-days', title: 'Training session starts soon', message: 'Service standards training begins at 1:00 PM.', time: '15 minutes ago', section: 'sessions' },
      { id: 'trainer-assessment', icon: 'clipboard-list', title: 'Assessments pending', message: 'Two trainees still require final competency scores.', time: '1 hour ago', section: 'assessments' },
      { id: 'trainer-certification', icon: 'award', title: 'Certificates ready', message: 'Passed trainees in TR-2026-014 can now be certified.', time: 'Today', section: 'certifications' }
    ],
    'Store Manager': [
      { id: 'store-task', icon: 'list-checks', title: 'Launch task due today', message: 'POS activation must be verified before opening clearance.', time: '5 minutes ago', section: 'tasks' },
      { id: 'store-supply', icon: 'package-check', title: 'Supply delivery updated', message: 'Two outstanding POS terminals are scheduled for delivery.', time: '28 minutes ago', section: 'readiness' },
      { id: 'store-clearance', icon: 'badge-check', title: 'Conditional clearance issued', message: 'Opening clearance will become final after POS verification.', time: 'Today', section: 'clearance' }
    ],
    'Supply Chain Officer': [
      { id: 'supply-delay', icon: 'truck', title: 'Delivery exception reported', message: 'Two POS terminals for Pulilan are delayed.', time: '7 minutes ago', section: 'issues' },
      { id: 'supply-receiving', icon: 'package-open', title: 'Receiving confirmation needed', message: 'Opening dry inventory is ready for quantity verification.', time: '31 minutes ago', section: 'receiving' },
      { id: 'supply-readiness', icon: 'circle-check', title: 'Readiness status updated', message: 'Pulilan is conditionally ready pending the final delivery.', time: 'Today', section: 'readiness' }
    ],
    'Area Manager': [
      { id: 'area-branch', icon: 'store', title: 'New branch assigned', message: 'Calumpit, Bulacan has been added to your assigned area.', time: 'Just now', section: 'branches' },
      { id: 'area-incident', icon: 'triangle-alert', title: 'High-priority incident', message: 'Paombong reported a freezer temperature issue requiring review.', time: '38 minutes ago', section: 'incidents' },
      { id: 'area-report', icon: 'file-clock', title: 'Daily reports pending', message: 'Two assigned branches have not submitted today’s report.', time: '1 hour ago', section: 'reports' }
    ],
    'Engineering Head': [
      { id: 'engineering-review', icon: 'ruler', title: 'Site plan ready for review', message: 'The Pulilan drainage and facility plan has been submitted.', time: '11 minutes ago', section: 'proposals' },
      { id: 'engineering-revision', icon: 'triangle-alert', title: 'Technical revision requested', message: 'Updated drainage capacity evidence is required before clearance.', time: '47 minutes ago', section: 'attention' },
      { id: 'engineering-progress', icon: 'git-branch', title: 'Review progress updated', message: 'Legal and Finance have completed their proposal reviews.', time: 'Today', section: 'progress' }
    ],
    'Executive Management': [
      { id: 'executive-risk', icon: 'triangle-alert', title: 'Expansion risk requires attention', message: 'One development project remains high risk due to an engineering revision.', time: '6 minutes ago', section: 'alerts' },
      { id: 'executive-launch', icon: 'store', title: 'Branch nearing launch', message: 'Pulilan is at 92% launch readiness with one mandatory dependency open.', time: '34 minutes ago', section: 'expansion' },
      { id: 'executive-performance', icon: 'chart-no-axes-combined', title: 'Performance summary updated', message: 'Central Luzon branch performance is now available for review.', time: 'Today', section: 'performance' }
    ],
    'Finance Head': [
      { id: 'finance-review', icon: 'hand-coins', title: 'Financial review assigned', message: 'Pulilan Junction is ready for investment and lease evaluation.', time: '9 minutes ago', section: 'proposals' },
      { id: 'finance-document', icon: 'file-warning', title: 'Cost document needs attention', message: 'A revised equipment estimate was attached to PROP-2026-014.', time: '53 minutes ago', section: 'attention' },
      { id: 'finance-progress', icon: 'chart-no-axes-combined', title: 'Approval progress updated', message: 'The proposal is awaiting the final Operations decision.', time: 'Today', section: 'progress' }
    ],
    'Legal Head': [
      { id: 'legal-review', icon: 'scale', title: 'Lease review assigned', message: 'Pulilan Junction is ready for legal terms and document review.', time: '13 minutes ago', section: 'proposals' },
      { id: 'legal-document', icon: 'file-warning', title: 'Document clarification needed', message: 'The lessor authorization requires supporting identification.', time: '49 minutes ago', section: 'attention' },
      { id: 'legal-progress', icon: 'git-branch', title: 'Department decisions updated', message: 'Engineering and Finance decisions were added to the proposal.', time: 'Today', section: 'progress' }
    ],
    'Department Head': [
      { id: 'department-review', icon: 'clipboard-check', title: 'Proposal ready for review', message: 'A new site proposal has been assigned to your department.', time: '10 minutes ago', section: 'proposals' },
      { id: 'department-attention', icon: 'triangle-alert', title: 'Review needs attention', message: 'One assigned proposal is waiting for clarification.', time: '1 hour ago', section: 'attention' }
    ]
  };

  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function getUser() {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (user && user.role) return user;
    } catch (_) {
      // Fall back to the legacy session values below.
    }
    const role = localStorage.getItem('b2bUserRole') || document.getElementById('userRole')?.textContent.trim();
    return role ? { role, email: '', name: localStorage.getItem('b2bUserName') || '' } : null;
  }

  function initialize() {
    const originalButton = document.querySelector('.notification-btn');
    const user = getUser();
    if (!originalButton || !user) return;

    const notifications = NOTIFICATIONS[user.role] || NOTIFICATIONS['Department Head'];
    const storageIdentity = user.email || user.name || user.role;
    const storageKey = `b2b-read-notifications:${storageIdentity}`;
    let readIds = new Set();
    try {
      readIds = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch (_) {
      readIds = new Set();
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'notification-wrapper';
    wrapper.innerHTML = `
      <button class="icon-btn notification-btn" type="button" aria-label="Notifications" aria-expanded="false" aria-controls="notificationDropdown">
        <i data-lucide="bell"></i><span class="notification-count" aria-hidden="true"></span>
      </button>
      <section class="notification-dropdown" id="notificationDropdown" aria-label="Notifications">
        <div class="notification-header">
          <div><strong>Notifications</strong><span class="notification-summary"></span></div>
          <button class="notification-mark-all" type="button">Mark all as read</button>
        </div>
        <div class="notification-list"></div>
      </section>`;

    const oldWrapper = originalButton.closest('.notification-wrapper');
    if (oldWrapper) oldWrapper.replaceWith(wrapper);
    else originalButton.replaceWith(wrapper);

    const button = wrapper.querySelector('.notification-btn');
    const dropdown = wrapper.querySelector('.notification-dropdown');
    const list = wrapper.querySelector('.notification-list');
    const count = wrapper.querySelector('.notification-count');
    const summary = wrapper.querySelector('.notification-summary');
    const markAll = wrapper.querySelector('.notification-mark-all');

    function persist() {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readIds)));
    }

    function updateStatus() {
      const unread = notifications.filter((notification) => !readIds.has(notification.id)).length;
      count.textContent = unread > 9 ? '9+' : String(unread);
      count.hidden = unread === 0;
      summary.textContent = unread ? `${unread} unread` : 'All caught up';
      markAll.hidden = unread === 0;
      button.setAttribute('aria-label', unread ? `Notifications, ${unread} unread` : 'Notifications, no unread items');
    }

    function render() {
      list.innerHTML = notifications.map((notification) => {
        const unread = !readIds.has(notification.id);
        return `<button class="notification-item${unread ? ' unread' : ''}" type="button" data-notification-id="${escapeHtml(notification.id)}" data-section="${escapeHtml(notification.section)}">
          <i data-lucide="${escapeHtml(notification.icon)}"></i>
          <span class="notification-copy"><strong>${escapeHtml(notification.title)}</strong><span>${escapeHtml(notification.message)}</span><small>${escapeHtml(notification.time)}</small></span>
          ${unread ? '<span class="notification-unread" aria-label="Unread"></span>' : ''}
        </button>`;
      }).join('');
      updateStatus();
      if (window.lucide) window.lucide.createIcons({ nodes: [wrapper] });
    }

    function close() {
      dropdown.classList.remove('show');
      button.setAttribute('aria-expanded', 'false');
    }

    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = dropdown.classList.toggle('show');
      button.setAttribute('aria-expanded', String(open));
    });

    list.addEventListener('click', (event) => {
      const item = event.target.closest('.notification-item');
      if (!item) return;
      readIds.add(item.dataset.notificationId);
      persist();
      render();
      close();
      document.querySelector(`.nav-item[data-section="${item.dataset.section}"]`)?.click();
    });

    markAll.addEventListener('click', (event) => {
      event.stopPropagation();
      notifications.forEach((notification) => readIds.add(notification.id));
      persist();
      render();
    });

    dropdown.addEventListener('click', (event) => event.stopPropagation());
    document.addEventListener('click', close);
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dropdown.classList.contains('show')) {
        close();
        button.focus();
      }
    });

    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
