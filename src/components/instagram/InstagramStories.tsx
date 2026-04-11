import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Story {
  id: string;
  mediaType: string;
  mediaUrl: string;
  timestamp: string;
}

interface InstagramStoriesProps {
  stories: Story[];
}

const HIGHLIGHT_COVERS = [
  { label: "Legal Tips", gradient: "from-amber-500 to-orange-600" },
  { label: "GST Updates", gradient: "from-purple-500 to-pink-600" },
  { label: "Case Studies", gradient: "from-blue-500 to-cyan-600" },
  { label: "Tax News", gradient: "from-green-500 to-emerald-600" },
  { label: "Office", gradient: "from-rose-500 to-red-600" },
];

const InstagramStories = ({ stories }: InstagramStoriesProps) => {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayItems = stories.length > 0 ? stories : HIGHLIGHT_COVERS.map((h, i) => ({
    id: `highlight-${i}`,
    mediaType: "IMAGE",
    mediaUrl: "",
    timestamp: new Date().toISOString(),
  }));

  const openViewer = (index: number) => {
    if (stories.length > 0) {
      setCurrentIndex(index);
      setViewerOpen(true);
    }
  };

  return (
    <>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {displayItems.map((item, i) => {
          const highlight = HIGHLIGHT_COVERS[i % HIGHLIGHT_COVERS.length];
          return (
            <motion.button
              key={item.id}
              onClick={() => openViewer(i)}
              className="flex flex-col items-center gap-1.5 shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] bg-gradient-to-br ${highlight.gradient}`}>
                <div className="w-full h-full rounded-full border-2 border-card overflow-hidden bg-muted flex items-center justify-center">
                  {stories.length > 0 && item.mediaUrl ? (
                    <img
                      src={item.mediaUrl}
                      alt={highlight.label}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">
                      {highlight.label.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium truncate max-w-[72px]">
                {highlight.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {viewerOpen && stories.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setViewerOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setViewerOpen(false); }}
              className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {currentIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i - 1); }}
                className="absolute left-4 text-white/80 hover:text-white"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
            )}

            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {stories[currentIndex]?.mediaType === "VIDEO" ? (
                <video
                  src={stories[currentIndex].mediaUrl}
                  autoPlay
                  className="w-full rounded-xl"
                  controls
                />
              ) : (
                <img
                  src={stories[currentIndex]?.mediaUrl}
                  alt="Instagram Story"
                  className="w-full rounded-xl object-contain"
                />
              )}

              {/* Progress bar */}
              <div className="flex gap-1 mt-3">
                {stories.map((_, idx) => (
                  <div key={idx} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/30">
                    <div className={`h-full bg-white transition-all ${idx <= currentIndex ? "w-full" : "w-0"}`} />
                  </div>
                ))}
              </div>
            </motion.div>

            {currentIndex < stories.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => i + 1); }}
                className="absolute right-4 text-white/80 hover:text-white"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InstagramStories;
