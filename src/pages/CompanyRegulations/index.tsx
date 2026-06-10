import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { PrintPreviewModal } from '../../components/shared/PrintPreviewModal';

const MOCK_REGULATIONS = [
    { id: 'REG-001', code: 'SEC-WMS-01', title: 'ระเบียบว่าด้วยความปลอดภัยในคลังสินค้า (Warehouse Safety)', revision: '1.2', status: 'Active', updated: '2023-11-20', content: 'ห้ามพนักงานขับรถยกโดยไม่มีใบอนุญาต...' },
    { id: 'REG-002', code: 'HR-WMS-02', title: 'ระเบียบการบันทึกเวลาและการลางาน', revision: '2.0', status: 'Active', updated: '2023-10-15', content: 'พนักงานต้องสแกนนิ้วเข้างานก่อนเวลา 08:30 น. การลางานต้องแจ้งล่วงหน้า 3 วัน' },
    { id: 'REG-003', code: 'OP-WMS-03', title: 'ขั้นตอนการรับสินค้าเข้าคลัง (Inbound Process)', revision: '1.0', status: 'Active', updated: '2023-12-05', content: 'ทุกครั้งที่มีการรับสินค้า ต้องตรวจนับให้ครบตาม PO และทำการติดบาร์โค้ด...' }
];

export default function CompanyRegulations() {
    const { t } = useLanguage();
    const [search, setSearch] = useState('');
    const [previewItem, setPreviewItem] = useState<any>(null);

    const filtered = MOCK_REGULATIONS.filter(r => 
        r.title.toLowerCase().includes(search.toLowerCase()) || 
        r.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4 overflow-y-auto">
            <div className="h-14 px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0 mt-[2px]">
                <div className="flex items-center gap-5">
                    <div className="relative flex items-center justify-center p-1.5 border border-[#3f809e]/40 rounded-xl bg-white/50 backdrop-blur-sm shadow-sm md:w-auto text-[#3f809e]">
                        <Icons.BookOpen size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none" style={{ fontSize: '24px' }}>
                            {t('ข้อบังคับและระเบียบปฏิบัติ', 'COMPANY REGULATIONS')}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-0.5 opacity-80 leading-none font-sans">
                            {t('เอกสารระเบียบปฏิบัติการทำงาน', 'INTERNAL COMPLIANCE & RULES')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-8 w-full mt-4">
               <div className="bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col mb-8 text-left">
                    <div className="px-8 py-4 border-b border-[#eaeaec] bg-[#f8f9fa] flex flex-col md:flex-row justify-between items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="px-5 py-2 text-[11px] font-black uppercase tracking-widest rounded-full transition-all flex items-center gap-2 bg-[#212c46] text-[#d7d7d7] shadow-md">
                                <Icons.FileText size={14}/> {t('รายการเอกสารบังคับ', 'Document List')}
                            </span>
                        </div>
                        <div className="relative flex-1 md:w-80">
                            <Icons.Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t('ค้นหาระเบียบ / รหัสอ้างอิง...', 'Search rules...')} className="w-full pl-12 pr-6 py-2.5 text-[12px] border border-[#eaeaec] rounded-full font-bold outline-none focus:border-[#b7a159] bg-white shadow-sm text-[#212c46]" />
                        </div>
                    </div>

                    <div className="overflow-auto custom-scrollbar">
                        <table className="w-full text-left font-sans border-collapse">
                            <thead className="bg-[#222b38] text-white">
                                <tr className="border-b-2 border-[#b58c4f]">
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">{t('รหัสควบคุม', 'DOC ID')}</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">{t('หมวดระเบียบ', 'Title')}</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">{t('ฉบับที่', 'Revision')}</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-center">{t('สถานะ', 'Status')}</th>
                                    <th className="py-4 px-6 font-black uppercase tracking-widest text-[12px] whitespace-nowrap text-right">{t('การดำเนินการ', 'Action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#eaeaec]">
                                {filtered.map((item) => (
                                    <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                                        <td className="py-3 px-6 text-[12px] font-bold text-[#212c46] font-mono">{item.code}</td>
                                        <td className="py-3 px-6 text-[12px] font-bold text-[#4d87a8]">{item.title}</td>
                                        <td className="py-3 px-6 text-[12px] font-bold text-slate-500 text-center font-mono">{item.revision}</td>
                                        <td className="py-3 px-6 text-center">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-200">
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-6 text-right space-x-2">
                                            <button 
                                                onClick={() => setPreviewItem(item)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl text-[#3f809e] hover:bg-[#3f809e]/10 border border-transparent transition-colors hover:border-[#3f809e]/20" 
                                                title={t('แสดงตัวอย่างการพิมพ์เอกสาร', 'Print Preview (PDF)')}
                                            >
                                                <Icons.Eye size={16} />
                                            </button>
                                            <button 
                                                className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 border border-transparent transition-colors"
                                                title={t('แก้ไขเอกสาร', 'Edit Document')}
                                            >
                                                <Icons.Edit size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={5} className="py-12 text-center text-slate-400 font-bold">{t('ไม่พบข้อมูล', 'No records found')}</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
               </div>
            </div>

            {previewItem && (
                <PrintPreviewModal
                    isOpen={!!previewItem}
                    onClose={() => setPreviewItem(null)}
                    title={previewItem.title}
                    docId={previewItem.code}
                    revision={previewItem.revision}
                >
                    <div className="py-8 text-slate-700 leading-loose">
                        <h2 className="text-xl font-bold mb-4 border-b border-dashed border-slate-300 pb-2 inline-block">1. วัตถุประสงค์ (Purpose)</h2>
                        <p className="mb-6">{previewItem.title} จัดทำขึ้นเพื่อให้พนักงานทุกคนในองค์กรได้รับทราบและปฏิบัติตามกฎเกณฑ์อย่างเคร่งครัด</p>
                        
                        <h2 className="text-xl font-bold mb-4 border-b border-dashed border-slate-300 pb-2 inline-block">2. ขอบเขต (Scope)</h2>
                        <p className="mb-6">บังคับใช้กับพนักงานทุกระดับชั้น ตลอดจนผู้รับเหมาและบุคคลภายนอกที่เข้ามาปฏิบัติงานในพื้นที่คลังสินค้า</p>

                        <h2 className="text-xl font-bold mb-4 border-b border-dashed border-slate-300 pb-2 inline-block">3. ระเบียบปฏิบัติ (Regulations)</h2>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-inner">
                            <p className="text-sm font-medium">{previewItem.content}</p>
                        </div>
                    </div>
                </PrintPreviewModal>
            )}
        </div>
    );
}
