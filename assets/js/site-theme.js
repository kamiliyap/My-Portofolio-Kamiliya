// Shared public/admin theme state. Layouts and palettes remain in their existing CSS.
(() => {
  const key = 'theme';
  const versionKey = 'kamiliya-theme-version';
  const subscribers = new Set();
  const normalize = value => value === 'light' ? 'light' : 'dark';
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') {
      // Legacy public used "light" for its dark palette. Preserve that visible preference once.
      theme = localStorage.getItem(versionKey) === '2' ? saved : (saved === 'light' ? 'dark' : 'light');
    }
  } catch {}
  const apply = () => {
    document.body.classList.toggle('light', theme === 'light');
    document.body.classList.toggle('dark', theme === 'dark');
    subscribers.forEach(callback => callback(theme));
  };
  const persist = () => {
    try {
      localStorage.setItem(versionKey, '2');
      localStorage.setItem(key, theme);
    } catch {}
  };
  const set = value => { theme = normalize(value); persist(); apply(); };
  window.KamiliyaTheme = Object.freeze({
    get: () => theme,
    set,
    toggle: () => set(theme === 'dark' ? 'light' : 'dark'),
    subscribe: callback => { subscribers.add(callback); callback(theme); return () => subscribers.delete(callback); }
  });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    theme = normalize(event.newValue);
    apply();
  });
  persist();
  apply();
})();
