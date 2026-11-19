import { getPayloadClient } from './lib/getPayload';
import pg from 'pg';

const remoteConnectionString = 'postgresql://neondb_owner:npg_cS8JPsinDve1@ep-long-morning-aqxemcyr-pooler.c-8.us-east-1.aws.neon.tech/jway_web?sslmode=verify-full&channel_binding=require';

const ALL_TESTIMONIALS = [
  {
    order: 1,
    name: "John Hoyt",
    role: "Managing Director",
    company: "D.W. Morgan",
    avatarUrl: "/testimonials/john.png",
    quote: "JWay has become much more than a supplier; they’re an extension of our own capabilities and a close strategic partner. As we have rapidly scaled operations in Asia, JWay has brought an entrepreneurial spirit and flexibility that mirrors our own culture."
  },
  {
    order: 2,
    name: "Scott Filler",
    role: "Principal",
    company: "Scott Filler Consulting",
    avatarUrl: "/testimonials/scott.png",
    quote: "I’ve worked with JWay for more than 10 years on multiple projects, clients and positions. This long relationship is based on the quality of their work, the expertise of their team, their responsiveness and commitment to meet project schedules. Their use of offshore resources has given me the flexibility to provide cost-effective projects as well as turnkey maintenance and support once a project goes into production. JWay was my go-to partner for multiple website redesign projects including NASDAQ listed companies in the high-tech and semiconductor space. JWay is a reliable business partner that has allowed me to deliver exceptional solutions to my consulting and internal customers. I highly recommend them."
  },
  {
    order: 3,
    name: "Kendyl Kellogg",
    role: "Proprietor",
    company: "La Nebbia Winery",
    avatarUrl: "/testimonials/kendyl.png",
    quote: "JWay Group brought innovation, professionalism and consistency to the La Nebbia Winery marketing efforts. As a small business, it’s a challenge to keep up with the demands of running marketing programs while managing corporate and private events, along with the tasting room and winery promotions. We’re glad to have a partner who understands our business and helps us build on our success."
  },
  {
    order: 4,
    name: "Danny Teng",
    role: "Director of Information Systems",
    company: "Build It Green",
    avatarUrl: "/testimonials/danny.png",
    quote: "It’s been great working with JWay’s staff in developing a portal with Force.com platform. The staff is very knowledgeable with the platform and very resourceful. After the first engagement, we decided to extend the engagement longer because we are happy with the service JWay provided."
  },
  {
    order: 5,
    name: "Vincent Agbayani",
    role: "President",
    company: "Agbayani Construction Corporation",
    avatarUrl: "/testimonials/vincent.png",
    quote: "JWay has just completed ACC-Air’s website. ACC-Air is a subsidiary of Agbayani Construction Corporation (ACC). The website is designed to provide essential information about ACC-Air’s products and services, in a condensed format that can be easily read, on iPhone, iPad and other mobile devices. JWay, did an excellent job in formatting and presenting ACC-Air’s website, to reflect the smaller screens, without missing critical pictures and narratives. JWay is now supplementing ACC-Air’s online presence by demonstrating ways and means of marketing ACC-Air via Twitter, Facebook, and other social media methods. JWay has certainly showed us the way into the future of marketing. Other than their creative website designs, I highly recommend JWay to provide you an analysis of your existing marketing strategies. ACC has been in business for over 30 plus years and continue to rely on great companies, such as JWay, to move us into the future for another 30 years."
  },
  {
    order: 6,
    name: "Optimized Marketing Group",
    role: "Marketing Agency",
    company: "Client Partner",
    avatarUrl: "/testimonials/omg.png",
    quote: "The team at JWay is amazing! They respond to messages faster than you can send them, and their work is spectacular. The websites they build need very little change, and in the world of developers, that is astounding. The best part is how knowledgeable they are. When we need something, we have faith that they will give us what we are looking for, and in the slight chance they don’t have the answer, they will find it. As a marketing agency, being able to trust our developers is a priority, and keeping our customers happy and their websites functioning at peak performance is critical. Our clients deserve nothing but the best, and we’ve found it for them with JWay."
  },
  {
    order: 7,
    name: "Joseph Lee",
    role: "Senior Web Marketing Manager",
    company: "Integrated Device Technology",
    avatarUrl: "/testimonials/joseph.png",
    quote: "While I managed the corporate websites and channel partner extranets at Integrated Device Technology and Symmetricom, JWay has directly contributed to the ongoing success of improving the user experience and performance of these web properties. I would highly recommend JWay for any future website projects (design and/or programming)."
  },
  {
    order: 8,
    name: "Pavel Kalinin",
    role: "Engineering Manager",
    company: "Sun Microsystems",
    avatarUrl: "/testimonials/pavel.png",
    quote: "I worked with JWay when they were providing services to Sun Microsystem’s partner marketing organization. JWay built a Sun iForce Solution center portal for us, allowing Sun partners to showcase their solutions and connect to potential customers and other partners. I was impressed with the speed and quality of work that JWay’s team has shown on this project. They have smart and proactive engineering team and I really enjoyed working with them."
  },
  {
    order: 9,
    name: "Milena Volkova",
    role: "Senior Operations Manager",
    company: "Sun Microsystems",
    avatarUrl: "/testimonials/pavel.png",
    quote: "I was very pleased with JWay’s services when they worked on maintenance of a custom SFDC-based application at Sun Microsystems. Liesel has an exceptional customer focus, ability to brainstorm solutions and delivers results on time and on budget. She and the team of JWay consultants were very methodical, process- and detail-oriented, and results-focused. They ensured a smooth operation of our system that served a global team of about 200 Market Development managers and 10,000+ field sales."
  }
];

async function syncAll() {
  console.log('🚀 Synchronizing 9 Testimonials (Including John Hoyt & Scott Filler)...');

  // 1. Update Local Payload SQLite DB
  try {
    const payload = await getPayloadClient();
    const existing = await payload.find({ collection: 'testimonials', limit: 100 });
    
    // Delete existing items to replace with updated 9 items
    for (const doc of existing.docs) {
      await payload.delete({ collection: 'testimonials', id: doc.id });
    }

    // Insert 9 items
    for (const item of ALL_TESTIMONIALS) {
      await payload.create({
        collection: 'testimonials',
        data: {
          name: item.name,
          role: item.role,
          company: item.company,
          avatarUrl: item.avatarUrl,
          quote: item.quote,
          order: item.order,
        },
      });
      console.log(`  ✅ Local SQLite: Created [${item.order}] ${item.name} (${item.company})`);
    }
  } catch (e: any) {
    console.error('❌ Local Sync Error:', e.message || e);
  }

  // 2. Update Remote Neon PostgreSQL Test DB
  const pool = new pg.Pool({
    connectionString: remoteConnectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    // Truncate or clear existing remote testimonials
    await pool.query('DELETE FROM testimonials;');

    for (const item of ALL_TESTIMONIALS) {
      await pool.query(
        `INSERT INTO testimonials (name, role, company, avatar_url, quote, "order", created_at, updated_at) 
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW());`,
        [item.name, item.role, item.company, item.avatarUrl, item.quote, item.order]
      );
      console.log(`  🌐 Remote Neon DB: Created [${item.order}] ${item.name} (${item.company})`);
    }

    console.log('\n========================================================================');
    console.log('🎉 BOTH LOCAL & REMOTE TEST DATABASES SYNCED TO 9 TESTIMONIALS SUCCESSFULLY!');
    console.log('========================================================================');
  } catch (e: any) {
    console.error('❌ Remote Sync Error:', e.message || e);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

syncAll();
