import { useState } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "What is GST?", a: "GST (Goods and Services Tax) is an indirect tax levied on the supply of goods and services in India. It replaced multiple indirect taxes and follows a multi-stage, destination-based structure." },
  { q: "How to file ITR?", a: "Income Tax Returns can be filed online through the Income Tax e-Filing portal. You need your PAN, Aadhaar, Form 16, bank details, and investment proofs. We can assist you with the entire process." },
  { q: "Company registration cost?", a: "Company registration costs vary based on the type — Private Limited starts around ₹7,000-15,000 including government fees. LLP and OPC have different fee structures. Contact us for a precise quote." },
  { q: "What services do you offer?", a: "We offer legal services (litigation, drafting, recovery), taxation (GST, ITR, TDS), business registration (Company, LLP, MSME), financial advisory (loans, insurance), and compliance services." },
  { q: "How to book a consultation?", a: "You can book a consultation by clicking the 'Get Consultation' button, calling us at 8460884587, emailing advjbhoffice@gmail.com, or messaging us on WhatsApp." },
];

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I'm the Hargan & Associates assistant. How can I help you today? You can ask about GST, income tax, legal services, or book a consultation." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // Simple FAQ matching
    const lower = userMsg.toLowerCase();
    const match = faqs.find(
      (f) =>
        lower.includes("gst") && f.q.includes("GST") ||
        lower.includes("itr") && f.q.includes("ITR") ||
        lower.includes("company") && f.q.includes("Company") ||
        lower.includes("service") && f.q.includes("services") ||
        (lower.includes("book") || lower.includes("consultation")) && f.q.includes("consultation")
    );

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: match?.a || "Thank you for your question! For detailed assistance, please contact us at 8460884587 or email advjbhoffice@gmail.com. You can also book a consultation via WhatsApp.",
        },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-accent text-accent-foreground rounded-full p-3.5 shadow-lg transition-transform hover:scale-110"
          aria-label="Open AI assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 bg-card rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-slide-up"
          style={{ maxHeight: "min(500px, 70vh)" }}>
          <div className="bg-navy text-primary-foreground px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-gold" />
              <span className="font-display font-semibold text-sm">Hargan AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)} className="hover:text-gold transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  msg.role === "bot"
                    ? "bg-surface text-foreground"
                    : "bg-accent text-accent-foreground ml-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {["GST info", "Book consultation", "Services"].map((q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                  setTimeout(() => {
                    setInput(q);
                    handleSend();
                  }, 0);
                }}
                className="text-xs border border-accent/30 text-accent rounded-full px-2.5 py-1 hover:bg-gold-light transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="border-t p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 text-sm bg-surface rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-accent"
            />
            <Button type="submit" variant="gold" size="icon" className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
