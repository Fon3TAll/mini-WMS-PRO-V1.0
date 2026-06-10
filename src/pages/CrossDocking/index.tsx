import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Synced with Home Palette - Premium Industrial Earth-tones) ---
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

// --- Original Example Data preserved 100% ---
const MOCK_CROSS_DOCK = [
    { id: 1, xdNumber: 'XD-2605-001', inboundRef: 'GR-2605-0105', outboundRef: 'SO-2026-901', sku: 'SKU-FG-001', itemName: 'Fresh Tamarind (Export)', qty: 500, unit: 'Boxes', inboundDock: 'DOCK-01 (IN)', outboundDock: 'DOCK-05 (OUT)', priority: 'High', status: 'Transferring', date: new Date().toISOString().split('T')[0] },
    { id: 2, xdNumber: 'XD-2605-002', inboundRef: 'GR-2605-0106', outboundRef: 'SO-2026-905', sku: 'SKU-FG-015', itemName: 'Tamarind Candy (Promo)', qty: 1200, unit: 'Packs', inboundDock: 'DOCK-02 (IN)', outboundDock: 'DOCK-06 (OUT)', priority: 'High', status: 'Pending', date: new Date().toISOString().split('T')[0] },
    { id: 3, xdNumber: 'XD-2605-003', inboundRef: 'GR-2605-0108', outboundRef: 'SO-2026-910', sku: 'SKU-RM-050', itemName: 'Raw Tamarind Bulk', qty: 200, unit: 'Sacks', inboundDock: 'DOCK-01 (IN)', outboundDock: 'DOCK-04 (OUT)', priority: 'Normal', status: 'Completed', date: new Date().toISOString().split('T')[0] },
    { id: 4, xdNumber: 'XD-2605-004', inboundRef: 'GR-2605-0110', outboundRef: 'SO-2026-912', sku: 'SKU-PM-005', itemName: 'Glass Bottles 500ml', qty: 3000, unit: 'Pcs', inboundDock: 'DOCK-03 (IN)', outboundDock: 'DOCK-05 (OUT)', priority: 'Normal', status: 'Pending', date: new Date().toISOString().split('T')[0] },
    { id: 5, xdNumber: 'XD-2605-005', inboundRef: 'GR-2605-0112', outboundRef: 'SO-2026-915', sku: 'SKU-FG-022', itemName: 'Tamarind Paste (Fresh)', qty: 80, unit: 'Buckets', inboundDock: 'DOCK-02 (IN)', outboundDock: 'DOCK-06 (OUT)', priority: 'High', status: 'Transferring', date: new Date().toISOString().split('T')[0] },
];

const DOCK_LIST_IN = [
    'DOCK-01 (IN)', 
    'DOCK-02 (IN)', 
    'DOCK-03 (IN)'
];

const DOCK_LIST_OUT = [
    'DOCK-04 (OUT)', 
    'DOCK-05 (OUT)', 
    'DOCK-06 (OUT)'
];

// Mock Cross-Dock Portals/Lanes Data for Settings (User Permissions Standard)
const MOCK_PORTAL_CONFIGS = [
  { 
    id: 'LANE-A', 
    name: 'LANE A: AUTOMATED FAST-TRACK TRANSIT', 
    strategy: 'Full Automated Conveyor System', 
    type: 'Dry Load Transit',
    maxCapacity: 15,
    currentAllocated: 6,
    isConfidential: false,
    subSlots: [
      { id: 'LN-A-1', label: 'TRANSFER GATES S-1 (LIGHTWEIGHT)', rule: 'Boxed cargo priority, weight < 25kg', isConfidential: false },
      { id: 'LN-A-2', label: 'TRANSFER GATES S-2 (HEAVY LOAD)', rule: 'Palletized bulk cargo conveyor active', isConfidential: false },
    ]
  },
  { 
    id: 'LANE-B', 
    name: 'LANE B: TEMPERATURE CONTROLLED CONDUIT', 
    strategy: 'Continuous Cold-Chain Loop', 
    type: 'Cold & Chilled Transfer',
    maxCapacity: 8,
    currentAllocated: 2,
    isConfidential: true,
    subSlots: [
      { id: 'LN-B-1', label: 'COLD SEAL TRANSFER DOCK RAMP-C', rule: 'Fresh products buffer lock priority', isConfidential: true },
    ]
  },
  { 
    id: 'LANE-C', 
    name: 'LANE C: SPECIALIZED HAZMAT ZONE', 
    strategy: 'Chemical & Fragile Strict Dispatch', 
    type: 'Dangerous Goods Barrier',
    maxCapacity: 5,
    currentAllocated: 0,
    isConfidential: false,
    subSlots: [
      { id: 'LN-C-1', label: 'HAZARDOUS BARRIER PIPELINE', rule: 'Strict safety clearance certificate required', isConfidential: false },
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> CROSS-DOCKING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Zero-Inventory Dispatch Guide</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11.5px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. ระบบหมุนเวียนไหลผ่านทันที (Zero-Storage Flow)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">กฎเกณฑ์การถ่ายสินค้าด่วนโดยไม่ผ่านกระบวนการคลังเก็บ (Real-time Flow Rules):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Zap size={12} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8] font-black">Fast Transfer:</strong> สินค้าจะไหลจากท่ายางรถยนต์ Inbound สู่ Outbound ทันทีด้วยรถโฟล์คลิฟต์ หรือรางเลื่อน เพื่อลดเวลาการรับ-จัดเก็บ 100%</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Channels:</strong> โดเมนโอนย้ายควบคุมอุณหภูมิพิเศษ (Cold Chain) และวัตถุอันตราย จะถูกป้องกันความลับสล็อตไว้ตามแบบแผนความปลอดภัยคลัง (Security Audit)</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={13} className="text-[#b7a159]"/> 2. ลำดับสถานะการเปลี่ยนถ่าย (Cross-Dock Stage Flow)
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-[11px] font-medium text-[#414757]">
              <li>เมื่อมีออเดอร์จับคู่ขนถ่ายในคลัง ข้อมูลเริ่มต้นสถานะคือ <span className="text-[#b58c4f] font-bold">Pending</span></li>
              <li>เมื่อพบตัวสินค้ามาถึงท่า Inbound และรถโฟล์คลิฟต์เริ่มทำการโอนย้ายทางวิศวกรรมสลับไป Outbound ให้กดสถานะ <span className="text-[#ab7d82] font-bold">Transferring</span></li>
              <li>สแกนบาร์โค้ดปลายทางเพื่อตรวจสอบพิกัดช่องจ่าย แล้วขยับเป็น <span className="text-[#657f4d] font-bold">Completed</span> เพื่อปิดวงจรการเดินทาง</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Compass size={13} className="text-[#b58c4f]"/> 3. ระดับความเร่งด่วนรุนแรง (Urgent Transfer Alert SLA)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              กลุ่มสินค้าประเภทส่งด่วนพิเศษ แอร์แอร์โรไดนามิก หรือตู้คอนเทนเนอร์ระเบิดเวลาจะถูกปักหมุดสีแดง <strong className="text-[#ce1c16]">HIGH PRIORITY</strong> ทีมเปลี่ยนถ่ายสินค้าต้องเร่งดำเนินการโอนก่อนคิวอื่นเสมอ (Strict Priority Queueing Rule)
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

// --- Execution Modal using Draggable Modal ---
function CrossDockModal({ isOpen, onClose, data, onSave }: any) {
    const [formData, setFormData] = useState<any>(null);
    const [scanInput, setScanInput] = useState('');

    useEffect(() => {
        if(isOpen && data) {
            setFormData(data);
            setScanInput('');
        } else {
            setFormData(null);
        }
    }, [isOpen, data]);

    if (!isOpen || !data || !formData) return null;

    const handleProgress = (e: any) => {
        e.preventDefault();
        onSave({...formData, status: 'Transferring'});
    };

    const handleComplete = (e: any) => {
        e.preventDefault();
        onSave({...formData, status: 'Completed'});
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
                            <Icons.ArrowRightLeft size={18} strokeWidth={2.5}/>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">EXECUTE CROSS-DOCK</h3>
                            <p className="text-[9px] font-bold text-[#b7a159] uppercase tracking-widest flex items-center gap-1"><Icons.Zap size={10} /> ZERO-STORAGE DIRECT TRANSIT</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-[#932c2e] p-1.5 hover:bg-white/10 rounded-lg transition-all"><Icons.X size={18} /></button>
                </div>
            }
        >
            <div className="p-5 bg-[#f3f3f1] flex flex-col gap-4 text-left font-mono">
                {/* Header Information */}
                <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                    <div>
                        <div className="text-[14px] font-black text-[#212c46] font-mono">{formData.xdNumber}</div>
                        <div className="text-[11px] font-bold text-[#7a8b95] mt-1 font-sans">{formData.sku} - {formData.itemName}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-[18px] font-black text-[#a94228] font-mono">{formData.qty} <span className="text-[11px] text-[#7a8b95] font-sans">{formData.unit}</span></div>
                        {formData.priority === 'High' && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black bg-[#932c2e]/10 text-[#932c2e] px-2 py-0.5 rounded border border-[#932c2e]/20 mt-1 animate-pulse">
                                <Icons.Zap size={10}/> HIGH PRIORITY
                            </span>
                        )}
                    </div>
                </div>

                {/* Transfer Graphic Conduit */}
                <div className="flex flex-col md:flex-row items-stretch justify-center gap-3">
                    
                    {/* INBOUND */}
                    <div className="flex-1 bg-white p-4 rounded-xl border-2 border-[#212c46] shadow-sm relative overflow-hidden flex flex-col justify-center items-center text-center">
                        <span className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">Pick From (Inbound)</span>
                        <div className="text-[16px] font-black text-[#212c46]">{formData.inboundDock}</div>
                        <div className="text-[10px] font-bold text-[#b58c4f] mt-1.5 bg-[#b58c4f]/10 px-2.5 py-0.5 rounded border border-[#b58c4f]/20">Ref: {formData.inboundRef}</div>
                    </div>

                    {/* INTERACTION LINK */}
                    <div className="flex items-center justify-center shrink-0 py-2 md:py-0">
                        <div className="w-10 h-10 bg-white border border-[#eaeaec] rounded-full flex items-center justify-center text-[#b7a159] shadow-sm">
                            <Icons.ArrowRightLeft size={18} className="rotate-90 md:rotate-0" />
                        </div>
                    </div>

                    {/* OUTBOUND */}
                    <div className="flex-1 bg-[#133951] p-4 rounded-xl border-2 border-[#133951] shadow-md relative overflow-hidden flex flex-col justify-center items-center text-center">
                        <span className="text-[9px] font-black text-[#eaeaec]/80 uppercase tracking-widest mb-1.5">Drop To (Outbound)</span>
                        <div className="text-[16px] font-black text-white">{formData.outboundDock}</div>
                        <div className="text-[10px] font-bold text-[#b7a159] mt-1.5 bg-black/20 px-2.5 py-0.5 rounded border border-white/10">Ref: {formData.outboundRef}</div>
                    </div>

                </div>

                {/* Simulated barcode scanner if transferring */}
                {formData.status === 'Transferring' && (
                    <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-2 animate-fadeIn text-left">
                        <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest border-b border-[#eaeaec] pb-1 flex items-center gap-1.5"><Icons.ScanBarcode size={13} className="text-[#a94228]"/> Confirm Outbound Drop Location</h4>
                        <p className="text-[10px] text-[#7a8b95] font-sans">Scan the physical Outbound terminal bar-label or gate sensor to release transit sequence lock.</p>
                        <input 
                            type="text" 
                            value={scanInput} 
                            onChange={e=>setScanInput(e.target.value.toUpperCase())}
                            className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[14px] font-black text-[#a94228] outline-none focus:border-[#b7a159] tracking-widest font-mono text-center" 
                            placeholder="SCAN OUTBOUND BARCODE GATE OR DUMP..." 
                            autoFocus
                        />
                    </div>
                )}

                <div className="pt-2 border-t border-[#eaeaec] flex justify-between items-center gap-2">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec]/45">Cancel</button>
                    <div className="flex gap-2">
                        {formData.status === 'Pending' && (
                            <button type="button" onClick={handleProgress} className="px-6 py-2 bg-[#ab7d82] hover:bg-[#ab7d82]/80 text-white rounded-lg text-[11px] font-black uppercase shadow-md flex items-center gap-1.5 tracking-widest">
                                <Icons.PlayCircle size={14}/> Start Transfer
                            </button>
                        )}
                        {formData.status === 'Transferring' && (
                            <button type="button" onClick={handleComplete} className="px-6 py-2 bg-[#657f4d] hover:bg-[#657f4d]/80 text-white rounded-lg text-[11px] font-black uppercase shadow-md flex items-center gap-1.5 tracking-widest">
                                <Icons.CheckSquare size={14}/> Confirm Completion
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function CrossDocking() {
    const [activeTab, setActiveTab] = useState('transfers'); // 'transfers' or 'settings' Setup matching same standard as UserPermissions
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [modalData, setModalData] = useState({ isOpen: false, item: null });
    
    // Enable seamless integration with our global WMS Barcode Scanner
    useEffect(() => {
        const handleScannedEvent = (e: Event) => {
            const customEvent = e as CustomEvent<{ code: string }>;
            if (customEvent.detail && customEvent.detail.code) {
                setSearchQuery(customEvent.detail.code);
            }
        };
        window.addEventListener('wms-barcode-scanned', handleScannedEvent);
        return () => window.removeEventListener('wms-barcode-scanned', handleScannedEvent);
    }, []);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Main States
    const [tasks, setTasks] = useState(MOCK_CROSS_DOCK);
    const [lanes, setLanes] = useState<any[]>(MOCK_PORTAL_CONFIGS);

    // Expands for Lane Settings (Standardเดียวกับ User Permissions)
    const [expandedLanes, setExpandedLanes] = useState<any>({ 'LANE-A': true, 'LANE-B': true });

    // KPI Values (Sleek Compact Lean Padding height [84px])
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const transferringTasks = tasks.filter(t => t.status === 'Transferring').length;
    const highPriorityTasks = tasks.filter(t => t.priority === 'High' && t.status !== 'Completed').length;

    // Filter Logic
    const filteredTasks = useMemo(() => {
        let res = [...tasks];
        if (filterStatus !== 'All') {
            res = res.filter(t => t.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(t => 
                t.xdNumber.toLowerCase().includes(q) || 
                t.inboundRef.toLowerCase().includes(q) || 
                t.outboundRef.toLowerCase().includes(q) ||
                t.sku.toLowerCase().includes(q) ||
                t.itemName.toLowerCase().includes(q)
            );
        }
        return res.sort((a, b) => {
            // Sort by High Priority first, then status pending/transferring
            if (a.priority === 'High' && b.priority !== 'High') return -1;
            if (a.priority !== 'High' && b.priority === 'High') return 1;
            
            const statusOrder: any = { 'Transferring': 1, 'Pending': 2, 'Completed': 3 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9);
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [tasks, searchQuery, filterStatus]);

    const paginatedTasks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTasks.slice(start, start + itemsPerPage);
    }, [filteredTasks, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage) || 1;

    // Handlers
    const handleSaveTask = (data: any) => {
        setTasks(prev => prev.map(t => t.id === data.id ? data : t));
        setModalData({ isOpen: false, item: null });
    };

    const handleDeleteTask = (id: number) => {
        if(window.confirm('Are you sure you want to cancel and remove this Cross-Dock task?')) {
            setTasks(prev => prev.filter(t => t.id !== id));
        }
    };

    const toggleConfidential = (laneId: string) => {
        setLanes(lanes.map(l => l.id === laneId ? { ...l, isConfidential: !l.isConfidential } : l));
    };

    const toggleSubSlotConfidential = (laneId: string, subSlotId: string) => {
        setLanes(lanes.map(l => {
            if (l.id === laneId) {
                return {
                    ...l,
                    subSlots: l.subSlots.map((s: any) => s.id === subSlotId ? { ...s, isConfidential: !s.isConfidential } : s)
                };
            }
            return l;
        }));
    };

    const toggleExpandLane = (laneId: string) => {
        setExpandedLanes((prev: any) => ({ ...prev, [laneId]: !prev[laneId] }));
    };

    const deleteLane = (laneId: string) => {
        if(window.confirm(`Are you sure you want to remove transit zone ${laneId}?`)) {
            setLanes(lanes.filter(l => l.id !== laneId));
        }
    };

    const getStatusStyle = (status: string) => {
        if(status === 'Pending') return 'bg-[#b58c4f]/10 text-[#a94228] border-[#b58c4f]/30';
        if(status === 'Transferring') return 'bg-[#ab7d82]/10 text-[#932c2e] border-[#ab7d82]/30';
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
            
            <CrossDockModal 
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
                            <Icons.ArrowRightLeft size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div className="text-left font-sans">
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            CROSS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">-DOCKING</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            Zero-Inventory Direct Transit Center
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 font-sans">
                    <div className="bg-white/50 p-1.1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => setActiveTab('transfers')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'transfers' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.ArrowRightLeft size={15} /> Direct Transfers
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.SlidersHorizontal size={15} /> Lane Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS (Sleek, Compact, Lean Padding - exactly 84px height matching requesting specs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0 text-left font-sans">
                        <KpiCard label="Total Tasks" value={totalTasks} icon="database" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="All Transfers" />
                        <KpiCard label="Awaiting Pending" value={pendingTasks} icon="clock" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Queue Buffer" />
                        <KpiCard label="Currently Transferring" value={transferringTasks} icon="arrow-right-left" colorAccent={THEME.softPurple} colorValue={THEME.primary} desc="Lanes Active" />
                        <KpiCard label="High Priority Alerts" value={highPriorityTasks} icon="zap" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Require Urgent Work" />
                    </div>

                    {activeTab === 'transfers' ? (
                        <div className="bg-white rounded-[20px] shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col font-sans">
                            
                            {/* Filter Bar */}
                            <div className="px-6 py-4.5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center bg-white border border-[#eaeaec] h-10 px-3 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
                                        <Icons.Filter size={13} className="text-[#b58c4f] shrink-0" />
                                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black text-[#503447] uppercase tracking-widest outline-none cursor-pointer w-full">
                                            <option value="All">All Job Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Transferring">Transferring</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full sm:w-72">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search XD-ID, Reference, SKU, Item..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold text-[#212c46] rounded-xl border border-[#eaeaec] bg-white outline-none focus:border-[#b7a159] shadow-sm transition-all placeholder:text-[#cbd5e1]" />
                                    </div>
                                </div>
                            </div>

                            {/* TABLE (Standardized layout styling exactly as specified) */}
                            <div className="overflow-x-auto custom-scrollbar bg-white">
                                <table className="w-full text-left font-sans border-collapse">
                                    {/* py-4 space, bg-133951, border-b-2 is ad2b10 */}
                                    <thead className="bg-[#133951] text-white">
                                        <tr>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">หมายเลขการเชื่อมโยง (Cross-Dock) / วันที่</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รหัสสินค้า & รายการสินค้า (SKU / Item)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">ข้อมูลอ้างอิงการเชื่อมโยง (รับเข้า ➔ จ่ายออก)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">พิกัดทางผ่านและช่องจอด</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">สถานะการทำงาน</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap w-32">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] bg-white text-left font-mono">
                                        {paginatedTasks.map(task => (
                                            <tr key={task.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-black text-[#a94228] tracking-tighter text-[12px] font-mono">{task.xdNumber}</span>
                                                            {task.priority === 'High' && <span className="bg-[#932c2e] w-1.5 h-1.5 rounded-full animate-pulse" title="High Priority Urgent"></span>}
                                                        </div>
                                                        <span className="font-bold text-[#7a8b95] text-[11px] font-sans truncate" title={task.date}>{task.date}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#212c46] text-[12px]">{task.sku}</span>
                                                        <span className="text-[11px] font-bold text-[#7a8b95] flex items-center font-sans gap-1 mt-0.5">{task.itemName}</span>
                                                        <span className="text-[10px] font-black text-[#b58c4f] font-sans mt-0.5">{formatNumber(task.qty)} {task.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7a8b95]">
                                                        <span className="bg-white border border-[#eaeaec] px-1.5 py-0.5 rounded leading-none text-[#133951] font-mono">{task.inboundRef}</span>
                                                        <Icons.ArrowRight size={12} className="text-[#b7a159] scale-x-125" />
                                                        <span className="bg-white border border-[#eaeaec] px-1.5 py-0.5 rounded leading-none text-[#a54f6b] font-mono">{task.outboundRef}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[9px] uppercase font-sans text-[#7a8b95] leading-none mb-0.5">FROM</span>
                                                            <span className="font-black text-[#212c46] text-[11px] whitespace-nowrap">{task.inboundDock}</span>
                                                        </div>
                                                        <Icons.ChevronsRight size={14} className="text-[#3f809e] shrink-0" />
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[9px] uppercase font-sans text-[#7a8b95] leading-none mb-0.5">TO_DROP</span>
                                                            <span className="font-black text-[#3f809e] text-[11px] whitespace-nowrap">{task.outboundDock}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded border text-[11px] font-black uppercase tracking-widest inline-block ${getStatusStyle(task.status)}`}>
                                                        {task.status}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {/* Button sizes: w-8 h-8, gap-[1px] */}
                                                    <div className="flex justify-center items-center gap-[1px]">
                                                        {task.status !== 'Completed' && (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task as any })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#3f809e] text-[#3f809e] hover:bg-[#3f809e] hover:text-white transition-all active:scale-95 shadow-sm" title="Execute Transfer Phase">
                                                                <Icons.FastForward size={14} />
                                                            </button>
                                                        )}
                                                        {task.status === 'Completed' && (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task as any })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#527d45] text-[#527d45] hover:bg-[#527d45] hover:text-white transition-all active:scale-95 shadow-sm" title="Confirm Details">
                                                                <Icons.CheckSquare size={14} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => handleDeleteTask(task.id)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#a94228] text-[#a94228] hover:bg-[#a94228] hover:text-white transition-all active:scale-95 shadow-sm" title="Delete Task">
                                                            <Icons.Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest font-sans">
                                                    No cross-docking records found.
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
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                            {/* LEFT DESCRIPTIONS POLICY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-4 bg-white/90 p-5 rounded-2xl shadow-lg border border-[#eaeaec] animate-fadeIn text-left">
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> ACCESS CONTROL MATRICES</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Public Lane Conduit</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">สายการโอนถ่ายแบบมาตรฐาน: สมาชิกคลังพนักงานตรวจกระบวนการจ่ายคิวรับโอนสัญจรทั่วไป ไม่มีข้อบังคับความเป็นส่วนตัวระดับความมั่นคง</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Restricted Climate Lane</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">แถบสล็อตเฉพาะผู้ได้รับสิทธิ์: ล็อกแถบคิวเพื่อจำกัดการตรวจสอบสินค้าจำพวกวัคซีนเคมี ยาปฏิชีวนะ หรือทองคำสารเคลือบแผ่นวงจรระดับความมั่นคง</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT DYNAMIC PORTALS/LANES REGISTRY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center bg-white">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> TRANSIT LANE CONTROLS</h4>
                                    <button onClick={() => {
                                        const newId = prompt('Enter New Transit Lane ID (e.g. LANE-D):');
                                        if (newId) {
                                            setLanes([
                                                ...lanes,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM SPEED TRANSIT`, strategy: 'Manual Forklift Push Stage', type: 'Continuous Push Route', maxCapacity: 10, currentAllocated: 0, isConfidential: false, subSlots: [] }
                                            ]);
                                        }
                                    }} className="px-4.5 py-1.5 bg-[#212c46] hover:bg-[#414757] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm border border-[#212c46]">
                                        <Icons.Plus size={14} /> ADD LANE NODE
                                    </button>
                                </div>
                                <div className="p-5 space-y-3 custom-scrollbar bg-white">
                                    {lanes.map(lane => (
                                        <div key={lane.id} className="space-y-1.5">
                                            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${lane.isConfidential ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-sm ${lane.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228] border-[#932c2e]/20' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                        <Icons.Route size={18}/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-[#212c46] text-[12.5px] uppercase tracking-widest font-mono">{lane.id}</span>
                                                            <button onClick={() => toggleExpandLane(lane.id)} className="p-1 hover:bg-[#eaeaec]/60 rounded text-[#b58c4f] transition-all">
                                                                <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedLanes[lane.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <span className="text-[10px] sm:text-[11px] font-bold text-[#7a8b95] uppercase block leading-none mt-1 font-sans">{lane.name}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest block mt-1 ${lane.isConfidential ? 'text-[#a94228]' : 'text-[#7a8b95]'}`}>Lane Security: {lane.isConfidential ? 'Confidential Restricted' : 'General Public'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => toggleConfidential(lane.id)} className={`p-2 rounded-lg transition-all shadow-sm active:scale-95 ${lane.isConfidential ? 'bg-[#a94228] text-white animate-pulse' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`} title="Toggle Privacy Lock">
                                                        {lane.isConfidential ? <Icons.Lock size={15}/> : <Icons.Eye size={15}/>}
                                                    </button>
                                                    <button onClick={() => deleteLane(lane.id)} className="p-2 rounded-lg text-[#932c2e] hover:bg-[#932c2e]/10 transition-all border border-transparent" title="Remove Lane Node">
                                                        <Icons.Trash2 size={15}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub slots expansion exactly matching User Permissions child elements structure */}
                                            {lane.subSlots && expandedLanes[lane.id] && (
                                                <div className="ml-12 space-y-1.5 animate-fadeIn pr-2 pb-2">
                                                    {lane.subSlots.map((sub: any) => (
                                                        <div key={sub.id} className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border bg-white transition-all ${sub.isConfidential ? 'border-[#932c2e]/30 bg-[#932c2e]/5 shadow-inner' : 'border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${sub.isConfidential ? 'bg-[#a94228] animate-pulse' : 'bg-[#b7a159]'}`}></div>
                                                                <div className="text-left font-sans">
                                                                    <span className="text-[11.5px] font-black text-[#212c46] uppercase tracking-widest font-mono">{sub.id} - {sub.label}</span>
                                                                    <p className="text-[10px] font-medium text-[#7a8b95] leading-none mt-0.5 font-sans">{sub.rule}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => toggleSubSlotConfidential(lane.id, sub.id)} className={`p-1.5 rounded-md transition-all ${sub.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228]' : 'text-[#7a8b95] hover:bg-[#f8f9fa]'}`} title="Lock slot">
                                                                {sub.isConfidential ? <Icons.Lock size={14}/> : <Icons.Eye size={14}/>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {lane.subSlots.length === 0 && (
                                                        <div className="py-2.5 px-4 text-center text-[10px] font-black uppercase text-[#7a8b95] border border-dashed rounded-lg border-[#eaeaec] bg-[#f8f9fa]">
                                                            No active active hydraulic ramp configurations.
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
