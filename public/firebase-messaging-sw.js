// Firebase messaging is wrapped so that a failed script load (offline, blocked network) can never
// stop the worker itself from installing, which would also break "Install app".
try {
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
  importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

  firebase.initializeApp({
    apiKey: "AIzaSyCVzj4OB3KMABZItYWV5oGPuq3YA3kj1jE",
    authDomain: "gen-lang-client-0646477805.firebaseapp.com",
    projectId: "gen-lang-client-0646477805",
    storageBucket: "gen-lang-client-0646477805.firebasestorage.app",
    messagingSenderId: "90660934658",
    appId: "1:90660934658:web:6b7f369ee264b9addac31b"
  });

  const messaging = firebase.messaging();

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification?.title || payload.data?.title || '__BRAND_NAME__ Alert';
    const notificationOptions = {
      body: payload.notification?.body || payload.data?.body || 'You have a new update.',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: payload.data || {}
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });


} catch (err) {
  console.warn('[sw] Firebase messaging unavailable:', err);
}

// Handle the click action that focuses the app or opens a new window
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);
  event.notification.close();

  // URL of the app
  const urlToOpen = new URL('/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((windowClients) => {
      // Check if there is already a window/tab open and focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Chrome (especially on Android) only offers "Install app" when the page is controlled by a
// service worker with a fetch handler. This one does no caching (so new deploys show up
// immediately); it only lets the browser treat the app as installable.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => new Response('You are offline.', { status: 503, headers: { 'Content-Type': 'text/plain' } })));
  }
});
