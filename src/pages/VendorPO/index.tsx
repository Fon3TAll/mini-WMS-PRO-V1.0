import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ShoppingCart, Store, FileText, CheckCircle2, Clock, 
  AlertCircle, Search, Filter, Download, ChevronLeft, 
  ChevronRight, Eye, X, HelpCircle, BookOpen, Plus, 
  Printer, Trash2, Edit3, MoreHorizontal, ArrowUpRight, 
  Wallet, Truck, Package, Database, Boxes, LayoutDashboard,
  Barcode, Save, CreditCard, TrendingUp, ClipboardCheck,
  SearchCode, FileSearch, Layers, Activity, Settings2, Box
} from 'lucide-react';
import { SYSTEM_MODULES } from '../../config/modules';

// --- Theme Configuration (Synced with Home) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'transparent',
    sidebarBg: 'linear-gradient(180deg, #1a253d 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#1a253d',
    primaryLight: '#6a95b1',
    accent: '#ad2b10',
    gold: '#ce8a39',
    brightGold: '#e5b73b',
    success: '#a8c0bb',
    danger: '#922724',
    warning: '#ad2b10',
    skyBlue: '#133951',
    dustyBlue: '#788990',
    indigo: '#2b3a44',
    softPurple: '#beced3',
    deepPurple: '#3c3f20',
    pinkAccent: '#a5654e',
    mutedSlate: '#676767',
    darkSlate: '#5e342b',
    silver: '#d7d7d7',
    deepNavy: '#1a253d',
    brownGold: '#a34617',
    vibrantPurple: '#3c3f20',
    burntOrange: '#ad2b10',
    slateBlue: '#769eb0',
    coolGray: '#f3f3f1',
    c1: '#1a253d',
    c2: '#ce8a39',
    c3: '#7a8b95',
    bgDark: '#e9e9e9',
};

// --- Utility Functions ---
const formatCurrency = (val: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('th-TH').format(val);

// --- Initial Mock Data ---
const INITIAL_POS = [
  { id: 'PO-2605-001', vendor: 'CP Foods (Thailand)', date: '2026-05-01', items: 12, amount: 450000, status: 'Approved', eta: '2026-05-08', buyer: 'Wichai T.' },
  { id: 'PO-2605-002', vendor: 'Logitech Group', date: '2026-05-01', items: 5, amount: 125000, status: 'Pending', eta: '2026-05-10', buyer: 'Somchai S.' },
  { id: 'PO-2605-003', vendor: 'Sahapat Inter Holding', date: '2026-05-02', items: 45, amount: 892000, status: 'Received', eta: '2026-05-04', buyer: 'Suda M.' },
];

// --- Sub-components ---
const KpiCard = ({ icon: IconComp, value, label, colorAccent, colorValue, desc, trendValue }: any) => (
  <div className="bg-white/90 px-5 py-5 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#ce8a39] transition-all min-h-[110px] flex flex-col justify-between animate-fadeIn">
    <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
      <IconComp size={100} color={colorAccent} />
    </div>
    <div className="relative z-10 flex justify-between items-start w-full text-left">
      <p className="text-[11px] font-bold text-[#788990] uppercase tracking-widest">{label}</p>
      <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-sm transition-all`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}30`, color: colorAccent}}>
        <IconComp size={20} />
      </div>
    </div>
    <div className="relative z-10 mt-2 text-left">
      <p className="text-[26px] font-black leading-none" style={{color: colorValue}}>{value}</p>
      <div className="flex justify-between items-end mt-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#788990]">{desc}</span>
        {trendValue && <span className="text-[10px] font-black flex items-center gap-0.5" style={{color: THEME.success}}><TrendingUp size={12}/> {trendValue}</span>}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = {};
  switch (status) {
    case 'Approved': style = { bg: THEME.success + '1A', color: THEME.success, border: THEME.success + '40' }; break;
    case 'Pending': style = { bg: THEME.gold + '1A', color: THEME.gold, border: THEME.gold + '40' }; break;
    case 'Received': style = { bg: THEME.skyBlue + '1A', color: THEME.skyBlue, border: THEME.skyBlue + '40' }; break;
    case 'Draft': style = { bg: THEME.dustyBlue + '1A', color: THEME.dustyBlue, border: THEME.dustyBlue + '40' }; break;
    default: style = { bg: '#eee', color: '#666', border: '#ccc' };
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: (style as any).bg, color: (style as any).color, borderColor: (style as any).border }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (style as any).color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Create PO Modal
function CreatePOModal({ isOpen, onClose, onSave }: any) {
    const [formData, setFormData] = useState({ vendor: '', items: '', amount: '', eta: '' });
    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: `PO-2605-${Math.floor(Math.random()*900)+100}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            buyer: 'Super Admin',
            items: Number(formData.items),
            amount: Number(formData.amount)
        });
        setFormData({ vendor: '', items: '', amount: '', eta: '' });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[550px] overflow-hidden border border-white/60">
                <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white border-b border-white/5">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 rounded-xl bg-[#e5b73b]/20 flex items-center justify-center text-[#e5b73b] border border-[#e5b73b]/30 shadow-inner"><Plus size={20} /></div>
                        <h3 className="text-base font-black uppercase tracking-widest leading-none">Create Purchase Order</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white"><X size={18} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 bg-[#f8f9fa] space-y-5">
                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-[#788990] uppercase ml-1">Vendor / Supplier</label>
                        <input required value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} type="text" placeholder="Supplier name" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39]" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-[#788990] uppercase ml-1">SKU Quantity</label>
                            <input required value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none" />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-[#788990] uppercase ml-1">ETA Date</label>
                            <input required value={formData.eta} onChange={e => setFormData({...formData, eta: e.target.value})} type="date" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none" />
                        </div>
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-[#1a253d] uppercase ml-1">Total PO Amount (THB)</label>
                        <input required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} type="number" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[14px] font-black text-[#1a253d] outline-none" />
                    </div>
                    <div className="pt-4 flex justify-between gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg font-bold text-[11px] uppercase active:scale-95 transition-all">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-[#ad2b10] text-white rounded-lg font-black text-[11px] uppercase shadow-md active:bg-[#922724] active:text-white transition-all flex items-center gap-2"><Save size={14}/> Save PO</button>
                    </div>
                </form>
            </div>
        </div>, document.body
    );
}

// 2. Print Preview Modal
function POPrintPreview({ isOpen, onClose, data }: any) {
    if (!isOpen || !data) return null;
    return createPortal(
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-[#1a253d]/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[500px] overflow-hidden border border-white/60">
                <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="text-sm font-black uppercase tracking-widest">PO Document Preview</h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white"><X size={18} /></button>
                </div>
                <div className="p-10 bg-[#f8f9fa] custom-scrollbar overflow-y-auto max-h-[70vh]">
                    <div className="bg-white border-2 border-black p-8 w-full shadow-lg text-black">
                        <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-6 text-left text-black">
                            <div><h2 className="text-xl font-black">PURCHASE ORDER</h2><p className="text-[9px] font-bold uppercase text-black">SMART WMS Distribution Hub</p></div>
                            <div className="flex flex-col items-end"><Barcode size={40} className="text-black" /><p className="text-[9px] font-mono mt-1 text-black font-black">{data.id}</p></div>
                        </div>
                        <div className="space-y-4 mb-8 text-[11px] font-bold text-black text-left">
                            <div className="flex justify-between border-b border-black pb-1"><span>Supplier:</span><span className="uppercase">{data.vendor}</span></div>
                            <div className="flex justify-between border-b border-black pb-1"><span>Issued:</span><span>{data.date}</span></div>
                            <div className="flex justify-between border-b border-black pb-1"><span>Buyer:</span><span>{data.buyer}</span></div>
                        </div>
                        <div className="bg-black text-white p-4 text-center">
                            <p className="text-[9px] uppercase tracking-widest opacity-60">Total Value</p>
                            <p className="text-2xl font-black">{formatCurrency(data.amount)}</p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-black border-dashed flex justify-between items-end">
                            <div className="text-center w-24 border-t border-black pt-1 text-black"><p className="text-[8px] font-black uppercase">Approved By</p></div>
                            <div className="text-center w-24 border-t border-black pt-1 text-black"><p className="text-[8px] font-black uppercase">Vendor Ack.</p></div>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-white border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg text-[11px] font-black uppercase hover:bg-[#eaeaec]">Close</button>
                    <button onClick={() => { window.print(); onClose(); }} className="px-8 py-2 bg-[#ad2b10] text-white rounded-lg text-[11px] font-black uppercase shadow-md flex items-center gap-2 hover:bg-[#922724] active:scale-95 transition-all"><Printer size={14}/> Confirm Print</button>
                </div>
            </div>
        </div>, document.body
    );
}

// 3. User Guide Panel
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-gradient-to-r from-[#212c46] to-[#414757] px-5 py-4 flex justify-between items-center text-white shrink-0 border-b-4 border-[#b7a159] shadow-sm relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#b7a159] shadow-inner border border-white/5"><BookOpen size={20} /></div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2 uppercase tracking-widest leading-none mb-1.5">VENDOR PO GUIDE</h3>
              <p className="text-[10px] font-bold text-[#b7a159] uppercase tracking-widest mt-1">คู่มือการจัดการใบสั่งซื้อเชิงกลยุทธ์</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#7a8b95] hover:text-white"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-[#414757] text-[12px] bg-[#f8f9fa] leading-relaxed font-medium">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Settings2 size={16} className="text-[#b7a159]"/> 1. Action Nodes (ปุ่มดำเนินการ)</h4>
            <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#b7a159] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#4d87a8] shadow-sm"><Eye size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#212c46] uppercase">View Details (ดูรายละเอียด)</p>
                        <p className="text-[10.5px] text-[#7a8b95] mt-1 leading-relaxed">ใช้สำหรับตรวจสอบข้อมูลเชิงลึกของแต่ละออเดอร์ เช่น รายการสินค้าทั้งหมด, ประวัติการอนุมัติ และข้อมูลผู้ซื้อที่รับผิดชอบ</p>
                    </div>
                </div>
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#b7a159] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#b58c4f] shadow-sm"><Printer size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#212c46] uppercase">Print & Preview (พิมพ์และดูตัวอย่าง)</p>
                        <p className="text-[10.5px] text-[#7a8b95] mt-1 leading-relaxed">แสดงหน้าต่างจำลองเอกสารทางการ (Official Document) พร้อมบาร์โค้ดเพื่อให้ตรวจสอบความถูกต้องก่อนสั่งพิมพ์จริงไปยังซัพพลายเออร์</p>
                    </div>
                </div>
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#b7a159] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#d96245] shadow-sm"><Plus size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#212c46] uppercase">Create New PO (สร้างใบสั่งซื้อใหม่)</p>
                        <p className="text-[10.5px] text-[#7a8b95] mt-1 leading-relaxed">เริ่มต้นกระบวนการจัดซื้อโดยการกรอกข้อมูลซัพพลายเออร์, จำนวนรายการ และยอดเงิน ระบบจะสร้างเลขที่ PO อัตโนมัติ</p>
                    </div>
                </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Activity size={16} className="text-[#d96245]"/> 2. KPIs & Analytics Dashboard</h4>
            <p className="mb-3 text-[#7a8b95]">แผงควบคุมด้านบนแสดงการวิเคราะห์ข้อมูลจัดซื้อแบบ Real-time:</p>
            <ul className="space-y-3 list-none pl-0">
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm">
                    <Clock size={16} className="text-[#d96245] mt-0.5 shrink-0" />
                    <div className="text-[11px]"><strong className="text-[#212c46] uppercase text-[10px] mr-1">Pending Orders:</strong> รายการที่รอการตรวจสอบสถานะ (Awaiting Verification)</div>
                </li>
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm">
                    <Wallet size={16} className="text-[#b58c4f] mt-0.5 shrink-0" />
                    <div className="text-[11px]"><strong className="text-[#212c46] uppercase text-[10px] mr-1">Managed Pipeline:</strong> มูลค่าเงินรวมที่ถูกล็อกไว้ในระบบเพื่อรอการสั่งซื้อจริง (Financial Liability)</div>
                </li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[13px] font-black text-[#212c46] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Layers size={16} className="text-[#4d87a8]"/> 3. Search & High Performance</h4>
            <p className="text-[10.5px] text-[#7a8b95] bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm">
                ระบบใช้เทคโนโลยี <strong className="text-[#212c46]">Dynamic Memoization</strong> ทำให้การค้นหา (Search) และการกรองข้อมูล (Filter) ทำงานได้อย่างรวดเร็ว แม้จะมีรายการข้อมูลจำนวนมาก หัวตารางจะถูกตรึง (Sticky) ไว้ตลอดเวลาเพื่อให้ผู้ใช้งานสามารถเลื่อนดูข้อมูลได้โดยไม่สับสนตำแหน่ง
            </p>
          </section>
        </div>
        
        <div className="px-5 py-4 bg-white border-t border-[#eaeaec] flex justify-end shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#b7a159] transition-all shadow-md tracking-widest active:scale-95 flex items-center gap-2">
              <CheckCircle2 size={16}/> รับทราบ (Got it)
          </button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Main Application ---
export default function VendorPO() {
  const [pos, setPos] = useState(INITIAL_POS);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredData = useMemo(() => {
    return pos.filter(item => {
      const matchSearch = item.vendor.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pos, search, statusFilter]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleSavePO = (newPo: any) => setPos([newPo, ...pos]);

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#1a253d] rounded-l-xl shadow-md hover:bg-[#922724] hover:text-white hover:border-[#922724] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#788990] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <CreatePOModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleSavePO} />
      <POPrintPreview isOpen={!!previewData} onClose={() => setPreviewData(null)} data={previewData} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#1a253d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#1a253d]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <ShoppingCart size={28} strokeWidth={2.5} className="text-[#1a253d]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      VENDOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a253d] to-[#ad2b10]">PO</span> (สั่งซื้อ)
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      STRATEGIC PROCUREMENT & EXTERNAL SUPPLY CHAIN HUB
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <button onClick={() => setIsCreateOpen(true)} className="bg-[#ad2b10] hover:bg-[#922724] text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2">
                  <Plus size={14} /> Create M-PO
              </button>
          </div>
      </div>

      {/* CONTENT CONTAINER */}
      <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Pending Orders" value={pos.filter(p=>p.status==='Pending').length} icon={Clock} colorAccent={THEME.warning} colorValue={THEME.primary} desc="Awaiting Verification" />
                <KpiCard label="Managed Pipeline" value={formatCurrency(pos.filter(p=>p.status==='Approved').reduce((a,b)=>a+b.amount, 0)/1000) + 'K'} icon={Wallet} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Active Commitments" trendValue="+8%" />
                <KpiCard label="Inbound Today" value={pos.filter(p=>p.status==='Received').length} icon={Truck} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Landed Goods" />
                <KpiCard label="Audit Compliance" value="100%" icon={CheckCircle2} colorAccent={THEME.success} colorValue={THEME.success} desc="SLA Score" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px]">
                {/* Search & Filter Header */}
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#ce8a39] transition-colors">
                            <Filter size={14} className="text-[#788990] mr-2" />
                            <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#1a253d] cursor-pointer">
                                <option value="All">All PO Status</option>
                                <option value="Approved">Approved</option>
                                <option value="Pending">Pending</option>
                                <option value="Received">Received</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative w-full md:w-80 text-left">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788990]" />
                        <input type="text" value={search} onChange={e => {setSearch(e.target.value); setCurrentPage(1);}} placeholder="Search PO, Supplier..." className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#ce8a39] bg-white text-[#1a253d] shadow-sm transition-all" />
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                    <table className="w-full text-left font-sans border-collapse">
                        <thead className="bg-[#133951] text-white sticky top-0 z-10 text-left">
                            <tr className="border-b-2 border-[#ad2b10]">
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">หมายเลขใบสั่งซื้อ (PO No.)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">คู่ค้า / ซัพพลายเออร์</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">วันที่ออกเอกสาร</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">จำนวนรายการ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">มูลค่ารวม (บาท)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">วันที่นัดส่งสินค้า (ETA)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                            {currentData.length > 0 ? currentData.map(item => (
                                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                    <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                    <td className="py-2.5 px-4">
                                        <div className="font-black text-[#1a253d] text-[12px] uppercase">{item.vendor}</div>
                                        <div className="text-[10px] font-bold text-[#788990]">By: {item.buyer} • {item.date}</div>
                                    </td>
                                    <td className="py-2.5 px-4 font-bold text-[#788990] text-[12px]">{item.date}</td>
                                    <td className="py-2.5 px-4 text-center font-black text-[#1a253d] text-[12px]">{item.items}</td>
                                    <td className="py-2.5 px-4 text-right font-black text-[#1a253d] text-[12px]">{formatCurrency(item.amount)}</td>
                                    <td className="py-2.5 px-4 text-center"><StatusBadge status={item.status} /></td>
                                    <td className="py-2.5 px-4 font-mono font-bold text-[#788990] text-[11px] italic">{item.eta}</td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex justify-center items-center gap-[1px] opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#6a95b1] bg-white hover:bg-[#6a95b1] hover:text-white active:scale-90 transition-all" title="View Details"><Eye size={14} /></button>
                                            <button onClick={() => setPreviewData(item)} className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#ce8a39] bg-white hover:bg-[#ce8a39] hover:text-white active:scale-90 transition-all" title="Print Preview"><Printer size={14} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-[#788990] font-black text-[12px] uppercase tracking-widest bg-[#f8f9fa]">No purchase orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-3 bg-white border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl">
                    <div className="flex items-center gap-5 text-[10px] font-black text-[#788990] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Display Rows:</span>
                            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-[#f8f9fa] border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#1a253d] cursor-pointer shadow-sm focus:border-[#ce8a39]">{[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}</select>
                        </div>
                        <p className="bg-[#f8f9fa] px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Records: {filteredData.length}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#1a253d] active:scale-90 shadow-sm text-[#788990]'}`}><ChevronLeft size={14}/></button>
                        <div className="bg-[#f8f9fa] text-[#1a253d] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center border border-[#eaeaec] shadow-sm">Page {currentPage} / {totalPages}</div>
                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#1a253d] active:scale-90 shadow-sm text-[#788990]'}`}><ChevronRight size={14}/></button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  );
}
