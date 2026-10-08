(() => {
  const siteTheme = window.KamiliyaTheme;
  siteTheme.subscribe(theme => {
    document.querySelectorAll('[data-theme-label]').forEach(el => { el.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode'; });
  });
  document.querySelectorAll('[data-theme-toggle]').forEach(button => button.addEventListener('click', () => siteTheme.toggle()));
  document.querySelectorAll('[data-show-password]').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById('password');
    const visible = input.type === 'password';
    input.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Sembunyikan' : 'Lihat';
    button.setAttribute('aria-pressed', String(visible));
  }));
  const accountDropdown = document.querySelector('[data-account-dropdown]');
  const accountTrigger = document.getElementById('account-trigger');
  const accountPanel = document.getElementById('account-dropdown-panel');
  const closeAccountDropdown = (restoreFocus = false) => {
    if (!accountPanel) return;
    accountPanel.hidden = true;
    accountTrigger.setAttribute('aria-expanded', 'false');
    if (restoreFocus) accountTrigger.focus();
  };
  if (accountDropdown && accountTrigger && accountPanel) {
    accountTrigger.addEventListener('click', () => {
      const open = accountPanel.hidden;
      accountPanel.hidden = !open;
      accountTrigger.setAttribute('aria-expanded', String(open));
    });
    accountTrigger.addEventListener('keydown', event => {
      if (event.key !== 'ArrowDown') return;
      event.preventDefault();
      accountPanel.hidden = false;
      accountTrigger.setAttribute('aria-expanded', 'true');
      accountPanel.querySelector('button').focus();
    });
    accountDropdown.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !accountPanel.hidden) {
        event.preventDefault(); closeAccountDropdown(true);
      }
    });
    accountDropdown.addEventListener('focusout', event => {
      if (!accountDropdown.contains(event.relatedTarget)) closeAccountDropdown();
    });
    document.addEventListener('click', event => {
      if (!accountDropdown.contains(event.target)) closeAccountDropdown();
    });
  }
  document.querySelectorAll('[data-open-account]').forEach(button => button.addEventListener('click', () => {
    closeAccountDropdown();
    document.getElementById('account-dialog').showModal();
  }));
  document.querySelectorAll('[data-delete-id]').forEach(button => button.addEventListener('click', () => {
    document.getElementById('delete-project-id').value = button.dataset.deleteId;
    document.getElementById('delete-project-name').textContent = button.dataset.deleteTitle;
    document.getElementById('delete-dialog').showModal();
  }));
  document.querySelectorAll('[data-open-logout]').forEach(button => button.addEventListener('click', () => {
    closeAccountDropdown();
    document.getElementById('logout-dialog').showModal();
  }));
  document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  const search = document.querySelector('[data-project-search]');
  if (search) search.addEventListener('input', () => {
    document.querySelectorAll('.admin-table tbody tr').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(search.value.toLowerCase()); });
  });
})();
