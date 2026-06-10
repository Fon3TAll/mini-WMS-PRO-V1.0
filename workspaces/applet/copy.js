const fs = require('fs');
console.log('Copying...');
fs.cpSync('./temp_repo', '.', {recursive: true, force: true});
console.log('Done!');
