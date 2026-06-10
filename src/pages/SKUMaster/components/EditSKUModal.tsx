import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { DraggableModal } from "../../../components/shared/DraggableModal";
import { HistoryTracking } from "./HistoryTracking";

interface EditSKUModalProps {
  isOpen: boolean;
  onClose: () => void;
  skuData: any;
  onSave: (data: any) => void;
}

export function EditSKUModal({ isOpen, onClose, skuData, onSave }: EditSKUModalProps) {
  const [tempData, setTempData] = useState<any>({});

  useEffect(() => {
    if (isOpen && skuData) {
      setTempData(JSON.parse(JSON.stringify(skuData)));
    }
  }, [isOpen, skuData]);

  if (!isOpen || !skuData || !tempData) return null;

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[750px]"
      customHeader={
        <div className="bg-[#212c46] px-4 py-3 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
              <Icons.Barcode size={24} />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#d7d7d7] uppercase tracking-widest leading-none">
                {tempData.sku || "NEW SKU"}
              </h3>
              <p className="text-[10px] font-bold text-[#d7d7d7]/70 uppercase tracking-widest mt-1 text-left">
                {tempData.name || "PRODUCT DETAILS"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full cursor-pointer"
          >
            <Icons.X size={16} />
          </button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-[#f8f9fa] text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Info */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4 col-span-1 md:col-span-2">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
              <Icons.Info size={14} className="text-[#3f809e]" /> Primary Identification
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={tempData.sku || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, sku: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                />
              </div>
              <div className="space-y-1.5 lg:col-span-2">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Product Details
                </label>
                <input
                  type="text"
                  value={tempData.name || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, name: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Type / Classification
                </label>
                <select
                  value={tempData.type || "Finished Good"}
                  onChange={(e) =>
                    setTempData({ ...tempData, type: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                >
                  <option value="Finished Good">Finished Good (FG)</option>
                  <option value="Raw Material">Raw Material (RM)</option>
                  <option value="Packaging">Packaging (PKG)</option>
                  <option value="Spare Part">Spare Part (SPR)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Asset Category
                </label>
                <input
                  type="text"
                  value={tempData.category || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, category: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Status
                </label>
                <select
                  value={tempData.status || "Active"}
                  onChange={(e) =>
                    setTempData({ ...tempData, status: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                >
                  <option value="Active">Active</option>
                  <option value="Phase Out">Phase Out</option>
                  <option value="Discontinued">Discontinued</option>
                  <option value="Development">Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* Barcode & Physicals */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
              <Icons.ScanBarcode size={14} className="text-[#a94228]" /> Logistic Tracking
            </h4>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Barcode (EAN-13 / Code 128)
                </label>
                <input
                  type="text"
                  value={tempData.barcode || ""}
                  onChange={(e) =>
                    setTempData({ ...tempData, barcode: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Base Unit (หน่วยย่อย)
                  </label>
                  <input
                    type="text"
                    value={tempData.uom || ""}
                    onChange={(e) =>
                      setTempData({ ...tempData, uom: e.target.value })
                    }
                    placeholder="e.g. PACK, PCS"
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Large Unit (หน่วยใหญ่)
                  </label>
                  <input
                    type="text"
                    value={tempData.largeUom || ""}
                    onChange={(e) =>
                      setTempData({ ...tempData, largeUom: e.target.value })
                    }
                    placeholder="e.g. BOX, CTN"
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Conv. (1 L = ? Base)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tempData.uomRatio || 1}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        uomRatio: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Weight (Kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={tempData.weight || 0}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        weight: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dimensions */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
              <Icons.Ruler size={14} className="text-[#3f809e]" /> Dimensions (cm)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  W. (Width)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={
                    tempData.dimensions
                      ?.replace(/[^0-9.xX]/g, "")
                      .split("x")[0] || 0
                  }
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      dimensions: `${e.target.value}x${tempData.dimensions?.split("x")[1] || 0}x${tempData.dimensions?.split("x")[2] || 0}`,
                    })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  L. (Length)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={
                    tempData.dimensions
                      ?.replace(/[^0-9.xX]/g, "")
                      .split("x")[1] || 0
                  }
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      dimensions: `${tempData.dimensions?.split("x")[0] || 0}x${e.target.value}x${tempData.dimensions?.split("x")[2] || 0}`,
                    })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  H. (Height)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={
                    tempData.dimensions
                      ?.replace(/[^0-9.xX]/g, "")
                      .split("x")[2] || 0
                  }
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      dimensions: `${tempData.dimensions?.split("x")[0] || 0}x${tempData.dimensions?.split("x")[1] || 0}x${e.target.value}`,
                    })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Storage & Lifecycle Rules */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4 col-span-1 md:col-span-2">
            <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
              <Icons.ThermometerSnowflake
                size={14}
                className="text-[#3f809e]"
              />{" "}
              Storage & Lifecycle Rules
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Shelf Life / อายุสินค้า (Days)
                </label>
                <input
                  type="number"
                  value={tempData.shelfLifeDays || 0}
                  onChange={(e) =>
                    setTempData({
                      ...tempData,
                      shelfLifeDays: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159] font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                  Storage Temp / อุณหภูมิจัดเก็บ
                </label>
                <select
                  value={tempData.storageTemp || "Ambient"}
                  onChange={(e) =>
                    setTempData({ ...tempData, storageTemp: e.target.value })
                  }
                  className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-lg px-3 py-2 text-[12px] font-bold text-[#212c46] outline-none focus:border-[#b7a159]"
                >
                  <option value="Ambient">Ambient (20-30°C)</option>
                  <option value="Controlled">Controlled (15-25°C)</option>
                  <option value="Cold">Cold Room (2-8°C)</option>
                  <option value="Frozen">Frozen (&lt;-18°C)</option>
                </select>
              </div>
              <div className="space-y-1.5 flex items-center mt-6">
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={tempData.isLotTracked || false}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        isLotTracked: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#eaeaec] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#3f809e] group-hover:after:shadow-md"></div>
                  <span className="ml-3 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Require Lot Tracking
                  </span>
                </label>
              </div>
              <div className="space-y-1.5 flex items-center mt-6">
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={tempData.isHazardous || false}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        isHazardous: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-[#eaeaec] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#a94228] group-hover:after:shadow-md"></div>
                  <span className="ml-3 text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
                    Hazardous Material
                  </span>
                </label>
              </div>
            </div>
          </div>

          <HistoryTracking skuId={tempData.sku} />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="px-5 py-3 bg-white border-t border-[#eaeaec] flex justify-end gap-3 shrink-0 rounded-b-3xl">
        <button
          onClick={onClose}
          className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1] transition-all shadow-sm cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSave(tempData);
            onClose();
          }}
          className="bg-[#212c46] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icons.Save size={14} /> Save Master Data
        </button>
      </div>
    </DraggableModal>
  );
}
