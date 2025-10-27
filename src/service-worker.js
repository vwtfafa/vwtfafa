const CACHE_NAME = 'minecraft-projects-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index_en.html',
    '/login.html',
    '/register.html',
    '/minigame.html',
    '/about.html',
    '/manifest.json',
    '/service-worker.js',
    '/src/data/projects.js',
    '/src/js/main.js',
    '/components/minecraft-projects.html',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Cache strategy: Cache First, then Network
const cacheFirst = async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    const networkResponse = await fetch(request);
    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
        return networkResponse;
    }
    
    const responseToCache = networkResponse.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, responseToCache);
    
    return networkResponse;
};

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});