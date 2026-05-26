import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Calendar } from "lucide-react"; // Added Calendar icon
import arexaLogo from "@/assets/arexa-logo.png";

// SEO: Nav Items with titles derived from your SEO.tsx strategy
const navItems = [
  {
    name: "Home",
    path: "/",
    title: "Arexa | Official Snap AR Partner & Futuristic XR Studio"
  },
  {
    name: "Services",
    path: "/services",
    title: "Custom WebAR, Virtual Try-On & Immersive Ads (Zappar Alternative)"
  },
  {
    name: "Work",
    path: "/work",
    title: "AR/VR Portfolio - High-Fidelity AR Campaigns"
  },
  {
    name: "Industries",
    path: "/industries",
    title: "AR Solutions for Retail, Fashion & Enterprise"
  },
  {
    name: "About",
    path: "/about",
    title: "About Arexa - Founder Chhavi Garg & Team"
  },
  {
    name: "Blogs",
    path: "/blogs",
    title: "AR/VR Trends & Marketing Insights"
  },
  {
    name: "Contact",
    path: "/contact",
    title: "Hire Snap AR Developers - Connect with Arexa"
  },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
      <header
          itemScope
          itemType="https://schema.org/WPHeader"
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
              isScrolled
                  ? "bg-background/80 backdrop-blur-md shadow-sm"
                  : "bg-background/80 backdrop-blur-sm lg:bg-background/60"
          }`}
      >
        <div className="section-padding py-3 md:py-4 lg:py-5 flex items-center justify-between">

          {/* Logo - SEO Optimized Alt Text matching your SEO.tsx */}
          <Link
              to="/"
              className="relative z-[60]"
              title="Arexa - High-Fidelity AR/VR Studio"
          >
            <motion.img
                src={arexaLogo}
                alt="Arexa | Snap AR Partner & Futuristic XR Studio"
                className="h-7 md:h-8 lg:h-10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            />
          </Link>

          {/* Desktop: Pill-shaped navigation container */}
          <nav aria-label="Main Desktop Navigation" className="hidden lg:block">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center px-4 py-2.5 rounded-full transition-all duration-500 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md shadow-lg border border-border/30"
                        : "bg-white/80 backdrop-blur-sm shadow-sm border border-border/20"
                }`}
            >
              {navItems.map((item) => (
                  <Link
                      key={item.name}
                      to={item.path}
                      // SEO TITLE ATTRIBUTE APPLIED HERE
                      title={item.title}
                      className="relative px-4 py-2 text-sm font-semibold text-foreground/90 hover:text-foreground transition-colors duration-300 group"
                  >
                    {item.name}
                    <span
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-primary transition-all duration-300 ${
                            location.pathname === item.path ? "w-5" : "w-0 group-hover:w-5"
                        }`}
                    />
                  </Link>
              ))}
            </motion.div>
          </nav>

          {/* Desktop: High-Intent CTA Button (Book a Call) */}
          <motion.div
              className="hidden lg:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
            <Link
                to="/contact"
                title="Schedule a Discovery Call with Arexa"
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF6B6B] to-[#5C4EE5] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(92,78,229,0.4)] transition-all duration-300"
            >
              <Calendar size={16} />
              <span>Book a Call</span>
            </Link>
          </motion.div>

          {/* Mobile/Tablet: Menu Toggle Button */}
          <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden relative z-[60] p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-border/30 text-foreground"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open main menu"}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile/Tablet Menu - Full Screen Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
              <>
                {/* Solid background overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-0 left-0 w-screen h-screen bg-background z-[100] lg:hidden"
                    style={{
                      position: 'fixed',
                      top: 0,
                      left: 0,
                      width: '100vw',
                      height: '100vh',
                    }}
                >
                  {/* Menu content sliding from right */}
                  <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute inset-0 bg-background flex flex-col"
                  >
                    {/* Header with logo and close button */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
                      <Link to="/" onClick={() => setIsMobileMenuOpen(false)} title="Arexa Home">
                        <img src={arexaLogo} alt="Arexa AR Agency" className="h-7 md:h-8" />
                      </Link>
                      <button
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="p-2 rounded-lg bg-muted border border-border/30 text-foreground"
                          aria-label="Close menu"
                      >
                        <X size={22} />
                      </button>
                    </div>

                    {/* Navigation items */}
                    <nav aria-label="Mobile Navigation" className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
                      {navItems.map((item, index) => (
                          <motion.div
                              key={item.name}
                              initial={{ opacity: 0, x: 30 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.15 + index * 0.05 }}
                          >
                            <Link
                                to={item.path}
                                title={item.title}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-xl md:text-2xl font-semibold transition-colors duration-300 ${
                                    location.pathname === item.path
                                        ? "gradient-text"
                                        : "text-foreground hover:text-primary"
                                }`}
                            >
                              {item.name}
                            </Link>
                          </motion.div>
                      ))}

                      {/* Mobile High-Intent CTA */}
                      <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-8 w-full max-w-[250px]"
                      >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                          <Link
                              to="/contact"
                              title="Schedule a Discovery Call"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#FF6B6B] to-[#5C4EE5] text-white px-8 py-3.5 rounded-full text-base md:text-lg font-bold shadow-lg hover:shadow-[0_0_20px_rgba(92,78,229,0.4)] transition-all duration-300"
                          >
                            <Calendar size={20} />
                            <span>Book a Call</span>
                          </Link>
                        </motion.div>
                      </motion.div>
                    </nav>
                  </motion.div>
                </motion.div>
              </>
          )}
        </AnimatePresence>
      </header>
  );
};

export default Header;