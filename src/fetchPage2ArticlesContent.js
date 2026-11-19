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
    title: '4 Key Web Design Theory Elements',
    slug: '4-key-web-design-theory-elements',
    date: '2024-09-04T00:00:00.000Z',
    displayDate: 'September 4, 2024',
    category: normalizeCategory('Design'),
    tags: 'Web Design, Inspiration, UI/UX, Design',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_WebDesignTheory09-04.png',
    url: 'https://www.jway.com/blog/inspiration/4-key-web-design-theory-elements'
  },
  {
    title: '3 Important Color Theory Principles in Web Design',
    slug: '3-important-color-theory-principles-in-web-design',
    date: '2024-09-03T00:00:00.000Z',
    displayDate: 'September 3, 2024',
    category: normalizeCategory('Design'),
    tags: 'Color Theory, Web Design, Inspiration',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_ColorTheory09-03.png',
    url: 'https://www.jway.com/blog/inspiration/3-important-color-theory-principles-in-web-design'
  },
  {
    title: 'Finding the Right Web Consultants',
    slug: 'finding-the-right-web-consultants',
    date: '2024-08-27T00:00:00.000Z',
    displayDate: 'August 27, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Technology, Consulting, Web Development',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_webconsultant08-27.png',
    url: 'https://www.jway.com/blog/technology/finding-the-right-web-consultants'
  },
  {
    title: 'Benefits of Video Marketing [UPDATED]',
    slug: 'benefits-of-video-marketing',
    date: '2024-08-22T00:00:00.000Z',
    displayDate: 'August 22, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Video Marketing, Digital, Animation, Marketing',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_VideoEditing08-22-1.png',
    url: 'https://www.jway.com/blog/animation/benefits-of-video-marketing'
  },
  {
    title: 'Animated Guide to Cybersecurity: Safety Tips for Everyone',
    slug: 'cybersecurity',
    date: '2024-08-19T00:00:00.000Z',
    displayDate: 'August 19, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Cybersecurity, Technology, Security, Safety',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Cybersecurity08-19-2.png',
    url: 'https://www.jway.com/blog/cybersecurity'
  },
  {
    title: 'How to Use Instagram Video Content [UPDATED]',
    slug: 'how-to-use-instagram-video-content',
    date: '2024-08-15T00:00:00.000Z',
    displayDate: 'August 15, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Instagram, Video Content, Digital Marketing, Social Media',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Instagram.png',
    url: 'https://www.jway.com/blog/how-to-use-instagram-video-content'
  },
  {
    title: 'From Design to Development: My Journey Embracing Flutter',
    slug: 'from-design-to-development-my-journey-embracing-flutter',
    date: '2024-08-02T00:00:00.000Z',
    displayDate: 'August 2, 2024',
    category: normalizeCategory('Technology'),
    tags: 'Flutter, Mobile, Development, UI/UX',
    readTime: '7 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Kenya08-02.png',
    url: 'https://www.jway.com/blog/technology/from-design-to-development-my-journey-embracing-flutter'
  },
  {
    title: 'Custom Software Application vs JSM',
    slug: 'custom-software-application-vs-jsm',
    date: '2024-07-26T00:00:00.000Z',
    displayDate: 'July 26, 2024',
    category: normalizeCategory('Enterprise'),
    tags: 'Enterprise, Software Development, JSM, Strategy',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Enterprise0726.png',
    url: 'https://www.jway.com/blog/technology/custom-software-application-vs-jsm'
  },
  {
    title: 'Navigating the Hiring Journey: A Guide from Your Staffing Partner',
    slug: 'navigating-the-hiring-journey-a-guide-from-your-staffing-partner',
    date: '2024-07-23T00:00:00.000Z',
    displayDate: 'July 23, 2024',
    category: normalizeCategory('Staffing'),
    tags: 'Staffing, Hiring, Recruitment, Talent',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Staffing0723.png',
    url: 'https://www.jway.com/blog/technology/navigating-the-hiring-journey-a-guide-from-your-staffing-partner'
  },
  {
    title: 'Building AI-Powered Flutter Apps: Integrating Machine Learning Models',
    slug: 'building-ai-powered-flutter-apps-integrating-machine-learning-models',
    date: '2024-07-18T00:00:00.000Z',
    displayDate: 'July 18, 2024',
    category: normalizeCategory('Technology'),
    tags: 'AI, Flutter, Mobile, Machine Learning',
    readTime: '7 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_Mobile0718.png',
    url: 'https://www.jway.com/blog/technology/building-ai-powered-flutter-apps-integrating-machine-learning-models'
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

  fs.writeFileSync('C:\\Localhost\\jway-site\\src\\page2ArticlesParsed.json', JSON.stringify(newArticles, null, 2));
  console.log('✅ Parsed all 10 new Page 2 articles into page2ArticlesParsed.json with normalized categories');
}

run();
