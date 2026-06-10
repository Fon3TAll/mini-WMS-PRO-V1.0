import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Synced with Systems/Home Palette - Premium Industrial Earth-tones) ---
const THEME = {
  bgMain: '#f3f3f1', 
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)', 
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

// --- Mock Data (Exactly 100% Matching original examples) ---
const MOCK_PUTAWAY = [
    { id: 1, taskId: 'PTW-2605-001', grRef: 'GR-2605-0101', sku: 'SKU-FG-001', itemName: 'Sweet Tamarind Premium', qty: 1200, unit: 'Boxes', aiSuggestedBin: 'ZONE-A-01-01', actualBin: 'ZONE-A-01-01', aiReason: 'Fast-Moving, High Demand', weightClass: 'Standard', status: 'Completed', date: '2026-06-01' },
    { id: 2, taskId: 'PTW-2605-002', grRef: 'GR-2605-0102', sku: 'SKU-RM-050', itemName: 'Raw Tamarind (Bulk)', qty: 480, unit: 'Sacks', aiSuggestedBin: 'ZONE-C-10-01', actualBin: '', aiReason: 'Heavy Load, Bottom Rack', weightClass: 'Heavy', status: 'Pending', date: '2026-06-01' },
    { id: 3, taskId: 'PTW-2605-003', grRef: 'GR-2605-0105', sku: 'SKU-PM-005', itemName: 'Glass Bottles 500ml', qty: 5000, unit: 'Pcs', aiSuggestedBin: 'ZONE-B-05-03', actualBin: 'ZONE-B-05-04', aiReason: 'Fragile, Dedicated Zone', weightClass: 'Light', status: 'Completed', date: '2026-06-01' },
    { id: 4, taskId: 'PTW-2605-004', grRef: 'GR-2605-0106', sku: 'SKU-FG-022', itemName: 'Tamarind Paste (Bucket)', qty: 300, unit: 'Buckets', aiSuggestedBin: 'ZONE-A-02-01', actualBin: '', aiReason: 'Heavy Load, Fast-Moving', weightClass: 'Heavy', status: 'In Progress', date: '2026-06-01' },
    { id: 5, taskId: 'PTW-2605-005', grRef: 'GR-2605-0108', sku: 'SKU-FG-015', itemName: 'Tamarind Candy Pack', qty: 2500, unit: 'Packs', aiSuggestedBin: 'ZONE-A-01-02', actualBin: '', aiReason: 'Fast-Moving, Easy Access', weightClass: 'Light', status: 'Pending', date: '2026-05-31' },
];

const MOCK_ZONES = [
  { 
    id: 'ZONE-A', 
    name: 'ZONE A: FAST-MOVING RACKS', 
    strategy: 'AI-Dynamically Ranked', 
    weightClass: 'Light/Standard',
    maxCapacity: 5000,
    currentAllocated: 3700,
    isConfidential: false,
    subSlots: [
      { id: 'ZA-01', label: 'RACK SHELF ZA-1 (LEVEL 1-2)', rule: 'FIFO, fast pick priority', isConfidential: false },
      { id: 'ZA-02', label: 'RACK SHELF ZA-2 (LEVEL 3-4)', rule: 'Top rank weight restriction', isConfidential: false },
    ]
  },
  { 
    id: 'ZONE-B', 
    name: 'ZONE B: FRAGILE DEDICATED', 
    strategy: 'Dedicated Isolation', 
    weightClass: 'Light Only',
    maxCapacity: 2000,
    currentAllocated: 500,
    isConfidential: false,
    subSlots: [
      { id: 'ZB-01', label: 'CONTAINMENT COVE ZB-1', rule: 'Anti-humidity isolated ventilation', isConfidential: false },
      { id: 'ZB-02', label: 'SECURE SHELF ZB-2', rule: 'Damped frame padding rule', isConfidential: true },
    ]
  },
  { 
    id: 'ZONE-C', 
    name: 'ZONE C: HEAVY LOAD BOTTOM', 
    strategy: 'Floor-Stacked Bulk', 
    weightClass: 'Heavy Only',
    maxCapacity: 10000,
    currentAllocated: 480,
    isConfidential: false,
    subSlots: [
      { id: 'ZC-01', label: 'BOTTOM SLURRY DECK ZC-1', rule: 'Max 2000kg/m2 floor capacity', isConfidential: false },
    ]
  },
  { 
    id: 'COLD-RM', 
    name: 'COLD STORAGE (RESTRICTED)', 
    strategy: 'Temp-Controlled AI Allocation', 
    weightClass: 'Standard/Heavy',
    maxCapacity: 3000,
    currentAllocated: 1200,
    isConfidential: true,
    subSlots: [
      { id: 'CR-01', label: 'REFRIGERATED NODE CR-1 (-18C)', rule: 'High priority cold chain preservation', isConfidential: true },
      { id: 'CR-02', label: 'DEEP COOL NODE CR-2 (0-4C)', rule: 'Fresh bulk storage only', isConfidential: true },
    ]
  }
];

// Extremely detailed User Guide Panel (Padded narrow & compact - "ลีน สวย")
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> SMART PUTAWAY GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">AI-Powered Bin & Storage Router Guide</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11.5px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. หลักการจัดเก็บอัจฉริยะ (Smart Putaway Rules)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ระบบนำทางและคัดสรรตำแหน่งจัดเก็บสินค้าที่ดีที่สุดบนชั้นวางสินค้า (AI Optimal Storage Matrix):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Zap size={12} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8] font-black">AI Suggestions:</strong> ระบบคำนวณตำแหน่งเป้าหมายแบบอัตโนมัติ โดยอ้างอิงจากความถี่ในการเข้าออก (Velocity), น้ำหนัก (Weight Load), และความเปราะบาง (Fragile Dedicated) เพื่อให้การจัดเก็บรวดเร็วที่สุด</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Confidential Zones:</strong> ตำแหน่งจัดเก็บสินค้าพิเศษ เช่น คลังควบคุมอุณหภูมิ (Cold-Room) หรือห้องสินค้ามูลค่าสูง หากตั้งค่าเป็น Restricted (ป้องกัน) เมนูหรือตำแหน่งนั้นจะถูกล็อกสิทธิ์การมองเห็นเฉาะพนักงานที่มีสิทธิ์เท่านั้น</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={13} className="text-[#b7a159]"/> 2. วงจรการเก็บสินค้าของพนักงาน (Execution Lifecycle)
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-[11px] font-medium text-[#414757]">
              <li>เมื่อพบงานในสถานะ <span className="text-[#a94228] font-bold">Pending</span> พนักงานขับรถสามารถกดรับงานเพื่อเปลี่ยนสถานะเป็น <span className="text-[#3f809e] font-bold">In Progress</span></li>
              <li>นำจ่ายสินค้าไปยังช่องเก็บที่แนะนำ <b>AI Suggested Bin</b> บนหน้าตาราง</li>
              <li>สแกนบาร์โค้ดของช่องชั้นวางสินค้าเพื่อระบุ <b>Actual Bin</b> และกดเสร็จสิ้นงาน</li>
              <li>หากตำแหน่งที่เก็บจริง แตกต่างจาก AI แนะนำ ระบบจะบันทึกสถานะ <span className="text-[#b58c4f] font-bold">Manual Override</span> โดยอัตโนมัติเพื่อตรวจสอบย้อนหลัง</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Cpu size={13} className="text-[#b58c4f]"/> 3. การประเมินความแม่นยำ (AI Routing SLA)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              ค่า <b>AI Accuracy %</b> ด้านบนหน้าคำนวณจากสัดส่วนงานที่จัดเก็บตรงตามจุดที่แนะนำทั้งหมด หากตำแหน่งตรงกัน (Match) จะถือว่าเป็นการจัดเก็บที่สมบูรณ์ตามทฤษฎี ช่วยปรับปรุงอัลกอริทึมเรียนรู้ถัดไป
            </p>
          </section>
        </div>
        
        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-widest">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Putaway Custom Modal with Draggable Interface ---
function PutawayModal({ isOpen, onClose, data, onSave }: any) {
    const [formData, setFormData] = useState({
        taskId: '', grRef: '', sku: '', itemName: '', qty: 0, unit: '', 
        aiSuggestedBin: '', actualBin: '', aiReason: '', status: 'Pending'
    });

    useEffect(() => {
        if(isOpen && data) {
            setFormData({
                ...data,
                actualBin: data.actualBin || data.aiSuggestedBin
            });
        }
    }, [isOpen, data]);

    if (!isOpen || !data) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave({...formData, status: 'Completed'});
    };

    const handleProgress = (e: any) => {
        e.preventDefault();
        onSave({...formData, status: 'In Progress'});
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-2xl"
            customHeader={
                <div className="bg-[#212c46] px-5 py-3 flex justify-between items-center text-white shrink-0 border-b-2 border-[#b7a159]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20 shadow-sm">
                            <Icons.ArrowRightCircle size={18} strokeWidth={2.5}/>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">EXECUTE ROUTING PUTAWAY</h3>
                            <p className="text-[9px] font-bold text-[#b7a159] uppercase tracking-widest flex items-center gap-1"><Icons.Cpu size={10} /> AI ROUTING ENGINE ACTIVE</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-[#932c2e] p-1.5 hover:bg-white/10 rounded-lg transition-all"><Icons.X size={18} /></button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="p-5 bg-[#f3f3f1] flex flex-col gap-4 text-left">
                <div className="flex flex-col sm:flex-row gap-4 items-stretch">
                    {/* Source Details */}
                    <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm flex-1 space-y-2.5">
                        <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] pb-1.5 flex items-center gap-1.5"><Icons.Boxes size={12} className="text-[#212c46]"/> SOURCE PALLET</h4>
                        <div>
                            <div className="text-[12px] font-black text-[#212c46] font-mono">{formData.sku}</div>
                            <div className="text-[11px] font-bold text-[#414757] truncate">{formData.itemName}</div>
                        </div>
                        <div className="flex justify-between items-center bg-[#f3f3f1] p-2 rounded-lg border border-[#eaeaec]">
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase">Load Quantity</span>
                            <span className="text-[12px] font-black text-[#3f809e] font-mono">{formData.qty} <span className="text-[10px] text-[#7a8b95] font-sans">{formData.unit}</span></span>
                        </div>
                        <div className="text-[9px] font-bold text-[#7a8b95] flex items-center gap-1"><Icons.FileText size={10}/> Ref Document: {formData.grRef}</div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-[#212c46] p-4 rounded-xl border border-[#212c46] shadow-sm flex-[1.1] space-y-2.5 relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03] text-white"><Icons.Cpu size={100}/></div>
                        <h4 className="text-[10px] font-black text-[#b7a159] uppercase tracking-widest flex items-center gap-1 relative z-10"><Icons.Sparkles size={11} className="text-[#b7a159]"/> AI SUGGESTED CELL</h4>
                        <div className="text-[20px] font-black text-white relative z-10 tracking-widest font-mono">
                            {formData.aiSuggestedBin}
                        </div>
                        <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-white/95 relative z-10 leading-tight">
                            <b>Strategy Rule:</b> {formData.aiReason}
                        </div>
                    </div>
                </div>

                {/* Execution Enter barcode */}
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-3">
                    <h4 className="text-[10px] font-black text-[#212c46] uppercase tracking-widest border-b border-[#eaeaec] pb-1.5 flex items-center gap-1.5"><Icons.MapPin size={12} className="text-[#a94228]"/> CONFIRM TARGET LOCATION</h4>
                    
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#212c46] uppercase tracking-widest block">Actual Barcode Scan <span className="text-[#a94228]">*</span></label>
                        <div className="flex items-center gap-2">
                            <input required value={formData.actualBin} onChange={e=>setFormData({...formData, actualBin: e.target.value.toUpperCase()})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-4 py-2.5 text-[14px] font-black text-[#212c46] outline-none focus:border-[#b7a159] transition-all font-mono uppercase tracking-widest" placeholder="SCAN CELL BARCODE..." />
                            {formData.actualBin === formData.aiSuggestedBin && formData.actualBin !== '' && (
                                <div className="bg-[#657f4d]/10 text-[#657f4d] px-3 py-2.5 rounded-lg border border-[#657f4d]/20 flex items-center gap-1.5 shrink-0">
                                    <Icons.CheckCircle2 size={14} /> <span className="text-[10px] font-black uppercase tracking-wider">MATCHED</span>
                                </div>
                            )}
                            {formData.actualBin !== formData.aiSuggestedBin && formData.actualBin !== '' && (
                                <div className="bg-[#b58c4f]/10 text-[#a94228] px-3 py-2.5 rounded-lg border border-[#b58c4f]/20 flex items-center gap-1.5 shrink-0">
                                    <Icons.AlertTriangle size={14} /> <span className="text-[10px] font-black uppercase tracking-wider">OVERRIDDEN</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[9.5px] text-[#7a8b95] leading-tight">Please scan or input the physical slot barcode to guarantee correct balance audit logs.</p>
                    </div>
                </div>

                <div className="pt-2 border-t border-[#eaeaec] flex justify-between items-center gap-2">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#7a8b95] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec]/40 transition-all">Cancel</button>
                    <div className="flex gap-1.5">
                        {formData.status === 'Pending' && (
                            <button type="button" onClick={handleProgress} className="px-4 py-1.5 bg-[#4d87a8] text-white rounded-lg text-[11px] font-black uppercase shadow-md hover:bg-[#3f809e] transition-all flex items-center gap-1.5 tracking-widest">
                                <Icons.PlayCircle size={14}/> START VEHICLE ROUTE
                            </button>
                        )}
                        <button type="submit" className="px-4 py-1.5 bg-[#212c46] text-white rounded-lg text-[11px] font-black uppercase shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5 tracking-widest">
                            <Icons.CheckSquare size={14}/> COMPLETE PUTAWAY
                        </button>
                    </div>
                </div>
            </form>
        </DraggableModal>
    );
}

export default function SmartPutaway() {
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' (main list) or 'settings' (Standardเดียวกับ User Permissions)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [modalData, setModalData] = useState({ isOpen: false, item: null });
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Main States
    const [tasks, setTasks] = useState(MOCK_PUTAWAY);
    const [zones, setZones] = useState<any[]>(MOCK_ZONES);

    // Expands for Zone Settings
    const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true });

    // KPI Values
    const totalCount = tasks.length;
    const pendingCount = tasks.filter(t => t.status === 'Pending').length;
    const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
    
    // AI Accuracy Logic
    const completedTasksList = tasks.filter(t => t.status === 'Completed');
    const aiMatches = completedTasksList.filter(t => t.actualBin === t.aiSuggestedBin).length;
    const aiAccuracy = completedTasksList.length > 0 ? Math.round((aiMatches / completedTasksList.length) * 100) : 0;

    // Filter Logic
    const filteredTasks = useMemo(() => {
        let res = tasks;
        if (filterStatus !== 'All') {
            res = res.filter(t => t.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(t => 
                t.taskId.toLowerCase().includes(q) || 
                t.grRef.toLowerCase().includes(q) || 
                t.sku.toLowerCase().includes(q) ||
                t.aiSuggestedBin.toLowerCase().includes(q) ||
                t.itemName.toLowerCase().includes(q)
            );
        }
        return res.sort((a, b) => {
            const priority: any = { 'In Progress': 1, 'Pending': 2, 'Completed': 3 };
            if (priority[a.status] !== priority[b.status]) {
                return priority[a.status] - priority[b.status];
            }
            return b.id - a.id;
        });
    }, [tasks, searchQuery, filterStatus]);

    const paginatedTasks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTasks.slice(start, start + itemsPerPage);
    }, [filteredTasks, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;

    // Handlers
    const handleSaveTask = (data: any) => {
        setTasks(tasks.map(t => t.id === data.id ? data : t));
        setModalData({ isOpen: false, item: null });
    };

    const handleDeleteTask = (id: number) => {
        if(window.confirm('Are you sure you want to delete this Putaway task?')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const toggleConfidential = (zoneId: string) => {
        setZones(zones.map(z => z.id === zoneId ? { ...z, isConfidential: !z.isConfidential } : z));
    };

    const toggleSubSlotConfidential = (zoneId: string, subSlotId: string) => {
        setZones(zones.map(z => {
            if (z.id === zoneId) {
                return {
                    ...z,
                    subSlots: z.subSlots.map((s: any) => s.id === subSlotId ? { ...s, isConfidential: !s.isConfidential } : s)
                };
            }
            return z;
        }));
    };

    const toggleExpandZone = (zoneId: string) => {
        setExpandedZones((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
    };

    const deleteZone = (zoneId: string) => {
        if(window.confirm(`Are you sure you want to delete zone ${zoneId}?`)) {
            setZones(zones.filter(z => z.id !== zoneId));
        }
    };

    const getStatusStyle = (status: string) => {
        if(status === 'Pending') return 'bg-[#b58c4f]/10 text-[#a94228] border-[#b58c4f]/30';
        if(status === 'In Progress') return 'bg-[#4d87a8]/10 text-[#3f809e] border-[#4d87a8]/30';
        if(status === 'Completed') return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30';
        return 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30';
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
            
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            
            <PutawayModal 
                isOpen={modalData.isOpen} 
                data={modalData.item} 
                onClose={() => setModalData({ isOpen: false, item: null })} 
                onSave={handleSaveTask} 
            />

            {/* HEADER SECTION */}
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 select-none">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.BrainCircuit size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PUTAWAY</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            AI-Driven Storage Optimizer & Multi-Zone Router
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/50 p-1.1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => setActiveTab('tasks')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.Database size={15} /> Putaway Tasks
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.SlidersHorizontal size={15} /> Zone Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS (Sleek, Compact, Lean Padding - exactly 84px height matching requesting specs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="Total Workload" value={totalCount} icon="database" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="All Assigned Jobs" />
                        <KpiCard label="Pending" value={pendingCount} icon="package-plus" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Ready Cargo" />
                        <KpiCard label="In Progress" value={inProgressCount} icon="play-circle" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Under Way" />
                        <KpiCard label="AI Correctness" value={`${aiAccuracy}%`} icon="cpu" colorAccent={THEME.success} colorValue={THEME.success} desc="Matching Suggestion" />
                    </div>

                    {activeTab === 'tasks' ? (
                        <div className="bg-white rounded-[20px] shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col">
                            
                            {/* Filter Bar */}
                            <div className="px-6 py-4.5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center bg-white border border-[#eaeaec] h-10 px-3 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
                                        <Icons.Filter size={13} className="text-[#b58c4f] shrink-0" />
                                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black text-[#503447] uppercase tracking-widest outline-none cursor-pointer w-full">
                                            <option value="All">All Job Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full sm:w-72">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Sku, Task, GR docs..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold text-[#212c46] rounded-xl border border-[#eaeaec] bg-white outline-none focus:border-[#b7a159] shadow-sm transition-all placeholder:text-[#cbd5e1]" />
                                    </div>
                                </div>
                            </div>

                            {/* TABLE (Standardized layout styling exactly as specified) */}
                            <div className="overflow-x-auto custom-scrollbar bg-white">
                                <table className="w-full text-left font-sans border-collapse">
                                    {/* py-4 space, bg-133951, border-b-2 is ad2b10 */}
                                    <thead className="bg-[#133951] text-white">
                                        <tr>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รหัสงาน / อ้างอิงเอกสารรับเข้า (GR)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รายละเอียดสินค้า (SKU / รายการ)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">พิกัดชั้นวางที่ AI แนะนำ</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">ตำแหน่งที่ยืนยันการตั้งวางจริง</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">สถานะงาน</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap w-24">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] bg-white text-left font-mono">
                                        {paginatedTasks.map(task => (
                                            <tr key={task.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                                <td className="py-2.5 px-4">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#212c46] tracking-tighter text-[12px]">{task.taskId}</span>
                                                        <span className="font-bold text-[#7a8b95] text-[10px] uppercase">Gr: {task.grRef}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#4d87a8] text-[12px]">{task.sku}</span>
                                                        <span className="text-[11px] font-bold text-[#212c46] font-sans truncate max-w-[200px]" title={task.itemName}>{task.itemName}</span>
                                                        <span className="text-[11px] font-black text-[#b58c4f] mt-0.5">{task.qty} <span className="text-[10px] font-bold text-[#7a8b95]">{task.unit}</span></span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="inline-flex items-center gap-1.5 bg-[#4d87a8]/10 px-2 py-0.5 rounded border border-[#4d87a8]/20">
                                                        <Icons.Cpu size={12} className="text-[#3f809e]" />
                                                        <span className="font-black text-[#3f809e] text-[11px] tracking-widest font-mono">{task.aiSuggestedBin}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {task.status === 'Completed' ? (
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border font-black text-[11px] tracking-widest ${task.actualBin === task.aiSuggestedBin ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/20' : 'bg-[#a94228]/10 text-[#a94228] border-[#a94228]/20'}`}>
                                                            <Icons.MapPin size={11} /> {task.actualBin}
                                                        </div>
                                                    ) : (
                                                        <span className="text-[#7a8b95]/50">-</span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded border text-[11px] font-black uppercase tracking-widest inline-block ${getStatusStyle(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {/* Button sizes: w-8 h-8, gap-[1px] */}
                                                    <div className="flex justify-center items-center gap-[1px]">
                                                        {task.status !== 'Completed' ? (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#3f809e] text-[#3f809e] hover:bg-[#3f809e] hover:text-white transition-all active:scale-95 shadow-sm" title="Execute Routing">
                                                                <Icons.ArrowRightCircle size={14} />
                                                            </button>
                                                        ) : (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#b58c4f] text-[#b58c4f] hover:bg-[#b58c4f]/15 transition-all active:scale-95 shadow-sm" title="Review Configuration">
                                                                <Icons.CheckSquare size={14} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteTask(task.id)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#a94228] text-[#a94228] hover:bg-[#a94228] hover:text-white transition-all active:scale-95 shadow-sm" title="Delete record">
                                                            <Icons.Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest font-sans">
                                                    No Putaway assignments found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (py-3) */}
                            <div className="px-6 py-3 bg-[#eaeaec]/40 backdrop-blur-sm border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-mono">
                                <div className="flex items-center gap-4 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                                    <div className="flex items-center gap-1.5">
                                        <span>Display:</span>
                                        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-md px-1.5 py-0.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm">
                                            {[10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <p className="bg-white px-2.5 py-0.5 rounded border border-[#eaeaec] shadow-sm font-mono text-[10px]">Total found: {filteredTasks.length}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}>
                                        <Icons.ChevronLeft size={14}/>
                                    </button>
                                    <div className="bg-white text-[#212c46] px-3 py-1 rounded border border-[#eaeaec] shadow-sm text-[10px] font-black uppercase tracking-wider min-w-[90px] text-center">
                                        PAGE {currentPage} / {totalPages}
                                    </div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}>
                                        <Icons.ChevronRight size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            {/* LEFT DESCRIPTIONS POLICY */}
                            <div className="lg:col-span-4 bg-white/90 p-5 rounded-2xl shadow-lg border border-[#eaeaec] animate-fadeIn text-left">
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> WMS SECURITY MATRIX</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Public Slot Node</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">โมดูลจัดเก็บทั่วไป: สิทธิในการปฏิบัติงานและอัพโหลดพัสดุเป็นสัญญาสาธารณะ ยอมรับทรานแซกชั่นเบิกหยิบทุกประเภท</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Restricted Area Node</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">โซนสิทธิ์พิเศษทางประวัติ: ซ่อนตำแหน่งออกจากรายการสแกนทั่วไป ป้องกันการจัดพัสดุผิดระเบียบเว้นแต่ระบุสิทธิ์ Super-User เท่านั้น</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT DYNAMIC ZONE REGISTRY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center bg-white">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> ZONE & ROUTING POLICIES</h4>
                                    <button onClick={() => {
                                        const newId = prompt('Enter Zone ID (e.g. ZONE-D):');
                                        if (newId) {
                                            setZones([
                                                ...zones,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM ROUTING`, strategy: 'Manual Assign', weightClass: 'Standard', maxCapacity: 1000, currentAllocated: 0, isConfidential: false, subSlots: [] }
                                            ]);
                                        }
                                    }} className="px-4.5 py-1.5 bg-[#212c46] hover:bg-[#414757] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm border border-[#212c46]">
                                        <Icons.Plus size={14} /> ADD ZONE
                                    </button>
                                </div>
                                <div className="p-5 space-y-3 custom-scrollbar bg-white">
                                    {zones.map(zone => (
                                        <div key={zone.id} className="space-y-1.5">
                                            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${zone.isConfidential ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-sm ${zone.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228] border-[#932c2e]/20' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                        <Icons.Container size={18}/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-[#212c46] text-[12.5px] uppercase tracking-widest font-mono">{zone.id}</span>
                                                            <button onClick={() => toggleExpandZone(zone.id)} className="p-1 hover:bg-[#eaeaec]/60 rounded text-[#b58c4f] transition-all">
                                                                <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedZones[zone.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <span className="text-[10px] sm:text-[11px] font-bold text-[#7a8b95] uppercase block leading-none mt-1 font-sans">{zone.name}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest block mt-1 ${zone.isConfidential ? 'text-[#a94228]' : 'text-[#7a8b95]'}`}>Zone status: {zone.isConfidential ? 'Confidential Restricted' : 'General Public'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => toggleConfidential(zone.id)} className={`p-2 rounded-lg transition-all shadow-sm active:scale-95 ${zone.isConfidential ? 'bg-[#a94228] text-white' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`} title="Toggle Privacy Lock">
                                                        {zone.isConfidential ? <Icons.Lock size={15}/> : <Icons.Eye size={15}/>}
                                                    </button>
                                                    <button onClick={() => deleteZone(zone.id)} className="p-2 rounded-lg text-[#932c2e] hover:bg-[#932c2e]/10 transition-all border border-transparent" title="Delete Location Node">
                                                        <Icons.Trash2 size={15}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub slots expansion exactly matching User Permissions child elements structure */}
                                            {zone.subSlots && expandedZones[zone.id] && (
                                                <div className="ml-12 space-y-1.5 animate-fadeIn pr-2 pb-2">
                                                    {zone.subSlots.map((sub: any) => (
                                                        <div key={sub.id} className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border bg-white transition-all ${sub.isConfidential ? 'border-[#932c2e]/30 bg-[#932c2e]/5 shadow-inner' : 'border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${sub.isConfidential ? 'bg-[#a94228] animate-pulse' : 'bg-[#b7a159]'}`}></div>
                                                                <div className="text-left">
                                                                    <span className="text-[11.5px] font-black text-[#212c46] uppercase tracking-widest font-mono">{sub.id} - {sub.label}</span>
                                                                    <p className="text-[10px] font-medium text-[#7a8b95] leading-none mt-0.5 font-sans">{sub.rule}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => toggleSubSlotConfidential(zone.id, sub.id)} className={`p-1.5 rounded-md transition-all ${sub.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228]' : 'text-[#7a8b95] hover:bg-[#f8f9fa]'}`} title="Lock slot">
                                                                {sub.isConfidential ? <Icons.Lock size={14}/> : <Icons.Eye size={14}/>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {zone.subSlots.length === 0 && (
                                                        <div className="py-2.5 px-4 text-center text-[10px] font-black uppercase text-[#7a8b95] border border-dashed rounded-lg border-[#eaeaec] bg-[#f8f9fa]">
                                                            No active specific shelf partitions configured.
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

      <div className="mt-8 shrink-0"></div>            </div>
        </div>
    );
}
