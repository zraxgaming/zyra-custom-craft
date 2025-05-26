
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

    // Check current permission status
    if (Notification.permission === 'denied') {
      toast({
        title: "Notifications Disabled",
        description: "Notifications are blocked. Enable them in your browser settings to receive updates.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return null;
};

export default SimplePWANotifications;
