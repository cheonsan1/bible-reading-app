// ===================================================
// 천산 성경통독반 — Service Worker (PWA)
// ===================================================

const CACHE_NAME = 'bible-reading-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './main.js',
  './style.css',
  './manifest.json',
  './favicon.svg',
  // 아이콘
  './icons/icon-192.png',
  './icons/icon-512.png',
  // 외부 CDN (오프라인 대비 캐싱)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Nanum+Myeongjo:wght@700;800&family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// ── Install: 핵심 자산 캐싱 ──────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 외부 CDN은 실패 가능성이 있으므로 개별 처리
      const localAssets = STATIC_ASSETS.filter(url => !url.startsWith('http'));
      const cdnAssets = STATIC_ASSETS.filter(url => url.startsWith('http'));

      return cache.addAll(localAssets).then(() => {
        return Promise.allSettled(
          cdnAssets.map(url =>
            fetch(url).then(res => {
              if (res.ok) cache.put(url, res);
            }).catch(() => {})
          )
        );
      });
    })
  );
  self.skipWaiting();
});

// ── Activate: 오래된 캐시 삭제 ───────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: 캐시 우선, 네트워크 폴백 ─────────────────
self.addEventListener('fetch', (event) => {
  // Supabase API 요청은 캐시하지 않음
  if (event.request.url.includes('supabase.co') ||
      event.request.url.includes('supabase.io') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 백그라운드에서 최신 버전 업데이트
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              caches.open(CACHE_NAME).then((cache) =>
                cache.put(event.request, networkResponse.clone())
              );
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // 캐시 미스: 네트워크에서 가져와서 캐싱
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || !networkResponse.ok) return networkResponse;
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) =>
          cache.put(event.request, responseClone)
        );
        return networkResponse;
      }).catch(() => {
        // 오프라인 시 index.html 반환 (HTML 요청에 한해)
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Push Notifications (선택 기능) ───────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || '천산 성경통독반';
  const options = {
    body: data.body || '오늘의 성경 통독 시간입니다! 📖',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    tag: 'bible-reading-notification',
    renotify: true,
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './')
  );
});
