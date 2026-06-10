import React, { useState, useEffect, useMemo } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../../components/shared/DraggableModal';

// --- Theme Synced with Premium Suite ---
const THEME = {
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
  coolGray: '#eaeaec'
};

export interface RMItem {
  id: string;
  sku: string;
  name: string;
  category: 'Ingredient' | 'Packaging' | 'Chemical' | 'Spare Part';
  quantity: number;
  unit: string;
  lotNo: string;
  status: 'Waiting for QC' | 'Ready for Production' | 'Issued to Floor';
  priority: 'High' | 'Normal' | 'Low';
  zone: string;
  updatedAt: string;
  qcPassed: boolean | null; // null = pending inspection, true = passed, false = failed/hold
  operator: string;
  notes: string;
}

const DEFAULT_ITEMS: RMItem[] = [
  {
    id: 'MOVE-101',
    sku: 'RM-ING-109',
    name: 'Premium Vanillin Crystals Extra-Pure',
    category: 'Ingredient',
    quantity: 500,
    unit: 'Kg',
    lotNo: 'LOT-VAN-2605',
    status: 'Waiting for QC',
    priority: 'High',
    zone: 'RM-ZONE-B',
    updatedAt: '2026-06-05 10:15',
    qcPassed: null,
    operator: 'K. Somchai',
    notes: 'Urgent batch request from Mix Line 1. Awaiting sensory and chemical purity checks.'
  },
  {
    id: 'MOVE-102',
    sku: 'RM-CHEM-52',
    name: 'Concentrated Caustic Soda 98% (NoOH)',
    category: 'Chemical',
    quantity: 420,
    unit: 'Kg',
    lotNo: 'LOT-CS-990',
    status: 'Waiting for QC',
    priority: 'Normal',
    zone: 'RM-CHEM (Restricted)',
    updatedAt: '2026-06-05 08:30',
    qcPassed: null,
    operator: 'K. Sompon',
    notes: 'Sampled at dock 4. Verify NaOH concentration specs before releasing to mixing tanks.'
  },
  {
    id: 'MOVE-103',
    sku: 'RM-PKG-002',
    name: 'Aluminum Foil Pack Liner 30cm',
    category: 'Packaging',
    quantity: 3500,
    unit: 'Pcs',
    lotNo: 'LOT-PKG-88A',
    status: 'Ready for Production',
    priority: 'High',
    zone: 'RM-ZONE-A',
    updatedAt: '2026-06-04 15:40',
    qcPassed: true,
    operator: 'K. Wanna',
    notes: 'Pouch seal validation completed. Passed all visual thickness criteria.'
  },
  {
    id: 'MOVE-104',
    sku: 'RM-ING-101',
    name: 'Refined Fine-Grain Sugar Extra-Fine',
    category: 'Ingredient',
    quantity: 8500,
    unit: 'Kg',
    lotNo: 'LOT-SUG-445',
    status: 'Ready for Production',
    priority: 'Normal',
    zone: 'RM-ZONE-B',
    updatedAt: '2026-06-04 12:20',
    qcPassed: true,
    operator: 'K. Wanna',
    notes: 'Moisture content certified < 0.05%. Released for secondary blending.'
  },
  {
    id: 'MOVE-105',
    sku: 'RM-CHEM-50',
    name: 'Industrial Creamer Base Compound Z2',
    category: 'Chemical',
    quantity: 1200,
    unit: 'Liters',
    lotNo: 'LOT-CRM-Z2',
    status: 'Issued to Floor',
    priority: 'High',
    zone: 'RM-CHEM (Secure)',
    updatedAt: '2026-06-05 11:00',
    qcPassed: true,
    operator: 'K. Prasit',
    notes: 'Transferred safely via automated pumping manifold to Line C.'
  },
  {
    id: 'MOVE-106',
    sku: 'RM-PKG-005',
    name: 'Shrink-Wrap Thermal Film Roll 50cm',
    category: 'Packaging',
    quantity: 85,
    unit: 'Rolls',
    lotNo: 'LOT-SF-032',
    status: 'Issued to Floor',
    priority: 'Low',
    zone: 'RM-ZONE-A',
    updatedAt: '2026-06-05 09:12',
    qcPassed: true,
    operator: 'K. Anon',
    notes: 'Requisitioned by Packaging Area 4. Loaded on Forklift ForkIs-04.'
  }
];

export default function RMKanbanBoard() {
  // Persistence via localStorage
  const [items, setItems] = useState<RMItem[]>(() => {
    const saved = localStorage.getItem('RM_KANBAN_ITEMS');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ITEMS;
      }
    }
    return DEFAULT_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('RM_KANBAN_ITEMS', JSON.stringify(items));
  }, [items]);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isOverColumn, setIsOverColumn] = useState<string | null>(null);

  // Selected item detail modal
  const [selectedItem, setSelectedItem] = useState<RMItem | null>(null);
  const [isOpenDetail, setIsOpenDetail] = useState(false);

  // Form for adding new RM Item
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [newItemForm, setNewItemForm] = useState<Omit<RMItem, 'id' | 'updatedAt'>>({
    sku: 'RM-ING-',
    name: '',
    category: 'Ingredient',
    quantity: 100,
    unit: 'Kg',
    lotNo: 'LOT-',
    status: 'Waiting for QC',
    priority: 'Normal',
    zone: 'RM-ZONE-B',
    qcPassed: null,
    operator: 'K. Somchai',
    notes: ''
  });

  // Calculate statistics
  const totalItems = items.length;
  const qcWaitingCount = items.filter(i => i.status === 'Waiting for QC').length;
  const activeReadyCount = items.filter(i => i.status === 'Ready for Production').length;
  const activeIssuedCount = items.filter(i => i.status === 'Issued to Floor').length;

  const totalVolumeWaiting = useMemo(() => {
    return items
      .filter(i => i.status === 'Waiting for QC')
      .reduce((acc, current) => acc + current.quantity, 0);
  }, [items]);

  // Filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.lotNo.toLowerCase().includes(search.toLowerCase()) ||
        item.zone.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter === 'All' || item.category === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [items, search, categoryFilter]);

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: RMItem['status']) => {
    e.preventDefault();
    setIsOverColumn(status);
  };

  const handleDragLeave = () => {
    setIsOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: RMItem['status']) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (itemId) {
      updateItemStatus(itemId, newStatus);
    }
    setDraggedItemId(null);
    setIsOverColumn(null);
  };

  const updateItemStatus = (id: string, newStatus: RMItem['status']) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // Auto update QC release if turning to production layer
          let updatedQc = item.qcPassed;
          if (newStatus === 'Ready for Production' && item.qcPassed === null) {
            updatedQc = true; // Auto release
          }
          return {
            ...item,
            status: newStatus,
            qcPassed: updatedQc,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return item;
      })
    );
  };

  // Quick Action triggers
  const handleQCApproval = (id: string, approved: boolean) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus: RMItem['status'] = approved ? 'Ready for Production' : 'Waiting for QC';
          return {
            ...item,
            qcPassed: approved,
            status: nextStatus,
            notes: approved 
              ? `${item.notes}\n[Approved QC] Certified standard release.` 
              : `${item.notes}\n[QC Reject Hold] Checked failed standards. Returned for quarantine.`,
            updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
          };
        }
        return item;
      })
    );
    if (selectedItem?.id === id) {
      setSelectedItem(prev => prev ? { ...prev, qcPassed: approved, status: approved ? 'Ready for Production' : 'Waiting for QC' } : null);
    }
  };

  // Add Item Submit
  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `MOVE-${Math.floor(Math.random() * 900) + 100}`;
    const entry: RMItem = {
      ...newItemForm,
      id: newId,
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setItems(prev => [entry, ...prev]);
    setIsOpenAddModal(false);
    // Reset Form
    setNewItemForm({
      sku: 'RM-ING-',
      name: '',
      category: 'Ingredient',
      quantity: 100,
      unit: 'Kg',
      lotNo: 'LOT-',
      status: 'Waiting for QC',
      priority: 'Normal',
      zone: 'RM-ZONE-B',
      qcPassed: null,
      operator: 'K. Somchai',
      notes: ''
    });
  };

  // Modify Detail Card Submit
  const handleSaveDetailChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setItems(prev =>
      prev.map(i => (i.id === selectedItem.id ? {
        ...selectedItem,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      } : i))
    );
    setIsOpenDetail(false);
  };

  // Delete Card
  const handleDeleteItem = (id: string) => {
    if (confirm('คุณต้องการลบข้อมูลการเคลื่อนย้ายวัตถุดิบรายการนี้จาก Kanban ใช่หรือไม่?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      setIsOpenDetail(false);
      setSelectedItem(null);
    }
  };

  // Split Items into Columns
  const columns: { title: RMItem['status']; icon: string; bgHeader: string; color: string; desc: string }[] = [
    {
      title: 'Waiting for QC',
      icon: 'ShieldAlert',
      bgHeader: 'bg-[#932c2e]/10 border-[#932c2e]/20 text-[#932c2e]',
      color: THEME.danger,
      desc: 'ตรวจวัดประเมินความบริสุทธิ์เคมี'
    },
    {
      title: 'Ready for Production',
      icon: 'CheckCircle',
      bgHeader: 'bg-[#b58c4f]/10 border-[#b58c4f]/20 text-[#b58c4f]',
      color: THEME.gold,
      desc: 'จัดเก็บสัดส่วนพร้อมป้อนผสม'
    },
    {
      title: 'Issued to Floor',
      icon: 'Factory',
      bgHeader: 'bg-[#657f4d]/10 border-[#657f4d]/20 text-[#657f4d]',
      color: THEME.success,
      desc: 'จ่ายหน้าสายการผลิตเป้าหมายเรียบร้อย'
    }
  ];

  return (
    <div className="flex flex-col space-y-4 animate-fadeIn font-sans text-left text-[#212c46]">
      
      {/* KANBAN SUMMARY KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between h-[84px]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">รายการบนบอร์ดทั้งหมด</p>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0" style={{backgroundColor: '#4d87a815', borderColor: '#4d87a825', color: '#4d87a8'}}>
              <Icons.Layers size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[20px] font-black text-[#212c46] font-mono">{totalItems} <span className="text-[11px] text-slate-400 font-bold">รายการ</span></p>
            <span className="text-[9px] font-bold text-[#3f809e] uppercase tracking-wider flex items-center gap-1">Bulk Movements</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between h-[84px]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">รอตรวจคุณภาพ (QC Lab)</p>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0" style={{backgroundColor: '#932c2e15', borderColor: '#932c2e25', color: '#932c2e'}}>
              <Icons.ShieldAlert size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[20px] font-black text-[#932c2e] font-mono">{qcWaitingCount} <span className="text-[11px] text-slate-400 font-bold">ชุด</span></p>
            <span className="text-[9px] font-bold text-[#ce1c16] uppercase tracking-wider flex items-center gap-1">Awaiting release</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between h-[84px]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">ปริมาณกองแลงคงคลังรอแล็บ</p>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0" style={{backgroundColor: '#b58c4f15', borderColor: '#b58c4f25', color: '#b58c4f'}}>
              <Icons.Scale size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[20px] font-black text-[#212c46] font-mono">{new Intl.NumberFormat('th-TH').format(totalVolumeWaiting)} <span className="text-[11px] text-slate-400 font-bold">Units</span></p>
            <span className="text-[9px] font-bold text-[#b58c4f] uppercase tracking-wider flex items-center gap-1">Pending Vol</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-[#eaeaec] shadow-sm flex flex-col justify-between h-[84px]">
          <div className="flex justify-between items-start">
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em]">ผ่านจ่ายสู่ไลน์ (Issued Floor)</p>
            <div className="w-7 h-7 rounded-lg border flex items-center justify-center shrink-0" style={{backgroundColor: '#657f4d15', borderColor: '#657f4d25', color: '#657f4d'}}>
              <Icons.Play size={14} />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-[20px] font-black text-[#657f4d] font-mono">{activeIssuedCount} <span className="text-[11px] text-slate-400 font-bold">ชุดสำเร็จ</span></p>
            <span className="text-[9px] font-bold text-[#657f4d] uppercase tracking-wider flex items-center gap-1">Issued Live feed</span>
          </div>
        </div>
      </div>

      {/* FILTER & CONTROL BAR */}
      <div className="bg-white/95 rounded-2xl border border-[#eaeaec] p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto text-[12px]">
          {/* SEARCH FIELD */}
          <div className="relative w-full md:w-72">
            <Icons.Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา SKU, Lot No. หรือชื่อวัตถุดิบ..."
              className="w-full pl-9 pr-4 py-2 border border-[#eaeaec] bg-slate-50/50 rounded-xl font-bold text-[11.5px] outline-none text-[#212c46] focus:border-[#4d87a8] placeholder-slate-400 shadow-inner"
            />
          </div>

          {/* CATEGORY DIRECTORY SELECTOR */}
          <div className="flex items-center gap-2 bg-[#f3f3f1] border border-[#eaeaec] rounded-xl px-3 py-1.5 shadow-sm text-[12px]">
            <Icons.Filter size={13} className="text-[#606a5f]" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent outline-none font-black uppercase text-[10.5px] tracking-wider text-[#212c46] cursor-pointer"
            >
              <option value="All">ทุกกลุ่มสูตร (All)</option>
              <option value="Ingredient">กลุ่มส่วนผสม (Ingredients)</option>
              <option value="Packaging">กลุ่มบรรจุภัณฑ์ (Packaging)</option>
              <option value="Chemical">เคมี/สูตรทดลอง (Chemicals)</option>
              <option value="Spare Part">อะไหล่แผนกช่าง (Engineer Spares)</option>
            </select>
          </div>
        </div>

        {/* ADD ACTION */}
        <button
          onClick={() => setIsOpenAddModal(true)}
          className="w-full md:w-auto px-4 py-2 bg-[#212c46] text-[#b58c4f] hover:bg-[#b58c4f] hover:text-white font-black text-[11px] uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
        >
          <Icons.Plus size={14} /> เพิ่มใบเคลื่อนย้ายชุดวัตถุดิบ (Move RM)
        </button>
      </div>

      {/* KANBAN BOARD SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {columns.map((col) => {
          const colItems = filteredItems.filter((i) => i.status === col.title);
          const isOver = isOverColumn === col.title;

          return (
            <div
              key={col.title}
              onDragOver={(e) => handleDragOver(e, col.title)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, col.title)}
              className={`bg-white rounded-3xl border border-[#eaeaec] p-4 shadow-sm min-h-[550px] flex flex-col justify-between transition-all duration-300 ${
                isOver ? 'border-[#b58c4f] bg-[#b58c4f]/5 scale-[0.99] ring-2 ring-[#b58c4f]/20' : ''
              }`}
            >
              <div>
                {/* Column Head */}
                <div className={`p-3 rounded-2xl border ${col.bgHeader} flex items-center justify-between mb-4`}>
                  <div className="flex items-center gap-2.5">
                    <div className="p-1 px-1.5 rounded-lg bg-white shrink-0 shadow-sm">
                      {col.title === 'Waiting for QC' && <Icons.ShieldAlert size={14} />}
                      {col.title === 'Ready for Production' && <Icons.CheckSquare size={14} />}
                      {col.title === 'Issued to Floor' && <Icons.Factory size={14} />}
                    </div>
                    <div className="text-left">
                      <h4 className="font-extrabold text-[11.5px] uppercase tracking-wider leading-none">{col.title}</h4>
                      <span className="text-[8.5px] font-bold text-[#7a8b95] uppercase tracking-wide block mt-1">{col.desc}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-white border font-mono text-[10.5px] font-bold shadow-inner">
                    {colItems.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                  {colItems.length > 0 ? (
                    colItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onClick={() => {
                          setSelectedItem({ ...item });
                          setIsOpenDetail(true);
                        }}
                        className={`bg-white border rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:border-[#b58c4f] transition-all duration-200 cursor-grab active:cursor-grabbing group border-[#eaeaec] text-left relative overflow-hidden`}
                      >
                        {/* Priority line Indicator */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                            item.priority === 'High'
                              ? 'bg-[#932c2e]'
                              : item.priority === 'Normal'
                              ? 'bg-[#b58c4f]'
                              : 'bg-[#cbd5e1]'
                          }`}
                        />

                        {/* Top Metadata */}
                        <div className="flex justify-between items-center gap-1.5 pl-1">
                          <span className="text-[10px] font-mono font-black text-[#3f809e]">{item.sku}</span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                            item.priority === 'High' 
                              ? 'bg-[#932c2e]/10 text-[#932c2e]' 
                              : item.priority === 'Normal' 
                              ? 'bg-[#b58c4f]/10 text-[#b58c4f]' 
                              : 'bg-slate-100 text-[#7a8b95]'
                          }`}>
                            {item.priority}
                          </span>
                        </div>

                        {/* Item Name */}
                        <h5 className="font-sans font-black text-[#212c46] text-[12.5px] mt-2 block pl-1 truncate leading-tight group-hover:text-[#4d87a8] transition-colors">
                          {item.name}
                        </h5>

                        {/* Quantity details */}
                        <div className="flex justify-between items-center bg-[#f8f9fa] border border-[#eaeaec] rounded-xl px-2.5 py-1.5 mt-3 text-[11px] font-bold">
                          <div className="flex items-center gap-1.5">
                            <Icons.Scale size={11} className="text-[#7a8b95]" /> 
                            <span className="font-mono text-[#212c46] font-black">{new Intl.NumberFormat('th-TH').format(item.quantity)} {item.unit}</span>
                          </div>
                          <div className="text-slate-400 tracking-wide text-[9.5px]">LOT: <span className="font-mono text-[#212c46] font-extrabold">{item.lotNo}</span></div>
                        </div>

                        {/* Bottom Status / QC badges */}
                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-[#eaeaec]/60 pl-1">
                          <div className="flex items-center gap-1 font-mono text-[9px] text-[#7a8b95] font-semibold">
                            <Icons.MapPin size={10} className="text-[#b58c4f]" />
                            <span>{item.zone}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            {item.qcPassed === null ? (
                              <span className="p-1 rounded bg-[#a54f6b]/10 text-[#a54f6b]" title="Awaiting QC Check">
                                <Icons.Clock size={11} />
                              </span>
                            ) : item.qcPassed ? (
                              <span className="p-1 rounded bg-[#657f4d]/10 text-[#657f4d]" title="QC RELEASE APPROVED">
                                <Icons.CheckCircle size={11} />
                              </span>
                            ) : (
                              <span className="p-1 rounded bg-[#932c2e]/10 text-[#932c2e]" title="QC FAILED - REJECT STATE">
                                <Icons.AlertTriangle size={11} />
                              </span>
                            )}

                            {/* Easy movement buttons */}
                            <span className="p-1 hover:bg-[#212c46]/10 text-[#212c46] rounded cursor-pointer transition-colors" title="แก้ไขรายการ">
                              <Icons.ExternalLink size={11} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="border border-dashed border-[#eaeaec] rounded-2xl p-10 text-center text-[#7a8b95] flex flex-col items-center justify-center space-y-2">
                      <Icons.Inbox size={26} className="opacity-40 text-slate-400" />
                      <p className="text-[10px] font-black tracking-widest uppercase">ไม่มีวัสดุจัดขบวน</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Column Foot info */}
              <div className="mt-4 pt-3 border-t border-[#eaeaec]/70 text-[10px] text-[#7a8b95] font-bold uppercase tracking-wider flex justify-between items-center">
                <span>ปริมาตรรวม:</span>
                <span className="font-mono text-[#212c46] font-black">
                  {colItems.reduce((sum, item) => sum + item.quantity, 0).toLocaleString()} Units
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* NEW RM MOVEMENT MODAL */}
      {isOpenAddModal && (
        <DraggableModal isOpen={isOpenAddModal} onClose={() => setIsOpenAddModal(false)} title="บันทึกปล่อยย้ายตำแหน่งจัดเก็บ (New RM Movement)">
          <form onSubmit={handleAddItemSubmit} className="p-5 text-left text-[11.5px] text-[#414757] space-y-4 font-sans">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">รหัสวัตถุดิบ (SKU Code)</label>
                <input
                  type="text"
                  required
                  value={newItemForm.sku}
                  onChange={(e) => setNewItemForm({ ...newItemForm, sku: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-mono outline-none focus:border-[#4d87a8]"
                  placeholder="เช่น RM-ING-109"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">ชื่อรายการวัตถุดิบ (Material Name)</label>
                <input
                  type="text"
                  required
                  value={newItemForm.name}
                  onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-sans outline-none focus:border-[#4d87a8]"
                  placeholder="เช่น Cocoa Powder Base B"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">หมวดหมู่กลุ่มวัตถุดิบ</label>
                <select
                  value={newItemForm.category}
                  onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as any })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[11px] outline-none font-bold"
                >
                  <option value="Ingredient">กลุ่มส่วนผสม (Ingredients)</option>
                  <option value="Packaging">กลุ่มบรรจุภัณฑ์ (Packaging)</option>
                  <option value="Chemical">เคมี/สูตรทดลอง (Chemicals)</option>
                  <option value="Spare Part">อะไหล่แผนกช่าง (Spare Part)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">เลขล็อตผลิตชุบเคลือบ (Lot Number)</label>
                <input
                  type="text"
                  required
                  value={newItemForm.lotNo}
                  onChange={(e) => setNewItemForm({ ...newItemForm, lotNo: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-mono outline-none focus:border-[#4d87a8]"
                  placeholder="LOT-XXX-YYY"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">จานวนที่เคลื่อนย้าย</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={newItemForm.quantity}
                  onChange={(e) => setNewItemForm({ ...newItemForm, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-mono outline-none focus:border-[#4d87a8]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">หน่วยตวงเช็ค (Unit)</label>
                <input
                  type="text"
                  required
                  value={newItemForm.unit}
                  onChange={(e) => setNewItemForm({ ...newItemForm, unit: e.target.value })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] outline-none"
                  placeholder="เช่น Kg หรือ Liters"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">จัดเก็บที่โซนใด</label>
                <input
                  type="text"
                  required
                  value={newItemForm.zone}
                  onChange={(e) => setNewItemForm({ ...newItemForm, zone: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] outline-none"
                  placeholder="เช่น RM-ZONE-B"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">สถานะตั้งต้น</label>
                <select
                  value={newItemForm.status}
                  onChange={(e) => setNewItemForm({ ...newItemForm, status: e.target.value as any })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[11px] outline-none font-bold"
                >
                  <option value="Waiting for QC">Waiting for QC</option>
                  <option value="Ready for Production">Ready for Production</option>
                  <option value="Issued to Floor">Issued to Floor</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">ความสำคัญ (Priority)</label>
                <select
                  value={newItemForm.priority}
                  onChange={(e) => setNewItemForm({ ...newItemForm, priority: e.target.value as any })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[11px] outline-none font-bold"
                >
                  <option value="High"> High (เร่งด่วน)</option>
                  <option value="Normal"> Normal (ปกติ)</option>
                  <option value="Low"> Low (ทั่วไป)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">เจ้าผู้จัดการคลัง</label>
                <input
                  type="text"
                  required
                  value={newItemForm.operator}
                  onChange={(e) => setNewItemForm({ ...newItemForm, operator: e.target.value })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">หมายเหตุประกอบการเบิกจ่าย</label>
              <textarea
                value={newItemForm.notes}
                onChange={(e) => setNewItemForm({ ...newItemForm, notes: e.target.value })}
                className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-[12px] outline-none resize-none h-18 text-left"
                placeholder="ระบุข้อบกพร่อง วัตถุดิบทรานซิส ล็อพแผนการผลิตหลัก..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#eaeaec]">
              <button
                type="button"
                onClick={() => setIsOpenAddModal(false)}
                className="px-5 py-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 text-[#212c46] font-black text-[11px] uppercase tracking-wider"
              >
                ปิดหน้าต่าง
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#212c46] text-white hover:bg-[#3f809e] rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all"
              >
                อนุมัติเพิ่มขบวน
              </button>
            </div>
          </form>
        </DraggableModal>
      )}

      {/* DETAIL MODAL WITH INSPECTION LOG & FALLBACK STATUS MOVER */}
      {isOpenDetail && selectedItem && (
        <DraggableModal isOpen={isOpenDetail} onClose={() => setIsOpenDetail(false)} title={`ใบข้อมูลการจัดขบวนชุดวัตถุดิบ: ${selectedItem.id}`}>
          <form onSubmit={handleSaveDetailChanges} className="p-5 text-left text-[11.5px] text-[#414757] space-y-4 font-sans max-h-[85vh] overflow-y-auto">
            {/* Visual Header */}
            <div className="p-3.5 bg-slate-50 border border-[#eaeaec] rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold font-mono text-[#4d87a8] uppercase bg-[#4d87a8]/10 px-2 py-0.5 rounded border border-[#4d87a8]/15">{selectedItem.sku}</span>
                <h4 className="font-extrabold text-[14px] text-[#212c46] mt-1.5">{selectedItem.name}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider border ${
                selectedItem.status === 'Waiting for QC'
                  ? 'bg-red-50 text-red-600 border-red-100'
                  : selectedItem.status === 'Ready for Production'
                  ? 'bg-amber-50 text-amber-600 border-amber-100'
                  : 'bg-green-50 text-green-600 border-green-100'
              }`}>
                {selectedItem.status}
              </span>
            </div>

            {/* Quick QC Release Trigger Box */}
            {selectedItem.status === 'Waiting for QC' && (
              <div className="p-3.5 bg-amber-50 border border-[#b58c4f]/25 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-fadeIn">
                <div className="text-left md:max-w-[70%]">
                  <span className="text-[10px] font-black uppercase text-[#b58c4f] tracking-widest flex items-center gap-1.5"><Icons.ShieldAlert size={12}/> Awaiting Lab Release Approval</span>
                  <p className="text-[11px] text-[#b58c4f] font-semibold mt-1 leading-relaxed">ชุดวัตถุดิบชิ้นนี้ยังไม่ได้ผ่านการตรวจสอบคุณภาพวิเคราะห์ หากวิเคราะห์เสร็จสมบูรณ์แล้ว โปรดกุมสิทธิผลชัตัดบอร์ด...</p>
                </div>
                <div className="flex gap-1.5 shrink-0 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() => handleQCApproval(selectedItem.id, false)}
                    className="flex-1 md:flex-initial px-3.5 py-2 bg-red-600 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider hover:bg-red-700 transition"
                  >
                    Reject QC
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQCApproval(selectedItem.id, true)}
                    className="flex-1 md:flex-initial px-3.5 py-2 bg-green-700 text-white rounded-xl text-[10.5px] font-black uppercase tracking-wider hover:bg-green-800 transition"
                  >
                    Release Approval
                  </button>
                </div>
              </div>
            )}

            {/* Manual Edit fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">แก้ชื่อวัตถุดิบ</label>
                <input
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-sans outline-none focus:border-[#4d87a8]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">เลขล็อต (Lot ID)</label>
                <input
                  type="text"
                  value={selectedItem.lotNo}
                  onChange={(e) => setSelectedItem({ ...selectedItem, lotNo: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-mono outline-none focus:border-[#4d87a8]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">ปริมาณที่ย้าย</label>
                <input
                  type="number"
                  value={selectedItem.quantity}
                  onChange={(e) => setSelectedItem({ ...selectedItem, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] font-mono outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">โซนตำแหน่งคลัง</label>
                <input
                  type="text"
                  value={selectedItem.zone}
                  onChange={(e) => setSelectedItem({ ...selectedItem, zone: e.target.value.toUpperCase() })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[12px] outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase mb-1">ความสาคัญ (Priority)</label>
                <select
                  value={selectedItem.priority}
                  onChange={(e) => setSelectedItem({ ...selectedItem, priority: e.target.value as any })}
                  className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-1.5 text-[11px] outline-none font-bold"
                >
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            {/* Accessibility fallback: Fallback Dropdown for Status Mover */}
            <div className="bg-[#f1f5f9] p-3 rounded-2xl border border-[#cbd5e1]/50">
              <label className="block text-[10px] font-black text-[#475569] uppercase tracking-wider mb-1.5">
                ย้ายเข้าสู่สถานะใหม่โดยตรง (Accessible Movement Dropdown)
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedItem.status}
                  onChange={(e) => {
                    const nextSt = e.target.value as RMItem['status'];
                    setSelectedItem({
                      ...selectedItem,
                      status: nextSt,
                      qcPassed: nextSt === 'Ready for Production' ? true : selectedItem.qcPassed
                    });
                  }}
                  className="flex-1 bg-white border border-[#cbd5e1] rounded-xl px-3 py-2 text-[11.5px] outline-none font-extrabold text-[#212c46]"
                >
                  <option value="Waiting for QC">Waiting for QC / รอตรวจคุณภาพ</option>
                  <option value="Ready for Production">Ready for Production / พร้อมป้อนผสม</option>
                  <option value="Issued to Floor">Issued to Floor / นำเบิกจ่ายลงไลน์ผลิต</option>
                </select>
              </div>
            </div>

            {/* Log and comments */}
            <div className="space-y-1">
              <label className="block text-[10px] font-black text-[#7a8b95] uppercase block">หมายเหตุกำกับ / บันทึกการเคลื่อนย้าย</label>
              <textarea
                value={selectedItem.notes}
                onChange={(e) => setSelectedItem({ ...selectedItem, notes: e.target.value })}
                className="w-full bg-white border border-[#eaeaec] rounded-xl px-3 py-2 text-[11.5px] outline-none resize-none h-20 text-left"
              />
              <span className="block text-[9px] font-mono text-slate-400 font-bold text-right">ปรับปรุงแก้ไขล่าสุดเมื่อ: {selectedItem.updatedAt}</span>
            </div>

            <div className="flex justify-between gap-2 pt-3.5 border-t border-[#eaeaec]">
              <button
                type="button"
                onClick={() => handleDeleteItem(selectedItem.id)}
                className="px-4 py-2 bg-red-50 hover:bg-[#932c2e] hover:text-white rounded-xl text-[#932c2e] font-black text-[11px] uppercase tracking-wider transition-all"
              >
                ลบรายการย้ายออก
              </button>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpenDetail(false)}
                  className="px-5 py-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 text-[#212c46] font-black text-[11px] uppercase tracking-wider"
                >
                  ปิดหน้ารายงาน
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#212c46] text-white hover:bg-[#3f809e] rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md transition-all"
                >
                  บันทึกการปรับเปลี่ยน
                </button>
              </div>
            </div>
          </form>
        </DraggableModal>
      )}

    </div>
  );
}
