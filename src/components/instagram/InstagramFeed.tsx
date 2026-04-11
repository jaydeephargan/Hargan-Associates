import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Play, X, ExternalLink } from "lucide-react";

interface Post {
  id: string;
  caption: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
}

interface InstagramFeedProps {
  posts: Post[];
}

const InstagramFeed = ({ posts }: InstagramFeedProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const truncateCaption = (text: string, lines = 3) => {
    const parts = text.split("\n").slice(0, lines);
    const result = parts.join("\n");
    return result.length < text.length ? result + "..." : result;
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="group relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer border border-border hover:border-accent/50 transition-colors"
            onClick={() => setSelectedPost(post)}
          >
            <img
              src={post.thumbnailUrl || post.mediaUrl}
              alt={post.caption?.slice(0, 60) || "Instagram post"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />

            {post.mediaType === "VIDEO" && (
              <div className="absolute top-2 right-2">
                <Play className="w-5 h-5 text-white drop-shadow-lg fill-white/80" />
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-primary-foreground">
              {post.likeCount > 0 && (
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Heart className="w-4 h-4 fill-current" /> {post.likeCount}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media */}
              <div className="md:w-1/2 aspect-square bg-black flex items-center justify-center shrink-0">
                {selectedPost.mediaType === "VIDEO" ? (
                  <video
                    src={selectedPost.mediaUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <img
                    src={selectedPost.mediaUrl}
                    alt={selectedPost.caption?.slice(0, 60) || "Instagram post"}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Details */}
              <div className="md:w-1/2 p-5 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground">{formatDate(selectedPost.timestamp)}</span>
                  <button onClick={() => setSelectedPost(null)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {selectedPost.likeCount > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <Heart className="w-4 h-4 text-destructive fill-destructive" />
                    <span>{selectedPost.likeCount} likes</span>
                  </div>
                )}

                <p className="text-sm text-foreground whitespace-pre-line flex-1">
                  {selectedPost.caption}
                </p>

                <a
                  href={selectedPost.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                >
                  <ExternalLink className="w-4 h-4" /> View on Instagram
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEO: Crawlable captions */}
      <div className="sr-only">
        {posts.map((post) => (
          <article key={`seo-${post.id}`}>
            <p>{post.caption}</p>
            <time dateTime={post.timestamp}>{post.timestamp}</time>
          </article>
        ))}
      </div>
    </>
  );
};

export default InstagramFeed;
