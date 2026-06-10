const fs = require('fs');

const fixFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/\\`/g, '`');
  fs.writeFileSync(filePath, content);
};

fixFile('src/pages/DocumentDistribution/Pending/index.tsx');
fixFile('src/pages/DocumentRequest/Form/index.tsx');
