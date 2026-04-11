import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/918460884587?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20your%20services."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 left-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-primary-foreground rounded-full p-3.5 shadow-lg transition-transform hover:scale-110"
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-6 h-6" />
  </a>
);

export default WhatsAppButton;
