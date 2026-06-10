export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
}

const DB_NAME = 'smart-law-offline-db';
const DB_VERSION = 1;
const STORE_NAME = 'action-queue';

class OfflineQueueDB {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    
    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
    
    return this.initPromise;
  }

  async enqueueAction(action: Omit<OfflineAction, 'id' | 'timestamp'>): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not initialized'));
      
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      
      const newAction: OfflineAction = {
        ...action,
        id: crypto.randomUUID(),
        timestamp: Date.now()
      };
      
      const request = store.add(newAction);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getActions(): Promise<OfflineAction[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not initialized'));
      
      const tx = this.db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      
      request.onsuccess = () => {
        // Sort by timestamp
        const actions = request.result as OfflineAction[];
        resolve(actions.sort((a, b) => a.timestamp - b.timestamp));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async removeAction(id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject(new Error('DB not initialized'));
      
      const tx = this.db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const offlineQueue = new OfflineQueueDB();
