import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search, FileText, Download, ExternalLink, BookOpen,
  Scale, Receipt, Calculator, Link2
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

type Resource = {
  title: string;
  type: "PDF" | "Link";
  size?: string;
  url: string;
};

type Section = {
  title: string;
  icon: any;
  resources: Resource[];
};

const sections: Section[] = [
  {
    title: "Laws & Acts",
    icon: Scale,
    resources: [
      { title: "Indian Contract Act, 1872", type: "PDF", size: "2.3 MB", url: "https://wbconsumers.gov.in/writereaddata/ACT%20&%20RULES/Relevant%20Act%20&%20Rules/the-indian-contract-act-1872.pdf" },
      { title: "Companies Act, 2013", type: "Link", url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/companies-act-2013.html" },
      { title: "Negotiable Instruments Act, 1881", type: "Link", url: "https://www.indiacode.nic.in/handle/123456789/2263" },
      { title: "Indian Partnership Act, 1932", type: "Link", url: "https://www.indiacode.nic.in/handle/123456789/2361" },
      { title: "Limited Liability Partnership Act, 2008", type: "Link", url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/llp-act.html" },
    ],
  },
  {
    title: "Rules & Regulations",
    icon: BookOpen,
    resources: [
      { title: "Companies (Incorporation) Rules, 2014", type: "Link", url: "https://www.mca.gov.in/content/mca/global/en/acts-rules/companies-act/companies-rules.html" },
      { title: "FEMA Rules & Regulations", type: "Link", url: "https://www.rbi.org.in/Scripts/Fema.aspx" },
      { title: "SEBI Regulations", type: "Link", url: "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=2&smid=0" },
    ],
  },
  {
    title: "Legal Formats & Drafts",
    icon: FileText,
    resources: [
      { title: "Power of Attorney Format", type: "Link", url: "https://www.indiafilings.com/learn/power-of-attorney-format/" },
      { title: "Partnership Deed Template", type: "Link", url: "https://www.indiafilings.com/learn/partnership-deed-format/" },
      { title: "Rent Agreement Draft", type: "Link", url: "https://www.indiafilings.com/learn/rental-agreement-format/" },
      { title: "Legal Notice Format", type: "Link", url: "https://www.indiafilings.com/learn/legal-notice-format/" },
      { title: "Affidavit Template", type: "Link", url: "https://www.indiafilings.com/learn/affidavit-format/" },
      { title: "Sale Deed Draft", type: "Link", url: "https://www.indiafilings.com/learn/sale-deed-format/" },
      { title: "Gift Deed Template", type: "Link", url: "https://www.indiafilings.com/learn/gift-deed-format/" },
      { title: "Will / Testament Format", type: "Link", url: "https://www.indiafilings.com/learn/will-format/" },
      { title: "Non-Disclosure Agreement (NDA)", type: "Link", url: "https://www.indiafilings.com/learn/non-disclosure-agreement/" },
      { title: "Service Agreement Template", type: "Link", url: "https://www.indiafilings.com/learn/service-agreement-format/" },
      { title: "Employment Agreement Draft", type: "Link", url: "https://www.indiafilings.com/learn/employment-agreement-format/" },
      { title: "Memorandum of Understanding (MoU)", type: "Link", url: "https://www.indiafilings.com/learn/memorandum-of-understanding/" },
      { title: "Loan Agreement Format", type: "Link", url: "https://www.indiafilings.com/learn/loan-agreement-format/" },
      { title: "Leave & License Agreement", type: "Link", url: "https://www.indiafilings.com/learn/leave-and-license-agreement/" },
      { title: "Indemnity Bond Template", type: "Link", url: "https://www.indiafilings.com/learn/indemnity-bond-format/" },
    ],
  },
  {
    title: "GST Resources",
    icon: Receipt,
    resources: [
      { title: "GST Rate Schedule (Goods)", type: "Link", url: "https://cbic-gst.gov.in/gst-goods-services-rates.html" },
      { title: "GST Rate Schedule (Services)", type: "Link", url: "https://cbic-gst.gov.in/gst-goods-services-rates.html" },
      { title: "GST Portal", type: "Link", url: "https://www.gst.gov.in" },
      { title: "GST Suvidha Provider List", type: "Link", url: "https://www.gst.gov.in/download/gststatistics" },
    ],
  },
  {
    title: "Income Tax Resources",
    icon: Calculator,
    resources: [
      { title: "Income Tax Slabs FY 2025-26", type: "Link", url: "https://www.incometax.gov.in/iec/foportal/help/individual/return-applicable-1" },
      { title: "TDS Rate Chart", type: "Link", url: "https://www.incometax.gov.in/iec/foportal/help/how-to-deduct-tds" },
      { title: "Income Tax e-Filing Portal", type: "Link", url: "https://www.incometax.gov.in" },
    ],
  },
  {
    title: "Useful Government Links",
    icon: Link2,
    resources: [
      { title: "Ministry of Corporate Affairs (MCA)", type: "Link", url: "https://www.mca.gov.in" },
      { title: "EPFO Portal", type: "Link", url: "https://www.epfindia.gov.in" },
      { title: "ESIC Portal", type: "Link", url: "https://www.esic.gov.in" },
      { title: "Startup India Portal", type: "Link", url: "https://www.startupindia.gov.in" },
      { title: "MSME Udyam Registration", type: "Link", url: "https://udyamregistration.gov.in" },
      { title: "India Code (All Central & State Acts)", type: "Link", url: "https://www.indiacode.nic.in" },
      { title: "RBI – Reserve Bank of India", type: "Link", url: "https://www.rbi.org.in" },
      { title: "CBDT – Central Board of Direct Taxes", type: "Link", url: "https://www.incometaxindia.gov.in" },
    ],
  },
];

const glossary = [
  { term: "GST", def: "Goods and Services Tax – India's unified indirect tax" },
  { term: "ITR", def: "Income Tax Return – Annual tax filing to the government" },
  { term: "TDS", def: "Tax Deducted at Source – Tax withheld at the point of income" },
  { term: "ROC", def: "Registrar of Companies – Authority for company registration" },
  { term: "LLP", def: "Limited Liability Partnership – A hybrid business entity" },
  { term: "MSME", def: "Micro, Small & Medium Enterprises" },
  { term: "NI Act", def: "Negotiable Instruments Act – Governs cheques, promissory notes" },
  { term: "FEMA", def: "Foreign Exchange Management Act – Governs forex transactions" },
];

const KnowledgeBankPage = () => {
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const filteredSections = sections
    .map((s) => ({
      ...s,
      resources: s.resources.filter((r) =>
        r.title.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((s) => s.resources.length > 0);

  const displayed = activeSection
    ? filteredSections.filter((s) => s.title === activeSection)
    : filteredSections;

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
            Knowledge <span className="text-gold">Bank</span>
          </h1>
          <p className="text-primary-foreground/80 text-sm mb-1">Hargan Associates – Advocate | TaxFinLegal Solution</p>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Access legal documents, tax resources, government links, and downloadable formats.
          </p>
        </motion.div>
      </section>

      <div className="container py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            className="lg:w-64 shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="sticky top-20 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-card text-sm outline-none focus:ring-1 focus:ring-accent"
                />
              </div>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveSection(null)}
                  className={`text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !activeSection ? "text-gold bg-gold-light" : "text-foreground hover:bg-muted"
                  }`}
                >
                  All Categories
                </button>
                {sections.map((s) => (
                  <button
                    key={s.title}
                    onClick={() => setActiveSection(s.title)}
                    className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      activeSection === s.title ? "text-gold bg-gold-light" : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </motion.aside>

          <div className="flex-1 space-y-10">
            {displayed.map((section) => (
              <motion.div
                key={section.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={fadeUp}
              >
                <div className="flex items-center gap-2 mb-4">
                  <section.icon className="w-5 h-5 text-gold" />
                  <h2 className="font-display font-semibold text-primary text-lg">{section.title}</h2>
                </div>
                <motion.div
                  className="space-y-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={staggerContainer}
                >
                  {section.resources.map((r) => (
                    <motion.a
                      key={r.title}
                      variants={fadeUp}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between bg-card border rounded-lg px-4 py-3 hover:shadow-sm hover:border-accent/30 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-primary group-hover:text-gold transition-colors">{r.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {r.size && <span>{r.size}</span>}
                        {r.type === "PDF" ? (
                          <Download className="w-4 h-4 text-gold" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gold" />
                        )}
                      </div>
                    </motion.a>
                  ))}
                </motion.div>
              </motion.div>
            ))}

            {displayed.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No resources found.</p>
              </div>
            )}

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <h2 className="font-display font-semibold text-primary text-lg mb-4">Quick Legal Terminology</h2>
              <motion.div
                className="grid sm:grid-cols-2 gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {glossary.map((g) => (
                  <motion.div key={g.term} variants={fadeUp} className="bg-card border rounded-lg px-4 py-3">
                    <span className="font-display font-semibold text-gold text-sm">{g.term}</span>
                    <p className="text-xs text-foreground/60 mt-0.5">{g.def}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBankPage;
