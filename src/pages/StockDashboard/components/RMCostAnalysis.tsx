import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import * as Icons from 'lucide-react';

// --- theme configuration aligned with StockDashboard ---
const THEME = {
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
  coolGray: '#eaeaec',
  softBg: '#f8f9fa'
};

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);

const formatNumber = (val: number) => 
  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(val);

interface RMCostAnalysisProps {
  inventoryList: any[];
}

export default function RMCostAnalysis({ inventoryList }: RMCostAnalysisProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'value' | 'alphabetical'>('value');
  const [activeChartMetric, setActiveChartMetric] = useState<'currentValue' | 'safetyValue' | 'replenishingBudget'>('currentValue');

  // 1. Process data: Aggregations by category
  const categorySummaryData = useMemo(() => {
    const summary: Record<string, {
      category: string;
      itemCount: number;
      totalSoh: number;
      currentValue: number; // soh * unitPrice
      safetyValue: number;  // minStock * unitPrice
      replenishingBudget: number; // sum((minStock - soh) * unitPrice) for items below safety Stock
      items: any[];
    }> = {};

    inventoryList.forEach(item => {
      const cat = item.category || 'Other';
      const value = (item.soh || 0) * (item.unitPrice || 0);
      const safetyLimit = item.minStock || 0;
      const safetyVal = safetyLimit * (item.unitPrice || 0);
      
      const deficit = safetyLimit - (item.soh || 0);
      const repBudget = deficit > 0 ? deficit * (item.unitPrice || 0) : 0;

      if (!summary[cat]) {
        summary[cat] = {
          category: cat,
          itemCount: 0,
          totalSoh: 0,
          currentValue: 0,
          safetyValue: 0,
          replenishingBudget: 0,
          items: []
        };
      }

      summary[cat].itemCount += 1;
      summary[cat].totalSoh += item.soh || 0;
      summary[cat].currentValue += value;
      summary[cat].safetyValue += safetyVal;
      summary[cat].replenishingBudget += repBudget;
      summary[cat].items.push(item);
    });

    const parsedList = Object.values(summary);

    if (sortBy === 'value') {
      return parsedList.sort((a, b) => b.currentValue - a.currentValue);
    } else {
      return parsedList.sort((a, b) => a.category.localeCompare(b.category));
    }
  }, [inventoryList, sortBy]);

  // Total Portfolio metrics
  const overallMetrics = useMemo(() => {
    let currentTotal = 0;
    let safetyTotal = 0;
    let totalReplenish = 0;
    let totalItems = 0;

    categorySummaryData.forEach(cat => {
      currentTotal += cat.currentValue;
      safetyTotal += cat.safetyValue;
      totalReplenish += cat.replenishingBudget;
      totalItems += cat.itemCount;
    });

    return {
      currentTotal,
      safetyTotal,
      totalReplenish,
      totalItems
    };
  }, [categorySummaryData]);

  // Selected Category's items list
  const selectedCategoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    const catData = categorySummaryData.find(c => c.category === selectedCategory);
    if (!catData) return [];
    return catData.items.sort((a, b) => (b.soh * b.unitPrice) - (a.soh * a.unitPrice));
  }, [categorySummaryData, selectedCategory]);

  return (
    <div id="rm-cost-analysis-container" className="flex flex-col space-y-5 animate-fadeIn text-[#212c46] text-left">
      
      {/* SECTION HEADER TRACE */}
      <div id="rm-cost-analysis-header-card" className="bg-white rounded-3xl border border-[#eaeaec] p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-left">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest block font-mono">FINANCIAL CONTROL & INVENTORY ALLOCATION</span>
            <h3 className="text-base font-black text-[#212c46] uppercase tracking-tight mt-1 flex items-center gap-2">
              <Icons.BarChart3 className="text-[#a94228]" size={20} />
              ระบบวิเคราะห์งบประมาณและต้นทุนวัตถุดิบคลังสินค้าคงคลัง (Raw Material Cost Analysis)
            </h3>
          </div>
          <div className="flex gap-2 shrink-0">
            <div className="bg-[#f3f3f1] p-1 rounded-xl border flex items-center text-[10.5px] font-bold">
              <button
                id="btn-sort-value"
                type="button"
                onClick={() => setSortBy('value')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'value' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                เรียงตามมูลค่าสูงสุด
              </button>
              <button
                id="btn-sort-alpha"
                type="button"
                onClick={() => setSortBy('alphabetical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  sortBy === 'alphabetical' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                เรียงชื่อหมวดหมู่
              </button>
            </div>
          </div>
        </div>

        {/* THAI EXPLANATION PANEL (คำอธิบายระบบเชิงกลศาสตร์คลังวิเคราะห์) */}
        <div id="rm-cost-analysis-explanation" className="mt-4 bg-slate-50 p-4 rounded-2xl border border-[#eaeaec]/60 text-[11.5px] leading-relaxed text-[#414757] space-y-2">
          <h4 className="font-black text-[#212c46] uppercase flex items-center gap-1.5 text-[12px]">
            <Icons.BookOpen size={14} className="text-[#b58c4f]" /> คู่มือสำหรับผู้จัดการคลังสินค้า: การวางแผนงบประมาณสต๊อกวัตถุดิบ
          </h4>
          <p className="text-[11px]">
            เครื่องมือนี้ช่วยประมวลผลมูลค่าทุนกองวัตถุดิบแยกเป็นรายหมวดหมู่แบบ <strong className="text-[#212c46]">Real-time Valuation</strong> โดยเปรียบเทียบระหว่าง <strong className="text-emerald-700">มูลค่าคงเหลือปัจจุบัน (Current Book Value)</strong> และ <strong className="text-[#b58c4f]">มูลค่ามาตรฐานสำรองขั้นต่ำ (Safety stock floor budget limits)</strong> เพื่อให้สามารถประเมินได้ความแตกต่างของระดับปริมาณ และทำการของบประมาณเติมเต็มได้อย่างถูกต้องเหมาะสม
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-white p-2.5 rounded-xl border flex items-start gap-2">
              <div className="p-1 bg-green-50 text-green-600 rounded mt-0.5"><Icons.ShieldCheck size={11} /></div>
              <div>
                <span className="font-extrabold text-[#212c46] block text-[10.5px]">ทุนคลังสินค้าปัจจุบัน</span>
                <span className="text-[9.5px] text-slate-500">สะท้อนยอดทุนสินทรัพย์ค้างคลัง ณ สภาวะปัจจุบันจริง</span>
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border flex items-start gap-2">
              <div className="p-1 bg-amber-50 text-amber-600 rounded mt-0.5"><Icons.ShieldAlert size={11} /></div>
              <div>
                <span className="font-extrabold text-amber-700 block text-[10.5px]">งบประมาณเติมเต็ม ROP</span>
                <span className="text-[9.5px] text-slate-500">มูลค่าทางบัญชีค้ำประกันเพื่อดึงสต๊อกขาดแคลนกลับมาตามแผน ROP</span>
              </div>
            </div>
            <div className="bg-white p-2.5 rounded-xl border flex items-start gap-2">
              <div className="p-1 bg-indigo-50 text-indigo-600 rounded mt-0.5"><Icons.Sliders size={11} /></div>
              <div>
                <span className="font-extrabold text-indigo-800 block text-[10.5px]">ตรวจสอบลึกระดับ SKU</span>
                <span className="text-[9.5px] text-slate-500">เลือกคลิกแท่งหมวดหมู่ที่ต้องการดูตัวสินค้าเป็นรายชิ้น</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERALL PORTFOLIO METRICS BUDGET BLOCKS */}
      <div id="rm-cost-analysis-metrics-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 - Current Book Value */}
        <div id="kpi-current-book-val" className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">มูลค่าคงคลังทั้งหมด (Current Asset)</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-[#212c46]">
              <Icons.Banknote size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-lg font-black text-[#212c46] font-mono leading-none">
              {formatCurrency(overallMetrics.currentTotal)}
            </p>
            <span className="text-[8.5px] font-black uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active Stock
            </span>
          </div>
        </div>

        {/* Metric 2 - Safety Threshold Floor Value */}
        <div id="kpi-safety-floor-val" className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">มูลค่าเป้าหมายสำรองปลอดภัย (Target Cost)</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-50 text-[#b58c4f]">
              <Icons.Shield size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-lg font-black text-[#b58c4f] font-mono leading-none">
              {formatCurrency(overallMetrics.safetyTotal)}
            </p>
            <span className="text-[8.5px] font-black uppercase text-slate-500 font-mono">
              Safety Min Floor
            </span>
          </div>
        </div>

        {/* Metric 3 - Replenishment Budget Deficit */}
        <div id="kpi-procure-deficit-val" className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">งบเพื่อเติมสต๊อกขั้นต่ำ (Required Budget)</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#932c2e]/10 text-[#932c2e]">
              <Icons.AlertOctagon size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-lg font-black text-[#932c2e] font-mono leading-none">
              {formatCurrency(overallMetrics.totalReplenish)}
            </p>
            <span className="text-[8.5px] font-black uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              งบสั่งซื้อจำเป็นด่วน
            </span>
          </div>
        </div>

        {/* Metric 4 - Average Category Value Density */}
        <div id="kpi-items-count" className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">สัดส่วนหมวดวัตถุดิบในคลัง (Unique Groups)</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3f809e]/10 text-[#3f809e]">
              <Icons.Database size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-lg font-black text-[#3f809e] font-mono leading-none">
              {categorySummaryData.length} <span className="text-[10px] font-bold text-slate-400">หมวดหมู่</span>
            </p>
            <span className="text-[8.5px] font-black uppercase text-[#7a8b95] font-mono">
              {overallMetrics.totalItems} Active SKUs
            </span>
          </div>
        </div>
      </div>

      {/* DUAL WORKBENCH & VISUALIZATION BAR CHART PANEL */}
      <div id="rm-cost-analysis-grid-split" className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT COLUMN: INTERACTIVE RECHARTS BAR CHART */}
        <div id="rm-cost-analysis-chart-panel" className="lg:col-span-8 bg-white rounded-3xl border border-[#eaeaec] p-5 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 border-b border-slate-100 pb-3">
            <div className="text-left">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">FINANCIAL BAR CHART METRIC VISUALIZER</span>
              <h4 className="font-extrabold text-[#212c46] text-[13.5px] uppercase mt-0.5 leading-none">ตัวแปรเปรียบเทียบทางการเงินคลัง (Budget Categories Plot)</h4>
            </div>

            {/* Metric Switcher tabs */}
            <div className="flex gap-1.5 bg-[#f3f3f1] p-1 rounded-xl border text-[10px] font-black shrink-0 w-full sm:w-auto">
              <button
                id="btn-metric-current"
                type="button"
                onClick={() => setActiveChartMetric('currentValue')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${
                  activeChartMetric === 'currentValue' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                มูลค่าคลังจริง
              </button>
              <button
                id="btn-metric-safety"
                type="button"
                onClick={() => setActiveChartMetric('safetyValue')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${
                  activeChartMetric === 'safetyValue' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                ฐานประกันภัยขั้นต่ำ
              </button>
              <button
                id="btn-metric-replenish"
                type="button"
                onClick={() => setActiveChartMetric('replenishingBudget')}
                className={`flex-1 sm:flex-none px-3 py-1 rounded-lg transition-all ${
                  activeChartMetric === 'replenishingBudget' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                งบสั่งซื้อจำเป็น
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 font-bold mb-4">
            💡 <span className="text-[#a94228]">คำแนะนำ:</span> คลิกที่แท่งรูปภาพของหมวดหมู่ในกราฟด้านล่างเพื่อแสดงรายการรายละเอียดวัตถุดิบและของขาดคลังของกลุ่มย่อยนั้นๆ ทางขวา
          </p>

          {/* Bar Chart Canvas Container */}
          <div className="h-[320px] w-full text-[10px] font-mono font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySummaryData}
                margin={{ top: 15, right: 10, left: 10, bottom: 20 }}
                onClick={(state) => {
                  if (state && state.activeLabel) {
                    setSelectedCategory(state.activeLabel === selectedCategory ? null : state.activeLabel);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 10, fill: '#606a5f', fontWeight: 'bold' }}
                  axisLine={{ stroke: '#eaeaec' }}
                  tickLine={false}
                />
                <YAxis 
                  tickFormatter={(val) => `฿${formatNumber(val / 1000)}k`}
                  tick={{ fontSize: 9, fill: '#606a5f', fontWeight: 'bold' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#212c46', opacity: 0.03 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#212c46] text-white p-3 rounded-xl border border-[#b7a159]/40 shadow-xl space-y-1 text-left text-[11px] font-sans">
                          <p className="font-extrabold text-[12px] text-[#b7a159] uppercase tracking-wide">{data.category}</p>
                          <hr className="border-white/10 my-1" />
                          <p><span className="text-[#cbd5e1]">จำนวนรายการสินค้า:</span> {data.itemCount} ชิ้น</p>
                          <p><span className="text-[#cbd5e1]">มูลค่าคลังปัจจุบัน:</span> <span className="font-mono text-emerald-300 font-extrabold">{formatCurrency(data.currentValue)}</span></p>
                          <p><span className="text-[#cbd5e1]">ค่าสำรองปลอดภัยขั้นต่ำ:</span> <span className="font-mono text-amber-200">{formatCurrency(data.safetyValue)}</span></p>
                          <p><span className="text-[#cbd5e1]">งบจัดสั่งเติมเต็ม:</span> <span className="font-mono text-rose-300 font-extrabold">{formatCurrency(data.replenishingBudget)}</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={32}
                  wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'sans-serif', paddingBottom: '10px' }}
                />
                <Bar 
                  dataKey={
                    activeChartMetric === 'currentValue' 
                      ? 'currentValue' 
                      : activeChartMetric === 'safetyValue' 
                        ? 'safetyValue' 
                        : 'replenishingBudget'
                  }
                  name={
                    activeChartMetric === 'currentValue' 
                      ? 'มูลค่าสินค้าปัจจุบัน (Current SOH Value)' 
                      : activeChartMetric === 'safetyValue' 
                        ? 'มูลค่าแผนสำรองความปลอดภัยขั้นต่ำ (Safety Stock Value)' 
                        : 'งบประมาณสั่งซื้อเสริมความปลอดภัย (Replenishment Deficit Value)'
                  }
                  radius={[6, 6, 0, 0]}
                  maxBarSize={55}
                >
                  {categorySummaryData.map((entry, index) => {
                    const isSelected = entry.category === selectedCategory;
                    
                    // Pick beautiful colors depending on metric type
                    let barColor = THEME.primaryLight;
                    if (activeChartMetric === 'currentValue') {
                      barColor = isSelected ? THEME.skyBlue : '#49608c';
                    } else if (activeChartMetric === 'safetyValue') {
                      barColor = isSelected ? THEME.gold : '#caa16a';
                    } else {
                      barColor = isSelected ? THEME.accent : '#be6752';
                    }

                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={barColor}
                        stroke={isSelected ? '#212c46' : 'transparent'}
                        strokeWidth={2}
                        className="cursor-pointer hover:opacity-85 transition-opacity"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT COLUMN: GRANULAR SPECIFIC WORKBENCH LIST FOR SELECTED CATEGORY */}
        <div id="rm-cost-analysis-list-panel" className="lg:col-span-4 bg-white rounded-3xl border border-[#eaeaec] overflow-hidden shadow-sm flex flex-col">
          
          {/* Header of details panel */}
          <div className="bg-[#212c46] p-4 text-white border-b border-[#cbd5e1]/10 text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">SPECIFIC INGREDIENT COST ANALYSIS</span>
            <h4 className="font-extrabold text-[#e9d8c0] text-[12.5px] uppercase mt-0.5 mt-0.5 truncate flex items-center gap-1.5">
              <Icons.ShieldAlert size={14} className="text-[#b7a159] animate-pulse" /> 
              {selectedCategory ? `รายการ: หมวด ${selectedCategory}` : 'หมวดหมู่ทั้งหมด (คลิกเพื่อดูลงลึก)'}
            </h4>
          </div>

          <div id="rm-cost-analysis-details-scroll" className="shadow-inner flex-1 max-h-[350px] overflow-y-auto custom-scrollbar p-4 space-y-3 bg-[#f8f9fa]">
            
            {!selectedCategory ? (
              // Default view summarizing general categories overview
              <div className="space-y-2 text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2">สรุปภาพรวมในทุกกลุ่มวัตถุดิบ (Categories Status Ledger)</span>
                {categorySummaryData.map((cat, index) => {
                  const shareOfTotal = overallMetrics.currentTotal > 0 ? (cat.currentValue / overallMetrics.currentTotal) * 100 : 0;
                  
                  return (
                    <div 
                      key={cat.category}
                      onClick={() => setSelectedCategory(cat.category)}
                      className="bg-white p-3 rounded-2xl border border-slate-200/60 shadow-xs hover:border-[#b58c4f] cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div className="space-y-1">
                        <span className="font-black text-[#212c46] text-[12px] block leading-none">{cat.category}</span>
                        <span className="text-[10px] font-bold text-slate-400 font-mono block">
                          {cat.itemCount} SKUs ({shareOfTotal.toFixed(1)}% ของสินทรัพย์คลังรวม)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-extrabold text-[12.5px] text-slate-800 block leading-none">
                          {formatCurrency(cat.currentValue)}
                        </span>
                        {cat.replenishingBudget > 0 ? (
                          <span className="inline-block text-[9px] font-black text-[#932c2e] bg-[#932c2e]/10 px-1.5 py-0.5 rounded-full mt-1">
                            งบขาด ฿{formatNumber(cat.replenishingBudget)}
                          </span>
                        ) : (
                          <span className="inline-block text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full mt-1">
                            ปลอดภัย ☑
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Specific detailed items for selected category
              <div className="space-y-2.5 text-left">
                <div className="flex justify-between items-center text-[10.5px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  <span>รายละเอียดวัตถุดิบ</span>
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="text-[#3f809e] hover:underline flex items-center gap-0.5 font-bold"
                  >
                    <Icons.ArrowLeft size={11} /> ดูหมวดอื่นทั้งหมด
                  </button>
                </div>

                {selectedCategoryItems.map(item => {
                  const currentValue = item.soh * item.unitPrice;
                  const deficitSoh = (item.minStock || 0) - item.soh;
                  const itemBudgetRequired = deficitSoh > 0 ? deficitSoh * item.unitPrice : 0;

                  return (
                    <div 
                      key={item.sku}
                      className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs flex flex-col space-y-2 hover:shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div className="max-w-[70%]">
                          <code className="text-[#3f809e] text-[9.5px] font-mono block leading-none mb-1">{item.sku}</code>
                          <span className="font-extrabold text-[#212c46] text-[11px] block leading-snug truncate" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                        <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                          item.soh < (item.minStock || 0) ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                          {item.soh < (item.minStock || 0) ? 'ต่ำกว่าขั้นต่ำ ⚠️' : 'สต๊อกปลอดภัย'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-[#f8f9fa] p-2 rounded-xl border border-slate-100 font-mono text-[10px] text-slate-500 font-semibold">
                        <div>
                          <span>SOH: <strong className="text-slate-800">{formatNumber(item.soh)} / ROP {formatNumber(item.minStock || 0)}</strong></span>
                        </div>
                        <div className="text-right">
                          <span>ราคาต่อหน่วย: <strong className="text-slate-800">฿{item.unitPrice}</strong></span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-slate-400 font-black uppercase">มูลค่าทรัพย์รวม:</span>
                        <span className="font-mono font-black text-emerald-700">{formatCurrency(currentValue)}</span>
                      </div>

                      {itemBudgetRequired > 0 && (
                        <div className="flex justify-between items-center text-[10.5px] pt-1.5 mt-1 border-t border-dashed border-red-100">
                          <span className="text-red-500 font-black uppercase">งบประมาณเติมเต็ม ROP:</span>
                          <span className="font-mono font-black text-[#932c2e]">{formatCurrency(itemBudgetRequired)}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-[#f8f9fa] p-3 text-[10px] text-left text-slate-400 font-semibold border-t border-slate-100">
            * คัดเลือกกลุ่มหมวดหมู่เปรียบเทียบในคลังสินทรัพย์เพื่อวางงบประมาณซื้อ (Quarterly Procurement Strategy Plan)
          </div>

        </div>

      </div>

    </div>
  );
}
