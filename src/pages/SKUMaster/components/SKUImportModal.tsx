import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import * as XLSX from "xlsx";
import { DraggableModal } from "../../../components/shared/DraggableModal";
import { useLanguage } from "../../../context/LanguageContext";

interface SKUImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSKUs: any[];
  onImport: (validData: any[]) => void;
}

export function SKUImportModal({
  isOpen,
  onClose,
  existingSKUs,
  onImport,
}: SKUImportModalProps) {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File upload state
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Parsed and validated items
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [overwriteMode, setOverwriteMode] = useState<"overwrite" | "skip">("overwrite");
  const [filterType, setFilterType] = useState<"all" | "valid" | "warning" | "error">("all");
  const [previewSearch, setPreviewSearch] = useState("");

  const resetState = () => {
    setFile(null);
    setIsProcessing(false);
    setProgress(0);
    setErrorMsg(null);
    setParsedRows([]);
    setFilterType("all");
    setPreviewSearch("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // Robust header mapping
  const headerMapping: { [key: string]: string } = {
    "sku code": "sku",
    "sku": "sku",
    "รหัสสินค้า": "sku",

    "product details": "name",
    "product name": "name",
    "ชื่อสินค้า": "name",
    "name": "name",

    "asset category": "category",
    "category": "category",
    "หมวดหมู่สินค้า": "category",
    "หมวดหมู่": "category",

    "type": "type",
    "classification": "type",
    "ประเภท": "type",

    "base unit": "uom",
    "uom": "uom",
    "หน่วยนับย่อย": "uom",
    "หน่วยย่อย": "uom",

    "large unit": "largeUom",
    "large uom": "largeUom",
    "หน่วยนับใหญ่": "largeUom",
    "หน่วยใหญ่": "largeUom",

    "conversion ratio": "uomRatio",
    "uom ratio": "uomRatio",
    "ratio": "uomRatio",
    "อัตราส่วน": "uomRatio",

    "weight": "weight",
    "น้ำหนัก": "weight",

    "dimensions": "dimensions",
    "dimension": "dimensions",
    "มิติมาตรฐาน": "dimensions",
    "มิติ": "dimensions",

    "barcode": "barcode",
    "บาร์โค้ด": "barcode",

    "storage condition": "storageTemp",
    "storage temp": "storageTemp",
    "เงื่อนไขจัดเก็บ": "storageTemp",

    "shelf life days": "shelfLifeDays",
    "shelf life": "shelfLifeDays",
    "อายุรักษา": "shelfLifeDays",

    "is lot tracked": "isLotTracked",
    "lot tracked": "isLotTracked",
    "บันทึกประวัติล๊อต": "isLotTracked",

    "is hazardous": "isHazardous",
    "hazardous": "isHazardous",
    "สินค้าอันตราย": "isHazardous",

    "status": "status",
    "สถานะ": "status",
  };

  // Convert row data to standard SKU fields & run automated validations
  const validateSKURow = (rawRow: any, index: number, existingSkuSet: Map<string, any>) => {
    const skuObj: any = {
      sku: "",
      name: "",
      category: "",
      type: "Finished Good",
      uom: "Pack",
      largeUom: "",
      uomRatio: 1,
      weight: 0,
      dimensions: "",
      barcode: "",
      status: "Active",
      shelfLifeDays: 365,
      storageTemp: "Ambient",
      isLotTracked: false,
      isHazardous: false,
    };

    // Map keys dynamically
    Object.keys(rawRow).forEach((rawKey) => {
      const normalizedKey = rawKey.toLowerCase().trim();
      const mappedField = headerMapping[normalizedKey];
      if (mappedField) {
        let value = rawRow[rawKey];
        if (value !== undefined && value !== null) {
          value = String(value).trim();
          skuObj[mappedField] = value;
        }
      }
    });

    const diagnostics: { type: "info" | "warning" | "error"; message: string }[] = [];

    // --- Validation Logic ---

    // 1. SKU code validation
    if (!skuObj.sku) {
      skuObj.sku = `SKU-TEMP-${index + 1}`;
      diagnostics.push({
        type: "error",
        message: "Mandatory 'SKU Code' is missing. Temporary code assigned.",
      });
    } else {
      skuObj.sku = skuObj.sku.toUpperCase();
      if (!/^[A-Z0-9_-]+$/.test(skuObj.sku)) {
        diagnostics.push({
          type: "warning",
          message: "SKU contains non-standard characters (only Alphanumeric, hyphen, and underscore recommended).",
        });
      }
    }

    // 2. Name validation
    if (!skuObj.name) {
      diagnostics.push({
        type: "error",
        message: "Mandatory 'Product Details / ชื่อสินค้า' is missing.",
      });
    }

    // 3. Category validation
    if (!skuObj.category) {
      diagnostics.push({
        type: "error",
        message: "Mandatory 'Asset Category / หมวดหมู่สินค้า' is missing.",
      });
    }

    // 4. Type normalization
    let parsedType = "Finished Good";
    const typeLower = String(skuObj.type).toLowerCase();
    if (typeLower.includes("raw") || typeLower.includes("rm") || typeLower.includes("วัตถุดิบ")) {
      parsedType = "Raw Material";
    } else if (typeLower.includes("pack") || typeLower.includes("pkg") || typeLower.includes("บรรจุภัณฑ์")) {
      parsedType = "Packaging";
    } else if (typeLower.includes("spare") || typeLower.includes("spr") || typeLower.includes("อะไหล่")) {
      parsedType = "Spare Part";
    } else if (typeLower.includes("finished") || typeLower.includes("fg") || typeLower.includes("สำเร็จ")) {
      parsedType = "Finished Good";
    } else {
      diagnostics.push({
        type: "warning",
        message: `Unknown product type '${skuObj.type}'. Fallback to 'Finished Good'.`,
      });
    }
    skuObj.type = parsedType;

    // 5. UoM normalization
    if (!skuObj.uom) {
      diagnostics.push({
        type: "error",
        message: "Mandatory 'Base Unit (หน่วยย่อย)' is missing.",
      });
    } else {
      skuObj.uom = skuObj.uom.toUpperCase();
    }

    if (skuObj.largeUom) {
      skuObj.largeUom = skuObj.largeUom.toUpperCase();
    } else {
      skuObj.largeUom = skuObj.uom;
    }

    // 6. Conversion ratio
    const ratioNum = parseInt(skuObj.uomRatio);
    if (isNaN(ratioNum) || ratioNum <= 0) {
      skuObj.uomRatio = 1;
      if (skuObj.uomRatio) {
        diagnostics.push({
          type: "warning",
          message: "Conversion Ratio must be a positive integer. Reset to 1.",
        });
      }
    } else {
      skuObj.uomRatio = ratioNum;
    }

    // 7. Weight
    const wtNum = parseFloat(skuObj.weight);
    if (isNaN(wtNum) || wtNum < 0) {
      skuObj.weight = 0;
      diagnostics.push({
        type: "warning",
        message: "Weight must be a non-negative number. Set to 0.",
      });
    } else {
      skuObj.weight = parseFloat(wtNum.toFixed(3));
    }

    // 8. Storage temp
    let parsedTemp = "Ambient";
    const tempLower = String(skuObj.storageTemp).toLowerCase();
    if (tempLower.includes("control") || tempLower.includes("เย็น") || tempLower.includes("แช่")) {
      parsedTemp = "Controlled";
    } else {
      parsedTemp = "Ambient";
    }
    skuObj.storageTemp = parsedTemp;

    // 9. Shelf life
    const lifeNum = parseInt(skuObj.shelfLifeDays);
    if (isNaN(lifeNum) || lifeNum <= 0) {
      skuObj.shelfLifeDays = 365;
    } else {
      skuObj.shelfLifeDays = lifeNum;
    }

    // 10. Status
    let parsedStatus = "Active";
    const statusLower = String(skuObj.status).toLowerCase();
    if (statusLower.includes("phase")) {
      parsedStatus = "Phase Out";
    } else if (statusLower.includes("discontinue") || statusLower.includes("เลิกผลิต")) {
      parsedStatus = "Discontinued";
    } else if (statusLower.includes("develop") || statusLower.includes("พัฒนา")) {
      parsedStatus = "Development";
    }
    skuObj.status = parsedStatus;

    // 11. Boolean flag mapping
    const parseBool = (val: any) => {
      if (val === undefined || val === null) return false;
      const strVal = String(val).toUpperCase().trim();
      return ["YES", "TRUE", "1", "Y", "ใช่", "ตกลง"].includes(strVal);
    };
    skuObj.isLotTracked = parseBool(skuObj.isLotTracked);
    skuObj.isHazardous = parseBool(skuObj.isHazardous);

    // 12. Duplicate check
    const matchedSku = existingSkuSet.get(skuObj.sku);
    if (matchedSku) {
      diagnostics.push({
        type: "warning",
        message: `Duplicate: SKU [${skuObj.sku}] already exists. Will Overwrite.`,
      });
    }

    // Determine row validity
    const hasErrors = diagnostics.some((d) => d.type === "error");
    const hasWarnings = diagnostics.some((d) => d.type === "warning");

    return {
      rowIndex: index + 1,
      skuData: skuObj,
      status: hasErrors ? "error" : hasWarnings ? "warning" : "valid",
      diagnostics,
      isDuplicate: !!matchedSku,
    };
  };

  // High Performance Chunked processing function to process in batches and keep UI fully active
  const processRawDataInChunks = (rows: any[]) => {
    setIsProcessing(true);
    setProgress(0);
    setErrorMsg(null);

    const existingSkuSet = new Map<string, any>();
    existingSKUs.forEach((item) => {
      existingSkuSet.set(String(item.sku).toUpperCase(), item);
    });

    const parsedResults: any[] = [];
    const totalLines = rows.length;
    const chunkSize = 100; // Processes 100 files at a time to prevent UI lag
    let currentOffset = 0;

    const processChunk = () => {
      const end = Math.min(currentOffset + chunkSize, totalLines);
      for (let i = currentOffset; i < end; i++) {
        const rowResult = validateSKURow(rows[i], i, existingSkuSet);
        parsedResults.push(rowResult);
      }

      currentOffset = end;
      const calculatedProgress = Math.round((currentOffset / totalLines) * 100);
      setProgress(calculatedProgress);

      if (currentOffset < totalLines) {
        setTimeout(processChunk, 10); // yields back to event loop immediately
      } else {
        setParsedRows(parsedResults);
        setIsProcessing(false);
      }
    };

    setTimeout(processChunk, 0);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readAndParseFile(selectedFile);
    }
  };

  const readAndParseFile = (uploadFile: File) => {
    const isCsv = uploadFile.name.toLowerCase().endsWith(".csv");
    const isExcel =
      uploadFile.name.toLowerCase().endsWith(".xlsx") ||
      uploadFile.name.toLowerCase().endsWith(".xls");

    if (!isCsv && !isExcel) {
      setErrorMsg("กรุณาอัพโหลดไฟล์สกุล .csv หรือ .xlsx เท่านั้น (Please upload .csv or .xlsx only)");
      setFile(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let jsonRows: any[] = [];

        if (isExcel) {
          const workbook = XLSX.read(data, { type: "binary" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          jsonRows = XLSX.utils.sheet_to_json(worksheet);
        } else {
          // Parse plain CSV text
          const text = data as string;
          const rows = text.split(/\r?\n/).map((row) => {
            // simplistic csv parser (splits by commas outside quotes)
            const splitRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
            return row.split(splitRegex).map((cell) => cell.replace(/^"|"$/g, "").trim());
          });

          if (rows.length > 0) {
            const fileHeaders = rows[0];
            jsonRows = rows.slice(1).filter(r => r.length > 0 && r.some(c => c !== "")).map((cols) => {
              const obj: any = {};
              fileHeaders.forEach((header, index) => {
                if (header) {
                  obj[header] = cols[index] !== undefined ? cols[index] : "";
                }
              });
              return obj;
            });
          }
        }

        if (jsonRows.length === 0) {
          setErrorMsg("ไฟล์ไม่มีข้อมูล หรือโครงสร้างข้อมูลไม่พบแถวผลิตภัณฑ์ (File is empty)");
          setFile(null);
          return;
        }

        processRawDataInChunks(jsonRows);
      } catch (err: any) {
        console.error(err);
        setErrorMsg(`เกิดข้อผิดพลาดในการโหลดไฟล์สเปรดชีต: ${err.message || "Unknown error"}`);
        setFile(null);
      }
    };

    if (isExcel) {
      reader.readAsBinaryString(uploadFile);
    } else {
      reader.readAsText(uploadFile, "UTF-8");
    }
  };

  // Dynamically exports a high-quality sample CSV template for the user
  const handleDownloadTemplate = () => {
    try {
      const templateHeaders = [
        "รหัสสินค้า (SKU Code)",
        "ชื่อสินค้า (Product Details)",
        "หมวดหมู่สินค้า (Asset Category)",
        "ประเภท (Type)",
        "หน่วยนับย่อย (Base Unit)",
        "หน่วยนับใหญ่ (Large Unit)",
        "อัตราส่วน (Conversion Ratio)",
        "น้ำหนัก (Weight)",
        "มิติมาตรฐาน (Dimensions)",
        "บาร์โค้ด (Barcode)",
        "เงื่อนไขจัดเก็บ (Storage Condition)",
        "อายุรักษา (Shelf Life Days)",
        "บันทึกประวัติล๊อต (Is Lot Tracked)",
        "สินค้าอันตราย (Is Hazardous)",
        "สถานะ (Status)",
      ];

      const sampleRows = [
        [
          "SKU-2026-A",
          "Premium Jasmine Rice 5kg (ข้าวหอมมะลิคัดพิเศษ)",
          "Food & Agritech",
          "Finished Good",
          "Bag",
          "Pallet",
          "50",
          "5.00",
          "30x45x10",
          "8859910293120",
          "Ambient",
          "360",
          "YES",
          "NO",
          "Active",
        ],
        [
          "SKU-2026-B",
          "Industrial Resins Grade A (สารเรซิ่นระดับอุตสาหกรรม)",
          "Chemicals",
          "Raw Material",
          "Drum",
          "Pallet",
          "4",
          "200.00",
          "60x60x90",
          "8859910293144",
          "Controlled",
          "720",
          "YES",
          "YES",
          "Active",
        ],
      ];

      const csvContent =
        "\uFEFF" + // UTF-8 BOM representation for Excel readability
        [templateHeaders.join(",")]
          .concat(sampleRows.map((r) => r.map((cell) => `"${cell}"`).join(",")))
          .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "WMS_SKU_Master_Template.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (eee) {
      console.error("Error creating download link template: ", eee);
    }
  };

  // Perform final import filter & confirmation
  const handleFinalConfirmImport = () => {
    // Collect rows to import
    const validRowsToImport = parsedRows.filter((r) => {
      if (r.status === "error") return false; // Absolutely exclude rows with errors
      if (r.isDuplicate && overwriteMode === "skip") return false; // Skipped duplicates
      return true;
    });

    if (validRowsToImport.length === 0) {
      alert("ไม่มีผลิตภัณฑ์แถวที่ผ่านการตรวจสอบเพียงพอสำหรับการนำเข้า (No valid SKUs to import)");
      return;
    }

    const itemsToEmit = validRowsToImport.map((r) => r.skuData);
    onImport(itemsToEmit);
    onClose();
  };

  // Computed summary stats
  const stats = {
    total: parsedRows.length,
    valid: parsedRows.filter((r) => r.status === "valid").length,
    warning: parsedRows.filter((r) => r.status === "warning").length,
    error: parsedRows.filter((r) => r.status === "error").length,
    duplicates: parsedRows.filter((r) => r.isDuplicate).length,
  };

  // Filter and search logic for the preview directory
  const filteredAndSearchedRows = parsedRows.filter((r) => {
    // Type Filter
    if (filterType === "valid" && r.status !== "valid") return false;
    if (filterType === "warning" && r.status !== "warning") return false;
    if (filterType === "error" && r.status !== "error") return false;

    // Search Query
    if (previewSearch.trim()) {
      const q = previewSearch.toLowerCase();
      const skuMatch = String(r.skuData.sku).toLowerCase().includes(q);
      const nameMatch = String(r.skuData.name).toLowerCase().includes(q);
      const catMatch = String(r.skuData.category).toLowerCase().includes(q);
      return skuMatch || nameMatch || catMatch;
    }

    return true;
  });

  return (
    <DraggableModal
      isOpen={isOpen}
      onClose={onClose}
      width="max-w-[1000px]"
      customHeader={
        <div className="bg-[#212c46] px-5 py-4 flex justify-between items-center shrink-0 border-b-2 border-[#b7a159]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#b7a159] flex items-center justify-center border border-white/20 shadow-sm overflow-hidden">
              <Icons.DatabaseBackup size={22} className="text-[#b7a159]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest leading-none">
                {t("นำเข้าข้อมูลผลิตภัณฑ์แบบกลุ่ม (BULK LOAD)", "BULK SKU DATASHEET IMPORT")}
              </h3>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1 text-left">
                {t("นำเข้า ข้าว/วัตถุดิบ/สินค้า ผ่านสเปรดชีตด้วยระบบดักตรวจข้อผิดพลาด", "EXCEL/CSV VALIDATING INGESTION ENGINE")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-all bg-white/10 hover:bg-white/20 p-2 rounded-full cursor-pointer"
          >
            <Icons.X size={16} />
          </button>
        </div>
      }
    >
      <div className="flex-1 overflow-y-auto p-6 bg-[#fbfbfa] text-left text-[#414757] custom-scrollbar max-h-[82vh] space-y-6">
        
        {/* DOWNLOAD BUTTON & GUIDANCE PANEL */}
        <div className="bg-white rounded-2xl border border-[#eaeaec] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-50 rounded-xl text-[#b58c4f] shrink-0 mt-0.5">
              <Icons.BadgeInfo size={18} />
            </div>
            <div>
              <h4 className="text-[12px] font-black text-[#212c46] uppercase tracking-wide">
                คู่มือการจัดหน้าเทมเพลต Excel / CSV (Standard Template Guideline)
              </h4>
              <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1">
                ระบบรองรับทั้งภาษาไทยและอังกฤษ กำหนดให้มีหัวคอลัมน์ชื่อตรงตามเทมเพลตมาตรฐาน
                ช่อง <strong className="text-red-700">รหัสสินค้า (SKU)</strong>, <strong className="text-red-700">ชื่อสินค้า (Name)</strong> และ <strong className="text-red-700">หมวดหมู่ (Category)</strong> เป็นฟิลด์บังคับข้ามไม่ได้เด็ดขาด
              </p>
            </div>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-black uppercase text-[11px] tracking-wider px-4 py-2.5 rounded-xl shadow-md cursor-pointer shrink-0 transition-all active:scale-95"
          >
            <Icons.FileSpreadsheet size={15} /> Download Standard Template
          </button>
        </div>

        {/* UPLOADER REGION */}
        {!file && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-3 border-dashed border-[#eaeaec] rounded-[24px] bg-white p-10 flex flex-col items-center justify-center gap-4 hover:border-[#b7a159] hover:bg-amber-50/20 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-slate-50 rounded-full text-slate-400 group-hover:bg-[#212c46] group-hover:text-white transition-all shadow-inner">
              <Icons.UploadCloud size={36} />
            </div>
            <div className="text-center">
              <p className="text-[12px] font-black text-[#212c46] uppercase tracking-widest">
                ลากวางไฟล์สเปรดชีต หรือคลิกเพื่ออัพโหลด (UPLOAD CSV / XLSX)
              </p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">
                รองรับไฟล์สกุล XLSX, XLS และ CSV ขีดจำกัดสูงสุด 15MB
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileChange}
            />
          </div>
        )}

        {/* LOADING & PARSING CHUNKS INDICATOR */}
        {file && isProcessing && (
          <div className="bg-white rounded-3xl border border-[#eaeaec] p-10 flex flex-col items-center justify-center gap-4 text-center shadow-lg animate-pulse">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#b7a159] animate-spin"></div>
              <span className="absolute text-[11px] font-mono font-bold text-[#212c46]">
                {progress}%
              </span>
            </div>
            <div>
              <h5 className="text-[13px] font-black text-[#212c46] uppercase tracking-wider">
                กำลังแกะวิเคราะห์ข้อมูลและตรวจสอบฟิลด์แบบ chunked (Processing...)
              </h5>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">
                จัดแต่งโมบายล์เธรด คืนรอบซีพียูไม่ทำให้เบราว์เซอร์กระตุกค้าง
              </p>
            </div>
          </div>
        )}

        {/* ERROR OCCURED */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-700">
            <Icons.AlertTriangle className="shrink-0 mt-0.5" size={18} />
            <div>
              <h5 className="text-xs font-black uppercase tracking-wide">ไม่สามารถประมวลผลไฟล์ได้ (Parsing Failed)</h5>
              <p className="text-[11px] mt-0.5">{errorMsg}</p>
              <button
                onClick={resetState}
                className="mt-3 text-[10px] font-extrabold uppercase bg-rose-700 text-white px-3 py-1 rounded hover:bg-rose-800 transition-colors cursor-pointer"
              >
                ลองอัพโหลดใหม่อีกครั้ง / Re-upload
              </button>
            </div>
          </div>
        )}

        {/* DATA PREVIEW & AUTOMATED VALIDATOR DIRECTORY */}
        {file && !isProcessing && parsedRows.length > 0 && (
          <div className="space-y-4">
            
            {/* STATS OVERVIEW CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 shrink-0">
              <div className="bg-white border border-[#eaeaec] px-4 py-3 rounded-2xl shadow-sm text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ทั้งหมดที่พบ (Total Rows)</p>
                <p className="text-[18px] font-black text-[#212c46] mt-0.5">{stats.total}</p>
                <div className="w-full bg-[#eaeaec] h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-[#212c46] h-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="bg-white border border-emerald-100 px-4 py-3 rounded-2xl shadow-sm text-left">
                <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">พร้อมนำเข้า (Valid SKUs)</p>
                <p className="text-[18px] font-black text-emerald-600 mt-0.5">{stats.valid}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${(stats.valid / stats.total) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-amber-100 px-4 py-3 rounded-2xl shadow-sm text-left">
                <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">มีคำเตือน (Warnings)</p>
                <p className="text-[18px] font-black text-amber-600 mt-0.5">{stats.warning}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${(stats.warning / stats.total) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-rose-150 px-4 py-3 rounded-2xl shadow-sm text-left">
                <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">ข้อมูลไม่ครบถ้วน (Errors)</p>
                <p className="text-[18px] font-black text-rose-700 mt-0.5">{stats.error}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${(stats.error / stats.total) * 100}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-purple-100 px-4 py-3 rounded-2xl shadow-sm text-left col-span-2 lg:col-span-1">
                <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">รหัสซ้ำ (Duplicates)</p>
                <p className="text-[18px] font-black text-purple-700 mt-0.5">{stats.duplicates}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-purple-500 h-full" style={{ width: `${(stats.duplicates / stats.total) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* PREVIEW LAYOUT CONTROLS */}
            <div className="bg-white p-4 rounded-3xl border border-[#eaeaec] space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-72">
                  <Icons.Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={previewSearch}
                    onChange={(e) => setPreviewSearch(e.target.value)}
                    placeholder="ค้นหากรองตามรหัส, ชื่อ หรือ หมวดหมู่..."
                    className="w-full pl-9 pr-4 py-1.5 bg-[#fbfbfa] text-[#212c46] border border-[#eaeaec] rounded-xl text-[11px] font-bold outline-none focus:border-[#b7a159]"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#fbfbfa] p-1 border border-[#eaeaec] rounded-xl self-stretch md:self-auto text-[10px] font-black uppercase tracking-wider">
                  <button
                    onClick={() => setFilterType("all")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "all" ? "bg-[#212c46] text-white shadow" : "text-slate-500 hover:text-[#212c46]"}`}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    onClick={() => setFilterType("valid")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "valid" ? "bg-emerald-600 text-white shadow" : "text-slate-500 hover:text-emerald-600"}`}
                  >
                    Valid Only ({stats.valid})
                  </button>
                  <button
                    onClick={() => setFilterType("warning")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "warning" ? "bg-amber-500 text-white shadow" : "text-slate-500 hover:text-amber-500"}`}
                  >
                    Warnings ({stats.warning})
                  </button>
                  <button
                    onClick={() => setFilterType("error")}
                    className={`px-3 py-1.5 rounded-lg transition-all ${filterType === "error" ? "bg-rose-700 text-white shadow" : "text-slate-500 hover:text-[#932c2e]"}`}
                  >
                    Errors ({stats.error})
                  </button>
                </div>
              </div>

              {/* OVERWRITE OPTIONS FOR DUPLICATES */}
              {stats.duplicates > 0 && (
                <div className="bg-purple-50/50 border border-purple-100 p-3 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Icons.HelpCircle size={18} className="text-purple-700" />
                    <div>
                      <p className="text-[11px] font-black text-purple-950 uppercase tracking-wide">
                        พบรหัสสินค้าที่ซ้ำซ้อนกับหน้าระบบหลักจำนวน {stats.duplicates} รายการ
                      </p>
                      <p className="text-[9.5px] text-purple-800 font-bold leading-tight uppercase tracking-wider mt-0.5">
                        หากอนุมัตินำเข้า จะทำอย่างไรกับข้อมูลซ้ำเดิม (Resolve duplicate strategy)?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-[10px] uppercase font-black tracking-wider">
                    <button
                      onClick={() => setOverwriteMode("overwrite")}
                      className={`px-3 py-1.5 rounded-lg transition-all border ${overwriteMode === "overwrite" ? "bg-purple-700 text-white border-purple-700" : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"}`}
                    >
                      เขียนทับคนเก่า (Overwrite Existing)
                    </button>
                    <button
                      onClick={() => setOverwriteMode("skip")}
                      className={`px-3 py-1.5 rounded-lg transition-all border ${overwriteMode === "skip" ? "bg-purple-700 text-white border-purple-700" : "bg-white text-purple-700 border-purple-200 hover:bg-purple-50"}`}
                    >
                      ข้ามแถวซ้ำไป (Skip Duplicates)
                    </button>
                  </div>
                </div>
              )}

              {/* PREVIEW DATA TABLE */}
              <div className="border border-[#eaeaec] rounded-2xl overflow-hidden shadow-inner bg-white">
                <div className="overflow-x-auto custom-scrollbar max-h-[300px]">
                  <table className="w-full text-left font-sans border-collapse text-[10.5px]">
                    <thead className="bg-[#1d2636] text-white sticky top-0 z-10 font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3 border-b text-center w-12">#</th>
                        <th className="py-2.5 px-3 border-b">รหัสสินค้า / SKU</th>
                        <th className="py-2.5 px-3 border-b min-w-[200px]">ชื่อสินค้า / รายละเอียด</th>
                        <th className="py-2.5 px-3 border-b">หมวดหมู่ / ประเภท</th>
                        <th className="py-2.5 px-3 border-b text-center">หน่วยนับหลัก</th>
                        <th className="py-2.5 px-3 border-b">เงื่อนไขจัดเก็บ</th>
                        <th className="py-2.5 px-3 border-b min-w-[220px]">สถานะการดักกรอง / Diagnostics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaec]">
                      {filteredAndSearchedRows.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 px-4 text-center text-slate-400 uppercase font-black tracking-widest bg-slate-50/50">
                            ไม่พบรายการแถวในหมวดหมู่ตัวกรองที่เลือก (No records match filter criteria)
                          </td>
                        </tr>
                      ) : (
                        filteredAndSearchedRows.map((row) => {
                          let badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                          let statusText = "Ready";
                          if (row.status === "error") {
                            badgeBg = "bg-rose-50 text-rose-700 border-rose-200";
                            statusText = "Error";
                          } else if (row.status === "warning") {
                            badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
                            statusText = rsk(row);
                          }

                          function rsk(item: any) {
                            if (item.isDuplicate) return "Duplicate";
                            return "Warning";
                          }

                          return (
                            <tr key={row.rowIndex} className={`hover:bg-slate-50/50 transition-colors ${row.status === 'error' ? 'bg-red-50/10' : ''}`}>
                              <td className="py-2 px-3 text-center border-r font-mono text-slate-400 font-bold bg-[#fbfbfa]">
                                {row.rowIndex}
                              </td>
                              <td className="py-2 px-3 font-mono font-black text-[#212c46]">
                                {row.skuData.sku}
                              </td>
                              <td className="py-2 px-3 font-bold text-slate-700 max-w-[250px] truncate" title={row.skuData.name}>
                                {row.skuData.name || <span className="text-red-500 italic">Missing!</span>}
                              </td>
                              <td className="py-2 px-3">
                                <span className="font-bold text-[#4d87a8]">{row.skuData.category || "—"}</span>
                                <span className="block text-[8px] font-black uppercase text-slate-400 tracking-wider">
                                  {row.skuData.type}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center font-black text-[#a94228]">
                                {row.skuData.uom}
                              </td>
                              <td className="py-2 px-3">
                                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 py-0.5 px-1.5 rounded-md">
                                  {row.skuData.storageTemp}
                                </span>
                              </td>
                              <td className="py-2 px-3 border-l">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className={`inline-block px-1.5 py-0.5 border text-[9px] uppercase font-black tracking-widest rounded ${badgeBg}`}>
                                      {statusText}
                                    </span>
                                    {row.isDuplicate && overwriteMode === "skip" && (
                                      <span className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-[8px] font-extrabold uppercase">
                                        Skipped
                                      </span>
                                    )}
                                  </div>
                                  
                                  {row.diagnostics.length > 0 && (
                                    <div className="flex flex-col gap-0.5">
                                      {row.diagnostics.map((diag: any, dIdx: number) => {
                                        const iconColor = diag.type === "error" ? "text-rose-600" : "text-amber-500";
                                        return (
                                          <div key={dIdx} className="flex items-start gap-1 text-[8.5px] leading-tight font-bold text-slate-500">
                                            <span className={`${iconColor} mt-0.5`}>•</span>
                                            <span className={diag.type === "error" ? "text-rose-700" : ""}>{diag.message}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  
                                  {row.diagnostics.length === 0 && (
                                    <span className="text-[9px] font-bold text-emerald-600 italic">
                                      All criteria check out perfectly.
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ERROR SUMMARY CALLOUT & SUBMIT ZONE */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 shrink-0">
              <div className="text-left text-[11px] font-bold text-slate-500">
                {stats.error > 0 ? (
                  <p className="text-rose-700 font-extrabold flex items-center gap-1">
                    <Icons.AlertTriangle size={14} />
                    พบแถวข้อมูลผิดพลาดจำนวน {stats.error} รายการ ซึ่งมีฟิลด์บังคับไม่เจอบนระบบ ลูกค้าสามารถนำเข้ารายการที่ผ่านตรวจสอบได้เท่านั้น
                  </p>
                ) : (
                  <p className="text-emerald-700 font-extrabold flex items-center gap-1">
                    <Icons.CheckCircle size={14} />
                    แถวทั้งหมดเป็นไปตามมาตรฐานการตรวจสอบ นำเข้าได้ 100% (Passed integrity review!)
                  </p>
                )}
              </div>

              <div className="flex gap-2.5 self-stretch sm:self-auto uppercase tracking-wider text-[11px] font-black">
                <button
                  type="button"
                  onClick={resetState}
                  className="bg-white border border-[#eaeaec] hover:bg-slate-100 text-[#212c46] px-5 py-3 rounded-2xl shadow-sm cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <Icons.RotateCcw size={14} /> Reset Loader
                </button>
                <button
                  type="button"
                  onClick={handleFinalConfirmImport}
                  className="bg-[#212c46] text-white hover:bg-[#414757] px-6 py-3 rounded-2xl shadow-md cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <Icons.CheckSquare size={14} /> Confirm and Load (
                  {parsedRows.filter((r) => {
                    if (r.status === "error") return false;
                    if (r.isDuplicate && overwriteMode === "skip") return false;
                    return true;
                  }).length}{" "}
                  Rows)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DraggableModal>
  );
}
