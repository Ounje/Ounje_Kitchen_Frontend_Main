self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data?.json() ?? {};
  } catch {
    data = { body: event.data?.text() ?? "" };
  }

  const title = data.title || "OunjeFood";
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
  const targetUrl = orderId ? `/operations/orders/${orderId}` : "/operations";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((wins) => {
      for (const win of wins) {
        if ("focus" in win) {
          if (orderId) win.navigate(targetUrl);
          return win.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
