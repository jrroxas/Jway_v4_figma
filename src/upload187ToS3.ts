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
const localFilePath = 'c:\\Localhost\\jway-site\\public\\blog\\187_compressed.jpg';

async function run() {
  console.log('☁️ Uploading 187_compressed.jpg to S3 (both keys)...\n');

  if (!fs.existsSync(localFilePath)) {
    console.error('❌ Local file not found!');
    process.exit(1);
  }

  const fileContent = fs.readFileSync(localFilePath);

  const keysToUpload = [
    'jway-ai-content/blog/187_compressed.jpg',
    'jway-ai-content/blog/187 compressed.jpg',
    'jway-ai-content/blog/187%20compressed.jpg',
  ];

  for (const key of keysToUpload) {
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: fileContent,
          ContentType: 'image/jpeg',
        })
      );
      console.log(`  ✅ Successfully uploaded to S3: s3://${bucketName}/${key}`);
    } catch (e: any) {
      console.error(`  ❌ Error uploading ${key}:`, e.message || e);
    }
  }

  console.log('\n🎉 S3 Upload for 187_compressed.jpg finished!');
  process.exit(0);
}

run();
