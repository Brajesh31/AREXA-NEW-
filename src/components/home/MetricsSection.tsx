import { motion, useSpring, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Box, ShieldCheck, Cloud, Building2 } from "lucide-react";

// 5 core metrics remain for desktop
const metrics = [
  { value: 500, suffix: "+", label: "AR/XR Experiences", icon: Box },
  { value: 120, suffix: "+", label: "Brand Campaigns", icon: ShieldCheck },
  { value: 2, suffix: "B+", label: "Impressions Generated", icon: Cloud },
  { value: 45, suffix: "+", label: "AI Workflows", icon: TrendingUp },
  { value: 50, suffix: "+", label: "Enterprise Partners", icon: Building2 },
];

const AnimatedNumber = ({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (isInView) spring.set(value);
  }, [isInView, spring, value]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest));
    });
    return () => unsubscribe();
  }, [spring]);

  return (
      <span className="tabular-nums tracking-tighter">
      {displayValue}{suffix}
    </span>
  );
};

const MetricsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Arexa Technologies",
      "url": "https://arexa.co",
      "description": "Arexa is a high-performance tech studio delivering over 500+ AR experiences, generating 2 Billion+ impressions, and deploying custom AI automation workflows for global brands.",
      "interactionStatistic": [
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/ViewAction",
          "userInteractionCount": 2000000000,
          "name": "Total AR Impressions Generated"
        },
        {
          "@type": "InteractionCounter",
          "interactionType": "https://schema.org/CreateAction",
          "userInteractionCount": 500,
          "name": "AR/XR Experiences Delivered"
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.head.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.innerHTML.includes("interactionStatistic")) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
      <section
          className="py-8 md:py-6 lg:py-8 section-bg-soft bg-background relative flex flex-col justify-center overflow-hidden border-y border-border/20"
          ref={ref}
          aria-label="Company Impact and Results"
      >
        <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #888888 1px, transparent 1px), linear-gradient(to bottom, #888888 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
        />

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(ellipse at center, hsl(var(--primary) / 0.8) 0%, transparent 80%)`,
              }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">

          {/* HEADER */}
          <div className="text-center mb-6 md:mb-8 max-w-3xl mx-auto flex flex-col items-center justify-center gap-3 md:gap-4">
            <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                // Fix applied here: changed base text size to text-2xl/text-3xl for mobile
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-tight"
            >
              Numbers That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">
              Don't Lie.
            </span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed font-medium px-4"
            >
              Immersive realities engineered at scale. Zero friction. Absolute impact.
            </motion.p>
          </div>

          {/* MOBILE FIX: grid-cols-2 forces 2x2 grid on mobile, lg:grid-cols-5 keeps desktop horizontal */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                  <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                      transition={{
                        duration: 0.4,
                        delay: 0.1 + index * 0.1,
                        ease: "easeOut"
                      }}
                      // RESPONSIVE CARD: flex-col on mobile (stacked), md:flex-row on desktop (side-by-side).
                      // Hides the 5th metric on mobile/tablet to ensure a perfect 2x2 grid.
                      className={`group flex-col md:flex-row items-center text-center md:text-left w-full bg-card/40 backdrop-blur-md border border-border/40 rounded-2xl p-4 md:p-5 hover:bg-card hover:border-border transition-all duration-300 relative overflow-hidden ${index === 4 ? 'hidden lg:flex' : 'flex'}`}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#5C4EE5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* RESPONSIVE ICON: mb-3 on mobile, mr-5 on desktop */}
                    <div className="w-10 h-10 md:w-14 md:h-14 shrink-0 rounded-full bg-[#5C4EE5]/10 flex items-center justify-center mb-3 md:mb-0 md:mr-5 group-hover:scale-110 group-hover:bg-[#5C4EE5]/20 transition-all duration-300">
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#5C4EE5]" />
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-start w-full">
                      <div
                          className="text-3xl md:text-5xl lg:text-[3rem] xl:text-[3.25rem] font-black text-[#5C4EE5] leading-none mb-1 md:mb-1.5"
                          aria-label={`${metric.value}${metric.suffix} ${metric.label}`}
                      >
                        <AnimatedNumber value={metric.value} suffix={metric.suffix} isInView={isInView} />
                      </div>

                      <p className="text-[10px] md:text-[11px] font-bold text-muted-foreground uppercase tracking-widest leading-snug">
                        {metric.label}
                      </p>
                    </div>
                  </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  );
};

export default MetricsSection;