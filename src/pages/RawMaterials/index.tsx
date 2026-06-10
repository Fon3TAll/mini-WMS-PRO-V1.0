import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DraggableModal } from '../../components/shared/DraggableModal';
import RMKanbanBoard from './components/RMKanbanBoard';

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

// --- KPI Card Components ---
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
    case 'Healthy': style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; break;
    case 'Low Stock': style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; break;
    case 'Dead Stock': style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; break;
    case 'Out of Stock': style = { bg: '#7a8b9515', color: THEME.indigo, border: '#7a8b9530' }; break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

export default function RawMaterialsSystem() {
  const [activeTab, setActiveTab] = useState('registry');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [expandedZones, setExpandedZones] = useState<any>({ 'RM-ZONE-A': true, 'RM-ZONE-B': false });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'RM-ZONE-A': false, 'RM-ZONE-B': false, 'RM-CHEM': true });
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

  const [inventoryList, setInventoryList] = useState<any[]>([
    { id: 1, sku: 'RM-PKG-001', name: 'Corrugated Box C-Flute 30x40x20', category: 'Packaging', soh: 12500, unitPrice: 15, status: 'Healthy', zone: 'RM-ZONE-A (Packaging)', lastMove: '2026-06-01', minStock: 5000, planIn: 2000, planInDetails: 'PO-2606-001 (Thai Packaging)', planOut: 5000, planOutDetails: 'WO-2606-001 (Production Line A)' },
    { id: 2, sku: 'RM-ING-101', name: 'Refined Sugar 50Kg Bag', category: 'Ingredient', soh: 85, unitPrice: 1200, status: 'Low Stock', zone: 'RM-ZONE-B (Ingredients)', lastMove: '2026-05-30', minStock: 1500, planIn: 1000, planInDetails: 'PO-2605-002 (Global Sugar Inc.)', planOut: 200, planOutDetails: 'WO-2605-010 (Line B)' },
    { id: 3, sku: 'RM-CHEM-50', name: 'Caustic Soda 98% (NaOH)', category: 'Chemical', soh: 450, unitPrice: 350, status: 'Healthy', zone: 'RM-CHEM (Secure)', lastMove: '2026-05-15', minStock: 200, planIn: 0, planInDetails: '-', planOut: 50, planOutDetails: 'WO-CHEM-01' },
    { id: 4, sku: 'SPR-MTR-12', name: 'Conveyor Motor 3HP', category: 'Spare Part', soh: 2, unitPrice: 8500, status: 'Low Stock', zone: 'RM-MAINT (Engineer Store)', lastMove: '2025-11-20', minStock: 5, planIn: 5, planInDetails: 'PO-MAINT-102 (Motors & Parts Corp)', planOut: 1, planOutDetails: 'MAINT-2605-01 (Conveyor 2)' },
    { id: 5, sku: 'RM-PKG-005', name: 'Shrink Film Roll 50cm', category: 'Packaging', soh: 420, unitPrice: 450, status: 'Healthy', zone: 'RM-ZONE-A (Packaging)', lastMove: '2026-06-03', minStock: 200, planIn: 100, planInDetails: 'PO-2606-003', planOut: 300, planOutDetails: 'WO-2606-003 (Line A)' },
    { id: 6, sku: 'RM-ING-105', name: 'Cocoa Powder Premium 25Kg', category: 'Ingredient', soh: 0, unitPrice: 3200, status: 'Out of Stock', zone: 'RM-ZONE-B (Ingredients)', lastMove: '2026-05-01', minStock: 50, planIn: 100, planInDetails: 'PO-2605-110 (Cocoa Co.)', planOut: 20, planOutDetails: 'WO-2606-008 (Line C)' },
    { id: 7, sku: 'SPR-BRG-88', name: 'Bearings SKF 6204', category: 'Spare Part', soh: 50, unitPrice: 120, status: 'Dead Stock', zone: 'RM-MAINT (Engineer Store)', lastMove: '2024-02-15', minStock: 10, planIn: 0, planInDetails: '-', planOut: 0, planOutDetails: '-' },
  ]);

  const [zoneConfigs, setZoneConfigs] = useState<any[]>([
    { id: 'RM-ZONE-A', name: 'RM-ZONE-A (Packaging Materials)', safetyStockFloor: 5000, activeAllocation: true, isConfidential: false, description: 'โกดังสำหรับบรรจุภัณฑ์ กล่องกระดาษ และพลาสติกห่อหุ้ม' },
    { id: 'RM-ZONE-B', name: 'RM-ZONE-B (Raw Ingredients)', safetyStockFloor: 1500, activeAllocation: true, isConfidential: false, description: 'อุณหภูมิควบคุมสำหรับวัตถุดิบและส่วนผสมหลัก (Food Grade)' },
    { id: 'RM-CHEM', name: 'RM-CHEM (Chemicals & Hazmat)', safetyStockFloor: 200, activeAllocation: true, isConfidential: true, description: 'พื้นที่จัดเก็บสารเคมีอันตรายและน้ำยาทำความสะอาด (Restricted)' },
    { id: 'RM-MAINT', name: 'RM-MAINT (Engineering Spares)', safetyStockFloor: 50, activeAllocation: false, isConfidential: false, description: 'อะไหล่เครื่องจักร สายพาน มอเตอร์ และเครื่องมือช่าง' }
  ]);

  const handleSaveSafetyConfig = (zoneId: string, updatedFloor: number) => {
    setZoneConfigs(prev => prev.map(zone => zone.id === zoneId ? { ...zone, safetyStockFloor: updatedFloor } : zone));
  };

  const activeSohSum = useMemo(() => inventoryList.reduce((acc, item) => acc + item.soh, 0), [inventoryList]);
  const averageValueSum = useMemo(() => inventoryList.reduce((acc, item) => acc + (item.soh * item.unitPrice), 0), [inventoryList]);
  const deadStockSohItems = useMemo(() => inventoryList.filter(item => item.status === 'Low Stock' || item.status === 'Dead Stock').length, [inventoryList]);
  const spaceUtilFraction = "62.4%";

  const velocityData = useMemo(() => {
     return [...inventoryList]
        .sort((a, b) => (b.planOut || 0) - (a.planOut || 0))
        .slice(0, 10)
        .map(item => ({
             name: item.sku,
             fullName: item.name,
             consumption: item.planOut || Math.floor(Math.random() * 1000),
             replenishment: item.planIn || Math.floor(Math.random() * 1000)
        }));
  }, [inventoryList]);

  const filteredInventory = useMemo(() => {
    return inventoryList.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sku.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchCategory && matchStatus;
    });
  }, [inventoryList, search, categoryFilter, statusFilter]);

  const currentData = filteredInventory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedZones((prev: any) => ({ ...prev, [id]: !prev[id] }));

  const uniqueCategories = ['All', ...new Set(inventoryList.map(item => item.category))];

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Boxes size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      RAW MATERIALS <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">& SPARES</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          คลังวัตถุดิบ บรรจุภัณฑ์ และอะไหล่ซ่อมบำรุง
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> RM Inventory Registry
                  </button>
                  <button onClick={() => setActiveTab('kanban')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'kanban' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Trello className="text-[#b58c4f]" size={16} /> RM Movement Kanban
                  </button>
                  <button onClick={() => setActiveTab('zone_settings')} className={`px-4 sm:px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'zone_settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Settings className="text-[#b58c4f]" size={16} /> Zone Controls
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Total RM & Spares Volume" value={formatNumber(activeSohSum)} icon="box" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Stock on Hand" />
                <KpiCard label="RM Inventory Value (THB)" value={formatCurrency(averageValueSum)} icon="wallet" colorAccent={THEME.success} colorValue={THEME.success} desc="Asset Valuation" />
                <KpiCard label="Risk Alerts" value={deadStockSohItems} icon="alert-triangle" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Low / Dead Stock" />
                <KpiCard label="Storage Utilization" value={spaceUtilFraction} icon="layers" colorAccent={THEME.gold} colorValue={THEME.primary} desc="RM Storage Occupancy" />
            </div>

            {/* STOCK VELOCITY TREND CHART */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#eaeaec] p-5 mb-4 animate-fadeIn">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-[#3f809e]/10 rounded-lg">
                        <Icons.TrendingUp size={16} className="text-[#3f809e]" />
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase text-[12px] tracking-widest leading-none">Stock Velocity Trend (วัตถุดิบ)</h3>
                        <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wide mt-1">Historical Consumption vs Replenishment (Top 10 SKUs)</p>
                    </div>
                </div>
                <div className="h-[250px] w-full">
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
                            <Bar dataKey="consumption" name="Historical Consumption (แผนการจ่ายออก)" fill={THEME.skyBlue} radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Line type="monotone" dataKey="replenishment" name="Replenishment Cycles (แผนการรับเข้า)" stroke={THEME.accent} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, stroke: THEME.accent, strokeWidth: 2 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {activeTab === 'registry' && (
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn">
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Filter size={14} className="text-[#606a5f]" />
                                <select 
                                    value={categoryFilter} 
                                    onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    {uniqueCategories.map(cat => (
                                        <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
                                <Icons.Activity size={14} className="text-[#606a5f]" />
                                <select 
                                    value={statusFilter} 
                                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent outline-none font-black uppercase text-[12px] tracking-wider text-[#212c46] cursor-pointer"
                                >
                                    <option value="All">All Status Levels</option>
                                    <option value="Healthy">Healthy Only</option>
                                    <option value="Low Stock">Low Stock</option>
                                    <option value="Dead Stock">Dead Stock</option>
                                    <option value="Out of Stock">Out of Stock</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="relative w-full md:w-80">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} 
                                placeholder="Search RM SKU or Material Details..." 
                                className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse min-w-[1000px]">
                            <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                                <tr>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รหัสวัตถุดิบ (SKU)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">รายละเอียดวัตถุดิบ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">หมวดหมู่ / กลุ่มสารเคมี</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">ยอดคงคลัง (SOH)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">แผนการรับเข้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">แผนการจ่ายออก</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">สถานะ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">การจัดสรรตำแหน่งเก็บ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 font-mono font-black text-[#3f809e] text-[12px] text-left">{item.sku}</td>
                                        <td className="py-2.5 px-4 font-black text-[#212c46] text-[12px] text-left">
                                            <div className="truncate max-w-[280px]">{item.name}</div>
                                            {item.soh < item.minStock && (
                                                <span className="inline-flex items-center gap-1 bg-[#ad2b10] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold mt-1">
                                                    <Icons.AlertTriangle size={10} />
                                                    Safety Stock Alert
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2.5 px-4 text-left">
                                            <span className="bg-[#212c46]/10 text-[#212c46] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border border-[#212c46]/20">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className="font-black text-[#212c46] text-[12px] font-mono">{formatNumber(item.soh)}</span>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                                    Min: {formatNumber(item.minStock)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-right">
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
                                        <td className="py-2.5 px-4 text-right">
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
                                        <td className="py-2.5 px-4 text-center">
                                            <StatusBadge status={item.status} />
                                        </td>
                                        <td className="py-2.5 px-4 text-left font-semibold text-[#7a8b95] text-[12px]">
                                            <div className="flex items-center gap-1.5">
                                                <Icons.MapPin size={12} className="text-[#b58c4f]" /> {item.zone}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase">
                                            No materials match search attributes.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

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
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono text-black font-bold">Count: {filteredInventory.length}</p>
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
            )}

            {activeTab === 'kanban' && (
                <RMKanbanBoard />
            )}

            {activeTab === 'zone_settings' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn text-[12px]">
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
                            </div>
                        </div>
                    </div>

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
    </div>
  );
}
