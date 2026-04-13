import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, RefreshCw, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import InstagramFeed from "./InstagramFeed";
import InstagramStories from "./InstagramStories";
import InstagramReelsSlider from "./InstagramReelsSlider";

const INSTAGRAM_HANDLE = "hargan_and_associates";

const InstagramSection = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInstagram = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("instagram-feed");
      if (fnError) throw fnError;
      if (data) {
        setEnabled(data.enabled !== false);
        setPosts(data.posts || []);
        setStories(data.stories || []);
        if (data.error) setError(data.error);
      }
    } catch (err: any) {
      console.error("Instagram fetch error:", err);
      setError("Could not load Instagram feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstagram();
  }, []);

  if (!enabled) return null;

  const reels = posts.filter((p) => p.mediaType === "VIDEO");
  const regularPosts = posts;

  return (
    <section className="py-10">
      {/* Section Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-display font-bold text-primary">
              Latest from <span className="text-accent">Instagram</span>
            </h2>
            <p className="text-xs text-muted-foreground">@{INSTAGRAM_HANDLE}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchInstagram}
            disabled={loading}
            className="flex items-center gap-1 text-xs text-accent hover:underline disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white hover:opacity-90 transition-opacity"
          >
            <Instagram className="w-3 h-3" /> Follow on Instagram
          </a>
        </div>
      </motion.div>

      {/* Stories Highlights */}
      <div className="mb-8">
        <InstagramStories stories={stories} />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          {/* Reels Slider */}
          {reels.length > 0 && (
            <div className="mb-8">
              <InstagramReelsSlider reels={reels} />
            </div>
          )}

          {/* Feed Grid */}
          <InstagramFeed posts={regularPosts} />
        </>
      ) : (
        /* Fallback: Embed */
        <div className="text-center py-8">
          {error && <p className="text-xs text-muted-foreground mb-4">{error}</p>}
          <p className="text-sm text-muted-foreground mb-4">
            Connect your Instagram account from the admin panel to display your latest posts here.
          </p>
          <a
            href={`https://instagram.com/${INSTAGRAM_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium text-accent hover:bg-accent/5 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Visit @{INSTAGRAM_HANDLE} on Instagram
          </a>
        </div>
      )}

      {/* JSON-LD Schema for social media posts */}
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SocialMediaPosting",
              author: {
                "@type": "Organization",
                name: "Hargan Associates",
                url: `https://instagram.com/${INSTAGRAM_HANDLE}`,
              },
              sharedContent: posts.slice(0, 5).map((p) => ({
                "@type": "WebPage",
                url: p.permalink,
                headline: p.caption?.slice(0, 100),
                datePublished: p.timestamp,
              })),
            }),
          }}
        />
      )}
    </section>
  );
};

export default InstagramSection;
