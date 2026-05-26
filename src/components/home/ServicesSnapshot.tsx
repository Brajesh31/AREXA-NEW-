import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles, Layers, Globe, Glasses, Shirt, Gift } from "lucide-react";

// Configuration
const TOTAL_IMAGES = 24; // User specified 22 images total

// Helper to get 4 images per service, wrapping around if we exceed 22
const getServiceImages = (serviceIndex: number) => {
  const images = [];
  // Each service needs 4 images.
  // Service 0 gets 1,2,3,4. Service 1 gets 5,6,7,8, etc.
  const startOffset = serviceIndex * 4;

  for (let i = 1; i <= 4; i++) {
    let imgNum = startOffset + i;
    // Wrap around logic: If imgNum is 23, it becomes 1. If 24, becomes 2.
    if (imgNum > TOTAL_IMAGES) {
      imgNum = (imgNum - 1) % TOTAL_IMAGES + 1;
    }
    images.push(`/serviceses/service${imgNum}.png`);
  }
  return images;
};

const services = [
  {
    icon: Sparkles,
    title: "AR Filters / Effects",
    description: "Transform faces and environments with interactive augmented reality filters that captivate audiences.",
    tags: ["Snapchat", "Instagram", "TikTok", "+more"],
    thumbnails: getServiceImages(0), // Images 1-4
  },
  {
    icon: Layers,
    title: "XR Applications",
    description: "Build immersive extended reality environments that blur the line between digital and physical worlds.",
    tags: ["VR", "MR", "Spatial", "+more"],
    thumbnails: getServiceImages(1), // Images 5-8
  },
  {
    icon: Globe,
    title: "AR Marketing",
    description: "Strategic AR campaigns that position your brand at the forefront of immersive technology.",
    tags: ["Campaigns", "Engagement", "Analytics"],
    thumbnails: getServiceImages(2), // Images 9-12
  },
  {
    icon: Glasses,
    title: "AR for Websites",
    description: "Integrate augmented reality directly into web experiences for seamless product visualization.",
    tags: ["WebAR", "3D", "Interactive", "+more"],
    thumbnails: getServiceImages(3), // Images 13-16
  },
  {
    icon: Shirt,
    title: "Virtual Try-On",
    description: "Let customers try products virtually before purchase, boosting confidence and reducing returns.",
    tags: ["Fashion", "Beauty", "Eyewear"],
    thumbnails: getServiceImages(4), // Images 17-20
  },
  {
    icon: Gift,
    title: "AR Swags",
    description: "Create memorable branded AR experiences that turn ordinary merchandise into interactive touchpoints.",
    tags: ["Packaging", "Events", "Merchandise"],
    thumbnails: getServiceImages(5), // Images 21-22, then wraps to 1-2
  },
];

const ServiceCard = ({ service, index, isInView }: { service: typeof services[0]; index: number; isInView: boolean }) => {
  const isFirstRow = index < 3;
  const slideDirection = isFirstRow ? -50 : 50;

  return (
      <motion.div
          initial={{ opacity: 0, x: slideDirection }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideDirection }}
          transition={{
            duration: 0.6,
            delay: 0.15 + index * 0.1,
            ease: [0.25, 0.1, 0.25, 1]
          }}
      >
        <Link
            to="/services"
            className="group block rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm overflow-hidden hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            title={`Explore Arexa's ${service.title} Services`}
        >
          {/* Main Image Container: Square Aspect Ratio */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
              className="relative aspect-square overflow-hidden bg-gradient-to-br from-muted/50 to-muted p-2"
          >
            {/* 2x2 Grid with 4 Actual Images */}
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {service.thumbnails.map((thumb, idx) => (
                  <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 + idx * 0.05 }}
                      className="rounded-lg bg-white/80 border border-border/50 overflow-hidden group-hover:border-primary/20 transition-colors duration-300"
                  >
                    <img
                        src={thumb}
                        // SEO: Descriptive Alt Text including Brand Name and Service Type
                        alt={`Arexa ${service.title} Portfolio Example ${idx + 1}`}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        loading="lazy"
                    />
                  </motion.div>
              ))}
            </div>

            {/* Icon Badge - Centered */}
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, delay: 0.35 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white/95 backdrop-blur-md flex items-center justify-center shadow-xl border border-primary/10 z-10 group-hover:scale-110 transition-transform duration-300"
            >
              <service.icon className="w-7 h-7 text-primary" />
            </motion.div>
          </motion.div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-base lg:text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
              {service.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              {service.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {service.tags.map((tag, tagIndex) => (
                  <motion.span
                      key={tag}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.4, delay: 0.4 + index * 0.1 + tagIndex * 0.05 }}
                      className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted/80 text-muted-foreground border border-border/50"
                  >
                    {tag}
                  </motion.span>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-300">
              Learn More
              <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          </div>
        </Link>
      </motion.div>
  );
};

const ServicesSnapshot = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  // --- SEO: Inject Service Catalog Schema ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Arexa Technologies Service Offerings",
      "description": "Comprehensive AR, VR, and XR development services offered by Arexa Technologies.",
      "itemListElement": services.map((service, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Service",
          "name": service.title,
          "description": service.description,
          "provider": {
            "@type": "Organization",
            "name": "Arexa Technologies"
          },
          "serviceType": service.tags[0], // Uses primary tag as type
          "image": `https://arexa.co${service.thumbnails[0]}` // Absolute URL for schema
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
          className="py-12 lg:py-16 section-bg-primary"
          ref={ref}
          aria-label="Our Core Services"
      >
        <div className="section-padding">
          <div className="text-center mb-10">
            <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-3"
            >
              What We Do
            </motion.span>
            <motion.h2
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
            >
              Our <span className="gradient-text">Services</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
                <ServiceCard
                    key={service.title}
                    service={service}
                    index={index}
                    isInView={isInView}
                />
            ))}
          </div>

          <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-center mt-12"
          >
            <Link
                to="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors duration-300"
            >
              View All Services <ArrowUpRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>
  );
};

export default ServicesSnapshot;