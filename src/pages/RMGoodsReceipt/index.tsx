import React, { useState, useCallback } from 'react';
import * as Icons from 'lucide-react';
import { DraggableModal } from '../../components/shared/DraggableModal';
import { BarcodeScanner } from '../../components/shared/BarcodeScanner';
import { QRCodeSVG } from 'qrcode.react';
import { useVoiceCommand } from '../../hooks/useVoiceCommand';
import Swal from 'sweetalert2';

const formatNumber = (val: number) => new Intl.NumberFormat('th-TH').format(val);

export default function RMGoodsReceipt() {
  const [printingLabels, setPrintingLabels] = useState<any[]>([]);
  const [selectedReceiptIds, setSelectedReceiptIds] = useState<Set<string>>(new Set());
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanQuery, setScanQuery] = useState('');
  
  // --- Form & Scanner Form Integration states ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFormScannerOpen, setIsFormScannerOpen] = useState(false);
  const [formGR, setFormGR] = useState({
    id: '',
    po: '',
    vendor: '',
    sku: '',
    name: '',
    qty: '',
    unit: 'KG',
    lot: '',
    exp: '',
    currentStock: '0',
    safetyStock: '1000'
  });

  const { isListening, isSupported, startListening, stopListening } = useVoiceCommand({
      onCommand: useCallback((text: string) => {
          // Removes trailing periods and converts to likely english characters if needed
          const cleanText = text.replace(/\.$/, '').toUpperCase();
          setScanQuery(cleanText);
      }, []),
      language: 'en-US' // For item codes / POs English is typically better, but we could make it configurable. using en-US for alphanumeric codes.
  });
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedReceiptIds(new Set(mockReceipts.map(r => r.id)));
      } else {
          setSelectedReceiptIds(new Set());
      }
  };

  const handleSelectOne = (id: string) => {
      const newSelected = new Set(selectedReceiptIds);
      if (newSelected.has(id)) {
          newSelected.delete(id);
      } else {
          newSelected.add(id);
      }
      setSelectedReceiptIds(newSelected);
  };
  
  const [mockReceipts, setMockReceipts] = useState<any[]>([
    { id: 'GR-2605-001', po: 'PO-RM26-101', vendor: 'Thai Chemical Corp.', sku: 'RM-5501', name: 'Sodium Chloride (Refined) 99%', qty: 2000, unit: 'KG', lot: 'L2026001', exp: '2028-12-31', currentStock: 1500, safetyStock: 3000 },
    { id: 'GR-2605-002', po: 'PO-RM26-104', vendor: 'Global Ingredients Inc.', sku: 'RM-5502', name: 'Premium Soap Base', qty: 500, unit: 'PACS', lot: 'L2026002', exp: '2028-12-31', currentStock: 800, safetyStock: 500 },
  ]);

  // --- Dynamic Scan-to-Auto-Fill Parser Helper ---
  const handleFormScan = (code: string) => {
    let updated = { ...formGR };
    
    if (code === 'PO-VEN-99321') {
      updated.po = 'PO-VEN-99321';
      updated.vendor = 'Siam Bio Chemical Partners';
      Swal.fire({
        icon: 'success',
        title: 'Auto-Filled PO Info',
        text: `พบใบซื้อหลัก PO-VEN-99321: ปลายทาง Siam Bio Chemical เกรดอาหาร เติมข้อมูลเรียบร้อย!`,
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else if (code === 'SKU-CHEM-8109') {
      updated.sku = 'SKU-CHEM-8109';
      updated.name = 'สารทำละลาย Solvent Type A';
      updated.unit = 'LITERS';
      updated.currentStock = '2500';
      updated.safetyStock = '2000';
      updated.lot = 'L' + new Date().getFullYear() + '-8109';
      updated.exp = '2028-06-30';
      Swal.fire({
        icon: 'success',
        title: 'Auto-Filled Material SKU',
        text: `สแกนพบวัตถุดิบ [SKU-CHEM-8109] เติมชื่อวัตถุดิบและค่าควบคุมเรียบร้อย!`,
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else if (code === 'PLT-FG-2026-809') {
      updated.lot = 'L2026-809';
      updated.sku = 'FG-8809';
      updated.name = 'Premium Packing Cards Pallet';
      updated.unit = 'PACS';
      updated.currentStock = '450';
      updated.safetyStock = '300';
      updated.exp = '2029-01-01';
      Swal.fire({
        icon: 'success',
        title: 'Auto-Filled Lot & SKU',
        text: `พาเลท ID [PLT-FG-2026-809] ระบบถอดรหัส Lot และข้อมูลเรียบร้อย!`,
        timer: 1800,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else if (code.startsWith('LOC-')) {
      updated.lot = code;
      Swal.fire({
        icon: 'warning',
        title: 'Warehouse Location Scanned',
        text: `โค้ดนี้คือตำแหน่งเก็บ [${code}] นำไปกรอกช่องเลขที่ Lot สำหรับตรวจสอบ`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    } else {
      updated.sku = code;
      updated.lot = 'LOT-' + code.slice(-4) + '-' + Math.floor(10 + Math.random() * 90);
      Swal.fire({
        icon: 'info',
        title: 'Generic Code Filled',
        text: `กรอกรหัสทั่วไป [${code}] ในช่อง SKU และสุ่ม Lot ชั่วคราวเรียบร้อย`,
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    }
    
    setFormGR(updated);
  };

  const handleAddReceiptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formGR.sku || !formGR.name || !formGR.qty) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูล SKU, ชื่อวัตถุดิบ และ จำนวนรับเข้าจริง!'
      });
      return;
    }

    const newID = formGR.id.trim() || `GR-2606-${Math.floor(100 + Math.random() * 900)}`;
    const newRecord = {
      id: newID,
      po: formGR.po || `PO-RM26-${Math.floor(100 + Math.random() * 900)}`,
      vendor: formGR.vendor || 'General Direct Supplier',
      sku: formGR.sku,
      name: formGR.name,
      qty: parseFloat(formGR.qty) || 0,
      unit: formGR.unit,
      lot: formGR.lot || `L${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`,
      exp: formGR.exp || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      currentStock: parseFloat(formGR.currentStock) || 0,
      safetyStock: parseFloat(formGR.safetyStock) || 500
    };

    setMockReceipts([newRecord, ...mockReceipts]);
    setIsAddModalOpen(false);
    
    // Clear form
    setFormGR({
      id: '', po: '', vendor: '', sku: '', name: '', qty: '', unit: 'KG', lot: '', exp: '', currentStock: '0', safetyStock: '1000'
    });

    Swal.fire({
      icon: 'success',
      title: 'ตรวรับเข้าคลังสำเร็จ!',
      text: `สินค้าใหม่เลขที่ ${newID} ถูกเพิ่มเข้าคิวเพื่อเตรียมพิมพ์บาร์โค้ดแท็กแล้ว`,
      timer: 2000,
      showConfirmButton: false
    });
  };

  return (
    <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 text-[#212c46]">
      {isScannerOpen && (
        <BarcodeScanner 
          expectedType="inbound" 
          onClose={() => setIsScannerOpen(false)} 
          onScan={(data) => {
            setScanQuery(data);
            setIsScannerOpen(false);
          }} 
        />
      )}

      <DraggableModal
          isOpen={printingLabels.length > 0}
          onClose={() => setPrintingLabels([])}
          width="max-w-[900px]"
          customHeader={
              <div className="print:hidden flex justify-between items-center bg-[#212c46] text-white p-4 sticky top-0 z-50 shadow-md cursor-move w-full rounded-t-3xl">
                  <div className="flex items-center gap-3">
                      <Icons.Printer size={20} className="text-[#b7a159]" />
                      <div>
                          <h2 className="font-black tracking-widest text-[13px] uppercase">Print Preview: RM Tags</h2>
                          <p className="text-[10px] text-[#7a8b95] uppercase font-bold tracking-widest truncate max-w-sm">Receipts: {printingLabels.map(l => l.id).join(', ')}</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <button onClick={() => window.print()} className="bg-[#b7a159] hover:bg-[#cbb56c] text-[#212c46] border border-[#b7a159] px-6 py-2 font-black rounded-lg text-[11px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
                         <Icons.Printer size={14} /> Print Now
                      </button>
                      <button onClick={() => setPrintingLabels([])} className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-2 font-bold rounded-lg text-[11px] uppercase tracking-widest transition-all text-white flex items-center gap-2">
                         <Icons.X size={14} /> Close
                      </button>
                  </div>
              </div>
          }
      >
           <div className="w-full bg-[#525252] overflow-y-auto print:bg-white flex flex-col font-sans mb-10 transition-all max-h-[75vh]">
              <style dangerouslySetInnerHTML={{__html: `
                  @page { size: A4 portrait; margin: 10mm; }
                  @media print {
                      body * { visibility: hidden; }
                      #printable-area, #printable-area * { visibility: visible; }
                      #printable-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0; }
                  }
              `}} />
              
              <div id="printable-area" className="bg-white w-full max-w-[210mm] mx-auto mt-8 mb-16 p-8 shadow-2xl print:shadow-none print:m-0 print:p-0 text-black">
                  <div className="flex flex-col items-center relative">
                      {printingLabels.map((printingLabel) => (
                          [1, 2].map((idx) => (
                              <React.Fragment key={`${printingLabel.id}-${idx}`}>
                                  <div className={`border-[3px] border-black p-6 w-[18cm] h-[12cm] flex flex-col bg-white text-black break-inside-avoid relative shadow-sm my-4 ${idx === 1 ? 'print:mt-0 print:pt-4' : ''}`}>
                                  <div className="absolute top-4 right-4 text-xs font-bold border border-black px-2 py-1">LBL-{idx}</div>
                                  
                                  <div className="text-center w-full pb-4 border-b-[3px] border-black mt-2">
                                      <h3 className="text-5xl font-black mb-2">RM PALLET</h3>
                                      <p className="text-sm uppercase font-bold tracking-[0.3em] bg-black text-white px-4 py-1 inline-block">
                                          RAW MATERIAL / วัตถุดิบ
                                      </p>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col justify-between py-4">
                                      <div className="flex justify-between items-end border-b border-dotted border-black pb-2 mb-4">
                                          <div className="flex items-end gap-2"><span className="font-bold text-sm w-24 shrink-0">Item Name:</span> <span className="text-xl font-black leading-tight text-left">{printingLabel?.name}</span></div>
                                      </div>
                                      
                                      <div className="flex-1 flex w-full">
                                          <div className="flex-[6] flex flex-col justify-center space-y-3.5 pr-6">
                                              <div className="flex items-end gap-2 border-b border-dotted border-black pb-1.5"><span className="font-bold text-sm w-12 shrink-0">LOT:</span> <span className="text-lg font-bold tracking-widest leading-none text-left">{printingLabel?.lot}</span></div>
                                              <div className="flex items-end gap-2 border-b border-dotted border-black pb-1.5"><span className="font-bold text-sm w-12 shrink-0">QTY:</span> <span className="text-lg font-bold leading-none text-left">{formatNumber(printingLabel?.qty)} {printingLabel?.unit}</span></div>
                                              <div className="flex items-end gap-2 border-b border-dotted border-black pb-1.5"><span className="font-bold text-sm w-12 shrink-0">MFG:</span> <span className="text-lg font-bold leading-none text-left">{new Date().toISOString().split('T')[0]}</span></div>
                                              <div className="flex items-end gap-2 border-b border-dotted border-black pb-1.5"><span className="font-bold text-sm w-12 shrink-0">EXP:</span> <span className="text-lg font-bold leading-none text-left">{printingLabel?.exp}</span></div>
                                          </div>
                                          <div className="flex-[4] flex flex-col items-center justify-center border-l-[3px] border-black pl-4">
                                              <div className="bg-white p-2 flex justify-center items-center">
                                                  <QRCodeSVG value={`${printingLabel?.sku}-00${idx}`} size={124} level="M" />
                                              </div>
                                              <p className="text-center font-mono text-lg font-bold tracking-[0.1em] mt-3 whitespace-nowrap">{printingLabel?.sku}-00{idx}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              {idx === 1 && (
                                  <div className="w-[19cm] flex items-center gap-4 my-2 opacity-100 print:opacity-100">
                                      <div className="border-t-[2px] border-dashed border-gray-400 flex-1"></div>
                                      <Icons.Scissors className="text-gray-400 w-5 h-5" />
                                      <div className="border-t-[2px] border-dashed border-gray-400 flex-1"></div>
                                  </div>
                              )}
                              </React.Fragment>
                          ))
                      ))}
                  </div>
              </div>
           </div>
      </DraggableModal>

      <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#3f809e] blur-[15px] opacity-20 rounded-full group-hover:opacity-60 transition-all duration-700"></div>
                  <div className="relative z-10 p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm">
                      <Icons.Download size={28} strokeWidth={2.5} className="text-[#3f809e]" />
                  </div>
              </div>
              <div className="text-left">
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                      INBOUND <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">VERIFY RM</span>
                  </h3>
                  <div className="flex items-center gap-1.5 mt-[6px]">
                      <div className="w-10 h-[2px] bg-[#3f809e]"></div>
                      <p className="text-[11px] font-bold text-[#676767] uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none">
                          RAW MATERIALS GOODS RECEIPT AND LABEL PRINTING
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div className="px-4 sm:px-8 w-full">
        <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col min-h-[550px] animate-fadeIn p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <h4 className="font-black uppercase tracking-widest text-lg">Pending Receipts (ตรวจรับจริงและเช็คเกณฑ์สินค้าเคมี)</h4>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Scan or type Receipt ID, PO, SKU..." 
                            value={scanQuery}
                            onChange={(e) => setScanQuery(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e] w-64 uppercase"
                        />
                        {scanQuery && (
                            <button onClick={() => setScanQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500">
                                <Icons.X size={14} />
                            </button>
                        )}
                    </div>
                    <button 
                        onClick={() => {
                            const toPrint = mockReceipts.filter(r => selectedReceiptIds.has(r.id));
                            if (toPrint.length > 0) setPrintingLabels(toPrint);
                        }}
                        disabled={selectedReceiptIds.size === 0}
                        className="bg-[#b7a159] hover:bg-[#cbb56c] disabled:opacity-50 disabled:cursor-not-allowed text-[#212c46] px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Icons.Printer size={16} /> PRINT SELECTED ({selectedReceiptIds.size})
                    </button>
                    <button 
                        onClick={() => setIsScannerOpen(true)}
                        className="bg-[#212c46] hover:bg-[#32436d] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Icons.Scan size={16} /> SCAN QUERY
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-[#3f809e] hover:bg-[#30667d] text-white px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-colors shadow-sm"
                    >
                        <Icons.PlusCircle size={16} /> ตรวจรับสินค้าใหม่
                    </button>
                    <button 
                        onClick={isListening ? stopListening : startListening}
                        disabled={!isSupported}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shadow-sm ${
                            isListening 
                            ? 'bg-[#932c2e] hover:bg-[#a94228] text-white animate-pulse' 
                            : 'bg-[#133951] hover:bg-[#1a4f70] text-white'
                        }`}
                        title={!isSupported ? "Voice not supported" : "Voice Search"}
                    >
                        <Icons.Mic size={16} /> {isListening ? 'LISTENING...' : 'VOICE'}
                    </button>
                </div>
            </div>

            {/* NESTED FORM BARCODE SCANNER POPUP */}
            {isFormScannerOpen && (
              <BarcodeScanner 
                expectedType="inbound"
                title="Goods Receipt Field Auto-Populator"
                onClose={() => setIsFormScannerOpen(false)}
                onScan={(data) => {
                  handleFormScan(data);
                  setIsFormScannerOpen(false);
                }}
              />
            )}

            {/* MULTI-FIELD GOODS RECEIPT FORM MODAL */}
            <DraggableModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              width="max-w-2xl"
              title={
                <div className="flex items-center gap-2.5 text-left text-white">
                  <Icons.PlusCircle className="text-[#3f809e]" size={20} />
                  <div>
                    <h3 className="font-black text-[13px] uppercase tracking-widest text-[#eeeeee]">ตรวจรับสินค้าวัตถุดิบใหม่ (Inbound Goods Receipt Entry)</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">WMS Digital Inbound Verification System</p>
                  </div>
                </div>
              }
            >
              <div className="p-6 bg-[#fbfbfb] text-left">
                {/* AUTO FILL NOTIFICATION BAR */}
                <div className="mb-5 bg-[#3f809e]/10 border border-[#3f809e]/30 px-4 py-3 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#3f809e]/20 flex items-center justify-center text-[#3f809e]">
                      <Icons.QrCode size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#3f809e] tracking-wider block">Smart Auto-Populator Sensor</span>
                      <p className="text-[11.5px] font-black text-slate-700">มีสติกเกอร์รหัสวัตถุดิบ/ใบ PO? กดสแกนลอยตัวเพื่อป้อนข้อมูลอัตโนมัติ!</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFormScannerOpen(true)}
                    className="bg-[#3f809e] hover:bg-[#30667d] text-white px-3.5 py-1.5 rounded-xl font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-colors shadow-sm"
                  >
                    <Icons.Scan size={13} /> สแกนออโต้ฟิล (Fast Scan)
                  </button>
                </div>

                <form onSubmit={handleAddReceiptSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">เลขที่ใบรับสินค้า GR ID (ว่างเพื่อเจนอัตโนมัติ)</label>
                        <input
                          type="text"
                          placeholder="เช่น GR-2606-101"
                          value={formGR.id}
                          onChange={(e) => setFormGR({ ...formGR, id: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">เลขที่ใบสั่งซื้อ Purchase Order (PO) *</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="เช่น PO-RM26-105"
                            required
                            value={formGR.po}
                            onChange={(e) => setFormGR({ ...formGR, po: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e] pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Simulate scan click
                              setIsFormScannerOpen(true);
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3f809e] hover:text-[#212c46] p-1.5"
                            title="สแกนรหัสเพื่อกรอกใบ PO"
                          >
                            <Icons.Scan size={15} />
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">ชื่อซัพพลายเออร์ (Vendor Name) *</label>
                        <input
                          type="text"
                          placeholder="เช่น Siam Chemical Group"
                          required
                          value={formGR.vendor}
                          onChange={(e) => setFormGR({ ...formGR, vendor: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">รหัสวัตถุดิบ SKU *</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="เช่น RM-5503"
                              required
                              value={formGR.sku}
                              onChange={(e) => setFormGR({ ...formGR, sku: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsFormScannerOpen(true);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3f809e] hover:text-[#212c46] p-1.5"
                              title="สแกนรหัสเพื่อกรอก SKU"
                            >
                              <Icons.Scan size={15} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">หน่วยนับ (Unit)</label>
                          <select
                            value={formGR.unit}
                            onChange={(e) => setFormGR({ ...formGR, unit: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                          >
                            <option value="KG">KG (กิโลกรัม)</option>
                            <option value="LITERS">LITERS (ลิตร)</option>
                            <option value="PACS">PACS (แพ็คเกจ)</option>
                            <option value="DRUM">DRUM (ถังเคมี)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">ชื่อรายการวัตถุดิบ (Material Description) *</label>
                        <input
                          type="text"
                          placeholder="เช่น แป้งสาลีสกัดเข้มข้นพิเศษ"
                          required
                          value={formGR.name}
                          onChange={(e) => setFormGR({ ...formGR, name: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">จำนวนที่รับจริง (QTY) *</label>
                          <input
                            type="number"
                            placeholder="0.00"
                            required
                            min="0.1"
                            step="any"
                            value={formGR.qty}
                            onChange={(e) => setFormGR({ ...formGR, qty: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">หมายเลขล็อต (LOT No.) *</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="เช่น L2026119"
                              required
                              value={formGR.lot}
                              onChange={(e) => setFormGR({ ...formGR, lot: e.target.value })}
                              className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e] pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setIsFormScannerOpen(true);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#3f809e] hover:text-[#212c46] p-1.5"
                              title="สแกนบาร์โค้ดเพื่อกรอก Lot"
                            >
                              <Icons.Scan size={15} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">คลังประจุบัน (Pre-Stock)</label>
                          <input
                            type="number"
                            value={formGR.currentStock}
                            onChange={(e) => setFormGR({ ...formGR, currentStock: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">สต็อกปลอดภัย (Min-Safety)</label>
                          <input
                            type="number"
                            value={formGR.safetyStock}
                            onChange={(e) => setFormGR({ ...formGR, safetyStock: e.target.value })}
                            className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1">วันหมดอายุวัตถุดิบ (Expiry Date)</label>
                        <input
                          type="date"
                          value={formGR.exp}
                          onChange={(e) => setFormGR({ ...formGR, exp: e.target.value })}
                          className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#3f809e]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-xl text-[10.5px] uppercase tracking-wider transition-colors"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#3f809e] hover:bg-[#30667d] text-white font-black rounded-xl text-[10.5px] uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md"
                    >
                      <Icons.CheckCircle2 size={14} /> ยืนยันตรวจรับจริง & พิมพ์คิว
                    </button>
                  </div>
                </form>
              </div>
            </DraggableModal>

            <div className="flex-1 overflow-auto custom-scrollbar bg-white">
                <table className="w-full text-left font-sans border-collapse">
                    <thead className="bg-[#133951] text-white sticky top-0 z-10 text-[12px]">
                        <tr>
                            <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] w-12 text-center">
                                <input type="checkbox" className="accent-[#3f809e] w-4 h-4 cursor-pointer" onChange={handleSelectAll} checked={mockReceipts.length > 0 && selectedReceiptIds.size === mockReceipts.length} />
                            </th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px]">เอกสารรับวัตถุดิบ (GR)</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px]">รายละเอียดวัตถุดิบ</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-right">จำนวนที่รับเข้า</th>
                            <th className="py-4 px-4 font-black uppercase tracking-widest border-b-2 border-[#ad2b10] text-[12px] text-center">การจัดการ</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eaeaec]/60">
                        {mockReceipts.filter(r => !scanQuery || Object.values(r).join(' ').toLowerCase().includes(scanQuery.toLowerCase())).map(rec => (
                            <tr key={rec.id} className="hover:bg-[#f3f3f1]/60 transition-colors">
                                <td className="py-2.5 px-4 text-center">
                                    <input type="checkbox" className="accent-[#3f809e] w-4 h-4 cursor-pointer" onChange={() => handleSelectOne(rec.id)} checked={selectedReceiptIds.has(rec.id)} />
                                </td>
                                <td className="py-2.5 px-4">
                                    <div className="font-black text-[#212c46] text-[12px]">{rec.id}</div>
                                    <div className="text-[10px] text-slate-500 font-bold">{rec.po} • {rec.vendor}</div>
                                </td>
                                <td className="py-2.5 px-4">
                                    <div className="flex flex-col gap-1 items-start">
                                        <div className="font-black text-[#212c46] text-[12px] flex items-center gap-2">
                                            {rec.name}
                                            {rec.currentStock < rec.safetyStock && (
                                                <span className="inline-flex items-center gap-1 bg-[#ad2b10] text-white px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-bold">
                                                    <Icons.AlertTriangle size={10} />
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                                            SKU: {rec.sku} | LOT: {rec.lot} | <span className={`${rec.currentStock < rec.safetyStock ? 'text-red-600' : 'text-[#3f809e]'}`}>Stock: {formatNumber(rec.currentStock)} / Min: {formatNumber(rec.safetyStock)} {rec.unit}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-2.5 px-4 font-black text-[#212c46] text-[12px] text-right font-mono">
                                    {formatNumber(rec.qty)} {rec.unit}
                                </td>
                                <td className="py-2.5 px-4 text-center whitespace-nowrap">
                                    <button 
                                        onClick={() => setPrintingLabels([rec])}
                                        className="inline-flex py-1.5 px-3 rounded-lg bg-[#b7a159] text-[#212c46] font-black text-[10px] uppercase tracking-widest hover:bg-[#cbb56c] transition-all items-center gap-1.5"
                                    >
                                        <Icons.Printer size={14} /> Print Tags
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  );
}
