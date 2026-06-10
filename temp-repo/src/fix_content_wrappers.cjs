const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('src/pages', { recursive: true })
  .filter(f => f.endsWith('.tsx'))
  .map(f => path.join('src/pages', f));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  content = content.replace(/(class|className)="([^"]*?mt-\[?(2px|2|3|4)\]?[^"]*?pb-[68][^"]*?)"/g, (match, prefix, classStr) => {
     if (classStr.includes('max-w-[1532px]')) return match;
     classStr = classStr.replace(/max-w-\[1500px\]/g, '');
     classStr = classStr.replace(/px-8/g, '');
     classStr = classStr.replace(/w-full/g, '');
     classStr = classStr.replace(/\s+/g, ' ').trim();
     return `${prefix}="max-w-[1532px] mx-auto px-4 sm:px-8 w-full ${classStr}"`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated wrapper for ${file}`);
  }
});
