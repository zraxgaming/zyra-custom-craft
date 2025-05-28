const CACHE_NAME = 'zyra-v1';
const urlsToCache = [
  '/',
  '/home',
  '/shop',
  '/categories',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/icon-192.png',
  '/icon-512.png'
];

// Add new pages to cache
const additionalUrlsToCache = [
  '/404',
  '/Success',
  '/Offline',
  '/order-success',
  '/order-failed',
  '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([...urlsToCache, ...additionalUrlsToCache]);
      })
  );
  self.skipWaiting();
});

// Enhanced fetch event for offline fallback
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request).catch(() => {
          // Serve offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
        });
      })
  );
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(syncData());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New update available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explore',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Zyra', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/shop')
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Listen for skipWaiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

function syncData() {
  // Sync offline data when connection is restored
  return new Promise((resolve) => {
    // Implementation for syncing cart, orders, etc.
    setTimeout(resolve, 1000);
  });
}
