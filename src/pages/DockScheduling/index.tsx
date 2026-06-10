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

// --- Original Example Data preserved 100% ---
const MOCK_SCHEDULES = [
    { id: 1, poNumber: 'PO-2026-0012', supplier: 'Thai Agro Co., Ltd', truckPlate: '70-1234 BKK', driver: 'Somchai S.', phone: '081-234-5678', dock: 'DOCK-01 (Inbound)', date: new Date().toISOString().split('T')[0], timeSlot: '08:00 - 09:30', status: 'Completed', eta: '07:55' },
    { id: 2, poNumber: 'PO-2026-0015', supplier: 'Siam Packaging', truckPlate: '65-9876 CMI', driver: 'Wichai T.', phone: '089-876-5432', dock: 'DOCK-02 (Inbound)', date: new Date().toISOString().split('T')[0], timeSlot: '10:00 - 11:30', status: 'Processing', eta: '10:05' },
    { id: 3, poNumber: 'PO-2026-0018', supplier: 'Global Logistics', truckPlate: '1กข 4567 BKK', driver: 'Adisak P.', phone: '082-345-6789', dock: 'DOCK-04 (Cross-Dock)', date: new Date().toISOString().split('T')[0], timeSlot: '13:00 - 14:00', status: 'Arrived', eta: '12:45' },
    { id: 4, poNumber: 'SO-2026-1002', supplier: 'Makro DC', truckPlate: '80-5555 RY', driver: 'Nipon K.', phone: '085-555-5555', dock: 'DOCK-06 (Outbound)', date: new Date().toISOString().split('T')[0], timeSlot: '14:30 - 16:00', status: 'Scheduled', eta: '14:30' },
    { id: 5, poNumber: 'PO-2026-0021', supplier: 'Farm Fresh Inc.', truckPlate: '71-2222 NPT', driver: 'Panya W.', phone: '086-666-6666', dock: 'DOCK-01 (Inbound)', date: new Date().toISOString().split('T')[0], timeSlot: '15:00 - 16:30', status: 'Delayed', eta: '16:00' },
];

const DOCK_LIST = [
    'DOCK-01 (Inbound)', 
    'DOCK-02 (Inbound)', 
    'DOCK-03 (Inbound)', 
    'DOCK-04 (Cross-Dock)', 
    'DOCK-05 (Outbound)', 
    'DOCK-06 (Outbound)'
];

const TIME_SLOTS = [
    '08:00 - 09:30', 
    '10:00 - 11:30', 
    '13:00 - 14:00', 
    '14:30 - 16:00', 
    '16:30 - 18:00'
];

// Mock Docks Data for Settings (User Permissions Standard)
const MOCK_DOCK_CONFIGS = [
  { 
    id: 'DOCK-01', 
    name: 'DOCK 01: HIGH-VOLUME INBOUND', 
    strategy: 'AI Inbound Dispatch Active', 
    type: 'Inbound Standard',
    maxCapacity: 12,
    currentAllocated: 5,
    isConfidential: false,
    subSlots: [
      { id: 'DK-01-A', label: 'RAMP 01-A (HYDRAULIC LIFT-DRY)', rule: 'Strict FIFO, dry trailer priority', isConfidential: false },
      { id: 'DK-01-B', label: 'RAMP 01-B (MANUAL BOARD)', rule: 'General purpose back-up', isConfidential: false },
    ]
  },
  { 
    id: 'DOCK-02', 
    name: 'DOCK 02: REFRIGERATED INBOUND', 
    strategy: 'Cold-Chain Specialized', 
    type: 'Inbound Cold',
    maxCapacity: 6,
    currentAllocated: 2,
    isConfidential: true,
    subSlots: [
      { id: 'DK-02-A', label: 'REFRIGERATED DUAL SEAL AIR-LOCK', rule: 'Cold air block seal buffer active', isConfidential: true },
    ]
  },
  { 
    id: 'DOCK-04', 
    name: 'DOCK 04: CROSS-DOCK PORTAL', 
    strategy: 'Zero-Storage Transit Sync', 
    type: 'Direct Cross-Dock',
    maxCapacity: 15,
    currentAllocated: 4,
    isConfidential: false,
    subSlots: [
      { id: 'DK-04-A', label: 'AUTOMATED EXPRESS CONVEYOR S-1', rule: 'Fast scan line sorting automatic transit', isConfidential: false },
    ]
  },
  { 
    id: 'DOCK-06', 
    name: 'DOCK 06: OUTBOUND LOAD terminal', 
    strategy: 'Outbound Bulk Scheduling', 
    type: 'Outbound Dispatch',
    maxCapacity: 10,
    currentAllocated: 3,
    isConfidential: false,
    subSlots: [
      { id: 'DK-06-A', label: 'OUTBOUND HEAVY RAMP T-1', rule: 'Forklift continuous loading only', isConfidential: false },
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> DOCK SCHEDULING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Logistics Appointment & Traffic Guide</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11.5px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. วงจรการไหลของช่องจอด (Dock Flow Rules)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ระบบจัดรถและคิวรถเพื่อเพิ่มประสิทธิภาพการจอดถ่ายพัสดุ (Access Traffic Lifecycle):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Zap size={12} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8] font-black">AI Auto-Sizing:</strong> ระบบจะคำนวณและดึงตารางเวลาเข้าช่องรับสินค้าโดยอัตโนมัติ ช่วยลดปัญหาขวดโหลและรักษาระดับการให้บริการจราจร (Logistics Traffic SLA)</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Docks:</strong> สำหรับท่าจอดสินค้าแช่เย็น (Cold Store) หรือสินค้าควบคุมพิเศษ ท่าเหล่านี้จะถูกตั้งสิทธิ์ล็อกความเป็นส่วนตัว เพื่อให้เฉพาะผู้ใช้ที่จำเพาะเข้าตรวจสอบรายการการจองได้</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={13} className="text-[#b7a159]"/> 2. ลำดับสถานะการเดินทาง (Travel Status SLA)
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-[11px] font-medium text-[#414757]">
              <li>เมื่อทำการจองเสร็จเรียบร้อย สถานะเริ่มต้นคิวคือ <span className="text-[#4d87a8] font-bold">Scheduled</span></li>
              <li>เมื่อพบตัวรถเดินทางมาถึงจุดชั่งหรือลานตรวจด้านหน้า กดเช็คอินเพื่อตั้งค่า <span className="text-[#b58c4f] font-bold">Arrived</span></li>
              <li>เมื่อรถเข้านั่งแท่นประทับคาร์เทลเรียบร้อย เริ่มขั้นตอนถ่ายพัสดุเป็น <span className="text-[#ab7d82] font-bold">Processing</span></li>
              <li>เมื่อลงสินค้าเสร็จและตรวจพบว่าเคลื่อนตัวออกจากท่าให้ปิดแบบ <span className="text-[#657f4d] font-bold">Completed</span> เพื่อคืนที่ว่าง</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Compass size={13} className="text-[#b58c4f]"/> 3. เหตุล่าช้าสะสม (Delayed Handling Alert)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              กรณีพบคิวที่เข้าไม่ตรงเวลาเป้าหมายที่จอง ระบบบันทึกสะสมเวลากระทบ (Delayed) โดยเตือนภัยคิวถัดไปอัตโนมัติ เพื่อให้ผู้ควบคุมวางแผนสลับซ่อมคิว (Override Allocation) ทันเวลา
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

// --- Create/Edit Schedule Modal using Draggable Modal ---
function ScheduleModal({ isOpen, onClose, data, onSave }: any) {
    const [formData, setFormData] = useState({
        poNumber: '', 
        supplier: '', 
        truckPlate: '', 
        driver: '', 
        phone: '', 
        dock: DOCK_LIST[0], 
        date: new Date().toISOString().split('T')[0], 
        timeSlot: TIME_SLOTS[0], 
        status: 'Scheduled', 
        eta: ''
    });

    useEffect(() => {
        if(isOpen && data) setFormData(data);
        else if(isOpen) setFormData({ poNumber: '', supplier: '', truckPlate: '', driver: '', phone: '', dock: DOCK_LIST[0], date: new Date().toISOString().split('T')[0], timeSlot: TIME_SLOTS[0], status: 'Scheduled', eta: '' });
    }, [isOpen, data]);

    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave(formData);
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
                            <Icons.CalendarClock size={18} strokeWidth={2.5}/>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">{data ? 'EDIT APPOINTMENT' : 'NEW DOCK BOOKING'}</h3>
                            <p className="text-[9px] font-bold text-[#b7a159] uppercase tracking-widest flex items-center gap-1"><Icons.Truck size={10} /> TRAFFIC ALLOCATION CENTER</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-[#932c2e] p-1.5 hover:bg-white/10 rounded-lg transition-all"><Icons.X size={18} /></button>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="p-5 bg-[#f3f3f1] flex flex-col gap-4 text-left">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-3">
                        <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] pb-1.5 flex items-center gap-1.5"><Icons.Truck size={12} className="text-[#212c46]"/> VEHICLE & SHIPMENT</h4>
                        
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#212c46] uppercase block">PO / SO Document <span className="text-[#a94228]">*</span></label>
                            <input required value={formData.poNumber} onChange={e=>setFormData({...formData, poNumber: e.target.value.toUpperCase()})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159]" placeholder="PO-XXXX" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#212c46] uppercase block">Supplier Name <span className="text-[#a94228]">*</span></label>
                            <input required value={formData.supplier} onChange={e=>setFormData({...formData, supplier: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" placeholder="e.g. Thai Agro Co., Ltd" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#212c46] uppercase block">License Plate Number <span className="text-[#a94228]">*</span></label>
                            <input required value={formData.truckPlate} onChange={e=>setFormData({...formData, truckPlate: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-black text-[#212c46] uppercase outline-none focus:border-[#b7a159]" placeholder="e.g. 70-1234 BKK" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#212c46] uppercase block">Driver Name</label>
                                <input value={formData.driver} onChange={e=>setFormData({...formData, driver: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" placeholder="Driver Name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#212c46] uppercase block">Contact Phone</label>
                                <input value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]" placeholder="081-XXXX" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] pb-1.5 flex items-center gap-1.5"><Icons.Clock size={12} className="text-[#3f809e]"/> DOCK TIMELINE RANGE</h4>
                            
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#212c46] uppercase block">Assigned Dock Terminal <span className="text-[#a94228]">*</span></label>
                                <select value={formData.dock} onChange={e=>setFormData({...formData, dock: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-1.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] cursor-pointer">
                                    {DOCK_LIST.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#212c46] uppercase block">Target Date <span className="text-[#a94228]">*</span></label>
                                    <input type="date" required value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] cursor-pointer" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#212c46] uppercase block">Time Frame <span className="text-[#a94228]">*</span></label>
                                    <select value={formData.timeSlot} onChange={e=>setFormData({...formData, timeSlot: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-2 py-1.5 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] cursor-pointer">
                                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-[#eaeaec] grid grid-cols-2 gap-2 mt-2">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#212c46] uppercase block">Workflow Stage</label>
                                <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-2 py-1.5 text-[12px] font-black text-[#212c46] uppercase outline-none focus:border-[#b7a159] cursor-pointer">
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Arrived">Arrived</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Delayed">Delayed</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-[#212c46] uppercase block">Actual Gate ETA</label>
                                <input type="time" value={formData.eta} onChange={e=>setFormData({...formData, eta: e.target.value})} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-2.5 py-1 text-[12px] font-black text-[#212c46] outline-none focus:border-[#b7a159] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-[#eaeaec] flex justify-end gap-2">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#7a8b95] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec]/40 transition-all">Cancel</button>
                    <button type="submit" className="px-5 py-2 bg-[#212c46] text-white rounded-lg text-[11px] font-black uppercase shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5 tracking-widest">
                        <Icons.CheckCircle2 size={14}/> SAVE APPOINTMENT
                    </button>
                </div>
            </form>
        </DraggableModal>
    );
}

export default function DockScheduling() {
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' or 'settings' (มาตรฐานเดียวกับ User Permissions)
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [modalData, setModalData] = useState({ isOpen: false, item: null });
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Main States
    const [schedules, setSchedules] = useState(MOCK_SCHEDULES);
    const [docks, setDocks] = useState<any[]>(MOCK_DOCK_CONFIGS);

    // Expands for Dock Settings (Standardเดียวกับ User Permissions)
    const [expandedDocks, setExpandedDocks] = useState<any>({ 'DOCK-01': true, 'DOCK-02': true });

    // KPI Values (Today)
    const todayStr = new Date().toISOString().split('T')[0];
    const todaysSchedules = schedules.filter(s => s.date === todayStr);
    
    const totalToday = todaysSchedules.length;
    const processingToday = todaysSchedules.filter(s => s.status === 'Arrived' || s.status === 'Processing').length;
    const completedToday = todaysSchedules.filter(s => s.status === 'Completed').length;
    const delayedToday = todaysSchedules.filter(s => s.status === 'Delayed').length;

    // Filter Logic
    const filteredSchedules = useMemo(() => {
        let res = schedules;
        if (filterStatus !== 'All') {
            res = res.filter(s => s.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(s => 
                s.poNumber.toLowerCase().includes(q) || 
                s.supplier.toLowerCase().includes(q) || 
                s.truckPlate.toLowerCase().includes(q) ||
                s.dock.toLowerCase().includes(q) ||
                (s.driver && s.driver.toLowerCase().includes(q))
            );
        }
        // Sort by Date then TimeSlot
        return res.sort((a, b) => {
            if (a.date === b.date) return a.timeSlot.localeCompare(b.timeSlot);
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
    }, [schedules, searchQuery, filterStatus]);

    const paginatedSchedules = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredSchedules.slice(start, start + itemsPerPage);
    }, [filteredSchedules, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage) || 1;

    // Handlers
    const handleSaveSchedule = (data: any) => {
        if(data.id) {
            setSchedules(schedules.map(s => s.id === data.id ? data : s));
        } else {
            setSchedules([{ ...data, id: Date.now() }, ...schedules]);
        }
        setModalData({ isOpen: false, item: null });
    };

    const handleDeleteSchedule = (id: number) => {
        if(window.confirm('Are you sure you want to delete this schedule assignment?')) {
            setSchedules(schedules.filter(s => s.id !== id));
        }
    };

    const handleQuickAction = (id: number, newStatus: string) => {
        setSchedules(schedules.map(s => s.id === id ? { ...s, status: newStatus } : s));
    };

    const toggleConfidential = (dockId: string) => {
        setDocks(docks.map(d => d.id === dockId ? { ...d, isConfidential: !d.isConfidential } : d));
    };

    const toggleSubSlotConfidential = (dockId: string, subSlotId: string) => {
        setDocks(docks.map(d => {
            if (d.id === dockId) {
                return {
                    ...d,
                    subSlots: d.subSlots.map((s: any) => s.id === subSlotId ? { ...s, isConfidential: !s.isConfidential } : s)
                };
            }
            return d;
        }));
    };

    const toggleExpandDock = (dockId: string) => {
        setExpandedDocks((prev: any) => ({ ...prev, [dockId]: !prev[dockId] }));
    };

    const deleteDock = (dockId: string) => {
        if(window.confirm(`Are you sure you want to remove dock node ${dockId}?`)) {
            setDocks(docks.filter(d => d.id !== dockId));
        }
    };

    const getStatusStyle = (status: string) => {
        if(status === 'Scheduled') return 'bg-[#4d87a8]/10 text-[#3f809e] border-[#4d87a8]/30';
        if(status === 'Arrived') return 'bg-[#b58c4f]/10 text-[#a94228] border-[#b58c4f]/30';
        if(status === 'Processing') return 'bg-[#ab7d82]/10 text-[#932c2e] border-[#ab7d82]/30';
        if(status === 'Completed') return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30';
        if(status === 'Delayed') return 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30';
        return 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30';
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
            
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            
            <ScheduleModal 
                isOpen={modalData.isOpen} 
                data={modalData.item} 
                onClose={() => setModalData({ isOpen: false, item: null })} 
                onSave={handleSaveSchedule} 
            />

            {/* HEADER SECTION */}
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 select-none">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.CalendarClock size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            DOCK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">SCHEDULING</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            Logistics Traffic Control & Appointment Manager
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/50 p-1.1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => setActiveTab('appointments')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'appointments' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.CalendarClock size={15} /> Appointments
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.SlidersHorizontal size={15} /> Dock Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS (Sleek, Compact, Lean Padding - exactly 84px height matching requesting specs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="Today's Schedule" value={totalToday} icon="calendar-clock" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Allocated Slots" />
                        <KpiCard label="Arrived / Processing" value={processingToday} icon="truck" colorAccent={THEME.gold} colorValue={THEME.primary} desc="At Terminal docks" />
                        <KpiCard label="Completed Transit" value={completedToday} icon="check-circle-2" colorAccent={THEME.success} colorValue={THEME.success} desc="Vehicles dispatched" />
                        <KpiCard label="Delayed / Alerts" value={delayedToday} icon="alert-triangle" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Require adjustment" />
                    </div>

                    {activeTab === 'appointments' ? (
                        <div className="bg-white rounded-[20px] shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col">
                            
                            {/* Filter Bar */}
                            <div className="px-6 py-4.5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center bg-white border border-[#eaeaec] h-10 px-3 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
                                        <Icons.Filter size={13} className="text-[#b58c4f] shrink-0" />
                                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black text-[#503447] uppercase tracking-widest outline-none cursor-pointer w-full">
                                            <option value="All">All Job Status</option>
                                            <option value="Scheduled">Scheduled</option>
                                            <option value="Arrived">Arrived</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Delayed">Delayed</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full sm:w-72">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search PO, Supplier, License Plate..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold text-[#212c46] rounded-xl border border-[#eaeaec] bg-white outline-none focus:border-[#b7a159] shadow-sm transition-all placeholder:text-[#cbd5e1]" />
                                    </div>
                                </div>
                                <div className="flex gap-3 shrink-0 w-full md:w-auto">
                                    <button onClick={() => setModalData({ isOpen: true, item: null })} className="px-4.5 py-2 bg-[#212c46] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm border border-[#212c46] hover:bg-[#414757] w-full md:w-auto">
                                        <Icons.Plus size={14} /> NEW APPOINTMENT
                                    </button>
                                </div>
                            </div>

                            {/* TABLE (Standardized layout styling exactly as specified) */}
                            <div className="overflow-x-auto custom-scrollbar bg-white">
                                <table className="w-full text-left font-sans border-collapse">
                                    {/* py-4 space, bg-133951, border-b-2 is ad2b10 */}
                                    <thead className="bg-[#133951] text-white">
                                        <tr>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">ใบสั่งซื้อ (PO) / ซัพพลายเออร์</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">วันที่ / ช่วงเวลาที่จอง</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">ช่องจอดเทียบ (Dock)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">ข้อมูลรถ & พนักงานขับรถ</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">สถานะกระบวนงาน</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap w-32">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] bg-white text-left font-mono">
                                        {paginatedSchedules.map(schedule => (
                                            <tr key={schedule.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#a94228] tracking-tighter text-[12px] font-mono">{schedule.poNumber}</span>
                                                        <span className="font-bold text-[#212c46] text-[11px] font-sans truncate max-w-[200px]" title={schedule.supplier}>{schedule.supplier}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#212c46] text-[12px]">{formatDate(schedule.date)}</span>
                                                        <span className="text-[11px] font-bold text-[#7a8b95] flex items-center gap-1 mt-0.5"><Icons.Clock size={12} className="text-[#b58c4f]"/> {schedule.timeSlot}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex items-center gap-1.5 bg-[#4d87a8]/10 px-2 py-0.5 rounded border border-[#4d87a8]/20 w-fit">
                                                        <Icons.Navigation size={12} className="text-[#3f809e] shrink-0" />
                                                        <span className="font-black text-[#3f809e] text-[11px] uppercase tracking-wider whitespace-nowrap">{schedule.dock}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#212c46] text-[12px] uppercase">{schedule.truckPlate}</span>
                                                        <span className="text-[11px] font-bold text-[#7a8b95] font-sans truncate max-w-[120px]" title={schedule.driver}>{schedule.driver}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                                        <span className={`px-2 py-0.5 rounded border text-[11px] font-black uppercase tracking-widest inline-block ${getStatusStyle(schedule.status)}`}>
                                                            {schedule.status}
                                                        </span>
                                                        {schedule.eta && schedule.status !== 'Completed' && (
                                                            <span className="text-[10px] font-bold text-[#7a8b95] font-sans">ETA: {schedule.eta}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {/* Button sizes: w-8 h-8, gap-[1px] */}
                                                    <div className="flex justify-center items-center gap-[1px]">
                                                        {schedule.status === 'Scheduled' && (
                                                            <button onClick={() => handleQuickAction(schedule.id, 'Arrived')} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#b58c4f] text-[#b58c4f] hover:bg-[#b58c4f] hover:text-white transition-all active:scale-95 shadow-sm" title="Check-in (Arrived)">
                                                                <Icons.MapPin size={14} />
                                                            </button>
                                                        )}
                                                        {(schedule.status === 'Arrived' || schedule.status === 'Processing') && (
                                                            <button onClick={() => handleQuickAction(schedule.id, 'Completed')} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#527d45] text-[#527d45] hover:bg-[#527d45] hover:text-white transition-all active:scale-95 shadow-sm" title="Finish (Completed)">
                                                                <Icons.CheckCircle2 size={14} />
                                                            </button>
                                                        )}
                                                        <button onClick={() => setModalData({ isOpen: true, item: schedule })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#3f809e] text-[#3f809e] hover:bg-[#3f809e] hover:text-white transition-all active:scale-95 shadow-sm" title="Edit Schedule details">
                                                            <Icons.Pencil size={13} />
                                                        </button>
                                                        <button onClick={() => handleDeleteSchedule(schedule.id)} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#a94228] text-[#a94228] hover:bg-[#a94228] hover:text-white transition-all active:scale-95 shadow-sm" title="Delete Schedule">
                                                            <Icons.Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredSchedules.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest font-sans">
                                                    No logistics appointments found.
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
                                    <p className="bg-white px-2.5 py-0.5 rounded border border-[#eaeaec] shadow-sm font-mono text-[10px]">Total found: {filteredSchedules.length}</p>
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
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> DOCK SECURITY MATRIX</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Public Dock Node</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">ท่าจอดจราจรสาธารณะ: รถขนส่งทั่วไปพัดพาสินค้าสามารถเลือกจองได้ตามรอบที่ว่าง ไม่มีการบล็อกตำแหน่งทางธุรกิจ</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Restricted Secure Dock</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">ท่าความลับจัดกัดสิทธิ์: สำหรับสินค้ามูลค่าสูง หรือคลังแช่เย็นพิเศษ ล็อกความลับของสล็อตคิวไว้ป้องกันการตรวจส่องจากภายนอกคลัง</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT DYNAMIC DOCKS REGISTRY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center bg-white">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> DOCK & TERMINAL CONTROLS</h4>
                                    <button onClick={() => {
                                        const newId = prompt('Enter Dock Terminal ID (e.g. DOCK-07):');
                                        if (newId) {
                                            setDocks([
                                                ...docks,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM TERMINAL`, strategy: 'Manual Schedule Dispatch', type: 'General Purpose', maxCapacity: 8, currentAllocated: 0, isConfidential: false, subSlots: [] }
                                            ]);
                                        }
                                    }} className="px-4.5 py-1.5 bg-[#212c46] hover:bg-[#414757] text-white rounded-lg text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm border border-[#212c46]">
                                        <Icons.Plus size={14} /> ADD DOCK NODE
                                    </button>
                                </div>
                                <div className="p-5 space-y-3 custom-scrollbar bg-white">
                                    {docks.map(dock => (
                                        <div key={dock.id} className="space-y-1.5">
                                            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${dock.isConfidential ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shadow-sm ${dock.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228] border-[#932c2e]/20' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                        <Icons.Warehouse size={18}/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-[#212c46] text-[12.5px] uppercase tracking-widest font-mono">{dock.id}</span>
                                                            <button onClick={() => toggleExpandDock(dock.id)} className="p-1 hover:bg-[#eaeaec]/60 rounded text-[#b58c4f] transition-all">
                                                                <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedDocks[dock.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <span className="text-[10px] sm:text-[11px] font-bold text-[#7a8b95] uppercase block leading-none mt-1 font-sans">{dock.name}</span>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest block mt-1 ${dock.isConfidential ? 'text-[#a94228]' : 'text-[#7a8b95]'}`}>Dock Access: {dock.isConfidential ? 'Confidential Restricted' : 'General Public'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => toggleConfidential(dock.id)} className={`p-2 rounded-lg transition-all shadow-sm active:scale-95 ${dock.isConfidential ? 'bg-[#a94228] text-white' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`} title="Toggle Privacy Lock">
                                                        {dock.isConfidential ? <Icons.Lock size={15}/> : <Icons.Eye size={15}/>}
                                                    </button>
                                                    <button onClick={() => deleteDock(dock.id)} className="p-2 rounded-lg text-[#932c2e] hover:bg-[#932c2e]/10 transition-all border border-transparent" title="Remove Dock Node">
                                                        <Icons.Trash2 size={15}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub slots expansion exactly matching User Permissions child elements structure */}
                                            {dock.subSlots && expandedDocks[dock.id] && (
                                                <div className="ml-12 space-y-1.5 animate-fadeIn pr-2 pb-2">
                                                    {dock.subSlots.map((sub: any) => (
                                                        <div key={sub.id} className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border bg-white transition-all ${sub.isConfidential ? 'border-[#932c2e]/30 bg-[#932c2e]/5 shadow-inner' : 'border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full ${sub.isConfidential ? 'bg-[#a94228] animate-pulse' : 'bg-[#b7a159]'}`}></div>
                                                                <div className="text-left">
                                                                    <span className="text-[11.5px] font-black text-[#212c46] uppercase tracking-widest font-mono">{sub.id} - {sub.label}</span>
                                                                    <p className="text-[10px] font-medium text-[#7a8b95] leading-none mt-0.5 font-sans">{sub.rule}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => toggleSubSlotConfidential(dock.id, sub.id)} className={`p-1.5 rounded-md transition-all ${sub.isConfidential ? 'bg-[#932c2e]/10 text-[#a94228]' : 'text-[#7a8b95] hover:bg-[#f8f9fa]'}`} title="Lock slot">
                                                                {sub.isConfidential ? <Icons.Lock size={14}/> : <Icons.Eye size={14}/>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {dock.subSlots.length === 0 && (
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
