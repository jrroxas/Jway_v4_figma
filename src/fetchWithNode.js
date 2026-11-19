import https from 'https';
import fs from 'fs';

const url = 'https://jway-20137624.hs-sites.com/hubfs/Imported_Blog_Media/187_compressed.jpg';
const dest = 'c:\\Localhost\\jway-site\\public\\blog\\187_compressed.jpg';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'image',
    'Sec-Fetch-Mode': 'no-cors',
    'Sec-Fetch-Site': 'cross-site',
    'Referer': 'https://jway-20137624.hs-sites.com/',
  },
  rejectUnauthorized: false
};

https.get(url, options, (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);

  if (res.statusCode === 301 || res.statusCode === 302) {
    console.log('Redirecting to:', res.headers.location);
    return;
  }

  const chunks = [];
  res.on('data', (chunk) => chunks.push(chunk));
  res.on('end', () => {
    const buffer = Buffer.concat(chunks);
    fs.writeFileSync(dest, buffer);
    console.log(`Saved ${buffer.length} bytes to ${dest}`);
    console.log('First 20 bytes:', buffer.slice(0, 20).toString('hex'));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
