CREATE TABLE `daily_moments` (
	`trip_id` text NOT NULL,
	`day` text NOT NULL,
	`member` text NOT NULL,
	`answer` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`trip_id`, `day`, `member`)
);
--> statement-breakpoint
CREATE TABLE `daily_photos` (
	`trip_id` text NOT NULL,
	`day` text NOT NULL,
	`photo_url` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`trip_id`, `day`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`photos` text DEFAULT '[]' NOT NULL,
	`reactions` text DEFAULT '{}' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `question_answers` (
	`trip_id` text NOT NULL,
	`question_id` text NOT NULL,
	`member` text NOT NULL,
	`answer` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	PRIMARY KEY(`trip_id`, `question_id`, `member`)
);
--> statement-breakpoint
CREATE TABLE `trip_states` (
	`trip_id` text PRIMARY KEY NOT NULL,
	`completed_activities` text DEFAULT '[]' NOT NULL,
	`completed_challenges` text DEFAULT '{}' NOT NULL,
	`opened_envelopes` text DEFAULT '[]' NOT NULL,
	`unlocked_surprises` text DEFAULT '[]' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `uploads` (
	`key` text PRIMARY KEY NOT NULL,
	`trip_id` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
