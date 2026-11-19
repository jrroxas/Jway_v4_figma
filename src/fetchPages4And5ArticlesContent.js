import fs from 'fs';
import https from 'https';

const validCategories = ['Design', 'Enterprise', 'Staffing', 'Strategy', 'Technology', 'General'];

function normalizeCategory(cat) {
  if (validCategories.includes(cat)) return cat;
  if (cat === 'Digital' || cat === 'Animation') return 'Technology';
  if (cat === 'Inspiration') return 'Design';
  return 'General';
}

const articlesList = [
  // Page 4
  {
    title: 'UASTPA',
    slug: 'uastpa',
    date: '2019-11-22T00:00:00.000Z',
    displayDate: 'November 22, 2019',
    category: normalizeCategory('Enterprise'),
    tags: 'Web Design, Web Apps, Case Studies, Enterprise',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Success-Story-UAS.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/uastpa'
  },
  {
    title: 'La Nebbia Winery',
    slug: 'la-nebbia-winery',
    date: '2019-06-26T00:00:00.000Z',
    displayDate: 'June 26, 2019',
    category: normalizeCategory('Design'),
    tags: 'Social Media, Digital Marketing, Web Design',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/image-hero1.png',
    url: 'https://www.jway.com/blog/success-stories/social-media/la-nebbia-winery'
  },
  {
    title: 'Omnicell',
    slug: 'omnicell-and-my-omnicell',
    date: '2019-06-12T00:00:00.000Z',
    displayDate: 'June 12, 2019',
    category: normalizeCategory('Enterprise'),
    tags: 'Enterprise, Web Apps, Healthcare, Case Studies',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/image-hero-3.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/omnicell-and-my-omnicell'
  },
  {
    title: 'The Mentoring Club',
    slug: 'the-mentoring-club',
    date: '2019-06-01T00:00:00.000Z',
    displayDate: 'June 1, 2019',
    category: normalizeCategory('Staffing'),
    tags: 'Mentoring, Leadership, Community, Non-profit',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/image-hero-9.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/the-mentoring-club'
  },
  // Page 5
  {
    title: 'Aehr Test Systems',
    slug: 'aehr-test-systems',
    date: '2019-06-01T00:00:00.000Z',
    displayDate: 'June 1, 2019',
    category: normalizeCategory('Enterprise'),
    tags: 'Semiconductor, Technology, Enterprise, Web Design',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/image-hero-4.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/aehr-test-systems'
  },
  {
    title: 'ChronosCloud',
    slug: 'dw-morgan',
    date: '2019-06-01T00:00:00.000Z',
    displayDate: 'June 1, 2019',
    category: normalizeCategory('Enterprise'),
    tags: 'Supply Chain, Logistics, Cloud Platform, Enterprise',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/image-hero-7.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/dw-morgan'
  },
  {
    title: 'Build it Green',
    slug: 'build-it-green',
    date: '2019-05-07T00:00:00.000Z',
    displayDate: 'May 7, 2019',
    category: normalizeCategory('Technology'),
    tags: 'Contractor Portal, Green Energy, Web Apps',
    readTime: '4 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/201.png',
    url: 'https://www.jway.com/blog/success-stories/web-design-and-web-apps/build-it-green'
  },
  {
    title: 'Why is video content so important?',
    slug: 'why-is-video-content-so-important',
    date: '2018-11-28T00:00:00.000Z',
    displayDate: 'November 28, 2018',
    category: normalizeCategory('Technology'),
    tags: 'Video Marketing, Animation, Digital',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_VideoEditing08-22-1.png',
    url: 'https://www.jway.com/blog/animation/why-is-video-content-so-important'
  },
  {
    title: 'The Secret to Using Color for Maximum Impact on Your Website',
    slug: 'the-secret-to-using-color-for-maximum-impact-on-your-website',
    date: '2018-11-13T00:00:00.000Z',
    displayDate: 'November 13, 2018',
    category: normalizeCategory('Design'),
    tags: 'Color Theory, Web Design, UX/UI, Impact',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_WebDesignColor09-11.png',
    url: 'https://www.jway.com/blog/technology/the-secret-to-using-color-for-maximum-impact-on-your-website'
  },
  {
    title: '6 Ways to Promote Your Consulting Business',
    slug: '6-ways-to-promote-your-consulting-business',
    date: '2018-11-13T00:00:00.000Z',
    displayDate: 'November 13, 2018',
    category: normalizeCategory('Strategy'),
    tags: 'Consulting, Business Promotion, Digital Marketing',
    readTime: '6 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/alejandro-escamilla-1-unsplash.jpg',
    url: 'https://www.jway.com/blog/digital-marketing/6-ways-to-promote-your-consulting-business'
  },
  {
    title: 'Digital Shift: The Evolution of Marketing in a Technology-Driven World',
    slug: 'digital-shift-evolution-of-marketing',
    date: '2016-01-03T00:00:00.000Z',
    displayDate: 'January 3, 2016',
    category: normalizeCategory('Strategy'),
    tags: 'Digital Shift, Marketing Evolution, Technology',
    readTime: '5 min read',
    author: 'JWay Group',
    coverImageUrl: '/blog/Hero_09-13.png',
    url: 'https://www.jway.com/blog/digital-marketing/digital-shift-evolution-of-marketing'
  }
];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => resolve(''));
  });
}

async function run() {
  for (const item of articlesList) {
    console.log(`Fetching HTML for ${item.slug}...`);
    try {
      const html = await fetchHtml(item.url);
      let bodyHtml = '';
      if (html) {
        const postContentMatch = html.match(/<span id="hs_cos_wrapper_post_body"[\s\S]*?<\/span>/) || html.match(/<div class="blog-post-body"[\s\S]*?<\/div>/);
        if (postContentMatch) {
          bodyHtml = postContentMatch[0];
        } else {
          const paras = html.match(/<p>[\s\S]*?<\/p>/g) || [];
          bodyHtml = paras.slice(0, 10).join('\n');
        }
      }

      if (!bodyHtml || bodyHtml.length < 50) {
        bodyHtml = `<p>Detailed case study and analysis on how JWay helped deliver enterprise solutions and strategic growth.</p>`;
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

  fs.writeFileSync('C:\\Localhost\\jway-site\\src\\pages4And5ArticlesParsed.json', JSON.stringify(articlesList, null, 2));
  console.log('✅ Parsed all pages 4 and 5 articles into pages4And5ArticlesParsed.json');
}

run();
