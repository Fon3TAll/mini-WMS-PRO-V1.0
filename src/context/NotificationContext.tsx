import React, { createContext, useContext, useState, useEffect } from 'react';

export interface NotificationItem {
  id: string;
  type: 'stock' | 'system' | 'task' | 'equipment' | 'security' | 'inbound' | 'outbound';
  title: string;
  message: string;
  severity: 'info' | 'success' | 'warning' | 'critical';
  timestamp: string; // ISO string
  read: boolean;
}

interface NotificationContextProps {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (
    type: NotificationItem['type'],
    title: string,
    message: string,
    severity: NotificationItem['severity']
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  toggleSound: () => void;
  soundEnabled: boolean;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    type: 'stock',
    title: 'ระดับพัสดุวิกฤต (Low Stock Alert)',
    message: 'รหัส SKU-CHEM-4412 (Solvent Type B) คงเหลือต่ำกว่าค่าเผื่อภัย (Safety Stock Threshold) แนะนำทำการสร้าง Requisition ด่วน',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    read: false,
  },
  {
    id: 'n-2',
    type: 'equipment',
    title: 'ครบรอบตรวจประเมินพาหนะคลังสินค้า',
    message: 'รถยกไฟฟ้า Forklift TK-9 มีกำหนดประเมินความปลอดภัยประจำรอบสัปดาห์ในวันศุกร์นี้เพื่อต่อใบอนุญาตความปลอดภัยระดับ 2',
    severity: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
  },
  {
    id: 'n-3',
    type: 'outbound',
    title: 'Wave #20260603A บรรจุเรียบร้อย',
    message: 'ชุดคำสั่งจัดสั่งของที่สแกนเบิกจ่ายเสร็จสิ้นผ่านขั้นตอนสล๊อตติ้งและคัดกรองแพคเกจ แบรนดิ้งเรียบร้อย อยู่ระหว่างรอเรียกขึ้นรถส่งมอบปลายทาง',
    severity: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
  },
  {
    id: 'n-4',
    type: 'security',
    title: 'การยืนยันสิทธิ์พัฒนาซอฟต์แวร์สำเร็จ',
    message: 'บัญชีระบบตรวจพบคีย์การใช้งานผู้ดูแลระบบระดับสูงผ่านการยืนยันเซสชันเรียบร้อย จากพิกัดเซิร์ฟเวอร์ Cloud Secure Sandbox',
    severity: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true,
  }
];

const SIMULATED_EVENTS = [
  {
    type: 'inbound' as const,
    title: 'ตรวจสอบคุณภาพพัสดุ (QC Inspection)',
    message: 'สินค้าล็อตรับเข้าล่าสุดรอการตรวจสอบคุณภาพ (QC) ที่จุดตรวจ Zone A กรุณาดำเนินการก่อนนำเข้าสต็อกหลัก',
    severity: 'warning' as const,
  },
  {
    type: 'stock' as const,
    title: 'แจ้งเตือนพัสดุใกล้หมด (Low Stock Alert)',
    message: 'สินค้า SKU-8803 ยอดคงเหลือลดลงต่ำกว่าจุดสั่งซื้อขั้นต่ำ (Reorder Point) กรุณาดำเนินการรับเข้าหรือเติมสต็อก',
    severity: 'critical' as const,
  },
  {
    type: 'inbound' as const,
    title: 'พัสดุส่งมอบใหม่มาถึงท่ารับของ #03',
    message: 'สินค้าล็อตป้ายขาว SKU-PKG-771 บรรจุมากับรถบรรทุกเครือข่ายภายนอกจอดเทียบช่อง Dock 03 สถานะรอตรวจนับ QR',
    severity: 'info' as const,
  },
  {
    type: 'equipment' as const,
    title: 'ลงบันทึกบำรุงรักษาสำเร็จ',
    message: 'เซ็นเซอร์ห้องควบคุมอุณหภูมิความเย็นโซน C รีเซ็ตพารามิเตอร์ส่งข้อมูลกลับเข้าเซิร์ฟเวอร์เสถียรปกติ',
    severity: 'success' as const,
  },
  {
    type: 'stock' as const,
    title: 'ตรวจนับยอดขัดแย้งเชิงปริมาณ (Discrepancy)',
    message: 'การสแกนตรวจแบบจุด Spot Count ที่พิกัด Zone B-3 สำหรับ SKU-PKG-771 พบจำนวนเกินกว่าบัญชีเบิกพัสดุ 2 หน่วย ยินยอมปรับยอดแล้ว',
    severity: 'warning' as const,
  },
  {
    type: 'outbound' as const,
    title: 'ผู้ขับเซ็นรับใบส่งสินค้าเรียบร้อย (e-POD)',
    message: 'รถหมายเลขทะเบียน 99-1201 ยืนยันการบรรจุและส่งสินค้าสำเร็จปลายทางเขตนิคมอุตสาหกรรมโรจนะ',
    severity: 'success' as const,
  },
  {
    type: 'security' as const,
    title: 'อัปเดตระดับความยินยอมเข้าถึงโครงสร้างข้อมูล WMS',
    message: 'ระบบจำลองสิทธิ์ความเหมาะสมผู้ใช้งานสำเร็จ ตรวจสอบความถูกต้องสมบูรณ์ (Integrity) สมบูรณ์เรียบร้อย',
    severity: 'info' as const,
  }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('wms_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse notifications, fallback to seed data', e);
      }
    }
    return SEED_NOTIFICATIONS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('wms_sound_enabled') !== 'false';
  });

  useEffect(() => {
    localStorage.setItem('wms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('wms_sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Audio effect context play
  const triggerAudioAlert = (severity: NotificationItem['severity']) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (severity === 'critical') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.45);
      } else if (severity === 'warning') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(330, audioCtx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.18); // G5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (err) {
      console.warn('Audio synthesis failed (benign)', err);
    }
  };

  const addNotification = (
    type: NotificationItem['type'],
    title: string,
    message: string,
    severity: NotificationItem['severity']
  ) => {
    const newItem: NotificationItem = {
      id: `n-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      title,
      message,
      severity,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newItem, ...prev]);
    triggerAudioAlert(severity);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Background AI Replenishment Analysis
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    const analyzeStock = async () => {
      try {
        const mockStockData = [
          { sku: "SKU-CHEM-4412", name: "Solvent Type B", consumptionRatePerDay: 45, currentStock: 100, reorderPoint: 150 },
          { sku: "SKU-PKG-771", name: "Cardboard Box XL", consumptionRatePerDay: 5, currentStock: 200, reorderPoint: 50 },
          { sku: "SKU-FG-001", name: "Sweet Tamarind Premium", consumptionRatePerDay: 120, currentStock: 150, reorderPoint: 400 }
        ];

        const response = await fetch('/api/ai/stock-agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stockData: mockStockData })
        });
        
        const data = await response.json();
        if (data && data.alerts && Array.isArray(data.alerts)) {
          data.alerts.forEach((alert: any) => {
            addNotification(
              'stock',
              `AI Alert: ${alert.item} ${alert.type}`,
              alert.message || `Replenishment suggested based on consumption rate.`,
              alert.type === 'Critical' ? 'critical' : 'warning'
            );
          });
        }
      } catch (err) {
        console.warn('AI Stock analysis silent local failure', err);
      }
      
      // Re-run AI analysis every 3 minutes
      timerId = setTimeout(analyzeStock, 180000);
    };

    timerId = setTimeout(analyzeStock, 8000); // initial delay of 8 seconds

    return () => clearTimeout(timerId);
  }, []);

  // Safe Warehouse Event Simulation loop to keep the dashboard active and realistically dynamic.
  useEffect(() => {
    const minDelay = 45000; // 45 seconds
    const maxDelay = 75000; // 75 seconds
    
    let timerId: NodeJS.Timeout;

    const runSimulation = () => {
      const idx = Math.floor(Math.random() * SIMULATED_EVENTS.length);
      const ev = SIMULATED_EVENTS[idx];
      addNotification(ev.type, ev.title, ev.message, ev.severity);

      const nextDelay = Math.floor(Math.random() * (maxDelay - minDelay)) + minDelay;
      timerId = setTimeout(runSimulation, nextDelay);
    };

    // Prepare first simulation trigger
    timerId = setTimeout(runSimulation, 60000);

    return () => clearTimeout(timerId);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
        toggleSound,
        soundEnabled,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
