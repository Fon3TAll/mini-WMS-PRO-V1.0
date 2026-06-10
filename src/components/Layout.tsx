import React, { useState, Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SecurityGuard from "./SecurityGuard";
import { useAuth } from "../context/AuthContext";
import { PhoneCall, Mail, QrCode } from "lucide-react";
import { BarcodeScanner } from "./shared/BarcodeScanner";
import QuickActionsHub from "./QuickActionsHub";
import Swal from "sweetalert2";
import { OfflineStatusIndicator } from "./shared/OfflineStatusIndicator";
import { SkeletonLoader } from "./shared/SkeletonLoader";
import { SystemStatusFooter } from "./shared/SystemStatusFooter";

// Provide a global toggle for the print watermark feature
declare global {
  interface Window {
    toggleConfidentialWatermark: (force?: boolean) => void;
  }
}

window.toggleConfidentialWatermark = (force?: boolean) => {
  const body = document.body;
  const targetClass = 'has-print-watermark';
  
  if (force === undefined) {
    body.classList.toggle(targetClass);
  } else {
    if (force) body.classList.add(targetClass);
    else body.classList.remove(targetClass);
  }

  if (body.classList.contains(targetClass)) {
    body.setAttribute('data-print-watermark', 'CONFIDENTIAL');
  } else {
    body.removeAttribute('data-print-watermark');
  }
};

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    const handleTriggerScanner = () => {
      setIsScannerOpen(true);
    };
    window.addEventListener("wms-trigger-scanner", handleTriggerScanner);
    return () =>
      window.removeEventListener("wms-trigger-scanner", handleTriggerScanner);
  }, []);

  // Determine context to highlight Inbound / Outbound presets automatically
  const getExpectedScanScope = (): "inbound" | "outbound" | "all" => {
    const path = location.pathname;
    if (
      path.includes("inbound") ||
      path.includes("production") ||
      path.includes("vendors")
    )
      return "inbound";
    if (
      path.includes("outbound") ||
      path.includes("picking") ||
      path.includes("packing") ||
      path.includes("dispatch") ||
      path.includes("transport")
    )
      return "outbound";
    return "all";
  };

  const handleScanResult = (code: string) => {
    // Elegant custom warehouse alert
    Swal.fire({
      title:
        '<span class="text-slate-800 font-bold font-sans text-lg">สแกนรหัสสำเร็จ • SUCCESS</span>',
      html: `
        <div class="font-sans py-2 space-y-3">
          <p class="text-xs text-slate-500 font-medium">ข้อมูลฉลากบาร์โค้ด / คิวอาร์โค้ดได้รับการยืนยันและนำส่งเข้าระบบ</p>
          <div class="px-4 py-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100 font-mono text-sm font-black tracking-widest break-all shadow-inner">
            ${code}
          </div>
          <div class="flex items-center justify-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 py-1 rounded border border-slate-100">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            WMS EVENT DISPATCHED SUCCESSFULLY
          </div>
        </div>
      `,
      icon: "success",
      confirmButtonColor: "#1e293b",
      confirmButtonText: "รับทราบ (OK)",
      timer: 3500,
      timerProgressBar: true,
    });

    // Dispatch global custom event for modular pages to react to
    window.dispatchEvent(
      new CustomEvent("wms-barcode-scanned", { detail: { code } }),
    );
  };

  return (
    <SecurityGuard>
      <OfflineStatusIndicator />
      <div
        className="flex h-screen w-full overflow-hidden font-sans text-slate-800"
        style={{
          background: "linear-gradient(135deg, #f3f3f1 0%, #eaeaec 100%)",
        }}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Header onOpenScanner={() => setIsScannerOpen(true)} />
          <div className="flex-1 custom-scrollbar overflow-y-auto flex flex-col min-h-0 relative">
            <div className="flex-1 flex flex-col w-full pt-0">
              <main className="flex-1 shrink-0 bg-transparent flex flex-col w-full relative z-0">
                <Suspense fallback={<SkeletonLoader />}>
                  <Outlet />
                </Suspense>
              </main>

              <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
                <QuickActionsHub />

                {/* Floating Quick Scanner Trigger Button */}
                <button
                  onClick={() => setIsScannerOpen(true)}
                  className="pointer-events-auto flex items-center gap-2 px-5 py-3.5 bg-[#1a253d] hover:bg-[#212c46] text-[#e5b73b] rounded-full shadow-[0_8px_30px_rgba(26,37,61,0.4)] hover:shadow-[0_12px_36px_rgba(26,37,61,0.5)] border border-[#e5b73b]/20 font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shrink-0"
                >
                  <QrCode size={18} className="animate-pulse" />
                  <span>Quick Scan</span>
                </button>
              </div>

              <footer className="mt-8 shrink-0 py-3.5 flex flex-col items-center gap-0.5 text-center text-[#212c46] w-full bg-transparent">
                <div className="flex items-center justify-center">
                  <span className="text-[12px] font-black uppercase tracking-widest opacity-80 font-mono text-center">
                    INTELLIGENCE WAREHOUSE CENTER • EMPOWERING SMART INVENTORY
                    MANAGEMENT
                  </span>
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#7a8b95] mt-0.5 font-technical">
                  <p className="flex items-center">
                    <span className="font-light mr-1">System by</span>
                    <span className="font-black text-[#212c46]">
                      T All Intelligence
                    </span>
                  </p>
                  <span className="hidden md:inline text-[#d7d7d7]">|</span>
                  <p className="flex items-center gap-1.5">
                    <PhoneCall size={12} className="text-[#a54f6b]" />{" "}
                    082-5695654
                  </p>
                  <span className="hidden md:inline text-[#d7d7d7]">|</span>
                  <p className="flex items-center gap-1.5">
                    <Mail size={12} className="text-[#3f809e]" />{" "}
                    tallintelligence.ho@gmail.com
                  </p>
                  <span className="hidden md:inline text-[#d7d7d7]">|</span>
                  <p className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                    ALL RIGHTS RESERVED
                  </p>
                </div>
              </footer>
            </div>
          </div>
          <SystemStatusFooter />
        </div>
      </div>

      {isScannerOpen && (
        <BarcodeScanner
          onClose={() => setIsScannerOpen(false)}
          onScan={(code) => {
            handleScanResult(code);
            setIsScannerOpen(false);
          }}
          expectedType={getExpectedScanScope()}
        />
      )}
    </SecurityGuard>
  );
}
