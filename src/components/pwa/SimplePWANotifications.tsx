
import { useEffect } from 'react';

const SimplePWANotifications = () => {
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

    // Only log if permission is explicitly denied
    if (Notification.permission === 'denied') {
      console.log('Notifications are disabled by user');
    }
  }, []);

  return null;
};

export default SimplePWANotifications;
