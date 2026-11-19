import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      CREATE TYPE "public"."enum_form_settings_auth_type" AS ENUM ('smtp', 'oauth2');
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum_forms_form_name" AS ENUM (
        'Contact Us Form', 'Staffing Talent Request', 'Talent Sourcing Inquiry',
        'AI Solutions Inquiry', 'Mobile Consultation'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    DO $$
    BEGIN
      CREATE TYPE "public"."enum_forms_status" AS ENUM (
        'new', 'in_progress', 'contacted', 'archived'
      );
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END
    $$;

    CREATE TABLE IF NOT EXISTS "forms" (
      "id" serial PRIMARY KEY NOT NULL,
      "form_name" "public"."enum_forms_form_name" DEFAULT 'Contact Us Form' NOT NULL,
      "name" varchar NOT NULL,
      "email" varchar NOT NULL,
      "company" varchar,
      "phone" varchar,
      "subject" varchar,
      "message" varchar,
      "status" "public"."enum_forms_status" DEFAULT 'new',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE INDEX IF NOT EXISTS "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "forms_created_at_idx" ON "forms" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "form_settings" (
      "id" serial PRIMARY KEY NOT NULL,
      "email_recipient" varchar DEFAULT 'info@jway.com' NOT NULL,
      "email_cc" varchar,
      "email_subject" varchar DEFAULT 'New Contact Form Submission' NOT NULL,
      "from_email" varchar DEFAULT 'info@jway.com' NOT NULL,
      "enable_smtp" boolean DEFAULT true,
      "auth_type" "public"."enum_form_settings_auth_type" DEFAULT 'smtp',
      "smtp_host" varchar,
      "smtp_port" numeric DEFAULT 587,
      "smtp_secure" boolean DEFAULT false,
      "smtp_user" varchar,
      "smtp_pass" varchar,
      "oauth2_client_id" varchar,
      "oauth2_client_secret" varchar,
      "oauth2_refresh_token" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    ALTER TABLE "payload_locked_documents_rels"
      ADD COLUMN IF NOT EXISTS "forms_id" integer;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'payload_locked_documents_rels_forms_fk'
      ) THEN
        ALTER TABLE "payload_locked_documents_rels"
          ADD CONSTRAINT "payload_locked_documents_rels_forms_fk"
          FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id")
          ON DELETE cascade ON UPDATE no action;
      END IF;
    END
    $$;

    CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_forms_id_idx"
      ON "payload_locked_documents_rels" USING btree ("forms_id");
  `);
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Preserve existing data when rolling back this additive schema migration.
}
