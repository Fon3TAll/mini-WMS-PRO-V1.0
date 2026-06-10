import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration ---
const THEME = {
  primary: '#212c46',
  headerBg: '#133951',
  headerBorder: '#ad2b10',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#ad2b10',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
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

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);

// KPI Card ปรับ padding ให้กระชับ -- ลีน แต่ยังคงความสวย
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white px-3 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[150px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[76px] min-h-[76px] flex flex-col justify-between animate-fadeIn text-left">
        <div className="absolute -right-3 -bottom-5 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={70} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.05em] drop-shadow-sm leading-none mt-1">{label}</p>
            <div className={`w-6 h-6 rounded border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={14} />
            </div>
        </div>
        <div className="relative z-10 flex items-end justify-between">
            <p className="text-[16px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Draft': style = { bg: '#f8f9fa', color: '#7a8b95', border: '#d7d7d7' }; break;
    case 'Submitted': style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; break;
    case 'Received': style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; break;
    case 'Rejected': style = { bg: '#ad2b1015', color: THEME.danger, border: '#ad2b1030' }; break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full bg-current"></div> {status}
    </span>
  );
};

// User Guide ปรับ padding ให้กระชับ -- ลีน สวย
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#ad2b10] bg-[#133951] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> PRODUCTION DELIVERY GUIDE</h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-0.5">Finished Goods Transfer Process</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-[#ad2b10] hover:bg-white/10 rounded-lg transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-[#f8f9fa]">
          <section className="animate-fadeIn bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm">
            <h4 className="text-[12px] font-black text-[#133951] mb-2 uppercase flex items-center gap-1.5 border-b-2 border-[#d7d7d7] pb-1 font-mono">
              <Icons.Factory size={14} className="text-[#b7a159]"/> 1. Delivery Concept
            </h4>
            <p className="text-[11px] mb-2">หน้าจอสำหรับฝ่ายผลิต (Production) สร้างเอกสารส่งมอบสินค้าสำเร็จรูป (FG) เข้าคลังสินค้าเพื่อความถูกต้องในการติดตาม Lot/MFG/EXP และปริมาณจัดเก็บ</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec]">
                  <Icons.PackagePlus size={12} className="shrink-0 text-[#133951] mt-0.5"/> 
                  <div className="text-[10px]"><strong className="text-[#133951]">Batch Delivery:</strong> รองรับการรวมส่งออกหลายรายการ/หลายแบทช์ผลิตภายใต้ใบส่งมอบ (Transfer DOC) เดียวกันได้</div>
                </li>
            </ul>
          </section>

          <section className="animate-fadeIn bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[12px] font-black text-[#133951] mb-2 uppercase flex items-center gap-1.5 border-b-2 border-[#d7d7d7] pb-1 font-mono">
              <Icons.Activity size={14} className="text-[#3f809e]"/> 2. Status Tracking & Approval
            </h4>
            <div className="space-y-2.5 text-[10px]">
                <div className="flex items-start gap-2">
                    <span className="w-[68px] shrink-0 font-black text-[#7a8b95] bg-[#f8f9fa] px-1.5 py-0.5 rounded text-center border border-[#d7d7d7]">Draft</span> 
                    <span className="pt-0.5">ร่างเอกสารอยู่ฝั่งผลิต ยังไม่ส่งข้อมูลเข้าคลัง สามารถแก้ไขรายการสินค้า เปลี่ยนแปลงจำนวน หรือลบเอกสารทิ้งได้</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-[68px] shrink-0 font-black text-[#3f809e] bg-[#3f809e15] px-1.5 py-0.5 rounded text-center border border-[#3f809e30]">Submitted</span> 
                    <span className="pt-0.5">ฝ่ายผลิตกดยืนยันส่งมอบ คลังสินค้าจะมองเห็นข้อมูลว่ามีของเตรียมเข้าคลัง (รอการทำ GR / Putaway)</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-[68px] shrink-0 font-black text-[#657f4d] bg-[#657f4d15] px-1.5 py-0.5 rounded text-center border border-[#657f4d30]">Received</span> 
                    <span className="pt-0.5">คลังสินค้ารับของเรียบร้อย ยอดสต็อกถูกปรับเพิ่มในระบบ ฝ่ายผลิตไม่สามารถแก้ไขเอกสารนี้ได้อีก</span>
                </div>
                <div className="flex items-start gap-2">
                    <span className="w-[68px] shrink-0 font-black text-[#ad2b10] bg-[#ad2b1015] px-1.5 py-0.5 rounded text-center border border-[#ad2b1030]">Rejected</span> 
                    <span className="pt-0.5">ระงับการรับเข้าโดยคลังสินค้า (อาจเกิดจาก สินค้าเสียหาย จำนวนไม่ตรง แบทช์ผิด) เอกสารจะถูกตีกลับ</span>
                </div>
            </div>
          </section>
        </div>
        
        <div className="p-3 bg-white border-t border-[#eaeaec] flex justify-end shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#133951] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#b7a159] transition-all shadow-sm tracking-[0.1em]">Acknowledge</button>
        </div>
      </div>
    </>, document.body
  );
}

const MOCK_SKU_MASTER = [
  { sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', uom: 'Pack', shelfLifeDays: 365 },
  { sku: 'SKU-8802', name: 'Singha Water 600ml Pack 12', uom: 'Pack', shelfLifeDays: 730 },
  { sku: 'SKU-8803', name: 'Mama Tom Yum Shrimp', uom: 'Box', shelfLifeDays: 180 },
  { sku: 'SKU-8804', name: 'Lays Classic 73g', uom: 'Carton', shelfLifeDays: 180 },
  { sku: 'SKU-8805', name: 'Sunlight Lemon 500ml', uom: 'Carton', shelfLifeDays: 1095 },
  { sku: 'SKU-8806', name: 'Chang Beer 320ml Can Pack 24', uom: 'Carton', shelfLifeDays: 365 },
  { sku: 'SKU-8807', name: 'Oishi Green Tea 500ml', uom: 'Carton', shelfLifeDays: 365 },
  { sku: 'SKU-8808', name: 'Breeze Excel Liquid 700ml', uom: 'Carton', shelfLifeDays: 1095 },
  { sku: 'SKU-8811', name: 'M-150 Energy Drink', uom: 'Carton', shelfLifeDays: 730 },
];

function EditDeliveryModal({ isOpen, onClose, data, onSave }: any) {
    const isNew = data?.isNew;
    const [activeTab, setActiveTab] = useState<'doc_info' | 'add_goods' | 'cart'>('doc_info');
    
    const [docInfo, setDocInfo] = useState({
        docNo: '', prodOrder: '', creator: ''
    });
    
    const [items, setItems] = useState<any[]>([]);
    
    const [currentItem, setCurrentItem] = useState({
        sku: '', name: '', lotNo: '', qty: 1, uom: '', 
        mfgDate: new Date().toISOString().split('T')[0], expDate: ''
    });

    const [expWarning, setExpWarning] = useState('');

    useEffect(() => {
        if (isOpen && data) {
            setDocInfo({
                docNo: data.docNo || '',
                prodOrder: data.prodOrder || '',
                creator: data.creator || ''
            });
            if (data.isNew || data.readonly) {
                if (data.readonly) {
                     setItems([JSON.parse(JSON.stringify(data))]);
                     setActiveTab('doc_info');
                } else {
                     setItems([]);
                     setActiveTab('doc_info');
                }
                setCurrentItem({
                    sku: '', name: '', lotNo: '', qty: 1, uom: '', 
                    mfgDate: new Date().toISOString().split('T')[0], expDate: ''
                });
            } else {
                setItems([]);
                setCurrentItem(JSON.parse(JSON.stringify(data))); // Populate form for editing
                setActiveTab('add_goods');
            }
        }
    }, [isOpen, data]);

    useEffect(() => {
        if (currentItem.sku && currentItem.mfgDate && currentItem.expDate) {
            const found = MOCK_SKU_MASTER.find(s => s.sku === currentItem.sku);
            if (found) {
                const expectedExp = new Date(currentItem.mfgDate);
                expectedExp.setDate(expectedExp.getDate() + found.shelfLifeDays);
                const expectedStr = expectedExp.toISOString().split('T')[0];
                if (currentItem.expDate !== expectedStr) {
                    setExpWarning(`Mismatch! Expected EXP: ${expectedStr}`);
                } else {
                    setExpWarning('');
                }
            }
        } else {
            setExpWarning('');
        }
    }, [currentItem.sku, currentItem.mfgDate, currentItem.expDate]);

    const handleSkuChange = (skuVal: string) => {
        const found = MOCK_SKU_MASTER.find(s => s.sku === skuVal);
        if (found) {
            const mfg = new Date(currentItem.mfgDate);
            mfg.setDate(mfg.getDate() + found.shelfLifeDays);
            const expString = mfg.toISOString().split('T')[0];
            setCurrentItem(prev => ({ ...prev, sku: found.sku, name: found.name, uom: found.uom, expDate: expString }));
        } else {
            setCurrentItem(prev => ({ ...prev, sku: skuVal, name: '', uom: '', expDate: '' }));
        }
    };

    const handleAddItem = () => {
        if (!currentItem.sku || !currentItem.qty) return;
        setItems([...items, { ...currentItem, id: Date.now() }]);
        setCurrentItem({
            sku: '', name: '', lotNo: '', qty: 1, uom: '', 
            mfgDate: new Date().toISOString().split('T')[0], expDate: ''
        });
    };

    const handleRemoveItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    if (!isOpen || !data) return null;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(docInfo.docNo || 'NEW_DOC')}`;

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[750px]"
            customHeader={
                <div className="bg-[#133951] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#ad2b10]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
                            <Icons.Factory size={24} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none">{docInfo.docNo || 'NEW DELIVERY'}</h3>
                            <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 text-left">PRODUCTION DELIVERY FORM</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-[#ad2b10] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-lg"><Icons.X size={16} /></button>
                </div>
            }
        >
            <div className="flex-1 overflow-hidden bg-[#f8f9fa] text-left relative flex flex-col md:flex-row h-full">
                
                {/* Sidebar Navigation */}
                <div className="w-full md:w-[180px] bg-white border-b md:border-b-0 md:border-r border-[#eaeaec] flex flex-row md:flex-col overflow-x-auto shrink-0 p-3 gap-2 sticky top-0 z-10 shrink-0 custom-scrollbar">
                    <button 
                        onClick={() => setActiveTab('doc_info')} 
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors shrink-0 md:w-full text-left ${activeTab === 'doc_info' ? 'bg-[#133951] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-[#f8f9fa] hover:text-[#133951]'}`}
                    >
                        <Icons.Info size={16}/> Doc Info
                    </button>
                    {!data?.readonly && (
                    <button 
                        onClick={() => setActiveTab('add_goods')} 
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors shrink-0 md:w-full text-left ${activeTab === 'add_goods' ? 'bg-[#133951] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-[#f8f9fa] hover:text-[#133951]'}`}
                    >
                        <Icons.PackagePlus size={16}/> Item Input
                    </button>
                    )}
                    <button 
                        onClick={() => setActiveTab('cart')} 
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors shrink-0 md:w-full text-left ${activeTab === 'cart' ? 'bg-[#133951] text-white shadow-sm' : 'text-[#7a8b95] hover:bg-[#f8f9fa] hover:text-[#133951]'}`}
                    >
                        <div className="flex items-center gap-2"><Icons.ShoppingCart size={16}/> View List</div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'cart' ? 'bg-white/20' : 'bg-[#eaeaec] text-[#212c46]'}`}>{items.length}</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-[#f8f9fa]">
                    
                    {/* Tab 1: Doc Info */}
                    {activeTab === 'doc_info' && (
                    <div className="space-y-4 animate-fadeIn p-4 md:p-5">
                        <h4 className="text-[12px] font-black text-[#133951] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
                            <Icons.Info size={14} className="text-[#3f809e]"/> Delivery Document Info
                        </h4>
                        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-[#eaeaec] flex flex-col md:flex-row gap-5 items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Doc No</label>
                                    <input type="text" value={docInfo.docNo} readOnly className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Creator (Team)</label>
                                    <input type="text" value={docInfo.creator} readOnly={data?.readonly} onChange={e => setDocInfo({...docInfo, creator: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]" placeholder="e.g. Prod. Team A" />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Prod. Order Ref.</label>
                                    <input type="text" value={docInfo.prodOrder} readOnly={data?.readonly} onChange={e => setDocInfo({...docInfo, prodOrder: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8] uppercase" placeholder="e.g. PO-991" />
                                </div>
                            </div>
                            {isNew && (
                                <div className="shrink-0 flex flex-col items-center justify-center p-3 border border-[#eaeaec] rounded-xl bg-[#f8f9fa] w-[130px] mx-auto md:mx-0 mt-4 md:mt-0">
                                    <img src={qrCodeUrl} alt="QR Code" className="w-[100px] h-[100px] mb-2 rounded border border-[#d7d7d7]" />
                                    <span className="text-[9px] font-black tracking-widest text-[#7a8b95] uppercase">SCAN TO OPEN</span>
                                </div>
                            )}
                        </div>
                        {isNew && (
                            <div className="flex justify-end pt-2">
                                <button onClick={() => setActiveTab('add_goods')} className="bg-[#4d87a8] text-white px-5 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-[#3f809e] transition-colors flex items-center gap-2">
                                    Next: Add Items <Icons.ArrowRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    )}

                    {/* Tab 2: Item Entry */}
                    {activeTab === 'add_goods' && !data?.readonly && (
                    <div className="space-y-4 animate-fadeIn p-4 md:p-5">
                        <div className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-[#3f809e]/30">
                            <h4 className="text-[12px] font-black text-[#133951] uppercase border-b border-[#eaeaec] pb-3 mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2"><Icons.PackagePlus size={14} className="text-[#a94228]"/> {isNew ? 'Add Goods to Delivery' : 'Edit Delivery Goods'}</span>
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Select SKU</label>
                                    <select value={currentItem.sku} onChange={e => handleSkuChange(e.target.value)} className="w-full bg-white border border-[#eaeaec] rounded-lg px-2 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8] custom-scrollbar">
                                        <option value="">-- Choose --</option>
                                        {MOCK_SKU_MASTER.map(sku => (
                                            <option key={sku.sku} value={sku.sku}>{sku.sku} : {sku.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1.5 sm:col-span-4">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Product Name</label>
                                    <input type="text" value={currentItem.name} readOnly={!!currentItem.sku} onChange={e => setCurrentItem({...currentItem, name: e.target.value})} className={`w-full ${currentItem.sku ? 'bg-[#f8f9fa]' : 'bg-white'} border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]`} placeholder="Auto filled from SKU" />
                                </div>
                                
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Batch/Lot No.</label>
                                    <input type="text" value={currentItem.lotNo} onChange={e => setCurrentItem({...currentItem, lotNo: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8] uppercase" placeholder="e.g. L-2310" />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Qty</label>
                                    <input type="number" min="1" value={currentItem.qty} onChange={e => setCurrentItem({...currentItem, qty: Number(e.target.value)})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8] font-mono" />
                                </div>
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">UOM</label>
                                    <input type="text" value={currentItem.uom} readOnly={!!currentItem.sku} onChange={e => setCurrentItem({...currentItem, uom: e.target.value})} className={`w-full ${currentItem.sku ? 'bg-[#f8f9fa]' : 'bg-white'} border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]`} placeholder="Auto filled" />
                                </div>

                                <div className="space-y-1.5 sm:col-span-3">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">MFG Date</label>
                                    <input type="date" value={currentItem.mfgDate} onChange={e => setCurrentItem({...currentItem, mfgDate: e.target.value})} onBlur={() => handleSkuChange(currentItem.sku)} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]" />
                                </div>
                                <div className="space-y-1.5 sm:col-span-3 relative">
                                    <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest flex items-center justify-between">
                                        EXP Date
                                    </label>
                                    <input type="date" value={currentItem.expDate} onChange={e => setCurrentItem({...currentItem, expDate: e.target.value})} className={`w-full bg-white ${expWarning ? 'border-[#ad2b10] border-2 text-[#ad2b10]' : 'border-[#eaeaec]'} rounded-lg px-3 py-2 text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]`} />
                                    {expWarning && (
                                        <span className="absolute top-[1px] right-0 text-[8px] font-black text-[#ad2b10] bg-[#ad2b10]/10 px-1 rounded animate-pulse">{expWarning}</span>
                                    )}
                                </div>
                            </div>
                            {isNew && (
                            <div className="flex justify-end pt-5 border-t border-[#eaeaec] mt-5">
                                <button onClick={handleAddItem} disabled={!currentItem.sku || !currentItem.qty} className="px-5 py-2.5 bg-[#657f4d] text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#526a3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2">
                                    <Icons.Plus size={14}/> Add To List
                                </button>
                            </div>
                            )}
                        </div>
                    </div>
                    )}

                    {/* Tab 3: Cart Items Table */}
                    {activeTab === 'cart' && (
                    <div className="space-y-4 animate-fadeIn p-4 md:p-5">
                        <div className="flex items-center justify-between border-b border-[#eaeaec] pb-3">
                            <h4 className="text-[12px] font-black text-[#133951] uppercase flex items-center gap-2">
                                <Icons.ShoppingCart size={14} className="text-[#3f809e]"/> Items in Delivery ({items.length})
                            </h4>
                            {isNew && (
                                <button onClick={() => setActiveTab('add_goods')} className="text-[#4d87a8] hover:text-[#133951] text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-colors bg-white border border-[#eaeaec] px-3 py-1.5 rounded-lg">
                                    <Icons.Plus size={12}/> Add More
                                </button>
                            )}
                        </div>
                        
                        {items.length === 0 ? (
                            <div className="text-center py-10 bg-white rounded-xl border border-[#eaeaec] shadow-sm">
                                <div className="text-[#eaeaec] flex justify-center mb-2"><Icons.PackageX size={32}/></div>
                                <p className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">No items added yet</p>
                                {isNew && (
                                    <button onClick={() => setActiveTab('add_goods')} className="mt-4 px-4 py-2 bg-[#4d87a8] text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-[#3f809e] transition-colors shadow-sm inline-flex items-center gap-2">
                                        <Icons.Plus size={14}/> Start Adding Goods
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-[#eaeaec] overflow-hidden overflow-x-auto">
                                <table className="w-full text-left font-sans min-w-[500px]">
                                    <thead className="bg-[#f8f9fa] border-b border-[#eaeaec] text-[#7a8b95]">
                                        <tr>
                                            <th className="py-2.5 px-3 text-[10px] font-black uppercase tracking-widest w-[80px]">รหัสสินค้า (SKU)</th>
                                            <th className="py-2.5 px-3 text-[10px] font-black uppercase tracking-widest">รายการสินค้า</th>
                                            <th className="py-2.5 px-3 text-[10px] font-black uppercase tracking-widest text-center">รุ่นการผลิต (Lot)</th>
                                            <th className="py-2.5 px-3 text-[10px] font-black uppercase tracking-widest text-right">จำนวน</th>
                                            {isNew && <th className="py-2.5 px-3 text-[10px] font-black uppercase tracking-widest text-center w-[50px]">จัดการ</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec]/60">
                                        {items.map((it, idx) => (
                                            <tr key={it.id || idx} className="hover:bg-[#f8f9fa] transition-colors">
                                                <td className="py-2.5 px-3 text-[11px] font-mono font-black text-[#133951]">{it.sku}</td>
                                                <td className="py-2.5 px-3">
                                                    <div className="text-[11px] font-bold text-[#212c46] line-clamp-1">{it.name}</div>
                                                    <div className="text-[9px] font-bold text-[#7a8b95] uppercase">MFG: {it.mfgDate} | EXP: {it.expDate}</div>
                                                </td>
                                                <td className="py-2.5 px-3 text-[11px] font-mono font-bold text-[#212c46] text-center">{it.lotNo}</td>
                                                <td className="py-2.5 px-3 text-[11px] font-mono font-black text-[#b58c4f] text-right">{it.qty} <span className="text-[#7a8b95] font-sans text-[9px]">{it.uom}</span></td>
                                                {isNew && (
                                                <td className="py-2.5 px-3 text-center">
                                                    <button onClick={() => handleRemoveItem(it.id)} className="w-7 h-7 flex items-center justify-center rounded-lg text-[#ad2b10] hover:bg-[#ad2b10]/10 transition-colors mx-auto"><Icons.Trash2 size={12}/></button>
                                                </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-white border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 rounded-b-3xl">
                <button onClick={onClose} className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1] transition-all shadow-sm">{data?.readonly ? 'Close' : 'Cancel'}</button>
                {!data?.readonly && (
                    <button onClick={()=>{
                        const finalItems = [...items];
                        // If they are modifying a new item and forgot to hit 'Add', auto add it IF it's valid
                        if (activeTab === 'add_goods' && currentItem.sku && currentItem.qty && (isNew || items.length === 0)) {
                            finalItems.push(currentItem);
                        } else if (!isNew && currentItem.sku) {
                            finalItems.push(currentItem);
                        }
                        
                        const actualPayloadItems = finalItems.length > 0 ? finalItems : (currentItem.sku && currentItem.qty ? [currentItem] : []);
                        
                        onSave({ docInfo, items: actualPayloadItems, isNew }); 
                        onClose();
                    }} disabled={isNew && items.length === 0 && (!currentItem.sku || !currentItem.qty)} className="bg-[#133951] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#b7a159] disabled:opacity-50 transition-all flex items-center gap-2"><Icons.Save size={14}/> {isNew ? 'Save all deliveries' : 'Update Delivery'}</button>
                )}
            </div>
        </DraggableModal>
    );
}

function ShareFormModal({ isOpen, onClose }: any) {
    const [copied, setCopied] = useState(false);
    if (!isOpen) return null;
    
    // We construct the link for generating
    let link = '';
    if (typeof window !== 'undefined') {
        link = `${window.location.origin}${window.location.pathname}?action=new-delivery`;
    }
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(link)}`;

    const handleCopy = () => {
        if (typeof navigator !== 'undefined') {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[300] bg-[#212c46]/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] flex flex-col items-center gap-5 relative border border-[#eaeaec] text-left" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-[#7a8b95] hover:text-[#ad2b10] bg-white hover:bg-[#f8f9fa] p-1.5 rounded-lg transition-colors"><Icons.X size={20}/></button>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-[#133951]/10 text-[#133951] flex items-center justify-center">
                        <Icons.Share2 size={28}/>
                    </div>
                    <h3 className="font-black text-[#133951] uppercase tracking-widest mt-2 text-[14px]">Share New Delivery Form</h3>
                    <p className="text-[11px] font-bold text-[#7a8b95] text-center px-4">ฝ่ายผลิตสามารถเปิดหน้านี้เพื่อสร้างเอกสารนำส่งสินค้าใหม่ หรือสแกน QR Code ด้านล่าง</p>
                </div>

                <div className="border border-[#eaeaec] p-4 rounded-xl bg-[#f8f9fa] mt-2">
                    <img src={qrCodeUrl} alt="QR Code Link" className="w-[200px] h-[200px] rounded-lg shadow-sm bg-white p-2 border border-[#d7d7d7]" />
                </div>

                <div className="w-full relative mt-2">
                    <input type="text" readOnly value={link} className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg pl-3 pr-12 py-2.5 text-[10px] font-mono text-[#4d87a8] outline-none" />
                    <button onClick={handleCopy} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded bg-[#133951] text-white hover:bg-[#b7a159] transition-all">
                        {copied ? <Icons.Check size={14}/> : <Icons.Copy size={14}/>}
                    </button>
                    {copied && <span className="absolute -top-7 right-0 text-[10px] font-black text-white bg-[#657f4d] px-2 py-1 rounded animate-fadeIn shadow-sm">Copied!</span>}
                </div>
            </div>
        </div>, document.body
    )
}

function BatchStatusLogModal({ isOpen, onClose, batchId }: any) {
    if (!isOpen) return null;

    // Mock data for scan events based on batchId
    const history = [
        { id: 1, time: '2023-10-15 08:30', action: 'Created (Draft)', user: 'Proposer A', location: 'Prod. Line 1' },
        { id: 2, time: '2023-10-15 09:15', action: 'Submitted (Pending GR)', user: 'Approver B', location: 'Prod. Line 1' },
        { id: 3, time: '2023-10-15 10:05', action: 'Scanned at Dock', user: 'Forklift C', location: 'Dock 2' },
        { id: 4, time: '2023-10-15 10:30', action: 'Putaway Completed', user: 'WMS Auto', location: 'Zone A-12' },
    ];

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[300] bg-[#212c46]/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-[450px] flex flex-col items-center gap-5 relative border border-[#eaeaec] text-left" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-[#7a8b95] hover:text-[#ad2b10] bg-white hover:bg-[#f8f9fa] p-1.5 rounded-lg transition-colors"><Icons.X size={20}/></button>
                <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full bg-[#b58c4f]/10 text-[#b58c4f] flex items-center justify-center">
                        <Icons.History size={28}/>
                    </div>
                    <h3 className="font-black text-[#133951] uppercase tracking-widest mt-2 text-[14px]">Batch Status Log</h3>
                    <p className="text-[11px] font-bold text-[#7a8b95] text-center px-4 font-mono w-full bg-[#f8f9fa] py-1.5 border border-[#eaeaec] rounded">Batch: <span className="text-[#212c46] font-black">{batchId}</span></p>
                </div>

                <div className="w-full mt-2 relative overflow-y-auto max-h-[300px] custom-scrollbar px-2">
                    <div className="absolute left-[20px] top-2 bottom-6 w-0.5 bg-[#eaeaec] z-0"></div>
                    <div className="space-y-4 relative z-10 w-full pl-10 pr-2">
                        {history.map((event, idx) => (
                            <div key={event.id} className="relative">
                                <div className={`absolute -left-[30px] top-1.5 w-[11px] h-[11px] rounded-full flex items-center justify-center ${idx === history.length - 1 ? 'bg-[#657f4d] shadow-[0_0_0_3px_rgba(101,127,77,0.2)]' : 'bg-[#eaeaec] border border-[#d7d7d7]'}`}>
                                    {idx === history.length - 1 && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <div className={`bg-white border p-3 rounded-xl shadow-sm transition-all ${idx === history.length - 1 ? 'border-[#657f4d]/30 bg-[#657f4d]/5' : 'border-[#eaeaec] hover:border-[#b58c4f]'}`}>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <span className={`font-black text-[11px] uppercase tracking-widest ${idx === history.length - 1 ? 'text-[#657f4d]' : 'text-[#133951]'}`}>{event.action}</span>
                                        <span className="font-mono font-bold text-[9px] text-[#7a8b95] shrink-0 mt-0.5">{event.time}</span>
                                    </div>
                                    <div className="flex justify-between items-end text-[10px] text-[#7a8b95] font-bold mt-2">
                                        <span className="uppercase"><Icons.User size={10} className="inline mr-1 text-[#3f809e]"/>{event.user}</span>
                                        <span className="uppercase text-[#212c46] font-black font-mono tracking-widest"><Icons.MapPin size={10} className="inline mr-1 text-[#ad2b10]"/>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="w-full text-center">
                     <p className="text-[9px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">All times are recorded in local timezone</p>
                </div>
            </div>
        </div>, document.body
    )
}

export default function ProductionDelivery() {
  const [activeTab, setActiveTab] = useState('all'); 
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [batchLogModal, setBatchLogModal] = useState<{isOpen: boolean, batchId: string}>({isOpen: false, batchId: ''});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editModal, setEditModal] = useState<{isOpen: boolean, data: any}>({isOpen: false, data: null});
  
  // 100% Mock Data
  const [deliveryList, setDeliveryList] = useState<any[]>([
    { id: 1, docNo: 'PD-2310-0001', prodOrder: 'PO-991', sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', qty: 2500, uom: 'Pack', lotNo: 'L-231015', mfgDate: '2023-10-15', expDate: '2024-10-14', status: 'Submitted', creator: 'Prod. Team A' },
    { id: 2, docNo: 'PD-2310-0002', prodOrder: 'PO-991', sku: 'SKU-8802', name: 'Singha Water 600ml Pack 12', qty: 5000, uom: 'Pack', lotNo: 'L-231015', mfgDate: '2023-10-15', expDate: '2025-10-14', status: 'Received', creator: 'Prod. Team B' },
    { id: 3, docNo: 'PD-2310-0003', prodOrder: 'PO-992', sku: 'SKU-8806', name: 'Chang Beer 320ml Can Pack 24', qty: 1500, uom: 'Carton', lotNo: 'L-231016A', mfgDate: '2023-10-16', expDate: '2024-10-15', status: 'Draft', creator: 'Prod. Team B' },
    { id: 4, docNo: 'PD-2310-0004', prodOrder: 'PO-993', sku: 'SKU-8803', name: 'Mama Tom Yum Shrimp', qty: 800, uom: 'Box', lotNo: 'L-231016B', mfgDate: '2023-10-16', expDate: '2024-04-15', status: 'Submitted', creator: 'Prod. Team A' },
    { id: 5, docNo: 'PD-2310-0005', prodOrder: 'PO-994', sku: 'SKU-8804', name: 'Lays Classic 73g', qty: 1200, uom: 'Carton', lotNo: 'L-231017', mfgDate: '2023-10-17', expDate: '2024-04-16', status: 'Rejected', creator: 'Prod. Team C' },
    { id: 6, docNo: 'PD-2310-0006', prodOrder: 'PO-995', sku: 'SKU-8805', name: 'Sunlight Lemon 500ml', qty: 300, uom: 'Carton', lotNo: 'L-231018', mfgDate: '2023-10-18', expDate: '2026-10-17', status: 'Draft', creator: 'Prod. Team C' },
    { id: 7, docNo: 'PD-2310-0007', prodOrder: 'PO-996', sku: 'SKU-8807', name: 'Oishi Green Tea 500ml', qty: 2000, uom: 'Carton', lotNo: 'L-231019A', mfgDate: '2023-10-19', expDate: '2024-10-18', status: 'Received', creator: 'Prod. Team B' },
    { id: 8, docNo: 'PD-2310-0008', prodOrder: 'PO-996', sku: 'SKU-8807', name: 'Oishi Green Tea 500ml', qty: 500, uom: 'Carton', lotNo: 'L-231019B', mfgDate: '2023-10-19', expDate: '2024-10-18', status: 'Received', creator: 'Prod. Team B' },
    { id: 9, docNo: 'PD-2310-0009', prodOrder: 'PO-997', sku: 'SKU-8808', name: 'Breeze Excel Liquid 700ml', qty: 600, uom: 'Carton', lotNo: 'L-231020', mfgDate: '2023-10-20', expDate: '2026-10-19', status: 'Draft', creator: 'Prod. Team A' },
    { id: 10, docNo: 'PD-2310-0010', prodOrder: 'PO-998', sku: 'SKU-8811', name: 'M-150 Energy Drink', qty: 4000, uom: 'Carton', lotNo: 'L-231021', mfgDate: '2023-10-21', expDate: '2025-10-20', status: 'Submitted', creator: 'Prod. Team C' },
  ]);

  const filteredData = useMemo(() => {
    let result = deliveryList;
    if (activeTab !== 'all') {
      result = result.filter(item => item.status.toLowerCase() === activeTab.toLowerCase());
    }
    return result.filter(item => 
        item.docNo.toLowerCase().includes(search.toLowerCase()) || 
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.lotNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [deliveryList, search, activeTab]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  const handleSaveDelivery = ({ docInfo, items, isNew }: any) => {
      if (isNew) {
          const newIdStart = Date.now();
          const newEntries = items.map((item: any, idx: number) => ({
              ...item,
              ...docInfo,
              id: newIdStart + idx,
              status: 'Draft'
          }));
          setDeliveryList(prev => [...newEntries, ...prev]);
      } else {
          // Edit existing item
          setDeliveryList(prev => prev.map(row => 
              row.id === items[0].id ? { ...items[0], ...docInfo } : row
          ));
      }
  };

  const handleNewDelivery = () => {
      setEditModal({
          isOpen: true,
          data: {
              isNew: true,
              docNo: `PD-${new Date().toISOString().slice(2,4)}${String(new Date().getMonth()+1).padStart(2,'0')}-${String(Math.floor(Math.random() * 9999)).padStart(4,'0')}`,
              prodOrder: '', creator: 'Prod. Team A'
          }
      });
  };

  useEffect(() => {
      if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          if (params.get('action') === 'new-delivery') {
              handleNewDelivery();
              const url = new URL(window.location.href);
              url.searchParams.delete('action');
              window.history.replaceState({}, document.title, url.toString());
          }
      }
  }, []);

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-3 space-y-4">
      
      <EditDeliveryModal 
          isOpen={editModal.isOpen} 
          data={editModal.data} 
          onClose={() => setEditModal({isOpen: false, data: null})} 
          onSave={handleSaveDelivery} 
      />

      <ShareFormModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
      <BatchStatusLogModal isOpen={batchLogModal.isOpen} batchId={batchLogModal.batchId} onClose={() => setBatchLogModal({isOpen: false, batchId: ''})} />

      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#ad2b10] hover:text-white hover:border-[#ad2b10] transition-all duration-500 z-[100] flex flex-col items-center gap-3 group">
          <Icons.HelpCircle size={16} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[10px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5 text-left">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Factory size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      PRODUCTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">DELIVERY</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          นำส่งและรับมอบสินค้าจากฝ่ายผลิต
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full mt-[-2px]">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Pending Submit" value={deliveryList.filter(i=>i.status==='Draft').length} icon="edit-3" colorAccent={THEME.dustyBlue} colorValue={THEME.primary} desc="Draft Deliveries" />
                <KpiCard 
                    label="Wait for Putaway" 
                    value={deliveryList.filter(i=>i.status==='Submitted').length} 
                    icon="clock" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Submitted Docs" 
                />
                <KpiCard 
                    label="Completed Transfer" 
                    value={deliveryList.filter(i=> i.status==='Received').length} 
                    icon="check-circle" colorAccent={THEME.success} colorValue={THEME.primary} desc="Received FG" 
                />
                <KpiCard 
                    label="Rejected Items" 
                    value={deliveryList.filter(i=>i.status==='Rejected').length} 
                    icon="alert-triangle" colorAccent={THEME.danger} colorValue={THEME.primary} desc="Requires fix" 
                />
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                <div className="px-5 py-3 border-b border-[#eaeaec] bg-white flex flex-col xl:flex-row justify-between items-center gap-4">
                    
                    <div className="flex bg-[#f8f9fa] border border-[#eaeaec] rounded-lg p-1 shrink-0">
                        {['all', 'draft', 'submitted', 'received', 'rejected'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-[#212c46] shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 w-full xl:w-auto">
                        <div className="relative w-full xl:w-72">
                            <Icons.Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search Doc, Lot, SKU..." 
                                className="w-full pl-9 pr-4 py-1.5 text-[12px] border border-[#eaeaec] rounded-lg font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                        <button onClick={handleNewDelivery} className="bg-[#133951] text-white px-4 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#b58c4f] hover:text-white transition-all flex items-center gap-1.5 shrink-0 border border-[#133951]">
                            <Icons.Plus size={14} /> NEW DELIVERY
                        </button>
                        <button onClick={() => setShareModalOpen(true)} className="bg-white text-[#133951] px-3 py-1.5 rounded-lg font-black text-[11px] uppercase tracking-widest shadow-sm hover:bg-[#f8f9fa] transition-all flex items-center gap-1.5 shrink-0 border border-[#eaeaec]" title="Share New Delivery Form">
                            <Icons.Share2 size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                    <table className="w-full text-left font-sans border-collapse min-w-[1200px]">
                        <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                            <tr>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">เลขที่เอกสาร & ใบส่งการผลิต</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รายละเอียดสินค้า</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ล็อตผลิต (Lot) / วันหมดอายุ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำนวนส่งมอบ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">สถานะ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">ผู้บันทึก</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                            {currentData.length > 0 ? currentData.map(item => (
                                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                    <td className="py-2.5 px-4 flex flex-col gap-0.5 text-left">
                                        <span className="font-mono font-black text-[#133951] text-[12px]">{item.docNo}</span>
                                        <span className="text-[10px] font-bold text-[#b58c4f] uppercase tracking-widest flex items-center gap-1"><Icons.FileText size={10} /> Ref: {item.prodOrder}</span>
                                    </td>
                                    <td className="py-2.5 px-4 text-left">
                                        <div className="flex flex-col gap-0.5 items-start">
                                            <span className="text-[12px] font-black text-[#212c46] truncate max-w-[250px]" title={item.name}>{item.name}</span>
                                            <span className="text-[10px] font-bold text-[#4d87a8] bg-[#4d87a8]/10 px-1.5 py-0.5 rounded uppercase tracking-widest font-mono">{item.sku}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="font-black text-[#212c46] text-[12px] font-mono">{item.lotNo}</span>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-[#7a8b95] uppercase tracking-widest">
                                                <span title="Mfg Date">M: {item.mfgDate}</span>
                                                <span className="text-[#eaeaec]">|</span>
                                                <span title="Exp Date" className="text-[#ad2b10]">E: {item.expDate}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-right">
                                        <div className="flex justify-end items-center gap-2">
                                            <span className="text-[14px] font-black font-mono text-[#212c46]">{formatNumber(item.qty)}</span>
                                            <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest">{item.uom}</span>
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <span className="text-[11px] font-bold text-[#7a8b95] uppercase tracking-widest"><Icons.User size={12} className="inline mr-1 text-[#3f809e]"/>{item.creator}</span>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex justify-center items-center gap-[1px]">
                                            <button onClick={() => setEditModal({isOpen: true, data: { ...item, readonly: true }})} className="w-8 h-8 rounded-md flex items-center justify-center text-[#7a8b95] hover:bg-[#eaeaec] hover:text-[#212c46] transition-all" title="View Document">
                                                <Icons.Eye size={14} />
                                            </button>
                                            {item.status === 'Draft' && (
                                                <button onClick={() => setEditModal({isOpen: true, data: item})} className="w-8 h-8 rounded-md flex items-center justify-center text-[#3f809e] hover:bg-[#eaeaec] hover:text-[#3f809e] transition-all" title="Edit Document">
                                                    <Icons.Edit size={14} />
                                                </button>
                                            )}
                                            <button onClick={() => setBatchLogModal({isOpen: true, batchId: item.lotNo})} className="w-8 h-8 rounded-md flex items-center justify-center text-[#7a8b95] hover:bg-[#eaeaec] hover:text-[#212c46] transition-all" title="Batch Status Log">
                                                <Icons.History size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                        No delivery documents match your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="px-5 py-2.5 bg-[#f8f9fa] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl text-[12px]">
                    <div className="flex items-center gap-4 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Display:</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} 
                                className="bg-white border border-[#eaeaec] rounded-md px-2 py-0.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm"
                            >
                                {[10, 20, 50, 100].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <p className="bg-white px-2 py-0.5 rounded-md border border-[#eaeaec] shadow-sm font-mono text-black font-bold">Count: {filteredData.length}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1} 
                            className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white active:scale-90 shadow-sm'}`}
                        >
                            <Icons.ChevronLeft size={14}/>
                        </button>
                        <div className="bg-white text-[#212c46] px-3 py-1 rounded-md font-black text-[11px] min-w-[90px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                            Pg {currentPage} / {totalPages}
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
        </div>
      </div>
    </div>
  );
}
