// Service Worker for KnowYourRights Now
// Provides offline functionality and caching for critical features

const CACHE_NAME = 'knowyourrights-v1';
const STATIC_CACHE_NAME = 'knowyourrights-static-v1';
const DYNAMIC_CACHE_NAME = 'knowyourrights-dynamic-v1';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/manifest.json',
  '/offline.html',
  // Add other critical static assets
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/ai/generate-legal-card',
  '/api/ai/generate-script'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static files
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
    return;
  }
});

// Handle API requests with caching strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  // Check if this API should be cached
  const shouldCache = CACHEABLE_APIs.some(api => url.pathname.startsWith(api));
  
  if (!shouldCache) {
    // For non-cacheable APIs, just fetch from network
    try {
      return await fetch(request);
    } catch (error) {
      console.error('Network request failed:', error);
      return new Response(
        JSON.stringify({ error: 'Network unavailable' }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  }

  // For cacheable APIs, try cache first, then network
  try {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Return cached response and update in background
      fetch(request)
        .then(response => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
        })
        .catch(console.error);
      
      return cachedResponse;
    }

    // No cache, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('API request failed:', error);
    
    // Try to return cached version as fallback
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(
      JSON.stringify({ error: 'Service unavailable' }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static file requests
async function handleStaticRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Static request failed:', error);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      const cache = await caches.open(STATIC_CACHE_NAME);
      return cache.match('/offline.html');
    }
    
    return new Response('Offline', { status: 503 });
  }
}

// Handle background sync for emergency alerts
self.addEventListener('sync', (event) => {
  if (event.tag === 'emergency-alert') {
    event.waitUntil(sendPendingEmergencyAlerts());
  }
});

// Send pending emergency alerts when connection is restored
async function sendPendingEmergencyAlerts() {
  try {
    // Get pending alerts from IndexedDB or localStorage
    const pendingAlerts = await getPendingAlerts();
    
    for (const alert of pendingAlerts) {
      try {
        const response = await fetch('/api/emergency/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alert)
        });
        
        if (response.ok) {
          await removePendingAlert(alert.id);
          console.log('Emergency alert sent successfully');
        }
      } catch (error) {
        console.error('Failed to send emergency alert:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Mock functions for pending alerts management
// In production, implement with IndexedDB
async function getPendingAlerts() {
  return [];
}

async function removePendingAlert(id) {
  // Remove from storage
}

// Handle push notifications for emergency responses
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

