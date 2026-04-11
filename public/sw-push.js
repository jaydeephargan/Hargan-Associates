// Service Worker for Push Notifications
self.addEventListener("push", (event) => {
  let data = { title: "Visitor Alert", body: "New visitor activity detected" };
  try {
    data = event.data ? event.data.json() : data;
  } catch {
    // use defaults
  }

  const options = {
    body: data.body,
    icon: "/placeholder.svg",
    badge: "/placeholder.svg",
    vibrate: [100, 50, 100],
    data: data.data || {},
    actions: [
      { action: "view", title: "View Dashboard" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "view" || !event.action) {
    event.waitUntil(clients.openWindow("/admin"));
  }
});
