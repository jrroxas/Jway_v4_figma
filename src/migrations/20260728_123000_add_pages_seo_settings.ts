import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages"
      ADD COLUMN IF NOT EXISTS "meta_title" varchar,
      ADD COLUMN IF NOT EXISTS "meta_description" varchar,
      ADD COLUMN IF NOT EXISTS "no_index" boolean DEFAULT false NOT NULL,
      ADD COLUMN IF NOT EXISTS "no_follow" boolean DEFAULT false NOT NULL;
  `);
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Preserve SEO settings when rolling back this additive schema migration.
}
