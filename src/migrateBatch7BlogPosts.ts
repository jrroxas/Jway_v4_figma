import fs from 'fs';
import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const neonConnectionString =
  'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const rdsConnectionString =
  'postgresql://devops:2-1tLRb%5D%3EdO_W%29yE7M%5BfY-3%21%3FG%29%3E@ai-jwaystaging.csyjujqjax22.us-west-1.rds.amazonaws.com:5432/postgres?sslmode=verify-full&channel_binding=require';

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\batch7ArticlesParsed.json', 'utf8')
);

async function migrate() {
  console.log(`🚀 Migrating ${articles.length} Blog Posts to 3 Databases...`);

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    for (const item of articles) {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: item.slug } },
      });

      if (existing.docs && existing.docs.length > 0) {
        await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data: {
            title: item.title,
            publishedDate: item.publishedDate,
            category: item.category,
            tags: item.tags,
            readTime: item.readTime,
            authorName: item.authorName,
            coverImageUrl: item.coverImageUrl,
            summary: item.summary,
            contentHtml: item.contentHtml,
          },
        });
        console.log(`  🔄 Local SQLite: Updated "${item.title}"`);
      } else {
        await payload.create({
          collection: 'posts',
          data: {
            title: item.title,
            slug: item.slug,
            publishedDate: item.publishedDate,
            category: item.category,
            tags: item.tags,
            readTime: item.readTime,
            authorName: item.authorName,
            coverImageUrl: item.coverImageUrl,
            summary: item.summary,
            contentHtml: item.contentHtml,
          },
        });
        console.log(`  ✅ Local SQLite: Created "${item.title}"`);
      }
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
    for (const item of articles) {
      const checkRes = await neonPool.query(`SELECT id FROM posts WHERE slug = $1;`, [item.slug]);
      if (checkRes.rows.length > 0) {
        await neonPool.query(
          `UPDATE posts SET title = $1, published_date = $2, category = $3, tags = $4, read_time = $5, author_name = $6, cover_image_url = $7, summary = $8, content_html = $9, updated_at = NOW() WHERE slug = $10;`,
          [
            item.title,
            item.publishedDate,
            item.category,
            item.tags,
            item.readTime,
            item.authorName,
            item.coverImageUrl,
            item.summary,
            item.contentHtml,
            item.slug,
          ]
        );
        console.log(`  🔄 Remote Neon DB: Updated "${item.title}"`);
      } else {
        await neonPool.query(
          `INSERT INTO posts (title, slug, published_date, category, tags, read_time, author_name, cover_image_url, summary, content_html, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW());`,
          [
            item.title,
            item.slug,
            item.publishedDate,
            item.category,
            item.tags,
            item.readTime,
            item.authorName,
            item.coverImageUrl,
            item.summary,
            item.contentHtml,
          ]
        );
        console.log(`  🌐 Remote Neon DB: Inserted "${item.title}"`);
      }
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
    for (const item of articles) {
      const checkRes = await rdsPool.query(`SELECT id FROM posts WHERE slug = $1;`, [item.slug]);
      if (checkRes.rows.length > 0) {
        await rdsPool.query(
          `UPDATE posts SET title = $1, published_date = $2, category = $3, tags = $4, read_time = $5, author_name = $6, cover_image_url = $7, summary = $8, content_html = $9, updated_at = NOW() WHERE slug = $10;`,
          [
            item.title,
            item.publishedDate,
            item.category,
            item.tags,
            item.readTime,
            item.authorName,
            item.coverImageUrl,
            item.summary,
            item.contentHtml,
            item.slug,
          ]
        );
        console.log(`  🔄 AWS RDS Staging DB: Updated "${item.title}"`);
      } else {
        await rdsPool.query(
          `INSERT INTO posts (title, slug, published_date, category, tags, read_time, author_name, cover_image_url, summary, content_html, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW());`,
          [
            item.title,
            item.slug,
            item.publishedDate,
            item.category,
            item.tags,
            item.readTime,
            item.authorName,
            item.coverImageUrl,
            item.summary,
            item.contentHtml,
          ]
        );
        console.log(`  ☁️ AWS RDS Staging DB: Inserted "${item.title}"`);
      }
    }
  } catch (e: any) {
    console.error('❌ AWS RDS Staging Error:', e.message || e);
  } finally {
    await rdsPool.end();
  }

  process.exit(0);
}

migrate();
