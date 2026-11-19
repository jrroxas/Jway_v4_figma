import fs from 'fs';

const articles = JSON.parse(fs.readFileSync('C:\\Localhost\\jway-site\\src\\pages4And5Extracted.json', 'utf8'));

console.log(JSON.stringify(articles, null, 2));
