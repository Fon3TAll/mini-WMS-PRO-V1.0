import React from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';

export interface AuditLog {
  id: string;
  timestamp: string;
  sku: string;
  itemName: string;
  type: 'add' | 'deduct' | 'create' | 'system';
  changeType: string;
  qtyChange: number;
  user: string;
  remarks: string;
  stockType: 'FG' | 'RM';
}

interface StockMovementHistoryProps {
  logs: AuditLog[];
  onClearLogs?: () => void;
}

export default function StockMovementHistory({ logs, onClearLogs }: StockMovementHistoryProps) {
  const { t } = useLanguage();

  const getChangeTypeBadge = (type: string, isDirection: 'add' | 'deduct' | 'create' | 'system') => {
    switch (isDirection) {
      case 'create':
        return 'bg-[#657f4d]/10 text-[#657f4d] border-[#657f4d]/20';
      case 'add':
        return 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/20';
      case 'deduct':
        return 'bg-[#a94228]/10 text-[#a94228] border-[#a94228]/20';
      case 'system':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getDirectionIcon = (type: 'add' | 'deduct' | 'create' | 'system') => {
    switch (type) {
      case 'create':
        return <Icons.PlusCircle size={14} className="text-[#657f4d]" />;
      case 'add':
        return <Icons.TrendingUp size={14} className="text-[#3f809e]" />;
      case 'deduct':
        return <Icons.TrendingDown size={14} className="text-[#a94228]" />;
      case 'system':
      default:
        return <Icons.Cpu size={14} className="text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden mt-6 animate-fadeIn text-left">
      <div className="px-6 py-4 bg-[#f8f9fa] border-b border-[#eaeaec] flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#212c46] text-white rounded-xl shadow-sm">
            <Icons.History size={18} />
          </div>
          <div>
            <h4 className="text-[13px] font-black uppercase text-[#212c46] tracking-widest leading-none">
              {t('ประวัติการทำรายการสินค้าคงคลัง (Audit Log)', 'STOCK MOVEMENT & AUDIT LOGS')}
            </h4>
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wide mt-1">
              {t('จำแนกการปรับปรุงยอด Cycle Count / การรับเข้า-เบิกจ่ายย้อนหลัง 10 รายการล่าสุดเพื่อความโปร่งใส', 'TRACEABILITY OF LAST 10 CYCLE ACTIONS, STOCK IN/OUT & QUANTITY ADJUSTMENTS')}
            </p>
          </div>
        </div>
        {onClearLogs && logs.length > 0 && (
          <button
            onClick={onClearLogs}
            className="text-[11px] font-black uppercase text-[#a94228] hover:text-[#212c46] transition-all flex items-center gap-1 cursor-pointer"
          >
            <Icons.RotateCcw size={13} />
            {t('รีเซ็ตประวัติ', 'Reset Audit')}
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left font-sans border-collapse min-w-[900px]">
          <thead className="bg-[#133951] text-white text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-black">{t('เวลาที่ทำรายการ', 'Timestamp')}</th>
              <th className="py-3 px-4 font-black">{t('รหัสสินค้า (SKU)', 'SKU Code')}</th>
              <th className="py-3 px-4 font-black">{t('ชื่อรายละเอียดสินค้า', 'Item description')}</th>
              <th className="py-3 px-4 font-black">{t('ประเภทสต๊อก', 'Stock Type')}</th>
              <th className="py-3 px-4 font-black">{t('พฤติกรรมทำรายการ', 'Action Type')}</th>
              <th className="py-3 px-4 font-black text-right">{t('จำนวนที่เปลี่ยนแปลง', 'Adjusted Qty')}</th>
              <th className="py-3 px-4 font-black">{t('ผู้ทำรายการ', 'Triggered By')}</th>
              <th className="py-3 px-4 font-black">{t('เหตุผล / บันทึกเพิ่มเติม', 'Audit Remarks')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#eaeaec]/60 text-[12px]">
            {logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#f3f3f1]/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-mono font-black text-[#3f809e]">
                    {log.sku}
                  </td>
                  <td className="py-3 px-4 font-black text-[#212c46] max-w-[200px] truncate">
                    {log.itemName}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${
                      log.stockType === 'RM'
                        ? 'bg-[#b58c4f]/10 text-[#b58c4f] border-[#b58c4f]/30'
                        : 'bg-[#3f809e]/10 text-[#3f809e] border-[#3f809e]/30'
                    }`}>
                      {log.stockType === 'RM' ? t('วัตถุดิบ (RM)', 'Raw Material') : t('สำเร็จรูป (FG)', 'Finished Good')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      {getDirectionIcon(log.type)}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getChangeTypeBadge(log.changeType, log.type)}`}>
                        {log.changeType}
                      </span>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-black text-[13px] ${
                    log.type === 'create' || log.type === 'add'
                      ? 'text-[#657f4d]'
                      : log.type === 'deduct'
                      ? 'text-[#a94228]'
                      : 'text-[#212c46]'
                  }`}>
                    {log.type === 'create' || log.type === 'add' ? '+' : log.type === 'deduct' ? '-' : ''}
                    {Math.abs(log.qtyChange).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-600 whitespace-nowrap flex items-center gap-1 mt-1">
                    <Icons.User size={12} className="text-slate-400" />
                    {log.user}
                  </td>
                  <td className="py-3 px-4 text-[#7a8b95] font-medium text-[11px] italic max-w-[240px] truncate" title={log.remarks}>
                    {log.remarks || '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  {t('ไม่มีประวัติการเคลื่อนไหวสต๊อกชั่วคราว', 'No movement history available')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
