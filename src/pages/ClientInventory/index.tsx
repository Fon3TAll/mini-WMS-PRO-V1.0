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

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);

// --- KPI Card Components (Sleek Compact Lean Padding - Exactly matching requested layout) ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[84px] min-h-[84px] flex flex-col justify-between animate-fadeIn text-left">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={70} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm leading-none mt-1">{label}</p>
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={14} />
            </div>
        </div>
        <div className="relative z-10 flex items-end justify-between">
            <p className="text-[18px] font-black leading-none text-[#212c46] font-mono" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

// --- Small Badges (11px exactly like requested) ---
const ClientBadge = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border bg-[#3f809e]/15 text-[#3f809e] border-[#3f809e]/30 font-sans">
      <div className="w-1 h-1 rounded-full bg-[#3f809e]"></div> {label}
    </span>
  );
};

const UnitBadge = ({ label }: { label: string }) => {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-widest border bg-[#7a8b95]/15 text-[#414757] border-[#7a8b95]/30 font-sans">
      {label}
    </span>
  );
};

// --- Modals & User Guides ---

// Extremely detailed User Guide Panel (Padded narrow & compact - "ลีน สวย")
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> CLIENT INVENTORY GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">3PL Consignment & Storage Node Management</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. หลักการจัดการสินค้าฝากเก็บ (3PL Consignment Rules)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ระบบบริหารและคัดแยกยอดคงเหลือแยกสิทธิ์เจ้าของสินค้าอย่างสมบูรณ์แบบ (Durable Customer Isolation & Stock Balance):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Public Consignment:</strong> ยอดสต๊อกทั่วไปของลูกค้าผู้ฝากเก็บ ได้สิทธิ์กระจายจัดเก็บและกระจายสินค้าเบิกหยิบตามปรกติ</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Locked Customer Node:</strong> สิทธิ์การจองคาร์โก้หรือพื้นที่เก็บรักษาพิเศษ หากตั้งค่าเปิดความปลอดภัย (Restricted) จะจำกัดการเคลื่อนย้ายที่ไม่ได้รับสิทธิ์</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Key size={13} className="text-[#d96245]"/> 2. รายละเอียดสโตร์ทรานแซกชั่น (Stock Allocation)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">การตรวจสอบพารามิเตอร์ภายในตารางบันทึกสโตร์:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-bold text-[#414757]">
                <li><strong className="text-[#657f4d]">SOH (Stock on Hand):</strong> จำนวนสต๊อกสินค้าจริงทั้งหมดที่จดบันทึกไว้ในพื้นที่จัดเก็บเวสต์</li>
                <li><strong className="text-[#932c2e]">Reserved:</strong> สต๊อกคงค้างสำหรับการทำจัดออเดอร์ในอนาคต หรือการติดประเด็นตรวจสอบ</li>
                <li><strong className="text-[#3f809e]">Available (พร้อมใช้):</strong> ยอดสินค้าสุทธิที่ลูกค้าสามารถดึงรายการไปจำหน่ายหรืออนุมัติส่งมอบต่อ</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. เรียลไทม์บันทึกและตรวจสอบสิทธิ์ (Real-time Synced Audit)
            </h4>
            <p className="text-[11px] font-bold text-[#615e65]">ยอดสินค้าเชื่อมโยงกับฐานข้อมูลรวมส่วนกลางแบบอัตโนมัติ หากระดับความเสี่ยงของโซนหรือสิทธิ์เข้าใช้เปลี่ยนไปพารามิเตอร์จะคำนวณและปรับตัวทันที</p>
          </section>
        </div>
        
        <div className="p-2 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// Execute Detail Modal wrapped in DraggableModal system
function InventoryDetailModal({ isOpen, onClose, item }: any) {
    if (!isOpen || !item) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[550px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Boxes className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">CLIENT STOCK AUDIT: {item.sku}</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans text-[12px]">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-1">
                        <h4 className="text-[14px] font-black text-[#212c46] uppercase mb-1">{item.name}</h4>
                        <div className="flex justify-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Client: {item.clientName}</span>
                            <ClientBadge label={item.clientId} />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-50 border border-[#eaeaec] rounded-xl p-3 text-center shadow-inner">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">TOTAL SOH</span>
                            <div className="text-[14px] font-mono font-black text-[#212c46]">{formatNumber(item.soh)}</div>
                        </div>
                        <div className="bg-gray-50 border border-[#eaeaec] rounded-xl p-3 text-center shadow-inner">
                            <span className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-1 block">RESERVED</span>
                            <div className="text-[14px] font-mono font-black text-[#ce1c16]">{formatNumber(item.reserved)}</div>
                        </div>
                        <div className="bg-gray-50 border border-[#eaeaec] rounded-xl p-3 text-center shadow-inner">
                            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest mb-1 block">AVAILABLE</span>
                            <div className="text-[14px] font-mono font-black text-[#657f4d]">{formatNumber(item.available)}</div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#eaeaec] space-y-2">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Storage Zone & Location:</span>
                            <span className="font-black text-[#212c46]">{item.zone}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-dashed border-gray-200 pt-2">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Last Inbound Receipt:</span>
                            <span className="font-black text-[#657f4d] flex items-center gap-1">
                                <Icons.Clock size={12}/> {item.lastIn}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-[#212c46] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.CheckCircle2 size={13}/> Authorize Verify</button>
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function ClientInventory() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'zone_settings' (Identical to UserPermissions Settings Registry Tab standards)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [clientFilter, setClientFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Zone standard expansion & confidentiality state (identical to UserPermissions state structure)
  const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true, 'ZONE-C': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'ZONE-A': false, 'ZONE-B': false, 'ZONE-C': false, 'COLD-RM': true });

  // Safety stock configurations (synced standards with UserPermissions)
  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'ZONE-A', name: 'Zone A (Beverage Rack)', safetyStockFloor: 1200, activeAllocation: true, isConfidential: false, description: 'อัครคลังสินค้ากลุ่มเครื่องดื่ม ตรวจสองสิทธิ์โอนย้ายสต๊อกลูกค้า Unilever' },
    { id: 'ZONE-B', name: 'Zone B (Dry Food Rack)', safetyStockFloor: 1800, activeAllocation: true, isConfidential: false, description: 'โซนคลังอาหารแห้ง มาตรฐานจัดเก็บและย้ายสต๊อกของลูกค้า CP All' },
    { id: 'ZONE-C', name: 'Zone C (Household Goods Room)', safetyStockFloor: 600, activeAllocation: true, isConfidential: false, description: 'โซนจัดหมวดเคมีภัณฑ์ทำความสะอาด ป้องกันความเสี่ยงปะปนสัมผัสอาหาร' },
    { id: 'COLD-RM', name: 'Cold Storage Room (Frozen)', safetyStockFloor: 250, activeAllocation: false, isConfidential: true, description: 'ห้องห้องบ่มทำความเย็นจัดแช่แข็งพิเศษ ล็อกความเสถียรข้อมูลแบบ RFID' }
  ]);

  // Original datasets 100% untouched
  const [clients, setClients] = useState<any[]>([
    { id: 'C001', name: 'Unilever Thailand', totalSkus: 450, value: 12500000 },
    { id: 'C002', name: 'CP All Public Co.', totalSkus: 1200, value: 85000000 },
    { id: 'C003', name: 'Nestle (Thai)', totalSkus: 320, value: 9200000 },
    { id: 'C004', name: 'Sahapat Group', totalSkus: 890, value: 45000000 },
  ]);

  const [inventory, setInventory] = useState<any[]>([
    { id: 1, clientId: 'C001', clientName: 'Unilever Thailand', sku: 'UN-7712', name: 'Comfort Softener 500ml', soh: 5000, reserved: 200, available: 4800, unit: 'Bottle', zone: 'Zone A-01', lastIn: '2026-05-01' },
    { id: 2, clientId: 'C001', clientName: 'Unilever Thailand', sku: 'UN-8820', name: 'Dove Shampoo 450ml', soh: 3200, reserved: 0, available: 3200, unit: 'Bottle', zone: 'Zone A-05', lastIn: '2026-05-02' },
    { id: 3, clientId: 'C002', clientName: 'CP All Public Co.', sku: 'CP-1001', name: '7-11 Drinking Water 600ml', soh: 15000, reserved: 4500, available: 10500, unit: 'Pack', zone: 'Zone B-12', lastIn: '2026-05-05' },
    { id: 4, clientId: 'C002', clientName: 'CP All Public Co.', sku: 'CP-4402', name: 'Meiji Fresh Milk 200ml', soh: 850, reserved: 120, available: 730, unit: 'Bottle', zone: 'Cold Room 02', lastIn: '2026-05-06' },
    { id: 5, clientId: 'C003', clientName: 'Nestle (Thai)', sku: 'NS-2201', name: 'Nescafe Gold 200g', soh: 1200, reserved: 50, available: 1150, unit: 'Jar', zone: 'Zone C-03', lastIn: '2026-04-28' },
    { id: 6, clientId: 'C004', clientName: 'Sahapat Group', sku: 'SH-9901', name: 'Mama Tom Yum 60g', soh: 45000, reserved: 15000, available: 30000, unit: 'Pack', zone: 'Zone D-08', lastIn: '2026-05-04' },
  ]);

  const [detailModal, setDetailModal] = useState<any>({ isOpen: false, data: null });

  const handleSaveSafetyConfig = (zoneId: string, updatedFloor: number) => {
    setZoneConfigs(prev => prev.map(zone => zone.id === zoneId ? { ...zone, safetyStockFloor: updatedFloor } : zone));
  };

  const handleToggleConfidentiality = (zoneId: string) => {
    setConfidentialityMap((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const handleToggleExpandZone = (zoneId: string) => {
    setExpandedZones((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const handleAutoTriggerSimulation = () => {
    const randomSkuNum = Math.floor(Math.random() * 9000) + 1000;
    const simulatedInventory = {
      id: inventory.length + 1,
      clientId: 'C001',
      clientName: 'Unilever Thailand',
      sku: `UN-${randomSkuNum}`,
      name: 'Simulated Consignment Item',
      soh: 2400,
      reserved: 400,
      available: 2000,
      unit: 'Bottle',
      zone: 'Zone A-08',
      lastIn: '2026-06-01'
    };
    setInventory(prev => [simulatedInventory, ...prev]);
  };

  // KPIs Calculations
  const totalActiveClientsCount = clients.length;
  const totalDepositedSohSum = useMemo(() => inventory.reduce((acc, item) => acc + item.soh, 0), [inventory]);
  const estimatedValueSum = useMemo(() => clients.reduce((acc, client) => acc + client.value, 0), [clients]);
  const usagePercentageValue = "92.4%";

  // Filtering
  const filteredInventoryData = useMemo(() => {
    return inventory.filter(item => {
      const matchSearch = item.sku.toLowerCase().includes(search.toLowerCase()) || 
                          item.name.toLowerCase().includes(search.toLowerCase());
      const matchClient = clientFilter === 'All' || item.clientId === clientFilter;
      return matchSearch && matchClient;
    });
  }, [inventory, search, clientFilter]);

  const currentData = filteredInventoryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInventoryData.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <InventoryDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} item={detailModal.data} />

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Warehouse size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      CLIENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">INVENTORY</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          3PL CONSIGNMENT & THIRD-PARTY CUSTOMER STOCK MATRIX NODES
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> CLIENT REGISTRY
                  </button>
                  <button onClick={() => setActiveTab('zone_settings')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'zone_settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> ZONE CONTROLS
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (Sleek Compact Lean Padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Active Depositors" value={formatNumber(totalActiveClientsCount)} icon={Icons.Users} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Corporate Accounts" />
                <KpiCard label="Total Deposited SOH" value={formatNumber(totalDepositedSohSum)} icon={Icons.Package} colorAccent={THEME.success} colorValue={THEME.success} desc="Post Audited SOH" />
                <KpiCard label="Inventory Value (Est)" value={`฿${(estimatedValueSum/1000000).toFixed(1)}M`} icon={Icons.Briefcase} colorAccent={THEME.accent} colorValue={THEME.accent} desc="Consigned Pricing" />
                <KpiCard label="Storage Utilization" value={usagePercentageValue} icon={Icons.Layers} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Client Allocation" />
            </div>

            {activeTab === 'registry' ? (
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn">
                    
                    {/* TABLE TOOLBAR AND FILTERS */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
                            {/* Client Filter */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Activity size={14} className="text-[#606a5f]" />
                                <select 
                                    value={clientFilter} 
                                    onChange={(e) => { setClientFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">All Depositors</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <button onClick={handleAutoTriggerSimulation} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Play size={14} /> Simulate Inbound Cargo
                            </button>
                        </div>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search SKU or Product Name..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC LIST TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รายละเอียดสินค้า / รหัสสินค้า SKU</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ลูกค้าเจ้าของแบรนด์สินค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">ยอดรวมทางบัญชี (SOH)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำนวนรอจัดส่ง (Reserved)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำนวนที่พร้อมหยิบ (Available)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">หน่วยนับ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">โซนคลังเก็บ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="font-bold text-[#212c46] text-[12px] truncate max-w-[220px]">{item.name}</div>
                                            <div className="font-mono font-black text-[#3f809e] text-[10px]">{item.sku}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-[#b58c4f]"></div>
                                                <span className="font-bold text-[#4d87a8] text-[12px] uppercase">{item.clientName}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#212c46] text-[12px]">
                                            {formatNumber(item.soh)}
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#ce1c16] text-[12px]">
                                            {formatNumber(item.reserved)}
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#657f4d] text-[12px]">
                                            {formatNumber(item.available)}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <UnitBadge label={item.unit} />
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-bold text-slate-400 text-[12px]">
                                            {item.zone}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 rounded flex items-center justify-center bg-[#f3f3f1] text-[#212c46] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                    title="View Details Node"
                                                >
                                                    <Icons.Eye size={13} />
                                                </button>
                                                <button 
                                                    className="w-8 h-8 rounded flex items-center justify-center bg-[#f3f3f1] text-[#212c46] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                    title="Action Info"
                                                >
                                                    <Icons.Info size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No client inventory matches filtered parameters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* COMPACT PACKED PAGINATION CONTROLS */}
                    <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-3xl text-[12px]">
                        <div className="flex items-center gap-5 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span>Display Rows:</span>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                    className="bg-white border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#212c46] cursor-pointer shadow-sm"
                                >
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono text-[#212c46] font-bold">Count: {filteredInventoryData.length}</p>
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
            ) : (
                /* ZONE CONTROLS - (Standard of User Permissions Security Node Configurations) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn text-[12px]">
                    
                    {/* Access Policies Card */}
                    <div className="lg:col-span-4 space-y-4 text-left">
                        <div className="bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec]">
                            <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4">
                                <Icons.Layers size={18} className="text-[#b7a159]" /> ALLOCATION POLICY
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">SAFETY DEPLOYMENT</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        ระบบคลังสินค้าอ้างอิงปริมาณ Safety Stock Floor เพื่อเป็นตัวตัดสินเมื่อจำนวนสินค้าลดลงเกินจุดวิกฤต (Trigger Reorder point Alert)
                                    </p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">RESTRICTED LOCKED ACCESS</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        การกำหนดให้โซนเป็น Restricted Area จะป้องกันระบบคัดหยิบสินค้าสุ่มเบิกจ่ายสินค้าไปยังจุดอื่นๆ ปิดสิทธิ์พนักงานนอกแผนกสแกนบาร์โค้ด
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Summary Stat Panel */}
                        <div className="bg-[#212c46] p-5 rounded-3xl shadow-lg border border-[#1d2636] text-white space-y-3">
                            <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9d8c0] flex items-center gap-2 border border-white/20 pb-2 mb-2">
                                <Icons.ShieldAlert size={18} className="text-[#b7a159]"/> SYSTEM AUDITED STATE
                            </h3>
                            <p className="text-[11px] text-[#d7d7d7] leading-relaxed">
                                โซนถูกควบคุมและเก็บรักษาสถิติตรงผ่านเซพเวอร์ SMART WMS ตลอด 24 ชม. ทุกจำนวนการหยิบคุมตรวจสอบได้มีรหัสรับรองกำกับ
                            </p>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Restricted Zones count:</span>
                                    <span className="font-black text-[#b7a159]">{Object.values(confidentialityMap).filter(v => v).length} LocationsLocked</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Safety Capacity:</span>
                                    <span className="font-black text-white">3,850 Base Units</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Settings Registry (List items with expandable details and Lock options like UserPermissions) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3">
                                <Icons.Settings size={20} className="text-[#b7a159]"/> ZONE SETTINGS REGISTRY
                            </h4>
                            <span className="text-[10px] font-bold text-[#657f4d] bg-[#657f4d]/10 px-2.5 py-1 rounded-full border border-[#657f4d]/20 uppercase">SYSTEM STABILIZED</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {zoneConfigs.map(zone => (
                                <div key={zone.id} className="space-y-2">
                                    {/* Same exact layout standards as UserPermissions settings row */}
                                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.MapPin size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-[#212c46] text-[12px] uppercase tracking-wider">{zone.name}</span>
                                                    <button onClick={() => handleToggleExpandZone(zone.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedZones[zone.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${confidentialityMap[zone.id] ? 'text-[#ce1c16]' : 'text-slate-400'}`}>
                                                    Access Level Check: {confidentialityMap[zone.id] ? 'Restricted Lock' : 'Public Access Allowed'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleToggleConfidentiality(zone.id)} 
                                                className={`p-2 rounded-xl transition-all shadow-sm active:scale-90 ${confidentialityMap[zone.id] ? 'bg-[#ce1c16] text-white border border-[#ad2b10]' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`}
                                            >
                                                {confidentialityMap[zone.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded details section */}
                                    {expandedZones[zone.id] && (
                                        <div className="ml-12 p-4 bg-[#f8f9fa] rounded-2xl border border-dashed border-[#eaeaec] space-y-3 animate-fadeIn">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase">{zone.description}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Safety stock floor (SOH)</label>
                                                    <input 
                                                        type="number" 
                                                        value={zone.safetyStockFloor} 
                                                        onChange={(e) => handleSaveSafetyConfig(zone.id, Number(e.target.value))}
                                                        className="w-full max-w-[200px] border border-[#eaeaec] bg-white rounded-xl px-3 py-1.5 font-mono font-black text-[#212c46] outline-none focus:border-[#4d87a8]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
