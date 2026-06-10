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
            <p className="text-[18px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

// --- Small Badges (11px exactly like requested) ---
const VelocityBadge = ({ velocity }: { velocity: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (velocity) {
    case 'High': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
    case 'Medium': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Low': 
      style = { bg: '#7a8b9515', color: THEME.dustyBlue, border: '#7a8b9530' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {velocity}
    </span>
  );
};

const ActionBadge = ({ action }: { action: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (action) {
    case 'Promote': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Demote': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
    case 'Adjust': 
      style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      {action}
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> SLOTTING SYSTEM GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Warehouse Layout & Optimization Procedures</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. หลักการทำงานยอดเบิกและอุณหภูมิ (Velocity Rules)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ระบบแบ่งการจัดเก็บสินค้าและคํานวณหาตำแหน่งจัดวางที่มีประสิทธิภาพสูงสุดตามสถิติความถี่ของการเบิกจ่าย (Active Slotting Optimizer):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Public Zones:</strong> โซนกระจายสินค้าปรกติ จัดสรรสินค้าขายเร็วมาวางใกล้จุดโหลดเพื่อย่นระยะการวิ่งหยิบจับ (Velocity Base)</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Area:</strong> สินค้าอุณหภูมิเฉพาะหรือประเภทสินค้าอันตราย จะต้องตรวจสอบสิทธิ์พนักงานก่อนจัดเส้นทางอัจฉริยะ (Secure Route Allocation)</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Key size={13} className="text-[#d96245]"/> 2. ลำดับความสำคัญและการสับเปลี่ยนตำแหน่ง
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">การสับเปลี่ยนตำแหน่งและการแนะนำในการทำจัดวางสล็อตสินค้า:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-bold text-[#414757]">
                <li><strong className="text-[#657f4d]">Promote (เลื่อนขั้น):</strong> ปรับสินค้าที่มีอัตราการเบิกเปลี่ยนสูงมาก (High Velocity) ไปยังโซนแถวเบิกหยิบด้านหน้าเพื่อประหยัดเวลา</li>
                <li><strong className="text-[#932c2e]">Demote (ลดขั้น):</strong> โยกย้ายกลุ่มสินค้าประเภทจัดเก็บนาน (Dead Stock หรือ Low Velocity) ลึกเข้าหาชั้นมุมในหรือระเบียงชั้นบน</li>
                <li><strong className="text-[#3f809e]">Category Consolidation (ปรับสมดุล):</strong> การควบรวมตรวจสอบข้อมูลสินค้าชนิดเดียวกันให้กระจุกตัวตามระบบเพื่อความคล่องตัว</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. เรียลไทม์ ซิงค์ระดับความปลอดภัย (Real-time Stabilization)
            </h4>
            <p className="text-[11px] font-bold text-[#615e65]">ระบบทำการเชื่อมโยงข้อมูลกับแผนกรับ-จ่าย สต๊อกรวมทั้งหมดแบบอัตโนมัติ การเปลี่ยนระดับชั้นความลับและขีดขั้นความปลอดภัยในหน้าต่างควบคุมจะส่งผลต่อคำแนะนำระบบทันที</p>
          </section>
        </div>
        
        <div className="p-2 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// Execute Move Modal wrapped in DraggableModal system
function ExecuteMoveModal({ isOpen, onClose, task, onConfirm }: any) {
    if (!isOpen || !task) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[550px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Move className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">EXECUTE SLOT TRANSFER: {task.sku}</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans text-[12px]">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-1">
                        <h4 className="text-[14px] font-black text-[#212c46] uppercase mb-1">{task.name}</h4>
                        <div className="flex justify-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Category: {task.category}</span>
                            <VelocityBadge velocity={task.velocity} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-[#eaeaec] rounded-xl relative shadow-inner">
                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">FROM CURRENT LOCATION</span>
                            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center mb-1">
                                <Icons.Package size={20} className="text-slate-400" />
                            </div>
                            <span className="text-[12px] font-mono font-black text-[#212c46]">{task.currentLoc}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#ad2b10] text-white flex items-center justify-center shadow-md animate-pulse">
                                <Icons.ArrowRight size={16} />
                            </div>
                            <span className="text-[9px] font-black text-[#ad2b10] uppercase tracking-widest mt-1.5 bg-white px-2 py-0.5 rounded-full border border-[#ad2b10]/20">{task.actionType}</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-[#b58c4f] uppercase tracking-widest mb-1.5">TO TARGET SLOT</span>
                            <div className="w-12 h-12 rounded-xl bg-[#b58c4f]/15 border border-[#b58c4f]/40 flex items-center justify-center mb-1">
                                <Icons.CheckCircle size={20} className="text-[#b58c4f]" />
                            </div>
                            <span className="text-[12px] font-mono font-black text-[#212c46]">{task.recLoc}</span>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#eaeaec] space-y-2">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Reason for transfer:</span>
                            <span className="font-black text-[#212c46]">{task.reason}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-dashed border-gray-200 pt-2">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Est. Travel Savings:</span>
                            <span className="font-black text-[#657f4d] flex items-center gap-1">
                                <Icons.Clock size={12}/> {task.estSavings}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="button" onClick={() => { onConfirm(task.id); onClose(); }} className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.CheckCircle2 size={13}/> Authorize Transfer</button>
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function ZoneSlottingOpt() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'zone_settings' (Identical to UserPermissions Settings Registry Tab standards)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [velocityFilter, setVelocityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Zone standard expansion & confidentiality state (identical to UserPermissions state structure)
  const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true, 'ZONE-C': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'ZONE-A': false, 'ZONE-B': false, 'ZONE-C': false, 'COLD-RM': true });

  // Safety stock configurations (synced standards with UserPermissions)
  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'ZONE-A', name: 'Zone A (Beverage Rack)', safetyStockFloor: 1000, activeAllocation: true, isConfidential: false, description: 'อัครคลังสินค้ากลุ่มเครื่องดื่ม ตรวจสอบ SOH ตลอด' },
    { id: 'ZONE-B', name: 'Zone B (Dry Food Rack)', safetyStockFloor: 1500, activeAllocation: true, isConfidential: false, description: 'โซนคลังอาหารแห้งและกึ่งสำเร็จรูป บำรุงรักษาอุณหภูมิห้องมาตรฐาน' },
    { id: 'ZONE-C', name: 'Zone C (Household Goods Room)', safetyStockFloor: 500, activeAllocation: true, isConfidential: false, description: 'โซนจัดหมวดเคมีภัณฑ์ทำความสะอาด ของใช้ในบ้าน ปลอดจากจุดสัมผัสอาหาร' },
    { id: 'COLD-RM', name: 'Cold Storage Room (Frozen)', safetyStockFloor: 100, activeAllocation: false, isConfidential: true, description: 'ห้องควบคุมการแช่แข็งอุณหภูมิพิเศษ ล็อกสิทธิ์เบิกจ่ายผ่าน RFID เท่านั้น' }
  ]);

  // Original dataset 100% untouched
  const [slottingTasks, setSlottingTasks] = useState<any[]>([
    { id: 1, sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', category: 'Beverage', velocity: 'High', currentLoc: 'Z9-R45-L01 (Deep Reserve)', recLoc: 'Z1-R02-L01 (Pick Face)', actionType: 'Promote', estSavings: '2.5 mins/pick', reason: 'Sales spike (+150%)', status: 'Pending' },
    { id: 2, sku: 'SKU-8805', name: 'Sunlight Lemon 500ml', category: 'Household', velocity: 'Low', currentLoc: 'Z1-R01-L02 (Pick Face)', recLoc: 'Z7-R30-L04 (High Rack)', actionType: 'Demote', estSavings: 'Free up prime slot', reason: 'Dead stock (>90 days)', status: 'Pending' },
    { id: 3, sku: 'SKU-8811', name: 'M-150 Energy Drink', category: 'Beverage', velocity: 'High', currentLoc: 'Z4-R10-L01 (Mid Zone)', recLoc: 'Z1-R03-L01 (Pick Face)', actionType: 'Promote', estSavings: '1.8 mins/pick', reason: 'Consistently fast mover', status: 'Completed' },
    { id: 4, sku: 'SKU-8820', name: 'Winter Jacket 2025', category: 'Apparel', velocity: 'Low', currentLoc: 'Z2-R05-L01 (Prime Zone)', recLoc: 'Z9-R50-L05 (Deep Reserve)', actionType: 'Demote', estSavings: 'Free up prime slot', reason: 'Out of season', status: 'Pending' },
    { id: 5, sku: 'SKU-8804', name: 'Lays Classic 73g', category: 'Food', velocity: 'Medium', currentLoc: 'Z1-R04-L01 (Pick Face)', recLoc: 'Z3-R08-L02 (Standard)', actionType: 'Adjust', estSavings: 'Better grouping', reason: 'Category consolidation', status: 'Pending' },
    { id: 6, sku: 'SKU-8833', name: 'Ovaltine 400g', category: 'Beverage', velocity: 'High', currentLoc: 'Z8-R40-L01 (Reserve)', recLoc: 'Z1-R02-L02 (Pick Face)', actionType: 'Promote', estSavings: '3.0 mins/pick', reason: 'New promotion active', status: 'Pending' },
  ]);

  const [executeModal, setExecuteModal] = useState<any>({ isOpen: false, data: null });

  const handleSaveSafetyConfig = (zoneId: string, updatedFloor: number) => {
    setZoneConfigs(prev => prev.map(zone => zone.id === zoneId ? { ...zone, safetyStockFloor: updatedFloor } : zone));
  };

  const handleToggleConfidentiality = (zoneId: string) => {
    setConfidentialityMap((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const handleToggleExpandZone = (zoneId: string) => {
    setExpandedZones((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
  };

  const handleConfirmExecutedMove = (taskId: number) => {
    setSlottingTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
  };

  const handleAutoRunOptimization = () => {
    // Generate simulated recommendation preserving 100% of required formatting
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    const newRecommendation = {
      id: slottingTasks.length + 1,
      sku: `SKU-${randomNum}`,
      name: 'Simulated Optimized SKU Unit',
      category: 'Beverage',
      velocity: 'High',
      currentLoc: 'Z5-R20-L01 (Mid Zone)',
      recLoc: 'Z1-R01-L08 (Pick Face)',
      actionType: 'Promote',
      estSavings: '2.0 mins/pick',
      reason: 'Optimize path proximity',
      status: 'Pending'
    };
    setSlottingTasks(prev => [newRecommendation, ...prev]);
  };

  // KPIs Calculations
  const pendingCount = useMemo(() => slottingTasks.filter(t => t.status === 'Pending').length, [slottingTasks]);
  const completedCount = useMemo(() => slottingTasks.filter(t => t.status === 'Completed').length, [slottingTasks]);
  const highVelocityCount = useMemo(() => slottingTasks.filter(t => t.velocity === 'High' && t.actionType === 'Promote').length, [slottingTasks]);
  const efficiencySavingValue = "12.5 hrs/wk";

  // Filtering
  const filteredSlottingData = useMemo(() => {
    return slottingTasks.filter(item => {
      const matchSearch = item.sku.toLowerCase().includes(search.toLowerCase()) || 
                          item.name.toLowerCase().includes(search.toLowerCase());
      const matchVelocity = velocityFilter === 'All' || item.velocity === velocityFilter;
      return matchSearch && matchVelocity;
    });
  }, [slottingTasks, search, velocityFilter]);

  const currentData = filteredSlottingData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSlottingData.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ExecuteMoveModal isOpen={executeModal.isOpen} onClose={() => setExecuteModal({isOpen: false, data: null})} task={executeModal.data} onConfirm={handleConfirmExecutedMove} />

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.ArrowRightLeft size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      ZONE & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">SLOTTING OPT.</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          WAREHOUSE LOCATION OPTIMIZATION, ROUTING CONTROLS & SECURITY NODES
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Slotting Registry
                  </button>
                  <button onClick={() => setActiveTab('zone_settings')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'zone_settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> Zone Controls
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (Sleek Compact Lean Padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Pending Moves" value={formatNumber(pendingCount)} icon={Icons.Move} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Awaiting Transfer" />
                <KpiCard label="Executed Opt." value={formatNumber(completedCount)} icon={Icons.CheckSquare} colorAccent={THEME.success} colorValue={THEME.success} desc="Post Adjusted" />
                <KpiCard label="High Velocity Items" value={highVelocityCount} icon={Icons.Zap} colorAccent={THEME.accent} colorValue={THEME.accent} desc="Promoted in Row" />
                <KpiCard label="Est. Walk Saved" value={efficiencySavingValue} icon={Icons.Clock} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Time Optimized" />
            </div>

            {activeTab === 'registry' ? (
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn">
                    
                    {/* TABLE TOOLBAR AND FILTERS */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
                            {/* Velocity Filter */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Activity size={14} className="text-[#606a5f]" />
                                <select 
                                    value={velocityFilter} 
                                    onChange={(e) => { setVelocityFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">All Velocities</option>
                                    <option value="High">High Velocity (A)</option>
                                    <option value="Medium">Medium Velocity (B)</option>
                                    <option value="Low">Low Velocity (C)</option>
                                </select>
                            </div>

                            <button onClick={handleAutoRunOptimization} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Play size={14} /> Run Auto-Slotting AI
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
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รหัสสินค้า / รายละเอียดสินค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ความถี่ในการเคลื่อนไหว (Velocity)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ตำแหน่งจัดเก็บปัจจุบัน</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">คำแนะนำตำแหน่งจัดเก็บโดย AI</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">งานที่ต้องดำเนินการ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ผลกระทบ / อัตราประหยัด</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">แผนการดำเนินการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="font-mono font-black text-[#3f809e] text-[12px]">{item.sku}</div>
                                            <div className="font-bold text-[#212c46] text-[12px] truncate max-w-[220px]">{item.name}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <VelocityBadge velocity={item.velocity} />
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-mono font-black text-[#212c46] text-[12px]">
                                            <div className="flex items-center gap-2 bg-[#f3f3f1]/60 border border-[#eaeaec] px-2 py-0.5 rounded shadow-inner w-max">
                                                <Icons.Package size={12} className="text-slate-400" />
                                                <span className={item.status === 'Completed' ? 'line-through text-slate-400' : ''}>{item.currentLoc}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-mono font-black text-[#212c46] text-[12px]">
                                            <div className="flex items-center gap-2 bg-[#b58c4f]/10 border border-[#b58c4f]/30 px-2 py-0.5 rounded shadow-sm w-max">
                                                <Icons.Target size={12} className="text-[#b58c4f]" />
                                                <span>{item.recLoc}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <ActionBadge action={item.actionType} />
                                        </td>
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="font-mono font-black text-[#133951] text-[12px]">{item.estSavings}</div>
                                            <div className="font-bold text-slate-400 text-[11px] truncate max-w-[150px]">{item.reason}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                {item.status === 'Pending' ? (
                                                    <button 
                                                        onClick={() => setExecuteModal({ isOpen: true, data: item })}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f3f3f1] text-[#b58c4f] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                        title="Execute Transfer Slot"
                                                    >
                                                        <Icons.Play size={13} />
                                                    </button>
                                                ) : (
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/30" title="Transfer Completed">
                                                        <Icons.Check size={14} strokeWidth={3} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No optimization slotting rules match filtered parameters.
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono">Count: {filteredSlottingData.length}</p>
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
                                    <span className="font-black text-white">3,100 Base Units</span>
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
                                                title={confidentialityMap[zone.id] ? "Lock Zone Configuration" : "Make Zone Public"}
                                            >
                                                {confidentialityMap[zone.id] ? <Icons.Lock size={15}/> : <Icons.Eye size={15}/>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expandable Safety target details identical to module sub-items permissions */}
                                    {expandedZones[zone.id] && (
                                        <div className="ml-12 pl-4 py-2 space-y-3 bg-[#fcfbf9]/50 rounded-2xl border border-dashed border-[#eaeaec] p-4 animate-fadeIn">
                                            <p className="text-[11px] text-[#7a8b95] font-black uppercase tracking-widest leading-none mb-1">Configuration Guidelines:</p>
                                            <p className="text-[12px] font-bold text-[#606a5f] leading-relaxed italic">{zone.description}</p>
                                            
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-[#eaeaec]">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="flex justify-between items-center text-[11px] font-black text-[#212c46] uppercase mb-1">
                                                        <span>SAFETY STOCK LIMIT</span>
                                                        <span className="text-[#3f809e] font-mono">{formatNumber(zone.safetyStockFloor)} Unit SOH</span>
                                                    </div>
                                                    <input 
                                                        type="range" 
                                                        min="100" 
                                                        max="3000" 
                                                        step="100"
                                                        value={zone.safetyStockFloor} 
                                                        onChange={(e) => handleSaveSafetyConfig(zone.id, parseInt(e.target.value))}
                                                        className="w-full accent-[#212c46] cursor-pointer" 
                                                    />
                                                </div>

                                                <div className="flex items-center gap-3 w-full sm:w-auto pt-2 sm:pt-0">
                                                    <div className="text-left">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase leading-none block mb-1">Active Routings Status</span>
                                                        <span className="text-[11px] font-black uppercase tracking-wider block text-[#212c46]">
                                                            {zone.activeAllocation ? 'Enabled / Auto-Optimizer Flow' : 'External Locked'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => {
                                                            setZoneConfigs(prev => prev.map(z => z.id === zone.id ? { ...z, activeAllocation: !z.activeAllocation } : z));
                                                        }}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${zone.activeAllocation ? 'bg-[#657f4d] text-white' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}
                                                    >
                                                        {zone.activeAllocation ? 'Pause Slot' : 'Run Slot'}
                                                    </button>
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
