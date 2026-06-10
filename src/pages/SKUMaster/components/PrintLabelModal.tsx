import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { DraggableModal } from "../../../components/shared/DraggableModal";

interface PrintLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "Product" | "Location";
  defaultData?: string;
}

export function PrintLabelModal({ isOpen, onClose, defaultMode, defaultData }: PrintLabelModalProps) {
  const [mode, setMode] = useState<"Product" | "Location">(defaultMode || "Product"); // 'Product' or 'Location'
  const [inputVal, setInputVal] = useState(defaultData || "");

  // Auto sync when opened from outside
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode || "Product");
      setInputVal(defaultData || "");
    }
  }, [isOpen, defaultMode, defaultData]);

  const handlePrint = () => {
    const printContent = document.getElementById("qr-print-area");
    const originalContents = document.body.innerHTML;

    if (printContent) {
      document.body.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; height: 100vh;">
            ${printContent.innerHTML}
        </div>
      `;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload(); // To safely restore React root
    }
  };

  if (!isOpen) return null;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[500px]"
      customHeader={
        <div className="bg-[#133951] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b58c4f]">
          <div className="flex items-center gap-3 text-white">
            <Icons.Printer size={20} className="text-[#b58c4f]" />
            <h3 className="text-sm font-black uppercase tracking-widest leading-none">
              Print Label / QR Code
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-all p-1 cursor-pointer"
          >
            <Icons.X size={18} />
          </button>
        </div>
      }
    >
      <div className="p-6 bg-white flex flex-col gap-6 text-left">
        <div className="flex bg-[#f8f9fa] border border-[#eaeaec] rounded-lg p-1 gap-1">
          <button
            onClick={() => setMode("Product")}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${mode === "Product" ? "bg-[#3f809e] text-white shadow-sm font-black" : "text-[#7a8b95] hover:bg-[#eaeaec]"}`}
          >
            Product SKU
          </button>
          <button
            onClick={() => setMode("Location")}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all cursor-pointer ${mode === "Location" ? "bg-[#3f809e] text-white shadow-sm font-black" : "text-[#7a8b95] hover:bg-[#eaeaec]"}`}
          >
            Shelf Location
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest text-left">
            {mode === "Product"
              ? "Scan Code (EAN/SKU) / รหัสสินค้า"
              : "Location Profile / พิกัดชั้นวาง"}
          </label>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value.toUpperCase())}
            placeholder={
              mode === "Product"
                ? "e.g. 8850123456789 or SKU-8801"
                : "e.g. ZONE-A-01-01"
            }
            className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[14px] font-mono font-black text-[#212c46] outline-none focus:border-[#b7a159]"
          />
        </div>

        <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#eaeaec] rounded-2xl bg-[#f8f9fa]">
          {inputVal ? (
            <div
              id="qr-print-area"
              className="bg-white p-5 rounded-xl shadow-sm border border-[#eaeaec] flex flex-col items-center gap-3 animate-fadeIn"
            >
              <QRCodeSVG value={inputVal} size={150} level={"H"} />
              <div className="text-center font-mono space-y-1">
                <p className="text-[14px] font-black text-black leading-none">
                  {inputVal}
                </p>
                <p className="text-[9px] font-bold text-gray-500 tracking-widest uppercase">
                  {mode} Identifier
                </p>
              </div>
            </div>
          ) : (
            <div className="text-[#ce8a39] text-center p-8 flex flex-col items-center gap-2 opacity-50">
              <Icons.QrCode size={32} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Waiting for input data
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handlePrint}
          disabled={!inputVal}
          className="w-full bg-[#212c46] text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-[#133951] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
        >
          <Icons.Printer size={16} /> Print Configuration (CMD+P)
        </button>
      </div>
    </DraggableModal>
  );
}
