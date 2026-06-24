"use client";

import { useEffect } from "react";
import { pushService } from "@/lib/api/services/push.service";

function urlBase64ToArrayBuffer(base64String: string): ArrayBuffer {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; i++) {
    view[i] = rawData.charCodeAt(i);
  }
  return buffer;
}

export function usePushNotifications(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return;

    let mounted = true;

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        await navigator.serviceWorker.ready;

        const existing = await reg.pushManager.getSubscription();
        if (existing) return;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToArrayBuffer(vapidKey),
        });

        if (mounted) {
          await pushService.subscribe(subscription.toJSON(), navigator.userAgent);
        }
      } catch (err) {
        console.warn("[push] Registration failed:", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [enabled]);
}
