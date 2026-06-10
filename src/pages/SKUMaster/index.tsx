import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";
import { BarcodeScanner } from "../../components/shared/BarcodeScanner";
import { useLanguage } from "../../context/LanguageContext";
import { SKUImportModal } from "./components/SKUImportModal";
import { UserGuidePanel } from "./components/UserGuidePanel";
import { TopPerformingLeaderboard } from "./components/TopPerformingLeaderboard";
import { EditSKUModal } from "./components/EditSKUModal";
import { SKULookupResultModal } from "./components/SKULookupResultModal";
import { PrintLabelModal } from "./components/PrintLabelModal";

// --- Theme Configuration (Synced with System/Home Palette) ---
const THEME = {
  bgMain: "#f3f3f1",
  bgGradient: "transparent",
  sidebarBg: "linear-gradient(180deg, #1d2636 0%, #0F172A 100%)",
  glassWhite: "rgba(255, 255, 255, 0.88)",
  primary: "#212c46",
  primaryLight: "#4d87a8",
  accent: "#a94228",
  gold: "#b58c4f",
  brightGold: "#b7a159",
  success: "#657f4d",
  danger: "#932c2e",
  skyBlue: "#3f809e",
  dustyBlue: "#7a8b95",
  indigo: "#414757",
  softPurple: "#ab7d82",
  deepPurple: "#2d2c4a",
  pinkAccent: "#a54f6b",
  mutedSlate: "#606a5f",
  darkSlate: "#2f2926",
  silver: "#d7d7d7",
  deepNavy: "#212c46",
  brownGold: "#b58c4f",
  vibrantPurple: "#2d2c4a",
  burntOrange: "#d96245",
  slateBlue: "#748ea1",
  coolGray: "#eaeaec",
};

const kebabToPascal = (str: string) =>
  str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

const LucideIcon = ({
  name,
  size = 16,
  className = "",
  color,
  style,
  strokeWidth = 2.5,
}: any) => {
  if (!name) return null;
  if (typeof name !== "string") {
    const IconComponent = name;
    return (
      <IconComponent
        size={size}
        className={className}
        style={{ ...style, color: color }}
        strokeWidth={strokeWidth}
      />
    );
  }
  const pascalName = kebabToPascal(name);
  const IconComponent = (Icons as any)[pascalName] || Icons.HelpCircle;
  return (
    <IconComponent
      size={size}
      className={className}
      style={{ ...style, color: color }}
      strokeWidth={strokeWidth}
    />
  );
};

const formatNumber = (val: number) =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);

// --- KPI Card Components ---
// KPI Card ปรับ padding ให้กระชับ -- ลีน แต่ยังคงความสวยเหมือนเดิม
const KpiCard = ({
  icon,
  value,
  label,
  colorAccent,
  colorValue,
  desc,
}: any) => (
  <div className="bg-white/90 px-4 py-3 rounded-xl border border-[#eaeaec] shadow-sm flex-1 min-w-[180px] relative overflow-hidden group hover:border-[#b7a159] transition-all h-[90px] min-h-[90px] flex flex-col justify-between animate-fadeIn text-left">
    <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
      <LucideIcon name={icon} size={80} color={colorAccent} />
    </div>
    <div className="relative z-10 flex justify-between items-start w-full text-left">
      <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm leading-none mt-1">
        {label}
      </p>
      <div
        className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6`}
        style={{
          backgroundColor: `${colorAccent}15`,
          borderColor: `${colorAccent}25`,
          color: colorAccent,
        }}
      >
        <LucideIcon name={icon} size={16} />
      </div>
    </div>
    <div className="relative z-10 flex items-end justify-between">
      <p
        className="text-[18px] font-black leading-none text-[#212c46]"
        style={{ color: colorValue }}
      >
        {value}
      </p>
      <span className="text-[9px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
        <span className="w-1 h-1 rounded-full bg-current animate-pulse"></span>{" "}
        {desc}
      </span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  let style = { bg: "#eaeaec", color: "#7a8b95", border: "#eaeaec" };
  switch (status) {
    case "Active":
      style = { bg: "#657f4d15", color: THEME.success, border: "#657f4d30" };
      break;
    case "Phase Out":
      style = { bg: "#b58c4f15", color: THEME.gold, border: "#b58c4f30" };
      break;
    case "Discontinued":
      style = { bg: "#932c2e15", color: THEME.danger, border: "#932c2e30" };
      break;
    case "Development":
      style = { bg: "#3f809e15", color: THEME.skyBlue, border: "#3f809e30" };
      break;
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border"
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
      }}
    >
      <div
        className="w-1 h-1 rounded-full animate-pulse"
        style={{ backgroundColor: style.color }}
      ></div>{" "}
      {status}
    </span>
  );
};

















// --- Main Page Component ---
export default function SKUMaster() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("registry");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editModal, setEditModal] = useState<any>({
    isOpen: false,
    skuData: null,
  });
  const [printModal, setPrintModal] = useState<any>({
    isOpen: false,
    mode: "Product",
    data: "",
  });

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleBulkImport = (newItems: any[]) => {
    setInventoryList((prev) => {
      const updatedList = [...prev];
      let maxId = Math.max(0, ...prev.map((i) => i.id));

      newItems.forEach((newItem) => {
        const existingIdx = updatedList.findIndex(
          (item) => String(item.sku).toUpperCase() === String(newItem.sku).toUpperCase()
        );

        if (existingIdx !== -1) {
          updatedList[existingIdx] = {
            ...updatedList[existingIdx],
            ...newItem,
          };
        } else {
          maxId += 1;
          updatedList.unshift({
            ...newItem,
            id: maxId,
          });
        }
      });

      return updatedList;
    });
  };

  const handleBarcodeScan = (scannedCode: string) => {
    setIsScannerOpen(false);

    // Find item by barcode or exact SKU code
    const matchedItem = inventoryList.find(
      (item) =>
        (item.barcode && item.barcode.trim() === scannedCode.trim()) ||
        item.sku.toLowerCase() === scannedCode.toLowerCase(),
    );

    if (matchedItem) {
      setLookupResult(matchedItem);
    } else {
      setLookupResult({ notFound: true, scanCode: scannedCode });
    }
  };

  // 100% Exact original mock examples preserved perfectly
  const [inventoryList, setInventoryList] = useState<any[]>([
    {
      id: 1,
      sku: "SKU-8801",
      name: "Nescafe Red Cup 380g (เนสกาแฟ)",
      category: "Beverage",
      type: "Finished Good",
      uom: "Pack",
      largeUom: "Carton",
      uomRatio: 24,
      weight: 0.38,
      dimensions: "15x10x20",
      barcode: "8850123456789",
      status: "Active",
      shelfLifeDays: 365,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 2,
      sku: "SKU-8802",
      name: "Singha Water 600ml Pack 12",
      category: "Beverage",
      type: "Finished Good",
      uom: "Pack",
      largeUom: "Pack",
      uomRatio: 1,
      weight: 7.2,
      dimensions: "40x25x25",
      barcode: "8851234567890",
      status: "Active",
      shelfLifeDays: 730,
      storageTemp: "Ambient",
      isLotTracked: false,
      isHazardous: false,
    },
    {
      id: 3,
      sku: "SKU-8803",
      name: "Mama Tom Yum Shrimp (มาม่า)",
      category: "Food",
      type: "Finished Good",
      uom: "Pack",
      largeUom: "Box",
      uomRatio: 30,
      weight: 1.8,
      dimensions: "30x40x15",
      barcode: "8852345678901",
      status: "Phase Out",
      shelfLifeDays: 180,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 4,
      sku: "SKU-8804",
      name: "Lays Classic 73g (เลย์)",
      category: "Food",
      type: "Finished Good",
      uom: "Bag",
      largeUom: "Carton",
      uomRatio: 12,
      weight: 0.07,
      dimensions: "20x5x30",
      barcode: "8853456789012",
      status: "Active",
      shelfLifeDays: 180,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 5,
      sku: "SKU-8805",
      name: "Sunlight Lemon 500ml",
      category: "Household",
      type: "Finished Good",
      uom: "Bottle",
      largeUom: "Carton",
      uomRatio: 12,
      weight: 0.5,
      dimensions: "10x5x22",
      barcode: "8854567890123",
      status: "Discontinued",
      shelfLifeDays: 1095,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 6,
      sku: "SKU-8806",
      name: "Chang Beer 320ml Can Pack 24",
      category: "Beverage",
      type: "Finished Good",
      uom: "Can",
      largeUom: "Carton",
      uomRatio: 24,
      weight: 7.68,
      dimensions: "42x28x13",
      barcode: "8855678901234",
      status: "Active",
      shelfLifeDays: 365,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 7,
      sku: "SKU-8807",
      name: "Oishi Green Tea 500ml",
      category: "Beverage",
      type: "Finished Good",
      uom: "Bottle",
      largeUom: "Carton",
      uomRatio: 24,
      weight: 0.5,
      dimensions: "8x8x20",
      barcode: "8856789012345",
      status: "Active",
      shelfLifeDays: 365,
      storageTemp: "Cold",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 8,
      sku: "SKU-8808",
      name: "Breeze Excel Liquid 700ml",
      category: "Household",
      type: "Finished Good",
      uom: "Bottle",
      largeUom: "Carton",
      uomRatio: 12,
      weight: 0.7,
      dimensions: "12x8x25",
      barcode: "8857890123456",
      status: "Active",
      shelfLifeDays: 1095,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 9,
      sku: "SKU-8809",
      name: "Carnation Condensed Milk",
      category: "Food",
      type: "Finished Good",
      uom: "Can",
      largeUom: "Carton",
      uomRatio: 48,
      weight: 0.38,
      dimensions: "7.5x7.5x8",
      barcode: "8858901234567",
      status: "Active",
      shelfLifeDays: 365,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 10,
      sku: "SKU-8810",
      name: "Old Factory Promo T-Shirt",
      category: "Apparel",
      type: "Finished Good",
      uom: "Piece",
      largeUom: "Pack",
      uomRatio: 10,
      weight: 0.2,
      dimensions: "20x15x2",
      barcode: "9900000000010",
      status: "Discontinued",
      shelfLifeDays: 0,
      storageTemp: "Ambient",
      isLotTracked: false,
      isHazardous: false,
    },
    {
      id: 11,
      sku: "SKU-8811",
      name: "M-150 Energy Drink",
      category: "Beverage",
      type: "Finished Good",
      uom: "Bottle",
      largeUom: "Carton",
      uomRatio: 50,
      weight: 0.15,
      dimensions: "5x5x12",
      barcode: "8859012345678",
      status: "Active",
      shelfLifeDays: 730,
      storageTemp: "Ambient",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 12,
      sku: "SKU-8812",
      name: "KFC Frozen French Fries 2kg",
      category: "Frozen",
      type: "Finished Good",
      uom: "Bag",
      largeUom: "Carton",
      uomRatio: 4,
      weight: 2.0,
      dimensions: "30x20x10",
      barcode: "8850123499999",
      status: "Active",
      shelfLifeDays: 540,
      storageTemp: "Frozen",
      isLotTracked: true,
      isHazardous: false,
    },
    {
      id: 13,
      sku: "RM-PKG-001",
      name: "Corrugated Box C-Flute 30x40x20",
      category: "Packaging",
      type: "Raw Material",
      uom: "Piece",
      largeUom: "Bundle",
      uomRatio: 50,
      weight: 0.35,
      dimensions: "30x40x20",
      barcode: "2000000000011",
      status: "Active",
      shelfLifeDays: 0,
      storageTemp: "Ambient",
      isLotTracked: false,
      isHazardous: false,
    },
    {
      id: 14,
      sku: "RM-ING-101",
      name: "Refined Sugar 50Kg Bag",
      category: "Ingredient",
      type: "Raw Material",
      uom: "Bag",
      largeUom: "Pallet",
      uomRatio: 20,
      weight: 50.0,
      dimensions: "60x90x15",
      barcode: "2000000000028",
      status: "Active",
      shelfLifeDays: 730,
      storageTemp: "Controlled",
      isLotTracked: true,
      isHazardous: false,
    },
  ]);

  const filteredInventory = useMemo(() => {
    return inventoryList.filter(
      (item) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.sku.toLowerCase().includes(search.toLowerCase()) ||
        item.barcode.includes(search),
    );
  }, [inventoryList, search]);

  const currentData = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;

  const handleSaveSKU = (savedItem: any) => {
    setInventoryList((prev) => {
      const exists = prev.find(
        (p) => p.sku === savedItem.sku && p.id === savedItem.id,
      );
      if (exists) {
        return prev.map((p) =>
          p.id === savedItem.id ? { ...p, ...savedItem } : p,
        );
      } else {
        return [
          { ...savedItem, id: Math.max(0, ...prev.map((i) => i.id)) + 1 },
          ...prev,
        ];
      }
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">
      {/* USER GUIDE FLOATING TAB */}
      <button
        onClick={() => setIsGuideOpen(true)}
        className="fixed right-0 top-[80px] py-8 px-1.5 fixed bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] rounded-l-xl shadow-md hover:bg-[#932c2e] hover:text-white hover:border-[#932c2e] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group"
      >
        <Icons.HelpCircle
          size={18}
          className="shrink-0 group-hover:rotate-12 transition-transform text-[#7a8b95] group-hover:text-white"
        />
        <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">
          USER GUIDE
        </span>
      </button>

      <UserGuidePanel
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
      <EditSKUModal
        isOpen={editModal.isOpen}
        skuData={editModal.skuData}
        onClose={() => setEditModal({ isOpen: false, skuData: null })}
        onSave={handleSaveSKU}
      />
      <PrintLabelModal
        isOpen={printModal.isOpen}
        onClose={() => setPrintModal({ ...printModal, isOpen: false })}
        defaultMode={printModal.mode}
        defaultData={printModal.data}
      />
      <SKUImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        existingSKUs={inventoryList}
        onImport={handleBulkImport}
      />

      {isScannerOpen && (
        <BarcodeScanner
          title="SKU Barcode Scanner"
          expectedType="all"
          onClose={() => setIsScannerOpen(false)}
          onScan={handleBarcodeScan}
        />
      )}

      <SKULookupResultModal
        isOpen={lookupResult !== null}
        onClose={() => setLookupResult(null)}
        result={lookupResult}
        onEdit={(item) => {
          setLookupResult(null);
          setEditModal({ isOpen: true, skuData: item });
        }}
        onCreateNew={(scannedCode) => {
          setLookupResult(null);
          setEditModal({
            isOpen: true,
            skuData: {
              sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
              barcode: scannedCode,
              status: "Active",
              uom: "Box",
            },
          });
        }}
        onScanQuery={() => {
          setIsScannerOpen(true);
        }}
        onPrint={(item) => {
          setLookupResult(null);
          setPrintModal({ isOpen: true, mode: "Product", data: item.sku });
        }}
      />

      {/* HEADER SECTION */}
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
        <div className="flex items-center gap-5 text-left">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Icons.Barcode
                size={28}
                strokeWidth={2.5}
                className="text-[#3f809e]"
              />
            </div>
          </div>
          <div>
            <h3
              className="font-black text-[#212c46] uppercase tracking-tighter leading-none"
              style={{ fontSize: "24px" }}
            >
              {t("ระบบฐานข้อมูลสินค้า", "SKU ")}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">
                {t("และบาร์โค้ด", "MASTER")}
              </span>{" "}
              {t("", "(BARCODE)")}
            </h3>
            <div className="flex items-center gap-1.5 mt-[6px]">
              <div className="w-10 h-[2px] bg-[#3f809e]"></div>
              <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                {t(
                  "จัดการรหัสสินค้า บาร์โค้ด และมิติมาตรฐาน",
                  "Manage item profiles, barcodes, and standard dimensions",
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
            <button
              onClick={() => setActiveTab("registry")}
              className={`px-6 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === "registry" ? "bg-[#212c46] text-white shadow-md" : "text-[#7a8b95] hover:text-[#a94228]"}`}
            >
              <Icons.Database size={16} /> Global SKU Registry
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full mt-[-2px]">
        <div className="w-full">
          {/* KPI STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
            <KpiCard
              label={t("สินค้าพร้อมใช้งาน", "Active SKUs")}
              value={inventoryList.filter((i) => i.status === "Active").length}
              icon="boxes"
              colorAccent={THEME.skyBlue}
              colorValue={THEME.primary}
              desc={t("พร้อมสำหรับโลจิสติกส์", "Ready for Logisitcs")}
            />
            <KpiCard
              label={t("สินค้ารวมทั้งหมด", "Total Registered Item")}
              value={inventoryList.length}
              icon="list-ordered"
              colorAccent={THEME.gold}
              colorValue={THEME.primary}
              desc={t("ข้อมูลระบบหลัก", "System Master Data")}
            />
            <KpiCard
              label={t("สถานะทดลอง", "Development Items")}
              value={
                inventoryList.filter((i) => i.status === "Development").length
              }
              icon="flask-conical"
              colorAccent={THEME.accent}
              colorValue={THEME.primary}
              desc={t("แบบร่าง / ภายใน", "Draft / Internal")}
            />
            <KpiCard
              label={t("การรักษาความปลอดภัย", "Security Check")}
              value={t("ปลอดภัย", "SECURED")}
              icon="shield-check"
              colorAccent={THEME.success}
              colorValue={THEME.success}
              desc={t("ตรวจสอบข้อมูลแล้ว", "Data Audited")}
            />
          </div>

          <TopPerformingLeaderboard />

          <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn text-left">
            <div className="px-6 py-4 border-b border-[#eaeaec] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 w-full md:w-auto text-[12px]">
                <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1.5 rounded-xl text-[#7a8b95] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
                  <Icons.Barcode size={14} className="text-[#3f809e]" />{" "}
                  {t("ระบบรายการตรวจสอบ SKU", "SYSTEM SKU MASTER DIRECTORY")}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Icons.Search
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a8b95]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search Name, SKU, Barcode..."
                    className="w-full pl-10 pr-5 py-2 text-[12px] border border-[#eaeaec] rounded-xl font-bold outline-none focus:border-[#4d87a8] bg-[#f8f9fa] shadow-sm text-[#212c46]"
                  />
                </div>
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="bg-[#3f809e] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#2d5f76] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#3f809e]"
                >
                  <Icons.ScanLine size={14} /> Scan Barcode
                </button>
                <button
                  onClick={() =>
                    setPrintModal({ isOpen: true, mode: "Product", data: "" })
                  }
                  className="bg-white text-[#212c46] px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#f8f9fa] transition-all flex items-center gap-2 shrink-0 border border-[#eaeaec] hover:border-[#b7a159]"
                >
                  <Icons.Printer size={14} /> Print Label
                </button>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="bg-emerald-700 text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-emerald-800 hover:text-white transition-all flex items-center gap-2 shrink-0 border border-emerald-600 cursor-pointer"
                >
                  <Icons.FileSpreadsheet size={14} /> Import CSV
                </button>
                <button
                  onClick={() =>
                    setEditModal({
                      isOpen: true,
                      skuData: {
                        sku: `SKU-${Math.floor(Math.random() * 9000) + 1000}`,
                        status: "Active",
                        uom: "Box",
                      },
                    })
                  }
                  className="bg-[#212c46] text-white px-5 py-2 rounded-xl font-black text-[12px] uppercase tracking-widest shadow-md hover:bg-[#414757] hover:text-white transition-all flex items-center gap-2 shrink-0 border border-[#212c46]"
                >
                  <Icons.Plus size={14} /> Add SKU
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar bg-white">
              <table className="w-full text-left font-sans border-collapse min-w-[1100px]">
                <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                  <tr>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">
                      รหัสสินค้า (SKU)
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">
                      รายละเอียดสินค้า
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">
                      หมวดหมู่ / ประเภท
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">
                      รหัสบาร์โค้ด (EAN)
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">
                      หน่วยนับ (UoM)
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-left">
                      เงื่อนไขการจัดเก็บ
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">
                      สถานะ
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">
                      การจัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#eaeaec]/60">
                  {currentData.length > 0 ? (
                    currentData.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setLookupResult(item)}
                        className="hover:bg-[#f3f3f1]/60 transition-colors group cursor-pointer"
                        title="คลิกเพื่อดูรายละเอียดเชิงลึกของสินค้านี้ / Click for SKU details"
                      >
                        <td className="py-2.5 px-4 font-mono font-black text-[#3f809e] text-[12px] text-left">
                          {item.sku}
                        </td>
                        <td className="py-2.5 px-4 font-black text-[#212c46] text-[12px] text-left">
                          <div className="truncate max-w-[280px]">
                            {item.name}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-left">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="bg-[#212c46]/10 text-[#212c46] px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border border-[#212c46]/20">
                              {item.category}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                              {item.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-left text-[12px] font-mono font-bold text-[#7a8b95]">
                          <div className="flex items-center gap-2">
                            <Icons.Barcode
                              size={14}
                              className="text-[#7a8b95]/50"
                            />{" "}
                            {item.barcode || "-"}
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="font-black text-[#212c46] text-[12px] uppercase">
                              {item.uom}
                            </span>
                            {item.largeUom && item.uomRatio > 1 && (
                              <span className="text-[9px] font-bold text-[#a94228] uppercase tracking-widest bg-[#a94228]/10 px-1 py-0.5 rounded">
                                1 {item.largeUom} = {item.uomRatio} {item.uom}
                              </span>
                            )}
                            <span className="text-[10px] font-bold text-[#657f4d] font-mono mt-0.5">
                              {item.weight
                                ? `${formatNumber(item.weight)} Kg`
                                : "-"}
                            </span>
                            <span className="text-[9px] text-[#7a8b95] font-mono">
                              {item.dimensions || "-"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-left">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${item.storageTemp === "Cold" || item.storageTemp === "Frozen" ? "bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/20" : "bg-[#eaeaec]/50 text-[#7a8b95] border-[#eaeaec]"}`}
                            >
                              {item.storageTemp}
                            </span>
                            <span className="text-[9px] font-bold text-[#a94228] uppercase tracking-widest">
                              {item.shelfLifeDays
                                ? `EXP: ${item.shelfLifeDays} DAY`
                                : "NO EXP"}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <StatusBadge status={item.status} />
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <div className="flex justify-center items-center gap-[1px]">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditModal({ isOpen: true, skuData: item });
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-[#7a8b95] hover:bg-[#eaeaec] hover:text-[#212c46] transition-all"
                              title="Edit SKU Details"
                            >
                              <Icons.Edit size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 text-center text-[12px] font-extrabold text-[#7a8b95] uppercase"
                      >
                        No SKUs match search attributes.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-[#f8f9fa] border-t border-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 rounded-b-3xl text-[12px]">
              <div className="flex items-center gap-5 text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <span>Display Rows:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#eaeaec] rounded-md px-2 py-1 outline-none font-black text-[#212c46] cursor-pointer shadow-sm"
                  >
                    {[10, 20, 50, 100].map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="bg-white px-3 py-1 rounded-md border border-[#eaeaec] shadow-sm font-mono text-black font-bold">
                  Count: {filteredInventory.length}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-[#212c46] hover:text-white active:scale-90 shadow-sm"}`}
                >
                  <Icons.ChevronLeft size={14} />
                </button>
                <div className="bg-white text-[#212c46] px-4 py-1.5 rounded-md font-black text-[11px] min-w-[100px] text-center uppercase tracking-widest border border-[#eaeaec] shadow-sm">
                  Page {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`w-8 h-8 border border-[#eaeaec] bg-white rounded-md flex items-center justify-center transition-all ${currentPage === totalPages ? "opacity-30 cursor-not-allowed" : "hover:bg-[#212c46] hover:text-white active:scale-90 shadow-sm"}`}
                >
                  <Icons.ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
