import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CONSENT_KEY = "ha_tracking_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50"
          role="dialog"
          aria-label="Cookie consent"
        >
          <div className="bg-card border rounded-lg shadow-lg p-5">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-primary text-sm mb-1">
                  We Value Your Privacy
                </h3>
                <p className="text-xs text-foreground/60 leading-relaxed">
                  We use anonymous tracking to improve our services. No personal
                  information is collected without your consent. You can change
                  your preference anytime.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={decline}>
                Decline
              </Button>
              <Button variant="gold" size="sm" onClick={accept}>
                Accept
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
