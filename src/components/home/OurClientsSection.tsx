import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";

// Generate an array of 42 client image filenames (client1.png to client42.png)
// Matches user request: client1.png, client2.png ... client42.png
const CLIENT_FILES = Array.from({ length: 42 }, (_, i) => `client${i + 1}.png`);

// Grid configuration per screen size
// Desktop: 7 cols * 6 rows = 42 cells (Perfect match for 42 clients)
const GRID_CONFIG = {
  desktop: { columns: 6, rows: 7 },
  tablet: { columns: 5, rows: 6 }, // 30 cells
  mobile: { columns: 3, rows: 8 },  // 24 cells
};

// Get logo for each index
const getLogoForIndex = (index: number) => {
  // Use modulo to cycle through images if the grid is larger than the number of clients
  const fileName = CLIENT_FILES[index % CLIENT_FILES.length];
  return `/clients/${fileName}`;
};

const OurClientsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  // --- SEO: Inject Client Portfolio Schema ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Arexa Technologies Client Portfolio",
      "description": "A comprehensive list of global brands and enterprises that trust Arexa for High-Fidelity AR and VR campaigns.",
      "numberOfItems": 42,
      "itemListElement": Array.from({ length: 42 }, (_, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": `Arexa Trusted Client ${i + 1}`
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
          className="py-16 lg:py-24 section-bg-soft overflow-hidden"
          ref={ref}
          aria-label="Our Trusted Clients"
      >
        <div className="section-padding">
          <div className="text-center mb-12 lg:mb-16">
            <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3"
            >
              Trusted By
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              Our <span className="gradient-text">Clients</span>
            </motion.h2>
          </div>

          {/* Honeycomb Grid - Desktop (7 columns x 6 rows = 42 items) */}
          <div className="hidden lg:flex flex-col items-center max-w-6xl mx-auto">
            {Array.from({ length: GRID_CONFIG.desktop.rows }, (_, rowIndex) => {
              const isOffsetRow = rowIndex % 2 === 1;
              return (
                  <motion.div
                      key={`desktop-${rowIndex}`}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + rowIndex * 0.08 }}
                      className="flex justify-center"
                      style={{
                        marginTop: rowIndex === 0 ? 0 : '10px',
                        marginLeft: isOffsetRow ? '150px' : '0', // Adjust offset for honeycomb effect
                      }}
                  >
                    {Array.from({ length: GRID_CONFIG.desktop.columns }, (_, colIndex) => {
                      const currentIndex = rowIndex * GRID_CONFIG.desktop.columns + colIndex;
                      const logo = getLogoForIndex(currentIndex);

                      return (
                          <motion.div
                              key={`desktop-${rowIndex}-${colIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.15 + currentIndex * 0.02,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="group mx-[8px]"
                          >
                            <div
                                className="w-[130px] h-[115px] flex items-center justify-center bg-white shadow-sm hover:shadow-lg border border-border/20 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                                style={{
                                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                }}
                            >
                              <img
                                  src={logo}
                                  // SEO: Keyword-rich Alt Text
                                  alt={`Arexa Trusted Client - Partner Brand ${currentIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  loading="lazy"
                              />
                            </div>
                          </motion.div>
                      );
                    })}
                  </motion.div>
              );
            })}
          </div>

          {/* Honeycomb Grid - Tablet (5 columns) */}
          <div className="hidden md:flex lg:hidden flex-col items-center max-w-3xl mx-auto">
            {Array.from({ length: GRID_CONFIG.tablet.rows }, (_, rowIndex) => {
              const isOffsetRow = rowIndex % 2 === 1;
              return (
                  <motion.div
                      key={`tablet-${rowIndex}`}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + rowIndex * 0.08 }}
                      className="flex justify-center"
                      style={{
                        marginTop: rowIndex === 0 ? 0 : '15px',
                        marginLeft: isOffsetRow ? '60px' : '0',
                      }}
                  >
                    {Array.from({ length: GRID_CONFIG.tablet.columns }, (_, colIndex) => {
                      const currentIndex = rowIndex * GRID_CONFIG.tablet.columns + colIndex;
                      const logo = getLogoForIndex(currentIndex);

                      return (
                          <motion.div
                              key={`tablet-${rowIndex}-${colIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.15 + currentIndex * 0.02,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="group mx-[6px]"
                          >
                            <div
                                className="w-[110px] h-[95px] flex items-center justify-center bg-white shadow-sm hover:shadow-lg border border-border/20 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                                style={{
                                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                }}
                            >
                              <img
                                  src={logo}
                                  alt={`Arexa Trusted Client - Partner Brand ${currentIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  loading="lazy"
                              />
                            </div>
                          </motion.div>
                      );
                    })}
                  </motion.div>
              );
            })}
          </div>

          {/* Honeycomb Grid - Mobile (3 columns) */}
          <div className="flex md:hidden flex-col items-center max-w-sm mx-auto">
            {Array.from({ length: GRID_CONFIG.mobile.rows }, (_, rowIndex) => {
              const isOffsetRow = rowIndex % 2 === 1;
              return (
                  <motion.div
                      key={`mobile-${rowIndex}`}
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 + rowIndex * 0.08 }}
                      className="flex justify-center"
                      style={{
                        marginTop: rowIndex === 0 ? 0 : '2px',
                        marginLeft: isOffsetRow ? '80px' : '0',
                      }}
                  >
                    {Array.from({ length: GRID_CONFIG.mobile.columns }, (_, colIndex) => {
                      const currentIndex = rowIndex * GRID_CONFIG.mobile.columns + colIndex;
                      const logo = getLogoForIndex(currentIndex);

                      return (
                          <motion.div
                              key={`mobile-${rowIndex}-${colIndex}`}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                              transition={{
                                duration: 0.5,
                                delay: 0.15 + currentIndex * 0.02,
                                ease: [0.25, 0.1, 0.25, 1]
                              }}
                              className="group mx-[4px]"
                          >
                            <div
                                className="w-[90px] h-[80px] flex items-center justify-center bg-white shadow-sm hover:shadow-lg border border-border/20 hover:border-primary/30 transition-all duration-300 overflow-hidden"
                                style={{
                                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                                }}
                            >
                              <img
                                  src={logo}
                                  alt={`Arexa Trusted Client - Partner Brand ${currentIndex + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                  loading="lazy"
                              />
                            </div>
                          </motion.div>
                      );
                    })}
                  </motion.div>
              );
            })}
          </div>
        </div>
      </section>
  );
};

export default OurClientsSection;