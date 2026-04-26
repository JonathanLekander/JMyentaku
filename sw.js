const CACHE_NAME = 'jmyentaku-v3';

const RECURSOS_SHELL = [
    '/',
    // HTML files
    '/html/index.html',
    '/html/anime.html',
    '/html/manga.html',
    '/html/myFaves.html',
    '/html/history.html',
    '/html/contact.html',
    '/html/detail.html',
    
    // CSS files
    '/css/main.css',
    '/css/base/var.css',
    '/css/components/header.css',
    '/css/components/cards.css',
    '/css/components/footer.css',
    '/css/components/filters.css',
    '/css/components/pagination.css',
    '/css/components/modal.css',
    '/css/components/notifications.css',
    '/css/components/spinner.css',
    '/css/pages/home.css',
    '/css/pages/detail.css',
    '/css/pages/genres.css',
    '/css/pages/contact.css',
    '/css/pages/history.css',
    '/css/pages/faves.css',       
    
    // JS - Events
    '/js/events/navActive.js',
    '/js/events/moveBtn.js',
    '/js/events/favoriteFormHandler.js',
    '/js/events/favoritesPage.js',
    '/js/events/historyPage.js',
    
    // JS - Fetchs
    '/js/fetchs/paginationFetch.js',
    '/js/fetchs/filterFetch.js',
    '/js/fetchs/homeFetch.js',
    '/js/fetchs/detailFetch.js',
    
    // JS - Storage
    '/js/storage/favoriteStorage.js',
    '/js/storage/historyStorage.js',
    
    // JS - UI
    '/js/UI/spinner.js',
    '/js/UI/notifications.js',
    
    // JS - Utils
    '/js/utils/fetchWithRetry.js',
    
    // PWA
    '/js/pwa-init.js',              
    '/manifest.json',
    
    // Images
    '/Images/Logo/JMYentaku7.png',
    '/Images/Logo/favicon.ico',
    '/Images/Logo/icon-96x96.png',   
    '/Images/Logo/icon-192x192.png',
    '/Images/Logo/icon-384x384.png',
    '/Images/Logo/icon-512x512.png',
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
              return caches.match('/index.html');
            }
          });
      })
  );
});
