import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    INSERT INTO "pages" ("title", "slug")
    VALUES
      ('Home', 'home'),
      ('About', 'about'),
      ('Services', 'services'),
      ('Digital', 'digital'),
      ('Enterprise', 'enterprise'),
      ('Mobile', 'mobile'),
      ('Staffing', 'staffing'),
      ('Resources', 'blog'),
      ('Testimonials', 'testimonials'),
      ('Jobs', 'jobs'),
      ('Book a Call', 'contact-us')
    ON CONFLICT ("slug") DO NOTHING;
  `);
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Preserve page records when rolling back this additive seed migration.
}
