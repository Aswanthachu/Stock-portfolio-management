self.addEventListener('push', (event) => {
  const data = event.data.json();

  const notificationOptions = {
    body: data?.message,
    icon: data?.icon || 'logo192.png',
    image: data?.image,
    data: {
      url: data?.url,
    },
  };
  
  if (data.ttl) {
    // Schedule automatic dismissal of the notification after the specified TTL
    event.waitUntil(
      new Promise(resolve => setTimeout(resolve, data?.ttl * 1000))
        .then(() => self.registration.getNotifications())
        .then(notifications => {
          notifications.forEach(notification => notification.close());
        })
    );
  }

  event.waitUntil(
    self.registration.showNotification(data.title, notificationOptions)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  if (url) {
    clients.openWindow(url);
  }
});