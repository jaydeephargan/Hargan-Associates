import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, FileText, TrendingUp, Scale, UserPlus,
  ArrowRight, Briefcase, FileCheck, CreditCard, Shield,
  BookOpen, Stamp, Globe, BadgeCheck, UtensilsCrossed,
  Receipt, Calculator, ClipboardList, Truck, BarChart3,
  Landmark, PiggyBank, HeartPulse, Gavel, FileSearch,
  PenTool, Hash, Fingerprint, IdCard, Users
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

type Service = { icon: any; title: string; desc: string };

const categories: { title: string; icon: any; services: Service[] }[] = [
  {
    title: "Legal Services",
    icon: Scale,
    services: [
      { icon: Gavel, title: "Litigation Cases", desc: "Representation in civil & criminal matters" },
      { icon: FileSearch, title: "Recovery Cases", desc: "Debt recovery & dispute resolution" },
      { icon: PenTool, title: "Legal Drafting", desc: "Contracts, agreements & legal documents" },
      { icon: Hash, title: "NI Act Section 138 Cases", desc: "Cheque bounce & negotiable instrument cases" },
      { icon: Fingerprint, title: "Trademark Registration", desc: "Protect your brand identity" },
      { icon: IdCard, title: "Digital Signature Services", desc: "Class 2 & Class 3 DSC certificates" },
    ],
  },
  {
    title: "Business & Registration Services",
    icon: Building2,
    services: [
      { icon: Briefcase, title: "Incorporation Services", desc: "Company, LLP, Partnership & Proprietorship registration" },
      { icon: BadgeCheck, title: "Startup India Registration", desc: "Get recognized under the Startup India initiative" },
      { icon: Stamp, title: "MSME Registration", desc: "Udyam registration for micro, small & medium enterprises" },
      { icon: Globe, title: "Import & Export Code (IEC)", desc: "Mandatory code for import/export businesses" },
      { icon: Shield, title: "ISO Registration", desc: "International quality management certification" },
      { icon: UtensilsCrossed, title: "FSSAI Food License", desc: "Food safety license for food businesses" },
    ],
  },
  {
    title: "Taxation & Compliance",
    icon: FileText,
    services: [
      { icon: Receipt, title: "GST Registration", desc: "Register for Goods & Services Tax" },
      { icon: FileCheck, title: "GST Returns & Filing", desc: "Monthly, quarterly & annual GST return filing" },
      { icon: Calculator, title: "Income Tax Returns (ITR)", desc: "ITR filing & strategic tax planning" },
      { icon: ClipboardList, title: "TDS/TCS Registration & Returns", desc: "Complete TDS/TCS compliance management" },
      { icon: CreditCard, title: "Professional Tax", desc: "Registration & return filing for professional tax" },
      { icon: BookOpen, title: "ROC Returns & MCA Compliance", desc: "Annual filings & regulatory compliance" },
      { icon: Truck, title: "E-Way Bill & E-Invoicing", desc: "Generate e-way bills & e-invoices seamlessly" },
    ],
  },
  {
    title: "Financial & Advisory",
    icon: TrendingUp,
    services: [
      { icon: Landmark, title: "Business Loans", desc: "Assistance with secured & unsecured business loans" },
      { icon: PiggyBank, title: "MSME & CGTMSE Loans", desc: "Government-backed loans for MSMEs" },
      { icon: BarChart3, title: "Accounting & Bookkeeping", desc: "Maintain accurate financial records" },
      { icon: TrendingUp, title: "Financial Planning", desc: "Strategic planning for wealth growth" },
      { icon: Shield, title: "Insurance Services", desc: "Life, general & business insurance solutions" },
      { icon: HeartPulse, title: "Mediclaim Insurance", desc: "Health insurance for individuals & families" },
    ],
  },
  {
    title: "Employment & Other Registrations",
    icon: UserPlus,
    services: [
      { icon: IdCard, title: "PAN Card Registration", desc: "Apply for new PAN or corrections" },
      { icon: FileText, title: "TAN Registration", desc: "Tax Deduction Account Number registration" },
      { icon: Users, title: "EPFO & ESIC Registration", desc: "Employee provident fund & insurance setup" },
      { icon: ClipboardList, title: "EPFO & ESIC Returns", desc: "Monthly & annual return filing" },
    ],
  },
];

const ServicesPage = () => (
  <div>
    <section className="bg-navy text-primary-foreground py-16">
      <motion.div
        className="container text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Our <span className="text-gold">Services</span>
        </h1>
        <p className="text-primary-foreground/80 text-sm mb-1">Hargan & Associates – Advocate | TaxFinLegal Solution</p>
        <p className="text-primary-foreground/70 max-w-2xl mx-auto">
          Comprehensive legal, taxation, and business solutions tailored to your needs.
        </p>
      </motion.div>
    </section>

    <div className="container py-12 space-y-16">
      {categories.map((cat, catIdx) => (
        <motion.section
          key={cat.title}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center">
              <cat.icon className="w-5 h-5 text-gold" />
            </div>
            <h2 className="text-xl md:text-2xl font-display font-semibold text-primary">{cat.title}</h2>
          </div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {cat.services.map((s) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                className="bg-card border rounded-lg p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-lg bg-gold-light flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display font-semibold text-primary mb-1.5 text-sm">{s.title}</h3>
                <p className="text-xs text-foreground/60 mb-3">{s.desc}</p>
                <a
                  href="https://wa.me/918460884587"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-gold hover:underline inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Get Help <ArrowRight className="w-3 h-3" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      ))}
    </div>
  </div>
);

export default ServicesPage;
