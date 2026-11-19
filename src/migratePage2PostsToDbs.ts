import fs from 'fs';
import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const articles = JSON.parse(fs.readFileSync('C:\\Localhost\\jway-site\\src\\page2ArticlesParsed.json', 'utf8'));

async function migrate() {
  console.log('🚀 Migrating Page 2 Blog Posts (Skip if exists)...');

  // 1. Local SQLite Payload CMS
  try {
    const payload = await getPayloadClient();
    for (const item of articles) {
      const existing = await payload.find({
        collection: 'posts',
        where: { slug: { equals: item.slug } },
      });

      if (existing.docs && existing.docs.length > 0) {
        console.log(`  ⏭  Local SQLite: Skipped "${item.slug}" (Already exists)`);
      } else {
        await payload.create({
          collection: 'posts',
          data: {
            title: item.title,
            slug: item.slug,
            publishedDate: item.date,
            category: item.category,
            tags: item.tags,
            readTime: item.readTime,
            authorName: item.author,
            coverImageUrl: item.coverImageUrl,
            summary: item.summary,
            contentHtml: item.contentHtml || `<p>${item.summary}</p>`,
          },
        });
        console.log(`  ✅ Local SQLite: Created "${item.title}" (${item.slug})`);
      }
    }
  } catch (e: any) {
    console.error('❌ Local Error:', e.message || e);
  }

  // 2. Remote Neon PostgreSQL
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    for (const item of articles) {
      const checkRes = await pool.query(`SELECT id FROM posts WHERE slug = $1;`, [item.slug]);
      if (checkRes.rows.length > 0) {
        console.log(`  ⏭  Remote Neon DB: Skipped "${item.slug}" (Already exists)`);
      } else {
        await pool.query(
          `INSERT INTO posts (title, slug, published_date, category, tags, read_time, author_name, cover_image_url, summary, content_html, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW());`,
          [
            item.title,
            item.slug,
            item.date,
            item.category,
            item.tags,
            item.readTime,
            item.author,
            item.coverImageUrl,
            item.summary,
            item.contentHtml || `<p>${item.summary}</p>`
          ]
        );
        console.log(`  🌐 Remote Neon DB: Inserted "${item.title}" (${item.slug})`);
      }
    }
  } catch (e: any) {
    console.error('❌ Remote Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

migrate();
