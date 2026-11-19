process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'us-west-1',
  credentials: {
    accessKeyId: 'AKIA6KMYBZCHZLXE6D72',
    secretAccessKey: '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',
  },
});

const bucketName = 'jway-ai-content';
const localDir = 'c:\\Localhost\\jway-site\\public\\blog';

async function run() {
  console.log('☁️ Uploading all images from public/blog to S3 using AWS S3 SDK...\n');
  const files = fs.readdirSync(localDir);

  for (const filename of files) {
    const filePath = path.join(localDir, filename);
    if (fs.statSync(filePath).isDirectory()) continue;

    const fileContent = fs.readFileSync(filePath);
    const key = `jway-ai-content/blog/${filename}`;

    const contentType = filename.endsWith('.png')
      ? 'image/png'
      : filename.endsWith('.webp')
      ? 'image/webp'
      : filename.endsWith('.gif')
      ? 'image/gif'
      : filename.endsWith('.svg')
      ? 'image/svg+xml'
      : 'image/jpeg';

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileContent,
          ContentType: contentType,
        })
      );
      console.log(`  ✅ Successfully uploaded to S3: s3://${bucketName}/${key}`);
    } catch (e: any) {
      console.error(`  ❌ Error uploading ${filename}:`, e.message || e);
    }
  }

  console.log('\n🎉 S3 Upload process completed successfully!');
  process.exit(0);
}

run();
