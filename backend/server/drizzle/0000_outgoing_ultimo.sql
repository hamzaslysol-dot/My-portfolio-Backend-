-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `blogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(100) NOT NULL,
	`content` text NOT NULL,
	`image` varchar(500),
	`created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `blogs_id` PRIMARY KEY(`id`)
);

*/