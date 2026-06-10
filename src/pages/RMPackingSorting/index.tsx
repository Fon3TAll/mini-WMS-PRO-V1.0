import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Matches Premium Suite ---
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

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(val);
};

// --- KPI Card ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => {
    const IconComponent = (Icons as any)[icon] || Icons.HelpCircle;
    return (
        <div className="bg-white/95 px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b58c4f] transition-all h-[84px] flex flex-col justify-between text-left animate-fadeIn">
            <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                <IconComponent size={70} color={colorAccent} />
            </div>
            <div className="relative z-10 flex justify-between items-start w-full">
                <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] leading-none mt-1">{label}</p>
                <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm" style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                    <IconComponent size={14} />
                </div>
            </div>
            <div className="relative z-10 flex items-end justify-between">
                <p className="text-[18px] font-black leading-none text-[#212c46] font-mono" style={{color: colorValue}}>
                    {value}
                </p>
                <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[#cbd5e1] animate-pulse"></span> {desc}
                </span>
            </div>
        </div>
    );
};

// --- Mock RM Kitting Jobs ---
const MOCK_RM_KITS = [
    {
        id: 'RM-KIT-2601',
        prodOrderRef: 'PROD-2606-001',
        itemName: 'Nescafe Mix Premix Kit Pack 1',
        station: 'Kitting Line A - Food Safe',
        status: 'Kitting',
        targetPacks: 20,
        completedPacks: 12,
        priority: 'High',
        components: [
            { id: 'RM-C1', sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', reqQty: 50, scaleWeight: 49.85, targetWeight: 50.00, weightStatus: 'Verified', unit: 'Kg' },
            { id: 'RM-C2', sku: 'SKU-8809', name: 'Raw Cane Sugar Extra-Fine', reqQty: 250, scaleWeight: 250.00, targetWeight: 250.00, weightStatus: 'Verified', unit: 'Kg' },
            { id: 'RM-C3', sku: 'SKU-8812', name: 'Industrial Creamer Base Z2', reqQty: 100, scaleWeight: 0.00, targetWeight: 100.00, weightStatus: 'Pending Weigh', unit: 'Kg' },
        ]
    },
    {
        id: 'RM-KIT-2602',
        prodOrderRef: 'PROD-2606-002',
        itemName: 'Tom Yum Noodle Secret Spice Bag',
        station: 'Kitting Line B - Chemistry Hood',
        status: 'Pending',
        targetPacks: 10,
        completedPacks: 0,
        priority: 'High',
        components: [
            { id: 'RM-C4', sku: 'SKU-8803', name: 'Chili Powder Premium Grade', reqQty: 400, scaleWeight: 0.00, targetWeight: 400.00, weightStatus: 'Pending Weigh', unit: 'Kg' },
            { id: 'RM-C5', sku: 'SKU-8817', name: 'MSG Monosodium Base Grade-A', reqQty: 800, scaleWeight: 0.00, targetWeight: 800.00, weightStatus: 'Pending Weigh', unit: 'Kg' },
            { id: 'RM-C6', sku: 'SKU-8822', name: 'Dehydrated Shrimp Shell Mince', reqQty: 300, scaleWeight: 0.00, targetWeight: 300.00, weightStatus: 'Pending Weigh', unit: 'Kg' },
        ]
    },
    {
        id: 'RM-KIT-2603',
        prodOrderRef: 'PROD-2606-004',
        itemName: 'Active Detergent Premix Pack B',
        station: 'Kitting Line B - Chemistry Hood',
        status: 'Quality Hold',
        targetPacks: 15,
        completedPacks: 0,
        priority: 'Normal',
        components: [
            { id: 'RM-C7', sku: 'SKU-8808', name: 'Breeze Chemical Active Formula B', reqQty: 800, scaleWeight: 750.00, targetWeight: 800.00, weightStatus: 'Toleration Error', unit: 'Liters' },
            { id: 'RM-C8', sku: 'SKU-8819', name: 'Surfactant Viscose Base Liquid', reqQty: 600, scaleWeight: 600.20, targetWeight: 600.00, weightStatus: 'Verified', unit: 'Liters' },
        ]
    },
    {
        id: 'RM-KIT-2604',
        prodOrderRef: 'PROD-2606-006',
        itemName: 'Softener Fragrance Compound Blue',
        station: 'Kitting Line C - Spares & Packs',
        status: 'Completed',
        targetPacks: 50,
        completedPacks: 50,
        priority: 'Normal',
        components: [
            { id: 'RM-C9', sku: 'SKU-8805', name: 'Sunlight Fragrance Oil Concentrated', reqQty: 50, scaleWeight: 50.05, targetWeight: 50.00, weightStatus: 'Verified', unit: 'Liters' },
            { id: 'RM-C10', sku: 'SKU-8829', name: 'Blue Pigment Dye Liquid WP5', reqQty: 5, scaleWeight: 5.00, targetWeight: 5.00, weightStatus: 'Verified', unit: 'Liters' },
        ]
    }
];

export default function RMPackingSorting() {
    const [kits, setKits] = useState(MOCK_RM_KITS);
    const [selectedKitId, setSelectedKitId] = useState(MOCK_RM_KITS[0].id);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedComponent, setSelectedComponent] = useState<any>(null);
    const [customWeightInput, setCustomWeightInput] = useState('');

    const activeKit = useMemo(() => kits.find(k => k.id === selectedKitId) || kits[0], [kits, selectedKitId]);

    const filteredKits = useMemo(() => {
        return kits.filter(k => 
            k.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.prodOrderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            k.station.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [kits, searchQuery]);

    // Statistics calculations
    const kitsCount = kits.length;
    const completedKitsCount = kits.filter(k => k.status === 'Completed').length;
    const inProgressKitsCount = kits.filter(k => k.status === 'Kitting').length;
    const holdKitsCount = kits.filter(k => k.status === 'Quality Hold').length;

    // Simulate scale weight verified
    const handleSimulateWeight = (compId: string) => {
        setKits(prev => prev.map(k => {
            if (k.id === selectedKitId) {
                const updatedComp = k.components.map(c => {
                    if (c.id === compId) {
                        return { ...c, scaleWeight: c.targetWeight, weightStatus: 'Verified' };
                    }
                    return c;
                });
                const allVerified = updatedComp.every(c => c.weightStatus === 'Verified');
                return { 
                    ...k, 
                    components: updatedComp, 
                    status: allVerified ? 'Completed' : k.status,
                    completedPacks: allVerified ? k.targetPacks : k.completedPacks
                };
            }
            return k;
        }));
    };

    // Custom Calibration / weight entry via modal
    const handleApplyCustomWeight = (e: React.FormEvent) => {
        e.preventDefault();
        const weightVal = parseFloat(customWeightInput) || 0;
        if (!selectedComponent) return;

        setKits(prev => prev.map(k => {
            if (k.id === selectedKitId) {
                const updatedComp = k.components.map(c => {
                    if (c.id === selectedComponent.id) {
                        const tolerance = Math.abs(weightVal - c.targetWeight) / c.targetWeight;
                        const weightStatus = tolerance <= 0.05 ? 'Verified' : 'Toleration Error';
                        return { ...c, scaleWeight: weightVal, weightStatus };
                    }
                    return c;
                });
                const hasError = updatedComp.some(c => c.weightStatus === 'Toleration Error');
                const allDone = updatedComp.every(c => c.weightStatus === 'Verified');
                let newStatus = k.status;
                if (hasError) newStatus = 'Quality Hold';
                else if (allDone) newStatus = 'Completed';

                return { 
                    ...k, 
                    components: updatedComp, 
                    status: newStatus,
                    completedPacks: allDone ? k.targetPacks : k.completedPacks
                };
            }
            return k;
        }));

        setSelectedComponent(null);
    };

    // Simulate printing barcode tags for the finished assembly kit
    const handlePrintKitBarcode = (kit: any) => {
        alert(`ดึงคำฟังก์ชั่นจำลองระบบจัดพิมพ์เครื่องพิมพ์ฉลากบาร์โค้ด...\nใบประกอบชุด: ${kit.id}\nสำหรับใบแผนงานหลัก: ${kit.prodOrderRef}\nน้ำหนักการบรรจุรวมชุด: ผ่านมาตรฐานสำเร็จ 100%`);
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
            
            {/* TOP HEADER */}
            <div className="px-4 sm:px-8 pt-4 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#b58c4f]"></span>
                        <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.2em] font-mono">RM MATERIAL KITTING & MARSHALLING</span>
                    </div>
                    <h1 className="text-[20px] font-black text-[#212c46] tracking-tight uppercase mt-1">เตรียมจัดเข้าชุดวัตถุดิบและเคมีผสม (Kitting)</h1>
                    <p className="text-[11px] font-extrabold text-[#7a8b95] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                        <Icons.Scale size={14} className="text-[#a94228]"/> INDUSTRIAL SCALE SENSORS INTEGRATION & RECIPE BATCHING SCREEN
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={() => {
                        const newId = `RM-KIT-${Math.floor(Math.random() * 100) + 2610}`;
                        setKits([
                            ...kits,
                            {
                                id: newId,
                                prodOrderRef: 'PROD-2606-' + (Math.floor(Math.random() * 90) + 10),
                                itemName: 'New Custom Chemical Batch Premix',
                                station: 'Kitting Line A - Food Safe',
                                status: 'Pending',
                                targetPacks: 10,
                                completedPacks: 0,
                                priority: 'Normal',
                                components: [
                                    { id: `NEW-${Date.now()}-1`, sku: 'SKU-8801', name: 'Nescafe Red Cup 380g', reqQty: 200, scaleWeight: 0, targetWeight: 200, weightStatus: 'Pending Weigh', unit: 'Kg' }
                                ]
                            }
                        ]);
                        setSelectedKitId(newId);
                    }} className="px-4 py-2 bg-[#212c46] hover:bg-[#3f809e] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2">
                        <Icons.Plus size={15}/> เพิ่มแผนประกอบเซ็ต
                    </button>
                </div>
            </div>

            {/* KPI MATRIX */}
            <div className="px-4 sm:px-8 sm: w-full font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KpiCard label="จำนวนแผนจัดเซ็ตทั้งหมด" value={kitsCount} icon="Layers" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Total Active Runs" />
                    <KpiCard label="เซ็ตเสร็จสมบูรณ์แล้ว" value={completedKitsCount} icon="CheckCircle" colorAccent={THEME.success} colorValue={THEME.success} desc="Kitted OK" />
                    <KpiCard label="อยู่ระหว่างคลี่แยกผสม" value={inProgressKitsCount} icon="Activity" colorAccent={THEME.brightGold} colorValue={THEME.brightGold} desc="Packing" />
                    <KpiCard label="ล็อคตรวจวัดบกพร่อง (Hold)" value={holdKitsCount} icon="Lock" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Weight Variance Fault" />
                </div>
            </div>

            {/* CENTRAL WORKSPACE GRID */}
            <div className="px-4 sm:px-8 sm: w-full pb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* LEFT BAR: KIT SELECTION */}
                    <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col text-left">
                        <div className="p-4 border-b border-[#eaeaec] bg-[#f8f9fa]">
                            <div className="flex items-center gap-2.5 bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-inner">
                                <Icons.Search size={14} className="text-[#7a8b95]" />
                                <input type="text" placeholder="พิมพ์คนหาชุดวัตถุดิบ/ไลน์..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-[11.5px] outline-none w-full font-bold text-[#212c46]" />
                            </div>
                        </div>

                        <div className="divide-y divide-[#eaeaec] max-h-[500px] overflow-y-auto">
                            {filteredKits.map((k) => (
                                <button key={k.id} onClick={() => setSelectedKitId(k.id)} className={`w-full p-4.5 text-left transition-colors flex items-start gap-3 ${selectedKitId === k.id ? 'bg-amber-50/25 border-l-4 border-l-[#b58c4f]' : 'hover:bg-slate-50'}`}>
                                    <div className={`p-2 rounded-xl shrink-0 ${selectedKitId === k.id ? 'bg-[#b58c4f]/15 text-[#b58c4f]' : 'bg-slate-100 text-[#7a8b95]'}`}>
                                        <Icons.Layers size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <span className="text-[11.5px] font-mono font-black text-[#212c46]">{k.id}</span>
                                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide ${k.status === 'Completed' ? 'bg-[#657f4d]/10 text-[#657f4d]' : k.status === 'Kitting' ? 'bg-[#3f809e]/10 text-[#3f809e]' : k.status === 'Quality Hold' ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'bg-[#7a8b95]/10 text-[#7a8b95]'}`}>
                                                {k.status}
                                            </span>
                                        </div>
                                        <h3 className="font-sans font-black text-[#212c46] text-[12px] truncate mt-1 leading-tight">{k.itemName}</h3>
                                        <div className="text-[9.5px] font-semibold text-[#7a8b95] mt-2 flex justify-between items-center">
                                            <span className="uppercase tracking-wider font-mono">{k.prodOrderRef}</span>
                                            <span>{k.completedPacks}/{k.targetPacks} เซ็ต</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                            {filteredKits.length === 0 && (
                                <div className="p-10 text-center text-[#7a8b95] uppercase font-bold text-[11px] tracking-widest font-mono">ไม่พบข้อมูลใบจัดชุดร่วมสอดคล้องกัน</div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COMPONENT: INTEGRATED DETAIL / CALIBRATION SENSORS */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-[#eaeaec] p-6 text-left flex flex-col justify-between min-h-[500px]">
                        <div>
                            {/* ACTIVE HEAD DETAILS */}
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#eaeaec] pb-4 mb-5 gap-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#3f809e] font-mono font-black text-[12px] bg-[#3f809e]/10 px-2 py-0.5 border border-[#3f809e]/15 rounded">{activeKit.id}</span>
                                        <span className="text-[10px] font-black text-[#7a8b95] uppercase font-mono tracking-wide">ใบแผนผลิตหลัก: {activeKit.prodOrderRef}</span>
                                    </div>
                                    <h2 className="text-[15px] font-black mt-2 text-[#212c46]">{activeKit.itemName}</h2>
                                    <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                                        <Icons.Monitor size={12}/> {activeKit.station}
                                    </p>
                                </div>
                                <button onClick={() => handlePrintKitBarcode(activeKit)} className="px-4 py-2 bg-slate-100 hover:bg-[#b58c4f] hover:text-white border border-[#eaeaec] text-[#212c46] font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shrink-0">
                                    <Icons.Printer size={13}/> จัดพิมพ์ใบปิดบาร์โค้ดประจำเซ็ต
                                </button>
                            </div>

                            {/* WEIGHT SCALES SIMULATOR PANEL */}
                            <div className="p-4 bg-[#212c46]/5 border border-[#212c46]/10 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                                <div className="text-left">
                                    <span className="text-[10px] font-black uppercase text-[#7a8b95] tracking-widest font-mono">Integrated Industrial Terminal</span>
                                    <h4 className="text-[12.5px] font-black text-[#212c46] mt-0.5 flex items-center gap-2 leading-none"><Icons.Wifi className="text-[#657f4d] animate-pulse" size={14}/> เชื่อมต่อตาชั่งเครื่องจักรสารแล้ว (Live Scale Bridge on Port Com4)</h4>
                                    <p className="text-[11px] font-bold text-[#7a8b95] mt-1.5 leading-relaxed">สัมผัสกดปุ่ม "ตักเช็คอัตโนมัติ" เพื่อดึงดัชนีค่าน้ำหนักที่ชั่งจริงจากคานตาชั่ง หรือกดเข้า "ระบุคันโยกเอง" กรณีใช้คานสุ่มน้ำหนักแอนะล็อกภายนอก</p>
                                </div>
                                <div className="text-right text-[#657f4d] font-mono font-black text-[15px] bg-white border border-[#eaeaec] px-4 py-2 rounded-xl shadow-inner flex items-center gap-1.5 shrink-0 select-none">
                                    <span className="w-2.5 h-2.5 rounded-full bg-[#657f4d] animate-ping"></span> ONLINE
                                </div>
                            </div>

                            {/* COMPONENTS LIST / FLOW MEASURING */}
                            <div className="space-y-4">
                                <h3 className="text-[11.5px] font-black text-[#7a8b95] uppercase tracking-widest border-b border-[#eaeaec] pb-1.5">สัดส่วนสูตรผสม (Materials Recipe Formula Check)</h3>
                                <div className="space-y-3">
                                    {activeKit.components.map((c) => (
                                        <div key={c.id} className="bg-white border border-[#eaeaec] rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 hover:shadow-sm transition-all">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-[10.5px] font-mono font-bold text-[#4d87a8]">{c.sku}</span>
                                                    <h4 className="text-[12.5px] font-black text-[#212c46] leading-none">{c.name}</h4>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] font-bold text-[#7a8b95] uppercase font-mono mt-2 tracking-wide">
                                                    <span>เป้าหมายสูตร: {formatNumber(c.targetWeight)} {c.unit}</span>
                                                    <span>|</span>
                                                    <span>สัญญาวิเคราะห์: ±0.5% Tolerance</span>
                                                </div>
                                            </div>

                                            {/* WEIGHT METRIC COMPONENT */}
                                            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3.5 md:pt-0">
                                                <div className="text-right">
                                                    <div className="text-[9.5px] text-[#7a8b95] font-black uppercase font-mono">น้ำหนักชั่งจริงบนคาน</div>
                                                    <div className="text-[15px] font-black font-mono flex items-baseline gap-1 mt-0.5">
                                                        <span className={c.weightStatus === 'Verified' ? 'text-[#657f4d]' : c.weightStatus === 'Toleration Error' ? 'text-[#a94228]' : 'text-[#7a8b95]'}>
                                                            {formatNumber(c.scaleWeight)}
                                                        </span>
                                                        <span className="text-[10px] text-[#4d87a8] font-bold">{c.unit}</span>
                                                    </div>
                                                </div>

                                                <div className="flex gap-1.5 shrink-0">
                                                    <button onClick={() => { setSelectedComponent(c); setCustomWeightInput(c.scaleWeight ? c.scaleWeight.toString() : ''); }} className="p-2 border border-[#eaeaec] hover:border-[#b7a159] hover:bg-slate-50 rounded-xl text-[#212c46] transition-all" title="ระบุน้ำหนักควบคุมแบบแอนะล็อก"><Icons.Sliders size={13}/></button>
                                                    <button onClick={() => handleSimulateWeight(c.id)} className={`px-3.5 py-2 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition-all border ${c.weightStatus === 'Verified' ? 'bg-[#657f4d]/10 text-[#657f4d] border-transparent' : 'bg-[#212c46] hover:bg-[#3f809e] text-white border-transparent'}`}>
                                                        {c.weightStatus === 'Verified' ? '✓ สำเร็จแล้ว' : 'เซนเซอร์ชั่ง'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* STEP SUMMARY REPORT */}
                        <div className="mt-8 pt-5 border-t border-[#eaeaec] flex justify-between items-center flex-wrap gap-4 font-sans font-bold">
                            <div>
                                <div className="text-[10px] text-[#7a8b95] uppercase">ความก้าวหน้าการจัดเข้าชุดคิวผลิตนี้</div>
                                <div className="text-[17px] font-black font-mono text-[#212c46] mt-0.5">{activeKit.completedPacks} / {activeKit.targetPacks} <span className="text-[11.5px] text-[#7a8b95]">เซ็ตเสร็จสิ้น</span></div>
                            </div>
                            <div className="flex gap-2.5">
                                <button onClick={() => {
                                    setKits(prev => prev.map(k => {
                                        if (k.id === selectedKitId) {
                                            const allReady = k.components.map(c => ({ ...c, scaleWeight: c.targetWeight, weightStatus: 'Verified' }));
                                            return { ...k, components: allReady, status: 'Completed', completedPacks: k.targetPacks };
                                        }
                                        return k;
                                    }));
                                }} className="px-5 py-2.5 bg-[#657f4d] hover:bg-[#657f4d]/85 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm transition-all">
                                    ผ่านสูตรผสมทั้งเซ็ต
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* WEIGHT TUNING DRAGGABLE MODAL */}
            {selectedComponent && (
                <DraggableModal isOpen={selectedComponent !== null} onClose={() => setSelectedComponent(null)} title={`ระบุน้ำหนักคัดแยกความคลาดเคลื่อน: ${selectedComponent.sku}`}>
                    <form onSubmit={handleApplyCustomWeight} className="p-5 text-left text-[12px] text-[#414757]">
                        <div className="mb-4 text-left">
                            <span className="font-black text-[#212c46]">{selectedComponent.name}</span>
                            <p className="text-[10px] text-[#7a8b95] font-bold uppercase mt-1">เกณฑ์เป้าหมายสูตร: {selectedComponent.targetWeight} {selectedComponent.unit} | อนุญาตเบี่ยงแบนคลาดเคลื่อนสูงสุด ±5% เท่านั้น</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-[11px] font-black text-[#7a8b95] uppercase mb-1">ค่าน้ำหนักที่อ่านได้ (หน่วยเป็น {selectedComponent.unit})</label>
                            <input type="number" step="0.01" required value={customWeightInput} onChange={(e) => setCustomWeightInput(e.target.value)} placeholder={`ระบุดัชนีชั่งจริง เช่น ${selectedComponent.targetWeight}`} className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-[12px] font-mono outline-none focus:border-[#b7a159]" />
                        </div>
                        <div className="flex justify-end gap-2 pt-2 border-t border-[#eaeaec]">
                            <button type="button" onClick={() => setSelectedComponent(null)} className="px-5 py-2 bg-slate-100 font-black text-[11px] uppercase tracking-wider rounded-lg text-[#212c46]">ยกเลิก</button>
                            <button type="submit" className="px-5 py-2 bg-[#212c46] text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition-all hover:bg-[#3f809e]">ยืนยันบันทึกน้ำหนัก</button>
                        </div>
                    </form>
                </DraggableModal>
            )}
        </div>
    );
}
