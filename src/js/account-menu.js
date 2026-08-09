(function () {
  'use strict';

  function readUser() {
    try {
      const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (user) return user;
    } catch (_) {
      // Fall through to legacy session values.
    }

    const profile = document.querySelector('.user-profile');
    return {
      name: localStorage.getItem('b2bUserName') || profile?.querySelector('strong')?.textContent.trim() || 'Account User',
      role: localStorage.getItem('b2bUserRole') || profile?.querySelector('span')?.textContent.trim() || 'Authorized User',
      email: ''
    };
  }

  const escapeHtml = (value) => String(value || '').replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[character]));

  function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    return (parts.length > 1 ? `${parts[0][0]}${parts[parts.length - 1][0]}` : parts[0]?.slice(0, 2) || 'AU').toUpperCase();
  }

  function initialize() {
    const profile = document.querySelector('.user-profile');
    if (!profile || profile.closest('.profile-menu-wrapper')) return;

    const user = readUser();
    const settingsIdentity = user.email || `${user.role}:${user.name}`;
    const settingsKey = `b2b-account-settings:${settingsIdentity}`;
    let savedSettings = {};

    try {
      savedSettings = JSON.parse(localStorage.getItem(settingsKey) || '{}') || {};
    } catch (_) {
      savedSettings = {};
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'profile-menu-wrapper';
    profile.parentNode.insertBefore(wrapper, profile);
    wrapper.appendChild(profile);

    profile.classList.add('profile-menu-trigger');
    profile.setAttribute('role', 'button');
    profile.setAttribute('tabindex', '0');
    profile.setAttribute('aria-haspopup', 'menu');
    profile.setAttribute('aria-expanded', 'false');
    profile.setAttribute('aria-controls', 'profileMenuDropdown');

    const dropdown = document.createElement('div');
    dropdown.className = 'profile-menu-dropdown';
    dropdown.id = 'profileMenuDropdown';
    dropdown.setAttribute('role', 'menu');
    dropdown.innerHTML = `
      <div class="profile-menu-header">
        <div class="profile-menu-avatar">${escapeHtml(initials(user.name))}</div>
        <div><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.role)}</span><small>${escapeHtml(user.email)}</small></div>
      </div>
      <div class="profile-menu-actions">
        <button type="button" role="menuitem" data-account-action="profile"><i data-lucide="user-round"></i><span><strong>Profile settings</strong><small>Update your account information</small></span></button>
        <button type="button" role="menuitem" data-account-action="notifications"><i data-lucide="bell-ring"></i><span><strong>Notification preferences</strong><small>Choose the alerts you receive</small></span></button>
        <button type="button" role="menuitem" class="profile-menu-signout" data-account-action="signout"><i data-lucide="log-out"></i><span><strong>Sign out</strong><small>Return to the login screen</small></span></button>
      </div>`;
    wrapper.appendChild(dropdown);

    function refreshMenuIdentity() {
      dropdown.querySelector('.profile-menu-avatar').textContent = initials(user.name);
      const copy = dropdown.querySelector('.profile-menu-header>div:last-child');
      copy.querySelector('strong').textContent = user.name || 'Account User';
      copy.querySelector('span').textContent = user.role || 'Authorized User';
      copy.querySelector('small').textContent = user.email || '';
    }

    function open() {
      dropdown.classList.add('show');
      profile.setAttribute('aria-expanded', 'true');
    }

    function close() {
      dropdown.classList.remove('show');
      profile.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
      if (dropdown.classList.contains('show')) close();
      else open();
    }

    function controlKey(control, index) {
      const wrappedLabel = control.closest('label');
      const previousLabel = control.previousElementSibling?.matches('label') ? control.previousElementSibling : null;
      const label = wrappedLabel || previousLabel;
      const labelText = label?.textContent.replace(/\s+/g, ' ').trim() || '';
      return (control.name || control.id || labelText || `${control.type || control.tagName}-${index}`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    function settingsControls(scope = document) {
      return Array.from(scope.querySelectorAll('.settings-form input, .settings-form select, .settings-form textarea'));
    }

    function restoreSettings() {
      settingsControls().forEach((control, index) => {
        const key = controlKey(control, index);
        if (Object.prototype.hasOwnProperty.call(savedSettings, key)) {
          if (control.type === 'checkbox' || control.type === 'radio') control.checked = Boolean(savedSettings[key]);
          else if (!control.disabled) control.value = savedSettings[key];
          return;
        }

        if (key === 'full-name' && user.name && !control.disabled) control.value = user.name;
        if ((key === 'email' || key === 'email-address') && user.email && !control.disabled) control.value = user.email;
      });
    }

    function persistSettings(button) {
      const form = button.closest('.settings-form');
      if (!form) return;

      settingsControls(form).forEach((control, index) => {
        const key = controlKey(control, index);
        savedSettings[key] = control.type === 'checkbox' || control.type === 'radio' ? control.checked : control.value;

        if (key === 'full-name' && control.value.trim()) user.name = control.value.trim();
        if ((key === 'email' || key === 'email-address') && control.value.trim()) user.email = control.value.trim();
      });

      localStorage.setItem(settingsKey, JSON.stringify(savedSettings));
      const updatedSettingsKey = `b2b-account-settings:${user.email || `${user.role}:${user.name}`}`;
      if (updatedSettingsKey !== settingsKey) localStorage.setItem(updatedSettingsKey, JSON.stringify(savedSettings));
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      localStorage.setItem('b2bUserName', user.name || '');

      const topbarName = profile.querySelector('strong');
      const avatar = profile.querySelector('.avatar');
      if (topbarName) topbarName.textContent = user.name;
      if (avatar) avatar.textContent = initials(user.name);
      refreshMenuIdentity();

      if (window.B2B?.toast) window.B2B.toast('Settings updated successfully.');
    }

    function openSettings(preferenceTarget) {
      const settingsButton = document.querySelector('.nav-item[data-section="settings"]');
      if (!settingsButton) return;
      settingsButton.click();
      close();

      requestAnimationFrame(() => {
        restoreSettings();
        const controls = settingsControls();
        const target = preferenceTarget === 'notifications'
          ? controls.find((control) => control.type === 'checkbox')
          : controls.find((control, index) => controlKey(control, index) === 'full-name') || controls[0];
        target?.focus({ preventScroll: true });
        target?.closest('.panel, .settings-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    function signOut() {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('b2bUserRole');
      localStorage.removeItem('b2bUserName');
      localStorage.removeItem('b2bDepartment');
      window.location.href = 'index.html';
    }

    profile.addEventListener('click', (event) => {
      event.stopPropagation();
      toggle();
    });

    profile.addEventListener('keydown', (event) => {
      if (!['Enter', ' ', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      open();
      if (event.key === 'ArrowDown') dropdown.querySelector('[role="menuitem"]')?.focus();
    });

    dropdown.addEventListener('click', (event) => {
      event.stopPropagation();
      const action = event.target.closest('[data-account-action]')?.dataset.accountAction;
      if (action === 'profile') openSettings('profile');
      if (action === 'notifications') openSettings('notifications');
      if (action === 'signout') signOut();
    });

    dropdown.addEventListener('keydown', (event) => {
      const items = Array.from(dropdown.querySelectorAll('[role="menuitem"]'));
      const current = items.indexOf(document.activeElement);
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        items[(current + 1) % items.length]?.focus();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        items[(current - 1 + items.length) % items.length]?.focus();
      }
      if (event.key === 'Escape') {
        close();
        profile.focus();
      }
    });

    document.addEventListener('click', (event) => {
      const saveButton = event.target.closest('.save-settings');
      if (saveButton) persistSettings(saveButton);
      if (!wrapper.contains(event.target)) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && dropdown.classList.contains('show')) {
        close();
        profile.focus();
      }
    });

    const pageContent = document.querySelector('.page-content');
    if (pageContent) {
      let restoreQueued = false;
      new MutationObserver(() => {
        if (restoreQueued) return;
        restoreQueued = true;
        queueMicrotask(() => {
          restoreQueued = false;
          restoreSettings();
        });
      }).observe(pageContent, { childList: true, subtree: true });
    }

    restoreSettings();
    refreshMenuIdentity();
    if (window.lucide) window.lucide.createIcons();
  }

  initialize();
})();
