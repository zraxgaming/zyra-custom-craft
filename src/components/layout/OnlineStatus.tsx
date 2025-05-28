
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      setShowNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  if (!showNotification) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
      <Alert className={`${
        isOnline 
          ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800' 
          : 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
      } shadow-lg`}>
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-600" />
        )}
        <AlertDescription className={`font-medium ${
          isOnline 
            ? 'text-green-800 dark:text-green-200' 
            : 'text-red-800 dark:text-red-200'
        }`}>
          {isOnline ? '🟢 Back online!' : '🔴 You are offline'}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OnlineStatus;
