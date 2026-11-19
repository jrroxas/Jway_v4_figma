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
  console.log('🔍 Cross-checking all blog post images on S3 and CDN...\n');

  for (const art of articles) {
    console.log(`📌 Post: "${art.title}" (${art.slug})`);

    // Check cover image
    const rawCover = art.coverImageUrl;
    let s3Cover = rawCover;

    if (rawCover.includes('hs-sites.com')) {
      const filename = rawCover.split('/').pop()?.split('?')[0];
      s3Cover = getMediaUrl(`/blog/${filename}`);
    } else {
      s3Cover = getMediaUrl(rawCover);
    }

    const coverStatus = await checkUrl(s3Cover);
    console.log(`   Cover: [${coverStatus}] ${s3Cover}`);

    // Extract all img src from contentHtml
    const imgMatches = [...art.contentHtml.matchAll(/src=["']([^"']+)["']/gi)];
    for (const match of imgMatches) {
      const rawSrc = match[1];
      let s3Src = rawSrc;
      if (rawSrc.includes('hs-sites.com')) {
        const filename = rawSrc.split('/').pop()?.split('?')[0];
        s3Src = getMediaUrl(`/blog/${filename}`);
      } else {
        s3Src = getMediaUrl(rawSrc);
      }

      const status = await checkUrl(s3Src);
      console.log(`   Content Img: [${status}] ${rawSrc.substring(0, 50)}... -> ${s3Src}`);
    }
    console.log('');
  }
}

run();
