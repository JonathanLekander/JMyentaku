const CACHE_NAME = 'jmyentaku-v4';

const RECURSOS_SHELL = [
    '/JMyentaku/',
    // HTML files
    '/JMyentaku/index.html',
    '/JMyentaku/html/anime.html',
    '/JMyentaku/html/manga.html',
    '/JMyentaku/html/myFaves.html',
    '/JMyentaku/html/history.html',
    '/JMyentaku/html/contact.html',
    '/JMyentaku/html/detail.html',
    
    // CSS files
    '/JMyentaku/css/main.css',
    '/JMyentaku/css/base/var.css',
    '/JMyentaku/css/components/header.css',
    '/JMyentaku/css/components/cards.css',
    '/JMyentaku/css/components/footer.css',
    '/JMyentaku/css/components/filters.css',
    '/JMyentaku/css/components/pagination.css',
    '/JMyentaku/css/components/modal.css',
    '/JMyentaku/css/components/notifications.css',
    '/JMyentaku/css/components/spinner.css',
    '/JMyentaku/css/pages/home.css',
    '/JMyentaku/css/pages/detail.css',
    '/JMyentaku/css/pages/genres.css',
    '/JMyentaku/css/pages/contact.css',
    '/JMyentaku/css/pages/history.css',
    '/JMyentaku/css/pages/faves.css',       
    
    // JS - Events
    '/JMyentaku/js/events/navActive.js',
    '/JMyentaku/js/events/moveBtn.js',
    '/JMyentaku/js/events/favoriteFormHandler.js',
    '/JMyentaku/js/events/favoritesPage.js',
    '/JMyentaku/js/events/historyPage.js',
    
    // JS - Fetchs
    '/JMyentaku/js/fetchs/paginationFetch.js',
    '/JMyentaku/js/fetchs/filterFetch.js',
    '/JMyentaku/js/fetchs/homeFetch.js',
    '/JMyentaku/js/fetchs/detailFetch.js',
    
    // JS - Storage
    '/JMyentaku/js/storage/favoriteStorage.js',
    '/JMyentaku/js/storage/historyStorage.js',
    
    // JS - UI
    '/JMyentaku/js/UI/spinner.js',
    '/JMyentaku/js/UI/notifications.js',
    
    // JS - Utils
    '/JMyentaku/js/utils/fetchWithRetry.js',
    
    // PWA
    '/JMyentaku/js/pwa-init.js',              
    '/JMyentaku/manifest.json',
    
    // Images
    '/JMyentaku/Images/Logo/JMYentaku7.png',
    '/JMyentaku/Images/Logo/favicon.ico',
    '/JMyentaku/Images/Logo/icon-96x96.png',   
    '/JMyentaku/Images/Logo/icon-192x192.png',
    '/JMyentaku/Images/Logo/icon-384x384.png',
    '/JMyentaku/Images/Logo/icon-512x512.png',
];

// ── INSTALACIÓN ──────────────────────────────────────────────
// Se ejecuta cuando el Service Worker se registra por primera
// vez o cuando el archivo sw.js cambió. Precachea los recursos
// del shell para habilitar el funcionamiento offline.
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando recursos del shell');
        return cache.addAll(RECURSOS_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVACIÓN ───────────────────────────────────────────────
// Se ejecuta cuando el Service Worker toma el control.
// Elimina cachés de versiones anteriores para liberar espacio.
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  event.waitUntil(
    caches.keys()
      .then(nombres => {
        return Promise.all(
          nombres
            .filter(nombre => nombre !== CACHE_NAME)
            .map(nombre => {
              console.log('[SW] Eliminando caché anterior:', nombre);
              return caches.delete(nombre);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// ── INTERCEPTACIÓN DE PETICIONES ─────────────────────────────
// Estrategia Cache First para recursos estáticos:
// 1. Busca el recurso en el caché local.
// 2. Si está disponible, lo devuelve directamente (sin red).
// 3. Si no está en caché, lo solicita a la red y lo guarda
//    para futuras peticiones.
//
// Las peticiones a la API siempre van a la red (Network Only)
// para garantizar datos actualizados.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Peticiones a APIs externas: siempre a la red
  // Modificá esta condición si tu API tiene un dominio distinto
  if (event.request.url.includes('/api/') ||
      !url.origin.includes(self.location.origin)) {

    // Para peticiones de API: Network Only
    // Si falla (sin conexión), no intentamos servir desde caché
    event.respondWith(
      fetch(event.request).catch(() => {
        // Respuesta de error amigable cuando no hay conexión
        return new Response(
          JSON.stringify({ error: 'Sin conexión. Los datos no están disponibles offline.' }),
          { headers: { 'Content-Type': 'application/json' } }
        );
      })
    );
    return;
  }

  // Para recursos estáticos: Cache First
  event.respondWith(
    caches.match(event.request)
      .then(respuestaCacheada => {
        if (respuestaCacheada) {
          return respuestaCacheada;
        }

        // No está en caché: solicitar a la red y guardar
        return fetch(event.request)
          .then(respuestaRed => {
            // Solo cachear respuestas válidas
            if (!respuestaRed || respuestaRed.status !== 200 ||
                respuestaRed.type !== 'basic') {
              return respuestaRed;
            }

            const copiaRespuesta = respuestaRed.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, copiaRespuesta);
            });

            return respuestaRed;
          })
          .catch(() => {
            // Sin conexión y sin caché: página de fallback
            if (event.request.destination === 'document') {
              return caches.match('/JMyentaku/index.html');
            }
          });
      })
  );
});
