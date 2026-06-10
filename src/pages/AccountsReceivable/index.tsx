import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import * as Icons from 'lucide-react';
import KpiCard from '../../components/shared/KpiCard';

const THEME = {
  primary: '#212c46', // Deep corporate blue
  accent: '#b7a159',  // Accent gold
  skyBlue: '#3f809e', // Light blue
  success: '#1ea178', // Green
  warning: '#f0ad4e', // Orange
  danger: '#d9534f',  // Red
  lightBg: '#f8f9fa',
};

const MOCK_AR_DATA = [
  { id: 'INV-2023-001', customer: 'Global Supply Co.', amount: 45000, date: '2023-10-01', dueDate: '2023-10-31', status: 'OVERDUE' },
  { id: 'INV-2023-002', customer: 'Regional Mart', amount: 12500, date: '2023-10-15', dueDate: '2023-11-14', status: 'PENDING' },
  { id: 'INV-2023-003', customer: 'Tech Solutions Ltd.', amount: 8900, date: '2023-11-01', dueDate: '2023-12-01', status: 'PAID' },
  { id: 'INV-2023-004', customer: 'City Operations', amount: 32000, date: '2023-11-05', dueDate: '2023-12-05', status: 'PENDING' },
];

export default function AccountsReceivable() {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  
  const filteredData = MOCK_AR_DATA.filter(item => 
    item.customer.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const totalAR = MOCK_AR_DATA.reduce((acc, curr) => acc + curr.amount, 0);
  const overdueAR = MOCK_AR_DATA.filter(item => item.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAR = MOCK_AR_DATA.filter(item => item.status === 'PENDING').reduce((acc, curr) => acc + curr.amount, 0);
  const paidAR = MOCK_AR_DATA.filter(item => item.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full h-full bg-[#f8f9fa] flex flex-col p-4 sm:p-6 lg:p-8 animate-fadeIn overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-[#eaeaec] flex items-center justify-center text-[#212c46]">
            <Icons.Receipt size={24} />
          </div>
          <div>
            <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
              {t('ระบบบัญชีลูกหนี้', 'ACCOUNTS')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3f809e] to-[#b58c4f]">{t('และบิลลิ่ง', 'RECEIVABLE')}</span>
            </h3>
            <div className="flex items-center gap-1.5 mt-[6px]">
              <div className="w-10 h-[2px] bg-[#3f809e]"></div>
              <p className="text-[#3f809e] font-bold text-xs uppercase tracking-widest m-0">
                {t('จัดการใบแจ้งหนี้และติดตามยอดค้างชำระ', 'Manage Invoices & Outstanding Balances')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
            <button className="bg-white border border-[#eaeaec] text-[#212c46] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:border-[#b7a159] transition-all flex items-center gap-2 shadow-sm">
                <Icons.Plus size={16} /> {t('สร้างใบแจ้งหนี้ใหม่', 'NEW INVOICE')}
            </button>
            <button className="bg-[#212c46] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#3f809e] transition-all flex items-center shadow-md">
                {t('อัปเดตข้อมูล', 'SYNC DATA')}
            </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 shrink-0">
        <KpiCard title={t('รวมยอดตั้งหนี้ทั้งหมด', 'Total AR')} value={`THB ${totalAR.toLocaleString()}`} icon={Icons.Banknote} color={THEME.skyBlue} description={t('ยอดหนี้ทั้งหมด', 'Total Invoiced Amount')} />
        <KpiCard title={t('ยอดค้างชำระเกินกำหนด', 'Overdue')} value={`THB ${overdueAR.toLocaleString()}`} icon={Icons.AlertCircle} color={THEME.danger} description={t('ต้องติดตามด่วน', 'Requires Action')} />
        <KpiCard title={t('ยอดรอการชำระ', 'Pending')} value={`THB ${pendingAR.toLocaleString()}`} icon={Icons.Clock} color={THEME.warning} description={t('อยู่ระหว่างรอชำระ', 'Awaiting Payment')} />
        <KpiCard title={t('ยอดรับชำระแล้ว', 'Paid / Collected')} value={`THB ${paidAR.toLocaleString()}`} icon={Icons.CheckCircle} color={THEME.success} description={t('ชำระเรียบร้อย', 'Successfully Collected')} />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col flex-1 animate-fadeIn text-left min-h-[500px]">
        {/* Card Header & Tools */}
        <div className="p-4 sm:p-5 border-b border-[#eaeaec] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 w-full md:w-auto text-[12px]">
            <span className="bg-[#f8f9fa] border border-[#eaeaec] px-3 py-1.5 rounded-xl text-[#7a8b95] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Icons.List size={14} className="text-[#3f809e]"/> {t('รายการใบแจ้งหนี้', 'Accounts Receivable Register')}
            </span>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3f809e] focus:border-[#3f809e] sm:text-sm transition-colors text-slate-700"
                placeholder={t('ค้นหาเลขที่, ชื่อลูกค้า...', 'Search Invoice, Customer...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors border border-slate-200 shadow-sm">
                <Icons.SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Dynamic Data Table */}
        <div className="flex-1 overflow-x-auto text-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-[#f8f9fa] sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('เลขที่เอกสาร', 'INVOICE ID')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('ชื่อลูกค้า', 'CUSTOMER')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('วันที่ออกเอกสาร', 'DATE')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('วันครบกำหนด', 'DUE DATE')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('ยอดรวม (THB)', 'AMOUNT')}
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                  {t('สถานะ', 'STATUS')}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#eaeaec]">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[#212c46]">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {item.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                      {item.dueDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-[#b7a159]">
                      {item.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider ${
                        item.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        item.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#3f809e] hover:text-[#212c46] hover:bg-slate-100 p-2 rounded-lg transition-colors inline-block" title={t('ดูรายละเอียด', 'View Details')}>
                        <Icons.Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <Icons.Database className="w-12 h-12 mb-3 text-slate-300" />
                      <p className="font-medium text-slate-500">{t('ไม่พบข้อมูล', 'No Invoices Found')}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
