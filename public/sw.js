// This is a basic service worker file.

const CACHE_NAME = 'soulrefine-cache-v1';
const urlsToCache = [
  '/',
];

// Install a service worker
self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// This is where you would handle push notifications
self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push notification received:', data);

  const title = data.title || 'SoulRefine';
  const options = {
    body: data.body || 'You have a new message.',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
