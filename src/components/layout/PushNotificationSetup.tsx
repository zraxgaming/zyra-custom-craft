
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PushNotificationSetup = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }

    // Check if service worker is supported for web push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Notifications are not supported in this browser",
        variant: "destructive"
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled! 🔔",
          description: "You'll receive updates about your orders and new products",
        });

        // Show a test notification
        setTimeout(() => {
          new Notification('Welcome to Zyra!', {
            body: 'You\'ll now receive important updates about your orders.',
            icon: '/icon-192.png',
            badge: '/icon-192.png',
            tag: 'welcome'
          });
        }, 1000);

        // Subscribe to push notifications if supported
        if ('serviceWorker' in navigator && 'PushManager' in window) {
          subscribeToPush();
        }
      } else {
        toast({
          title: "Notifications Blocked",
          description: "Enable notifications in your browser settings to receive updates",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission Error",
        description: "Unable to request notification permission",
        variant: "destructive"
      });
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // You would need to generate VAPID keys for production
      const vapidPublicKey = 'BGN-kQe8r8zH4zjg_QRO_2HDnDrN-Lc1DPTvT4WT8Pw7VJX8fXKZDpf4QVRD_QQ1t8oJQQ1t8oJQQ1t8oJQQ1t8oJ';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey
      });

      console.log('Push subscription:', subscription);
      
      // Send subscription to your server here
      // await sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const disableNotifications = () => {
    toast({
      title: "Notifications Disabled",
      description: "You can re-enable them anytime in your browser settings",
    });
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {permission === 'granted' ? (
        <Button
          onClick={disableNotifications}
          size="sm"
          variant="outline"
          className="text-green-600 border-green-300 hover:bg-green-50"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notifications On
        </Button>
      ) : (
        <Button
          onClick={requestNotificationPermission}
          size="sm"
          variant="outline"
          className="text-gray-600 hover:text-purple-600"
        >
          <BellOff className="h-4 w-4 mr-2" />
          Enable Notifications
        </Button>
      )}
    </div>
  );
};

export default PushNotificationSetup;
