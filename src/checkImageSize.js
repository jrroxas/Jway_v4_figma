import fs from 'fs';

const localPath = 'C:\\Localhost\\jway-site\\public\\coming-soon-hero.jpg';
if (fs.existsSync(localPath)) {
  const stat = fs.statSync(localPath);
  console.log('File size of coming-soon-hero.jpg:', stat.size, 'bytes');
} else {
  console.log('File does NOT exist!');
}
