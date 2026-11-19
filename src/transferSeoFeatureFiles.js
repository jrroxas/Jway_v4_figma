import fs from 'fs';
import path from 'path';

const filesToCopy = [
  { src: 'C:/Localhost/jway-site/src/globals/SeoSettings.ts', dest: 'F:/Work/Repositories/jway-site/src/globals/SeoSettings.ts' },
  { src: 'C:/Localhost/jway-site/src/app/robots.txt/route.ts', dest: 'F:/Work/Repositories/jway-site/src/app/robots.txt/route.ts' },
  { src: 'C:/Localhost/jway-site/src/payload.config.ts', dest: 'F:/Work/Repositories/jway-site/src/payload.config.ts' }
];

console.log('🚀 Transferring SEO / Robots.txt feature files to deployment repo...');

for (const f of filesToCopy) {
  const destDir = path.dirname(f.dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(f.src, f.dest);
  console.log(`  ✅ Copied: ${path.relative('F:/Work/Repositories/jway-site', f.dest)}`);
}

// Remove static robots.txt and legacy robots.ts from deploy repo to prevent route conflicts
const deployPublicRobots = 'F:/Work/Repositories/jway-site/public/robots.txt';
if (fs.existsSync(deployPublicRobots)) {
  fs.unlinkSync(deployPublicRobots);
  console.log('  ✅ Deleted legacy public/robots.txt from deployment repo');
}

const deployRobotsTs = 'F:/Work/Repositories/jway-site/src/app/robots.ts';
if (fs.existsSync(deployRobotsTs)) {
  fs.unlinkSync(deployRobotsTs);
  console.log('  ✅ Deleted legacy src/app/robots.ts from deployment repo');
}

console.log('✨ All SEO feature files successfully transferred un-staged!');
