import * as fs from 'fs';

const file = 'src/pages/Calendar/index.tsx';
let content = fs.readFileSync(file, 'utf8');

// Title 
content = content.replace(
  'SALE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B0000] to-[#FFD700]">CALENDAR</span> HUB',
  'HR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CALENDAR</span> HUB'
);

content = content.replace(
  'SALE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f91a47] to-[#af7a2b]">CALENDAR</span> HUB',
  'HR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CALENDAR</span> HUB'
);

// Generic replacements for overall colors
content = content.replace(/#022d41/g, '#212c46');
content = content.replace(/#1f2a44/g, '#212c46');

content = content.replace(/#a3c2d2/g, '#7a8b95');
content = content.replace(/#398797/g, '#4d87a8');
content = content.replace(/#1aa6b7/g, '#3f809e');
content = content.replace(/#f91a47/g, '#932c2e');
content = content.replace(/#fe424d/g, '#d96245');

content = content.replace(/#daecf3/g, '#eaeaec');
content = content.replace(/#cdd0db/g, '#eaeaec');
content = content.replace(/#e7dedd/g, '#d7d7d7');

content = content.replace(/#D4AF37/g, '#b58c4f');
content = content.replace(/#c6a75e/g, '#b7a159');

content = content.replace(/bg-\[#CC0000\]/g, 'bg-[#3f809e]');
content = content.replace(/border-\[#CC0000\]\/40/g, 'border-[#3f809e]/40');
content = content.replace(/text-\[#CC0000\]/g, 'text-[#3f809e]');

fs.writeFileSync(file, content, 'utf8');
