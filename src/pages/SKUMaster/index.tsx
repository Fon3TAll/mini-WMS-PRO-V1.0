import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import * as Icons from "lucide-react";
import * as d3 from "d3";
import { DraggableModal } from "../../components/shared/DraggableModal";
import { BarcodeScanner } from "../../components/shared/BarcodeScanner";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "../../context/LanguageContext";

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

// user guide ปรับ padding ให้กระชับ -- ลีน สวย
function UserGuidePanel({ isOpen, onClose }: any) {
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
              <Icons.Barcode size={18} className="text-[#b7a159]" /> MASTER DATA
              GUIDE
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
              <Icons.Database size={16} className="text-[#b7a159]" /> 1. Data
              Integrity Rules
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
                  <strong className="text-[#4d87a8]">Unique SKU:</strong>{" "}
                  รหัสสินค้า (SKU) ห้ามซ้ำกันโดยเด็ดขาด การแก้ไขจะมีผลต่อ Stock
                  History
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#932c2e]/10 p-2.5 rounded-xl border border-[#932c2e]/30">
                <Icons.ScanLine
                  size={14}
                  className="shrink-0 text-[#932c2e] mt-0.5"
                />
                <div className="text-[11px]">
                  <strong className="text-[#932c2e]">Global Barcode:</strong>{" "}
                  ระบบรองรับ EAN-13, EAN-8 และ Code 128 (สำหรับรหัสภายใน)
                  รวมถึงรองรับการ{" "}
                  <strong className="text-[#932c2e]">
                    แสกนผ่านกล้อง (Camera Scanner)
                  </strong>
                </div>
              </li>
            </ul>
          </section>

          <section className="animate-fadeIn">
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Move size={16} className="text-[#3f809e]" /> 2. Draggable
              Workspace (การลากย้ายหน้าต่าง)
            </h4>
            <p className="text-[11px] mb-2">
              หน้าต่างข้อมูลระดับลึก เช่น "แก้ไขรายละเอียด SKU"
              สามารถลากสลับตำแหน่งได้ (Drag & Drop Modals)
              เพื่อให้ผู้ใช้งานสะดวกในการอ้างอิงข้อมูลกับตารางด้านหลังได้พร้อมๆ
              กัน
            </p>
          </section>

          <section
            className="animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Box size={16} className="text-[#d96245]" /> 2. Dimensions &
              Weight
            </h4>
            <p className="text-[11px] mb-2">
              ข้อมูลน้ำหนักและขนาดมีความสำคัญต่อการคำนวณ:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[11px]">
              <li>
                <strong className="text-[#4d87a8]">Smart Putaway:</strong>{" "}
                ใช้คำนวณปริมาตรว่าสินค้าสามารถจัดเก็บบน Rack ชั้นใดได้บ้าง
              </li>
              <li>
                <strong className="text-[#d96245]">Route Optimization:</strong>{" "}
                คำนวณน้ำหนักรวมของรถบรรทุก (Payload Capacity)
              </li>
              <li>
                <strong className="text-[#212c46]">Volumetric Weight:</strong>{" "}
                สำหรับคิดค่าบริการพื้นที่ Storage Billing
              </li>
            </ul>
          </section>

          <section
            className="animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h4 className="text-[13px] font-black text-[#212c46] mb-2 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-1.5 font-mono">
              <Icons.Activity size={16} className="text-[#3f809e]" /> 3. Status
              Control
            </h4>
            <p className="text-[11px] leading-relaxed">
              สเตตัส <b>Active</b> พร้อมใช้งานรับ/จ่ายทันที, <b>Phase Out</b>{" "}
              แจ้งเตือนจัดเรียงระบายของออกงดสั่งเพิ่ม, <b>Discontinued</b>{" "}
              ปิดกั้นการนำเข้าหรือเบิกจ่าย (ล็อกทันที)
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

const HistoryTracking = ({ skuId }: { skuId: string }) => {
  const mockHistory = [
    {
      date: "2023-11-20 14:15",
      user: "Admin User",
      action: "Created SKU Code",
    },
    {
      date: "2023-11-22 09:45",
      user: "Store Manager",
      action: "Updated Dimensions",
    },
    { date: "2023-11-25 10:30", user: "System", action: "Changed Base Unit" },
    {
      date: "2023-11-28 16:20",
      user: "Store Manager",
      action: "Auto-updated Weight",
    },
    {
      date: "2023-12-01 11:00",
      user: "Admin User",
      action: "Modified Product Details",
    },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-[#eaeaec] space-y-4 col-span-1 md:col-span-2">
      <h4 className="text-[12px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 flex items-center gap-2">
        <Icons.History size={14} className="text-[#3f809e]" /> History Tracking
      </h4>
      <div className="space-y-4">
        {mockHistory.map((item, idx) => (
          <div
            key={idx}
            className="flex gap-3 text-sm border-b border-gray-100 last:border-0 pb-3 last:pb-0"
          >
            <div className="flex flex-col items-center mt-1">
              <div className="w-2 h-2 rounded-full bg-[#b7a159]"></div>
              {idx !== mockHistory.length - 1 && (
                <div className="w-[1px] h-full bg-gray-200 mt-1"></div>
              )}
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#212c46]">
                {item.action}
              </p>
              <p className="text-[10px] uppercase font-bold text-[#7a8b95]">
                {item.date} • {item.user}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopPerformingLeaderboard = () => {
  const chartRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!chartRef.current) return;

    const data = [
      {
        id: "SKU-8801",
        name: "Nescafe Red Cup 380g",
        score: 95,
        color: "#3f809e",
      },
      {
        id: "SKU-2094",
        name: "Singha Soda Water",
        score: 88,
        color: "#b7a159",
      },
      { id: "SKU-0012", name: "Lays Classic 50g", score: 82, color: "#657f4d" },
      {
        id: "SKU-1002",
        name: "M-150 Energy Drink",
        score: 76,
        color: "#a94228",
      },
      {
        id: "SKU-3050",
        name: "Mama Shrimp Tom Yum",
        score: 65,
        color: "#b58c4f",
      },
    ];

    const width = chartRef.current.clientWidth;
    const height = 200;
    const margin = { top: 20, right: 30, bottom: 30, left: 160 };

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("display", "block");

    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0))
      .attr("y", (d) => y(d.name)!)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", (d) => d.color)
      .attr("rx", 4)
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("width", (d) => x(d.score) - x(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0).tickSizeInner(0))
      .call((g) => g.select(".domain").remove())
      .selectAll("text")
      .style(
        "font-family",
        "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont",
      )
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "#414757");

    svg
      .selectAll(".value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", (d) => x(d.score) + 5)
      .attr("y", (d) => y(d.name)! + y.bandwidth() / 2 + 4)
      .text((d) => d.score + " pts")
      .style("font-size", "10px")
      .style("font-weight", "bold")
      .style("fill", "#7a8b95")
      .style("opacity", 0)
      .transition()
      .delay(1000)
      .duration(500)
      .style("opacity", 1);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#eaeaec] shadow-sm animate-fadeIn text-left mt-4 mb-4">
      <h4 className="text-[14px] font-black text-[#212c46] uppercase border-b border-[#eaeaec] pb-2 mb-4 flex items-center gap-2">
        <Icons.Trophy size={16} className="text-[#b7a159]" />
        Top Performing Items Pipeline
      </h4>
      <div ref={chartRef} className="w-full h-[200px]" />
    </div>
  );
};

function EditSKUModal({ isOpen, onClose, skuData, onSave }: any) {
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
            className="text-white/70 hover:text-[#932c2e] transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
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
              <Icons.Info size={14} className="text-[#3f809e]" /> Primary
              Identification
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
              <Icons.ScanBarcode size={14} className="text-[#a94228]" />{" "}
              Logistic Tracking
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
                        weight: parseFloat(e.target.value),
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
              <Icons.Ruler size={14} className="text-[#3f809e]" /> Dimensions
              (cm)
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
                      shelfLifeDays: parseInt(e.target.value),
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
          className="px-5 py-2 bg-white border border-[#eaeaec] text-[#414757] rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#f3f3f1] transition-all shadow-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onSave(tempData);
            onClose();
          }}
          className="bg-[#212c46] text-white px-6 py-2 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-md hover:bg-[#414757] transition-all flex items-center gap-2"
        >
          <Icons.Save size={14} /> Save Master Data
        </button>
      </div>
    </DraggableModal>
  );
}

interface SKULookupResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any;
  onEdit: (item: any) => void;
  onCreateNew: (barcode: string) => void;
  onScanQuery: () => void;
  onPrint?: (item: any) => void;
}

function SKULookupResultModal({
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
              className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm ${isNotFound ? "bg-[#932c2e]/10 text-[#932c2e] border-[#932c2e]/25 animate-pulse" : "bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/20"}`}
            >
              {isNotFound ? (
                <Icons.ShieldAlert size={22} />
              ) : (
                <Icons.CheckCircle size={22} />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest leading-none">
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
            className="text-white/75 hover:text-red-400 transition-all bg-white/10 hover:bg-white/20 p-1.5 rounded-full"
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
                className="w-full bg-[#3f809e] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#2d5f76] transition-all flex items-center justify-center gap-2 shadow-md border border-[#3f809e]"
              >
                <Icons.PlusSquare size={16} /> ลงทะเบียนสารบบสินค้าใหม่
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onScanQuery();
                  }}
                  className="bg-white border border-[#eaeaec] text-[#212c46] py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#f3f3f1] transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icons.ScanLine size={14} /> สแกนอีกครั้ง
                </button>
                <button
                  onClick={onClose}
                  className="bg-[#212c46] text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-750 transition-all flex items-center justify-center shadow-sm"
                >
                  ปิดหน้าต่าง
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
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
                  เมื่อเบิกจ่ายหรือรับผลผลิตภัณฑ์นี้
                  พนักงานจำต้องสแกนรหัสบาร์โค้ด {result.barcode}{" "}
                  หรือพิกัดพาเลททุกครั้ง สำหรับประเภทจัดเก็บ [
                  <b>{result.storageTemp}</b>]
                  แนะนำจัดเก็บเข้าพิกัดแบนด์โซนที่เหมาะกับตัวสเปคบอร์กสินค้า
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => {
                  onEdit(result);
                }}
                className="flex-1 bg-[#212c46] text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#414757] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Icons.Edit3 size={15} /> แก้ไขข้อมูล SKU Master
              </button>
              {onPrint && (
                <button
                  onClick={() => onPrint(result)}
                  className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#b7a159] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Icons.Printer size={15} /> พิมพ์ Label
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 bg-slate-200 border border-slate-300 text-slate-705 hover:bg-slate-300 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-sm"
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

function PrintLabelModal({ isOpen, onClose, defaultMode, defaultData }: any) {
  const [mode, setMode] = useState(defaultMode || "Product"); // 'Product' or 'Location'
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
            className="text-white/70 hover:text-white transition-all p-1"
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
            className={`flex-1 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${mode === "Product" ? "bg-[#3f809e] text-white shadow-sm" : "text-[#7a8b95] hover:bg-[#eaeaec]"}`}
          >
            Product SKU
          </button>
          <button
            onClick={() => setMode("Location")}
            className={`flex-1 py-1.5 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${mode === "Location" ? "bg-[#3f809e] text-white shadow-sm" : "text-[#7a8b95] hover:bg-[#eaeaec]"}`}
          >
            Shelf Location
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-black text-[#7a8b95] uppercase tracking-widest">
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
              className="bg-white p-5 rounded-xl shadow-sm border border-[#eaeaec] flex flex-col items-center gap-3"
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
          className="w-full bg-[#212c46] text-white py-3 rounded-xl font-black text-[12px] uppercase tracking-widest hover:bg-[#133951] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          <Icons.Printer size={16} /> Print Configuration (CMD+P)
        </button>
      </div>
    </DraggableModal>
  );
}

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
