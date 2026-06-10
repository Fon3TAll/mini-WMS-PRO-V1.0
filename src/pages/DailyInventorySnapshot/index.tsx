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

const INITIAL_SUMMARY_DATA = [
  { id: 1, type: 'Finished Goods (FG)', category: 'Beverage', totalItems: 6, totalVolume: 46250, unit: 'Units', value: 1250000 },
  { id: 2, type: 'Finished Goods (FG)', category: 'Food', totalItems: 3, totalVolume: 23500, unit: 'Units', value: 750000 },
  { id: 3, type: 'Finished Goods (FG)', category: 'Household', totalItems: 2, totalVolume: 3220, unit: 'Units', value: 245000 },
  { id: 4, type: 'Raw Materials (RM)', category: 'Packaging', totalItems: 1, totalVolume: 12500, unit: 'Pieces', value: 187500 },
  { id: 5, type: 'Raw Materials (RM)', category: 'Ingredient', totalItems: 2, totalVolume: 2450, unit: 'Kg', value: 1024000 },
  { id: 6, type: 'Raw Materials (RM)', category: 'Chemical', totalItems: 1, totalVolume: 450, unit: 'Liters', value: 157500 },
];

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

export default function DailyInventorySnapshot() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredData = useMemo(() => {
        return INITIAL_SUMMARY_DATA.filter((item) => {
            const matchSearch = item.category.toLowerCase().includes(search.toLowerCase()) || 
                                item.type.toLowerCase().includes(search.toLowerCase());
            const matchType = filterType === 'All' ? true : item.type.includes(filterType);
            return matchSearch && matchType;
        });
    }, [search, filterType]);

    const totalVolume = INITIAL_SUMMARY_DATA.reduce((acc, curr) => acc + curr.totalVolume, 0);
    const totalValue = INITIAL_SUMMARY_DATA.reduce((acc, curr) => acc + curr.value, 0);
    const totalFG = INITIAL_SUMMARY_DATA.filter(item => item.type.includes('FG')).reduce((acc, curr) => acc + curr.totalVolume, 0);
    const totalRM = INITIAL_SUMMARY_DATA.filter(item => item.type.includes('RM')).reduce((acc, curr) => acc + curr.totalVolume, 0);

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
            {/* HEADER SECTION */}
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.Camera size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                            DAILY INVENTORY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">SNAPSHOT</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none font-sans">
                            COMPREHENSIVE STOCK VOLUME AND VALUATION SUMMARY
                        </p>
                    </div>
                </div>
                
                <button onClick={handleExportPDF} className="bg-[#b58c4f] text-white px-5 py-2.5 rounded-full font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#a07a41] transition-all flex items-center gap-2 shrink-0 border border-[#b58c4f]">
                    <Icons.FileText size={16} /> Export PDF
                </button>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    {/* KPI STATS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                        <KpiCard label="Total Volume" value={totalVolume.toLocaleString()} icon="Package" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="All Units/Kg/Liters" />
                        <KpiCard label="Total Valuation" value={`฿${(totalValue / 1000000).toFixed(1)}M`} icon="DollarSign" colorAccent={THEME.gold} colorValue={THEME.gold} desc="Estimated Total Value" />
                        <KpiCard label="FG Volume" value={totalFG.toLocaleString()} icon="Box" colorAccent={THEME.success} colorValue={THEME.success} desc="Finished Goods Volume" />
                        <KpiCard label="RM Volume" value={totalRM.toLocaleString()} icon="Archive" colorAccent={THEME.burntOrange} colorValue={THEME.burntOrange} desc="Raw Materials Volume" />
                    </div>

                    {/* MAIN CONTENT BLOCK */}
                    <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn mt-8 print-container relative">
                        
                        <div className="hidden print:block absolute top-4 right-8 text-[11px] font-mono text-gray-500 font-bold z-50">
                            DATE PRINTED: {new Date().toLocaleString()}
                        </div>
                        
                        {/* CONTROL BAR */}
                        <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="flex bg-[#f8f9fa] border border-[#eaeaec] p-1 rounded-full shadow-sm inline-flex">
                                    <button onClick={() => setFilterType('All')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${filterType === 'All' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                                        All
                                    </button>
                                    <button onClick={() => setFilterType('FG')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${filterType === 'FG' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                                        FG Only
                                    </button>
                                    <button onClick={() => setFilterType('RM')} className={`px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 ${filterType === 'RM' ? 'bg-[#212c46] text-[#d7d7d7] shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                                        RM Only
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:w-80">
                                    <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search category..." className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                                </div>
                            </div>
                        </div>

                        {/* DATA DISPLAY PANEL */}
                        <div className="overflow-auto custom-scrollbar bg-[#f8f9fa]">
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#222b38] text-white">
                                    <tr className="border-b-2 border-[#709654]">
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Product Type</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">Category</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">Total Items</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">Total Volume</th>
                                        <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">Total Value (THB)</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-[#eaeaec]">
                                    {filteredData.length > 0 ? filteredData.map((item, index) => (
                                        <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                            <td className="py-2.5 px-4">
                                                <span className={`font-black text-[12px] font-sans ${item.type.includes('FG') ? 'text-[#3f809e]' : 'text-[#d96245]'}`}>
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-bold">
                                                {item.category}
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-black text-right">
                                                {item.totalItems.toLocaleString()}
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-black text-right">
                                                {item.totalVolume.toLocaleString()} <span className="text-[#7a8b95] font-bold text-[10px]">{item.unit}</span>
                                            </td>
                                            <td className="py-2.5 px-4 text-[12px] text-[#4d87a8] font-black text-right">
                                                ฿{item.value.toLocaleString()}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="py-12 text-center text-[#7a8b95] font-bold text-[12px]">No data matched query.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* SPACER FOR MARGIN OFFSET BEFORE FOOTER */}
            <div className="mt-8 shrink-0"></div>

            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-container, .print-container * {
                        visibility: visible;
                    }
                    .print-container {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        border: none !important;
                        box-shadow: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
