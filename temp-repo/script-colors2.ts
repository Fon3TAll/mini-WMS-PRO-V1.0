import * as fs from 'fs';
const file = 'src/pages/Calendar/index.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/#e8dcc8/g, '#eaeaec');
content = content.replace(/#D2042D/g, '#d96245');
content = content.replace(/#ff929a/g, '#d96245');

fs.writeFileSync(file, content, 'utf8');
