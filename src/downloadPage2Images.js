import fs from 'fs';
import path from 'path';
import https from 'https';

const imageMap = [
  { url: 'https://www.jway.com/hubfs/Hero_WebDesignTheory09-04.png', file: 'Hero_WebDesignTheory09-04.png' },
  { url: 'https://www.jway.com/hubfs/Hero_ColorTheory09-03.png', file: 'Hero_ColorTheory09-03.png' },
  { url: 'https://www.jway.com/hubfs/Hero_webconsultant08-27.png', file: 'Hero_webconsultant08-27.png' },
  { url: 'https://www.jway.com/hubfs/Hero_VideoEditing08-22%20%281%29.png', file: 'Hero_VideoEditing08-22-1.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Cybersecurity08-19%20%282%29.png', file: 'Hero_Cybersecurity08-19-2.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Instagram.png', file: 'Hero_Instagram.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Kenya08-02.png', file: 'Hero_Kenya08-02.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Enterprise0726.png', file: 'Hero_Enterprise0726.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Staffing0723.png', file: 'Hero_Staffing0723.png' },
  { url: 'https://www.jway.com/hubfs/Hero_Mobile0718.png', file: 'Hero_Mobile0718.png' }
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
