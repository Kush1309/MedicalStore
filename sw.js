const CACHE_NAME = 'medicare-v10';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/shop.html',
    '/cart.html',
    '/styles/main.css',
    '/js/api.js',
    '/js/main.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const { request } = event;

    // Only handle GET and skip API calls
    if (request.method !== 'GET' || request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then(response => {
                // Cache successful responses
                if (response && response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseToCache);
                    });
                }
                return response;
            })
            .catch(async () => {
                // Fallback to cache
                const cachedResponse = await caches.match(request);
                if (cachedResponse) return cachedResponse;

                // Final fallback for missing resources
                const acceptHeader = request.headers.get('accept') || '';

                if (acceptHeader.includes('text/html')) {
                    return caches.match('/index.html') || new Response('Offline');
                }

                if (request.destination === 'image') {
                    return new Response(
                        'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                        { headers: { 'Content-Type': 'image/gif' } }
                    );
                }

                return new Response('Resource unavailable', { status: 503 });
            })
    );
});
