CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'admin',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `blogs` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `blogs` MODIFY COLUMN `image` varchar(255);--> statement-breakpoint
ALTER TABLE `blogs` MODIFY COLUMN `created_at` timestamp DEFAULT (now());