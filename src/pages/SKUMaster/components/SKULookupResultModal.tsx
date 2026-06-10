import React from "react";
import * as Icons from "lucide-react";
import { DraggableModal } from "../../../components/shared/DraggableModal";

interface SKULookupResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  onEdit: (item: any) => void;
  onCreateNew: (barcode: string) => void;
  onScanQuery: () => void;
  onPrint?: (item: any) => void;
}

export function SKULookupResultModal({
  isOpen,
  onClose,
  result,
  onEdit,
  onCreateNew,
  onScanQuery,
  onPrint,
}: SKULookupResultModalProps) {
  if (!isOpen || !result) return null;

  const isNotFound = result.notFound;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[580px]"
      customHeader={
        <div className="bg-[#133951] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b58c4f]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center border text-white shadow-sm font-bold ${isNotFound ? 'bg-amber-600 border-amber-500' : 'bg-emerald-600 border-emerald-500'}`}
            >
              {isNotFound ? (
                <Icons.AlertCircle size={22} />
              ) : (
                <Icons.CheckCircle size={22} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none text-left">
                {isNotFound
                  ? "Barcode Not Registered"
                  : "SKU Record Identified"}
              </h3>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1 text-left">
                {isNotFound
                  ? `No match found for code "${result.scanCode}"`
                  : `Quick lookup matches "${result.sku}"`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/75 hover:text-red-400 transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer"
          >
            <Icons.X size={16} />
          </button>
        </div>
      }
    >
      <div className="p-6 space-y-6 text-left bg-[#f8f9fa] flex-1 overflow-y-auto custom-scrollbar">
        {isNotFound ? (
          <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="p-4 bg-amber-50 rounded-full text-amber-500 border border-amber-200">
              <Icons.Barcode size={48} className="animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[14px] font-black text-[#212c46] uppercase mb-1">
                ตัวแนะนำแยกประเภทบาร์โค้ดไม่พบข้อมูล
              </h4>
              <p className="text-[12px] text-[#7a8b95] max-w-sm font-medium">
                ไม่พบบันทึกสินค้าหรือหมายเลขบาร์โค้ด{" "}
                <strong className="text-amber-600 font-mono text-[13px]">
                  {result.scanCode}
                </strong>{" "}
                อยู่ในระบบคลังพัสดุของคุณ
              </p>
            </div>
            <div className="pt-2 w-full flex flex-col gap-2">
              <button
                onClick={() => {
                  onCreateNew(result.scanCode);
                  onClose();
                }}
                className="w-full bg-[#3f809e] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2d5f76] transition-all flex items-center justify-center gap-2 shadow-md border border-[#3f809e] cursor-pointer"
              >
                <Icons.PlusSquare size={16} /> ลงทะเบียนสารบบสินค้าใหม่
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onScanQuery();
                  }}
                  className="bg-white border border-[#eaeaec] text-[#212c46] py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#f3f3f1] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Icons.ScanLine size={14} /> スแกนอีกครั้ง
                </button>
                <button
                  onClick={onClose}
                  className="bg-[#212c46] text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center justify-center shadow-sm cursor-pointer"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5 text-left">
            {/* Found Item Detail Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-[#212c46]/10 text-[#212c46] px-2 py-0.5 rounded border border-[#212c46]/20">
                      {result.category}
                    </span>
                    <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                      {result.type}
                    </span>
                  </div>
                  <h3 className="text-[16px] font-black text-[#212c46] tracking-tight leading-tight mt-1.5">
                    {result.name}
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded border border-emerald-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1 animate-pulse"></div>
                    {result.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    รหัสสินค้า / SKU CODE
                  </span>
                  <p className="text-[13px] font-black font-mono text-[#3f809e]">
                    {result.sku}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    รหัสบาร์โค้ด / BARCODE
                  </span>
                  <p className="text-[13px] font-bold font-mono text-[#212c46]">
                    {result.barcode || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    หน่วยนับ / UOM
                  </span>
                  <p className="text-[12px] font-bold text-[#212c46] uppercase">
                    {result.uom}{" "}
                    {result.largeUom &&
                      `(1 ${result.largeUom} = ${result.uomRatio} ${result.uom})`}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    น้ำหนักสุทธิ / NET WEIGHT
                  </span>
                  <p className="text-[12px] font-bold font-mono text-[#657f4d]">
                    {result.weight ? `${result.weight} Kg` : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    อุณหภูมิจัดเก็บ / TEMP SPEC
                  </span>
                  <p className="text-[12px] font-bold text-[#212c46]">
                    {result.storageTemp || "Ambient"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    ขนาดกล่อง / DIMENSIONS
                  </span>
                  <p className="text-[12px] font-bold font-mono text-[#212c46]">
                    {result.dimensions || "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    อายุการเก็บ (วัน) / SHELF LIFE
                  </span>
                  <p className="text-[12px] font-bold font-mono text-[#212c46]">
                    {result.shelfLifeDays
                      ? `${result.shelfLifeDays} วัน (Days)`
                      : "ไม่มีวันหมดอายุ SPEC"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-black text-[#7a8b95] uppercase tracking-wider">
                    รายละเอียดเกณฑ์คลัง / RULES
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {result.isLotTracked && (
                      <span className="text-[8.5px] font-black tracking-wider uppercase px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                        Lot Tracked
                      </span>
                    )}
                    {result.isHazardous && (
                      <span className="text-[8.5px] font-black tracking-wider uppercase px-1.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded">
                        HAZMAT
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Logistic recommendation banner */}
            <div className="bg-[#133951]/10 border border-[#133951]/20 p-4 rounded-xl flex items-start gap-2.5">
              <Icons.Info
                size={16}
                className="text-[#133951] shrink-0 mt-0.5"
              />
              <div className="space-y-1">
                <h4 className="text-[11px] font-black text-[#133951] uppercase tracking-wider leading-none">
                  WMS Logistical Rule Guide
                </h4>
                <p className="text-[10.5px] text-[#414757] leading-relaxed">
                  เมื่อเบิกจ่ายหรือรับผลผลิตภัณฑ์นี้ พนักงานจำต้องสแกนรหัสบาร์โค้ด {result.barcode} หรือพิกัดพาเลททุกครั้ง สำหรับประเภทจัดเก็บ [<b>{result.storageTemp}</b>] แนะนำจัดเก็บเข้าพิกัดแบนด์โซนที่เหมาะกับตัวสเปคบอร์กสินค้า
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onEdit(result);
                }}
                className="flex-1 bg-[#212c46] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Icons.Edit3 size={15} /> แก้ไขข้อมูล SKU Master
              </button>
              {onPrint && (
                <button
                  onClick={() => onPrint(result)}
                  className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#b7a159] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Icons.Printer size={15} /> พิมพ์ Label
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 bg-slate-200 border border-slate-300 text-slate-705 hover:bg-slate-300 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm cursor-pointer"
              >
                ตกลง
              </button>
            </div>
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
