import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  TrendingUp, Users, Eye, MousePointerClick, Activity,
  FileText, ScrollText, ArrowUpRight
} from "lucide-react";

interface VisitorEvent {
  id: string;
  session_id: string;
  event_type: string;
  page_url: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

const PIE_COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899", "#ef4444"];

const AnalyticsDashboardPage = () => {
  const [events, setEvents] = useState<VisitorEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<string>("7d");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const daysAgo = range === "1d" ? 1 : range === "7d" ? 7 : range === "30d" ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - daysAgo);

      const { data } = await supabase
        .from("visitor_events")
        .select("*")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });

      setEvents((data as VisitorEvent[]) || []);
      setLoading(false);
    };
    fetchEvents();
  }, [range]);

  const stats = useMemo(() => {
    const sessions = new Set(events.map((e) => e.session_id));
    const pageVisits = events.filter((e) => e.event_type === "page_visit").length;
    const clicks = events.filter((e) => e.event_type === "click").length;
    const forms = events.filter((e) => e.event_type === "form").length;
    return { total: events.length, sessions: sessions.size, pageVisits, clicks, forms };
  }, [events]);

  // Events over time (grouped by day)
  const timelineData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      const day = new Date(e.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      map.set(day, (map.get(day) || 0) + 1);
    });
    return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
  }, [events]);

  // Events by type
  const eventTypeData = useMemo(() => {
    const map = new Map<string, number>();
    events.forEach((e) => {
      map.set(e.event_type, (map.get(e.event_type) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [events]);

  // Popular pages
  const pageData = useMemo(() => {
    const map = new Map<string, number>();
    events
      .filter((e) => e.event_type === "page_visit")
      .forEach((e) => {
        map.set(e.page_url, (map.get(e.page_url) || 0) + 1);
      });
    return Array.from(map.entries())
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }, [events]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-primary">
              Analytics <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Visitor engagement insights</p>
          </div>
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading analytics...</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {[
                { label: "Total Events", value: stats.total, icon: Activity, color: "text-blue-600" },
                { label: "Unique Visitors", value: stats.sessions, icon: Users, color: "text-green-600" },
                { label: "Page Views", value: stats.pageVisits, icon: Eye, color: "text-purple-600" },
                { label: "Clicks", value: stats.clicks, icon: MousePointerClick, color: "text-amber-600" },
                { label: "Form Interactions", value: stats.forms, icon: FileText, color: "text-pink-600" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                      <div>
                        <p className="text-2xl font-bold text-primary">{s.value}</p>
                        <p className="text-xs text-muted-foreground">{s.label}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-gold" /> Events Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {timelineData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={timelineData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="hsl(42 65% 48%)"
                          strokeWidth={2}
                          dot={{ fill: "hsl(42 65% 48%)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Event Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-gold" /> Event Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {eventTypeData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No data</p>
                  ) : (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={eventTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={90}
                          dataKey="value"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {eventTypeData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Popular Pages */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-gold" /> Popular Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pageData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No page visit data</p>
                ) : (
                  <ResponsiveContainer width="100%" height={Math.max(200, pageData.length * 40)}>
                    <BarChart data={pageData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 91%)" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="page" tick={{ fontSize: 11 }} width={120} />
                      <Tooltip />
                      <Bar dataKey="visits" fill="hsl(215 60% 18%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboardPage;
