import fs from 'fs';
import path from 'path';
import https from 'https';

const heroUrl = 'https://jway-20137624.hs-sites.com/hs-fs/hubfs/images/homepage/find-talent.jpg?width=1300&height=796&name=find-talent.jpg';

const localDest = 'C:\\Localhost\\jway-site\\public\\coming-soon-hero.jpg';
const deployDest = 'F:\\Work\\Repositories\\jway-site\\public\\coming-soon-hero.jpg';

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { rejectUnauthorized: false }, (response) => {
      response.pipe(file);
      file.on('finish', () => file.close(resolve));
    }).on('error', (err) => fs.unlink(dest, () => reject(err)));
  });
}

async function run() {
  console.log('Downloading coming soon hero image...');
  await download(heroUrl, localDest);
  fs.copyFileSync(localDest, deployDest);
  console.log('✅ Downloaded and copied coming-soon-hero.jpg successfully!');
}

run();
