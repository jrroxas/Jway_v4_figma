import https from 'https';
import fs from 'fs';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { rejectUnauthorized: false }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body }));
    }).on('error', err => reject(err));
  });
}

async function run() {
  console.log('🔍 Checking SEO Crawlability & Indexability for https://stg-ai.jway.com/ ...\n');

  // 1. Check robots.txt
  try {
    const robotsRes = await fetchUrl('https://stg-ai.jway.com/robots.txt');
    console.log('--- 1. ROBOTS.TXT (https://stg-ai.jway.com/robots.txt) ---');
    console.log(`Status Code: ${robotsRes.statusCode}`);
    console.log('Content:\n' + robotsRes.body.trim());
    console.log('--------------------------------------------------\n');
  } catch (e) {
    console.error('Failed to fetch robots.txt:', e.message);
  }

  // 2. Check Homepage HTML Meta Tags & Headers
  try {
    const homeRes = await fetchUrl('https://stg-ai.jway.com/');
    console.log('--- 2. HOMEPAGE HEADERS & META TAGS (https://stg-ai.jway.com/) ---');
    console.log(`Status Code: ${homeRes.statusCode}`);
    console.log(`X-Robots-Tag Header: ${homeRes.headers['x-robots-tag'] || 'None (Allowed)'}`);

    const metaRobotsMatch = homeRes.body.match(/<meta[^>]*name=["']robots["'][^>]*>/i);
    if (metaRobotsMatch) {
      console.log(`Meta Robots Tag Found: ${metaRobotsMatch[0]}`);
    } else {
      console.log('Meta Robots Tag: Not present (Defaults to index, follow)');
    }

    const titleMatch = homeRes.body.match(/<title>(.*?)<\/title>/i);
    console.log(`Page Title: ${titleMatch ? titleMatch[1] : 'Not found'}`);
    console.log('--------------------------------------------------\n');
  } catch (e) {
    console.error('Failed to fetch homepage:', e.message);
  }
}

run();
