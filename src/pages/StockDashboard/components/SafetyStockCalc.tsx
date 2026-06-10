import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';

// --- Sync Theme with Main StockDashboard ---
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
  coolGray: '#eaeaec'
};

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);

const formatNumber = (val: number) => 
  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);

interface SafetyStockCalcProps {
  inventoryList: any[];
  onUpdateInventoryList: (newList: any[]) => void;
}

export default function SafetyStockCalc({ inventoryList, onUpdateInventoryList }: SafetyStockCalcProps) {
  // 1. Calculation Method ('deterministic' or 'statistical')
  const [calcMethod, setCalcMethod] = useState<'deterministic' | 'statistical'>('statistical');
  
  // 2. Global Multipliers / Controls
  const [globalServiceLevel, setGlobalServiceLevel] = useState<number>(1.65); // Default 95% Service Level Z-score (1.65)
  const [search, setSearch] = useState('');

  // 3. Local Parameters state per SKU
  // Initialized with pre-populated realistic assumptions representing the food, beverage, and household products
  const [skuParameters, setSkuParameters] = useState<Record<string, {
    avgDemand: number;      // Average Daily Demand (Units/Day)
    leadTime: number;       // Average Replenishment Lead Time (Days)
    demandStdDev: number;   // Demand Standard Deviation (Units) for statistical calculation
    maxDemand: number;      // Max Daily Demand (Units/Day) for deterministic calculation
    maxLeadTime: number;    // Max Lead Time (Days) for deterministic calculation
  }>>({
    'SKU-8801': { avgDemand: 450, leadTime: 7, demandStdDev: 90, maxDemand: 600, maxLeadTime: 12 },
    'SKU-8802': { avgDemand: 80, leadTime: 5, demandStdDev: 25, maxDemand: 120, maxLeadTime: 10 },
    'SKU-8803': { avgDemand: 250, leadTime: 10, demandStdDev: 60, maxDemand: 400, maxLeadTime: 15 },
    'SKU-8804': { avgDemand: 180, leadTime: 4, demandStdDev: 35, maxDemand: 250, maxLeadTime: 8 },
    'SKU-8805': { avgDemand: 15, leadTime: 14, demandStdDev: 5, maxDemand: 25, maxLeadTime: 20 },
    'SKU-8806': { avgDemand: 120, leadTime: 6, demandStdDev: 30, maxDemand: 200, maxLeadTime: 10 },
    'SKU-8807': { avgDemand: 45, leadTime: 5, demandStdDev: 12, maxDemand: 75, maxLeadTime: 9 },
    'SKU-8808': { avgDemand: 110, leadTime: 7, demandStdDev: 22, maxDemand: 180, maxLeadTime: 12 },
    'SKU-8809': { avgDemand: 650, leadTime: 5, demandStdDev: 130, maxDemand: 900, maxLeadTime: 8 },
    'SKU-8810': { avgDemand: 2, leadTime: 30, demandStdDev: 1, maxDemand: 5, maxLeadTime: 45 },
    'SKU-8811': { avgDemand: 1100, leadTime: 4, demandStdDev: 220, maxDemand: 1500, maxLeadTime: 7 },
    'SKU-8812': { avgDemand: 5, leadTime: 10, demandStdDev: 2, maxDemand: 12, maxLeadTime: 18 },
  });

  // Selected item inside calculation workbench
  const [selectedSku, setSelectedSku] = useState<string>('SKU-8801');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 4. Calculate Safety Stock & ROP dynamically for all items
  const calculatedItems = useMemo(() => {
    return inventoryList.map(item => {
      const params = skuParameters[item.sku] || {
        avgDemand: Math.round(item.minStock / 10) || 50,
        leadTime: 5,
        demandStdDev: Math.round(item.minStock / 30) || 12,
        maxDemand: Math.round((item.minStock / 10) * 1.5) || 80,
        maxLeadTime: 10
      };

      let safetyStock = 0;
      if (calcMethod === 'statistical') {
        // Statistical Formula: Safety Stock = Z * StdDev * sqrt(LeadTime)
        safetyStock = Math.round(globalServiceLevel * params.demandStdDev * Math.sqrt(params.leadTime));
      } else {
        // Deterministic Formula: Safety Stock = (Max Demand * Max LeadTime) - (Avg Demand * LeadTime)
        safetyStock = Math.max(0, (params.maxDemand * params.maxLeadTime) - (params.avgDemand * params.leadTime));
      }

      // Reorder Point = (Avg Demand * LeadTime) + Safety Stock
      const leadTimeDemand = params.avgDemand * params.leadTime;
      const reorderPoint = leadTimeDemand + safetyStock;
      
      const isUnderstocked = item.soh < reorderPoint;
      const discrepancy = item.soh - reorderPoint;

      return {
        ...item,
        avgDemand: params.avgDemand,
        leadTime: params.leadTime,
        demandStdDev: params.demandStdDev,
        maxDemand: params.maxDemand,
        maxLeadTime: params.maxLeadTime,
        safetyStock,
        leadTimeDemand,
        reorderPoint,
        isUnderstocked,
        discrepancy
      };
    });
  }, [inventoryList, skuParameters, calcMethod, globalServiceLevel]);

  // Selected calculated item for the detail workbench
  const selectedCalculatedItem = useMemo(() => {
    return calculatedItems.find(item => item.sku === selectedSku) || calculatedItems[0];
  }, [calculatedItems, selectedSku]);

  // 5. Update Local Params
  const handleUpdateParam = (key: string, value: number) => {
    setSkuParameters(prev => ({
      ...prev,
      [selectedSku]: {
        ...prev[selectedSku],
        [key]: value
      }
    }));
  };

  // Sync safety stock limits with top level SOH state
  const handleSyncToRegistry = (itemSku: string, calculatedSafetyStock: number) => {
    const newList = inventoryList.map(item => {
      if (item.sku === itemSku) {
        // Find the new status based on new minStock
        let newStatus = item.status;
        if (item.soh === 0) {
          newStatus = 'Out of Stock';
        } else if (item.soh < calculatedSafetyStock) {
          newStatus = 'Near Expiry'; // Or some warning status
        } else {
          newStatus = 'Healthy';
        }
        return {
          ...item,
          minStock: calculatedSafetyStock,
          status: newStatus
        };
      }
      return item;
    });

    onUpdateInventoryList(newList);
    triggerToast(`ซิงค์ค่าวัตถุดิบสำรองปลอดภัย (${calculatedSafetyStock} ชิ้น) ของ ${itemSku} เข้าสู่บัญชีคลังหลักแล้ว!`);
  };

  // Trigger batch simulated Purchasing Order
  const handleProcureDraft = (sku: string, qty: number) => {
    triggerToast(`จัดทำใบสั่งซื้อฉบับร่างค้ำประกันพัสดุ (Draft PO) สำหรับ ${sku} สำเร็จ! จำนวนป้อนสต๊อก: ${formatNumber(qty)} หน่วย`);
  };

  // Filter calculation rows
  const filteredCalculated = useMemo(() => {
    return calculatedItems.filter(item => 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase())
    );
  }, [calculatedItems, search]);

  // Totals calculations for KPIs block
  const totalReordersCount = useMemo(() => calculatedItems.filter(item => item.isUnderstocked).length, [calculatedItems]);
  const totalUnderstockCostEstimate = useMemo(() => {
    return calculatedItems.reduce((acc, item) => {
      if (item.isUnderstocked) {
        const gap = item.reorderPoint - item.soh;
        return acc + (gap * item.unitPrice);
      }
      return acc;
    }, 0);
  }, [calculatedItems]);

  const meanReserveBuffer = useMemo(() => {
    if (calculatedItems.length === 0) return 0;
    const sum = calculatedItems.reduce((acc, item) => acc + item.safetyStock, 0);
    return Math.round(sum / calculatedItems.length);
  }, [calculatedItems]);

  return (
    <div className="flex flex-col space-y-4 animate-fadeIn text-[#212c46] text-left">
      
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#212c46] border border-[#b7a159] text-[#e9d8c0] font-bold text-[12px] px-6 py-3 rounded-full shadow-2xl z-[999] flex items-center gap-2 border-b-2">
          <Icons.CheckCircle2 className="text-[#657f4d] animate-bounce" size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* METHOD SELECTOR & FORMULA INTERACTIVE CARD */}
      <div className="bg-white rounded-3xl border border-[#eaeaec] p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest block">ทฤษฎีสต๊อกสำรองความปลอดภัย (Safety Buffer Optimization Models)</span>
            <h3 className="text-base font-black text-[#212c46] uppercase tracking-tight mt-1 flex items-center gap-1.5 font-mono">
              <Icons.Award size={18} className="text-[#b58c4f]" /> เลือกระบบสูตรคำนวณและปรับเปลี่ยนสภาพบริการ
            </h3>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
            {/* Method switcher buttons */}
            <div className="bg-[#f3f3f1] p-1 rounded-xl border flex items-center text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setCalcMethod('statistical')}
                className={`px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                  calcMethod === 'statistical' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                สถิติบริการ (Statistical Z-Score)
              </button>
              <button
                type="button"
                onClick={() => setCalcMethod('deterministic')}
                className={`px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all whitespace-nowrap ${
                  calcMethod === 'deterministic' ? 'bg-[#212c46] text-white shadow-sm' : 'text-[#7a8b95] hover:text-[#212c46]'
                }`}
              >
                อัตราการจ่ายสูงสุด (Max Demand Std)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Formula Display Block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-[#eaeaec]/60">
          <div className="md:col-span-8 space-y-2">
            <h4 className="text-[12px] font-black uppercase tracking-wider text-[#212c46] flex items-center gap-1">
              <Icons.HelpCircle size={14} className="text-[#3f809e]" /> 
              {calcMethod === 'statistical' 
                ? 'สูตรแบบสถิติระดับบริการ (Service Level Standard Model):' 
                : 'สูตรแบบระดับการจ่ายวัตถุดิบและระยะเวลาเดินทางสูงสุด (Maximum Outlier Model):'}
            </h4>
            
            {calcMethod === 'statistical' ? (
              <div className="font-mono text-[12px] bg-white border p-2.5 rounded-xl text-left shadow-inner flex flex-wrap items-center gap-1 text-[#2d2c4a]">
                <strong className="text-[#a94228]">Safety Stock =</strong>
                <span className="font-black bg-[#2d2c4a]/5 px-2 py-0.5 rounded">Z (ระดับบริการ)</span>
                <span>×</span>
                <span className="font-black bg-[#3f809e]/15 text-[#3f809e] px-1.5 rounded">σ Demand</span>
                <span>×</span>
                <span className="font-black bg-[#657f4d]/15 text-[#657f4d] px-1.5 rounded">√Lead Time</span>
              </div>
            ) : (
              <div className="font-mono text-[12px] bg-white border p-2.5 rounded-xl text-left shadow-inner flex flex-wrap items-center gap-1 text-[#2d2c4a]">
                <strong className="text-[#a94228]">Safety Stock =</strong>
                <span className="font-black bg-orange-50 text-orange-600 px-1.5 rounded">(Max Demand × Max Lead Time)</span>
                <span>−</span>
                <span className="font-black bg-blue-50 text-blue-600 px-1.5 rounded">(Avg Demand × Avg Lead Time)</span>
              </div>
            )}
            <p className="text-[11px] text-[#7a8b95] font-semibold">
              * จุดสั่งซื้อใหม่ (Reorder Point: ROP) คำนวณร่วมกันดังนี้: <code className="font-mono bg-white px-1.5 py-0.5 rounded border">ROP = (Avg Demand × Lead Time) + Safety Stock</code>
            </p>
          </div>

          {/* Interactive Global Service Multiplier (Only shows if statistical method active) */}
          <div className="md:col-span-4 p-3 bg-white rounded-xl border border-dashed border-[#eaeaec] shrink-0 font-sans">
            <label className="text-[10px] font-black uppercase text-[#7a8b95] tracking-widest block mb-1">
              ระดับการค้ำประกันสินค้าบริการ (Target Service Level Z)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1.0"
                max="2.58"
                step="0.01"
                value={globalServiceLevel}
                onChange={(e) => setGlobalServiceLevel(parseFloat(e.target.value))}
                className="flex-1 accent-[#212c46] cursor-pointer"
                disabled={calcMethod === 'deterministic'}
              />
              <span className="font-mono font-black text-xs text-white bg-[#a94228] px-2 py-1 rounded">
                Z = {globalServiceLevel.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-[8px] font-extrabold text-[#7a8b95] uppercase tracking-wider mt-1">
              <span>90% (Z=1.28)</span>
              <span>95% (Z=1.65)</span>
              <span>99% (Z=2.33)</span>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK STATUS KPI BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Items below ROP */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">สต๊อกหล่นต่ำกว่าจุดสั่งซื้อใหม่</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalReordersCount > 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-green-50 text-green-600'}`}>
              <Icons.AlertTriangle size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-xl font-black text-[#212c46] font-mono leading-none">
              {totalReordersCount} <span className="text-[11px] font-bold text-slate-400">รายการ</span>
            </p>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${totalReordersCount > 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#657f4d]/10 text-[#657f4d]'}`}>
              {totalReordersCount > 0 ? 'เฝ้าระวังของขาด' : 'สต๊อกปลอดภัย 100%'}
            </span>
          </div>
        </div>

        {/* Total Recommended Procure Value (Est Budget to hit Safety Floor) */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">ประมาณมูลค่าใบร่างการจัดซื้อ</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#b58c4f]/10 text-[#b58c4f]">
              <Icons.Wallet size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-xl font-black text-[#657f4d] font-mono leading-none">
              {formatCurrency(totalUnderstockCostEstimate)}
            </p>
            <span className="text-[8px] font-black uppercase text-[#7a8b95] font-mono">Fill-to-ROP Estimate</span>
          </div>
        </div>

        {/* Mean Reserve Volume Buffer */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">เฉลี่ยกองวัตถุดิบป้องกันภัย</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#3f809e]/10 text-[#3f809e]">
              <Icons.ShieldAlert size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-xl font-black text-[#212c46] font-mono leading-none">
              {formatNumber(meanReserveBuffer)} <span className="text-[11px] font-bold text-slate-400">หน่วย</span>
            </p>
            <span className="text-[9px] font-bold text-[#7a8b95] uppercase">Average Safety Stock</span>
          </div>
        </div>

        {/* Formula calculation methodology badge block */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">ความมั่นคงอุปทานวัตถุดิบ</span>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600">
              <Icons.ShieldCheck size={15} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-3">
            <p className="text-base font-black text-emerald-700 leading-none flex items-center gap-1 font-mono">
              ★ ISO 22301
            </p>
            <span className="text-[9px] font-bold text-slate-500 uppercase">Supply Resilience</span>
          </div>
        </div>
      </div>

      {/* DUAL WORKBENCH SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT CARD PANEL: SELECTED SKU DETAILED PARAMETER WORKBENCH */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-[#eaeaec] overflow-hidden shadow-sm flex flex-col">
          <div className="bg-[#212c46] p-4 text-white border-b border-[#cbd5e1]/10">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg text-[#b7a159]">
                <Icons.Activity size={16} />
              </div>
              <h4 className="text-[12.5px] font-black uppercase tracking-wider text-[#e9d8c0]">ประเมินและตั้งค่าตัวแปร (SKU PARAM WORKBENCH)</h4>
            </div>
          </div>

          <div className="p-5 space-y-4 text-left">
            {/* SKU and Name display */}
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">{selectedCalculatedItem.sku}</span>
              <h5 className="font-black text-[#212c46] text-[14px] mt-0.5 truncate">{selectedCalculatedItem.name}</h5>
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 mt-1">
                <span>พิกัดจัดเก็บ: <span className="font-extrabold text-[#b58c4f]">{selectedCalculatedItem.zone}</span></span>
                <span>หมวดหมู่: <span className="font-bold text-[#3f809e] uppercase">{selectedCalculatedItem.category}</span></span>
              </div>
            </div>

            {/* Graphic Stock Visualizer Range */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60 text-[11.5px] space-y-3">
              <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-wider flex items-center gap-1.5">
                <Icons.Layers size={12} className="text-[#ad2b10]" /> แผนภาพประเมินคาร์เตอร์ปริมาณ (Inventory Level Meter)
              </span>

              {/* Graphical Scale comparing SOH, Safety Stock, and ROP */}
              <div className="relative pt-6">
                {/* Visual Bar segments */}
                <div className="h-4 w-full bg-slate-200 rounded-full flex overflow-hidden relative border">
                  
                  {/* Danger zone up to safety stock */}
                  <div className="bg-red-500/20 border-r border-[#932c2e]/40 h-full" style={{ width: '40%' }}></div>
                  
                  {/* Reorder Threshold buffer Zone */}
                  <div className="bg-amber-400/20 border-r border-amber-500/40 h-full" style={{ width: '25%' }}></div>
                  
                  {/* Healthy Segment */}
                  <div className="bg-[#657f4d]/20 h-full flex-1"></div>

                  {/* SOH current marker pointer pin */}
                  {(() => {
                    // Normalize position based on logical ratios
                    const maxVal = Math.max(selectedCalculatedItem.reorderPoint * 1.5, selectedCalculatedItem.soh, 1);
                    const percentSoh = Math.min(100, Math.max(5, (selectedCalculatedItem.soh / maxVal) * 100));

                    return (
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center z-10 transition-all duration-300 pointer-events-none"
                        style={{ left: `${percentSoh}%` }}
                      >
                        <div className="w-3 h-3 bg-[#2d2c4a] border-2 border-white rounded-full shadow-md animate-pulse"></div>
                        <span className="absolute -top-6 text-[9px] font-black text-white bg-[#2d2c4a] px-1.5 py-0.5 rounded font-mono shadow-sm">
                          SOH: {formatNumber(selectedCalculatedItem.soh)}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Legend anchors */}
                <div className="flex justify-between text-[8.5px] font-bold text-slate-500 uppercase font-mono mt-1 pt-1 border-t border-slate-200/50">
                  <span>ของขาดสต๊อก (Empty)</span>
                  <span className="text-[#a94228]">Safety Limit: {selectedCalculatedItem.safetyStock}</span>
                  <span className="text-amber-600">จุดสั่งด่วน ROP: {selectedCalculatedItem.reorderPoint}</span>
                </div>
              </div>
            </div>

            {/* Parameter sliders input form */}
            <div className="space-y-3.5 border-t border-[#eaeaec] pt-4 text-[11.5px]">
              
              {/* Avg Daily Demand */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black text-[#cbd5e1] uppercase">
                  <span className="text-[#7a8b95]">อัตราจ่ายวัตถุดิบเฉลี่ยต่อวัน (Avg Demand)</span>
                  <span className="text-[#212c46] font-mono text-xs">{selectedCalculatedItem.avgDemand} ยูนิต/วัน</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={selectedCalculatedItem.avgDemand > 1000 ? "3000" : "1000"}
                  value={selectedCalculatedItem.avgDemand}
                  onChange={(e) => handleUpdateParam('avgDemand', parseInt(e.target.value) || 1)}
                  className="w-full accent-[#212c46] cursor-pointer"
                />
              </div>

              {/* Standard Lead Time */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black text-[#cbd5e1] uppercase">
                  <span className="text-[#7a8b95]">ระยะเวลานำส่งของจากคู่ค้า (Avg Lead Time)</span>
                  <span className="text-[#212c46] font-mono text-xs">{selectedCalculatedItem.leadTime} วัน</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="45"
                  value={selectedCalculatedItem.leadTime}
                  onChange={(e) => handleUpdateParam('leadTime', parseInt(e.target.value) || 1)}
                  className="w-full accent-[#212c46] cursor-pointer"
                />
              </div>

              {/* Calculation Methodology Specific Parameter Inputs */}
              {calcMethod === 'statistical' ? (
                /* Demand Standard Deviation */
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-black text-[#cbd5e1] uppercase">
                    <span className="text-[#7a8b95]">ค่าเสี่ยงเบี่ยงเบนความนิยม (Demand Std Dev)</span>
                    <span className="text-[#212c46] font-mono text-xs">σ = {selectedCalculatedItem.demandStdDev}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={selectedCalculatedItem.demandStdDev > 200 ? "500" : "200"}
                    value={selectedCalculatedItem.demandStdDev}
                    onChange={(e) => handleUpdateParam('demandStdDev', parseInt(e.target.value) || 1)}
                    className="w-full accent-[#212c46] cursor-pointer"
                  />
                  <span className="text-[8.5px] italic text-[#7a8b95] block">ค่าสะท้อนความผันผวนของยอดเบิกจ่ายในรอบเดือนตามจริง</span>
                </div>
              ) : (
                /* Max Daily Demand & Max Lead Time */
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1 text-left">
                    <label className="text-[9.5px] font-black text-[#7a8b95] uppercase block">Max Usage / Day</label>
                    <input
                      type="number"
                      value={selectedCalculatedItem.maxDemand}
                      onChange={(e) => handleUpdateParam('maxDemand', parseInt(e.target.value) || 1)}
                      className="w-full bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1.5 rounded-xl font-bold font-mono text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[9.5px] font-black text-[#7a8b95] uppercase block">Max Lead Time (Days)</label>
                    <input
                      type="number"
                      value={selectedCalculatedItem.maxLeadTime}
                      onChange={(e) => handleUpdateParam('maxLeadTime', parseInt(e.target.value) || 1)}
                      className="w-full bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1.5 rounded-xl font-bold font-mono text-xs outline-none"
                      max="60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sync limit buttons and PO simulations */}
            <div className="pt-4 border-t border-[#eaeaec] flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => handleSyncToRegistry(selectedCalculatedItem.sku, selectedCalculatedItem.safetyStock)}
                className="flex-1 bg-white hover:bg-slate-100 border border-[#b58c4f] font-black text-[10.5px] text-[#b58c4f] px-3 py-2 rounded-xl transition-all flex items-center justify-center gap-1 uppercase tracking-wider"
              >
                <Icons.RefreshCcw size={13} /> Sync Safety Buffer
              </button>
              
              {selectedCalculatedItem.isUnderstocked && (
                <button
                  type="button"
                  onClick={() => {
                    const gap = selectedCalculatedItem.reorderPoint - selectedCalculatedItem.soh;
                    handleProcureDraft(selectedCalculatedItem.sku, gap);
                  }}
                  className="flex-1 bg-[#212c46] hover:bg-[#a94228] font-black text-[10.5px] text-white px-3 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 uppercase tracking-widest"
                >
                  <Icons.PlusSquare size={13} className="text-[#b7a159]" /> Draft PO Now
                </button>
              )}
            </div>

          </div>
        </div>

        {/* RIGHT CARD PANEL: SECURITY COMPARISON LIST OF ALL ITEMS IN COWL TRACE */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#eaeaec] overflow-hidden shadow-sm flex flex-col min-h-[500px]">
          
          {/* Header Row search bar */}
          <div className="p-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex flex-col sm:flex-row justify-between items-center gap-3">
            <h4 className="text-[12.5px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2">
              <Icons.Sliders size={18} className="text-[#b7a159]" /> ตารางเปรียบเทียบจุดสั่งซื้อพัสดุ (ROP COMPARE)
            </h4>
            
            {/* Embedded Mini Search */}
            <div className="relative w-full sm:w-64">
              <Icons.Search size={12} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="สแกนค้นหาสินค้าเพื่อเทียบวิเคราะห์..."
                className="w-full bg-white border border-[#eaeaec] pl-8.5 pr-4 py-1.5 rounded-xl text-[11px] font-bold outline-none text-[#212c46] focus:border-[#4d87a8]"
              />
            </div>
          </div>

          {/* TABLE LOGS */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left font-sans border-collapse">
              <thead>
                <tr className="bg-[#212c46]/5 text-[#212c46] uppercase text-[10px] font-black tracking-widest border-b border-[#cbd5e1]/40">
                  <th className="py-3 px-3">รหัสสินค้า / ข้อมูลพัสดุ</th>
                  <th className="py-3 px-3 text-right">จำนวนคงคลัง (SOH)</th>
                  <th className="py-3 px-3 text-right">วัตถุดิบสำรอง (SS)</th>
                  <th className="py-3 px-3 text-right">จุดสั่งใหม่ (ROP)</th>
                  <th className="py-3 px-4 text-center">สภานการณ์คงสต๊อก</th>
                  <th className="py-3 px-3 text-center">การสั่งซื้อ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 text-[11px]">
                {filteredCalculated.length > 0 ? (
                  filteredCalculated.map((item) => {
                    const isSelected = item.sku === selectedSku;

                    return (
                      <tr
                        key={item.sku}
                        onClick={() => setSelectedSku(item.sku)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#b58c4f]/5 border-l-4 border-l-[#b58c4f]' : ''
                        }`}
                      >
                        {/* SKU information */}
                        <td className="py-3 px-3">
                          <code className="text-[10px] font-black text-[#3f809e] mr-1">{item.sku}</code>
                          <span className="text-[8.5px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded border uppercase">{item.category}</span>
                          <div className="font-extrabold text-[#212c46] truncate max-w-[200px] mt-1" title={item.name}>
                            {item.name}
                          </div>
                        </td>

                        {/* Current SOH */}
                        <td className="py-3 px-3 text-right font-mono font-black text-[#212c46]">
                          {formatNumber(item.soh)}
                        </td>

                        {/* Calculated Safety Stock (SS) */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#7a8b95]">
                          {item.safetyStock}
                        </td>

                        {/* Calculated Reorder Point (ROP) */}
                        <td className="py-3 px-3 text-right font-mono font-extrabold text-[#b58c4f]">
                          {item.reorderPoint}
                        </td>

                        {/* Comparative Alert Indicator */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {item.isUnderstocked ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.8 rounded-full bg-[#932c2e]/10 text-[#932c2e] border border-[#932c2e]/15 font-black uppercase text-[8.5px] tracking-wider animate-pulse">
                              <span className="w-1 h-1 rounded-full bg-current"></span> ต่ำกว่า ROP (สั่งด่วน 🚨)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.8 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold uppercase text-[8.5px]">
                              ● สต๊อกปลอดภัย ✅
                            </span>
                          )}
                        </td>

                        {/* Procure trigger button */}
                        <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          {item.isUnderstocked ? (
                            <button
                              type="button"
                              onClick={() => {
                                const gap = item.reorderPoint - item.soh;
                                handleProcureDraft(item.sku, gap);
                              }}
                              className="px-2.5 py-1 bg-[#212c46] hover:bg-[#a94228] font-black text-[9px] uppercase tracking-widest text-[#e9d8c0] rounded-lg transition-all"
                              title="จัดวางใบสั่งพัสดุด่วนฉบับร่าง"
                            >
                              Procure
                            </button>
                          ) : (
                            <span className="text-slate-400 font-bold font-mono">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-bold uppercase text-[12px]">
                      ไม่พบผลลัพธ์ที่สอดรับเกณฑ์ค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table bottom statistics metadata info */}
          <div className="bg-slate-50 p-3.5 border-t border-[#eaeaec] text-[10.5px] font-bold text-slate-500 uppercase tracking-widest flex justify-between rounded-b-3xl shrink-0">
            <span>แสดงข้อมูลวิเคราะห์วิกฤตทั้งสิ้น {calculatedItems.length} ตราวัตถุดิบ</span>
            <span className="flex items-center gap-1 text-[#b58c4f]"><Icons.Info size={11} /> อัตราขาดสต๊อกปัจจุบัน: {calculatedItems.length > 0 ? ((totalReordersCount / calculatedItems.length) * 100).toFixed(1) : '0'}%</span>
          </div>

        </div>

      </div>

    </div>
  );
}
