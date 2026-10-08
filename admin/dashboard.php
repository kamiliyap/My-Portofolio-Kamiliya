<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin();
require __DIR__ . '/../includes/admin-layout.php';
$projects = adminProjects();
$categories = array_unique(array_column($projects, 'category'));
$pdfs = count(array_filter($projects, static fn(array $p): bool => strtolower(pathinfo($p['file_path'], PATHINFO_EXTENSION)) === 'pdf'));
adminHeader('Dashboard', 'dashboard');
?>
<p class="subtle">Selamat datang kembali, <?= adminEscape($_SESSION['admin_username']) ?>. Kelola karya dan file project kamu dari satu tempat.</p>
<div class="stats-grid"><?php foreach ([['▦', 'Total Project', count($projects)], ['◈', 'Kategori', count($categories)], ['▤', 'Dokumen PDF', $pdfs], ['▧', 'File Gambar', count($projects) - $pdfs]] as [$icon, $label, $value]): ?><article class="stat-card"><span class="stat-icon"><?= adminEscape($icon) ?></span><div><small><?= adminEscape($label) ?></small><strong><?= adminEscape($value) ?></strong></div></article><?php endforeach; ?></div>
<section class="admin-card"><div class="card-heading"><h2>Project Terbaru</h2><a class="admin-button" href="<?= adminEscape(adminUrl('admin/add_project.php')) ?>">+ Tambah Project</a></div><?php adminTable(array_slice($projects, 0, 10)); ?><p class="subtle"><a href="<?= adminEscape(adminUrl('admin/projects.php')) ?>">Lihat semua project →</a></p></section>
<?php adminFooter(); ?>
