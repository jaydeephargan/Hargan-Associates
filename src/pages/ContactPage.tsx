import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
      setForm({ name: "", phone: "", email: "", message: "" });
    }, 1000);
  };

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
            Contact <span className="text-gold">Us</span>
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Get in touch with Hargan & Associates for expert legal and taxation consultation.
          </p>
        </motion.div>
      </section>

      <div className="container py-12">
        <motion.div
          className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* Info */}
          <motion.div variants={fadeUp}>
            <h2 className="font-display font-semibold text-primary text-2xl mb-1">Hargan & Associates</h2>
            <p className="text-muted-foreground text-sm mb-1">Advocate | TaxFinLegal Solution</p>
            <p className="text-gold font-medium text-sm italic mb-6">Your Trust is Our Wealth</p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Email</p>
                  <a href="mailto:advjbhoffice@gmail.com" className="text-sm text-foreground/70 hover:text-gold transition-colors">
                    advjbhoffice@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Phone</p>
                  <a href="tel:8460884587" className="text-sm text-foreground/70 hover:text-gold transition-colors">
                    8460884587
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Location</p>
                  <p className="text-sm text-foreground/70">Bhavnagar | Ahmedabad | Rajkot | Baroda | Surat | Mumbai</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mb-8">
              <Button variant="gold" size="sm" asChild>
                <a href="https://wa.me/918460884587" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                </a>
              </Button>
              <Button variant="default" size="sm" asChild>
                <a href="tel:8460884587">
                  <Phone className="w-4 h-4 mr-1" /> Call Now
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:advjbhoffice@gmail.com">
                  <Mail className="w-4 h-4 mr-1" /> Email
                </a>
              </Button>
            </div>

            <div className="rounded-lg overflow-hidden border h-52">
              <iframe
                title="Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720000!2d72.8!3d21.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDEyJzAwLjAiTiA3MsKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} className="bg-card border rounded-xl p-6 md:p-8">
            <h3 className="font-display font-semibold text-primary text-xl mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border bg-surface text-sm outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Your full name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Phone *</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border bg-surface text-sm outline-none focus:ring-1 focus:ring-accent"
                  placeholder="Your phone number"
                  maxLength={15}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border bg-surface text-sm outline-none focus:ring-1 focus:ring-accent"
                  placeholder="your@email.com"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Message *</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-lg border bg-surface text-sm outline-none focus:ring-1 focus:ring-accent resize-none"
                  placeholder="Describe your requirement..."
                  maxLength={1000}
                />
              </div>
              <Button type="submit" variant="gold" className="w-full" disabled={sending}>
                {sending ? "Sending..." : (
                  <>Send Message <Send className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
