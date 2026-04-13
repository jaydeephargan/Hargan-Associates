import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/knowledge-bank", label: "Knowledge Bank" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Top bar */}
      <div className="bg-navy text-primary-foreground text-sm hidden md:block">
        <div className="container flex justify-between items-center py-2">
          <span className="font-display font-semibold tracking-wide">
            Hargan Associates – Advocate | TaxFinLegal Solution | <span className="text-gold italic">Your Trust is Our Wealth</span>
          </span>
          <div className="flex items-center gap-6">
            <a href="mailto:advjbhoffice@gmail.com" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Mail className="w-3.5 h-3.5" /> advjbhoffice@gmail.com
            </a>
            <a href="tel:8460884587" className="flex items-center gap-1.5 hover:text-gold transition-colors">
              <Phone className="w-3.5 h-3.5" /> 8460884587
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Hargan Associates Logo" className="w-10 h-10 object-contain rounded-full p-1" style={{ backgroundColor: 'hsl(42, 50%, 92%)' }} />
            <div className="hidden sm:block leading-tight">
              <span className="font-display font-semibold text-primary text-lg block">Hargan Associates</span>
              <span className="text-[10px] text-muted-foreground tracking-wide block">Advocate | TaxFinLegal Solution</span>
              <span className="text-[9px] text-gold italic tracking-wide">Your Trust is Our Wealth</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-gold bg-gold-light"
                    : "text-foreground hover:text-gold hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="gold" size="sm" asChild className="hidden sm:inline-flex">
              <a href="https://wa.me/918460884587" target="_blank" rel="noopener noreferrer">
                Get Consultation
              </a>
            </Button>
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t bg-card animate-fade-in">
            <nav className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? "text-gold bg-gold-light"
                      : "text-foreground hover:text-gold hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="gold" className="mt-2" asChild>
                <a href="https://wa.me/918460884587" target="_blank" rel="noopener noreferrer">
                  Get Consultation
                </a>
              </Button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
