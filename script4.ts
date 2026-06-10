import * as fs from 'fs';

const files = [
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SystemConfig/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Change table header text color
  content = content.replace(/hover:text-\[#022d41\]/g, 'hover:text-[#f91a47]');
  content = content.replace(/hover:bg-\[#022d41\]/g, 'hover:bg-[#f91a47]');
  
  // Replace old text-[#a3c2d2] in menus if it should emphasize red on hover.

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated hover colors in ${file}`);
});
