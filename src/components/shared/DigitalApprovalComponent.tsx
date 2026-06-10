import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Calendar, Clock, Award } from 'lucide-react';

interface DigitalApprovalComponentProps {
  customName?: string;
  customDesignation?: string;
  status?: 'APPROVED' | 'PENDING' | 'REVIEWED';
  showStamp?: boolean;
}

export function DigitalApprovalComponent({
  customName,
  customDesignation,
  status = 'APPROVED',
  showStamp = true,
}: DigitalApprovalComponentProps) {
  const { user } = useAuth();

  const name = customName || user?.name || 'PHICHAMON ADMIN';
  const designation = customDesignation || user?.role || 'Lead Developer';
  const currentDateTime = new Date().toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const getStatusColor = () => {
    switch (status) {
      case 'APPROVED':
        return { text: 'text-[#657f4d]', border: 'border-[#657f4d]', bg: 'bg-[#657f4d]/5' };
      case 'PENDING':
        return { text: 'text-[#ce8a39]', border: 'border-[#ce8a39]', bg: 'bg-[#ce8a39]/5' };
      case 'REVIEWED':
        return { text: 'text-[#3f809e]', border: 'border-[#3f809e]', bg: 'bg-[#3f809e]/5' };
      default:
        return { text: 'text-[#7a8b95]', border: 'border-[#7a8b95]', bg: 'bg-[#7a8b95]/5' };
    }
  };

  const statusStyle = getStatusColor();

  return (
    <div className="w-full bg-[#f8f9fa] border border-[#eaeaec] rounded-2xl p-5 mt-6 relative overflow-hidden text-left" id="digital-approval-shared-comp">
      {/* Visual Background Stamp */}
      {showStamp && status === 'APPROVED' && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] transform rotate-12 scale-150">
          <Award size={100} className="text-[#657f4d]" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] font-black tracking-[0.25em] text-[#7a8b95] uppercase">
            <ShieldCheck size={12} className="text-[#3f809e]" /> DIGITAL APPROVAL METADATA
          </div>
          <div>
            <h4 className="text-sm font-black text-[#212c46] tracking-tight uppercase">
              {name}
            </h4>
            <p className="text-[10px] font-bold text-[#7a8b95] uppercase tracking-wider mt-0.5">
              {designation}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-bold text-[#7a8b95] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Calendar size={10} className="text-[#3f809e]" /> {currentDateTime.split(' ')[0] || ''}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} className="text-[#3f809e]" /> {currentDateTime.split(' ')[1] || ''} (ICT)
            </span>
          </div>
        </div>

        {/* Signature Line and Stamp */}
        <div className="flex items-center gap-4 shrink-0 w-full sm:w-auto">
          <div className="flex flex-col items-center justify-center border-l-2 border-[#eaeaec] pl-4 sm:pl-6 text-center w-full sm:w-auto">
            <div className="h-8 flex items-end justify-center">
              {/* Elegant Simulated Digital Autopen/Signature */}
              <span className="font-serif italic text-base font-bold text-[#212c46] tracking-widest opacity-80 select-none">
                {name.split(' ')[0]} {/* First Name initials for sign */}
              </span>
            </div>
            {/* Signature Underline */}
            <div className="w-32 h-[1.5px] bg-[#212c46]/30 my-1"></div>
            <span className="text-[8px] font-black tracking-[0.2em] text-[#7a8b95] uppercase">
              AUTHORIZED USER SIGNATURE
            </span>
          </div>

          {/* Holographic Approval Stamp */}
          {showStamp && (
            <div className={`border-2 border-dashed ${statusStyle.border} ${statusStyle.text} ${statusStyle.bg} px-3 py-1.5 rounded-xl flex flex-col items-center justify-center shrink-0 rotate-[-5deg] select-none font-bold shadow-sm sm:w-28`}>
              <span className="text-[8px] font-black tracking-[0.2em] opacity-75">STATUS</span>
              <span className="text-xs font-black tracking-tight leading-none mt-0.5">{status}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default DigitalApprovalComponent;
