import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const GREETING_SHOWN_KEY = "ha_greeting_shown";

const VisitorGreeting = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const shown = sessionStorage.getItem(GREETING_SHOWN_KEY);
    if (shown) return;

    // Show after 5 seconds on page
    const timer = setTimeout(() => {
      sessionStorage.setItem(GREETING_SHOWN_KEY, "true");
      setVisible(true);
    }, 5000);

    // Or show on 30% scroll
    const handleScroll = () => {
      const scrollPct =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      if (scrollPct >= 0.3 && !sessionStorage.getItem(GREETING_SHOWN_KEY)) {
        sessionStorage.setItem(GREETING_SHOWN_KEY, "true");
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const dismiss = () => setVisible(false);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-40 max-w-xs"
        >
          <div className="bg-navy text-primary-foreground rounded-lg shadow-xl p-4 relative">
            <button
              onClick={dismiss}
              className="absolute top-2 right-2 text-primary-foreground/50 hover:text-primary-foreground"
              aria-label="Dismiss greeting"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">
                  Welcome! 👋 Need help?
                </p>
                <p className="text-xs text-primary-foreground/70 mb-3">
                  We're here to help with legal, taxation & compliance needs.
                </p>
                <Button variant="gold" size="sm" asChild>
                  <a
                    href="https://wa.me/918460884587"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat with us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorGreeting;
