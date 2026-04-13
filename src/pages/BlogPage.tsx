import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Calendar, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import InstagramSection from "@/components/instagram/InstagramSection";

interface BlogPost {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  published: boolean;
  author: string | null;
  created_at: string;
}

const categories = ["All", "General", "Legal News", "GST Updates", "Income Tax Updates", "Case Studies", "Company Law", "Advisory"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const BlogPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    setPosts((data as BlogPost[]) || []);
    setLoading(false);
  };

  const filtered = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.summary || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <section className="bg-navy text-primary-foreground py-16">
        <motion.div
          className="container text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Legal & Tax <span className="text-gold">Blog</span>
          </h1>
          <p className="text-primary-foreground/80 text-sm mb-1">Hargan Associates – Advocate | TaxFinLegal Consultant</p>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Insights, updates, and expert analysis on legal and tax matters.
          </p>
        </motion.div>
      </section>

      <div className="container py-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Left: Blog (admin-created posts) */}
          <div className="lg:col-span-8">
            {/* Search & filter */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Blog Posts */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card overflow-hidden animate-pulse">
                    <div className="h-40 bg-muted" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={staggerContainer}
              >
                {filtered.map((post) => (
                  <motion.article
                    key={post.id}
                    variants={fadeUp}
                    className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="h-40 bg-navy/5 flex items-center justify-center overflow-hidden">
                      {post.image_url ? (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-accent/40" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-flex items-center gap-1 text-xs bg-accent/10 text-accent rounded-full px-2 py-0.5">
                          <Tag className="w-3 h-3" /> {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />{" "}
                          {new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-primary text-sm mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-xs text-foreground/60 mb-3 line-clamp-3">{post.summary || post.content?.slice(0, 150) || ""}</p>
                      <span className="text-xs font-medium text-accent">Read More →</span>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No articles found. Check back soon for new posts!</p>
              </div>
            )}
          </div>

          {/* Right: Instagram */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24">
            <InstagramSection />
          </aside>
        </div>
      </div>

      {/* Post Detail Modal */}
      {selectedPost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedPost.image_url && (
              <img src={selectedPost.image_url} alt={selectedPost.title} className="w-full h-56 object-cover rounded-t-xl" />
            )}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs bg-accent/10 text-accent rounded-full px-2 py-0.5">{selectedPost.category}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(selectedPost.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </span>
                {selectedPost.author && <span className="text-xs text-muted-foreground">by {selectedPost.author}</span>}
              </div>
              <h2 className="text-xl font-display font-bold text-primary mb-4">{selectedPost.title}</h2>
              <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-line">
                {selectedPost.content || selectedPost.summary || "No content available."}
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="mt-6 text-sm font-medium text-accent hover:underline"
              >
                ← Back to Blog
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BlogPage;
