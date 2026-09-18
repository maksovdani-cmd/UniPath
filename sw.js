// sw.js — Service Worker для UniPath AI
// Нужен для двух вещей:
//  1) Chrome/Android считает сайт полноценным PWA и предлагает "Установить приложение"
//     (без этого файла показывается только "Добавить на экран" — обычная закладка).
//  2) Ловит push-сообщения от сервера и показывает системное уведомление,
//     даже если сайт в этот момент закрыт.

const CACHE_NAME = 'unipath-shell-v1';

// Установка — просто активируемся сразу, не дожидаясь закрытия старых вкладок
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Приём push-сообщения от сервера (Netlify Scheduled Function отправляет его через web-push)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "Leo's Daily Mission 🐧", body: event.data ? event.data.text() : '' };
  }

  const title = data.title || "Leo's Daily Mission 🐧";
  const options = {
    body: data.body || 'У тебя есть невыполненная миссия на сегодня!',
    icon: data.icon || '/image/leo-face.png',
    badge: data.badge || '/image/leo-face.png',
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Клик по уведомлению — открыть/сфокусировать сайт
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
