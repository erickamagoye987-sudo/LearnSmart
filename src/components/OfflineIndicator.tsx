import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-2xl bg-amber-500 text-white px-3.5 py-2 text-xs font-bold shadow-xl border border-amber-400 animate-bounce">
      <WifiOff className="w-4 h-4 shrink-0 text-white" />
      <span>Offline Mode — All ABCs, Numbers & Quizzes Available!</span>
    </div>
  );
};
