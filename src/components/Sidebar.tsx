import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Library,
  Shield,
  Scale
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';
import { useVisibility } from '../context/ModuleVisibilityContext';
import { useLanguage } from '../context/LanguageContext';
import { MENU_ITEMS, MenuItem } from '../config/menu';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const CATEGORIES = [
  'ฝ่ายขาย',
  'คลังสินค้าสำเร็จรูป & WIP',
  'คลังวัตถุดิบ & วัสดุภายใน',
  'ฝ่ายจัดซื้อ',
  'บัญชีและการเงิน',
  'ประเมินความเสี่ยงอัจฉริยะ',
  'โลจิสติกส์และระบบหลังบ้าน',
  'การตั้งค่าระบบ'
];

const CATEGORY_TRANSLATIONS: Record<string, { th: string; en: string }> = {
  'ฝ่ายขาย': { th: 'ฝ่ายขาย', en: 'Sales & Distribution' },
  'คลังสินค้าสำเร็จรูป & WIP': { th: 'คลังสินค้าสำเร็จรูป & WIP', en: 'Finished Goods & WIP' },
  'คลังวัตถุดิบ & วัสดุภายใน': { th: 'คลังวัตถุดิบ & วัสดุภายใน', en: 'Raw Materials & Spares' },
  'ฝ่ายจัดซื้อ': { th: 'ฝ่ายจัดซื้อ', en: 'Purchasing Department' },
  'บัญชีและการเงิน': { th: 'บัญชีและการเงิน', en: 'Accounting & Finance' },
  'ประเมินความเสี่ยงอัจฉริยะ': { th: 'ประเมินความเสี่ยงอัจฉริยะ', en: 'Smart Risk Assessment' },
  'โลจิสติกส์และระบบหลังบ้าน': { th: 'โลจิสติกส์และระบบหลังบ้าน', en: 'Logistics & Infrastructure' },
  'การตั้งค่าระบบ': { th: 'การตั้งค่าระบบ', en: 'System Settings' }
};

const SIDEBAR_TRANSLATIONS: Record<string, { th: string; en: string }> = {
  'dashboard': { th: 'ระบบงานคลังสินค้าหลัก', en: 'Core WMS Dashboard' },
  'calendar': { th: 'ปฏิทินงาน', en: 'Operations Calendar' },
  'sale_order_mgmt': { th: 'จัดการใบสั่งขาย', en: 'Sales Order Mgmt' },
  'branch_so': { th: 'ข้อมูลออเดอร์', en: 'Order Records' },
  'promotion_allocation': { th: 'สถานะการส่งมอบ', en: 'Delivery Status' },
  'fg_production_mgmt': { th: 'รับมอบจากการผลิต', en: 'Production Inflow' },
  'production_delivery': { th: 'ส่งสินค้าเข้าคลัง', en: 'Deliver FG to Warehouse' },
  'fg_inbound': { th: 'รับสินค้าเข้า', en: 'Goods Inward' },
  'goods_receipt': { th: 'รับสินค้าเข้าคลังสำเร็จรูป', en: 'FG Goods Receipt' },
  'dock_scheduling': { th: 'จองคิวเข้าท่าเทียบรถ', en: 'Dock Scheduling' },
  'smart_putaway': { th: 'หาตำแหน่งจัดเก็บ', en: 'Smart Putaway' },
  'fg_reservation_sync': { th: 'ซิงค์คิวจองอัตโนมัติ', en: 'Auto Reservation Sync' },
  'fg_outbound': { th: 'จ่ายสินค้าออก', en: 'Goods Outward' },
  'wave_planning': { th: 'วางแผนการจ่ายสินค้า', en: 'Wave Planning' },
  'order_picking': { th: 'สแกนหยิบสินค้า', en: 'Barcode Order Picking' },
  'packing_sorting': { th: 'แพ็คสินค้าและคัดแยก', en: 'Packing & Sorting' },
  'dispatch_loading': { th: 'ตรวจปล่อยรถจัดส่ง', en: 'Dispatch & Loading' },
  'vehicle_inspection': { th: 'ตรวจสอบสภาพรถ', en: 'Vehicle Fleet Registry' },
  'fg_inventory_section': { th: 'สต๊อกสินค้าคงคลัง', en: 'Inventory Control' },
  'stock_dashboard': { th: 'สต๊อกสินค้าสำเร็จรูป', en: 'Finished Goods Stock' },
  'cycle_count': { th: 'สุ่มตรวจนับสต๊อก', en: 'Cycle Counting' },
  'zone_slotting': { th: 'ผังและโซนที่เก็บ', en: 'Zone & Slotting Opt' },
  'replenishment': { th: 'การเติมสต๊อก', en: 'Stock Replenishment' },
  'fg_reports': { th: 'รายงานคลังสินค้า', en: 'WMS Reports' },
  'fg_report_in': { th: 'รายงานรับเข้าสินค้า', en: 'Finished Goods Inbound Report' },
  'fg_report_out': { th: 'รายงานการจ่ายสินค้าออก', en: 'Finished Goods Outbound Report' },
  'fg_report_stock': { th: 'รายงานคงคลังสุทธิประจำวัน', en: 'Daily Stock Net Balance' },
  'rm_incoming_inspection': { th: 'ตรวจสอบคุณภาพวัตถุดิบ', en: 'RM Incoming QC' },
  'raw_materials_qc': { th: 'ผลตรวจคุณภาพวัตถุดิบ', en: 'Material Inspection Logs' },
  'rm_alerts': { th: 'ระบบแจ้งปัญหาวัตถุดิบ', en: 'Quality Issues Reporting' },
  'rm_inbound': { th: 'รับวัตถุดิบเข้า', en: 'Inbound Raw Materials' },
  'rm_goods_receipt': { th: 'ตรวจรับวัตถุดิบ', en: 'RM Goods Receipt' },
  'rm_dock_scheduling': { th: 'จองคิวรถส่งวัตถุดิบ', en: 'RM Dock Scheduling' },
  'rm_smart_putaway': { th: 'จัดเก็บเข้าตู้', en: 'Raw Material Smart Storage' },
  'rm_reservation': { th: 'ล็อกสต๊อกอัตโนมัติ', en: 'Auto Reservation Sync RM' },
  'rm_outbound': { th: 'เบิกจ่ายวัตถุดิบ', en: 'RM Issue & Picking' },
  'rm_wave_planning': { th: 'จัดการใบเบิกโรงงาน', en: 'Issue Wave Planning' },
  'rm_order_picking': { th: 'สแกนจ่ายใช้', en: 'Barcode Material Issuing' },
  'rm_packing': { th: 'เตรียมจัดเข้าชุด', en: 'Material Packing & Kitting' },
  'rm_dispatch': { th: 'นำจ่ายฝ่ายผลิต', en: 'Dispatch to Production' },
  'rm_inventory_section': { th: 'สต๊อกวัตถุดิบ', en: 'RM Inventory & Spares' },
  'raw_materials_list': { th: 'สต๊อกวัตถุดิบทั้งหมด', en: 'Raw Material Stocks' },
  'rm_cycle_count': { th: 'สุ่มตรวจคุณภาพบรรจุภัณฑ์', en: 'Cycle Count Packaging' },
  'rm_slotting': { th: 'ผังวางสารเคมีและวัตถุดิบ', en: 'Hazardous Chemical Mapping' },
  'rm_replenishment': { th: 'เติมวัสดุใกล้หมด', en: 'Spares Replenishment' },
  'rm_reports': { th: 'รายงานวัตถุดิบ', en: 'Material Reports' },
  'rm_report_in': { th: 'รายงานรับเข้าวัตถุดิบเคมี', en: 'Raw Material Inflow Report' },
  'rm_report_out': { th: 'รายงานเบิกจ่ายผลิต', en: 'Production Picking History' },
  'rm_report_stock': { th: 'รายงานสต๊อกเตือนวิกฤต', en: 'Critical Material Outages' },
  'purchasing_mgmt': { th: 'จัดการระบบจัดซื้อ', en: 'Purchase Department' },
  'vendor_po': { th: 'ติดตามใบสั่งซื้อ', en: 'Supplier Purchase Orders' },
  'accounts_bridge': { th: 'ระบบเชื่อมต่อบัญชี', en: 'Accounts Bridge (AP/AR)' },
  'ar_invoice': { th: 'บัญชีลูกหนี้', en: 'Accounts Receivable (AR)' },
  'ap_ledger': { th: 'บัญชีเจ้าหนี้', en: 'Accounts Payable (AP)' },
  'ai_copilot_predictive': { th: 'พยากรณ์อัจฉริยะด้วยรูปแบบ AI', en: 'Predictive Machine Learning' },
  'ai_copilot': { th: 'ระบบผู้ช่วยพยากรณ์สต๊อก', en: 'AI Inventory Copilot' },
  'transport_fleet': { th: 'โลจิสติกส์และการจัดส่ง', en: 'Logistics & Distribution' },
  'route_optimization': { th: 'วางแผนเส้นทางที่ดีที่สุด', en: 'Dijkstra Route Optimization' },
  'electronic_pod': { th: 'ยืนยันใบส่งของอิเล็กทรอนิกส์', en: 'Electronic Proof-of-Delivery' },
  'vehicle_master': { th: 'ประวัติและข้อมูลยานพาหนะ', en: 'Fleet & Vehicle Registry' },
  'master_data': { th: 'จัดการข้อมูลหลักฐาน', en: 'Master Data Services' },
  'sku_master': { th: 'รูปแบบรหัสสินค้ามาตรฐาน', en: 'SKU & Code Standardization' },
  'location_map': { th: 'แผนผังพื้นที่ในคลัง', en: 'Interactive Location Maps' },
  'vendor_branch_info': { th: 'ข้อมูลบริษัทคู่ค้าและสาขา', en: 'Suppliers & Branches Portals' },
  'system_settings': { th: 'ระบบการตั้งค่าพื้นฐาน', en: 'Administration Panel' },
  'user_permission': { th: 'จัดการสิทธิ์ให้ผู้ใช้งาน', en: 'User Role Permissions' },
  'system_config': { th: 'ตั้งค่าการดำเนินงาน', en: 'System Operations Setup' },
  'dev_logs': { th: 'บันทึกข้อมูลแบบเรียลไทม์', en: 'WMS Real-time Logs' },
};

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const { visibility } = useVisibility();
  const { language, t } = useLanguage();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const translateCategory = (catName: string) => {
    const tr = CATEGORY_TRANSLATIONS[catName];
    return tr ? (language === 'th' ? tr.th : tr.en) : catName;
  };

  const translateItem = (name: string, id: string) => {
    const tr = SIDEBAR_TRANSLATIONS[id];
    return tr ? (language === 'th' ? tr.th : tr.en) : name;
  };

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsCollapsed]);

  // Determine if a parent should be active based on current path and its subitems
  const isItemActive = (item: MenuItem) => {
    if (item.path && location.pathname === item.path) return true;
    if (item.subItems) {
      return item.subItems.some(sub => sub.path && location.pathname === sub.path);
    }
    return false;
  };

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (isCollapsed) return; // Don't allow expanding when collapsed
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // When expanding sidebar, maybe show active parents
  useEffect(() => {
    if (!isCollapsed) {
      const newExpanded = { ...expandedItems };
      MENU_ITEMS.forEach(item => {
        if (isItemActive(item) && item.subItems) {
          newExpanded[item.id] = true;
        }
      });
      setExpandedItems(newExpanded);
    }
  }, [location.pathname, isCollapsed]); // Only recompute on significant changes

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 300 }}
      className="relative flex h-screen flex-col bg-gradient-to-b from-[#1d2636] to-[#0F172A] shadow-2xl z-20 custom-scrollbar font-technical"
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-8 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-[#212c46] text-[#b58c4f] shadow-lg border border-[#b58c4f]/20 hover:bg-[#b58c4f] hover:text-[#212c46] hover:shadow-[0_0_15px_rgba(181,140,79,0.5)] transition-all focus:outline-none active:scale-95"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Logo Area */}
      <div className="flex h-24 items-center justify-start px-6 shrink-0">
        <div className="flex items-center gap-3 pr-2">
          <div className="relative flex h-10 w-10 items-center justify-center transition-transform duration-500 hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] shrink-0">
            <svg viewBox="12 22 78 70" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Building Base */}
              <path d="M 12 40 L 45 22 L 90 40 L 90 92 L 12 92 Z" fill="#1e3557" />
              {/* White Door */}
              <path d="M 45 36 L 82 48 L 82 92 L 45 92 Z" fill="#ffffff" />
              {/* Red Stripes */}
              <path d="M 45 36 L 82 48.0 L 82 54.1 L 45 44 Z" fill="#e63946" />
              <path d="M 45 52 L 82 60.4 L 82 66.7 L 45 60 Z" fill="#e63946" />
              <path d="M 45 68 L 82 73.0 L 82 79.4 L 45 76 Z" fill="#e63946" />
              <path d="M 45 84 L 82 85.7 L 82 92.0 L 45 92 Z" fill="#e63946" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-[4px] text-[24px] font-black tracking-tighter font-exception-system transform scale-x-105 origin-left leading-none" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                <span className="text-white">SMART</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5b73b] to-[#ad2b10]">WMS</span>
              </div>
              <div className="flex items-center mt-2 group" style={{ fontFamily: "'Inter', sans-serif" }}>
                <div className="w-3 h-[2px] bg-gradient-to-r from-[#ad2b10] to-transparent mr-2" />
                <span className="text-[9px] font-bold text-[#7a8b95] group-hover:text-[#ad2b10] transition-colors tracking-[0.2em] uppercase leading-none drop-shadow-md">
                  WAREHOUSE MANAGEMENT
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 space-y-6 sidebar-scrollbar">
        
        {/* TOP LEVEL BUTTONS */}
        <div className="space-y-2">
          {MENU_ITEMS.filter(item => item.category === 'TOP' && visibility[item.id] !== false).map(item => {
            const Icon = item.icon || LayoutDashboard;
            const active = isItemActive(item);
            const translatedName = translateItem(item.name, item.id);
            return (
              <NavLink
                key={item.id}
                to={item.path || '/'}
                className={twMerge(clsx(
                  "group flex items-center rounded-xl px-4 py-3 text-[13px] font-black uppercase tracking-widest transition-all",
                  active
                    ? "bg-gradient-to-r from-[#922724] to-[#ad2b10] text-[#e5b73b] shadow-md shadow-[#922724]/20" 
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                  isCollapsed && "justify-center px-0"
                ))}
                title={isCollapsed ? translatedName : undefined}
              >
                <Icon size={18} className={clsx("shrink-0", isCollapsed ? "mr-0" : "mr-4")} />
                {!isCollapsed && <span>{translatedName}</span>}
              </NavLink>
            );
          })}
        </div>

        {/* Categories Level */}
        {CATEGORIES.map(catName => {
          const catItems = MENU_ITEMS.filter(item => item.category === catName && visibility[item.id] !== false);
          if (catItems.length === 0) return null;

          const translatedCatName = translateCategory(catName);

          return (
            <div key={catName} className="space-y-2">
              {!isCollapsed && (
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 px-2 tracking-widest">
                  {translatedCatName}
                </h3>
              )}
              <div className="space-y-2">
                {catItems.map((item) => {
                  const Icon = item.icon || Users;
                  const active = isItemActive(item);
                  const isExpanded = !!expandedItems[item.id] && !isCollapsed;
                  
                  const visibleSubItems = item.subItems?.filter(s => visibility[s.id] !== false) || [];
                  const translatedItemName = translateItem(item.name, item.id);

                  return (
                    <div key={item.id} className="flex flex-col">
                      {/* Parent Item */}
                      {visibleSubItems.length > 0 ? (
                        <div
                          onClick={(e) => toggleExpand(item.id, e)}
                          className={twMerge(clsx(
                            "cursor-pointer group flex items-center rounded-xl px-4 py-3 text-[12px] font-bold uppercase tracking-widest transition-all",
                            active 
                              ? "text-white bg-white/5" 
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                            isCollapsed && "justify-center px-0"
                          ))}
                          title={isCollapsed ? translatedItemName : undefined}
                        >
                          <Icon size={16} className={clsx("shrink-0", "text-slate-400 group-hover:text-white", isCollapsed ? "mr-0" : "mr-4", active && "text-white")} />
                          
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate">{translatedItemName}</span>
                              <div className="w-5 h-5 flex items-center justify-center">
                                {isExpanded ? <ChevronUp size={14} className={active ? "text-white/80" : "text-slate-500"} /> : <ChevronDown size={14} className={active ? "text-white/80" : "text-slate-500"} />}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <NavLink
                          to={item.path || '/'}
                          className={twMerge(clsx(
                            "group flex items-center rounded-xl px-4 py-3 text-[12px] font-bold uppercase tracking-widest transition-all",
                            active 
                              ? "bg-gradient-to-r from-[#922724] to-[#ad2b10] text-[#e5b73b] shadow-md shadow-[#922724]/20" 
                              : "text-slate-300 hover:bg-white/5 hover:text-white",
                            isCollapsed && "justify-center px-0"
                          ))}
                          title={isCollapsed ? translatedItemName : undefined}
                        >
                          <Icon size={16} className={clsx("shrink-0", "text-slate-400 group-hover:text-white", isCollapsed ? "mr-0" : "mr-4", active && "text-white")} />
                          {!isCollapsed && <span className="flex-1 truncate">{translatedItemName}</span>}
                        </NavLink>
                      )}

                      {/* Sub Items */}
                      <AnimatePresence>
                        {isExpanded && visibleSubItems.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-col overflow-hidden ml-9 mt-1 space-y-1.5 text-slate-400"
                          >
                            <div className="pt-1 pb-2 flex flex-col space-y-1.5">
                              {visibleSubItems.map((subItem) => {
                                const translatedSubName = translateItem(subItem.name, subItem.id);
                                return (
                                  <NavLink
                                    key={subItem.id}
                                    to={subItem.path}
                                    className={({ isActive }) => twMerge(clsx(
                                      "group flex items-center gap-3 py-2 px-3 rounded-lg text-[11px] font-bold uppercase transition-all tracking-[0.05em]",
                                      isActive 
                                        ? "bg-gradient-to-r from-[#922724] to-[#ad2b10] text-[#e5b73b] shadow-md shadow-[#922724]/20" 
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    ))}
                                  >
                                    {({ isActive }) => (
                                      <>
                                        <div className={twMerge(clsx(
                                          "w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300",
                                          isActive ? "bg-white scale-110 shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "bg-[#b58c4f] group-hover:scale-125"
                                        ))} />
                                        <span className="truncate">{translatedSubName}</span>
                                      </>
                                    )}
                                  </NavLink>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Actual User Profile Area */}
      {user && (
        <div className="p-4 shrink-0">
          <div className={clsx("flex items-center justify-between", isCollapsed ? "justify-center" : "gap-3")}>
            <div className="flex items-center gap-3 overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-[#b58c4f]/40"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[#3f809e] to-[#4d87a8] text-white font-black uppercase text-[16px]">
                  {user.name.charAt(0)}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="truncate text-[12px] font-black text-white uppercase tracking-widest">{user.name}</span>
                  <span className="truncate text-[9px] text-[#b58c4f] font-black uppercase tracking-[0.1em] mt-0.5">{user.role || 'LEAD DEVELOPER'}</span>
                  <span className="truncate text-[9px] text-slate-500 font-medium tracking-tight mt-0.5">{user.email || 'tallintelligence.dcc@gmail.com'}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <button 
                onClick={logout} 
                className="p-2 text-slate-400 hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded-lg transition-colors shrink-0" 
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
          {isCollapsed && (
            <button 
              onClick={logout} 
              className="mt-4 w-full flex justify-center p-2 text-slate-400 hover:text-[#932c2e] hover:bg-[#932c2e]/10 rounded-lg transition-colors" 
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      )}

    </motion.aside>
  );
}

