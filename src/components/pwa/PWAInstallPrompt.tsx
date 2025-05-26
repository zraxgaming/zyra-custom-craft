
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if dismissed recently (within 7 days)
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      if (dismissedTime > sevenDaysAgo) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-in-right">
      <Card className="bg-card/95 backdrop-blur-sm border-primary/50 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              {isIOS ? <Smartphone className="h-5 w-5 text-primary" /> : <Monitor className="h-5 w-5 text-primary" />}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                Install Zyra App
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {isIOS 
                  ? "Add to your home screen for a better experience. Tap the share button and select 'Add to Home Screen'."
                  : "Get the full app experience with offline access and notifications."
                }
              </p>
              
              <div className="flex gap-2">
                {!isIOS && (
                  <Button onClick={handleInstall} size="sm" className="hover:scale-105 transition-transform">
                    <Download className="h-4 w-4 mr-2" />
                    Install
                  </Button>
                )}
                <Button onClick={handleDismiss} variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  Not Now
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

export default PWAInstallPrompt;
