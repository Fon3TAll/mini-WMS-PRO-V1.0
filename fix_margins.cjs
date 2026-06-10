const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/gap-4 mb-3/g, 'gap-4 mb-6');
    content = content.replace(/gap-4 shrink-0 mb-3/g, 'gap-4 shrink-0 mb-6');
    content = content.replace(/grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-[0-9]+/g, 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated layout margins for ${filePath}`);
    }
}

processDir('src/pages');
