import * as fs from 'fs';

const files = [
  'src/pages/UserPermissions/index.tsx',
  'src/pages/SystemConfig/index.tsx',
  'src/pages/DevPermit/index.tsx',
  'src/pages/SystemLogs/index.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Revert red buttons back to navy blue
  content = content.replace(/bg-\[#f91a47\]/g, 'bg-[#022d41]');
  content = content.replace(/hover:bg-\[#ca649f\]/g, 'hover:bg-[#214573]');
  content = content.replace(/from-\[#f91a47\] to-\[#ca649f\]/g, 'from-[#022d41] to-[#214573]');

  // Ensure button text on navy bg is white instead of #af7a2b or blue
  // (We did this in script2 but just in case)
  content = content.replace(/bg-\[#022d41\] text-\[#af7a2b\]/g, 'bg-[#022d41] text-white');

  // 2. Change title gradient 
  // UserPermissions / SystemConfig
  content = content.replace(/from-\[#1aa6b7\] to-\[#af7a2b\]/g, 'from-[#8B0000] to-[#FFD700]');
  // DevPermit / SystemLogs
  content = content.replace(/from-\[#1aa6b7\] to-\[#5f7ab7\]/g, 'from-[#8B0000] to-[#FFD700]');

  // 3. User Guide Tab - standardize to light background and cherry red on hover
  // First, let's remove any existing User Guide button definitions and reconstruct it carefully.
  // We'll regex match the entire button...
  const guideBtnRegex = /<button[^>]*onClick={\(\) => setIsGuideOpen\(true\)}[^>]*>[\s\S]*?<\/button>/;
  const guideBtnReplacement = `<button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[220px] -translate-y-1/2 bg-[#f8f9fa] border border-[#daecf3] border-r-0 text-[#022d41] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#D2042D] hover:text-white hover:border-[#D2042D] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#a3c2d2] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>`;
  
  // Note: some files use <Icons.HelpCircle> and some use <HelpCircle>. Let's adapt based on the file.
  if (file.includes('UserPermissions')) {
    content = content.replace(guideBtnRegex, guideBtnReplacement);
  } else {
    const noIconsPrefix = guideBtnReplacement.replace(/Icons\./g, '');
    content = content.replace(guideBtnRegex, noIconsPrefix);
  }

  // 4. Page icons to "Dark Red Adobe" == #CC0000
  // UserPermissions
  if (file.includes('UserPermissions')) {
    content = content.replace(/<Icons\.ShieldCheck size={28}([^>]+)text-\[#022d41\]/g, '<Icons.ShieldCheck size={28}$1text-[#CC0000]');
  }
  if (file.includes('SystemConfig')) {
    content = content.replace(/<Settings2 size={28}([^>]+)text-\[#022d41\]/g, '<Settings2 size={28}$1text-[#CC0000]');
  }
  if (file.includes('DevPermit')) {
    content = content.replace(/<Settings2 size={24}([^>]+)text-\[#022d41\]/g, '<Settings2 size={24}$1text-[#CC0000]');
  }
  if (file.includes('SystemLogs')) {
    content = content.replace(/<ShieldAlert size={24}([^>]+)text-\[#022d41\]/g, '<ShieldAlert size={24}$1text-[#CC0000]');
  }

  // 5. Ensure table header borders and text are readable. White text, #af7a2b (or white) border.
  content = content.replace(/border-\[#f91a47\]/g, 'border-[#af7a2b]');

  // 6. Fix "Global Registry" and "Staff Access" tab colors.
  // "สีปุ่ม Global Registry ไม่เอาสีนี้ ให้ใช้สีเดียวกับ Staff Access -- แต่สีฟอนต์ ไม่เอาสีน้ำ อ่านยาก"
  // Let's ensure active tab has bg-[#022d41] text-white. Inactive has text-[#a3c2d2] hover:text-[#022d41].
  // We already replaced bg-[#f91a47] with bg-[#022d41]. So active tabs will automatically become navy blue.
  // Let's make sure the font is text-white when active. It should already be because of earlier replacement.

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});
