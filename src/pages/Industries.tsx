import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  ShoppingBag,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Building2,
  Plane,
  Compass,
  Car,
  Megaphone,
  Calendar // Added Calendar for CTA
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef, useEffect } from "react";
import SEO from "@/components/seo/SEO";

// UPDATED: Blending XR/AR capabilities with AI/Automation for each industry
const industries = [
  {
    icon: ShoppingBag,
    name: "Retail & E-commerce",
    description1: "Transform shopping experiences with AR try-ons, virtual showrooms, and AI-driven personalization that drive engagement and sales.",
    description2: "Enable customers to visualize products in their space before buying. Our high-fidelity 3D models reduce return rates, while our custom AI automation workflows optimize your backend inventory, dynamic pricing, and lead follow-ups.",
    stats: "40% increase in conversion rates",
    image: "/industry/retail.png",
  },
  {
    icon: HeartPulse,
    name: "Healthcare",
    description1: "Revolutionize medical training and patient care with immersive XR solutions and intelligent automation workflows that improve outcomes.",
    description2: "Visualize complex anatomy in stunning 3D detail to simulate surgical procedures or explain diagnoses. Alongside our AR tools, we build secure, locally-trained AI models that streamline administrative tasks and patient data processing.",
    stats: "60% better knowledge retention",
    image: "/industry/healthcare.png",
  },
  {
    icon: GraduationCap,
    name: "Education",
    description1: "Create engaging, personalized learning experiences through interactive AR/VR content and AI-powered educational tools.",
    description2: "Turn static textbooks into immersive 3D lessons that students can explore from every angle. We gamify the learning process to increase participation, while utilizing AI to automate administrative tasks and tailor curriculums to individual needs.",
    stats: "85% student engagement",
    image: "/industry/education.png",
  },
  {
    icon: Gamepad2,
    name: "Entertainment",
    description1: "Push creative boundaries with immersive storytelling, mixed reality activations, and AI-enhanced entertainment experiences.",
    description2: "Engage fans with viral social AR filters and CGI campaigns for movies, concerts, and events. We build shareable moments that amplify your reach, while leveraging predictive AI to optimize your marketing campaigns and audience retention.",
    stats: "3x user engagement time",
    image: "/industry/entertainment.png",
  },
  {
    icon: Building2,
    name: "Real Estate",
    description1: "Showcase properties like never before with virtual tours, AR staging, and AI-driven lead automation.",
    description2: "Let potential buyers walk through unbuilt properties or visualize renovations in real-time. Our AR staging tools remove the need for physical furniture, while our custom SaaS solutions streamline your sales funnel and agent workflows.",
    stats: "50% faster sales cycles",
    image: "/industry/real-estate.png",
  },
  {
    icon: Plane,
    name: "Travel & Tourism",
    description1: "Inspire wanderlust with virtual destination previews, AR guides, and AI-optimized travel workflows.",
    description2: "Enhance on-site visits with historical overlays and interactive wayfinding that brings heritage sites to life. Provide 'try before you fly' experiences that build excitement, while backend automation personalizes user bookings and operational logistics.",
    stats: "35% booking increase",
    image: "/industry/travel.png",
  },
  {
    icon: Compass,
    name: "Architecture & AEC",
    description1: "Visualize blueprints in 1:1 scale on job sites with AR overlays, and optimize project management with custom AI workflows.",
    description2: "Facilitate remote collaboration between architects, engineers, and clients by walking through holographic models together. This reduces rework, while intelligent automation predicts resource needs and streamlines administrative overhead.",
    stats: "30% reduction in rework costs",
    image: "/industry/architecture.png",
  },
  {
    icon: Car,
    name: "Automotive",
    description1: "Enhance the dealership experience with AR configurators and streamline operations with AI predictive models.",
    description2: "Empower technicians with heads-up display (HUD) repair guides that overlay instructions directly onto the engine. Simultaneously, our custom automation software manages inventory, dealership pipelines, and predictive maintenance schedules.",
    stats: "25% increase in upsells",
    image: "/industry/automotive.png",
  },
  {
    icon: Megaphone,
    name: "Marketing & Advertising",
    description1: "Break through the noise with immersive OOH CGI campaigns and optimize ROI through AI predictive analytics.",
    description2: "Drive viral sharing with gamified brand activations that reward user participation. We create a measurable link between physical ads and digital conversion, utilizing intelligent automation tools to track metrics and adjust workflows in real-time.",
    stats: "4x higher CTR than display",
    image: "/industry/marketing.png",
  },
];

// --- INDIVIDUAL INDUSTRY CARD COMPONENT ---
const IndustryCard = ({ industry, index }: { industry: any, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const isEven = index % 2 === 0;

  return (
      <div
          ref={ref}
          className={`grid lg:grid-cols-2 gap-12 items-center ${
              !isEven ? "lg:flex-row-reverse" : ""
          }`}
      >
        {/* TEXT CONTENT COLUMN */}
        <motion.div
            className={!isEven ? "lg:order-2" : ""}
            initial={{ opacity: 0, x: isEven ? -60 : 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -60 : 60 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center mb-6">
            <industry.icon className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {industry.name}
          </h2>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {industry.description1}
          </p>

          <p className="hidden lg:block text-muted-foreground leading-relaxed mb-6">
            {industry.description2}
          </p>

          <p className="text-lg font-semibold gradient-text mb-8">
            {industry.stats}
          </p>
          {/* CHANGED: React Router <Link> replaced with standard <a> tag for external URL. Target blank added. */}
          <a
              href="https://calendly.com/chhavigarg/arexa"
              target="_blank"
              rel="noopener noreferrer"
              title="Claim Free Consultancy"
              className="inline-flex items-center gap-2 gradient-bg text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-all duration-300 hover:gap-3 shadow-lg"
          >
            Claim Free Consultancy <Calendar size={16} />
          </a>
        </motion.div>

        {/* IMAGE COLUMN */}
        <motion.div
            className={`relative overflow-hidden rounded-2xl aspect-[4/3] ${!isEven ? "lg:order-1" : ""}`}
            initial={{ opacity: 0, x: isEven ? 60 : -60, scale: 0.95 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: isEven ? 60 : -60, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            style={{ background: 'transparent' }}
        >
          <img
              src={industry.image}
              alt={`${industry.name} XR & AI Solution`}
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
          />
        </motion.div>
      </div>
  );
};

const Industries = () => {
  // Ensures the page starts at the top immediately upon loading
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: false, amount: 0.3 });

  return (
      // FIX: w-full and overflow-x-clip cleanly eliminates the horizontal/double-scroll bug
      <main className="w-full overflow-x-clip min-h-screen">
        <SEO
            title="Industries | XR & AI Automation Solutions for Global Brands"
            description="Explore how Arexa transforms industries with Snap AR, WebAR, and Custom AI Workflows. Tailored solutions for Retail, Healthcare, Education, Real Estate, and more."
            keywords="Retail AR Try-On, AI Automation for E-commerce, Virtual Showrooms, VR Medical Training, AI Healthcare Workflows, EdTech Augmented Reality, Educational AI Tools, Real Estate Virtual Tours, SaaS Real Estate, Architectural Visualization AR, Automotive AR Configurator, AI Predictive Maintenance, Travel & Tourism AR Guides, Virtual Museum Tours, OOH Interactive Billboards, Marketing AR Activations, Predictive Analytics Agency, Process Automation Agency, Custom Internal Tools, Arexa Snap AR Partner, Official Snap AR Agency"
            canonical="https://arexa.co/industries"
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
              <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.7 }}
                  className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4"
              >
                Industries
              </motion.span>
              <motion.h1
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Transforming{" "}
                <motion.span
                    className="gradient-text"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Every Sector
                </motion.span>
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-lg text-muted-foreground max-w-2xl"
              >
                We bring immersive XR technology and intelligent AI automation to diverse industries, creating
                tailored solutions that address unique challenges and operational bottlenecks.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Industries List */}
        <section className="pb-24 lg:pb-32">
          <div className="section-padding">
            <div className="space-y-24">
              {industries.map((industry, index) => (
                  <IndustryCard key={industry.name} industry={industry} index={index} />
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default Industries;