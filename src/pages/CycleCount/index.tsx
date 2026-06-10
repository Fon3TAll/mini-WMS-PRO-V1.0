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

// --- KPI Card Components (Sleek Compact Lean Padding) ---
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

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Completed': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Counting': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Discrepancy': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
    case 'Pending': 
      style = { bg: '#7a8b9515', color: THEME.indigo, border: '#7a8b9530' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

// --- Modals & User Guides ---

// Detailed User Guide Panel (Meticulously Detailed with Tight Lean Padding)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> CYCLE COUNT SYSTEM GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Inventory Tracking, Zone Safety, and Allocation Policies</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. Warehouse Zones & Access Restrictions
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ระบบคลังสินค้าแบ่งโซนจัดเก็บตามคุณลักษณะและอุณหภูมิ เพื่อป้องกันความเสียหายของสินค้าและเพิ่มความรวดเร็วในการจัดเตรียมสินค้า (Smart Slotting Alignment):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Public Zones:</strong> โซนกระจายสินค้าปรกติ เปิดให้พนักงานเบิกหยิบสินค้าทั่วไปตามใบสั่งจ้างมาตรฐาน (Picking Execution standard)</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Rack Allocation:</strong> โซนล็อกสินค้าและควบคุมอุณหภูมิ ที่กำหนดความเร็วสูงสุดของการเข้าถึงและสงวนสิทธิ์แก่เจ้าหน้าที่เฉพาะกลุ่ม</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Award size={13} className="text-[#d96245]"/> 2. Safety stock floor thresholds
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">มาตรฐานการควบคุมปริมาณสินค้าคงคลังสำรองเพื่อความปลอดภัยจัดจำหน่าย (Safety Inventory Target Floor) ป้องกันสินค้าขาดแคลน:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-bold text-[#414757]">
                <li><strong className="text-[#657f4d]">Healthy Stock (ระดับปกติ):</strong> ปริมาณสะสมเพียงพอต่อคำสั่งซื้อ (SOH สูงกว่าระดับ Safety Threshold ที่ระบุไว้รายโซน)</li>
                <li><strong className="text-[#b58c4f]">Near Expiry Alert:</strong> แจ้งเตือนสัญลักษณ์เมื่อสินค้าจัดเก็บในลักษณะระบุวันหมดอายุใกล้ล่วงลับ 30-90 วัน</li>
                <li><strong className="text-[#932c2e]">Dead Stock Detection:</strong> สำหรับกลุ่มสินค้าที่ขาดการเบิกจ่ายเคลื่อนไหว เกิน 180 วัน ระบบจะแจ้งเตือนเพื่อเคลียร์พื้นที่</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. Live Inventory Synchronization & Cycle Count
            </h4>
            <p className="text-[11px] font-bold text-[#615e65]">การตั้งค่า Safety Stock Limits และการเปลี่ยนแปลงระดับความปลอดภัยโซนในหน้านี้จะทำการประสานข้อมูลตรงประสานงานหน้า Dynamic Sidebar และศูนย์อัพเดทสต๊อกกลางแบบ Real-time เจ้าหน้าที่เบิกจ่ายสามารถส่องตรวจสอบความถูกต้องการนับได้ทันที</p>
          </section>
        </div>
        
        <div className="p-2 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// Execute Count Modal wrapped in DraggableModal system
function ExecuteCountModal({ isOpen, onClose, task, onSave }: any) {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        if (isOpen && task) {
            setItems([
                { sku: 'SKU-8801', name: 'Nescafe Red Cup 380g (เนสกาแฟ)', systemQty: 15200, actualQty: '', unit: 'Units' },
                { sku: 'SKU-8802', name: 'Singha Water 600ml Pack 12', systemQty: 450, actualQty: '', unit: 'Units' },
                { sku: 'SKU-8803', name: 'Mama Tom Yum Shrimp (มาม่า)', systemQty: 0, actualQty: '', unit: 'Units' },
            ]);
        }
    }, [isOpen, task]);

    if (!isOpen || !task) return null;

    const handleActualChange = (index: number, val: string) => {
        const next = [...items];
        next[index].actualQty = val;
        setItems(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Calculate dynamic matching stats or variance
        let hasNoMatch = false;
        items.forEach(item => {
            const actualNum = item.actualQty !== '' ? parseInt(item.actualQty) : 0;
            if (actualNum !== item.systemQty) {
                hasNoMatch = true;
            }
        });
        const finalStatus = hasNoMatch ? 'Discrepancy' : 'Completed';
        const finalAccuracy = hasNoMatch ? 95.5 : 100.0;
        
        onSave({
            ...task,
            progress: 100,
            status: finalStatus,
            accuracy: finalAccuracy
        });
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[620px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Scale className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">EXECUTE COUNT: {task.taskId}</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase leading-none mb-1">Target Location Zone</p>
                            <h4 className="text-[12px] font-black text-[#212c46] leading-none uppercase">{task.zone}</h4>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase leading-none mb-1">Scope Items count</p>
                            <span className="text-[14px] font-black text-[#212c46] font-mono">{task.itemsCount} SKUs</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1 block">Live Count Execution Ledger</label>
                        <div className="border border-[#eaeaec] rounded-xl overflow-hidden divide-y divide-[#eaeaec]">
                            {items.map((item, idx) => (
                                <div key={idx} className="p-3 bg-white hover:bg-[#fcfbf9]/50 flex justify-between items-center gap-4">
                                    <div className="min-w-[120px] max-w-[280px]">
                                        <span className="text-[10px] font-mono font-black text-[#3f809e] uppercase block">{item.sku}</span>
                                        <span className="text-[11px] font-bold text-[#212c46] truncate block">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-[#7a8b95] uppercase block leading-none mb-0.5">Book Qty</span>
                                            <span className="text-[12px] font-black text-[#606a5f] font-mono">{formatNumber(item.systemQty)}</span>
                                        </div>
                                        <div className="w-[110px]">
                                            <span className="text-[9px] font-black text-[#503447] uppercase block leading-none mb-0.5 text-right pr-2">Actual count</span>
                                            <input 
                                                required
                                                type="number"
                                                min="0"
                                                placeholder="Count Qty"
                                                value={item.actualQty}
                                                onChange={e => handleActualChange(idx, e.target.value)}
                                                className="w-full px-2 py-1 bg-[#fcfbf9]/80 border border-[#eaeaec] rounded-lg text-right font-black text-[12px] outline-none focus:border-[#b7a159]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.CheckCircle2 size={13}/> Post Count results</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function CycleCount() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'count_settings'
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Settings standard configurations (identical to UserPermissions)
  const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true, 'ZONE-C': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'ZONE-A': false, 'ZONE-B': false, 'ZONE-C': false, 'COLD-RM': true });

  const [cycleCounts, setCycleCounts] = useState<any[]>([
    { id: 1, taskId: 'CC-2605-001', zone: 'Zone A - Beverage', itemsCount: 45, progress: 100, status: 'Completed', assignedTo: 'Somchai S.', dueDate: '2026-05-06', accuracy: 100 },
    { id: 2, taskId: 'CC-2605-002', zone: 'Zone B - Food', itemsCount: 120, progress: 65, status: 'Counting', assignedTo: 'Suda M.', dueDate: '2026-05-07', accuracy: null },
    { id: 3, taskId: 'CC-2605-003', zone: 'Zone C - Household', itemsCount: 30, progress: 100, status: 'Discrepancy', assignedTo: 'Wichai T.', dueDate: '2026-05-06', accuracy: 96.5 },
    { id: 4, taskId: 'CC-2605-004', zone: 'Cold Room 1', itemsCount: 15, progress: 0, status: 'Pending', assignedTo: 'Unassigned', dueDate: '2026-05-08', accuracy: null },
    { id: 5, taskId: 'CC-2605-005', zone: 'Zone D - Cosmetics', itemsCount: 85, progress: 100, status: 'Completed', assignedTo: 'Prapa K.', dueDate: '2026-05-05', accuracy: 100 },
    { id: 6, taskId: 'CC-2605-006', zone: 'Zone E - Electronics', itemsCount: 40, progress: 100, status: 'Discrepancy', assignedTo: 'Somchai S.', dueDate: '2026-05-05', accuracy: 92.0 },
    { id: 7, taskId: 'CC-2605-007', zone: 'Zone F - Apparel', itemsCount: 200, progress: 15, status: 'Counting', assignedTo: 'Suda M.', dueDate: '2026-05-09', accuracy: null },
    { id: 8, taskId: 'CC-2605-008', zone: 'Zone A - Rack 12', itemsCount: 10, progress: 0, status: 'Pending', assignedTo: 'Unassigned', dueDate: '2026-05-08', accuracy: null },
  ]);

  // Sync safety floor zone configurations (synced standards with UserPermissions)
  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'ZONE-A', name: 'Zone A (Beverage Rack)', safetyStockFloor: 1000, activeAllocation: true, isConfidential: false, description: 'อัครคลังสินค้ากลุ่มเครื่องดื่ม ตรวจสอบ SOH ตลอด' },
    { id: 'ZONE-B', name: 'Zone B (Dry Food Rack)', safetyStockFloor: 1500, activeAllocation: true, isConfidential: false, description: 'โซนคลังอาหารแห้งและกึ่งสำเร็จรูป บำรุงรักษาอุณหภูมิห้องมาตรฐาน' },
    { id: 'ZONE-C', name: 'Zone C (Household Goods Room)', safetyStockFloor: 500, activeAllocation: true, isConfidential: false, description: 'โซนจัดหมวดเคมีภัณฑ์ทำความสะอาด ของใช้ในบ้าน ปลอดจากจุดสัมผัสอาหาร' },
    { id: 'COLD-RM', name: 'Cold Storage Room (Frozen)', safetyStockFloor: 100, activeAllocation: false, isConfidential: true, description: 'ห้องควบคุมการแช่แข็งอุณหภูมิพิเศษ ล็อกสิทธิ์เบิกจ่ายผ่าน RFID เท่านั้น' }
  ]);

  const [executeModal, setExecuteModal] = useState<any>({ isOpen: false, data: null });

  const handleSaveSafetyConfig = (zoneId: string, updatedFloor: number) => {
    setZoneConfigs(prev => prev.map(zone => zone.id === zoneId ? { ...zone, safetyStockFloor: updatedFloor } : zone));
  };

  const handleSaveExecutedTask = (savedTask: any) => {
    setCycleCounts(prev => prev.map(task => task.id === savedTask.id ? { ...task, ...savedTask } : task));
  };

  const handleCreateNewManual = () => {
    const randomTaskId = `CC-2605-${Math.floor(Math.random() * 900) + 100}`;
    const newItem = {
      id: cycleCounts.length + 1,
      taskId: randomTaskId,
      zone: 'Zone B - Room 14',
      itemsCount: 24,
      progress: 0,
      status: 'Pending',
      assignedTo: 'Unassigned',
      dueDate: new Date().toISOString().split('T')[0],
      accuracy: null
    };
    setCycleCounts(prev => [newItem, ...prev]);
  };

  // KPIs Calculations
  const activeSohSum = useMemo(() => cycleCounts.length, [cycleCounts]);
  const completedTaskSum = useMemo(() => cycleCounts.filter(t => t.status === 'Completed').length, [cycleCounts]);
  const discrepancyTaskSum = useMemo(() => cycleCounts.filter(t => t.status === 'Discrepancy').length, [cycleCounts]);
  const overallAccuracy = "98.2%";

  // Filters
  const filteredCycleCounts = useMemo(() => {
    return cycleCounts.filter(item => {
      const matchSearch = item.taskId.toLowerCase().includes(search.toLowerCase()) || 
                          item.zone.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [cycleCounts, search, statusFilter]);

  const currentData = filteredCycleCounts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredCycleCounts.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => {
    setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleExpand = (id: string) => {
    setExpandedZones((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <ExecuteCountModal isOpen={executeModal.isOpen} onClose={() => setExecuteModal({isOpen: false, data: null})} task={executeModal.data} onSave={handleSaveExecutedTask} />

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.RefreshCw size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      CYCLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">COUNT</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          CONTINUOUS INVENTORY AUDITING, RECONCILIATION PROCEDURES & SECURITY NODES
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Count Registry
                  </button>
                  <button onClick={() => setActiveTab('count_settings')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'count_settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> Settings Node
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (Sleek Compact Lean Padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Total Count Plans" value={formatNumber(activeSohSum)} icon={Icons.ClipboardList} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Tasks Triggered" />
                <KpiCard label="Completed Audits" value={formatNumber(completedTaskSum)} icon={Icons.CheckSquare} colorAccent={THEME.success} colorValue={THEME.success} desc="Post Adjusted" />
                <KpiCard label="Discrepancies found" value={discrepancyTaskSum} icon={Icons.AlertTriangle} colorAccent={THEME.accent} colorValue={THEME.accent} desc="Investigation Req" />
                <KpiCard label="System Accuracy" value={overallAccuracy} icon={Icons.Scan} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Book vs Actual" />
            </div>

            {activeTab === 'registry' ? (
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn">
                    
                    {/* TABLE TOOLBAR AND FILTERS */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
                            {/* Status Filter */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Activity size={14} className="text-[#606a5f]" />
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">All Status Levels</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Counting">Counting</option>
                                    <option value="Discrepancy">Discrepancy</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>

                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Count Plan
                            </button>
                        </div>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search Task ID or Location..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC LIST TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รหัสงานตรวจนับ (Task ID)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ขอบเขตตำแหน่งชั้นวาง (Location)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">จำนวนรายการที่ระบุ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ความคืบหน้าในการนับ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">พนักงานผู้รับมอบหมาย</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ความถูกต้องแม่นยำ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">กำหนดวันแล้วเสร็จ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#3f809e] text-[12px] text-left">{item.taskId}</td>
                                        <td className="py-2.5 px-4 font-black text-[#212c46] text-[12px] text-left">{item.zone}</td>
                                        <td className="py-2.5 px-4 font-extrabold text-[#212c46] text-[12px] text-center font-mono">{item.itemsCount} SKUs</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex items-center gap-2 justify-center">
                                                <div className="w-16 h-1.5 bg-[#eaeaec] rounded-full overflow-hidden shadow-inner shrink-0">
                                                    <div className="h-full bg-[#3f809e] transition-all" style={{ width: `${item.progress}%` }}></div>
                                                </div>
                                                <span className="text-[11px] font-mono font-black text-[#7a8b95] leading-none">{item.progress}%</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-semibold text-[#212c46] text-[12px]">
                                            <div className="flex items-center gap-1.5">
                                                <Icons.User size={12} className="text-[#b58c4f]" /> {item.assignedTo}
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center font-mono font-black text-[12px]">
                                            {item.accuracy !== null ? (
                                                <span className={item.accuracy === 100 ? 'text-[#657f4d]' : 'text-[#a94228]'}>{item.accuracy}%</span>
                                            ) : (
                                                <span className="text-[#7a8b95]">-</span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-center font-mono font-bold text-[#7a8b95] text-[12px]">{item.dueDate}</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                {item.status === 'Pending' || item.status === 'Counting' ? (
                                                    <button 
                                                        onClick={() => setExecuteModal({ isOpen: true, data: item })}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f3f3f1] text-[#b58c4f] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                        title="Execute Count Scan"
                                                    >
                                                        <Icons.Play size={13} />
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => setExecuteModal({ isOpen: true, data: item })}
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f3f3f1] text-[#212c46] border border-[#eaeaec] hover:border-[#3f809e] hover:text-white hover:bg-[#3f809e] transition-all active:scale-95"
                                                        title="Review Snapshot count"
                                                    >
                                                        <Icons.Eye size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No count plans match filtered properties.
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono">Count: {filteredCycleCounts.length}</p>
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
                                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.MapPin size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-[#212c46] text-[12px] uppercase tracking-wider">{zone.name}</span>
                                                    <button onClick={() => toggleExpand(zone.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
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
                                                onClick={() => toggleConfidentiality(zone.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[zone.id] ? "Unlock Public Access Limit" : "Lock / RESTRICT Zone Access"}
                                            >
                                                {confidentialityMap[zone.id] ? <Icons.Lock size={14} /> : <Icons.Unlock size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Form Panel */}
                                    {expandedZones[zone.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner space-y-3 animate-fadeIn text-left text-[12px]">
                                            <p className="text-[#615e65] font-semibold text-[11px] italic leading-relaxed">{zone.description}</p>
                                            <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec]/60 pt-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Safety Stock Threshold (Units Floor)</label>
                                                    <input 
                                                        type="number"
                                                        value={zone.safetyStockFloor}
                                                        onChange={e => handleSaveSafetyConfig(zone.id, parseInt(e.target.value) || 0)}
                                                        className="w-full bg-white border border-[#eaeaec]/80 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#212c46] outline-none focus:border-[#4d87a8] shadow-sm" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Standard Area Status</label>
                                                    <div className="text-[12px] font-black text-[#657f4d] uppercase tracking-wider flex items-center gap-1.5 h-8 mt-1">
                                                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span> SYSTEM MONITORED
                                                    </div>
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
