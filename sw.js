
importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('hikecricket').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/css/font.css',
        '/assets/js/cricket.js',
        '/assets/js/platformSdk.js',
        '/assets/js/swipe.js',
        '/assets/css/cards.css',
        '/assets/images/afg.png',
        '/assets/images/arrow.png',
        '/assets/images/aus.png',
        '/assets/images/ban.png',
        '/assets/images/block_icon.png',
        '/assets/images/cen.png',
        '/assets/images/cricbuzz-logo.png',
        '/assets/images/eng.png',
        '/assets/images/forward.png',
        '/assets/images/four.png',
        '/assets/images/hc.png',
        '/assets/images/icon.png',
        '/assets/images/ind.png',
        '/assets/images/ire.png',
        '/assets/images/news_default.png',
        '/assets/images/nointernet.png',
        '/assets/images/nz.png',
        '/assets/images/out.png',
        '/assets/images/pak.png',
        '/assets/images/refresh.png',
        '/assets/images/rsa.png',
        '/assets/images/sco.png',
        '/assets/images/share.png',
        '/assets/images/six.png',
        '/assets/images/sl.png',
        '/assets/images/uae.png',
        '/assets/images/spinner.png',
        '/assets/images/wi.png',
        '/assets/images/zim.png'
      ]).then(function() {
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});