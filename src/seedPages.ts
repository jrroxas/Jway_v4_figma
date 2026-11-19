/**
 * Seed Script — JWay Pages SEO Metadata
 * ──────────────────────────────────────
 * Populates all site pages into the Payload CMS 'pages' collection
 * with their live Meta Title and Meta Description settings.
 *
 * Usage:
 *   npx tsx src/seedPages.ts
 */

import { getPayload } from 'payload';
import config from './payload.config';

export const sitePagesData = [
  {
    title: 'Homepage',
    slug: 'home',
    metaTitle: 'Build Smarter. Apply AI. Put Talent to Work. | JWay Group Inc.',
    metaDescription: 'From designing and engineering digital platforms to introducing AI into everyday operations and deploying specialized technology professionals, we bring the expertise to turn ambitious plans into working technology.',
  },
  {
    title: 'Homepage Old',
    slug: 'homepage_old',
    metaTitle: '28+ Years of Technology and Digital Solutions | JWay Group Inc.',
    metaDescription: '10M+ talent reach across multiple industries and professions. 25k+ prequalified talent database, 100+ projects.',
  },
  {
    title: 'Client Testimonials',
    slug: 'testimonials',
    metaTitle: 'Client Testimonials | JWay Group Inc.',
    metaDescription: 'Discover how we work with our clients and business partners. Read verified client reviews about JWay Group.',
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    metaTitle: 'Privacy Policy | JWay Group Inc.',
    metaDescription: 'Learn about the types of information we gather and how we use it to enhance your experience with the JWay website.',
  },
  {
    title: 'About Us',
    slug: 'about',
    metaTitle: 'About Us | JWay Group Inc.',
    metaDescription: 'Learn more about JWay Group, our team, our mission, and our 20+ years of technology experience.',
  },
  {
    title: 'AI Solutions',
    slug: 'ai-solutions',
    metaTitle: 'AI Solutions | JWay Group Inc.',
    metaDescription: 'Discover cutting-edge AI and Machine Learning solutions tailored for enterprise growth and digital transformation.',
  },
  {
    title: 'Digital',
    slug: 'digital',
    metaTitle: 'Digital | JWay Group Inc.',
    metaDescription: 'We specialize in building powerful websites, web apps, and web marketing campaigns for a full digital transformation.',
  },
  {
    title: 'Enterprise',
    slug: 'enterprise',
    metaTitle: 'Enterprise | JWay Group Inc.',
    metaDescription: 'Experts in Enterprise Applications Development, seamlessly integrating Applications and Products to create innovative solutions.',
  },
  {
    title: 'Mobile',
    slug: 'mobile',
    metaTitle: 'Mobile | JWay Group Inc.',
    metaDescription: 'We specialize in Flutter for iOS & Android development in one codebase to reduce cost and speed up deployment. We also offer VAPT & AI/ML.',
  },
  {
    title: 'Staffing',
    slug: 'staffing',
    metaTitle: 'Staffing | JWay Group Inc.',
    metaDescription: 'We offer speed, quality candidates, a vast talent network, an expert-vetted process, and cost savings.',
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    metaTitle: 'Contact Us | JWay Group Inc.',
    metaDescription: 'Let’s start a project together! Get in touch with for queries, support, or feedback.',
  },
  {
    title: 'Contact',
    slug: 'contact',
    metaTitle: 'Contact Us | JWay Group Inc.',
    metaDescription: 'Let’s start a project together! Get in touch with for queries, support, or feedback.',
  },
  {
    title: 'FAQ',
    slug: 'faqs',
    metaTitle: 'FAQ | JWay Group Inc.',
    metaDescription: 'Browse through our list of most frequently asked questions at JWay Group.',
  },
  {
    title: 'Terms of Use',
    slug: 'terms-of-use',
    metaTitle: 'Terms of Use | JWay Group Inc.',
    metaDescription: 'Learn about JWay Group website guidelines, policies, and conditions.',
  },
  {
    title: 'Blog Index',
    slug: 'blog',
    metaTitle: 'Technology & Digital Marketing Insights | JWay Group Inc.',
    metaDescription: 'Read interesting articles about technology, digital marketing, design, and innovation.',
  },
  {
    title: 'Case Studies',
    slug: 'case-studies',
    metaTitle: 'Case Studies | JWay Group Inc.',
    metaDescription: 'Explore our latest case studies and success stories in web engineering, mobile development, and enterprise applications.',
  },
  {
    title: 'Coming Soon',
    slug: 'coming-soon',
    metaTitle: 'Coming Soon | JWay Group Inc.',
    metaDescription: 'We are currently working on a new super awesome website.',
  },
  {
    title: 'Project Rescue Mission Triage',
    slug: 'staffing-rescue-mission',
    metaTitle: 'Project Rescue Mission | JWay Group Staffing',
    metaDescription: "Play JWay's Project Rescue Mission triage game. Fix software development bottlenecks using our top-tier IT experts.",
  },
  {
    title: 'Vetted Talents Network',
    slug: 'talents',
    metaTitle: 'Vetted Talents Network | JWay Group Inc.',
    metaDescription: 'Explore JWay’s expert-vetted network of top AI, Engineering, Design, and Management talents available for immediate deployment.',
  },
  {
    title: 'Heal Case Study',
    slug: 'case-studies-heal',
    metaTitle: 'Heal App Case Study | JWay Group Inc.',
    metaDescription: 'Heal App offers robust privacy controls and an intuitive swipe-based interface designed for ease of use in modern digital health.',
  },
  {
    title: 'Game Squad Case Study',
    slug: 'case-studies-game-squad',
    metaTitle: 'Game Squad Case Study | JWay Group Inc.',
    metaDescription: 'GameSquad fosters community through squad streaming, allowing users to create watch parties and connect with fans in an intuitive live streaming app.',
  },
];

async function seedPages() {
  console.log('🚀 Initializing Payload CMS to seed Pages collection...');
  const payload = await getPayload({ config });

  console.log(`\n📝 Seeding ${sitePagesData.length} site pages into the Pages collection...\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const page of sitePagesData) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
        limit: 1,
      });

      if (existing.docs.length > 0) {
        const id = existing.docs[0].id;
        await payload.update({
          collection: 'pages',
          id,
          data: {
            title: page.title,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            noIndex: false,
            noFollow: false,
          },
        });
        console.log(`  🔄 Updated: ${page.title} (slug: ${page.slug})`);
        updated++;
      } else {
        await payload.create({
          collection: 'pages',
          data: {
            title: page.title,
            slug: page.slug,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            noIndex: false,
            noFollow: false,
          },
        });
        console.log(`  ✅ Created: ${page.title} (slug: ${page.slug})`);
        created++;
      }
    } catch (err: any) {
      console.error(`  ❌ Error seeding "${page.title}":`, err?.message ?? err);
      errors++;
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Created : ${created}
  🔄 Updated : ${updated}
  ❌ Errors  : ${errors}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

  process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith('seedPages.ts')) {
  seedPages().catch((err) => {
    console.error('Fatal seedPages error:', err);
    process.exit(1);
  });
}
