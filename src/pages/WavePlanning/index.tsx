import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Premium Industrial Earth-tones, Synced with Home / User Permissions) ---
const THEME = {
  bgMain: '#f3f3f1', 
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)', 
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

const formatNumber = (val: number) => {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);
};

// --- KPI Card Components (Sleek Compact Lean Padding [84px Height]) ---
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
            <p className="text-[18px] font-black leading-none text-[#212c46] font-mono" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

// --- Original Example Data Preserved 100% ---
const MOCK_WAVES = [
    { id: 1, waveNumber: 'WAV-2605-001', strategy: 'Zone Picking (Zone A)', totalOrders: 15, totalItems: 120, assignee: 'Somchai S.', status: 'Picking', date: new Date().toISOString().split('T')[0] },
    { id: 2, waveNumber: 'WAV-2605-002', strategy: 'Route (BKK-North)', totalOrders: 8, totalItems: 450, assignee: 'Wichai T.', status: 'Pending', date: new Date().toISOString().split('T')[0] },
    { id: 3, waveNumber: 'WAV-2605-003', strategy: 'High Priority (Urgent)', totalOrders: 3, totalItems: 45, assignee: 'Unassigned', status: 'Draft', date: new Date().toISOString().split('T')[0] },
    { id: 4, waveNumber: 'WAV-2605-004', strategy: 'Single Item Orders', totalOrders: 25, totalItems: 25, assignee: 'Nipon K.', status: 'Completed', date: new Date(Date.now() - 86400000).toISOString().split('T')[0] },
    { id: 5, waveNumber: 'WAV-2605-005', strategy: 'Zone Picking (Zone C)', totalOrders: 10, totalItems: 300, assignee: 'Panya W.', status: 'Picking', date: new Date().toISOString().split('T')[0] },
];

const MOCK_PENDING_ORDERS = [
    { id: 'SO-1001', customer: 'Makro DC', items: 15, zone: 'Zone A', priority: 'Normal' },
    { id: 'SO-1002', customer: 'CP All', items: 5, zone: 'Zone A', priority: 'High' },
    { id: 'SO-1003', customer: 'Lotus', items: 120, zone: 'Zone C', priority: 'Normal' },
    { id: 'SO-1004', customer: 'Big C', items: 1, zone: 'Zone B', priority: 'Normal' },
    { id: 'SO-1005', customer: 'Tops Super', items: 45, zone: 'Zone A', priority: 'Normal' },
    { id: 'SO-1006', customer: 'Export EU', items: 500, zone: 'Zone C', priority: 'High' },
];

// Mock Wave Settings Options for settings (User Permissions Standard)
const MOCK_STRATEGY_POLICIES = [
  { 
    id: 'POL-A', 
    name: 'ZONE PICKING CRITERIA: SINGLE ITEM BATCH', 
    strategy: 'Batch consolidated picking of single line orders', 
    type: 'Dry Storage Floor',
    maxOrders: 30,
    isActive: true,
    isConfidential: false,
    rules: [
      { id: 'RULE-A1', label: 'ZONE A BIN-ACCORDANCE GATE', rule: 'Process automatically once orders exceed 15 units', isConfidential: false },
      { id: 'RULE-A2', label: 'ZONE B FRAGILE GLASS SEGMENT', rule: 'Consolidate onto manual picking pushcart only', isConfidential: false },
    ]
  },
  { 
    id: 'POL-B', 
    name: 'ROUTE PLANNING CRITERIA: BKK EXPRESS CONDUIT', 
    strategy: 'Heavy vehicle route order sequence matching', 
    type: 'Cold & Chilled Buffer Slot',
    maxOrders: 12,
    isActive: true,
    isConfidential: true,
    rules: [
      { id: 'RULE-B1', label: 'BKK EXPRESS TRUCK LEAVE TIME LOCK', rule: 'Must dispatch before 14:00 daily or alert supervisor', isConfidential: true },
    ]
  },
  { 
    id: 'POL-C', 
    name: 'HIGH PRIORITY SLA: DIRECT TO FRESH PORTAL', 
    strategy: 'Immediate flow-through and priority allocation routing', 
    type: 'Dangerous Goods Barrier Area',
    maxOrders: 8,
    isActive: false,
    isConfidential: false,
    rules: [
      { id: 'RULE-C1', label: 'SLA BREACH ALERT GATES', rule: 'Continuous status validation checks every 5 minutes', isConfidential: false },
    ]
  }
];

// Extremely detailed User Guide Panel (Padded narrow & compact - "ลีน สวย")
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div className="text-left">
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> WAVE PLANNING GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Batch Picking Optimization</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11.5px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Layers size={13} className="text-[#b7a159]"/> 1. วางแผนรอบการเดินหยิบสินค้า (Waving Strategy)
            </h4>
            <p className="text-[11px] mb-2 font-bold text-[#615e65]">กฎเกณฑ์การรวมบิลคำสั่งซื้อสินค้า (Consolidated Picking Rules):</p>
            <ul className="list-none pl-0 space-y-2">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.MapPin size={12} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#4d87a8] font-black">By Storage Zone:</strong> รวมคำสั่งซื้อที่มีรายการกระจายอยู่ในโซนการเก็บเดียวกัน เช่น Zone A หรือ Zone C เพื่อไม่ให้พนักงานเดินอ้อม</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.Lock size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Restricted Policies:</strong> ข้อกำหนดรอบความมั่นคงจำกัดสิทธิ์จะถูกกรองความปลอดภัยตามรูปแบบสิทธิพิเศษพนักงานเช่นเดียวกับฝ่ายความมั่นคงการอนุญาต</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Workflow size={13} className="text-[#b7a159]"/> 2. ลำดับกระบวนการหยิบ (Picking Pipeline Stage)
            </h4>
            <ul className="list-decimal pl-5 space-y-1.5 text-[11px] font-medium text-[#414757]">
              <li>เริ่มต้นในแบบร่าง <span className="text-[#7a8b95] font-bold">Draft</span> เพื่อรอตรวจสอบตรวจสอบจำนวน SKU</li>
              <li>ยืนยันปล่อยบิลหยิบสินค้า <span className="text-[#b58c4f] font-bold">Pending</span> รอบนผู้ปฏิบัติงานฟลอร์มากดเริ่มงาน</li>
              <li>พนักงานกดรับและเข้าปฏิบัติงานจริง <span className="text-[#ab7d82] font-bold">Picking</span> เพื่อระบุช่องเดินทาง</li>
              <li>สแกนยืนยันสินค้าครบถ้วนขยับขึ้นบอร์ดส่งกระจายจุด <span className="text-[#657f4d] font-bold">Completed</span> เพื่อรอนำส่งรถบรรทุก</li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[11.5px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Compass size={13} className="text-[#b58c4f]"/> 3. ข้อพึงระวังคำสั่งซื้อด่วน (SLA Priority Alerts)
            </h4>
            <p className="text-[11px] leading-relaxed text-[#615e65]">
              คำสั่งซื้อประเภท High Priority จะมีไฟแจ้งเตือนสีแดง เพื่อรักษาประสิทธิภาพของรอบจัดส่งรวมและเร่งนำหยิบเข้าสู่ท่อประกอบตู้สินค้าเร่งด่วนตามมาตราวัดความปลอดภัย (Critical SLA Metric Rules)
            </p>
          </section>
        </div>
        
        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2 bg-[#212c46] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-widest">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Create/Edit Wave Modal using Draggable Modal ---
function WaveModal({ isOpen, onClose, data, onSave, onDelete }: any) {
    const [formData, setFormData] = useState<any>({
        waveNumber: '', 
        strategy: 'Zone Picking', 
        strategyDetail: 'Zone A', 
        assignee: 'Unassigned', 
        status: 'Draft'
    });
    
    const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
    const [strategyFilter, setStrategyFilter] = useState('Zone A');

    useEffect(() => {
        if(isOpen && data) {
            setFormData(data);
            const initialStrategy = data.strategy.includes('(') ? data.strategy.split(' (')[0] : data.strategy;
            const filterPart = data.strategy.includes('(') ? data.strategy.split(' (')[1].slice(0, -1) : 'Zone A';
            setStrategyFilter(filterPart);
            setSelectedOrders(data.totalOrders > 0 ? MOCK_PENDING_ORDERS.map(o=>o.id).slice(0, data.totalOrders) : []);
        } else if(isOpen) {
            setFormData({ 
                waveNumber: `WAV-${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${Math.floor(100 + Math.random() * 900)}`,
                strategy: 'Zone Picking', 
                strategyDetail: 'Zone A', 
                assignee: 'Unassigned', 
                status: 'Draft' 
            });
            setSelectedOrders([]);
            setStrategyFilter('Zone A');
        }
    }, [isOpen, data]);

    if (!isOpen) return null;

    const availableOrders = MOCK_PENDING_ORDERS.filter(order => {
        if (formData.strategy === 'Zone Picking') return order.zone === strategyFilter;
        if (formData.strategy === 'High Priority') return order.priority === 'High';
        return true; 
    });

    const toggleOrder = (orderId: string) => {
        setSelectedOrders(prev => 
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleSelectAll = () => {
        if (selectedOrders.length === availableOrders.length) setSelectedOrders([]);
        else setSelectedOrders(availableOrders.map(o => o.id));
    };

    const totalSelectedItems = availableOrders.filter(o => selectedOrders.includes(o.id)).reduce((acc, curr) => acc + curr.items, 0);

    const handleSubmit = (e: any, releaseStatus = 'Draft') => {
        e.preventDefault();
        onSave({
            ...formData,
            strategy: formData.strategy === 'High Priority' ? 'High Priority (Urgent)' : `${formData.strategy} (${strategyFilter})`,
            totalOrders: selectedOrders.length,
            totalItems: totalSelectedItems,
            status: releaseStatus,
            date: formData.date || new Date().toISOString().split('T')[0]
        });
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[850px]"
            customHeader={
                <div className="bg-[#212c46] px-5 py-3 flex justify-between items-center text-white shrink-0 border-b-2 border-[#b7a159]">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white border border-white/20 shadow-sm">
                            <Icons.Layers size={18} strokeWidth={2.5}/>
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">{data ? 'EDIT WAVE SCHEDULING' : 'CREATE WAVE PIPELINE'}</h3>
                            <p className="text-[9px] font-bold text-[#b7a159] uppercase tracking-widest flex items-center gap-1"><Icons.Zap size={10} /> AGILITY DISPATCH BATCH</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-[#932c2e] p-1.5 hover:bg-white/10 rounded-lg transition-all"><Icons.X size={18} /></button>
                </div>
            }
        >
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#f3f3f1] font-mono text-left max-h-[75vh]">
                <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#eaeaec] flex flex-col shrink-0 p-4 space-y-4 overflow-y-auto custom-scrollbar">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#212c46] uppercase block">Wave ID Number</label>
                        <input disabled value={formData.waveNumber} className="w-full bg-[#eaeaec]/40 border border-[#eaeaec] rounded-lg px-3 py-2 text-[11px] font-bold text-[#7a8b95] outline-none font-mono cursor-not-allowed" />
                    </div>

                    <div className="bg-[#b7a159]/10 p-3.5 rounded-lg border border-[#b7a159]/30 space-y-3">
                        <h4 className="text-[10px] font-black text-[#212c46] uppercase border-b border-[#eaeaec]/80 pb-1 flex items-center gap-1"><Icons.Route size={12} className="text-[#a54f6b]"/> Strategy Rules</h4>
                        
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-bold text-[#7a8b95] uppercase block">Strategy Class</label>
                            <select value={formData.strategy} onChange={e=>{ setFormData({...formData, strategy: e.target.value}); setSelectedOrders([]); }} className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[10px] font-black text-[#212c46] outline-none shadow-sm uppercase cursor-pointer">
                                <option value="Zone Picking">By Storage Zone</option>
                                <option value="Route">By Delivery Route</option>
                                <option value="High Priority">High Priority (Urgent)</option>
                            </select>
                        </div>

                        {formData.strategy !== 'High Priority' && (
                            <div className="space-y-1.5 animate-fadeIn">
                                <label className="text-[9px] font-bold text-[#7a8b95] uppercase block">Assigned Option</label>
                                <select value={strategyFilter} onChange={e=>{ setStrategyFilter(e.target.value); setSelectedOrders([]); }} className="w-full bg-white border border-[#eaeaec] rounded-lg px-2.5 py-1.5 text-[10px] font-black text-[#212c46] outline-none shadow-sm uppercase cursor-pointer">
                                    {formData.strategy === 'Zone Picking' ? (
                                        <>
                                            <option value="Zone A">Zone A</option>
                                            <option value="Zone B">Zone B</option>
                                            <option value="Zone C">Zone C</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="BKK-North">BKK-North</option>
                                            <option value="BKK-South">BKK-South</option>
                                            <option value="Central">Central</option>
                                        </>
                                    )}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-[#212c46] uppercase block">Assign to Floor Picker</label>
                        <select value={formData.assignee} onChange={e=>setFormData({...formData, assignee: e.target.value})} className="w-full bg-white border border-[#eaeaec] rounded-lg px-3 py-2 text-[10px] font-black text-[#212c46] outline-none shadow-sm cursor-pointer">
                            <option value="Unassigned">Unassigned (Pool Queue)</option>
                            <option value="Somchai S.">Somchai S.</option>
                            <option value="Wichai T.">Wichai T.</option>
                            <option value="Nipon K.">Nipon K.</option>
                            <option value="Panya W.">Panya W.</option>
                        </select>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-white overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#eaeaec]/30 border-b border-[#eaeaec] flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-1.5">
                            <Icons.ListChecks size={14} className="text-[#3f809e]" />
                            <h4 className="text-[11px] font-black uppercase text-[#212c46]">UNASSIGNED PENDING ORDERS</h4>
                        </div>
                        <div className="text-[9px] font-bold text-[#7a8b95] bg-white px-2 py-0.5 rounded border border-[#eaeaec] shadow-sm font-sans">
                            Queue Length: {availableOrders.length}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 max-h-[40vh] md:max-h-full">
                        {availableOrders.length === 0 ? (
                            <div className="text-center py-10 text-[#7a8b95] font-bold text-[11px] uppercase tracking-widest font-sans">No pending sales orders match this strategy constraints.</div>
                        ) : (
                            <table className="w-full text-left font-sans border-collapse">
                                <thead className="bg-[#eaeaec]/50 text-[#212c46] font-mono border-b border-[#eaeaec]">
                                    <tr>
                                        <th className="py-2 px-3 w-8 text-center">
                                            <input type="checkbox" checked={selectedOrders.length === availableOrders.length && availableOrders.length > 0} onChange={handleSelectAll} className="w-3.5 h-3.5 accent-[#212c46] cursor-pointer rounded border-[#eaeaec]"/>
                                        </th>
                                        <th className="py-2 px-3 font-black uppercase tracking-widest text-[9px]">เลขที่ใบสั่งขาย</th>
                                        <th className="py-2 px-3 font-black uppercase tracking-widest text-[9px]">ปลายทางลูกค้า</th>
                                        <th className="py-2 px-3 font-black uppercase tracking-widest text-[9px] text-center">โซนจัดส่ง / ความสำคัญ</th>
                                        <th className="py-2 px-3 font-black uppercase tracking-widest text-[9px] text-center">จำนวนสินค้า (UoM)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#eaeaec] font-mono text-[10.5px]">
                                    {availableOrders.map(order => (
                                        <tr key={order.id} className={`hover:bg-[#f3f3f1] cursor-pointer ${selectedOrders.includes(order.id) ? 'bg-[#3f809e]/10' : ''}`} onClick={() => toggleOrder(order.id)}>
                                            <td className="py-1.5 px-3 text-center" onClick={(e)=>e.stopPropagation()}>
                                                <input type="checkbox" checked={selectedOrders.includes(order.id)} onChange={() => toggleOrder(order.id)} className="w-3.5 h-3.5 accent-[#212c46] cursor-pointer rounded border-[#eaeaec]"/>
                                            </td>
                                            <td className="py-1.5 px-3 font-black text-[#212c46]">{order.id}</td>
                                            <td className="py-1.5 px-3 font-bold text-[#7a8b95] font-sans truncate max-w-[140px]">{order.customer}</td>
                                            <td className="py-1.5 px-3 text-center">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <span className="text-[8px] font-bold text-[#212c46] bg-[#eaeaec] px-1 rounded-sm">{order.zone}</span>
                                                    {order.priority === 'High' && <span className="text-[7.5px] font-black text-[#932c2e] uppercase tracking-tighter">URGENT</span>}
                                                </div>
                                            </td>
                                            <td className="py-1.5 px-3 text-center font-black text-[#3f809e]">{order.items}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    <div className="bg-[#212c46] px-4 py-2 shrink-0 flex justify-between items-center text-white h-10 min-h-[40px]">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#b7a159]">CONSOLIDATION STATS</span>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1"><span className="text-[8.5px] text-[#7a8b95] uppercase">Orders:</span> <span className="text-[12px] font-black">{selectedOrders.length}</span></div>
                            <div className="flex items-center gap-1"><span className="text-[8.5px] text-[#7a8b95] uppercase">Total Units:</span> <span className="text-[12px] font-black text-[#b7a159]">{totalSelectedItems}</span></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-5 py-3 bg-white border-t border-[#eaeaec] flex justify-between items-center gap-2 font-mono shrink-0">
                <div className="flex gap-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec]/50 shadow-sm transition-all">Cancel</button>
                    {data && (
                        <button type="button" onClick={() => { if(window.confirm('Are you sure you want to delete this Wave?')) { onDelete(data.id); onClose(); } }} className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                            Delete
                        </button>
                    )}
                </div>
                <div className="flex gap-1.5">
                    <button type="button" onClick={(e) => handleSubmit(e, 'Draft')} disabled={selectedOrders.length === 0} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase shadow-sm flex items-center gap-1 tracking-widest transition-all ${selectedOrders.length === 0 ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-white text-[#212c46] border border-[#eaeaec] hover:bg-slate-50'}`}>
                        Save Draft
                    </button>
                    <button type="button" onClick={(e) => handleSubmit(e, 'Pending')} disabled={selectedOrders.length === 0} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase shadow-sm flex items-center gap-1 tracking-widest transition-all ${selectedOrders.length === 0 ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-[#212c46] hover:bg-[#414757] text-white border border-[#212c46]'}`}>
                        <Icons.PlayCircle size={12}/> Release Wave
                    </button>
                </div>
            </div>
        </DraggableModal>
    );
}

// --- Main Page Component ---
export default function WavePlanning() {
    const [activeTab, setActiveTab] = useState('waves'); // 'waves' or 'settings' Setup matching same standard as UserPermissions
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const [modalData, setModalData] = useState({ isOpen: false, item: null });
    const [printingWave, setPrintingWave] = useState<any>(null);
    
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Main States
    const [waves, setWaves] = useState(MOCK_WAVES);
    const [strategies, setStrategies] = useState<any[]>(MOCK_STRATEGY_POLICIES);

    // Expands and confidentiality toggles for settings (Standardเดียวกับ User Permissions)
    const [expandedStrategies, setExpandedStrategies] = useState<any>({ 'POL-A': true, 'POL-B': true });

    // KPI Values (Sleek Compact Lean Padding height 84px)
    const pendingOrdersCount = MOCK_PENDING_ORDERS.length; 
    const activeWaves = waves.filter(w => w.status === 'Picking').length;
    const pendingWaves = waves.filter(w => w.status === 'Pending').length;
    const completedWaves = waves.filter(w => w.status === 'Completed').length;

    // Filter Logic
    const filteredWaves = useMemo(() => {
        let res = [...waves];
        if (filterStatus !== 'All') {
            res = res.filter(w => w.status === filterStatus);
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            res = res.filter(w => 
                w.waveNumber.toLowerCase().includes(q) || 
                w.strategy.toLowerCase().includes(q) ||
                w.assignee.toLowerCase().includes(q)
            );
        }
        return res.sort((a, b) => {
            const statusOrder: any = { 'Picking': 1, 'Pending': 2, 'Draft': 3, 'Completed': 4 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9);
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
    }, [waves, searchQuery, filterStatus]);

    const paginatedWaves = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredWaves.slice(start, start + itemsPerPage);
    }, [filteredWaves, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredWaves.length / itemsPerPage) || 1;

    // Handlers
    const handleSaveWave = (data: any) => {
        if(data.id) {
            setWaves(prev => prev.map(w => w.id === data.id ? data : w));
        } else {
            setWaves(prev => [{ ...data, id: Date.now() }, ...prev]);
        }
        setModalData({ isOpen: false, item: null });
    };

    const handleDeleteWave = (id: number) => {
        if(window.confirm('Are you sure you want to cancel and remove this Wave?')) {
            setWaves(prev => prev.filter(w => w.id !== id));
        }
    };

    const handleQuickActionStatus = (id: number, newStatus: string) => {
        setWaves(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
    };

    const toggleConfidential = (strategyId: string) => {
        setStrategies(strategies.map(s => s.id === strategyId ? { ...s, isConfidential: !s.isConfidential } : s));
    };

    const toggleRuleConfidential = (strategyId: string, ruleId: string) => {
        setStrategies(strategies.map(s => {
            if (s.id === strategyId) {
                return {
                    ...s,
                    rules: s.rules.map((r: any) => r.id === ruleId ? { ...r, isConfidential: !r.isConfidential } : r)
                };
            }
            return s;
        }));
    };

    const toggleExpandStrategy = (strategyId: string) => {
        setExpandedStrategies((prev: any) => ({ ...prev, [strategyId]: !prev[strategyId] }));
    };

    const deleteStrategyRule = (strategyId: string) => {
        if(window.confirm(`Are you sure you want to delete strategy configuration criteria ${strategyId}?`)) {
            setStrategies(strategies.filter(s => s.id !== strategyId));
        }
    };

    const handlePrintLabels = (wave: any) => {
        setPrintingWave({ wave, type: 'SLIP' });
    };

    const getStatusStyle = (status: string) => {
        if(status === 'Draft') return 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30';
        if(status === 'Pending') return 'bg-[#b58c4f]/10 text-[#a94228] border-[#b58c4f]/30';
        if(status === 'Picking') return 'bg-[#ab7d82]/10 text-[#932c2e] border-[#ab7d82]/30'; 
        if(status === 'Completed') return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/30';
        return 'bg-[#7a8b95]/10 text-[#7a8b95] border-[#7a8b95]/30';
    };

    return (
        <>
        <DraggableModal
            isOpen={!!printingWave}
            onClose={() => setPrintingWave(null)}
            width="max-w-[900px]"
            customHeader={
                <div className="print:hidden flex justify-between items-center bg-[#212c46] text-white p-4 sticky top-0 z-50 shadow-md cursor-move w-full rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <Icons.Printer size={20} className="text-[#b7a159]" />
                        <div>
                            <h2 className="font-black tracking-widest text-[13px] uppercase">Print Preview: {printingWave?.type === 'SLIP' ? 'Packing Slip' : 'Identification Labels'}</h2>
                            <p className="text-[10px] text-[#7a8b95] uppercase font-bold tracking-widest">Wave: {printingWave?.wave.waveNumber}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="bg-[#b7a159] hover:bg-[#cbb56c] text-[#212c46] border border-[#b7a159] px-6 py-2 font-black rounded-lg text-[11px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                           <Icons.Printer size={14} /> Print Now
                        </button>
                        <button onClick={() => setPrintingWave(null)} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 font-bold rounded-lg text-[11px] uppercase tracking-widest transition-all text-white flex items-center gap-2">
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
                    
                    {printingWave?.type === 'SLIP' && (
                        <>
                            {/* Packing Slip summary */}
                            <div className="text-center pb-4 border-b-4 border-black mb-6 relative">
                                <div className="absolute top-0 right-0 text-[10px] font-mono text-gray-600 font-bold">DATE PRINTED: {new Date().toLocaleString()}</div>
                                <h1 className="text-3xl font-black uppercase mb-1">PACKING SLIP (WAVE SUMMARY)</h1>
                                <h2 className="text-xl font-bold uppercase">{printingWave.wave.waveNumber}</h2>
                                <div className="mt-4 flex justify-around text-sm border-2 border-black p-2">
                                    <p><strong>Assignment:</strong> {printingWave.wave.assignee}</p>
                                    <p><strong>Strategy:</strong> {printingWave.wave.strategy}</p>
                                    <p><strong>Total Items:</strong> {formatNumber(printingWave.wave.totalItems)}</p>
                                </div>
                            </div>
                            
                            <table className="w-full text-left font-mono border-collapse border border-black text-sm">
                                <thead className="bg-slate-100">
                                    <tr>
                                        <th className="border border-black p-2">ลำดับ</th>
                                        <th className="border border-black p-2">รหัสสินค้า</th>
                                        <th className="border border-black p-2">ชื่อสินค้า</th>
                                        <th className="border border-black p-2 text-center">จำนวนที่ต้องการ</th>
                                        <th className="border border-black p-2 text-center">สแกนหยิบเสร็จ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4, 5].map(idx => (
                                        <tr key={idx}>
                                            <td className="border border-black p-2 text-center">{idx}</td>
                                            <td className="border border-black p-2">RM-{(10000+idx).toString()}</td>
                                            <td className="border border-black p-2">Sodium Chloride 99%</td>
                                            <td className="border border-black p-2 text-center font-bold">{(idx * 50).toString()} KG</td>
                                            <td className="border border-black p-2 text-center"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}

                    {printingWave?.type === 'LABELS' && (
                        <>
                            {/* Labels flex column - 2 per page mock */}
                            <div className="flex flex-col items-center relative">
                                {[1, 2].map((idx) => (
                                    <React.Fragment key={idx}>
                                        <div className="border-[3px] border-black p-6 w-[18cm] h-[12cm] flex flex-col bg-white text-black break-inside-avoid relative shadow-sm my-4">
                                            <div className="absolute top-4 right-4 text-xs font-bold border border-black px-2 py-1">LBL-{idx}</div>
                                            
                                            <div className="text-center w-full pb-4 border-b-[3px] border-black mt-2">
                                                <h3 className="text-5xl font-black mb-2">{idx === 1 ? 'RM PALLET' : 'FG PALLET'}</h3>
                                                <p className="text-sm uppercase font-bold tracking-[0.3em] bg-black text-white px-4 py-1 inline-block">
                                                    {idx === 1 ? 'RAW MATERIAL / วัตถุดิบ' : 'FINISHED GOODS / สินค้าสำเร็จรูป'}
                                                </p>
                                            </div>
                                            
                                            <div className="flex-1 flex flex-col justify-center py-4 space-y-4">
                                                <div className="flex justify-between items-end border-b border-dotted border-black pb-2">
                                                    <div className="flex items-end gap-2"><span className="font-bold text-sm w-24">Item Name:</span> <span className="text-xl font-black">{idx === 1 ? 'Sodium Chloride (Refined) 99%' : 'Premium Soap Base'}</span></div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-6">
                                                    <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">LOT:</span> <span className="text-lg font-bold tracking-widest">L{new Date().getFullYear()}00{idx}</span></div>
                                                    <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">QTY:</span> <span className="text-lg font-bold">{idx === 1 ? '1,000 KG' : '500 PACS'}</span></div>
                                                    <div className="flex items-end gap-2 border-b border-dotted border-black pb-2"><span className="font-bold text-sm w-20">MFG:</span> <span className="text-lg font-bold">{printingWave.wave.date}</span></div>
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
                                                <p className="text-center font-mono text-xl font-bold tracking-[0.2em] mt-2">{printingWave.wave.waveNumber}-00{idx}</p>
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
                        </>
                    )}
                </div>
             </div>
        </DraggableModal>

        <div className={`flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 ${printingWave ? 'print:hidden' : ''}`}>
            
            {/* USER GUIDE FLOATING TAB */}
            <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
                <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
                <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
            </button>

            <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
            
            <WaveModal 
                isOpen={modalData.isOpen} 
                data={modalData.item} 
                onClose={() => setModalData({ isOpen: false, item: null })} 
                onSave={handleSaveWave} 
                onDelete={handleDeleteWave}
            />

            {/* HEADER SECTION */}
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 select-none">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center group cursor-default shrink-0">
                        <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                        <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                            <Icons.Layers size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                        </div>
                    </div>
                    <div className="text-left font-sans">
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            RM WAVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">PLANNING</span>
                        </h3>
                        <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                            (ใบเบิกโรงงาน -- ต้องอ้างอิง ใบสั่งผลิตของฝ่ายวางแผน)
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-4 font-sans">
                    <div className="bg-white/50 p-1 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                        <button onClick={() => setActiveTab('waves')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'waves' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.Layers size={15} /> Picking Waves
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={`px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'settings' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                            <Icons.SlidersHorizontal size={15} /> Wave Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
                <div className="w-full">
                    
                    {/* KPI STATS (Sleek, Compact, Lean Padding - exactly 84px height matching requesting specs) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0 text-left font-sans">
                        <KpiCard label="Orders in queue" value={pendingOrdersCount} icon="shopping-cart" colorAccent={THEME.primaryLight} colorValue={THEME.primary} desc="Unallocated" />
                        <KpiCard label="Pending Waves" value={pendingWaves} icon="clock" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Queue Buffer" />
                        <KpiCard label="Active Picking" value={activeWaves} icon="package" colorAccent={THEME.softPurple} colorValue={THEME.primary} desc="On Floor" />
                        <KpiCard label="Today Completed" value={completedWaves} icon="check-square" colorAccent={THEME.success} colorValue={THEME.success} desc="Performance Index" />
                    </div>

                    {activeTab === 'waves' ? (
                        <div className="bg-white rounded-[20px] shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col font-sans">
                            
                            {/* Filter Bar */}
                            <div className="px-6 py-4.5 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 text-left">
                                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                    <div className="flex items-center bg-white border border-[#eaeaec] h-10 px-3 rounded-xl gap-2 shadow-sm w-full sm:w-auto">
                                        <Icons.Filter size={13} className="text-[#b58c4f] shrink-0" />
                                        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="bg-transparent text-[11px] font-black text-[#503447] uppercase tracking-widest outline-none cursor-pointer w-full">
                                            <option value="All">All Wave Status</option>
                                            <option value="Draft">Draft</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Picking">Picking</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="relative w-full sm:w-72">
                                        <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search Wave Ref, Strategy, Assignee..." className="w-full pl-10 pr-4 py-2.5 text-[11px] font-bold text-[#212c46] rounded-xl border border-[#eaeaec] bg-white outline-none focus:border-[#b7a159] shadow-sm transition-all placeholder:text-[#cbd5e1]" />
                                    </div>
                                </div>
                                <button onClick={() => setModalData({ isOpen: true, item: null })} className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center justify-center gap-2 shrink-0 border border-[#212c46] h-10 w-full md:w-auto">
                                    <Icons.Plus size={15} /> Create New Wave
                                </button>
                            </div>

                            {/* TABLE (Standardized layout styling exactly as specified) */}
                            <div className="overflow-x-auto custom-scrollbar bg-white">
                                <table className="w-full text-left font-sans border-collapse">
                                    {/* py-4 space, bg-133951, border-b-2 is ad2b10 */}
                                    <thead className="bg-[#133951] text-white">
                                        <tr>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">รหัสกลุ่มใบงาน / วันที่วางแผน</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-left">กลยุทธ์การรวมกลุ่มหยิบ (Strategy)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">ภาระงานหยิบนับ (คำสั่งซื้อ / รายการ)</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap text-left">พนักงานหยิบนับคลัง</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap">สถานะกระบวนการ</th>
                                            <th className="py-4 px-4 border-b-2 border-[#ad2b10] font-black uppercase tracking-widest text-[12px] text-center whitespace-nowrap w-32">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#eaeaec] bg-white text-left font-mono">
                                        {paginatedWaves.map(wave => (
                                            <tr key={wave.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex flex-col text-left">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-black text-[#a94228] tracking-tighter text-[12px] font-mono">{wave.waveNumber}</span>
                                                        </div>
                                                        <span className="font-bold text-[#7a8b95] text-[11px] font-sans truncate" title={wave.date}>{wave.date}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-left">
                                                    <div className="flex items-center gap-2">
                                                        {wave.strategy.includes('Zone') ? (
                                                            <div className="p-1 rounded bg-[#b58c4f]/10 text-[#b58c4f] border border-[#b58c4f]/25 shrink-0">
                                                                <Icons.MapPin size={13} />
                                                            </div>
                                                        ) : wave.strategy.includes('Route') ? (
                                                            <div className="p-1 rounded bg-[#3f809e]/10 text-[#3f809e] border border-[#3f809e]/25 shrink-0">
                                                                <Icons.Route size={13} />
                                                            </div>
                                                        ) : (
                                                            <div className="p-1 rounded bg-[#932c2e]/10 text-[#932c2e] border border-[#932c2e]/25 shrink-0 animate-pulse">
                                                                <Icons.Zap size={13} />
                                                            </div>
                                                        )}
                                                        <span className="font-black text-[#212c46] font-sans text-[12px] uppercase truncate max-w-[240px]">{wave.strategy}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="font-black text-[#212c46] text-[12px] font-mono">{wave.totalOrders} <span className="font-sans text-[10px] text-[#7a8b95] font-bold">Orders</span></span>
                                                        <span className="text-[10px] font-black text-[#3f809e] bg-[#3f809e]/10 px-1.5 py-0.5 rounded border border-[#3f809e]/15 font-mono mt-0.5">{formatNumber(wave.totalItems)} Items</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex items-center gap-2 text-left justify-start">
                                                        <div className="w-6 h-6 rounded-full bg-[#coolGray] border border-[#d7d7d7] flex items-center justify-center text-[#212c46] overflow-hidden bg-slate-100">
                                                            {wave.assignee === 'Unassigned' ? <Icons.Users size={12} className="text-[#a94228]"/> : <span className="text-[9px] font-black font-mono">{wave.assignee.charAt(0)}</span>}
                                                        </div>
                                                        <span className={`text-[12px] font-bold font-sans ${wave.assignee === 'Unassigned' ? 'text-[#7a8b95] italic font-medium' : 'text-[#212c46]'}`}>{wave.assignee}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <span className={`px-2 py-0.5 rounded border text-[11px] font-black uppercase tracking-widest inline-block ${getStatusStyle(wave.status)}`}>
                                                        {wave.status}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-center">
                                                    <div className="flex justify-center items-center">
                                                        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 gap-0.5 shadow-sm">
                                                            {wave.status === 'Pending' && (
                                                                <button onClick={() => handleQuickActionStatus(wave.id, 'Picking')} className="w-7 h-7 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all" title="Start Picking Sequence">
                                                                    <Icons.Play size={13} fill="currentColor" />
                                                                </button>
                                                            )}
                                                            {wave.status === 'Picking' && (
                                                                <button onClick={() => handleQuickActionStatus(wave.id, 'Completed')} className="w-7 h-7 flex items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all" title="Confirm Picking Completed">
                                                                    <Icons.CheckSquare size={13} />
                                                                </button>
                                                            )}
                                                            <button onClick={() => setPrintingWave({ wave, type: 'SLIP' })} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-[#b58c4f] hover:text-white transition-all" title="Print Packing Slip (Summary)">
                                                                <Icons.FileText size={13} />
                                                            </button>
                                                            <button onClick={() => setPrintingWave({ wave, type: 'LABELS' })} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-[#3f809e] hover:text-white transition-all" title="Print RM/FG Identification Labels">
                                                                <Icons.Tags size={13} />
                                                            </button>
                                                            <button onClick={() => setModalData({ isOpen: true, item: wave as any })} className="w-7 h-7 flex items-center justify-center rounded-md text-slate-500 hover:bg-[#212c46] hover:text-white transition-all" title="View Details">
                                                                <Icons.ZoomIn size={13} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredWaves.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-20 text-center text-[#7a8b95] font-bold text-[12px] uppercase tracking-widest font-sans">
                                                    No waving planning records found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination (py-3) */}
                            <div className="px-6 py-3 bg-[#eaeaec]/40 backdrop-blur-sm border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-mono">
                                <div className="flex items-center gap-4 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest font-sans">
                                    <div className="flex items-center gap-1.5">
                                        <span>Display:</span>
                                        <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-white border border-[#eaeaec] rounded-md px-1.5 py-0.5 outline-none font-black text-[#212c46] cursor-pointer shadow-sm">
                                            {[10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                    <p className="bg-white px-2.5 py-0.5 rounded border border-[#eaeaec] shadow-sm font-mono text-[10px]">Total found: {filteredWaves.length}</p>
                                </div>
                                <div className="flex items-center gap-1 select-none">
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}>
                                        <Icons.ChevronLeft size={14}/>
                                    </button>
                                    <div className="bg-white text-[#212c46] px-3 py-1 rounded border border-[#eaeaec] shadow-sm text-[10px] font-black uppercase tracking-wider min-w-[90px] text-center">
                                        PAGE {currentPage} / {totalPages}
                                    </div>
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}>
                                        <Icons.ChevronRight size={14}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                            {/* LEFT DESCRIPTIONS POLICY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-4 bg-white/90 p-5 rounded-2xl shadow-lg border border-[#eaeaec] animate-fadeIn text-left">
                                <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-5"><Icons.ShieldCheck size={18} className="text-[#b7a159]" /> BATCHING POLICIES</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#3f809e] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Eye size={16}/> Public Route Criteria</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">สายการรวมคำสั่งซื้อแบบทั่วไป: ใบเบิกคิวปกติพนักงานปฏิบัติงานหยิบสล็อตเรียงคิวหยิบด้วยสายรถโฟล์คลิฟต์มาตรฐาน ไม่มีความลับหรือข้อบังคับพิเศษด้านความปลอดภัย</p>
                                    </div>
                                    <div className="p-4 bg-[#932c2e]/10 border border-[#932c2e]/30 rounded-xl shadow-sm">
                                        <div className="flex items-center gap-2 text-[#a94228] font-black text-[12px] uppercase tracking-widest mb-1.5"><Icons.Lock size={16}/> Restricted Secure Batch</div>
                                        <p className="text-[11.5px] text-[#414757] font-bold leading-relaxed font-sans">ท่อคลังลับสำหรับเวฟความพึงมีสิทธิพิเศษ: ป้องกันการตรวจสอบสินค้าจำพวกเวชภัณฑ์ควบคุมอุณหภูมิ คาร์โก้เทคโนโลยี หรือสารสกัดจำเป็นเพื่อป้องกันข้อมูลสูญเสียคลัง</p>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT DYNAMIC PORTALS/STRATEGIES REGISTRY (STANDARD เดียวกับ User Permissions) */}
                            <div className="lg:col-span-8 bg-white rounded-2xl shadow-lg border border-[#eaeaec] overflow-hidden text-left">
                                <div className="p-4.5 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                                    <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2.5"><Icons.ListTree size={16} className="text-[#b7a159]"/> WAVE STRATEGY REGISTRY</h4>
                                    <button onClick={() => {
                                        const newId = prompt('Enter New Strategy Constraint ID (e.g. POL-D):');
                                        if (newId) {
                                            setStrategies([
                                                ...strategies,
                                                { id: newId.toUpperCase(), name: `${newId.toUpperCase()}: CUSTOM DELAY DISPATCH RULES`, strategy: 'Manual grouping by bulk items volume threshold', type: 'Specialized Dry Floor Lot', maxOrders: 15, isActive: true, isConfidential: false, rules: [] }
                                            ]);
                                        }
                                    }} className="bg-[#212c46] hover:bg-[#414757] text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 transition-colors">
                                        <Icons.Plus size={14}/> Add New Strategy
                                    </button>
                                </div>
                                <div className="p-5 space-y-3 custom-scrollbar">
                                    {strategies.map(strat => (
                                        <div key={strat.id} className="space-y-2">
                                            <div className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${strat.isConfidential ? 'bg-[#932c2e]/5 border-[#932c2e]/30 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm ${strat.isConfidential ? 'bg-[#932c2e]/20 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                        <Icons.Layers size={15}/>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="font-black text-[#212c46] text-[11px] uppercase tracking-widest">{strat.name}</span>
                                                            <button onClick={() => toggleExpandStrategy(strat.id)} className="p-1 hover:bg-[#coolGray]/50 rounded transition-all text-[#b58c4f]">
                                                                <Icons.ChevronDown size={14} className={`transition-transform duration-300 ${expandedStrategies[strat.id] ? 'rotate-180' : ''}`} />
                                                            </button>
                                                        </div>
                                                        <p className="text-[10px] text-[#7a8b95] leading-tight font-sans mt-0.5">{strat.strategy} • Limit <strong className="text-[#a94228]">{strat.maxOrders} orders</strong></p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => toggleConfidential(strat.id)} className={`p-2 rounded-lg transition-all shadow-sm active:scale-95 border ${strat.isConfidential ? 'bg-[#932c2e] text-white border-[#932c2e]' : 'bg-white text-[#7a8b95] border-[#eaeaec] hover:bg-[#f8f9fa]'}`} title="Toggle Strategy Sensitivity Mode">
                                                        {strat.isConfidential ? <Icons.Lock size={14}/> : <Icons.Eye size={14}/>}
                                                    </button>
                                                    <button onClick={() => deleteStrategyRule(strat.id)} className="p-2 rounded-lg text-[#932c2e] bg-[#932c2e]/10 hover:bg-[#932c2e]/20 border border-transparent transition-all active:scale-95" title="Remove Configuration Strategy">
                                                        <Icons.Trash2 size={14}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Sub Rules inside Strategy (Standard เดียวกับ User Permissions) */}
                                            {expandedStrategies[strat.id] && strat.rules && (
                                                <div className="ml-10 space-y-2 animate-fadeIn pr-2 pb-2">
                                                    {strat.rules.map((rule: any) => (
                                                        <div key={rule.id} className={`flex items-center justify-between px-3.5 py-2 rounded-lg border bg-white transition-all ${rule.isConfidential ? 'border-[#932c2e]/40 bg-[#932c2e]/5 shadow-inner' : 'border-[#eaeaec] hover:border-[#3f809e]'}`}>
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${rule.isConfidential ? 'bg-[#932c2e] animate-pulse' : 'bg-[#b7a159]'}`}></div>
                                                                <div>
                                                                    <span className="text-[11px] font-black text-[#212c46] uppercase tracking-wide">{rule.label}</span>
                                                                    <p className="text-[9.5px] font-sans text-[#7a8b95] leading-none mt-0.5">{rule.rule}</p>
                                                                </div>
                                                            </div>
                                                            <button onClick={() => toggleRuleConfidential(strat.id, rule.id)} className={`p-1.5 rounded transition-all ${rule.isConfidential ? 'bg-[#932c2e]/10 text-[#932c2e]' : 'text-[#7a8b95] hover:bg-slate-100'}`}>
                                                                {rule.isConfidential ? <Icons.Lock size={13}/> : <Icons.Eye size={13}/>}
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => {
                                                        const label = prompt('Enter Rule Label:');
                                                        const ruleTxt = prompt('Enter Rule Condition Clause:');
                                                        if (label && ruleTxt) {
                                                            setStrategies(strategies.map(s => {
                                                                if (s.id === strat.id) {
                                                                    return {
                                                                        ...s,
                                                                        rules: [...(s.rules || []), { id: `RULE-${Date.now()}`, label: label.toUpperCase(), rule: ruleTxt, isConfidential: false }]
                                                                    };
                                                                }
                                                                return s;
                                                            }));
                                                        }
                                                    }} className="text-[10px] font-black uppercase text-[#3f809e] hover:text-[#b58c4f] transition-colors flex items-center gap-1 mt-1 ml-1 select-none">
                                                        <Icons.Plus size={11}/> Add Rule Clause
                                                    </button>
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
        </div>
        </>
    );
}
