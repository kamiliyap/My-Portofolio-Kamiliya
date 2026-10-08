-- Run manually in phpMyAdmin, once. The application never executes this migration.
USE portfolio_kamiliya;
ALTER TABLE projects
    ADD COLUMN demo_url VARCHAR(2048) NULL DEFAULT NULL AFTER file_path;
