
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';

const ServiceWorkerUpdater = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);
        
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ action: 'skipWaiting' });
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    setUpdateAvailable(false);
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-in-down">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <RefreshCw className="h-5 w-5 text-primary" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                App Update Available
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                A new version of the app is available. Update now for the latest features and improvements.
              </p>
              
              <div className="flex gap-2">
                <Button onClick={handleUpdate} size="sm" className="hover:scale-105 transition-transform">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Now
                </Button>
                <Button onClick={handleDismiss} variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  Later
                </Button>
              </div>
            </div>

            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:scale-110 transition-transform"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceWorkerUpdater;
