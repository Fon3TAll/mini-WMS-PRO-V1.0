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

const formatCurrency = (val: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);

// --- Sub-components ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-3 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[92px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={80} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={15} />
            </div>
        </div>
        <div className="relative z-10 mt-0.5 flex items-end justify-between">
            <p className="text-[20px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const ApprovalStatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Completed': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Pending': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Rejected': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Create/Edit Service Fee Config Modal
function EditServiceModal({ isOpen, onClose, record, onSave }: any) {
    const [tempRecord, setTempRecord] = useState<any>({});

    useEffect(() => {
        if (isOpen && record) {
            setTempRecord(JSON.parse(JSON.stringify(record)));
        }
    }, [isOpen, record]);

    if (!isOpen || !record || !tempRecord) return null;

    const calculatedTotal = (parseFloat(tempRecord.qty) || 0) * (parseFloat(tempRecord.rate) || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...tempRecord,
            amount: calculatedTotal
        });
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Zap className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">CONFIGURE ACTIVITY RATE RULES</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.Receipt size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">SERVICE LOG REFERENCE ID</p>
                            <h4 className="text-[13px] font-black text-[#212c46] leading-none uppercase">{tempRecord.id}</h4>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Client Name / Partner Business</label>
                        <input 
                            required 
                            type="text"
                            value={tempRecord.client || ''} 
                            onChange={e => setTempRecord({...tempRecord, client: e.target.value})} 
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Activity Service Group</label>
                            <select 
                                value={tempRecord.serviceType || 'Unloading (ยกขึ้น)'} 
                                onChange={e => setTempRecord({...tempRecord, serviceType: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Unloading (ยกขึ้น)">Unloading (ยกขึ้น)</option>
                                <option value="Loading (ยกลง)">Loading (ยกลง)</option>
                                <option value="Labeling (ติดฉลาก)">Labeling (ติดฉลาก)</option>
                                <option value="Repackaging (แพ็คใหม่)">Repackaging (แพ็คใหม่)</option>
                                <option value="QC Inspection">QC Inspection</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Service Unit Measure</label>
                            <select 
                                value={tempRecord.unit || 'Pallets'} 
                                onChange={e => setTempRecord({...tempRecord, unit: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Pallets">Pallets</option>
                                <option value="Units">Units</option>
                                <option value="Boxes">Boxes</option>
                                <option value="Hours">Hours</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Activity Volume Quantity</label>
                            <input 
                                required 
                                type="number"
                                value={tempRecord.qty || ''} 
                                onChange={e => setTempRecord({...tempRecord, qty: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#a94228] uppercase ml-1">WMS Service Rate (THB)</label>
                            <input 
                                required 
                                type="number"
                                value={tempRecord.rate || ''} 
                                onChange={e => setTempRecord({...tempRecord, rate: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#a94228]/30 rounded-xl text-[12px] font-black outline-none focus:border-[#a94228] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl flex justify-between items-center border border-[#eaeaec]">
                        <div>
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase">Calculated Total Service Billing</p>
                            <span className="text-[18px] font-black text-[#212c46]">{formatCurrency(calculatedTotal)}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase">Approval Node State</p>
                            <span className="text-[14px] font-bold text-[#657f4d] uppercase">Auto Verified</span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Save Rates Configuration</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// 2. Comprehensive Detailed User Guide Panel (Tight lean padding, detailed similar to UserPermissions)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-sm"><Icons.BookOpen size={16} className="text-[#b7a159]"/> HANDLING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">WMS Handling & Service Rate Billing</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. Activity-Based Costing rules
            </h4>
            <p className="text-[11px] mb-1.5">ระบบจำแนกและประมวลผลอัตราค่าธรรมเนียมบริหารจัดการคลังแยกประเภท (Activity Rate Formula):</p>
            <ul className="list-none pl-0 space-y-1.5">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.TrendingUp size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Pallet Scale:</strong> บริการยกขึ้น (Unloading) และ ยกลง (Loading) อ้างอิงขนาดพาเลทพาร์ทเนอร์อัตรา 85 บาท/พาเลท</div>
                </li>
                <li className="flex items-start gap-2 bg-[#657f4d]/10 p-2 rounded-lg border border-[#657f4d]/30 shadow-sm">
                  <Icons.ArrowUpRight size={12} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#657f4d] font-black">Value-Add Piece:</strong> บริการติดฉลากห่อหุ้มกล่อง (Labeling/Repack) กำหนดอัตราต่อชิ้นเพื่อเก็บรักษาเป้ารายหัว</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn animate-delay-100">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Settings size={13} className="text-[#d96245]"/> 2. Service Rate Grades
            </h4>
            <p className="text-[11px] mb-1.5">ตารางประเมินสถานภาพและเงื่อนไขการเรียกเก็บในระบบ (Billing Classification):</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong className="text-[#657f4d]">Completed Stage:</strong> เอกสารค่าบริการได้รับการอนุมัติและทำจดหมายเรียกเก็บบิลรอบเดือนพร้อมส่งออก</li>
                <li><strong className="text-[#b58c4f]">Pending Verification:</strong> อยู่ระหว่างตรวจสอบทรานแซกชั่นโดยซูเปอร์ไวเซอร์คลังเพื่อยืนยันจำนวนชิ้น</li>
                <li><strong className="text-[#932c2e]">Rejected Deficit:</strong> บิลที่ถูกตรวจสอบแล้วพบค่าผิดเพี้ยน จะถูกตีกลับเพื่อรีโพสต์รายการใหม่</li>
            </ul>
          </section>

          <section className="animate-fadeIn animate-delay-200">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Lock size={13} className="text-[#3f809e]"/> 3. Configuration Security Flags
            </h4>
            <p className="text-[11px]">เจ้าหน้าที่ฝ่ายบัญชีสามารถทำการล็อคหรือปลดล็อคการจำกัดสิทธิ์ปรับลดอัตราค่าบริการของพาร์ทเนอร์รายตัวเพื่อความโปร่งใสและตรวจสอบได้</p>
          </section>
        </div>
        
        <div className="p-2.5 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Main Page Component ---
export default function HandlingServiceFees() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (Configs / Policies) or 'staff' (Calculations Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom states modeled identically to UserPermissions 
  const [expandedConfigurations, setExpandedConfigurations] = useState<any>({ 'RULE-UNLD': true, 'RULE-LBL': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'RULE-UNLD': false, 'RULE-LBL': false, 'RULE-QC': true });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });

  // Interactive Live Calculator fields
  const [calcQty, setCalcQty] = useState<number>(120);
  const [calcRate, setCalcRate] = useState<number>(85);
  const [calcType, setCalcType] = useState<string>('Unloading (ยกขึ้น)');
  const [calcUnit, setCalcUnit] = useState<string>('Pallets');

  // Exact 100% original mock examples preserved perfectly
  const [serviceLogs, setServiceLogs] = useState<any[]>([
    { id: 'HND-2605-001', client: 'Unilever Thailand', date: '2026-06-01', serviceType: 'Unloading (ยกขึ้น)', qty: 25, unit: 'Pallets', rate: 85, amount: 2125, status: 'Completed', recordedBy: 'Wichai T.' },
    { id: 'HND-2605-002', client: 'CP All Public Co.', date: '2026-06-01', serviceType: 'Loading (ยกลง)', qty: 12, unit: 'Pallets', rate: 85, amount: 1020, status: 'Completed', recordedBy: 'Somchai S.' },
    { id: 'HND-2605-003', client: 'Nestle (Thai)', date: '2026-06-01', serviceType: 'Labeling (ติดฉลาก)', qty: 500, unit: 'Units', rate: 2, amount: 1000, status: 'Pending', recordedBy: 'Suda M.' },
    { id: 'HND-2605-004', client: 'Unilever Thailand', date: '2026-06-01', serviceType: 'Repackaging (แพ็คใหม่)', qty: 150, unit: 'Boxes', rate: 15, amount: 2250, status: 'Completed', recordedBy: 'Wichai T.' },
    { id: 'HND-2605-005', client: 'Sahapat Group', date: '2026-06-01', serviceType: 'Unloading (ยกขึ้น)', qty: 40, unit: 'Pallets', rate: 85, amount: 3400, status: 'Completed', recordedBy: 'Prapa K.' },
    { id: 'HND-2605-006', client: 'Thai Beverage', date: '2026-06-01', serviceType: 'Loading (ยกลง)', qty: 10, unit: 'Pallets', rate: 85, amount: 850, status: 'Pending', recordedBy: 'Somchai S.' },
  ]);

  const [serviceRules, setServiceRules] = useState<any[]>([
    { id: 'RULE-UNLD', serviceType: 'Unloading (ยกขึ้น)', standardRate: 85.0, minRate: 70.0, applyMode: 'Standard Pallet Rate', active: true },
    { id: 'RULE-LBL', serviceType: 'Labeling (ติดฉลาก)', standardRate: 2.0, minRate: 1.5, applyMode: 'Unit Volume Rate', active: true },
    { id: 'RULE-QC', serviceType: 'QC Inspection', standardRate: 150.0, minRate: 120.0, applyMode: 'Hourly Auditor Rate', active: false },
  ]);

  // Live Calculator outputs
  const liveTotalAmount = calcQty * calcRate;
  const liveVerdict = calcRate >= (calcType === 'Labeling (ติดฉลาก)' ? 1.5 : 70) ? 'APPROVED RATE' : 'LIMIT DEVIATION';

  const filteredLogs = useMemo(() => {
    return serviceLogs.filter(item => {
      const matchSearch = item.client.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.serviceType.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [serviceLogs, search, statusFilter]);

  const currentData = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedConfigurations((prev: any) => ({ ...prev, [id]: !prev[id] }));

  // KPI Calculations
  const averageServiceRevenue = serviceLogs.reduce((acc, log) => acc + log.amount, 0);
  const pendingLogsCount = serviceLogs.filter(log => log.status === 'Pending').length;
  const totalActivitiesCount = serviceLogs.length;

  const saveServiceRecord = (savedData: any) => {
    setServiceLogs(prev => {
      const exists = prev.find(item => item.id === savedData.id);
      if (exists) {
        return prev.map(item => item.id === savedData.id ? { ...item, ...savedData } : item);
      } else {
        return [savedData, ...prev];
      }
    });
  };

  const handleCreateNewManual = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const newRecord = {
      id: `HND-2605-${randomNum}`,
      client: 'Brand New Client Inc.',
      serviceType: 'Unloading (ยกขึ้น)',
      qty: 10,
      unit: 'Pallets',
      rate: 85,
      amount: 850,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'WMS Robot'
    };
    setEditModal({ isOpen: true, data: newRecord });
  };

  const handleAddFromCalculator = () => {
    const randomNum = Math.floor(Math.random() * 90) + 10;
    
    const newRecord = {
      id: `HND-CALC-${randomNum}`,
      client: 'Simulation Partner Corp.',
      serviceType: calcType,
      qty: calcQty,
      unit: calcUnit,
      rate: calcRate,
      amount: liveTotalAmount,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      recordedBy: 'Simulator Node'
    };

    setServiceLogs(prev => [newRecord, ...prev]);
    setActiveTab('staff'); // Switch to calculations log tab
  };

  const handleDeleteRecord = (id: string) => {
    setServiceLogs(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditServiceModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} record={editModal.data} onSave={saveServiceRecord} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.HandHelping size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      HANDLING & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">SERVICE FEES</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      CONSIGNMENT SERVICE RATES, ACTIVITY-BASED COSTING & BILLING RECONCILE
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Service Config
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.FileSpreadsheet className="text-[#b58c4f]" size={16} /> Service Logs
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Handling Revenue" value={formatCurrency(averageServiceRevenue)} icon="wallet" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Total Billable Fees" />
                <KpiCard label="Logged service activities" value={totalActivitiesCount} icon="clipboard-list" colorAccent={THEME.gold} colorValue={THEME.primary} desc="WMS Tracked Logs" />
                <KpiCard label="Pending verification" value={pendingLogsCount} icon="alert-triangle" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Supervisor Checks" />
                <KpiCard label="SLA Reconciled" value="100.0%" icon="shield-check" colorAccent={THEME.success} colorValue={THEME.success} desc="Billing Synced" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ACCESS/ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                            <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4"><Icons.Layers size={18} className="text-[#b7a159]" /> BILLING CONTROLS</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">Standard WMS Rates</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">ระบบจะเรียกใช้อัตราค่าธรรมเนียมกลางในการคำนวณเงินจากพาเลทเข้า-ออก หากพบงานที่มีสัญญาพิเศษ ระบบจะใช้ (Custom SLA Overrides)</p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">Rate Threshold Locks</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">ปลดสิทธิ์การลงบันทึกอัตราค่าบริการต่ำกว่าเกณฑ์ขั้นต่ำ 15% (Critical) เพื่อหลีกเลี่ยงข้อจำกัดการขาดทุนสะสมของสัญญากดราคา</p>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE COMPACT QUICK CALC PANEL */}
                        <div className="bg-[#212c46] p-5 rounded-3xl shadow-lg border border-[#1d2636] text-white text-left animate-fadeIn">
                            <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9d8c0] flex items-center gap-2 border border-white/20 pb-2 mb-4"><Icons.Calculator size={18} className="text-[#b7a159]"/> LIVE BILLING SIMULATOR</h3>
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">SERVICE TYPE</label>
                                        <select 
                                            value={calcType}
                                            onChange={e => {
                                                const val = e.target.value;
                                                setCalcType(val);
                                                if (val === 'Labeling (ติดฉลาก)') {
                                                    setCalcRate(2);
                                                    setCalcUnit('Units');
                                                } else {
                                                    setCalcRate(85);
                                                    setCalcUnit('Pallets');
                                                }
                                            }}
                                            className="w-full bg-white/10 border border-white/20 px-2.5 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]"
                                        >
                                            <option value="Unloading (ยกขึ้น)">Unloading (ยกขึ้น)</option>
                                            <option value="Loading (ยกลง)">Loading (ยกลง)</option>
                                            <option value="Labeling (ติดฉลาก)">Labeling (ติดฉลาก)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">UNIT</label>
                                        <input 
                                            type="text" 
                                            disabled
                                            value={calcUnit}
                                            className="w-full bg-white/5 border border-white/15 px-2.5 py-1.5 rounded-xl text-[12px] font-black text-gray-400 outline-none" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">VOLUME QUANTITY</label>
                                    <input 
                                        type="number" 
                                        value={calcQty}
                                        onChange={e => setCalcQty(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">UNIT RATE (THB)</label>
                                    <input 
                                        type="number" 
                                        value={calcRate}
                                        onChange={e => setCalcRate(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 mt-4 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Standard Base Rate:</span>
                                        <span className="font-black text-white">{calcType === 'Labeling (ติดฉลาก)' ? '฿2.00 / Unit' : '฿85.00 / Pallet'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Calculated:</span>
                                        <span className="font-black text-[#b7a159]">{formatCurrency(liveTotalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                                        <span className="text-[9px] font-black uppercase text-gray-400">EVAL VERDICT:</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${liveVerdict === 'APPROVED RATE' ? 'bg-[#657f4d]' : 'bg-[#932c2e]'}`}>{liveVerdict}</span>
                                    </div>
                                </div>

                                <button onClick={handleAddFromCalculator} className="w-full bg-[#b58c4f] hover:bg-[#b7a159] text-[#212c46] font-black text-[11px] uppercase tracking-widest py-2 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-1">
                                    <Icons.PlusCircle size={15}/> Post Calculated Activity
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CONFIGURATION STANDARD REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.Sliders size={20} className="text-[#b7a159]"/> GLOBAL SERVICES RULE REGISTRY</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Service Fee Rule
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {serviceRules.map(rule => (
                                <div key={rule.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.DollarSign size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{rule.serviceType} Ruleset</span>
                                                    <button onClick={() => toggleExpand(rule.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedConfigurations[rule.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[rule.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>SLA Access {confidentialityMap[rule.id] ? 'Restricted Lock' : 'Active Public'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(rule.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[rule.id] ? "Unlock Public Allocation Limit" : "Lock / RESTRICT Service Rate"}
                                            >
                                                {confidentialityMap[rule.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedConfigurations[rule.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#7a8b95] uppercase font-black text-[9px] mb-1">STANDARD BASE RATE</p>
                                                    <p className="font-bold text-[#212c46] uppercase">{formatCurrency(rule.standardRate)} per Unit</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">STRICT MINIMUM RATE CAP</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{formatCurrency(rule.minRate)} Minimum</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Reconciliation Mode:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">{rule.applyMode}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Service State:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white bg-[#657f4d]`}>
                                                        WMS Active
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
                /* AUDIT LOG TAB - High Performance Table */
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#b7a159] transition-colors">
                                <Icons.Filter size={14} className="text-[#7a8b95]" />
                                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Verification Status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export Service Report
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search Client, Service Type..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10 text-left">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสประวัติบริการ (Service Log ID)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">คู่ค้า / ลูกค้าเจ้าของแบรนด์</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ประเภทงานบริการคลังสินค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ปริมาณกิจกรรม / หน่วยนับ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">อัตราต่อหน่วย (บาท)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ค่าบริการรวมสุทธิ (บาท)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะธุรกรรม</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center font-bold">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                        <td className="py-2.5 px-4">
                                            <div className="font-black text-[#212c46] text-[12px] uppercase">{item.client}</div>
                                            <span className="text-[10px] text-[#7a8b95] font-bold">Logged: {item.date}</span>
                                        </td>
                                        <td className="py-2.5 px-4">
                                            <span className="px-2 py-0.5 bg-[#4d87a8]/10 rounded text-[11px] font-black uppercase text-[#4d87a8]">{item.serviceType}</span>
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#212c46] text-[12px]">{item.qty} {item.unit}</td>
                                        <td className="py-2.5 px-4 text-right font-bold text-[#b58c4f] text-[12px]">{formatCurrency(item.rate)}</td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#a94228] text-[12px]">{formatCurrency(item.amount)}</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <ApprovalStatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setEditModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 rounded-md border border-[#eaeaec] text-[#212c46] hover:bg-[#212c46] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="Configure / Edit"
                                                >
                                                    <Icons.Eye size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRecord(item.id)}
                                                    className="w-8 h-8 rounded-md border border-[#eaeaec] text-[#932c2e] hover:bg-[#932c2e] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="Delete Log"
                                                >
                                                    <Icons.Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[#7a8b95] font-black uppercase text-[12px] tracking-widest bg-gray-50/50">No service logs recorded found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="px-6 py-3 bg-[#eaeaec] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-5 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span>Display Rows:</span>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-white border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#212c46] cursor-pointer shadow-sm focus:border-[#b7a159]"
                                >
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Services: {filteredLogs.length}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#1d2636] shadow-sm active:scale-95'}`}
                            >
                                <Icons.ChevronLeft size={14}/>
                            </button>
                            <div className="bg-white text-[#212c46] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                                Page {currentPage} / {totalPages}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#1d2636] shadow-sm active:scale-95'}`}
                            >
                                <Icons.ChevronRight size={14}/>
                            </button>
                        </div>
                    </div>

                </div>
            )}
            
        </div>
      </div>
    </div>
  );
}
