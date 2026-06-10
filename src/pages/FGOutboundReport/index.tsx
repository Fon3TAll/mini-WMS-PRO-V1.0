import React, { useState, useMemo } from "react";
import * as Icons from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { PrintPreviewModal } from "../../components/shared/PrintPreviewModal";

const THEME = {
  primary: "#212c46",
  primaryLight: "#4d87a8",
  gold: "#b58c4f",
  success: "#657f4d",
  danger: "#932c2e",
};

const KpiCard = ({
  icon,
  value,
  label,
  colorAccent,
  colorValue,
  desc,
}: any) => {
  const IconCmp = (Icons[icon as keyof typeof Icons] as any) || Icons.Circle;
  return (
    <div className="bg-white/90 px-4 py-3 rounded-2xl border border-[#eaeaec] shadow-sm flex-1 min-w-[200px] relative overflow-hidden group hover:border-[#b7a159] transition-all min-h-[96px] flex flex-col justify-between animate-fadeIn">
      <div className="absolute -right-4 -bottom-6 opacity-[0.05] transform group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <IconCmp size={100} color={colorAccent} />
      </div>
      <div className="relative z-10 flex justify-between items-start w-full">
        <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-[0.1em] drop-shadow-sm">
          {label}
        </p>
        <div
          className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:rotate-6"
          style={{
            backgroundColor: `${colorAccent}15`,
            borderColor: `${colorAccent}25`,
            color: colorAccent,
          }}
        >
          <IconCmp size={16} />
        </div>
      </div>
      <div className="relative z-10 mt-1 flex items-end justify-between">
        <p
          className="text-[24px] font-black leading-none text-[#212c46]"
          style={{ color: colorValue }}
        >
          {value}
        </p>
        <span className="text-[10px] font-bold text-[#4d87a8] uppercase tracking-widest flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>{" "}
          {desc}
        </span>
      </div>
    </div>
  );
};

export default function FGOutboundReport() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("2023-11-01");
  const [endDate, setEndDate] = useState("2023-11-30");

  const records = [
    {
      id: "DO-FG-202311-001",
      customer: "Global Supply Co.",
      material: "FG-01: Pro Widget",
      date: "2023-11-20",
      qty: 500,
      unit: "boxes",
      status: "Dispatched",
    },
    {
      id: "DO-FG-202311-002",
      customer: "Regional Mart",
      material: "FG-05: Smart Hub",
      date: "2023-11-20",
      qty: 150,
      unit: "boxes",
      status: "Picking",
    },
    {
      id: "DO-FG-202311-003",
      customer: "Tech Solutions Ltd.",
      material: "FG-12: Adapter Base",
      date: "2023-11-21",
      qty: 1200,
      unit: "pcs",
      status: "Loaded",
    },
    {
      id: "DO-FG-202311-004",
      customer: "Global Supply Co.",
      material: "FG-01: Pro Widget",
      date: "2023-11-21",
      qty: 350,
      unit: "boxes",
      status: "Pending",
    },
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(
      (r) => {
        const matchesSearch = r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.customer.toLowerCase().includes(search.toLowerCase()) ||
          r.material.toLowerCase().includes(search.toLowerCase());
        
        const rDate = new Date(r.date);
        const sDate = startDate ? new Date(startDate) : null;
        const eDate = endDate ? new Date(endDate) : null;
        
        let matchesDate = true;
        if (sDate) matchesDate = matchesDate && rDate >= sDate;
        if (eDate) matchesDate = matchesDate && rDate <= eDate;

        return matchesSearch && matchesDate;
      }
    );
  }, [search, startDate, endDate]);

  const [previewItem, setPreviewItem] = useState<any>(null);
  const handlePrintDocument = (item: any) => {
      setPreviewItem(item);
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 overflow-y-auto">
      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center group cursor-default shrink-0">
            <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
            <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
              <Icons.Truck
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
              {t("รายงานการจ่ายสินค้าออก", "FINISHED GOODS OUTBOUND")}
            </h3>
            <p className="text-[11px] font-bold text-[#4d5a44] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none font-sans">
              {t(
                "ตรวจสอบประวัติการจัดส่งและจ่ายสินค้า",
                "DISPATCH & SHIPPING MONITORING",
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-8 sm: w-full mt-[2px]">
        <div className="w-full">
          {/* KPI STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
            <KpiCard
              label={t("รายการเอกสาร", "Total Outbound")}
              value={records.length}
              icon="FileText"
              colorAccent={THEME.primaryLight}
              colorValue={THEME.primary}
              desc={t("เอกสารส่งออกทั้งหมด", "Delivery Orders")}
            />
            <KpiCard
              label={t("จัดส่งแล้ว", "Dispatched")}
              value={records.filter((r) => r.status === "Dispatched").length}
              icon="CheckCircle"
              colorAccent={THEME.success}
              colorValue={THEME.success}
              desc={t("สินค้าออกจากคลังแล้ว", "Left Warehouse")}
            />
            <KpiCard
              label={t("กำลังหยิบ/แพ็ค", "In Progress")}
              value={
                records.filter(
                  (r) => r.status === "Picking" || r.status === "Loaded",
                ).length
              }
              icon="Truck"
              colorAccent={THEME.gold}
              colorValue={THEME.primary}
              desc={t("กำลังดำเนินการ", "Being Processed")}
            />
            <KpiCard
              label={t("รอดำเนินการ", "Pending")}
              value={records.filter((r) => r.status === "Pending").length}
              icon="Clock"
              colorAccent={THEME.danger}
              colorValue={THEME.danger}
              desc={t("ยังไม่เริ่มดำเนินการ", "Awaiting Action")}
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn mt-8">
            <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center bg-white border border-[#eaeaec] rounded-xl shadow-sm px-3 py-1.5 gap-2">
                   <Icons.Calendar size={14} className="text-[#a54f6b]" />
                   <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-[11px] font-bold text-[#212c46] outline-none bg-transparent" />
                   <span className="text-slate-300">-</span>
                   <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-[11px] font-bold text-[#212c46] outline-none bg-transparent" />
                </div>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Icons.Search
                    size={16}
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("ค้นหาเอกสาร...", "Search document...")}
                    className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-auto custom-scrollbar bg-[#f8f9fa]">
              <table className="w-full text-left font-sans border-collapse print-layout-table">
                <thead className="bg-[#222b38] text-white">
                  <tr className="border-b-2 border-[#b58c4f]">
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">
                      {t("เลขที่เอกสาร", "Document ID")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">
                      {t("วันที่จัดส่ง", "Date")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">
                      {t("ลูกค้า", "Customer")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">
                      {t("สินค้า", "Product")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">
                      {t("จำนวน", "Quantity")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">
                      {t("สถานะ", "Status")}
                    </th>
                    <th className="py-4 px-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center no-print">
                      {t("งานพิมพ์", "Action")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#eaeaec]">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#f8f9fa] transition-colors group"
                      >
                        <td className="py-2.5 px-4">
                          <span className="font-black text-[#212c46] text-[12px] font-mono">
                            {item.id}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-[12px] text-[#7a8b95] font-bold">
                          {item.date}
                        </td>
                        <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-bold">
                          {item.customer}
                        </td>
                        <td className="py-2.5 px-4 text-[12px] text-[#4d87a8] font-bold">
                          {item.material}
                        </td>
                        <td className="py-2.5 px-4 text-[12px] text-[#212c46] font-black text-right">
                          {item.qty.toLocaleString()}{" "}
                          <span className="text-[#7a8b95] font-bold text-[10px]">
                            {item.unit}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          {item.status === "Dispatched" ? (
                            <span className="inline-flex items-center justify-center bg-[#657f4d]/10 text-[#657f4d] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#657f4d]/20">
                              <Icons.Check size={10} className="mr-1" />{" "}
                              {item.status}
                            </span>
                          ) : item.status === "Pending" ? (
                            <span className="inline-flex items-center justify-center bg-[#932c2e]/10 text-[#932c2e] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#932c2e]/20">
                              <Icons.Clock size={10} className="mr-1" />{" "}
                              {item.status}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center bg-[#b58c4f]/10 text-[#b58c4f] px-2.5 py-1 rounded-sm text-[11px] font-black uppercase tracking-widest border border-[#b58c4f]/20">
                              <Icons.Truck size={10} className="mr-1" />{" "}
                              {item.status}
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 text-center no-print">
                            <button onClick={() => handlePrintDocument(item)} className="p-1.5 text-slate-400 hover:text-[#3f809e] transition-colors rounded-lg hover:bg-sky-50" title={t('ตัวอย่างก่อนพิมพ์', 'Print Preview')}>
                                <Icons.Eye size={16} />
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-[#7a8b95] font-bold text-[12px]"
                      >
                        {t("ไม่พบข้อมูล", "No records found.")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-3 bg-[#f8f9fa] border-t border-t-[#eaeaec] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0 font-sans">
              <div className="text-[11px] font-black text-[#7a8b95] uppercase tracking-widest">
                Showing {filteredRecords.length} of {records.length} records
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 shrink-0"></div>

      {previewItem && (
        <PrintPreviewModal
            isOpen={!!previewItem}
            onClose={() => setPreviewItem(null)}
            title={`Delivery Order: ${previewItem.id}`}
            docId={previewItem.id}
            revision="1.0"
        >
            <div className="py-8 text-slate-700 leading-loose">
                <h2 className="text-lg font-bold mb-4 border-b border-dashed border-slate-300 pb-2">Delivery Information</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Customer</p>
                        <p className="font-bold text-[#212c46]">{previewItem.customer}</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase">Date</p>
                        <p className="font-bold text-[#212c46]">{previewItem.date}</p>
                    </div>
                </div>

                <table className="w-full text-left font-sans border-collapse mb-8 print-layout-table border border-[#eaeaec]">
                    <thead className="bg-[#f8f9fa] text-[#212c46]">
                        <tr>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] border-b border-[#eaeaec]">Product</th>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] border-b border-[#eaeaec] text-right">Quantity</th>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] border-b border-[#eaeaec] text-right">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2 px-3 border-b border-[#eaeaec] text-[12px] font-bold">{previewItem.material}</td>
                            <td className="py-2 px-3 border-b border-[#eaeaec] text-[12px] text-right font-mono">{previewItem.qty.toLocaleString()}</td>
                            <td className="py-2 px-3 border-b border-[#eaeaec] text-[12px] text-right">{previewItem.unit}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </PrintPreviewModal>
      )}
    </div>
  );
}
