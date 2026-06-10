import React, { useState, useEffect } from 'react';
import { googleSignIn, getAccessToken, logout, initAuth } from '../lib/auth';
import type { User } from 'firebase/auth';
import { setupSpreadsheet } from '../services/GoogleSheetsService';
import { RefreshCw } from 'lucide-react';

export default function WorkspaceSyncConfig() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [spreadsheetId, setSpreadsheetId] = useState('1L7smTyoFDIRaQk-NDivWTMwqQ52V4ezSfagWOlR6xOs');
  const [isSettingUp, setIsSettingUp] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (u, t) => {
        setUser(u);
        setToken(t);
        setIsConnected(true);
      },
      () => {
        setUser(null);
        setToken(null);
        setIsConnected(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setIsConnected(true);
      }
    } catch (err) {
      console.error(err);
      alert('Authentication failed or was cancelled.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await logout();
    setIsConnected(false);
  };

  const handleRunSetup = async () => {
    if (!spreadsheetId) return;
    setIsSettingUp(true);
    try {
      await setupSpreadsheet(spreadsheetId);
      alert('Sheets created and formatted successfully!');
    } catch (error: any) {
      console.error(error);
      alert(`Failed to set up sheets: ${error.message || 'Check your permissions.'}`);
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6 text-left font-sans animate-fadeIn">
      
      {/* AUTHENTICATION BOX */}
      <div className="bg-white rounded-xl shadow-sm border border-[#eaeaec] p-8">
        <h3 className="text-[18px] font-black text-[#212c46] tracking-widest uppercase mb-1">AUTHENTICATION</h3>
        <p className="text-[13px] font-bold text-[#7a8b95] mb-6">
          Connect your Google Account to authorize database synchronizations and create sheets automatically.
        </p>

        {isConnected ? (
          <div className="flex items-center justify-between border border-[#eaeaec] rounded-xl p-5 bg-white shadow-sm">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-red-200 flex items-center justify-center shrink-0">
                    <span className="text-red-500 font-bold text-lg">{user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                </div>
                <div>
                   <h4 className="text-[14px] font-black text-[#212c46]">{user?.displayName || 'Authorized User'}</h4>
                   <p className="text-[12px] font-bold text-[#b58c4f]">{user?.email}</p>
                </div>
             </div>
             <button 
               onClick={handleDisconnect} 
               className="px-6 py-2 bg-white border border-[#932c2e] text-[#932c2e] rounded hover:bg-[#932c2e] hover:text-white transition-all font-black uppercase text-[12px] tracking-widest"
             >
                DISCONNECT
             </button>
          </div>
        ) : (
          <button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="px-6 py-3 bg-white hover:bg-gray-50 border border-[#eaeaec] text-[#212c46] rounded-xl font-bold text-[14px] shadow-sm transition-all flex items-center gap-3"
          >
            {isLoading ? (
              <RefreshCw size={18} className="animate-spin text-[#7a8b95]" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span className="font-mono tracking-tight font-bold">Continue with Google</span>
          </button>
        )}
      </div>

      {/* FORMATTING BOX */}
      <div className="bg-white rounded-xl shadow-sm border border-[#eaeaec] p-8">
         <h3 className="text-[18px] font-black text-[#212c46] tracking-widest uppercase mb-1">SHEET SETUP & FORMATTING</h3>
         <p className="text-[13px] font-bold text-[#7a8b95] mb-6">
           Automatically format the target spreadsheet (Adds headers, freezes top row, and highlights column #d0e0e3).
         </p>

         <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-[#212c46]">SPREADSHEET ID</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <input 
                 type="text" 
                 value={spreadsheetId}
                 onChange={(e) => setSpreadsheetId(e.target.value)}
                 className="flex-1 bg-white border border-[#eaeaec] px-4 py-3 rounded-lg font-mono text-[14px] outline-none focus:border-[#b58c4f] uppercase tracking-wider text-[#414757] shadow-sm w-full"
                 placeholder="Enter Spreadsheet ID"
               />
               <button 
                 onClick={handleRunSetup}
                 disabled={isSettingUp || !spreadsheetId}
                 className="px-8 py-3 bg-[#b7a159] hover:bg-[#9e884b] text-white rounded-lg font-black uppercase text-[12px] tracking-widest shadow-md transition-all flex items-center justify-center min-w-[140px] shrink-0"
               >
                 {isSettingUp ? <RefreshCw size={16} className="animate-spin" /> : 'RUN SETUP'}
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
