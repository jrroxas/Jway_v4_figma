import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const article = {
  title: 'Certified True Copies Now Required for First-Time Jobseekers in the Philippines',
  slug: 'certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines',
  publishedDate: '2020-02-20T05:12:33.000Z',
  category: 'Staffing',
  tags: 'News and Events, Staffing',
  readTime: '3 min read',
  authorName: 'Marianne Pimentel',
  coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg',
  summary:
    'Private establishments in the Philippines are now required to accept only certified true copies of pre-employment documents from first-time jobseekers. This change is in line with the First-Time Jobseekers Act (Republic Act No. 11261), which seeks to reduce the financial burden on new entrants to the workforce. The original documents are only needed upon hiring. This regulation ensures that first-time jobseekers can pursue employment opportunities with less financial strain.',
  contentHtml: `
<p>Private establishments in the Philippines are now required to accept only certified true copies of pre-employment documents from first-time jobseekers. This change is in line with the First-Time Jobseekers Act (Republic Act No. 11261), which seeks to reduce the financial burden on new entrants to the workforce. The original documents are only needed upon hiring. This regulation ensures that first-time jobseekers can pursue employment opportunities with less financial strain.</p>

<p>First-Time Jobseekers Act or Republic Act No. 11261 states that the concerned government agencies shall issue the pre-employment requirements to first-time job seekers free of charge, limited to one copy and one-time use.</p>

<p><i>“Considering that the privilege granted under this Act is limited to one copy and one-time availment, private establishments are hereby enjoined to accept certified true copy from the issuing government authority of the pre-employment documents of the FTJ during the application process. The submission of original pre-employment requirements shall be required once the First Time Jobseeker is offered the job.”</i> the advisory read.</p>

<p>Among the government transactions covered by the FTJ Act are the following:</p>

<ol>
<li>Barangay Certification and Clearance</li>
<li>Police Clearance</li>
<li>NBI Clearance</li>
<li>Civil Service Commission Certificate of Eligibility</li>
<li>PhilHealth ID</li>
<li>Philippine Overseas Employment Agency Certificates</li>
<li>Mayor’s Clearance</li>
<li>Prosecutor’s Clearance</li>
<li>Municipal and regional trial court’s clearances</li>
<li>MARINA Certificates</li>
<li>TESDA National Certificate</li>
<li>TESDA’s Competency Assessment Certificate</li>
<li>Medical certificate from public hospitals except for laboratory tests and other medical procedures that are required in the grant of a medical certificate, birth and marriage certificates, transcript of academic records, certificate of graduation/completion, and/or diploma issued by state and local universities and colleges, and taxpayer’s identification number.</li>
</ol>

<p>The Department of Labor and Employment together with partner agencies issued its Implementing Rules and Regulations became effective last year, October 25, 2019.</p>
`.trim(),
};

async function migrate() {
  console.log('🚀 Migrating "Certified True Copies" Blog Post to 3 Databases...');

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: article.slug } },
    });

    if (existing.docs && existing.docs.length > 0) {
      await payload.update({
        collection: 'posts',
        id: existing.docs[0].id,
        data: { coverImageUrl: article.coverImageUrl },
      });
      console.log(`  🔄 Local SQLite: Updated coverImageUrl for "${article.title}"`);
    } else {
      await payload.create({
        collection: 'posts',
        data: {
          title: article.title,
          slug: article.slug,
          publishedDate: article.publishedDate,
          category: article.category,
          tags: article.tags,
          readTime: article.readTime,
          authorName: article.authorName,
          coverImageUrl: article.coverImageUrl,
          summary: article.summary,
          contentHtml: article.contentHtml,
        },
      });
      console.log(`  ✅ Local SQLite: Created "${article.title}"`);
    }
  } catch (e: any) {
    console.error('❌ Local SQLite Error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL
  const neonPool = new pg.Pool({
    connectionString: neonConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const checkRes = await neonPool.query(`SELECT id FROM posts WHERE slug = $1;`, [article.slug]);
    if (checkRes.rows.length > 0) {
      await neonPool.query(`UPDATE posts SET cover_image_url = $1 WHERE slug = $2;`, [
        article.coverImageUrl,
        article.slug,
      ]);
      console.log(`  🔄 Remote Neon DB: Updated cover_image_url for "${article.title}"`);
    } else {
      await neonPool.query(
        `INSERT INTO posts (title, slug, published_date, category, tags, read_time, author_name, cover_image_url, summary, content_html, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW());`,
        [
          article.title,
          article.slug,
          article.publishedDate,
          article.category,
          article.tags,
          article.readTime,
          article.authorName,
          article.coverImageUrl,
          article.summary,
          article.contentHtml,
        ]
      );
      console.log(`  🌐 Remote Neon DB: Inserted "${article.title}"`);
    }
  } catch (e: any) {
    console.error('❌ Remote Neon Error:', e.message || e);
  } finally {
    await neonPool.end();
  }

  // 3. AWS RDS Staging PostgreSQL
  const rdsPool = new pg.Pool({
    connectionString: rdsConnectionString.replace(/\?sslmode=.*$/, ''),
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const checkRes = await rdsPool.query(`SELECT id FROM posts WHERE slug = $1;`, [article.slug]);
    if (checkRes.rows.length > 0) {
      await rdsPool.query(`UPDATE posts SET cover_image_url = $1 WHERE slug = $2;`, [
        article.coverImageUrl,
        article.slug,
      ]);
      console.log(`  🔄 AWS RDS Staging DB: Updated cover_image_url for "${article.title}"`);
    } else {
      await rdsPool.query(
        `INSERT INTO posts (title, slug, published_date, category, tags, read_time, author_name, cover_image_url, summary, content_html, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW());`,
        [
          article.title,
          article.slug,
          article.publishedDate,
          article.category,
          article.tags,
          article.readTime,
          article.authorName,
          article.coverImageUrl,
          article.summary,
          article.contentHtml,
        ]
      );
      console.log(`  ☁️ AWS RDS Staging DB: Inserted "${article.title}"`);
    }
  } catch (e: any) {
    console.error('❌ AWS RDS Staging Error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  process.exit(0);
}

migrate();
