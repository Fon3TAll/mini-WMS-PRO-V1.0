import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Archive, 
  Clock, 
  Truck, 
  DollarSign, 
  Zap, 
  Activity, 
  AlertCircle, 
  RefreshCw, 
  ArrowUpRight, 
  CheckCircle2, 
  Eye, 
  Package, 
  ArrowRight,
  Boxes,
  Boxes as BoxesIcon
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { DraggableModal } from '../../../components/shared/DraggableModal';
import { useLanguage } from '../../../context/LanguageContext';

const THEME = {
  primary: '#1a253d',
  primaryLight: '#6a95b1',
  accent: '#ad2b10',
  gold: '#ce8a39',
  brightGold: '#e5b73b',
  success: '#a8c0bb',
  danger: '#922724',
  dustyBlue: '#788990',
  glassWhite: 'rgba(255, 255, 255, 0.92)'
};

const formatCurrency = (val: number) => 
  new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);

const formatNumber = (val: number) => 
  new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(val);

export default function RealTimeSummary() {
  const { language, t } = useLanguage();
  const [isLive, setIsLive] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState<'normal' | 'fast'>('normal');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);

  // --- Real-Time Simulated States ---
  const [pendingReceipts, setPendingReceipts] = useState({
    total: 12,
    todayDue: 5,
    delayed: 2,
    sparkline: [10, 11, 14, 12, 13, 12, 12, 14, 15, 12]
  });

  const [currentStockValue, setCurrentStockValue] = useState({
    total: 3548900,
    categories: [
      { name: 'Raw Material-A', value: 1450000, count: 420 },
      { name: 'Raw Material-B', value: 980000, count: 280 },
      { name: 'Dry Ingredients', value: 620000, count: 180 },
      { name: 'Packaging Box', value: 320000, count: 120 },
      { name: 'Chemical Additives', value: 178900, count: 50 },
    ],
    sparkline: [3540000, 3543000, 3542000, 3545000, 3546500, 3548200, 3547900, 3548900]
  });

  const [outboundVelocity, setOutboundVelocity] = useState({
    ratePerHour: 485, // units dispatched per hour
    targetPerHour: 500,
    todaysTotal: 3820,
    dispatchEfficiency: 98.4,
    sparkline: [420, 450, 480, 460, 490, 510, 470, 485]
  });

  // Last update timestamp state
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // --- Live-Ticking Fluctuation Simulation Stream ---
  useEffect(() => {
    if (!isLive) return;

    const intervalTime = simulationSpeed === 'normal' ? 4000 : 1500;

    const timer = setInterval(() => {
      // 1. Simulate Pending Receipts slight fluctuation
      setPendingReceipts(prev => {
        const change = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const nextTotal = Math.max(5, prev.total + change);
        const nextSpark = [...prev.sparkline.slice(1), nextTotal];
        return {
          ...prev,
          total: nextTotal,
          todayDue: Math.max(1, prev.todayDue + (change > 0 && Math.random() > 0.7 ? 1 : 0)),
          sparkline: nextSpark
        };
      });

      // 2. Simulate Stock Value slight fluctuation (deliveries arriving, orders being fulfilled)
      setCurrentStockValue(prev => {
        const volatility = Math.random() > 0.5 ? 1 : -1;
        const changeAmount = Math.floor(Math.random() * 25000) * volatility;
        const nextTotal = Math.max(3000000, prev.total + changeAmount);
        
        // Slightly fluctuate category ratio list as well
        const shuffledCategories = prev.categories.map(cat => {
          const ratioChange = 1 + (Math.random() * 0.01 - 0.005);
          return {
            ...cat,
            value: Math.round(cat.value * ratioChange)
          };
        });

        const nextSpark = [...prev.sparkline.slice(1), nextTotal];
        return {
          ...prev,
          total: nextTotal,
          categories: shuffledCategories,
          sparkline: nextSpark
        };
      });

      // 3. Simulate Outbound Velocity fluctuation (working rhythm peaks/valleys)
      setOutboundVelocity(prev => {
        const fluctuation = Math.floor(Math.random() * 30) * (Math.random() > 0.48 ? 1 : -1);
        const nextRate = Math.max(380, Math.min(620, prev.ratePerHour + fluctuation));
        const nextSpark = [...prev.sparkline.slice(1), nextRate];
        return {
          ...prev,
          ratePerHour: nextRate,
          todaysTotal: prev.todaysTotal + Math.floor(nextRate / 15),
          dispatchEfficiency: Math.max(95, Math.min(100, prev.dispatchEfficiency + (Math.random() * 0.2 - 0.1))),
          sparkline: nextSpark
        };
      });

      setLastUpdateTime(new Date());
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isLive, simulationSpeed]);

  // Sparkline data preparation for Recharts
  const formatSparkData = (arr: number[]) => arr.map((val, idx) => ({ id: idx, value: val }));

  // --- Actions ---
  const triggerManualRefresh = () => {
    setLastUpdateTime(new Date());
    // Give values an instant organic spark
    setOutboundVelocity(prev => ({
      ...prev,
      ratePerHour: prev.ratePerHour + Math.floor(Math.random() * 25),
      todaysTotal: prev.todaysTotal + 5
    }));
  };

  const simulateFastDispatch = () => {
    setOutboundVelocity(prev => ({
      ...prev,
      ratePerHour: Math.min(680, prev.ratePerHour + 60),
      todaysTotal: prev.todaysTotal + 45,
      sparkline: [...prev.sparkline.slice(1), Math.min(680, prev.ratePerHour + 60)]
    }));
    setPendingReceipts(prev => ({
      ...prev,
      total: Math.max(2, prev.total - 1),
      sparkline: [...prev.sparkline.slice(1), Math.max(2, prev.total - 1)]
    }));
    setLastUpdateTime(new Date());
  };

  return (
    <div id="real-time-summary-widget" className="bg-[#fcfbf9] p-5 rounded-3xl border border-[#e5e5e5] shadow-inner text-left">
      
      {/* HEADER CONTROLS BAR WITH GLOWING LIVE SENSOR */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-3 border-b border-gray-200">
        <div>
          <span className="text-[10px] font-black text-[#788990] uppercase tracking-widest block font-mono">Real-Time Core Operations Analytics</span>
          <h2 className="text-sm font-black text-[#1a253d] uppercase tracking-tight flex items-center gap-2 mt-0.5">
            <Zap size={15} className="text-[#ce8a39] animate-pulse" />
            {t('ระบบติดตามสถานะแวร์เฮาส์อัจฉริยะ', 'Smart Live Telemetry Dashboard')}
          </h2>
        </div>

        {/* Live Controller Dashboard Node */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Glowing Status badge */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse ring-4 ring-emerald-100' : 'bg-red-400'}`}></div>
            <span className="text-[9.5px] font-mono font-bold text-slate-600">
              {isLive ? t('กำลังเชื่อมต่อข้อมูลสด', 'LIVE STREAM ACTIVE') : t('หยุดรับส่งสัญญาณ', 'STREAM STALE / PAUSED')}
            </span>
          </div>

          <div className="bg-white p-1 rounded-xl border flex items-center text-[10px] font-bold shadow-xs">
            {/* Play/Pause */}
            <button
              id="btn-toggle-live"
              type="button"
              onClick={() => setIsLive(!isLive)}
              className={`px-2.5 py-1 rounded-lg transition-all ${isLive ? 'bg-amber-50 text-amber-900 border border-amber-200/50' : 'bg-slate-100 text-slate-500'}`}
              title="Pause/Resume simulated live data updates"
            >
              {isLive ? t('หยุดจำลอง', 'Pause Sim') : t('เปิดจำลอง', 'Resume Sim')}
            </button>

            {/* Speed Toggle */}
            <button
              id="btn-toggle-sim-speed"
              type="button"
              onClick={() => setSimulationSpeed(simulationSpeed === 'normal' ? 'fast' : 'normal')}
              className="ml-1.5 px-2.5 py-1 text-[9.5px] text-[#133951] bg-[#133951]/5 hover:bg-[#133951]/10 rounded-lg transition-colors font-black uppercase"
            >
              {t('คูณเร็ว: ', 'Speed: ')}{simulationSpeed === 'normal' ? '1x' : '4x'}
            </button>
          </div>

          <button 
            onClick={triggerManualRefresh} 
            className="p-2 bg-white border hover:bg-slate-50 rounded-xl transition-all shadow-xs text-slate-600 active:scale-95" 
            title="Force refresh parameters"
          >
            <RefreshCw size={13} className={isLive && simulationSpeed === 'fast' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div id="real-time-summary-cards-layout" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Metric 1: Pending Shipments */}
        <div 
          onClick={() => setActiveModalId('pending_receipts')}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-[160px] relative overflow-hidden group"
        >
          {/* Subtle logo bg */}
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] text-indigo-900 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Clock size={110} />
          </div>

          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#788990] uppercase tracking-wider block">{t('รายการรอจัดส่ง', 'Pending Shipments')}</span>
              <p className="text-3xl font-mono font-black text-amber-700">
                {pendingReceipts.total} <span className="text-xs uppercase text-slate-400 font-bold font-sans">{t('คำสั่ง', 'Orders')}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:rotate-6 transition-transform">
              <Clock size={16} />
            </div>
          </div>

          {/* Sparkline & Details */}
          <div className="space-y-2 z-10">
            <div className="h-[25px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatSparkData(pendingReceipts.sparkline)}>
                  <Area type="monotone" dataKey="value" stroke="#ce8a39" fill="#fdfaf3" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> 
                {t('ล่าช้า: ', 'Delayed: ')}{pendingReceipts.delayed}{t(' รายการ', ' Items')}
              </span>
              <span className="font-mono text-slate-500">{t('ครบกำหนดวันนี้: ', 'Due Today: ')}{pendingReceipts.todayDue}</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Current Stock Levels */}
        <div 
          onClick={() => setActiveModalId('stock_value')}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-[160px] relative overflow-hidden group"
        >
          {/* Subtle logo bg */}
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] text-emerald-900 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Boxes size={110} />
          </div>

          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#788990] uppercase tracking-wider block">{t('ยอดคงคลังปัจจุบัน', 'Current Stock Levels')}</span>
              <p className="text-2xl font-mono font-black text-[#1a253d] tracking-tight">
                {formatNumber(14500)} <span className="text-xs uppercase text-slate-400 font-bold font-sans">Units</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-emerald-600 group-hover:rotate-6 transition-transform">
              <Boxes size={16} />
            </div>
          </div>

          {/* Sparkline & Details */}
          <div className="space-y-2 z-10">
            <div className="h-[25px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatSparkData(currentStockValue.sparkline)}>
                  <Area type="monotone" dataKey="value" stroke="#3c3f20" fill="#fcfcf9" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-800 font-bold border-t border-slate-100 pt-2">
              <span className="flex items-center gap-1 text-emerald-700">
                <TrendingUp size={11} /> {t('+1.2% (เทียบไตรมาสย้อน)', '+1.2% (vs last quarter)')}
              </span>
              <span className="font-mono text-slate-500">All locations</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Warehouse Tasks */}
        <div 
          onClick={() => setActiveModalId('outbound_velocity')}
          className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between h-[160px] relative overflow-hidden group"
        >
          {/* Subtle logo bg */}
          <div className="absolute -right-4 -bottom-6 opacity-[0.03] text-sky-900 transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Activity size={110} />
          </div>

          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#788990] uppercase tracking-wider block">{t('งานในคลังที่ดำเนินการอยู่', 'Active Warehouse Tasks')}</span>
              <p className="text-3xl font-mono font-black text-rose-700">
                {outboundVelocity.ratePerHour} <span className="text-xs uppercase text-slate-400 font-bold font-sans">{t('งาน', 'Tasks')}</span>
              </p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-rose-600 group-hover:rotate-6 transition-transform">
              <Activity size={16} />
            </div>
          </div>

          {/* Sparkline & Details */}
          <div className="space-y-2 z-10">
            <div className="h-[25px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formatSparkData(outboundVelocity.sparkline)}>
                  <Area type="monotone" dataKey="value" stroke="#ad2b10" fill="#fef6f5" strokeWidth={1.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-2">
              <span className="flex items-center gap-1 text-slate-500">
                {t('กำลังดำเนินการ: ', 'In Progress: ')}{formatNumber(outboundVelocity.todaysTotal)}{t(' งาน', ' Tasks')}
              </span>
              <span className="font-mono text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-black text-[9px]">
                {t('ประสิทธิภาพ: ', 'Efficiency: ')}{outboundVelocity.dispatchEfficiency.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* QUICK INLINE ACTION BUTTONS */}
      <div className="mt-4 flex flex-wrap gap-2.5 items-center justify-between text-[11px] font-black uppercase text-[#788990] font-mono">
        <span>* ข้อมูลประสานตรงกับระบบทะเบียนวัตถุดิบและรอบตรวจสอบ Cycle Count ล่าสุด</span>
        <div className="flex gap-2.5">
          <button 
            onClick={simulateFastDispatch}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#ad2b10] hover:bg-[#922724] text-white rounded-lg transition-all shadow-xs text-[10px]"
          >
            <Activity size={12} className="animate-bounce" /> จำลองจัดเบิกออกทันที (Outbound Boost)
          </button>
        </div>
      </div>

      {/* --- DETAIL MODAL INTEGRATIONS BY CLI --- */}
      
      {/* 1. Modal details - Pending Receipts */}
      <DraggableModal
        isOpen={activeModalId === 'pending_receipts'}
        onClose={() => setActiveModalId(null)}
        width="max-w-xl"
        title={
          <div className="flex items-center gap-2.5 text-left">
            <Clock className="text-[#ce8a39]" size={18} />
            <span className="font-black text-white text-[12px] uppercase tracking-wider">ใบสั่งซื้อรอรับเข้า (Pending Inbound Invoices Ledger - {pendingReceipts.total})</span>
          </div>
        }
      >
        <div className="p-5 text-left text-xs text-[#2b3a44] font-sans bg-white">
          <p className="mb-3 text-[11px] text-slate-500">
            เอกสารนำส่งเข้าคลังทั้งหมดที่กำลังรอตรวจสอบปริมาณและคุมคุณภาพสินค้า (Quality Control Receiving Process) ณ ท่าโหลดสินค้า
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {[
              { id: 'PO-2026-0044', supplier: 'Siam Packaging Partners', items: 'ลูกพลาสติกกันกระแทก แตรซีล (80 rolls)', status: 'delayed', eta: 'ดีเลย์ 2 ชั่วโมง', cost: 42000 },
              { id: 'PO-2026-0045', supplier: 'Chemical Global Bio', items: 'ยากันเชื้อราและเจลปรับอุณหภูมิ (15 boxes)', status: 'urgent', eta: 'กำลังพ่วง QC', cost: 125000 },
              { id: 'PO-2026-0046', supplier: 'Universal Steel Holdings', items: 'ชั้นแร็คเก็บประเภทหนารับแรง (2 units)', status: 'scheduled', eta: 'จัดส่งคืนนี้ 18:00', cost: 89000 },
              { id: 'PO-2026-0047', supplier: 'Thai Carton Factory Group', items: 'กล่องลูกฟูกทนไฟ ขนาดมาตรฐาน A4 (500 pcs)', status: 'ready', eta: 'จอดที่ช่องเก็บ Zone C', cost: 15300 },
            ].map(po => (
              <div key={po.id} className="bg-slate-50 p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code className="text-[#ce8a39] font-black font-mono">{po.id}</code>
                    <span className="text-[10px] font-bold text-slate-500">| {po.supplier}</span>
                  </div>
                  <p className="text-[11.5px] font-black text-[#1a253d]">{po.items}</p>
                  <p className="text-[10px] text-slate-400 font-mono">สถานะ ETA: <span className="font-bold text-[#133951]">{po.eta}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                    po.status === 'delayed' ? 'bg-red-50 text-red-600' :
                    po.status === 'urgent' ? 'bg-amber-50 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {po.status}
                  </span>
                  <p className="font-mono font-bold text-[11px] mt-1 text-slate-600">{formatCurrency(po.cost)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t flex justify-end">
            <button onClick={() => setActiveModalId(null)} className="px-5 py-2 bg-[#2b3a44] hover:bg-[#1a253d] text-white font-black rounded-xl text-[10px] uppercase tracking-wider">ปิดลง</button>
          </div>
        </div>
      </DraggableModal>

      {/* 2. Modal details - Current Stock Value */}
      <DraggableModal
        isOpen={activeModalId === 'stock_value'}
        onClose={() => setActiveModalId(null)}
        width="max-w-xl"
        title={
          <div className="flex items-center gap-2.5 text-left">
            <DollarSign className="text-emerald-500" size={18} />
            <span className="font-black text-white text-[12px] uppercase tracking-wider">วิเคราะห์สัดส่วนสินทรัพย์คลังสินค้า (Assigned Assets Distribution Analysis)</span>
          </div>
        }
      >
        <div className="p-5 text-left text-xs text-[#2b3a44] font-sans bg-white">
          <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <span className="text-[9px] font-black uppercase text-[#788990] block">ประเมินมูลค่ารวมทั้งพอร์ตคลังวัตถุดิบ</span>
              <h3 className="text-lg font-mono font-black text-emerald-800">{formatCurrency(currentStockValue.total)}</h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-white border px-3 py-1.5 rounded-xl font-mono">
              สุ่มมูลค่าอัจฉริยะลอยตัว
            </span>
          </div>

          <p className="mb-3 text-[11px] font-bold text-slate-500">สัดส่วนทุนแยกตามหมวดหมู่ประเภทการเบิกเก็บ:</p>
          <div className="space-y-2 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
            {currentStockValue.categories.map((cat, idx) => {
              const portion = (cat.value / currentStockValue.total) * 100;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-black text-slate-700">
                    <span className="flex items-center gap-1">
                      <Archive size={11} className="text-[#6a95b1]" /> {cat.name} ({cat.count} SKUs)
                    </span>
                    <span className="font-mono">{formatCurrency(cat.value)} <span className="text-indigo-900 font-bold ml-1">({portion.toFixed(1)}%)</span></span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${portion}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-3 border-t flex justify-end">
            <button onClick={() => setActiveModalId(null)} className="px-5 py-2 bg-[#2b3a44] hover:bg-[#1a253d] text-white font-black rounded-xl text-[10px] uppercase tracking-wider">ปิดลง</button>
          </div>
        </div>
      </DraggableModal>

      {/* 3. Modal details - Outbound Velocity */}
      <DraggableModal
        isOpen={activeModalId === 'outbound_velocity'}
        onClose={() => setActiveModalId(null)}
        width="max-w-xl"
        title={
          <div className="flex items-center gap-2.5 text-left">
            <Activity className="text-[#ad2b10]" size={18} />
            <span className="font-black text-white text-[12px] uppercase tracking-wider">ความคล่องตัวของการจ่ายสะสม (Outbound Freight Velocity Control)</span>
          </div>
        }
      >
        <div className="p-5 text-left text-xs text-[#2b3a44] font-sans bg-white">
          <p className="mb-4 text-[11px] text-slate-500 leading-relaxed">
            อัตราการเบิกจ่ายสินค้าแยกรายชิ้น (Units Dispatched Per Hour) ออกสู่สายขนส่งสินค้าภายนอก ตรวจสอบประสิทธิภาพแผนส่งด่วนและประสานงานร่วมกับคลังกระจายสินค้า
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase">อัตราเบิกจำลองชั่วโมงปัจจุบัน</span>
              <p className="text-xl font-mono font-black text-rose-700">{outboundVelocity.ratePerHour} ชิ้น / ชม.</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-gray-100">
              <span className="text-[9px] font-bold text-slate-400 uppercase">เป้าจัดจ่ายแปรผัน (SLA Floor)</span>
              <p className="text-xl font-mono font-black text-emerald-800">{outboundVelocity.targetPerHour} ชิ้น / ชม.</p>
            </div>
          </div>

          <div className="space-y-3.5">
            <h4 className="font-black text-[#1a253d] text-[11px] uppercase pb-1 border-b">ประวัติและคิวเบิกโหลดสด (Live Outbound Buffer Queue)</h4>
            
            <div className="space-y-2">
              {[
                { order: 'ORD-2026-9912', carrier: 'Kerry Logistics Express', dispatchTime: '10 mins ago', qty: 150, status: 'Departed' },
                { order: 'ORD-2026-9913', carrier: 'Flash Premium Freight', dispatchTime: '23 mins ago', qty: 320, status: 'Departed' },
                { order: 'ORD-2026-9914', carrier: 'DHL Global Supply', dispatchTime: 'In Buffer', qty: 110, status: 'Staging Area D' },
                { order: 'ORD-2026-9915', carrier: 'J&T Regional Cargo', dispatchTime: 'Picking', qty: 85, status: 'Zone B Box' },
              ].map((freight, i) => (
                <div key={i} className="flex justify-between items-center text-[11.5px] border-b pb-2 last:border-none">
                  <div>
                    <span className="font-mono text-indigo-900 font-extrabold">{freight.order}</span>
                    <span className="text-slate-400 ml-1.5 font-bold">({freight.carrier})</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">สถานะคืบหน้า: <strong className="text-slate-700">{freight.status}</strong></p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-black text-[#ad2b10]">{freight.qty} ชิ้น</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">{freight.dispatchTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t flex justify-end">
            <button onClick={() => setActiveModalId(null)} className="px-5 py-2 bg-[#2b3a44] hover:bg-[#1a253d] text-white font-black rounded-xl text-[10px] uppercase tracking-wider">ปิดลง</button>
          </div>
        </div>
      </DraggableModal>

    </div>
  );
}
