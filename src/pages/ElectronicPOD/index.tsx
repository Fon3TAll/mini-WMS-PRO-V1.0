import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Premium Industrial Earth-tones / Home Palette) ---
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

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH').format(val);

// --- Sub-components ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-4 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[105px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={100} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={18} />
            </div>
        </div>
        <div className="relative z-10 mt-1 flex items-end justify-between">
            <p className="text-[24px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[10px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Success': 
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
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Electronic POD Configuration Settings Modal
function EPODConfigModal({ isOpen, onClose, pod, onSave }: any) {
    const [tempPOD, setTempPOD] = useState<any>({});

    useEffect(() => {
        if (isOpen && pod) {
            setTempPOD(JSON.parse(JSON.stringify(pod)));
        }
    }, [isOpen, pod]);

    if (!isOpen || !pod || !tempPOD) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempPOD);
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Smartphone className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">EPOD RECORD RECTIFICATION</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.Activity size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">PROVED NUMBER</p>
                            <h4 className="text-[13px] font-black text-[#212c46] leading-none uppercase">{tempPOD.id}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Destination Branch</label>
                            <input 
                                required 
                                type="text"
                                value={tempPOD.branch || ''} 
                                onChange={e => setTempPOD({...tempPOD, branch: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Route No.</label>
                            <input 
                                required 
                                type="text"
                                value={tempPOD.route || ''} 
                                onChange={e => setTempPOD({...tempPOD, route: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Assigned Driver</label>
                            <input 
                                required 
                                type="text"
                                value={tempPOD.driver || ''} 
                                onChange={e => setTempPOD({...tempPOD, driver: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Time Captured</label>
                            <input 
                                required 
                                type="text"
                                value={tempPOD.time || ''} 
                                onChange={e => setTempPOD({...tempPOD, time: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">No. Photos</label>
                            <input 
                                required 
                                type="number"
                                value={tempPOD.photos || 0} 
                                onChange={e => setTempPOD({...tempPOD, photos: parseInt(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1 col-span-2">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Status</label>
                            <select 
                                value={tempPOD.status || 'Pending'} 
                                onChange={e => setTempPOD({...tempPOD, status: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Success">Success</option>
                                <option value="Pending">Pending</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Save Record</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// 2. Proof Evidence (Photos & Signatures) Modal
function ShowEvidenceModal({ isOpen, onClose, data }: any) {
    if (!isOpen || !data) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[480px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Camera className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">SIGNATURE & PHOTO PROOF</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col bg-[#f8f9fa] p-5 text-left space-y-4">
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                    <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">BRANCH NAME</span>
                    <h4 className="text-[15px] font-black text-[#212c46] uppercase leading-tight mt-1">{data.branch}</h4>
                    <span className="text-[10px] font-bold text-[#657f4d] flex items-center gap-1 mt-1.5">
                        <Icons.MapPin size={12} /> GPS LOCATION VERIFIED & LOCKED
                    </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                    <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">DIGITAL RECIEVER SIGNATURE</span>
                    <div className="h-28 bg-[#fdfdfd] border-2 border-dashed border-[#eaeaec] rounded-lg mt-2 flex items-center justify-center relative overflow-hidden">
                        {data.signed ? (
                          <div className="transform -rotate-6 font-serif italic text-3xl font-black text-[#2c4972] opacity-60 tracking-widest select-none">
                            {data.driver.split(' ')[0]} Signed
                          </div>
                        ) : (
                          <span className="text-[11px] font-black text-[#7a8b95] uppercase">NO SIGNATURE PROVIDED</span>
                        )}
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">PHOTO ATTACHMENTS ({data.photos})</span>
                        <span className="text-[11px] font-bold text-[#7a8b95] font-mono">Job Ref: {data.route}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {Array.from({ length: Math.max(data.photos, 1) }).map((_, i) => (
                            <div key={i} className="aspect-video bg-[#f8f9fa] border border-[#eaeaec] rounded-lg flex items-center justify-center hover:border-[#b7a159] cursor-pointer transition-colors group">
                                <Icons.Image size={24} className="text-[#d7d7d7] group-hover:text-[#b7a159] transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border-t border-[#eaeaec] p-4 flex justify-end gap-2 rounded-b-xl shrink-0 -mx-5 -mb-5">
                    <button onClick={onClose} className="px-4 py-1.5 bg-[#414757] hover:bg-[#212c46] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors">Close View</button>
                    <button onClick={() => { window.print(); onClose(); }} className="px-4 py-1.5 bg-[#ad2b10] hover:bg-[#922724] text-white rounded-lg text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
                        <Icons.Printer size={13}/> Print Proof
                    </button>
                </div>
            </div>
        </DraggableModal>
    );
}

// 3. User Guide Panel (Identical comprehensive style as UserPermissions, but Tight Padding / Lean)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 px-5 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2.5 uppercase tracking-widest text-[#e9d8c0] text-base"><Icons.BookOpen size={18} className="text-[#b7a159]"/> EPOD GUIDE</h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1">Proof of Delivery Settings & Logs System</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.ShieldAlert size={15} className="text-[#b7a159]"/> 1. Digital Evidence Verification
            </h4>
            <p className="text-[11px] mb-2">เมื่อพนักงานขับรถขนส่งสินค้าเรียบร้อยแล้ว ระบบจะซิงค์ข้อมูล EPOD เข้าสู่หน้านี้โดยมี 2 หลักฐานรับประกันสำคัญ:</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={14} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Digital E-Signature:</strong> ลายเซ็นดิจิทัลเฉพาะบุคคล ถูกบันทึกล็อกไว้เพื่อความน่าเชื่อถือทางกฎหมายจัดซื้อ</div>
                </li>
                <li className="flex items-start gap-2 bg-[#657f4d]/10 p-2.5 rounded-xl border border-[#657f4d]/30 shadow-sm">
                  <Icons.Camera size={14} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#657f4d] font-black">Photo Proof:</strong> ภาพถ่ายสถานที่และสภาพสินค้า ป้องกันการอ้างสิทธิ์เสียหายของสินค้าผิดจุดรับ</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.Smartphone size={15} className="text-[#d96245]"/> 2. Configuration Settings
            </h4>
            <p className="text-[11px] mb-2">เพื่ออำนวยความสะดวกกรณีข้อมูลไม่ถูกต้อง สมาร์ทบอร์ดนี้เปิดโอกาสให้แก้ไขข้อมูลผ่าน EPOD Master ดังนี้:</p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong className="text-[#212c46]">Pending Resolution:</strong> พนักงานหยิบยกเลิกหรือขับรถรายงานอุบัติเหตุเข้าระบบกลาง</li>
                <li><strong className="text-[#b58c4f]">Signature Recovery:</strong> การจัดสรรเซ็นซ่อมแซมกรณีแท็บเล็ตหน้าสาขาขัดข้อง</li>
                <li><strong className="text-[#a94228]">Reject Claims:</strong> บันทึกรายละเอียดสินค้าชำรุดเสียหายเพื่อตรวจสอบ</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.RefreshCw size={15} className="text-[#3f809e]"/> 3. Real-time Audit Node
            </h4>
            <p className="text-[11px]">ระบบจะทำการ sync กับ smartphone app ของพนักงานทุกช่วง 5 นาที ปรังปรุงสถานะใบนำส่ง WMS ทันที</p>
          </section>
        </div>
        
        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Main Page Component ---
export default function ElectronicPOD() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (Config) or 'staff' (Audit Log Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom states modeled identically to UserPermissions 
  const [expandedPODs, setExpandedPODs] = useState<any>({ 'POD-88001': true, 'POD-88005': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'POD-88001': false, 'POD-88004': true, 'POD-88005': false });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });
  const [detailModal, setDetailModal] = useState<any>({ isOpen: false, data: null });

  // Original list items must contain 100% data from mock layout
  const [pods, setPods] = useState<any[]>([
    { id: 'POD-88001', route: 'RT-2026-001', branch: 'Siam Paragon', driver: 'Kitti S.', time: '10:45 AM', photos: 3, signed: true, status: 'Success', date: '2026-06-01' },
    { id: 'POD-88002', route: 'RT-2026-001', branch: 'Central World', driver: 'Kitti S.', time: '11:20 AM', photos: 2, signed: true, status: 'Success', date: '2026-06-01' },
    { id: 'POD-88003', route: 'RT-2026-002', branch: 'Mega Bangna', driver: 'Somsak W.', time: '09:15 AM', photos: 4, signed: true, status: 'Success', date: '2026-06-01' },
    { id: 'POD-88004', route: 'RT-2026-002', branch: 'IKEA Bangna', driver: 'Somsak W.', time: '-', photos: 0, signed: false, status: 'Pending', date: '2026-06-01' },
    { id: 'POD-88005', route: 'RT-2026-004', branch: 'Central Westgate', driver: 'Anuwat J.', time: '13:00 PM', photos: 1, signed: false, status: 'Rejected', date: '2026-06-01' },
    { id: 'POD-88006', route: 'RT-2026-005', branch: 'Iconsiam', driver: 'Vichai M.', time: '14:15 PM', photos: 2, signed: true, status: 'Success', date: '2026-06-01' },
  ]);

  const [policies, setPolicies] = useState<any[]>([
    { id: 'POLICY-EPOD-1', name: 'GPS Radius Constraint', value: '50 Meters', active: true },
    { id: 'POLICY-EPOD-2', name: 'Mandatory Photographic Proof', value: 'Required (Min 1 Photo)', active: true },
    { id: 'POLICY-EPOD-3', name: 'E-Sign Failback Validation', value: 'SMS Verification Node', active: false },
  ]);

  const filteredPods = useMemo(() => {
    return pods.filter(item => {
      const matchSearch = item.branch.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.driver.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pods, search, statusFilter]);

  const currentData = filteredPods.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredPods.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedPODs((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const totalDelivered = pods.filter(p => p.status === 'Success').length;
  const totalPending = pods.filter(p => p.status === 'Pending').length;
  const totalRejected = pods.filter(p => p.status === 'Rejected').length;

  const savePODRule = (savedData: any) => {
    setPods(prev => {
      const exists = prev.find(item => item.id === savedData.id);
      if (exists) {
        return prev.map(item => item.id === savedData.id ? { ...item, ...savedData } : item);
      } else {
        return [savedData, ...prev];
      }
    });
  };

  const handleCreateNewManual = () => {
    const randomId = `POD-8800${Math.floor(Math.random() * 9) + 7}`;
    const newPOD = {
      id: randomId,
      route: 'RT-2026-009',
      branch: 'EmQuartier',
      driver: 'Kitti S.',
      time: '15:30 PM',
      photos: 1,
      signed: true,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setEditModal({ isOpen: true, data: newPOD });
  };

  const handleDeletePOD = (id: string) => {
    setPods(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EPODConfigModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} pod={editModal.data} onSave={savePODRule} />
      <ShowEvidenceModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} data={detailModal.data} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Smartphone size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      ELECTRONIC <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">POD</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      DIGITAL PROOF OF DELIVERY & LOGISTICS SIGN-OFF TERMINAL
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Database size={16} /> Global Config
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.List className="text-[#b58c4f]" size={16} /> EPOD Log Audit
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Delivered Today" value={totalDelivered} icon="check-circle-2" colorAccent={THEME.success} colorValue={THEME.success} desc="Confirmed" />
                <KpiCard label="Awaiting Proof" value={totalPending} icon="clock" colorAccent={THEME.brightGold} colorValue={THEME.primary} desc="Awaiting Signature" />
                <KpiCard label="Rejection Issues" value={totalRejected} icon="shield-alert" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Claims Pending" />
                <KpiCard label="Compliance Sync" value="99.2%" icon="activity" colorAccent={THEME.primaryLight} colorValue={THEME.primaryLight} desc="Active Node Stat" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 bg-white/90 p-6 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                        <h3 className="text-[14px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-4 mb-6"><Icons.ShieldAlert size={20} className="text-[#b7a159]" /> DRIVER COMPLIANCE RULES</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#3f809e]/20">Smart Radius Control</span>
                                <p className="text-[12px] text-[#212c46] font-bold leading-normal">พนักงานขับรถจำเป็นต้องเข้าเซ็นเอกสารในขอบเขต 50 เมตรของพิกัด GPS หน้าร้านจริงเท่านั้น เพื่อผ่านการตรวจสอบ (Fulfillment Verification)</p>
                            </div>
                            <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-2 border border-[#932c2e]/30">Restricted Dispatch Area</span>
                                <p className="text-[12px] text-[#212c46] font-bold leading-normal">จำกัดการลงชื่อรับของซ้ำซ้อนเพื่อป้องกันสินค้าเสียหายกลางทราย และยืนยันสภาพรับตั้งแต่หน้าคิวรถ (Verified Loading)</p>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CAMPAIGN CONFIG REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.Smartphone size={20} className="text-[#b7a159]"/> GLOBAL DEVICE SETTING REGISTER</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add System Device Configuration
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {pods.map(pod => (
                                <div key={pod.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[pod.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[pod.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{pod.branch}</span>
                                                    <button onClick={() => toggleExpand(pod.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedPODs[pod.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[pod.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>Device Lock {confidentialityMap[pod.id] ? 'Restricted' : 'Active Public'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(pod.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[pod.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[pod.id] ? "Unlock Device Mode Limit" : "Lock / RESTRICT Device Driver Settings"}
                                            >
                                                {confidentialityMap[pod.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => setEditModal({ isOpen: true, data: pod })}
                                                className="w-8 h-8 bg-white border border-[#eaeaec] rounded-lg flex items-center justify-center text-[#212c46] hover:border-[#b7a159] hover:text-[#b7a159] transition-colors shadow-sm"
                                                title="Edit Device Config"
                                            >
                                                <Icons.Edit3 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedPODs[pod.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#7a8b95] uppercase font-black text-[9px] mb-1">ROUTE ID IDENTIFIER</p>
                                                    <p className="font-bold text-[#212c46] uppercase">{pod.route}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">ASSIGNED TRUCK DRIVER</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{pod.driver}</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Arrival Time Stamp:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">{pod.time}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Device Access Level:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white bg-[#3f809e]`}>
                                                        EPOD Handheld Node
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
                /* AUDIT LOG TABLE - High Performance Table */
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#b7a159] transition-colors">
                                <Icons.Filter size={14} className="text-[#7a8b95]" />
                                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Delivery Status</option>
                                    <option value="Success">Success</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export Delivery Document
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search Route, Branch, Driver..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* HIGH PERFORMANCE DATA TABLE WITH TIGHT STYLING */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10 text-left">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">หมายเลขเอกสารส่งมอบ (POD No.)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">เลขอ้างอิงงาน / เส้นทาง</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ลูกค้า / สาขาปลายทาง</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">พนักงานขับรถ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">หลักฐานการส่งมอบ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">เวลาที่บันทึก</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                        <td className="py-2.5 px-4 font-bold text-[#ad2b10] text-[12px]">{item.route}</td>
                                        <td className="py-2.5 px-4 font-black text-[#212c46] text-[12px] uppercase">{item.branch}</td>
                                        <td className="py-2.5 px-4 text-[12px] font-bold text-[#7a8b95]">{item.driver}</td>
                                        <td className="py-2.5 px-4">
                                            <div className="flex justify-center gap-1.5">
                                                <div className={`w-6 h-6 rounded flex items-center justify-center border ${item.photos > 0 ? 'bg-[#657f4d]/10 border-[#657f4d]/30 text-[#657f4d]' : 'bg-gray-100 border-gray-200 text-gray-300'}`} title="Photos">
                                                    <Icons.Camera size={12} />
                                                </div>
                                                <div className={`w-6 h-6 rounded flex items-center justify-center border ${item.signed ? 'bg-[#2c4972]/10 border-[#2c4972]/30 text-[#2c4972]' : 'bg-gray-100 border-gray-200 text-gray-300'}`} title="Signature">
                                                    <Icons.FileSignature size={12} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 font-mono text-[11px] font-bold text-[#7a8b95]">{item.time}</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#212c46] hover:bg-[#212c46] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="View Proof Detail"
                                                >
                                                    <Icons.Eye size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePOD(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#932c2e] hover:bg-[#932c2e] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="Delete POD"
                                                >
                                                    <Icons.Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[#7a8b95] font-black uppercase text-[12px] tracking-widest bg-gray-50/50">No EPOD records found</td>
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Logged: {filteredPods.length}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
                            >
                                <Icons.ChevronLeft size={14}/>
                            </button>
                            <div className="bg-white text-[#212c46] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                                Page {currentPage} / {totalPages}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
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
