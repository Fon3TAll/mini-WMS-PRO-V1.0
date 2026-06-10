import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Store, Package, Truck, Clock, CheckCircle2, AlertCircle, 
  Search, Filter, Download, ChevronLeft, ChevronRight, 
  Eye, X, HelpCircle, BookOpen, Plus, Printer, Edit3, 
  Layers, Zap, MapPin, ClipboardList, TrendingUp, BarChart3,
  MoveRight, Boxes, History, Save, Route, Settings
} from 'lucide-react';

// --- Theme Configuration (Synced with Home) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'transparent',
    sidebarBg: 'linear-gradient(180deg, #1a253d 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#1a253d',
    primaryLight: '#6a95b1',
    accent: '#ad2b10',
    gold: '#ce8a39',
    brightGold: '#e5b73b',
    success: '#a8c0bb',
    danger: '#922724',
    warning: '#ad2b10',
    skyBlue: '#133951',
    dustyBlue: '#788990',
    indigo: '#2b3a44',
    softPurple: '#beced3',
    deepPurple: '#3c3f20',
    pinkAccent: '#a5654e',
    mutedSlate: '#676767',
    darkSlate: '#5e342b',
    silver: '#d7d7d7',
    deepNavy: '#1a253d',
    brownGold: '#a34617',
    vibrantPurple: '#3c3f20',
    burntOrange: '#ad2b10',
    slateBlue: '#769eb0',
    coolGray: '#f3f3f1',
    c1: '#1a253d',
    c2: '#ce8a39',
    c3: '#7a8b95',
    bgDark: '#e9e9e9',
};

// --- Initial Mock Data ---
const INITIAL_BRANCH_SO = [
  { id: 'SO-2605-001', branch: 'Siam Paragon (M-Floor)', items: 85, date: '2026-05-06 08:30', priority: 'Urgent', status: 'Processing', wave: 'WAVE-A1', totalQty: 1250 },
  { id: 'SO-2605-002', branch: 'Central World (6th Floor)', items: 120, date: '2026-05-06 09:15', priority: 'Normal', status: 'Waving', wave: 'WAVE-B2', totalQty: 2400 },
  { id: 'SO-2605-003', branch: 'EmQuartier (Level 3)', items: 45, date: '2026-05-06 10:00', priority: 'Normal', status: 'Pending', wave: '-', totalQty: 850 },
  { id: 'SO-2605-004', branch: 'Mega Bangna (G-Zone)', items: 210, date: '2026-05-06 10:45', priority: 'Urgent', status: 'Dispatched', wave: 'WAVE-C1', totalQty: 4800 },
  { id: 'SO-2605-005', branch: 'Iconsiam (River Side)', items: 15, date: '2026-05-06 11:20', priority: 'Normal', status: 'Delivered', wave: 'WAVE-D5', totalQty: 320 },
  { id: 'SO-2605-006', branch: 'Central Westgate', items: 65, date: '2026-05-06 12:00', priority: 'Normal', status: 'Processing', wave: 'WAVE-A1', totalQty: 1100 },
];

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH').format(val);

// --- Sub-components ---
const KpiCard = ({ icon: IconComp, value, label, colorAccent, colorValue, desc, trendValue }: any) => (
  <div className="bg-white/90 px-5 py-5 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#ce8a39] transition-all min-h-[110px] flex flex-col justify-between animate-fadeIn">
    <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
      <IconComp size={100} color={colorAccent} />
    </div>
    <div className="relative z-10 flex justify-between items-start w-full text-left">
      <p className="text-[11px] font-bold text-[#788990] uppercase tracking-widest">{label}</p>
      <div className={`w-10 h-10 rounded-[14px] border flex items-center justify-center shrink-0 shadow-sm transition-all`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}30`, color: colorAccent}}>
        <IconComp size={20} />
      </div>
    </div>
    <div className="relative z-10 mt-2 text-left">
      <p className="text-[26px] font-black leading-none" style={{color: colorValue}}>{value}</p>
      <div className="flex justify-between items-end mt-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#788990]">{desc}</span>
        {trendValue && <span className="text-[10px] font-black flex items-center gap-0.5" style={{color: THEME.success}}><TrendingUp size={12}/> {trendValue}</span>}
      </div>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = {};
  switch (status) {
    case 'Delivered': style = { bg: THEME.success + '1A', color: THEME.success, border: THEME.success + '40' }; break;
    case 'Dispatched': style = { bg: THEME.skyBlue + '1A', color: THEME.skyBlue, border: THEME.skyBlue + '40' }; break;
    case 'Waving': style = { bg: THEME.gold + '1A', color: THEME.gold, border: THEME.gold + '40' }; break;
    case 'Processing': style = { bg: THEME.danger + '1A', color: THEME.danger, border: THEME.danger + '40' }; break;
    case 'Pending': style = { bg: THEME.dustyBlue + '1A', color: THEME.dustyBlue, border: THEME.dustyBlue + '40' }; break;
    default: style = { bg: '#eee', color: '#666', border: '#ccc' };
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: (style as any).bg, color: (style as any).color, borderColor: (style as any).border }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (style as any).color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Create New Branch SO Modal
function CreateBranchSOModal({ isOpen, onClose, onSave }: any) {
    const [formData, setFormData] = useState({ branch: '', items: '', totalQty: '', priority: 'Normal' });
    if (!isOpen) return null;

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const now = new Date();
        const formattedDate = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        onSave({
            id: `SO-2605-${Math.floor(Math.random()*900)+100}`,
            branch: formData.branch,
            items: Number(formData.items),
            totalQty: Number(formData.totalQty),
            priority: formData.priority,
            date: formattedDate,
            status: 'Pending',
            wave: '-'
        });
        setFormData({ branch: '', items: '', totalQty: '', priority: 'Normal' });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[550px] overflow-hidden border border-white/60">
                <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-white/5">
                    <div className="flex items-center gap-4 text-white">
                        <div className="w-10 h-10 rounded-xl bg-[#e5b73b]/20 flex items-center justify-center text-[#e5b73b] border border-[#e5b73b]/30 shadow-inner"><Plus size={20} /></div>
                        <div>
                            <h3 className="text-base font-black uppercase tracking-widest leading-none mb-1">New Branch Request</h3>
                            <p className="text-[9px] font-bold text-[#e5b73b] uppercase tracking-[0.1em]">Create new sales order for branch replenishment</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white"><X size={18} /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 bg-[#f8f9fa] space-y-5">
                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-[#788990] uppercase ml-1">Destination Branch</label>
                        <select required value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39]">
                            <option value="">-- Select Branch --</option>
                            <option value="Siam Paragon (M-Floor)">Siam Paragon (M-Floor)</option>
                            <option value="Central World (6th Floor)">Central World (6th Floor)</option>
                            <option value="EmQuartier (Level 3)">EmQuartier (Level 3)</option>
                            <option value="Mega Bangna (G-Zone)">Mega Bangna (G-Zone)</option>
                            <option value="Central Westgate">Central Westgate</option>
                            <option value="Iconsiam (River Side)">Iconsiam (River Side)</option>
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-left">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#788990] uppercase ml-1">Total Unique SKUs</label>
                            <input required value={formData.items} onChange={e => setFormData({...formData, items: e.target.value})} type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39]" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#788990] uppercase ml-1">Total Volume (Units)</label>
                            <input required value={formData.totalQty} onChange={e => setFormData({...formData, totalQty: e.target.value})} type="number" placeholder="0" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39]" />
                        </div>
                    </div>
                    <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-[#ad2b10] uppercase ml-1">Order Priority</label>
                        <select required value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ad2b10]">
                            <option value="Normal">Normal (Standard Delivery)</option>
                            <option value="Urgent">Urgent (Priority Handling)</option>
                        </select>
                    </div>
                    <div className="pt-4 flex justify-between gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg font-bold text-[11px] uppercase active:scale-95 transition-all">Cancel</button>
                        <button type="submit" className="px-8 py-2.5 bg-[#ad2b10] text-white rounded-lg font-black text-[11px] uppercase shadow-md active:bg-[#922724] active:text-white transition-all flex items-center gap-2">
                            <Save size={14}/> Submit Order
                        </button>
                    </div>
                </form>
            </div>
        </div>, document.body
    );
}

// 2. Allocate Wave Modal
function AllocateWaveModal({ isOpen, onClose, data, onConfirm }: any) {
    const [selectedWave, setSelectedWave] = useState('WAVE-A1');
    if (!isOpen || !data) return null;

    return createPortal(
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-md p-4 animate-fadeIn">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[450px] overflow-hidden border border-white/60">
                <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner overflow-hidden"><Layers size={20} className="text-[#ce8a39]" /></div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-widest leading-none">Allocate Wave</h3>
                            <p className="text-[9px] font-bold text-[#ce8a39] uppercase mt-1">{data.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white"><X size={18} /></button>
                </div>
                
                <div className="p-6 bg-[#f8f9fa] space-y-5">
                    <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm text-left">
                        <div className="text-[14px] font-black text-[#1a253d] uppercase mb-1">{data.branch}</div>
                        <div className="text-[11px] font-bold text-[#788990] mb-2">Items: {data.items} SKUs | Total: {formatNumber(data.totalQty)} Units</div>
                        {data.priority === 'Urgent' && <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#ad2b10] uppercase"><Zap size={10} className="fill-current"/> Priority Handling Req.</span>}
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase text-[#788990] ml-1">Assign to Wave Plan</label>
                        <select value={selectedWave} onChange={e => setSelectedWave(e.target.value)} className="w-full px-4 py-3 bg-white border border-[#eaeaec] rounded-xl text-sm font-black focus:border-[#ce8a39] outline-none transition-all text-[#1a253d]">
                            <option value="WAVE-A1">WAVE-A1 (Morning Dispatch)</option>
                            <option value="WAVE-B2">WAVE-B2 (Noon Dispatch)</option>
                            <option value="WAVE-C1">WAVE-C1 (Evening Dispatch)</option>
                            <option value="WAVE-NEW">Create New Wave</option>
                        </select>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg text-[11px] font-black uppercase hover:bg-[#eaeaec]">Cancel</button>
                    <button onClick={() => { onConfirm(data.id, selectedWave); onClose(); }} className="px-8 py-2 bg-[#ce8a39] text-white rounded-lg text-[11px] font-black uppercase shadow-md flex items-center gap-2 hover:bg-[#b7a159] active:scale-95 transition-all">
                        <CheckCircle2 size={14}/> Confirm Wave
                    </button>
                </div>
            </div>
        </div>, document.body
    );
}

// 3. SO Detail Modal
function SODetailModal({ isOpen, onClose, data }: any) {
  if (!isOpen || !data) return null;
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[750px] flex flex-col overflow-hidden relative border border-white/60">
        <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
              <Store size={20} className="text-[#ce8a39]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">BRANCH ORDER DETAIL</h3>
              <span className="text-[9px] font-black text-[#ce8a39] bg-[#ce8a39]/20 px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#ce8a39]/30 drop-shadow-sm">{data.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"><X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8f9fa] text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                <label className="text-[9px] font-black text-[#788990] uppercase tracking-widest">Branch Destination</label>
                <div className="text-[16px] font-black text-[#1a253d] uppercase mt-1">{data.branch}</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-[#788990]">
                  <MapPin size={14} className="text-[#ad2b10]"/> BKK Hub Region
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="text-[9px] font-black text-[#788990] uppercase mb-1">Order Date</div>
                  <div className="text-[12px] font-black text-[#1a253d]">{data.date}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="text-[9px] font-black text-[#788990] uppercase mb-1">Assigned Wave</div>
                  <div className="text-[12px] font-black text-[#ce8a39]">{data.wave}</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#1a253d] p-5 rounded-2xl shadow-lg border border-[#0F172A] text-center">
                <label className="text-[9px] font-black text-[#788990] uppercase tracking-widest">Total Fulfillment Volume</label>
                <div className="text-3xl font-black text-white mt-1">{formatNumber(data.totalQty)} <span className="text-sm font-bold text-[#eaeaec]">Units</span></div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black text-white">
                  <Package size={12}/> {data.items} Unique SKUs
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-[#eaeaec] shadow-sm">
                <span className="text-[10px] font-black text-[#788990] uppercase">Current Lifecycle</span>
                <StatusBadge status={data.status} />
              </div>
            </div>
          </div>

          <div className="mt-6 bg-white border border-[#eaeaec] rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
                  <h4 className="text-[11px] font-black text-[#1a253d] uppercase tracking-widest flex items-center gap-2"><ClipboardList size={14} className="text-[#ce8a39]"/> SKU Breakdown</h4>
                  <span className="text-[10px] font-bold text-[#788990]">Summary of Demand</span>
              </div>
              <div className="p-4 space-y-3">
                  {[
                    { sku: 'SKU-8821', name: 'Premium Arabica Coffee', qty: Math.floor(data.totalQty * 0.4) },
                    { sku: 'SKU-9904', name: 'Mineral Water 600ml', qty: Math.floor(data.totalQty * 0.6) },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[12px] pb-2 border-b border-[#eaeaec] last:border-0 last:pb-0">
                        <div className="flex flex-col">
                            <span className="font-black text-[#1a253d]">{item.sku}</span>
                            <span className="text-[11px] text-[#788990]">{item.name}</span>
                        </div>
                        <div className="text-right">
                            <span className="font-black text-[#133951]">{item.qty}</span>
                        </div>
                    </div>
                  ))}
              </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#eaeaec] flex justify-between items-center shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec] transition-all">Cancel</button>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#1a253d] rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-[#f8f9fa] transition-all flex items-center gap-2 border-[1.5px] active:scale-95"><Printer size={14} /> Shipping Mark</button>
            <button onClick={onClose} className="px-8 py-2.5 bg-[#ad2b10] text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#922724] transition-all border border-[#ad2b10] flex items-center gap-2 active:scale-95">
                <CheckCircle2 size={14} /> Close
            </button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
}

// 4. User Guide Panel
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-4 border-[#ce8a39] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="bg-gradient-to-r from-[#1a253d] to-[#2b3a44] px-5 py-4 flex justify-between items-center text-white shrink-0 border-b-4 border-[#ce8a39] shadow-sm relative z-10 text-left">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#ce8a39] shadow-inner border border-white/5"><BookOpen size={20} /></div>
            <div>
              <h3 className="text-base font-black flex items-center gap-2 uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">BRANCH SO GUIDE</h3>
              <p className="text-[10px] font-bold text-[#ce8a39] uppercase tracking-widest mt-1 drop-shadow-sm">คู่มือการจัดการใบสั่งจัดส่ง</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#788990] hover:text-white"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-[#4d4146] text-[12px] leading-relaxed bg-[#f8f9fa] text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#1a253d] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Settings size={16} className="text-[#ce8a39]"/> 1. Action Nodes (ปุ่มดำเนินการ)</h4>
            <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#ce8a39] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#133951] shadow-sm"><Eye size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#1a253d] uppercase">View SO Details (ดูรายละเอียด)</p>
                        <p className="text-[10.5px] text-[#788990] mt-1 leading-relaxed">ใช้สำหรับตรวจสอบข้อมูลคำสั่งซื้อสาขา เช่น จำนวน SKU ที่ร้องขอ, ปริมาณรวม, สาขาปลายทาง และแผน Wave ที่ถูกจับคู่ไว้แล้ว</p>
                    </div>
                </div>
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#ce8a39] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#ce8a39] shadow-sm"><Layers size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#1a253d] uppercase">Allocate Wave (จัดเข้าคิว Wave)</p>
                        <p className="text-[10.5px] text-[#788990] mt-1 leading-relaxed">ระบบสำหรับการดึง Order ย่อยต่างๆ นำมารวมกันเป็นรอบการจัด (Wave) เดียวกัน เพื่อให้การเดินหยิบสินค้า (Picking) ของพนักงานมีประสิทธิภาพสูงสุด</p>
                    </div>
                </div>
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#ce8a39] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#ad2b10] shadow-sm"><Plus size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#1a253d] uppercase">New Branch Request (สร้างออเดอร์ใหม่)</p>
                        <p className="text-[10.5px] text-[#788990] mt-1 leading-relaxed">ปุ่มหลักบริเวณมุมขวาบน ใช้สร้างคำร้องขอเติมสินค้าจากสาขาเข้าสู่ระบบส่วนกลาง เพื่อรอการจัดคิวเข้า Wave</p>
                    </div>
                </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#1a253d] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Store size={16} className="text-[#ce8a39]"/> 2. Demand Consolidation</h4>
            <p className="text-[11px] mb-3 font-medium text-[#788990]">ทำหน้าที่เป็นศูนย์กลางรับข้อมูลความต้องการจากหน้าร้าน (Branch Request):</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm"><Layers size={16} className="shrink-0 text-[#ce8a39] mt-0.5"/> <div className="font-medium text-[11px]"><strong className="text-[#1a253d] font-bold tracking-wide">Waving Plan:</strong> การจัดสรรออเดอร์เข้า Wave ช่วยลดระยะทางและเวลาในการเดินของพนักงานหยิบ</div></li>
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm"><Zap size={16} className="shrink-0 text-[#133951] mt-0.5"/> <div className="font-medium text-[11px]"><strong className="text-[#1a253d] font-bold tracking-wide">Urgent Handling:</strong> หากสาขาระบุสถานะ Urgent (ด่วน) ระบบจะช่วยให้มองเห็นได้ง่าย เพื่อรีบทำ Allocation ก่อน</div></li>
            </ul>
          </section>
        </div>
        
        <div className="px-5 py-4 bg-white border-t border-[#eaeaec] flex justify-end shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#1a253d] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#ce8a39] transition-all shadow-md tracking-widest border active:scale-95 flex items-center gap-2"><CheckCircle2 size={16}/> รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// --- Main Application ---
export default function BranchSO() {
  const [branchSOs, setBranchSOs] = useState(INITIAL_BRANCH_SO);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [allocateModal, setAllocateModal] = useState({ isOpen: false, data: null });

  // Logic to handle new Branch SO creation
  const handleSaveNewSO = (newSO: any) => {
      setBranchSOs([newSO, ...branchSOs]);
  };

  // Logic to handle Wave Allocation
  const handleAllocateWave = (soId: string, waveName: string) => {
      setBranchSOs(prev => prev.map(so => {
          if(so.id === soId) {
              return { ...so, wave: waveName, status: 'Waving' };
          }
          return so;
      }));
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    return branchSOs.filter(item => {
      const matchSearch = item.branch.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [branchSOs, search, statusFilter]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // KPI Calculations
  const urgentCount = branchSOs.filter(s => s.priority === 'Urgent').length;
  const pendingWave = branchSOs.filter(s => s.status === 'Pending').length;
  const totalVolume = branchSOs.reduce((acc, s) => acc + s.totalQty, 0);

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* Floating Guide Button */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#1a253d] rounded-l-xl shadow-md hover:bg-[#922724] hover:text-white hover:border-[#922724] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#788990] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <CreateBranchSOModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSave={handleSaveNewSO} />
      <SODetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} data={detailModal.data} />
      <AllocateWaveModal isOpen={allocateModal.isOpen} onClose={() => setAllocateModal({isOpen: false, data: null})} data={allocateModal.data} onConfirm={handleAllocateWave} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#1a253d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#1a253d]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Store size={28} strokeWidth={2.5} className="text-[#1a253d]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      BRANCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a253d] to-[#ad2b10]">SO</span> (ใบสั่งจัดส่ง)
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      CENTRALIZED DEMANDHUB & BRANCH DELIVERY ORDERS
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <button onClick={() => setIsCreateOpen(true)} className="bg-[#ad2b10] hover:bg-[#922724] text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2">
                  <Plus size={14} /> New Branch Request
              </button>
          </div>
      </div>

      <div className="px-4 sm:px-8 w-full mt-[2px]">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Total Demand" value={formatNumber(totalVolume)} icon={Boxes} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Current Units Required" trendValue="+8.2%" />
                <KpiCard label="Pending Wave" value={pendingWave} icon={Layers} colorAccent={THEME.warning} colorValue={THEME.primary} desc="Unscheduled Orders" />
                <KpiCard label="Urgent Requests" value={urgentCount} icon={Zap} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Priority Handling Required" />
                <KpiCard label="On-Time Delivery" value="96.5%" icon={Truck} colorAccent={THEME.success} colorValue={THEME.success} desc="SLA Compliance Score" />
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px]">
                
                {/* TOOLBAR */}
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#ce8a39] transition-colors">
                            <Filter size={14} className="text-[#788990]" />
                            <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#1a253d] cursor-pointer">
                                <option value="All">All SO Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Waving">Waving</option>
                                <option value="Processing">Processing</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 bg-[#1a253d] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#ce8a39] transition-colors shadow-sm active:scale-95">
                            <Download size={14} /> Export Report
                        </button>
                    </div>
                    
                    <div className="relative w-full md:w-80 text-left">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788990]" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                            placeholder="Search Branch or SO Number..." 
                            className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#ce8a39] bg-white shadow-sm text-[#1a253d] transition-all" 
                        />
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                    <table className="w-full text-left font-sans border-collapse text-left">
                        <thead className="bg-[#133951] text-white sticky top-0 z-10 text-left">
                            <tr className="border-b-2 border-[#ad2b10]">
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">เลขที่ใบสั่งขาย (SO No.)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">สาขาจัดส่งที่ร้องขอ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">วันเวลาที่บันทึก</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สแกนรวมรายการ (SKUs)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">แผนใบงานคลื่น (Wave)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะออเดอร์</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ระดับความเร่งด่วน</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                            {currentData.length > 0 ? currentData.map(item => (
                                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                    <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                    <td className="py-2.5 px-4 font-black text-[#1a253d] text-[12px] uppercase">{item.branch}</td>
                                    <td className="py-2.5 px-4 font-bold text-[#788990] text-[12px]">{item.date}</td>
                                    <td className="py-2.5 px-4 text-center font-black text-[#1a253d] text-[12px]">{item.items}</td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${item.wave !== '-' ? 'bg-[#ce8a39]/10 text-[#ce8a39] border border-[#ce8a39]/30' : 'text-[#788990]'}`}>
                                            {item.wave}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center"><StatusBadge status={item.status} /></td>
                                    <td className="py-2.5 px-4">
                                        <div className={`flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest ${item.priority === 'Urgent' ? 'text-[#ad2b10]' : 'text-[#788990]'}`}>
                                            {item.priority === 'Urgent' && <Zap size={10} className="fill-current animate-pulse"/>}
                                            {item.priority}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex justify-center items-center gap-[1px] opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#6a95b1] bg-white hover:bg-[#6a95b1] hover:text-white active:scale-90 transition-all"
                                                title="View SO Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button 
                                                onClick={() => setAllocateModal({ isOpen: true, data: item })}
                                                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#ce8a39] bg-white hover:bg-[#ce8a39] hover:text-white active:scale-90 transition-all" 
                                                title="Allocate Wave"
                                            >
                                                <Layers size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-[#788990] font-black text-[12px] uppercase tracking-widest bg-[#f8f9fa]">No branch orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-3 bg-white border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl">
                    <div className="flex items-center gap-5 text-[10px] font-black text-[#788990] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Rows:</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-[#f8f9fa] border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#1a253d] cursor-pointer shadow-sm focus:border-[#ce8a39]"
                            >
                                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <p className="bg-[#f8f9fa] px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Demand: {filteredData.length} SOs</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                            disabled={currentPage === 1}
                            className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#1a253d] shadow-sm text-[#788990] active:scale-90'}`}
                        >
                            <ChevronLeft size={14}/>
                        </button>
                        <div className="bg-[#f8f9fa] text-[#1a253d] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                            Page {currentPage} / {totalPages}
                        </div>
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={currentPage === totalPages}
                            className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#f8f9fa] hover:text-[#1a253d] shadow-sm text-[#788990] active:scale-90'}`}
                        >
                            <ChevronRight size={14}/>
                        </button>
                    </div>
                </div>
            </div>

      <div className="mt-8 shrink-0"></div>            
      </div>
    </div>
  );
}
