import https from 'https';
import fs from 'fs';
import { getMediaUrl } from './utils/media';

const agent = new https.Agent({ rejectUnauthorized: false });

const articles = JSON.parse(
  fs.readFileSync('c:\\Localhost\\jway-site\\src\\allArticlesFullParsed.json', 'utf8')
);

async function checkUrl(url: string): Promise<number> {
  return new Promise((resolve) => {
    https
      .get(url, { agent }, (res) => {
        resolve(res.statusCode || 500);
      })
      .on('error', () => {
        resolve(500);
      });
  });
}

async function run() {
  console.log('🔍 Verifying all blog post S3 URLs...\n');

  let passed = 0;
  let total = 0;

  for (const art of articles) {
    // Check cover
    const s3Cover = getMediaUrl(art.coverImageUrl);
    total++;
    const status1 = await checkUrl(s3Cover);
    if (status1 === 200) passed++;
    console.log(`[${status1}] Cover: ${s3Cover}`);

    // Check content images
    const imgMatches = [...art.contentHtml.matchAll(/src=["']([^"']+)["']/gi)];
    for (const match of imgMatches) {
      const s3Src = getMediaUrl(match[1]);
      total++;
      const status2 = await checkUrl(s3Src);
      if (status2 === 200) passed++;
      console.log(`[${status2}] Content: ${s3Src}`);
    }
  }

  console.log(`\n📊 Verification Result: ${passed}/${total} S3 URLs returned 200 OK!`);
  process.exit(0);
}

run();
