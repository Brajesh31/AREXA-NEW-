import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { ShoppingBag, HeartPulse, GraduationCap, Gamepad2, Building2, Plane } from "lucide-react";

const industries = [
  { icon: ShoppingBag, name: "Retail & E-commerce", color: "bg-primary/10 text-primary" },
  { icon: HeartPulse, name: "Healthcare", color: "bg-secondary/10 text-secondary" },
  { icon: GraduationCap, name: "Education", color: "bg-primary/10 text-primary" },
  { icon: Gamepad2, name: "Entertainment", color: "bg-secondary/10 text-secondary" },
  { icon: Building2, name: "Real Estate", color: "bg-primary/10 text-primary" },
  { icon: Plane, name: "Travel & Tourism", color: "bg-secondary/10 text-secondary" },
];

const IndustriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  // --- SEO: Inject Industry Service Schema ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Industries Served by Arexa AR/VR Studio",
      "description": "Arexa Technologies provides specialized Augmented Reality and Virtual Reality solutions for these key sectors.",
      "numberOfItems": industries.length,
      "itemListElement": industries.map((ind, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": `AR/VR Solutions for ${ind.name}`,
          "serviceType": "Augmented Reality Development",
          "provider": {
            "@type": "Organization",
            "name": "Arexa Technologies"
          }
        }
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
      <section
          className="py-10 lg:py-14 section-bg-muted"
          ref={ref}
          aria-label="Industries We Serve"
      >
        <div className="section-padding">
          <div className="text-center mb-8">
            {/* Slide from right */}
            <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3"
            >
              Industries We Serve
            </motion.span>
            {/* Scale up */}
            <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              Transforming <span className="gradient-text">Every Sector</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5 max-w-4xl mx-auto">
            {industries.map((industry, index) => {
              // Alternating animation directions
              const getInitial = () => {
                const col = index % 3;
                if (col === 0) return { x: -40, y: 0 }; // left
                if (col === 2) return { x: 40, y: 0 }; // right
                return { x: 0, y: 25 }; // center - fade up
              };

              const initial = getInitial();

              return (
                  <motion.div
                      key={industry.name}
                      initial={{ opacity: 0, scale: 0.9, ...initial }}
                      animate={isInView ? { opacity: 1, scale: 1, x: 0, y: 0 } : { opacity: 0, scale: 0.9, ...initial }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2 + index * 0.1,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                  >
                    {/* CHANGED: React Router <Link> replaced with standard <a> tag for external URL. Target blank added. */}
                    <a
                        href="https://calendly.com/chhavigarg/arexa"
                        target="_blank"
                        rel="noopener noreferrer"
                        // SEO: Descriptive title for accessibility and link context
                        title={`Explore AR & VR Solutions for ${industry.name}`}
                        className="group block p-5 lg:p-6 rounded-xl border border-border/50 bg-white/70 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover-lift text-center"
                    >
                      {/* Icon - Scale up */}
                      <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.3 + index * 0.1,
                            ease: [0.25, 0.1, 0.25, 1]
                          }}
                          className={`w-12 h-12 rounded-xl ${industry.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <industry.icon className="w-5 h-5" />
                      </motion.div>
                      {/* Name - Fade with movement */}
                      <motion.h3
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                          transition={{ duration: 0.4, delay: 0.35 + index * 0.1 }}
                          className="font-semibold text-sm"
                      >
                        {industry.name}
                      </motion.h3>
                    </a>
                  </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  );
};

export default IndustriesSection;