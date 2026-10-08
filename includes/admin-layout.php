<?php
function adminHeader(string $title, string $active = '', bool $sidebar = true, bool $public = false): void
{
    $flash = $_SESSION['admin_flash'] ?? null;
    unset($_SESSION['admin_flash']);
    ?>
    <!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow"><title><?= adminEscape($title) ?> | <?= $public ? 'Kamiliya' : 'Kamiliya Admin' ?></title>
    <link rel="icon" href="<?= adminEscape(adminUrl('assets/images/logo.png')) ?>">
    <link rel="stylesheet" href="<?= adminEscape(adminUrl('assets/css/style-site.css')) ?>">
    <link rel="stylesheet" href="<?= adminEscape(adminUrl('assets/css/admin.css')) ?>">
    <script src="<?= adminEscape(adminUrl('assets/js/site-theme.js')) ?>" defer></script>
    <script src="<?= adminEscape(adminUrl('assets/js/admin.js')) ?>" defer></script></head><body class="admin-body">
    <div class="admin-shell <?= $sidebar ? '' : 'without-sidebar' ?>">
    <?php if ($sidebar): ?>
    <aside class="admin-sidebar"><a class="admin-brand" href="<?= adminEscape(adminUrl('admin/dashboard.php')) ?>">Kamiliya<span>PORTFOLIO / ADMIN</span></a>
    <nav aria-label="Navigasi admin">
    <?php foreach (['dashboard' => ['dashboard.php', '◈', 'Dashboard'], 'projects' => ['projects.php', '▦', 'Projects'], 'add' => ['add_project.php', '+', 'Tambah Project']] as $key => [$file, $icon, $label]): ?>
    <a <?= $active === $key ? 'aria-current="page"' : '' ?> href="<?= adminEscape(adminUrl('admin/' . $file)) ?>"><span><?= adminEscape($icon) ?></span><?= adminEscape($label) ?></a>
    <?php endforeach; ?></nav></aside>
    <?php endif; ?>
    <main class="admin-main"><header class="admin-topbar"><div><p class="eyebrow"><?= $public ? 'KAMILIYA / PORTFOLIO' : 'KAMILIYA / ADMIN ACCESS' ?></p><h1><?= adminEscape($title) ?></h1></div>
    <div class="admin-topbar-actions"><button class="admin-button secondary" type="button" data-theme-toggle aria-label="Ganti light/dark mode">◐ <span data-theme-label>Tema</span></button>
    <?php if ($sidebar): ?>
    <div class="account-dropdown" data-account-dropdown>
        <button type="button" class="account-trigger" id="account-trigger" aria-expanded="false" aria-controls="account-dropdown-panel">
            <span class="avatar" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></svg></span>
            <span class="account-label">Administrator</span>
            <svg class="account-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="account-dropdown-panel" id="account-dropdown-panel" hidden>
            <div class="account-dropdown-heading"><strong>Administrator</strong><small><?= adminEscape($_SESSION['admin_username'] ?? '') ?></small></div>
            <button type="button" data-open-account>Profile / Account</button>
            <button type="button" class="account-logout" data-open-logout>Logout</button>
        </div>
    </div>
    <?php endif; ?></div></header>
    <?php if ($flash): ?><div class="notice <?= $flash['kind'] === 'success' ? 'success' : 'error' ?>" role="status"><?= adminEscape($flash['message']) ?></div><?php endif; ?>
    <?php
}
function adminFooter(bool $modals = true): void
{
    if ($modals): ?>
    <dialog id="account-dialog" class="admin-dialog" aria-labelledby="account-dialog-title"><div class="dialog-icon" aria-hidden="true">◈</div><h2 id="account-dialog-title">Profile / Account</h2><p><strong>Administrator</strong></p><p class="account-email"><?= adminEscape($_SESSION['admin_username'] ?? '') ?></p><div class="form-actions"><button type="button" class="admin-button secondary" data-close-dialog>Tutup</button></div></dialog>
    <dialog id="delete-dialog" class="admin-dialog"><form method="post" action="<?= adminEscape(adminUrl('admin/delete_project.php')) ?>">
    <div class="dialog-icon danger">⌫</div><h2>Hapus Project</h2><p>Hapus project “<strong id="delete-project-name"></strong>”?</p><p>Data dan file akan dihapus permanen.</p>
    <input type="hidden" name="csrf_token" value="<?= adminEscape(adminToken()) ?>"><input type="hidden" name="id" id="delete-project-id">
    <div class="form-actions"><button type="button" class="admin-button secondary" data-close-dialog>Batal</button><button class="admin-button danger" type="submit">Hapus</button></div></form></dialog>
    <dialog id="logout-dialog" class="admin-dialog"><form method="post" action="<?= adminEscape(adminUrl('logout.php')) ?>">
    <div class="dialog-icon">↪</div><h2>Keluar dari Admin</h2><p>Apakah kamu yakin ingin logout?</p><input type="hidden" name="csrf_token" value="<?= adminEscape(adminToken()) ?>">
    <div class="form-actions"><button class="admin-button secondary" type="button" data-close-dialog>Batal</button><button class="admin-button danger" type="submit">Logout</button></div></form></dialog>
    <?php endif;
    echo '</main></div></body></html>';
}
function adminActions(array $project): void
{
    $id = (int) $project['id']; ?>
    <div class="row-actions"><a class="admin-button compact secondary" href="<?= adminEscape(adminUrl('admin/detail_project.php?id=' . $id)) ?>">Detail</a><a class="admin-button compact" href="<?= adminEscape(adminUrl('admin/edit_project.php?id=' . $id)) ?>">Edit</a><button type="button" class="admin-button compact danger" data-delete-id="<?= adminEscape($id) ?>" data-delete-title="<?= adminEscape($project['title']) ?>">Hapus</button><a class="admin-button compact secondary" href="<?= adminEscape(adminUrl('download-project.php?id=' . $id)) ?>">Download</a></div>
    <?php if ($demoUrl = projectDemoUrl($project['demo_url'] ?? null)): ?><a class="admin-button compact secondary" href="<?= adminEscape($demoUrl) ?>" target="_blank" rel="noopener noreferrer">Video Demo</a><?php endif; ?>
    <?php
}
function adminTable(array $projects): void
{
    ?>
    <div class="table-scroll"><table class="admin-table"><thead><tr><th>Judul</th><th>Kategori</th><th>Teknologi</th><th>Tanggal</th><th>File</th><th>Aksi</th></tr></thead><tbody>
    <?php foreach ($projects as $project): ?><tr><td><strong><?= adminEscape($project['title']) ?></strong></td><td><span class="badge"><?= adminEscape($project['category']) ?></span></td><td><?= adminEscape($project['tech']) ?></td><td><?= adminEscape($project['created_at']) ?></td><td><?= adminEscape(strtoupper(pathinfo($project['file_path'], PATHINFO_EXTENSION))) ?></td><td><?php adminActions($project); ?></td></tr><?php endforeach; ?>
    <?php if (!$projects): ?><tr><td colspan="6" class="empty-state">Belum ada project. Mulai dengan menambahkan karya pertama kamu.</td></tr><?php endif; ?>
    </tbody></table></div>
    <?php
}
