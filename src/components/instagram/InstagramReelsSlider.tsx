import { useRef } from "react";
import { motion } from "framer-motion";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

interface Reel {
  id: string;
  caption: string;
  mediaUrl: string;
  thumbnailUrl: string;
  permalink: string;
  timestamp: string;
}

interface InstagramReelsSliderProps {
  reels: Reel[];
}

const InstagramReelsSlider = ({ reels }: InstagramReelsSliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 220;
      scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    }
  };

  if (reels.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-display font-semibold text-primary flex items-center gap-2">
          <Play className="w-4 h-4 text-accent fill-accent" /> Reels
        </h3>
        <div className="flex gap-1">
          <button onClick={() => scroll("left")} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll("right")} className="p-1 rounded-full hover:bg-muted text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {reels.map((reel, i) => (
          <motion.a
            key={reel.id}
            href={reel.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 w-36 md:w-44"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted group">
              <img
                src={reel.thumbnailUrl || reel.mediaUrl}
                alt={reel.caption?.slice(0, 40) || "Reel"}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[10px] text-white/90 line-clamp-2">{reel.caption?.slice(0, 60)}</p>
              </div>
              <div className="absolute top-2 right-2">
                <Play className="w-5 h-5 text-white fill-white/80 drop-shadow" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default InstagramReelsSlider;
