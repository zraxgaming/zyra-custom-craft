
const CACHE_NAME = 'zyra-v2.0';
const STATIC_CACHE = 'zyra-static-v2.0';
const DYNAMIC_CACHE = 'zyra-dynamic-v2.0';
const IMAGE_CACHE = 'zyra-images-v2.0';

const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

const API_ENDPOINTS = [
  '/api/',
  'https://api.stripe.com',
  'https://api.supabase.co'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  console.log('[SW] Installing Service Worker');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', function(event) {
  console.log('[SW] Activating Service Worker');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('[SW] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Strategy
self.addEventListener('fetch', function(event) {
  const requestUrl = new URL(event.request.url);
  
  // Handle API requests with network-first strategy
  if (API_ENDPOINTS.some(endpoint => event.request.url.includes(endpoint))) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Handle images with cache-first strategy
  if (event.request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(event.request, IMAGE_CACHE));
    return;
  }
  
  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.includes(requestUrl.pathname)) {
    event.respondWith(cacheFirstStrategy(event.request, STATIC_CACHE));
    return;
  }
  
  // Handle navigation requests with network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Default to network-first for other requests
  event.respondWith(networkFirstStrategy(event.request));
});

// Network-first strategy
function networkFirstStrategy(request) {
  return fetch(request)
    .then(function(response) {
      // Only cache successful responses
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(DYNAMIC_CACHE).then(function(cache) {
          cache.put(request, responseClone);
        });
      }
      return response;
    })
    .catch(function() {
      return caches.match(request)
        .then(function(response) {
          return response || caches.match('/offline.html');
        });
    });
}

// Cache-first strategy
function cacheFirstStrategy(request, cacheName) {
  return caches.open(cacheName)
    .then(function(cache) {
      return cache.match(request)
        .then(function(response) {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(function(networkResponse) {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            });
        });
    });
}

// Background Sync
self.addEventListener('sync', function(event) {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  }
  
  if (event.tag === 'analytics-sync') {
    event.waitUntil(syncAnalytics());
  }
});

// Push Notifications
self.addEventListener('push', function(event) {
  console.log('[SW] Push message received:', event);
  
  const options = {
    body: 'New products available! Check them out now.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'zyra-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View Products',
        icon: '/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: '/shop'
    }
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = data.data || options.data;
  }
  
  event.waitUntil(
    self.registration.showNotification('Zyra', options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', function(event) {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/shop')
    );
  } else if (event.action === 'dismiss') {
    return;
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message Handler
self.addEventListener('message', function(event) {
  console.log('[SW] Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
});

// Helper functions
async function syncCart() {
  try {
    // Implement cart synchronization logic
    console.log('[SW] Syncing cart data');
  } catch (error) {
    console.error('[SW] Cart sync failed:', error);
  }
}

async function syncAnalytics() {
  try {
    // Implement analytics synchronization logic
    console.log('[SW] Syncing analytics data');
  } catch (error) {
    console.error('[SW] Analytics sync failed:', error);
  }
}

// Periodic background sync
self.addEventListener('periodicsync', function(event) {
  if (event.tag === 'content-sync') {
    event.waitUntil(syncContent());
  }
});

async function syncContent() {
  try {
    // Sync latest content when device comes online
    console.log('[SW] Syncing content');
  } catch (error) {
    console.error('[SW] Content sync failed:', error);
  }
}
