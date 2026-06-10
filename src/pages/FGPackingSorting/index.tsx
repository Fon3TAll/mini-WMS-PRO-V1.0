import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { motion, AnimatePresence } from 'motion/react';

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
    const IconCmp = (Icons as any)[icon] || Icons.Circle;
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
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BookOpen size={22} className="text-[#b7a159]"/> PACKING & SORTING GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">Finished Goods Preparation</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Box size={18} className="text-[#b7a159]"/> 1. Packing & Palletizing (การแพ็คสินค้าและจัดเรียงพาเลท)
            </h4>
            <p className="text-[12px] mb-3">ระบบอนุญาตให้จัดการแพ็คสินค้าที่ถูกหยิบมาเรียบร้อยแล้ว โดยมีขั้นตอนดังนี้:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Icons.Scan size={16} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div><strong className="text-[#4d87a8]">Verify Items:</strong> สแกนตรวจสอบสินค้าแต่ละรายการ (SKU) ให้ตรงกับใบหยิบสินค้า (Picking List) เพื่อป้องกันการแพ็คสินค้าผิดพลาด</div>
                </li>
                <li className="flex items-start gap-2 bg-[#eaeaec] p-3 rounded-xl border border-[#d7d7d7]">
                  <Icons.Layers size={16} className="shrink-0 text-[#212c46] mt-0.5"/> 
                  <div><strong className="text-[#212c46]">Pallet Generation:</strong> สร้างพาเลทหมายเลข SSCC และกำหนดขนาด/ประเภทของพาเลทสำหรับออร์เดอร์ (LCL, FCL, Mixed)</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.RefreshCw size={18} className="text-[#d96245]"/> 2. Status Tracking
            </h4>
            <p className="text-[12px] mb-3">สถานะของการแพ็คถูกแบ่งออกเป็น 4 ระดับ เพื่อการติดตามที่แม่นยำ:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#7a8b95]">Wait to Pack:</strong> สินค้าหยิบเสร็จแล้วและรอนำมาแพ็คใส่พาเลท/กล่อง</li>
                <li><strong className="text-[#d96245]">Packing:</strong> กำลังแพ็ค ดำเนินการสแกนทีละชิ้น และสร้างรหัส SSCC ไปด้วย</li>
                <li><strong className="text-[#212c46]">Ready to Ship:</strong> แพ็คเสร็จสมบูรณ์เรียบร้อย รอคิวสำหรับโหลดขึ้นรถขนส่ง (Dispatching)</li>
                <li><strong className="text-[#932c2e]">Exception:</strong> สินค้ามีปัญหาหรือสูญหายระหว่างเตรียมแพ็ค</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Printer size={18} className="text-[#3f809e]"/> 3. Documentation & Labels
            </h4>
            <p className="text-[12px]">เมื่อขึ้นสถานะ Ready to Ship ผู้ใช้สามารถสั่ง <b>พิมพ์ฉลากพาเลทจัดส่ง (Shipping Label / SSCC)</b> และเอกสาร <b>Packing List ส่งออก</b> เพื่อติดหน้าพาเลท</p>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Move size={18} className="text-[#b7a159]"/> 4. Draggable Workspace
            </h4>
            <p className="text-[12px]">หน้าต่างรายละเอียดของใบงานแพ็คสามารถลากย้ายได้แบบอิสระ <b>(Drag & Drop)</b> เพื่อตรวจสอบและเทียบรายการออเดอร์ได้อย่างต่อเนื่อง</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

const MOCK_DATA = [
    {
        id: 'PK-FG-2601-A1',
        orderRef: 'SO-100234',
        customer: 'Retail Group TH - Mega Bangna',
        status: 'Packing',
        itemsTotal: 120,
        itemsPacked: 85,
        palletsAssigned: 2,
        date: '2023-11-20',
        skus: [
            { id: 'SKU-001A', name: 'Product Alpha 1L', qty: 60, packed: 60 },
            { id: 'SKU-002B', name: 'Product Beta 500ml', qty: 60, packed: 25 },
        ]
    },
    {
        id: 'PK-FG-2601-B2',
        orderRef: 'SO-100235',
        customer: 'Central Express C-012',
        status: 'Wait to Pack',
        itemsTotal: 45,
        itemsPacked: 0,
        palletsAssigned: 0,
        date: '2023-11-20',
        skus: [
            { id: 'SKU-005C', name: 'Premium Pack Delta', qty: 45, packed: 0 },
        ]
    },
    {
        id: 'PK-FG-2601-C3',
        orderRef: 'SO-100230',
        customer: 'Big Superstore (HQ)',
        status: 'Ready to Ship',
        itemsTotal: 200,
        itemsPacked: 200,
        palletsAssigned: 4,
        date: '2023-11-19',
        skus: [
            { id: 'SKU-001A', name: 'Product Alpha 1L', qty: 100, packed: 100 },
            { id: 'SKU-008Z', name: 'Industrial Cleaner 5L', qty: 100, packed: 100 },
        ]
    },
    {
        id: 'PK-FG-2601-EX',
        orderRef: 'SO-100240',
        customer: 'Shop Local Pcl.',
        status: 'Exception',
        itemsTotal: 50,
        itemsPacked: 30,
        palletsAssigned: 1,
        date: '2023-11-20',
        skus: [
            { id: 'SKU-003D', name: 'Mini Packs', qty: 50, packed: 30 },
        ]
    }
];

export default function FGPackingSorting() {
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [records, setRecords] = useState(MOCK_DATA);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    const [isSmartSortLoading, setIsSmartSortLoading] = useState(false);
    const [smartSortResult, setSmartSortResult] = useState<string>('');
    const [isSmartSortModalOpen, setIsSmartSortModalOpen] = useState(false);

    const handleSmartSort = async () => {
        if (!selectedJob) return;
        setIsSmartSortLoading(true);
        setIsSmartSortModalOpen(true);
        setSmartSortResult("");
        try {
            const res = await fetch("/api/copilot/smart-sort", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: selectedJob.skus })
            });
            const data = await res.json();
            setSmartSortResult(data.text);
        } catch (error) {
            setSmartSortResult("- วางสินค้าที่มีน้ำหนักมากที่สุดไว้ล่างสุด\n- กระจายน้ำหนักให้สมดุล\n(Offline Fallback)");
        }
        setIsSmartSortLoading(false);
    };

    const filteredRecords = useMemo(() => {
        return records.filter(r => 
            r.id.toLowerCase().includes(search.toLowerCase()) || 
            r.orderRef.toLowerCase().includes(search.toLowerCase()) || 
            r.customer.toLowerCase().includes(search.toLowerCase())
        );
    }, [records, search]);

    const handleViewJob = (job: any) => {
        setSelectedJob(job);
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
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.PackageCheck size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                            PACKING & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">SORTING</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none font-sans">
                            FINISHED GOODS PALLET PREPARATION
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="Total Jobs Queue" value={records.length} icon="ListOrdered" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Active Orders" />
                        <KpiCard label="Ready to Ship" value={records.filter(r => r.status === 'Ready to Ship').length} icon="CheckSquare" colorAccent={THEME.success} colorValue={THEME.success} desc="Completed Pack" />
                        <KpiCard label="Wait to Pack" value={records.filter(r => r.status === 'Wait to Pack').length} icon="Clock" colorAccent={THEME.dustyBlue} colorValue={THEME.primary} desc="Pending Items" />
                        <KpiCard label="Exceptions" value={records.filter(r => r.status === 'Exception').length} icon="AlertOctagon" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Needs Attention" />
                    </div>

                    {/* MAIN CONTENT BLOCK */}
                    <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn mt-8 shrink-0">
                        {/* CONTROL BAR */}
                        <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-96">
                                    <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search Job ID or Order..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                                </div>
                            </div>
                        </div>

                        {/* DATA DISPLAY PANEL */}
                        <div className="overflow-auto custom-scrollbar bg-[#f8f9fa]">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#222b38] text-white border-b-2 border-[#709654]">
                                    <tr>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Packing Job ID</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Order Ref</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Customer</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Progress (Items)</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Pallets</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Status</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#eaeaec]">
                                    <AnimatePresence>
                                    {filteredRecords.length > 0 ? filteredRecords.map((item) => (
                                        <motion.tr 
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            key={item.id} 
                                            className="hover:bg-[#f8f9fa] transition-colors group"
                                        >
                                            <td className="py-2.5 px-4">
                                                <span className="font-black text-[#212c46] text-[12px] font-mono">{item.id}</span>
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#4d87a8] font-bold">
                                                {item.orderRef}
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-bold">
                                                {item.customer}
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <div className="flex flex-col items-center">
                                                    <span className="text-[12px] font-black text-[#212c46]">{item.itemsPacked} <span className="text-[#7a8b95] text-[10px] font-normal">/ {item.itemsTotal}</span></span>
                                                    <div className="w-24 bg-[#eaeaec] h-1.5 rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full bg-[#3f809e] rounded-full" style={{ width: `${(item.itemsPacked / item.itemsTotal) * 100}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#7a8b95] font-black text-center">
                                                {item.palletsAssigned > 0 ? (
                                                    <span className="bg-[#f8f9fa] border border-[#d7d7d7] px-2 py-0.5 rounded text-[#212c46]">{item.palletsAssigned}</span>
                                                ) : '-'}
                                            </td>
                                            <td className="py-2.5 px-4 text-center">
                                                <motion.span layout className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-widest border ${
                                                    item.status === 'Ready to Ship' ? 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/20' : 
                                                    item.status === 'Exception' ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/20' :
                                                    item.status === 'Wait to Pack' ? 'bg-[#eaeaec]/50 text-[#7a8b95] border-[#d7d7d7]' :
                                                    'bg-[#d96245]/10 text-[#d96245] border-[#d96245]/20'
                                                }`}>
                                                    {item.status}
                                                </motion.span>
                                            </td>
                                            <td className="py-2.5 px-4">
                                                <div className="flex items-center justify-center gap-[1px]">
                                                    <button onClick={() => handleViewJob(item)} className="w-8 h-8 rounded border border-transparent hover:border-[#d7d7d7] flex items-center justify-center text-[#4d87a8] hover:bg-slate-100 transition-all font-bold" title="Open Job">
                                                        <Icons.ArrowRight size={16}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-[#7a8b95] font-bold text-[12px]">No jobs matched search query.</td>
                                        </tr>
                                    )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* TABLE/GRID FOOTER */}
                        <div className="px-8 py-3 bg-[#f8f9fa] border-t border-t-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-sans">
                            <div className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                                Showing {filteredRecords.length} jobs
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

            {/* DRAGGABLE MODAL: JOB DETAILS */}
            <DraggableModal
                isOpen={!!selectedJob}
                onClose={() => setSelectedJob(null)}
                width="max-w-[700px]"
                customHeader={
                    <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159] w-full">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                                <Icons.Box size={20} className="text-[#b7a159]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none font-sans">PACKING WORKSPACE</h3>
                                <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 font-mono">Job ID: {selectedJob?.id}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedJob(null)} className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors"><Icons.X size={18}/></button>
                    </div>
                }
            >
                {selectedJob && (
                    <div className="p-6 font-sans bg-white text-[#414757]">
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
                                <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Order Reference</span>
                                <span className="text-[14px] font-black text-[#4d87a8] block">{selectedJob.orderRef}</span>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
                                <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Customer</span>
                                <span className="text-[12px] font-bold text-[#212c46] block mt-0.5 truncate">{selectedJob.customer}</span>
                            </div>
                            <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#eaeaec]">
                                <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">Packing Status</span>
                                <span className="text-[13px] font-black text-[#d96245] block uppercase tracking-widest">{selectedJob.status}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center border-b pb-2">
                                <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2">
                                    <Icons.ListChecks size={16} className="text-[#b7a159]" /> ITEM VERIFICATION LIST
                                </h4>
                                <button onClick={handleSmartSort} disabled={isSmartSortLoading} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm flex items-center gap-1.5 ${isSmartSortLoading ? 'bg-[#eaeaec] text-[#7a8b95] border-[#d7d7d7]' : 'bg-[#e9d8c0]/20 text-[#a94228] border-[#a94228]/30 hover:bg-[#a94228] hover:text-white hover:border-[#a94228]'}`}>
                                    {isSmartSortLoading ? <Icons.Loader2 size={13} className="animate-spin" /> : <Icons.Sparkles size={13} />}
                                    Smart Sort AI
                                </button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left font-sans">
                                    <thead className="bg-[#f8f9fa] border-y border-[#eaeaec]">
                                        <tr>
                                            <th className="py-2.5 px-4 font-black uppercase tracking-widest text-[10px] text-[#7a8b95]">SKU</th>
                                            <th className="py-2.5 px-4 font-black uppercase tracking-widest text-[10px] text-[#7a8b95]">Item Name</th>
                                            <th className="py-2.5 px-4 font-black uppercase tracking-widest text-[10px] text-[#7a8b95] text-right">Required</th>
                                            <th className="py-2.5 px-4 font-black uppercase tracking-widest text-[10px] text-[#7a8b95] text-right">Packed</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] text-[12px]">
                                        {selectedJob.skus.map((sku: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="py-3 px-4 font-mono font-bold text-[#212c46]">{sku.id}</td>
                                                <td className="py-3 px-4 text-[#414757] truncate max-w-[200px]">{sku.name}</td>
                                                <td className="py-3 px-4 text-right font-black text-[#212c46]">{sku.qty}</td>
                                                <td className="py-3 px-4 text-right">
                                                    <span className={`font-black ${sku.packed === sku.qty ? 'text-[#657f4d]' : 'text-[#d96245]'}`}>
                                                        {sku.packed}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Footer Controls */}
                <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-between items-center shrink-0 font-sans">
                    <button className="px-4 py-2 border border-[#d7d7d7] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest bg-white hover:bg-[#eaeaec] transition-all flex items-center gap-2">
                        <Icons.Printer size={14} /> Print SSCC Label
                    </button>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedJob(null)} className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Close</button>
                        <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2">
                            <Icons.CheckCircle size={14}/> Complete Pack
                        </button>
                    </div>
                </div>
            </DraggableModal>

            <DraggableModal
                isOpen={isSmartSortModalOpen}
                onClose={() => setIsSmartSortModalOpen(false)}
                width="max-w-[500px]"
                customHeader={
                    <div className="bg-[#1d2636] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b-2 border-[#b7a159]">
                        <div className="flex items-center gap-3">
                            <Icons.Sparkles size={20} className="text-[#b7a159]" />
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none font-sans">SMART SORT AI</h3>
                        </div>
                        <button onClick={() => setIsSmartSortModalOpen(false)} className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors"><Icons.X size={18}/></button>
                    </div>
                }
            >
                <div className="p-6 bg-white font-sans text-[#414757]">
                    {isSmartSortLoading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <Icons.Loader2 size={32} className="animate-spin text-[#b7a159] mb-4" />
                            <p className="font-bold text-[12px] uppercase text-[#7a8b95] tracking-widest">Generating Optimal Arrangement...</p>
                        </div>
                    ) : (
                        <div className="space-y-4 text-left">
                            <div className="bg-[#f8f9fa] border border-[#eaeaec] shadow-inner rounded-xl p-4 text-[12.5px] leading-relaxed whitespace-pre-line text-[#212c46] font-medium text-left">
                                {smartSortResult}
                            </div>
                            <div className="flex justify-end">
                                <button onClick={() => setIsSmartSortModalOpen(false)} className="px-5 py-2.5 bg-[#212c46] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all border-[#212c46]">
                                    Got it
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DraggableModal>

        </div>
    );
}
