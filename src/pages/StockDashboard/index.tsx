import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, PieChart, Pie, Cell, Treemap } from 'recharts';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { useLanguage } from '../../context/LanguageContext';
import SafetyStockCalc from './components/SafetyStockCalc';
import RMCostAnalysis from './components/RMCostAnalysis';
import StockMovementHistory, { AuditLog } from './components/StockMovementHistory';

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

// --- KPI Card Components (Sleek Compact Lean Padding) ---
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
            <p className="text-[18px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
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
    case 'Healthy': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Near Expiry': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Dead Stock': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
    case 'Out of Stock': 
      style = { bg: '#7a8b9515', color: THEME.indigo, border: '#7a8b9530' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, payload, onNodeClick } = props;

  if (!payload || !width || !height) return null;

  // We only render text if the block is large enough
  return (
    <g onClick={() => onNodeClick && onNodeClick(payload)} className="cursor-pointer">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: payload.color || '#8884d8',
          stroke: '#fff',
          strokeWidth: 2,
          strokeOpacity: 1,
        }}
        className="transition-all hover:opacity-90 cursor-pointer"
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + 10}
            y={y + 20}
            fill="#fff"
            fontSize={12}
            fontWeight="black"
            fillOpacity={0.9}
            className="tracking-widest"
          >
            {payload.id}
          </text>
          {height > 60 && (
            <text
              x={x + 10}
              y={y + 38}
              fill="#fff"
              fontSize={10}
              fillOpacity={0.8}
              className="font-bold truncate"
            >
              {payload.zone && payload.zone.split(':')[0]}
            </text>
          )}
          {height > 80 && (
            <text
              x={x + 10}
              y={y + height - 12}
              fill="#fff"
              fontSize={18}
              fontWeight="black"
              fillOpacity={0.95}
            >
              {payload.density}%
            </text>
          )}
        </>
      )}
    </g>
  );
};

const HeatmapTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        // In recharts Treemap, the root might be the payload, we need to handle it.
        if (!data || data.root) return null; 
        return (
            <div className="bg-[#212c46] border-none text-white text-[11px] font-bold p-3 rounded-xl shadow-lg z-50">
                <p className="text-[12px] mb-2 font-black tracking-widest">{data.id} <span className="opacity-70 font-normal">|</span> {data.zone}</p>
                <div className="space-y-1">
                    <p className="text-[#eaeaec] flex items-center justify-between gap-4"><span>Density</span> <span className="text-[14px] font-black text-white">{data.density}%</span></p>
                    <p className="text-[#eaeaec] flex items-center justify-between gap-4"><span>Status</span> <span className="uppercase tracking-widest text-[#b7a159]">{data.status}</span></p>
                </div>
            </div>
        );
    }
    return null;
};

// --- Modals & User Guides ---

// 1. Detailed User Guide Panel (Meticulously Detailed with Tight Lean Padding)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> STOCK DASHBOARD SYSTEM GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Inventory Tracking, Zone Safety, and Allocation Policies</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. Warehouse Zones & Access Restrictions
            </h4>
            <p className="text-[11px] mb-2">ระบบคลังสินค้าแบ่งโซนจัดเก็บตามคุณลักษณะและอุณหภูมิ เพื่อป้องกันความเสียหายของสินค้าและเพิ่มความรวดเร็วในการจัดเตรียมสินค้า (Smart Slotting Alignment):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Eye size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Public Zones:</strong> โซนกระจายสินค้าปรกติ เปิดให้พนักงานเบิกหยิบสินค้าทั่วไปตามใบสั่งจ้างมาตรฐาน (Picking Execution standard)</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2.5 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Rack Allocation:</strong> โซนล็อกสินค้าและควบคุมอุณหภูมิ (เช่น Cold Chain, High-Value Rack) ที่กำหนดความเร็วสูงสุดของการเข้าถึงและสงวนสิทธิ์การสแกนเข้าถึงแก่เจ้าหน้าที่ระดับผู้ดูแลเฉพาะกลุ่ม</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Award size={13} className="text-[#d96245]"/> 2. Safety stock floor thresholds
            </h4>
            <p className="text-[11px] mb-2">มาตรฐานการควบคุมปริมาณสินค้าคงคลังสำรองเพื่อความปลอดภัยจัดจำหน่าย (Safety Inventory Target Floor) ป้องกันสินค้าขาดแคลน:</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong className="text-[#657f4d]">Healthy Stock (ระดับปกติ):</strong> ปริมาณสะสมเพียงพอต่อคำสั่งซื้อ (SOH สูงกว่าระดับ Safety Threshold ที่ระบุไว้รายโซน)</li>
                <li><strong className="text-[#b58c4f]">Near Expiry Alert:</strong> แจ้งเตือนสัญลักษณ์เมื่อสินค้าจัดเก็บในลักษณะระบุวันหมดอายุใกล้ล่วงลับ 30-90 วัน</li>
                <li><strong className="text-[#932c2e]">Dead Stock Detection:</strong> สำหรับกลุ่มสินค้าที่ขาดการเบิกจ่ายเคลื่อนไหว (No Inbound/Outbound records) เกิน 180 วัน ระบบจะทำสัญลักษณ์แจ้งเตือนเพื่อเคลียร์พื้นที่แร็ตตอง</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.RefreshCw size={13} className="text-[#3f809e]"/> 3. Live Inventory Synchronization & Cycle Count
            </h4>
            <p className="text-[11px]">การตั้งค่า Safety Stock Limits และการเปลี่ยนแปลงระดับความปลอดภัยโซนในหน้านี้จะทำการประสานข้อมูลตรงประสานงานหน้า Dynamic Sidebar และศูนย์อัพเดทสต๊อกกลางแบบ Real-time เจ้าหน้าที่เบิกจ่ายสามารถส่องตรวจสอบความถูกต้องการนับได้ทันที</p>
          </section>
        </div>
        
        <div className="p-2 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// 2. Compact Adjust Stock Modal Wrapped in DraggableModal System
function AdjustStockModal({ isOpen, onClose, data, onSave }: any) {
    const [adjustQty, setAdjustQty] = useState<number>(0);
    const [adjType, setAdjType] = useState<string>('add');
    const [reason, setReason] = useState<string>('Cycle Count Adjustment');
    const [remarks, setRemarks] = useState<string>('');

    useEffect(() => {
        if (isOpen && data) {
            setAdjustQty(0);
            setAdjType('add');
            setReason('Cycle Count Adjustment');
            setRemarks('');
        }
    }, [isOpen, data]);

    if (!isOpen || !data) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const diff = adjType === 'add' ? adjustQty : -adjustQty;
        const finalSoh = Math.max(0, data.soh + diff);
        onSave({ ...data, soh: finalSoh }, diff, reason, remarks);
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[450px]"
            title={
                <div className="flex items-center gap-3 text-left">
                    <Icons.Scale className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[12px] uppercase tracking-widest leading-none">CYCLE ADJUSTMENT: {data.sku}</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center justify-between">
                        <div>
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase leading-none mb-1">SKU identifier</p>
                            <h4 className="text-[12px] font-black text-[#212c46] leading-none uppercase">{data.sku}</h4>
                            <p className="text-[10px] font-semibold text-[#615e65] mt-1 truncate max-w-[200px]">{data.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-[#7a8b95] uppercase leading-none mb-1">Current SOH</p>
                            <span className="text-[14px] font-black text-[#212c46] font-mono">{formatNumber(data.soh)} Units</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1 block">Adjustment Direction</label>
                            <select 
                                value={adjType} 
                                onChange={e => setAdjType(e.target.value)} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46] shadow-sm cursor-pointer"
                            >
                                <option value="add">Add Quantity (+)</option>
                                <option value="deduct">Deduct Quantity (-)</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1 block">Difference In Units</label>
                            <input 
                                required 
                                type="number"
                                min="0"
                                value={adjustQty || ''} 
                                onChange={e => setAdjustQty(parseInt(e.target.value) || 0)} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46] shadow-sm" 
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1 block">Reason Code</label>
                        <select 
                            value={reason} 
                            onChange={e => setReason(e.target.value)} 
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46] shadow-sm cursor-pointer"
                        >
                            <option value="Cycle Count Adjustment">Cycle Count Adjustment</option>
                            <option value="Damaged Goods">Damaged Goods</option>
                            <option value="Found Stock">Found Stock (Excess)</option>
                            <option value="Expiry Write-off">Expiry Write-off (Expired)</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1 block">Audit Note / Remarks</label>
                        <textarea 
                            value={remarks}
                            onChange={e => setRemarks(e.target.value)}
                            rows={3}
                            placeholder="Describe adjustment background..."
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-medium outline-none focus:border-[#4d87a8] text-[#212c46] shadow-sm resize-none"
                        />
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Post Stock Balance</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// 3. Stock Detail Modal in Draggable Modal System
function StockDetailModal({ isOpen, onClose, data, onPrintTag }: any) {
  if (!isOpen || !data) return null;
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#181010]/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[620px] flex flex-col overflow-hidden relative border border-white/60">
        <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-[#1b2826]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
              <Icons.Package size={20} className="text-[#b7a159]" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-white uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">PRODUCT LEDGER</h3>
              <span className="text-[9px] font-black text-[#b7a159] bg-[#b7a159]/20 px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#b7a159]/30 drop-shadow-sm">{data.sku}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#e9d8c0]/70 hover:text-white"><Icons.X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f3e2d1]/5 text-left font-sans">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-12 space-y-4">
              <div>
                <label className="text-[9px] font-black text-[#a3a092] uppercase tracking-widest">Description</label>
                <div className="text-[16px] font-black text-[#181010] uppercase mt-1 leading-snug">{data.name}</div>
                <div className="text-[11px] font-bold text-[#615e65] mt-1.5">Asset Category: <span className="text-[#b58c4f] font-black uppercase">{data.category}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="flex items-center gap-2 text-[9px] font-black text-[#a3a092] uppercase mb-1.5"><Icons.MapPin size={12}/> Storage Location</div>
                  <div className="text-[12px] font-black text-[#212c46]">{data.zone}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="flex items-center gap-2 text-[9px] font-black text-[#a3a092] uppercase mb-1.5"><Icons.Clock size={12}/> Last Inventory Scan</div>
                  <div className="text-[12px] font-black text-[#212c46]">{data.lastMove}</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2"><Icons.Scale size={14} className="text-[#b58c4f]"/> SKU Ledger Details</h4>
                  <span className="text-[10px] font-bold text-[#657f4d] uppercase font-mono">Real-time Match</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] border-b border-[#eaeaec]/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[#615e65] font-semibold">Unit Base Cost</span>
                    <span className="font-mono font-black text-[#212c46]">{formatCurrency(data.unitPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] border-b border-[#eaeaec]/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[#615e65] font-semibold">Total Stock on Hand (SOH)</span>
                    <span className="font-mono font-black text-[#1b2826]">{formatNumber(data.soh)} Units</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-dashed border-[#eaeaec]/60">
                    <span className="text-[#615e65] font-semibold">Calculated Book Value (THB)</span>
                    <span className="font-mono font-extrabold text-[#657f4d] text-[13px]">{formatCurrency(data.soh * data.unitPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#eaeaec] flex justify-between items-center shrink-0 font-sans">
          <button onClick={onClose} className="px-5 py-2 bg-[#f3f3f1] border border-[#eaeaec] text-[#615e65] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
          <div className="flex gap-2">
            <button onClick={() => onPrintTag(data)} className="px-4 py-2 bg-white border border-[#eaeaec] text-[#212c46] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#f9fafb] transition-all flex items-center gap-1.5 shadow-sm"><Icons.Printer size={14} /> Tag</button>
            <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-slate-700 transition-all flex items-center gap-1.5">
                <Icons.CheckCircle2 size={14} /> Acknowledge Ledg.
            </button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
}

function HeatmapDetailModal({ isOpen, onClose, zoneData }: any) {
    if (!isOpen || !zoneData) return null;

    // Generate some mock SKU items for this zone
    const mockItems = useMemo(() => {
        const count = Math.max(3, Math.floor(Math.random() * 8));
        return Array.from({ length: count }).map((_, i) => ({
            id: `SKU-${zoneData.id}-${Math.floor(Math.random() * 9000) + 1000}`,
            name: `Storage Item ${String.fromCharCode(65 + i)}`,
            qty: Math.floor(Math.random() * 500) + 50,
            status: Math.random() > 0.8 ? 'Low Stock' : 'Active'
        }));
    }, [zoneData.id]);

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            customHeader={
                <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159] w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                            <Icons.Package size={20} className="text-[#b7a159]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none font-sans">STORAGE ZONE DETAILS</h3>
                            <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 font-mono">NODE: {zoneData.id} • {zoneData.zone}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg text-white/55 hover:text-white hover:bg-white/10 transition-colors"><Icons.X size={18}/></button>
                </div>
            }
        >
            <div className="p-6 bg-white font-sans text-[#414757]">
                <div className="flex gap-4 items-center mb-6 border border-[#eaeaec] bg-[#f8f9fa] rounded-2xl p-4 shadow-sm">
                    <div className="flex-1">
                        <div className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider mb-1">Density Utilization</div>
                        <div className="text-2xl font-black text-[#212c46] tracking-tighter">{zoneData.density}%</div>
                    </div>
                    <div className="w-px h-10 bg-[#d7d7d7]/50 block"></div>
                    <div className="flex-1">
                        <div className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider mb-1">Status</div>
                        <div className="text-sm font-black text-[#b7a159] uppercase tracking-widest">{zoneData.status}</div>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2 mb-3 border-b border-[#eaeaec] pb-2">
                        <Icons.List size={14} className="text-[#3f809e]" /> INVENTORY LEDGER (SKUs)
                    </h4>
                    <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {mockItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-3 border border-[#eaeaec] rounded-xl hover:border-[#b58c4f] transition-all bg-white shadow-sm">
                                <div>
                                    <div className="text-[11px] font-black tracking-widest font-mono text-[#212c46]">{item.id}</div>
                                    <div className="text-[10px] font-bold text-[#7a8b95] mt-0.5">{item.name}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[13px] font-black text-[#657f4d]">{item.qty} <span className="text-[9px] font-bold text-[#7a8b95]">PCS</span></div>
                                    <div className={`text-[9px] font-black uppercase tracking-widest mt-0.5 ${item.status === 'Low Stock' ? 'text-[#932c2e]' : 'text-[#4d87a8]'}`}>{item.status}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 font-sans">
                <button onClick={onClose} className="bg-[#212c46] text-white px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all">Close Panel</button>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function StockDashboard() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' or 'zone_settings' (Identical to UserPermissions Settings Registry Tab standards)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [printingLabel, setPrintingLabel] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState<string>('All'); // 'All' | 'FG' | 'RM'
  const [chartViewMode, setChartViewMode] = useState<'level' | 'turnover' | 'velocity' | 'trend30d' | 'heatmap' | 'performance' | 'fgTrend'>('level');
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);
  const [selectedHeatmapZone, setSelectedHeatmapZone] = useState<any>(null);
  const [isHeatmapModalOpen, setIsHeatmapModalOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsChartFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom Zone standard expansion & confidentiality state (identical to UserPermissions state structure)
  const [expandedZones, setExpandedZones] = useState<any>({ 'ZONE-A': true, 'ZONE-B': true, 'ZONE-C': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'ZONE-A': false, 'ZONE-B': false, 'ZONE-C': false, 'COLD-RM': true });

  const [tooltipData, setTooltipData] = useState<{ x: number, y: number, text: string, type: 'in' | 'out' } | null>(null);

  const handleTooltipClick = (e: React.MouseEvent, text: string, type: 'in' | 'out') => {
      e.stopPropagation();
      if (tooltipData && tooltipData.text === text) {
          setTooltipData(null);
      } else {
           const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
           setTooltipData({ x: rect.left - 100, y: rect.bottom + window.scrollY, text, type });
      }
  };

  useEffect(() => {
      const closeTooltip = () => setTooltipData(null);
      document.addEventListener('click', closeTooltip);
      return () => document.removeEventListener('click', closeTooltip);
  }, []);

  // 100% Exact original mock examples preserved perfectly & expanded with Raw Materials
  const [inventoryList, setInventoryList] = useState<any[]>([
    { id: 1, sku: 'SKU-8801', name: 'Nescafe Red Cup 380g (เนสกาแฟ)', category: 'Beverage', soh: 15200, unitPrice: 120, status: 'Healthy', zone: 'Zone A - Rack 01', lastMove: '2026-05-01', minStock: 12000, planIn: 8000, planInDetails: 'PRD-2606-001 (Production Line A)', planOut: 5000, planOutDetails: 'SO-2606-001 (BigC Delivery)', type: 'FG' },
    { id: 2, sku: 'SKU-8802', name: 'Singha Water 600ml Pack 12', category: 'Beverage', soh: 450, unitPrice: 55, status: 'Near Expiry', zone: 'Zone A - Rack 12', lastMove: '2026-04-20', minStock: 2500, planIn: 3000, planInDetails: 'PRD-2606-002 (Production Line B)', planOut: 200, planOutDetails: 'SO-2606-008 (Lotus)', type: 'FG' },
    { id: 3, sku: 'SKU-8803', name: 'Mama Tom Yum Shrimp (มาม่า)', category: 'Food', soh: 0, unitPrice: 15, status: 'Out of Stock', zone: 'Zone B - Rack 05', lastMove: '2026-05-05', minStock: 5000, planIn: 10000, planInDetails: 'PRD-2606-005', planOut: 2000, planOutDetails: 'SO-2605-012', type: 'FG' },
    { id: 4, sku: 'SKU-8804', name: 'Lays Classic 73g (เลย์)', category: 'Food', soh: 8500, unitPrice: 30, status: 'Healthy', zone: 'Zone B - Rack 08', lastMove: '2026-05-06', minStock: 4000, planIn: 0, planInDetails: '-', planOut: 1500, planOutDetails: 'SO-2606-009', type: 'FG' },
    { id: 5, sku: 'SKU-8805', name: 'Sunlight Lemon 500ml', category: 'Household', soh: 120, unitPrice: 45, status: 'Dead Stock', zone: 'Zone C - Rack 22', lastMove: '2025-11-10', minStock: 500, planIn: 0, planInDetails: '-', planOut: 0, planOutDetails: '-', type: 'FG' },
    { id: 6, sku: 'SKU-8806', name: 'Chang Beer 320ml Can Pack 24', category: 'Beverage', soh: 4200, unitPrice: 750, status: 'Healthy', zone: 'Zone A - Rack 03', lastMove: '2026-05-05', minStock: 2000, planIn: 1000, planInDetails: 'PRD-2605-110', planOut: 800, planOutDetails: 'SO-2606-110', type: 'FG' },
    { id: 7, sku: 'SKU-8807', name: 'Oishi Green Tea 500ml', category: 'Beverage', soh: 800, unitPrice: 20, status: 'Near Expiry', zone: 'Zone A - Rack 15', lastMove: '2026-03-12', minStock: 500, planIn: 0, planInDetails: '-', planOut: 450, planOutDetails: 'SO-2606-005', type: 'FG' },
    { id: 8, sku: 'SKU-8808', name: 'Breeze Excel Liquid 700ml', category: 'Household', soh: 3100, unitPrice: 79, status: 'Healthy', zone: 'Zone C - Rack 01', lastMove: '2026-05-04', minStock: 1000, planIn: 500, planInDetails: 'PRD-2605-001', planOut: 1500, planOutDetails: 'SO-2605-001', type: 'FG' },
    { id: 9, sku: 'SKU-8809', name: 'Carnation Condensed Milk', category: 'Food', soh: 15000, unitPrice: 22, status: 'Healthy', zone: 'Zone B - Rack 10', lastMove: '2026-05-06', minStock: 5000, planIn: 8000, planInDetails: 'PRD-2606-088', planOut: 12000, planOutDetails: 'SO-2605-115', type: 'FG' },
    { id: 10, sku: 'SKU-8810', name: 'Old Factory Promo T-Shirt', category: 'Apparel', soh: 50, unitPrice: 99, status: 'Dead Stock', zone: 'Zone Z - Rack 99', lastMove: '2024-08-15', minStock: 0, planIn: 0, planInDetails: '-', planOut: 0, planOutDetails: '-', type: 'FG' },
    { id: 11, sku: 'SKU-8811', name: 'M-150 Energy Drink', category: 'Beverage', soh: 25000, unitPrice: 10, status: 'Healthy', zone: 'Zone A - Rack 02', lastMove: '2026-05-06', minStock: 15000, planIn: 0, planInDetails: '-', planOut: 5000, planOutDetails: 'SO-2606-020', type: 'FG' },
    { id: 12, sku: 'SKU-8812', name: 'KFC Frozen French Fries 2kg', category: 'Frozen', soh: 15, unitPrice: 150, status: 'Near Expiry', zone: 'Cold Room 1', lastMove: '2026-04-25', minStock: 100, planIn: 200, planInDetails: 'PRD-2605-055', planOut: 10, planOutDetails: 'SO-2606-041', type: 'FG' },
    
    // Raw Materials perfect alignment
    { id: 13, sku: 'RM-PKG-001', name: 'Corrugated Box C-Flute 30x40x20', category: 'Packaging', soh: 12500, unitPrice: 15, status: 'Healthy', zone: 'Zone C - Rack 05', lastMove: '2026-06-01', minStock: 5000, planIn: 2000, planInDetails: 'PO-2606-001 (Thai Packaging)', planOut: 5000, planOutDetails: 'WO-2606-001', type: 'RM' },
    { id: 14, sku: 'RM-ING-101', name: 'Refined Sugar 50Kg Bag', category: 'Ingredient', soh: 1450, unitPrice: 120, status: 'Near Expiry', zone: 'Zone B - Rack 11', lastMove: '2026-05-30', minStock: 1500, planIn: 1000, planInDetails: 'PO-2605-002', planOut: 200, planOutDetails: 'WO-2605-010', type: 'RM' },
    { id: 15, sku: 'RM-CHEM-50', name: 'Caustic Soda 98% (NaOH)', category: 'Chemical', soh: 450, unitPrice: 350, status: 'Healthy', zone: 'Zone Z - Rack 22', lastMove: '2026-05-15', minStock: 200, planIn: 0, planInDetails: '-', planOut: 50, planOutDetails: 'WO-CHEM-01', type: 'RM' },
    { id: 16, sku: 'RM-ING-105', name: 'Cocoa Powder Premium 25Kg', category: 'Ingredient', soh: 1000, unitPrice: 850, status: 'Healthy', zone: 'Zone B - Rack 12', lastMove: '2026-05-01', minStock: 500, planIn: 800, planInDetails: 'PO-2605-110', planOut: 300, planOutDetails: 'WO-2606-008', type: 'RM' },
  ]);

  // Standard Zone Safety Configurations modeled after UserPermissions Module Configurations
  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'ZONE-A', name: 'Zone A (Beverage Rack)', safetyStockFloor: 1000, activeAllocation: true, isConfidential: false, description: 'อัครคลังสินค้ากลุ่มเครื่องดื่ม ตรวจสอบ SOH ตลอด' },
    { id: 'ZONE-B', name: 'Zone B (Dry Food Rack)', safetyStockFloor: 1500, activeAllocation: true, isConfidential: false, description: 'โซนคลังอาหารแห้งและกึ่งสำเร็จรูป บำรุงรักษาอุณหภูมิห้องมาตรฐาน' },
    { id: 'ZONE-C', name: 'Zone C (Household Goods Room)', safetyStockFloor: 500, activeAllocation: true, isConfidential: false, description: 'โซนจัดหมวดเคมีภัณฑ์ทำความสะอาด ของใช้ในบ้าน ปลอดจากจุดสัมผัสอาหาร' },
    { id: 'COLD-RM', name: 'Cold Storage Room (Frozen)', safetyStockFloor: 100, activeAllocation: false, isConfidential: true, description: 'ห้องควบคุมการแช่แข็งอุณหภูมิพิเศษ ล็อกสิทธิ์เบิกจ่ายผ่าน RFID เท่านั้น' }
  ]);

  const [detailModal, setDetailModal] = useState<any>({ isOpen: false, data: null });
  const [adjustModal, setAdjustModal] = useState<any>({ isOpen: false, data: null });

  // --- Toast notification state & handlers ---
  interface ToastNotify {
    id: string;
    type: 'critical' | 'warning' | 'success';
    title: string;
    message: string;
    sku: string;
    timestamp: string;
  }
  const [toasts, setToasts] = useState<ToastNotify[]>([]);

  const triggerToast = (title: string, message: string, type: 'critical' | 'warning' | 'success' = 'warning', sku: string = '') => {
    const newToast: ToastNotify = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      title,
      message,
      sku,
      timestamp: new Date().toLocaleTimeString()
    };
    setToasts(prev => [newToast, ...prev]);
    // Auto remove after 8 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 8000);
  };

  // Dedicated Stock Discrepancy Verification Handler
  const checkStockDiscrepancies = (log: AuditLog, updatedList?: any[]) => {
    const list = updatedList || inventoryList;
    const item = list.find(x => x.sku === log.sku);

    if (log.changeType && (
      log.changeType.toLowerCase().includes('write-off') ||
      log.changeType.toLowerCase().includes('damaged') ||
      log.changeType.toLowerCase().includes('obsolete') ||
      log.changeType.toLowerCase().includes('dispose') ||
      log.changeType.toLowerCase().includes('disposal')
    )) {
      triggerToast(
        t('ตรวจพบรายการหักยอดความชำรุด (Critical Disposal)', 'CRITICAL DISPOSAL & WRITE-OFF DETECTED'),
        `${log.itemName} (${log.sku}) ได้รับการปรับยอดลดลง -${Math.abs(log.qtyChange)} ยูนิต เนื่องจากเป็นสินค้าเสียหาย/พ้นสภาพ โดย ${log.user}`,
        'critical',
        log.sku
      );
      return;
    }

    if (item) {
      if (item.soh <= 0) {
        triggerToast(
          t('สินค้าหมดสต๊อกระดับวิกฤต (Critical Out of Stock)', 'CRITICAL OUT OF STOCK'),
          `${item.name} (${item.sku}) ขาดแคลนสะสมในระบบ คลังเหลือยอด SOH เป็น 0 ยูนิต! โปรดออกใบส่งพัสดุด่วนเติมสต๊อกทันที`,
          'critical',
          item.sku
        );
      } else if (item.soh < item.minStock) {
        triggerToast(
          t('สต๊อกต่ำกว่าระดับปลอดภัย (Low Safety Stock Warning)', 'LOW SAFETY STOCK WARNING'),
          `${item.name} (${item.sku}) คงเหลือยอดนับปัจจุบันที่ ${item.soh} ยูนิต ซึ่งต่ำกว่าระดับสต๊อกสำรองขั้นต่ำที่ตั้งไว้ ${item.minStock} ยูนิต`,
          'warning',
          item.sku
        );
      } else if (log.type === 'deduct' && Math.abs(log.qtyChange) >= 1000) {
        triggerToast(
          t('พบการปรับหักเบิกจ่ายปริมาณมหาศาล (Large Stock Deduction)', 'LARGE STOCK DEDUCTION WARNING'),
          `รายการเบิกออกระบบปริมาณมากจำนวน -${Math.abs(log.qtyChange)} ยูนิต ถูกประมวลผลสำหรับ ${item.name} (${item.sku})`,
          'warning',
          item.sku
        );
      }
    }
  };

  // Run full initial inventory integrity scan to find existing issues
  const runFullIntegrityScan = () => {
    let issueCount = 0;
    
    // Check out-of-stock items first
    inventoryList.forEach(item => {
      if (item.soh <= 0) {
        issueCount++;
        const currentCount = issueCount;
        setTimeout(() => {
          triggerToast(
            t('สแกนระบบ: ตรวจพบสินค้าหมดคลัง', 'SCAN DISCOVERY: OUT OF STOCK'),
            `ตรวจพบสต๊อก SKU ${item.sku} (${item.name}) มีระดับสินค้าคงคลังปัจจุบันเหลืออยู่อย่างวิกฤตที่ 0 ยูนิต!`,
            'critical',
            item.sku
          );
        }, currentCount * 120);
      } else if (item.soh < item.minStock) {
        issueCount++;
        const currentCount = issueCount;
        setTimeout(() => {
          triggerToast(
            t('สแกนระบบ: ต่ำกว่าสต๊อกปลอดภัยขั้นต่ำ', 'SCAN DISCOVERY: LOW STOCK ON HAND'),
            `รหัส ${item.sku} (${item.name}) คงเหลือ ${item.soh} ยูนิต (ต่ำกว่าเกณฑ์ควบคุมคุณภาพ ${item.minStock} ยูนิต)`,
            'warning',
            item.sku
          );
        }, currentCount * 120);
      }
    });

    // Also look at critical historic disposal logs
    auditLogs.slice(0, 5).forEach(log => {
      if (log.changeType.toLowerCase().includes('write-off') || log.changeType.toLowerCase().includes('disposal') || log.changeType.toLowerCase().includes('obsolete')) {
        issueCount++;
        const currentCount = issueCount;
        setTimeout(() => {
          triggerToast(
            t('สแกนระบบ: ตรวจสอบความคลาดเคลื่อนประวัติ', 'SCAN DISCOVERY: PARSED AUDIT EXCEPTION'),
            `ประวัติเมื่อ ${log.timestamp} บันทึกการตัดยอดเพื่อดูแลของเสียหายจำนวน ${log.qtyChange} ยูนิต โดยผู้ใช้ ${log.user}`,
            'critical',
            log.sku
          );
        }, currentCount * 120);
      }
    });

    if (issueCount === 0) {
      triggerToast(
        t('สแกนระบบเสร็จสิ้น: สภาพสินค้าดีเยี่ยม', 'INTEGRITY AUDIT COMPLETED: OK'),
        `ระบบควบคุมความขัดแย้งไม่พบรายการผลิตภัณฑ์และระดับหมวดคลังเสียหาย คลังสะอาด 100%`,
        'success'
      );
    }
  };

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: '2026-06-06 15:30:12',
      sku: 'SKU-8801',
      itemName: 'Nescafe Red Cup 380g (เนสกาแฟ)',
      type: 'add',
      changeType: 'Plan IN Details',
      qtyChange: 8000,
      user: 'fon3.phichamon@gmail.com',
      remarks: 'Production Line A receipt acknowledged',
      stockType: 'FG'
    },
    {
      id: 'log-2',
      timestamp: '2026-06-06 14:15:00',
      sku: 'RM-PKG-001',
      itemName: 'Corrugated Box C-Flute 30x40x20',
      type: 'add',
      changeType: 'PO Delivery Acknowledged',
      qtyChange: 2000,
      user: 'Pack-Manager 02',
      remarks: 'Thai Packaging PO-2606-001 delivery',
      stockType: 'RM'
    },
    {
      id: 'log-3',
      timestamp: '2026-06-06 11:22:45',
      sku: 'RM-ING-101',
      itemName: 'Refined Sugar 50Kg Bag',
      type: 'deduct',
      changeType: 'Work Order Release',
      qtyChange: -200,
      user: 'Sugar-Operator A',
      remarks: 'Released to production WO-2605-010',
      stockType: 'RM'
    },
    {
      id: 'log-4',
      timestamp: '2026-06-05 16:40:00',
      sku: 'SKU-8805',
      itemName: 'Sunlight Lemon 500ml',
      type: 'deduct',
      changeType: 'Damaged Stock write-off',
      qtyChange: -100,
      user: 'fon3.phichamon@gmail.com',
      remarks: 'Damaged bottle leakages in Zone C - Rack 22',
      stockType: 'FG'
    },
    {
      id: 'log-5',
      timestamp: '2026-06-05 09:12:30',
      sku: 'SKU-8810',
      itemName: 'Old Factory Promo T-Shirt',
      type: 'deduct',
      changeType: 'Obsolete Disposal',
      qtyChange: -50,
      user: 'WMS-Supervisor',
      remarks: 'Disposal of obsolete promotional t-shirts authorized',
      stockType: 'FG'
    },
    {
      id: 'log-6',
      timestamp: '2026-06-04 15:10:00',
      sku: 'ZONE-A',
      itemName: 'Zone A safety stock threshold level',
      type: 'system',
      changeType: 'Allocation Config update',
      qtyChange: 1000,
      user: 'System admin',
      remarks: 'Safety Stock Floor threshold adjusted',
      stockType: 'FG'
    },
    {
      id: 'log-7',
      timestamp: '2026-06-04 10:05:12',
      sku: 'SKU-8803',
      itemName: 'Mama Tom Yum Shrimp (มาม่า)',
      type: 'add',
      changeType: 'Cycle Count Adjustment',
      qtyChange: 10000,
      user: 'Storekeeper B',
      remarks: 'Inbound physical verification check',
      stockType: 'FG'
    },
    {
      id: 'log-8',
      timestamp: '2026-06-03 14:30:00',
      sku: 'RM-CHEM-50',
      itemName: 'Caustic Soda 98% (NaOH)',
      type: 'add',
      changeType: 'Found Stock',
      qtyChange: 200,
      user: 'Chem-Hazmat 01',
      remarks: 'Excess units found in back racking of Zone Z',
      stockType: 'RM'
    },
    {
      id: 'log-9',
      timestamp: '2026-06-03 08:20:15',
      sku: 'RM-ING-105',
      itemName: 'Cocoa Powder Premium 25Kg',
      type: 'add',
      changeType: 'PO Receipt',
      qtyChange: 800,
      user: 'Sugar-Operator A',
      remarks: 'Cocoa Powder PO-2605-110 standard delivery',
      stockType: 'RM'
    },
    {
      id: 'log-10',
      timestamp: '2026-06-02 11:00:00',
      sku: 'SKU-8808',
      itemName: 'Breeze Excel Liquid 700ml',
      type: 'deduct',
      changeType: 'Outbound Delivery',
      qtyChange: -1500,
      user: 'Pack-Manager 01',
      remarks: 'Loaded onto Delivery Truck SO-2605-001',
      stockType: 'FG'
    }
  ]);

  // Safety values update callback
  const handleSaveSafetyConfig = (zoneId: string, updatedFloor: number) => {
    const oldConfig = zoneConfigs.find(z => z.id === zoneId);
    setZoneConfigs(prev => prev.map(zone => zone.id === zoneId ? { ...zone, safetyStockFloor: updatedFloor } : zone));

    if (oldConfig && oldConfig.safetyStockFloor !== updatedFloor) {
      const now = new Date();
      const timestampStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        timestamp: timestampStr,
        sku: zoneId,
        itemName: `${oldConfig.name} safety stock limit`,
        type: 'system',
        changeType: 'Threshold Updated',
        qtyChange: updatedFloor - oldConfig.safetyStockFloor,
        user: 'fon3.phichamon@gmail.com',
        remarks: `Readjusted safety floor limit from ${oldConfig.safetyStockFloor} to ${updatedFloor}`,
        stockType: 'FG'
      };

      setAuditLogs(prev => [newLog, ...prev.slice(0, 14)]);

      triggerToast(
        t('ปรับโครงสร้างเกณฑ์ความปลอดภัยโซน (Safety Floor Updated)', 'ZONE SAFETY FLOOR RECONFIGURED'),
        `ปรับเปลี่ยนเกณฑ์สต๊อกสำรองของโซน ${oldConfig.name} จาก ${oldConfig.safetyStockFloor} เป็น ${updatedFloor} ยูนิต เรียบร้อยแล้ว`,
        'success',
        zoneId
      );
    }
  };

  // Single active state update for adjust modal
  const handleSaveAdjustedItem = (savedItem: any, diff: number, reason: string, remarks: string) => {
    const updated = inventoryList.map(item => item.id === savedItem.id ? { ...item, ...savedItem } : item);
    setInventoryList(updated);

    const now = new Date();
    const isRm = savedItem.type === 'RM' || savedItem.sku.startsWith('RM') || savedItem.category === 'Packaging' || savedItem.category === 'Ingredient' || savedItem.category === 'Chemical';
    const timestampStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      sku: savedItem.sku,
      itemName: savedItem.name,
      type: diff >= 0 ? 'add' : 'deduct',
      changeType: reason || 'Cycle Count Adjustment',
      qtyChange: diff,
      user: 'fon3.phichamon@gmail.com',
      remarks: remarks || 'Cycle count balance adjusted',
      stockType: isRm ? 'RM' : 'FG'
    };

    setAuditLogs(prev => [newLog, ...prev.slice(0, 14)]);

    // Check with the updated item properties for any discrepancies
    setTimeout(() => {
      checkStockDiscrepancies(newLog, updated);
    }, 100);
  };

  const handleCreateNewManual = () => {
    const randomSku = Math.random() > 0.5 ? `SKU-${Math.floor(Math.random() * 9000) + 1000}` : `RM-${Math.floor(Math.random() * 9000) + 1000}`;
    const isRm = randomSku.startsWith('RM');
    const newItem = {
      id: inventoryList.length + 1,
      sku: randomSku,
      name: isRm ? 'New Raw Material Standard Entry' : 'New Product Standard Entry',
      category: isRm ? 'Ingredient' : 'Food',
      soh: 200,
      unitPrice: isRm ? 80 : 50,
      status: 'Healthy',
      zone: 'Zone B - Rack 01',
      lastMove: new Date().toISOString().split('T')[0],
      type: isRm ? 'RM' : 'FG',
      minStock: isRm ? 150 : 100,
      planIn: 0,
      planInDetails: '-',
      planOut: 0,
      planOutDetails: '-'
    };
    const updated = [newItem, ...inventoryList];
    setInventoryList(updated);

    const now = new Date();
    const timestampStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: timestampStr,
      sku: randomSku,
      itemName: newItem.name,
      type: 'create',
      changeType: 'Manual Creation',
      qtyChange: 200,
      user: 'fon3.phichamon@gmail.com',
      remarks: 'Item initialized in database registry with 200 default SOH',
      stockType: isRm ? 'RM' : 'FG'
    };

    setAuditLogs(prev => [newLog, ...prev.slice(0, 14)]);

    triggerToast(
      t('บันทึกทะเบียนสินค้าสำเร็จ (System Registered)', 'SYSTEM REGISTERED SUCCESSFULLY'),
      `สร้างรหัสคลัง ${randomSku} (${newItem.name}) และเริ่มต้นด้วยยอด SOH 200 ยูนิตเรียบร้อย`,
      'success',
      randomSku
    );
  };

  // KPIs Calculations
  const activeSohSum = useMemo(() => inventoryList.reduce((acc, item) => acc + item.soh, 0), [inventoryList]);
  const averageValueSum = useMemo(() => inventoryList.reduce((acc, item) => acc + (item.soh * item.unitPrice), 0), [inventoryList]);
  const deadStockSohItems = useMemo(() => inventoryList.filter(item => item.status === 'Near Expiry' || item.status === 'Dead Stock').length, [inventoryList]);
  const spaceUtilFraction = "84.5%";

  // Real-Time Stock Calculation for current day levels
  const currentDayStockLevels = useMemo(() => {
    let fgTotal = 0;
    let rmTotal = 0;
    inventoryList.forEach(item => {
      if (item.type === 'RM' || item.sku.startsWith('RM')) {
        rmTotal += item.soh;
      } else {
        fgTotal += item.soh;
      }
    });
    return { fg: fgTotal, rm: rmTotal };
  }, [inventoryList]);

  // Daily levels and turnovers dynamic data structure
  const dailyStockLevelsAndTurnover = useMemo(() => {
    return [
      { date: '28-05', fgStockLevel: 44200, rmStockLevel: 13500, fgTurnoverCount: 2200, rmTurnoverCount: 810 },
      { date: '29-05', fgStockLevel: 43000, rmStockLevel: 14000, fgTurnoverCount: 2100, rmTurnoverCount: 880 },
      { date: '30-05', fgStockLevel: 48000, rmStockLevel: 14200, fgTurnoverCount: 2980, rmTurnoverCount: 910 },
      { date: '31-05', fgStockLevel: 47200, rmStockLevel: 13800, fgTurnoverCount: 2700, rmTurnoverCount: 845 },
      { date: '01-06', fgStockLevel: 46200, rmStockLevel: 15100, fgTurnoverCount: 2400, rmTurnoverCount: 1010 },
      { date: '02-06', fgStockLevel: 45800, rmStockLevel: 14900, fgTurnoverCount: 2290, rmTurnoverCount: 970 },
      { date: '03-06', fgStockLevel: 49000, rmStockLevel: 14800, fgTurnoverCount: 3180, rmTurnoverCount: 940 },
      { date: '04-06', fgStockLevel: 48500, rmStockLevel: 15300, fgTurnoverCount: 2900, rmTurnoverCount: 1030 },
      { date: '05-06', fgStockLevel: 47900, rmStockLevel: 15200, fgTurnoverCount: 2800, rmTurnoverCount: 990 },
      // Dynamic live item data for current day
      { 
        date: t('วันนี้', 'Today'), 
        fgStockLevel: currentDayStockLevels.fg, 
        rmStockLevel: currentDayStockLevels.rm, 
        fgTurnoverCount: Math.round(currentDayStockLevels.fg * 0.058), 
        rmTurnoverCount: Math.round(currentDayStockLevels.rm * 0.065) 
      }
    ];
  }, [currentDayStockLevels, t]);

  // Derived turnover percentage rates
  const turnoverRatesData = useMemo(() => {
    return dailyStockLevelsAndTurnover.map(item => ({
      date: item.date,
      fgRate: Number(((item.fgTurnoverCount / (item.fgStockLevel || 1)) * 100).toFixed(1)),
      rmRate: Number(((item.rmTurnoverCount / (item.rmStockLevel || 1)) * 100).toFixed(1)),
      fgVolume: item.fgTurnoverCount,
      rmVolume: item.rmTurnoverCount
    }));
  }, [dailyStockLevelsAndTurnover]);

  // Dynamic 30-day stock levels trend data
  const thirtyDayStockLevelsTrend = useMemo(() => {
    const data = [];
    const baseFg = 45000;
    const baseRm = 14000;
    
    for (let i = 29; i >= 1; i--) {
      const dateObj = new Date();
      dateObj.setDate(dateObj.getDate() - i);
      const dayStr = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0');
      
      // Let's create realistic-looking day-to-day fluctuations so it shows a clear trend
      const seed = i * 4.2;
      const sinFluctuationFg = Math.sin(seed) * 4000 + Math.cos(seed * 0.4) * 2000;
      const sinFluctuationRm = Math.cos(seed * 0.9) * 1500 + Math.sin(seed * 0.6) * 1000;
      
      data.push({
        date: dayStr,
        fgStockLevel: Math.round(baseFg + sinFluctuationFg),
        rmStockLevel: Math.round(baseRm + sinFluctuationRm),
      });
    }
    
    // Day 30 is today
    data.push({
      date: t('วันนี้', 'Today'),
      fgStockLevel: currentDayStockLevels.fg,
      rmStockLevel: currentDayStockLevels.rm,
    });
    
    return data;
  }, [currentDayStockLevels, t]);

  // Dynamic FG daily stock inflow/outflow trends
  const fgInflowOutflowTrend = useMemo(() => {
    const data = [];
    let currentStock = 38000;
    
    for (let i = 14; i >= 0; i--) {
        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() - i);
        const dayStr = String(dateObj.getDate()).padStart(2, '0') + '/' + String(dateObj.getMonth() + 1).padStart(2, '0');
        
        // Randomly generate inflow and outflow
        const inflow = Math.floor(Math.random() * 2000) + 1000;
        const outflow = Math.floor(Math.random() * 2500) + 800;
        
        currentStock = currentStock + inflow - outflow;

        data.push({
            date: i === 0 ? t('วันนี้', 'Today') : dayStr,
            stockLevel: currentStock,
            inflow: inflow,
            outflow: -outflow // Negative for downward bars
        });
    }
    return data;
  }, [t]);

  const heatmapData = useMemo(() => {
     return [
       { id: 'Z-A1', zone: 'A1: FG Fast Moving', density: 92, status: 'High Traffic', color: '#932c2e' },
       { id: 'Z-A2', zone: 'A2: FG Fast Moving', density: 85, status: 'High Traffic', color: '#a94228' },
       { id: 'Z-B1', zone: 'B1: FG Standard', density: 55, status: 'Normal Traffic', color: '#b58c4f' },
       { id: 'Z-S1', zone: 'S1: Staging Area', density: 95, status: 'Critical Traffic', color: '#600508' },
       { id: 'Z-B2', zone: 'B2: FG Standard', density: 40, status: 'Normal Traffic', color: '#657f4d' },
       { id: 'Z-C1', zone: 'C1: FG Slow Moving', density: 25, status: 'Low Traffic', color: '#7a8b95' },
       { id: 'Z-C2', zone: 'C2: Cold Chain', density: 75, status: 'Moderate Traffic', color: '#d96245' },
       { id: 'Z-R1', zone: 'R1: RM High Priority', density: 88, status: 'High Traffic', color: '#932c2e' },
       { id: 'Z-R2', zone: 'R2: RM Standard', density: 60, status: 'Normal Traffic', color: '#b58c4f' },
       { id: 'Z-Q1', zone: 'Q1: Quarantine', density: 10, status: 'Low Traffic', color: '#2d2c4a' },
       { id: 'Z-R3', zone: 'R3: RM Standard', density: 45, status: 'Normal Traffic', color: '#657f4d' },
       { id: 'Z-R4', zone: 'R4: RM Slow Moving', density: 15, status: 'Low Traffic', color: '#7a8b95' },
     ];
  }, []);

  const velocityData = useMemo(() => {
     return [...inventoryList]
        .sort((a, b) => (b.planOut || 0) - (a.planOut || 0))
        .slice(0, 10)
        .map((item, idx) => ({
             name: item.sku,
             fullName: item.name,
             consumption: item.planOut || (3500 - idx * 250),
             replenishment: item.planIn || (4000 - idx * 300)
        }));
  }, [inventoryList]);

  const utilizationData = useMemo(() => {
     return [
       { name: t('พื้นที่ใช้งาน (Occupied)', 'Occupied Space'), value: 84.5, color: THEME.skyBlue },
       { name: t('พื้นที่จัดเก็บรอรับ (Staging)', 'Staging Space'), value: 5.5, color: THEME.gold },
       { name: t('พื้นที่ว่าง (Available)', 'Available Space'), value: 10.0, color: THEME.success }
     ];
  }, [t]);

  // Filters
  const filteredInventory = useMemo(() => {
    return inventoryList.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchType = typeFilter === 'All' || 
                        (typeFilter === 'RM' && (item.type === 'RM' || item.sku.startsWith('RM'))) || 
                        (typeFilter === 'FG' && (item.type !== 'RM' && !item.sku.startsWith('RM')));
      return matchSearch && matchCategory && matchStatus && matchType;
    });
  }, [inventoryList, search, categoryFilter, statusFilter, typeFilter]);

  const currentData = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => {
    setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleExpand = (id: string) => {
    setExpandedZones((prev: any) => ({ ...prev, [id]: !prev[id] }));
  };

  const uniqueCategories = ['All', ...new Set(inventoryList.map(item => item.category))];

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <AdjustStockModal isOpen={adjustModal.isOpen} onClose={() => setAdjustModal({isOpen: false, data: null})} data={adjustModal.data} onSave={handleSaveAdjustedItem} />
      <StockDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} data={detailModal.data} onPrintTag={(item: any) => { setDetailModal({isOpen: false, data: null}); setPrintingLabel(item); }} />
      <HeatmapDetailModal isOpen={isHeatmapModalOpen} onClose={() => setIsHeatmapModalOpen(false)} zoneData={selectedHeatmapZone} />

      <DraggableModal
          isOpen={!!printingLabel}
          onClose={() => setPrintingLabel(null)}
          width="max-w-[900px]"
          customHeader={
              <div className="print:hidden flex justify-between items-center bg-[#212c46] text-white p-4 sticky top-0 z-50 shadow-md cursor-move w-full rounded-t-3xl">
                  <div className="flex items-center gap-3">
                      <Icons.Printer size={20} className="text-[#b7a159]" />
                      <div>
                          <h2 className="font-black tracking-widest text-[13px] uppercase">Print Preview: Identification Labels</h2>
                          <p className="text-[10px] text-[#7a8b95] uppercase font-bold tracking-widest">SKU: {printingLabel?.sku}</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => window.print()} className="bg-[#b7a159] hover:bg-[#cbb56c] text-[#212c46] border border-[#b7a159] px-6 py-2 font-black rounded-lg text-[11px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                         <Icons.Printer size={14} /> Print Now
                      </button>
                      <button onClick={() => setPrintingLabel(null)} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 font-bold rounded-lg text-[11px] uppercase tracking-widest transition-all text-white flex items-center gap-2">
                         <Icons.X size={14} /> Close
                      </button>
                  </div>
              </div>
          }
      >
           <div className="w-full bg-[#525252] overflow-y-auto print:bg-white flex flex-col font-sans mb-10 transition-all max-h-[75vh]">
              <style dangerouslySetInnerHTML={{__html: `
                  @page { size: A4 portrait; margin: 10mm; }
                  @media print {
                      body * { visibility: hidden; }
                      #printable-area, #printable-area * { visibility: visible; }
                      #printable-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
                  }
              `}} />
              
              <div id="printable-area" className="bg-white w-full max-w-[210mm] mx-auto mt-8 mb-16 p-8 shadow-2xl print:shadow-none print:m-0 print:p-0 text-black">
                  <div className="flex flex-col items-center relative">
                      {[1, 2].map((idx) => (
                          <React.Fragment key={idx}>
                              <div className="border-[3px] border-black p-6 w-[18cm] h-[12cm] flex flex-col bg-white text-black break-inside-avoid relative shadow-sm my-4">
                                  <div className="absolute top-4 right-4 text-xs font-bold border border-black px-2 py-1">LBL-{idx}</div>
                                  
                                  <div className="text-center w-full pb-4 border-b-[3px] border-black mt-2">
                                      <h3 className="text-5xl font-black mb-2">FG PALLET</h3>
                                      <p className="text-sm uppercase font-bold tracking-[0.3em] bg-black text-white px-4 py-1 inline-block">
                                          FINISHED GOODS / สินค้าสำเร็จรูป
                                      </p>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
                                      <div className="flex justify-between items-end border-b border-dotted border-black pb-2">
                                          <div className="flex items-end gap-2"><span className="font-bold text-sm w-24">Item Name:</span> <span className="text-xl font-black">{printingLabel?.name}</span></div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-6">
                                          <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">LOT:</span> <span className="text-lg font-bold tracking-widest">L{new Date().getFullYear()}00{idx}</span></div>
                                          <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">QTY:</span> <span className="text-lg font-bold">{formatNumber(printingLabel?.soh || 0)} Units</span></div>
                                          <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">MFG:</span> <span className="text-lg font-bold">{printingLabel?.lastMove}</span></div>
                                          <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">EXP:</span> <span className="text-lg font-bold">2028-12-31</span></div>
                                      </div>
                                  </div>

                                  {/* Fake Barcode */}
                                  <div className="mt-auto w-full flex flex-col items-center pt-4 border-t-[3px] border-black">
                                      <div className="h-20 w-10/12 mx-auto flex justify-center">
                                           {Array.from({length: 45}).map((_, i) => (
                                                <div key={i} className="h-full bg-black flex-shrink-0" style={{width: Math.random() > 0.5 ? '4px' : '2px', marginRight: Math.random() > 0.5 ? '4px' : '2px'}}></div>
                                           ))}
                                      </div>
                                      <p className="text-center font-mono text-xl font-bold tracking-[0.2em] mt-2">{printingLabel?.sku}-00{idx}</p>
                                  </div>
                              </div>
                              {idx === 1 && (
                                  <div className="w-[19cm] flex items-center gap-4 my-2 opacity-100 print:opacity-100">
                                      <div className="border-t-[2px] border-dashed border-gray-400 flex-1"></div>
                                      <Icons.Scissors className="text-gray-400 w-5 h-5" />
                                      <div className="border-t-[2px] border-dashed border-gray-400 flex-1"></div>
                                  </div>
                              )}
                          </React.Fragment>
                      ))}
                  </div>
              </div>
           </div>
      </DraggableModal>

      {/* HEADER SECTION (Matched Premium System Identity) */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Database size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      STOCK <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">DASHBOARD</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          REAL-TIME STOCK VALUATION, SAFETY STOCK THRESHOLDS & WAREHOUSE ZONE CONTROLS
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> Stock Registry
                  </button>
                  <button onClick={() => setActiveTab('safety_calc')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'safety_calc' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.ShieldAlert size={16} className="text-[#a94228]" /> Safety Calc
                  </button>
                  <button onClick={() => setActiveTab('cost_analysis')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'cost_analysis' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.BarChart3 size={16} className="text-amber-600" /> Cost Analysis
                  </button>
                  <button onClick={() => setActiveTab('zone_settings')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'zone_settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> Zone Controls
                  </button>
                  <button onClick={() => setIsAlertsModalOpen(true)} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 text-[#932c2e] hover:bg-[#932c2e]/10 border border-transparent hover:border-[#932c2e]/20 group`}>
                    <Icons.Bell className="text-[#932c2e] group-hover:animate-bounce" size={16} /> Stock Alerts
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (Sleek Compact Lean Padding) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Total Stock Volume" value={formatNumber(activeSohSum)} icon="box" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Stock on Hand" />
                <KpiCard label="Total Inventory Value" value={formatCurrency(averageValueSum)} icon="wallet" colorAccent={THEME.success} colorValue={THEME.success} desc="Asset Valuation" />
                <KpiCard label="Risk Alerts" value={deadStockSohItems} icon="alert-triangle" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Near Exp / Dead Stock" />
                <KpiCard label="Space Utilization" value={spaceUtilFraction} icon="layers" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Storage Occupancy" />
            </div>

            {/* DYNAMIC COMPARATIVE CHARTS SYSTEM (RM vs FG Analytics) */}
            <div className={`bg-white border border-[#eaeaec] animate-fadeIn transition-all duration-300 ${isChartFullscreen ? 'fixed inset-0 z-50 p-6 sm:p-10 flex flex-col justify-between overflow-hidden m-0 rounded-none w-screen h-screen bg-white' : 'rounded-3xl p-5 mb-4 shadow-sm'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#eaeaec]/60 pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#3f809e]/10 rounded-lg">
                            <Icons.TrendingUp size={16} className="text-[#3f809e]" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#212c46] uppercase text-[12px] tracking-widest leading-none">
                                {chartViewMode === 'level' ? t('วิเคราะห์ระดับสินค้าคงคลังรายวัน', 'DAILY INVENTORY STOCK LEVELS') :
                                 chartViewMode === 'trend30d' ? t('วิเคราะห์ระดับสินค้าคงคลังย้อนหลัง 30 วัน', '30-DAY INVENTORY STOCK LEVEL TREND') :
                                 chartViewMode === 'fgTrend' ? t('กระแสของสำเร็จรูปเข้า-ออกรายวัน', 'FG DAILY INFLOW & OUTFLOW TREND') :
                                 chartViewMode === 'turnover' ? t('วิเคราะห์อัตราการหมุนเวียนสินค้า', 'DAILY INVENTORY TURNOVER RATIO') :
                                 chartViewMode === 'heatmap' ? t('ความหนาแน่นของการจัดเก็บรายโซน', 'ZONE STOCK DENSITY HEATMAP') :
                                 chartViewMode === 'performance' ? t('ประสิทธิภาพความจุและอัตราหมุนเวียนคลังสินค้า', 'WAREHOUSE PERFORMANCE & SPACE UTILIZATION') :
                                 t('อัตราการเบิกจ่ายรายสินค้า (Top 10)', 'STOCK VELOCITY TREND (TOP 10)')}
                            </h3>
                            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wide mt-1">
                                {chartViewMode === 'level' ? t('เปรียบเทียบปริมาณสต๊อกสินค้าคงคลังสำเร็จรูป (FG) และวัตถุดิบ (RM)', 'Comparing on-hand stock levels of Finished Goods (FG) vs Raw Materials (RM)') :
                                 chartViewMode === 'trend30d' ? t('ภาพรวมแนวโน้มและรูปแบบการเคลื่อนไหวของปริมาณสต๊อกสะสมย้อนหลัง 30 วัน', 'Historical stock levels showing trends and patterns over the last 30 days') :
                                 chartViewMode === 'fgTrend' ? t('ความสัมพันธ์ระหว่างปริมาณของสำเร็จรูปที่เข้าและออกจากคลังเปรียบเทียบกับระดับสต๊อก', 'Relationship between daily FG inflow/outflow vs accumulated stock levels') :
                                 chartViewMode === 'turnover' ? t('อัตราความเร็วการเบิกจ่ายรายวันเปรียบเทียบกับปริมาณสินค้าคงคลังเฉลี่ย', 'Velocity ratio of daily consumption compared to average stock volumes') :
                                 chartViewMode === 'heatmap' ? t('วิเคราะห์ความหนาแน่นของปริมาณสินค้าเพื่อบริหารจัดการพื้นที่คลังและลดความแออัด', 'Analyze storage density to manage warehouse space and improve picking traffic routing/efficiency') :
                                 chartViewMode === 'performance' ? t('แสดงปริมาณพื้นที่คลังที่ใช้ไปประกอบกับอัตราการหมุนเวียนสินค้าแบบ Real-time', 'Real-time overview of storage occupancy vs inventory turnover rates') :
                                 t('เปรียบเทียบการเบิกจ่ายสินค้าสัมพันธ์กับรอบของการเติมสต๊อก', 'Historical SKU-level consumption versus scheduled replenishment cycles')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center flex-wrap shrink-0">
                        <div className="flex bg-[#f3f3f1] p-1 rounded-xl border border-[#eaeaec] flex-wrap gap-1">
                            <button 
                                onClick={() => setChartViewMode('level')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'level' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('ระดับสต๊อก (FG vs RM)', 'Stock Levels')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('trend30d')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'trend30d' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('แนวโน้ม 30 วัน', '30-Day Trend')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('turnover')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'turnover' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('อัตราหมุนเวียน %', 'Turnover Rate')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('fgTrend')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'fgTrend' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('อุปสงค์จัดส่ง FG', 'FG In/Out')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('velocity')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'velocity' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('ความเร็วเบิกจ่าย (SKU)', 'SKU Velocity')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('heatmap')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'heatmap' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('แผนผังความหนาแน่น', 'Density Heatmap')}
                            </button>
                            <button 
                                onClick={() => setChartViewMode('performance')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${chartViewMode === 'performance' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'}`}
                            >
                                {t('ประสิทธิภาพพื้นที่', 'Performance')}
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsChartFullscreen(!isChartFullscreen)}
                            className="p-1.5 sm:p-2 rounded-xl border border-[#eaeaec] hover:border-[#212c46] bg-[#f3f3f1] hover:bg-white text-[#7a8b95] hover:text-[#212c46] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-1.5 font-bold text-[10px] uppercase tracking-wider"
                            title={isChartFullscreen ? t('ย่อลง', 'Exit Fullscreen') : t('เต็มจอ', 'Fullscreen')}
                        >
                            {isChartFullscreen ? (
                                <>
                                    <Icons.Minimize2 size={14} />
                                    <span className="hidden sm:inline">{t('ย่อหน้าต่าง', 'Exit')}</span>
                                </>
                            ) : (
                                <>
                                    <Icons.Maximize2 size={14} />
                                    <span className="hidden sm:inline">{t('เต็มจอ', 'Fullscreen')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                <div className={`${isChartFullscreen ? 'h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] min-h-[300px]' : 'h-[250px]'} w-full flex-1 transition-all duration-300`}>
                    {chartViewMode === 'level' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStockLevelsAndTurnover} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME.skyBlue} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={THEME.skyBlue} stopOpacity={0.0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRm" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME.burntOrange || THEME.accent} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={THEME.burntOrange || THEME.accent} stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ stroke: '#212c46', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} iconType="circle" />
                                <Area type="monotone" name={t("สินค้าสำเร็จรูป (FG)", "Finished Goods (FG)")} dataKey="fgStockLevel" stroke={THEME.skyBlue} strokeWidth={2.5} fillOpacity={1} fill="url(#colorFg)" />
                                <Area type="monotone" name={t("วัตถุดิบและอะไหล่ (RM)", "Raw Materials & Spares (RM)")} dataKey="rmStockLevel" stroke={THEME.burntOrange || THEME.accent} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRm)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}

                    {chartViewMode === 'trend30d' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={thirtyDayStockLevelsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFg30" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME.skyBlue} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={THEME.skyBlue} stopOpacity={0.0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRm30" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={THEME.burntOrange || THEME.accent} stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor={THEME.burntOrange || THEME.accent} stopOpacity={0.0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} interval={2} />
                                <YAxis tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ stroke: '#212c46', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} iconType="circle" />
                                <Area type="monotone" name={t("สินค้าสำเร็จรูป (FG)", "Finished Goods (FG)")} dataKey="fgStockLevel" stroke={THEME.skyBlue} strokeWidth={2.5} fillOpacity={1} fill="url(#colorFg30)" />
                                <Area type="monotone" name={t("วัตถุดิบและอะไหล่ (RM)", "Raw Materials & Spares (RM)")} dataKey="rmStockLevel" stroke={THEME.burntOrange || THEME.accent} strokeWidth={2.5} fillOpacity={1} fill="url(#colorRm30)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}

                    {chartViewMode === 'fgTrend' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={fgInflowOutflowTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ fill: 'rgba(33, 44, 70, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} iconType="circle" />
                                <Bar yAxisId="right" dataKey="inflow" name={t("รับเข้า (Inflow)", "Inflow")} fill={THEME.success} radius={[4, 4, 0, 0]} stackId="a" maxBarSize={40} />
                                <Bar yAxisId="right" dataKey="outflow" name={t("เบิกออก (Outflow)", "Outflow")} fill={THEME.danger} radius={[0, 0, 4, 4]} stackId="a" maxBarSize={40} />
                                <Line yAxisId="left" type="monotone" name={t("ระดับสต๊อก FG (Stock Level)", "Stock Level (FG)")} dataKey="stockLevel" stroke={THEME.skyBlue} strokeWidth={3} dot={{ r: 3, fill: THEME.skyBlue, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}

                    {chartViewMode === 'turnover' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={turnoverRatesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis unit="%" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ fill: '#f8f9fa' }}
                                    contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                    formatter={(value) => [`${value}%`, '']}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} iconType="circle" />
                                <Bar dataKey="fgVolume" name={t("ปริมาณเบิกจ่าย FG (หน่วย)", "FG Consumption Volume (Units)")} fill={THEME.skyBlue} opacity={0.15} radius={[4, 4, 0, 0]} maxBarSize={30} yAxisId={0} />
                                <Bar dataKey="rmVolume" name={t("ปริมาณเบิกจ่าย RM (หน่วย)", "RM Consumption Volume (Units)")} fill={THEME.burntOrange || THEME.accent} opacity={0.15} radius={[4, 4, 0, 0]} maxBarSize={30} yAxisId={0} />
                                <Line type="monotone" name={t("อัตราหมุนเวียนสินค้าสำเร็จรูป (FG Itr %)", "Finished Goods Turnover (FG Itr %)")} dataKey="fgRate" stroke={THEME.skyBlue} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: THEME.skyBlue, strokeWidth: 2 }} />
                                <Line type="monotone" name={t("อัตราหมุนเวียนวัตถุดิบ (RM Itr %)", "Raw Materials Turnover (RM Itr %)")} dataKey="rmRate" stroke={THEME.burntOrange || THEME.accent} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: THEME.burntOrange || THEME.accent, strokeWidth: 2 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}

                    {chartViewMode === 'velocity' && (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <Tooltip 
                                    cursor={{ fill: '#f8f9fa' }}
                                    contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                    itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px', padding: '2px 0' }}
                                />
                                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#414757', paddingTop: '10px' }} iconType="circle" />
                                <Bar dataKey="consumption" name={t("อัตราความต้องการเบิกใช้สะสม", "Historical Consumption")} fill={THEME.skyBlue} radius={[4, 4, 0, 0]} maxBarSize={40} />
                                <Line type="monotone" name={t("รอบรอบการเติมสินค้าเฉลี่ย", "Replenishment Cycles")} stroke={THEME.accent} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: THEME.accent, strokeWidth: 2 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    )}

                    {chartViewMode === 'heatmap' && (
                        <div className="w-full h-full relative animate-fadeIn" style={{ minHeight: '250px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <Treemap
                                    data={heatmapData}
                                    dataKey="density"
                                    aspectRatio={4 / 3}
                                    stroke="#fff"
                                    fill="#8884d8"
                                    content={(props: any) => <CustomTreemapContent {...props} onNodeClick={(zone: any) => {
                                        if (!zone || zone.root || !zone.id) return;
                                        setSelectedHeatmapZone(zone);
                                        setIsHeatmapModalOpen(true);
                                    }} />}
                                >
                                    <Tooltip content={<HeatmapTooltip />} cursor={{fill: 'transparent'}} />
                                </Treemap>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {chartViewMode === 'performance' && (
                        <div className="w-full h-full flex flex-col md:flex-row gap-4 animate-fadeIn">
                             <div className="flex-1 min-w-0 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl p-4 flex flex-col">
                                 <h4 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] mb-2">{t('อัตราหมุนเวียนสินค้า (Turnover Rate)', 'Real-time Turnover Rate')}</h4>
                                 <div className="flex-1">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={turnoverRatesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaec" />
                                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                            <YAxis unit="%" tick={{ fontSize: 10, fill: '#7a8b95', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                            <Tooltip 
                                                cursor={{ fill: '#f1f3f5' }}
                                                contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                                formatter={(value) => [`${value}%`, '']}
                                            />
                                            <Bar dataKey="fgRate" name={t("หมุนเวียน FG (%)", "FG Turnover (%)")} fill={THEME.skyBlue} radius={[4, 4, 0, 0]} maxBarSize={20} yAxisId={0} />
                                            <Bar dataKey="rmRate" name={t("หมุนเวียน RM (%)", "RM Turnover (%)")} fill={THEME.burntOrange || THEME.accent} radius={[4, 4, 0, 0]} maxBarSize={20} yAxisId={0} />
                                        </ComposedChart>
                                    </ResponsiveContainer>
                                 </div>
                             </div>
                             <div className="w-full md:w-[35%] min-w-0 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl p-4 flex flex-col">
                                 <h4 className="text-[12px] font-black uppercase tracking-widest text-[#212c46] mb-2">{t('สัดส่วนพื้นที่ (Utilization)', 'Space Utilization')}</h4>
                                 <div className="flex-1 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={utilizationData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="65%"
                                                outerRadius="85%"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {utilizationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#212c46', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '12px' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '12px' }}
                                                formatter={(value) => [`${value}%`, '']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-[28px] font-black text-[#212c46] leading-none">84.5%</span>
                                        <span className="text-[9px] font-bold text-[#7a8b95] uppercase tracking-widest mt-1">Occupancy</span>
                                    </div>
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {activeTab === 'registry' ? (
              <>
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn">
                    
                    {/* TABLE TOOLBAR AND FILTERS */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
                            {/* Category Filter */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Filter size={14} className="text-[#606a5f]" />
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    {uniqueCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat === 'All' ? t('ทุกหมวดหมู่', 'All Categories') : cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Activity size={14} className="text-[#606a5f]" />
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">{t('ทุกสถานะ', 'All Status Levels')}</option>
                                    <option value="Healthy">{t('สถานะปกติ', 'Healthy Only')}</option>
                                    <option value="Near Expiry">{t('ใกล้หมดอายุ', 'Near Expiry')}</option>
                                    <option value="Dead Stock">{t('ค้างสต๊อก', 'Dead Stock')}</option>
                                    <option value="Out of Stock">{t('สินค้าหมด', 'Out of Stock')}</option>
                                </select>
                            </div>

                            {/* Item Type Filter (FG vs RM) */}
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Layers size={14} className="text-[#606a5f]" />
                                <select 
                                    value={typeFilter} 
                                    onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">{t('ประเภทสต๊อกทั้งหมด', 'All Stock Types')}</option>
                                    <option value="FG">{t('สินค้าสำเร็จรูป (FG)', 'Finished Goods (FG)')}</option>
                                    <option value="RM">{t('วัตถุดิบ & อะไหล่ (RM)', 'Raw Materials (RM)')}</option>
                                </select>
                            </div>

                            <button onClick={runFullIntegrityScan} className="bg-amber-600 hover:bg-[#b58c4f] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                                <Icons.ShieldAlert size={14} /> {t('สแกนหาข้อผิดพลาด', 'Audit Integrity')}
                            </button>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[12px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                                <Icons.Plus size={14} /> {t('+ เพิ่มสินค้าคงคลัง', '+ Add Stock SOH')}
                            </button>
                        </div>
                        
                        {/* Search Input Box */}
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder={t('ค้นหา SKU หรือดีเทลสินค้า...', 'Search SKU or Brand Details...')} 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    {/* DYNAMIC LIST TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">{t('รหัสสินค้า (SKU)', 'SKU Code')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">{t('รายละเอียดชื่อสินค้า', 'Product Description')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">{t('ประเภทคงคลัง', 'Stock Type')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">{t('หมวดหมู่สินค้า', 'Category')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">{t('จำนวนพร้อมใช้ (SOH)', 'On-Hand (SOH)')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">{t('รอบขาเข้า (Plan IN)', 'Plan IN')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">{t('ยอดขาออก (Plan OUT)', 'Plan OUT')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">{t('สถานะคงเหลือ', 'Stock Status')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">{t('ตำแหน่งจัดเก็บ', 'Storage Location')}</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">{t('การจัดการ', 'Actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => {
                                    const isRmItem = item.type === 'RM' || item.sku.startsWith('RM') || item.category === 'Packaging' || item.category === 'Ingredient' || item.category === 'Chemical';
                                    return (
                                        <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                            <td className="py-3 px-4 font-mono font-black text-[#3f809e] text-[12px] text-left">{item.sku}</td>
                                            <td className="py-3 px-4 font-black text-[#212c46] text-[12px] text-left">
                                                <div className="truncate max-w-[280px]">{item.name}</div>
                                                {item.soh < item.minStock && (
                                                    <span className="inline-flex items-center gap-1 bg-[#ad2b10] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold mt-1">
                                                        <Icons.AlertTriangle size={10} />
                                                        {t('คำเตือน: สต๊อกต่ำกว่าเกณฑ์ความปลอดภัย', 'Safety Stock Alert')}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-left">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border transition-all ${
                                                    isRmItem
                                                        ? 'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30'
                                                        : 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30'
                                                }`}>
                                                    {isRmItem ? t('วัตถุดิบ (RM)', 'Raw Material') : t('สำเร็จรูป (FG)', 'Finished Good')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-left">
                                                <span className="bg-[#212c46]/10 text-[#212c46] px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border border-[#212c46]/20">
                                                    {item.category}
                                                </span>
                                            </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-black text-[#212c46] text-[12px] font-mono">{formatNumber(item.soh)}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                                    Min: {formatNumber(item.minStock)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {item.planIn > 0 ? (
                                                <button 
                                                    onClick={(e) => handleTooltipClick(e, item.planInDetails, 'in')} 
                                                    className="font-bold text-[#3f809e] hover:text-[#212c46] text-[11px] font-mono border-b border-dashed border-[#3f809e]/50 cursor-pointer"
                                                    title="Click to view details"
                                                >
                                                    +{formatNumber(item.planIn)}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 font-mono text-[11px]">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {item.planOut > 0 ? (
                                                <button 
                                                    onClick={(e) => handleTooltipClick(e, item.planOutDetails, 'out')} 
                                                    className="font-bold text-[#a94228] hover:text-[#212c46] text-[11px] font-mono border-b border-dashed border-[#a94228]/50 cursor-pointer"
                                                    title="Click to view details"
                                                >
                                                    -{formatNumber(item.planOut)}
                                                </button>
                                            ) : (
                                                <span className="text-slate-400 font-mono text-[11px]">-</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-3 px-4 text-left font-semibold text-[#7a8b95] text-[12px]">
                                            <div className="flex items-center gap-1.5">
                                                <Icons.MapPin size={12} className="text-[#b58c4f]" /> {item.zone}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setDetailModal({ isOpen: true, data: item })} 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f3f3f1] text-[#212c46] border border-[#eaeaec] hover:border-[#3f809e] hover:text-[#3f809e] transition-all active:scale-95"
                                                    title="View Specifications Ledger"
                                                >
                                                    <Icons.Eye size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setAdjustModal({ isOpen: true, data: item })} 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#f3f3f1] text-[#b58c4f] border border-[#eaeaec] hover:border-[#b58c4f] hover:text-white hover:bg-[#b58c4f] transition-all active:scale-95"
                                                    title="Adjust Cycle SOH Balance"
                                                >
                                                    <Icons.Edit3 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}) : (
                                    <tr>
                                        <td colSpan={10} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            {t('ไม่พบข้อมูลสต๊อกสินค้าที่ค้นหา', 'No inventory items match search attributes.')}
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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono">Count: {filteredInventory.length}</p>
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
                <StockMovementHistory logs={auditLogs} onClearLogs={() => setAuditLogs([])} />
              </>
            ) : activeTab === 'safety_calc' ? (
                <SafetyStockCalc 
                    inventoryList={inventoryList} 
                    onUpdateInventoryList={setInventoryList} 
                />
            ) : activeTab === 'cost_analysis' ? (
                <RMCostAnalysis 
                    inventoryList={inventoryList} 
                />
            ) : (
                /* ZONE CONTROLS - (Standard of User Permissions Security Node Configurations) */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn text-[12px]">
                    
                    {/* Access Policies Card */}
                    <div className="lg:col-span-4 space-y-4 text-left">
                        <div className="bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec]">
                            <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4">
                                <Icons.Layers size={18} className="text-[#b7a159]" /> ALLOCATION POLICY
                            </h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">SAFETY DEPLOYMENT</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        ระบบคลังสินค้าอ้างอิงปริมาณ Safety Stock Floor เพื่อเป็นตัวตัดสินเมื่อจำนวนสินค้าลดลงเกินจุดวิกฤต (Trigger Reorder point Alert)
                                    </p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">RESTRICTED LOCKED ACCESS</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">
                                        การกำหนดให้โซนเป็น Restricted Area จะป้องกันระบบคัดหยิบสินค้าสุ่มเบิกจ่ายสินค้าไปยังจุดอื่นๆ ปิดสิทธิ์พนักงานนอกแผนกสแกนบาร์โค้ด
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
                                โซนถูกควบคุมและเก็บรักษาสถิติตรงผ่านเซพเวอร์ SMART WMS ตลอด 24 ชม. ทุกจำนวนการหยิบคุมตรวจสอบได้มีรหัสรับรองกำกับ
                            </p>
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 text-[11px]">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Restricted Zones count:</span>
                                    <span className="font-black text-[#b7a159]">{Object.values(confidentialityMap).filter(v => v).length} LocationsLocked</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Total Safety Capacity:</span>
                                    <span className="font-black text-white">3,100 Base Units</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Zone Settings Registry (List items with expandable details and Lock options like UserPermissions) */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                        <div className="p-5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3">
                                <Icons.Settings size={20} className="text-[#b7a159]"/> ZONE SETTINGS REGISTRY
                            </h4>
                            <span className="text-[10px] font-bold text-[#657f4d] bg-[#657f4d]/10 px-2.5 py-1 rounded-full border border-[#657f4d]/20 uppercase">SYSTEM STABILIZED</span>
                        </div>
                        <div className="p-5 space-y-3">
                            {zoneConfigs.map(zone => (
                                <div key={zone.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.MapPin size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-extrabold text-[#212c46] text-[12px] uppercase tracking-wider">{zone.name}</span>
                                                    <button onClick={() => toggleExpand(zone.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={16} className={`transition-transform duration-300 ${expandedZones[zone.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${confidentialityMap[zone.id] ? 'text-[#ce1c16]' : 'text-slate-400'}`}>
                                                    Access Level Check: {confidentialityMap[zone.id] ? 'Restricted Lock' : 'Public Access Allowed'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(zone.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[zone.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[zone.id] ? "Unlock Public Access Limit" : "Lock / RESTRICT Zone Access"}
                                            >
                                                {confidentialityMap[zone.id] ? <Icons.Lock size={14} /> : <Icons.Unlock size={14} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Form Panel */}
                                    {expandedZones[zone.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner space-y-3 animate-fadeIn text-left text-[12px]">
                                            <p className="text-[#615e65] font-semibold text-[11px] italic leading-relaxed">{zone.description}</p>
                                            <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec]/60 pt-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Safety Stock Threshold (Units Floor)</label>
                                                    <input 
                                                        type="number"
                                                        value={zone.safetyStockFloor}
                                                        onChange={e => handleSaveSafetyConfig(zone.id, parseInt(e.target.value) || 0)}
                                                        className="w-full bg-white border border-[#eaeaec]/80 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#212c46] outline-none focus:border-[#4d87a8] shadow-sm" 
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-[#7a8b95] uppercase block">Standard Area Status</label>
                                                    <div className="text-[12px] font-black text-[#657f4d] uppercase tracking-wider flex items-center gap-1.5 h-8 mt-1">
                                                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span> SYSTEM MONITORED
                                                    </div>
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
      <DraggableModal
          isOpen={isAlertsModalOpen}
          onClose={() => setIsAlertsModalOpen(false)}
          width="max-w-[700px]"
          customHeader={
            <div className="bg-[#932c2e] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-[#212c46]">
                <div className="flex flex-col">
                    <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2"><Icons.AlertTriangle size={24} className="text-[#e9d8c0]" /> LOW STOCK ALERTS</h3>
                    <p className="text-[10px] uppercase font-bold text-white/80 tracking-widest mt-1">Reorder Point Threshold Monitor</p>
                </div>
                <button onClick={() => setIsAlertsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-all"><Icons.X size={20}/></button>
            </div>
          }
      >
          <div className="p-6 bg-[#f8f9fa] flex flex-col font-sans text-[#414757] overflow-y-auto max-h-[65vh] custom-scrollbar">
              <div className="space-y-4">
                  {inventoryList.filter(item => item.soh <= item.minStock * 1.2).sort((a,b) => (a.soh / a.minStock) - (b.soh / b.minStock)).map(item => {
                      const isCritical = item.soh < item.minStock;
                      const ratio = item.soh / item.minStock;
                      const statusColor = isCritical ? 'text-[#932c2e] bg-[#932c2e]/10 border-[#932c2e]/20' : 'text-[#d96245] bg-[#d96245]/10 border-[#d96245]/20';
                      
                      return (
                          <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${statusColor}`}>
                                      {isCritical ? <Icons.AlertOctagon size={24} /> : <Icons.AlertTriangle size={24} />}
                                  </div>
                                  <div>
                                      <p className="font-mono text-[11px] font-black leading-none text-[#7a8b95] uppercase">{item.sku} • {item.type}</p>
                                      <p className="font-bold text-[14px] text-[#212c46] leading-none mt-1.5">{item.name}</p>
                                      <div className="flex items-center gap-3 mt-2 text-[11px] font-black uppercase">
                                          <span className={`${isCritical ? 'text-[#932c2e]' : 'text-[#d96245]'}`}>SOH: {item.soh.toLocaleString()}</span>
                                          <span className="text-[#aaeaec] w-[1px] h-3 bg-[#d7d7d7]"></span>
                                          <span className="text-[#7a8b95]">MIN: {item.minStock.toLocaleString()}</span>
                                      </div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => triggerToast('PR GENERATED', `Purchase Request created for ${item.sku}.`, 'success', item.sku)}
                                className={`px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-sm border ${isCritical ? 'bg-[#932c2e] text-white border-[#932c2e] hover:bg-[#7a2325]' : 'bg-white text-[#d96245] border-[#d96245] hover:bg-[#d96245]/10'} flex items-center gap-2 md:self-end`}
                              >
                                  <Icons.ShoppingCart size={15}/> Quick Re-Order
                              </button>
                          </div>
                      );
                  })}
                  {inventoryList.filter(item => item.soh <= item.minStock * 1.2).length === 0 && (
                      <div className="text-center py-8 text-[#7a8b95] font-bold text-[12px] uppercase">
                          <Icons.CheckCircle size={40} className="mx-auto text-[#657f4d] mb-4 opacity-50" />
                          All stock levels are optimal.
                      </div>
                  )}
              </div>
          </div>
      </DraggableModal>

      {tooltipData && createPortal(
          <div 
            className={`absolute z-50 p-3 rounded-lg shadow-xl text-[11px] font-bold text-white min-w-[200px] border transform translate-y-2 pointer-events-none ${tooltipData.type === 'in' ? 'bg-[#3f809e] border-[#316983]' : 'bg-[#a94228] border-[#8a331e]'}`}
            style={{ top: tooltipData.y, left: tooltipData.x }}
          >
              <div className="flex items-center gap-2 mb-1.5 opacity-80 uppercase tracking-widest text-[9px]">
                  {tooltipData.type === 'in' ? <Icons.ArrowDownToLine size={12}/> : <Icons.ArrowUpFromLine size={12}/>}
                  {tooltipData.type === 'in' ? 'Plan IN Details' : 'Plan OUT Details'}
              </div>
              <div className="text-[12px]">{tooltipData.text}</div>
          </div>
      , document.body)}

      {createPortal(
        <div className="fixed top-24 right-5 z-[99999] flex flex-col gap-3.5 max-w-[390px] w-full pointer-events-none">
          {toasts.map(toast => (
            <div 
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex gap-3.5 transition-all transform hover:-translate-y-0.5 duration-300 animate-fadeIn ${
                toast.type === 'critical' ? 'bg-red-50 border-red-200 text-[#932c2e]' :
                toast.type === 'warning' ? 'bg-[#fdfbf7] border-[#b58c4f]/30 text-[#b58c4f]' :
                'bg-emerald-50 border-emerald-200 text-[#657f4d]'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'critical' ? (
                  <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center text-[#932c2e] border border-red-200 animate-pulse">
                    <Icons.AlertOctagon size={18} />
                  </div>
                ) : toast.type === 'warning' ? (
                  <div className="w-8 h-8 rounded-xl bg-[#b58c4f]/10 flex items-center justify-center text-[#b58c4f] border border-[#b58c4f]/25">
                    <Icons.AlertTriangle size={17} />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#657f4d] border border-emerald-200">
                    <Icons.CheckCircle2 size={18} />
                  </div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="font-extrabold text-[12.5px] uppercase tracking-wider mb-1 leading-tight flex justify-between items-center">
                  <span>{toast.title}</span>
                </div>
                <p className="text-[11px] font-semibold text-[#414757] leading-relaxed">
                  {toast.message}
                </p>
                {toast.sku && (
                  <div className="mt-2 flex gap-1.5 items-center font-mono text-[9px] font-black text-[#7a8b95] bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 w-fit uppercase">
                    <Icons.Key size={9} /> SKU: {toast.sku}
                  </div>
                )}
              </div>
              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} 
                className="hover:bg-slate-200/50 p-1.5 rounded-xl h-fit w-fit transition-all duration-200 shrink-0 self-start text-[#7a8b95]"
              >
                <Icons.X size={14} className="stroke-[3]" />
              </button>
            </div>
          ))}
        </div>
      , document.body)}
    </div>
  );
}
