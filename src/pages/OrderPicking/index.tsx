import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { BarcodeScanner } from '../../components/shared/BarcodeScanner';
import { useOfflineSync } from '../../hooks/useOfflineSync';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import { motion, AnimatePresence } from 'motion/react';

// --- Theme Configuration (Premium Industrial Earth-tones, Synced with Home & User Permissions) ---
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

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);
};

// --- KPI Card Components (Sleek Compact Lean Padding [84px Height]) ---
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

// --- Original Example Data Preserved 100% ---
const MOCK_PICKING_TASKS = [
    { id: 'PK-2605-001', waveRef: 'WAV-2605-001', orderRef: 'SO-1001', sku: 'SKU-FG-001', itemName: 'Sweet Tamarind Premium', location: 'ZONE-A-01-01', reqQty: 24, pickedQty: 0, status: 'Picking', priority: 'High', date: new Date().toISOString().split('T')[0] },
    { id: 'PK-2605-002', waveRef: 'WAV-2605-001', orderRef: 'SO-1002', sku: 'SKU-FG-015', itemName: 'Tamarind Candy Pack', location: 'ZONE-A-01-02', reqQty: 100, pickedQty: 100, status: 'Completed', priority: 'High', date: new Date().toISOString().split('T')[0] },
    { id: 'PK-2605-003', waveRef: 'WAV-2605-002', orderRef: 'SO-1005', sku: 'SKU-RM-050', itemName: 'Raw Tamarind Bulk', location: 'ZONE-C-10-01', reqQty: 50, pickedQty: 0, status: 'Pending', priority: 'Normal', date: new Date().toISOString().split('T')[0] },
    { id: 'PK-2605-004', waveRef: 'WAV-2605-002', orderRef: 'SO-1006', sku: 'SKU-PM-005', itemName: 'Glass Bottles 500ml', location: 'ZONE-B-05-03', reqQty: 500, pickedQty: 480, status: 'Short Pick', priority: 'Normal', date: new Date().toISOString().split('T')[0], note: 'Insufficient stock at bin' },
    { id: 'PK-2605-005', waveRef: 'WAV-2605-005', orderRef: 'SO-1010', sku: 'SKU-FG-022', itemName: 'Tamarind Paste (Bucket)', location: 'ZONE-A-02-01', reqQty: 10, pickedQty: 0, status: 'Pending', priority: 'Normal', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
];

// Mock Settings Options matching the User Permissions configuration template
const MOCK_ZONE_CONFIGS = [
  { 
    id: 'ZONE-A', 
    name: 'ZONE A: SWEET PRODUCTS FLOOR', 
    strategy: 'RFID Handheld & Scanning Pipeline', 
    type: 'Dry Load Conveyor',
    maxPickers: 15,
    currentAllocated: 6,
    isConfidential: false,
    rules: [
      { id: 'RULE-PK-A1', label: 'RFID PROXIMITY AUTOLOAD', rule: 'Confirm picking automatically once in 1-meter bin range', isConfidential: false },
      { id: 'RULE-PK-A2', label: 'TAME BULK PACKING EXPORT', rule: 'Trigger printout label for external customs quarantine', isConfidential: false },
    ]
  },
  { 
    id: 'ZONE-B', 
    name: 'ZONE B: TEMPERATURE COLD CHAIN VAULT', 
    strategy: 'Voice-Directed Smart Headset System', 
    type: 'Cold Storage (Restricted)',
    maxPickers: 8,
    currentAllocated: 2,
    isConfidential: true,
    rules: [
      { id: 'RULE-PK-B1', label: 'BLUETOOTH HEADSET VOICE TOKEN', rule: 'Must reply check code "COLD-9" or task halts immediately', isConfidential: true },
    ]
  },
  { 
    id: 'ZONE-C', 
    name: 'ZONE C: INDUSTRIAL RAW MATERIAL RACKS', 
    strategy: 'Forklift Smart Screen Tablet Terminal', 
    type: 'Heavy Loads Buffer',
    maxPickers: 5,
    currentAllocated: 1,
    isConfidential: false,
    rules: [
      { id: 'RULE-PK-C1', label: 'WEIGHT DISPATCH THRESHOLD ALERT', rule: 'Dual verification if item payload weight over 500kg', isConfidential: false },
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> DIRECTED PICKING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Voice / RF Picking Operation</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11.5px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. แผนปฏิบัติงานหยิบสินค้า (Directed Picking Flow)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">กฎเกณฑ์การดำเนินงานและการสแกนตรวจสอบตำแหน่ง (Picking Rules):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.ScanBarcode size={12} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8] font-black">RF Scanner Mode:</strong> ใช้ปืนสแกนยิงบาร์โค้ดพิกัดหลัก และยิงบาร์โค้ด SKU สินค้าเพื่อปลดล็อกการจำลองหยิบอย่างแม่นยำ ป้องกันหยิบผิดรุ่น 100%</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Mic size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Voice Picking Mode:</strong> ใช้ระบบเสียงสังเคราะห์แนะนำผ่าน Bluetooth Headset พนักงานพูด "Confirm" เพื่อตอบโต้ยืนยันการหยิบโดยไม่ต้องสแกนสวมถุงมือปฏิบัติงาน</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={13} className="text-[#b7a159]"/> 2. วงจรสถานะการระบุงาน (Task Pipeline Stage)
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-[11px] font-medium text-[#414757]">
              <li>เริ่มแรกงานค้างคิวในระบบสถานะ <span className="text-[#b58c4f] font-bold">Pending</span></li>
              <li>พนักงานกดเริ่มต้นภารกิจเข้าประจำโซนขยับรูปงานเป็น <span className="text-[#ab7d82] font-bold">Picking</span> เพื่อนำขนถ่าย</li>
              <li>เมื่อพบเศษสินค้าบกพร่อง ไม่พอในชั้นวาง สามารถระบุจำนวนขาดแล้วยืนยันเป็น <span className="text-[#932c2e] font-bold">Short Pick</span> เพื่อเรียกทีมเติมด่วน</li>
              <li>หากกระทำครบถ้วนตามรายการ บันทึกเป็น <span className="text-[#657f4d] font-bold">Completed</span> สิ้นสุดเสร็จสิ้นสมบูรณ์</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Compass size={13} className="text-[#b58c4f]"/> 3. การควบคุมตรวจสอบพื้นที่ (Security Gate Rule)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              พื้นที่จัดเก็บโซนควบคุมและปรับอากาศ (Zone B) บางสล็อตอาจถูกซ่อนเงื่อนไขความลับ (Confidential Shielding Pattern) เพื่อป้องกันการเข้าถึงจากผู้ที่ไม่มีสิทธิ์ตามการตั้งค่าส่วนกลาง
            </p>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Layers size={13} className="text-[#3f809e]"/> 4. การรวบรวมกลุ่มในการหยิบ (Batch Picking Routes)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              ระบบจะใช้อัลกอริทึมในการจับกลุ่มสินค้ารายการ (Aggregate) ที่อยู่ในชั้นวางหรือบริเวณแนวทางเดิน (Aisle Proximity) เดียวกันมาไว้ในรอบการหยิบเดียว เพื่อลดระยะทางการเดินในคลังสินค้าและเพิ่มประสิทธิภาพให้สูงสุด
            </p>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ScanLine size={13} className="text-[#212c46]"/> 5. ระบบสแกนด้วยกล้อง (Camera Barcode Scanner)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              เพื่อป้องกันการหยิบผิดพลาด พนักงานสามารถกด "สแกนบาร์โค้ด" เพื่อเข้าถึงโหมดการใช้กล้องมือถือ/แท็บเล็ต ในการบันทึกหรือค้นหาตำแหน่งและรหัส SKU สินค้าได้ทันที แทนการคีย์ข้อมูลแบบ Manual
            </p>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Printer size={13} className="text-[#414757]"/> 6. การพิมพ์เอกสารนำทาง (Export & Print List)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              อนุญาตให้ Export หรือส่งข้อมูลรายการทั้งหมดไปที่เครื่องพิมพ์ (Printer Friendly) เพื่อใช้งานในบริเวณคลังสินค้าที่อับสัญญาณ (Offline Floor Control)
            </p>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Move size={13} className="text-[#b7a159]"/> 7. การลากย้ายหน้าต่างอิสระ (Draggable Workspace)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              หน้าต่างข้อมูลระดับลึก เช่น หน้าต่างแก้ไข Task ทุกบานสามารถลาก-วาง สลับเปลี่ยนมุมบนหน้าจอได้ (Drag & Drop Modals) เพื่อให้ผู้ใช้งานสะดวกในการอ้างอิงและสอบทานข้อมูลตารางด้านหลังได้พร้อมๆกันแบบ Multitasking
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

// --- Picking Execution Modal using Draggable Modal ---
function PickingModal({ isOpen, onClose, data, onSave }: any) {
    const [mode, setMode] = useState('rf'); // 'rf' | 'voice'
    const [scanInput, setScanInput] = useState('');
    const [pickedQty, setPickedQty] = useState('');

    const { isListening, isSupported, startListening, stopListening } = useVoiceCommand({
        onCommand: useCallback((text: string) => {
            // Very simple voice intent parser for numbers
            const parsedNumber = parseInt(text.replace(/[^0-9]/g, ''));
            if (!isNaN(parsedNumber)) {
                setPickedQty(parsedNumber.toString());
            } else {
                console.warn("Could not parse number from voice:", text);
            }
        }, []),
        language: 'th-TH' // Setup for Thai language as requested context earlier
    });

    useEffect(() => {
        if(isOpen && data) {
            setScanInput('');
            setPickedQty(data.pickedQty || '');
            setMode('rf');
        } else {
            stopListening();
        }
    }, [isOpen, data]);

    if (!isOpen || !data) return null;

    const handleComplete = (e: any) => {
        e.preventDefault();
        const finalQty = Number(pickedQty);
        let finalStatus = 'Completed';
        stopListening();
        
        if (finalQty < data.reqQty) finalStatus = 'Short Pick';
        onSave({
            ...data,
            pickedQty: finalQty,
            status: finalStatus
        });
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[750px]"
            customHeader={
                <div className="bg-[#212c46] px-5 py-3 flex justify-between items-center text-white shrink-0 border-b-2 border-[#b7a159]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20 shadow-sm">
                            {mode === 'rf' ? <Icons.ScanBarcode size={18} strokeWidth={2.5}/> : <Icons.Mic size={18} strokeWidth={2.5}/>}
                        </div>
                        <div className="text-left font-mono">
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">EXECUTE DIRECTED PICK</h3>
                            <p className="text-[9px] font-bold text-[#b7a159] uppercase tracking-widest flex items-center gap-1"><Icons.Zap size={10} /> {data.id} - ZERO FAULT HARVEST</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex bg-[#133951] rounded-lg p-0.5 border border-white/15">
                            <button type="button" onClick={()=>setMode('rf')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${mode === 'rf' ? 'bg-[#b7a159] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}><Icons.ScanBarcode size={10}/> Scan</button>
                            <button type="button" onClick={()=>setMode('voice')} className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1 ${mode === 'voice' ? 'bg-[#a54f6b] text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}><Icons.Mic size={10}/> Voice</button>
                        </div>
                        <button onClick={onClose} className="text-white/60 hover:text-[#932c2e] p-1.5 hover:bg-white/10 rounded-lg transition-all ml-1.5"><Icons.X size={18} /></button>
                    </div>
                </div>
            }
        >
            <div className="p-5 bg-[#f3f3f1] flex flex-col gap-4 text-left font-mono">
                {/* Location banner */}
                <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-[#b58c4f]/10 rounded-xl border border-[#b58c4f]/20 flex items-center justify-center text-[#212c46] shrink-0">
                            <Icons.PackageOpen size={24}/>
                        </div>
                        <div>
                            <div className="text-[9px] font-bold text-[#7a8b95] uppercase tracking-widest mb-0.5">Bin Shelf Target Location</div>
                            <div className="text-[22px] font-black text-[#a94228] leading-none tracking-wider">{data.location}</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[9px] font-bold text-[#7a8b95] uppercase tracking-widest mb-0.5">Reference Link</div>
                        <div className="text-[12px] font-black text-[#212c46]">{data.waveRef}</div>
                        <div className="text-[11px] font-bold text-[#7a8b95] font-sans">{data.orderRef}</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {/* Cargo item description */}
                    <div className="flex-1 bg-[#212c46] p-5 rounded-xl border border-[#1d2636] shadow-sm flex flex-col justify-between">
                        <div>
                            <h4 className="text-[9px] font-black text-[#7a8b95] uppercase tracking-widest mb-1.5">SKU Item Detail</h4>
                            <div className="text-[18px] font-black text-[#b7a159] tracking-widest mb-0.5">{data.sku}</div>
                            <div className="text-[12px] font-bold text-white font-sans leading-tight mb-6">{data.itemName}</div>
                        </div>
                        
                        <div className="bg-black/20 p-3 rounded-lg border border-white/10 flex justify-between items-center">
                            <div>
                                <span className="text-[8px] font-bold text-[#d2af94] uppercase tracking-widest block leading-none mb-1">Requirement</span>
                                <span className="text-[28px] font-black text-white leading-none">{data.reqQty}</span>
                            </div>
                            <span className="text-[11px] text-[#cbd5e1] uppercase font-sans">Units</span>
                        </div>
                    </div>

                    {/* Operational controls */}
                    <div className="flex-[1.2] bg-white p-5 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-center">
                        {mode === 'rf' ? (
                            <div className="space-y-4 animate-fadeIn text-left">
                                <div className="text-center">
                                    <Icons.ScanBarcode size={32} className="mx-auto text-[#b7a159] mb-1.5"/>
                                    <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest">RF SCAN CONSOLE</h4>
                                    <p className="text-[10px] text-[#7a8b95] font-sans">Scan barcode of physical bin lane to authorize withdrawal sequence.</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#212c46] uppercase block">Location Scan Input <span className="text-[#a94228]">*</span></label>
                                    <input 
                                        type="text" 
                                        value={scanInput} 
                                        onChange={e=>setScanInput(e.target.value.toUpperCase())} 
                                        className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[13px] font-black text-[#3f809e] outline-none focus:border-[#b7a159] uppercase text-center font-mono tracking-widest" 
                                        placeholder="SCAN SHELF BARCODE PIN..." 
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-[#212c46] uppercase block">Actual Picked Qty <span className="text-[#a94228]">*</span></label>
                                    <input 
                                        type="number" 
                                        value={pickedQty} 
                                        onChange={e=>setPickedQty(e.target.value)} 
                                        className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[16px] font-black text-[#657f4d] outline-none focus:border-[#657f4d] text-center font-mono" 
                                        placeholder="0" 
                                        min="0"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fadeIn flex flex-col items-center justify-center py-4">
                                <div className="relative w-20 h-20 flex items-center justify-center">
                                    <div className="absolute inset-0 bg-[#932c2e]/20 rounded-full animate-pulse"></div>
                                    <div className="w-12 h-12 bg-[#932c2e] rounded-full flex items-center justify-center text-white relative z-10 shadow border-2 border-white">
                                        <Icons.Mic size={20} />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="bg-[#212c46] text-[#b7a159] px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
                                        <Icons.Volume2 size={12}/> System: "Go to {data.location}"
                                    </div>
                                    <p className="text-[11px] font-bold text-[#414757]">Say 3 Check Digits to Confirm Location Bin</p>
                                    <div className="bg-[#212c46] text-white px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase inline-flex items-center gap-1.5 shadow-sm">
                                        <Icons.Volume2 size={12}/> System: "Pick {data.reqQty} Packs"
                                    </div>
                                    <p className="text-[11px] font-bold text-[#414757]">Say <span className="text-[#657f4d]">"Picked {data.reqQty}"</span> to Complete Slot Verification</p>
                                </div>
                                
                                <div className="w-full pt-4 border-t border-[#eaeaec]">
                                    <div className="flex flex-col items-center gap-3">
                                        <button 
                                            type="button"
                                            onClick={isListening ? stopListening : startListening}
                                            disabled={!isSupported}
                                            className={`relative w-16 h-16 rounded-full flex justify-center items-center shrink-0 shadow-lg transition-all duration-300 ${
                                                isListening 
                                                ? 'bg-[#932c2e] text-white animate-pulse' 
                                                : isSupported 
                                                    ? 'bg-[#212c46] text-white hover:bg-[#3f809e] hover:scale-105' 
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <Icons.Mic size={28} />
                                            {isListening && (
                                                <span className="absolute -inset-2 rounded-full border-2 border-[#932c2e]/50 animate-ping" />
                                            )}
                                        </button>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#212c46]">
                                                {isListening ? 'Listening...' : 'Voice Command'}
                                            </p>
                                            <p className="text-[9px] font-bold text-[#7a8b95] mt-0.5">
                                                {!isSupported ? 'Not supported in this browser' : 'Tap to speak quantity'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-2 border-t border-[#eaeaec] flex justify-between items-center gap-2">
                    <button type="button" onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec]/45">Cancel</button>
                    <div className="flex gap-2">
                        <button type="button" onClick={handleComplete} disabled={!pickedQty || Number(pickedQty) >= data.reqQty} className={`px-6 py-2 bg-[#932c2e]/10 hover:bg-[#932c2e]/20 text-[#932c2e] border border-[#932c2e]/30 rounded-lg text-[11px] font-black uppercase flex items-center gap-1.5 tracking-widest transition-all ${(!pickedQty || Number(pickedQty) >= data.reqQty) ? 'opacity-30 cursor-not-allowed' : ''}`}>
                            <Icons.AlertTriangle size={14}/> Short Pick
                        </button>
                        <button type="button" onClick={handleComplete} disabled={!pickedQty} className={`px-6 py-2 bg-[#657f4d] hover:bg-[#657f4d]/80 text-white rounded-lg text-[11px] font-black uppercase shadow-md flex items-center gap-1.5 tracking-widest transition-all ${!pickedQty ? 'opacity-40 cursor-not-allowed' : ''}`}>
                            <Icons.CheckSquare size={14}/> Confirm Pick
                        </button>
                    </div>
                </div>
            </div>
        </DraggableModal>
    );
}

import { useLanguage } from '../../context/LanguageContext';

// --- Main Page Component ---
export default function OrderPicking() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'settings' Setup matching same standard as UserPermissions
    const [searchQuery, setSearchQuery] = useState('');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [modalData, setModalData] = useState({ isOpen: false, item: null });
    const [printRouteData, setPrintRouteData] = useState<any>(null);
    
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
    const [tasks, setTasks] = useState(MOCK_PICKING_TASKS);
    const [zones, setZones] = useState<any[]>(MOCK_ZONE_CONFIGS);

    // Expands for Settings (Standardเดียวกับ User Permissions)
    const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true });

    // KPI Values (Sleek Compact Lean Padding height [84px])
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
    const pickingTasks = tasks.filter(t => t.status === 'Picking').length;
    const completedTasks = tasks.filter(t => t.status === 'Completed' || t.status === 'Short Pick').length;

    // Filter Logic
    const filteredTasks = useMemo(() => {
        let res = [...tasks];
        if (filterStatus !== 'All') {
            res = res.filter(t => t.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(t => 
                t.id.toLowerCase().includes(q) || 
                t.waveRef.toLowerCase().includes(q) || 
                t.orderRef.toLowerCase().includes(q) ||
                t.sku.toLowerCase().includes(q) ||
                t.itemName.toLowerCase().includes(q) ||
                t.location.toLowerCase().includes(q)
            );
        }
        return res.sort((a, b) => {
            // Sort by High Priority first
            if (a.priority === 'High' && b.priority !== 'High') return -1;
            if (a.priority !== 'High' && b.priority === 'High') return 1;
            
            const statusOrder: any = { 'Picking': 1, 'Pending': 2, 'Short Pick': 3, 'Completed': 4 };
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

    // Batch Routes calculation
    const batchRoutes = useMemo(() => {
        const batched = tasks.reduce((acc, t) => {
            if (t.status === 'Completed' || t.status === 'Short Pick') return acc;
            const locParts = t.location.split('-');
            const aisle = locParts.length >= 3 ? `${locParts[0]}-${locParts[1]}-${locParts[2]}` : 'OTHER ZONES';
            
            if (!acc[aisle]) {
                acc[aisle] = {
                    aisle,
                    tasks: [],
                    totalItems: 0,
                    totalQty: 0,
                    zone: locParts[1] || 'GENERAL',
                    status: 'Pending'
                };
            }
            acc[aisle].tasks.push(t);
            acc[aisle].totalItems += 1;
            acc[aisle].totalQty += t.reqQty;
            if (t.status === 'Picking') acc[aisle].status = 'In Progress';
            return acc;
        }, {} as Record<string, any>);
        return Object.values(batched).sort((a: any, b: any) => a.aisle.localeCompare(b.aisle));
    }, [tasks]);

    // Offline Sync Setup
    const { isOffline, enqueueAction, isSyncing } = useOfflineSync(async (action) => {
        // Mock backend sync API call here
        console.log('[Sync] Processing offline action:', action);
        // Simulate network delay
        await new Promise(res => setTimeout(res, 500));
        // Action could be 'SAVE_TASK' or 'UPDATE_STATUS'
        // Since we already update local state immediately, the backend would update its source of truth.
    });

    // Handlers
    const handleSaveTask = async (data: any) => {
        setTasks(prev => prev.map(t => t.id === data.id ? data : t));
        setModalData({ isOpen: false, item: null });
        if (isOffline) {
            await enqueueAction('SAVE_TASK', { data });
        } else {
            // Online - immediately process or mock to backend
            console.log('[Online] Saving task directly to database.');
        }
    };

    const handleQuickActionStatus = async (id: string, newStatus: string) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (isOffline) {
            await enqueueAction('UPDATE_STATUS', { id, newStatus });
        } else {
            console.log('[Online] Updating status directly to database.');
        }
    };

    const toggleConfidential = (zoneId: string) => {
        setZones(zones.map(z => z.id === zoneId ? { ...z, isConfidential: !z.isConfidential } : z));
    };

    const toggleRuleConfidential = (zoneId: string, ruleId: string) => {
        setZones(zones.map(z => {
            if (z.id === zoneId) {
                return {
                    ...z,
                    rules: z.rules.map((r: any) => r.id === ruleId ? { ...r, isConfidential: !r.isConfidential } : r)
                };
            }
            return z;
        }));
    };

    const toggleExpandZone = (zoneId: string) => {
        setExpandedZones((prev: any) => ({ ...prev, [zoneId]: !prev[zoneId] }));
    };

    const deleteZonePolicy = (zoneId: string) => {
        if(window.confirm(`Are you sure you want to delete picking policy configuration ${zoneId}?`)) {
            setZones(zones.filter(z => z.id !== zoneId));
        }
    };

    const handleBulkPrint = (route: any) => {
        setPrintRouteData(route);
        setTimeout(() => {
            window.print();
            setTimeout(() => setPrintRouteData(null), 1000);
        }, 150);
    };

    const getStatusStyle = (status: string) => {
        if(status === 'Pending') return 'bg-[#b58c4f]/10 text-[#a94228] border-[#b58c4f]/30';
        if(status === 'Picking') return 'bg-[#ab7d82]/10 text-[#932c2e] border-[#ab7d82]/30'; 
        if(status === 'Completed') return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30';
        if(status === 'Short Pick') return 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30';
        return 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30';
    };

    const handleBarcodeScan = (scannedCode: string) => {
        setIsScannerOpen(false);
        setSearchQuery(scannedCode);
    };

    return (
        <>
            {printRouteData && (
                <>
                    <style dangerouslySetInnerHTML={{__html: `
                        @media print {
                            body * {
                                visibility: hidden;
                            }
                            #print-section, #print-section * {
                                visibility: visible;
                            }
                            #print-section {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                min-height: 100vh;
                                background: white;
                                overflow: visible !important;
                                padding: 0 !important;
                                margin: 0 !important;
                            }
                        }
                    `}} />
                    <div id="print-section" className="hidden print:block absolute inset-0 z-[99999] bg-white p-8 text-black min-h-screen font-sans">
                        <div className="text-center mb-8 border-b-2 border-black pb-4">
                            <h1 className="text-3xl font-black uppercase tracking-widest mb-2 font-mono">ROUTE: {printRouteData.aisle}</h1>
                            <p className="text-sm font-bold uppercase tracking-widest text-[#7a8b95]">Total Items: {printRouteData.totalItems} • Total QTY: {printRouteData.totalQty}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {printRouteData.tasks.map((task: any) => (
                                <div key={task.id} className="border-4 border-black p-6 rounded-xl flex flex-col justify-between" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-widest text-[#7a8b95] mb-1">{task.sku}</div>
                                        <div className="text-xl font-black leading-tight uppercase mb-4">{task.itemName}</div>
                                        <div className="flex justify-between items-end border-t border-gray-300 pt-4 mb-6">
                                            <div className="text-sm">
                                                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Target Location</div>
                                                <div className="font-mono text-lg font-black">{task.location}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Required Qty</div>
                                                <div className="font-mono text-3xl font-black text-[#212c46]">{task.reqQty}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-auto border-t-2 border-dashed border-gray-400 pt-4 text-center">
                                        <div className="font-mono bg-gray-100 py-3 text-lg tracking-[0.4em] font-black">* {task.sku} *</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            <div className={`flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 ${printRouteData ? 'hidden print:hidden' : ''}`}>
                {isScannerOpen && (
                <BarcodeScanner 
                    title="Order Picking Scanner"
                    expectedType="all"
                    onClose={() => setIsScannerOpen(false)}
                    onScan={handleBarcodeScan}
                />
            )}
            
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            
            <PickingModal 
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
                            <Icons.PackageOpen size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div className="text-left font-sans">
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            ORDER <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PICKING</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            Directed Picking Execution (Voice / RF Barcode)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 font-sans">
                    <div className="bg-white/50 p-1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => setActiveTab('tasks')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.ListChecks size={15} /> Picking Tasks
                        </button>
                        <button onClick={() => setActiveTab('batch')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'batch' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.Route size={15} /> Batch Routes
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.SlidersHorizontal size={15} /> Picker settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS (Sleek, Compact, Lean Padding - exactly 84px height matching requesting specs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0 text-left font-sans">
                        <KpiCard label="Assigned Tasks" value={totalTasks} icon="list-checks" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Tasks Loaded" />
                        <KpiCard label="Ready Pending" value={pendingTasks} icon="scan-barcode" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Queue Buffer" />
                        <KpiCard label="Active In Picking" value={pickingTasks} icon="fast-forward" colorAccent={THEME.softPurple} colorValue={THEME.primary} desc="Floor Running" />
                        <KpiCard label="Tasks Completed" value={completedTasks} icon="check-square" colorAccent={THEME.success} colorValue={THEME.success} desc="Harvest Index" />
                    </div>

                    {activeTab === 'tasks' ? (
                        <div className="bg-white rounded-[20px] shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col font-sans">
                            
                            {/* Filter Bar */}
                            <div className="px-6 py-4.5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center bg-white border border-[#eaeaec] h-10 px-3 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
                                        <Icons.Filter size={13} className="text-[#b58c4f] shrink-0" />
                                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black text-[#503447] uppercase tracking-widest outline-none cursor-pointer w-full">
                                            <option value="All">All Picking Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Picking">Picking</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Short Pick">Short Pick</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full sm:w-72">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Task, Wave, SKU, Location..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold text-[#212c46] rounded-xl border border-[#eaeaec] bg-white outline-none focus:border-[#b7a159] shadow-sm transition-all placeholder:text-[#cbd5e1] uppercase" />
                                    </div>
                                    <button
                                        onClick={() => setIsScannerOpen(true)}
                                        className="bg-[#3f809e] hover:bg-[#2d5f76] text-white px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 h-10 ml-1 sm:ml-0 whitespace-nowrap"
                                        title="Scan Barcode / QR Code"
                                    >
                                        <Icons.ScanLine size={15} /> สแกนบาร์โค้ด
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="bg-[#212c46] hover:bg-[#414757] text-white px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2 h-10 ml-1 sm:ml-0 whitespace-nowrap"
                                        title="Export & Print Selection"
                                    >
                                        <Icons.Printer size={15} /> พิมพ์ใบสั่งหนิบ
                                    </button>
                                </div>
                            </div>

                            {/* PRINT OVERLAY (Only visible in @media print) */}
                            {typeof document !== 'undefined' && createPortal(
                                <div id="print-order-picking-list" className="hidden print:block text-black font-sans text-left">
                                    <div className="flex justify-between items-start mb-6 border-b-2 border-black pb-4">
                                        <div>
                                            <h1 className="text-2xl font-black uppercase tracking-widest">WMS Order Picking List</h1>
                                            <p className="text-[12px] font-bold text-gray-600 mt-1">Generated: {new Date().toLocaleString('th-TH')}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-black flex items-center justify-end gap-2 text-black"><Icons.PackageOpen size={24}/> COMPANY LOGO</div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Warehouse Management System</p>
                                        </div>
                                    </div>

                                    <div className="mb-4 text-[12px] font-bold flex justify-between">
                                        <span>Total Items: {filteredTasks.length}</span>
                                        <span>Status Filter: {filterStatus}</span>
                                    </div>
                                    
                                    <table className="w-full border-collapse border border-black text-[12px] font-mono">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-black p-3 text-left font-black uppercase tracking-widest w-[20%]">Task / Ref</th>
                                                <th className="border border-black p-3 text-left font-black uppercase tracking-widest w-[20%]">Location</th>
                                                <th className="border border-black p-3 text-left font-black uppercase tracking-widest w-[30%]">SKU & Item</th>
                                                <th className="border border-black p-3 text-center font-black uppercase tracking-widest w-[10%]">Qty</th>
                                                <th className="border border-black p-3 text-center font-black uppercase tracking-widest w-[20%]">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredTasks.map(task => (
                                                <tr key={task.id}>
                                                    <td className="border border-black p-3">
                                                        <div className="font-black text-[13px]">{task.id}</div>
                                                        <div className="text-[10px] text-gray-600 mt-1 font-sans font-bold">{task.waveRef} | {task.orderRef}</div>
                                                    </td>
                                                    <td className="border border-black p-3">
                                                        <div className="font-black text-[13px]">{task.location}</div>
                                                    </td>
                                                    <td className="border border-black p-3">
                                                        <div className="font-black text-[13px]">{task.sku}</div>
                                                        <div className="text-[10px] text-gray-600 mt-1 font-sans font-bold truncate max-w-[200px]" title={task.itemName}>{task.itemName}</div>
                                                    </td>
                                                    <td className="border border-black p-3 text-center">
                                                        <div className="font-black text-[15px]">{task.reqQty}</div>
                                                    </td>
                                                    <td className="border border-black p-3 text-center">
                                                        <div className="font-black text-[11px] uppercase tracking-widest">{task.status}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    <div className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        - END OF LIST -
                                    </div>

                                    <style>{`
                                        @media print {
                                            @page { size: portrait; margin: 10mm; }
                                            body * { visibility: hidden; }
                                            body { background: white; }
                                            #print-order-picking-list, #print-order-picking-list * { visibility: visible; }
                                            #print-order-picking-list {
                                                position: absolute;
                                                left: 0;
                                                top: 0;
                                                width: 100%;
                                                background: white;
                                                color: black;
                                            }
                                        }
                                    `}</style>
                                </div>
                            , document.body)}

                            {/* TABLE (Standardized layout styling exactly as specified) */}
                            <div className="overflow-x-auto custom-scrollbar bg-white">
                                <table className="w-full text-left font-sans border-collapse">
                                    {/* py-4 space, bg-133951, border-b-2 is ad2b10 */}
                                    <thead className="bg-[#133951] text-white">
                                        <tr>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รหัสใบงานหยิบ / รูปแบบอ้างอิง</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">ตำแหน่งป้ายหยิบจัดเก็บ</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รหัสสินค้า & อธิบายรายการสินค้า</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">น้ำหนักปริมาณ (ต้องการ / ดึงแล้ว)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">สถานะออเดอร์</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap w-32">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] bg-white text-left font-mono">
                                        <AnimatePresence>
                                        {paginatedTasks.map(task => (
                                            <motion.tr 
                                                layout 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                exit={{ opacity: 0, x: -20 }}
                                                key={task.id} 
                                                className="hover:bg-[#f3f3f1]/60 transition-colors group"
                                            >
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-black text-[#a94228] tracking-tighter text-[12px] font-mono">{task.id}</span>
                                                            {task.priority === 'High' && <span className="bg-[#932c2e] w-1.5 h-1.5 rounded-full animate-pulse" title="High Priority Urgent"></span>}
                                                        </div>
                                                        <span className="font-bold text-[#7a8b95] text-[11px] font-sans truncate" title={task.waveRef}>{task.waveRef} | {task.orderRef}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="p-1 rounded bg-[#b58c4f]/10 text-[#b58c4f] border border-[#b58c4f]/25 shrink-0">
                                                            <Icons.MapPin size={13} />
                                                        </div>
                                                        <span className="font-black text-[#212c46] tracking-wide text-[12px]">{task.location}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-black text-[#212c46] text-[12px]">{task.sku}</span>
                                                        <span className="text-[11px] font-bold text-[#7a8b95] flex items-center font-sans gap-1 mt-0.5 truncate w-44" title={task.itemName}>{task.itemName}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="font-bold text-[#7a8b95] text-[10px] font-sans">Required Target: {task.reqQty}</span>
                                                        <span className={`text-[11px] font-black mt-0.5 px-2 py-0.5 rounded border leading-none font-mono ${task.pickedQty >= task.reqQty ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/15' : task.pickedQty > 0 ? 'bg-[#a94228]/10 text-[#a94228] border-[#a94228]/15' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                            Picked: {task.pickedQty}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <motion.span layout className={`px-2 py-0.5 rounded border text-[11px] font-black uppercase tracking-widest inline-block ${getStatusStyle(task.status)}`}>
                                                        {task.status}
                                                    </motion.span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {/* Button sizes: w-8 h-8, gap-[1px] */}
                                                    <div className="flex justify-center items-center gap-[1px]">
                                                        {task.status === 'Pending' && (
                                                            <button onClick={() => handleQuickActionStatus(task.id, 'Picking')} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#3f809e] text-[#3f809e] hover:bg-[#3f809e] hover:text-white transition-all active:scale-95 shadow-sm" title="Start Picking Sequence">
                                                                <Icons.PlayCircle size={13} />
                                                            </button>
                                                        )}
                                                        {task.status === 'Picking' && (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task as any })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#ab7d82] text-[#ab7d82] hover:bg-[#ab7d82] hover:text-white transition-all active:scale-95 shadow-sm" title="Open Picking Operational Console">
                                                                <Icons.ScanBarcode size={13} />
                                                            </button>
                                                        )}
                                                        {(task.status === 'Completed' || task.status === 'Short Pick') && (
                                                            <button onClick={() => setModalData({ isOpen: true, item: task as any })} className="w-8 h-8 flex items-center justify-center rounded bg-white border border-[#657f4d] text-[#657f4d] hover:bg-[#657f4d] hover:text-white transition-all active:scale-95 shadow-sm" title="View Pick Log Summary">
                                                                <Icons.CheckSquare size={13} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        </AnimatePresence>
                                        {filteredTasks.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest font-sans">
                                                    No operational picking tasks found matching query filter.
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
                    ) : activeTab === 'batch' ? (
                        <div className="space-y-4 text-left">
                            <div className="bg-[#f8f9fa] border border-[#eaeaec] p-4 rounded-2xl flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="font-black text-[#212c46] uppercase tracking-widest text-[14px] flex items-center gap-2"><Icons.Layers size={18} className="text-[#3f809e]"/> Batch Picking Routes</h3>
                                    <p className="text-[11px] font-bold text-[#7a8b95] mt-1">Aggregated picking operations optimized by aisle proximity.</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[18px] font-black text-[#212c46] font-mono">{batchRoutes.length}</div>
                                    <div className="text-[10px] text-[#7a8b95] font-black uppercase tracking-widest">Active Routes</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {batchRoutes.map((route: any) => (
                                    <div key={route.aisle} className="bg-white border border-[#eaeaec] rounded-2xl shadow-sm overflow-hidden flex flex-col hover:border-[#b7a159] transition-all group">
                                        <div className="p-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-start">
                                            <div>
                                                <div className="text-[10px] font-black tracking-widest uppercase text-[#3f809e] mb-1">Route / Aisle</div>
                                                <h4 className="font-black font-mono text-[#212c46] text-[18px]">{route.aisle}</h4>
                                            </div>
                                            <div className={`px-2.5 py-1 rounded border text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-sm ${route.status === 'In Progress' ? 'bg-[#b7a159] text-white border-[#b7a159]' : 'bg-white text-[#212c46] border-[#eaeaec]'}`}>
                                                {route.status}
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 flex-1">
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-[#f8f9fa] border border-[#eaeaec] p-2.5 rounded-xl text-center">
                                                    <div className="text-[16px] font-black text-[#212c46] font-mono">{route.totalItems}</div>
                                                    <div className="text-[9px] text-[#7a8b95] font-black uppercase tracking-widest mt-0.5">Tasks</div>
                                                </div>
                                                <div className="bg-[#f8f9fa] border border-[#eaeaec] p-2.5 rounded-xl text-center">
                                                    <div className="text-[16px] font-black text-[#212c46] font-mono">{route.totalQty}</div>
                                                    <div className="text-[9px] text-[#7a8b95] font-black uppercase tracking-widest mt-0.5">Total QTY</div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-[#7a8b95] mb-2 border-b border-[#eaeaec] pb-1">Included SKUs</h5>
                                                {route.tasks.slice(0, 3).map((t: any) => (
                                                    <div key={t.id} className="text-[11px] flex justify-between items-center text-[#212c46] font-bold">
                                                        <span className="truncate flex-1 max-w-[150px]" title={t.itemName}>{t.sku} - {t.itemName}</span>
                                                        <span className="font-black font-mono ml-2">x{t.reqQty}</span>
                                                    </div>
                                                ))}
                                                {route.tasks.length > 3 && (
                                                    <div className="text-[10px] font-black text-[#7a8b95] text-center pt-2">
                                                        + {route.tasks.length - 3} more items
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex gap-2">
                                            <button 
                                                onClick={() => handleBulkPrint(route)}
                                                className="w-1/3 py-2 bg-white text-[#212c46] border border-[#eaeaec] hover:border-[#b7a159] hover:text-[#b7a159] rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm flex justify-center items-center gap-2 transition-all"
                                                title="Bulk Print Pick Labels"
                                            >
                                                <Icons.Printer size={15} />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setActiveTab('tasks');
                                                    setSearchQuery(route.aisle);
                                                }}
                                                className="w-2/3 py-2 bg-[#212c46] text-white hover:bg-[#3f809e] rounded-xl text-[11px] font-black uppercase tracking-widest shadow flex justify-center items-center gap-2 transition-all"
                                            >
                                                Start Route <Icons.ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {batchRoutes.length === 0 && (
                                    <div className="col-span-full py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest border-2 border-dashed border-[#eaeaec] rounded-2xl">
                                        No active picking routes available.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                            {/* LEFT DESCRIPTIONS POLICY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-4 bg-white/90 p-5 rounded-2xl shadow-lg border border-[#eaeaec] animate-fadeIn text-left animate-fadeIn">
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> ENHANCED ZONE MATRICES</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Direct Handheld Buffer</div>
                                        <p className="text-[11.5px] text-[#4d5a44] font-bold leading-relaxed font-sans">กลุ่มทำงานแบบมาตรฐานการตรวจสอบทั่วไป: สมาชิกคลังพนักงานหยิบใช้อุปกรณ์ RFID สแกนตรวจสอบความสอดคล้องตามตำแหน่ง ไม่มีสิทธิ์ยกเว้นแบบป้องกันพิเศษ</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Voice Controlled Protocol</div>
                                        <p className="text-[11.5px] text-[#4d5a44] font-bold leading-relaxed font-sans">พื้นที่คัดแยกความปลอดภัยสูงสุด (เช่น ห้องยา ห้องเคมี หรือโซนแช่แข็ง): บังคับใช้คำสั่งท่อส่งเสียง Smart Headset และซ่อนสล็อตยืนยันเป็นพิกัดความลับ (Confidential Lock Mode)</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT DYNAMIC PORTALS/LANES REGISTRY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left animate-fadeIn">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center bg-white">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> HARDWARE OPERATIONAL POLICIES</h4>
                                    <button onClick={() => {
                                        const newId = prompt('Enter New Warehouse Zone ID (e.g. ZONE-D):');
                                        if (newId) {
                                            setZones([
                                                ...zones,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM EXPERIMENTAL ZONE`, strategy: 'Traditional Manual List Checking', type: 'Low Speed Buffer Rack', maxPickers: 10, currentAllocated: 0, isConfidential: false, rules: [] }
                                            ]);
                                        }
                                    }} className="px-4 py-2 bg-[#212c46] text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center gap-2 hover:bg-[#414757] transition-all">
                                        <Icons.Plus size={14}/> ADD ZONE POLICY
                                    </button>
                                </div>

                                <div className="divide-y divide-[#eaeaec]">
                                    {zones.map((zone) => {
                                        const isExpanded = expandedZones[zone.id];
                                        return (
                                            <div key={zone.id} className="p-5 flex flex-col gap-4 bg-white hover:bg-[#f8f9fa]/40 transition-colors animate-fadeIn">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <button onClick={() => toggleExpandZone(zone.id)} className="p-1 hover:bg-[#coolGray] text-[#7a8b95] hover:text-[#212c46] rounded transition-colors mt-0.5">
                                                            {isExpanded ? <Icons.ChevronDown size={18}/> : <Icons.ChevronRight size={18}/>}
                                                        </button>
                                                        <div>
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <h4 className="text-[12.5px] font-black text-[#212c46] font-mono tracking-tight">{zone.name}</h4>
                                                                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 border border-[#eaeaec] text-[#7a8b95] uppercase font-mono">{zone.type}</span>
                                                            </div>
                                                            <p className="text-[11.5px] text-[#7a8b95] font-bold mt-1 uppercase tracking-wide flex items-center gap-1.5">
                                                                <Icons.FileText size={12}/> Strategy constraint: {zone.strategy}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {/* Confidential switch matches User Permissions standard toggle */}
                                                        <button 
                                                            onClick={() => toggleConfidential(zone.id)} 
                                                            className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                                                                zone.isConfidential 
                                                                    ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30 shadow-inner' 
                                                                    : 'bg-white text-[#7a8b95] border-[#eaeaec]'
                                                            }`}
                                                            title="Toggle configuration confidentiality level"
                                                        >
                                                            {zone.isConfidential ? <Icons.ShieldAlert size={10}/> : <Icons.ShieldOff size={10}/>}
                                                            {zone.isConfidential ? 'Confidential Link' : 'Public Link'}
                                                        </button>

                                                        <button onClick={() => deleteZonePolicy(zone.id)} className="w-8 h-8 rounded border border-[#eaeaec] hover:border-[#932c2e] hover:bg-[#932c2e]/10 text-[#7a8b95] hover:text-[#932c2e] flex items-center justify-center transition-all">
                                                            <Icons.Trash2 size={13}/>
                                                        </button>
                                                    </div>
                                                </div>

                                                {isExpanded && (
                                                    <div className="pl-11 pr-2 py-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex flex-col gap-3 animate-fadeIn">
                                                        <div className="flex justify-between items-center border-b border-[#eaeaec] pb-2">
                                                            <div className="text-[11.5px] font-black text-[#212c46] uppercase tracking-wider flex items-center gap-1.5"><Icons.Hammer size={12} className="text-[#b7a159]"/> Local Slot Rule Assertions</div>
                                                            <button onClick={() => {
                                                                const rLabel = prompt('Enter Rule Component Name (e.g. BARCODE SCAN FORCED PRE-CHECK):');
                                                                const rDetail = prompt('Enter Rule Constraint Detail description:');
                                                                if(rLabel && rDetail) {
                                                                    setZones(zones.map(z => {
                                                                        if(z.id === zone.id) {
                                                                            return {
                                                                                ...z,
                                                                                rules: [...z.rules, { id: `RULE-PK-${Date.now().toString().slice(-4)}`, label: rLabel.toUpperCase(), rule: rDetail, isConfidential: false }]
                                                                            };
                                                                        }
                                                                        return z;
                                                                    }));
                                                                }
                                                            }} className="text-[10px] font-black text-[#3f809e] hover:text-[#4d87a8] uppercase tracking-wider flex items-center gap-1"><Icons.PlusCircle size={12}/> Append Rule Clause</button>
                                                        </div>

                                                        {zone.rules.length === 0 ? (
                                                            <div className="text-center py-4 text-[#7a8b95] font-bold text-[11px] uppercase tracking-widest font-mono">No active rule constraints assigned here.</div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                {zone.rules.map((rule: any) => (
                                                                    <div key={rule.id} className="flex justify-between items-center bg-white p-3 border border-[#eaeaec] rounded-lg shadow-sm gap-4 hover:border-[#b7a159] transition-all">
                                                                        <div className="text-left">
                                                                            <h5 className="text-[11px] font-black text-[#212c46] flex items-center gap-1.5">
                                                                                <Icons.Workflow size={11} className="text-[#7a8b95]"/> {rule.label}
                                                                            </h5>
                                                                            <p className="text-[11.5px] text-[#7a8b95] font-sans mt-0.5 leading-relaxed font-bold">{rule.rule}</p>
                                                                        </div>

                                                                        <div className="flex items-center gap-2">
                                                                            {/* Sub Rule Confidentiality toggle */}
                                                                            <button 
                                                                                onClick={() => toggleRuleConfidential(zone.id, rule.id)}
                                                                                className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider flex items-center gap-1 transition-all ${
                                                                                    rule.isConfidential 
                                                                                        ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/20' 
                                                                                        : 'bg-slate-100 text-[#7a8b95] border border-transparent'
                                                                                }`}
                                                                            >
                                                                                {rule.isConfidential ? <Icons.Lock size={10}/> : <Icons.Eye size={10}/>}
                                                                                {rule.isConfidential ? 'Restricted' : 'Public'}
                                                                            </button>

                                                                            <button 
                                                                                onClick={() => {
                                                                                    setZones(zones.map(z => {
                                                                                        if(z.id === zone.id) {
                                                                                            return { ...z, rules: z.rules.filter((r: any) => r.id !== rule.id) };
                                                                                        }
                                                                                        return z;
                                                                                    }));
                                                                                }} 
                                                                                className="p-1 text-[#7a8b95] hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded transition-all"
                                                                            >
                                                                                <Icons.X size={12}/>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}
