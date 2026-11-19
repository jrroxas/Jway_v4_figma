import https from 'https';
import { getMediaUrl } from './utils/media';

const urlsToTest = [
  '/blog/header.png',
  '/blog/1-4.png',
  '/blog/Gemini_Generated_Image_qw6peeqw6peeqw6p.png',
  '/blog/c661f4e6bd86f8af5309890e20c631c5.jpg',
  'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/online-store.jpg',
  'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/customer-relationship.jpg',
  'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg',
  'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/Untitled-design-18.png',
];

const agent = new https.Agent({ rejectUnauthorized: false });

async function checkUrl(urlPath: string) {
  const fullUrl = getMediaUrl(urlPath);
  return new Promise((resolve) => {
    https
      .get(fullUrl, { agent }, (res) => {
        console.log(`[${res.statusCode}] ${urlPath} -> ${fullUrl}`);
        resolve(res.statusCode);
      })
      .on('error', (err) => {
        console.log(`[ERR] ${urlPath} -> ${err.message}`);
        resolve(500);
      });
  });
}

async function run() {
  console.log('Testing image URLs with agent...\n');
  for (const url of urlsToTest) {
    await checkUrl(url);
  }
}

run();
