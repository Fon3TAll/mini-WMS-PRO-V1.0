import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

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

const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => {
    const IconCmp = Icons[icon as keyof typeof Icons] as any || Icons.Circle;
    return (
        <div className="bg-white/90 px-4 py-3 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[96px] flex flex-col justify-between animate-fadeIn">
            <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <IconCmp size={100} color={colorAccent} />
            </div>
            <div className="relative z-10 flex justify-between items-start w-full">
                <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
                <div className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6" style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                    <IconCmp size={16} />
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
};

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#b7a159]"/> INBOUND GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Finished Goods Flow Management</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.TrendingDown size={18} className="text-[#b58c4f]"/> 1. Finished Goods Inbound Processing
            </h4>
            <p className="text-[12px] mb-3">ระบบออกแบบมาให้จัดการและตรวจสอบสถานะการรับเข้าสินค้าสำเร็จรูป <b>(Finished Goods Inbound)</b> และพัสดุในคลังสินค้าแบบเรียลไทม์:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Icons.CheckCircle size={16} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div><strong className="text-[#657f4d]">Verified/Completed:</strong> รายการนำเข้าที่ได้รับการตรวจสอบ อนุมัติ และจัดสรร Slot ในคลังสินค้าเรียบร้อยแล้ว</div>
                </li>
                <li className="flex items-start gap-2 bg-[#b58c4f]/10 p-3 rounded-xl border border-[#b58c4f]/30">
                  <Icons.Clock size={16} className="shrink-0 text-[#b58c4f] mt-0.5"/> 
                  <div><strong className="text-[#b58c4f]">Pending Check:</strong> รายการรอดำเนินการ ตรวจสอบเอกสาร และความถูกต้องของสินค้าจากการรับมาจากฝั่งการผลิต</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-3 rounded-xl border border-[#932c2e]/30">
                  <Icons.AlertTriangle size={16} className="shrink-0 text-[#932c2e] mt-0.5"/> 
                  <div><strong className="text-[#932c2e]">Quarantine / Blocked:</strong> รายการสินค้าชำรุด หรือไม่ได้มาตรฐาน ถูกคัดแยกนำไปเก็บในพื้นที่กักกันรอการตรวจสอบ</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Columns size={18} className="text-[#3f809e]"/> 2. Interactive Navigation Views
            </h4>
            <p className="text-[12px] mb-3">ผู้ใช้งานสามารถเลือกรูปแบบการวิเคราะห์เพื่อความเหมาะสมต่อการทำงาน:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#4d87a8]">Document Flow:</strong> แสดงผลในรูปแบบตารางเดินเอกสาร ตรวจประวัติรับเข้า ดึงเลขที่เอกสาร การอ้างอิงแหล่งผลิต</li>
                <li><strong className="text-[#d96245]">Matrix View:</strong> แสดงผลเชิงพื้นที่ในรูปแบบ Grid Bento ดูสถานะการใช้ชั้นวาง (Storage slots), Lot Number และความหนาแน่น</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.ShieldCheck size={18} className="text-[#657f4d]"/> 3. Configuration & Security
            </h4>
            <p className="text-[12px]">พนักงานที่มีสิทธิ์ที่เกี่ยวข้องเท่านั้นจะสามารถเปิดและปรับเปลี่ยนสถานะเอกสาร แก้ไขข้อมูล และสั่งพิมพ์สติ๊กเกอร์ติดบน Bulk Cargo หรือพาเลทของสินค้าสำเร็จรูป</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

export default function FGInboundReport() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [viewMode, setViewMode] = useState('doc_flow');
    const [search, setSearch] = useState('');

    // State for Records to let buttons operate interactively
    const [records, setRecords] = useState<any[]>([
        { id: 'GR-FG-202311-001', vendor: 'Production Line A', material: 'FG-01: Pro Widget', date: '2023-11-20', qty: 1500, unit: 'boxes', status: 'Completed', inspector: 'Suda K.', slot: 'SLOT-F1', batch: 'B23-FG01', spec: 'Standard Pass' },
        { id: 'GR-FG-202311-002', vendor: 'Production Line B', material: 'FG-05: Smart Hub', date: '2023-11-20', qty: 200, unit: 'boxes', status: 'Pending', inspector: '-', slot: 'SLOT-F2', batch: 'B23-FG05', spec: 'Awaiting QC' },
        { id: 'GR-FG-202311-003', vendor: 'External Partner X', material: 'FG-12: Adapter Base', date: '2023-11-21', qty: 5000, unit: 'pcs', status: 'Completed', inspector: 'Wichai T.', slot: 'SLOT-F8', batch: 'B23-FG12', spec: 'Quality A' },
        { id: 'GR-FG-202311-004', vendor: 'Production Line A', material: 'FG-01: Pro Widget', date: '2023-11-21', qty: 850, unit: 'boxes', status: 'Quarantine', inspector: 'Manee J.', slot: 'SLOT-Q1', batch: 'B23-FG01-B', spec: 'Box Damage' },
        { id: 'GR-FG-202311-005', vendor: 'Production Line C', material: 'FG-22: Tech Core', date: '2023-11-22', qty: 900, unit: 'units', status: 'Completed', inspector: 'Aroon R.', slot: 'SLOT-F5', batch: 'B23-FG22', spec: 'Standard Pass' },
    ]);

    // View/Edit Modal State
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

    // Edit form states
    const [editStatus, setEditStatus] = useState('Pending');
    const [editInspector, setEditInspector] = useState('');
    const [editQty, setEditQty] = useState(0);

    const filteredRecords = useMemo(() => {
        return records.filter(r => 
            r.id.toLowerCase().includes(search.toLowerCase()) || 
            r.vendor.toLowerCase().includes(search.toLowerCase()) || 
            r.material.toLowerCase().includes(search.toLowerCase())
        );
    }, [records, search]);

    const handleView = (record: any) => {
        setSelectedRecord(record);
        setEditStatus(record.status);
        setEditInspector(record.inspector);
        setEditQty(record.qty);
        setIsViewModalOpen(true);
    };

    const handlePrint = (record: any) => {
        setSelectedRecord(record);
        setIsPrintModalOpen(true);
    };

    const handleSaveRecord = () => {
        if (!selectedRecord) return;
        setRecords(prev => prev.map(r => r.id === selectedRecord.id ? {
            ...r,
            status: editStatus,
            inspector: editStatus === 'Pending' ? '-' : (editInspector === '-' || editInspector === '' ? 'Admin' : editInspector),
            qty: Number(editQty)
        } : r));
        setIsViewModalOpen(false);
    };

    const handlePrintAction = () => {
        window.print();
        setIsPrintModalOpen(false);
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>
      
            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

            {/* HEADER SECTION (Transparent backdrop, standard align) */}
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.PackagePlus size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                            FINISHED GOODS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">INBOUND</span> REPORT
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none font-sans">
                            COMPLETED GOODS & PRODUCTS MONITORING
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="Total Inbound" value={records.length} icon="FileText" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Receipt Documents" />
                        <KpiCard label="Completed" value={records.filter(r => r.status === 'Completed').length} icon="CheckCircle" colorAccent={THEME.success} colorValue={THEME.success} desc="Verified Items" />
                        <KpiCard label="Pending" value={records.filter(r => r.status === 'Pending').length} icon="Clock" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Awaiting Check" />
                        <KpiCard label="Quarantine" value={records.filter(r => r.status === 'Quarantine').length} icon="AlertTriangle" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Held for QA" />
                    </div>

                    {/* MAIN CONTENT BLOCK */}
                    <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn mt-8">
                        
                        {/* CONTROL BAR */}
                        <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
                                    <button onClick={() => setViewMode('doc_flow')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode === 'doc_flow' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                                        <Icons.FileText size={14}/> Document Flow
                                    </button>
                                    <button onClick={() => setViewMode('matrix')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${viewMode === 'matrix' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                                        <Icons.LayoutGrid size={14}/> Matrix View
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search document, source..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                                </div>
                                <button onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8," 
                                        + ["Document ID,Date,Source,Product,Quantity,Status,Inspector,Slot,Batch"].join(",") + "\n"
                                        + records.map(r => `"${r.id}","${r.date}","${r.vendor}","${r.material}",${r.qty},"${r.status}","${r.inspector}","${r.slot}","${r.batch}"`).join("\n");
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `FG_Inbound_Report_${new Date().toISOString().slice(0,10)}.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                }} className="bg-[#212c46] text-white px-6 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]">
                                    <Icons.Download size={16} /> Export
                                </button>
                            </div>
                        </div>

                        {/* DATA DISPLAY PANEL */}
                        <div className="overflow-auto custom-scrollbar bg-[#f8f9fa]">
                            {viewMode === 'doc_flow' ? (
                                <table className="w-full text-left font-sans border-collapse">
                                    <thead className="bg-[#222b38] text-white">
                                        <tr className="border-b-2 border-[#709654]">
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Document ID</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Receipt Date</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Source</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Product</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">Quantity</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Status</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Inspector</th>
                                            <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-[#eaeaec]">
                                        {filteredRecords.length > 0 ? filteredRecords.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                                <td className="py-2.5 px-4">
                                                    <span className="font-black text-[#212c46] text-[12px] font-mono">{item.id}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-[12px] text-[#7a8b95] font-bold">
                                                    {item.date}
                                                </td>
                                                <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-bold">
                                                    {item.vendor}
                                                </td>
                                                <td className="py-2.5 px-4 text-[12px] text-[#4d87a8] font-bold">
                                                    {item.material}
                                                </td>
                                                <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-black text-right">
                                                    {item.qty.toLocaleString()} <span className="text-[#7a8b95] font-bold text-[10px]">{item.unit}</span>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    {item.status === 'Completed' ? (
                                                        <span className="inline-flex items-center justify-center bg-[#657f4d]/10 text-[#657f4d] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#657f4d]/20"><Icons.Check size={10} className="mr-1"/> {item.status}</span>
                                                    ) : item.status === 'Quarantine' ? (
                                                        <span className="inline-flex items-center justify-center bg-[#932c2e]/10 text-[#932c2e] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#932c2e]/20"><Icons.AlertTriangle size={10} className="mr-1"/> {item.status}</span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center bg-[#b58c4f]/10 text-[#b58c4f] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#b58c4f]/20"><Icons.Clock size={10} className="mr-1"/> {item.status}</span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-4 text-center text-[12px] text-[#7a8b95] font-bold">
                                                    {item.inspector}
                                                </td>
                                                <td className="py-2.5 px-4">
                                                    <div className="flex items-center justify-center gap-[1px]">
                                                        <button onClick={() => handleView(item)} className="w-8 h-8 rounded border border-transparent hover:border-[#d7d7d7] flex items-center justify-center text-[#4d87a8] hover:bg-slate-100 transition-all font-bold" title="View & Edit Document">
                                                            <Icons.Edit size={15}/>
                                                        </button>
                                                        <button onClick={() => handlePrint(item)} className="w-8 h-8 rounded border border-transparent hover:border-[#d7d7d7] flex items-center justify-center text-[#7a8b95] hover:bg-slate-100 transition-all font-bold" title="Print Tag">
                                                            <Icons.Printer size={15}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={8} className="py-12 text-center text-[#7a8b95] font-bold text-[12px]">No product flow matched search query.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                /* GORGEOUS MATRIX VIEW SHOWING PHYSICAL STORAGE & SLOTS */
                                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredRecords.length > 0 ? filteredRecords.map((item, index) => {
                                        // Assume FG pallet max ~ 2000 qty base
                                        const capacityPercent = Math.min(Math.round((item.qty / 2000) * 105), 100);
                                        return (
                                            <div key={item.id} className="bg-white rounded-2xl border border-[#eaeaec] p-5 shadow-sm hover:border-[#b7a159] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between">
                                                {/* Top Indicator */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-[10px] font-bold px-2.5 py-1 bg-[#212c46]/10 text-[#212c46] rounded-md font-mono tracking-wider">{item.slot}</span>
                                                        <p className="text-[13px] font-black text-[#212c46] mt-2 font-mono">{item.batch}</p>
                                                    </div>
                                                    
                                                    {item.status === 'Completed' ? (
                                                        <span className="bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center font-sans"><Icons.Check size={8} className="mr-1"/> Checked</span>
                                                    ) : item.status === 'Quarantine' ? (
                                                        <span className="bg-[#932c2e]/10 text-[#932c2e] border border-[#932c2e]/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center font-sans"><Icons.AlertTriangle size={8} className="mr-1"/> Hold</span>
                                                    ) : (
                                                        <span className="bg-[#b58c4f]/10 text-[#b58c4f] border border-[#b58c4f]/20 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center font-sans"><Icons.Clock size={8} className="mr-1"/> Wait QC</span>
                                                    )}
                                                </div>

                                                {/* Material name and details */}
                                                <div className="space-y-1 mb-4 flex-1">
                                                    <p className="text-[13px] font-bold text-[#4d87a8]">{item.material}</p>
                                                    <p className="text-[11px] text-[#7a8b95] font-medium font-sans">Source: <span className="font-bold text-[#414757]">{item.vendor}</span></p>
                                                    <p className="text-[11px] text-[#7a8b95] font-medium font-sans">Received: {item.date}</p>
                                                    {item.spec && <p className="text-[10px] bg-[#f8f9fa] border border-[#eaeaec] font-mono text-[#7a8b95] px-2 py-1 rounded inline-block mt-1">{item.spec}</p>}
                                                </div>

                                                {/* Utilization / Volume Level Meter */}
                                                <div className="pt-2 border-t border-[#eaeaec] mt-auto">
                                                    <div className="flex justify-between text-[10px] text-[#7a8b95] font-black uppercase tracking-wider mb-1.5 font-sans">
                                                        <span>Slot Fill</span>
                                                        <span className="text-[#212c46]">{item.qty.toLocaleString()} {item.unit} ({capacityPercent}%)</span>
                                                    </div>
                                                    <div className="w-full bg-[#eaeaec] h-2 rounded-full overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-500" style={{
                                                            width: `${capacityPercent}%`,
                                                            backgroundColor: item.status === 'Quarantine' ? THEME.danger : item.status === 'Pending' ? THEME.gold : THEME.success
                                                        }}></div>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#f1f1f1]">
                                                    <button onClick={() => handleView(item)} className="h-8 px-4 border border-[#eaeaec] rounded-lg text-[10px] font-black uppercase tracking-widest text-[#4d87a8] hover:bg-[#4d87a8]/10 transition-colors flex items-center gap-1.5" title="Modify parameters">
                                                        <Icons.Edit size={12}/> Edit Inflow
                                                    </button>
                                                    <button onClick={() => handlePrint(item)} className="h-8 px-3 border border-[#eaeaec] rounded-lg text-xs font-medium text-[#7a8b95] hover:bg-[#7a8b95]/10 hover:text-[#414757] transition-all" title="Print Serial Sticker">
                                                        <Icons.Printer size={12}/>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="col-span-full py-16 text-center text-[#7a8b95] font-bold text-[12px]">No finished goods batches matched your search criteria.</div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* TABLE/GRID FOOTER */}
                        <div className="px-8 py-3 bg-[#f8f9fa] border-t border-t-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-sans">
                            <div className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                                Showing {filteredRecords.length} of {records.length} registered product flows
                            </div>
                            <div className="text-[10px] font-bold text-[#7a8b95] bg-white px-4 py-2 border border-[#eaeaec] rounded-xl flex items-center gap-2 shadow-inner">
                                <span className="w-2 h-2 rounded-full bg-[#657f4d] animate-pulse"></span> FULL SYNC ONLINE
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* SPACER FOR MARGIN OFFSET (mt-8) BEFORE FOOTER TO MATCH SPEC = 32px */}
            <div className="mt-8 shrink-0"></div>

            {/* ======================================= */}
            {/* DRAGGABLE VIEW / EDIT RECORD MODAL      */}
            {/* ======================================= */}
            <DraggableModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                width="max-w-[550px]"
                customHeader={
                    <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159] w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                                <Icons.Layers size={20} className="text-[#b7a159]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none font-sans">RECEIPT CONFIGURATION</h3>
                                <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 font-mono">ID: {selectedRecord?.id || '-'}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsViewModalOpen(false)} className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors"><Icons.X size={18}/></button>
                    </div>
                }
            >
                <div className="p-6 space-y-5 font-sans bg-white text-[#414757]">
                    <div className="grid grid-cols-2 gap-4 bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
                        <div>
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Product:</span>
                            <span className="text-[12px] font-black text-[#212c46] block">{selectedRecord?.material}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Source Group:</span>
                            <span className="text-[12px] font-bold text-[#212c46] block">{selectedRecord?.vendor}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Inbound Slotting:</span>
                            <span className="text-[11px] font-mono bg-[#212c46]/10 text-[#212c46] px-1.5 py-0.5 rounded font-bold">{selectedRecord?.slot}</span>
                        </div>
                        <div className="mt-2">
                            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Assigned Batch:</span>
                            <span className="text-[11px] font-mono text-[#4d87a8] font-bold">{selectedRecord?.batch}</span>
                        </div>
                    </div>

                    {/* EDITABLE FORM CONTROLS */}
                    <div className="space-y-4 pt-2">
                        <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-[0.15em] border-b pb-1">Modify Settings & Control parameters</h4>
                        
                        <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider block mb-1">Receipt Quantity ({selectedRecord?.unit})</label>
                            <input 
                                type="number" 
                                value={editQty} 
                                onChange={e => setEditQty(Number(e.target.value))} 
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none focus:border-[#b7a159] text-[#212c46]" 
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider block mb-1">QA Inspection Status</label>
                            <select 
                                value={editStatus} 
                                onChange={e => setEditStatus(e.target.value)} 
                                className="w-full bg-white border border-[#eaeaec] rounded-xl px-4 py-2.5 text-[12px] font-black outline-none focus:border-[#b7a159] text-[#212c46] cursor-pointer font-sans"
                            >
                                <option value="Completed">Completed (Passed QC checklist)</option>
                                <option value="Pending">Pending (Inspection in progress)</option>
                                <option value="Quarantine">Quarantine (Quarantined / Held)</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider block mb-1">Inspector / QC Officer Fullname</label>
                            <input 
                                type="text" 
                                value={editInspector} 
                                onChange={e => setEditInspector(e.target.value)} 
                                placeholder="Enter Inspector credentials"
                                className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none focus:border-[#b7a159] text-[#212c46]" 
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 font-sans">
                    <button onClick={() => setIsViewModalOpen(false)} className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button onClick={handleSaveRecord} className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2"><Icons.Save size={14}/> Save Settings</button>
                </div>
            </DraggableModal>

            {/* ======================================= */}
            {/* DRAGGABLE PRINT COMPLIANCE STICKER MODAL*/}
            {/* ======================================= */}
            <DraggableModal
                isOpen={isPrintModalOpen}
                onClose={() => setIsPrintModalOpen(false)}
                width="max-w-[480px]"
                customHeader={
                    <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159] w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                                <Icons.Printer size={20} className="text-[#b7a159]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none font-sans">PRINT SERIAL LABEL</h3>
                                <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 font-mono">WAREHOUSE INFLOW BATCH CONTROL</p>
                            </div>
                        </div>
                        <button onClick={() => setIsPrintModalOpen(false)} className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors"><Icons.X size={18}/></button>
                    </div>
                }
            >
                <div className="p-6 bg-white font-sans text-[#414757]">
                    <div id="material-print-label" className="border-4 border-dashed border-[#212c46] p-5 rounded-2xl space-y-4 max-w-[400px] mx-auto bg-white shadow-inner relative overflow-hidden text-black font-mono">
                        {/* Frame logo marker / watermarks */}
                        <div className="absolute right-0 top-0 w-24 h-24 border-b border-l border-[#eaeaec] bg-[#f8f9fa] flex flex-col items-center justify-center pointer-events-none opacity-40">
                            <Icons.Package size={36} className="text-[#212c46]" />
                            <span className="text-[8px] font-bold text-center uppercase tracking-widest leading-none mt-1">SMART LAW</span>
                        </div>

                        {/* Tag Header */}
                        <div>
                            <span className="text-[12px] font-black border-b border-black pb-1 uppercase tracking-widest text-[#212c46] block w-fit">FG INFLOW LABEL SERIAL_TAG</span>
                            <h2 className="text-[18px] font-black tracking-tight uppercase text-black mt-2 leading-tight">{selectedRecord?.material}</h2>
                            <p className="text-[10px] text-[#414757] font-bold uppercase mt-1">Source: {selectedRecord?.vendor}</p>
                        </div>

                        {/* Barcode representation */}
                        <div className="bg-black/95 text-white/90 p-4 rounded-xl flex flex-col items-center justify-center select-none shadow">
                            <div className="flex gap-[2px] items-stretch h-10 w-full justify-center max-w-[280px]">
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[4px] bg-white"></div>
                                <div className="w-[2px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[5px] bg-white"></div>
                                <div className="w-[2px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[4px] bg-white"></div>
                                <div className="w-[2px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[5px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[4px] bg-white"></div>
                                <div className="w-[2px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[4px] bg-white"></div>
                                <div className="w-[2px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[3px] bg-white"></div>
                                <div className="w-[5px] bg-white"></div>
                                <div className="w-[1px] bg-white"></div>
                                <div className="w-[4px] bg-white"></div>
                            </div>
                            <span className="text-[10px] font-black uppercase mt-2 tracking-[0.2em]">{selectedRecord?.id} * {selectedRecord?.batch}</span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[11px] border-t border-black/10 pt-3">
                            <div>
                                <span className="text-[9px] text-gray-500 block uppercase font-bold">QTY RECEIVED</span>
                                <span className="font-extrabold text-black">{selectedRecord?.qty.toLocaleString()} {selectedRecord?.unit}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-500 block uppercase font-bold">SLOT POSITION</span>
                                <span className="font-extrabold text-black">{selectedRecord?.slot}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-500 block uppercase font-bold">RECEIPT DATE</span>
                                <span className="font-bold text-gray-700">{selectedRecord?.date}</span>
                            </div>
                            <div>
                                <span className="text-[9px] text-gray-500 block uppercase font-bold">QC INSPECTOR</span>
                                <span className="font-bold text-gray-700">{selectedRecord?.inspector || 'Admin Checked'}</span>
                            </div>
                        </div>

                        {/* Small Stamp & Standard Sign */}
                        <div className="flex justify-between items-end border-t border-black/10 pt-3 text-[9px] text-gray-400">
                            <div>
                                <span>STATUS: <strong>{selectedRecord?.status?.toUpperCase()}</strong></span>
                            </div>
                            <div className="text-right">
                                <span className="border-b border-black text-black px-2 pb-0.5 block italic text-[10px] font-sans">Authorized stamp</span>
                                <span className="uppercase text-[8px] mt-0.5 block tracking-widest font-sans">SIGNATURE</span>
                            </div>
                        </div>
                    </div>
                    
                    <p className="text-[11px] text-[#7a8b95] text-center mt-4 leading-relaxed font-sans">
                        Label will compile and send to industrial zebra printer at warehouse loading bay node.
                    </p>
                </div>

                {/* Footer buttons */}
                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 font-sans">
                    <button onClick={() => setIsPrintModalOpen(false)} className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button onClick={handlePrintAction} className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2"><Icons.Printer size={14}/> Print tag now</button>
                </div>
            </DraggableModal>
        </div>
    );
}
