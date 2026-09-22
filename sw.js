const CACHE_NAME = 'vamsi-portfolio-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/data.json',
    '/hi.ico',
    '/images/sentinel_risk_engine.jpg',
    '/images/pii_redaction.jpg',
    '/images/balaveerlu.png',
    '/images/lpunow.png',
    '/images/smart_adut.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS).catch(err => {
                console.warn('Some assets could not be pre-cached:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(name => {
                    if (name !== CACHE_NAME) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    // Only cache GET requests
    if (event.request.method !== 'GET') return;
    
    // Ignore API or CMS requests
    const url = new URL(event.request.url);
    if (url.pathname.startsWith('/api/') || url.pathname.includes('openrouter.ai')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
