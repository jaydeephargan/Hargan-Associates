import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Shield, Scale, TrendingUp, FileText, Users, Award,
  ArrowRight, Star, CheckCircle, Building2, Phone
} from "lucide-react";
import logo from "@/assets/logo.png";

const services = [
  { icon: Building2, title: "Business Registration", desc: "Company, LLP, Partnership, Startup India, MSME & more" },
  { icon: FileText, title: "Taxation & Compliance", desc: "GST, ITR, TDS/TCS, ROC returns & e-invoicing" },
  { icon: TrendingUp, title: "Financial Advisory", desc: "Business loans, CGTMSE, accounting & insurance" },
  { icon: Scale, title: "Legal Services", desc: "Litigation, drafting, recovery & trademark registration" },
];

const whyUs = [
  "Expert team of advocates & consultants",
  "End-to-end business compliance",
  "Transparent pricing, no hidden fees",
  "1000+ satisfied clients across India",
  "Fast turnaround & dedicated support",
  "All services under one roof",
];

const testimonials = [
  { name: "Rajesh Patel", role: "Startup Founder", text: "Hargan & Associates handled our company incorporation and GST registration flawlessly. Highly professional team!" },
  { name: "Priya Sharma", role: "Business Owner", text: "Excellent tax planning advice that saved us significantly. Their knowledge of current laws is impressive." },
  { name: "Amit Desai", role: "Import/Export Business", text: "From IEC registration to compliance, they've been our trusted partners for over 3 years now." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const HomePage = () => (
  <div>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-[400px] md:min-h-[450px]">
        {/* Left: Text — 3/4 */}
        <div className="md:w-3/4 bg-navy text-primary-foreground relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--gold)_/_0.08),_transparent_50%)]" />
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative h-full flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-16 md:py-20"
          >
            <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 text-sm text-gold mb-6 w-fit">
              <Shield className="w-4 h-4" /> Trusted Legal & Tax Consultancy
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold leading-tight mb-6">
              Your Trusted Partner in{" "}
              <span className="text-gold">Legal, Taxation</span> & Business Compliance
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl">
              End-to-end solutions for startups, businesses, and individuals.<br />
              From registration to compliance,<br />
              Expert guidance for all your legal, taxation, and compliance needs.<br />
              We handle it all.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="gold" size="lg" asChild>
                <a href="https://wa.me/918460884587" target="_blank" rel="noopener noreferrer">
                  Get Consultation <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </Button>
              <Button variant="gold-outline" size="lg" asChild>
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Right: Logo — 1/4 */}
        <div className="md:w-1/4 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'hsl(42, 50%, 92%)' }}>
          <img
            src={logo}
            alt="Hargan & Associates Logo"
            className="w-48 h-48 md:w-56 md:h-56 object-contain opacity-10 absolute"
          />
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            src={logo}
            alt="Hargan & Associates Logo"
            className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10"
          />
        </div>
      </div>
    </section>

    {/* About summary */}
    <motion.section
      className="py-16 bg-surface"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-4">
            About <span className="text-gold">Hargan & Associates</span>
          </h2>
          <p className="text-foreground/70 leading-relaxed">
            Founded by Adv. Jaydeep B. Hargan, we are a comprehensive legal and taxation consultancy providing
            expert solutions in litigation, compliance, business registration, financial advisory, and more.
            With a commitment to excellence and client-first approach, we've helped 1000+ clients navigate
            complex legal and tax landscapes across India.
          </p>
          <Button variant="link" asChild className="mt-4 text-gold">
            <Link to="/about">Learn more about us <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </motion.section>

    {/* Services */}
    <section className="py-16">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-display font-semibold text-primary text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Our <span className="text-gold">Key Services</span>
        </motion.h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {services.map((s) => (
            <motion.div
              key={s.title}
              variants={fadeUp}
              className="bg-card border rounded-lg p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-lg bg-gold-light flex items-center justify-center mb-4">
                <s.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-foreground/60 mb-4">{s.desc}</p>
              <Link to="/services" className="text-sm font-medium text-gold hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Help <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Why choose us */}
    <section className="py-16 bg-navy text-primary-foreground">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-display font-semibold text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Why Choose <span className="text-gold">Hargan & Associates</span>
        </motion.h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {whyUs.map((item) => (
            <motion.div key={item} variants={fadeUp} className="flex items-center gap-3 bg-primary-foreground/5 rounded-lg px-4 py-3">
              <CheckCircle className="w-5 h-5 text-gold shrink-0" />
              <span className="text-sm">{item}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="py-16 bg-surface">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-display font-semibold text-primary text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Client <span className="text-gold">Testimonials</span>
        </motion.h2>
        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="bg-card border rounded-lg p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-sm text-foreground/70 mb-4 italic">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-primary text-sm">{t.name}</p>
                <p className="text-xs text-foreground/50">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* CTA */}
    <motion.section
      className="py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="container">
        <div className="bg-navy rounded-xl p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/70 mb-6 max-w-xl mx-auto">
            Book a free consultation with our experts today. We'll help you with legal, taxation, and business compliance needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="gold" size="lg" asChild>
              <a href="https://wa.me/918460884587" target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </Button>
            <Button variant="gold-outline" size="lg" asChild>
              <a href="tel:8460884587">
                <Phone className="w-4 h-4 mr-2" /> Call Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  </div>
);

export default HomePage;
