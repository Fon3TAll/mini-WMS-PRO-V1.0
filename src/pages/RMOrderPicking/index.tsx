import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { BarcodeScanner } from '../../components/shared/BarcodeScanner';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';

// --- Theme Configuration (Premium Industrial Earth-tones) ---
const THEME = {
  bgMain: '#f3f3f1',
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

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);
};

// --- KPI Card Components ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[84px] min-h-[84px] flex flex-col justify-between animate-fadeIn text-left animate-fadeIn">
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

// --- RM Specific Mock Picking Tasks ---
const MOCK_RM_PICKING_TASKS = [
    { id: 'RM-PK-001', prodOrderRef: 'PROD-2606-001', sku: 'SKU-8801', itemName: 'Nescafe Red Cup 380g (เนสกาแฟ)', location: 'ZONE-A-RACK-01', reqQty: 250, pickedQty: 0, status: 'Picking', priority: 'High', date: new Date().toISOString().split('T')[0], unit: 'Bags' },
    { id: 'RM-PK-002', prodOrderRef: 'PROD-2606-002', sku: 'SKU-8803', itemName: 'Mama Tom Yum Seasoning Powder', location: 'ZONE-B-RACK-05', reqQty: 1200, pickedQty: 1200, status: 'Completed', priority: 'High', date: new Date().toISOString().split('T')[0], unit: 'Kg' },
    { id: 'RM-PK-003', prodOrderRef: 'PROD-2606-003', sku: 'SKU-8805', itemName: 'Sunlight Fragrance Oil Concentrated', location: 'ZONE-C-RACK-22', reqQty: 50, pickedQty: 0, status: 'Pending', priority: 'Normal', date: new Date().toISOString().split('T')[0], unit: 'Liters' },
    { id: 'RM-PK-004', prodOrderRef: 'PROD-2606-004', sku: 'SKU-8808', itemName: 'Breeze Chemical Active Formula B', location: 'ZONE-C-RACK-01', reqQty: 800, pickedQty: 750, status: 'Short Pick', priority: 'Normal', date: new Date().toISOString().split('T')[0], note: 'Slight sediment issue on sub-bin', unit: 'Liters' },
    { id: 'RM-PK-005', prodOrderRef: 'PROD-2606-005', sku: 'SKU-8809', itemName: 'Carnation Thickener Agent M4', location: 'ZONE-B-RACK-10', reqQty: 300, pickedQty: 0, status: 'Pending', priority: 'Normal', date: new Date().toISOString().split('T')[0], unit: 'Kg' },
];

const MOCK_RM_ZONE_POLICIES = [
  { 
    id: 'ZONE-A-RM', 
    name: 'ZONE A: STAPLE FOOD MATERIAL SILO', 
    strategy: 'RFID Proximity & Batch Handheld Verify', 
    type: 'Dry Storage',
    maxPickers: 10,
    currentAllocated: 4,
    isConfidential: false,
    rules: [
      { id: 'RULE-RM-A1', label: 'SILO DISCHARGE COUPLING CHECK', rule: 'Must scan QR code on physical discharge nozzle before starting flow', isConfidential: false },
    ]
  },
  { 
    id: 'ZONE-B-RM', 
    name: 'ZONE B: ACTIVE INGREDIENTS VAULT (RESTRICTED)', 
    strategy: 'Double-Verify Chemical Authentication', 
    type: 'Climate-Controlled 18-22C',
    maxPickers: 5,
    currentAllocated: 2,
    isConfidential: true,
    rules: [
      { id: 'RULE-RM-B1', label: 'PPE ENFORCEMENT CHECKLIST', rule: 'Supervisor check-off of respiratory masks and chemical apron is mandatory', isConfidential: true },
    ]
  },
  { 
    id: 'ZONE-C-RM', 
    name: 'ZONE C: RAW PACKAGING & COMPONENT BUFFERS', 
    strategy: 'Forklift Telemetry Unit Auto-Dispatch', 
    type: 'Heavy Materials Buffering',
    maxPickers: 8,
    currentAllocated: 3,
    isConfidential: false,
    rules: [
      { id: 'RULE-RM-C1', label: 'BUNDLE BAND TENSION ALERT', rule: 'Manual seal clamp check on all bulk bundle wraps after forklift pallet dispatch', isConfidential: false },
    ]
  }
];

// --- User Guide ---
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> คู่ออกใบเบิกจ่ายวัตถุดิบ (RM)</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">RM Voice/Barcode Handheld picking guide</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[12px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={14} className="text-[#b7a159]"/> 1. แหล่งแผนเบิกจ่ายวัตถุดิบและเคมีภัณฑ์
            </h4>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec]">
                  <Icons.ScanBarcode size={13} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong>RF SCANNER:</strong> ยิงเช็คตรวจสอบรหัสตู้ชั้นเก็บ (Rack) และยิงยืนยัน SKU สารเคมีดิบหรือบรรจุภัณฑ์ ป้องกันความเสี่ยงในการคำนวณสัดส่วนสูตรผลิตคลาดเคลื่อน</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/20">
                  <Icons.Mic size={13} className="shrink-0 text-[#a94228] mt-0.5"/> 
                  <div className="text-[11px]"><strong>VOICE ASSISTED:</strong> นำจ่ายด้วยคำสั่งเสียงภาษาไทย/อังกฤษ แฮนด์สฟรีสมบูรณ์สำหรับการยกหีบห่อเคมี ตะโกนพูดคำว่า "CONFIRM" เพื่อผ่านขั้นตอนถัดไป</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[12px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={14} className="text-[#b7a159]"/> 2. วงจรสถานะของงานจ่ายใช้
            </h4>
            <p className="text-[11px] text-[#7a8b95] leading-relaxed">
              สถานะ <span className="text-[#b58c4f] font-bold">Pending</span> รอดึงคิว, <span className="text-[#3f809e] font-bold">Picking</span> ระหว่างจัดตักเตรียมวัสดุ, <span className="text-[#932c2e] font-bold">Short Pick</span> ขาดช่วงจากคลังใหญ่, และถอนจ่ายเสร็จสิ้นเป็น <span className="text-[#657f4d] font-bold">Completed</span> เพื่อป้อนสู่พาร์มเตรียมจัดเซ็ตถัดไป
            </p>
          </section>
        </div>
        
        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-widest">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Picking Execution Modal ---
function PickingExecutionModal({ isOpen, onClose, data, onSave }: any) {
    const [mode, setMode] = useState('rf'); // 'rf' | 'voice'
    const [scanInput, setScanInput] = useState('');
    const [pickedQty, setPickedQty] = useState('');

    const { isListening, isSupported, startListening, stopListening } = useVoiceCommand({
        onCommand: useCallback((text: string) => {
            const parsedNumber = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(parsedNumber)) {
                setPickedQty(parsedNumber.toString());
            }
        }, []),
        language: 'th-TH'
    });

    useEffect(() => {
        if(isOpen && data) {
            setScanInput('');
            setPickedQty(data.pickedQty || '');
            setMode('rf');
        }
    }, [isOpen, data]);

    if(!isOpen || !data) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseInt(pickedQty) || 0;
        onSave(data.id, value, value < data.reqQty ? 'Short Pick' : 'Completed');
        onClose();
    };

    return (
        <DraggableModal isOpen={isOpen} onClose={onClose} title={`สแกนเบิกวัตถุดิบ: ${data.id}`}>
            <form onSubmit={handleSubmit} className="p-5 text-left text-[12.5px] text-[#414757]">
                <div className="mb-4 p-3 bg-[#212c46]/5 rounded-xl border border-[#212c46]/10 flex justify-between items-center">
                    <div>
                        <div className="font-black text-[#212c46] tracking-wide">{data.sku} - {data.itemName}</div>
                        <div className="text-[10px] font-bold text-[#7a8b95] mt-1">ที่พิกัด: {data.location} | รอบใบประกอบ: {data.prodOrderRef}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[11px] font-bold text-[#7a8b95] uppercase">แผนต้องการ</div>
                        <div className="text-[16px] font-black font-mono text-[#212c46]">{data.reqQty} {data.unit}</div>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <button type="button" onClick={() => { setMode('rf'); stopListening(); }} className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${mode === 'rf' ? 'bg-[#212c46] text-white border-transparent' : 'bg-white text-[#7a8b95] border-[#eaeaec]'}`}>
                        <Icons.ScanLine size={14} /> RF Handheld
                    </button>
                    <button type="button" onClick={() => { setMode('voice'); startListening(); }} className={`flex-1 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border flex items-center justify-center gap-2 transition-all ${mode === 'voice' ? 'bg-[#a94228] text-white border-transparent animate-pulse' : 'bg-white text-[#7a8b95] border-[#eaeaec]'}`}>
                        <Icons.Mic size={14} /> Voice (พูดเพื่อคีย์)
                    </button>
                </div>

                {mode === 'rf' ? (
                    <div className="space-y-3 mb-5">
                        <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">สแกนรหัสพิกัดหรือรหัสตู้ชั้นวาง</label>
                            <div className="flex gap-2">
                                <input type="text" placeholder={`ยิงพิกัดเช่น ${data.location}`} value={scanInput} onChange={(e) => setScanInput(e.target.value)} className="flex-1 bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-[#b7a159]" />
                                <button type="button" onClick={() => setScanInput(data.location)} className="px-3 bg-slate-100 border border-[#eaeaec] hover:border-[#b7a159] rounded-xl text-[#212c46] transition-all"><Icons.Check size={14}/></button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">สแกนบาร์โค้ดวัตถุดิบจริง + ระบุจำนวน</label>
                            <input type="number" required placeholder={`กำหนดปริมาณที่หยิบใช้ (สูงสุด ${data.reqQty})`} value={pickedQty} onChange={(e) => setPickedQty(e.target.value)} className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-[#b7a159]" />
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-xl mb-5 text-center">
                        <Icons.Mic className="mx-auto text-[#a94228] animate-bounce mb-2" size={24} />
                        <div className="text-[12px] font-black text-[#212c46] uppercase">Listening voice commands...</div>
                        <p className="text-[11px] text-[#7a8b95] mt-1">กรุณาพูดตัวเลขปริมาณที่หยิบใช้ (เช่น: "สองร้อยห้าสิบ") ระบบจะกรอกลงช่องโดยอัตโนมัติ</p>
                        <div className="mt-3 flex justify-center gap-2">
                            <input type="text" placeholder="รับฟังข้อมูลด้วยเสียง..." value={pickedQty} onChange={(e) => setPickedQty(e.target.value)} className="bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-center text-[12px] font-mono w-[150px] outline-none" />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-[#eaeaec]">
                    <button type="button" onClick={() => { stopListening(); onClose(); }} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-[#414757] font-black rounded-lg text-[11px] uppercase tracking-wider transition-all">ยกเลิก</button>
                    <button type="submit" className="px-5 py-2 bg-[#212c46] hover:bg-[#4d87a8] text-white font-black rounded-lg text-[11px] uppercase tracking-wider transition-all">บันทึกเบิกจ่าย</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function RMOrderPicking() {
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'batches' | 'policies'
    const [tasks, setTasks] = useState(MOCK_RM_PICKING_TASKS);
    const [zones, setZones] = useState(MOCK_RM_ZONE_POLICIES);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [expandedZones, setExpandedZones] = useState<any>({});
    const [isScannerOpen, setIsScannerOpen] = useState(false);

    const { isOffline: activeOffline } = useOfflineSync(async (action) => {
        console.log('[Sync] RM Offline Action:', action);
        await new Promise(res => setTimeout(res, 500));
    });

    // Stats
    const totalRMNeeded = useMemo(() => tasks.reduce((sum, t) => sum + t.reqQty, 0), [tasks]);
    const totalRMPicked = useMemo(() => tasks.reduce((sum, t) => sum + t.pickedQty, 0), [tasks]);
    const pendingCount = useMemo(() => tasks.filter(t => t.status === 'Pending').length, [tasks]);
    const completedCount = useMemo(() => tasks.filter(t => t.status === 'Completed').length, [tasks]);

    // Group picking tasks into Batch Routes automatically (Batching based on Rack/Locations)
    const batchRoutes = useMemo(() => {
        const routesMap: { [key: string]: any } = {};
        tasks.forEach(t => {
            const floorZone = t.location.split('-')[0] + '-' + t.location.split('-')[1]; // Group by Zone-Rack
            if (!routesMap[floorZone]) {
                routesMap[floorZone] = {
                    id: `RM-ROUTE-${floorZone}`,
                    aisle: floorZone,
                    tasks: [],
                    totalQty: 0,
                    status: 'Pending'
                };
            }
            routesMap[floorZone].tasks.push(t);
            routesMap[floorZone].totalQty += t.reqQty;
        });

        return Object.values(routesMap).map((r: any) => {
            const hasPicking = r.tasks.some((t: any) => t.status === 'Picking');
            const allDone = r.tasks.every((t: any) => t.status === 'Completed');
            r.status = allDone ? 'Completed' : hasPicking ? 'Picking' : 'Pending';
            return r;
        });
    }, [tasks]);

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchQuery = task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               task.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               task.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               task.prodOrderRef.toLowerCase().includes(searchQuery.toLowerCase());
            const matchStatus = statusFilter === 'All' || task.status === statusFilter;
            return matchQuery && matchStatus;
        });
    }, [tasks, searchQuery, statusFilter]);

    const handleSavePicking = (id: string, qty: number, status: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, pickedQty: qty, status } : t));
    };

    const handleBulkPrint = (route: any) => {
        alert(`จำลองการพิมพ์ฉลากเบิกจ่าย (Picking Tags) สำหรับกลุ่มงานในพิกัด ${route.aisle}\n- จำนวนวัตถุดิบทั้งหมด: ${route.totalQty} หน่วย\n- รายการ: ${route.tasks.length} รายการ`);
    };

    const toggleExpandZone = (id: string) => {
        setExpandedZones((prev: any) => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleZoneConfidentiality = (id: string) => {
        setZones(prev => prev.map(z => z.id === id ? { ...z, isConfidential: !z.isConfidential } : z));
    };

    const deleteZonePolicy = (id: string) => {
        if(confirm('ยืนยันในการลบข้อบังคับโซนวัตถุดิบนี้?')) {
            setZones(prev => prev.filter(z => z.id !== id));
        }
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
            
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">RM PICKING GUIDE</span>
            </button>

            {/* TOP HEADER SECTION */}
            <div className="px-4 sm:px-8 pt-4 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
                <div className="text-left">
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#a94228]"></span>
                        <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.2em] font-mono">RM OUTBOUND DISPATCH & PICKING</span>
                    </div>
                    <h1 className="text-[20px] font-black text-[#212c46] tracking-tight uppercase mt-1">สแกนจ่ายใช้สารวัตถุดิบและเคมีภัณฑ์</h1>
                    <p className="text-[11px] font-extrabold text-[#7a8b95] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                        <Icons.ShieldAlert size={12} className="text-[#b58c4f]"/> RF TERMINAL & VOICE-DIRECTED KITTED MATERIAL CONTROLS
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => setIsScannerOpen(true)} className="px-4 py-2 bg-[#212c46] hover:bg-[#3f809e] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2">
                        <Icons.ScanBarcode size={15}/> CAMERA BARCODE SCANNER
                    </button>
                    <div className={`px-4 py-2 border rounded-xl shadow-sm text-[11px] font-black uppercase tracking-widest flex items-center gap-2 ${activeOffline ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${activeOffline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></div>
                        {activeOffline ? 'SYSTEM ENGAGED [OFFLINE VALID]' : 'DB BRIDGE OUT'}
                    </div>
                </div>
            </div>

            {/* DASHBOARD TAB NAVIGATION */}
            <div className="px-4 sm:px-8 w-full border-b border-[#eaeaec] flex justify-between items-center bg-[#f3f3f1] shrink-0">
                <div className="flex gap-1.5">
                    <button onClick={() => setActiveTab('tasks')} className={`px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'tasks' ? 'text-[#212c46] font-mono border-b-2 border-[#b7a159]' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                        รายการจ่ายใช้ตามผลิต ({filteredTasks.length})
                    </button>
                    <button onClick={() => setActiveTab('batches')} className={`px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'batches' ? 'text-[#212c46] font-mono border-b-2 border-[#b7a159]' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                        ลูปหยิบรวมโซนเบิก ({batchRoutes.length})
                    </button>
                    <button onClick={() => setActiveTab('policies')} className={`px-5 py-3 text-[11px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'policies' ? 'text-[#212c46] font-mono border-b-2 border-[#b7a159]' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                        กฎความปลอดภัยและการควบคุม
                    </button>
                </div>
            </div>

            {/* MAIN APP WORKSPACE */}
            <div className="px-4 sm:px-8 sm: w-full">
                <div className="w-full">
                    {/* KPI CARDS HEADER */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="แผนยอดเบิกวัตถุดิบสะสม" value={`${formatNumber(totalRMNeeded)} `} icon="box" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Required Qty" />
                        <KpiCard label="หยิบจ่ายสำเร็จแล้ว" value={`${formatNumber(totalRMPicked)} `} icon="check-circle" colorAccent={THEME.success} colorValue={THEME.success} desc="Dispensed OK" />
                        <KpiCard label="งานค้างกำลังหยิบ" value={pendingCount} icon="clock" colorAccent={THEME.gold} colorValue={THEME.gold} desc="Awaiting Pick" />
                        <KpiCard label="เบิกล็อควิกฤต (Shortages)" value={tasks.filter(t => t.status === 'Short Pick').length} icon="alert-triangle" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Short Dispensed" />
                    </div>

                    {/* RENDERING DYNAMIC TABS */}
                    {activeTab === 'tasks' ? (
                        <div className="bg-white rounded-3xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px]">
                            {/* SEARCH AND CONTROL ROW */}
                            <div className="p-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-2.5 bg-white border border-[#eaeaec] rounded-xl px-3.5 py-2 w-full md:w-96 shadow-inner">
                                    <Icons.Search size={16} className="text-[#7a8b95]" />
                                    <input type="text" placeholder="ค้นหาใบเบิกผลิต / รหัส SKU / พิกัดตู้..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-[12px] placeholder-[#7a8b95] outline-none w-full font-sans font-bold" />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {['All', 'Pending', 'Picking', 'Short Pick', 'Completed'].map((lvl) => (
                                        <button key={lvl} onClick={() => setStatusFilter(lvl)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${statusFilter === lvl ? 'bg-[#212c46] text-white border-transparent' : 'bg-white text-[#7a8b95] hover:text-[#212c46] border-[#eaeaec]'}`}>{lvl}</button>
                                    ))}
                                </div>
                            </div>

                            {/* MAIN TABLE */}
                            <div className="overflow-x-auto w-full text-left">
                                <table className="w-full text-[12px]">
                                    <thead>
                                        <tr className="bg-[#f8f9fa] border-b border-[#eaeaec] text-[#212c46] uppercase font-black tracking-wider text-[11px] font-mono">
                                            <th className="py-4.5 px-6">JOB RUN / ใบผลิต</th>
                                            <th className="py-4.5 px-4">พิกัดจัดเก็บ</th>
                                            <th className="py-4.5 px-4">วัตถุดิบเคมีดิบ (SKU)</th>
                                            <th className="py-4.5 px-4 text-center">แผนเบิก</th>
                                            <th className="py-4.5 px-4 text-center">ปริมาณจัดเบิกจริง</th>
                                            <th className="py-4.5 px-4 text-center">สถานะ</th>
                                            <th className="py-4.5 px-6 text-right">ดำเนินการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] font-sans font-bold">
                                        {filteredTasks.map((t) => (
                                            <tr key={t.id} className="hover:bg-amber-50/20 transition-all">
                                                <td className="py-4 px-6">
                                                    <div className="text-[12.5px] font-black text-[#212c46] font-mono leading-none">{t.id}</div>
                                                    <div className="text-[9.5px] text-[#7a8b95] font-black mt-1.5 uppercase font-mono">{t.prodOrderRef}</div>
                                                </td>
                                                <td className="py-4 px-4 font-mono text-[#4d87a8] uppercase text-[12px]">
                                                    <span className="px-2 py-1 rounded bg-[#3f809e]/10 border border-[#3f809e]/10">{t.location}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="text-[#212c46] text-[12px]">{t.itemName}</div>
                                                    <div className="text-[10px] text-[#7a8b95] font-mono uppercase tracking-wide mt-1">{t.sku}</div>
                                                </td>
                                                <td className="py-4 px-4 text-center font-mono text-[#212c46]">
                                                    {t.reqQty} <span className="text-[10px] text-[#7a8b95] uppercase font-bold">{t.unit}</span>
                                                </td>
                                                <td className="py-4 px-4 text-center font-mono">
                                                    <span className={t.pickedQty === 0 ? 'text-[#7a8b95]' : t.pickedQty < t.reqQty ? 'text-[#a94228]' : 'text-[#657f4d]'}>
                                                        {t.pickedQty} <span className="text-[10px] text-[#7a8b95] uppercase font-bold">{t.unit}</span>
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${t.status === 'Completed' ? 'bg-[#657f4d]/10 text-[#657f4d]' : t.status === 'Picking' ? 'bg-[#3f809e]/10 text-[#3f809e]' : t.status === 'Short Pick' ? 'bg-[#a94228]/10 text-[#a94228]' : 'bg-[#b58c4f]/10 text-[#b58c4f]'}`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <button onClick={() => setSelectedTask(t)} className="px-4.5 py-2 bg-[#212c46] text-white hover:bg-[#3f809e] transition-all rounded-lg text-[11px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1.5">
                                                        <Icons.ScanLine size={13} /> ดำเนินการ
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={7} className="py-20 text-center text-[#7a8b95] font-black text-[12px] uppercase tracking-widest border-t border-[#eaeaec]">ไม่มีรายการจัดเบิกค้างส่งตามรายละเอียดคำค้นหา</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'batches' ? (
                        <div className="space-y-4">
                            {/* BATCH ROUTES INSTRUCTION BANNER */}
                            <div className="p-4 bg-[#3f809e]/10 border border-[#3f809e]/20 rounded-2xl flex items-start gap-4 text-left font-sans">
                                <div className="p-2 bg-[#3f809e] text-white rounded-xl"><Icons.Layers size={20}/></div>
                                <div>
                                    <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest">อัลกอริทึมรวมทางเดินหยิบวัตถุดิบ (Dynamic Batching Routing)</h4>
                                    <p className="text-[11.5px] font-bold text-[#4d87a8] leading-relaxed mt-1">ระบบวิเคราะห์จุดที่จัดเก็บ (Aisle & Rack Coordinate) ในห้องวัตถุดิบและนำมาป้อนเพื่อจัดรอบให้พนักงานหยิบเคมีภัณฑ์พร้อมกันในครั้งเดียว ขจัดความจำเป็นในการเดินวนซ้ำในคลังสินค้า</p>
                                </div>
                            </div>

                            {/* ROUTES GRID */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-left font-sans animate-fadeIn">
                                {batchRoutes.map((route: any) => (
                                    <div key={route.id} className="bg-white border border-[#eaeaec] hover:border-[#b7a159] rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-lg transition-all duration-300">
                                        <div className="p-5">
                                            <div className="flex justify-between items-start gap-3 mb-4">
                                                <div>
                                                    <div className="text-[9.5px] font-mono font-bold text-[#7a8b95] uppercase">{route.id}</div>
                                                    <h4 className="text-[14px] font-black text-[#212c46] tracking-tight flex items-center gap-1.5 mt-1">
                                                        <Icons.MapPin size={15} className="text-[#3f809e]" /> {route.aisle}
                                                    </h4>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${route.status === 'Completed' ? 'bg-[#657f4d]/10 text-[#657f4d]' : 'bg-[#b58c4f]/10 text-[#b58c4f]'}`}>
                                                    {route.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-[#eaeaec] p-3 rounded-xl mb-4">
                                                <div>
                                                    <div className="text-[16px] font-black text-[#212c46] font-mono">{route.tasks.length}</div>
                                                    <div className="text-[9px] text-[#7a8b95] font-black uppercase tracking-widest mt-0.5">RM Tasks</div>
                                                </div>
                                                <div>
                                                    <div className="text-[16px] font-black text-[#212c46] font-mono">{route.totalQty}</div>
                                                    <div className="text-[9px] text-[#7a8b95] font-black uppercase tracking-widest mt-0.5">รวมปริมาตรร่วม</div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-[#7a8b95] mb-2 border-b border-[#eaeaec] pb-1">รายการสอดคล้อง</h5>
                                                {route.tasks.slice(0, 3).map((t: any) => (
                                                    <div key={t.id} className="text-[11px] flex justify-between items-center text-[#212c46] font-bold">
                                                        <span className="truncate flex-1 max-w-[150px]">{t.sku} - {t.itemName}</span>
                                                        <span className="font-black font-mono ml-2">x{t.reqQty}</span>
                                                    </div>
                                                ))}
                                                {route.tasks.length > 3 && (
                                                    <div className="text-[10px] font-black text-[#7a8b95] text-center pt-2">
                                                        + อีก {route.tasks.length - 3} รายการผลิตร่วม
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex gap-2">
                                            <button onClick={() => handleBulkPrint(route)} className="w-1/3 py-2 bg-white text-[#212c46] border border-[#eaeaec] hover:border-[#b7a159] hover:text-[#b7a159] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm flex justify-center items-center gap-2 transition-all"><Icons.Printer size={15} /></button>
                                            <button onClick={() => { setActiveTab('tasks'); setSearchQuery(route.aisle); }} className="w-2/3 py-2 bg-[#212c46] text-white hover:bg-[#3f809e] rounded-xl text-[11px] font-black uppercase tracking-widest shadow flex justify-center items-center gap-2 transition-all">เริ่มดำเนินลูปหยิบ <Icons.ArrowRight size={14} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                            {/* POLICY LEFT PANEL */}
                            <div className="lg:col-span-4 bg-white/90 p-5 rounded-2xl shadow-lg border border-[#eaeaec] text-left">
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> ENHANCED ZONE MATRICES (RM)</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Direct Handheld Zone</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed">คลังวัตถุดิบทั่วไป เช่น แป้ง น้ำตาล หรือสารตัวเติมแห้ง พนักงานจัดตักคลังใช้ handheld บันทึกข้อมูลได้ทันทีโดยไม่มีขั้นตอนการยืนยันพิเศษเพิ่มเติม</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Hazardous & Liquid Protocol</div>
                                        <p className="text-[11.5px] text-[#932c2e] font-bold leading-relaxed">คลังสารเคมี ของเหลวไวไฟ หรือกลุ่มควบคุมพิเศษ บังคับพาร์ทเนอร์สวมชุด PPE แน่นหนาและสั่งล็อกรหัสนำจ่ายเป็นความลับเพื่อจำลองความสะอาด 100%</p>
                                    </div>
                                </div>
                            </div>

                            {/* POLICY RIGHT PANEL */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center bg-white">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> HARDWARE OPERATIONAL POLICIES</h4>
                                    <button onClick={() => {
                                        const newId = prompt('กรุณากรอกรหัสโซนคลังวัตถุดิบใหม่ (เช่น ZONE-D-RM):');
                                        if (newId) {
                                            setZones([
                                                ...zones,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM RM STORAGE`, strategy: 'Traditional Manual List Picking Verification', type: 'Buffer Dry Grid', maxPickers: 8, currentAllocated: 0, isConfidential: false, rules: [] }
                                            ]);
                                        }
                                    }} className="px-4 py-2 bg-[#212c46] text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-[#414757] transition-all">
                                        <Icons.Plus size={14}/> เพิ่มข้อบังคับโซนใหม่
                                    </button>
                                </div>

                                <div className="divide-y divide-[#eaeaec]">
                                    {zones.map((zone) => (
                                        <div key={zone.id} className="p-5 flex flex-col gap-4 bg-white hover:bg-[#f8f9fa]/40 transition-colors animate-fadeIn">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex items-start gap-3">
                                                    <button onClick={() => toggleExpandZone(zone.id)} className="p-1 text-[#7a8b95] hover:text-[#212c46] rounded transition-colors mt-0.5">
                                                        {expandedZones[zone.id] ? <Icons.ChevronDown size={18}/> : <Icons.ChevronRight size={18}/>}
                                                    </button>
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="text-[12.5px] font-black text-[#212c46] font-mono tracking-tight">{zone.name}</h4>
                                                            <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 border border-[#eaeaec] text-[#7a8b95] uppercase font-mono">{zone.type}</span>
                                                        </div>
                                                        <p className="text-[11.5px] text-[#7a8b95] font-bold mt-1 uppercase tracking-wide flex items-center gap-1.5">
                                                            <Icons.FileText size={12}/> แผนผังเบิก: {zone.strategy}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button onClick={() => toggleZoneConfidentiality(zone.id)} className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${zone.isConfidential ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30 shadow-inner' : 'bg-white text-[#7a8b95] border-[#eaeaec]'}`}>
                                                        {zone.isConfidential ? <Icons.ShieldAlert size={10}/> : <Icons.ShieldOff size={10}/>}
                                                        {zone.isConfidential ? 'Confidential' : 'Public Link'}
                                                    </button>
                                                    <button onClick={() => deleteZonePolicy(zone.id)} className="w-8 h-8 rounded border border-[#eaeaec] hover:border-[#932c2e] hover:bg-[#932c2e]/10 text-[#7a8b95] hover:text-[#932c2e] flex items-center justify-center transition-all"><Icons.Trash2 size={13}/></button>
                                                </div>
                                            </div>

                                            {expandedZones[zone.id] && (
                                                <div className="pl-11 pr-2 py-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex flex-col gap-3 animate-fadeIn">
                                                    <div className="flex justify-between items-center border-b border-[#eaeaec] pb-2">
                                                        <div className="text-[11.5px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-1.5"><Icons.Hammer size={12} className="text-[#b7a159]"/> Local Slot Rule Assertions</div>
                                                        <button onClick={() => {
                                                            const rLabel = prompt('ระบุรหัสหัวข้อข้อบังคับ:');
                                                            const rDetail = prompt('ระบุคำอธิบายข้อบังคับโดยละเอียต:');
                                                            if(rLabel && rDetail) {
                                                                setZones(zones.map(z => z.id === zone.id ? { ...z, rules: [...z.rules, { id: `RULE-RM-${Date.now().toString().slice(-4)}`, label: rLabel.toUpperCase(), rule: rDetail, isConfidential: false }] } : z));
                                                            }
                                                        }} className="text-[10px] font-black text-[#3f809e] hover:text-[#4d87a8] uppercase tracking-wider flex items-center gap-1"><Icons.PlusCircle size={12}/> เพิ่มข้อกำหนดย่อย</button>
                                                    </div>

                                                    {zone.rules.length === 0 ? (
                                                        <div className="text-center py-4 text-[#7a8b95] font-bold text-[11px] uppercase tracking-widest font-mono">ไม่มีข้อบังคับย่อยกำหนดพิกัดนี้</div>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {zone.rules.map((rule: any) => (
                                                                <div key={rule.id} className="flex justify-between items-center bg-white p-3 border border-[#eaeaec] rounded-lg shadow-sm gap-4">
                                                                    <div className="text-left">
                                                                        <h5 className="text-[11px] font-black text-[#212c46] flex items-center gap-1.5"><Icons.Workflow size={11} className="text-[#7a8b95]"/> {rule.label}</h5>
                                                                        <p className="text-[11.5px] text-[#7a8b95] mt-0.5 leading-relaxed font-bold">{rule.rule}</p>
                                                                    </div>
                                                                    <button onClick={() => {
                                                                        setZones(zones.map(z => z.id === zone.id ? { ...z, rules: z.rules.filter((r: any) => r.id !== rule.id) } : z));
                                                                    }} className="p-1 text-[#7a8b95] hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded transition-all"><Icons.X size={12}/></button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
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

            {/* DYNAMIC COMPONENT OVERLAYS */}
            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            <PickingExecutionModal isOpen={selectedTask !== null} onClose={() => setSelectedTask(null)} data={selectedTask} onSave={handleSavePicking} />
            {isScannerOpen && (
                <BarcodeScanner 
                    title="RM Order Picking Scanner"
                    expectedType="all"
                    onClose={() => setIsScannerOpen(false)} 
                    onScan={(txt) => {
                        alert(`จำลองสแกนรหัสสำเร็จ: ${txt}`);
                        setSearchQuery(txt);
                        setIsScannerOpen(false);
                    }} 
                />
            )}
        </div>
    );
}
