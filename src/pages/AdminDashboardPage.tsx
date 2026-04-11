import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Activity, Eye, MousePointerClick, ScrollText, FileText,
  MessageCircle, LogOut, RefreshCw, Bell, Users, Clock, Zap, Settings
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import NotificationSettings from "@/components/admin/NotificationSettings";
import PasswordChangeDialog from "@/components/admin/PasswordChangeDialog";
import InstagramSettings from "@/components/admin/InstagramSettings";
import BlogManager from "@/components/admin/BlogManager";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EVENT_ICONS: Record<string, typeof Activity> = {
  page_visit: Eye,
  click: MousePointerClick,
  scroll: ScrollText,
  form: FileText,
  chat: MessageCircle,
  exit_intent: LogOut,
};

const EVENT_COLORS: Record<string, string> = {
  page_visit: "bg-blue-100 text-blue-700",
  click: "bg-amber-100 text-amber-700",
  scroll: "bg-green-100 text-green-700",
  form: "bg-purple-100 text-purple-700",
  chat: "bg-pink-100 text-pink-700",
  exit_intent: "bg-red-100 text-red-700",
};

interface VisitorEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string;
  metadata: Record<string, unknown> | null;
  user_agent: string | null;
  created_at: string;
}

const AdminDashboardPage = () => {
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [liveCount, setLiveCount] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const { sendLocalNotification, permission } = usePushNotifications();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/admin/login");
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("visitor_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (filter !== "all") {
      query = query.eq("event_type", filter);
    }

    const { data } = await query;
    setEvents((data as VisitorEvent[]) || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Realtime subscription with push notifications
  useEffect(() => {
    const channel = supabase
      .channel("admin-live-events")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visitor_events" },
        (payload) => {
          const newEvent = payload.new as VisitorEvent;
          setEvents((prev) => [newEvent, ...prev].slice(0, 200));
          setLiveCount((c) => c + 1);

          // Send browser push notification
          if (permission === "granted") {
            const meta = newEvent.metadata as Record<string, unknown> | null;
            const detail = meta?.button || meta?.form || meta?.depth || "";
            sendLocalNotification(
              `🔔 ${newEvent.event_type}`,
              `${newEvent.page_url}${detail ? ` · ${detail}` : ""}`,
              { url: "/admin" }
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [permission, sendLocalNotification]);

  useEffect(() => {
    if (liveCount > 0) {
      const t = setTimeout(() => setLiveCount(0), 5000);
      return () => clearTimeout(t);
    }
  }, [liveCount]);

  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
  const todayEvents = events.filter(
    (e) => new Date(e.created_at).toDateString() === new Date().toDateString()
  ).length;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  };

  const formatMetadata = (meta: Record<string, unknown> | null) => {
    if (!meta) return "";
    return Object.entries(meta)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}: ${v}`)
      .join(" · ");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
              Admin <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Real-time visitor activity feed</p>
          </div>
          <div className="flex items-center gap-3">
            {liveCount > 0 && (
              <Badge className="bg-green-500 text-white animate-pulse">
                <Zap className="w-3 h-3 mr-1" /> {liveCount} new
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4 mr-1" /> Notifications
            </Button>
            <PasswordChangeDialog />
            <Button variant="outline" size="sm" onClick={fetchEvents}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>

        {showSettings && (
          <div className="mb-8 space-y-6">
            <BlogManager />
            <NotificationSettings />
            <InstagramSettings />
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{events.length}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{uniqueSessions}</p>
                  <p className="text-xs text-muted-foreground">Unique Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{todayEvents}</p>
                  <p className="text-xs text-muted-foreground">Today's Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100">
                  <Bell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">{liveCount}</p>
                  <p className="text-xs text-muted-foreground">Live Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-medium text-muted-foreground">Filter:</span>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="page_visit">Page Visits</SelectItem>
              <SelectItem value="click">Clicks</SelectItem>
              <SelectItem value="scroll">Scrolls</SelectItem>
              <SelectItem value="form">Forms</SelectItem>
              <SelectItem value="chat">Chat</SelectItem>
              <SelectItem value="exit_intent">Exit Intent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-gold" />
              Live Event Feed
              <span className="relative flex h-2.5 w-2.5 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading events...</div>
            ) : events.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No events yet. Visit the site to generate tracking data.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {events.map((event) => {
                    const Icon = EVENT_ICONS[event.event_type] || Activity;
                    const colorClass = EVENT_COLORS[event.event_type] || "bg-gray-100 text-gray-700";
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {event.event_type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{event.page_url}</span>
                          </div>
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1 truncate">
                              {formatMetadata(event.metadata)}
                            </p>
                          )}
                          <p className="text-[10px] text-muted-foreground/60 mt-1">
                            Session: {event.session_id.slice(0, 8)}…
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {formatTime(event.created_at)}
                        </span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
