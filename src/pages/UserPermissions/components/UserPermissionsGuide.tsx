import React, { useRef } from 'react';
import { ShieldCheck, BookOpen, UserCheck, Key, FileText, Printer, HelpCircle } from 'lucide-react';
import { DigitalApprovalComponent } from '../../../components/shared/DigitalApprovalComponent';

interface UserPermissionsGuideProps {
  onClose?: () => void;
}

export default function UserPermissionsGuide({ onClose }: UserPermissionsGuideProps) {
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printAreaRef.current) return;
    const printContent = printAreaRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    // Create a printable window or handle standard printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>User Permissions - Official Manual & Guide</title>
            <style>
              body {
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                color: #212c46;
                padding: 40px;
                line-height: 1.6;
                background: #ffffff;
              }
              h2 { color: #212c46; border-bottom: 2px solid #b7a159; padding-bottom: 8px; font-weight: 900; margin-top: 30px; letter-spacing: -0.02em; }
              h3 { color: #1a253d; font-weight: 800; margin-top: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
              th { background-color: #212c46; color: #ffffff; padding: 10px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; text-align: left; border: 1px solid #eaeaec; }
              td { padding: 10px; border: 1px solid #eaeaec; font-size: 12px; }
              tr:nth-child(even) { background-color: #f8f9fa; }
              .stamp-approved { border: 2px dashed #657f4d; color: #657f4d; background: rgba(101,127,77,0.05); padding: 8px 12px; font-weight: 900; border-radius: 8px; display: inline-block; transform: rotate(-3deg); }
              .no-print { display: none; }
              @media print {
                body { padding: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${printContent}
            <script>
              window.onload = function() {
                window.print();
                window.close();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="bg-white border-2 border-[#eaeaec] rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto text-left relative animate-fadeIn" id="user-permissions-guide-manual">
      {/* Utility Ribbon */}
      <div className="flex items-center justify-between border-b pb-4 mb-6">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[#b7a159]" size={20} />
          <span className="text-xs font-black tracking-widest text-[#7a8b95] uppercase">
            Official System Handbook / PDF Layout
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#212c46] hover:bg-[#1d2636] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Printer size={13} /> Export PDF / Print
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 bg-[#f3f3f1] hover:bg-red-50 text-red-700 border border-[#eaeaec] hover:border-red-200 text-[11px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Printable Area Wrapper */}
      <div ref={printAreaRef} className="space-y-8 font-sans">
        
        {/* Manual Header Banner */}
        <div className="p-6 bg-gradient-to-br from-[#212c46] to-[#0F172A] rounded-2xl text-white relative overflow-hidden border-2 border-[#b7a159]">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.05] pointer-events-none transform rotate-45">
            <ShieldCheck size={200} />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 text-[#b7a159] font-black tracking-[0.25em] text-[10px] uppercase">
                <ShieldCheck size={14} /> SECURITY PROTOCOL SYSTEM MANUAL
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase">
                USER ROLES & PERMISSIONS
              </h1>
              <p className="text-[11px] font-bold text-[#d7d7d7]/80 uppercase tracking-widest mt-1.5 leading-none">
                Access Authorization, Functional Scopes, and Deployment Procedures
              </p>
            </div>
            <div className="bg-white/10 border border-white/20 p-3 rounded-xl text-center shrink-0">
              <span className="block text-[8px] font-black tracking-widest text-[#b7a159] uppercase leading-none">DOCUMENT ID</span>
              <span className="block text-xs font-mono font-black text-white mt-1">WMS-SEC-MAN-001</span>
              <span className="block text-[8px] font-bold text-white/50 uppercase mt-1">REV. 2.4 - SAFEWAY</span>
            </div>
          </div>
        </div>

        {/* 1. DOCUMENT CONTROL LOG */}
        <section>
          <h2 className="text-sm font-black text-[#212c46] border-b-2 border-[#b7a159] pb-1.5 mb-3 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-[#b7a159]" /> 1. Document Control & History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-[#eaeaec]">
              <thead>
                <tr className="bg-[#212c46] text-white">
                  <th className="p-2 border">Version</th>
                  <th className="p-2 border">Release Date</th>
                  <th className="p-2 border">Author / Lead</th>
                  <th className="p-2 border">Security Clearance</th>
                  <th className="p-2 border">System Audit Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-mono font-bold">2.4.0 (Latest)</td>
                  <td className="p-2 border">10 June 2026</td>
                  <td className="p-2 border font-bold">Security Compliance Officer</td>
                  <td className="p-2 border font-semibold text-[#657f4d]">LEVEL 4 (Restricted)</td>
                  <td className="p-2 border"><span className="text-xs font-black text-[#657f4d] uppercase">✓ FULLY COMPLIANT</span></td>
                </tr>
                <tr className="bg-gray-50/50">
                  <td className="p-2 border font-mono">2.2.1</td>
                  <td className="p-2 border">14 April 2026</td>
                  <td className="p-2 border">Safety Operations Team</td>
                  <td className="p-2 border text-[#3f809e]">LEVEL 3 (Standard)</td>
                  <td className="p-2 border">Audited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 2. ROLE CLASSIFICATION GRID */}
        <section>
          <h2 className="text-sm font-black text-[#212c46] border-b-2 border-[#b7a159] pb-1.5 mb-3 uppercase tracking-wider flex items-center gap-2">
            <UserCheck size={16} className="text-[#b7a159]" /> 2. Role Classifications & Scope
          </h2>
          <p className="text-xs font-medium text-[#7a8b95] leading-relaxed mb-4">
            Security Roles define baseline clearance across system segments. Each user is assigned one baseline posture, which determines their starting workspace nodes:
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-[#eaeaec] rounded-xl">
              <span className="font-extrabold text-[12px] text-[#212c46] block uppercase tracking-wider">A. SUPER ADMIN / DEVELOPER:</span>
              <p className="text-xs font-medium text-gray-700 leading-relaxed mt-1">
                Full programmatic bypass. Possesses implicit access across all modules ('*'). Empowered to override constraints, configure warehouse coordinates, initiate database sync procedures, and manage the Global Registry.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-[#eaeaec] rounded-xl">
              <span className="font-extrabold text-[12px] text-[#a94228] block uppercase tracking-wider">B. MANAGER / SUPERVISOR:</span>
              <p className="text-xs font-medium text-gray-700 leading-relaxed mt-1">
                Authorized for operational control. Possesses verification (Verifier) and approval (Approver) workflows. Oversees receipts, dispatch queues, and coordinates cross-docking priorities inside their assigned storage zone.
              </p>
            </div>
            <div className="p-4 bg-gray-50 border border-[#eaeaec] rounded-xl">
              <span className="font-extrabold text-[12px] text-[#7a8b95] block uppercase tracking-wider">C. CLERK / OPERATIONAL STAFF:</span>
              <p className="text-xs font-medium text-gray-700 leading-relaxed mt-1">
                Standard access path. Operates via Editor or Viewer scopes to complete picking, putaway, and simple cycle-counting tasks. Barred from administrative configurations and approval overrides.
              </p>
            </div>
          </div>
        </section>

        {/* 3. PERMISSION LEVEL MATRIX */}
        <section>
          <h2 className="text-sm font-black text-[#212c46] border-b-2 border-[#b7a159] pb-1.5 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Key size={16} className="text-[#b7a159]" /> 3. Permission Level Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse border border-[#eaeaec]">
              <thead>
                <tr className="bg-[#212c46] text-white">
                  <th className="p-2 border text-center">Level</th>
                  <th className="p-2 border">Access Scope</th>
                  <th className="p-2 border">Permitted CRUD Actions</th>
                  <th className="p-2 border">WMS Module Translation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 border font-mono font-black text-[#7a8b95] text-center">Lvl 0</td>
                  <td className="p-2 border font-black text-gray-400">NO ACCESS</td>
                  <td className="p-2 border text-gray-400">None. System node remains completely hidden.</td>
                  <td className="p-2 border font-mono text-gray-400">Hidden Sidebar Terminal</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono font-black text-[#3f809e] text-center">Lvl 1</td>
                  <td className="p-2 border font-bold text-[#3f809e]">VIEWER</td>
                  <td className="p-2 border font-medium text-gray-700">Read only access. Read-through lookups, PDF views.</td>
                  <td className="p-2 border font-mono">Stock Monitoring, Inventory lists</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono font-black text-[#a94228] text-center">Lvl 2</td>
                  <td className="p-2 border font-bold text-[#a94228]">EDITOR</td>
                  <td className="p-2 border font-medium text-gray-700">Create, Update. Write records & upload inventory logs.</td>
                  <td className="p-2 border font-mono">Adjust stock, register items</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono font-black text-[#212c46] text-center">Lvl 3</td>
                  <td className="p-2 border font-bold text-[#212c46]">VERIFIER</td>
                  <td className="p-2 border font-medium text-gray-700">Verify & Cross-Check. Check item quantities against scans.</td>
                  <td className="p-2 border font-mono">Audit submissions, variance logs</td>
                </tr>
                <tr>
                  <td className="p-2 border font-mono font-black text-[#657f4d] text-center">Lvl 4</td>
                  <td className="p-2 border font-bold text-[#657f4d]">APPROVER</td>
                  <td className="p-2 border font-medium text-gray-700">Full Approval. Authority to dispatch cargo & submit POs.</td>
                  <td className="p-2 border font-mono">Release loads, Approve billing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. STEP-BY-STEP ASSIGNMENT PROCEDURE */}
        <section>
          <h2 className="text-sm font-black text-[#212c46] border-b-2 border-[#b7a159] pb-1.5 mb-3 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle size={16} className="text-[#b7a159]" /> 4. Procedures & Assignments
          </h2>
          <div className="space-y-4 text-xs font-semibold text-gray-700 leading-relaxed pl-2">
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#212c46] text-white flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <strong className="text-gray-900 block font-black uppercase">STEP 1: ACCESS THE SYSTEM CONFIG</strong>
                Identify the "User Permissions" shortcut from the dashboard. Navigate to the node using Super Admin clearance.
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#212c46] text-white flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <strong className="text-gray-900 block font-black uppercase">STEP 2: ALLOCATE SECURITY SCOPES</strong>
                Select the target staff profile from the Staff Access list. Use the interactive configuration panel to drag y-axis limits and check permission scope matrix checkboxes (Viewer, Editor, Verifier, or Approver) depending on their job description.
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-6 h-6 rounded-full bg-[#212c46] text-white flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <strong className="text-gray-900 block font-black uppercase">STEP 3: AUTOSYNC & BACKUP</strong>
                Click "Save User". The updated settings are automatically written into Google Sheets DB via Apps Script with full synchronization of the principal sidebar. No service restart or reload is required.
              </div>
            </div>
          </div>
        </section>

        {/* INTEGRATED SHARED DIGITAL APPROVAL FOOTER */}
        <div className="pt-6 border-t border-dashed">
          <p className="text-[10px] font-black tracking-widest text-[#7a8b95] uppercase text-center mb-2">
            MANUAL AUTHORIZATION VERIFICATION / APPROVED BY COMPLIANCE BOARD
          </p>
          <DigitalApprovalComponent status="APPROVED" showStamp={true} />
        </div>

      </div>
    </div>
  );
}
export { UserPermissionsGuide };
