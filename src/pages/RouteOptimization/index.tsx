import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Map, Route, Truck, Zap, Fuel, Navigation, Search, Filter, 
  Download, ChevronLeft, ChevronRight, Eye, CheckCircle2, X, 
  HelpCircle, BookOpen, Clock, Plus, Printer, MapPin, 
  BarChart3, TrendingUp, TrendingDown, ShieldCheck, Activity, Flag, 
  MoreHorizontal, Compass, Layers, Milestone, AlertCircle, Wallet, ClipboardCheck,
  User, ArrowUpRight, ArrowDownRight, Save, Trash2, Settings2, Settings
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
const INITIAL_ROUTES = [
  { id: 'RT-2026-001', vehicle: '6-Wheel Truck (TR-08)', driver: 'Kitti S.', stops: 12, distance: 45.2, status: 'Optimized', savings: '15.5%', date: '2026-05-06' },
  { id: 'RT-2026-002', vehicle: '4-Wheel Pickup (BK-22)', driver: 'Somsak W.', stops: 8, distance: 28.8, status: 'En-Route', savings: '12.0%', date: '2026-05-06' },
  { id: 'RT-2026-003', vehicle: '10-Wheel Trailer (LB-05)', driver: 'Preecha K.', stops: 3, distance: 185.0, status: 'Pending', savings: '8.4%', date: '2026-05-06' },
  { id: 'RT-2026-004', vehicle: '6-Wheel Truck (TR-12)', driver: 'Anuwat J.', stops: 15, distance: 52.4, status: 'Optimized', savings: '18.2%', date: '2026-05-06' },
  { id: 'RT-2026-005', vehicle: '4-Wheel Pickup (BK-09)', driver: 'Vichai M.', stops: 22, distance: 38.5, status: 'Completed', savings: '21.0%', date: '2026-05-05' },
  { id: 'RT-2026-006', vehicle: 'Van Express (VN-01)', driver: 'Somchai T.', stops: 10, distance: 33.1, status: 'Risk', savings: '5.5%', date: '2026-05-06' },
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
    case 'Optimized': style = { bg: THEME.success + '1A', color: THEME.success, border: THEME.success + '40' }; break;
    case 'En-Route': style = { bg: THEME.skyBlue + '1A', color: THEME.skyBlue, border: THEME.skyBlue + '40' }; break;
    case 'Pending': style = { bg: THEME.gold + '1A', color: THEME.gold, border: THEME.gold + '40' }; break;
    case 'Risk': style = { bg: THEME.danger + '1A', color: THEME.danger, border: THEME.danger + '40' }; break;
    case 'Completed': style = { bg: THEME.dustyBlue + '1A', color: THEME.dustyBlue, border: THEME.dustyBlue + '40' }; break;
    default: style = { bg: '#eee', color: '#666', border: '#ccc' };
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: (style as any).bg, color: (style as any).color, borderColor: (style as any).border }}>
      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: (style as any).color }}></div> {status}
    </span>
  );
};

// --- Modals ---
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
              <h3 className="text-base font-black flex items-center gap-2 uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">ROUTING GUIDE</h3>
              <p className="text-[10px] font-bold text-[#ce8a39] uppercase tracking-widest mt-1 drop-shadow-sm">คู่มือการคำนวณเส้นทางอัจฉริยะ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#788990] hover:text-white"><X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-[#4d4146] text-[12px] leading-relaxed bg-[#f8f9fa] text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#1a253d] mb-4 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Settings size={16} className="text-[#ce8a39]"/> 1. Action Nodes (ปุ่มดำเนินการ)</h4>
            <div className="space-y-3">
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#ce8a39] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#133951] shadow-sm"><Navigation size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#1a253d] uppercase">Analyze Path (วิเคราะห์เส้นทาง)</p>
                        <p className="text-[10.5px] text-[#788990] mt-1 leading-relaxed">ใช้สำหรับเปิดดูรายละเอียดแผนการจัดส่ง จุดแวะพัก (Stops) ระยะทางรวม และประสิทธิภาพการประหยัดน้ำมัน (AI Savings) ที่ระบบคำนวณไว้</p>
                    </div>
                </div>
                <div className="flex items-start gap-3.5 p-3.5 bg-white border border-[#eaeaec] rounded-2xl group hover:border-[#ce8a39] transition-all">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#f8f9fa] border border-[#eaeaec] flex items-center justify-center text-[#ad2b10] shadow-sm"><Trash2 size={18} /></div>
                    <div>
                        <p className="text-[11px] font-black text-[#1a253d] uppercase">Delete Plan (ลบแผนเส้นทาง)</p>
                        <p className="text-[10.5px] text-[#788990] mt-1 leading-relaxed">ยกเลิกหรือลบแผนการเดินทางนี้ออกจากระบบ มักใช้ในกรณีที่มีการเปลี่ยนรถกะทันหัน หรือยกเลิกการจัดส่งในรอบนั้น</p>
                    </div>
                </div>
            </div>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[13px] font-black text-[#1a253d] mb-3 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Compass size={16} className="text-[#ce8a39]"/> 2. อัลกอริทึมการจัดการเส้นทาง</h4>
            <p className="text-[11px] mb-3 font-medium text-[#788990]">ระบบใช้เทคโนโลยี AI ในการจัดลำดับการส่งของ (Sequencing) โดยอ้างอิงจากปัจจัยแวดล้อมจริง:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm"><Zap size={16} className="shrink-0 text-[#ce8a39] mt-0.5"/> <div className="font-medium text-[11px]"><strong className="text-[#1a253d] font-bold tracking-wide">Distance Reduction:</strong> คำนวณเส้นทางที่สั้นที่สุดและเลี่ยงจุดก่อสร้างหรือรถติดสะสม</div></li>
                <li className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm"><Milestone size={16} className="shrink-0 text-[#133951] mt-0.5"/> <div className="font-medium text-[11px]"><strong className="text-[#1a253d] font-bold tracking-wide">Multi-stop Logic:</strong> จัดคิวให้รถหนึ่งคันแวะส่งของได้หลายจุดในทิศทางเดียวกันโดยไม่วิ่งย้อนศร</div></li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[13px] font-black text-[#1a253d] mb-3 uppercase flex items-center gap-2 border-b border-[#eaeaec] pb-2"><Activity size={16} className="text-[#ce8a39]"/> 3. Status Indicators</h4>
            <div className="space-y-3 mt-4 bg-white p-3.5 rounded-xl border border-[#eaeaec] shadow-sm text-[11px]">
                <div className="flex items-center justify-between"><span><strong className="text-[#1a253d]">Optimized:</strong></span> <span>เส้นทางถูกคำนวณและพร้อมเริ่มเดินทาง</span></div>
                <div className="flex items-center justify-between text-[#133951]"><span><strong className="font-bold">En-Route:</strong></span> <span>รถออกจากคลังแล้วและกำลังส่งของตามแผน</span></div>
                <div className="flex items-center justify-between text-[#ad2b10]"><span><strong className="font-bold">Risk:</strong></span> <span>ตรวจพบความล่าช้าจากอุบัติเหตุหรือจราจรวิกฤต</span></div>
            </div>
          </section>
        </div>
        
        <div className="px-5 py-4 bg-white border-t border-[#eaeaec] flex justify-end shrink-0 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#1a253d] text-white font-black rounded-lg uppercase text-[11px] hover:bg-[#ce8a39] transition-all shadow-md tracking-widest border active:scale-95 flex items-center gap-2"><CheckCircle2 size={16}/> รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

function CreateRouteModal({ isOpen, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    vehicle: '6-Wheel Truck (TR-08)', driver: '', stops: '', distance: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!formData.driver || !formData.stops) return;
    onSave({
      ...formData,
      id: `RT-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      stops: parseInt(formData.stops),
      distance: parseFloat(formData.distance) || 0,
      status: 'Optimized',
      savings: `${(Math.random() * 20 + 5).toFixed(1)}%`,
      date: new Date().toISOString().split('T')[0]
    });
    setFormData({ vehicle: '6-Wheel Truck (TR-08)', driver: '', stops: '', distance: '' });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden relative border border-white/60">
        <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-white/5">
          <div className="flex items-center gap-4 text-white">
            <div className="w-10 h-10 rounded-xl bg-[#e5b73b]/20 text-[#e5b73b] flex items-center justify-center border border-[#e5b73b]/30 shadow-inner">
              <Plus size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-widest leading-none mb-1">CREATE ROUTE PLAN</h3>
              <p className="text-[9px] font-bold text-[#e5b73b] uppercase tracking-[0.1em]">AI Path Optimization for delivery fleet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white"><X size={18} /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8f9fa] space-y-5 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#788990] uppercase tracking-widest ml-1">Assigned Vehicle</label>
              <select value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39] transition-all">
                <option>6-Wheel Truck (TR-08)</option>
                <option>4-Wheel Pickup (BK-22)</option>
                <option>10-Wheel Trailer (LB-05)</option>
                <option>Van Express (VN-01)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#788990] uppercase tracking-widest ml-1">Main Driver</label>
              <input required value={formData.driver} onChange={e => setFormData({...formData, driver: e.target.value})} type="text" placeholder="Driver Name" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39] transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#788990] uppercase tracking-widest ml-1">Number of Stops</label>
              <input required value={formData.stops} onChange={e => setFormData({...formData, stops: e.target.value})} type="number" placeholder="e.g. 12" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#788990] uppercase tracking-widest ml-1">Est. Distance (KM)</label>
              <input required value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} type="number" step="0.1" placeholder="e.g. 45.5" className="w-full px-4 py-2.5 rounded-xl border border-[#eaeaec] bg-white text-[12px] font-bold outline-none focus:border-[#ce8a39] transition-all" />
            </div>
          </div>

          <div className="p-4 bg-[#ce8a39]/5 border border-dashed border-[#ce8a39]/30 rounded-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#ce8a39]/10 flex items-center justify-center text-[#ce8a39] shrink-0"><Zap size={20}/></div>
            <div>
              <p className="text-[11px] font-black text-[#1a253d] uppercase mb-1">AI Routing Engine</p>
              <p className="text-[10px] font-medium text-[#788990] leading-relaxed">System will automatically sequence stops to minimize travel time and fuel consumption by approximately 15%.</p>
            </div>
          </div>
        </form>

        <div className="px-6 py-4 bg-white border-t border-[#eaeaec] flex justify-between items-center shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec] transition-all active:scale-95">Cancel</button>
          <button type="submit" onClick={handleSubmit} className="px-8 py-2.5 bg-[#ad2b10] text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#922724] transition-all border flex items-center gap-2 active:scale-95 active:text-white">
              <Save size={14} /> Calculate & Save
          </button>
        </div>
      </div>
    </div>, document.body
  );
}

function RouteDetailModal({ isOpen, onClose, data }: any) {
  if (!isOpen || !data) return null;
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#1a253d]/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[750px] flex flex-col overflow-hidden relative border border-white/60">
        <div className="bg-[#1a253d] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
              <Navigation size={20} className="text-[#ce8a39]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">ROUTE ANALYSIS</h3>
              <span className="text-[9px] font-black text-[#ce8a39] bg-[#ce8a39]/20 px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#ce8a39]/30 drop-shadow-sm">{data.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-white/70 hover:text-white"><X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f8f9fa] text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                <label className="text-[9px] font-black text-[#788990] uppercase tracking-widest">Transport Vehicle</label>
                <div className="text-[16px] font-black text-[#1a253d] uppercase mt-1">{data.vehicle}</div>
                <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-[#788990]">
                  <User size={14} className="text-[#ce8a39]"/> Driver: {data.driver}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm h-48 flex items-center justify-center relative overflow-hidden group">
                  <Map size={40} className="text-[#eaeaec] absolute opacity-40 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-[#788990] uppercase tracking-widest relative z-10">Mock Map Rendering Engine</span>
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#ad2b10] rounded-full border-2 border-white shadow-sm"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-[#ce8a39] rounded-full border-2 border-white shadow-sm"></div>
                  <div className="absolute top-1/2 right-1/2 w-4 h-4 bg-[#133951] rounded-full border-2 border-white shadow-sm"></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#1a253d] p-5 rounded-2xl shadow-lg border border-[#0F172A] text-center">
                <label className="text-[9px] font-black text-[#788990] uppercase tracking-widest">Optimization Efficiency</label>
                <div className="text-3xl font-black text-white mt-1">+{data.savings} <span className="text-sm font-bold text-[#eaeaec]">Saved</span></div>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] font-black text-white uppercase tracking-widest">
                  <Fuel size={12}/> AI Path Validated
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm space-y-3">
                <div className="flex justify-between items-center text-[12px]"><span className="text-[#788990] font-medium">Total Stops:</span> <span className="font-black text-[#1a253d]">{data.stops} Locations</span></div>
                <div className="flex justify-between items-center text-[12px] border-t border-[#f8f9fa] pt-2"><span className="text-[#788990] font-medium">Distance Estimate:</span> <span className="font-black text-[#1a253d]">{data.distance} KM</span></div>
                <div className="flex justify-between items-center text-[12px] border-t border-[#f8f9fa] pt-2"><span className="text-[#788990] font-medium">Load Utilization:</span> <span className="font-black text-[#ce8a39]">92.4%</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#eaeaec] flex justify-between items-center shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 bg-[#f8f9fa] border border-[#eaeaec] text-[#788990] rounded-lg font-bold text-[11px] uppercase tracking-widest hover:bg-[#eaeaec] transition-all active:scale-95">Cancel</button>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 bg-white border border-[#eaeaec] text-[#1a253d] rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-[#f8f9fa] transition-all flex items-center gap-2 border-[1.5px] active:scale-95 active:bg-[#181010] active:text-white"><Printer size={14} /> Waybill</button>
            <button onClick={onClose} className="px-8 py-2.5 bg-[#ad2b10] text-white rounded-lg font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#922724] transition-all flex items-center gap-2 active:scale-95 active:bg-[#922724] active:text-white">
                <Navigation size={14} /> Send to Driver Mobile
            </button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
}

// --- Main Application Component ---
export default function RouteOptimization() {
  const [routes, setRoutes] = useState(INITIAL_ROUTES);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });

  // Add Route Logic
  const handleSaveRoute = (newRoute: any) => {
    setRoutes([newRoute, ...routes]);
  };

  // Delete Logic
  const handleDelete = (id: string) => {
    setRoutes(routes.filter(r => r.id !== id));
  };

  // Filter Logic
  const filteredData = useMemo(() => {
    return routes.filter(item => {
      const matchSearch = item.vehicle.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [routes, search, statusFilter]);

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;

  // KPI Calculations
  const totalDistance = routes.reduce((acc, r) => acc + r.distance, 0);
  const activeRoutes = routes.filter(r => r.status === 'En-Route').length;
  const avgEfficiency = "14.8%"; 

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      
      {/* User Guide Floating Button */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#1a253d] rounded-l-xl shadow-md hover:bg-[#922724] hover:text-white hover:border-[#922724] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#788990] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <CreateRouteModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveRoute} />
      <RouteDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} data={detailModal.data} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#1a253d] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#1a253d]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Route size={28} strokeWidth={2.5} className="text-[#1a253d]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none font-exception-header" style={{ fontSize: '24px' }}>
                      ROUTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a253d] to-[#ad2b10]">OPTIMIZATION</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                      AUTOMATED FLEET ROUTING & LOGISTICS EFFICIENCY NODE
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#ad2b10] hover:bg-[#922724] text-white px-5 py-2.5 rounded-lg font-black text-[11px] uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                  <Plus size={14} /> Create Route Plan
              </button>
          </div>
      </div>

      <div className="px-4 sm:px-8 w-full mt-[2px]">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <KpiCard label="Active Routes" value={activeRoutes} icon={Truck} colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="En-Route Now" trendValue="+3" />
                <KpiCard label="Total Distance (Day)" value={`${totalDistance.toFixed(1)} km`} icon={Milestone} colorAccent={THEME.gold} colorValue={THEME.primary} desc="Managed Fleet Movement" />
                <KpiCard label="Traffic Risk Alerts" value={routes.filter(r => r.status === 'Risk').length} icon={AlertCircle} colorAccent={THEME.danger} colorValue={THEME.danger} desc="Requires Re-Routing" />
                <KpiCard label="Overall Savings" value={avgEfficiency} icon={Fuel} colorAccent={THEME.success} colorValue={THEME.success} desc="Fuel Cost Optimization" trendValue="+1.2%" />
            </div>

            {/* Main Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px]">
                
                {/* TOOLBAR */}
                <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#ce8a39] transition-colors">
                            <Filter size={14} className="text-[#788990]" />
                            <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#1a253d] cursor-pointer">
                                <option value="All">All Route Status</option>
                                <option value="Optimized">Optimized</option>
                                <option value="En-Route">En-Route</option>
                                <option value="Pending">Pending</option>
                                <option value="Risk">Risk Alert</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button className="flex items-center gap-2 bg-[#1a253d] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#ce8a39] transition-colors shadow-sm active:scale-95">
                            <Download size={14} /> Export Logs
                        </button>
                    </div>
                    
                    <div className="relative w-full md:w-80 text-left">
                        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#788990]" />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                            placeholder="Search Route ID or Vehicle..." 
                            className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#ce8a39] bg-white shadow-sm text-[#1a253d] transition-all" 
                        />
                    </div>
                </div>

                {/* DATA TABLE */}
                <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                    <table className="w-full text-left font-sans border-collapse text-left">
                        <thead className="bg-[#133951] text-white sticky top-0 z-10 text-left">
                            <tr className="border-b-2 border-[#ad2b10]">
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสเส้นทาง (Route ID)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ยานพาหนะ / ทะเบียนรถ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">พนักงานขับรถหลัก</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">จำนวนจุดจอด</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">ระยะทาง (กม.)</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะ</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">อัตราประหยัดโดย AI</th>
                                <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-[#eaeaec] font-medium">
                            {currentData.length > 0 ? currentData.map(item => (
                                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group animate-fadeIn">
                                    <td className="py-2.5 px-4 font-mono font-black text-[#133951] text-[12px]">{item.id}</td>
                                    <td className="py-2.5 px-4">
                                        <div className="font-black text-[#1a253d] text-[12px] uppercase">{item.vehicle}</div>
                                    </td>
                                    <td className="py-2.5 px-4 font-bold text-[#788990] text-[12px]">{item.driver}</td>
                                    <td className="py-2.5 px-4 text-center font-black text-[#1a253d] text-[12px]">{item.stops}</td>
                                    <td className="py-2.5 px-4 text-right font-black text-[#1a253d] text-[12px]">{item.distance.toFixed(1)}</td>
                                    <td className="py-2.5 px-4 text-center"><StatusBadge status={item.status} /></td>
                                    <td className="py-2.5 px-4">
                                        <div className="flex items-center gap-1.5 text-[11px] font-black text-[#415929]">
                                            <TrendingDown size={14} className="text-[#415929]"/> {item.savings}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-4 text-center">
                                        <div className="flex justify-center items-center gap-[1px] opacity-20 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#6a95b1] bg-white hover:bg-[#6a95b1] hover:text-white active:scale-90 transition-all cursor-pointer group"
                                                title="Analyze Path"
                                            >
                                                <Navigation size={14} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(item.id)}
                                                className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#788990] bg-white hover:bg-[#922724] hover:text-white hover:border-[#922724] active:bg-[#922724] active:text-white active:scale-90 transition-all cursor-pointer group" 
                                                title="Delete Plan"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center text-[#788990] font-black text-[12px] uppercase tracking-widest bg-[#f8f9fa]">No route plans found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="px-6 py-3 bg-white border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-2xl">
                    <div className="flex items-center gap-5 text-[10px] font-black text-[#788990] uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span>Display Rows:</span>
                            <select 
                                value={itemsPerPage} 
                                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                className="bg-[#f8f9fa] border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#1a253d] cursor-pointer shadow-sm focus:border-[#ce8a39]"
                            >
                                {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <p className="bg-[#f8f9fa] px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Fleet Workload: {filteredData.length} Routes</p>
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
