import * as fs from 'fs';

const files = [
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SystemConfig/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Change specific icon colors to Dark Red (#CC0000)
  // For User Permissions
  content = content.replace(/<Icons\.ShieldCheck([^>]*)className="[^"]*text-\[#[0-9a-fA-F]+\][^"]*"([^>]*)>/g, '<Icons.ShieldCheck$1className="text-[#CC0000]"$2>');
  // Actually the class has other things sometimes? 
  // Let's just find exactly size={28} and size={24} icons for the header.
  if (file.includes('UserPermissions')) {
     content = content.replace(/Icons\.ShieldCheck size={28} strokeWidth={2.5} className="text-\[#022d41\]"/, 
        'Icons.ShieldCheck size={28} strokeWidth={2.5} className="text-[#CC0000]"');
  }
  if (file.includes('SystemConfig')) {
     content = content.replace(/Settings2 size={28} strokeWidth={2.5} className="text-\[#022d41\]"/, 
        'Settings2 size={28} strokeWidth={2.5} className="text-[#CC0000]"');
  }
  if (file.includes('DevPermit')) {
     content = content.replace(/Settings2 size={24} className="text-\[#022d41\]"/, 
        'Settings2 size={24} className="text-[#CC0000]"');
  }
  if (file.includes('SystemLogs')) {
     content = content.replace(/ShieldAlert size={24} className="text-\[#022d41\]"/, 
        'ShieldAlert size={24} className="text-[#CC0000]"');
  }

  fs.writeFileSync(file, content, 'utf8');
});
