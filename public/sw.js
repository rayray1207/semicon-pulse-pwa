/**
 * Service Worker - PWA 오프라인 기능 및 캐싱
 * 버전 관리를 통해 업데이트 시 자동으로 캐시 갱신
 */

const CACHE_NAME = 'semicon-pulse-v' + new Date().getTime();
const NEWS_CACHE = 'news-cache-v' + new Date().getTime();

// 캐시할 정적 파일 목록
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 설치 이벤트: 정적 파일 캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 활성화 이벤트: 오래된 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== NEWS_CACHE)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch 이벤트: 네트워크 요청 가로채기 및 캐싱 전략
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // index.html / 내비게이션은 Network First (항상 최신 화면 우선)
  if (
    url.origin === location.origin &&
    (request.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html')
  ) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  // news.json은 캐시 안 함 - 항상 최신 데이터 직접 가져오기
  if (url.pathname === '/news.json') {
    event.respondWith(fetch(request));
    return;
  }

  // 정적 파일은 Cache First 전략
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          });
        })
    );
    return;
  }

  // 외부 리소스는 기본 fetch (캐싱 안 함)
  event.respondWith(fetch(request));
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-news') {
    console.log('[SW] Background sync: updating news...');
    event.waitUntil(
      fetch('/news.json')
        .then((response) => response.json())
        .then(() => {
          console.log('[SW] News synced in background');
        })
    );
  }
});

// 푸시 알림
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New semiconductor news available!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Now',
        icon: '/icons/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Semicon Pulse', options)
  );
});

// 알림 클릭 이벤트
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[SW] Service worker loaded successfully');
```
