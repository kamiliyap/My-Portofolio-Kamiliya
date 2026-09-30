(() => {
  const form = document.getElementById('discussion-form');
  const translations = document.getElementById('contact-message-translations');
  if (!form || !translations) return;
  const messages = JSON.parse(translations.textContent);
  function updateLanguage() {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'id';
    form.elements.lang.value = lang;
    form.querySelectorAll('[data-contact-message]').forEach((element) => {
      element.textContent = messages[lang][element.dataset.contactMessage];
    });
  }
  updateLanguage();
  new MutationObserver(updateLanguage).observe(document.documentElement, {
    attributes: true, attributeFilter: ['lang']
  });
  // Allow the normal POST to PHP; the server validates and redirects.
})();
