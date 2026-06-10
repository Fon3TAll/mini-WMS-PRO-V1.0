import React, { useState, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Standard Configuration ---
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
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);
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

// --- Mock RM Handover / Dispatches ---
const MOCK_RM_DISPATCHES = [
    {
        id: 'RM-DSP-5001',
        kitRef: 'RM-KIT-2601',
        prodOrderRef: 'PROD-2606-001',
        itemName: 'Nescafe Mix Premix Kit Pack 1',
        origin: 'Kitting Lane A',
        targetLine: 'Production Assembly Line A - Mixer No.2',
        driver: 'K. Somchai (ForkIs-04)',
        status: 'In Transit',
        weight: '300 Kg',
        dispatchTime: '17:15',
        completedTime: '-',
        notes: 'Chemical compound double-verified'
    },
    {
        id: 'RM-DSP-5002',
        kitRef: 'RM-KIT-2604',
        prodOrderRef: 'PROD-2606-006',
        itemName: 'Softener Fragrance Compound Blue',
        origin: 'Kitting Line C',
        targetLine: 'Soap Liquid Bottling Line C - Reactor No.4',
        driver: 'K. Pravit (AGV-Robot-09)',
        status: 'Delivered',
        weight: '55 Liters',
        dispatchTime: '16:02',
        completedTime: '16:25',
        notes: 'Delivered via automated guidance unit'
    },
    {
        id: 'RM-DSP-5003',
        kitRef: 'RM-KIT-2602',
        prodOrderRef: 'PROD-2606-002',
        itemName: 'Tom Yum Noodle Secret Spice Bag',
        origin: 'Kitting Lane B',
        targetLine: 'Noodle Frying Line 2 - Spices Hopper C',
        driver: 'K. Prasit (ForkIs-02)',
        status: 'Dispatched',
        weight: '1,500 Kg',
        dispatchTime: '17:40',
        completedTime: '-',
        notes: 'High priority urgent kitting order'
    },
    {
        id: 'RM-DSP-5004',
        kitRef: 'RM-KIT-2603',
        prodOrderRef: 'PROD-2606-004',
        itemName: 'Active Detergent Premix Pack B',
        origin: 'Kitting Line B',
        targetLine: 'Chemical Active Reactor Floor Line 12',
        driver: '-',
        status: 'Quality Hold',
        weight: '1,400 Liters',
        dispatchTime: '-',
        completedTime: '-',
        notes: 'Toleration error in weighing. Delayed dispatch.'
    }
];

export default function RMDispatchLoading() {
    const [dispatches, setDispatches] = useState(MOCK_RM_DISPATCHES);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedDispatch, setSelectedDispatch] = useState<any>(null);

    // E-signature fields
    const [supervisorPin, setSupervisorPin] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('Supervisor - Sompon');
    const [errorMsg, setErrorMsg] = useState('');

    const filteredDispatches = useMemo(() => {
        return dispatches.filter(d => {
            const matchesQuery = d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 d.kitRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 d.prodOrderRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 d.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 d.targetLine.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 d.driver.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
            return matchesQuery && matchesStatus;
        });
    }, [dispatches, searchQuery, statusFilter]);

    // Calculations
    const totalJobs = dispatches.length;
    const pendingDispatch = dispatches.filter(d => d.status === 'Dispatched').length;
    const inTransit = dispatches.filter(d => d.status === 'In Transit').length;
    const deliveredCount = dispatches.filter(d => d.status === 'Delivered').length;

    // Dispatch a job (Dispatched -> In Transit)
    const handleSetInTransit = (id: string, driverName: string) => {
        setDispatches(prev => prev.map(d => {
            if (d.id === id) {
                return { 
                    ...d, 
                    driver: driverName || 'K. Anon (Manual)', 
                    status: 'In Transit', 
                    dispatchTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
                };
            }
            return d;
        }));
    };

    // Close custody (sign handover)
    const handleSignHandoverSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (supervisorPin.length !== 4) {
            setErrorMsg('กรุณากรอกรหัส PIN จำนวน 4 หลักให้ครบถ้วน');
            return;
        }

        setDispatches(prev => prev.map(d => {
            if (d.id === selectedDispatch.id) {
                return { 
                    ...d, 
                    status: 'Delivered', 
                    completedTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                    notes: `นำจ่ายเรียบร้อย ตรวจรับโดย ${selectedSupervisor} (Pin Authorized)`
                };
            }
            return d;
        }));

        setSupervisorPin('');
        setErrorMsg('');
        setSelectedDispatch(null);
    };

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
            
            {/* TOP HEADER */}
            <div className="px-4 sm:px-8 pt-4 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#a94228]"></span>
                        <span className="text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.2em] font-mono">RM MATERIAL DISPATCH & LOGISTICS</span>
                    </div>
                    <h1 className="text-[20px] font-black text-[#212c46] tracking-tight uppercase mt-1">นำจ่ายฝ่ายผลิต (RM Dispatch)</h1>
                    <p className="text-[11px] font-extrabold text-[#7a8b95] uppercase tracking-wider mt-1 flex items-center gap-1.5">
                        <Icons.Truck size={14} className="text-[#3f809e]"/> PRODUCTION LINE FEEDING CONTROL & DIGITAL HANDOVER SIGN-OFFS
                    </p>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => {
                        const newId = `RM-DSP-${Math.floor(Math.random() * 100) + 5010}`;
                        setDispatches([
                            ...dispatches,
                            {
                                id: newId,
                                kitRef: 'RM-KIT-2602',
                                prodOrderRef: 'PROD-2606-' + (Math.floor(Math.random() * 90) + 10),
                                itemName: 'New Custom Ingredients Set D12',
                                origin: 'Kitting Lane B',
                                targetLine: 'Secondary Production Mixer Unit Line 5',
                                driver: '-',
                                status: 'Dispatched',
                                weight: '100 Kg',
                                dispatchTime: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                                completedTime: '-',
                                notes: 'Created dispatch trigger'
                            }
                        ]);
                    }} className="px-4 py-2 bg-[#212c46] hover:bg-[#3f809e] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all flex items-center gap-2">
                        <Icons.Plus size={15}/> เพิ่มงานจ่ายส่งฝ่ายผลิต
                    </button>
                </div>
            </div>

            {/* KPI STATS */}
            <div className="px-4 sm:px-8 sm: w-full font-sans">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <KpiCard label="งานนำจ่ายสะสมทั้งหมด" value={totalJobs} icon="Layers" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Total Jobs" />
                    <KpiCard label="รอดำเนินตัดรถป้อน (Dispatched)" value={pendingDispatch} icon="Play" colorAccent={THEME.gold} colorValue={THEME.gold} desc="Ready to load" />
                    <KpiCard label="อยู่ระหว่างรถส่งไปไลน์ (Transit)" value={inTransit} icon="Truck" colorAccent={THEME.indigo} colorValue={THEME.indigo} desc="On Forklift / Motor" />
                    <KpiCard label="ส่งมอบฝ่ายผลิตราบรื่นแล้ว" value={deliveredCount} icon="CheckCircle" colorAccent={THEME.success} colorValue={THEME.success} desc="Delivered OK" />
                </div>
            </div>

            {/* MAIN APP ROULETTE */}
            <div className="px-4 sm:px-8 w-full pb-8">
                <div className="bg-white rounded-3xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px]">
                    {/* TICKET CONTROL BAR */}
                    <div className="p-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2.5 bg-white border border-[#eaeaec] rounded-xl px-3.5 py-2 w-full md:w-96 shadow-inner">
                            <Icons.Search size={16} className="text-[#7a8b95]" />
                            <input type="text" placeholder="พิมพ์คนหาชุดป้อน / รหัสพนักงานขับ / สายการผลิตเป้าหมาย..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent text-[12px] placeholder-[#7a8b95] outline-none w-full font-sans font-bold text-[#212c46]" />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            {['All', 'Dispatched', 'In Transit', 'Delivered', 'Quality Hold'].map((status) => (
                                <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${statusFilter === status ? 'bg-[#212c46] text-white border-transparent' : 'bg-white text-[#7a8b95] hover:text-[#212c46] border-[#eaeaec]'}`}>{status}</button>
                            ))}
                        </div>
                    </div>

                    {/* MAIN TABLE QUEUE */}
                    <div className="overflow-x-auto w-full text-left">
                        <table className="w-full text-[12px]">
                            <thead>
                                <tr className="bg-[#f8f9fa] border-b border-[#eaeaec] text-[#212c46] uppercase font-black tracking-wider text-[11px] font-mono">
                                    <th className="py-4.5 px-6">ID นำจ่ายวัตถุดิบ</th>
                                    <th className="py-4.5 px-4 font-normal">สูตรจัดเซ็ตต้นทาง (Kit Set)</th>
                                    <th className="py-4.5 px-4 font-normal">สายผลิตงานปลายทาง (Dest Line)</th>
                                    <th className="py-4.5 px-4 font-normal">เจ้าหน้าที่ขนถ่าย (Forklift Crew)</th>
                                    <th className="py-4.5 px-4 text-center font-normal">น้ำหนักรวมชุด</th>
                                    <th className="py-4.5 px-4 text-center font-normal">ช่วงเวลารถออก/รับส่ง</th>
                                    <th className="py-4.5 px-4 text-center font-normal">สถานะป้อน</th>
                                    <th className="py-4.5 px-6 text-right font-normal">ตรวจจ่าย</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eaeaec] font-sans font-bold">
                                {filteredDispatches.map((d) => (
                                    <tr key={d.id} className="hover:bg-[#b58c4f]/5 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="text-[13px] font-black text-[#212c46] font-mono leading-none">{d.id}</div>
                                            <div className="text-[9px] text-[#7a8b95] font-black uppercase font-mono tracking-wide mt-1.5">แผนผลิต: {d.prodOrderRef}</div>
                                        </td>
                                        <td className="py-4 px-4 font-sans text-left">
                                            <div className="text-[#212c46] leading-none text-[12px]">{d.itemName}</div>
                                            <div className="text-[9.5px] font-mono text-[#4d87a8] uppercase mt-1.5 flex items-center gap-1">
                                                <Icons.Maximize2 size={11} className="text-[#7a8b95]"/> Ref: {d.kitRef} | จาก {d.origin}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-left font-sans">
                                            <div className="text-[#a94228] text-[12px] font-black leading-snug"><Icons.ChevronsRight size={13} className="inline mr-1"/> {d.targetLine}</div>
                                        </td>
                                        <td className="py-4 px-4 font-mono uppercase text-[11.5px] text-[#212c46]">
                                            {d.driver === '-' ? (
                                                <span className="text-[#7a8b95] font-bold italic">รอกำหนดรถ...</span>
                                            ) : (
                                                <span className="font-bold">{d.driver}</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 font-mono text-center text-[#212c46] text-[12px]">
                                            {d.weight}
                                        </td>
                                        <td className="py-4 px-4 font-mono text-center text-[#414757]">
                                            <div>{d.dispatchTime}</div>
                                            {d.completedTime !== '-' && <div className="text-[10px] text-[#657f4d] font-bold mt-1">ถึงเมื่อ: {d.completedTime}</div>}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${d.status === 'Delivered' ? 'bg-[#657f4d]/10 text-[#657f4d]' : d.status === 'In Transit' ? 'bg-[#3f809e]/10 text-[#3f809e]' : d.status === 'Dispatched' ? 'bg-[#b58c4f]/10 text-[#b58c4f]' : 'bg-[#932c2e]/10 text-[#932c2e]'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {d.status === 'Dispatched' ? (
                                                <button onClick={() => {
                                                    const driver = prompt('รบกวนระบุพนักงานขับ Forklift / เลขทะเบียนพาเลทนำส่ง:', 'K. Somchai (ForkIs-04)');
                                                    if(driver) {
                                                        handleSetInTransit(d.id, driver);
                                                    }
                                                }} className="px-3.5 py-1.5 bg-[#212c46] hover:bg-[#3f809e] text-white transition-all rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1">
                                                    <Icons.ArrowRightCircle size={12}/> ขนส่งขึ้นรถ
                                                </button>
                                            ) : d.status === 'In Transit' ? (
                                                <button onClick={() => setSelectedDispatch(d)} className="px-3.5 py-1.5 bg-[#657f4d] hover:bg-[#657f4d]/85 text-white transition-all rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm inline-flex items-center gap-1">
                                                    <Icons.CheckCircle size={12}/> ตรวจยืนยันรับ
                                                </button>
                                            ) : (
                                                <span className="text-[10.5px] font-bold text-[#cbd5e1] font-mono uppercase select-none">ปิดสมบูรณ์แล้ว</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredDispatches.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center text-[#7a8b95] font-black text-[12px] uppercase tracking-widest border-t border-[#eaeaec]">ไม่มีข้อมูลคำสั่งจ่ายงานวัสดุฝ่ายผลิตที่สอดคล้อง</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* SUPERVISOR HANDOVER SIGN-OFF MODAL */}
            {selectedDispatch && (
                <DraggableModal isOpen={selectedDispatch !== null} onClose={() => setSelectedDispatch(null)} title={`ใบเซ็นตรวจรับวัตถุดิบนำจ่ายฝ่ายผลิต: ${selectedDispatch.id}`}>
                    <form onSubmit={handleSignHandoverSubmit} className="p-5 text-left text-[12px] text-[#414757]">
                        <div className="p-3 bg-[#eaeaec]/40 rounded-xl mb-4 border border-[#eaeaec] text-[#212c46]">
                            <h4 className="font-black text-[13px]">{selectedDispatch.itemName}</h4>
                            <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px] font-bold font-mono">
                                <div>ปลายทางส่งมอบ:</div>
                                <div className="text-[#a94228]">{selectedDispatch.targetLine}</div>
                                <div>พิกัดจัดเซ็ต:</div>
                                <div>{selectedDispatch.origin}</div>
                                <div>จานวนน้ำหนัก:</div>
                                <div>{selectedDispatch.weight}</div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-5">
                            <div>
                                <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">ผู้ตรวจรับ มอบอำนาจฝ่ายผลิต (Supervisor Signature)</label>
                                <select value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)} className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 outline-none font-bold text-[#212c46]">
                                    <option value="Supervisor - Sompon (Mixing Staff Unit Line 2)">Supervisor - Sompon (Mixing Staff Unit Line 2)</option>
                                    <option value="Supervisor - Wanna (Liquid Soap Lead Officer)">Supervisor - Wanna (Liquid Soap Lead Officer)</option>
                                    <option value="Supervisor - Adisorn (Noodle Dry Assembly Floor)">Supervisor - Adisorn (Noodle Dry Assembly Floor)</option>
                                    <option value="Operator Senior - K. Boonmee (Chemical Mixer Unit)">Operator Senior - K. Boonmee (Chemical Mixer Unit)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-[#7a8b95] uppercase tracking-wider mb-1">รหัส PIN ยืนยันความปลอดภัยตรวจรับ (4-digit Security code)</label>
                                <input type="password" maxLength={4} required placeholder="****" value={supervisorPin} onChange={(e) => setSupervisorPin(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-center text-[15px] font-mono tracking-widest outline-none focus:border-[#b7a159]" />
                                <span className="block text-[9.5px] font-bold text-slate-400 mt-1 uppercase font-mono">Simulated security check rule - Try typing "1234" pin code</span>
                            </div>

                            {errorMsg && <div className="p-2 bg-red-50 text-red-600 rounded-lg text-center text-[11px] font-bold border border-red-100">{errorMsg}</div>}
                        </div>

                        <div className="flex justify-end gap-2 pt-2.5 border-t border-[#eaeaec]">
                            <button type="button" onClick={() => setSelectedDispatch(null)} className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-[#212c46] font-black text-[11px] uppercase tracking-wider rounded-lg">ปิดหน้าต่าง</button>
                            <button type="submit" className="px-5 py-2 bg-[#657f4d] hover:bg-[#657f4d]/85 text-white font-black text-[11px] uppercase tracking-wider rounded-lg transition-all shadow-sm">เซ็นมอบฉันทะรับสิทธิ์</button>
                        </div>
                    </form>
                </DraggableModal>
            )}

        </div>
    );
}
