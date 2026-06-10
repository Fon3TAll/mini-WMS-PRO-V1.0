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

const VehicleStatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Available': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'En-Route': 
      style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; 
      break;
    case 'Maintenance': 
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

// 1. Create/Edit Vehicle Configuration Modal
function EditVehicleModal({ isOpen, onClose, record, onSave }: any) {
    const [tempRecord, setTempRecord] = useState<any>({});

    useEffect(() => {
        if (isOpen && record) {
            setTempRecord(JSON.parse(JSON.stringify(record)));
        }
    }, [isOpen, record]);

    if (!isOpen || !record || !tempRecord) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempRecord);
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Truck className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">VEHICLE PROFILE RECTIFICATION</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.Tag size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">VEHICLE MASTER ID</p>
                            <h4 className="text-[13px] font-black text-[#212c46] leading-none uppercase">{tempRecord.id}</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Plate Number (ทะเบียนรถ)</label>
                            <input 
                                required 
                                type="text"
                                value={tempRecord.plate || ''} 
                                onChange={e => setTempRecord({...tempRecord, plate: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Vehicle Type</label>
                            <select 
                                value={tempRecord.type || '6-Wheel Truck'} 
                                onChange={e => setTempRecord({...tempRecord, type: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="6-Wheel Truck">6-Wheel Truck</option>
                                <option value="4-Wheel Pickup">4-Wheel Pickup</option>
                                <option value="10-Wheel Trailer">10-Wheel Trailer</option>
                                <option value="Van Express">Van Express</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Cargo Capacity (CBM)</label>
                            <input 
                                required 
                                type="number"
                                step="0.1"
                                value={tempRecord.cbm || ''} 
                                onChange={e => setTempRecord({...tempRecord, cbm: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Max Weight Load (KG)</label>
                            <input 
                                required 
                                type="number"
                                value={tempRecord.maxWeight || ''} 
                                onChange={e => setTempRecord({...tempRecord, maxWeight: parseInt(e.target.value) || 0})} 
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
                                value={tempRecord.driver || ''} 
                                onChange={e => setTempRecord({...tempRecord, driver: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Next Maintenance</label>
                            <input 
                                required 
                                type="date"
                                value={tempRecord.maintenance || ''} 
                                onChange={e => setTempRecord({...tempRecord, maintenance: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Current Fleet Status</label>
                        <select 
                            value={tempRecord.status || 'Available'} 
                            onChange={e => setTempRecord({...tempRecord, status: e.target.value})} 
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                        >
                            <option value="Available">Available</option>
                            <option value="En-Route">En-Route</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Save Fleet Unit</button>
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
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[480px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 px-5 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2.5 uppercase tracking-widest text-[#e9d8c0] text-base"><Icons.BookOpen size={18} className="text-[#b7a159]"/> FLEET & LOAD GUIDE</h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1">Vehicle Master & Route Compliance Logic</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.ShieldAlert size={15} className="text-[#b7a159]"/> 1. Fleet Load Optimization
            </h4>
            <p className="text-[11px] mb-2">ทำความเข้าใจโครงสร้างน้ำหนักและคิวบรรทุกรถขนส่งกระจายคลังสินค้า (Fulfillment Center):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#eaeaec] shadow-sm">
                  <Icons.Scale size={14} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Cargo Cubes (CBM):</strong> อัตราคิวบิตที่ใช้วางแผนมัดออเดอร์พาเลท คลัง WMS จะเปรียบเทียบขนาดก่อนปล่อยงาน</div>
                </li>
                <li className="flex items-start gap-2 bg-[#657f4d]/10 p-2.5 rounded-xl border border-[#657f4d]/30 shadow-sm">
                  <Icons.Weight size={14} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#657f4d] font-black">Legal Weight Caps:</strong> การจำกัดน้ำหนักตามพิกัดประเภทสิบล้อ หกล้อ ป้องกันการละเมิดกฎกฎหมายขนส่งทางหลวง</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.Settings size={15} className="text-[#d96245]"/> 2. Preventive Maintenance Nodes
            </h4>
            <p className="text-[11px] mb-2">รอบการดูแลรักษารถขนส่งเพื่อการันตีความปลอดภัยระหว่างเส้นทาง (Defect Reduction State):</p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong className="text-[#657f4d]">On-Road Active:</strong> รถสถานะ Available สามารถออกทำงานร่วมกับแผนจัดคิวรถ Route Optimization</li>
                <li><strong className="text-[#3f809e]">Locked Dispatch:</strong> รถ En-Route มีเอกสาร EPOD ค้างอยู่ในสถานะออกกระจายสินค้า</li>
                <li><strong className="text-[#932c2e]">Lock Out Inspection:</strong> รถที่มีสถานะ Maintenance จะถูกระบบปฏิเสธงานจัดทริปขนส่งทันทีจนกว่าจะผ่านการบันทึกตรวจเช็ค</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.Lock size={15} className="text-[#3f809e]"/> 3. Configuration Security Locks
            </h4>
            <p className="text-[11px]">เจ้าหน้าที่ซูเปอร์바이เซอร์และเซฟตี้ สามารถตรวจสอบและประกาศล็อกรถ/ปลดล็อกใช้งาน หรือบิดสถานะฉุกเฉินได้ทันทีผ่านแผงการควบคุม</p>
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
export default function VehicleMaster() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (Configs / Policies) or 'staff' (Fleet Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom states modeled identically to UserPermissions 
  const [expandedVehicles, setExpandedVehicles] = useState<any>({ 'V-001': true, 'V-003': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'V-001': false, 'V-003': false, 'V-005': true });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });

  // Exact 100% original mock examples preserved perfectly
  const [vehicles, setVehicles] = useState<any[]>([
    { id: 'V-001', plate: '7 กก 1234 กทม', type: '6-Wheel Truck', cbm: 25.5, maxWeight: 7500, driver: 'Kitti Somsak', status: 'Available', maintenance: '2026-07-15' },
    { id: 'V-002', plate: 'ถผ 9988 กทม', type: '4-Wheel Pickup', cbm: 8.2, maxWeight: 1500, driver: 'Somsak Vichai', status: 'En-Route', maintenance: '2026-06-20' },
    { id: 'V-003', plate: '88-1234 ชลบุรี', type: '10-Wheel Trailer', cbm: 65.0, maxWeight: 25000, driver: 'Preecha Kla', status: 'Available', maintenance: '2026-05-30' },
    { id: 'V-004', plate: '1 กข 4567 กทม', type: '4-Wheel Pickup', cbm: 8.5, maxWeight: 1500, driver: 'Anuwat J.', status: 'En-Route', maintenance: '2026-08-01' },
    { id: 'V-005', plate: '2 กค 8899 เชียงใหม่', type: '6-Wheel Truck', cbm: 28.0, maxWeight: 8000, driver: 'Somchai T.', status: 'Maintenance', maintenance: '2026-05-05' },
    { id: 'V-006', plate: '7 ผฉ 1122 กทม', type: 'Van Express', cbm: 12.4, maxWeight: 2500, driver: 'Vichai M.', status: 'Available', maintenance: '2026-09-12' },
  ]);

  const [fleetRules, setFleetRules] = useState<any[]>([
    { id: 'RULE-HEAVY', type: '10-Wheel Trailer', speedLimit: '80 km/h', payloadLimit: '95%', active: true },
    { id: 'RULE-MEDIUM', type: '6-Wheel Truck', speedLimit: '90 km/h', payloadLimit: '90%', active: true },
    { id: 'RULE-LIGHT', type: '4-Wheel Pickup', speedLimit: '100 km/h', payloadLimit: '85%', active: false },
  ]);

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(item => {
      const matchSearch = item.plate.toLowerCase().includes(search.toLowerCase()) || 
                          item.driver.toLowerCase().includes(search.toLowerCase()) ||
                          item.type.toLowerCase().includes(search.toLowerCase());
      const matchType = typeFilter === 'All' || item.type === typeFilter;
      return matchSearch && matchType;
    });
  }, [vehicles, search, typeFilter]);

  const currentData = filteredVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedVehicles((prev: any) => ({ ...prev, [id]: !prev[id] }));

  // KPI Calculations
  const totalFleetReady = vehicles.filter(v => v.status === 'Available').length;
  const totalOnMaintenance = vehicles.filter(v => v.status === 'Maintenance').length;
  const totalOnRoad = vehicles.filter(v => v.status === 'En-Route').length;
  const totalCbmCapacity = vehicles.reduce((sum, v) => sum + v.cbm, 0);

  const saveVehicleRecord = (savedData: any) => {
    setVehicles(prev => {
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
    const newVehicle = {
      id: `V-REG-${randomNum}`,
      plate: `9 ผผ ${randomNum} กทม`,
      type: '6-Wheel Truck',
      cbm: 24.5,
      maxWeight: 7200,
      driver: 'Thongchai K.',
      status: 'Available',
      maintenance: '2026-08-15'
    };
    setEditModal({ isOpen: true, data: newVehicle });
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditVehicleModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} record={editModal.data} onSave={saveVehicleRecord} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Truck size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      VEHICLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">MASTER</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      ACTIVE TRANSPORT FLEET LOGS, SPEED COMPLIANCE & VOLUMETRIC LIMITS
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Fleet Config
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.TableProperties className="text-[#b58c4f]" size={16} /> Fleet Register
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Fleet Capacity" value={`${formatNumber(totalCbmCapacity)} m³`} icon="boxes" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Total Cargo Vol" />
                <KpiCard label="Fleet Available" value={totalFleetReady} icon="check-circle" colorAccent={THEME.success} colorValue={THEME.success} desc="Ready Units" />
                <KpiCard label="En-Route Active" value={totalOnRoad} icon="activity" colorAccent={THEME.brightGold} colorValue={THEME.brightGold} desc="Fulfillment Nodes" />
                <KpiCard label="Off-Road Deficit" value={totalOnMaintenance} icon="shield-alert" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Under Maintenance" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ACCESS/ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                        <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4"><Icons.Layers size={18} className="text-[#b7a159]" /> COMPLIANCE CONTROLS</h3>
                        <div className="space-y-3">
                            <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">Auto Cube Optimizers</span>
                                <p className="text-[11px] text-[#212c46] font-bold leading-normal">เมื่อพิจารณาคิวและรอบการวิ่ง (Route Mapping) ค่าน้ำหนักเฉลี่ยรวม CBM ของสินค้าห้ามหลุดเกินสัดส่วน 95% ของความปลอดภัยรถคันระบุ</p>
                            </div>
                            <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">Fleet Defect Inspection</span>
                                <p className="text-[11px] text-[#212c46] font-bold leading-normal">บล็อกการลงเวลาและการเลือกใบส่งของรถยนต์ที่มีสถานะชำรุด โดยส่งการแจ้งเตือนเมื่อหลุดเกณฑ์การใช้งานทันที</p>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CONFIGURATION STANDARD REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.Sliders size={20} className="text-[#b7a159]"/> GLOBAL FLEET STANDARD COMPLIANCE</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Volumetric Fleet Rule
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {vehicles.map(vehicle => (
                                <div key={vehicle.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[vehicle.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[vehicle.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.Truck size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{vehicle.plate} ({vehicle.type})</span>
                                                    <button onClick={() => toggleExpand(vehicle.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedVehicles[vehicle.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[vehicle.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>Fleet Flag {confidentialityMap[vehicle.id] ? 'Restricted Dispatch' : 'Active Road Ready'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(vehicle.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[vehicle.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[vehicle.id] ? "Unlock Public Allocation Limit" : "Lock / RESTRICT Vehicle Dispatch"}
                                            >
                                                {confidentialityMap[vehicle.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => setEditModal({ isOpen: true, data: vehicle })}
                                                className="w-8 h-8 bg-white border border-[#eaeaec] rounded-lg flex items-center justify-center text-[#212c46] hover:border-[#b7a159] hover:text-[#b7a159] transition-colors shadow-sm"
                                                title="Edit Vehicle Configurations"
                                            >
                                                <Icons.Edit3 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedVehicles[vehicle.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#c5724e] uppercase font-black text-[9px] mb-1">CBM (VOLUMETRIC MEASUREMENT)</p>
                                                    <p className="font-bold text-[#c5724e] uppercase">{vehicle.cbm} Cubic Meters</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">PAYLOAD WEIGHT THRESHOLD</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{formatNumber(vehicle.maxWeight)} Kilograms</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Primary Dispatch Driver:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">{vehicle.driver}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Next Maintenance Inspector:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white bg-[#932c2e]`}>
                                                        {vehicle.maintenance}
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
                                <select value={typeFilter} onChange={(e) => {setTypeFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Vehicle Types</option>
                                    <option value="6-Wheel Truck">6-Wheel Truck</option>
                                    <option value="4-Wheel Pickup">4-Wheel Pickup</option>
                                    <option value="10-Wheel Trailer">10-Wheel Trailer</option>
                                    <option value="Van Express">Van Express</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export Fleet Log
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search Driver, Plate Number..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* INTERACTIVE TABLE ACCORDING TO SPEC DETAILS */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10 text-left">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสอ้างอิงรถยนต์</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">หมายเลขทะเบียนรถ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ประเภทรถยนต์</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">พนักงานขับรถหลัก</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ความจุบรรทุก (CBM)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">น้ำหนักบรรทุกสูงสุด (ตัน)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                        <td className="py-2.5 px-4 font-black text-[#ad2b10] text-[12px] uppercase">{item.plate}</td>
                                        <td className="py-2.5 px-4">
                                            <span className="px-2 py-0.5 bg-[#4d87a8]/10 rounded text-[11px] font-black uppercase text-[#4d87a8]">{item.type}</span>
                                        </td>
                                        <td className="py-2.5 px-4 text-[12px] font-bold text-[#7a8b95]">{item.driver}</td>
                                        <td className="py-2.5 px-4 font-black text-[#212c46] text-right text-[12px]">{item.cbm.toFixed(1)} CBM</td>
                                        <td className="py-2.5 px-4 font-black text-[#212c46] text-right text-[12px]">{formatNumber(item.maxWeight)} KG</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <VehicleStatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setEditModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#212c46] hover:bg-[#212c46] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="Configure Unit"
                                                >
                                                    <Icons.Eye size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteVehicle(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#932c2e] hover:bg-[#932c2e] hover:text-white transition-all shadow-sm active:scale-95" 
                                                    title="Delete Vehicle Profile"
                                                >
                                                    <Icons.Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[#7a8b95] font-black uppercase text-[12px] tracking-widest bg-gray-50/50">No Fleet units recorded found</td>
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Fleet Count: {filteredVehicles.length}</p>
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
