import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { offlineQueue } from '../../lib/offlineQueue';

export function OfflineStatusIndicator() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkQueue = async () => {
      try {
        const actions = await offlineQueue.getActions();
        setPendingCount(actions.length);
      } catch (e) {
        // Ignored
      }
    };
    checkQueue();
    // Re-check periodically
    const intervalId = setInterval(checkQueue, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || pendingCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 border backdrop-blur-md rounded-full shadow-sm flex items-center gap-2 pointer-events-none transition-colors ${
            isOffline ? 'border-[#932c2e]/20 bg-[#932c2e]/10 text-[#932c2e]' : 'border-[#b7a159]/20 bg-[#b7a159]/10 text-[#b7a159]'
          }`}
        >
          {isOffline ? <WifiOff size={16} /> : <RefreshCw size={16} className="animate-spin" />}
          <span className="text-[11px] font-black uppercase tracking-widest leading-none mt-0.5">
            {isOffline 
              ? (pendingCount > 0 ? `Offline Mode - ${pendingCount} queued` : 'Offline Mode') 
              : `Syncing ${pendingCount} items...`}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
