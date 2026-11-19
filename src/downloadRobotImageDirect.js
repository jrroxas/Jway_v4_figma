import fs from 'fs';
import https from 'https';

const urls = [
  'https://www.jway.com/hubfs/images/homepage/find-talent.jpg',
  'https://jway-20137624.hs-sites.com/hubfs/images/homepage/find-talent.jpg',
  'https://jway-20137624.hs-sites.com/hs-fs/hubfs/images/homepage/find-talent.jpg?width=1000&name=find-talent.jpg'
];

function fetchWithRedirect(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      console.log(`URL: ${url} -> Status: ${res.statusCode}`);
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        fetchWithRedirect(redirectUrl, dest).then(resolve).catch(reject);
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

async function testAll() {
  for (let i = 0; i < urls.length; i++) {
    const dest = `C:\\Localhost\\jway-site\\public\\test-hero-${i}.jpg`;
    const success = await fetchWithRedirect(urls[i], dest);
    if (success) {
      const stat = fs.statSync(dest);
      console.log(`Success ${i}: size = ${stat.size} bytes`);
      if (stat.size > 20000) {
        fs.copyFileSync(dest, 'C:\\Localhost\\jway-site\\public\\coming-soon-hero.jpg');
        fs.copyFileSync(dest, 'F:\\Work\\Repositories\\jway-site\\public\\coming-soon-hero.jpg');
        console.log('✅ Updated coming-soon-hero.jpg in both repos!');
        break;
      }
    }
  }
}

testAll();
