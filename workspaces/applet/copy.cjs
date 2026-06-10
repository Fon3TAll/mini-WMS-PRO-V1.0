const fs = require('fs');
console.log('Copying...');
fs.cpSync('./temp_repo', '.', {recursive: true, force: true, filter: (src) => !src.includes('copy.cjs')});
console.log('Done!');
