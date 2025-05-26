
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkStatus = () => {
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
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in-up">
      <Card className={`bg-card/95 backdrop-blur-sm border shadow-lg ${
        isOnline ? 'border-green-500/50' : 'border-red-500/50'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isOnline ? 'bg-green-500/10' : 'bg-red-500/10'
            }`}>
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {isOnline ? 'Back online!' : 'You\'re offline'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isOnline 
                  ? 'All features are now available.' 
                  : 'Some features may be limited while offline.'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkStatus;
