import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "trash" (
      "id" serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now(),
      "created_at" timestamp(3) with time zone DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS "trash_items" (
      "id" serial PRIMARY KEY NOT NULL,
      "collection_slug" varchar NOT NULL,
      "original_id" varchar NOT NULL,
      "title" varchar NOT NULL,
      "slug" varchar,
      "file_path" varchar NOT NULL,
      "trash_disk_path" varchar,
      "doc_data" jsonb NOT NULL,
      "deleted_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "trash_items_deleted_at_idx" ON "trash_items" USING btree ("deleted_at");

    ALTER TABLE "form_settings"
      ADD COLUMN IF NOT EXISTS "recaptcha_site_key" varchar,
      ADD COLUMN IF NOT EXISTS "recaptcha_secret_key" varchar;
  `);
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Preserve trash data on rollback
}
