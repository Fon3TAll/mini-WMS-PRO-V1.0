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
  content = content.replace(/className="bg-\[#022d41\] text-\[#af7a2b\] sticky/g, 'className="bg-[#022d41] text-white sticky');
  content = content.replace(/className="bg-\[#022d41\] text-white sticky/g, 'className="bg-[#022d41] text-white sticky');

  // Any remaining table header specific changes
  content = content.replace(/border-b-2 border-\[#af7a2b\] text-white/g, 'border-b-2 border-[#f91a47] text-white');

  // Change button colors that complain about readability
  // text-[#af7a2b] on bg-[#022d41] -> text-white
  content = content.replace(/bg-\[#022d41\] text-\[#af7a2b\]/g, 'bg-[#022d41] text-white');
  
  // Also change the gradient button in System Logs: EXPORT LOGS
  content = content.replace(/from-\[#022d41\] to-\[#214573\] text-\[#af7a2b\]/g, 'from-[#022d41] to-[#214573] text-white');
  
  // Specific fix for User Permissions - Global Registry
  // The tab colors:
  // "registry" active: 'bg-[#af7a2b] text-[#022d41] shadow-md'
  // "staff" active: 'bg-[#022d41] text-[#af7a2b] shadow-md'
  // Replace to make them identical style but readable, emphasizing Red
  let registryOld = "bg-[#af7a2b] text-[#022d41] shadow-md";
  let registryNew = "bg-[#022d41] text-white shadow-md";
  content = content.replace(registryOld, registryNew);
  
  let staffOld = "bg-[#022d41] text-[#af7a2b] shadow-md";
  let staffNew = "bg-[#022d41] text-white shadow-md";
  content = content.replace(staffOld, staffNew);
  
  // To emphasize red tones, let's change some button backgrounds to Red #f91a47
  // Global Registry / Staff Access Active state:
  // Since user said "use the same color as Staff Access", maybe I should just make both bg-[#022d41] text-white as I just did.

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
