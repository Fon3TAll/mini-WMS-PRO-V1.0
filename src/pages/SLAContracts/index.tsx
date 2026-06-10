import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Synced with System/Home Palette) ---
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

const formatCurrency = (val: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 1 }).format(val);

// --- Sub-components ---
const KpiCard = ({ icon, value, label, colorAccent, colorValue, desc }: any) => (
    <div className="bg-white/90 px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[84px] min-h-[84px] flex flex-col justify-between animate-fadeIn">
        <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <LucideIcon name={icon} size={70} color={colorAccent} />
        </div>
        <div className="relative z-10 flex justify-between items-start w-full text-left">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">{label}</p>
            <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`} style={{backgroundColor: `${colorAccent}15`, borderColor: `${colorAccent}25`, color: colorAccent}}>
                <LucideIcon name={icon} size={14} />
            </div>
        </div>
        <div className="relative z-10 flex items-end justify-between">
            <p className="text-[18px] font-black leading-none text-[#212c46]" style={{color: colorValue}}>
                {value}
            </p>
            <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span> {desc}
            </span>
        </div>
    </div>
);

const ComplianceStatusBadge = ({ status }: { status: string }) => {
  let style = { bg: '#eaeaec', color: '#7a8b95', border: '#eaeaec' };
  switch (status) {
    case 'Active': 
      style = { bg: '#657f4d15', color: THEME.success, border: '#657f4d30' }; 
      break;
    case 'Expiring': 
      style = { bg: '#b58c4f15', color: THEME.gold, border: '#b58c4f30' }; 
      break;
    case 'Terminated': 
      style = { bg: '#932c2e15', color: THEME.danger, border: '#932c2e30' }; 
      break;
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border" style={{ backgroundColor: style.bg, color: style.color, borderColor: style.border }}>
      <div className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: style.color }}></div> {status}
    </span>
  );
};

// --- Modals ---

// 1. Create/Edit Contract Rule Config Modal
function EditContractModal({ isOpen, onClose, record, onSave }: any) {
    const [tempRecord, setTempRecord] = useState<any>({});

    useEffect(() => {
        if (isOpen && record) {
            setTempRecord(JSON.parse(JSON.stringify(record)));
        }
    }, [isOpen, record]);

    if (!isOpen || !record || !tempRecord) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(tempRecord);
        onClose();
    };

    return (
        <DraggableModal
            isOpen={isOpen}
            onClose={onClose}
            width="max-w-[500px]"
            title={
                <div className="flex items-center gap-3">
                    <Icons.Handshake className="text-[#b7a159]" size={20} />
                    <span className="font-black text-white text-[13px] uppercase tracking-widest leading-none">CONFIGURE SLA & CONTRACT RULE</span>
                </div>
            }
        >
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden text-left bg-white font-sans">
                <div className="p-5 space-y-4 flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#212c46]/10 text-[#212c46] flex items-center justify-center border border-[#212c46]/20">
                            <Icons.FileText size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#7a8b95] uppercase leading-none mb-1">CONTRACT REF ID</p>
                            <h4 className="text-[13px] font-black text-[#212c46] leading-none uppercase">{tempRecord.id}</h4>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Client Business Entity</label>
                        <input 
                            required 
                            type="text"
                            value={tempRecord.client || ''} 
                            onChange={e => setTempRecord({...tempRecord, client: e.target.value})} 
                            className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Service Type</label>
                            <select 
                                value={tempRecord.type || 'Full Service 3PL'} 
                                onChange={e => setTempRecord({...tempRecord, type: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Full Service 3PL">Full Service 3PL</option>
                                <option value="Consignment Only">Consignment Only</option>
                                <option value="Cold Chain Logistics">Cold Chain Logistics</option>
                                <option value="Distribution Hub">Distribution Hub</option>
                                <option value="Storage & Handling">Storage & Handling</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Lifecycle Status</label>
                            <select 
                                value={tempRecord.status || 'Active'} 
                                onChange={e => setTempRecord({...tempRecord, status: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]"
                            >
                                <option value="Active">Active</option>
                                <option value="Expiring">Expiring</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Effective Start Date</label>
                            <input 
                                required 
                                type="date"
                                value={tempRecord.startDate || ''} 
                                onChange={e => setTempRecord({...tempRecord, startDate: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">End Expiry Date</label>
                            <input 
                                required 
                                type="date"
                                value={tempRecord.endDate || ''} 
                                onChange={e => setTempRecord({...tempRecord, endDate: e.target.value})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-bold outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-[#eaeaec] pt-3">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">SLA Target Compliance Score (%)</label>
                            <input 
                                required
                                type="number" 
                                step="0.1" 
                                value={tempRecord.slaScore || ''}
                                onChange={e => setTempRecord({...tempRecord, slaScore: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-[#7a8b95] uppercase ml-1">Estimated Annual Rev (THB)</label>
                            <input 
                                required 
                                type="number"
                                value={tempRecord.revenue || ''} 
                                onChange={e => setTempRecord({...tempRecord, revenue: parseFloat(e.target.value) || 0})} 
                                className="w-full px-3 py-1.5 bg-white border border-[#eaeaec] rounded-xl text-[12px] font-black outline-none focus:border-[#4d87a8] text-[#212c46]" 
                            />
                        </div>
                    </div>
                </div>

                <div className="px-5 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end gap-3 shrink-0">
                    <button type="button" onClick={onClose} className="px-4 py-1.5 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
                    <button type="submit" className="bg-[#212c46] text-white px-4 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-1.5"><Icons.Save size={13}/> Save Contract</button>
                </div>
            </form>
        </DraggableModal>
    );
}

// 2. Comprehensive Detailed User Guide Panel (Tight lean padding, detailed similar to UserPermissions)
function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[#e9d8c0] text-[13px]"><Icons.BookOpen size={16} className="text-[#b7a159]"/> SLA & CONTRACTS GUIDE</h3>
            <p className="text-[9px] font-bold text-[#d7d7d7] uppercase tracking-wide mt-0.5">Service Level Agreements & Lifecycle</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors"><Icons.X size={18}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-[#414757] text-[11px] leading-relaxed custom-scrollbar bg-white text-left">
          <section className="animate-fadeIn">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.ShieldAlert size={13} className="text-[#b7a159]"/> 1. Contract Lifecycles
            </h4>
            <p className="text-[11px] mb-1.5">ระบบจะวิเคราะห์และจัดระบบอายุสัญญาตามสัดส่วนการให้บริการของลูกค้าแต่ละรายอย่างเป็นระบบ:</p>
            <ul className="list-none pl-0 space-y-1.5">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-lg border border-[#eaeaec] shadow-sm">
                  <Icons.Clock size={12} className="shrink-0 text-[#3f809e] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#3f809e] font-black">Active Phase:</strong> สัญญามีผลสมบูรณ์และเปิดรับสั่งเก็บอัตราค่าบริการ (Standard Rate Overrides) ตลอดรอบบัญชี</div>
                </li>
                <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2.5 rounded-lg border border-[#932c2e]/30 shadow-sm">
                  <Icons.BellRing size={12} className="shrink-0 text-[#ce1c16] mt-0.5"/> 
                  <div className="text-[11px]"><strong className="text-[#ce1c16] font-black">Expiring alert:</strong> แจ้งเตือนสัญญาหมดอายุล่วงหน้า 90 วัน เพื่อความมั่นคงและการเจรจาสัญญารอบใหม่</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn animate-delay-100">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Award size={13} className="text-[#d96245]"/> 2. SLA Compliance targets
            </h4>
            <p className="text-[11px] mb-1.5">ตัวจับเป้าชี้วัดระดับบริการพาร์ทเนอร์ (Audited Targets):</p>
            <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong className="text-[#657f4d]">Picking Accuracy Target:</strong> เป้าหมายที่มากกว่า 99.5% เพื่อประสิทธิภาพสูงสุดในคลังคัดแยกสินค้า</li>
                <li><strong className="text-[#3f809e]">Dock-to-Stock SLA:</strong> ความไวในการดึงสินค้าลงสต็อก ต่ำกว่า 12 ชั่วโมง นับจากการแจ้งใบนำเข้า</li>
                <li><strong className="text-[#b58c4f]">Real-time Inventory Sync:</strong> อัปเดตข้อมูลบนบอร์ดกลางภายหลังการเบิกจ่ายล่าช้าไม่เกิน 5 นาที</li>
            </ul>
          </section>

          <section className="animate-fadeIn animate-delay-200">
            <h4 className="text-[11px] font-black text-[#212c46] mb-1.5 uppercase flex items-center gap-1.5 border-b border-[#eaeaec] pb-1 font-mono">
              <Icons.Lock size={13} className="text-[#3f809e]"/> 3. SLA Security controls
            </h4>
            <p className="text-[11px]">การตั้งค่าที่ถูกปรับเปลี่ยนจะส่งผลตรงไปยัง Sidebar และส่วนคัดกรองงานแบบ Real-time โดยเจ้าหน้าที่ระดับผู้จัดการคลังเท่านั้นที่มีอำนาจจัดสรรสิทธิ์</p>
          </section>
        </div>
        
        <div className="p-2.5 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-5 py-1.5 bg-[#212c46] text-white font-black rounded-lg uppercase text-[10px] hover:bg-[#414757] transition-all shadow-md tracking-wider">รับทราบ (Got it)</button>
        </div>
      </div>
    </>, document.body
  );
}

// 3. Compact Contract Detail Preview Dialog Modal
function ContractDetailModal({ isOpen, onClose, data }: any) {
  if (!isOpen || !data) return null;
  return createPortal(
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-[#181010]/60 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[650px] flex flex-col overflow-hidden relative border border-white/60">
        <div className="bg-[#212c46] px-6 py-4 flex justify-between items-center text-white shrink-0 border-b border-[#1b2826]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-inner overflow-hidden">
              <Icons.Handshake size={20} className="text-[#b7a159]" />
            </div>
            <div className="text-left">
              <h3 className="text-base font-black text-white uppercase tracking-widest leading-none mb-1.5 drop-shadow-sm">MASTER AGREEMENT</h3>
              <span className="text-[9px] font-black text-[#b7a159] bg-[#b7a159]/20 px-2 py-0.5 rounded-full uppercase tracking-widest border border-[#b7a159]/30 drop-shadow-sm">{data.id}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all text-[#e9d8c0]/70 hover:text-white"><Icons.X size={18} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#f3e2d1]/5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              <div>
                <label className="text-[9px] font-black text-[#a3a092] uppercase tracking-widest">Client Name</label>
                <div className="text-[18px] font-black text-[#181010] uppercase mt-1 leading-snug">{data.client}</div>
                <div className="text-[11px] font-bold text-[#615e65] mt-1.5">Service Tier: <span className="text-[#b58c4f] font-black">{data.type}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="flex items-center gap-2 text-[9px] font-black text-[#a3a092] uppercase mb-1.5"><Icons.Calendar size={12}/> Effective Date</div>
                  <div className="text-[12px] font-black text-[#212c46]">{data.startDate}</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-[#eaeaec] shadow-sm">
                  <div className="flex items-center gap-2 text-[9px] font-black text-[#a3a092] uppercase mb-1.5"><Icons.Clock size={12}/> Expiry Date</div>
                  <div className="text-[12px] font-black text-[#ce1c16]">{data.endDate}</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[11px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-2"><Icons.Scale size={14} className="text-[#b58c4f]"/> SLA Compliance targets</h4>
                  <span className="text-[10px] font-bold text-[#657f4d] uppercase font-mono">Audited Target</span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Order Picking Accuracy', target: '> 99.5%', actual: '99.8%', status: 'Pass' },
                    { label: 'Dock-to-Stock SLA', target: '< 12 hrs', actual: '8.4 hrs', status: 'Pass' },
                    { label: 'Real-time Stock Inventory Sync', target: '< 5 min', actual: '1.2 mins', status: 'Pass' },
                  ].map((sla, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] border-b border-[#eaeaec] pb-1.5 last:border-0 last:pb-0">
                      <span className="text-[#615e65] font-semibold">{sla.label}</span>
                      <div className="flex gap-4">
                        <span className="text-[#a3a092] font-semibold">Target: {sla.target}</span>
                        <span className={`font-black ${sla.status === 'Pass' ? 'text-[#657f4d]' : 'text-[#b58c4f]'}`}>{sla.actual}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#212c46] p-5 rounded-2xl shadow-lg border border-[#1d2636] text-center text-white">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">SLA Compliance Target</label>
                <div className="text-3xl font-black text-[#b7a159] mt-1">{data.slaScore}%</div>
                <div className="mt-2 inline-block px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest">
                  EXCELLENT PASS
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#eaeaec] shadow-sm">
                <label className="text-[9px] font-black text-[#a3a092] uppercase tracking-widest">Contract Valuation</label>
                <div className="mt-2 space-y-1.5 text-xs text-[#212c46] font-bold">
                  <div className="flex justify-between"><span className="text-[#615e65]">Rate Overrides:</span> <span className="font-bold text-[#657f4d]">SLA Active</span></div>
                  <div className="flex justify-between"><span className="text-[#615e65]">Annual Est:</span> <span className="font-extrabold text-[#212c46]">{formatCurrency(data.revenue)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-white border-t border-[#eaeaec] flex justify-between items-center shrink-0">
          <button onClick={onClose} className="px-5 py-2 bg-[#f3f3f1] border border-[#eaeaec] text-[#615e65] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#d7d7d7]/30 transition-all">Cancel</button>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-[#eaeaec] text-[#212c46] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-[#f9fafb] transition-all flex items-center gap-1.5 shadow-sm"><Icons.Printer size={14} /> Agreement</button>
            <button onClick={onClose} className="px-6 py-2 bg-[#ce1c16] text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#991b05] transition-all border border-[#88241e] flex items-center gap-1.5">
                <Icons.FileText size={14} /> Renew SLA Contract
            </button>
          </div>
        </div>
      </div>
    </div>, document.body
  );
}

// --- Main Page Component ---
export default function SLAContracts() {
  const [activeTab, setActiveTab] = useState('registry'); // 'registry' (SLA Configs) or 'contracts' (Active Contracts Table)
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Custom SLA Rule expansion state modeled after UserPermissions
  const [expandedConfigurations, setExpandedConfigurations] = useState<any>({ 'RULE-PKA': true, 'RULE-DBS': true });
  const [confidentialityMap, setConfidentialityMap] = useState<any>({ 'RULE-PKA': false, 'RULE-DBS': false, 'RULE-ISD': true });
  const [editModal, setEditModal] = useState<any>({ isOpen: false, data: null });
  const [detailModal, setDetailModal] = useState<any>({ isOpen: false, data: null });

  // Interactive Live Simulator values
  const [simAccuracy, setSimAccuracy] = useState<number>(99.6);
  const [simDockTime, setSimDockTime] = useState<number>(10.5);
  const [simSyncDelay, setSimSyncDelay] = useState<number>(3.5);

  // Preserve 100% of the original mock examples perfectly
  const [contractsList, setContractsList] = useState<any[]>([
    { id: 'CTR-2024-001', client: 'Unilever Thailand', type: 'Full Service 3PL', startDate: '2024-01-01', endDate: '2026-12-31', status: 'Active', slaScore: 98.5, revenue: 4500000 },
    { id: 'CTR-2024-002', client: 'CP All Public Co.', type: 'Consignment Only', startDate: '2024-03-15', endDate: '2026-05-30', status: 'Expiring', slaScore: 94.2, revenue: 12800000 },
    { id: 'CTR-2025-005', client: 'Nestle (Thai)', type: 'Cold Chain Logistics', startDate: '2025-01-10', endDate: '2027-01-09', status: 'Active', slaScore: 99.1, revenue: 8200000 },
    { id: 'CTR-2023-012', client: 'Thai Beverage', type: 'Distribution Hub', startDate: '2023-11-01', endDate: '2025-10-31', status: 'Active', slaScore: 92.8, revenue: 3500000 },
    { id: 'CTR-2024-009', client: 'Sahapat Group', type: 'Storage & Handling', startDate: '2024-06-01', endDate: '2026-05-31', status: 'Expiring', slaScore: 88.5, revenue: 2100000 },
    { id: 'CTR-2022-088', client: 'P&G Trading', type: 'Full Service 3PL', startDate: '2022-01-01', endDate: '2023-12-31', status: 'Terminated', slaScore: 85.0, revenue: 0 },
  ]);

  const [slaMetrics, setSlaMetrics] = useState<any[]>([
    { id: 'RULE-PKA', metricName: 'Order Picking Accuracy', baselineTarget: 99.5, minAcceptable: 98.0, actionUnit: '% Correct Items', active: true },
    { id: 'RULE-DBS', metricName: 'Dock-to-Stock SLA Time', baselineTarget: 12.0, minAcceptable: 18.0, actionUnit: 'Hours Max', active: true },
    { id: 'RULE-ISD', metricName: 'Real-time Stock Inventory Sync', baselineTarget: 5.0, minAcceptable: 10.0, actionUnit: 'Minutes Allowed', active: false },
  ]);

  // SLA simulator calculations
  const simScore = useMemo(() => {
    let score = 100;
    if (simAccuracy < 99.5) score -= (99.5 - simAccuracy) * 10;
    if (simDockTime > 12.0) score -= (simDockTime - 12.0) * 5;
    if (simSyncDelay > 5.0) score -= (simSyncDelay - 5.0) * 2;
    return Math.max(0, Math.min(100, Math.round(score * 10) / 10));
  }, [simAccuracy, simDockTime, simSyncDelay]);

  const simVerdict = simScore >= 95 ? 'APPROVED PASS' : 'UNDER SLA MINIMUM';

  const filteredContracts = useMemo(() => {
    return contractsList.filter(item => {
      const matchSearch = item.client.toLowerCase().includes(search.toLowerCase()) || 
                          item.id.toLowerCase().includes(search.toLowerCase()) ||
                          item.type.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [contractsList, search, statusFilter]);

  const currentData = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage) || 1;

  const toggleConfidentiality = (id: string) => setConfidentialityMap((prev: any) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id: string) => setExpandedConfigurations((prev: any) => ({ ...prev, [id]: !prev[id] }));

  // KPI Calculations
  const activeAgreementsCount = contractsList.filter(c => c.status === 'Active').length;
  const expiringAgreementsCount = contractsList.filter(c => c.status === 'Expiring').length;
  const averageSlaCompliance = (contractsList.reduce((acc, c) => acc + c.slaScore, 0) / contractsList.length).toFixed(1);
  const totalContractValue = contractsList.reduce((acc, c) => acc + c.revenue, 0);

  const saveContractRecord = (savedData: any) => {
    setContractsList(prev => {
      const exists = prev.find(item => item.id === savedData.id);
      if (exists) {
        return prev.map(item => item.id === savedData.id ? { ...item, ...savedData } : item);
      } else {
        return [savedData, ...prev];
      }
    });
  };

  const handleCreateNewManual = () => {
    const randomYear = 2026;
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const newRecord = {
      id: `CTR-${randomYear}-${randomNum}`,
      client: 'Global Logistics Partner',
      type: 'Full Service 3PL',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2028-12-31',
      status: 'Active',
      slaScore: 98.0,
      revenue: 5500000
    };
    setEditModal({ isOpen: true, data: newRecord });
  };

  const handlePostSimValue = () => {
    const randomNum = Math.floor(Math.random() * 800) + 100;
    const newRecord = {
      id: `CTR-SIM-${randomNum}`,
      client: 'Simulation Account Entity',
      type: 'Distribution Hub',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2027-06-30',
      status: 'Active',
      slaScore: simScore,
      revenue: 1800000
    };
    setContractsList(prev => [newRecord, ...prev]);
    setActiveTab('contracts'); // Switch to calculations log tab
  };

  const handleDeleteRecord = (id: string) => {
    setContractsList(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
      <EditContractModal isOpen={editModal.isOpen} onClose={() => setEditModal({isOpen: false, data: null})} record={editModal.data} onSave={saveContractRecord} />
      <ContractDetailModal isOpen={detailModal.isOpen} onClose={() => setDetailModal({isOpen: false, data: null})} data={detailModal.data} />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Handshake size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      SLA & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">CONTRACTS</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          SERVICE LEVEL AGREEMENTS, LEASE CONTRACT CYCLES & BILLING ASSURANCE
                      </p>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveTab('registry')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'registry' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.Sliders size={16} /> SLA Configs
                  </button>
                  <button onClick={() => setActiveTab('contracts')} className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'contracts' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#a94228]'}`}>
                    <Icons.FileSpreadsheet className="text-[#b58c4f]" size={16} /> Contracts Logs
                  </button>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full">
        <div className="w-full">
            
            {/* KPI STATS (With tight padding as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
                <KpiCard label="Active Accounts" value={activeAgreementsCount} icon="briefcase" colorAccent={THEME.skyBlue} colorValue={THEME.primary} desc="Current Clients" />
                <KpiCard label="Expiring Agreements" value={expiringAgreementsCount} icon="bell-ring" colorAccent={THEME.accent} colorValue={THEME.accent} desc="Requires Renewal" />
                <KpiCard label="Avg. SLA Compliance" value={`${averageSlaCompliance}%`} icon="award" colorAccent={THEME.gold} colorValue={THEME.primary} desc="Operational Quality" />
                <KpiCard label="Total Managed revenue" value={formatCurrency(totalContractValue)} icon="wallet" colorAccent={THEME.success} colorValue={THEME.success} desc="Contracted Sum" />
            </div>

            {activeTab === 'registry' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
                    
                    {/* ACCESS/ALLOCATION POLICIES CARD */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white/90 p-5 rounded-3xl shadow-lg border border-[#eaeaec] text-left">
                            <h3 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest flex items-center gap-3 border-b-2 border-[#b7a159] pb-3 mb-4"><Icons.Layers size={18} className="text-[#b7a159]" /> CONTRACT CONTROLS</h3>
                            <div className="space-y-3">
                                <div className="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl shadow-sm hover:border-[#4d87a8] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#3f809e]/15 text-[#3f809e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#3f809e]/20">SLA Standard Target</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">ระบบจะเปรียบเทียบมาตรฐานระดับการบริการรายวันกับเป้าหลักใบสัญญา หากหล่นเกณฑ์ ระบบจะส่งเมล์เตือน (SLA Deviation Penalty Alert)</p>
                                </div>
                                <div className="p-3 bg-[#932c2e]/10 border border-[#932c2e]/20 rounded-2xl shadow-sm hover:border-[#a94228] transition-colors">
                                    <span className="inline-block px-2 py-0.5 rounded-full bg-[#932c2e]/25 text-[#932c2e] text-[10px] font-black uppercase tracking-widest mb-1 border border-[#932c2e]/30">Termination Locks</span>
                                    <p className="text-[11px] text-[#212c46] font-bold leading-normal">เมื่อพ้นกำหนดสัญญาหรือยุติบริการ ระบบจะทำการซ่อนอัตราค่าธรรมเนียมพาร์ทเนอร์ไม่ให้นำส่งคำนวณบิลรอบเดินการถัดไปทันที</p>
                                </div>
                            </div>
                        </div>

                        {/* INTERACTIVE COMPACT QUICK CALC PANEL */}
                        <div className="bg-[#212c46] p-5 rounded-3xl shadow-lg border border-[#1d2636] text-white text-left animate-fadeIn">
                            <h3 className="text-[13px] font-black uppercase tracking-widest text-[#e9d8c0] flex items-center gap-2 border border-white/20 pb-2 mb-4"><Icons.Calculator size={18} className="text-[#b7a159]"/> COMPLIANCE SIMULATOR</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">PICKING ACCURACY (%)</label>
                                    <input 
                                        type="number" 
                                        step="0.05"
                                        value={simAccuracy}
                                        onChange={e => setSimAccuracy(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">DOCK-TO-STOCK TIME (HRS)</label>
                                    <input 
                                        type="number" 
                                        step="0.5"
                                        value={simDockTime}
                                        onChange={e => setSimDockTime(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] font-black text-gray-300 uppercase block mb-1">STOCK SYNC DELAY (MINS)</label>
                                    <input 
                                        type="number" 
                                        step="0.5"
                                        value={simSyncDelay}
                                        onChange={e => setSimSyncDelay(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/10 border border-white/20 px-3 py-1.5 rounded-xl text-[12px] font-black text-[#e9d8c0] outline-none focus:border-[#b7a159]" 
                                    />
                                </div>

                                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl space-y-2 mt-4 text-[11px]">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Baseline Compliant:</span>
                                        <span className="font-black text-white">95.0%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Calculated Compliance:</span>
                                        <span className="font-black text-[#b7a159]">{simScore}%</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-1.5 mt-1.5">
                                        <span className="text-[9px] font-black uppercase text-gray-400">EVAL VERDICT:</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black text-white ${simVerdict === 'APPROVED PASS' ? 'bg-[#657f4d]' : 'bg-[#932c2e]'}`}>{simVerdict}</span>
                                    </div>
                                </div>

                                <button onClick={handlePostSimValue} className="w-full bg-[#b58c4f] hover:bg-[#b7a159] text-[#212c46] font-black text-[11px] uppercase tracking-widest py-2 rounded-xl transition-all shadow-md mt-4 flex items-center justify-center gap-1">
                                    <Icons.PlusCircle size={15}/> Post Simulated Contract
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* GLOBAL CONFIGURATION STANDARD REGISTRY */}
                    <div className="lg:col-span-8 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden">
                        <div className="p-5 bg-f8f9fa border-b border-[#eaeaec] flex justify-between items-center">
                            <h4 className="text-[14px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-3"><Icons.Sliders size={20} className="text-[#b7a159]"/> GLOBAL SLA RULE REGISTRY</h4>
                            <button onClick={handleCreateNewManual} className="bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center gap-1.5 shadow-md active:scale-95">
                                <Icons.Plus size={14} /> Add Service Metric Target
                            </button>
                        </div>
                        <div className="p-6 space-y-3 custom-scrollbar text-left">
                            {slaMetrics.map(rule => (
                                <div key={rule.id} className="space-y-2">
                                    <div className={`flex items-center justify-between px-4 py-2.5 rounded-2xl border transition-all ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/5 border-[#932c2e]/20 shadow-sm' : 'bg-white border-[#eaeaec] hover:border-[#4d87a8]'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/20 text-[#a94228] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#212c46] border-[#eaeaec]'}`}>
                                                <Icons.Award size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-black text-[#212c46] text-[13px] uppercase tracking-widest">{rule.metricName}</span>
                                                    <button onClick={() => toggleExpand(rule.id)} className="p-1 hover:bg-[#d7d7d7]/50 rounded transition-all text-[#b7a159]">
                                                        <Icons.ChevronDown size={18} className={`transition-transform duration-300 ${expandedConfigurations[rule.id] ? 'rotate-180' : ''}`} />
                                                    </button>
                                                </div>
                                                <span className={`text-[11px] font-black uppercase tracking-widest ${confidentialityMap[rule.id] ? 'text-[#932c2e]' : 'text-[#7a8b95]'}`}>SLA Restriction {confidentialityMap[rule.id] ? 'Restricted Lock' : 'Active Public'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => toggleConfidentiality(rule.id)} 
                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all border ${confidentialityMap[rule.id] ? 'bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/30' : 'bg-[#f8f9fa] text-[#7a8b95] border-[#eaeaec] hover:border-[#4d87a8]'}`}
                                                title={confidentialityMap[rule.id] ? "Unlock Public Allocation Limit" : "Lock / RESTRICT SLA Rule"}
                                            >
                                                {confidentialityMap[rule.id] ? <Icons.Lock size={16} /> : <Icons.Unlock size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Details Panel */}
                                    {expandedConfigurations[rule.id] && (
                                        <div className="mx-4 p-4 bg-[#f8f9fa] border-l-2 border-[#b7a159] rounded-r-xl border-[#eaeaec] border shadow-inner text-[12px] space-y-3 animate-fadeIn text-left">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[#7a8b95] uppercase font-black text-[9px] mb-1">BASELINE TARGET THRESHOLD</p>
                                                    <p className="font-bold text-[#212c46] uppercase">{rule.baselineTarget} {rule.actionUnit}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[#a94228] uppercase font-black text-[9px] mb-1">ABSOLUTE MIN LIMIT</p>
                                                    <p className="font-bold text-[#a94228] uppercase">{rule.minAcceptable} {rule.actionUnit}</p>
                                                </div>
                                            </div>
                                            <div className="border-t border-[#eaeaec] pt-2 flex justify-between items-center">
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Reconciliation Target:</span>
                                                    <span className="ml-1 font-black text-[#212c46]">WMS Autocompare</span>
                                                </div>
                                                <div>
                                                    <span className="text-[#7a8b95] font-black text-[9px] uppercase">Service State:</span>
                                                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-black uppercase text-white bg-[#657f4d]`}>
                                                        SLA Monitoring Active
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* AUDIT LOG TAB - High Performance Table styled strictly to instructions */
                <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[500px] animate-fadeIn text-left">
                    
                    {/* TOOLBAR */}
                    <div className="px-6 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            <div className="flex items-center gap-2 bg-white border border-[#eaeaec] rounded-xl px-4 py-2 shadow-sm focus-within:border-[#b7a159] transition-colors">
                                <Icons.Filter size={14} className="text-[#7a8b95]" />
                                <select value={statusFilter} onChange={(e) => {setStatusFilter(e.target.value); setCurrentPage(1);}} className="bg-transparent outline-none text-[11px] font-black uppercase tracking-widest text-[#212c46] cursor-pointer">
                                    <option value="All">All Lifecycles</option>
                                    <option value="Active">Active</option>
                                    <option value="Expiring">Expiring Soon</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </div>
                            <button className="flex items-center gap-2 bg-[#212c46] text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#414757] transition-all shadow-md active:scale-95">
                                <Icons.Download size={14} /> Export SLA Report
                            </button>
                        </div>
                        
                        <div className="relative w-full md:w-80 text-left">
                            <Icons.Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input 
                                type="text" 
                                value={search} 
                                onChange={e => {setSearch(e.target.value); setCurrentPage(1);}}
                                placeholder="Search client or contract..." 
                                className="w-full pl-10 pr-5 py-2 text-[11px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46] transition-all" 
                            />
                        </div>
                    </div>

                    {/* HIGH PRECISION TABLE */}
                    <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#133951] text-[#e9d8c0] sticky top-0 z-10 text-left">
                                <tr className="border-b-2 border-[#ad2b10]">
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">รหัสสัญญา (Contract ID)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">คู่ค้า / นิติบุคคลลูกค้า</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ประเภทข้อตกลงบริการ (SLA)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">ระยะเวลาที่มีผลบังคับใช้</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">ระดับเกณฑ์ประสิทธิภาพ</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">สถานะสัญญา</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">มูลค่าสัญญาโดยประมาณ (บาท)</th>
                                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center font-bold">การจัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#eaeaec] font-bold text-[12px] text-[#212c46]">
                                {currentData.length > 0 ? currentData.map(item => (
                                    <tr key={item.id} className="hover:bg-[#f3f3f1]/60 transition-colors group">
                                        <td className="py-2.5 px-4 font-mono font-extrabold text-[#2c4972]">{item.id}</td>
                                        <td className="py-2.5 px-4 uppercase font-extrabold text-[#11141e]">{item.client}</td>
                                        <td className="py-2.5 px-4"><span className="px-2 py-0.5 bg-[#e9d8c0]/50 rounded text-[11px] font-black uppercase text-[#875d3c]">{item.type}</span></td>
                                        <td className="py-2.5 px-4 text-[#7a8b95]">
                                            <div className="flex items-center gap-1.5 font-mono">
                                                <span>{item.startDate}</span>
                                                <Icons.ArrowRight size={11} className="text-[#bf8c24]" />
                                                <span>{item.endDate}</span>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-[12px] font-black ${item.slaScore >= 95 ? 'text-[#657f4d]' : 'text-[#a94228]'}`}>{item.slaScore}%</span>
                                                <div className="w-14 h-1 bg-[#eaeaec] rounded-full overflow-hidden mt-0.5">
                                                    <div className="h-full bg-[#b7a159]" style={{ width: `${item.slaScore}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-2.5 px-4 text-center"><ComplianceStatusBadge status={item.status} /></td>
                                        <td className="py-2.5 px-4 text-right text-[#414757] font-black">{formatCurrency(item.revenue)}</td>
                                        <td className="py-2.5 px-4 text-center">
                                            <div className="flex justify-center items-center gap-[1px]">
                                                <button 
                                                    onClick={() => setDetailModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#2c4972] bg-white hover:bg-[#2c4972]/10 hover:border-[#2c4972] active:bg-[#2c4972]/20 active:border-[#1d2636] transition-all active:scale-90"
                                                    title="View Agreement"
                                                >
                                                    <Icons.Eye size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => setEditModal({ isOpen: true, data: item })}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#7a8b95] bg-white hover:bg-[#b7a159]/10 hover:border-[#b7a159] hover:text-[#b7a159] active:bg-[#b7a159]/20 active:border-[#b58c4f] transition-all active:scale-90"
                                                    title="Edit SLA Rules "
                                                >
                                                    <Icons.Settings size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteRecord(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-md border border-[#eaeaec] text-[#932c2e] bg-white hover:bg-[#932c2e]/10 hover:border-[#932c2e] active:bg-[#932c2e]/20 active:border-[#88241e] transition-all active:scale-90"
                                                    title="Archive Contract Record"
                                                >
                                                    <Icons.Trash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={8} className="py-12 text-center text-[#a3a092] font-semibold text-[12px] uppercase tracking-widest bg-[#f9fafb]">No contracts log matching filters found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION PANEL */}
                    <div className="px-6 py-3 bg-[#eaeaec]/80 backdrop-blur-sm border-t-[1.5px] border-[#ced4da] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-[20px]">
                        <div className="flex items-center gap-5 text-[10px] font-black text-[#615e65] uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <span>Display Rows:</span>
                                <select 
                                    value={itemsPerPage} 
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                    className="bg-white border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#414757] cursor-pointer shadow-sm focus:border-[#b7a159]"
                                >
                                    {[5, 10, 20, 50].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm">Total Contracts logs: {filteredContracts.length}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                disabled={currentPage === 1}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
                            >
                                <Icons.ChevronLeft size={14}/>
                            </button>
                            <div className="bg-white text-[#414757] px-4 py-1.5 rounded-md font-black text-[10px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm font-mono">
                                Page {currentPage} / {totalPages}
                            </div>
                            <button 
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                disabled={currentPage === totalPages}
                                className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#212c46] hover:text-white hover:border-[#212c46] shadow-sm active:scale-90'}`}
                            >
                                <Icons.ChevronRight size={14}/>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
      </div>
    </div>
  );
}
