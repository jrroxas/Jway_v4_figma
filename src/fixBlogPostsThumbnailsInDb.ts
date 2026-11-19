import { getPayloadClient } from './lib/getPayload';

const postImageMap = [
  { slug: 'the-hidden-cost-of-delaying-your-mobile-app-in-2026', image: '/blog/unnamed-Jun-23-2026-06-08-33-0040-AM.png' },
  { slug: 'hiring-is-not-broken.-your-decision-making-process-might-be', image: '/blog/cover.png' },
  { slug: 'the-subtle-color-decisions-that-make-or-break-a-website', image: '/header.png' },
  { slug: 'the-talent-retention-playbook-nobody-talks-about', image: '/blog/Gemini_Generated_Image_qw6peeqw6peeqw6p.png' },
  { slug: 'the-hidden-cost-of-shared-responsibility-why-your-org-chart-is-killing-your-margins-stop-hiring-for-titles-start-hiring-for-bottlenecks', image: '/blog/c661f4e6bd86f8af5309890e20c631c5.jpg' },
  { slug: 'no-sandbox-projects-how-i-shipped-a-production-ready-app-in-16-weeks', image: '/blog/ee6b9a6bfb317bb7bbc719f2b15b5359.jpg' },
  { slug: 'our-commitment-to-optimizely-and-what-it-means-for-you', image: '/blog/1-2.png' },
  { slug: 'why-early-year-decisions-shape-hiring-success-more-than-q4-budgets', image: '/blog/b6e6051f531e32d1f060e423d38c0173.jpg' },
  { slug: 'beyond-the-buzzwords-the-hard-lessons-of-2025-that-will-dictate-your-2026-strategy', image: '/blog/fee20e3574a0d164c77a1166db0a0714.jpg' },
  { slug: 'our-journey-publishing-4j-hub-on-the-app-store-challenges-rejections-and-lessons-learned', image: '/blog/unnamed-2-3.png' },
  { slug: 'getting-started-with-n8n-in-under-10-minutes', image: '/blog/unnamed-2-2.png' },
  { slug: 'smart-staffing-the-foundation-of-a-strong-team', image: '/blog/ba369a176b8563c642da6d91015e14e3.jpg' },
  { slug: 'implementing-reflect-cut-qa-testing-time-by-80', image: '/blog/c661f4e6bd86f8af5309890e20c631c5.jpg' },
  { slug: '15-minute-magic-turning-complexity-into-click-by-click-guides-with-ai', image: '/blog/Banner-1.png' }
];

async function updateThumbnails() {
  console.log('🚀 Syncing Local SQLite Posts Cover Images...');
  const payload = await getPayloadClient();
  for (const item of postImageMap) {
    const res = await payload.find({
      collection: 'posts',
      where: { slug: { equals: item.slug } },
      limit: 100,
    });
    if (res.docs && res.docs.length > 0) {
      for (const doc of res.docs) {
        await payload.update({
          collection: 'posts',
          id: doc.id,
          data: { coverImageUrl: item.image },
        });
        console.log(`  ✅ Local SQLite: Updated "${item.slug}" -> ${item.image}`);
      }
    }
  }
  process.exit(0);
}

updateThumbnails();
