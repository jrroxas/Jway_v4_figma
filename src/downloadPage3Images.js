import fs from 'fs';
import path from 'path';
import https from 'https';

const imageMap = [
  { url: 'https://www.jway.com/hubfs/hero%20jul%209.png', file: 'hero-jul-9.png' },
  { url: 'https://www.jway.com/hubfs/banner-staffing.png', file: 'banner-staffing.png' },
  { url: 'https://www.jway.com/hubfs/reflectLogo.png', file: 'reflectLogo.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/unnamed-18.png', file: 'unnamed-18.png' },
  { url: 'https://www.jway.com/hubfs/JWay-Techtalk-large.png', file: 'JWay-Techtalk-large.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/blog-1.png', file: 'blog-1.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/Blog1-2.jpg', file: 'Blog1-2.jpg' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/james-harrison-vpOeXr5wmR4-unsplash.jpg', file: 'james-harrison-vpOeXr5wmR4-unsplash.jpg' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/campaign-creators-3WNi-5s4LVg-unsplash-1.jpg', file: 'campaign-creators-3WNi-5s4LVg-unsplash-1.jpg' }
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
