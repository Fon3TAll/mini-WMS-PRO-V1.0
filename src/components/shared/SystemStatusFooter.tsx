import React, { useState, useEffect } from 'react';
import { Database, Wifi, WifiOff, Clock } from 'lucide-react';

export const SystemStatusFooter: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Mock periodic sync
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setLastSync(new Date());
      }
    }, 60000); // Sync every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-full shrink-0 flex flex-wrap items-center justify-between px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1a253d] text-white text-[9px] sm:text-[10px] font-mono border-t border-[#2a3a54] z-40 transition-all duration-300">
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar whitespace-nowrap">
        <div className="flex items-center gap-1.5 shrink-0">
          {isOnline ? (
            <Wifi size={12} className="text-emerald-400" />
          ) : (
            <WifiOff size={12} className="text-red-400 animate-pulse" />
          )}
          <span className={`${isOnline ? 'text-emerald-400' : 'text-red-400 font-bold'} uppercase tracking-wider`}>
            {isOnline ? 'Connected' : 'Offline'}
          </span>
        </div>
        
        <span className="text-[#4a5a74] shrink-0">|</span>
        
        <div className="flex items-center gap-1.5 shrink-0">
          <Database size={12} className={isOnline ? "text-blue-400" : "text-gray-500"} />
          <span className="text-gray-300 uppercase tracking-wider hidden sm:inline">
            Backend: {isOnline ? <span className="text-blue-400 font-semibold">Ready</span> : <span className="text-gray-500">Unreachable</span>}
          </span>
          <span className="text-gray-300 uppercase tracking-wider sm:hidden">
            {isOnline ? <span className="text-blue-400 font-semibold">DB Ready</span> : <span className="text-gray-500">DB Down</span>}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-2">
        <Clock size={12} className="text-gray-400 hidden sm:block" />
        <span className="text-gray-300 tracking-wider">
          <span className="hidden sm:inline">LAST SYNC: </span>{lastSync.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default SystemStatusFooter;
