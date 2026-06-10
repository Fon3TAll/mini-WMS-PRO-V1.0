import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { DraggableModal } from './shared/DraggableModal';
import { motion, AnimatePresence } from 'motion/react';
import Swal from 'sweetalert2';
import { 
  Zap, 
  QrCode, 
  ShoppingCart, 
  Wrench, 
  ClipboardList, 
  MapPin, 
  Plus,
  PackageSearch
} from 'lucide-react';

export default function QuickActionsHub() {
  const { addNotification } = useNotifications();
  const [isHubOpen, setIsHubOpen] = useState(false);

  // States for Quick Action Modals
  const [isRequisitionOpen, setIsRequisitionOpen] = useState(false);
  const [isFaultOpen, setIsFaultOpen] = useState(false);
  const [isSpotCountOpen, setIsSpotCountOpen] = useState(false);
  const [isZoneReserveOpen, setIsZoneReserveOpen] = useState(false);

  // Form states
  const [reqItem, setReqItem] = useState('SKU-CHEM-8109');
  const [reqQty, setReqQty] = useState('50');
  const [reqNotes, setReqNotes] = useState('');

  const [faultEquip, setFaultEquip] = useState('Forklift TK-9');
  const [faultPriority, setFaultPriority] = useState('HIGH');
  const [faultDesc, setFaultDesc] = useState('');

  const [spotLoc, setSpotLoc] = useState('Zone B-3');
  const [spotSKU, setSpotSKU] = useState('SKU-PKG-771');
  const [spotQty, setSpotQty] = useState('');

  const [zoneSector, setZoneSector] = useState('Zone C-Chemical');
  const [zoneShelf, setZoneShelf] = useState('Shelf 04');
  const [zoneCapacity, setZoneCapacity] = useState('80%');

  const handleRequisitionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification(
      'stock',
      'อนุมัติเบิกพัสดุด่วนสำเร็จ',
      `เบิกวัสดุ ${reqItem} จำนวนด่วน ${reqQty} ชิ้นเรียบร้อยแล้ว ได้ส่งพิกัดงานเข้าสู่ระบบคัดกรอง`,
      'info'
    );
    Swal.fire({
      title: '<span class="text-slate-900 font-bold font-sans text-base">ส่งคำสั่งซื้อด่วนสำเร็จ</span>',
      html: `
        <div class="font-sans py-2 space-y-3">
          <p class="text-xs text-slate-500 font-medium">รายการเบิกวัสดุคงคลังด่วนได้รับการบันทึกและแจ้งเตือนผู้จัดจำหน่ายแล้ว</p>
          <div class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-left space-y-1.5 font-sans">
            <p class="text-[11px] text-slate-600"><strong>ไอเทมวัสดุ / SKU:</strong> <span class="font-mono text-indigo-700 font-bold">${reqItem}</span></p>
            <p class="text-[11px] text-slate-600"><strong>จำนวนสั่งเบิกจ่าย:</strong> <span class="font-semibold text-slate-800">${reqQty} units</span></p>
            ${reqNotes ? `<p class="text-[11px] text-slate-600"><strong>หมายเหตุ:</strong> <span class="text-slate-800">${reqNotes}</span></p>` : ''}
          </div>
          <p class="text-[10px] font-bold text-amber-600 uppercase tracking-wide">● PROCUREMENT TICKET GENERATED</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#1e293b',
      confirmButtonText: 'ตกลง (OK)'
    });
    setIsRequisitionOpen(false);
    setReqNotes('');
  };

  const handleFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification(
      'equipment',
      'แจ้งเครื่องจักรชำรุดเสียหาย • ด่วน',
      `แจ้งเหตุขัดข้อง ${faultEquip} ระดับสิทธิ์บำรุงรักษาล่าสุด: ${faultPriority}`,
      faultPriority === 'HIGH' ? 'critical' : 'warning'
    );
    Swal.fire({
      title: '<span class="text-slate-900 font-bold font-sans text-base">ลงทะเบียนส่งซ่อมอุปกรณ์สำเร็จ</span>',
      html: `
        <div class="font-sans py-2 space-y-3">
          <p class="text-xs text-slate-500 font-medium">ใบแจ้งซ่อมอุปกรณ์ชำรุดขัดข้องทางเทคนิคได้รับการอัปเดตเข้าระบบ</p>
          <div class="p-3 bg-red-50 border border-red-100 rounded-xl text-left space-y-1.5 font-sans">
            <p class="text-[11px] text-slate-600"><strong>ชื่ออุปกรณ์คลัง:</strong> <span class="font-semibold text-slate-800">${faultEquip}</span></p>
            <p class="text-[11px] text-slate-600"><strong>ระดับความด่วน (Priority):</strong> <span class="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black">${faultPriority}</span></p>
            ${faultDesc ? `<p class="text-[11px] text-slate-600"><strong>รายละเอียดปัญหาสุขภาพเครื่อง:</strong> <span class="text-slate-800">${faultDesc}</span></p>` : ''}
          </div>
          <p class="text-[10px] font-bold text-red-600 uppercase tracking-widest">● MAINTENANCE DESPATCHED</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#1e293b',
      confirmButtonText: 'ตกลง (OK)'
    });
    setIsFaultOpen(false);
    setFaultDesc('');
  };

  const handleSpotCountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotQty) {
      Swal.fire({
        text: 'กรุณากรอกยอดจำนวนตัวเลขตรวจนับตามจริง',
        icon: 'error',
        confirmButtonColor: '#1e293b'
      });
      return;
    }
    addNotification(
      'stock',
      'อัปเดตยอดสุ่มสปอตตรวจนับสำเร็จ',
      `ตรวจสอบพิกัด ${spotLoc} ของ SKU ${spotSKU} ได้รับรหัสการนับสุทธิที่ยอด ${spotQty} ชิ้นเข้าระบบหลัก`,
      'success'
    );
    Swal.fire({
      title: '<span class="text-slate-900 font-bold font-sans text-base">บันทึกยอดนับพัสดุหน้างานด่วนสำเร็จ</span>',
      html: `
        <div class="font-sans py-2 space-y-3">
          <p class="text-xs text-slate-500 font-medium">ยอดข้อมูลสุ่มตรวจนับ Spot Check สดได้รับการลงบันทึกในฐานระบบ WMS</p>
          <div class="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-left space-y-1.5 font-sans">
            <p class="text-[11px] text-slate-600"><strong>ไอเทม SKU:</strong> <span class="font-mono text-emerald-800 font-bold">${spotSKU}</span></p>
            <p class="text-[11px] text-slate-600"><strong>พิกัดที่ตั้ง (Location):</strong> <span class="font-mono font-bold text-slate-800">${spotLoc}</span></p>
            <p class="text-[11px] text-slate-600"><strong>จำนวนนับจริงได้หน้างาน:</strong> <span class="font-bold text-emerald-700 font-sans">${spotQty} items</span></p>
          </div>
          <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">● CYCLE SPOT ENTRY COMPLETED</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#1e293b',
      confirmButtonText: 'ตกลง (OK)'
    });
    setIsSpotCountOpen(false);
    setSpotQty('');
  };

  const handleZoneReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNotification(
      'inbound',
      'สำรองพื้นที่เก็บของด่วนเสร็จสิ้น',
      `แผนก ${zoneSector} • ระดับชั้น ${zoneShelf} ล็อกสัดส่วนความจุไว้รองรับ ${zoneCapacity} ลุล่วง`,
      'success'
    );
    Swal.fire({
      title: '<span class="text-slate-900 font-bold font-sans text-base">ล็อคเนื้อที่ชั้นจัดเก็บสำเร็จ</span>',
      html: `
        <div class="font-sans py-2 space-y-3">
          <p class="text-xs text-slate-500 font-medium">จองพื้นที่จัดวางในคลังเสร็จสิ้น</p>
          <div class="p-3 bg-amber-50 border border-amber-100 rounded-xl text-left space-y-1.5 font-sans">
            <p class="text-[11px] text-slate-600"><strong>หมวดแผนก Zone:</strong> <span class="font-semibold text-slate-800">${zoneSector}</span></p>
            <p class="text-[11px] text-slate-600"><strong>ชั้นระดับ (Shelf):</strong> <span class="font-mono text-amber-700 font-bold">${zoneShelf}</span></p>
            <p class="text-[11px] text-slate-600"><strong>ความจุ:</strong> <span class="text-slate-800">${zoneCapacity}</span></p>
          </div>
          <p class="text-[10px] font-bold text-amber-600 uppercase tracking-widest">● ZONE EXPEDITED SUCCESSFULLY</p>
        </div>
      `,
      icon: 'success',
      confirmButtonColor: '#1e293b',
      confirmButtonText: 'ตกลง (OK)'
    });
    setIsZoneReserveOpen(false);
  };

  const handleCheckStockLevel = async () => {
    setIsHubOpen(false);
    const { value: sku } = await Swal.fire({
      title: '<span class="text-sm font-black uppercase text-[#212c46] tracking-widest">Check Stock Level</span>',
      input: 'text',
      inputLabel: 'Enter SKU / Barcode',
      inputPlaceholder: 'e.g. SKU-CHEM-8109',
      showCancelButton: true,
      confirmButtonColor: '#212c46',
      cancelButtonColor: '#eaeaec',
      cancelButtonText: '<span class="text-slate-600 font-bold">Cancel</span>',
      confirmButtonText: 'Check Stock',
      customClass: {
        title: 'font-sans',
        inputLabel: 'text-xs font-bold text-slate-500 font-sans uppercase tracking-widest',
        input: 'font-mono text-sm border-slate-300'
      }
    });

    if (sku) {
      Swal.fire({
        title: '<span class="text-slate-900 font-bold font-sans text-base">การตรวจสอบสต็อกคงเหลือ</span>',
        html: `
          <div class="font-sans py-2 space-y-3">
            <div class="p-3 bg-[#f8f9fa] border border-[#eaeaec] rounded-xl text-left space-y-1.5 font-sans">
              <p class="text-[11px] text-slate-500 uppercase font-black tracking-widest mb-2 border-b border-[#eaeaec] pb-1">Stock Overview</p>
              <p class="text-[11px] text-slate-600"><strong>Item ID:</strong> <span class="font-mono text-[#212c46] font-bold">${sku.toUpperCase()}</span></p>
              <p class="text-[11px] text-slate-600"><strong>Status:</strong> <span class="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black uppercase">In Stock</span></p>
              <p class="text-[11px] text-slate-600"><strong>Available Qty:</strong> <span class="font-bold text-[#b7a159] text-[13px]">1,240 Units</span></p>
              <p class="text-[11px] text-slate-600 mt-2 pt-2 border-t border-[#eaeaec]/60"><strong>Primary Location:</strong> <span class="font-mono text-slate-800">Zone A-4</span></p>
            </div>
          </div>
        `,
        icon: 'info',
        confirmButtonColor: '#212c46',
        confirmButtonText: 'ตกลง (OK)'
      });
    }
  };

  return (
    <>
      <div className="relative pointer-events-auto">
        <AnimatePresence>
          {isHubOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="absolute bottom-16 right-0 w-80 bg-white border border-slate-200 shadow-[0_16px_48px_rgba(33,44,70,0.22)] rounded-3xl p-5 overflow-hidden z-50 pointer-events-auto max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-rose-50/80 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="text-sm font-black text-[#1a253d] uppercase tracking-wider flex items-center gap-1.5 leading-none">
                    <Zap size={14} className="text-[#ce8a39] animate-pulse" /> Quick Actions Hub
                  </h3>
                  <p className="text-[9px] text-[#788990] font-bold uppercase mt-1 tracking-wider leading-none">Instant WMS Workflows</p>
                </div>
                <button 
                  onClick={() => setIsHubOpen(false)}
                  className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors text-[10px] font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2.5">
                {/* Action: Check Stock Level */}
                <button
                  onClick={handleCheckStockLevel}
                  className="w-full text-left p-3 rounded-2xl bg-[#212c46]/5 hover:bg-[#212c46]/10 border border-[#212c46]/10 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-[#212c46]/10 text-[#212c46] group-hover:bg-[#212c46] group-hover:text-white transition-colors">
                    <PackageSearch size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#212c46] uppercase leading-none">Check Stock Level</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 leading-normal">ตรวจสอบปริมาณวัตถุดิบและสินค้าคงคลัง</p>
                  </div>
                </button>

                {/* Action 1: Barcode Scan */}
                <button
                  onClick={() => {
                    setIsHubOpen(false);
                    window.dispatchEvent(new CustomEvent('wms-trigger-scanner'));
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-slate-200 text-[#1a253d] group-hover:bg-[#1a253d] group-hover:text-white transition-colors">
                    <QrCode size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1a253d] uppercase leading-none">WMS Barcode Scan</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-1 leading-normal">สแกนรหัสพัสดุด่วนเข้าระบบส่วนกลาง</p>
                  </div>
                </button>

                {/* Action 2: Material Requisition */}
                <button
                  onClick={() => {
                    setIsHubOpen(false);
                    setIsRequisitionOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-[#ce8a39]/5 hover:bg-[#ce8a39]/10 border border-[#ce8a39]/10 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-[#ce8a39]/10 text-[#ce8a39] group-hover:bg-[#ce8a39] group-hover:text-white transition-colors">
                    <ShoppingCart size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#ce8a39] uppercase leading-none">Fast Requisition</h4>
                    <p className="text-[10px] text-amber-700 font-medium mt-1 leading-normal">ทำรายงานสั่งซื้อหรือสุ่มขอเพิ่มสต็อกพัสดุ</p>
                  </div>
                </button>

                {/* Action 4: Perform Cycle Count */}
                <button
                  onClick={() => {
                    setIsHubOpen(false);
                    setIsSpotCountOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-100/80 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <ClipboardList size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-700 uppercase leading-none">Perform Cycle Count</h4>
                    <p className="text-[10px] text-emerald-600 font-medium mt-1 leading-normal">สุ่มตรวจนับสต๊อกหน้างาน (Cycle/Spot Count)</p>
                  </div>
                </button>

                {/* Action 3: Report Fault */}
                <button
                  onClick={() => {
                    setIsHubOpen(false);
                    setIsFaultOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-100 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-red-100/80 text-red-700 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Wrench size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-red-700 uppercase leading-none">Report Equipt Fault</h4>
                    <p className="text-[10px] text-red-600 font-medium mt-1 leading-normal">แจ้งซ่อมรถโฟล์คลิตฟ์ / แฟลตเจอร์ขัดข้อง</p>
                  </div>
                </button>

                {/* Action 5: Zone Reserve */}
                <button
                  onClick={() => {
                    setIsHubOpen(false);
                    setIsZoneReserveOpen(true);
                  }}
                  className="w-full text-left p-3 rounded-2xl bg-[#3f809e]/5 hover:bg-[#3f809e]/10 border border-[#3f809e]/10 flex items-start gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] group"
                >
                  <div className="p-2.5 rounded-xl bg-[#3f809e]/10 text-[#3f809e] group-hover:bg-[#3f809e] group-hover:text-white transition-colors">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#3f809e] uppercase leading-none">Reserve Slot Space</h4>
                    <p className="text-[10px] text-[#3f809e] font-medium mt-1 leading-normal">ระบุทำเลสำรองจัดเก็บชั่วคราวเร่งด่วน</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trigger Floating Action Button */}
        <motion.button
          onClick={() => setIsHubOpen(!isHubOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgba(206,138,57,0.4)] border border-amber-400 group relative overflow-hidden transition-all duration-300 ${
            isHubOpen 
              ? 'bg-red-600 hover:bg-red-700 shadow-[0_8px_30px_rgba(220,38,38,0.4)]' 
              : 'bg-gradient-to-br from-[#ce8a39] to-[#ad2b10] hover:from-[#e5b73b] hover:to-[#ce8a39]'
          }`}
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <motion.div
            animate={{ rotate: isHubOpen ? 135 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center shrink-0"
          >
            <Plus size={24} className="text-white shrink-0" />
          </motion.div>
        </motion.button>
      </div>

      {/* MODAL 1: EMERGENCY REQUISITION */}
      <DraggableModal
        isOpen={isRequisitionOpen}
        onClose={() => setIsRequisitionOpen(false)}
        title={
          <span className="text-sm font-black uppercase text-[#ce8a39] tracking-widest flex items-center gap-2">
            <ShoppingCart size={16} /> Urgent Material Requisition
          </span>
        }
        width="max-w-md"
      >
        <form onSubmit={handleRequisitionSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium">ทำใบเบิกจ่ายพัสดุด่วนเพื่อเติมเติมสต็อกหน้างานทันที</p>
          
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">วัตถุดิบ / พัสดุ (SKU)</label>
            <select
              value={reqItem}
              onChange={(e) => setReqItem(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-[#ce8a39] outline-none"
            >
              <option value="SKU-CHEM-8109">Solvent Type A • สต็อกต่ำ</option>
              <option value="SKU-CHEM-4412">Solvent Type B • ของหมด</option>
              <option value="SKU-PKG-771">Kraft Box XL • ลังกระดาษ</option>
              <option value="PLT-FG-2026-809">FG Plastic Pallet • พาเลท</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">จำนวนที่ต้องการเบิก (Units)</label>
            <input
              type="number"
              value={reqQty}
              onChange={(e) => setReqQty(e.target.value)}
              min="1"
              required
              className="w-full p-3 border border-[#eaeaec] rounded-xl text-xs font-bold text-[#1a253d] focus:border-[#ce8a39] outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">หมายเหตุการสั่งเบิกเร่งด่วน</label>
            <textarea
              value={reqNotes}
              onChange={(e) => setReqNotes(e.target.value)}
              placeholder="ระบบระบุเหตุผล เช่น ของขาดหน้างาน / ผลิตไม่ทัน..."
              className="w-full h-20 p-3 border border-[#eaeaec] rounded-xl text-xs font-medium text-[#1a253d] focus:border-[#ce8a39] outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsRequisitionOpen(false)}
              className="flex-1 py-3 text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-[10px] font-black text-white bg-[#ce8a39] hover:bg-[#ad2b10] uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Submit requisition
            </button>
          </div>
        </form>
      </DraggableModal>

      {/* MODAL 2: REPORT FAULT */}
      <DraggableModal
        isOpen={isFaultOpen}
        onClose={() => setIsFaultOpen(false)}
        title={
          <span className="text-sm font-black uppercase text-red-700 tracking-widest flex items-center gap-2">
            <Wrench size={16} /> WMS Equipment Fault Ticket
          </span>
        }
        width="max-w-md"
      >
        <form onSubmit={handleFaultSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium font-sans">แจ้งเหตุอุปกรณ์หรือพาหนะคลังสินค้าพัง ขัดข้อง หรือชำรุดเสียหายเพื่อส่งซ่อมทันที</p>
          
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">อุปกรณ์คงคลัง / ยานพาหนะ</label>
            <select
              value={faultEquip}
              onChange={(e) => setFaultEquip(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-red-600 outline-none"
            >
              <option value="Forklift TK-9">Forklift TK-9 (รถยกเครื่องยนต์ดีเซล)</option>
              <option value="Pallet Jack PX-2">Pallet Jack PX-2 (รถลากพาเลท)</option>
              <option value="Scan Gun #44">Scan Gun #44 (เครื่องสแกนบาร์โค้ดไร้สาย)</option>
              <option value="Smart Thermometer ST-1">Smart Thermometer ST-1 (เซ็นเซอร์ห้องเย็น)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">ระดับความด่วนงานซ่อม (Priority)</label>
            <div className="grid grid-cols-3 gap-2">
              {['LOW', 'MEDIUM', 'HIGH'].map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setFaultPriority(p)}
                  className={`py-2 px-3 text-[10px] font-black rounded-lg border uppercase tracking-wider transition-colors ${
                    faultPriority === p
                      ? 'bg-red-600 border-red-600 text-white shadow-sm'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">รายละเอียดอาการชำรุด / อาการเสีย</label>
            <textarea
              value={faultDesc}
              onChange={(e) => setFaultDesc(e.target.value)}
              placeholder="ระบุอาการชำรุดขัดข้อง เช่น สแกนเนอร์เปิดไม่ติด แบตเสื่อม หรือเบรกรถยกค้าง..."
              required
              className="w-full h-24 p-3 border border-[#eaeaec] rounded-xl text-xs font-medium text-[#1a253d] focus:border-red-600 outline-none resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsFaultOpen(false)}
              className="flex-1 py-3 text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-[10px] font-black text-white bg-red-600 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Dispatch Ticket
            </button>
          </div>
        </form>
      </DraggableModal>

      {/* MODAL 3: SPOT COUNT ENTRY */}
      <DraggableModal
        isOpen={isSpotCountOpen}
        onClose={() => setIsSpotCountOpen(false)}
        title={
          <span className="text-sm font-black uppercase text-emerald-700 tracking-widest flex items-center gap-2">
            <ClipboardList size={16} /> Perform Cycle Count
          </span>
        }
        width="max-w-md"
      >
        <form onSubmit={handleSpotCountSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium font-sans">ป้อนข้อมูลนับจริงหน้างานอย่างรวดเร็วเพื่อตรวจสอบยอดตรงคลังสินค้า</p>
          
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">พิกัดจัดเก็บสินค้าจริง (Location Zone)</label>
            <select
              value={spotLoc}
              onChange={(e) => setSpotLoc(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-emerald-600 outline-none"
            >
              <option value="Zone A-1">Zone A-1 (โซนรับของทั่วไป)</option>
              <option value="Zone B-3">Zone B-3 (โซนผลิตภัณฑ์สำเร็จ)</option>
              <option value="Zone C-Chemical">Zone C-Chemical (โซนเคมีหวงห้าม)</option>
              <option value="Zone Z-Temp">Zone Z-Temp (ชั้นวางของทรานสิท)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">เลือกไอเทมสินค้า (SKU)</label>
            <select
              value={spotSKU}
              onChange={(e) => setSpotSKU(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-emerald-600 outline-none"
            >
              <option value="SKU-PKG-771">SKU-PKG-771 (Kraft Box Large)</option>
              <option value="SKU-CHEM-8109">SKU-CHEM-8109 (Solvent Type A)</option>
              <option value="SKU-CHEM-4412">SKU-CHEM-4412 (Solvent Type B)</option>
              <option value="PLT-FG-2026-809">PLT-FG-2026-809 (FG Plastic Pallet)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">จำนวนนับได้จริงหน้างาน (Physical Count)</label>
            <input
              type="number"
              value={spotQty}
              onChange={(e) => setSpotQty(e.target.value)}
              min="0"
              required
              placeholder="ป้อนปริมาณตัวเลขชิ้นงานจริง..."
              className="w-full p-3 border border-[#eaeaec] rounded-xl text-xs font-bold text-[#1a253d] focus:border-emerald-600 outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSpotCountOpen(false)}
              className="flex-1 py-3 text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Log Spot Count
            </button>
          </div>
        </form>
      </DraggableModal>

      {/* MODAL 4: ZONE RESERVE */}
      <DraggableModal
        isOpen={isZoneReserveOpen}
        onClose={() => setIsZoneReserveOpen(false)}
        title={
          <span className="text-sm font-black uppercase text-[#3f809e] tracking-widest flex items-center gap-2">
            <MapPin size={16} /> Instant Storage Slot Reservation
          </span>
        }
        width="max-w-md"
      >
        <form onSubmit={handleZoneReserveSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium font-sans">ล็อคพิกัดจัดเก็บหรือพิกัดทรานชิทชั่วคราวฉุกเฉินสำหรับรถโหลดสินค้าเข้า</p>
          
          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">กลุ่มแผนกโซนคลัง (Warehouse Zone Sector)</label>
            <select
              value={zoneSector}
              onChange={(e) => setZoneSector(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-[#3f809e] outline-none"
            >
              <option value="Zone A-General">Zone A (พื้นที่ทั่วไปพาเลท)</option>
              <option value="Zone B-Finished">Zone B (พาเลทขนส่งขาออก)</option>
              <option value="Zone C-Chemical">Zone C (ชั้นวางสารเคมี/วัตถุดิบไฟเบอร์)</option>
              <option value="Zone D-Hazardous">Zone D (ห้องควบคุมควบคุมพิเศษ)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">ชั้นวางระดับ (Shelf Number Index)</label>
            <select
              value={zoneShelf}
              onChange={(e) => setZoneShelf(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs uppercase font-bold text-[#1a253d] focus:border-[#3f809e] outline-none"
            >
              <option value="Shelf 01">Shelf 01 (ชั้นติดพื้น)</option>
              <option value="Shelf 02">Shelf 02 (ระดับสอง)</option>
              <option value="Shelf 03">Shelf 03 (ระดับสาม)</option>
              <option value="Shelf 04">Shelf 04 (ชั้นสูงสุดติดเพดาน)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wide mb-1.5">เป้าหมายความจุเก็บ (Target Reserved Capacity)</label>
            <select
              value={zoneCapacity}
              onChange={(e) => setZoneCapacity(e.target.value)}
              className="w-full p-3 border border-[#eaeaec] bg-white rounded-xl text-xs font-bold text-[#1a253d] focus:border-[#3f809e] outline-none"
            >
              <option value="30%">30% (น้อยที่สุด)</option>
              <option value="50%">50% (ปานกลาง)</option>
              <option value="80%">80% (ความจุปรกติ)</option>
              <option value="100%">100% (จำกัดความจุเต็มชั้น)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsZoneReserveOpen(false)}
              className="flex-1 py-3 text-[10px] font-black text-slate-600 bg-slate-100 hover:bg-slate-200 uppercase tracking-widest rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 text-[10px] font-black text-white bg-[#3f809e] hover:bg-[#2e5e74] hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest rounded-xl transition-all shadow-md"
            >
              Reserve Space Lock
            </button>
          </div>
        </form>
      </DraggableModal>
    </>
  );
}

