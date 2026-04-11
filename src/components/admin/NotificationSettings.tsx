import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell, Mail, Smartphone, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface Prefs {
  id: string;
  admin_email: string;
  email_enabled: boolean;
  push_enabled: boolean;
  notify_page_visit: boolean;
  notify_click: boolean;
  notify_scroll: boolean;
  notify_form: boolean;
  notify_chat: boolean;
  notify_exit_intent: boolean;
}

const NotificationSettings = () => {
  const { toast } = useToast();
  const { permission, supported, requestPermission, sendLocalNotification } = usePushNotifications();
  const [prefs, setPrefs] = useState<Prefs | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase
      .from("notification_preferences")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setPrefs(data as unknown as Prefs);
      });
  }, []);

  const handleSave = async () => {
    if (!prefs) return;
    setSaving(true);
    const { error } = await supabase
      .from("notification_preferences")
      .update({
        admin_email: prefs.admin_email,
        email_enabled: prefs.email_enabled,
        push_enabled: prefs.push_enabled,
        notify_page_visit: prefs.notify_page_visit,
        notify_click: prefs.notify_click,
        notify_scroll: prefs.notify_scroll,
        notify_form: prefs.notify_form,
        notify_chat: prefs.notify_chat,
        notify_exit_intent: prefs.notify_exit_intent,
      } as any)
      .eq("id", prefs.id);

    setSaving(false);
    if (error) {
      toast({ title: "Failed to save", variant: "destructive" });
    } else {
      toast({ title: "Settings saved!" });
    }
  };

  const handleEnablePush = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast({ title: "Push notifications enabled!" });
      sendLocalNotification("✅ Push Active", "You'll now receive browser notifications for visitor activity.");
      if (prefs) setPrefs({ ...prefs, push_enabled: true });
    } else {
      toast({ title: "Permission denied", description: "Please allow notifications in browser settings.", variant: "destructive" });
    }
  };

  if (!prefs) return null;

  const toggles: { key: keyof Prefs; label: string }[] = [
    { key: "notify_page_visit", label: "Page Visits" },
    { key: "notify_click", label: "Button Clicks" },
    { key: "notify_scroll", label: "Scroll Milestones" },
    { key: "notify_form", label: "Form Submissions" },
    { key: "notify_chat", label: "Chat Interactions" },
    { key: "notify_exit_intent", label: "Exit Intent" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-gold" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Settings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Mail className="w-4 h-4" /> Email Notifications
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={prefs.email_enabled}
              onCheckedChange={(v) => setPrefs({ ...prefs, email_enabled: v })}
            />
            <Label className="text-sm">Enable email alerts</Label>
          </div>
          {prefs.email_enabled && (
            <input
              value={prefs.admin_email || ""}
              onChange={(e) => setPrefs({ ...prefs, admin_email: e.target.value })}
              placeholder="admin@example.com"
              className="w-full px-3 py-2 rounded-lg border bg-card text-sm outline-none focus:ring-1 focus:ring-accent"
            />
          )}
        </div>

        {/* Push Settings */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <Smartphone className="w-4 h-4" /> Browser Push Notifications
          </div>
          {supported ? (
            permission === "granted" ? (
              <div className="flex items-center gap-3">
                <Switch
                  checked={prefs.push_enabled}
                  onCheckedChange={(v) => setPrefs({ ...prefs, push_enabled: v })}
                />
                <Label className="text-sm text-green-600">Push enabled ✓</Label>
              </div>
            ) : (
              <Button variant="gold" size="sm" onClick={handleEnablePush}>
                <Smartphone className="w-4 h-4 mr-1" /> Enable Push Notifications
              </Button>
            )
          ) : (
            <p className="text-xs text-muted-foreground">Push notifications not supported in this browser.</p>
          )}
        </div>

        {/* Event Toggles */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-primary">Notify on these events:</p>
          <div className="grid grid-cols-2 gap-3">
            {toggles.map(({ key, label }) => (
              <div key={key} className="flex items-center gap-2">
                <Switch
                  checked={prefs[key] as boolean}
                  onCheckedChange={(v) => setPrefs({ ...prefs, [key]: v })}
                />
                <Label className="text-sm">{label}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button variant="gold" className="w-full" onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-1" /> {saving ? "Saving..." : "Save Preferences"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
