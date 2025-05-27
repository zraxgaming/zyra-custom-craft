
// PWA utility functions for service worker registration and notifications

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const showNotification = (title: string, options?: NotificationOptions) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    });
  }
};

export const scheduleNotification = (title: string, body: string, delay: number) => {
  setTimeout(() => {
    showNotification(title, { body });
  }, delay);
};

// Schedule promotional notifications
export const setupPromotionalNotifications = () => {
  const notifications = [
    { title: "🔥 Flash Sale!", body: "50% off selected items - Limited time!", delay: 10 * 60 * 1000 }, // 10 minutes
    { title: "✨ New Arrivals", body: "Check out our latest products!", delay: 20 * 60 * 1000 }, // 20 minutes
    { title: "🎨 Customize Today", body: "Create your unique product now!", delay: 30 * 60 * 1000 }, // 30 minutes
  ];

  notifications.forEach(({ title, body, delay }) => {
    scheduleNotification(title, body, delay);
  });
};
