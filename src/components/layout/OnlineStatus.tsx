
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';

const OnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatusChange, setShowStatusChange] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatusChange(true);
      setTimeout(() => setShowStatusChange(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatusChange(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatusChange && isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
      <Card className={`px-4 py-2 shadow-lg border-2 ${
        isOnline 
          ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' 
          : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
      }`}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-600" />
          )}
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? 'Back Online' : 'You are offline'}
          </Badge>
        </div>
      </Card>
    </div>
  );
};

export default OnlineStatus;
