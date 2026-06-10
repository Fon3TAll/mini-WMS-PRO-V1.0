import React, { useState, useEffect, useMemo } from 'react';
import { 
  Compass,
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
  Network,
  Package,
  Box,
  QrCode,
  Wrench,
  MapPin,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import RealTimeSummary from './components/RealTimeSummary';

// --- Theme Configuration (Vibrant Palette) ---
const THEME = {
    bgMain: '#f3f3f1',
    bgGradient: 'linear-gradient(135deg, #f3f3f1 0%, #f3f3f1 100%)',
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
    c3: '#a34617',
    c4: '#3c3f20',
    c5: '#922724',
    c6: '#a8c0bb',
    c7: '#f2f0e6',
    c8: '#e5b73b',
    c9: '#801818',
    c10: '#efdfbb',
    c11: '#93a0bd',
    c12: '#676767',
    c13: '#beced3',
    c14: '#da8a67',
    c15: '#da9e38',
    c16: '#a5654e',
    c17: '#5e342b',
    c18: '#133951',
    c19: '#6a95b1',
    c20: '#7a7229',
    c21: '#f3c12c',
    c22: '#f08f48',
    c23: '#2b3a44',
    c24: '#769eb0',
};

// --- System Modules Data ---

const MOCK_STATS = [
    { label: 'Current Stock Levels', value: '14,500', sub: '+120 New Arrivals (YTD)', icon: Package, color: THEME.c11 },
    { label: 'Pending Shipments', value: '18', sub: 'Awaiting dispatch', icon: Truck, color: THEME.c21 },
    { label: 'Active Warehouse Tasks', value: '34', sub: 'In progress', icon: Activity, color: THEME.c16 },
    { label: 'Low Stock Alerts', value: '24', sub: 'Urgent: 5 items', icon: AlertTriangle, color: THEME.c2 },
];

const ExploreMenu = () => {
  const menus = [
    { label: 'GOODS RECEIPT', sub: 'รับเข้าสินค้า/วัตถุดิบ', icon: Package, link: '/fg-receipt' },
    { label: 'AI WMS COPILOT', sub: 'ปัญญาประดิษฐ์สืบค้น', icon: BrainCircuit, link: '/copilot' },
    { label: 'ORDER PICKING', sub: 'เบิกจ่ายและกระจาย', icon: Box, link: '/order-picking' },
    { label: 'SMART PUTAWAY', sub: 'ระบบจัดเก็บอัจฉริยะ', icon: CheckSquare, link: '/smart-putaway' },
    { label: 'CROSS DOCKING', sub: 'ส่งผ่านไม่จัดเก็บ', icon: Network, link: '/cross-docking' },
    { label: 'STOCK DASHBOARD', sub: 'ติดตามสถานะสินค้า', icon: PieChart, link: '/stock-dashboard' },
    { label: 'WAVE PLANNING', sub: 'วางแผนกลุ่มงานเบิก', icon: Target, link: '/wave-planning' },
    { label: 'CYCLE COUNT', sub: 'ตรวจนับสินค้าประจำรอบ', icon: RotateCcw, link: '/cycle-count' },
    { label: 'DISPATCH & LOAD', sub: 'ควบคุมการนำขึ้นรถ', icon: Truck, link: '/dispatch' },
    { label: 'SYSTEM CONFIG', sub: 'ตั้งค่าโครงสร้างระบบ', icon: Settings, link: '/system-config' },
  ];

  return (
    <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative w-full overflow-hidden mt-1 p-6 sm:p-8 shadow-sm">
       <div className="flex items-center gap-2 mb-2 relative z-10">
          <Compass size={22} className="text-[#133951]" strokeWidth={2.5}/>
          <h2 className="text-sm sm:text-base font-black text-[#1a253d] uppercase tracking-widest leading-tight flex items-center gap-2">
            EXPLORE BY SECTOR <span className="text-[#788990] font-normal">/</span> <span className="text-sm">สำรวจแยกตามหมวดหมู่</span>
          </h2>
       </div>
       <p className="text-[9px] sm:text-[10px] font-black text-[#7a8b95] uppercase tracking-[0.2em] leading-none mb-8 opacity-80">
         QUICK SHORTCUT HUBS TO CENTRAL DATABASE SECTORS AND PROCESSES
       </p>
       
       <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 relative z-10">
         {menus.map((m, i) => (
           <a href={m.link} key={i} className="flex flex-col items-center justify-center p-4 bg-white border border-[#eaeaec] rounded-2xl hover:bg-[#ad2b10] hover:border-[#ad2b10] hover:shadow-lg transition-all duration-300 group cursor-pointer text-center relative overflow-hidden h-[120px]">
              <m.icon size={32} className="text-[#133951] group-hover:text-white mb-3 group-hover:scale-110 transition-all duration-300 relative z-10" strokeWidth={1.5} />
              <h3 className="text-[10px] sm:text-[11px] font-black text-[#1a253d] group-hover:text-white uppercase tracking-[0.08em] leading-tight relative z-10 transition-colors duration-300">{m.label}</h3>
              <p className="text-[8px] sm:text-[9px] font-bold text-[#788990] group-hover:text-white/80 mt-1 relative z-10 transition-colors duration-300">{m.sub}</p>
           </a>
         ))}
       </div>
    </GlassCard>
  );
};

const GlassCard = ({ children, className = '', hoverEffect = true, style = {} }: any) => (
    <div className={`rounded-2xl p-4 backdrop-blur-xl shadow-[0_8px_30px_rgba(31,42,68,0.06)] border border-white/60 ${hoverEffect ? 'hover:-translate-y-1 transition-transform duration-300' : ''} ${className}`}
        style={{ backgroundColor: THEME.glassWhite, ...style }}>
        {children}
    </div>
);

const HeroBanner = () => {
    const bgImage = "https://www.easetrack.com/wp-content/uploads/2023/11/Artificial-intelligence-for-inventory-management.jpg.webp";
    return (
      <div className="relative w-full rounded-2xl overflow-hidden shadow-xl group bg-[#1a253d] border border-[#2b3a44] font-exception-hero">
        <div className="absolute inset-0 transform transition-transform duration-[2000ms] group-hover:scale-105">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{ backgroundImage: `url(${bgImage})`, backgroundPosition: 'center 35%' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a253d]/95 via-[#1a253d]/70 to-transparent" />
        <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-between p-4 md:p-6 w-full gap-6">
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Box size={12} className="text-[#e5b73b]" />
              <span className="text-[9px] text-[#e5b73b] font-black uppercase tracking-[0.2em] drop-shadow-sm">Warehouse Operations</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none mb-3 drop-shadow-md">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ce8a39] to-[#efdfbb]">Inventory Control</span>
            </h2>
            <div className="mb-6">
              <p className="text-white/90 text-xs font-medium leading-relaxed max-w-2xl">
                "ระบบจัดการคลังสินค้าอัจฉริยะแบบเรียลไทม์ ผสานเทคโนโลยี AI เพื่อความแม่นยำสูงสุด" <br/><span className="text-[#e5b73b] font-bold">SMART WMS System</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-[#ce8a39] hover:bg-[#a34617] border border-[#e5b73b]/30 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 shadow-lg hover:shadow-[0_0_15px_rgba(206,138,57,0.5)]">
                <Box size={12} /> Inventory
              </button>
              <div className="bg-white/5 border border-white/10 px-4 py-2 text-center rounded-xl flex items-center gap-2 shadow-inner backdrop-blur-md">
                <ShieldCheck size={14} className="text-[#a8c0bb]" />
                <span className="text-white font-black tracking-tighter text-sm">ISO 9001</span>
                <span className="text-[8px] text-white/50 font-bold uppercase tracking-widest leading-none mt-0.5">Compliant</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <a 
              href="/copilot"
              className="bg-gradient-to-br from-[#1a253d] to-[#3c3f20] border border-[#e5b73b]/40 p-1 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(229,183,59,0.3)] hover:-translate-y-1 transition-all group/ai"
            >
              <div className="bg-[#1a253d] border border-white/10 rounded-xl px-8 py-5 flex flex-col items-center gap-2">
                <div className="relative">
                   <div className="absolute inset-0 bg-[#e5b73b]/20 blur-xl rounded-full scale-150 animate-pulse" />
                   <BrainCircuit size={40} className="text-[#e5b73b] relative z-10 group-hover/ai:scale-110 transition-transform duration-500" />
                </div>
                <span className="text-[#e5b73b] text-[13px] font-black uppercase tracking-[0.2em] mt-1">WMS COPILOT</span>
                <span className="text-[8px] text-white/40 font-bold tracking-[0.4em]">SMART ASSISTANT</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
};

const CorporateAnnouncementsCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const announcements = [
        { id: 1, type: "SYSTEM UPDATE", issue: "Q1 Inventory Audit", subject: "Review the key takeaways and missing items from our recent audit.", date: "12 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1586528116311-ad8ed3891461?q=80&w=500" },
        { id: 2, type: "WAREHOUSE ALERT", issue: "New Safety Policy", subject: "Review the updated guidelines for forklift operations.", date: "14 May 2026", isNew: true, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=500" },
        { id: 3, type: "PROCUREMENT", issue: "Annual Supplier Visit", subject: "Join us for our annual supplier facility tour.", date: "20 May 2026", isNew: false, image: "https://images.unsplash.com/photo-1565514020179-026b92b610d7?q=80&w=500" },
        { id: 4, type: "TRAINING", issue: "WMS User Training", subject: "Mandatory training for all inventory clerks next month.", date: "02 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1623000850028-21d1b919dcbb?q=80&w=500" },
        { id: 5, type: "LOGISTICS", issue: "Route Optimization", subject: "New delivery routes implemented for faster delivery times.", date: "15 Jun 2026", isNew: false, image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=500" },
        { id: 6, type: "IT UPDATE", issue: "New WMS Version", subject: "We are migrating to a new barcode scanning system.", date: "01 Jul 2026", isNew: false, image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=500" },
    ];

    const nextSlide = () => setCurrentIndex((prev) => (prev === announcements.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? announcements.length - 1 : prev - 1));

    // Show up to 4 items on large screens
    const visibleAnnouncements = [];
    for (let i = 0; i < 4; i++) {
        visibleAnnouncements.push(announcements[(currentIndex + i) % announcements.length]);
    }

    return (
        <div className="w-full bg-[#f6f5f3] py-5 rounded-2xl relative overflow-hidden shadow-inner border border-[#e5e5e5]">
            <div className="flex items-center absolute top-1/2 -translate-y-1/2 left-2 z-20">
                <button onClick={prevSlide} className="bg-gray-600/80 hover:bg-gray-800 text-white p-2 rounded shadow-lg backdrop-blur transition-colors">
                    <ChevronLeft size={24} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 px-14">
                {visibleAnnouncements.map((ann, idx) => (
                    <div key={`${ann.id}-${idx}`} className="bg-white rounded-xl overflow-hidden shadow-sm flex flex-col relative h-[145px] border border-gray-100 group transition-all hover:shadow-md justify-between">
                        {ann.isNew && (
                            <div className="absolute -left-10 top-5 bg-[#922724] text-white font-black px-11 py-1 -rotate-45 z-20 shadow-md text-[11px] tracking-wider">
                                NEW
                            </div>
                        )}
                        
                        <div className="p-2 pt-3 text-center z-10 relative">
                            <h3 className="font-extrabold text-[#676767] leading-tight text-[12px] drop-shadow-sm">{ann.type}</h3>
                            <h4 className="font-bold text-[#788990] text-[10px] mt-0.5">{ann.issue}</h4>
                            <h2 className="font-black text-[#133951] text-[13px] mt-2 drop-shadow-sm leading-tight line-clamp-2">{ann.subject}</h2>
                        </div>
                        
                        <div className="bg-[#2b3a44] text-white py-1.5 px-2 mx-2 mb-2 rounded-lg text-center flex items-center justify-center gap-1 z-10 shadow-sm relative shrink-0">
                            <span className="text-[9px] font-medium tracking-wide">Date</span>
                            <span className="flex items-center gap-0.5 mx-1 text-white/50"><span className="w-0.5 h-0.5 bg-white/50 rounded-full"></span><span className="w-1 h-1 bg-white/80 rounded-full"></span></span>
                            <span className="text-[10px] font-black tracking-wide">{ann.date}</span>
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
                {announcements.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-[#133951] ring-2 ring-[#133951]/30 ring-offset-2' : 'bg-gray-400 hover:bg-gray-500'}`}
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
            <p className="text-[10px] font-bold text-[#788990] uppercase tracking-wider opacity-90 truncate">{label}</p>
            <h4 className="text-2xl font-black tracking-tight mt-0.5" style={{color: THEME.primary}}>{val}</h4>
            {desc && (
                <p className="text-[10px] text-[#788990] font-bold mt-2 flex items-center gap-1.5">
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
      { name: 'Pallet Jack PX-2', role: 'EQUIPMENT', dept: 'Zone C', joinDate: 'Overdue', img: 'https://images.unsplash.com/photo-1586528116311-ad8ed3891461?q=80&w=150&h=150&fit=crop' },
      { name: 'Scan Gun #44', role: 'ELECTRONICS', dept: 'Receiving', joinDate: 'Lost', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=150&h=150&fit=crop' },
      { name: 'Forklift TK-9', role: 'VEHICLE', dept: 'Maintenance', joinDate: 'In Repair', img: 'https://images.unsplash.com/photo-1565514020179-026b92b610d7?w=150&h=150&fit=crop' },
    ];

    const openWelcome = (m: any) => {
      setSelectedMember(m);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#f3f3f1] col-span-1 lg:col-span-2 relative overflow-hidden">
        <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none transform rotate-12 z-0">
          <Truck size={240} />
        </div>
        <div className="flex justify-between items-center mb-6 relative z-10">
           <h2 className="text-sm font-black text-[#1a253d] flex items-center gap-2 uppercase tracking-wide">
             <AlertTriangle size={16} className="text-[#922724]" /> MISSING / MAINTENANCE EQUIPMENTS
           </h2>
           <span className="text-[9px] font-black text-[#922724] bg-[#922724]/10 px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#922724]/20 hover:bg-[#922724] hover:text-white transition-colors cursor-pointer">TRACK ALL</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {members.map((m, i) => (
            <div key={i} onClick={() => openWelcome(m)} className="bg-white rounded-2xl border border-[#f3f3f1]/30 hover:border-[#133951]/60 p-5 flex flex-col items-center relative shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <div className="relative mb-4">
                <img src={m.img} alt={m.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                <div className="absolute -bottom-2 -right-2 bg-[#6a95b1] p-1.5 rounded-lg text-white shadow-sm border-2 border-white group-hover:scale-110 transition-transform">
                  <Sparkles size={12} />
                </div>
              </div>
              <h3 className="text-[#1a253d] font-bold text-sm mb-1">{m.name}</h3>
              <p className="text-[#6a95b1] text-[9px] font-black uppercase tracking-widest">{m.role}</p>
              <p className="text-[#788990] text-[10px] font-medium mt-0.5">{m.dept}</p>
              <div className="w-full h-px bg-[#f3f3f1] my-4" />
              <div className="w-full flex justify-between items-center text-[10px] font-black text-[#788990] uppercase tracking-wider">
                <span>STATUS</span>
                <span className="text-[#1a253d]">{m.joinDate}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#1a253d] tracking-widest flex items-center gap-2"><Sparkles size={16} className="text-[#ce8a39]"/> Equipment Status Update</span>}
        width="max-w-md"
      >
        <div className="p-6">
          {selectedMember && (
             <div className="text-center mb-6">
               <img src={selectedMember.img} alt={selectedMember.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#133951]/20 shadow-md mx-auto mb-4" />
               <h3 className="text-xl font-black text-[#1a253d] mb-1">{selectedMember.name}</h3>
               <p className="text-[#6a95b1] text-xs font-black uppercase tracking-widest mb-1">{selectedMember.role}</p>
               <p className="text-[#788990] text-xs font-medium">{selectedMember.dept}</p>
             </div>
          )}
          
          <div className="mb-6 shrink-0">
            <label className="block text-[10px] font-black text-[#1a253d] uppercase tracking-widest mb-2 text-center">Report Update</label>
            <div className="relative">
              <textarea 
                className="w-full h-24 p-3 pr-12 border border-[#cdd0db] rounded-xl text-sm focus:border-[#6a95b1] focus:ring-1 focus:ring-[#6a95b1] outline-none transition-all resize-none bg-[#f3f3f1]/50 font-medium shadow-inner"
                placeholder="Type your update here..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#6a95b1] hover:bg-[#133951] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
             <h4 className="text-[10px] font-black text-[#788990] uppercase tracking-widest mb-3 border-b border-[#f3f3f1] pb-2">Recent Logs (2)</h4>
             <div className="space-y-3">
                <div className="bg-white p-3 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#1a253d]">Maintenance Dept</span>
                     <span className="text-[9px] text-[#788990] ml-auto">10 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Technician is currently inspecting the equipment.</p>
                </div>
                <div className="bg-[#f0f7fa] p-3 rounded-xl border border-[#bce0f0] shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="text-xs font-bold text-[#212c46]">System Log</span>
                     <span className="text-[9px] text-[#7a8b95] ml-auto">20 mins ago</span>
                  </div>
                  <p className="text-xs text-[#4a5568] leading-relaxed">Status updated to In Repair.</p>
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
      { name: 'Cardboard Box A4', dept: 'Packaging', date: '30 pcs', img: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=150&h=150&fit=crop' },
      { name: 'Bubble Wrap Roll 50m', dept: 'Packaging', date: '5 rolls', img: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=150&h=150&fit=crop' },
    ];

    const openGreeting = (person?: any) => {
      setSelectedPerson(person || birthdays[0]);
      setIsModalOpen(true);
    };

    return (
      <>
      <GlassCard className="bg-white border-[#eaeaec] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.03] pointer-events-none transform -rotate-12 z-0">
          <AlertCircle size={200} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <AlertCircle size={20} className="text-[#ad2b10]" />
          <h2 className="text-sm font-black text-[#1a253d] uppercase tracking-wide leading-tight">
            LOW STOCK<br/>ALERTS
          </h2>
        </div>
        <div className="space-y-3 flex-1 relative z-10">
          {birthdays.map((b, i) => (
            <div key={i} onClick={() => openGreeting(b)} className="flex items-center gap-4 bg-white border border-[#f3f3f1]/30 hover:border-[#ad2b10]/60 rounded-xl p-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
              <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm shadow-black/10 group-hover:scale-105 transition-transform" />
              <div className="flex-1 min-w-0">
                <h3 className="text-[#1a253d] font-bold text-xs truncate">{b.name}</h3>
                <p className="text-[#788990] text-[10px] font-medium truncate">{b.dept}</p>
              </div>
              <div className="text-[10px] font-black text-[#ad2b10] tracking-widest shrink-0">
                {b.date}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => openGreeting()} className="mt-4 w-full bg-[#ce8a39] hover:bg-[#922724] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors flex justify-center items-center gap-2 shadow-md relative z-10">
          <ShoppingCart size={14} /> SUBMIT REQUISITION
        </button>
      </GlassCard>

      <DraggableModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={<span className="text-sm font-black uppercase text-[#133951] tracking-widest flex items-center gap-2"><ShoppingCart size={16} className="text-[#ad2b10]"/> Material Requisition</span>}
        width="max-w-md"
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar flex flex-col bg-[#fdfbf7] relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#f2f0e6] to-transparent z-0 opacity-50"></div>
          {selectedPerson && (
             <div className="flex flex-col items-center gap-3 mb-6 relative z-10 pt-4">
               <img src={selectedPerson.img} alt={selectedPerson.name} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
               <div className="text-center">
                  <p className="text-[10px] text-[#e5b73b] font-bold uppercase tracking-[0.2em] mb-1">Restock Needed</p>
                  <h3 className="text-xl font-serif font-black text-[#1a253d]">{selectedPerson.name}</h3>
                  <p className="text-[11px] font-medium text-[#788990] mt-1">{selectedPerson.dept} • Current Stock: {selectedPerson.date}</p>
               </div>
             </div>
          )}
          
          <div className="mb-6 shrink-0 relative z-10">
            <label className="block text-[10px] font-black text-[#ce8a39] uppercase tracking-widest mb-2 text-center">Add Requisition Note</label>
            <div className="relative shadow-sm rounded-xl overflow-hidden border border-[#efdfbb]">
              <textarea 
                className="w-full h-24 p-3 pr-12 text-sm focus:outline-none resize-none bg-white font-medium placeholder:text-[#beced3] font-serif"
                placeholder="Write your request details here..."
              ></textarea>
              <button className="absolute bottom-3 right-3 w-8 h-8 bg-[#ad2b10] hover:bg-[#922724] text-white rounded-lg flex items-center justify-center transition-colors shadow-md">
                <Send size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0 relative z-10">
             <h4 className="text-[10px] font-black text-[#788990] uppercase tracking-widest mb-3 text-center opacity-60">Requisition Status</h4>
             <div className="space-y-3">
                <div className="bg-white p-4 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden shrink-0 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-[#a8c0bb]"/>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#1a253d]">Procurement</span>
                        <span className="block text-[9px] text-[#788990]">10 mins ago</span>
                     </div>
                  </div>
                  <p className="text-xs text-[#554e4c] leading-relaxed font-serif text-center italic">"Purchase Order PO-2026-0045 created and sent to supplier."</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-[#f3f3f1] shadow-sm relative">
                  <div className="flex items-center gap-3 mb-2">
                     <div className="w-8 h-8 rounded-full bg-[#f3f3f1] border border-[#f3f3f1] overflow-hidden shrink-0 flex items-center justify-center">
                        <User size={16} className="text-[#788990]"/>
                     </div>
                     <div>
                        <span className="block text-xs font-bold text-[#1a253d]">Warehouse Manager</span>
                        <span className="block text-[9px] text-[#788990]">1 hr ago</span>
                     </div>
                  </div>
                  <p className="text-xs text-[#554e4c] leading-relaxed font-serif text-center italic">"Requested urgent restock. We are running low due to high season."</p>
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
      { category: 'WAREHOUSE UPDATE', title: 'New Layout for Zone D', date: '08 May 2026', preview: 'We have redesigned Zone D to improve picking efficiency. Please check the new map...', fullText: '', author: 'WAREHOUSE MANAGER', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800' },
      { category: 'SAFETY ANNOUNCEMENT', title: 'Updated Safety Protocols', date: '05 May 2026', preview: 'Mandatory high-visibility vests are required in all zones starting next week...', fullText: '', author: 'SAFETY TEAM', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800' },
      { category: 'EVENT', title: 'Forklift Rodeo 2026', date: '01 May 2026', preview: 'Join our annual forklift driving competition. Prizes included!', fullText: '', author: 'OPERATIONS', image: 'https://images.unsplash.com/photo-1511632765486-a01c80cf59af?q=80&w=800' },
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
          <h2 className="text-sm font-black text-[#1a253d] flex items-center gap-2 uppercase tracking-wide">
            <Globe size={16} className="text-[#133951]" /> WAREHOUSE NEWS BOARD
          </h2>
          <div className="flex gap-2">
            <button className="text-[10px] font-black text-white bg-gradient-to-r from-[#ad2b10] to-[#e5b73b] hover:from-[#922724] hover:to-[#ce8a39] px-4 py-2 rounded-lg uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 outline-none hover:scale-105 active:scale-95 border border-[#ad2b10]/20">
              <Plus size={14} /> ADD UPDATE
            </button>
            <button className="text-[10px] font-black text-[#1a253d] bg-white px-4 py-2 rounded-lg uppercase tracking-widest border border-[#f3f3f1] hover:bg-[#f3f3f1] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#133951]">ALL</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative z-10">
          {news.map((n, i) => (
            <div key={i} onClick={() => openNews(n)} className="flex flex-col bg-white border border-[#f3f3f1] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <div className="relative h-36 w-full overflow-hidden">
                <img src={n.image} alt={n.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest bg-[#133951] px-2.5 py-1 rounded-md shadow-sm">{n.category}</span>
                   <span className="text-white/90 text-[10px] font-bold tracking-wider drop-shadow-md">{n.date}</span>
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[#1a253d] font-bold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-[#6a95b1] transition-colors">{n.title}</h3>
                <p className="text-[#788990] text-[11px] font-medium line-clamp-2 leading-relaxed flex-1">{n.preview}</p>
                <div className="mt-4 pt-3 border-t border-[#f3f3f1] flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#93a0bd] uppercase tracking-widest flex items-center gap-1.5"><User size={10}/> {n.author}</span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#ad2b10] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 duration-300">
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
        title={<span className="text-sm font-black uppercase text-[#1a253d] tracking-widest flex items-center gap-2"><Globe size={16} className="text-[#133951]"/> Warehouse News</span>}
        width="max-w-2xl"
      >
        <div className="p-0 overflow-hidden flex flex-col max-h-[85vh]">
          {selectedNews && (
             <>
                <div className="relative h-48 w-full shrink-0">
                   <img src={selectedNews.image} alt={selectedNews.title} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest bg-[#133951] px-3 py-1 rounded-md shadow-sm">{selectedNews.category}</span>
                        <span className="text-white/80 text-xs font-bold">{selectedNews.date}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">{selectedNews.title}</h2>
                   </div>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <div className="whitespace-pre-wrap text-[#676767] text-sm leading-relaxed mb-8">
                    {selectedNews.fullText}
                  </div>
                  <div className="bg-[#f3f3f1] rounded-xl p-4 border border-[#f3f3f1] flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#f3f3f1] rounded-full flex items-center justify-center border border-[#f3f3f1] shrink-0">
                        <User size={18} className="text-[#788990]" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-[#788990] uppercase tracking-widest">Published By</p>
                       <p className="text-sm font-bold text-[#1a253d]">{selectedNews.author}</p>
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
      { title: 'Temperature Alert: Cold Storage', desc: 'Zone B temperature is 2 degrees above normal. Maintenance dispatched.', icon: Target, color: '#922724', bg: '#92272426' },
      { title: 'Incoming Shipment Delay', desc: 'Shipment SHP-1120 delayed by 2 hours due to traffic.', icon: Info, color: '#133951', bg: '#13395126' },
    ];

    return (
      <GlassCard className="bg-white border-[#f3f3f1] flex flex-col relative overflow-hidden">
        <div className="absolute right-[-5%] bottom-[-5%] opacity-[0.02] pointer-events-none transform -rotate-12 z-0">
          <Megaphone size={220} />
        </div>
        <div className="flex items-center gap-2 mb-6 relative z-10">
          <Megaphone size={20} className="text-[#922724]" />
          <h2 className="text-sm font-black text-[#1a253d] uppercase tracking-wide leading-tight">
            WAREHOUSE<br/>ALERTS
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
  const { addNotification } = useNotifications();

  const currentUser = {
      name: user?.name || 'SMART LAW Developer',
      position: user?.role || 'LEAD COUNSEL',
      avatar: user?.avatar || 'https://drive.google.com/thumbnail?id=1Z_fRbN9S4aA7OkHb3mlim_t60wIT4huY&sz=w400'
  };

  return (
    <div className="pt-4 flex flex-col gap-5 animate-fadeIn px-4 sm:px-8 w-full">
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

      <RealTimeSummary />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_STATS.map((stat, idx) => (
              <MetricCard key={idx} {...stat} val={stat.value} desc={stat.sub} />
          ))}
      </div>

      <CorporateAnnouncementsCarousel />
      <ExploreMenu />

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
