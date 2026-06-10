import * as fs from 'fs';

const files = [
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SystemConfig/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Find buttons that have bg-[#022d41] and text-white and change background to red (#f91a47) to emphasize red tones
  content = content.replace(/bg-\[#022d41\] text-white(.*?)hover:bg-\[#214573\]/g, 'bg-[#f91a47] text-white$1hover:bg-[#ca649f]');
  
  // Specific Export Logs button in System Logs:
  content = content.replace(/from-\[#022d41\] to-\[#214573\] text-white/g, 'from-[#f91a47] to-[#ca649f] text-white');

  // Update tabs active state in User Permissions:
  // "activeTab === 'registry' ? 'bg-[#022d41] text-white shadow-md'" => 'bg-[#f91a47] text-white shadow-md'
  content = content.replace(/'bg-\[#022d41\] text-white shadow-md'/g, "'bg-[#f91a47] text-white shadow-md'");

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated red buttons in ${file}`);
});
