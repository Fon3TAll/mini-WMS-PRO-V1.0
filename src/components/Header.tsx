import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Target, Bell, QrCode, X, Check, CheckCheck, Trash2, 
  Volume2, VolumeX, AlertTriangle, Info, AlertCircle, ShoppingCart, 
  Wrench, ShieldAlert, Package, RefreshCw, Languages, Printer, LayoutDashboard
} from 'lucide-react';
import { useNotifications, NotificationItem } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

export default function Header({ onOpenScanner }: { onOpenScanner?: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'tasks' | 'system'>('all');
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll, 
    soundEnabled, 
    toggleSound 
  } = useNotifications();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside to close dropdown safely
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Filter notifications based on tab
  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'alerts') return n.severity === 'critical' || n.severity === 'warning';
    if (activeTab === 'tasks') return n.type === 'task' || n.type === 'inbound' || n.type === 'outbound' || n.type === 'stock';
    if (activeTab === 'system') return n.type === 'system' || n.type === 'security' || n.type === 'equipment';
    return true;
  });

  const getSeverityStyles = (severity: NotificationItem['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          icon: <AlertCircle className="text-red-600 grow-0 shrink-0" size={15} />,
          badge: 'bg-red-50 text-red-700 border-red-200',
          indicator: 'bg-red-600',
          bg: 'bg-rose-50/40 hover:bg-rose-50/80 border-l-4 border-l-red-600 border-rose-100',
          label: 'CRITICAL'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="text-amber-600 grow-0 shrink-0" size={15} />,
          badge: 'bg-amber-50 text-amber-700 border-amber-200',
          indicator: 'bg-amber-500',
          bg: 'bg-amber-50/25 hover:bg-amber-50/50 border-l-4 border-l-amber-500 border-amber-100',
          label: 'WARNING'
        };
      case 'success':
        return {
          icon: <Check className="text-emerald-600 grow-0 shrink-0" size={15} />,
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          indicator: 'bg-emerald-500',
          bg: 'bg-emerald-50/20 hover:bg-emerald-50/45 border-l-4 border-l-emerald-500 border-emerald-100',
          label: 'SUCCESS'
        };
      default:
        return {
          icon: <Info className="text-sky-600 grow-0 shrink-0" size={15} />,
          badge: 'bg-sky-50 text-sky-700 border-sky-100',
          indicator: 'bg-sky-500',
          bg: 'bg-slate-50/40 hover:bg-slate-50/85 border-l-4 border-l-sky-500 border-slate-200',
          label: 'INFO'
        };
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'stock': return <Package size={14} className="text-amber-600" />;
      case 'equipment': return <Wrench size={14} className="text-[#3f809e]" />;
      case 'security': return <ShieldAlert size={14} className="text-rose-600" />;
      case 'inbound': return <ShoppingCart size={14} className="text-indigo-600" />;
      case 'outbound': return <RefreshCw size={14} className="text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />;
      default: return <Info size={14} className="text-slate-500" />;
    }
  };

  // Human-readable date conversion
  const formatTimeAgo = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return 'เมื่อครู่นี้ (Just now)';
      if (diffMins < 60) return `${diffMins} นาทีที่แล้ว (${diffMins}m ago)`;
      if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว (${diffHours}h ago)`;
      return date.toLocaleDateString('th-TH', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <header className="h-24 px-8 flex flex-row items-center justify-between z-10 shrink-0 bg-transparent w-full">
      <div className="flex items-center gap-6">
        <div className="flex items-center justify-center shrink-0">
          <svg width="0" height="0" className="absolute">
            <linearGradient id="themeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop stopColor="#ce8a39" offset="0%" />
              <stop stopColor="#ad2b10" offset="50%" />
              <stop stopColor="#922724" offset="100%" />
            </linearGradient>
          </svg>
          <Target size={42} stroke="url(#themeGrad)" strokeWidth={2.6} className="drop-shadow-sm" />
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 font-exception-header">
            <span className="font-black text-[#1a253d] text-[25px] tracking-wide uppercase leading-none">
              {t('ระบบจัดการคลัง', 'SMART WAREHOUSE')}
            </span>
            <span className="font-bold text-[#6a95b1] text-[25px] tracking-wide uppercase leading-none">
              {t('สินค้าอัจฉริยะ', 'MANAGEMENT SYSTEM')}
            </span>
            <span className="bg-[#ce8a39] hidden xl:block text-white text-[10px] font-black uppercase px-2 py-0.5 rounded ml-2 tracking-wider">
              {t('ระบบหลัก WMS', 'WMS ENGINE')}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-0.5 font-exception-header">
            <div className="w-10 h-[2px] bg-[#ce8a39]"></div>
            <span className="text-[10px] font-bold text-[#788990] uppercase tracking-[0.2em] leading-none">
              {t('แพลตฟอร์มบริหารและจัดการคลังวัตถุดิบและคู่ค้าอัจฉริยะ', 'INTEGRATED INVENTORY AND SUPPLY CHAIN PLATFORM')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 mr-2">
          {/* Orientation Toggle */}
          <button
            onClick={() => {
              const root = document.documentElement;
              const currentSize = root.style.getPropertyValue('--print-page-size') || 'A4 portrait';
              root.style.setProperty('--print-page-size', currentSize.includes('portrait') ? 'A4 landscape' : 'A4 portrait');
            }}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5f7ab7] hover:bg-slate-50 transition-all border border-[#cdd0db]/50 hover:scale-105 shrink-0 group"
            title="Toggle Print Orientation (Portrait/Landscape)"
          >
            <LayoutDashboard size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Print Watermark Toggle */}
          <button
            onClick={() => window.toggleConfidentialWatermark && window.toggleConfidentialWatermark()}
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-50 transition-all border border-[#cdd0db]/50 hover:scale-105 shrink-0 group"
            title="Toggle Confidential Watermark"
          >
            <ShieldAlert size={16} className="group-hover:-rotate-12 transition-transform" />
          </button>
          
          {/* Print Preview Button */}
          <button
            onClick={() => {
              window.print();
            }}
            className="px-3 md:px-4 h-10 rounded-full bg-[#1a253d] shadow-md flex items-center justify-center text-[#e5b73b] hover:bg-[#212c46] hover:text-[#f8d264] transition-all border border-[#cdd0db]/20 hover:scale-105 shrink-0 gap-2 shrink-0 group"
            title="Print Preview / Export PDF"
          >
            <Printer size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider hidden sm:block">Print Preview</span>
          </button>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center bg-white rounded-full shadow-sm p-1 border border-[#cdd0db]/50 h-11 gap-0.5">
          <button
            onClick={() => setLanguage('en')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all h-full flex items-center ${
              language === 'en'
                ? 'bg-[#ce8a39] text-white shadow-sm font-black'
                : 'text-[#788990] hover:text-[#1a253d] font-bold'
            }`}
            title="English Language Selection"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('th')}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider transition-all h-full flex items-center ${
              language === 'th'
                ? 'bg-[#212c46] text-white shadow-sm font-black'
                : 'text-[#788990] hover:text-[#1a253d] font-bold'
            }`}
            title="เลือกภาษาไทย"
          >
            TH
          </button>
        </div>

        <div className="flex items-center bg-white rounded-full shadow-sm p-1 pr-1.5 pl-6 gap-5 border border-[#cdd0db]/50 h-11">
          <div className="flex flex-col justify-center items-center">
            <span className="text-[9px] font-black text-[#5f7ab7] uppercase tracking-[0.1em] leading-none mb-0.5">{currentTime.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { weekday: 'long' })}</span>
            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#022d41] to-[#214573] leading-none">{currentTime.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div className="bg-[#212c46] text-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-inner h-full">
            <Clock size={14} className="text-[#b58c4f]" strokeWidth={2.5} />
            <span className="text-[12px] font-black font-mono tracking-widest mt-0.5">
              {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
        
        {onOpenScanner && (
          <button 
            onClick={onOpenScanner}
            className="relative w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-600 hover:bg-slate-50 transition-all group border border-[#cdd0db]/50 hover:scale-105 shrink-0"
            title="เปิดระบบสแกนบาร์โค้ดสะสม (WMS Smart Scanner)"
          >
            <QrCode size={18} className="group-hover:scale-110 transition-transform" strokeWidth={2} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_0_2px_#ffffff]"></span>
          </button>
        )}

        {/* Global Notification Center drop-down trigger */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`relative w-11 h-11 rounded-full shadow-sm flex items-center justify-center transition-all border shrink-0 hover:scale-105 ${
              isDropdownOpen 
                ? 'bg-[#1a253d] text-white border-[#1a253d]' 
                : 'bg-white text-[#3f809e] border-[#cdd0db]/50 hover:bg-[#f8f9fa]'
            }`}
            title="แจ้งเตือนสถานะคลัง (WMS Alert Hub)"
          >
            <Bell size={18} className={`${isDropdownOpen ? '' : 'group-hover:rotate-12'} transition-transform`} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-[#ad2b10] text-white rounded-full flex items-center justify-center text-[9px] font-black shadow-md border-2 border-white animate-bounce-short">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsDropdownOpen(false)}
                  className="fixed inset-0 bg-[#1a253d]/40 backdrop-blur-sm z-[200] w-full h-full"
                />
                <motion.div
                  initial={{ opacity: 0, x: 400 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 400 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed right-0 top-0 h-screen w-[420px] max-w-[calc(100vw-32px)] bg-white border-l border-[#cdd0db]/65 shadow-[-20px_0_50px_rgba(26,37,61,0.24)] z-[210] flex flex-col"
                >
                  {/* Header */}
                  <div className="bg-[#10192e] text-white px-5 py-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Bell size={20} className="animate-swing" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider leading-none">Notification Center</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest leading-none">
                          {unreadCount} UNREAD ALERTS & TASKS
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={toggleSound}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white transition-colors"
                        title={soundEnabled ? 'Mute Alert Sound Effects' : 'Unmute Sound Effects'}
                      >
                        {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </button>
                      <button 
                        onClick={() => setIsDropdownOpen(false)}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-350 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex border-b border-slate-100 bg-slate-50/50 p-2 gap-1 shrink-0">
                    {(['all', 'alerts', 'tasks', 'system'] as const).map((tab) => {
                      const count = notifications.filter(n => {
                        if (tab === 'all') return true;
                        if (tab === 'alerts') return n.severity === 'critical' || n.severity === 'warning';
                        if (tab === 'tasks') return n.type === 'task' || n.type === 'inbound' || n.type === 'outbound' || n.type === 'stock';
                        if (tab === 'system') return n.type === 'system' || n.type === 'security' || n.type === 'equipment';
                        return false;
                      }).length;

                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`flex-1 py-2 rounded-xl text-[11px] uppercase tracking-wide font-black transition-colors ${
                            activeTab === tab
                              ? 'bg-[#1a253d] text-white shadow-sm'
                              : 'text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {tab === 'all' ? 'All' : tab === 'alerts' ? 'Criticals' : tab === 'tasks' ? 'Ops' : 'Devices'}
                          <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                            activeTab === tab 
                              ? 'bg-amber-500 text-[#10192e]' 
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quick actions line */}
                  {unreadCount > 0 && (
                    <div className="px-5 py-3 bg-rose-50/30 border-b border-rose-50 flex items-center justify-between shrink-0">
                      <span className="text-[11px] text-slate-500 font-bold">You have unread status alerts.</span>
                      <button 
                        onClick={markAllAsRead}
                        className="text-[11px] font-black text-[#ce8a39] hover:text-[#922724] uppercase tracking-wider flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm transition-all"
                      >
                        <CheckCheck size={14} /> Mark All Read
                      </button>
                    </div>
                  )}

                  {/* Notifications List container */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-50 custom-scrollbar">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-20 px-5 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
                          <Check size={28} />
                        </div>
                        <h5 className="text-sm font-black text-slate-700 uppercase">No active alerts</h5>
                        <p className="text-[11px] text-slate-400 font-medium mt-2 max-w-[250px]">Everything in the warehouse is operating fully green.</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notif) => {
                        const style = getSeverityStyles(notif.severity);
                        return (
                          <div 
                            key={notif.id}
                            className={`p-5 flex items-start gap-4 transition-colors relative group ${style.bg} ${
                              notif.read ? 'opacity-70 saturate-50 bg-white' : ''
                            }`}
                          >
                          <div className="shrink-0 p-1.5 bg-white rounded-xl shadow-sm border border-slate-150">
                            {getNotificationIcon(notif.type)}
                          </div>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              {/* Glowing Dot for unread */}
                              {!notif.read && (
                                <span className={`w-1.5 h-1.5 rounded-full inline-block animate-pulse ${style.indicator}`} />
                              )}
                              <h5 className="text-[11px] font-black text-[#1a253d] uppercase tracking-tight leading-tight">
                                {notif.title}
                              </h5>
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black border uppercase tracking-wider scale-90 ${style.badge}`}>
                                {style.label}
                              </span>
                            </div>
                            <p className="text-[10px] font-semibold text-[#505f79] leading-relaxed">
                              {notif.message}
                            </p>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                              {formatTimeAgo(notif.timestamp)}
                            </span>
                          </div>

                          {/* Instant Actions hovered */}
                          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2.5 top-3 bg-white/90 p-1 rounded-xl shadow-md border border-slate-100 z-10">
                            {!notif.read && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="w-6 h-6 rounded-lg hover:bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors"
                                title="Mark as read"
                              >
                                <Check size={12} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notif.id)}
                              className="w-6 h-6 rounded-lg hover:bg-rose-50 text-rose-600 flex items-center justify-center transition-colors"
                              title="Delete notification"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Footer status bar */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex items-center justify-between text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  <span>SYSTEM FEED STATUS: ACTIVE</span>
                  <span>PREVIEW CLOUD INGRESS</span>
                </div>
              </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
