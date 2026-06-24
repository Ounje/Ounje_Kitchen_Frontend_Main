self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || "Ounje Kitchen";
  const options = {
    body: data.body || "",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
    data: data.data || {},
    tag: data.data?.orderId || "ounje-push",
    renotify: true,
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const orderId = event.notification.data?.orderId;
  const url = orderId ? `/operations/orders/${orderId}` : "/operations";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      const existing = wins.find((w) => w.focused || w.url.includes(url));
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
