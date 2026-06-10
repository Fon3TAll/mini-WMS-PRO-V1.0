import React, { useRef } from 'react';
import { Printer, Settings, Eye, Download, X } from 'lucide-react';
import { DraggableModal } from './DraggableModal';
import { useLanguage } from '../../context/LanguageContext';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  docId?: string;
  revision?: string;
  children: React.ReactNode;
}

export function PrintPreviewModal({
  isOpen,
  onClose,
  title = "CONFIDENTIAL REPORT",
  docId = "DOC-000",
  revision = "1.0",
  children
}: PrintPreviewModalProps) {
  const { t } = useLanguage();
  const currentDate = new Date().toLocaleDateString('th-TH', { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <DraggableModal 
      isOpen={isOpen} 
      onClose={onClose} 
      width="max-w-[900px]" 
      className="bg-[#525659] h-[90vh]"
      hideDefaultHeader={true}
    >
      {/* Modal Actions Header */}
      <div className="modal-handle cursor-move bg-[#323639] border-b border-[#202124] px-4 py-3 flex items-center justify-between shrink-0 shadow-sm no-print">
         <div className="flex items-center gap-4 text-white">
            <div className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer" onClick={onClose}>
              <X size={20} />
            </div>
            <div className="text-[13px] font-sans">
              <span className="font-medium mr-2">{title}</span>
              <span className="text-slate-400">1 / 1</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <button 
                onClick={handlePrint}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer" 
                title={t("พิมพ์เอกสาร", "Print PDF")}
            >
              <Printer size={20} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer" title="Download PDF">
              <Download size={20} />
            </button>
         </div>
      </div>

      {/* PDF Viewport */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center custom-scrollbar">
        {/* A4 Page Container */}
        <div 
          className="print-container print-preview-page print-layout-table bg-white shrink-0 mx-auto w-full max-w-[210mm] min-h-[297mm] shadow-2xl relative flex flex-col font-sans"
        >
          {/* Header */}
          <div className="print-layout-header w-full border-b-[3px] border-[#212c46] pb-4 mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                  <h1 className="text-[28px] font-black text-[#212c46] uppercase leading-none mb-1 flex items-center gap-2" style={{fontFamily: 'Inter, sans-serif'}}>
                      <span className="text-[#b58c4f]">CAI</span> 
                      <span>INTELLIGENCE</span>
                  </h1>
                  <span className="text-[11px] font-bold text-[#7a8b95] tracking-widest uppercase">
                    Integrated Warehouse Solutions
                  </span>
              </div>
              <div className="flex flex-col items-end text-right">
                <div className="px-3 py-1 bg-[#f8f9fa] border border-[#eaeaec] rounded text-[10px] font-black uppercase text-[#212c46] tracking-widest mb-1 shadow-sm">
                    {title}
                </div>
                <div className="text-[10px] font-mono text-[#7a8b95]">
                    DOC ID: <span className="font-bold text-[#212c46]">{docId}</span> | REV: <span className="font-bold text-[#212c46]">{revision}</span>
                </div>
                <div className="text-[10px] font-mono text-[#7a8b95] mt-0.5">
                    DATE PRINTED: <span className="font-bold text-[#212c46]">{new Date().toLocaleString()}</span>
                </div>
              </div>
          </div>

          /* Main Content Injection */
          <div className="flex-1 w-full text-sm">
            {children}
          </div>

          {/* Footer */}
          <div className="print-layout-footer w-full mt-10 pt-6 border-t-[1px] border-[#eaeaec] flex flex-col gap-6 shrink-0 relative pb-10">
              <div className="flex justify-between items-end gap-10">
                  <div className="flex-1 bg-slate-50 p-4 rounded-lg border border-slate-100 text-[10px] text-slate-500 font-medium leading-relaxed">
                      <p className="font-bold text-[#212c46] mb-1">บริษัท ที ออลล์ อินเทลลิเจนซ์ จำกัด</p>
                      <p>46 หมู่ที่ 5 ตำบลคลองสี่ อำเภอคลองหลวง จังหวัดปทุมธานี 12120</p>
                      <p className="mt-2 text-[9px] uppercase tracking-wider text-slate-400">Generated on: {currentDate}</p>
                  </div>
                  <div className="w-[200px] flex flex-col items-center justify-end text-center pt-8">
                      <div className="w-[150px] border-b border-[#212c46] border-dashed mb-2"></div>
                      <span className="text-[11px] font-black uppercase text-[#212c46] tracking-widest">AUTHORIZED SIGNATURE</span>
                      <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase">Operations Manager</span>
                  </div>
              </div>
          </div>

          <div className="print-footer-page-number"></div>
        </div>
      </div>
    </DraggableModal>
  );
}
