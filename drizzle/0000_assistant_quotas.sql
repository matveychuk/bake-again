CREATE TABLE `assistant_quota_reservations` (
	`id` text PRIMARY KEY NOT NULL,
	`session_key` text,
	`network_key` text,
	`created_at` integer NOT NULL,
	`lease_until` integer NOT NULL,
	`reserved_microusd` integer NOT NULL,
	CONSTRAINT "assistant_reserved_nonnegative" CHECK("assistant_quota_reservations"."reserved_microusd" >= 0)
);
--> statement-breakpoint
CREATE INDEX `assistant_quota_created` ON `assistant_quota_reservations` (`created_at`);--> statement-breakpoint
CREATE INDEX `assistant_quota_session` ON `assistant_quota_reservations` (`session_key`,`created_at`);--> statement-breakpoint
CREATE INDEX `assistant_quota_network` ON `assistant_quota_reservations` (`network_key`,`created_at`);--> statement-breakpoint
CREATE TABLE `assistant_verification_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`network_key` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `assistant_verification_network` ON `assistant_verification_attempts` (`network_key`,`created_at`);--> statement-breakpoint
CREATE INDEX `assistant_verification_created` ON `assistant_verification_attempts` (`created_at`);