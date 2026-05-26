import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Box,
  Hexagon,
  Repeat,
  ShieldCheck
} from "lucide-react";

const BrandEssence = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // --- SEO: Schema Injection ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Arexa",
      "url": "https://arexa.co",
      "slogan": "We craft High-Fidelity AR, CGI & Immersive Brand Experiences powered by Intelligent AI Automation.",
      "knowsAbout": [
        "Snap AR Partner", "WebAR Agency", "Virtual Try-On", "CGI Studio",
        "Immersive Ads", "Interactive Campaigns", "AI Automation Workflows",
        "Business Process Optimization", "Custom AI Models"
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Bottom Bar Feature Data
  const features = [
    { icon: Box, title: "AR / XR Excellence", desc: "Real-world experiences that captivate." },
    { icon: Hexagon, title: "CGI Perfection", desc: "Photoreal visuals that leave a lasting impact." },
    { icon: Sparkles, title: "AI Automation", desc: "Smart workflows that save time & scale." },
    { icon: Repeat, title: "End-to-End Partner", desc: "From concept to launch, we've got you covered." },
    { icon: ShieldCheck, title: "Results That Matter", desc: "Data-driven strategies that deliver results." }
  ];

  return (
      <section
          // Mobile keeps pt-12 & pb-10. Desktop (md/lg) is tightly reduced to pt-6/8 and pb-6/8.
          className="relative overflow-hidden bg-[#F8F9FE] pt-12 md:pt-8 lg:pt-6 pb-10 md:pb-8 lg:pb-6"
          aria-label="Brand Philosophy and Expertise"
          ref={ref}
      >
        {/* Soft Background Elements (Dots & Glows) */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-8 flex flex-col">

          {/* --- MAIN HERO SPLIT CONTENT --- */}
          {/* Reduced desktop gap between text and image */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

            {/* LEFT COLUMN: Text Content */}
            <div className="w-full lg:w-[55%] flex flex-col items-start text-left relative z-20">

              {/* Top Badge */}
              <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8C62FF]/30 bg-white shadow-sm mb-6"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5C4EE5]" />
                <span className="text-[10px] sm:text-xs font-bold text-[#5C4EE5] uppercase tracking-widest">
                                Global XR & Intelligent Automation Agency
                            </span>
              </motion.div>

              {/* Main Typography */}
              <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="text-4xl sm:text-5xl md:text-6xl font-black text-[#1A1A24] leading-[1.1] tracking-tight"
              >
                We craft <br className="hidden sm:block" />
                High-Fidelity <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F55FF] via-[#E13684] to-[#FF004D]">AR, CGI &</span>
                <br />
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[#FF004D] via-[#E13684] to-[#9F55FF]">
                                Immersive Brand Experiences
                  <svg className="absolute -bottom-2 md:-bottom-3 left-0 w-full text-[#9F55FF] opacity-80" viewBox="0 0 400 12" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                                    <path d="M2 9.5C100 2 300 2 398 9.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                            </span>
              </motion.h2>

              {/* Sub-text Paragraph */}
              <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="mt-8 text-base md:text-lg text-slate-500 font-medium max-w-xl leading-relaxed"
              >
                Powered by <strong className="text-slate-700">Intelligent AI Automation</strong> — pushing visual boundaries, building immersive campaigns, and streamlining operations for maximum impact.
              </motion.p>

              {/* CTAs */}
              <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  className="mt-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-5 sm:gap-6 w-full sm:w-auto"
              >
                <a
                    href="https://calendly.com/chhavigarg/arexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group/btn flex items-center justify-center gap-3 bg-[#5C4EE5] text-white px-6 py-3.5 md:px-8 md:py-3.5 rounded-xl text-base md:text-lg font-bold shadow-lg hover:shadow-[#5C4EE5]/40 transition-all duration-300 border border-white/10 overflow-hidden w-full sm:w-auto"
                >
                  <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                  <span className="relative z-10 tracking-wide">Claim Free Consultancy</span>
                  <ArrowUpRight className="w-5 h-5 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
                </a>

                <a
                    href="/work"
                    className="group flex items-center justify-center gap-2 text-slate-800 font-bold hover:text-[#9F55FF] transition-colors text-base py-3 px-2 w-full sm:w-auto"
                >
                  See Our Work
                  <div className="bg-[#9F55FF]/10 text-[#9F55FF] w-8 h-8 rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight strokeWidth={2.5} className="w-4 h-4" />
                  </div>
                </a>
              </motion.div>

            </div>

            {/* RIGHT COLUMN: Uploaded Image Placement */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="w-full lg:w-[45%] relative z-10 flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <img
                  src="/essence.webm"
                  alt="Immersive XR Experiences"
                  className="w-full lg:w-[125%] max-w-[780px] h-auto object-contain drop-shadow-2xl lg:-ml-24"
              />
            </motion.div>
          </div>

          {/* --- BOTTOM GLASSMORPHIC FEATURES BAR --- */}
          <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              // Reduced desktop margin-top to pull it closer to the hero section
              className="w-full bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-6 lg:p-8 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] mt-12 lg:mt-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 lg:divide-x divide-slate-200/60">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="flex flex-row items-center lg:items-start lg:flex-col gap-4 lg:px-4 group">

                      <div className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 bg-gradient-to-br from-purple-100 to-pink-50 rounded-full flex items-center justify-center text-[#9F55FF] shadow-inner group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                    </div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </section>
  );
};

export default BrandEssence;