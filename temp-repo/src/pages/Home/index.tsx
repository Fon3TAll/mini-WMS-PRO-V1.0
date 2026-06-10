import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingDown, 
  Target, 
  Truck, 
  BarChart2, 
  Settings, 
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  AlertCircle,
  Building2,
  Clock,
  PackageCheck,
  PhoneCall,
  Mail,
  Calendar,
  Library,
  DollarSign,
  PieChart,
  Award,
  Globe,
  Bell,
  Sparkles,
  Factory,
  CheckCircle2,
  FileText,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Container,
  Database,
  FileSearch,
  Scale,
  Shield,
  CreditCard,
  Zap,
  Handshake,
  Filter,
  Megaphone,
  Briefcase,
  TrendingUp,
  MessageSquare,
  Percent,
  UserPlus,
  PartyPopper,
  Send,
  CheckSquare,
  GraduationCap,
  Info,
  User,
  AlertTriangle,
  Activity,
  Plus,
  BrainCircuit,
  Heart,
  CalendarDays,
  Banknote,
  Network
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DraggableModal } from '../../components/shared/DraggableModal';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'linear-gradient(135deg, #f3f3f1 0%, #f3f3f1 100%)',
    sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
    glassWhite: 'rgba(255, 255, 255, 0.88)',
    primary: '#212c46',
    primaryLight: '#4d87a8',
    accent: '#a94228',
    gold: '#b58c4f',
    brightGold: '#b7a159',
    success: '#657f4d',
    danger: '#932c2e',
    warning: '#a94228',
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
    coolGray: '#f3f3f1',
    c1: '#b22026',
    c2: '#932c2e',
    c3: '#851c24',
    c4: '#a94228',
    c5: '#d96245',
    c6: '#b58c4f',
    c7: '#b7a159',
    c8: '#8e9141',
    c9: '#5f7ab7',
    c10: '#bceadf',
    c11: '#f91a47',
    c12: '#fdda04',
    c13: '#e7dedd',
    c14: '#a74353',
    c15: '#c3924c',
    c16: '#ffa64a',
    c17: '#e8cec2',
    c18: '#f46e61',
    c19: '#972956',
    c20: '#9293c3',
    c21: '#ca649f',
    c22: '#dba1c2',
    c23: '#214573',
    c24: '#091d38',
};

// --- System Modules Data ---

const MOCK_STATS = [
    { label: 'Total Statutes', value: '1,450', sub: '+12 New Laws (YTD)', icon: Library, color: THEME.c11 },
    { label: 'Pending Cases', value: '24', sub: 'Urgent: 5 active cases', icon: Briefcase, color: THEME.c2 },
    { label: 'Legal Compliance', value: '96.2%', sub: 'Target: 100%', icon: ShieldCheck, color: THEME.c16 },
    { label: 'Court Deadlines', value: '18', sub: 'Requires action', icon: Scale, color: THEME.c21 },
];

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://www.shutterstock.com/image-photo/legal-law-concept-statue-lady-600nw-2115009251.jpg";
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl group bg-[#212c46] border border-[#414757] font-exception-hero">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#212c46]/95 via-[#212c46]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-6 w-full gap-6">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Scale size={12} className="text-[#b7a159]" />
              <span className="text-[9px] text-[#b7a159] font-black uppercase tracking-[0.2em] drop-shadow-sm">Legal Maxim</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
              Ignorantia juris <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#f3e5ab]">non excusat</span>
            </h2>
            <div className="mb-6">
              <p className="text-white/90 text-xs font-medium leading-relaxed max-w-2xl">
                "บุคคลจะแก้ตัวว่าไม่รู้กฎหมายเพื่อให้พ้นจากความรับผิดในทางอาญาไม่ได้" <br/><span className="text-[#b7a159] font-bold">ประมวลกฎหมายอาญา มาตรา 64</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-[#b58c4f] hover:bg-[#8e9141] border border-[#b7a159]/30 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(181,140,79,0.5)]">
                <Library size={12} /> Explore Legal Code
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 text-center rounded-xl flex items-center gap-2 shadow-inner backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#657f4d]" />
                <span className="text-white font-black tracking-tighter text-sm">S.64</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">Criminal Code</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a 
              href="/copilot"
              className="bg-gradient-to-br from-[#1d2636] to-[#2d2c4a] border border-[#b7a159]/40 p-1 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(181,140,79,0.3)] hover:-translate-y-1 transition-all group/ai"
            >
              <div className="bg-[#1d2636] border border-white/10 rounded-xl px-8 py-5 flex flex-col items-center gap-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#b7a159]/20 blur-xl rounded-full scale-150 animate-pulse" />
                   <BrainCircuit size={40} className="text-[#b7a159] relative z-10 group-hover/ai:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[#b7a159] text-[13px] font-black uppercase tracking-[0.2em] mt-1">IN-HOUSE COUNSEL</span>
                <span className="text-[8px] text-white/40 font-bold tracking-[0.4em]">SMART ASSISTANT</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
};

const UpcomingLawsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const laws = [
        { id: 1, type: "ประกาศกระทรวงสาธารณสุข", issue: "(ฉบับที่ 462) พ.ศ. 2568", subject: "เรื่อง น้ำบริโภคในภาชนะบรรจุที่ปิดสนิท", date: "วันที่ 12 ธันวาคม 2568", isNew: true, image: "https://images.unsplash.com/photo-1542382156909-923bea7b0a72?q=80&w=500" },
        { id: 2, type: "ประกาศกระทรวงสาธารณสุข", issue: "(ฉบับที่ 463) พ.ศ. 2568", subject: "เรื่อง น้ำแข็ง", date: "วันที่ 12 ธันวาคม 2568", isNew: false, image: "https://images.unsplash.com/photo-1563223771-46df1c0d45d8?q=80&w=500" },
        { id: 3, type: "ประกาศกระทรวงสาธารณสุข", issue: "(ฉบับที่ 464) พ.ศ. 2568", subject: "เรื่อง น้ำแร่ธรรมชาติ (ฉบับที่ 2)", date: "วันที่ 12 ธันวาคม 2568", isNew: false, image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=500" },
        { id: 4, type: "ประกาศกระทรวงสาธารณสุข", issue: "(ฉบับที่ 465) พ.ศ. 2568", subject: "เรื่อง เครื่องดื่มในภาชนะบรรจุที่ปิดสนิท (ฉบับที่ 3)", date: "วันที่ 12 ธันวาคม 2568", isNew: false, image: "https://images.unsplash.com/photo-1614088056230-e37d57a2f1ab?q=80&w=500" },
        { id: 5, type: "พระราชบัญญัติ", issue: "คุ้มครองข้อมูลส่วนบุคคล", subject: "เรื่อง การตรวจสอบข้อมูล", date: "วันที่ 1 มกราคม 2569", isNew: true, image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=500" },
        { id: 6, type: "ประกาศกรมสรรพากร", issue: "เกี่ยวกับภาษีมูลค่าเพิ่ม", subject: "เรื่อง การออกใบกำกับภาษีอิเล็กทรอนิกส์", date: "วันที่ 1 มีนาคม 2569", isNew: false, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=500" },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev === laws.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? laws.length - 1 : prev - 1));

    // Show up to 4 items on large screens
    const visibleLaws = [];
    for (let i = 0; i < 4; i++) {
        visibleLaws.push(laws[(currentIndex + i) % laws.length]);
    }

    return (
        <div className="w-full bg-[#f6f5f3] py-5 rounded-2xl relative overflow-hidden shadow-inner border border-[#e5e5e5]">
            <div className="flex items-center absolute top-1/2 -translate-y-1/2 left-2 z-20">
                <button onClick={prevSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 px-14">
                {visibleLaws.map((law, idx) => (
                    <div key={`${law.id}-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[145px] border border-gray-100 group transition-all hover:shadow-md justify-between">
                        {law.isNew && (
                            <div className="absolute -left-10 top-5 bg-[#a73527] text-white font-black px-11 py-1 -rotate-45 z-20 shadow-md text-[11px] tracking-wider">
                                NEW
                            </div>
                        )}
                        
                        <div className="p-2 pt-3 text-center z-10 relative">
                            <h3 className="font-extrabold text-[#3a4454] leading-tight text-[12px] drop-shadow-sm">{law.type}</h3>
                            <h4 className="font-bold text-[#56657a] text-[10px] mt-0.5">{law.issue}</h4>
                            <p className="font-medium text-[#2d3748] mt-1 text-[9px] leading-tight opacity-80">
                                ออกตามความในพระราชบัญญัติอาหาร<br />พ.ศ. 2522
                            </p>
                            <h2 className="font-black text-[#1e4e6d] text-[13px] mt-1 drop-shadow-sm leading-tight line-clamp-2">{law.subject}</h2>
                        </div>
                        
                        <div className="bg-[#364b5e] text-white py-1.5 px-2 mx-2 mb-2 rounded-lg text-center flex items-center justify-center gap-1 z-10 shadow-sm relative shrink-0">
                            <span className="text-[9px] font-medium tracking-wide">วันที่มีผลบังคับใช้</span>
                            <span className="flex items-center gap-0.5 mx-1 text-white/50"><span className="w-0.5 h-0.5 bg-white/50 rounded-full"></span><span className="w-1 h-1 bg-white/80 rounded-full"></span></span>
                            <span className="text-[10px] font-black tracking-wide">{law.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex items-center absolute top-1/2 -translate-y-1/2 right-2 z-20">
                <button onClick={nextSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                {laws.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#1e4e6d] ring-2 ring-[#1e4e6d]/30 ring-offset-2' : 'bg-gray-400 hover:bg-gray-500'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const MetricCard = ({ label, val, unit, icon: Icon, color, desc }: any) => (
  <div className="bg-white/90 rounded-2xl p-4 shadow-sm border border-[#f3f3f1] relative overflow-hidden group h-full transition-all hover:shadow-md">
    <div className="absolute -right-6 -bottom-6 opacity-[0.1] transform rotate-12 group-hover:scale-110 transition-all duration-700 pointer-events-none z-0">
        <Icon size={100} style={{color: color}} />
    </div>
    <div className="relative z-10 flex justify-between items-start">
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: THEME.primary}}>{val}</h4>
            {desc && (
                <p className="text-[10px] text-[#7a8b95] font-bold mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: color}}></span>
                    {desc}
                </p>
            )}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white backdrop-blur-md shadow-sm" 
            style={{backgroundColor: color + '15'}}>
            <Icon size={18} style={{color: color}} />
        </div>
    </div>
  </div>
);

const SalesChartArea = () => {
  const data = [
    { name: "Quality Manuals", target: 60, actual: 64, color: THEME.c2 },
    { name: "Procedures", target: 25, actual: 20, color: THEME.c11 },
    { name: "Work Instructions", target: 15, actual: 16, color: THEME.c16 },
  ];
  return (
    <GlassCard className="lg:col-span-2 bg-gradient-to-br from-white to-[#f3f3f1] border-[#f3f3f1]">
      <div className="flex justify-between items-center mb-4 relative z-10">
        <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
            <BarChart2 size={16} className="text-[#932c2e]" /> Document Distribution
        </h2>
        <span className="text-[8px] text-white font-black bg-[#3f809e] px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Real-time</span>
      </div>
      <div className="space-y-4 relative z-10">
        {data.map((item, i) => (
            <div key={i} className="flex items-center gap-4 group/bar">
              <div className="w-28 text-[9px] font-black text-[#435665] uppercase truncate tracking-tight">{item.name}</div>
              <div className="flex-1 h-4 rounded-lg relative flex items-center bg-[#f3f3f1]/40 shadow-inner overflow-hidden">
                <div className="h-full transition-all duration-1000 relative z-10 rounded-lg"
                  style={{ width: `${item.actual}%`, background: `linear-gradient(90deg, ${item.color}, ${item.color}dd)` }} />
              </div>
              <div className="w-10 text-right">
                <span className="text-[10px] font-black text-[#212c46]">{item.actual}%</span>
              </div>
            </div>
        ))}
      </div>
    </GlassCard>
  );
};

const UrgentTasks = () => (
  <GlassCard className="bg-gradient-to-b from-white to-[#f3f3f1]/20 border-[#7a8b95]/30">
    <div className="flex justify-between items-center mb-4 relative z-10">
      <h2 className="text-base font-black text-[#212c46] flex items-center gap-2 uppercase tracking-tight">
          <AlertCircle size={16} className="text-[#932c2e]" /> Critical Action
      </h2>
      <span className="text-[8px] font-black bg-[#932c2e]/10 text-[#932c2e] px-3 py-1 rounded-full uppercase tracking-widest">3 Tasks</span>
    </div>
    <div className="space-y-2.5 relative z-10">
        {[
          { title: "Approve Quality Manual - ISO9001", type: "Document Approval", icon: ShoppingCart, urgent: true, color: 'text-[#932c2e]', bg: 'bg-[#932c2e]/10' },
          { title: "Review Audit Report - Q1", type: "Audit Review", icon: Target, urgent: true, color: 'text-[#d96245]', bg: 'bg-[#d96245]/10' },
          { title: "Review Q3 Management Cycle", type: "Management Review", icon: Megaphone, urgent: false, color: 'text-[#3f809e]', bg: 'bg-[#3f809e]/10' },
        ].map((task, i) => (
          <div key={i} className="p-3 bg-white/70 rounded-xl border border-[#f3f3f1]/30 flex gap-3 items-start hover:bg-white transition-all shadow-sm">
            <div className={`p-2 rounded-lg ${task.bg} ${task.color} shrink-0`}>
                <task.icon size={12}/>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-[#1f2a44] tracking-tight truncate">{task.title}</p>
                <div className="flex justify-between items-center mt-1">
                    <p className="text-[8px] text-[#7a8b95] font-bold uppercase">{task.type}</p>
                    {task.urgent && <span className="text-[7px] font-black text-[#a94228] uppercase animate-pulse">Critical</span>}
                </div>
            </div>
          </div>
        ))}
    </div>
    <button className="w-full mt-4 py-3 bg-[#1f2a44] text-white text-[9px] font-bold uppercase rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 tracking-widest hover:bg-[#254268]">
        <Calendar size={12} /> Schedule
    </button>
  </GlassCard>
);

const NewFamilyMembers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const members = [
      { name: 'Civil and Commercial Code', role: 'BOOK I-VI', dept: 'Civil Law', joinDate: '01 Jan', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=150&h=150&fit=crop' },
      { name: 'Criminal Procedure', role: 'ACT B.E. 2477', dept: 'Criminal Law', joinDate: '02 Jan', img: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=150&h=150&fit=crop' },
      { name: 'Labor Protection Act', role: 'ACT B.E. 2541', dept: 'Labor Law', joinDate: '05 Jan', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <FileText size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
             <Library size={16} className="text-[#3f809e]" /> NEW LEGAL STATUTES
           </h2>
           <span className="text-[9px] font-black text-[#3f809e] bg-[#3f809e]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#3f809e]/20 hover:bg-[#3f809e] hover:text-white transition-colors cursor-pointer">VIEW ALL</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#3f809e]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#4d87a8] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                  <Sparkles size={12} />
                </div>
              </div>
              <h3 className="text-[#212c46] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#4d87a8] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#7a8b95] text-[10px] font-medium mt-0.5">{m.dept}</p>
              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#7a8b95] uppercase tracking-wider">
                <span>JOIN</span>
                <span className="text-[#212c46]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#b58c4f]"/> Welcome to the Team</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#3f809e]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#212c46] mb-1">{selectedMember.name}</h3>
               <p className="text-[#4d87a8] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#7a8b95] text-xs font-medium">{selectedMember.dept}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2 text-center">Say Hello & Welcome</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#4d87a8] focus:ring-1 focus:ring-[#4d87a8] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner"
                placeholder="Type a welcome message..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#4d87a8] hover:bg-[#3f809e] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Recent Greetings (3)</h4>
             <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Welcome to the team! Glad to have you here.</p>
                </div>
                <div className="bg-[#f0f7fa] p-3 rounded-xl border border-[#bce0f0] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">LAW Team</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">20 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">We are excited to see your impact in the Innovation department!</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const BirthdayWishes = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);

    const birthdays = [
      { name: 'Corporate Litigation Unit', dept: 'Litigation', date: '98%', img: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=150&h=150&fit=crop' },
      { name: 'Intellectual Property Team', dept: 'IP Law', date: '95%', img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=150&h=150&fit=crop' },
    ];

    const openGreeting = (person?: any) => {
      setSelectedPerson(person || birthdays[0]);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <Award size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Scale size={20} className="text-[#d96245]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            TOP PERFORMING<br/>TEAMS
          </h2>
        </div>
        <div className="space-y-3 flex-1 relative z-10">
          {birthdays.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#d96245]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#212c46] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#7a8b95] text-[10px] font-medium truncate">{b.dept}</p>
              </div>
              <div className="text-[10px] font-black text-[#d96245] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => openGreeting()} className="mt-4 w-full bg-[#b7a159] hover:bg-[#a94228] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10">
          <Send size={14} /> SEND COMMENDATION
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#022d41] tracking-widest flex items-center gap-2"><Award size={16} className="text-[#d96245]"/> Top Performance</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col">
          {selectedPerson && (
             <div className="flex items-center gap-4 mb-6 bg-[#f3f3f1] p-4 rounded-xl border border-[#f3f3f1] shrink-0">
               <img src={selectedPerson.img} alt={selectedPerson.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm" />
               <div>
                  <p className="text-xs text-[#7a8b95] font-bold uppercase tracking-wider mb-0.5">Awarded To</p>
                  <h3 className="text-sm font-black text-[#212c46]">{selectedPerson.name}</h3>
                  <p className="text-[10px] font-medium text-[#7a8b95]">{selectedPerson.dept} • Score: {selectedPerson.date}</p>
               </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#212c46] uppercase tracking-widest mb-2">Write a Commendation</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#3f809e] focus:ring-1 focus:ring-[#3f809e] outline-none transition-all resize-none bg-white font-medium shadow-inner"
                placeholder="Type your message..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#d96245] hover:bg-[#b7a159] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Commendations (5)</h4>
             <div className="space-y-4">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=10" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">วิชัย สุขใจ</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Excellent performance in passing the internal audit with 0 non-conformities! 🎉</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=11" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">สมศรี ยินดี</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">1 hr ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Great job maintaining such high standards throughout the year.</p>
                </div>
                 <div className="bg-[#fff9e6] p-3 rounded-xl border border-[#fce9aa] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 rounded-full bg-[#f3f3f1] border border-[#eaeaec] overflow-hidden">
                        <img src="https://i.pravatar.cc/150?u=12" alt="User" />
                     </div>
                     <span className="text-xs font-bold text-[#212c46]">CEO</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">2 hrs ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Top notch performance and dedication to our ISO standards. Keep it up!</p>
                </div>
             </div>
          </div>
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateNews = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    const news = [
      { category: 'LEGAL UPDATE', title: 'การแก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์', date: '08 May 2026', preview: 'มีการปรับปรุงกฎหมายว่าด้วยการสมรสเท่าเทียม ซึ่งจะเริ่มบังคับใช้ในเร็วๆ นี้...', fullText: 'สวัสดีทนายความและฝ่ายกฎหมายทุกคน\n\nโปรดทราบว่ามีการแก้ไขเพิ่มเติมประมวลกฎหมายแพ่งและพาณิชย์ (ฉบับที่ ..) พ.ศ. .... เพื่อรองรับการสมรสเท่าเทียม\n\nขอให้ทุกท่านศึกษาบทบัญญัติใหม่เพื่อการนำไปปรับใช้ในการให้คำปรึกษาแก่ลูกความ\n\nด้วยความเคารพ\nHead of Legal', author: 'Legal Operations', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=800' },
      { category: 'FIRM ANNOUNCEMENT', title: 'อัปเดตระบบสืบค้นคำพิพากษาศาลฎีกาใหม่', date: '05 May 2026', preview: 'เราได้ทำการเชื่อมต่อ API กับฐานข้อมูลคำพิพากษาศาลฎีกาเวอร์ชันใหม่...', fullText: 'เพื่อให้การสืบค้นข้อมูลรวดเร็วและแม่นยำยิ่งขึ้น\n\nทีม IT ได้อัปเดตระบบสืบค้นคำพิพากษาศาลฎีกาใหม่ให้สามารถค้นหาได้จากคีย์เวิร์ดที่ซับซ้อนขึ้น\n\nหากพบปัญหาการใช้งาน แจ้ง IT Support', author: 'IT & Data Center', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800' },
      { category: 'SEMINAR', title: 'สัมมนาการสืบพยานหลักฐานอิเล็กทรอนิกส์', date: '01 May 2026', preview: 'ขอเชิญทนายความทุกท่านเข้าร่วมสัมมนาการรับฟังพยานหลักฐานดิจิทัล...', fullText: 'คำเชิญร่วมกิจกรรมสัมมนา\n\nเนื่องจากการทำงานในปัจจุบันมีส่วนเกี่ยวข้องกับพยานหลักฐานดิจิทัลเป็นจำนวนมาก\n\nวันและเวลา: 15 พฤษภาคม 2026, 14:00 - 16:00 น.\nสถานที่: Main Auditorium ชั้น 5\n\nวิทยากร: ทนายสายไซเบอร์', author: 'Learning & Development', image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=800' },
    ];

    const openNews = (n: any) => {
      setSelectedNews(n);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 flex flex-col relative overflow-hidden">
        <div className="absolute left-[35%] top-[-30%] opacity-[0.02] pointer-events-none transform rotate-12 z-0">
          <Globe size={380} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-sm font-black text-[#212c46] flex items-center gap-2 uppercase tracking-wide">
            <Library size={16} className="text-[#3f809e]" /> LEGAL UPDATES & NEWS
          </h2>
          <div className="flex gap-2">
            <button className="text-[10px] font-black text-white bg-gradient-to-r from-[#d96245] to-[#b7a159] hover:from-[#c25035] hover:to-[#a38e4a] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#d96245]/20">
              <Plus size={14} /> ADD UPDATE
            </button>
            <button className="text-[10px] font-black text-[#212c46] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3f809e]">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {news.map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#212c46] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#3f809e] transition-colors">{n.title}</h3>
                <p className="text-[#7a8b95] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#a0abb2] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#d96245] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
                    READ <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#3f809e]"/> Corporate News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#3f809e] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#4a5568] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#7a8b95]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#212c46]">{selectedNews.author}</p>
                     </div>
                  </div>
                </div>
             </>
          )}
        </div>
      </DraggableModal>
      </>
    );
};

const CorporateAlert = () => {
    const alerts = [
      { title: 'พิจารณาคดีความหมายเลขดำที่ 102/2569', desc: 'Court hearing scheduled for Monday. Ensure all documentary evidence is ready.', icon: Scale, color: '#932c2e', bg: '#932c2e26' },
      { title: 'หมดอายุสัญญาเช่าพื้นที่อาคารสำนักงานใหญ่', desc: 'Lease agreement expires in 30 days. Review the extension clauses.', icon: Info, color: '#3f809e', bg: '#3f809e26' },
    ];

    return (
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <Megaphone size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <AlertCircle size={20} className="text-[#932c2e]" />
          <h2 className="text-sm font-black text-[#212c46] uppercase tracking-wide leading-tight">
            LEGAL<br/>ALERTS
          </h2>
        </div>
        <div className="space-y-4 flex-1 relative z-10">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-start gap-3 border border-transparent rounded-xl p-4 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: alert.bg }}>
              <alert.icon size={16} className={`shrink-0 mt-0.5`} style={{ color: alert.color }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[13px] mb-1 leading-tight" style={{ color: alert.color }}>{alert.title}</h3>
                <p className="text-[10px] font-medium leading-relaxed font-sans" style={{ color: alert.color, opacity: 0.85 }}>{alert.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    );
};



export default function Home() {
  const { user } = useAuth();

  const currentUser = {
      name: user?.name || 'SMART LAW Developer',
      position: user?.role || 'LEAD COUNSEL',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  return (
    <div className="pt-4 flex flex-col gap-5 animate-fadeIn max-w-[1532px] mx-auto px-4 sm:px-8 w-full">
      <div className="flex flex-row justify-between items-center gap-4">
          <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl text-[#212c46] tracking-tight uppercase font-exception-greeting leading-none">
                  Morning, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141] font-medium">{currentUser.name}!</span>
              </h1>
              <p className="text-[#748ea1] text-[10px] font-black uppercase tracking-widest mt-2 flex items-center gap-1.5 leading-none">
                  <TrendingUp size={14} className="text-[#d96245]" /> Compliance Rate: <span className="text-[#3f809e]">High (98.2%)</span>
              </p>
          </div>
          <div className="flex flex-row gap-3">
              <button className="bg-white text-[#212c46] px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md border border-[#cdd0db]/50 transition-all flex items-center gap-2 hover:-translate-y-0.5 whitespace-nowrap">
                  <FileSearch size={16} className="text-[#3f809e]" /> <span className="hidden sm:inline">Case Lookup</span>
              </button>
              <button className="bg-gradient-to-r from-[#3f809e] via-[#4d87a8] to-[#748ea1] text-white px-7 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap">
                  <Scale size={16} /> <span className="hidden sm:inline">New Case File</span>
              </button>
          </div>
      </div>

      <HeroBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_STATS.map((stat, idx) => (
              <MetricCard key={idx} {...stat} val={stat.value} desc={stat.sub} />
          ))}
      </div>

      <UpcomingLawsCarousel />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <NewFamilyMembers />
          <BirthdayWishes />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <CorporateNews />
          <CorporateAlert />
      </div>
    </div>
  );
}
