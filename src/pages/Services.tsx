import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Layers, Globe, Palette, Smartphone, Video, Workflow, Code, Cpu, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef } from "react";
import SEO from "@/components/seo/SEO"; // Import SEO Component

// SEO UPDATE: Keyword-rich titles and descriptions targeting competitor gaps
const services = [
  {
    icon: Sparkles,
    title: "Snap AR & Social Filters", // Keyword: Snap AR
    description: "Official Snap AR Partner quality. We create high-fidelity viral lenses for Snapchat, Instagram, and TikTok that drive massive engagement.",
    features: ["Snapchat Lens Development", "Instagram & TikTok Filters", "Viral Campaign Strategy", "Brand Engagement"],
  },
  {
    icon: Layers,
    title: "WebAR & Virtual Try-On", // Keyword: WebAR, VTO
    description: "Frictionless, no-app-needed AR experiences directly in the browser. The superior alternative to DIY platforms for e-commerce conversion.",
    features: ["Virtual Try-On (VTO)", "No-Code Alternatives", "Product Visualization", "Cross-Browser AR"],
  },
  {
    icon: Globe,
    title: "Immersive Strategy", // Keyword: Strategy
    description: "Strategic roadmaps that position your brand at the forefront of immersive tech. We analyze ROI and user journeys to ensure impact.",
    features: ["Tech Stack Selection", "ROI & KPI Modeling", "Competitor Analysis", "User Journey Mapping"],
  },
  {
    icon: Palette,
    title: "3D CGI & Creative Direction", // Keyword: CGI, High-Fidelity
    description: "Cinema-grade 3D asset creation and art direction. We build the high-fidelity assets that standard DIY platforms simply cannot handle.",
    features: ["Hyper-Realistic 3D", "Motion Graphics", "Visual Identity", "Unity/Unreal Assets"],
  },
  {
    icon: Smartphone,
    title: "Mobile AR/VR Apps", // Keyword: Native Apps
    description: "Native applications built on Unity and Unreal Engine for complex, high-performance enterprise and gaming use cases.",
    features: ["Unity Development", "Mixed Reality Apps", "Apple Vision Pro", "Device Optimization"],
  },
  {
    icon: Video,
    title: "Mixed Reality & Video", // Keyword: Mixed Reality
    description: "Blurring lines between physical and digital with interactive video, FOOH (CGI) advertising, and mixed reality content.",
    features: ["FOOH (CGI) Ads", "Interactive 360° Video", "Immersive Storytelling", "Live Event Activation"],
  },
  // --- NEW AI & AUTOMATION CAPABILITIES ---
  {
    icon: Workflow,
    title: "Process Automation",
    description: "Streamline repetitive business tasks by creating intelligent automation systems that work exactly how you need them to.",
    features: ["Lead Flow Optimization", "Operations Scaling", "Internal Systems", "Workflow Architecture"],
  },
  {
    icon: Code,
    title: "Custom Automation Builds",
    description: "Fully customized software solutions from proof-of-concept to deployment, tailored to solve your unique business bottlenecks.",
    features: ["Custom Internal Tools", "SaaS Development", "System Architecture", "End-to-End Execution"],
  },
  {
    icon: Cpu,
    title: "AI Model Training",
    description: "Locally trained models for predictive analytics, voice, and recommendation engines to drive insights, ensuring your data stays private and secure.",
    features: ["Predictive Analytics", "Decision Workflows", "Recommendation Engines", "Private Data Security"],
  },
];

const Services = () => {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const ctaRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  return (
      <main className="min-h-screen">
        {/* SEO INJECTION: NEW GLOBAL KEYWORDS + EXISTING LIST */}
        <SEO
            title="Services | Custom XR, CGI & AI Automation Agency"
            description="Arexa offers premium immersive services alongside intelligent AI automation workflows, process optimization, and high-fidelity 3D CGI production."
            keywords="Official Snap Lens Network Partner, Global AR Agency, Enterprise Augmented Reality Services, CGI Advertising Studio, WebAR for Retail & Luxury, Virtual Try-On Solutions USA, Immersive Brand Activations Dubai, High-Fidelity 3D Product Rendering, VR Showroom Developers, Automotive CGI Configurator, Fashion Virtual Try-On Paris, Metaverse Brand Strategy, Interactive Marketing Agency London, Social AR Campaigns, TikTok Effect House Partner, Instagram Spark AR Studio, Luxury Brand AR Experiences, Cross-Platform AR Development, 3D Asset Creation for Brands, AI Model Training, Business Process Automation, Workflow Optimization, Custom SaaS Development, AI Decision Workflows, Predictive Analytics Agency, Experiential Marketing Technology, Arexa Snap AR Partner, Official Snap AR Agency"
            canonical="https://arexa.co/services"
        />

        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden" ref={heroRef}>
          <div className="absolute inset-0">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[100px]"
            />
          </div>

          <div className="section-padding relative z-10">
            <div className="max-w-3xl">
              {/* Slide from right */}
              <motion.span
                  initial={{ opacity: 0, x: 60 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7 }}
                  className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4"
              >
                Our Expertise
              </motion.span>
              {/* Scale up */}
              <motion.h1
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Custom XR & AI Solutions That{" "}
                <motion.span
                    className="gradient-text"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Drive Real ROI
                </motion.span>
              </motion.h1>
              {/* Slide from left */}
              <motion.p
                  initial={{ opacity: 0, x: -60 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-lg text-muted-foreground max-w-2xl"
              >
                From <strong>Snap AR</strong> viral hits and enterprise <strong>WebAR</strong> to intelligent <strong>AI Workflows</strong>.
                We deliver the high-fidelity engineering and business automation that standard agencies can't match.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-24 lg:pb-32" ref={servicesRef}>
          <div className="section-padding">
            <div className="space-y-8">
              {services.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                    <motion.div
                        key={service.title}
                        initial={{
                          opacity: 0,
                          x: isEven ? -60 : 60,
                          scale: 0.95
                        }}
                        animate={servicesInView ? { opacity: 1, x: 0, scale: 1 } : {}}
                        transition={{ delay: index * 0.12, duration: 0.7 }}
                        className="group p-8 lg:p-12 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-500"
                    >
                      <div className="grid lg:grid-cols-12 gap-8 items-start">
                        <motion.div
                            className="lg:col-span-1"
                            initial={{ scale: 0 }}
                            animate={servicesInView ? { scale: 1 } : {}}
                            transition={{ delay: index * 0.12 + 0.2, duration: 0.5, type: "spring" }}
                        >
                          <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center">
                            <service.icon className="w-6 h-6 text-primary-foreground" />
                          </div>
                        </motion.div>
                        <div className="lg:col-span-7">
                          <h2 className="text-2xl lg:text-3xl font-bold mb-4 group-hover:gradient-text transition-all duration-300">
                            {service.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="lg:col-span-4">
                          <ul className="space-y-3">
                            {service.features.map((feature, fIndex) => (
                                <motion.li
                                    key={feature}
                                    className="flex items-center gap-3 text-sm"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={servicesInView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: index * 0.12 + 0.3 + fIndex * 0.05, duration: 0.4 }}
                                >
                                  <span className="w-1.5 h-1.5 rounded-full gradient-bg" />
                                  {feature}
                                </motion.li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section - Background and Top Padding Removed */}
        <section className="pb-20 lg:pb-24" ref={ctaRef}>
          <div className="section-padding text-center">
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Build the Future?
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="text-muted-foreground mb-8 max-w-xl mx-auto"
            >
              Connect with our technical experts to map out your next immersive XR campaign or custom AI automation workflow.
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={ctaInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
            >
              {/* CHANGED: React Router <Link> replaced with standard <a> tag for external URL. Target blank added. */}
              <a
                  href="https://calendly.com/chhavigarg/arexa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-8 py-4 rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:gap-3"
              >
                Claim Free Consultancy <Calendar size={18} />
              </a>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default Services;