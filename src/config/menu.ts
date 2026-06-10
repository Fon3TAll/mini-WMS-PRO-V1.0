import { 
  LayoutDashboard,
  BrainCircuit,
  Calendar,
  Users,
  Briefcase,
  Heart,
  AlertTriangle,
  Clock,
  CalendarDays,
  Banknote,
  Award,
  UserPlus,
  CheckSquare,
  Target,
  Network,
  GraduationCap,
  PieChart,
  Settings,
  Scale,
  Shield,
  FileSearch,
  FolderOpen,
  MessageSquare,
  ClipboardList,
  BookOpen,
  Package,
  Box,
  Truck,
  Database,
  Store,
  ShoppingCart,
  Warehouse,
  FileText,
  Receipt,
  Percent
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path?: string;
  name: string;
  icon?: any;
  isConfidential?: boolean;
  category?: string;
  subItems?: { id: string; name: string; path: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  // Top Level
  { id: 'dashboard', path: '/', name: 'ระบบงานคลังสินค้าหลัก', icon: LayoutDashboard, category: 'TOP' },
  { id: 'calendar', path: '/law-calendar', name: 'ปฏิทินงาน', icon: Calendar, category: 'TOP' },
  { id: 'company_regulations', path: '/company-regulations', name: 'ข้อบังคับบริษัท', icon: BookOpen, category: 'TOP' },
  
  // [หมวดที่ 1] ฝ่ายขาย (SALE)
  { 
    id: 'sale_order_mgmt', 
    name: 'จัดการใบสั่งขาย', 
    icon: ShoppingCart, 
    category: 'ฝ่ายขาย',
    subItems: [
      { id: 'branch_so', name: 'ข้อมูลออเดอร์', path: '/buy-sell/branch-so' },
      { id: 'promotion_allocation', name: 'สถานะการส่งมอบ', path: '/buy-sell/promotion-allocation' }
    ]
  },

  // [หมวดที่ 2] คลังสินค้าสำเร็จรูป & WIP (Finished Goods System)
  { 
    id: 'fg_production_mgmt', 
    name: 'รับมอบจากการผลิต', 
    icon: Package, 
    category: 'คลังสินค้าสำเร็จรูป & WIP',
    subItems: [
      { id: 'production_delivery', name: 'ส่งสินค้าเข้าคลัง', path: '/inbound/production-delivery' }
    ]
  },
  { 
    id: 'fg_inbound', 
    name: 'รับสินค้าเข้า', 
    icon: ClipboardList, 
    category: 'คลังสินค้าสำเร็จรูป & WIP',
    subItems: [
      { id: 'goods_receipt', name: 'รับสินค้าเข้าคลังสำเร็จรูป', path: '/inbound/goods-receipt' },
      { id: 'dock_scheduling', name: 'จองคิวเข้าท่าเทียบรถ', path: '/inbound/dock-scheduling' },
      { id: 'smart_putaway', name: 'หาตำแหน่งจัดเก็บ', path: '/inbound/smart-putaway' },
      { id: 'fg_reservation_sync', name: 'ซิงค์คิวจองอัตโนมัติ', path: '/inbound/fg-reservation-sync' }
    ]
  },
  { 
    id: 'fg_outbound', 
    name: 'จ่ายสินค้าออก', 
    icon: Box, 
    category: 'คลังสินค้าสำเร็จรูป & WIP',
    subItems: [
      { id: 'wave_planning', name: 'วางแผนการจ่ายสินค้า', path: '/outbound/wave-planning' },
      { id: 'order_picking', name: 'สแกนหยิบสินค้า', path: '/outbound/order-picking' },
      { id: 'packing_sorting', name: 'แพ็คสินค้าและคัดแยก', path: '/outbound/packing-sorting' },
      { id: 'dispatch_loading', name: 'ตรวจปล่อยรถจัดส่ง', path: '/outbound/dispatch-loading' },
      { id: 'vehicle_inspection', name: 'ตรวจสอบสภาพรถ', path: '/transport/vehicle-master' }
    ]
  },
  { 
    id: 'fg_inventory_section', 
    name: 'สต๊อกสินค้าคงคลัง', 
    icon: Database, 
    category: 'คลังสินค้าสำเร็จรูป & WIP',
    subItems: [
      { id: 'stock_dashboard', name: 'สต๊อกสินค้าสำเร็จรูป', path: '/inventory/stock-dashboard' },
      { id: 'cycle_count', name: 'สุ่มตรวจนับสต๊อก', path: '/inventory/cycle-count' },
      { id: 'zone_slotting', name: 'ผังและโซนที่เก็บ', path: '/inventory/zone-slotting' },
      { id: 'replenishment', name: 'การเติมสต๊อก', path: '/inventory/replenishment' }
    ]
  },
  { 
    id: 'fg_reports', 
    name: 'รายงานคลังสินค้า', 
    icon: FileText, 
    category: 'คลังสินค้าสำเร็จรูป & WIP',
    subItems: [
      { id: 'fg_report_in', name: 'รายงานรับเข้าสินค้า', path: '/reports/fg-inbound' },
      { id: 'fg_report_out', name: 'รายงานการจ่ายสินค้าออก', path: '/reports/fg-outbound' },
      { id: 'fg_report_stock', name: 'รายงานคงคลังสุทธิประจำวัน', path: '/reports/fg-stock' }
    ]
  },

  // [หมวดที่ 3] คลังวัตถุดิบและวัสดุภายใน (Raw Materials & Spares System)
  { 
    id: 'rm_incoming_inspection', 
    name: 'ตรวจสอบคุณภาพวัตถุดิบ', 
    icon: Shield, 
    category: 'คลังวัตถุดิบ & วัสดุภายใน',
    subItems: [
      { id: 'raw_materials_qc', name: 'ผลตรวจคุณภาพวัตถุดิบ', path: '/inventory/raw-materials-qc' },
      { id: 'rm_alerts', name: 'ระบบแจ้งปัญหาวัตถุดิบ', path: '/inventory/raw-materials-alerts' }
    ]
  },
  { 
    id: 'rm_inbound', 
    name: 'รับวัตถุดิบเข้า', 
    icon: Warehouse, 
    category: 'คลังวัตถุดิบ & วัสดุภายใน',
    subItems: [
      { id: 'rm_goods_receipt', name: 'ตรวจรับวัตถุดิบ', path: '/inbound/rm-goods-receipt' },
      { id: 'rm_dock_scheduling', name: 'จองคิวรถส่งวัตถุดิบ', path: '/inbound/rm-dock-scheduling' },
      { id: 'rm_smart_putaway', name: 'จัดเก็บเข้าตู้', path: '/inbound/rm-smart-putaway' },
      { id: 'rm_reservation', name: 'ล็อกสต๊อกอัตโนมัติ', path: '/inbound/rm-reservation' }
    ]
  },
  { 
    id: 'rm_outbound', 
    name: 'เบิกจ่ายวัตถุดิบ', 
    icon: Box, 
    category: 'คลังวัตถุดิบ & วัสดุภายใน',
    subItems: [
      { id: 'rm_wave_planning', name: 'จัดการใบเบิกโรงงาน', path: '/outbound/rm-wave-planning' },
      { id: 'rm_order_picking', name: 'สแกนจ่ายใช้', path: '/outbound/rm-order-picking' },
      { id: 'rm_packing', name: 'เตรียมจัดเข้าชุด', path: '/outbound/rm-packing-sorting' },
      { id: 'rm_dispatch', name: 'นำจ่ายฝ่ายผลิต', path: '/outbound/rm-dispatch-loading' }
    ]
  },
  { 
    id: 'rm_inventory_section', 
    name: 'สต๊อกวัตถุดิบ', 
    icon: Database, 
    category: 'คลังวัตถุดิบ & วัสดุภายใน',
    subItems: [
      { id: 'raw_materials_list', name: 'สต๊อกวัตถุดิบทั้งหมด', path: '/inventory/raw-materials' },
      { id: 'rm_cycle_count', name: 'สุ่มตรวจคุณภาพบรรจุภัณฑ์', path: '/inventory/rm-cycle-count' },
      { id: 'rm_slotting', name: 'ผังวางสารเคมีและวัตถุดิบ', path: '/inventory/rm-zone-slotting' },
      { id: 'rm_replenishment', name: 'เติมวัสดุใกล้หมด', path: '/inventory/rm-replenishment' }
    ]
  },
  { 
    id: 'rm_reports', 
    name: 'รายงานวัตถุดิบ', 
    icon: FileText, 
    category: 'คลังวัตถุดิบ & วัสดุภายใน',
    subItems: [
      { id: 'rm_report_in', name: 'รายงานรับเข้าวัตถุดิบเคมี', path: '/reports/rm-inbound' },
      { id: 'rm_report_out', name: 'รายงานเบิกจ่ายผลิต', path: '/reports/rm-outbound' },
      { id: 'rm_report_stock', name: 'รายงานสต๊อกเตือนวิกฤต', path: '/reports/rm-stock' }
    ]
  },

  // [หมวดที่ 4] ฝ่ายจัดซื้อ
  { 
    id: 'purchasing_mgmt', 
    name: 'จัดการระบบจัดซื้อ', 
    icon: Store, 
    category: 'ฝ่ายจัดซื้อ',
    subItems: [
      { id: 'vendor_po', name: 'ติดตามใบสั่งซื้อ', path: '/buy-sell/vendor-po' }
    ]
  },

  // [หมวดที่ 5] ฝ่ายบัญชีและการเงินพันธมิตร (Accounts Integration Bridge - AP/AR)
  { 
    id: 'accounts_bridge', 
    name: 'ระบบเชื่อมต่อบัญชี', 
    icon: Receipt, 
    category: 'บัญชีและการเงิน',
    subItems: [
      { id: 'ar_invoice', name: 'บัญชีลูกหนี้', path: '/accounts/ar-invoice' },
      { id: 'ap_ledger', name: 'บัญชีเจ้าหนี้', path: '/accounts/ap-ledger' }
    ]
  },

  // [หมวดที่ 6] ประเมินระบบประเด็นความเสี่ยง (AI Copilot & Predictive Analytics)
  { 
    id: 'ai_copilot_predictive', 
    name: 'พยากรณ์อัจฉริยะด้วยรูปแบบ AI', 
    icon: BrainCircuit, 
    category: 'ประเมินความเสี่ยงอัจฉริยะ',
    subItems: [
      { id: 'ai_copilot', name: 'ระบบผู้ช่วยพยากรณ์สต๊อก', path: '/copilot' }
    ]
  },

  // LOGISTICS & BACK OFFICE
  { 
    id: 'transport_fleet', 
    name: 'โลจิสติกส์และการจัดส่ง', 
    icon: Truck, 
    category: 'โลจิสติกส์และระบบหลังบ้าน',
    subItems: [
      { id: 'route_optimization', name: 'วางแผนเส้นทางที่ดีที่สุด', path: '/transport/route-optimization' },
      { id: 'electronic_pod', name: 'ยืนยันใบส่งของอิเล็กทรอนิกส์', path: '/transport/electronic-pod' },
      { id: 'vehicle_master', name: 'ประวัติและข้อมูลยานพาหนะ', path: '/transport/vehicle-master' }
    ]
  },
  { 
    id: 'master_data', 
    name: 'จัดการข้อมูลหลักฐาน', 
    icon: Database, 
    category: 'โลจิสติกส์และระบบหลังบ้าน',
    subItems: [
      { id: 'sku_master', name: 'รูปแบบรหัสสินค้ามาตรฐาน', path: '/master-data/sku-master' },
      { id: 'location_map', name: 'แผนผังพื้นที่ในคลัง', path: '/master-data/location-map' },
      { id: 'vendor_branch_info', name: 'ข้อมูลบริษัทคู่ค้าและสาขา', path: '/master-data/vendor-branch-info' }
    ]
  },

  // ADMINISTRATION
  { 
    id: 'system_settings', 
    name: 'ระบบการตั้งค่าพื้นฐาน', 
    icon: Settings, 
    category: 'การตั้งค่าระบบ',
    subItems: [
      { id: 'user_permission', name: 'จัดการสิทธิ์ให้ผู้ใช้งาน', path: '/permissions' },
      { id: 'system_config', name: 'ตั้งค่าการดำเนินงาน', path: '/settings' },
      { id: 'dev_logs', name: 'บันทึกข้อมูลแบบเรียลไทม์', path: '/dev-logs' }
    ]
  }
];

