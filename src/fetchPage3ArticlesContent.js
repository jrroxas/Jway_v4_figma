import fs from 'fs';
import https from 'https';

const validCategories = ['Design', 'Enterprise', 'Staffing', 'Strategy', 'Technology', 'General'];

function normalizeCategory(cat) {
  if (validCategories.includes(cat)) return cat;
  if (cat === 'Digital' || cat === 'Animation') return 'Technology';
  if (cat === 'Inspiration') return 'Design';
  return 'General';
}

const newArticles = [
  {
    title: 'Building Beautiful UIs with Flutter: Tips and Tricks',
    slug: 'building-beautiful-uis-with-flutter-tips-and-tricks',
    date: '2024-07-09T00:00:00.000Z',
    displayDate: 'July 9, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Flutter, Mobile, UI/UX, Design',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/hero-jul-9.png',
    url: 'https://www.jway.com/blog/technology/building-beautiful-uis-with-flutter-tips-and-tricks'
  },
  {
    title: 'The Impact of AI on Recruitment: What Candidates Should Know',
    slug: 'the-impact-of-ai-on-recruitment-what-candidates-should-know',
    date: '2024-07-06T00:00:00.000Z',
    displayDate: 'July 6, 2024',
    category: normalizeCategory('Staffing'),
    tags: 'AI, Recruitment, Staffing, Careers',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/banner-staffing.png',
    url: 'https://www.jway.com/blog/technology/the-impact-of-ai-on-recruitment-what-candidates-should-know'
  },
  {
    title: 'Say Goodbye to Manual Tasks: Embracing Reflect for Seamless Automation',
    slug: 'say-goodbye-to-manual-tasks-embracing-reflect-for-seamless-automation',
    date: '2024-07-02T00:00:00.000Z',
    displayDate: 'July 2, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Reflect, Automation, QA, Testing',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/reflectLogo.png',
    url: 'https://www.jway.com/blog/technology/say-goodbye-to-manual-tasks-embracing-reflect-for-seamless-automation'
  },
  {
    title: 'Introduction to Katalon + Saucelabs in QA Testing',
    slug: 'introduction-to-katalon-saucelabs-in-qa-testing',
    date: '2024-04-26T00:00:00.000Z',
    displayDate: 'April 26, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Katalon, Saucelabs, QA, Testing',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/unnamed-18.png',
    url: 'https://www.jway.com/blog/technology/introduction-to-katalon-saucelabs-in-qa-testing'
  },
  {
    title: 'JWay TechTalks Ep 3: Modern Way Of Building And Running Mobile Applications',
    slug: 'jway-techtalks-ep-3-modern-way-of-building-and-running-mobile-applications',
    date: '2023-07-25T00:00:00.000Z',
    displayDate: 'July 25, 2023',
    category: normalizeCategory('Technology'),
    tags: 'TechTalks, Mobile, App Development, Architecture',
    readTime: '7 min read',
    author: 'Paul Sevilla',
    coverImageUrl: '/blog/JWay-Techtalk-large.png',
    url: 'https://www.jway.com/blog/technology/jway-techtalks-ep-3-modern-way-of-building-and-running-mobile-applications-with-jway-mobile-applications-manager-paul-sevilla'
  },
  {
    title: 'JWay TechTalks Ep 2: Staying Up With HR Innovation and Hiring Tech Professionals',
    slug: 'jway-techtalks-ep-2-staying-up-with-hr-innovation-and-hiring-tech-professionals',
    date: '2023-05-22T00:00:00.000Z',
    displayDate: 'May 22, 2023',
    category: normalizeCategory('Staffing'),
    tags: 'TechTalks, HR, Staffing, Recruitment',
    readTime: '7 min read',
    author: 'Mara Quivedo',
    coverImageUrl: '/blog/JWay-Techtalk-large.png',
    url: 'https://www.jway.com/blog/technology/jway-techtalks-ep-2-staying-up-with-hr-innovation-and-hiring-tech-professionals-in-the-philippines-with-mara-quivedo'
  },
  {
    title: '5 Best Practices on How to Provide Support to Manage your Global Team',
    slug: '5-best-practices-on-how-to-provide-support-to-manage-your-global-team',
    date: '2023-03-29T00:00:00.000Z',
    displayDate: 'March 29, 2023',
    category: normalizeCategory('Staffing'),
    tags: 'Global Team, Management, Remote Work, Leadership',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/blog-1.png',
    url: 'https://www.jway.com/blog/technology/5-best-practices-on-how-to-provide-support-to-manage-your-global-team'
  },
  {
    title: 'Get Started With Your Organic-Paid Media Strategy With These 3 Basic Ways',
    slug: '3-basic-ways-to-begin-an-organic-paid-media-strategy',
    date: '2023-03-15T00:00:00.000Z',
    displayDate: 'March 15, 2023',
    category: normalizeCategory('Strategy'),
    tags: 'Marketing, Strategy, Organic, Paid Media',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Blog1-2.jpg',
    url: 'https://www.jway.com/blog/technology/3-basic-ways-to-begin-an-organic-paid-media-strategy'
  },
  {
    title: '10 Tips To Write A Secure Javascript Code',
    slug: '10-tips-to-write-a-secure-javascript-code',
    date: '2023-03-02T00:00:00.000Z',
    displayDate: 'March 2, 2023',
    category: normalizeCategory('Technology'),
    tags: 'JavaScript, Security, Web Development, Programming',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/james-harrison-vpOeXr5wmR4-unsplash.jpg',
    url: 'https://www.jway.com/blog/technology/10-tips-to-write-a-secure-javascript-code'
  },
  {
    title: '8 Reasons Why You Need To Use Hubspot Content Marketing in 2023',
    slug: '8-reasons-to-hubspot-content-marketing-in-2023',
    date: '2023-02-22T00:00:00.000Z',
    displayDate: 'February 22, 2023',
    category: normalizeCategory('Technology'),
    tags: 'HubSpot, Content Marketing, Digital, Inbound',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/campaign-creators-3WNi-5s4LVg-unsplash-1.jpg',
    url: 'https://www.jway.com/blog/technology/8-reasons-to-hubspot-content-marketing-in-2023'
  }
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

async function run() {
  for (const item of newArticles) {
    console.log(`Fetching HTML for ${item.slug}...`);
    try {
      const html = await fetchHtml(item.url);
      const postContentMatch = html.match(/<span id="hs_cos_wrapper_post_body"[\s\S]*?<\/span>/) || html.match(/<div class="blog-post-body"[\s\S]*?<\/div>/);
      
      let bodyHtml = '';
      if (postContentMatch) {
        bodyHtml = postContentMatch[0];
      } else {
        const paras = html.match(/<p>[\s\S]*?<\/p>/g) || [];
        bodyHtml = paras.slice(0, 10).join('\n');
      }

      bodyHtml = bodyHtml
        .replace(/color:\s*#[a-fA-F0-9]{3,6}/g, 'color: #a8c028')
        .replace(/<h2/g, '<h2 style="font-size:18px;font-weight:700;color:#a8c028;margin:1.5rem 0 1rem;"')
        .replace(/<h3/g, '<h3 style="font-size:16px;font-weight:700;color:#a8c028;margin:1.25rem 0 0.75rem;"');

      item.contentHtml = bodyHtml;
      
      const firstP = bodyHtml.match(/<p>(.*?)<\/p>/);
      item.summary = firstP ? firstP[1].replace(/<[^>]+>/g, '').trim().slice(0, 200) + '...' : item.title;

    } catch (e) {
      console.error(`Failed to fetch ${item.slug}`, e);
    }
  }

  fs.writeFileSync('C:\\Localhost\\jway-site\\src\\page3ArticlesParsed.json', JSON.stringify(newArticles, null, 2));
  console.log('✅ Parsed all 10 Page 3 articles into page3ArticlesParsed.json');
}

run();
