import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "ha_session_id";
const CONSENT_KEY = "ha_tracking_consent";

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function hasConsent(): boolean {
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

type EventType = "page_visit" | "click" | "scroll" | "form" | "chat" | "exit_intent";

interface TrackEvent {
  event_type: EventType;
  page_url: string;
  metadata?: Record<string, string | number | boolean>;
}

const eventQueue: TrackEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

const HIGH_PRIORITY_EVENTS = new Set(["click", "form", "chat"]);

async function notifyOwner(event: TrackEvent) {
  if (!HIGH_PRIORITY_EVENTS.has(event.event_type)) return;
  try {
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    await fetch(
      `https://${projectId}.supabase.co/functions/v1/notify-visitor-event`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: event.event_type,
          page_url: event.page_url,
          metadata: event.metadata,
        }),
      }
    );
  } catch {
    // silent fail for notifications
  }
}

async function flushEvents() {
  if (eventQueue.length === 0) return;
  const batch = eventQueue.splice(0, eventQueue.length);
  const sessionId = getSessionId();
  const userAgent = navigator.userAgent.substring(0, 200);

  const rows = batch.map((e) => ({
    session_id: sessionId,
    event_type: e.event_type,
    page_url: e.page_url,
    metadata: e.metadata ?? {},
    user_agent: userAgent,
  }));

  try {
    await supabase.from("visitor_events").insert(rows);
    // Notify owner for high-priority events
    batch.forEach((e) => notifyOwner(e));
  } catch (err) {
    console.error("Failed to send visitor events:", err);
  }
}

function queueEvent(event: TrackEvent) {
  if (!hasConsent()) return;
  eventQueue.push(event);
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flushEvents, 2000);
}

export function trackClick(buttonName: string, section?: string) {
  queueEvent({
    event_type: "click",
    page_url: window.location.pathname,
    metadata: { button: buttonName, section },
  });
}

export function trackFormInteraction(formName: string) {
  queueEvent({
    event_type: "form",
    page_url: window.location.pathname,
    metadata: { form: formName },
  });
}

export function trackChatInteraction() {
  queueEvent({
    event_type: "chat",
    page_url: window.location.pathname,
  });
}

export function useVisitorTracker() {
  const location = useLocation();
  const scrollThresholds = useRef(new Set<number>());
  const lastPage = useRef("");

  // Track page visits on route change
  useEffect(() => {
    if (location.pathname === lastPage.current) return;
    lastPage.current = location.pathname;
    queueEvent({
      event_type: "page_visit",
      page_url: location.pathname,
    });
  }, [location.pathname]);

  // Scroll tracking (25%, 50%, 75%, 100%)
  useEffect(() => {
    if (!hasConsent()) return;
    scrollThresholds.current.clear();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of [25, 50, 75, 100]) {
        if (pct >= threshold && !scrollThresholds.current.has(threshold)) {
          scrollThresholds.current.add(threshold);
          queueEvent({
            event_type: "scroll",
            page_url: location.pathname,
            metadata: { depth: threshold },
          });
        }
      }
    };

    let ticking = false;
    const debounced = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", debounced, { passive: true });
    return () => window.removeEventListener("scroll", debounced);
  }, [location.pathname]);

  // Exit intent (desktop only)
  useEffect(() => {
    if (!hasConsent()) return;
    let fired = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !fired) {
        fired = true;
        queueEvent({
          event_type: "exit_intent",
          page_url: location.pathname,
        });
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [location.pathname]);

  // Flush on page unload
  useEffect(() => {
    const flush = () => flushEvents();
    window.addEventListener("beforeunload", flush);
    return () => window.removeEventListener("beforeunload", flush);
  }, []);
}
