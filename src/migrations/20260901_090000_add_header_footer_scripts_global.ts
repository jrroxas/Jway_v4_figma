import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres';

const defaultHeaderScripts = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1012098261533939');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=1012098261533939&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`.trim();

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "header_footer_scripts" (
      "id" serial PRIMARY KEY NOT NULL,
      "header_scripts" varchar,
      "body_scripts" varchar,
      "footer_scripts" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    INSERT INTO "header_footer_scripts" (
      "header_scripts",
      "body_scripts",
      "footer_scripts",
      "updated_at",
      "created_at"
    )
    SELECT ${defaultHeaderScripts}, '', '', now(), now()
    WHERE NOT EXISTS (
      SELECT 1 FROM "header_footer_scripts"
    );
  `);
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // Preserve the global and its settings when rolling back this additive migration.
}
