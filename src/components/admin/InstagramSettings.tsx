import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Instagram, RefreshCw, Save, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const InstagramSettings = () => {
  const [settings, setSettings] = useState<any>(null);
  const [accessToken, setAccessToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [displayEnabled, setDisplayEnabled] = useState(true);
  const [storiesEnabled, setStoriesEnabled] = useState(true);
  const [reelsEnabled, setReelsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("instagram_settings")
      .select("*")
      .limit(1)
      .single();

    // If no settings row exists yet, create one with sensible defaults.
    if (!data && (error?.code === "PGRST116" || !error)) {
      const { data: created } = await supabase
        .from("instagram_settings")
        .insert({
          access_token: null,
          display_enabled: true,
          stories_enabled: true,
          reels_enabled: true,
          cached_posts: [],
          cached_stories: [],
          last_fetched_at: null,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .single();
      if (created) {
        setSettings(created);
        setAccessToken(created.access_token || "");
        setDisplayEnabled(created.display_enabled);
        setStoriesEnabled(created.stories_enabled);
        setReelsEnabled(created.reels_enabled);
      }
    } else if (data) {
      setSettings(data);
      setAccessToken(data.access_token || "");
      setDisplayEnabled(data.display_enabled);
      setStoriesEnabled(data.stories_enabled);
      setReelsEnabled(data.reels_enabled);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { error } = await supabase
      .from("instagram_settings")
      .update({
        access_token: accessToken || null,
        display_enabled: displayEnabled,
        stories_enabled: storiesEnabled,
        reels_enabled: reelsEnabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id);

    setSaving(false);
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Instagram settings saved" });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Clear cache to force re-fetch
    await supabase
      .from("instagram_settings")
      .update({ last_fetched_at: null, updated_at: new Date().toISOString() })
      .eq("id", settings.id);

    // Trigger fetch
    await supabase.functions.invoke("instagram-feed");
    setRefreshing(false);
    toast({ title: "Instagram feed refreshed" });
  };

  if (loading) return <div className="text-sm text-muted-foreground p-4">Loading Instagram settings...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Instagram className="w-5 h-5 text-accent" /> Instagram Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="ig-token">Instagram Access Token</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="ig-token"
                type={showToken ? "text" : "password"}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste your Instagram Graph API access token"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Use an Instagram Basic Display access token (the feed fetches from <span className="font-mono">graph.instagram.com</span>).
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="ig-display">Show Instagram Feed on Blog</Label>
            <Switch id="ig-display" checked={displayEnabled} onCheckedChange={setDisplayEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ig-stories">Show Stories Highlights</Label>
            <Switch id="ig-stories" checked={storiesEnabled} onCheckedChange={setStoriesEnabled} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="ig-reels">Show Reels Slider</Label>
            <Switch id="ig-reels" checked={reelsEnabled} onCheckedChange={setReelsEnabled} />
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Settings"}
          </Button>
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing || !accessToken}>
            <RefreshCw className={`w-4 h-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Refreshing..." : "Refresh Feed"}
          </Button>
        </div>

        {settings?.last_fetched_at && (
          <p className="text-xs text-muted-foreground">
            Last fetched: {new Date(settings.last_fetched_at).toLocaleString("en-IN")}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default InstagramSettings;
