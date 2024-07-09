ALTER TABLE "users" DROP CONSTRAINT "users_address_id_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "address_id";