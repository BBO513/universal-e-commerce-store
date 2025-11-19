const CACHE_STATIC_ASSETS = 'auto-parts-store-static-v2';
const CACHE_DYNAMIC_IMAGES = 'auto-parts-store-images-v2';
const CACHE_DYNAMIC_PAGES = 'auto-parts-store-pages-v2';

// URLs to pre-cache (homepage, common category pages, and offline page)
const urlsToPrecache = [
  '/',
  '/index.html',
  '/category/engine-parts',
  '/category/brakes',
  '/category/suspension',
  '/offline', // The Next.js route for the offline page
  // Add more critical pages here
];

// Install event: caches static assets and offline page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_ASSETS)
      .then((cache) => {
        console.log('Opened static cache');
        return cache.addAll(urlsToPrecache);
      })
      .catch((error) => {
        console.error('Failed to pre-cache URLs:', error);
      })
  );
});

// Activate event: cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_STATIC_ASSETS && cacheName !== CACHE_DYNAMIC_IMAGES && cacheName !== CACHE_DYNAMIC_PAGES) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

// Helper function for cache-first strategy
const cacheFirst = async (request, cacheName) => {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  const networkResponse = await fetch(request);
  const cache = await caches.open(cacheName);
  cache.put(request, networkResponse.clone());
  return networkResponse;
};

// Helper function for network-first strategy
const networkFirst = async (request, cacheName) => {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Fallback to offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }
    throw error; // Re-throw if not a navigation request and no cache
  }
};

// Fetch event: implements caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only cache requests from the same origin
  if (url.origin !== location.origin) {
    return;
  }

  // Cache-first strategy for images
  if (request.destination === 'image') {
    event.respondWith(cacheFirst(request, CACHE_DYNAMIC_IMAGES));
    return;
  }

  // Cache-first strategy for CSS/JS and fonts
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(cacheFirst(request, CACHE_STATIC_ASSETS));
    return;
  }

  // Network-first strategy for HTML pages (navigation, product, category, search)
  if (request.mode === 'navigate' || 
      url.pathname.startsWith('/product/') || 
      url.pathname.startsWith('/category/') || 
      url.pathname.startsWith('/search')) {
    event.respondWith(networkFirst(request, CACHE_DYNAMIC_PAGES));
    return;
  }

  // Default to network-first for other requests, with offline fallback
  event.respondWith(
    networkFirst(request, CACHE_DYNAMIC_PAGES)
      .catch(() => {
        // If network and dynamic cache fail, try static cache or offline page
        return caches.match(request).then((response) => {
          return response || caches.match('/offline');
        });
      })
  );
});