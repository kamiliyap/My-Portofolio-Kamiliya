<?php
require __DIR__ . '/includes/admin-bootstrap.php';
require __DIR__ . '/includes/admin-layout.php';
$projects = adminProjects();
adminHeader('Project Library', '', false, true);
?>
<p class="subtle">Koleksi project Kamiliya.</p>
<?php foreach ($projects as $project): ?><article class="admin-card"><span class="badge"><?= adminEscape($project['category']) ?></span><h2><?= adminEscape($project['title']) ?></h2><p class="detail-description"><?= adminEscape($project['description']) ?></p><p><?= adminEscape($project['tech']) ?></p><p class="subtle"><?= adminEscape($project['created_at']) ?></p></article><?php endforeach; ?>
<?php if (!$projects): ?><div class="admin-card empty-state">Belum ada project.</div><?php endif; ?>
<?php adminFooter(false); ?>
