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

// --- Small Badges (11px exactly like requested) ---
const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Paid': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Pending': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Overdue': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border font-sans" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

const MethodBadge = ({ method }: { method: string }) => {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-widest border bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30 font-sans">
      {method}
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
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> STORAGE BILLING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Automated Space Rental & Billing Procedures</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. หลักการและความจำเป็นของการเรียกเก็บคลังอัจฉริยะ (Billing Principles)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">ช่วยปรับปรุงความแม่นยำในการเก็บเงินค่าเช่าคลังฝากเก็บ (3PL Consignment Fee) โดยมีมาตรฐานตรวจสอบดังนี้:</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Calculator size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Daily Snapshot:</strong> ระบบบันทึกยอด Stock On Hand ประจำวันเพื่อสร้างเฉลี่ยปริมาตรรายเดือน ป้องกันความคลาดเคลื่อน</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Billing:</strong> บิลของลูกค้ากลุ่มความลับพิเศษ (หรือเหล้าระเบิด) จะต้องได้รับการตรวจสอบจากผู้บริหารในค่ายเท่านั้น</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Key size={13} className="text-[#d96245]"/> 2. บันทึกสัญญารับฝาก SLA สัญญาราคาพิกัดค่าธรรมเนียม
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">วิธีการคิดตามปริมาตรสินค้าหรือประเภทคีย์การจัดสรร (Allocation Rules):</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] font-bold text-[#414757]">
                <li><strong className="text-[#3f809e]">CBM (ปริมาตร):</strong> วัดพื้นที่แบบทรงลูกบาศก์เมตร เหมาะสำหรับกล่องขนาดเศษไม่เต็มพาเลท</li>
                <li><strong className="text-[#b58c4f]">Pallet (พาเลทเต็ม):</strong> นับยอดขาตั้งแร็กเก็บเหล็กแข็งแรงพิกัดประจำจุด</li>
                <li><strong className="text-[#d96245]">Bin Area:</strong> พื้นที่พิกัดชั้นดินถาวรจัดสรรกลุ่มเคมีหรือบรรจุภัณฑ์เสี่ยงภัยสัมผัส</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. ระบบประมวลผลและการซิงค์บิล (WMS Automatic Snapshot)
            </h4>
            <p className="text-[11px] font-bold text-[#615e65]">ฐานข้อมูลยอดหนี้เชื่อมกับระบบบัญชีกลาง SMART ERP แบบเรียลไทม์ ตารางอัตราค่าจัดการจะดึงราคาคงคลังอัตรามาตรฐานโดยอัตรา SLA ประจำสัญญามาคำนวณตลอดกาล</p>
          </section>
        </div>
        
        <div className="p-2 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// Execute Detail Modal wrapped in DraggableModal system
function BillingDetailModal({ isOpen, onClose, invoice, onConfirm }: any) {
    if (!isOpen || !invoice) return null;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[550px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Boxes className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">BILLING PREVIEW: {invoice.id}</span>
                </div>
            }
        >
            <div className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans text-[12px]">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="text-center space-y-1">
                        <h4 className="text-[14px] font-black text-[#212c46] uppercase mb-1">{invoice.client}</h4>
                        <div className="flex justify-center gap-2">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Period: {invoice.period}</span>
                            <StatusBadge status={invoice.status} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-[#eaeaec] rounded-xl p-3 text-center shadow-inner">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">CALCULATION METHOD</span>
                            <div className="text-[12px] font-sans font-black text-[#212c46]">{invoice.method}</div>
                        </div>
                        <div className="bg-gray-50 border border-[#eaeaec] rounded-xl p-3 text-center shadow-inner">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">ESTIMATED USAGE</span>
                            <div className="text-[12px] font-mono font-black text-[#212c46]">{invoice.usage.toLocaleString()} Units</div>
                        </div>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#eaeaec] space-y-2">
                        <div className="flex justify-between items-center text-[12px]">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Base Rate:</span>
                            <span className="font-black text-[#212c46]">{formatCurrency(invoice.rate)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-dashed border-gray-200 pt-2">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Total Amount Due:</span>
                            <span className="font-black text-[#ce1c16] text-[14px]">
                                {formatCurrency(invoice.amount)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-[12px] border-t border-dashed border-gray-200 pt-2">
                            <span className="font-bold text-gray-500 uppercase tracking-widest">Payment Due Date:</span>
                            <span className="font-black text-slate-500 flex items-center gap-1">
                                <Icons.Calendar size={12}/> {invoice.dueDate}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    {invoice.status !== 'Paid' && (
                        <button type="button" onClick={() => { onConfirm(invoice.id); onClose(); }} className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.CheckCircle2 size={13}/> Complete & Update status</button>
                    )}
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function StorageBilling() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'zone_settings' (Identical to UserPermissions Settings Registry Tab standards)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Zone standard expansion & confidentiality state (identical to UserPermissions state structure)
  const [expandedZones, setExpandedZones] = useState<any>({ 'C001': true, 'C002': true, 'C003': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'C001': false, 'C002': false, 'C003': false, 'C004': false, 'TX-BEV': true });

  // Custom client billing rates configuration (SLA, rates parameters synced with standard configuration UI)
  const [clientBillingConfigs, setClientBillingConfigs] = useState<any[]>([
    { id: 'C001', name: 'Unilever Thailand', baseRate: 150, method: 'CBM (ปริมาตร)', activeInvoice: true, description: 'อัตราเช่าตู้ควบคุมและพาเลทสแตนดาร์ดสำหรับเครื่องดื่ม Unilever สัญญา SLA ปี 2026' },
    { id: 'C002', name: 'CP All Public Co.', baseRate: 450, method: 'Pallet (พาเลท)', activeInvoice: true, description: 'พาเลทดรายฟู้ดส์และสเปซสแต็คสำหรับการกระจายสินค้าประจำจุดสาขาร้านเซเว่นอีเลฟเว่น' },
    { id: 'C003', name: 'Nestle (Thai)', baseRate: 150, method: 'CBM (ปริมาตร)', activeInvoice: true, description: 'พิกัดจัดเก็บสินค้าสัมประสิทธิ์ความเย็นคาร์โก้นมผงแปรรูปและช็อคโกแลต' },
    { id: 'C004', name: 'Sahapat Group', baseRate: 2500, method: 'Bin Area (พื้นที่)', activeInvoice: true, description: 'พื้นที่จัดสแตนด์ถังเคมีคลังลอยชนิดพิเศษและพลาสติกแบบกองพื้นดินชั้นแรก' },
    { id: 'TX-BEV', name: 'Thai Beverage', baseRate: 400, method: 'Pallet (พาเลท)', activeInvoice: false, description: 'กลุ่มสินค้าตระกูลแอลกอฮอล์และสรรพสามิต พิกัดควบคุมอายัดข้อมูลทางการบริหาร' }
  ]);

  // Original datasets 100% untouched
  const [billingList, setBillingList] = useState<any[]>([
    { id: 'BIL-202605-01', client: 'Unilever Thailand', period: 'May 2026', method: 'CBM (ปริมาตร)', usage: 1250.5, rate: 150, amount: 187575, status: 'Pending', dueDate: '2026-06-05' },
    { id: 'BIL-202605-02', client: 'CP All Public Co.', period: 'May 2026', method: 'Pallet (พาเลท)', usage: 850, rate: 450, amount: 382500, status: 'Paid', dueDate: '2026-06-02' },
    { id: 'BIL-202605-03', client: 'Nestle (Thai)', period: 'May 2026', method: 'CBM (ปริมาตร)', usage: 450.2, rate: 150, amount: 67530, status: 'Overdue', dueDate: '2026-05-30' },
    { id: 'BIL-202605-04', client: 'Sahapat Group', period: 'May 2026', method: 'Bin Area (พื้นที่)', usage: 120, rate: 2500, amount: 300000, status: 'Paid', dueDate: '2026-06-10' },
    { id: 'BIL-202605-05', client: 'Thai Beverage', period: 'May 2026', method: 'Pallet (พาเลท)', usage: 1200, rate: 400, amount: 540000, status: 'Pending', dueDate: '2026-06-05' },
  ]);

  const [detailModal, setDetailModal] = useState<any>({ isOpen: false, data: null });

  const handleSaveBillingConfig = (clientId: string, updatedRate: number) => {
    setClientBillingConfigs(prev => prev.map(cfg => cfg.id === clientId ? { ...cfg, baseRate: updatedRate } : cfg));
  };

  const handleToggleConfidentiality = (clientId: string) => {
    setConfidentialityMap((prev: any) => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const handleToggleExpandConfig = (clientId: string) => {
    setExpandedZones((prev: any) => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const handleConfirmInvoice = (invoiceId: string) => {
    setBillingList(prev => prev.map(item => item.id === invoiceId ? { ...item, status: 'Paid' } : item));
  };

  const handleAutoTriggerSimulation = () => {
    const randomIdNum = Math.floor(Math.random() * 90) + 10;
    const simulatedBill = {
      id: `BIL-202605-${randomIdNum}`,
      client: 'Unilever Thailand',
      period: 'May 2026',
      method: 'CBM (ปริมาตร)',
      usage: 320,
      rate: 150,
      amount: 48000,
      status: 'Pending',
      dueDate: '2026-06-15'
    };
    setBillingList(prev => [simulatedBill, ...prev]);
  };

  // KPIs Calculations
  const pendingBillsCount = useMemo(() => billingList.filter(item => item.status === 'Pending').length, [billingList]);
  const overdueBillAmount = useMemo(() => billingList.filter(item => item.status === 'Overdue').reduce((acc, current) => acc + current.amount, 0), [billingList]);
  const collectedPaidSum = useMemo(() => billingList.filter(item => item.status === 'Paid').reduce((acc, current) => acc + current.amount, 0), [billingList]);
  const billingCompletedPercentage = "100% SLA";

  // Filtering
  const filteredBillingData = useMemo(() => {
    return billingList.filter(item => {
      const matchSearch = item.client.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [billingList, search, statusFilter]);

  const currentData = filteredBillingData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredBillingData.length / itemsPerPage) || 1;

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <BillingDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} invoice={detailModal.data} onConfirm={handleConfirmInvoice} />

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Calculator size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      STORAGE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">BILLING</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          AUTOMATED SPACE RENTAL, SLA CONTRA RATES & CALCULATION CORES
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Billing Registry
                  </button>
                  <button onClick={() => setActiveTab('billing_rules')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'billing_rules' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> SLA Controls
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (Sleek Compact Lean Padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Pending Invoices" value={formatNumber(pendingBillsCount)} icon={Icons.Clock} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Awaiting Clearance" />
                <KpiCard label="Receivables Overdue" value={formatCurrency(overdueBillAmount)} icon={Icons.AlertCircle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Outstanding Overdue" />
                <KpiCard label="Collected Total" value={formatCurrency(collectedPaidSum)} icon={Icons.CheckSquare} colorAccent={THEME.success} colorValue={THEME.success} desc="Completed Invoices" />
                <KpiCard label="Accounting SLA" value={billingCompletedPercentage} icon={Icons.Wallet} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Revenue Audit State" />
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
                                    <option value="All">All statuses</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>

                            <button onClick={handleAutoTriggerSimulation} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Play size={14} /> Simulate Calculation Snapshot
                            </button>
                        </div>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search Client or Invoice ID..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC LIST TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รหัสใบแจ้งหนี้ (Invoice ID)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">บัญชีคู่ค้า / นิติบุคคล</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รอบการเรียกเก็บเงิน</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">วิธีคำนวณค่าเช่า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">ปริมาณพื้นที่ใช้งาน</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">ยอดเงินค่าบริการสุทธิ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">สถานะชำระเงิน</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">วันครบกำหนดชำระ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 text-left font-mono font-black text-[#3f809e] text-[12px]">
                                            {item.id}
                                        </td>
                                        <td className="py-2.5 px-4 text-left">
                                            <div className="font-bold text-[#212c46] text-[12px] truncate max-w-[220px]">{item.client}</div>
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-bold text-slate-500 text-[12px]">
                                            {item.period}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <MethodBadge method={item.method} />
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#212c46] text-[12px]">
                                            {formatNumber(item.usage)}
                                        </td>
                                        <td className="py-2.5 px-4 text-right font-mono font-black text-[#ce1c16] text-[12px]">
                                            {formatCurrency(item.amount)}
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center font-mono font-bold text-slate-400 text-[12px]">
                                            {item.dueDate}
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
                                                {item.status !== 'Paid' ? (
                                                    <button 
                                                        onClick={() => handleConfirmInvoice(item.id)}
                                                        className="w-8 h-8 rounded flex items-center justify-center bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/30 hover:border-[#657f4d] hover:text-white hover:bg-[#657f4d] transition-all active:scale-95"
                                                        title="Quick Complete Payment"
                                                    >
                                                        <Icons.Check size={13} strokeWidth={3} />
                                                    </button>
                                                ) : (
                                                    <div className="w-8 h-8 rounded flex items-center justify-center bg-[#657f4d]/5 text-[#657f4d]/40 border border-[#657f4d]/10" title="Payment Paid">
                                                        <Icons.CheckCheck size={13} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={9} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No automated billing snapshots match filtered parameters.
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono font-bold text-[#212c46]">Count: {filteredBillingData.length}</p>
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
                                <Icons.Layers size={18} className="text-[#b7a159]" /> BILLING SLA POLICY
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">MOMENTUM RATE RULE</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        การกำหนดค่าผ่านแผงพิกัด SLA จะซิงค์ข้อมูลส่งเสริมราคาตารางบัญชียอดฝากตรงของเจ้าของโดยอ้างอิงราคาต่อชิ้นต่อ CBM แบบเฉลี่ย
                                    </p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">RESTRICTED LOCKED ACCESS</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        โซนแช่แข็งกลุ่มเครื่องเช่าราคาสูงจำกัดการแก้ไขเพื่อคงความซื่อสัตย์ข้อมูล ไม่ให้แฮ็คเกอร์หรือบุคคลภายนอกลอบเข้ามาลดยอดราคาสะสม
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
                                ประวัติและเรตรันบิลทั้งหมดตรงเข้าเก็บรักษาฐานข้อมูลหลักของบล็อคเชน SMART WMS ตรวจผ่านสแตมป์รับรองคีย์สปริงเกลอร์รหัสรับรอง
                            </p>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Restricted Locked:</span>
                                    <span className="font-black text-[#b7a159]">{Object.values(confidentialityMap).filter(v => v).length} Contracts Locked</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Validated SLA Standard:</span>
                                    <span className="font-black text-white">4 Base Methods Checked</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Settings Registry (List items with expand and Confidential lock like UserPermissions) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3">
                                <Icons.Settings size={20} className="text-[#b7a159]"/> SLA CONTRACT RATES REGISTRY
                            </h4>
                            <span className="text-[10px] font-bold text-[#657f4d] bg-[#657f4d]/10 px-2.5 py-1 rounded-full border border-[#657f4d]/20 uppercase">SYSTEM STABILIZED</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {clientBillingConfigs.map(zone => (
                                <div key={zone.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.DollarSign size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-[#212c46] text-[12px] uppercase tracking-wider">{zone.name}</span>
                                                    <button onClick={() => handleToggleExpandConfig(zone.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedZones[zone.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${confidentialityMap[zone.id] ? 'text-[#ce1c16]' : 'text-slate-400'}`}>
                                                    Access Policy: {confidentialityMap[zone.id] ? 'Restricted Node Locked' : 'Public Auditor View Approved'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleToggleConfidentiality(zone.id)} 
                                                className={`p-2 rounded-xl transition-all shadow-sm active:scale-90 ${confidentialityMap[zone.id] ? 'bg-[#ce1c16] text-white border border-[#ad2b10]' : 'bg-white text-[#7a8b95] border border-[#eaeaec] hover:bg-[#f8f9fa]'}`}
                                            >
                                                {confidentialityMap[zone.id] ? <Icons.Lock size={16}/> : <Icons.Eye size={16}/>}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedZones[zone.id] && (
                                        <div className="ml-12 p-4 bg-[#f8f9fa] rounded-2xl border border-dashed border-[#eaeaec] space-y-3 animate-fadeIn">
                                            <p className="text-[11px] font-bold text-slate-500 uppercase">{zone.description}</p>
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Rental Rate (THB)</label>
                                                    <input 
                                                        type="number" 
                                                        value={zone.baseRate} 
                                                        onChange={(e) => handleSaveBillingConfig(zone.id, Number(e.target.value))}
                                                        className="w-full max-w-[200px] border border-[#eaeaec] bg-white rounded-xl px-3 py-1.5 font-mono font-black text-[#212c46] outline-none focus:border-[#4d87a8]"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Method</label>
                                                    <span className="inline-block bg-[#212c46] text-[#e9d8c0] px-3 py-1.5 rounded-xl font-bold font-sans text-[11px] uppercase tracking-wider">{zone.method}</span>
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
