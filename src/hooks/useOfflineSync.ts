import { useState, useEffect } from 'react';
import { offlineQueue, OfflineAction } from '../lib/offlineQueue';

export function useOfflineSync(onSync: (action: OfflineAction) => Promise<void>) {
  const [offlineCount, setOfflineCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const checkQueue = async () => {
      try {
        const actions = await offlineQueue.getActions();
        setOfflineCount(actions.length);
      } catch (err) {
        console.error('Failed to check offline queue', err);
      }
    };
    
    checkQueue();
    // Poll the queue size occasionally if offline
    let interval: NodeJS.Timeout;
    if (isOffline) {
      interval = setInterval(checkQueue, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOffline]);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOffline(false);
      setIsSyncing(true);
      try {
        const actions = await offlineQueue.getActions();
        for (const action of actions) {
          try {
            await onSync(action);
            await offlineQueue.removeAction(action.id);
          } catch (err) {
            console.error('Failed to sync action', action, err);
            // Optionally stop syncing if one fails, or continue
          }
        }
        const remaining = await offlineQueue.getActions();
        setOfflineCount(remaining.length);
      } finally {
        setIsSyncing(false);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial sync check if we start online
    if (navigator.onLine) {
      handleOnline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onSync]);

  const enqueueAction = async (type: string, payload: any) => {
    await offlineQueue.enqueueAction({ type, payload });
    const actions = await offlineQueue.getActions();
    setOfflineCount(actions.length);
  };

  return { isOffline, isSyncing, offlineCount, enqueueAction };
}
