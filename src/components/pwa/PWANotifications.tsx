
import React, { useEffect, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { useAuth } from '@/hooks/use-auth';

interface PWANotificationsProps {
  enableAbandonedCart?: boolean;
  abandonedCartDelay?: number; // in minutes
}

const PWANotifications: React.FC<PWANotificationsProps> = ({
  enableAbandonedCart = true,
  abandonedCartDelay = 30
}) => {
  const { items } = useCart();
  const { user } = useAuth();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [abandonedCartTimer, setAbandonedCartTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Request notification permission
    if (notificationPermission === 'default' && 'Notification' in window) {
      Notification.requestPermission().then((permission) => {
        setNotificationPermission(permission);
      });
    }
  }, [notificationPermission]);

  useEffect(() => {
    if (!enableAbandonedCart || !user || items.length === 0) {
      if (abandonedCartTimer) {
        clearTimeout(abandonedCartTimer);
        setAbandonedCartTimer(null);
      }
      return;
    }

    // Clear existing timer
    if (abandonedCartTimer) {
      clearTimeout(abandonedCartTimer);
    }

    // Set new timer for abandoned cart notification
    const timer = setTimeout(() => {
      if (notificationPermission === 'granted' && items.length > 0) {
        const notification = new Notification('Don\'t forget your cart!', {
          body: `You have ${items.length} item(s) waiting in your cart at Zyra`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'abandoned-cart',
          requireInteraction: true,
          actions: [
            {
              action: 'view-cart',
              title: 'View Cart'
            },
            {
              action: 'dismiss',
              title: 'Dismiss'
            }
          ]
        });

        notification.onclick = () => {
          window.focus();
          window.location.href = '/cart';
          notification.close();
        };

        // Auto-close after 10 seconds
        setTimeout(() => {
          notification.close();
        }, 10000);
      }
    }, abandonedCartDelay * 60 * 1000); // Convert minutes to milliseconds

    setAbandonedCartTimer(timer);

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [items, user, enableAbandonedCart, abandonedCartDelay, notificationPermission]);

  // Service worker registration for notifications
  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
};

export default PWANotifications;
