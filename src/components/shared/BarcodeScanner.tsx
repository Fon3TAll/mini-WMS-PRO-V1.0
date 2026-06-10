import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { 
  Camera, 
  X, 
  Sparkles, 
  History, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RotateCcw, 
  Info, 
  Keyboard, 
  ArrowRight,
  ShieldAlert,
  ListFilter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
  expectedType?: 'inbound' | 'outbound' | 'all';
}

const PRESET_INBOUND_CODES = [
  { code: 'PO-VEN-99321', type: 'Purchase Order', desc: 'ใบสั่งซื้อวัตถุดิบเคมีจากฝรั่งเศส' },
  { code: 'PLT-FG-2026-809', type: 'Pallet ID', desc: 'พาเลทสินค้าสำเร็จรูป รอเก็บเข้าตู้' },
  { code: 'SKU-CHEM-8109', type: 'Item SKU', desc: 'สารทำละลาย Solvent Type A' },
  { code: 'LOC-RM-B2-S3', type: 'Location Code', desc: 'ชั้นเก็บวัตถุดิบ โซน B2 ชั้น 3' }
];

const PRESET_OUTBOUND_CODES = [
  { code: 'SO-BRN-30114', type: 'Sale Order', desc: 'ใบสั่งจัดส่งไปสาขาภาคเหนือ' },
  { code: 'PLT-RM-B041', type: 'RM Pallet', desc: 'พาเลทเบิกจ่ายสำหรับสายผลิต 2' },
  { code: 'SKU-PKG-771', type: 'Packaging SKU', desc: 'กล่องกระดาษคราฟท์ไซต์ XL' },
  { code: 'LOC-FG-Z1-S4', type: 'Location Code', desc: 'ชั้นสินค้าสำเร็จรูป โซน Z1 ชั้น 4' }
];

export function BarcodeScanner({ 
  onScan, 
  onClose, 
  title = "WMS Smart Barcode Scanner", 
  expectedType = 'all' 
}: BarcodeScannerProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'simulator'>('camera');
  const [scanHistory, setScanHistory] = useState<{ code: string; timestamp: string; method: 'camera' | 'simulator' }[]>(() => {
    try {
      const saved = localStorage.getItem('wms_scan_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>('');

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrElementId = "wms-barcode-scanner-element";

  // Persistent History
  useEffect(() => {
    localStorage.setItem('wms_scan_history', JSON.stringify(scanHistory));
  }, [scanHistory]);

  // Audio Beep generator (Synthesized Web Audio API - lightweight & safe)
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime); // High pitch barcode scanner sound
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio Context is blocked or not supported on this browser context', e);
    }
  };

  // Helper when scanning is successful
  const handleSuccessfulScan = (code: string, method: 'camera' | 'simulator') => {
    playBeep();
    const newEntry = {
      code,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      method
    };
    setScanHistory(prev => [newEntry, ...prev.slice(0, 19)]); // Keep last 20 scans
    onScan(code);
  };

  // Setup/Tear down camera scan
  useEffect(() => {
    if (activeTab !== 'camera') {
      stopCameraScan();
      return;
    }

    let isMounted = true;

    const startScanning = async () => {
      setCameraError(null);
      setIsScanning(false);

      try {
        // Enforce camera checks
        const devices = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        setAvailableCameras(devices);
        
        if (devices.length === 0) {
          throw new Error("ไม่มีอุปกรณ์กล้องติดอยู่กับเครื่องนี้ หรือปิดการอนุญาตในบราวเซอร์");
        }

        const deviceToUse = selectedCameraId || devices[0].id;
        if (!selectedCameraId) {
          setSelectedCameraId(deviceToUse);
        }

        const html5QrCode = new Html5Qrcode(qrElementId);
        html5QrCodeRef.current = html5QrCode;

        setIsScanning(true);
        await html5QrCode.start(
          deviceToUse,
          {
            fps: 12,
            qrbox: (width, height) => {
              const size = Math.min(width, height) * 0.65;
              return { width: size, height: size };
            },
            aspectRatio: 1.0
          },
          (decodedText) => {
            handleSuccessfulScan(decodedText, 'camera');
          },
          () => {
            // Silence scanner debug triggers
          }
        );
      } catch (err: any) {
        console.warn("Camera init failed", err);
        if (isMounted) {
          setCameraError(err.message || "ไม่สามารถเชื่อมต่ออุปกรณ์กล้องได้ กรุณาใช้แท็บตัวจำลอง (Simulation Mode) แทน");
          setIsScanning(false);
          // Automatically roll back to simulator inside iframe sandbox gracefully
          setActiveTab('simulator');
        }
      }
    };

    // Tiny timeout to ensure mount element is present
    const timer = setTimeout(() => {
      startScanning();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      stopCameraScan();
    };
  }, [activeTab, selectedCameraId]);

  const stopCameraScan = async () => {
    if (html5QrCodeRef.current) {
      if (html5QrCodeRef.current.isScanning) {
        try {
          await html5QrCodeRef.current.stop();
        } catch (e) {
          console.error("Failed to stop scan stream", e);
        }
      }
      html5QrCodeRef.current = null;
    }
    setIsScanning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getPresetList = () => {
    if (expectedType === 'inbound') return PRESET_INBOUND_CODES;
    if (expectedType === 'outbound') return PRESET_OUTBOUND_CODES;
    return [...PRESET_INBOUND_CODES, ...PRESET_OUTBOUND_CODES];
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[24px] overflow-hidden w-full max-w-2xl shadow-2xl flex flex-col md:flex-row border border-slate-200"
      >
        {/* Main Interface */}
        <div className="flex-1 flex flex-col border-r border-slate-100">
          {/* Header */}
          <div className="bg-[#1e293b] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                <Camera size={18} />
              </span>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider">{title}</h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {expectedType === 'inbound' ? 'LOGISTICS & INBOUND SCOPE' : expectedType === 'outbound' ? 'TRANSPORT & OUTBOUND SCOPE' : 'WMS CENTRAL HUB SCAN'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)} 
                className={`p-2 rounded-lg transition-colors border ${soundEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                title="ระดับเสียง Beep"
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button 
                onClick={onClose} 
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('camera')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'camera' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera size={14} />
              สแกนด้วยกล้องจริง (Camera)
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'simulator' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Keyboard size={14} />
              หน้าจอเครื่องจำลอง (Simulator)
            </button>
          </div>

          {/* Body Section */}
          <div className="p-6 flex-1 flex flex-col justify-between bg-slate-50">
            {activeTab === 'camera' ? (
              <div className="space-y-4 flex-1 flex flex-col justify-center">
                {/* Camera Viewport */}
                <div className="relative aspect-video w-full max-w-md mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex flex-col justify-center items-center">
                  
                  {/* Visual laser animated bar */}
                  {isScanning && (
                    <motion.div 
                      initial={{ y: 0 }}
                      animate={{ y: [0, 180, 0] }}
                      transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                      className="absolute inset-x-0 h-0.5 bg-emerald-500 opacity-80 shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10"
                    />
                  )}

                  {/* Corner Target Accents */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500 rounded-tl-sm z-10" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500 rounded-tr-sm z-10" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500 rounded-bl-sm z-10" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500 rounded-br-sm z-10" />

                  {/* The Reader HTML5 component */}
                  <div id={qrElementId} className="w-full h-full object-cover"></div>

                  {!isScanning && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-2 p-6 text-center">
                      <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin mb-1" />
                      <p className="text-xs font-semibold text-white">กำลังขอสิทธิ์เข้าใช้งานกล้องหน้า...</p>
                      <p className="text-[10px] text-slate-500">กรุณากด 'Allow' ในหน้าต่างบราวเซอร์ของคุณ</p>
                    </div>
                  )}

                  {cameraError && (
                    <div className="absolute inset-0 p-5 bg-slate-900/95 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="p-3 bg-red-500/10 text-red-400 rounded-full border border-red-500/25">
                        <ShieldAlert size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">เชื่อมต่อกล้องไม่สำเร็จ</h4>
                        <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                          บราวเซอร์ในบล็อก iframe ถูกจำกัดสิทธิ์ หรือไม่มีอุปกรณ์กล้องเชื่อมต่ออยู่
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('simulator')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
                      >
                        เข้าสู้โหมดจำลอง (Simulator) <ArrowRight size={12} />
                      </button>
                    </div>
                  )}

                  {/* Camera selector if multiple devices */}
                  {availableCameras.length > 1 && (
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 text-white p-2 rounded-lg border border-slate-800 z-20 flex gap-2 items-center">
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium font-mono uppercase">Camera Dev:</span>
                      <select 
                        value={selectedCameraId}
                        onChange={(e) => setSelectedCameraId(e.target.value)}
                        className="w-full bg-slate-950 text-[10px] font-mono border-0 rounded p-1 text-slate-300 focus:ring-1 focus:ring-emerald-500"
                      >
                        {availableCameras.map((cam, idx) => (
                          <option key={cam.id} value={cam.id}>
                            {cam.label || `Camera ${idx + 1}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl border border-emerald-100 flex items-start gap-2 max-w-md mx-auto">
                  <Info size={14} className="shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    วางคิวอาร์โค้ด (QR) หรือโค้ดแถบ (Barcode) ของสินค้าหรือพัสดุไว้ในกรอบสแกนระบบจะประมวลผลทันที
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5 flex-1 flex flex-col">
                {/* Simulator Manual Input Box */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Keyboard size={12} className="text-[#3b82f6]" /> ป้อนรหัสสแกนด้วยตนเอง (Manual Type-in)
                  </span>
                  
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="เช่น SKU-CHEM-1200 หรือ PO-..."
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && manualInput.trim()) {
                          handleSuccessfulScan(manualInput.trim(), 'simulator');
                          setManualInput('');
                        }
                      }}
                      className="flex-1 bg-slate-50 text-xs font-mono border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white placeholder:text-slate-400"
                    />
                    <button
                      onClick={() => {
                        if (manualInput.trim()) {
                          handleSuccessfulScan(manualInput.trim(), 'simulator');
                          setManualInput('');
                        }
                      }}
                      className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shrink-0 uppercase tracking-wider"
                    >
                      สแกนจำลอง
                    </button>
                  </div>
                </div>

                {/* Preset List Selection */}
                <div className="space-y-2 flex-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <ListFilter size={12} /> คลิกเลือกค่าทดสอบตามหมวดหมู่ ({expectedType.toUpperCase()})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {getPresetList().map((preset) => (
                      <button
                        key={preset.code}
                        onClick={() => handleSuccessfulScan(preset.code, 'simulator')}
                        className="p-3 text-left bg-white hover:bg-indigo-50/50 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all group flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold font-mono text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {preset.code}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wide bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700 rounded transition-colors">
                            {preset.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 truncate">
                          {preset.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Scan History panel */}
        <div className="w-full md:w-60 bg-slate-900 text-white p-5 flex flex-col h-[280px] md:h-auto md:max-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-slate-300">
              <History size={13} className="text-emerald-400" /> Scan Log ({scanHistory.length})
            </span>
            {scanHistory.length > 0 && (
              <button 
                onClick={() => setScanHistory([])}
                className="text-[10px] font-bold text-slate-500 hover:text-red-400 tracking-wider uppercase transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1 custom-scrollbar">
            {scanHistory.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-center text-slate-600 p-4">
                <Sparkles size={20} className="mb-2 text-slate-700" />
                <p className="text-[10px] font-bold uppercase tracking-widest">No Active Scans</p>
                <p className="text-[9px] mt-1 max-w-[140px]">ผลลัพธ์ที่สแกนจะถูกบันทึกแสดงตรงนี้</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {scanHistory.map((item, index) => (
                  <motion.div
                    key={`${item.code}-${index}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-2 bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-all text-left flex items-start justify-between gap-1 group"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold font-mono text-emerald-400 truncate tracking-wide">
                        {item.code}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider">
                          {item.timestamp}
                        </span>
                        <span className={`text-[7px] px-1 font-semibold rounded uppercase ${
                          item.method === 'camera' ? 'bg-indigo-900/55 text-indigo-300' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {item.method}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.code)}
                      className="p-1 text-slate-500 hover:text-white rounded transition-colors"
                      title="คัดลอกรหัส"
                    >
                      {copiedId === item.code ? <Check size={11} className="text-emerald-500" /> : <Copy size={11} />}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {scanHistory.length > 0 && (
            <div className="pt-3 border-t border-slate-800 mt-auto shrink-0 space-y-2">
              <span className="text-[9px] text-slate-500 flex items-center gap-1 justify-center leading-none">
                <Sparkles size={10} className="text-emerald-400" /> 
                ล่าสุด: <strong className="text-slate-300 truncate max-w-[100px]">{scanHistory[0].code}</strong>
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
