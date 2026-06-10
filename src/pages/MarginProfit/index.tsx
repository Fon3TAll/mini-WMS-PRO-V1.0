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

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(val);

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

const MarginStatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'High Yield': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Healthy': 
      style = { bg: '#3f809e15', color: THEME.skyBlue, border: '#3f809e30' }; 
      break;
    case 'Warning': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Critical': 
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

// 1. Create/Edit Margin Pricing Configuration Modal
function EditMarginModal({ isOpen, onClose, record, onSave }: any) {
    const [tempRecord, setTempRecord] = useState<any>({});

    useEffect(() => {
        if (isOpen && record) {
            setTempRecord(JSON.parse(JSON.stringify(record)));
        }
    }, [isOpen, record]);

    if (!isOpen || !record || !tempRecord) return null;

    // Auto calculate margin when Cost or Price changes
    const calculatedMargin = useMemo(() => {
        const cost = parseFloat(tempRecord.cost) || 0;
        const price = parseFloat(tempRecord.sellingPrice) || 0;
        if (price <= 0) return 0;
        return ((price - cost) / price) * 100;
    }, [tempRecord.cost, tempRecord.sellingPrice]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let status = 'Healthy';
        const target = parseFloat(tempRecord.targetMargin) || 0;
        if (calculatedMargin < target - 5) {
            status = 'Critical';
        } else if (calculatedMargin < target) {
            status = 'Warning';
        } else if (calculatedMargin > target + 15) {
            status = 'High Yield';
        }

        onSave({
            ...tempRecord,
            margin: calculatedMargin,
            status
        });
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.TrendingUp className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">CONFIGURE PRICING COST</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.Barcode size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">SKU ID IDENTIFIER</p>
                            <h4 className="text-[13px] font-black text-[#212c46] leading-none uppercase">{tempRecord.sku}</h4>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Product Description</label>
                        <input 
                            required 
                            type="text"
                            value={tempRecord.description || ''} 
                            onChange={e => setTempRecord({...tempRecord, description: e.target.value})} 
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Product Category</label>
                            <select 
                                value={tempRecord.category || 'Consumer Goods'} 
                                onChange={e => setTempRecord({...tempRecord, category: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Consumer Goods">Consumer Goods</option>
                                <option value="Beverages">Beverages</option>
                                <option value="Fresh Food">Fresh Food</option>
                                <option value="Electronics">Electronics</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Target Margin (%) Override</label>
                            <input 
                                required 
                                type="number"
                                step="0.1"
                                value={tempRecord.targetMargin || ''} 
                                onChange={e => setTempRecord({...tempRecord, targetMargin: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Purchase Price Cost (THB)</label>
                            <input 
                                required 
                                type="number"
                                step="0.01"
                                value={tempRecord.cost || ''} 
                                onChange={e => setTempRecord({...tempRecord, cost: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#a94228] uppercase ml-1">Active Selling Price (THB)</label>
                            <input 
                                required 
                                type="number"
                                step="0.01"
                                value={tempRecord.sellingPrice || ''} 
                                onChange={e => setTempRecord({...tempRecord, sellingPrice: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#a94228]/30 rounded-xl text-[12px] font-black outline-none focus:border-[#a94228] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-[#f8f9fa] rounded-2xl flex justify-between items-center border border-[#eaeaec]">
                        <div>
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase">Calculated Gross Profit Margin</p>
                            <span className="text-[18px] font-black text-[#212c46]">{formatNumber(calculatedMargin)}%</span>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase">Profit Per Unit</p>
                            <span className="text-[16px] font-bold text-[#657f4d]">+{formatNumber((tempRecord.sellingPrice || 0) - (tempRecord.cost || 0))} THB</span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Save Pricing Rules</button>
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
            <h3 className="font-black flex items-center gap-2.5 uppercase tracking-widest text-[#e9d8c0] text-base"><Icons.BookOpen size={18} className="text-[#b7a159]"/> PRICING & MARGIN GUIDE</h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1">Margin Profit Calculator & Rule Setting</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={20}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-5 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.ShieldAlert size={15} className="text-[#b7a159]"/> 1. Profit Margin Formula Controls
            </h4>
            <p className="text-[11px] mb-2">ทำความเข้าใจโครงสร้างการวิเคราะห์ Margin & Profit ในคลังสินค้าซื้อมาขายไป (WMS Buy-Sell):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#eaeaec] shadow-sm">
                  <Icons.TrendingUp size={14} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Gross Margin Formula:</strong> อัตราส่วนกำไรขั้นต้น คำนวณเป็น [(Selling Price - Cost) / Selling Price] x 100</div>
                </li>
                <li className="flex items-start gap-2 bg-[#657f4d]/10 p-2.5 rounded-xl border border-[#657f4d]/30 shadow-sm">
                  <Icons.ArrowUpRight size={14} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#657f4d] font-black">Markup Pricing:</strong> อัตราส่วนบวกเพิ่มต่อต้นทุน คำนวณเป็น [(Selling Price - Cost) / Cost] x 100 เพื่อนำเสนอราคาหน้าเว็บ</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.Settings size={15} className="text-[#d96245]"/> 2. Target Margin Status
            </h4>
            <p className="text-[11px] mb-2">บทวิเคราะห์ระบบจัดกลุ่มสถานภาพกำไรสินค้า (Yield Grading System):</p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
                <li><strong className="text-[#657f4d]">High Yield:</strong> สำหรับกลุ่มสินค้าที่ทำอัตรากำไรสูงเกินเป้าหมายความคาดหวังมากกว่า 15% ขึ้นไป</li>
                <li><strong className="text-[#3f809e]">Healthy:</strong> ผลตอบแทนกำไรบรรลุตามข้อกำหนดและเงื่อนไขเป้าซื้อขายพาร์ทเนอร์</li>
                <li><strong className="text-[#b58c4f]">Warning:</strong> ราคาใกล้เคียงจุดคุ้มทุน ต่ำกว่าเป้าหมายไม่เกิน 5% ควรรีบพิจารณาทำราคาใหม่</li>
                <li><strong className="text-[#932c2e]">Critical:</strong> สินค้าจำหน่ายขาดทุนหรือหักล้างแล้วต่ำกว่าลิมิตขั้นต่ำที่ระบบระบุ</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[12px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#eaeaec] pb-1.5 font-mono">
              <Icons.Lock size={15} className="text-[#3f809e]"/> 3. Configuration Security Flags
            </h4>
            <p className="text-[11px]">คุณสามารถล็อกหรือปลดล็อกข้อกำหนด Margin กติกาจำหน่ายรวมถึงเปิดระบบแจ้งเตือนเมื่อหลุดเกณฑ์เป้าขั้นต่ำได้ทันที</p>
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
export default function MarginProfit() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (Configs / Policies) or 'staff' (Calculations Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom states modeled identically to UserPermissions 
  const [expandedConfigurations, setExpandedConfigurations] = useState<any>({ 'RULE-FMCG': true, 'RULE-BEV': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'RULE-FMCG': false, 'RULE-BEV': false, 'RULE-ELEC': true });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });

  // Interactive Live Calculator fields
  const [calcCost, setCalcCost] = useState<number>(100);
  const [calcSellingPrice, setCalcSellingPrice] = useState<number>(130);
  const [calcTargetMargin, setCalcTargetMargin] = useState<number>(25);

  // Exact 100% original mock examples preserved perfectly
  const [pricingRecords, setPricingRecords] = useState<any[]>([
    { id: 'REC-001', sku: 'SKU-DOVE-450', description: 'Dove Shampoo 450ml', category: 'Consumer Goods', cost: 95, sellingPrice: 135, margin: 29.63, targetMargin: 30, status: 'Warning', date: '2026-06-01' },
    { id: 'REC-002', sku: 'SKU-OISHI-500', description: 'Oishi Green Tea 500ml', category: 'Beverages', cost: 12, sellingPrice: 20, margin: 40.00, targetMargin: 25, status: 'Healthy', date: '2026-06-01' },
    { id: 'REC-003', sku: 'SKU-MEIJI-2L', description: 'Meiji Fresh Milk 2L', category: 'Fresh Food', cost: 72, sellingPrice: 95, margin: 24.21, targetMargin: 20, status: 'Healthy', date: '2026-06-01' },
    { id: 'REC-004', sku: 'SKU-SAMS-S24', description: 'Samsung S24 Ultra', category: 'Electronics', cost: 34500, sellingPrice: 42900, margin: 19.58, targetMargin: 15, status: 'Healthy', date: '2026-06-01' },
    { id: 'REC-005', sku: 'SKU-IPHN-16', description: 'iPhone 16 Pro Max', category: 'Electronics', cost: 41000, sellingPrice: 48900, margin: 16.16, targetMargin: 18, status: 'Warning', date: '2026-06-01' },
    { id: 'REC-006', sku: 'SKU-NEST-750', description: 'Nestle Pure Life 750ml', category: 'Beverages', cost: 4.5, sellingPrice: 10, margin: 55.00, targetMargin: 35, status: 'High Yield', date: '2026-06-01' },
  ]);

  const [marginRules, setMarginRules] = useState<any[]>([
    { id: 'RULE-FMCG', category: 'Consumer Goods', targetMargin: 30.0, minMargin: 25.0, mode: 'Default Target Rule', active: true },
    { id: 'RULE-BEV', category: 'Beverages', targetMargin: 25.0, minMargin: 15.0, mode: 'Volume Incentive', active: true },
    { id: 'RULE-ELEC', category: 'Electronics', targetMargin: 15.0, minMargin: 10.0, mode: 'Fixed Percentage Rule', active: false },
  ]);

  // Live Calculator outputs
  const liveProfit = calcSellingPrice - calcCost;
  const liveMarginPercent = calcSellingPrice > 0 ? (liveProfit / calcSellingPrice) * 100 : 0;
  const liveMarkupPercent = calcCost > 0 ? (liveProfit / calcCost) * 100 : 0;
  const liveVerdict = liveMarginPercent >= calcTargetMargin ? 'PASSED' : 'UNDER TARGET';

  const filteredRecords = useMemo(() => {
    return pricingRecords.filter(item => {
      const matchSearch = item.description.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase()) ||
                          item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pricingRecords, search, statusFilter]);

  const currentData = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedConfigurations((prev: any) => ({ ...prev, [id]: !prev[id] }));

  // KPI Calculations
  const averageMargin = pricingRecords.reduce((acc, p) => acc + p.margin, 0) / pricingRecords.length;
  const warningCount = pricingRecords.filter(p => p.status === 'Warning' || p.status === 'Critical').length;
  const criticalCount = pricingRecords.filter(p => p.status === 'Critical').length;

  const savePricingRecord = (savedData: any) => {
    setPricingRecords(prev => {
      const exists = prev.find(item => item.sku === savedData.sku);
      if (exists) {
        return prev.map(item => item.sku === savedData.sku ? { ...item, ...savedData } : item);
      } else {
        return [savedData, ...prev];
      }
    });
  };

  const handleCreateNewManual = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const newRecord = {
      id: `REC-${randomNum}`,
      sku: `SKU-RAND-${randomNum}`,
      description: 'Brand New Pricing Sample',
      category: 'Consumer Goods',
      cost: 100,
      sellingPrice: 150,
      margin: 33.3,
      targetMargin: 30,
      status: 'Healthy',
      date: new Date().toISOString().split('T')[0]
    };
    setEditModal({ isOpen: true, data: newRecord });
  };

  const handleAddFromCalculator = () => {
    const randomNum = Math.floor(Math.random() * 90) + 10;
    const isWarning = liveMarginPercent < calcTargetMargin;
    const isCritical = liveMarginPercent < calcTargetMargin - 10;
    const isHighYield = liveMarginPercent > calcTargetMargin + 15;
    
    let status = 'Healthy';
    if (isCritical) status = 'Critical';
    else if (isWarning) status = 'Warning';
    else if (isHighYield) status = 'High Yield';

    const newRecord = {
      id: `REC-CALC-${randomNum}`,
      sku: `SKU-CALC-${randomNum}`,
      description: `Calculated SKU No.${randomNum}`,
      category: 'Consumer Goods',
      cost: calcCost,
      sellingPrice: calcSellingPrice,
      margin: liveMarginPercent,
      targetMargin: calcTargetMargin,
      status: status,
      date: new Date().toISOString().split('T')[0]
    };

    setPricingRecords(prev => [newRecord, ...prev]);
    setActiveTab('staff'); // Switch to calculations log tab
  };

  const handleDeleteRecord = (sku: string) => {
    setPricingRecords(prev => prev.filter(item => item.sku !== sku));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditMarginModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} record={editModal.data} onSave={savePricingRecord} />

      {/* HEADER SECTION */}
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
                      MARGIN & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PROFIT CALC</span> NODE
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      PORTFOLIO PRICING RULES, UNIT ECONOMICS & MARKUP ANALYSIS
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Margins Config
                  </button>
                  <button onClick={() => setActiveTab('staff')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.FileSpreadsheet className="text-[#b58c4f]" size={16} /> Unit Calculations
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Average Gross Margin" value={`${formatNumber(averageMargin)}%`} icon="trending-up" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Portfolio Average" />
                <KpiCard label="Margin Warnings" value={warningCount} icon="alert-triangle" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Below Target Level" />
                <KpiCard label="Critical Deficit items" value={criticalCount} icon="shield-alert" colorAccent={THEME.danger} colorValue={THEME.danger} desc="Instant Revision Required" />
                <KpiCard label="Pricing Verified" value="100.0%" icon="shield-check" colorAccent={THEME.success} colorValue={THEME.success} desc="WMS Synced" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ACCESS/ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                            <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4"><Icons.Layers size={18} className="text-[#b7a159]" /> MARGIN DEVIATION</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">Auto Threshold Check</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">ระบบประเมินค่า margin อัตโนมัติจากใบวางบิลและ PO สั่งซื้อคลังสินค้า หากพบคู่ SKU กำไรเฉลี่ยเกินเป้า จะเปิดไฟเขียว (High Yield Mode)</p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">Strict Deficit Flag</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">ปลดสิทธิ์แก้ไขราคาอัตโนมัติหากสินค้าตั้งต่ำกว่าลิมิต 10% (Critical) เพื่อรักษาผลประกอบการรวมของพาร์ทเนอร์</p>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE COMPACT QUICK CALC PANEL */}
                        <div className="bg-[#212c46] p-5 rounded-3xl shadow-lg border border-[#1d2636] text-white text-left animate-fadeIn">
                            <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9d8c0] flex items-center gap-2 border-b border-white/20 pb-2 mb-4"><Icons.Calculator size={18} className="text-[#b7a159]"/> LIVE ECONOMIC SIMULATOR</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">PURCHASE COST (THB)</label>
                                    <input 
                                        type="number" 
                                        value={calcCost}
                                        onChange={e => setCalcCost(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">SELLING PRICE (THB)</label>
                                    <input 
                                        type="number" 
                                        value={calcSellingPrice}
                                        onChange={e => setCalcSellingPrice(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">TARGET MARGIN GOAL (%)</label>
                                    <input 
                                        type="number" 
                                        value={calcTargetMargin}
                                        onChange={e => setCalcTargetMargin(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 mt-4 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total Profit Margin:</span>
                                        <span className="font-black text-white">{formatNumber(liveMarginPercent)}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Cost Markup Rate:</span>
                                        <span className="font-black text-[#b7a159]">{formatNumber(liveMarkupPercent)}% Markup</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Profit Per Unit:</span>
                                        <span className="font-black text-[#657f4d]">+{formatNumber(liveProfit)} THB</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                                        <span className="text-[9px] font-black uppercase text-gray-400">EVAL VERDICT:</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${liveVerdict === 'PASSED' ? 'bg-[#657f4d]' : 'bg-[#932c2e]'}`}>{liveVerdict}</span>
                                    </div>
                                </div>

                                <button onClick={handleAddFromCalculator} className="w-full bg-[#b58c4f] hover:bg-[#b7a159] text-[#212c46] font-black text-[11px] uppercase tracking-widest py-2 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-1">
                                    <Icons.PlusCircle size={15}/> Register Calculated SKU
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CONFIGURATION STANDARD REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.Sliders size={20} className="text-[#b7a159]"/> GLOBAL MARGIN CONFIG RULE REGISTER</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Category Pricing Rule
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {marginRules.map(rule => (
                                <div key={rule.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.DollarSign size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{rule.category} Ruleset</span>
                                                    <button onClick={() => toggleExpand(rule.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedConfigurations[rule.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[rule.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>Pricing Flag {confidentialityMap[rule.id] ? 'Restricted Lock' : 'Active Public'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(rule.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[rule.id] ? "Unlock Public Allocation Limit" : "Lock / RESTRICT Area Policy"}
                                            >
                                                {confidentialityMap[rule.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedConfigurations[rule.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#7a8b95] uppercase font-black text-[9px] mb-1">TARGET COOP MARGIN</p>
                                                    <p className="font-bold text-[#212c46] uppercase">{rule.targetMargin}% Threshold</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">STRICT FLOATING LIMIT</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{rule.minMargin}% Minimum</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Evaluation Mechanism:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">{rule.mode}</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Policy State:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white bg-[#657f4d]`}>
                                                        WMS Active
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
                /* AUDIT LOG TAB - High Performance Table */
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#b7a159] transition-colors">
                                <Icons.Filter size={14} className="text-[#7a8b95]" />
                                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Yield Status</option>
                                    <option value="High Yield">High Yield</option>
                                    <option value="Healthy">Healthy</option>
                                    <option value="Warning">Warning</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export Margin Report
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search SKU, Product Name..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10 text-left">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสสินค้า (SKU)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รายละเอียดชื่อสินค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">กลุ่มหมวดหมู่สินค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ต้นทุนสินค้า (บาท)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ราคาจำหน่าย (บาท)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">อัตรากำไรขั้นต้น (%)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะคงคลัง</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center font-bold">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.sku} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.sku}</td>
                                        <td className="py-2.5 px-4">
                                            <div className="font-black text-[#212c46] text-[12px] uppercase">{item.description}</div>
                                            <div className="text-[10px] font-bold text-[#7a8b95]">Entry Timestamp: {item.date}</div>
                                        </td>
                                        <td className="py-2.5 px-4 font-bold text-[#ad2b10] text-[12px] uppercase">{item.category}</td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#7a8b95] text-[12px]">{formatNumber(item.cost)}</td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#212c46] text-[12px]">{formatNumber(item.sellingPrice)}</td>
                                        <td className="py-2.5 px-4 text-right font-black text-[#212c46] text-[12px] flex items-center justify-end gap-1">
                                            <span style={{ color: item.margin >= item.targetMargin ? THEME.success : THEME.danger }}>
                                                {formatNumber(item.margin)}%
                                            </span>
                                            <span className="text-[9px] font-bold text-gray-400"> (Tgt {item.targetMargin}%)</span>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <MarginStatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setEditModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#212c46] hover:bg-[#212c46] hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Edit Pricing Strategy"
                                                >
                                                    <Icons.Edit3 size={15} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRecord(item.sku)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#932c2e] hover:bg-[#932c2e] hover:text-white transition-all shadow-sm active:scale-95"
                                                    title="Delete SKU"
                                                >
                                                    <Icons.Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[#7a8b95] font-black uppercase text-[12px] tracking-widest bg-gray-50/50">No Pricing Calculation found</td>
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
                                    className="bg-white border border-[#cdd4d6] rounded-md px-2 py-1 outline-none font-black text-[#444d4c] cursor-pointer shadow-sm focus:border-[#bf8c24]"
                                >
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-3 py-1 rounded-md border border-[#cdd4d6] shadow-sm">Total Records: {filteredRecords.length}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className={`w-8 h-8 border border-[#cdd4d6] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white active:bg-black active:text-white shadow-sm active:scale-90'}`}
                            >
                                <Icons.ChevronLeft size={14}/>
                            </button>
                            <div className="bg-white text-[#212c46] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center uppercase tracking-widest border border-[#cdd4d6] shadow-sm">
                                Page {currentPage} / {totalPages}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className={`w-8 h-8 border border-[#cdd4d6] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white active:bg-black active:text-white shadow-sm active:scale-90'}`}
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
