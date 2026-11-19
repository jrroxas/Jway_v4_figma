import { getPayload } from 'payload';
import config from './payload.config';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

async function compare() {
  console.log('🔍 Step 1: Fetching pages from LOCAL database...');
  const localPayload = await getPayload({ config });
  const localPagesDocs = await localPayload.find({
    collection: 'pages',
    limit: 100,
  });

  const localPages = localPagesDocs.docs.map(doc => ({
    title: doc.title,
    slug: doc.slug,
    metaTitle: (doc as any).metaTitle || '',
    metaDescription: (doc as any).metaDescription || '',
  }));

  console.log(`✅ Local Database: Found ${localPages.length} pages.\n`);

  console.log('🔍 Step 2: Fetching pages from REMOTE Test Server (Neon Postgres)...');
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const res = await pool.query('SELECT title, slug, meta_title, meta_description FROM pages ORDER BY slug ASC;');
    const remotePages = res.rows.map(row => ({
      title: row.title,
      slug: row.slug,
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
    }));

    console.log(`✅ Remote Database: Found ${remotePages.length} pages.\n`);

    console.log('========================================================================');
    console.log('📊 COMPARISON REPORT: LOCAL DATABASE vs REMOTE TEST SERVER DATABASE');
    console.log('========================================================================\n');

    const localMap = new Map(localPages.map(p => [p.slug, p]));
    const remoteMap = new Map(remotePages.map(p => [p.slug, p]));

    const allSlugs = Array.from(new Set([...localMap.keys(), ...remoteMap.keys()])).sort();

    let matches = 0;
    let mismatches = 0;
    let missingRemote = 0;
    let missingLocal = 0;

    for (const slug of allSlugs) {
      const local = localMap.get(slug);
      const remote = remoteMap.get(slug);

      if (!remote) {
        console.log(`❌ [MISSING IN REMOTE] Slug: "${slug}"`);
        console.log(`   Local Title: "${local?.title}"`);
        missingRemote++;
      } else if (!local) {
        console.log(`⚠️  [MISSING IN LOCAL] Slug: "${slug}"`);
        console.log(`   Remote Title: "${remote?.title}"`);
        missingLocal++;
      } else {
        const titleMatch = local.title === remote.title;
        const metaTitleMatch = local.metaTitle === remote.metaTitle;
        const metaDescMatch = local.metaDescription === remote.metaDescription;

        if (titleMatch && metaTitleMatch && metaDescMatch) {
          console.log(`✅ [MATCH] Slug: "${slug}" | Title: "${local.title}"`);
          matches++;
        } else {
          console.log(`🚨 [MISMATCH] Slug: "${slug}"`);
          if (!titleMatch) {
            console.log(`   Title: Local="${local.title}" vs Remote="${remote.title}"`);
          }
          if (!metaTitleMatch) {
            console.log(`   Meta Title:\n     Local:  "${local.metaTitle}"\n     Remote: "${remote.metaTitle}"`);
          }
          if (!metaDescMatch) {
            console.log(`   Meta Description:\n     Local:  "${local.metaDescription}"\n     Remote: "${remote.metaDescription}"`);
          }
          mismatches++;
        }
      }
      console.log('------------------------------------------------------------------------');
    }

    console.log('\n========================================================================');
    console.log(`📈 SUMMARY:`);
    console.log(`   Total Unique Slugs: ${allSlugs.length}`);
    console.log(`   Exact Matches: ${matches}`);
    console.log(`   Mismatches: ${mismatches}`);
    console.log(`   Missing in Remote Database: ${missingRemote}`);
    console.log(`   Missing in Local Database: ${missingLocal}`);
    console.log('========================================================================');

  } catch (err: any) {
    console.error('❌ Error querying remote Postgres database:', err.message || err);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

compare();
