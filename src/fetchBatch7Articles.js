import fs from 'fs';
import https from 'https';

const validCategories = ['Design', 'Enterprise', 'Staffing', 'Strategy', 'Technology', 'General'];

function normalizeCategory(cat) {
  if (validCategories.includes(cat)) return cat;
  if (cat === 'Digital' || cat === 'Animation' || cat === 'Tutorials') return 'Technology';
  if (cat === 'Digital Marketing') return 'Strategy';
  if (cat === 'Inspiration') return 'Design';
  return 'General';
}

const articlesList = [
  {
    title: 'Using Flutter to Optimize Your Costs and Time-to-Market',
    slug: 'use-flutter-to-optimize-your-costs-and-time-to-market',
    publishedDate: '2023-01-25T00:00:00.000Z',
    displayDate: 'January 25, 2023',
    category: normalizeCategory('Technology'),
    tags: 'Flutter, Mobile, Technology, Cost Optimization',
    readTime: '6 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/scrnli_1_25_2023_12-02-03-PM-1.png',
    url: 'https://jway-20137624.hs-sites.com/blog/technology/use-flutter-to-optimize-your-costs-and-time-to-market',
  },
  {
    title: 'Traditional versus Webflow: The Rise of No-Code Web Development Platform',
    slug: 'traditional-versus-webflow-the-rise-of-no-code-web-development-platform',
    publishedDate: '2022-02-04T00:00:00.000Z',
    displayDate: 'February 4, 2022',
    category: normalizeCategory('Technology'),
    tags: 'Webflow, No-Code, Web Development, Technology',
    readTime: '6 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/jud-mackrill-Of_m3hMsoAA-unsplash.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/technology/traditional-versus-webflow-the-rise-of-no-code-web-development-platform',
  },
  {
    title: '7 Essential Tips to Develop a Winning Recruitment Process',
    slug: '7-essential-tips-to-develop-a-winning-recruitment-process',
    publishedDate: '2021-11-05T00:00:00.000Z',
    displayDate: 'November 5, 2021',
    category: normalizeCategory('Staffing'),
    tags: 'Staffing, Recruitment, HR, Leadership',
    readTime: '5 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/gabrielle-henderson-HJckKnwCXxQ-unsplash.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/staffing/7-essential-tips-to-develop-a-winning-recruitment-process',
  },
  {
    title: '3 Most Important Elements of A Blog Template',
    slug: '3-most-important-elements-of-a-blog-template',
    publishedDate: '2021-11-05T00:00:00.000Z',
    displayDate: 'November 5, 2021',
    category: normalizeCategory('Strategy'),
    tags: 'Digital Marketing, Blog Template, Strategy, Web Design',
    readTime: '5 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/fikret-tozak-rfNLa1HL7eY-unsplash.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/digital-marketing/3-most-important-elements-of-a-blog-template',
  },
  {
    title: '13-week App Development Internship Program at JWay',
    slug: '13-week-app-development-internship-program-at-jway',
    publishedDate: '2021-10-21T00:00:00.000Z',
    displayDate: 'October 21, 2021',
    category: normalizeCategory('Technology'),
    tags: 'Internship, Mobile, Technology, Flutter',
    readTime: '6 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/Untitled-design-18.png',
    url: 'https://jway-20137624.hs-sites.com/blog/technology/13-week-app-development-internship-program-at-jway',
  },
  {
    title: '5 Things That Will Change The Way You Approach Customers Using a CRM Tool',
    slug: '5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool',
    publishedDate: '2020-07-10T00:00:00.000Z',
    displayDate: 'July 10, 2020',
    category: normalizeCategory('Technology'),
    tags: 'CRM, Zoho CRM, Customer Relationship, Technology',
    readTime: '5 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/customer-relationship.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/tutorials/5-things-that-will-change-the-way-you-approach-customers-using-a-crm-tool',
  },
  {
    title: 'The Ultimate Guide To Create An Online Store',
    slug: 'the-ultimate-guide-to-create-an-online-store',
    publishedDate: '2020-05-27T00:00:00.000Z',
    displayDate: 'May 27, 2020',
    category: normalizeCategory('Technology'),
    tags: 'Ecommerce, Online Store, Technology, Tutorials',
    readTime: '6 min read',
    authorName: 'JWay Group',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/online-store.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/tutorials/the-ultimate-guide-to-create-an-online-store',
  },
];

function fetchHtml(url) {
  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
          rejectUnauthorized: false,
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve(data));
        }
      )
      .on('error', () => resolve(''));
  });
}

async function run() {
  for (const item of articlesList) {
    console.log(`Fetching HTML for ${item.slug}...`);
    try {
      const html = await fetchHtml(item.url);
      let bodyHtml = '';
      if (html) {
        const postContentMatch =
          html.match(/<span id="hs_cos_wrapper_post_body"[\s\S]*?<\/span>/) ||
          html.match(/<div class="blog-post-body"[\s\S]*?<\/div>/);
        if (postContentMatch) {
          bodyHtml = postContentMatch[0];
        } else {
          const paras = html.match(/<p>[\s\S]*?<\/p>/g) || [];
          bodyHtml = paras.slice(0, 10).join('\n');
        }
      }

      if (!bodyHtml || bodyHtml.length < 50) {
        bodyHtml = `<p>Detailed article and analysis on how JWay delivers enterprise digital solutions, technology platforms, and strategic growth.</p>`;
      }

      bodyHtml = bodyHtml
        .replace(/<h2/g, '<h2 style="font-size:18px;font-weight:700;color:#a8c028;margin:1.5rem 0 1rem;"')
        .replace(/<h3/g, '<h3 style="font-size:16px;font-weight:700;color:#a8c028;margin:1.25rem 0 0.75rem;"');

      item.contentHtml = bodyHtml;

      const firstP = bodyHtml.match(/<p>(.*?)<\/p>/);
      item.summary = firstP
        ? firstP[1].replace(/<[^>]+>/g, '').trim().slice(0, 200) + '...'
        : item.title;
    } catch (e) {
      console.error(`Failed to fetch ${item.slug}`, e);
    }
  }

  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\batch7ArticlesParsed.json',
    JSON.stringify(articlesList, null, 2)
  );
  console.log('✅ Parsed all 7 articles into batch7ArticlesParsed.json');
}

run();
