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
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Forkcast Alert';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'You have a new update.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {}
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

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
