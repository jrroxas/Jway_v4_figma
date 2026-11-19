import fs from 'fs';
import https from 'https';

const validCategories = ['Design', 'Enterprise', 'Staffing', 'Strategy', 'Technology', 'General'];

function normalizeCategory(cat) {
  if (validCategories.includes(cat)) return cat;
  if (cat === 'Digital' || cat === 'Animation' || cat === 'Tutorials') return 'Technology';
  if (cat === 'Digital Marketing' || cat === 'News and Events') return 'Strategy';
  if (cat === 'Inspiration') return 'Design';
  return 'General';
}

const articlesToProcess = [
  {
    title: 'Certified True Copies Now Required for First-Time Jobseekers in the Philippines',
    slug: 'certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines',
    publishedDate: '2020-02-20T05:12:33.000Z',
    displayDate: 'February 20, 2020',
    category: 'Staffing',
    tags: 'News and Events, Staffing',
    readTime: '3 min read',
    authorName: 'Marianne Pimentel',
    coverImageUrl: 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg',
    url: 'https://jway-20137624.hs-sites.com/blog/news-and-events/certified-true-copies-now-required-for-first-time-jobseekers-in-the-philippines',
  },
  {
    title: 'Using Flutter to Optimize Your Costs and Time-to-Market',
    slug: 'use-flutter-to-optimize-your-costs-and-time-to-market',
    publishedDate: '2023-01-25T00:00:00.000Z',
    displayDate: 'January 25, 2023',
    category: 'Technology',
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
    category: 'Technology',
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
    category: 'Staffing',
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
    category: 'Strategy',
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
    category: 'Technology',
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
    category: 'Technology',
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
    category: 'Technology',
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

function extractFullPostBody(html) {
  let bodyContent = '';

  // Strategy 1: Find <div class="blog-post__body"> and slice until </div> before </article>
  const bodyStartIdx = html.indexOf('<div class="blog-post__body">');
  if (bodyStartIdx !== -1) {
    const articleEndIdx = html.indexOf('</article>', bodyStartIdx);
    if (articleEndIdx !== -1) {
      bodyContent = html.substring(bodyStartIdx, articleEndIdx);
      // Remove wrapper tags
      bodyContent = bodyContent.replace(/^<div class="blog-post__body">\s*/, '').replace(/<\/div>\s*$/, '');
    }
  }

  // Fallback Strategy 2: span id="hs_cos_wrapper_post_body"
  if (!bodyContent) {
    const postBodyStart = html.indexOf('<span id="hs_cos_wrapper_post_body"');
    if (postBodyStart !== -1) {
      const articleEnd = html.indexOf('</article>', postBodyStart);
      if (articleEnd !== -1) {
        bodyContent = html.substring(postBodyStart, articleEnd);
        bodyContent = bodyContent.replace(/^<span [^>]+>\s*/, '').replace(/<\/span>\s*<\/div>\s*$/, '');
      }
    }
  }

  // Clean HTML
  bodyContent = bodyContent
    .replace(/<!--more-->/g, '')
    .replace(/<span id="hs_cos_wrapper_post_body"[^>]*>/g, '')
    .replace(/color:\s*#[a-fA-F0-9]{3,6}/g, 'color: #a8c028')
    .replace(/<h2/g, '<h2 style="font-size:18px;font-weight:700;color:#a8c028;margin:1.5rem 0 1rem;"')
    .replace(/<h3/g, '<h3 style="font-size:16px;font-weight:700;color:#a8c028;margin:1.25rem 0 0.75rem;"')
    .trim();

  return bodyContent;
}

async function run() {
  console.log('🔄 Re-scraping and verifying full body content for ALL articles...\n');

  for (const item of articlesToProcess) {
    console.log(`Processing: "${item.title}" (${item.slug})`);
    const html = await fetchHtml(item.url);
    if (!html) {
      console.error(`  ❌ Failed to fetch ${item.url}`);
      continue;
    }

    const fullBody = extractFullPostBody(html);
    item.contentHtml = fullBody;

    const firstP = fullBody.match(/<p>(.*?)<\/p>/);
    item.summary = firstP
      ? firstP[1].replace(/<[^>]+>/g, '').trim().slice(0, 250) + '...'
      : item.title;

    console.log(`  ✅ Extracted full body content (${fullBody.length} characters)`);
  }

  fs.writeFileSync(
    'c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json',
    JSON.stringify(articlesToProcess, null, 2)
  );

  console.log('\n🎉 Successfully saved complete articles to src/allArticlesFullParsed.json');
}

run();
