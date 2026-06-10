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
  BookOpen
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
  { id: 'dashboard', path: '/', name: 'LIBRARY HOME', icon: LayoutDashboard, category: 'TOP' },
  { id: 'copilot', path: '/copilot', name: 'IN-HOUSE COUNSEL', icon: BrainCircuit, category: 'TOP' },
  { id: 'law_summarizer', path: '/law-summarizer', name: 'AI LAW SUMMARIZER', icon: BookOpen, category: 'TOP' },
  { id: 'law_calendar', path: '/law-calendar', name: 'LAW CALENDAR', icon: Calendar, category: 'TOP' },
  
  // LEGAL COLLECTIONS
  { 
    id: 'legal_collections_master', 
    name: 'LEGAL COLLECTIONS', 
    icon: Scale, 
    category: 'LEGAL COLLECTIONS',
    subItems: [
      { id: 'law_labor', name: 'LABOR LAWS', path: '/laws/labor' },
      { id: 'law_safety', name: 'SAFETY LAWS', path: '/laws/safety' },
      { id: 'law_env', name: 'ENVIRONMENT LAWS', path: '/laws/environment' },
      { id: 'law_food', name: 'FOOD LAWS', path: '/laws/food' },
      { id: 'law_energy', name: 'ENERGY LAWS', path: '/laws/energy' },
      { id: 'law_tax', name: 'TAX LAWS', path: '/laws/tax' },
      { id: 'law_import_export', name: 'IMPORT & EXPORT LAWS', path: '/laws/import-export' },
      { id: 'law_other', name: 'OTHER LAWS', path: '/laws/other' }
    ]
  },

  // COMPLIANCE & ACTIONS
  { 
    id: 'compliance_review', 
    name: 'COMPLIANCE REVIEW', 
    icon: FileSearch, 
    category: 'COMPLIANCE & ACTIONS',
    subItems: [
      { id: 'review_iso14001', name: 'ISO 14001 REVIEW', path: '/compliance/iso14001' },
      { id: 'review_iso45001', name: 'ISO 45001 REVIEW', path: '/compliance/iso45001' },
      { id: 'review_other', name: 'OTHER REGULATORY REVIEW', path: '/compliance/other' }
    ]
  },
  { 
    id: 'legal_evidence', 
    name: 'LEGAL EVIDENCE & RECORDS', 
    icon: FolderOpen, 
    category: 'COMPLIANCE & ACTIONS',
    subItems: [
      { id: 'evidence_log', name: 'EVIDENCE LOG', path: '/evidence/log' },
      { id: 'evidence_submission', name: 'SUBMIT EVIDENCE', path: '/evidence/submission' }
    ]
  },
  { 
    id: 'action_plans', 
    name: 'TASK & COMMUNICATION', 
    icon: ClipboardList, 
    category: 'COMPLIANCE & ACTIONS',
    subItems: [
      { id: 'task_board', name: 'LEGAL ACTION PLANS', path: '/tasks/board' },
      { id: 'task_assignments', name: 'MY ASSIGNMENTS', path: '/tasks/assignments' }
    ]
  },

  // DISPUTES & COMPLAINTS
  { 
    id: 'disputes_complaints', 
    name: 'DISPUTES & COMPLAINTS', 
    icon: MessageSquare, 
    category: 'DISPUTES & COMPLAINTS',
    subItems: [
      { id: 'complaint_log', name: 'COMPLAINT RECORDS', path: '/complaints/log' },
      { id: 'complaint_tracking', name: 'CASE TRACKING', path: '/complaints/tracking' }
    ]
  },

  // ADMINISTRATION
  { 
    id: 'user_permission', 
    name: 'USER PERMISSION', 
    icon: Users, 
    category: 'ADMINISTRATION',
    path: '/permissions'
  },
  { 
    id: 'system_config', 
    name: 'SYSTEM CONFIG', 
    icon: Settings, 
    category: 'ADMINISTRATION',
    path: '/settings'
  },
  { 
    id: 'dev_permit', 
    name: 'DEV PERMIT BETA', 
    icon: Shield, 
    category: 'ADMINISTRATION',
    path: '/dev-permit'
  },
  { 
    id: 'dev_logs', 
    name: 'SYSTEM LOGS', 
    icon: FileSearch, 
    category: 'ADMINISTRATION',
    path: '/dev-logs'
  }
];
