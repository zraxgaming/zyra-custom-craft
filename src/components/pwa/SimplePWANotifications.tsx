
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const SimplePWANotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return;
    }

    // Only show toast if permission is explicitly denied
    if (Notification.permission === 'denied') {
      // Show toast only once per session
      const hasShownNotificationWarning = sessionStorage.getItem('notificationWarningShown');
      if (!hasShownNotificationWarning) {
        toast({
          title: "Notifications Disabled",
          description: "Enable notifications in browser settings to receive updates.",
          variant: "destructive",
        });
        sessionStorage.setItem('notificationWarningShown', 'true');
      }
    }
  }, [toast]);

  return null;
};

export default SimplePWANotifications;
