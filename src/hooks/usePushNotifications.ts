import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const isSupported = "Notification" in window && "serviceWorker" in navigator;
    setSupported(isSupported);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, []);

  const registerSW = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return null;
    const reg = await navigator.serviceWorker.register("/sw-push.js");
    return reg;
  }, []);

  const requestPermission = useCallback(async () => {
    if (!supported) return false;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      const reg = await registerSW();
      if (reg) {
        // For local push notifications (no VAPID server needed)
        setSubscription(null);

        // Store push enabled preference
        await supabase
          .from("notification_preferences")
          .update({ push_enabled: true, push_subscription: { browser: true } } as any)
          .eq("id", (await supabase.from("notification_preferences").select("id").limit(1).single()).data?.id || "");
      }
      return true;
    }
    return false;
  }, [supported, registerSW]);

  const sendLocalNotification = useCallback(
    (title: string, body: string, data?: Record<string, unknown>) => {
      if (permission !== "granted") return;
      // Use service worker notification for better UX
      navigator.serviceWorker?.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/placeholder.svg",
          data,
        } as NotificationOptions);
      });
    },
    [permission]
  );

  return { permission, subscription, supported, requestPermission, sendLocalNotification };
}
