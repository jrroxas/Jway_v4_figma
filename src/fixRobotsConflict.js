import fs from 'fs';

const localPublicRobots = 'C:/Localhost/jway-site/public/robots.txt';
const deployPublicRobots = 'F:/Work/Repositories/jway-site/public/robots.txt';

if (fs.existsSync(localPublicRobots)) {
  fs.unlinkSync(localPublicRobots);
  console.log('✅ Deleted local public/robots.txt to resolve Next.js conflicting public file error');
}

if (fs.existsSync(deployPublicRobots)) {
  fs.unlinkSync(deployPublicRobots);
  console.log('✅ Deleted deploy repo public/robots.txt');
}
