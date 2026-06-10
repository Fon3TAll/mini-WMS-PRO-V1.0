import React, { useState, useMemo, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Synced with Premium Suite ---
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

export interface RMPickingLog {
  id: string; // e.g., RM-PCK-1002
  pickedAt: string; // Date & Time
  sku: string;
  name: string;
  category: 'Ingredient' | 'Packaging' | 'Chemical' | 'Spare Part';
  lotNo: string;
  locationZone: string;
  requestedQty: number; // Target Volume
  actualQty: number; // Real scale weight recorded
  unit: string;
  status: 'Completed' | 'Tolerance Watch' | 'Passed with Exemption' | 'Quality Hold';
  prodOrderRef: string; // Manufacturing Work Order No.
  targetLine: string; // Production Line target destination
  operator: string; // Picking Operator
  qcVerifier: string; // Quality controller who approved actual release
  scaleId: string; // Scale terminal reference
  temperature: number; // Environment measurement (°C)
  humidity: number; // Environment measurement (%)
  notes: string;
}

// Generate rich, detailed chronological mock data surrounding June 2026
const INITIAL_PICKING_HISTORY: RMPickingLog[] = [
  {
    id: 'RM-PCK-501',
    pickedAt: '2026-06-05 14:15',
    sku: 'RM-ING-109',
    name: 'Premium Vanillin Crystals Extra-Pure',
    category: 'Ingredient',
    lotNo: 'LOT-VAN-2605',
    locationZone: 'RM-ZONE-B',
    requestedQty: 120.00,
    actualQty: 119.85,
    unit: 'Kg',
    status: 'Completed',
    prodOrderRef: 'MO-2026-102A',
    targetLine: 'Line A - Mixer 1 (Gelato Prep)',
    operator: 'K. Prasit',
    qcVerifier: 'K. Sompon (QC Controller)',
    scaleId: 'SCALE-W-302 (Calibrated)',
    temperature: 24.2,
    humidity: 52,
    notes: 'Sensory inspection evaluated at weigher room. No crystal discoloration.'
  },
  {
    id: 'RM-PCK-502',
    pickedAt: '2026-06-05 11:30',
    sku: 'RM-ING-101',
    name: 'Refined Fine-Grain Sugar Extra-Fine',
    category: 'Ingredient',
    lotNo: 'LOT-SUG-445',
    locationZone: 'RM-ZONE-B',
    requestedQty: 2500.00,
    actualQty: 2501.20,
    unit: 'Kg',
    status: 'Completed',
    prodOrderRef: 'MO-2026-102A',
    targetLine: 'Line B - Blending Silo 4',
    operator: 'K. Wanna',
    qcVerifier: 'K. Sompon (QC Controller)',
    scaleId: 'SCALE-W-905 (Bulk Platform)',
    temperature: 25.1,
    humidity: 58,
    notes: 'Bulk transfer verified by forklift supervisor and automatic silo intake telemetry.'
  },
  {
    id: 'RM-PCK-503',
    pickedAt: '2026-06-05 09:45',
    sku: 'RM-CHEM-52',
    name: 'Concentrated Caustic Soda 98% (NaOH)',
    category: 'Chemical',
    lotNo: 'LOT-CS-990',
    locationZone: 'RM-CHEM (Restricted)',
    requestedQty: 45.00,
    actualQty: 44.10,
    unit: 'Kg',
    status: 'Tolerance Watch',
    prodOrderRef: 'MO-CHEM-908',
    targetLine: 'Line C - Cleansing Tank System',
    operator: 'K. Somchai',
    qcVerifier: 'K. Somsak (Hazard Safety)',
    scaleId: 'SCALE-W-015 (Hazardous Lab)',
    temperature: 22.8,
    humidity: 45,
    notes: 'Actual weight is slightly lower (-2.00% variance) than theoretical recipe, but within tolerance threshold.'
  },
  {
    id: 'RM-PCK-504',
    pickedAt: '2026-06-04 16:20',
    sku: 'RM-PKG-002',
    name: 'Aluminum Foil Pack Liner 30cm',
    category: 'Packaging',
    lotNo: 'LOT-PKG-88A',
    locationZone: 'RM-ZONE-A',
    requestedQty: 1000.00,
    actualQty: 1000.00,
    unit: 'Pcs',
    status: 'Completed',
    prodOrderRef: 'MO-2026-101F',
    targetLine: 'Line F - High-Speed Pouch Sealer',
    operator: 'K. Somchai',
    qcVerifier: 'K. Wanna (Pack Line Lead)',
    scaleId: 'COUNT-CTR-40',
    temperature: 24.8,
    humidity: 51,
    notes: 'Tear testing on the foil liner passed during picking and set assembly.'
  },
  {
    id: 'RM-PCK-505',
    pickedAt: '2026-06-04 10:10',
    sku: 'RM-ING-105',
    name: 'Industrial Creamer Base Compound Z2',
    category: 'Chemical',
    lotNo: 'LOT-CRM-Z2',
    locationZone: 'RM-CHEM (Secure)',
    requestedQty: 600.00,
    actualQty: 603.50,
    unit: 'Liters',
    status: 'Passed with Exemption',
    prodOrderRef: 'MO-2026-099B',
    targetLine: 'Line C - Mixing Tank 2',
    operator: 'K. Prasit',
    qcVerifier: 'K. Sompon (QC Controller)',
    scaleId: 'FLOW-MTR-02',
    temperature: 23.5,
    humidity: 53,
    notes: 'Flow meter discrepancy registered +0.58%. Accepted after visual density check by QC Supervisor.'
  },
  {
    id: 'RM-PCK-506',
    pickedAt: '2026-06-03 15:40',
    sku: 'RM-PKG-005',
    name: 'Shrink-Wrap Thermal Film Roll 50cm',
    category: 'Packaging',
    lotNo: 'LOT-SF-032',
    locationZone: 'RM-ZONE-A',
    requestedQty: 15.00,
    actualQty: 15.00,
    unit: 'Rolls',
    status: 'Completed',
    prodOrderRef: 'MO-2026-088P',
    targetLine: 'Line G - Shrink Wrapping Unit',
    operator: 'K. Anon',
    qcVerifier: 'K. Somchai (Line Supervisor)',
    scaleId: 'Visual Count Checked',
    temperature: 26.0,
    humidity: 50,
    notes: 'Shrink wrap rolls verified visually on delivery pallet.'
  },
  {
    id: 'RM-PCK-507',
    pickedAt: '2026-06-03 08:30',
    sku: 'RM-ENG-411',
    name: 'High-Temperature PTFE Sealing O-Ring',
    category: 'Spare Part',
    lotNo: 'LOT-SP-1033',
    locationZone: 'RM-ZONE-ENGINEER',
    requestedQty: 8.00,
    actualQty: 5.00,
    unit: 'Pcs',
    status: 'Quality Hold',
    prodOrderRef: 'MR-ENG-7023',
    targetLine: 'Line A - Maintenance Assembly',
    operator: 'K. Sompong (Technician Lead)',
    qcVerifier: 'K. Vichai (Engineering Lead)',
    scaleId: 'Visual Count Checked',
    temperature: 24.1,
    humidity: 49,
    notes: 'Slight picking discrepancy! Only 5 units were available in Bin #411. Backordered 3 units for safety.'
  },
  {
    id: 'RM-PCK-508',
    pickedAt: '2026-06-02 13:10',
    sku: 'RM-ING-109',
    name: 'Premium Vanillin Crystals Extra-Pure',
    category: 'Ingredient',
    lotNo: 'LOT-VAN-2501',
    locationZone: 'RM-ZONE-B',
    requestedQty: 80.00,
    actualQty: 80.12,
    unit: 'Kg',
    status: 'Completed',
    prodOrderRef: 'MO-2026-095',
    targetLine: 'Line A - Mixer 2',
    operator: 'K. Prasit',
    qcVerifier: 'K. Sompon (QC Controller)',
    scaleId: 'SCALE-W-302 (Calibrated)',
    temperature: 24.5,
    humidity: 50,
    notes: 'Released from previous buffer batch without abnormalities.'
  },
  {
    id: 'RM-PCK-509',
    pickedAt: '2026-06-01 11:00',
    sku: 'RM-CHEM-50',
    name: 'Active Liquid Acid Clean-Agent Grade-A',
    category: 'Chemical',
    lotNo: 'LOT-ACD-502',
    locationZone: 'RM-CHEM (Restricted)',
    requestedQty: 200.00,
    actualQty: 200.00,
    unit: 'Liters',
    status: 'Completed',
    prodOrderRef: 'MO-CIP-508A',
    targetLine: 'CIP Cleaning Manifold - Central',
    operator: 'K. Somchai',
    qcVerifier: 'K. Somsak (Hazard Safety)',
    scaleId: 'FLOW-MTR-01',
    temperature: 22.9,
    humidity: 47,
    notes: 'No safety issues. Clean-in-place chemical dispatched via central pipeline directly.'
  }
];

export default function RMPickingHistory() {
  const [history, setHistory] = useState<RMPickingLog[]>(() => {
    const saved = localStorage.getItem('RM_PICKING_HISTORY');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PICKING_HISTORY;
      }
    }
    return INITIAL_PICKING_HISTORY;
  });

  useEffect(() => {
    localStorage.setItem('RM_PICKING_HISTORY', JSON.stringify(history));
  }, [history]);

  // Filters State
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [quickDateRange, setQuickDateRange] = useState('All');

  // Selected Item Detail modal
  const [selectedLog, setSelectedLog] = useState<RMPickingLog | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  // Quick select date ranges logic
  useEffect(() => {
    const today = new Date();
    // Helper to format Date to YYYY-MM-DD
    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (quickDateRange === 'today') {
      const formatted = formatDate(today);
      setStartDate(formatted);
      setEndDate(formatted);
    } else if (quickDateRange === '7days') {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 7);
      setStartDate(formatDate(pastDate));
      setEndDate(formatDate(today));
    } else if (quickDateRange === '30days') {
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 30);
      setStartDate(formatDate(pastDate));
      setEndDate(formatDate(today));
    } else if (quickDateRange === 'All') {
      setStartDate('');
      setEndDate('');
    }
  }, [quickDateRange]);

  // Apply filters to historical logs
  const filteredLogs = useMemo(() => {
    return history.filter((log) => {
      // 1. Text Search query (matches ID, SKU, Material name, Lot, operator, targetLine, prodOrderRef)
      const matchText =
        log.id.toLowerCase().includes(search.toLowerCase()) ||
        log.sku.toLowerCase().includes(search.toLowerCase()) ||
        log.name.toLowerCase().includes(search.toLowerCase()) ||
        log.lotNo.toLowerCase().includes(search.toLowerCase()) ||
        log.operator.toLowerCase().includes(search.toLowerCase()) ||
        log.targetLine.toLowerCase().includes(search.toLowerCase()) ||
        log.prodOrderRef.toLowerCase().includes(search.toLowerCase());

      // 2. Category match
      const matchCategory = categoryFilter === 'All' || log.category === categoryFilter;

      // 3. Status match
      const matchStatus = statusFilter === 'All' || log.status === statusFilter;

      // 4. Date range filter
      let matchDate = true;
      const recordDateString = log.pickedAt.split(' ')[0]; // Extract YYYY-MM-DD from '2026-06-05 14:15'
      if (startDate) {
        matchDate = matchDate && recordDateString >= startDate;
      }
      if (endDate) {
        matchDate = matchDate && recordDateString <= endDate;
      }

      return matchText && matchCategory && matchStatus && matchDate;
    });
  }, [history, search, categoryFilter, statusFilter, startDate, endDate]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setQuickDateRange('All');
  };

  // Variance statistics calculation
  const stats = useMemo(() => {
    const totalCount = filteredLogs.length;

    // Sum total target weight vs actual weight
    let totalTargetWeight = 0;
    let totalActualWeight = 0;
    let discrepancyCount = 0;

    filteredLogs.forEach((log) => {
      totalTargetWeight += log.requestedQty;
      totalActualWeight += log.actualQty;

      // Variance check (if error rate > 0.5% or has non-complete status)
      const pct = log.requestedQty > 0 ? (Math.abs(log.actualQty - log.requestedQty) / log.requestedQty) * 100 : 0;
      if (pct > 0.5 || log.status === 'Quality Hold' || log.status === 'Tolerance Watch') {
        discrepancyCount++;
      }
    });

    const averageVarianceRate = totalTargetWeight > 0 
      ? (Math.abs(totalActualWeight - totalTargetWeight) / totalTargetWeight) * 100 
      : 0;

    return {
      totalCount,
      totalTargetWeight,
      totalActualWeight,
      discrepancyCount,
      averageVarianceRate
    };
  }, [filteredLogs]);

  // --- Real-world CSV Deep Export ---
  const handleExportCSV = () => {
    // Defines standard column header
    const headers = [
      'Picking ID',
      'Picked Date/Time',
      'Material SKU',
      'Material Name',
      'Lot Number',
      'Category',
      'Zone Location',
      'Target Requested (Soll)',
      'Actual Picked (Ist)',
      'Variance Ratio',
      'Unit',
      'Audit Status',
      'Production Order Ref',
      'Destination Target Line',
      'Picking Operator',
      'QC Verifier Name',
      'Scale ID Terminal',
      'Environment Temp (C)',
      'Environment Humidity (%)',
      'Inspection Notes / Comments'
    ];

    // Data rows with deep associated details extracted in columns to respect the depth guideline
    const rows = filteredLogs.map((log) => {
      const varianceVal = log.actualQty - log.requestedQty;
      const variancePct = log.requestedQty > 0 ? (varianceVal / log.requestedQty) * 100 : 0;
      const varianceStr = `${varianceVal.toFixed(2)} (${variancePct.toFixed(2)}%)`;

      return [
        `"${log.id}"`,
        `"${log.pickedAt}"`,
        `"${log.sku}"`,
        `"${log.name.replace(/"/g, '""')}"`,
        `"${log.lotNo}"`,
        `"${log.category}"`,
        `"${log.locationZone}"`,
        log.requestedQty.toFixed(2),
        log.actualQty.toFixed(2),
        `"${varianceStr}"`,
        `"${log.unit}"`,
        `"${log.status}"`,
        `"${log.prodOrderRef}"`,
        `"${log.targetLine.replace(/"/g, '""')}"`,
        `"${log.operator}"`,
        `"${log.qcVerifier}"`,
        `"${log.scaleId}"`,
        log.temperature,
        log.humidity,
        `"${(log.notes || '').replace(/"/g, '""')}"`
      ];
    });

    // Merge together with boundary formatting
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RM_Picking_History_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger batch A4 raw print
  const handlePrintBatchReport = () => {
    window.print();
  };

  return (
    <div className="flex flex-col space-y-4 animate-fadeIn font-sans text-left text-[#212c46] w-full max-w-[1400px] mx-auto p-1">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#cbd5e1]/60 pb-4 print:hidden">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#212c46] flex items-center gap-2">
            <div className="p-1 px-2.5 rounded-xl bg-[#212c46]/5 text-[#212c46] border border-[#212c46]/10">
              <Icons.History size={20} className="inline text-[#b58c4f]" />
            </div>
            ประวัติการเบิกจ่ายวัตถุดิบ (RM Picking History Logs)
          </h1>
          <p className="text-[12px] text-[#7a8b95] font-semibold mt-1">
            รายงานชุดตรวจสอบความถูกต้องทางน้ำหนักของวัตถุดิบป้อนเข้าเครื่องจักรปั่น Blending ทั่วคลังหลัก และควบคุมค่าเศษส่วนเบี่ยงเบนความคลาดเคลื่อน (Tolerance Limits)
          </p>
        </div>

        {/* TOP LEVEL CONTROLS */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-[#eaeaec] text-[#212c46] hover:text-[#b58c4f] hover:border-[#b58c4f] font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Icons.Download size={13} /> Export Deep CSV
          </button>
          
          <button
            onClick={handlePrintBatchReport}
            className="flex-1 md:flex-none px-4 py-2.5 bg-[#212c46] hover:bg-[#a94228] text-white border border-[#212c46] font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Icons.Printer size={13} className="text-[#b58c4f]" /> Print Audit Report
          </button>
        </div>
      </div>

      {/* KPI STATISTICAL MONITOR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 print:hidden">
        
        {/* Total Transactions Checked */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[96px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">ชุดการเบิกจ่ายป้อนงาน (Audited Logs)</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#212c46]/5 border border-[#212c46]/10 text-[#4d87a8]">
              <Icons.ClipboardCheck size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-black text-[#212c46] font-mono leading-none">
              {stats.totalCount} <span className="text-[12px] font-bold text-slate-400">ครั้งเบิก</span>
            </p>
            <span className="text-[9px] font-bold text-[#657f4d] bg-[#657f4d]/10 px-1.5 py-0.5 rounded uppercase font-mono">100% Tracking</span>
          </div>
        </div>

        {/* Total Weights Dispatched */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[96px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">ปริมาตรเบิกจริงรวม (Actual Material Volume)</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#b58c4f]/5 border border-[#b58c4f]/10 text-[#b58c4f]">
              <Icons.Scale size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-black text-[#212c46] font-mono leading-none">
              {stats.totalActualWeight.toLocaleString('th-TH', { maximumFractionDigits: 2 })} <span className="text-[12px] font-bold text-slate-400">Units</span>
            </p>
            <div className="text-right">
              <span className="text-[9px] font-bold text-[#7a8b95] block">เป้าหมาย: {stats.totalTargetWeight.toLocaleString('th-TH')}</span>
            </div>
          </div>
        </div>

        {/* Deviation / Outlier Count */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[96px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">ความคลาดเคลื่อน / รออนุมัติพิเศษ (Discrepancies)</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#932c2e]/5 border border-[#932c2e]/10 text-[#932c2e]">
              <Icons.AlertTriangle size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-black text-[#932c2e] font-mono leading-none">
              {stats.discrepancyCount} <span className="text-[12px] font-bold text-slate-400">รายการ</span>
            </p>
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded font-mono ${
              stats.discrepancyCount > 0 ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#657f4d]/10 text-[#657f4d]'
            }`}>
              {stats.totalCount > 0 ? ((stats.discrepancyCount / stats.totalCount) * 100).toFixed(1) : '0'}% Rate
            </span>
          </div>
        </div>

        {/* Net Precision Rate */}
        <div className="bg-white p-4 rounded-2xl border border-[#eaeaec] shadow-sm flex flex-col justify-between min-h-[96px] hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider block">อัตราชั่งเฉลี่ยคลาดเคลื่อน (Net Mean Devia)</span>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#657f4d]/5 border border-[#657f4d]/10 text-[#657f4d]">
              <Icons.Activity size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between mt-2">
            <p className="text-2xl font-black text-[#657f4d] font-mono leading-none">
              ±{stats.averageVarianceRate.toFixed(3)}%
            </p>
            <span className="text-[9px] font-bold text-[#7a8b95] uppercase font-mono">Tolerance ISO 9001</span>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE FILTER SYSTEM */}
      <div className="bg-white rounded-2xl border border-[#eaeaec] p-4 shadow-sm flex flex-col gap-4 print:hidden">
        
        {/* Top filter row: Text Search and Quick Date Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Text Search input */}
          <div className="relative md:col-span-4">
            <Icons.Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาตาม Picking ID, SKU, ล็อต, พนักงานเบิก..."
              className="w-full pl-9 pr-4 py-2 border border-[#eaeaec] bg-[#f8f9fa] rounded-xl font-bold text-[11.5px] outline-none text-[#212c46] focus:border-[#4d87a8] placeholder-slate-400 shadow-inner"
            />
          </div>

          {/* Quick Date Range Quick buttons */}
          <div className="md:col-span-5 flex flex-wrap gap-1 rounded-xl bg-slate-50 border p-1 border-[#eaeaec]">
            {[
              { id: 'All', lang: 'ประวัติทั้งหมด (All)' },
              { id: 'today', lang: 'วันนี้ (Today)' },
              { id: '7days', lang: '7 วันที่ผ่านมา' },
              { id: '30days', lang: '30 วันที่ผ่านมา' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setQuickDateRange(d.id)}
                className={`flex-1 min-w-[60px] py-1 px-2.5 rounded-lg text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                  quickDateRange === d.id 
                    ? 'bg-[#212c46] text-white shadow-sm' 
                    : 'text-[#7a8b95] hover:text-[#414757]'
                }`}
              >
                {d.lang}
              </button>
            ))}
          </div>

          {/* Refresh / Clear Button */}
          <button
            onClick={handleClearFilters}
            className="md:col-span-3 w-full px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-[#eaeaec] text-[#414757] font-black rounded-xl text-[10.5px] flex items-center justify-center gap-1.5 transition-colors self-stretch"
          >
            <Icons.XCircle size={13} className="text-slate-400" /> ล้างตัวกรอง (Clear All Filters)
          </button>
        </div>

        {/* Secondary filter selectors: Date picker inputs & Dropdown selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Start Date */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">ตั้งแต่วันที่ (Start Date)</span>
            <div className="relative">
              <Icons.Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setQuickDateRange('Custom');
                }}
                className="w-full pl-8 pr-3 py-1.5 border border-[#eaeaec] bg-white rounded-xl font-mono text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">ถึงวันที่ (End Date)</span>
            <div className="relative">
              <Icons.Calendar size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setQuickDateRange('Custom');
                }}
                className="w-full pl-8 pr-3 py-1.5 border border-[#eaeaec] bg-white rounded-xl font-mono text-[11px] font-bold text-[#212c46] outline-none focus:border-[#4d87a8]"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">หมวดหมู่จัดกลุ่ม (Category)</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#eaeaec] bg-white rounded-xl font-extrabold text-[11px] text-[#212c46] outline-none"
            >
              <option value="All">ทุกหมวดวัตถุดิบ (All)</option>
              <option value="Ingredient">กลุ่มส่วนผสม (Ingredients)</option>
              <option value="Packaging">กลุ่มบรรจุภัณฑ์ (Packaging)</option>
              <option value="Chemical">เคมี/สูตรทดลอง (Chemicals)</option>
              <option value="Spare Part">อะไหล่แผนกช่าง (Spare Parts)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">สถานะประเมินผล (Review Status)</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-1.5 border border-[#eaeaec] bg-white rounded-xl font-extrabold text-[11px] text-[#212c46] outline-none"
            >
              <option value="All">ทุกระดับความคลาดเคลื่อน (All Statuses)</option>
              <option value="Completed">Completed / เป็นไปตามเกณฑ์สูตร</option>
              <option value="Tolerance Watch">Tolerance Watch / เฝ้าระวังต่ำ-สูง</option>
              <option value="Passed with Exemption">Passed with Exemption / อนุมัติยกเว้นพิเศษ</option>
              <option value="Quality Hold">Quality Hold / กักระงับการปล่อย</option>
            </select>
          </div>

        </div>
      </div>

      {/* FILTER RESULTS ROW */}
      <div className="flex justify-between items-center px-1 text-[11px] text-[#7a8b95] font-bold uppercase tracking-wider print:hidden">
        <span>ค้นพบข้อมูลประวัติทั้งหมด {filteredLogs.length} รายการ</span>
        <span className="flex items-center gap-1"><Icons.Info size={11} className="text-[#4d87a8]" /> คลิกที่แถวรายการเพื่อเรียกบันทึกชั่งเช็คเชิงลึก (Audit Detail)</span>
      </div>

      {/* DATA GRID TABLE */}
      <div className="bg-white rounded-2xl border border-[#eaeaec] shadow-sm overflow-hidden min-h-[400px] print:hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#212c46]/5 text-[#212c46] uppercase text-[10px] font-black tracking-widest border-b border-[#eaeaec]">
              <th className="py-3 px-4">วันที่ชั่งจ่าย (Picked At)</th>
              <th className="py-3 px-3">Picking ID</th>
              <th className="py-3 px-4">รหัสวัตถุดิบ / ชื่อรายการ</th>
              <th className="py-3 px-3">ล็อต (Lot No.)</th>
              <th className="py-3 px-3 text-right">น้ำหนักเป้าหมาย</th>
              <th className="py-3 px-3 text-right">น้ำหนักชั่งจริง</th>
              <th className="py-3 px-3 text-right">ผลต่างชั่ง (Var)</th>
              <th className="py-3 px-3">หมวดหมู่</th>
              <th className="py-3 px-4 text-center">สถานะ</th>
              <th className="py-3 px-4 text-center">พนักงานผู้เบิก</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eaeaec] text-[11.5px]">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => {
                const varianceVal = log.actualQty - log.requestedQty;
                // Calculate percentage deviation
                const variancePct = log.requestedQty > 0 ? (varianceVal / log.requestedQty) * 100 : 0;
                
                // Color formatting for variance (tolerance watch threshold: 0.5%)
                const isDiscrepant = Math.abs(variancePct) > 0.5;
                const isHold = log.status === 'Quality Hold';

                return (
                  <tr
                    key={log.id}
                    onClick={() => {
                      setSelectedLog(log);
                      setIsOpenDetail(true);
                    }}
                    className="hover:bg-slate-50/75 cursor-pointer transition-colors active:bg-slate-100/50"
                  >
                    {/* Date */}
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-[#414757] font-semibold">
                      {log.pickedAt}
                    </td>

                    {/* ID */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-black text-[#3f809e]">
                      {log.id}
                    </td>

                    {/* Material Information */}
                    <td className="py-3 px-4 max-w-[280px]">
                      <div className="font-mono text-[#b58c4f] font-bold text-[10px]">{log.sku}</div>
                      <div className="font-extrabold text-[#212c46] truncate mt-0.5" title={log.name}>{log.name}</div>
                    </td>

                    {/* Lot Number */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-slate-500 font-bold">
                      {log.lotNo}
                    </td>

                    {/* Target Quantity */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-bold text-slate-500">
                      {log.requestedQty.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <span className="text-[9.5px] text-slate-400 font-sans">{log.unit}</span>
                    </td>

                    {/* Actual Quantity */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono font-black text-[#212c46]">
                      {log.actualQty.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <span className="text-[9.5px] text-slate-400 font-sans">{log.unit}</span>
                    </td>

                    {/* Weight Variance column with visual alert colors */}
                    <td className={`py-3 px-3 text-right whitespace-nowrap font-mono font-black ${
                      isHold 
                        ? 'text-[#932c2e]' 
                        : isDiscrepant 
                        ? 'text-[#a94228]' 
                        : 'text-[#657f4d]'
                    }`}>
                      {varianceVal >= 0 ? `+${varianceVal.toFixed(2)}` : varianceVal.toFixed(2)}
                      <span className="text-[8.5px] block font-bold">({variancePct >= 0 ? '+' : ''}{variancePct.toFixed(2)}%)</span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[9.5px] font-bold text-[#7a8b95] uppercase bg-[#f1f3f5] border border-slate-200 rounded px-1.5 py-0.5">
                        {log.category}
                      </span>
                    </td>

                    {/* Status badges */}
                    <td className="py-3 px-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        log.status === 'Completed'
                          ? 'bg-[#657f4d]/10 text-[#657f4d] border border-[#657f4d]/20'
                          : log.status === 'Tolerance Watch'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : log.status === 'Passed with Exemption'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-[#932c2e]/10 text-[#932c2e] border border-[#932c2e]/20'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    {/* Operator */}
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600 pl-4">
                      <div className="flex items-center gap-1">
                        <Icons.User size={10} className="text-slate-400" />
                        <span>{log.operator}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-16 text-center text-[#7a8b95]">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <Icons.FileQuestion size={40} className="opacity-30 text-[#b58c4f]" />
                    <div>
                      <p className="font-extrabold text-[13px] text-[#212c46] uppercase tracking-wider">ไม่พบข้อมูลประวัติการเบิกจ่าย</p>
                      <p className="text-[11px] text-[#7a8b95] mt-1">โปรดตรวจสอบคำค้นหาหรือตัวกรองช่วงวันที่ใหม่อีกครั้ง</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DETAILED DRILLDOWN MODAL W/ WEIGHT STABILITY TELEMETRY */}
      {isOpenDetail && selectedLog && (
        <DraggableModal
          isOpen={isOpenDetail}
          onClose={() => setIsOpenDetail(false)}
          title={`ใบบันทึกชั่งตรวจจ่ายเบิกและคัดกรองความปลอดภัย: ${selectedLog.id}`}
          width="max-w-[750px]"
        >
          <div className="p-5 text-left text-[11.5px] text-[#414757] space-y-4 font-sans max-h-[80vh] overflow-y-auto">
            
            {/* Visual Material badge block with Status */}
            <div className="p-4 bg-slate-50 border border-[#eaeaec] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9.5px] font-bold font-mono text-[#4d87a8] uppercase bg-[#4d87a8]/10 px-2 py-0.5 rounded border border-[#4d87a8]/15">{selectedLog.sku}</span>
                  <span className="text-[9.5px] font-bold text-slate-400 font-mono">LOT ID: {selectedLog.lotNo}</span>
                </div>
                <h4 className="font-extrabold text-[15px] text-[#212c46] mt-2">{selectedLog.name}</h4>
                <div className="flex items-center gap-4 text-[10.5px] mt-1.5 font-semibold text-slate-500">
                  <span className="flex items-center gap-1"><Icons.MapPin size={11} className="text-[#b58c4f]"/> {selectedLog.locationZone}</span>
                  <span className="flex items-center gap-1"><Icons.Clock size={11}/> วันเวลาเซ็นรับ: {selectedLog.pickedAt}</span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                selectedLog.status === 'Completed'
                  ? 'bg-green-50 text-green-600 border-green-100'
                  : selectedLog.status === 'Tolerance Watch'
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : selectedLog.status === 'Passed with Exemption'
                  ? 'bg-blue-50 text-blue-600 border-blue-100'
                  : 'bg-red-50 text-red-600 border-red-100'
              }`}>
                {selectedLog.status}
              </span>
            </div>

            {/* WEIGHT ACCURACY TELEMETRY SYSTEM */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h5 className="text-[10px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-1.5 mb-3">
                <Icons.Layers size={13} className="text-[#b58c4f]"/> น้ำหนักทางฟิสิกส์ & สถิติชั่งเช็คบอร์ด (WEIGHING STABILITY TELEMETRY)
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Target */}
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-[#7a8b95] uppercase block">เป้าหมายตามสูตรผสม (Target Recipe)</span>
                  <span className="text-xl font-bold font-mono text-slate-500 mt-1">
                    {selectedLog.requestedQty.toFixed(2)} <span className="text-[11px] font-sans text-slate-400">{selectedLog.unit}</span>
                  </span>
                </div>

                {/* Actual Scale Weight */}
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-[#7a8b95] uppercase block">ค่าน้ำหนักชั่งเบิกจริง (Actual Picked)</span>
                  <span className="text-xl font-black font-mono text-[#212c46] mt-1">
                    {selectedLog.actualQty.toFixed(2)} <span className="text-[11px] font-sans text-slate-400">{selectedLog.unit}</span>
                  </span>
                </div>

                {/* Physical Variance */}
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] flex flex-col justify-center">
                  <span className="text-[9px] font-bold text-[#7a8b95] uppercase block">ค่าต่างนัยสำคัญ (Absolute Variance)</span>
                  {(() => {
                    const diff = selectedLog.actualQty - selectedLog.requestedQty;
                    const pct = selectedLog.requestedQty > 0 ? (diff / selectedLog.requestedQty) * 100 : 0;
                    const sign = diff >= 0 ? '+' : '';
                    return (
                      <span className={`text-xl font-black font-mono mt-1 ${
                        Math.abs(pct) > 0.5 ? 'text-[#a94228]' : 'text-[#657f4d]'
                      }`}>
                        {sign}{diff.toFixed(2)} <span className="text-[11px] font-sans font-bold">({sign}{pct.toFixed(2)}%)</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* PROCESS AND ENVIRONMENT CONTROL METADATA */}
            <div className="grid grid-cols-2 gap-4">
              
              {/* Order and Machinery Routing */}
              <div className="space-y-2.5">
                <h5 className="text-[10px] font-black uppercase text-[#212c46] tracking-widest border-b pb-1">เอกสารอ้างอิงและจุดเป้าหมาย</h5>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase block">ใบสั่งผลิตหลัก (PO Ref)</span>
                    <span className="font-mono font-bold text-[#212c46] block bg-slate-100 px-2 py-1 rounded text-[11px] mt-0.5">{selectedLog.prodOrderRef}</span>
                  </div>
                  <div>
                    <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase block">เครื่องชั่งสถานีไฟฟ้า</span>
                    <span className="font-mono font-bold text-[#212c46] block bg-slate-100 px-2 py-1 rounded text-[10px] mt-0.5 truncate" title={selectedLog.scaleId}>{selectedLog.scaleId}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase block">จุดส่งป้อนและสายงานที่กำหนด (Line Target)</span>
                  <p className="font-extrabold text-[#212c46] text-[11px] mt-0.5 bg-slate-100/60 px-2.5 py-1.5 rounded">{selectedLog.targetLine}</p>
                </div>
              </div>

              {/* Environmental Telemetry */}
              <div className="space-y-2.5 bg-slate-50/50 p-2.5 rounded-xl border">
                <h5 className="text-[10px] font-black uppercase text-[#212c46] tracking-widest border-b pb-1">ข้อมูลคุมสภาพแวดล้อมห้องชั่งสาร</h5>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[8px] font-bold text-[#7a8b95] uppercase block">อุณหภูมิห้องชั่ง (Temp)</span>
                    <span className="text-[13px] font-bold font-mono text-[#212c46] mt-0.5 block">☼ {selectedLog.temperature} °C</span>
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <span className="text-[8px] font-bold text-[#7a8b95] uppercase block">ความชื้นสัมพัทธ์ (Humid)</span>
                    <span className="text-[13px] font-bold font-mono text-[#212c46] mt-0.5 block">☁ {selectedLog.humidity} %RH</span>
                  </div>
                </div>

                <div className="text-[9px] text-[#7a8b95] leading-normal">
                  *สอดรับเกณฑ์ป้องกันฝุ่นคริสตัลระเบิดและการจับเป็นก้อนเหนียวหนืดของวัตถุดิบเคมี
                </div>
              </div>
            </div>

            {/* AUDIT TIMELINE AND HANDOVER SIGNATURE CODES */}
            <div className="border border-[#eaeaec] rounded-2xl overflow-hidden text-[11px]">
              <div className="bg-slate-50 px-3 py-2 border-b font-extrabold text-[#212c46]">รายชื่อบุคลากรผู้ตรวจชั่งและส่งมอบล็อตเพื่อความโปร่งใส (Audited Handover Signs)</div>
              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3 divide-y md:divide-y-0 md:divide-x divide-[#eaeaec]">
                <div>
                  <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase block">1. ผู้ชั่งเบิกพัสดุ (Issued Picking Operator)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-mono text-[9px] font-black text-slate-600">P</div>
                    <span className="text-[#212c46] font-bold">{selectedLog.operator}</span>
                    <span className="text-[9px] font-mono text-slate-400">(ID: OPER-0322)</span>
                  </div>
                </div>
                <div className="pt-2 md:pt-0 md:pl-3">
                  <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase block">2. ผู้รับสิทธิและตรวจคุณภาพ (QC Lead Approver)</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-5 h-5 rounded-full bg-[#cbd5e1] text-[#212c46] flex items-center justify-center font-mono text-[9px] font-black">QC</div>
                    <span className="text-[#212c46] font-bold">{selectedLog.qcVerifier}</span>
                    <span className="text-[9px] font-mono text-slate-400">(ID: QC-251)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection report summary notes */}
            <div>
              <span className="block text-[9.5px] font-black text-[#7a8b95] uppercase mb-1">หมายเหตุสรุปจาก QC และ แผนกจัดเตรียมสาร</span>
              <p className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/50 text-[#7c5d39] font-semibold leading-relaxed whitespace-pre-line text-[11px]">
                {selectedLog.notes || 'ไม่มีบันทึกข้อมูลหมายเหตุพิเศษใดๆ เพิ่มเติม'}
              </p>
            </div>

            {/* Sub components list (Fast Audit Depth View for Associated Data) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden text-[10.5px]">
              <div className="bg-slate-50 px-3 py-1.5 border-b font-bold text-slate-600">ตรวจตราคุณลักษณะไร้ข้อบกพร่อง (Sub-Item Associated Standard Attributes)</div>
              <div className="p-3 space-y-1 bg-white font-mono text-slate-500">
                <div className="flex justify-between">
                  <span>- Chemical Properties Standard Checks:</span>
                  <span className="text-green-600 font-bold">● PASSED</span>
                </div>
                <div className="flex justify-between">
                  <span>- Moisture / Purity Target Content Check (&lt;0.05%):</span>
                  <span className="text-green-600 font-bold">● PASSED</span>
                </div>
                <div className="flex justify-between">
                  <span>- Container/Pouch Seal Integrity Multi-Check:</span>
                  <span className="text-green-600 font-bold">● PASSED</span>
                </div>
              </div>
            </div>

            {/* Actions for single item receipt printing */}
            <div className="flex justify-between items-center pt-3.5 border-t border-[#eaeaec]">
              <button
                type="button"
                onClick={() => {
                  alert(`สั่งพิมพ์สติ๊กเกอร์ระบุน้ำหนักคัดกรองเบิกใช้สำหรับล็อตงานพิเศษ...\nเลขที่: ${selectedLog.id}\nสำหรับใบจัดเตรียมผสมที่: ${selectedLog.prodOrderRef}\nน้ำหนักชั่งจริงรวม: ${selectedLog.actualQty} ${selectedLog.unit}`);
                }}
                className="px-4 py-2 border border-[#b58c4f] hover:bg-[#b58c4f] hover:text-white rounded-xl text-[#b58c4f] font-black text-[10.5px] uppercase tracking-wider transition-all flex items-center gap-1.5"
              >
                <Icons.Barcode size={13} /> Print ID Tag
              </button>
              
              <button
                type="button"
                onClick={() => setIsOpenDetail(false)}
                className="px-6 py-2.5 bg-[#212c46] hover:bg-slate-800 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all"
              >
                เสร็จสิ้นการตรวจสอบ
              </button>
            </div>
          </div>
        </DraggableModal>
      )}

      {/* --- STANDARDIZED PRINT-ONLY PAPER REPORT STRUCTURE (A4) --- */}
      {/* Hidden natively on screen through tailwind "hidden print:block" */}
      <div className="hidden print:block w-full max-w-[210mm] mx-auto bg-white p-6 font-sans text-black" id="printable-area-history">
        <style dangerouslySetInnerHTML={{ __html: `
          @page { size: A4 portrait; margin: 15mm; }
          @media print {
            body { background: white; color: black; font-size: 11px; }
            #printable-area-history { display: block !important; }
            .print\\:hidden, header, footer, nav, aside, button, .no-print { display: none !important; }
          }
        ` }} />

        {/* Corporate Logo & Title Block */}
        <div className="border-b-[4px] border-[#212c46] pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Standard Vector Logo rendering nicely in black and white */}
            <div className="w-10 h-10 border-[3px] border-[#212c46] rounded-xl flex items-center justify-center font-mono font-black text-lg text-[#212c46]">
              PRM
            </div>
            <div>
              <h2 className="font-extrabold text-[15px] leading-tight uppercase text-[#212c46]">PREMIUM INGREDIENTS & CHEMICALS CO., LTD.</h2>
              <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">คลังวัตถุดิบและเคมีภัณฑ์ป้อนผลิตกลาง • แผนกตรวจสอบความต่างและประสานความปลอดภัย</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-black text-xl text-gray-900 leading-none">AUDIT REPORT</h1>
            <p className="text-[9.5px] text-gray-500 font-bold mt-1">ประวัติการเบิกจ่ายวัตถุดิบสะสม</p>
          </div>
        </div>

        {/* Document Audit Meta */}
        <div className="grid grid-cols-3 gap-4 border border-gray-300 rounded p-3 bg-gray-50/50 mt-4 text-[10px] leading-relaxed relative">
          <div className="absolute -top-6 right-0 text-[9px] font-mono font-bold text-gray-500">DATE PRINTED: {new Date().toLocaleString()}</div>
          <div>
            <strong>รหัสรายงาน (Report Code):</strong> <span className="font-mono text-[11.5px] font-bold">RMP-AUD-2026-06B</span>
          </div>
          <div>
            <strong>วันที่สั่งพิมพ์รายงาน (Issued Date):</strong> <span className="font-mono">2026-06-05 18:15</span>
          </div>
          <div>
            <strong>พิมพ์โดย (Operator Auditor):</strong> <span>fon3.phichamon@gmail.com</span>
          </div>
        </div>

        {/* Filter Summary context for physical readers */}
        <div className="mt-4 text-[9.5px] text-gray-600 font-semibold border-l-2 border-gray-400 pl-2">
          *เอกสารจัดพิมพ์สรุปผลตามรายการเบิกจริงที่ผ่านการคัดกรองในเงื่อนไขการตรวจสอบย้อนหลัง (Audited records matching current active filter states)
        </div>

        {/* Printable History Data Table */}
        <table className="w-full mt-6 text-[10px] text-left border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 uppercase font-black tracking-wide border-b border-gray-400">
              <th className="py-2 px-2 border-r border-gray-300 text-center">ว/ด/ป (Date)</th>
              <th className="py-2 px-2 border-r border-gray-300">Picking ID</th>
              <th className="py-2 px-3 border-r border-gray-300">รหัส-ชื่อรายการวัตถุดิบ (SKU Code & Material Name)</th>
              <th className="py-2 px-2 border-r border-gray-300">Lot No.</th>
              <th className="py-2 px-2 border-r border-gray-300 text-right">เป้าสูตร (Target)</th>
              <th className="py-2 px-2 border-r border-gray-300 text-right">ชั่งจริง (Actual)</th>
              <th className="py-2 px-2 border-r border-gray-300 text-right">ส่วนเบี่ยง (Var)</th>
              <th className="py-2 px-2 text-center">ผู้เบิก (Operator)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {filteredLogs.map((log) => {
              const diff = log.actualQty - log.requestedQty;
              const pct = log.requestedQty > 0 ? (diff / log.requestedQty) * 100 : 0;
              return (
                <tr key={log.id} className="border-b border-gray-300">
                  <td className="py-2 px-2 text-center whitespace-nowrap font-mono">{log.pickedAt.split(' ')[0]}</td>
                  <td className="py-2 px-2 whitespace-nowrap font-mono font-bold text-gray-700">{log.id}</td>
                  <td className="py-2 px-3">
                    <span className="font-mono font-bold block text-gray-800">{log.sku}</span>
                    <span className="text-[9.5px] block truncate">{log.name}</span>
                  </td>
                  <td className="py-2 px-2 font-mono text-gray-500 font-medium">{log.lotNo}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">{log.requestedQty.toFixed(2)} {log.unit}</td>
                  <td className="py-2 px-2 text-right font-mono font-extrabold text-black">{log.actualQty.toFixed(2)} {log.unit}</td>
                  <td className="py-2 px-2 text-right font-mono font-bold">
                    {diff >= 0 ? '+' : ''}{diff.toFixed(2)} ({pct >= 0 ? '+' : ''}{pct.toFixed(2)}%)
                  </td>
                  <td className="py-2 px-2 text-center">{log.operator}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals Metric Box bottom page */}
        <div className="mt-4 border border-gray-300 bg-gray-50/70 p-3 rounded grid grid-cols-2 text-[10px] leading-relaxed">
          <div>
            <strong>น้ำหนักชั่งเบิกรวมเป้าหมาย (Sum Target Weights):</strong> <span className="font-mono font-bold">{stats.totalTargetWeight.toLocaleString()} Units</span>
          </div>
          <div className="text-right">
            <strong>น้ำหนักชั่งจ่ายออกสุทธิ (Sum Net Dispatched):</strong> <span className="font-mono font-extrabold">{stats.totalActualWeight.toLocaleString()} Units</span>
          </div>
        </div>

        {/* Corporate Signatures Block - Mandatory for Audit ISO */}
        <div className="mt-12 pt-6 grid grid-cols-3 gap-12 text-center text-[10px]">
          <div className="flex flex-col space-y-12">
            <div className="border-b border-gray-400 w-full"></div>
            <strong>ลงชื่อ ผู้ส่งมอบวัตถุดิบ / พนักงานเบิกจ่าย<br />(Issued & Preweighed By)</strong>
          </div>
          <div className="flex flex-col space-y-12">
            <div className="border-b border-gray-400 w-full"></div>
            <strong>ลงชื่อ เจ้าหน้าที่สายการผลิตผู้รับมอบวัตถุดิบ<br />(Line Received & Verified By)</strong>
          </div>
          <div className="flex flex-col space-y-12">
            <div className="border-b border-gray-400 w-full"></div>
            <strong>ลงชื่อ ผู้ตรวจสอบคุณภาพห้องวิเคราะห์แล็บ<br />(Approved QC Auditor Lead Seal)</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
