import fs from 'fs';
import path from 'path';
import https from 'https';

const imageMap = [
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/Success-Story-UAS.png', file: 'Success-Story-UAS.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/image-hero1.png', file: 'image-hero1.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/image-hero-3.png', file: 'image-hero-3.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/image-hero-9.png', file: 'image-hero-9.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/image-hero-4.png', file: 'image-hero-4.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/image-hero-7.png', file: 'image-hero-7.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/201.png', file: '201.png' },
  { url: 'https://www.jway.com/hubfs/Hero_WebDesignColor09-11.png', file: 'Hero_WebDesignColor09-11.png' },
  { url: 'https://www.jway.com/hubfs/Imported_Blog_Media/alejandro-escamilla-1-unsplash.jpg', file: 'alejandro-escamilla-1-unsplash.jpg' },
  { url: 'https://www.jway.com/hubfs/Hero_09-13.png', file: 'Hero_09-13.png' }
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
