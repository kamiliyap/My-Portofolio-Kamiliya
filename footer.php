<footer class="site-footer">
    <div>
        <p class="footer-brand">Kamiliya</p>
        <p class="footer-copy" data-i18n="footer.copy">Junior Web Programmer yang fokus pada antarmuka cepat, rapi, dan mudah dikembangkan.</p>
    </div>
    <div class="footer-links">
        <a href="mailto:kamiliyaprasmaisya@gmail.com">kamiliyaprasmaisya@gmail.com</a>
        <a href="https://github.com/kamiliyap" target="_blank" rel="noreferrer" data-i18n="footer.github">GitHub</a>
        <a href="https://www.linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228/" target="_blank" rel="noreferrer" data-i18n="footer.linkedin">LinkedIn</a>
        <a href="https://www.instagram.com/kamiliya_latifah" target="_blank" rel="noreferrer" data-i18n="footer.instagram">Instagram</a>
    </div>
</footer>

<div class="chatbox-widget" id="chatbox-widget">
    <button class="chatbox-toggle" id="chatbox-toggle" type="button" aria-expanded="false" aria-controls="chatbox-panel">
        <i class="bi bi-chat-dots-fill"></i>
        <span data-i18n="chat.toggle">Q&A</span>
    </button>

    <section class="chatbox-panel" id="chatbox-panel" hidden>
        <div class="chatbox-header">
            <div>
                <p class="chatbox-kicker" data-i18n="chat.kicker">Chatbox</p>
                <h2 data-i18n="chat.title">Tanya seputar portofolio</h2>
            </div>
            <button class="chatbox-close" id="chatbox-close" type="button" aria-label="Close chatbox" data-i18n-aria-label="chat.close">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>

        <div class="chatbox-messages" id="chatbox-messages"></div>

        <div class="chatbox-quick-actions">
            <button class="chatbox-chip" type="button" data-question="services" data-i18n="chat.quick.services">Layanan</button>
            <button class="chatbox-chip" type="button" data-question="projects" data-i18n="chat.quick.projects">Proyek</button>
            <button class="chatbox-chip" type="button" data-question="skills" data-i18n="chat.quick.skills">Skill</button>
            <button class="chatbox-chip" type="button" data-question="contact" data-i18n="chat.quick.contact">Kontak</button>
        </div>

        <form class="chatbox-form" id="chatbox-form">
            <input
                class="chatbox-input"
                id="chatbox-input"
                type="text"
                autocomplete="off"
                placeholder="Tulis pertanyaan..."
                data-i18n-placeholder="chat.placeholder"
            >
            <button class="button-primary chatbox-submit" type="submit" data-i18n="chat.send">Kirim</button>
        </form>
    </section>
</div>
