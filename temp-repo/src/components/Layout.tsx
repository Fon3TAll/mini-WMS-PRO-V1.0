import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SecurityGuard from './SecurityGuard';
import { useAuth } from '../context/AuthContext';
import { PhoneCall, Mail } from 'lucide-react';

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <SecurityGuard>
      <div className="flex h-screen w-full bg-[#f3f3f1] overflow-hidden font-sans text-slate-800">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className="flex flex-1 flex-col overflow-hidden relative">
          <Header />
          <div className="flex-1 custom-scrollbar overflow-y-auto flex flex-col min-h-0 relative">
            <div className="flex-1 flex flex-col w-full pt-0">
              <main className="flex-1 shrink-0 bg-transparent flex flex-col w-full relative z-0">
                <Outlet />
              </main>
              <footer className="mt-auto shrink-0 py-3.5 flex flex-col items-center gap-0.5 text-center text-[#212c46] w-full bg-transparent border-t border-[#cdd0db]/30 mt-[10px]">
                  <div className="flex items-center justify-center">
                      <span className="text-[12px] font-black uppercase tracking-widest opacity-80">
                          GLOBAL LAW LIBRARY • EMPOWERING STRATEGIC LEGAL INSIGHTS
                      </span>
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] font-medium text-[#7a8b95]">
                      <p className="flex items-center"><span className="font-light mr-1">System by</span> <span className="font-black text-[#212c46]">T All Intelligence</span></p>
                      <span className="hidden md:inline text-[#d7d7d7]">|</span>
                      <p className="flex items-center gap-1.5"><PhoneCall size={14} className="text-[#a54f6b]" /> 082-5695654, 091-5165999</p>
                      <span className="hidden md:inline text-[#d7d7d7]">|</span>
                      <p className="flex items-center gap-1.5"><Mail size={14} className="text-[#3f809e]" /> tallintelligence.ho@gmail.com</p>
                  </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </SecurityGuard>
  );
}
