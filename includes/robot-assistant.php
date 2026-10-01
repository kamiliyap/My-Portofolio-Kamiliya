<!-- Komponen independen; Anime.js diimpor sebagai module tanpa mengganti window.anime. -->
<link rel="stylesheet" href="assets/css/robot-assistant.css">
<script type="module" src="assets/js/robot-assistant.js"></script>
<aside class="portfolio-assistant" id="portfolio-assistant" aria-label="Portfolio assistant" hidden>
    <div class="assistant-panel">
        <div class="assistant-bubble" id="assistant-bubble" hidden>
            <div class="assistant-heading"><strong>Kamiliya Assistant</strong><button type="button" data-assistant="close" aria-label="Tutup asisten">&times;</button></div>
            <p class="assistant-message" role="status" aria-live="polite" aria-atomic="true"></p>
            <div class="assistant-actions">
                <button type="button" data-assistant="listen">Dengarkan Perkenalan</button>
                <button type="button" data-assistant="stop" hidden>Stop Suara</button>
                <a href="project.php" data-assistant="projects">Lihat Project</a>
                <a href="analytics.php" data-assistant="analytics">Lihat Analytics</a>
                <a href="contact.php" data-assistant="contact" hidden>Hubungi Kamiliya</a>
            </div>
        </div>
        <div class="assistant-follow"><div class="assistant-float">
            <button type="button" class="assistant-character" aria-label="Klik untuk membangunkan" aria-controls="assistant-bubble" aria-expanded="false">
                <img src="assets/robot/robot-tidur.png" width="112" height="112" alt="Robot assistant Kamiliya">
            </button>
        </div></div>
        <span class="assistant-sleep-hint">Klik untuk membangunkan</span>
    </div>
    <button type="button" class="assistant-reopen" data-assistant="open" hidden>Asisten Portfolio</button>
</aside>
<button type="button" class="assistant-summon" data-assistant="summon" hidden>Panggil Robot</button>
