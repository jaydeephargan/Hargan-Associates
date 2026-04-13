import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award, Target, Eye, CheckCircle, Users, Scale,
  TrendingUp, Shield, ArrowRight
} from "lucide-react";
import logo from "@/assets/logo.png";
import founderImg from "@/assets/founder.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const strengths = [
  { icon: Scale, title: "Legal Expertise", desc: "Deep knowledge of Indian laws, acts, and judicial processes" },
  { icon: TrendingUp, title: "Tax Optimization", desc: "Strategic planning to minimize tax liability legally" },
  { icon: Shield, title: "Full Compliance", desc: "Ensure your business meets all regulatory requirements" },
  { icon: Users, title: "Client-First Approach", desc: "Personalized solutions tailored to your specific needs" },
];

const AboutPage = () => (
  <div>
    <section className="bg-navy text-primary-foreground py-16">
      <div className="container flex flex-col md:flex-row items-center gap-8 justify-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={logo}
          alt="Hargan Associates Logo"
          className="w-28 h-28 md:w-36 md:h-36 object-contain rounded-full p-3" style={{ backgroundColor: 'hsl(42, 50%, 92%)' }}
        />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center md:text-left"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
            <span className="text-gold">Hargan Associates</span>
          </h1>
          <p className="text-primary-foreground/80 text-sm mb-1">Advocate | TaxFinLegal Solution</p>
          <p className="text-gold italic text-sm mb-4">Your Trust is Our Wealth</p>
          <p className="text-primary-foreground/70 max-w-2xl">
            A trusted legal and taxation consultancy providing comprehensive solutions for businesses and individuals.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Intro */}
    <motion.section
      className="py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="container max-w-4xl">
        <p className="text-foreground/70 leading-relaxed text-lg text-center">
          Hargan Associates is a premier legal and taxation consultancy firm offering end-to-end solutions
          in litigation, compliance, business registration, financial advisory, and more. With a commitment
          to excellence, integrity, and client satisfaction, we have established ourselves as a go-to firm
          for startups, SMEs, and individuals across India.
        </p>
      </div>
    </motion.section>

    {/* Founder */}
    <motion.section
      className="py-16 bg-surface"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeUp}
    >
      <div className="container max-w-4xl">
        <div className="bg-card border rounded-xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.img
              src={founderImg}
              alt="Adv. Jaydeep B. Hargan"
              className="w-32 h-32 rounded-full object-cover shrink-0 border-4 border-gold/30 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
            <div>
              <h2 className="font-display font-bold text-primary text-2xl mb-1">Adv. Jaydeep B. Hargan</h2>
              <p className="text-gold font-medium mb-4">Advocate & Tax Consultant | Founder</p>
              <ul className="space-y-2">
                {[
                  "Expertise in litigation, taxation, and regulatory compliance",
                  "Extensive experience in legal drafting, recovery matters, and business advisory",
                  "Commitment to client-focused and result-driven solutions",
                  "Handled 500+ cases across civil, criminal, and commercial matters",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground/70">
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.section>

    {/* Mission & Vision */}
    <section className="py-16">
      <div className="container max-w-4xl">
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp} className="bg-card border rounded-xl p-8">
            <div className="w-12 h-12 rounded-lg bg-gold-light flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display font-semibold text-primary text-xl mb-3">Our Mission</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              To provide accessible, reliable, and result-oriented legal and financial services that empower
              businesses and individuals to operate with confidence and compliance.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-card border rounded-xl p-8">
            <div className="w-12 h-12 rounded-lg bg-gold-light flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-display font-semibold text-primary text-xl mb-3">Our Vision</h3>
            <p className="text-sm text-foreground/70 leading-relaxed">
              To become India's most trusted one-stop consultancy for legal, taxation, and business compliance
              services.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>

    {/* Why Choose Us */}
    <section className="py-16 bg-surface">
      <div className="container">
        <motion.h2
          className="text-2xl md:text-3xl font-display font-semibold text-primary text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          Why Choose <span className="text-gold">Us</span>
        </motion.h2>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {strengths.map((s) => (
            <motion.div key={s.title} variants={fadeUp} className="bg-card border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-gold-light flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="font-display font-semibold text-primary mb-2 text-sm">{s.title}</h3>
              <p className="text-xs text-foreground/60">{s.desc}</p>
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
      <div className="container text-center">
        <h2 className="text-2xl font-display font-semibold text-primary mb-4">Ready to Work With Us?</h2>
        <p className="text-foreground/70 mb-6">Get expert legal and tax consultation today.</p>
        <div className="flex justify-center gap-4">
          <Button variant="gold" size="lg" asChild>
            <Link to="/contact">Contact Us <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </div>
    </motion.section>
  </div>
);

export default AboutPage;
