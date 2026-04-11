import { createClient } from "https://esm.sh/@supabase/supabase-js@2.100.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type InstagramSettingsRow = {
  id: string;
  access_token: string | null;
  cached_posts: unknown[] | null;
  cached_stories: unknown[] | null;
  last_fetched_at: string | null;
  display_enabled: boolean;
  stories_enabled?: boolean;
  reels_enabled?: boolean;
};

const json = (body: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: { ...corsHeaders, "Content-Type": "application/json", ...(init.headers || {}) },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    // Get instagram settings
    const { data: existingSettings, error: settingsError } = await supabase
      .from("instagram_settings")
      .select("*")
      .limit(1)
      .single();

    // If the table has no rows yet, create a default one so the UI and feed can work out-of-the-box.
    let settings = existingSettings as InstagramSettingsRow | null;
    if (!settings && (!settingsError || settingsError.code === "PGRST116")) {
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
      settings = (created as InstagramSettingsRow) || null;
    }

    if (!settings) {
      return json({ posts: [], stories: [], enabled: true, needsSetup: true, error: "Instagram settings not configured yet." }, { status: 200 });
    }

    const { access_token, cached_posts, cached_stories, last_fetched_at, display_enabled } = settings;

    if (!display_enabled) {
      return json({ posts: [], stories: [], enabled: false });
    }

    // Check if cache is fresh (less than 1 hour old)
    if (last_fetched_at) {
      const age = Date.now() - new Date(last_fetched_at).getTime();
      if (age < 60 * 60 * 1000) {
        return json({
          posts: cached_posts || [],
          stories: cached_stories || [],
          enabled: true,
          cached: true,
        });
      }
    }

    // If no access token, return cached or empty
    if (!access_token) {
      return json({
        posts: cached_posts || [],
        stories: cached_stories || [],
        enabled: true,
        needsToken: true,
      });
    }

    // Fetch from Instagram Basic Display API (graph.instagram.com).
    // Note: Basic Display does NOT include like counts or stories. Keep those fields optional.
    let posts: any[] = [];
    let stories: any[] = [];

    try {
      // Fetch media
      const mediaRes = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${access_token}`
      );
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        posts = (mediaData.data || []).map((item: any) => ({
          id: item.id,
          caption: item.caption || "",
          mediaType: item.media_type,
          mediaUrl: item.media_url,
          thumbnailUrl: item.thumbnail_url || item.media_url,
          permalink: item.permalink,
          timestamp: item.timestamp,
          likeCount: 0,
        }));
      } else {
        const text = await mediaRes.text();
        throw new Error(`Instagram media fetch failed (${mediaRes.status}): ${text}`);
      }

      // Stories are not available via Basic Display API; keep as empty.
    } catch (apiError) {
      console.error("Instagram API error:", apiError);
      // Return cached data on API failure
      return json({
        posts: cached_posts || [],
        stories: cached_stories || [],
        enabled: true,
        error: "API fetch failed, showing cached data",
      });
    }

    // Update cache
    await supabase
      .from("instagram_settings")
      .update({
        cached_posts: posts,
        cached_stories: stories,
        last_fetched_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id);

    return json({ posts, stories, enabled: true });
  } catch (error) {
    console.error("Error:", error);
    return json({ posts: [], stories: [], enabled: true, error: error.message || "Unknown error" }, { status: 200 });
  }
});
