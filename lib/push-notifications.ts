import { ENDPOINTS } from "@/lib/config";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  // Import lazily so there is no circular dependency at module load
  const { apiClient } = await import("@/lib/client");
  await apiClient.post(ENDPOINTS.SHARED.PUSH_SUBSCRIBE, {
    subscription: subscription.toJSON(),
    userAgent: navigator.userAgent,
  });
}

/**
 * Registers the service worker, subscribes the browser to web push, and
 * sends the subscription to the backend. Safe to call on every page load
 * after login — it is idempotent (reuses an existing subscription).
 */
export async function subscribeToPushNotifications(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) return;

  try {
    const registration = await navigator.serviceWorker.register("/sw.js");
    await navigator.serviceWorker.ready;

    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    await sendSubscriptionToServer(subscription);
  } catch (err) {
    console.error("[push] Failed to subscribe:", err);
  }
}

/**
 * Removes the push subscription from the browser and tells the backend to
 * delete it. Call on logout so the user stops receiving notifications on
 * this device.
 */
export async function unsubscribeFromPushNotifications(): Promise<void> {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.getRegistration("/sw.js");
    const subscription = await registration?.pushManager.getSubscription();
    if (!subscription) return;

    const endpoint = subscription.endpoint;
    await subscription.unsubscribe();

    const { apiClient } = await import("@/lib/client");
    // apiClient.delete passes opts.body straight through to fetch
    await apiClient.delete(ENDPOINTS.SHARED.PUSH_UNSUBSCRIBE, {
      body: JSON.stringify({ endpoint }),
    } as RequestInit);
  } catch (err) {
    console.error("[push] Failed to unsubscribe:", err);
  }
}
