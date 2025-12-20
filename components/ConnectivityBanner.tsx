
import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, AlertCircle, RefreshCcw } from 'lucide-react';

export const ConnectivityBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus && isOnline) return null;

  return (
    <div className={`fixed top-0 left-0 right-0 z-[1000] px-6 py-2 transition-all duration-500 transform ${
      isOnline ? 'bg-green-500 translate-y-0' : 'bg-red-500 translate-y-0'
    }`}>
      <div className="max-w-6xl mx-auto flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          {isOnline ? (
            <Wifi size={16} className="animate-pulse" />
          ) : (
            <WifiOff size={16} className="animate-bounce" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">
            {isOnline ? 'Back Online: Syncing latest campus ads' : 'Offline: Showing cached ads only'}
          </span>
        </div>
        {!isOnline && (
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 text-[9px] font-black uppercase border border-white/20 px-2 py-1 rounded-lg hover:bg-white/10"
          >
            <RefreshCcw size={10} />
            Try Reconnect
          </button>
        )}
      </div>
    </div>
  );
};
