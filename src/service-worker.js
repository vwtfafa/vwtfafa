const CACHE_NAME = 'beautiful-website-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/index_en.html',
    '/about.html',
    '/about_en.html',
    '/minigame.html',
    '/minigame_en.html',
    '/assets/css/styles.css',
    '/assets/js/scripts.js',
    '/assets/images/icon-192x192.png',
    '/assets/images/icon-512x512.png',
    '/manifest.json'
];

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