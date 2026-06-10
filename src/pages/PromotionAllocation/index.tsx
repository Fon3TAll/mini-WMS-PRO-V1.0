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

const ALLOCATION_LEVELS = [
  { level: 1, label: 'Manual Bound', color: THEME.skyBlue, bg: '#3f809e15', desc: 'ผูกข้อมูลสต๊อกโปรโมชั่นด้วยตนเอง' },
  { level: 2, label: 'Auto Trigger', color: THEME.accent, bg: '#a9422815', desc: 'จ่ายของแถมอัตโนมัติเมื่อสั่งซื้อ SKU ที่กำหนด' },
  { level: 3, label: 'VIP Priority', color: THEME.success, bg: '#657f4d15', desc: 'จัดสรรให้สิทธิ์ของแถมแด่ลูกค้าคนพิเศษก่อน' },
];

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

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH').format(val);

// --- Sub-components ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-5 py-5 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[110px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={110} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={20} />
            </div>
        </div>
        <div className="relative z-10 mt-2 flex items-end justify-between">
            <p className="text-[28px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[11px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Allocated': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Pending': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Shipped': 
      style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; 
      break;
    case 'Cancelled': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Create/Edit Allocation Rule Modal
function EditAllocationModal({ isOpen, onClose, allocation, onSave }: any) {
    const [tempAllocation, setTempAllocation] = useState<any>({});

    useEffect(() => {
        if (isOpen && allocation) {
            setTempAllocation(JSON.parse(JSON.stringify(allocation)));
        }
    }, [isOpen, allocation]);

    if (!isOpen || !allocation || !tempAllocation) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempAllocation);
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[550px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Gift className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[14px] uppercase tracking-widest leading-none">CONFIGURE PROMO ALLOCATION</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white">
                <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.Barcode size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">PROMOTION CODE</p>
                            <h4 className="text-[14px] font-black text-[#212c46] leading-none uppercase">{tempAllocation.id}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Campaign Title</label>
                            <input 
                                required 
                                type="text"
                                value={tempAllocation.campaign || ''} 
                                onChange={e => setTempAllocation({...tempAllocation, campaign: e.target.value})} 
                                className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Client/Account Partner</label>
                            <input 
                                required 
                                type="text"
                                value={tempAllocation.client || ''} 
                                onChange={e => setTempAllocation({...tempAllocation, client: e.target.value})} 
                                className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Reference Order (SO / PO)</label>
                        <input 
                            required 
                            type="text"
                            value={tempAllocation.orderRef || ''} 
                            onChange={e => setTempAllocation({...tempAllocation, orderRef: e.target.value})} 
                            className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Main SKU Code</label>
                            <input 
                                required 
                                type="text"
                                value={tempAllocation.mainItem || ''} 
                                onChange={e => setTempAllocation({...tempAllocation, mainItem: e.target.value})} 
                                className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#a94228] uppercase ml-1">Free Gift SKU Reward</label>
                            <input 
                                required 
                                type="text"
                                value={tempAllocation.giftItem || ''} 
                                onChange={e => setTempAllocation({...tempAllocation, giftItem: e.target.value})} 
                                className="w-full px-4 py-2 bg-white border border-[#a94228]/30 rounded-xl text-[12px] font-bold outline-none focus:border-[#a94228] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Target Quantity</label>
                            <input 
                                required 
                                type="number"
                                value={tempAllocation.qty || ''} 
                                onChange={e => setTempAllocation({...tempAllocation, qty: parseInt(e.target.value) || 0})} 
                                className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Allocation State</label>
                            <select 
                                value={tempAllocation.status || 'Allocated'} 
                                onChange={e => setTempAllocation({...tempAllocation, status: e.target.value})} 
                                className="w-full px-4 py-2 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Allocated">Allocated</option>
                                <option value="Pending">Pending</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2"><Icons.Save size={14}/> Save Allocation</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// 2. Shipping Label Print Preview Modal
function PrintLabelModal({ isOpen, onClose, data }: any) {
    if (!isOpen || !data) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[420px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Printer className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[14px] uppercase tracking-widest leading-none">SHIPPING LABEL PREVIEW</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col bg-[#eaeaec] p-6 text-left">
                <div className="bg-white border-2 border-black p-5 shadow-inner text-black font-sans w-full rounded-md animate-fadeIn">
                    <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-3">
                        <div className="text-[10px] font-black uppercase text-[#1a253d]">Smart Logistics</div>
                        <div className="text-[10px] font-black uppercase bg-[#212c46] text-white px-2 py-0.5 rounded">PASSED</div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">PROMO LOGISTIC CAMPAIGN</p>
                            <p className="text-[12px] font-black text-[#212c46] uppercase leading-tight">{data.campaign}</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">CLIENT ASSIGNMENT</p>
                            <p className="text-[11px] font-bold text-gray-800 uppercase leading-none">{data.client}</p>
                        </div>
                        <div className="border-t border-b border-dashed border-gray-400 py-2 my-2 flex justify-between">
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">FREE SKU REWARD</p>
                                <p className="text-[13px] font-black text-[#a94228] uppercase leading-none">{data.giftItem}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">QTY ALLOCATED</p>
                                <p className="text-[16px] font-black text-[#212c46] leading-none">{formatNumber(data.qty)} Units</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">ORDER REF REFERENCE</p>
                                <p className="text-[11px] font-mono font-bold leading-none">{data.orderRef}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">BARCODE DEPOSITORY</p>
                                <p className="text-[10px] font-mono leading-none font-bold">{data.id}</p>
                            </div>
                        </div>
                        <div className="pt-2 flex flex-col items-center">
                            <div className="w-full h-10 bg-black flex items-center justify-center gap-[1.5px] px-2 overflow-hidden">
                                {[1,3,2,1,4,1,2,3,1,1,2,4,2,1,1,3,2,1,4,2].map((w, idx) => (
                                    <div key={idx} className="h-full bg-white" style={{ width: `${w}px` }}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white border-t border-[#eaeaec] p-4 flex justify-end gap-3 rounded-b-xl shrink-0 mt-6 -mx-6 -mb-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#414757] rounded-lg text-[11px] font-black uppercase tracking-wider">Close Preview</button>
                    <button onClick={() => { window.print(); onClose(); }} className="px-5 py-2 bg-[#ad2b10] hover:bg-[#922724] text-white rounded-lg text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Icons.Printer size={13}/> Print Label
                    </button>
                </div>
            </div>
        </DraggableModal>
    );
}

// 3. User Guide Panel (Identical comprehensive style as UserPermissions)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#b7a159]"/> PROMOTION GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Free-Gift Allocation and Binding Policies</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.ShieldAlert size={18} className="text-[#b7a159]"/> 1. Auto Allocation Policies
            </h4>
            <p className="text-[12px] mb-3">ระบบคำนวณและประมวลผลการจัดสรรของแถมให้แก่พาร์ทเนอร์อัตโนมัติ ตามเงื่อนไขดังนี้:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3.5 rounded-xl border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={16} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div><strong className="text-[#4d87a8]">Public Trigger:</strong> ของแถมแบบมาตรฐานที่พ่วงไปกับ SKU หลักโดยตรง สต๊อกจัดส่งจะถูกกันสิทธิ์ให้โดยอัตโนมัติ</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-3.5 rounded-xl border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={16} className="shrink-0 text-[#932c2e] mt-0.5"/> 
                  <div><strong className="text-[#932c2e]">Restricted Campaign:</strong> แคมเปญพิเศษจำกัดสาขาหรือผู้ซื้อ ตรวจสอบผ่าน Verifier เท่านั้นเพื่อป้องกันพาร์ทเนอร์ขอของแถมซ้ำซ้อน</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Key size={18} className="text-[#d96245]"/> 2. Configuration Levels
            </h4>
            <p className="text-[12px] mb-3">ประเภทของข้อมูลและการตั้งค่ากฎการผูกของแถมในระบบ:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#4d87a8]">Manual Bound:</strong> จัดสรรด้วยตนเองกรณีพาร์ทเนอร์สร้างคำขอเคสพิเศษมายัง WMS</li>
                <li><strong className="text-[#d96245]">Auto Trigger:</strong> ทำงานอัตโนมัติร่วมกันระหว่าง ERP และระบบหยิบสินค้าที่หน้าคลัง</li>
                <li><strong className="text-[#657f4d]">VIP Priority:</strong> จัดสรรให้กับกลุ่มลูกค้าระดับโพลีซีสูงสุดก่อนสต๊อกจะขาดแคลน</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.RefreshCw size={18} className="text-[#3f809e]"/> 3. WMS Binding Engine
            </h4>
            <p className="text-[12px]">เมื่อทำการบันทึกหรือปลดล็อคข้อกำหนดแคมเปญในหน้านี้ ค่าตั้งค่าสิทธิ์สต๊อกแถมจะถูกกระจายเพื่อรันกับระบบ Picking Wave โดยตรงแบบ Real-time 100%</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Main Page Component ---
export default function PromotionAllocation() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (Configs / Policies) or 'staff' (Allocations Registry Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom states modeled identically to UserPermissions 
  const [expandedCampaigns, setExpandedCampaigns] = useState<any>({ 'SUM-2605': true, 'VIP-2605': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'SUM-2605': false, 'B1G1-2605': true, 'VIP-2605': false });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });
  const [printData, setPrintData] = useState<any>(null);

  // Exact 100% original mock examples from first implementation
  const [allocations, setAllocations] = useState<any[]>([
    { id: 'ALC-2605-001', campaign: 'Summer Splash 2026', client: 'Unilever Thailand', orderRef: 'SO-2026-881', mainItem: 'Dove Shampoo 450ml', giftItem: 'Trial Soap 50g', qty: 1500, status: 'Allocated', date: '2026-05-01' },
    { id: 'ALC-2605-002', campaign: 'Buy 1 Get 1 (Drinks)', client: 'Thai Beverage', orderRef: 'SO-2026-902', mainItem: 'Oishi Green Tea 500ml', giftItem: 'Oishi Honey Lemon 350ml', qty: 5000, status: 'Pending', date: '2026-05-02' },
    { id: 'ALC-2605-003', campaign: 'VIP Member Gift', client: 'CP All Public Co.', orderRef: 'SO-2026-915', mainItem: 'Meiji Fresh Milk 2L', giftItem: '7-11 Eco Bag', qty: 120, status: 'Shipped', date: '2026-05-03' },
  ]);

  const [campaigns, setCampaigns] = useState<any[]>([
    { id: 'SUM-2605', label: 'Summer Splash 2026', code: 'C-0988', triggerSku: 'DOVE-SHAMP-450', giftSku: 'TRIAL-SOAP-50', qtyGoal: 10000, triggerQty: 1, allocated: 1500, minRole: 'Public Trigger' },
    { id: 'B1G1-2605', label: 'Buy 1 Get 1 (Drinks)', code: 'C-0912', triggerSku: 'OISHI-GRN-500', giftSku: 'OISHI-HON-350', qtyGoal: 15000, triggerQty: 1, allocated: 5000, minRole: 'Restricted Campaign' },
    { id: 'VIP-2605', label: 'VIP Member Gift', code: 'C-0877', triggerSku: 'MEIJI-MILK-2L', giftSku: '711-ECO-BAG', qtyGoal: 500, triggerQty: 1, allocated: 120, minRole: 'VIP Priority' },
  ]);

  const filteredAllocations = useMemo(() => {
    return allocations.filter(item => {
      const matchSearch = item.campaign.toLowerCase().includes(search.toLowerCase()) || 
                          item.orderRef.toLowerCase().includes(search.toLowerCase()) ||
                          item.client.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [allocations, search, statusFilter]);

  const currentData = filteredAllocations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredAllocations.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedCampaigns((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const activePromoCount = campaigns.length;
  const totalAllocatedQty = allocations.filter(p => p.status === 'Allocated' || p.status === 'Shipped').reduce((acc, p) => acc + p.qty, 0);
  const errorsCount = allocations.filter(p => p.status === 'Pending').length;

  const saveAllocationRule = (savedData: any) => {
    setAllocations(prev => {
      const exists = prev.find(item => item.id === savedData.id);
      if (exists) {
        return prev.map(item => item.id === savedData.id ? { ...item, ...savedData } : item);
      } else {
        return [savedData, ...prev];
      }
    });

    // Also update current campaigns list stats if appropriate
    setCampaigns(prev => prev.map(c => {
      if (c.label === savedData.campaign) {
        return { ...c, allocated: savedData.qty };
      }
      return c;
    }));
  };

  const handleCreateNewManual = () => {
    const randomId = `ALC-2605-${Math.floor(Math.random() * 900) + 100}`;
    const newRule = {
      id: randomId,
      campaign: 'New Promo Campaign 2026',
      client: 'Retail Partner Corp',
      orderRef: 'SO-2026-999',
      mainItem: 'Standard SKU Box',
      giftItem: 'Promo Mug Red',
      qty: 100,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setEditModal({ isOpen: true, data: newRule });
  };

  const handleDeleteAllocation = (id: string) => {
    setAllocations(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditAllocationModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} allocation={editModal.data} onSave={saveAllocationRule} />
      <PrintLabelModal isOpen={!!printData} onClose={() => setPrintData(null)} data={printData} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Gift size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      PROMOTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">ALLOCATION</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      FREE-GIFT CAMPAIGNS & INVENTORY REWARD MANAGEMENT
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Database size={16} /> Global Config
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.List className="text-[#b58c4f]" size={16} /> Allocation Log
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Active Campaigns" value={activePromoCount} icon="megaphone" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Tracked Promos" />
                <KpiCard label="Allocated Goal Units" value={formatNumber(totalAllocatedQty)} icon="boxes" colorAccent={THEME.accent} colorValue={THEME.primary} desc="Total Gifts Allocated" />
                <KpiCard label="Fulfillment Failures" value={errorsCount} icon="alert-triangle" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Requires Stock" />
                <KpiCard label="Fulfillment Score" value="99.2%" icon="shield-check" colorAccent={THEME.success} colorValue={THEME.success} desc="Alloc Verified" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ACCESS/ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 bg-white/90 p-6 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                        <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-4 mb-6"><Icons.ShieldAlert size={20} className="text-[#b7a159]" /> ALLOCATION POLICIES</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#3f809e]/20">Auto trigger</span>
                                <p className="text-[12px] text-[#212c46] font-bold leading-normal">เมื่อพาร์ทเนอร์ส่งออเดอร์ที่มีเงื่อนไขกำหนด ระบบของ SMART LOGISTICS WMS จะจ่าย SKU ของแถมโดยอัตโนมัติ</p>
                            </div>
                            <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#932c2e]/30">VIP restrict</span>
                                <p className="text-[12px] text-[#212c46] font-bold leading-normal">จำกัดเฉพาะผู้จัดส่งที่มีสัญลักษณ์ VIP ในประวัติการจองพาเลทและรถ เพื่อสงวนกลุ่มของรางวัลพรีเมียมให้พาร์ทเนอร์สูงสุด</p>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CAMPAIGN CONFIG REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.ListTree size={20} className="text-[#b7a159]"/> GLOBAL CAMPAIGN REGISTER</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Campaign Configuration
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {campaigns.map(camp => (
                                <div key={camp.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[camp.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[camp.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.Sparkles size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{camp.label}</span>
                                                    <button onClick={() => toggleExpand(camp.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedCampaigns[camp.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[camp.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>Allocation {confidentialityMap[camp.id] ? 'Restricted' : 'Active Public'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(camp.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[camp.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[camp.id] ? "Unlock Public Allocation Limit" : "Lock / RESTRICT Area Policy"}
                                            >
                                                {confidentialityMap[camp.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedCampaigns[camp.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#7a8b95] uppercase font-black text-[9px] mb-1">TRIGGER MAIN ITEM SKU</p>
                                                    <p className="font-bold text-[#212c46] uppercase">{camp.triggerSku}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">FREE SKU REWARD</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{camp.giftSku}</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Goal Target Allocation:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">{formatNumber(camp.qtyGoal)} Units</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Category Limit:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white`} style={{ backgroundColor: camp.minRole === 'VIP Priority' ? THEME.success : camp.minRole === 'Restricted Campaign' ? THEME.gold : THEME.skyBlue }}>
                                                        {camp.minRole}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* ALLOCATION LOG TAB - High Performance Table */
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#b7a159] transition-colors">
                                <Icons.Filter size={14} className="text-[#7a8b95]" />
                                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Allocation Status</option>
                                    <option value="Allocated">Allocated</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export Allocation Log
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search Campaign, SO, Client..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสอ้างอิง</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">แคมเปญ / ลูกค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">เลขที่ใบสั่งขาย (SO)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">สินค้าหลักที่ผูกยอด</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ของแถมที่ได้รับจัดสรร</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">จำนวน</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                        <td className="py-2.5 px-4">
                                            <div className="font-black text-[#212c46] text-[12px] uppercase">{item.campaign}</div>
                                            <div className="text-[10px] font-bold text-[#7a8b95]">{item.client}</div>
                                        </td>
                                        <td className="py-2.5 px-4 font-bold text-[#ad2b10] text-[12px]">{item.orderRef}</td>
                                        <td className="py-2.5 px-4 text-[12px] font-bold text-[#7a8b95]">{item.mainItem}</td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#b7a159] animate-ping"></div>
                                                <span className="font-black text-[#212c46] text-[12px] uppercase">{item.giftItem}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#212c46] text-[12px]">{formatNumber(item.qty)}</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px] opacity-20 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => setEditModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#3d6ca1] bg-white hover:bg-[#3d6ca1] hover:text-white hover:border-[#3d6ca1] active:scale-90 transition-all cursor-pointer"
                                                    title="Configure / Adjust Binding"
                                                >
                                                    <Icons.Edit3 size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setPrintData(item)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#b7a159] bg-white hover:bg-[#b7a159] hover:text-white hover:border-[#b7a159] active:scale-90 transition-all cursor-pointer" 
                                                    title="Print Label Shipping Mark"
                                                >
                                                    <Icons.Printer size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteAllocation(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#7a8b95] bg-white hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] active:scale-90 transition-all cursor-pointer" 
                                                    title="Remove Allocation"
                                                >
                                                    <Icons.Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-16 text-center text-[#7a8b95] font-black text-[12px] uppercase tracking-widest bg-[#f8f9fa]">No Promotion Allocations Logged</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="px-6 py-3 bg-white border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-3xl">
                        <div className="flex items-center gap-5 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span>Display Rows:</span>
                                <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-[#f8f9fa] border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#212c46] cursor-pointer shadow-sm focus:border-[#b7a159]">{[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}</select>
                            </div>
                            <p className="bg-[#f8f9fa] px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Allocations: {filteredAllocations.length}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#212c46] active:scale-90 shadow-sm text-[#7a8b95]'}`}><Icons.ChevronLeft size={14}/></button>
                            <div className="bg-[#f8f9fa] text-[#212c46] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center border border-[#eaeaec] shadow-sm">Page {currentPage} / {totalPages}</div>
                            <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#212c46] active:scale-90 shadow-sm text-[#7a8b95]'}`}><Icons.ChevronRight size={14}/></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
