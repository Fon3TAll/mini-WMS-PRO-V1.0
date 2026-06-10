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

// --- Small Badges (11px exactly like requested) ---
const PriorityBadge = ({ priority }: { priority: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (priority) {
    case 'Urgent': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
    case 'High': 
      style = { bg: '#d9624515', color: THEME.burntOrange, border: '#d9624530' }; 
      break;
    case 'Medium': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Low': 
      style = { bg: '#7a8b9515', color: THEME.dustyBlue, border: '#7a8b9530' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border font-sans" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Completed': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Processing': 
      style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; 
      break;
    case 'Pending': 
      style = { bg: '#7a8b9515', color: THEME.dustyBlue, border: '#7a8b9530' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border font-sans" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      {status}
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> REPLENISHMENT GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Pick-face Stocking & Minimum SOH Procedures</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. หลักการและความจำเป็นของระบบ Replenishment
            </h4>
            <p className="text-[11px] mb-1.5 font-bold text-[#615e65]">ช่วยแก้ไขปัญหายอดเบิกจ่ายขัดข้องหรือสต๊อกหน้าชั้นวางหยิบ (Pick Face) ตกกระชั้นต่ำกว่ายอดวิกฤต โดยมีเงื่อนไขดังนี้:</p>
            <ul className="list-none pl-0 space-y-1.5">
                <li className="flex items-start gap-1.5 bg-[#f8f9fa] p-1.5 rounded border border-[#eaeaec] shadow-sm">
                  <Icons.Zap size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[10px]"><strong className="text-[#3f809e] font-black">Min-SOH Trigger:</strong> ค่าสินค้าจะถูกเทียบกับค่ากำหนด Reorder SOH ตลอดเวลาเพื่อส่งสัญญาณเตือนอย่างทันทีสม่ำเสมอ</div>
                </li>
                <li className="flex items-start gap-1.5 bg-[#932c2e]/5 p-1.5 rounded border border-[#932c2e]/10 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[10px]"><strong className="text-[#ce1c16] font-black">Routings Guard:</strong> คลุมความปลอดภัยทางเข้าเฉพาะห้องควบคุมความแช่แข็งหรืออุณหภูมิวิเศษไม่ให้ปะปนกับคลังส่วนปรกติ</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.FileText size={13} className="text-[#d96245]"/> 2. ลำดับวิกฤตและหน้าที่การจัดส่ง
            </h4>
            <p className="text-[11px] mb-1.5 font-bold text-[#615e65]">การตั้งค่าระดับความด่วนของภารกิจส่งเสริมคลังสต๊อก (Refill Tasks):</p>
            <ul className="list-disc pl-4 space-y-1 text-[10px] font-bold text-[#414757]">
                <li><strong className="text-[#932c2e]">Urgent (เร่งด่วน):</strong> สินต้าหน้าชั้นหยิบหมดสภาพ ต้องโอนย้ายทันที มีผลพลอยให้พนักงานเบิกชะงักห้ามรอ</li>
                <li><strong className="text-[#d96245]">High (ความถี่สูง):</strong> สต๊อกตกลงช่วง Safety จุดต่ำกว่าความกำหนดมาตรฐาน ควรเติมเต็มใน 30 นาที</li>
                <li><strong className="text-[#3f809e]">Regular/Low:</strong> ปฏิบัติการประจุประจำกะหรือเติมสินค้าตามลำดับการผลิตเบื้องหลังปรกติ</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. ระบบซิงค์ข้อมูลส่วนกลาง (WMS Cloud Auto-Sync)
            </h4>
            <p className="text-[10px] font-bold text-[#615e65]">ระบบทำการเชื่อมโยงหน้าต่างตรวจการตั้งค่า Reorder Points แบบคงที่ หากปรับเปลี่ยนค่า Safety Min/Max ที่ตารางควบคุม ระบบจะเร่งสร้างแผนงานใบเบิกทันท่วงที</p>
          </section>
        </div>
        
        <div className="p-1.5 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-1 bg-[#212c46] text-white font-black rounded uppercase text-[10px] hover:bg-[#414757] transition-all shadow tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// Execute Task Detail Modal wrapped in DraggableModal system
function TaskDetailModal({ isOpen, onClose, task, onConfirm }: any) {
    if (!isOpen || !task) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[550px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Boxes className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">REPLENISHMENT TASK: {task.taskId}</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans text-[12px]">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-1">
                        <h4 className="text-[14px] font-black text-[#212c46] uppercase mb-1">{task.name}</h4>
                        <div className="flex justify-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">SKU: {task.sku}</span>
                            <PriorityBadge priority={task.priority} />
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 border border-[#eaeaec] rounded-xl relative shadow-inner">
                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">FROM BULK STORAGE</span>
                            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center mb-1">
                                <Icons.MoveDown size={20} className="text-slate-400" />
                            </div>
                            <span className="text-[12px] font-mono font-black text-[#212c46]">{task.fromLoc}</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-[#ad2b10] text-white flex items-center justify-center shadow-md animate-pulse">
                                <Icons.ArrowDownToLine size={16} />
                            </div>
                            <span className="text-[9px] font-black text-[#ad2b10] uppercase tracking-widest mt-1.5 bg-white px-2 py-0.5 rounded-full border border-[#ad2b10]/20">TRANSFER</span>
                        </div>

                        <div className="flex-1 flex flex-col items-center text-center">
                            <span className="text-[9px] font-black text-[#b58c4f] uppercase tracking-widest mb-1.5">TO TARGET PICK FACE</span>
                            <div className="w-12 h-12 rounded-xl bg-[#b58c4f]/15 border border-[#b58c4f]/40 flex items-center justify-center mb-1">
                                <Icons.CheckCircle size={20} className="text-[#b58c4f]" />
                            </div>
                            <span className="text-[12px] font-mono font-black text-[#212c46]">{task.toLoc}</span>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#eaeaec] space-y-2">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Quantity To Refill:</span>
                            <span className="font-black text-[#212c46]">{task.qty} {task.unit}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-dashed border-gray-200 pt-2">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Assigned Operator:</span>
                            <span className="font-black text-[#657f4d] flex items-center gap-1">
                                <Icons.User size={12}/> {task.assignedTo}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    {task.status !== 'Completed' && (
                        <button type="button" onClick={() => { onConfirm(task.id); onClose(); }} className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.CheckCircle2 size={13}/> Complete & Update SOH</button>
                    )}
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function Replenishment() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'zone_settings' (Identical to UserPermissions Settings Registry Tab standards)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Zone standard expansion & confidentiality state (identical to UserPermissions state structure)
  const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true, 'ZONE-C': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'ZONE-A': false, 'ZONE-B': false, 'ZONE-C': false, 'COLD-RM': true });

  // Custom configurations (Minimum SOH trigger and reorder parameters synced with standards)
  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'ZONE-A', name: 'Zone A (Beverage Rack)', safetyStockFloor: 1200, activeAllocation: true, isConfidential: false, description: 'อัครคลังสินค้ากลุ่มเครื่องดื่ม ตรวจสอบยอดสต๊อกเหลือก้นชั้นวางหยิบ' },
    { id: 'ZONE-B', name: 'Zone B (Dry Food Rack)', safetyStockFloor: 1800, activeAllocation: true, isConfidential: false, description: 'โซนคลังอาหารแห้ง มาตรฐานเติมสต๊อกคัดเลือกสินค้าขายส่ง' },
    { id: 'ZONE-C', name: 'Zone C (Household Goods Room)', safetyStockFloor: 600, activeAllocation: true, isConfidential: false, description: 'โซนจัดหมวดเคมีภัณฑ์ทำความสะอาด ชั้นหยิบเติมของเหลวถังสูบซับ' },
    { id: 'COLD-RM', name: 'Cold Storage Room (Frozen)', safetyStockFloor: 250, activeAllocation: false, isConfidential: true, description: 'ห้องแช่แข็งพิเศษ ล็อกควบคุมด้วยระบบความร้อนอัจฉริยะ' }
  ]);

  // Original dataset 100% untouched
  const [tasks, setTasks] = useState<any[]>([
    { id: 1, taskId: 'RPL-2605-001', sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', fromLoc: 'BULK-A-01-01', toLoc: 'PICK-Z1-R01', qty: 50, unit: 'Pallets', priority: 'Urgent', status: 'Pending', assignedTo: 'Wichai T.' },
    { id: 2, taskId: 'RPL-2605-002', sku: 'SKU-8811', name: 'M-150 Energy Drink', fromLoc: 'BULK-B-12-05', toLoc: 'PICK-Z1-R03', qty: 200, unit: 'Cases', priority: 'High', status: 'Processing', assignedTo: 'Somchai S.' },
    { id: 3, taskId: 'RPL-2605-003', sku: 'SKU-8804', name: 'Lays Classic 73g', fromLoc: 'BULK-B-08-02', toLoc: 'PICK-Z2-R05', qty: 80, unit: 'Cases', priority: 'Medium', status: 'Pending', assignedTo: 'Suda M.' },
    { id: 4, taskId: 'RPL-2605-004', sku: 'SKU-8806', name: 'Chang Beer 320ml Can', fromLoc: 'BULK-A-03-01', toLoc: 'PICK-Z1-R12', qty: 15, unit: 'Pallets', priority: 'Urgent', status: 'Completed', assignedTo: 'Prapa K.' },
    { id: 5, taskId: 'RPL-2605-005', sku: 'SKU-8809', name: 'Carnation Condensed Milk', fromLoc: 'BULK-B-10-04', toLoc: 'PICK-Z3-R02', qty: 120, unit: 'Cases', priority: 'Low', status: 'Pending', assignedTo: 'Unassigned' },
    { id: 6, taskId: 'RPL-2605-006', sku: 'SKU-8808', name: 'Breeze Excel Liquid', fromLoc: 'BULK-C-01-01', toLoc: 'PICK-Z4-R08', qty: 45, unit: 'Cases', priority: 'Medium', status: 'Processing', assignedTo: 'Somchai S.' },
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

  const handleConfirmTask = (taskId: number) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed' } : t));
  };

  const handleAutoTriggerSimulation = () => {
    const randomIdNum = Math.floor(Math.random() * 900) + 100;
    const randomSkuNum = Math.floor(Math.random() * 9000) + 1000;
    const simulatedTask = {
      id: tasks.length + 1,
      taskId: `RPL-2605-${randomIdNum}`,
      sku: `SKU-${randomSkuNum}`,
      name: 'Simulated Auto-Trigger Item',
      fromLoc: 'BULK-D-04-01',
      toLoc: 'PICK-Z2-R14',
      qty: 60,
      unit: 'Cases',
      priority: 'High',
      status: 'Pending',
      assignedTo: 'Autopicked Operator'
    };
    setTasks(prev => [simulatedTask, ...prev]);
  };

  // KPIs Calculations
  const pendingReplenishCount = useMemo(() => tasks.filter(t => t.status === 'Pending').length, [tasks]);
  const urgentReplenishCount = useMemo(() => tasks.filter(t => t.priority === 'Urgent' && t.status !== 'Completed').length, [tasks]);
  const completedTodayCount = useMemo(() => tasks.filter(t => t.status === 'Completed').length, [tasks]);
  const performanceEfficiencyValue = "14.2 min";

  // Filtering
  const filteredReplenishData = useMemo(() => {
    return tasks.filter(item => {
      const matchSearch = item.taskId.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase()) || 
                          item.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tasks, search, statusFilter]);

  const currentData = filteredReplenishData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredReplenishData.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <TaskDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} task={detailModal.data} onConfirm={handleConfirmTask} />

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.ArrowDownToLine size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      REPLENISHMENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">NODE</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          WAREHOUSE MINIMUM SOH CHECKS, REFILL PLANS & ACTIVE STOCK CORES
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Replenishing Registry
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
                <KpiCard label="Pending Replenishes" value={formatNumber(pendingReplenishCount)} icon={Icons.Clock} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Awaiting Transfer" />
                <KpiCard label="Urgent Stocks" value={formatNumber(urgentReplenishCount)} icon={Icons.Zap} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Immediate Refill Req." />
                <KpiCard label="Refilled Today" value={completedTodayCount} icon={Icons.CheckSquare} colorAccent={THEME.success} colorValue={THEME.success} desc="Post Adjusted Completed" />
                <KpiCard label="Avg. Effort Saved" value={performanceEfficiencyValue} icon={Icons.Clock} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Response Efficiency" />
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
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>

                            <button onClick={handleAutoTriggerSimulation} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Play size={14} /> Simulate Auto-Trigger
                            </button>
                        </div>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search Task ID, SKU or Item..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC LIST TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รหัสงาน / บาร์โค้ด</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ระดับความสำคัญ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รายการรหัสสินค้า / รายละเอียด</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">จากตำแหน่งสำรอง (Bulk)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ไปยังจุดจัดวางหยิบ (Pick Face)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำนวนที่เติม</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">ผู้รับผิดชอบ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">สถานะ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 text-left font-mono font-black text-[#3f809e] text-[12px]">
                                            {item.taskId}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <PriorityBadge priority={item.priority} />
                                        </td>
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="font-bold text-[#212c46] text-[12px] truncate max-w-[220px]">{item.name}</div>
                                            <div className="font-mono text-[10px] text-slate-400 font-bold">{item.sku}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-[#f3f3f1]/60 border border-[#eaeaec] px-2 py-0.5 rounded shadow-inner w-max mx-auto text-[12px] font-mono font-black text-[#212c46]">
                                                <Icons.Package size={12} className="text-slate-400" />
                                                <span>{item.fromLoc}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2 bg-[#b58c4f]/10 border border-[#b58c4f]/30 px-2 py-0.5 rounded shadow-sm w-max mx-auto text-[12px] font-mono font-black text-[#212c46]">
                                                <Icons.Target size={12} className="text-[#b58c4f]" />
                                                <span>{item.toLoc}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#133951] text-[12px]">
                                            {item.qty} <span className="text-[10px] text-slate-400 font-bold">{item.unit}</span>
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-bold text-slate-500 text-[12px]">
                                            <div className="flex items-center gap-1.5"><Icons.User size={12} className="text-[#a3a092]"/> {item.assignedTo}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 rounded flex items-center justify-center bg-[#f3f3f1] text-[#212c46] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                    title="View Detail"
                                                >
                                                    <Icons.Eye size={13} />
                                                </button>
                                                {item.status !== 'Completed' ? (
                                                    <button 
                                                        onClick={() => handleConfirmTask(item.id)}
                                                        className="w-8 h-8 rounded flex items-center justify-center bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/30 hover:border-[#657f4d] hover:text-white hover:bg-[#657f4d] transition-all active:scale-95"
                                                        title="Quick Complete Refill"
                                                    >
                                                        <Icons.Check size={13} strokeWidth={3} />
                                                    </button>
                                                ) : (
                                                    <div className="w-8 h-8 rounded flex items-center justify-center bg-[#657f4d]/5 text-[#657f4d]/40 border border-[#657f4d]/10" title="Transfer Completed">
                                                        <Icons.CheckCheck size={13} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No automated replenishment rules match filtered parameters.
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono font-bold text-[#212c46]">Count: {filteredReplenishData.length}</p>
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
                                <Icons.Layers size={18} className="text-[#b7a159]" /> REPLENISHMENT POLICY
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">MIN/MAX REORDER RULE</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        เม็ดระบบคำนวณปริมาณที่ขาดไปเพื่อให้พนักงานรถโพล์คสแกนขยับสินค้าพาเลทลงหน้าเชลฟ์อย่างลื่นไหลป้องกันการขาดวิกฤต (Automated Fallback Trigger)
                                    </p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">RESTRICTED LOCKED ACCESS</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        โซนแช่เย็นหรือกลุ่มสต๊อกสารเคมีมีความปลอดภัยสูง จำเป็นต้องล็อกปิดกั้นไม่ให้เกิดระบบซิงค์แบบอัตโนมัติภายนอก (Secure Operator Verification)
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
                                โซนและชั้นเติมทั้งหมดเชื่อมไปยังเซิร์ฟเวอร์หลักของ SMART WMS ตรวจผ่าน RFID ทันทีเมื่อสินค้าออกจากตำแหน่ง Bulk บันทึกประวัติชัดเจน
                            </p>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Restricted Locked:</span>
                                    <span className="font-black text-[#b7a159]">{Object.values(confidentialityMap).filter(v => v).length} Nodes Locked</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Standard Safety Min SOH:</span>
                                    <span className="font-black text-white">3,850 Units Checked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Settings Registry */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3">
                                <Icons.Settings size={20} className="text-[#b7a159]"/> REPLENISHMENT ZONE SETTINGS REGISTRY
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

                                    {/* Expandable Safety target details */}
                                    {expandedZones[zone.id] && (
                                        <div className="ml-12 pl-4 py-2 space-y-3 bg-[#fcfbf9]/50 rounded-2xl border border-dashed border-[#eaeaec] p-4 animate-fadeIn">
                                            <p className="text-[11px] text-[#7a8b95] font-black uppercase tracking-widest leading-none mb-1">Configuration Guidelines:</p>
                                            <p className="text-[12px] font-bold text-[#606a5f] leading-relaxed italic">{zone.description}</p>
                                            
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-[#eaeaec]">
                                                <div className="w-full sm:w-1/2">
                                                    <div className="flex justify-between items-center text-[11px] font-black text-[#212c46] uppercase mb-1">
                                                        <span>REORDER POINT (MIN SOH)</span>
                                                        <span className="text-[#3f809e] font-mono">{formatNumber(zone.safetyStockFloor)} Units SOH</span>
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
                                                        {zone.activeAllocation ? 'Pause Auto-Refill' : 'Active Auto-Refill'}
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
