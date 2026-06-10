import React from "react";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";

interface UserGuidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserGuidePanel({ isOpen, onClose }: UserGuidePanelProps) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[#b7a159] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-3 px-4 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-2 uppercase tracking-widest text-[14px]">
              <Icons.Barcode size={18} className="text-[#b7a159]" /> MASTER DATA GUIDE
            </h3>
            <p className="text-[10px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-0.5">
              SKU & Barcode Management
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"
          >
            <Icons.X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Database size={16} className="text-[#b7a159]" /> 1. Data Integrity Rules
            </h4>
            <p className="text-[11px] mb-2">
              การตั้งค่ารหัสสินค้าและบาร์โค้ด จะเชื่อมโยงไปทุกระบบใน WMS:
            </p>
            <ul className="list-none pl-0 space-y-2">
              <li className="flex items-start gap-2 bg-[#f8f9fa] p-2.5 rounded-xl border border-[#eaeaec]">
                <Icons.Key
                  size={14}
                  className="shrink-0 text-[#4d87a8] mt-0.5"
                />
                <div className="text-[11px]">
                  <strong className="text-[#4d87a8]">Unique SKU:</strong> รหัสสินค้า (SKU) ห้ามซ้ำกันโดยเด็ดขาด การแก้ไขจะมีผลต่อ Stock History
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2.5 rounded-xl border border-[#932c2e]/30">
                <Icons.ScanLine
                  size={14}
                  className="shrink-0 text-[#932c2e] mt-0.5"
                />
                <div className="text-[11px]">
                  <strong className="text-[#932c2e]">Global Barcode:</strong> ระบบรองรับ EAN-13, EAN-8 และ Code 128 (สำหรับรหัสภายใน) รวมถึงรองรับการ <strong className="text-[#932c2e]">แสกนผ่านกล้อง (Camera Scanner)</strong>
                </div>
              </li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Move size={16} className="text-[#3f809e]" /> 2. Draggable Workspace (การลากย้ายหน้าต่าง)
            </h4>
            <p className="text-[11px] mb-2">
              หน้าต่างข้อมูลระดับลึก เช่น "แก้ไขรายละเอียด SKU" สามารถลากสลับตำแหน่งได้ (Drag & Drop Modals) เพื่อให้ผู้ใช้งานสะดวกในการอ้างอิงข้อมูลกับตารางด้านหลังได้พร้อมๆ กัน
            </p>
          </section>

          <section
            className="animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Box size={16} className="text-[#d96245]" /> 2. Dimensions & Weight
            </h4>
            <p className="text-[11px] mb-2">
              ข้อมูลน้ำหนักและขนาดมีความสำคัญต่อการคำนวณ:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
              <li>
                <strong className="text-[#4d87a8]">Smart Putaway:</strong> ใช้คำนวณปริมาตรว่าสินค้าสามารถจัดเก็บบน Rack ชั้นใดได้บ้าง
              </li>
              <li>
                <strong className="text-[#d96245]">Route Optimization:</strong> คำนวณน้ำหนักรวมของรถบรรทุก (Payload Capacity)
              </li>
              <li>
                <strong className="text-[#212c46]">Volumetric Weight:</strong> สำหรับคิดค่าบริการพื้นที่ Storage Billing
              </li>
            </ul>
          </section>

          <section
            className="animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Activity size={16} className="text-[#3f809e]" /> 3. Status Control
            </h4>
            <p className="text-[11px] leading-relaxed">
              สเตตัส <b>Active</b> พร้อมใช้งานรับ/จ่ายทันที, <b>Phase Out</b> แจ้งเตือนจัดเรียงระบายของออกงดสั่งเพิ่ม, <b>Discontinued</b> ปิดกั้นการนำเข้าหรือเบิกจ่าย (ล็อกทันที)
            </p>
          </section>
        </div>

        <div className="p-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#212c46] text-white font-black rounded-xl uppercase text-[11px] hover:bg-[#414757] transition-all shadow-sm tracking-[0.1em]"
          >
            Got It
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
