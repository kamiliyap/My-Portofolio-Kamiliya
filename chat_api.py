from __future__ import annotations

from typing import Any

from flask import Flask, jsonify, request


app = Flask(__name__)


DEMO_CONVERSATIONS: dict[str, list[dict[str, str]]] = {
    "id": [
        {"sender": "bot", "text": "Halo 👋 Terima kasih sudah mengunjungi portofolio saya. Ada yang bisa saya bantu?"},
        {"sender": "visitor", "text": "Halo, saya lihat kamu bisa bikin website ya?"},
        {"sender": "bot", "text": "Iya betul 😊 Saya fokus di Web Development (Frontend & Backend). Kakak butuh website seperti apa?"},
        {"sender": "visitor", "text": "Untuk company profile sederhana dulu."},
        {"sender": "bot", "text": "Baik 👍 Company profile biasanya terdiri dari:\n- Home\n- Tentang Kami\n- Layanan\n- Portfolio\n- Kontak\nApakah ada fitur khusus yang dibutuhkan?"},
        {"sender": "visitor", "text": "Bisa ada form pemesanan nggak?"},
        {"sender": "bot", "text": "Bisa banget. Form bisa langsung masuk ke database dan admin bisa lihat di dashboard."},
        {"sender": "visitor", "text": "Kamu pakai teknologi apa?"},
        {"sender": "bot", "text": "Biasanya saya menggunakan:\n- HTML, CSS, JavaScript\n- Bootstrap / Tailwind\n- PHP & MySQL\n- Git untuk version control"},
        {"sender": "visitor", "text": "Bisa pakai Laravel?"},
        {"sender": "bot", "text": "Bisa, tapi untuk project kecil biasanya saya pakai native PHP supaya lebih ringan."},
        {"sender": "visitor", "text": "Berapa lama pengerjaannya?"},
        {"sender": "bot", "text": "Untuk company profile + form sekitar 7-14 hari tergantung revisi."},
        {"sender": "visitor", "text": "Kalau harga?"},
        {"sender": "bot", "text": "Untuk basic company profile mulai dari 2,5 juta. Jika ada dashboard admin dan fitur tambahan bisa 3-5 juta."},
        {"sender": "visitor", "text": "Bisa nego?"},
        {"sender": "bot", "text": "Bisa diskusi 😊 Biasanya saya sesuaikan dengan kebutuhan dan budget."},
        {"sender": "visitor", "text": "Hosting dan domain termasuk?"},
        {"sender": "bot", "text": "Bisa saya bantu urus, atau bisa juga dari pihak kakak. Saya biasanya rekomendasikan Hostinger atau Niagahoster."},
        {"sender": "visitor", "text": "Apakah bisa responsive di HP?"},
        {"sender": "bot", "text": "Pasti 👍 Semua website yang saya buat sudah mobile friendly."},
        {"sender": "visitor", "text": "SEO gimana?"},
        {"sender": "bot", "text": "Saya optimasi dasar seperti:\n- Meta tag\n- Struktur heading\n- Kecepatan loading\n- Sitemap"},
        {"sender": "visitor", "text": "Bisa integrasi WhatsApp?"},
        {"sender": "bot", "text": "Bisa, tombol WhatsApp langsung ke nomor bisnis kakak."},
        {"sender": "visitor", "text": "Kalau saya mau lihat project sebelumnya?"},
        {"sender": "bot", "text": "Bisa cek di bagian Portfolio ya 😊 Ada beberapa project yang sudah saya kerjakan."},
        {"sender": "visitor", "text": "Kamu kerja sendiri atau tim?"},
        {"sender": "bot", "text": "Untuk sekarang saya handle sendiri, tapi jika project besar saya bisa kolaborasi dengan tim."},
        {"sender": "visitor", "text": "Apakah ada garansi?"},
        {"sender": "bot", "text": "Ada free maintenance 1 bulan setelah website selesai."},
        {"sender": "visitor", "text": "Kalau mau mulai gimana?"},
        {"sender": "bot", "text": "Biasanya kita diskusi detail dulu, lalu DP 30%, setelah itu saya mulai development."},
        {"sender": "visitor", "text": "Pembayaran bisa transfer?"},
        {"sender": "bot", "text": "Bisa via BCA / Mandiri."},
        {"sender": "visitor", "text": "Oke nanti saya kabari ya."},
        {"sender": "bot", "text": "Baik 😊 Saya tunggu kabarnya. Terima kasih sudah menghubungi."},
    ],
    "en": [
        {"sender": "bot", "text": "Hello 👋 Thank you for visiting my portfolio. How can I help you?"},
        {"sender": "visitor", "text": "Hi, I saw that you can build websites?"},
        {"sender": "bot", "text": "Yes 😊 I focus on Web Development (Frontend & Backend). What kind of website do you need?"},
        {"sender": "visitor", "text": "A simple company profile first."},
        {"sender": "bot", "text": "Sure 👍 A company profile usually includes:\n- Home\n- About Us\n- Services\n- Portfolio\n- Contact\nDo you need any special features?"},
        {"sender": "visitor", "text": "Can it include an order form?"},
        {"sender": "bot", "text": "Absolutely. The form can go straight into the database and the admin can review it in the dashboard."},
        {"sender": "visitor", "text": "What technologies do you use?"},
        {"sender": "bot", "text": "I usually use:\n- HTML, CSS, JavaScript\n- Bootstrap / Tailwind\n- PHP & MySQL\n- Git for version control"},
        {"sender": "visitor", "text": "Can you use Laravel?"},
        {"sender": "bot", "text": "Yes, but for small projects I usually use native PHP so it stays lighter."},
        {"sender": "visitor", "text": "How long does it take?"},
        {"sender": "bot", "text": "For a company profile plus form, around 7-14 days depending on revisions."},
        {"sender": "visitor", "text": "What about the price?"},
        {"sender": "bot", "text": "A basic company profile starts from 2.5 million IDR. With admin dashboard and extra features, it is usually around 3-5 million IDR."},
        {"sender": "visitor", "text": "Is the price negotiable?"},
        {"sender": "bot", "text": "We can discuss it 😊 I usually adjust it to the project scope and budget."},
        {"sender": "visitor", "text": "Are hosting and domain included?"},
        {"sender": "bot", "text": "I can help arrange them, or you can provide them yourself. I usually recommend Hostinger or Niagahoster."},
        {"sender": "visitor", "text": "Will it be responsive on mobile?"},
        {"sender": "bot", "text": "Definitely 👍 All websites I build are mobile friendly."},
        {"sender": "visitor", "text": "How about SEO?"},
        {"sender": "bot", "text": "I handle basic optimization such as:\n- Meta tags\n- Heading structure\n- Loading speed\n- Sitemap"},
        {"sender": "visitor", "text": "Can you integrate WhatsApp?"},
        {"sender": "bot", "text": "Yes, I can add a WhatsApp button that goes directly to your business number."},
        {"sender": "visitor", "text": "Can I see your previous projects?"},
        {"sender": "bot", "text": "Sure, you can check the Portfolio section 😊 There are several projects there."},
        {"sender": "visitor", "text": "Do you work alone or with a team?"},
        {"sender": "bot", "text": "Right now I handle projects myself, but for larger work I can collaborate with a team."},
        {"sender": "visitor", "text": "Is there any warranty?"},
        {"sender": "bot", "text": "Yes, there is 1 month of free maintenance after the website is completed."},
        {"sender": "visitor", "text": "How do we get started?"},
        {"sender": "bot", "text": "Usually we discuss the details first, then a 30% down payment, and after that I start development."},
        {"sender": "visitor", "text": "Can payment be done by bank transfer?"},
        {"sender": "bot", "text": "Yes, via BCA / Mandiri."},
        {"sender": "visitor", "text": "Okay, I will let you know later."},
        {"sender": "bot", "text": "Alright 😊 I will wait for your update. Thank you for reaching out."},
    ],
}


RESPONSES: dict[str, dict[str, str]] = {
    "id": {
        "fallback": "Saya bisa bantu jawab tentang layanan, proyek, teknologi, timeline, harga, WhatsApp, atau cara memulai project.",
        "services": "Saya bisa bantu web company profile, landing page, portfolio, form pemesanan, dashboard admin sederhana, dan integrasi WhatsApp.",
        "company_profile": "Untuk company profile sederhana, section umumnya Home, Tentang Kami, Layanan, Portfolio, Testimoni, dan Kontak. Kalau perlu saya bisa tambah form pemesanan juga.",
        "form": "Bisa. Form pemesanan atau form kontak bisa masuk ke database MySQL dan nanti dilihat dari dashboard admin.",
        "tech": "Teknologi yang biasa dipakai: HTML, CSS, JavaScript, Bootstrap atau Tailwind, PHP, MySQL, Git, dan bisa juga Laravel kalau scope project memang cocok.",
        "laravel": "Bisa pakai Laravel. Untuk project kecil biasanya native PHP lebih ringan, tapi kalau butuh struktur lebih besar saya bisa pakai Laravel.",
        "timeline": "Estimasi company profile plus form biasanya sekitar 7-14 hari, tergantung jumlah halaman, revisi, dan fitur tambahan.",
        "price": "Untuk basic company profile mulai dari 2,5 juta. Kalau ada dashboard admin dan fitur tambahan biasanya sekitar 3-5 juta.",
        "nego": "Bisa diskusi. Saya biasanya sesuaikan dengan scope, prioritas fitur, dan budget yang tersedia.",
        "hosting": "Hosting dan domain bisa saya bantu urus, atau bisa juga disediakan dari pihak Anda. Rekomendasi umum: Hostinger atau Niagahoster.",
        "responsive": "Ya, website dibuat responsive dan mobile friendly, jadi tetap nyaman dibuka di HP, tablet, maupun desktop.",
        "seo": "Saya bisa bantu optimasi SEO dasar seperti meta tag, struktur heading, kecepatan loading, alt text gambar, dan sitemap.",
        "whatsapp": "Bisa integrasi WhatsApp, misalnya tombol chat langsung ke nomor bisnis atau CTA WhatsApp di beberapa section.",
        "portfolio": "Bisa lihat contoh project di halaman Portfolio. Di sana ada contoh company profile, dashboard internal, dan personal branding website.",
        "team": "Saat ini project saya handle sendiri. Kalau scope besar, saya bisa kolaborasi dengan tim.",
        "garansi": "Ada free maintenance 1 bulan setelah website selesai untuk perbaikan minor atau penyesuaian kecil.",
        "start": "Untuk mulai, biasanya kita diskusi kebutuhan dulu, lanjut breakdown fitur, DP 30%, lalu saya mulai development.",
        "payment": "Pembayaran bisa via transfer bank, misalnya BCA atau Mandiri.",
        "contact": "Kalau ingin lanjut diskusi, bisa hubungi lewat email kamiliyaprasmaisya@gmail.com atau halaman contact di website ini.",
    },
    "en": {
        "fallback": "I can help answer questions about services, projects, technology, timeline, pricing, WhatsApp integration, or how to start a project.",
        "services": "I can help with company profile websites, landing pages, portfolios, order forms, simple admin dashboards, and WhatsApp integration.",
        "company_profile": "For a simple company profile, the common sections are Home, About Us, Services, Portfolio, Testimonials, and Contact. I can also add an order form if needed.",
        "form": "Yes. An order form or contact form can be stored in a MySQL database and reviewed from an admin dashboard.",
        "tech": "The stack I usually use includes HTML, CSS, JavaScript, Bootstrap or Tailwind, PHP, MySQL, Git, and Laravel if the project scope fits.",
        "laravel": "Yes, Laravel can be used. For smaller projects I usually prefer native PHP because it is lighter, but for larger structure Laravel is fine.",
        "timeline": "A company profile plus form usually takes around 7-14 days, depending on the number of pages, revisions, and extra features.",
        "price": "A basic company profile starts from IDR 2.5 million. With admin dashboard and extra features, it is usually around IDR 3-5 million.",
        "nego": "Yes, pricing can be discussed. I usually adjust it based on scope, feature priority, and available budget.",
        "hosting": "I can help arrange hosting and domain, or you can provide them yourself. Common recommendations are Hostinger or Niagahoster.",
        "responsive": "Yes, the website is built to be responsive and mobile friendly on phones, tablets, and desktop screens.",
        "seo": "I can help with basic SEO optimization such as meta tags, heading structure, loading speed, image alt text, and sitemap.",
        "whatsapp": "Yes, WhatsApp integration is possible, for example a direct chat button to your business number or WhatsApp CTA sections.",
        "portfolio": "You can review previous work in the Portfolio section. It includes examples of company profiles, internal dashboards, and personal branding websites.",
        "team": "At the moment I handle projects independently. For larger scope work, I can collaborate with a team.",
        "garansi": "There is 1 month of free maintenance after delivery for minor fixes or small adjustments.",
        "start": "To get started, we usually discuss requirements first, then define features, proceed with a 30% down payment, and I begin development.",
        "payment": "Payment can be made via bank transfer, for example BCA or Mandiri.",
        "contact": "If you want to continue the discussion, you can reach out via kamiliya.dev@gmail.com or the contact page on this website.",
    },
}


def with_cors(response: Any):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


@app.after_request
def add_cors_headers(response):
    return with_cors(response)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


@app.route("/api/demo-conversation", methods=["GET"])
def demo_conversation():
    lang = request.args.get("lang", "id")
    active_lang = lang if lang in DEMO_CONVERSATIONS else "id"
    return jsonify({"messages": DEMO_CONVERSATIONS[active_lang]})


@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return with_cors(jsonify({"ok": True}))

    payload = request.get_json(silent=True) or {}
    lang = payload.get("lang", "id")
    message = str(payload.get("message", "")).strip()
    active_lang = lang if lang in RESPONSES else "id"

    if not message:
        return jsonify({"reply": RESPONSES[active_lang]["fallback"]}), 400

    reply = resolve_reply(message, active_lang)
    return jsonify({"reply": reply})


def resolve_reply(message: str, lang: str) -> str:
    lower_message = message.lower()
    messages = RESPONSES[lang]

    checks = [
        (("company profile", "companyprofile", "company"), "company_profile"),
        (("layanan", "service", "website", "web"), "services"),
        (("form", "pemesanan", "order"), "form"),
        (("teknologi", "technology", "stack", "html", "css", "javascript", "php", "mysql", "bootstrap", "tailwind", "git"), "tech"),
        (("laravel",), "laravel"),
        (("berapa lama", "timeline", "durasi", "how long"), "timeline"),
        (("harga", "price", "biaya", "cost"), "price"),
        (("nego", "negotiable", "budget"), "nego"),
        (("hosting", "domain"), "hosting"),
        (("responsive", "mobile", "hp"), "responsive"),
        (("seo", "meta", "sitemap"), "seo"),
        (("whatsapp", "wa"), "whatsapp"),
        (("portfolio", "portofolio", "project", "proyek"), "portfolio"),
        (("team", "tim", "sendiri"), "team"),
        (("garansi", "warranty", "maintenance"), "garansi"),
        (("mulai", "start", "dp", "down payment"), "start"),
        (("transfer", "payment", "pembayaran", "bca", "mandiri"), "payment"),
        (("contact", "kontak", "email", "hubungi"), "contact"),
    ]

    for keywords, key in checks:
        if any(keyword in lower_message for keyword in keywords):
            return messages[key]

    return messages["fallback"]


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
