import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ArrowRight, ShieldCheck, TrendingUp, Users, Globe, Box, MapPin } from "lucide-react";

const WhyArexa = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // --- SEO: Inject Business Values Schema ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Why Choose Arexa Technologies",
      "description": "Key competitive advantages and business values of Arexa XR & AI Studio.",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Built on Trust",
          "description": "We follow the highest standards of security, privacy, and transparency to protect your brand and your data."
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Results That Matter",
          "description": "From engagement to conversions, our solutions are designed to deliver measurable business impact."
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.head.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.innerHTML.includes("Why Choose Arexa")) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
      <section
          // CHANGED: Reduced pb-20 to pb-10, and lg:pb-32 to lg:pb-16
          className="pt-10 pb-10 lg:pt-16 lg:pb-16 bg-[#0A0D14] text-white relative overflow-hidden"
          ref={ref}
          aria-label="Why Choose Arexa"
      >
        {/* Subtle Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5C4EE5]/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B6B]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-[96%] max-w-[1400px] mx-auto relative z-10">

          {/* Main Top Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.5fr_1fr] gap-10 lg:gap-0 items-start mb-8 lg:mb-0">

            {/* --- LEFT COLUMN (Z-20: Layered On Top) --- */}
            <div className="flex flex-col relative z-20 pr-4 lg:pr-8">
              <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9F55FF] mb-6"
              >
                WHY AREXA
              </motion.span>

              <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-5xl lg:text-[3.5rem] font-medium mb-8 leading-[1.15] tracking-tight text-white/90"
              >
                We turn imagination <br className="hidden lg:block"/>
                into immersive <br className="hidden lg:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#E13684]">impact.</span>
              </motion.h2>

              <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={isInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-px w-12 bg-gradient-to-r from-[#E13684] to-transparent mb-8 origin-left"
              />

              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-[15px] lg:text-[17px] text-[#8F9BB3] leading-[1.7] mb-12 max-w-[95%]"
              >
                We partner with ambitious brands to <br className="hidden lg:block"/>
                create AR, VR, and AI-powered experiences <br className="hidden lg:block"/>
                that engage people, build loyalty, and <br className="hidden lg:block"/>
                drive measurable business results.
              </motion.p>

              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Glass Effect Button */}
                <a
                    href="https://calendly.com/chhavigarg/arexa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between gap-8 bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-2xl text-sm font-semibold transition-all shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] group w-max"
                >
                  <span>Let's Build What's Next</span>
                  <ArrowRight size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </a>
              </motion.div>
            </div>

            {/* --- CENTER COLUMN (Z-0: Layered Behind) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="relative flex justify-center items-start h-[350px] md:h-[450px] lg:h-[500px] xl:h-[550px] w-full z-0 pointer-events-none"
            >
              <img
                  src="/card11.png"
                  alt="Arexa Immersive Impact"
                  className="w-full h-full object-contain object-top drop-shadow-[0_0_60px_rgba(92,78,229,0.15)] scale-[1.25] lg:scale-[1.6] xl:scale-[1.8] origin-top"
              />
            </motion.div>

            {/* --- RIGHT COLUMN (Z-20: Layered On Top) --- */}
            <div className="flex flex-col gap-6 relative z-20 mt-8 lg:mt-0 lg:ml-12 xl:ml-20">

              {/* Feature 1 */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-[#121624]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-[#121624] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#8F9BB3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white/90 mb-4">Built on Trust</h3>
                <div className="h-px w-6 bg-gradient-to-r from-[#E13684] to-transparent mb-5" />
                <p className="text-[14px] leading-[1.8] text-[#8F9BB3]">
                  We follow the highest standards of security, privacy, and transparency to protect your brand and your data.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-[#121624]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:bg-[#121624] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6 text-[#8F9BB3]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-white/90 mb-4">Results That Matter</h3>
                <div className="h-px w-6 bg-gradient-to-r from-[#9F55FF] to-transparent mb-5" />
                <p className="text-[14px] leading-[1.8] text-[#8F9BB3]">
                  From engagement to conversions, our solutions are designed to deliver measurable business impact.
                </p>
              </motion.div>

            </div>
          </div>

          {/* --- BOTTOM METRICS STRIP --- */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="w-full bg-[#121624]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 lg:p-10 flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center gap-8 relative overflow-hidden z-30 mt-4 lg:mt-8 xl:mt-12"
          >
            {/* Soft bottom glow inside strip */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#9F55FF]/10 to-transparent pointer-events-none" />

            <div className="flex items-center gap-5 z-10">
              <Users className="w-8 h-8 text-[#9F55FF]" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-medium text-white/90 leading-none mb-1.5">500+</div>
                <div className="text-xs text-[#8F9BB3]">Global Brands</div>
              </div>
            </div>

            <div className="flex items-center gap-5 z-10">
              <Globe className="w-8 h-8 text-[#E13684]" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-medium text-white/90 leading-none mb-1.5">2B+</div>
                <div className="text-xs text-[#8F9BB3]">Experiences Delivered<br/>Worldwide</div>
              </div>
            </div>

            <div className="flex items-center gap-5 z-10">
              <Box className="w-8 h-8 text-[#9F55FF]" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-medium text-white/90 leading-none mb-1.5">120+</div>
                <div className="text-xs text-[#8F9BB3]">XR Projects Completed<br/>Across Industries</div>
              </div>
            </div>

            <div className="flex items-center gap-5 z-10">
              <MapPin className="w-8 h-8 text-[#FF6B6B]" strokeWidth={1.5} />
              <div>
                <div className="text-2xl font-medium text-white/90 leading-none mb-1.5">45+</div>
                <div className="text-xs text-[#8F9BB3]">Countries Served<br/>Globally</div>
              </div>
            </div>

          </motion.div>

        </div>
      </section>
  );
};

export default WhyArexa;