<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin();
require __DIR__ . '/../includes/admin-layout.php';
$projects = adminProjects();
adminHeader('Projects', 'projects');
?>
<section class="admin-card"><div class="card-heading"><h2>Semua Project <span class="badge"><?= adminEscape(count($projects)) ?></span></h2><a class="admin-button" href="<?= adminEscape(adminUrl('admin/add_project.php')) ?>">+ Tambah Project</a></div><div class="field search-input"><label for="project-search">Cari project</label><input id="project-search" type="search" data-project-search placeholder="Judul, kategori, teknologi…"></div><?php adminTable($projects); ?></section>
<?php adminFooter(); ?>
