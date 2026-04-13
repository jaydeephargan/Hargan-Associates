import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="bg-navy text-primary-foreground">
    <div className="container py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Hargan Associates Logo" className="w-10 h-10 object-contain rounded-full p-1" style={{ backgroundColor: 'hsl(42, 50%, 92%)' }} />
            <div>
              <span className="font-display font-semibold text-lg block">Hargan Associates</span>
              <span className="text-[10px] text-primary-foreground/70 tracking-wide block">Advocate | TaxFinLegal Consultant</span>
              <span className="text-[9px] text-gold tracking-wide italic">Your Trust is Our Wealth</span>
            </div>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            Your trusted partner in legal, taxation & business compliance. End-to-end solutions for startups, businesses, and individuals.
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-4">Quick Links</h4>
          <nav className="flex flex-col gap-2 text-sm">
            {[
              { to: "/services", label: "Services" },
              { to: "/blog", label: "Blog" },
              { to: "/knowledge-bank", label: "Knowledge Bank" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact Us" },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="text-primary-foreground/70 hover:text-gold transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-4">Services</h4>
          <nav className="flex flex-col gap-2 text-sm text-primary-foreground/70">
            <span>Company Registration</span>
            <span>GST Filing</span>
            <span>Income Tax Returns</span>
            <span>Legal Drafting</span>
            <span>Business Loans</span>
          </nav>
        </div>

        <div>
          <h4 className="font-display font-semibold text-gold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
            <a href="mailto:advjbhoffice@gmail.com" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4 text-gold" /> advjbhoffice@gmail.com
            </a>
            <a href="tel:8460884587" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4 text-gold" /> 8460884587
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold mt-0.5 shrink-0" /> Bhavnagar | Ahmedabad | Rajkot | Baroda | Surat | Mumbai
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} Hargan Associates. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
