CREATE TABLE `personal_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`disabled_at` integer,
	CONSTRAINT "personal_account_id_length" CHECK(length("personal_accounts"."id") = 36),
	CONSTRAINT "personal_account_time" CHECK("personal_accounts"."created_at" >= 0 AND ("personal_accounts"."disabled_at" IS NULL OR "personal_accounts"."disabled_at" >= 0))
);
--> statement-breakpoint
CREATE TABLE `personal_identities` (
	`issuer` text NOT NULL,
	`subject` text NOT NULL,
	`account_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`revoked_at` integer,
	PRIMARY KEY(`issuer`, `subject`),
	FOREIGN KEY (`account_id`) REFERENCES `personal_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "personal_identity_bounds" CHECK(length("personal_identities"."issuer") BETWEEN 1 AND 256 AND length("personal_identities"."subject") BETWEEN 1 AND 1024),
	CONSTRAINT "personal_identity_time" CHECK("personal_identities"."created_at" >= 0 AND ("personal_identities"."revoked_at" IS NULL OR "personal_identities"."revoked_at" >= 0))
);
--> statement-breakpoint
CREATE INDEX `personal_identity_account` ON `personal_identities` (`account_id`);--> statement-breakpoint
CREATE TABLE `personal_records` (
	`account_id` text NOT NULL,
	`kind` text NOT NULL,
	`record_key` text NOT NULL,
	`schema_version` integer DEFAULT 1 NOT NULL,
	`revision` integer NOT NULL,
	`payload_json` text,
	`updated_at` integer NOT NULL,
	`deleted_at` integer,
	PRIMARY KEY(`account_id`, `kind`, `record_key`),
	FOREIGN KEY (`account_id`) REFERENCES `personal_accounts`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "personal_record_kind" CHECK("personal_records"."kind" IN ('saved-recipe','shopping-item','recipe-note','bake-record','collection')),
	CONSTRAINT "personal_record_key_bounds" CHECK(length("personal_records"."record_key") BETWEEN 1 AND 1024),
	CONSTRAINT "personal_record_version" CHECK("personal_records"."schema_version" = 1 AND "personal_records"."revision" BETWEEN 1 AND 9007199254740991),
	CONSTRAINT "personal_record_time" CHECK("personal_records"."updated_at" >= 0 AND ("personal_records"."deleted_at" IS NULL OR "personal_records"."deleted_at" = "personal_records"."updated_at")),
	CONSTRAINT "personal_record_payload" CHECK(("personal_records"."deleted_at" IS NOT NULL AND "personal_records"."payload_json" IS NULL) OR ("personal_records"."deleted_at" IS NULL AND "personal_records"."payload_json" IS NOT NULL AND json_valid("personal_records"."payload_json") AND length(CAST("personal_records"."payload_json" AS BLOB)) <= 32768))
);
