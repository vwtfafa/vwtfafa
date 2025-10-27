const CACHE_NAME = 'minecraft-projects-cache-v2';
const BASE_PATH = '/vwtfafa';

const urlsToCache = [
    `${BASE_PATH}/`,
    `${BASE_PATH}/index.html`,
    `${BASE_PATH}/manifest.json`,
    `${BASE_PATH}/service-worker.js`,
    `${BASE_PATH}/src/data/projects.js`,
    `${BASE_PATH}/src/js/projects.js`,
    `${BASE_PATH}/src/css/tailwind.css`,
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Cache strategy: Cache First, then Network
const cacheFirst = async (request) => {
    // Skip non-GET requests
    if (request.method !== 'GET') return fetch(request);
    
    // Skip non-http(s) requests
    if (!request.url.startsWith('http')) return fetch(request);
    
    // For same-origin requests, ensure we're using the correct base path
    const url = new URL(request.url);
    if (url.origin === location.origin && !url.pathname.startsWith(BASE_PATH)) {
        url.pathname = BASE_PATH + (url.pathname === '/' ? '' : url.pathname);
        request = new Request(url.toString(), request);
    }
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;
    
    try {
        const networkResponse = await fetch(request);
        
        // Only cache successful responses and don't cache opaque responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, responseToCache);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Fetch failed:', error);
        throw error;
    }
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