import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import AIChatbot from "./AIChatbot";
import CookieConsent from "./CookieConsent";
import VisitorGreeting from "./VisitorGreeting";
import { useVisitorTracker } from "@/hooks/useVisitorTracker";

const Layout = () => {
  useVisitorTracker();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <AIChatbot />
      <CookieConsent />
      <VisitorGreeting />
    </div>
  );
};

export default Layout;
