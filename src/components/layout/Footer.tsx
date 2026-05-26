import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Linkedin,
  Instagram,
  MapPin,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Globe,
  ChevronRight,
  Youtube,
  Sparkles,
  Calendar,
  Zap
} from "lucide-react";
import arexaLogo from "@/assets/arexa-logo.png";

const XIcon = ({ size = 18, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z" />
    </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", url: "https://www.linkedin.com/company/arexa-xr" },
    { icon: XIcon, label: "X (Twitter)", url: "https://x.com/Arexaxr" },
    { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/arexa.xr" },
    { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/@arexaxr" },
  ];

  const AccordionSection = ({ title, id, children }) => {
    const isOpen = openSection === id;

    return (
        <div className="border-b border-white/10 md:border-none">
          <button
              onClick={() => toggleSection(id)}
              className="flex items-center justify-between w-full py-4 md:py-0 md:mb-5 md:cursor-default group"
          >
            <h4 className="flex items-center text-[12px] font-bold uppercase tracking-[0.15em] text-white">
              <span className="text-[#9F55FF] mr-2 text-lg leading-none transition-transform group-hover:scale-110">•</span>
              {title}
            </h4>
            <ChevronRight
                size={16}
                className={`md:hidden text-[#8F9BB3] transition-transform duration-300 ${isOpen ? "rotate-90 text-white" : ""}`}
            />
          </button>

          <div
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out md:grid-rows-[1fr] md:opacity-100 ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
          >
            <div className="overflow-hidden">
              <div className="pb-5 md:pb-0">
                {children}
              </div>
            </div>
          </div>
        </div>
    );
  };

  return (
      <footer className="bg-[#0A0D14] text-white border-t border-white/5 overflow-hidden font-sans">

        {/* --- 1. THE GRAND FINALE PRE-FOOTER CTA (FULL WIDTH) --- */}
        {/* Adjusted py-10 md:py-16 to reduce bottom spacing specifically */}
        <div className="relative w-full border-b border-white/10 pt-10 pb-2 md:pt-16 md:pb-4 mb-10 md:mb-12 overflow-hidden">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#FF6B6B]/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[350px] h-[350px] bg-[#5C4EE5]/10 blur-[150px] rounded-full pointer-events-none" />

          {/* Inner Content Constrained Wrapper */}
          <div className="w-[96%] max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-6 relative">

            {/* LEFT: Text & Main CTA Button (High Axis Layer) */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left flex-1 max-w-[500px] relative z-30 pt-1">
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 w-fit"
              >
                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-white/80">
                  LET'S CREATE IMPACT TOGETHER
                </span>
                <Sparkles className="text-[#9F55FF] w-3.5 h-3.5" />
              </motion.div>

              <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-white mb-4 leading-[1.1] tracking-tight"
              >
                Let's build <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#E13684] to-[#5C4EE5]">
                  something extraordinary.
                </span>
              </motion.h2>

              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[14px] lg:text-[16px] text-[#8F9BB3] leading-[1.6] mb-8 max-w-[400px]"
              >
                Book a strategy session with our XR & AI experts and turn your vision into immersive real-world impact.
              </motion.p>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
              >
                <a
                    href="https://calendly.com/chhavigarg/arexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center gap-3 bg-gradient-to-r from-[#FF6B6B] via-[#E13684] to-[#5C4EE5] rounded-full p-1.5 pr-1.5 hover:scale-[1.02] transition-transform duration-300 shadow-xl w-fit"
                >
                  <div className="flex items-center gap-2 pl-4 pr-3">
                    <Calendar size={18} className="text-white/90" />
                    <span className="font-semibold text-white text-[14px] lg:text-[15px] tracking-wide">
                      Book Strategy Session
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-[#5C4EE5] transition-colors duration-300">
                    <ArrowUpRight strokeWidth={2.5} size={18} />
                  </div>
                </a>
              </motion.div>
            </div>

            {/* CENTER: 3D Visual Graphic PlaceHolder (Height target reduced slightly) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10 w-full max-w-[525px] lg:max-w-[739px] hidden lg:block flex-shrink-0 lg:-left-24 xl:-left-36"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#9F55FF]/25 blur-[70px] rounded-full pointer-events-none -z-10" />
              <img
                  src="/card12.png"
                  alt="Immersive Graphic"
                  className="w-full h-[280px] lg:h-[400px] object-contain drop-shadow-[0_0_35px_rgba(159,85,255,0.25)] pointer-events-none"
              />
            </motion.div>

            {/* RIGHT: High-Fidelity Individual Glass Cards */}
            <div className="flex flex-col gap-4 flex-1 max-w-[390px] w-full mt-6 lg:mt-0 relative z-30 lg:-ml-28 lg:mr-0">
              {[
                { icon: Clock, title: "Usually replies", subtitle: "within 24 hours" },
                { icon: ShieldCheck, title: "NDA-friendly", subtitle: "collaboration" },
                { icon: Globe, title: "Trusted by", subtitle: "global brands" },
                { icon: Zap, title: "XR Blueprint", subtitle: "included session blueprint" }
              ].map((item, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.15 + idx * 0.08 }}
                      className="flex items-center gap-4 bg-white/[0.02] border border-white/10 rounded-none p-4 backdrop-blur-md hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.2)] w-full"
                  >
                    {/* Icon container box with custom gradients */}
                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center bg-white/[0.03] shrink-0 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#5C4EE5]/20 to-[#E13684]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <item.icon size={20} className="text-transparent bg-clip-text bg-gradient-to-tr from-[#9F55FF] via-[#E13684] to-[#FF6B6B] stroke-[1.75]" style={{ stroke: 'url(#footer-card-gradient)' }} />

                      <svg width="0" height="0" className="absolute">
                        <linearGradient id="footer-card-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#5C4EE5" />
                          <stop offset="50%" stopColor="#E13684" />
                          <stop offset="100%" stopColor="#FF6B6B" />
                        </linearGradient>
                      </svg>
                    </div>

                    {/* Content restricted to exactly 2 text lines via line clamps */}
                    <div className="text-left flex flex-col gap-0.5 min-w-0">
                      <div className="text-[15px] text-white font-semibold tracking-wide leading-tight truncate">{item.title}</div>
                      <div className="text-[13px] text-[#8F9BB3] font-normal leading-snug truncate">{item.subtitle}</div>
                    </div>
                  </motion.div>
              ))}
            </div>

          </div>
        </div>

        {/* --- 2. MAIN FOOTER LINKS GRID --- */}
        <div className="w-[96%] max-w-[1400px] mx-auto px-2 md:px-6 pt-4 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] gap-0 md:gap-8 pb-8 md:pb-4 border-t border-white/10 md:border-none pt-4 md:pt-0">

            {/* COLUMN 1: Brand & Socials */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left pr-0 lg:pr-6 pb-8 md:pb-0 border-b border-white/10 md:border-none">
              <Link to="/" className="inline-block mb-4 relative" title="Arexa AR/VR Studio Home">
                <img
                    src={arexaLogo}
                    alt="Arexa Technologies"
                    className="h-8 md:h-9 w-auto brightness-0 invert"
                />
                <Sparkles className="absolute -top-2 -right-4 text-[#9F55FF] w-4 h-4 opacity-80" />
              </Link>

              <p className="text-[#8F9BB3] text-[13px] md:text-[14px] leading-[1.7] mb-6 max-w-[260px]">
                Immersive XR & AI experiences that help global brands engage, inspire and lead.
              </p>

              <div className="hidden md:block w-10 h-px bg-gradient-to-r from-[#E13684] to-[#5C4EE5] mb-6" />

              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, label, url }) => (
                    <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
                        aria-label={`Follow Arexa on ${label}`}
                    >
                      <Icon size={15} />
                    </a>
                ))}
              </div>
            </div>

            {/* COLUMN 2: Company */}
            <AccordionSection title="Company" id="company">
              <ul className="flex flex-col gap-3 md:gap-4">
                {["About Us", "Services", "Portfolio"].map((item) => (
                    <li key={item}>
                      <Link
                          to={`/${item.toLowerCase().replace(" ", "-")}`}
                          className="group flex items-center justify-between w-full max-w-[180px] text-[13px] md:text-[14px] text-[#8F9BB3] hover:text-white transition-colors"
                      >
                        {item}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                ))}
              </ul>
            </AccordionSection>

            {/* COLUMN 3: Services */}
            <AccordionSection title="Services" id="services">
              <ul className="flex flex-col gap-3 md:gap-4">
                {[
                  { label: "Snap AR & WebAR", path: "/services" },
                  { label: "Virtual Try-On / VR", path: "/services" },
                  { label: "AI Workflows", path: "/services" },
                  { label: "Ad Strategy", path: "/services" },
                  { label: "Creative Direction", path: "/services" }
                ].map((item) => (
                    <li key={item.label}>
                      <Link
                          to={item.path}
                          className="group flex items-center justify-between w-full max-w-[200px] text-[13px] md:text-[14px] text-[#8F9BB3] hover:text-white transition-colors"
                      >
                        {item.label}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                ))}
              </ul>
            </AccordionSection>

            {/* COLUMN 4: Industries */}
            <AccordionSection title="Industries" id="industries">
              <ul className="flex flex-col gap-3 md:gap-4">
                {[
                  { label: "Retail & Fashion", path: "/industries" },
                  { label: "Healthcare", path: "/industries" },
                  { label: "Education", path: "/industries" },
                  { label: "Entertainment", path: "/industries" },
                  { label: "Real Estate", path: "/industries" }
                ].map((item) => (
                    <li key={item.label}>
                      <Link
                          to={item.path}
                          className="group flex items-center justify-between w-full max-w-[180px] text-[13px] md:text-[14px] text-[#8F9BB3] hover:text-white transition-colors"
                      >
                        {item.label}
                        <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    </li>
                ))}
              </ul>
            </AccordionSection>

            {/* COLUMN 5: Get in Touch */}
            <AccordionSection title="Get in Touch" id="contact">
              <ul className="flex flex-col gap-4 md:gap-5">
                <li>
                  <a href="mailto:connect@arexa.co" className="flex items-center gap-3 text-[#8F9BB3] hover:text-white transition-colors group">
                    <Mail size={16} className="text-[#8F9BB3] group-hover:text-[#9F55FF] transition-colors shrink-0" />
                    <span className="text-[13px] md:text-[14px]">connect@arexa.co</span>
                  </a>
                </li>
                <li>
                  <a href="tel:+919876543210" className="flex items-center gap-3 text-[#8F9BB3] hover:text-white transition-colors group">
                    <Phone size={16} className="text-[#8F9BB3] group-hover:text-[#9F55FF] transition-colors shrink-0" />
                    <span className="text-[13px] md:text-[14px]">+91 98765 43210</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-start gap-3 text-[#8F9BB3]">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span className="text-[13px] md:text-[14px] leading-relaxed">
                    E-7, E Block, Sector 3,<br />
                    Noida, UP 201301
                  </span>
                  </div>
                </li>
              </ul>
            </AccordionSection>
          </div>

          {/* --- 3. BOTTOM BAR --- */}
          <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-[#8F9BB3] text-[12px]">
              © {currentYear} Arexa Technologies Private Limited. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-[12px] text-[#8F9BB3]">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <span className="text-[#9F55FF]">•</span>
              <Link to="/terms-of-service" className="hover:text-white transition-colors">Terms</Link>
              <span className="text-[#9F55FF] hidden md:inline">•</span>
              <Link to="/sitemap" className="hover:text-white transition-colors hidden md:inline">Sitemap</Link>
            </div>
          </div>

        </div>
      </footer>
  );
};

export default Footer;