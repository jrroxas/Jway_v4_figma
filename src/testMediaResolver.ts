import { getMediaUrl } from './utils/media';

console.log('Testing getMediaUrl in NODE_ENV=development:\n');
console.log('Test 1:', getMediaUrl('https://jway-ai-content.s3.us-west-1.amazonaws.com/jway-ai-content/blog/187_compressed.jpg'));
console.log('Test 2:', getMediaUrl('/blog/187_compressed.jpg'));
console.log('Test 3:', getMediaUrl('/blog/header.png'));
console.log('Test 4:', getMediaUrl('/omnicell-logo.png'));
