self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Al-Mumin Reminder';
  const options = {
    body: data.body || 'It is time for prayer.',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
