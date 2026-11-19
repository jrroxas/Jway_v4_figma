import fs from 'fs';
import https from 'https';

const heroUrl = 'https://jway-20137624.hs-sites.com/hs-fs/hubfs/images/homepage/find-talent.jpg?width=1300&name=find-talent.jpg';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://jway-20137624.hs-sites.com/coming-soon'
  },
  rejectUnauthorized: false
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, options, (res) => {
      console.log('Status code:', res.statusCode);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        download(res.headers.location, dest).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve(true)));
      } else {
        resolve(false);
      }
    }).on('error', err => reject(err));
  });
}

async function run() {
  const localDest = 'C:\\Localhost\\jway-site\\public\\coming-soon-hero.jpg';
  const deployDest = 'F:\\Work\\Repositories\\jway-site\\public\\coming-soon-hero.jpg';

  const ok = await download(heroUrl, localDest);
  if (ok) {
    const stat = fs.statSync(localDest);
    console.log('Downloaded size:', stat.size, 'bytes');
    if (stat.size > 20000) {
      fs.copyFileSync(localDest, deployDest);
      console.log('✅ Downloaded and copied coming-soon-hero.jpg successfully!');
    }
  }
}

run();
