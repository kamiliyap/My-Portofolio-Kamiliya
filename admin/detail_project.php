<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin();
require __DIR__ . '/../includes/admin-layout.php';
$project = adminProject(adminId());
adminHeader('Detail Project', 'projects');
?>
<section class="admin-card"><div class="card-heading"><div><span class="badge"><?= adminEscape($project['category']) ?></span><h2><?= adminEscape($project['title']) ?></h2><p class="subtle"><?= adminEscape($project['created_at']) ?></p></div><?php adminActions($project); ?></div>
<p class="detail-description"><?= adminEscape($project['description']) ?></p>
<?php if ($demoUrl = projectDemoUrl($project['demo_url'] ?? null)): ?><p><a class="admin-button" href="<?= adminEscape($demoUrl) ?>" target="_blank" rel="noopener noreferrer">▶ Video Demo</a></p><?php endif; ?>
<div class="detail-grid"><div><h3>Teknologi</h3><?php foreach (explode(',', $project['tech']) as $technology): ?><span class="badge"><?= adminEscape(trim($technology)) ?></span> <?php endforeach; ?></div><div><h3>Kategori</h3><span class="badge"><?= adminEscape($project['category']) ?></span></div></div>
<h3>File Pendukung</h3><div class="file-card"><div><strong><?= adminEscape(strtoupper(pathinfo($project['file_path'], PATHINFO_EXTENSION))) ?> · File project</strong><small><?= adminEscape(basename($project['file_path'])) ?></small></div><a class="admin-button" href="<?= adminEscape(adminUrl('download-project.php?id=' . $project['id'])) ?>">↓ Download File</a></div></section>
<a class="admin-button secondary" href="<?= adminEscape(adminUrl('admin/projects.php')) ?>">← Kembali ke Projects</a>
<?php adminFooter(); ?>
