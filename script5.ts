import * as fs from 'fs';

const files = [
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SystemConfig/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Change hover:text-[#af7a2b] on red hover bg to hover:text-white
  content = content.replace(/hover:bg-\[#f91a47\] hover:text-\[#af7a2b\]/g, 'hover:bg-[#f91a47] hover:text-white');
  
  // DevPermit action button save: it was bg-gradient-to-r from-[#022d41] to-[#214573] hover:scale-105 text-[#af7a2b]
  content = content.replace(/from-\[#022d41\] to-\[#214573\] hover:scale-105 text-\[#af7a2b\]/g, 'from-[#f91a47] to-[#ca649f] hover:scale-105 text-white');

  fs.writeFileSync(file, content, 'utf8');
});
