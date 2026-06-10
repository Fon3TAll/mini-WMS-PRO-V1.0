import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Synced with System/Home Palette) ---
const THEME = {
  bgMain: '#f3f3f1',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  silver: '#d7d7d7',
  deepNavy: '#212c46',
  brownGold: '#b58c4f',
  vibrantPurple: '#2d2c4a',
  burntOrange: '#d96245',
  slateBlue: '#748ea1',
  coolGray: '#eaeaec'
};

const kebabToPascal = (str: string) => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');

const LucideIcon = ({ name, size = 16, className = "", color, style, strokeWidth = 2.5 }: any) => {
    if (!name) return null;
    if (typeof name !== 'string') {
        const IconComponent = name;
        return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
    }
    const pascalName = kebabToPascal(name);
    const IconComponent = (Icons as any)[pascalName] || Icons.HelpCircle;
    return <IconComponent size={size} className={className} style={{...style, color: color}} strokeWidth={strokeWidth} />;
};

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);

// --- KPI Card Components ---
// KPI Card ปรับ padding ให้กระชับ -- ลีน แต่ยังคงความสวยเหมือนเดิม
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-3 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[180px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[90px] min-h-[90px] flex flex-col justify-between animate-fadeIn text-left">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={80} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm leading-none mt-1">{label}</p>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={16} />
            </div>
        </div>
        <div className="relative z-10 flex items-end justify-between">
            <p className="text-[18px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status, usage = 0 }: { status: string, usage?: number }) => {
  if (usage >= 100) return (
     <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30">
      <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div> FULL
    </span>
  );
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Active': style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; break;
    case 'Maintenance': style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; break;
    case 'Blocked': style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; break;
    case 'Reserved': style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div> {status}
    </span>
  );
};

// user guide ปรับ padding ให้กระชับ -- ลีน สวย, แต่เน้นความละเอียดเหมือน UserPermissions
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[14px]"><Icons.Map size={18} className="text-[#b7a159]"/> LOCATION MAP GUIDE</h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-0.5">Warehouse Layout Management</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.ShieldAlert size={16} className="text-[#b7a159]"/> 1. Location Identification
            </h4>
            <p className="text-[11px] mb-2">การระบุตำแหน่งจัดเก็บ (Location ID) จะต้องกำหนดให้สัมพันธ์กับโครงสร้างจริงในคลัง:</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#eaeaec]">
                  <Icons.MapPin size={14} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8]">Format:</strong> ระบบกำหนดเป็น Zone-Rack-Level-Pos (เช่น A-01-1-01) เพื่อช่วยให้ผู้ปฏิบัติงานค้นหาได้ง่ายขึ้น</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2.5 rounded-xl border border-[#932c2e]/30">
                  <Icons.Lock size={14} className="shrink-0 text-[#932c2e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#932c2e]">Unique ID:</strong> ตำแหน่ง (Location) จะต้องไม่ซ้ำกันในคลังเดียวกันโดยเด็ดขาด</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Layers size={16} className="text-[#d96245]"/> 2. Zone Classifications
            </h4>
            <p className="text-[11px] mb-2">โซนแต่ละประเภทจะกำหนดระดับการเข้าถึงและการจัดเก็บผลิตภัณฑ์ของคุณสมบัติที่แตกต่างกัน:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
                <li><strong className="text-[#657f4d]">Ambient:</strong> สำหรับผลิตภัณฑ์ทั่วไป เก็บรักษาอุณหภูมิห้อง</li>
                <li><strong className="text-[#3f809e]">Cold Room / Frozen:</strong> โซนควบคุมอุณหภูมิต่ำสำหรับของสดหรือมีอายุสั้น</li>
                <li><strong className="text-[#a94228]">Hazardous:</strong> พื้นที่อันตราย จำกัดสิทธิ์การจัดเก็บเฉพาะผลิตภัณฑ์ที่ระบุความปลอดภัยเท่านั้น</li>
                <li><strong className="text-[#b58c4f]">Quarantine:</strong> พื้นที่กักกันสินค้า รอการตรวจสอบคุณภาพก่อนนำเข้า Stock ปกติ</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Activity size={16} className="text-[#3f809e]"/> 3. Usage & Status Control
            </h4>
            <p className="text-[11px] leading-relaxed">
              สเตตัสอัปเดตแบบเรียลไทม์: <b>Active</b> พร้อมใช้งานรับ/จ่าย, <b>Reserved</b> ถูกจองล่วงหน้าเพื่อ Putaway, <b>Maintenance</b> ปิดปรับปรุงห้ามนำเข้า และ <b>Blocked</b> สั่งล็อกโดย Auditor <br/>
              ระบบจำกัดความจุ (Capacity Limit) หาก <b>Usage = 100% (FULL)</b> จะไม่อนุญาตให้นำเข้าเพิ่มเติมในตำแหน่งนี้
            </p>
          </section>
        </div>
        
        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white font-black rounded-xl uppercase text-[11px] hover:bg-[#414757] transition-all shadow-sm tracking-[0.1em]">Got It</button>
        </div>
      </div>
    </>, document.body
  );
}

function EditLocationModal({ isOpen, onClose, locData, onSave }: any) {
    const [tempData, setTempData] = useState<any>({});

    useEffect(() => {
        if (isOpen && locData) {
            setTempData(JSON.parse(JSON.stringify(locData)));
        }
    }, [isOpen, locData]);

    if (!isOpen || !locData || !tempData) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[750px]"
            customHeader={
                <div className="bg-[#212c46] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
                            <Icons.MapPin size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{tempData.locationId || 'NEW LOCATION'}</h3>
                            <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 text-left">{tempData.zoneType ? `ZONE: ${tempData.zoneType}` : 'LOCATION SETUP'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"><Icons.X size={16} /></button>
                </div>
            }
        >
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-[#f8f9fa] text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Primary Info */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4 col-span-1 md:col-span-2">
                        <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2"><Icons.Info size={14} className="text-[#3f809e]"/> Location Identity</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Location ID</label>
                                <input type="text" value={tempData.locationId || ''} onChange={e => setTempData({...tempData, locationId: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] uppercase" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Zone Type</label>
                                <select value={tempData.zoneType || 'Ambient'} onChange={e => setTempData({...tempData, zoneType: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]">
                                    <option value="Ambient">Ambient</option>
                                    <option value="Cold Room">Cold Room</option>
                                    <option value="Frozen">Frozen</option>
                                    <option value="Hazardous">Hazardous</option>
                                    <option value="Quarantine">Quarantine</option>
                                    <option value="Bonded">Bonded (Customs)</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Status</label>
                                <select value={tempData.status || 'Active'} onChange={e => setTempData({...tempData, status: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]">
                                    <option value="Active">Active</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Blocked">Blocked</option>
                                    <option value="Reserved">Reserved</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Coordinates */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4">
                        <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2"><Icons.Layers size={14} className="text-[#a94228]"/> Physical Coordinates</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Rack</label>
                                    <input type="text" value={tempData.rack || ''} onChange={e => setTempData({...tempData, rack: e.target.value})} placeholder="e.g. A01" className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] uppercase" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Level (ชั้น)</label>
                                    <input type="number" min="1" value={tempData.level || 1} onChange={e => setTempData({...tempData, level: parseInt(e.target.value) || 1})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Position</label>
                                    <input type="number" min="1" value={tempData.position || 1} onChange={e => setTempData({...tempData, position: parseInt(e.target.value) || 1})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Capacity */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4">
                        <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2"><Icons.Scale size={14} className="text-[#3f809e]"/> Storage Limits</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Max Weight Cap. (Kg)</label>
                                <input type="number" step="0.1" value={tempData.capacity || 0} onChange={e => setTempData({...tempData, capacity: parseFloat(e.target.value)})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Max Vol (CBM)</label>
                                <input type="number" step="0.01" value={tempData.volumeCap || 0} onChange={e => setTempData({...tempData, volumeCap: parseFloat(e.target.value)})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono" />
                            </div>
                            <div className="space-y-1.5 col-span-2">
                                <label className="relative inline-flex items-center cursor-pointer group">
                                    <input type="checkbox" checked={tempData.allowMixedSKU || false} onChange={e => setTempData({...tempData, allowMixedSKU: e.target.checked})} className="sr-only peer" />
                                    <div className="w-10 h-5 bg-[#eaeaec] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3f809e] group-hover:after:shadow-md"></div>
                                    <span className="ml-3 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Allow Mixed SKUs (เก็บรวมสินค้าได้)</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-white border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 rounded-b-3xl">
                <button onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1] transition-all shadow-sm">Cancel</button>
                <button onClick={()=>{onSave(tempData); onClose();}} className="bg-[#212c46] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2"><Icons.Save size={14}/> Save Location</button>
            </div>
        </DraggableModal>
    );
}

export default function LocationMap() {
  const [activeTab, setActiveTab] = useState('map'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  
  const [editModal, setEditModal] = useState<any>({ isOpen: false, locData: null });

  // 100% Exact original mock examples preserved perfectly & expanded
  const [locationList, setLocationList] = useState<any[]>([
    { id: 1, locationId: 'A-01-1-01', zoneType: 'Ambient', rack: 'A01', level: 1, position: 1, capacity: 1200, volumeCap: 2.5, currentUsage: 85, status: 'Active', allowMixedSKU: false },
    { id: 2, locationId: 'A-01-1-02', zoneType: 'Ambient', rack: 'A01', level: 1, position: 2, capacity: 1200, volumeCap: 2.5, currentUsage: 100, status: 'Active', allowMixedSKU: false },
    { id: 3, locationId: 'B-02-2-05', zoneType: 'Cold Room', rack: 'B02', level: 2, position: 5, capacity: 800, volumeCap: 1.5, currentUsage: 40, status: 'Active', allowMixedSKU: true },
    { id: 4, locationId: 'C-05-1-10', zoneType: 'Hazardous', rack: 'C05', level: 1, position: 10, capacity: 1500, volumeCap: 3.0, currentUsage: 0, status: 'Maintenance', allowMixedSKU: false },
    { id: 5, locationId: 'Z-99-1-01', zoneType: 'Quarantine', rack: 'Z99', level: 1, position: 1, capacity: 2000, volumeCap: 5.0, currentUsage: 15, status: 'Active', allowMixedSKU: true },
    { id: 6, locationId: 'A-01-2-01', zoneType: 'Ambient', rack: 'A01', level: 2, position: 1, capacity: 1000, volumeCap: 2.5, currentUsage: 0, status: 'Reserved', allowMixedSKU: false },
    { id: 7, locationId: 'F-01-1-01', zoneType: 'Frozen', rack: 'F01', level: 1, position: 1, capacity: 1000, volumeCap: 2.0, currentUsage: 90, status: 'Active', allowMixedSKU: false },
    { id: 8, locationId: 'A-10-3-02', zoneType: 'Ambient', rack: 'A10', level: 3, position: 2, capacity: 800, volumeCap: 2.5, currentUsage: 100, status: 'Blocked', allowMixedSKU: true },
    { id: 9, locationId: 'C-08-1-01', zoneType: 'Bonded', rack: 'C08', level: 1, position: 1, capacity: 1500, volumeCap: 3.0, currentUsage: 50, status: 'Active', allowMixedSKU: false },
    { id: 10, locationId: 'B-05-2-10', zoneType: 'Cold Room', rack: 'B05', level: 2, position: 10, capacity: 800, volumeCap: 1.5, currentUsage: 25, status: 'Active', allowMixedSKU: true },
  ]);

  const filteredLocations = useMemo(() => {
    return locationList.filter(item => 
        item.locationId.toLowerCase().includes(search.toLowerCase()) || 
        item.zoneType.toLowerCase().includes(search.toLowerCase()) ||
        item.rack.toLowerCase().includes(search.toLowerCase())
    );
  }, [locationList, search]);

  const currentData = filteredLocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage) || 1;

  const handleSaveLocation = (savedItem: any) => {
    setLocationList(prev => {
      const exists = prev.find(p => p.id === savedItem.id);
      if (exists) {
        return prev.map(p => p.id === savedItem.id ? { ...p, ...savedItem } : p);
      } else {
        return [{ ...savedItem, id: Math.max(0, ...prev.map(i=>i.id)) + 1, currentUsage: 0 }, ...prev];
      }
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditLocationModal isOpen={editModal.isOpen} locData={editModal.locData} onClose={() => setEditModal({isOpen: false, locData: null})} onSave={handleSaveLocation} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5 text-left">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Map size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      LOCATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">MAP</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          จัดการผังคลังสินค้าและตำแหน่งจัดเก็บ
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('map')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'map' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Layers size={16} /> Grid Layout Mapping
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full mt-[-2px]">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Total Locations" value={locationList.length} icon="map-pin" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Registered Bins" />
                <KpiCard 
                    label="Available Bins" 
                    value={locationList.filter(i=>i.status==='Active' && i.currentUsage < 100).length} 
                    icon="check-circle" colorAccent={THEME.success} colorValue={THEME.primary} desc="Ready for Putaway" 
                />
                <KpiCard 
                    label="Full Bins (100%)" 
                    value={locationList.filter(i=> i.currentUsage >= 100).length} 
                    icon="alert-octagon" colorAccent={THEME.danger} colorValue={THEME.primary} desc="Max Capacity" 
                />
                <KpiCard 
                    label="Under Maintenance" 
                    value={locationList.filter(i=>i.status==='Maintenance' || i.status==='Blocked').length} 
                    icon="settings" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Offline Status" 
                />
            </div>

            <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn text-left">
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto text-[12px]">
                        <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1.5 rounded-xl text-[#7a8b95] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                            <Icons.Map size={14} className="text-[#3f809e]"/> SYSTEM STORAGE LOCATIONS
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search by Loc. ID, Zone, Rack..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                        <button 
                            onClick={() => setEditModal({isOpen: true, locData: { zoneType: 'Ambient', level: 1, position: 1, status: 'Active', capacity: 1000 }})} 
                            className="bg-[#212c46] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]"
                        >
                            <Icons.Plus size={14} /> Add Location
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                    <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                        <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                            <tr>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ตำแหน่งพิกัดชั้นวาง</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">โซนจัดเก็บ / ชนิดโซนย่อย</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ชั้น-ระดับ-ช่อง (Rack-Level-Pos)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำกัดน้ำหนัก/ปริมาตร (Kg / CBM)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">กลุ่มชนิดสินค้าจัดเก็บ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">สถานะ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                            {currentData.length > 0 ? currentData.map(item => (
                                <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                    <td className="py-2.5 px-4 font-mono font-black text-[#3f809e] text-[12px] text-left flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center shrink-0">
                                            <Icons.MapPin size={14} className="text-[#a94228]" />
                                        </div>
                                        <span className="text-[13px]">{item.locationId}</span>
                                    </td>
                                    <td className="py-2.5 px-4 text-left">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="bg-[#212c46]/10 text-[#212c46] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border border-[#212c46]/20">
                                                {item.zoneType}
                                            </span>
                                            {item.allowMixedSKU && <span className="text-[9px] font-bold text-[#b58c4f] uppercase tracking-widest">Mixed SKUs Allowed</span>}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="font-black text-[#212c46] text-[12px] uppercase">R: {item.rack}</span>
                                            <span className="text-[10px] font-bold text-[#7a8b95] font-mono">L:{item.level} | P:{item.position}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-right text-[12px] font-mono font-bold text-[#7a8b95]">
                                        <div className="flex flex-col items-end gap-1">
                                            <span>Cap: {formatNumber(item.capacity || 0)} Kg</span>
                                            <span className="text-[10px] text-[#4d87a8]">Vol: {item.volumeCap || '-'} CBM</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="w-full max-w-[120px] mx-auto flex flex-col items-center gap-1.5">
                                            <span className="font-black font-mono text-[11px] text-[#212c46]">{item.currentUsage}%</span>
                                            <div className="w-full h-1.5 bg-[#eaeaec] rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${item.currentUsage >= 100 ? 'bg-[#932c2e]' : item.currentUsage >= 80 ? 'bg-[#b58c4f]' : 'bg-[#657f4d]'}`} 
                                                    style={{ width: `${item.currentUsage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <StatusBadge status={item.status} usage={item.currentUsage} />
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex justify-center items-center gap-[1px]">
                                            <button 
                                                onClick={() => setEditModal({ isOpen: true, locData: item })} 
                                                className="w-8 h-8 rounded-md flex items-center justify-center text-[#7a8b95] hover:bg-[#eaeaec] hover:text-[#212c46] transition-all"
                                                title="Edit Location Settings"
                                            >
                                                <Icons.Edit size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                        No Location mapping match search constraints.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-3xl text-[12px]">
                    <div className="flex items-center gap-5 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Display Rows:</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                className="bg-white border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#212c46] cursor-pointer shadow-sm"
                            >
                                {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono text-black font-bold">Count: {filteredLocations.length}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1} 
                            className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white active:scale-90 shadow-sm'}`}
                        >
                            <Icons.ChevronLeft size={14}/>
                        </button>
                        <div className="bg-white text-[#212c46] px-4 py-1.5 rounded-md font-black text-[11px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                            Page {currentPage} / {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages} 
                            className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white active:scale-90 shadow-sm'}`}
                        >
                            <Icons.ChevronRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
