import fs from 'fs';
import path from 'path';
import https from 'https';

const imageMap = [
  { slug: 'the-hidden-cost-of-delaying-your-mobile-app-in-2026', url: 'https://www.jway.com/hubfs/unnamed-Jun-23-2026-06-08-33-0040-AM.png', file: 'unnamed-Jun-23-2026-06-08-33-0040-AM.png' },
  { slug: 'hiring-is-not-broken.-your-decision-making-process-might-be', url: 'https://www.jway.com/hubfs/cover.png', file: 'cover.png' },
  { slug: 'the-subtle-color-decisions-that-make-or-break-a-website', url: 'https://www.jway.com/hubfs/header.png', file: 'header.png' },
  { slug: 'the-talent-retention-playbook-nobody-talks-about', url: 'https://www.jway.com/hubfs/Gemini_Generated_Image_qw6peeqw6peeqw6p.png', file: 'Gemini_Generated_Image_qw6peeqw6peeqw6p.png' },
  { slug: 'the-hidden-cost-of-shared-responsibility-why-your-org-chart-is-killing-your-margins-stop-hiring-for-titles-start-hiring-for-bottlenecks', url: 'https://www.jway.com/hubfs/c661f4e6bd86f8af5309890e20c631c5.jpg', file: 'c661f4e6bd86f8af5309890e20c631c5.jpg' },
  { slug: 'no-sandbox-projects-how-i-shipped-a-production-ready-app-in-16-weeks', url: 'https://www.jway.com/hubfs/ee6b9a6bfb317bb7bbc719f2b15b5359.jpg', file: 'ee6b9a6bfb317bb7bbc719f2b15b5359.jpg' },
  { slug: 'our-commitment-to-optimizely-and-what-it-means-for-you', url: 'https://www.jway.com/hubfs/1-2.png', file: '1-2.png' },
  { slug: 'why-early-year-decisions-shape-hiring-success-more-than-q4-budgets', url: 'https://www.jway.com/hubfs/b6e6051f531e32d1f060e423d38c0173.jpg', file: 'b6e6051f531e32d1f060e423d38c0173.jpg' },
  { slug: 'beyond-the-buzzwords-the-hard-lessons-of-2025-that-will-dictate-your-2026-strategy', url: 'https://www.jway.com/hubfs/fee20e3574a0d164c77a1166db0a0714.jpg', file: 'fee20e3574a0d164c77a1166db0a0714.jpg' },
  { slug: 'our-journey-publishing-4j-hub-on-the-app-store-challenges-rejections-and-lessons-learned', url: 'https://www.jway.com/hubfs/unnamed%20%282%29-3.png', file: 'unnamed-2-3.png' },
  { slug: 'getting-started-with-n8n-in-under-10-minutes', url: 'https://www.jway.com/hubfs/unnamed%20%282%29-2.png', file: 'unnamed-2-2.png' },
  { slug: 'smart-staffing-the-foundation-of-a-strong-team', url: 'https://www.jway.com/hubfs/ba369a176b8563c642da6d91015e14e3.jpg', file: 'ba369a176b8563c642da6d91015e14e3.jpg' }
];

const publicBlogDir = 'C:\\Localhost\\jway-site\\public\\blog';
const deployBlogDir = 'F:\\Work\\Repositories\\jway-site\\public\\blog';

if (!fs.existsSync(publicBlogDir)) fs.mkdirSync(publicBlogDir, { recursive: true });
if (!fs.existsSync(deployBlogDir)) fs.mkdirSync(deployBlogDir, { recursive: true });

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { rejectUnauthorized: false }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, { rejectUnauthorized: false }, (redirectRes) => {
          redirectRes.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', (err) => fs.unlink(dest, () => reject(err)));
      } else {
        response.pipe(file);
        file.on('finish', () => file.close(resolve));
      }
    }).on('error', (err) => fs.unlink(dest, () => reject(err)));
  });
}

async function run() {
  for (const item of imageMap) {
    const localDest = path.join(publicBlogDir, item.file);
    const deployDest = path.join(deployBlogDir, item.file);

    console.log(`Downloading ${item.file}...`);
    try {
      await downloadFile(item.url, localDest);
      fs.copyFileSync(localDest, deployDest);
      console.log(`  ✅ Downloaded & copied: ${item.file}`);
    } catch (err) {
      console.error(`  ❌ Failed: ${item.file}`, err);
    }
  }
}

run();
