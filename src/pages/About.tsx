import { motion, useInView } from "framer-motion";
import { ArrowRight, Linkedin, Twitter, Target, Eye, Heart, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef, useEffect } from "react";

// --- IMPORT LOGO ---
import arexaLogo from "@/assets/arexa-logo.png";

// --- DATA: Stats (Reverted to pure AR/XR focus) ---
const stats = [
  { id: 1, label: "AR Experiences Delivered", value: "500+" },
  { id: 2, label: "Brand Campaigns", value: "120+" },
  { id: 3, label: "Impressions Generated", value: "2B+" },
  { id: 4, label: "Active Markets", value: "35+" },
];

// --- DATA: Solutions (Reverted to pure AR/XR focus) ---
const solutions = [
  {
    id: 1,
    title: "AR Filters & Camera Effects",
    description: "We build stunning Augmented Reality camera filters that are fun, immersive, interactive and highly engaging! From Instagram to Snapchat, we turn passive viewing into active participation.",
    imageFront: "https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=600&auto=format&fit=crop",
    imageBack: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop",
    link: "/work"
  },
  {
    id: 2,
    title: "Newsfeed SmartApps",
    description: "Launch rich in-app interactive games that work natively inside social mobile apps like Facebook & Instagram. No downloads required.",
    imageFront: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=600&auto=format&fit=crop",
    imageBack: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop",
    link: "/work"
  },
  {
    id: 3,
    title: "Web AR Experiences",
    description: "Unlock a whole new world of augmented reality experiences on mobile web. No app required! Frictionless access for maximum reach.",
    imageFront: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop",
    imageBack: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop",
    link: "/work"
  },
  {
    id: 4,
    title: "Interactive Videos",
    description: "Create video engagement by layering questions, hotspots, calculations, lead generation, and more on top of an existing video.",
    imageFront: "https://images.unsplash.com/photo-1622737133809-d95047b9e673?w=800&auto=format&fit=crop&q=60",
    imageBack: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=60",
    link: "/work"
  }
];

// --- COMPONENT: 3D Layered Image ---
const LayeredImage = ({ front, back, alt }: { front: string; back: string; alt: string }) => (
    <div className="relative w-full aspect-[4/3] group perspective-1000 my-8 lg:my-0">
      <div className="absolute top-8 left-8 w-[90%] h-[90%] rounded-3xl overflow-hidden opacity-40 blur-[1px] group-hover:opacity-60 transition-all duration-700 ease-out group-hover:translate-x-4 group-hover:translate-y-4 rotate-3">
        <img src={back} alt="" className="w-full h-full object-cover grayscale contrast-125" />
      </div>
      <div className="absolute top-0 left-0 w-[90%] h-[90%] rounded-3xl overflow-hidden shadow-xl z-10 transition-all duration-500 ease-out group-hover:-translate-y-6 group-hover:-translate-x-6 group-hover:shadow-2xl -rotate-2">
        <img src={front} alt={alt} className="w-full h-full object-cover" />
      </div>
    </div>
);

// --- COMPONENT: Reusable Premium CTA ---
const PremiumCTA = ({ text = "Claim Free Consultancy", className = "" }: { text?: string, className?: string }) => (
    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`relative group inline-block z-20 ${className}`}>
      <div className="absolute -inset-1.5 bg-[#5C4EE5] rounded-full blur-lg opacity-40 group-hover:opacity-75 transition duration-500 pointer-events-none" />
      {/* CHANGED: React Router <Link> replaced with standard <a> tag for external URL. Target blank added. */}
      <a
          href="https://calendly.com/chhavigarg/arexa"
          target="_blank"
          rel="noopener noreferrer"
          title={text}
          className="relative inline-flex items-center gap-2 bg-[#5C4EE5] text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-base md:text-lg font-extrabold shadow-[0_10px_30px_-10px_rgba(92,78,229,0.6)] transition-all duration-300 border-t border-white/20 overflow-hidden"
      >
        <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
        <span className="relative z-10 tracking-wide">{text}</span>
        <Calendar size={20} className="relative z-10 group-hover:scale-110 transition-transform duration-300 ml-1" />
      </a>
    </motion.div>
);

const About = () => {
  // Ensures the page starts at the top immediately upon loading
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const founderRef = useRef(null);
  const solutionsRef = useRef(null);
  const valuesRef = useRef(null);
  const ctaRef = useRef(null);

  // View Triggers
  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-50px" });

  // --- SEO IMPLEMENTATION ---
  useEffect(() => {
    document.title = "About Arexa | Official Snap AR Partner & Global XR Studio";

    const keywords = "Arexa Snap AR Partner, Official Snap AR Agency, Arexa vs Zappar, Custom WebAR vs DIY, Arexa vs Lenslist, Arexa vs Flam, Chhavi Garg Founder, Brajesh Kumar Developer, Bharat XR Community, Virtual Try On Agency, High Fidelity AR, augmented reality studio, AR experience agency, immersive AR brand experiences, virtual reality campaign studio, AR VR creative agency, Snap AR lens studio, Snapchat AR filter agency, Snap AR campaign development, branded Snapchat lenses, Snap AR experience design, AR marketing agency, immersive brand activation AR, interactive AR campaigns, AR advertising solutions, WebAR experiences, CGI + AR campaigns, AR filters for brands, AR storytelling, experiential marketing AR, interactive brand experiences, virtual try on ar, ar filters for brands, webar agency, xr applications for brands, cgi ar campaigns, ar activation agency, snap ar lens development for brands, ar marketing campaigns examples, virtual try on for ecommerce brands, webar experiences for websites, cost of snapchat ar filters, ar filters for product launches, branded ar experiences agency india, ar vr studio, augmented reality agency, immersive experience studio, ar brand experiences, snap ar lens development, snapchat ar filter agency, snap ar studio, branded snapchat lenses, social ar filters, ar marketing agency, immersive ar campaigns, ar advertising solutions, web ar experiences, virtual try on ar, ar filters for brands, webar agency, xr applications for brands, snap ar lenses, snapchat ar filters, snap ar lens development, social ar filters, branded snapchat lenses, webar experiences, ar for websites, virtual try-on ar, virtual try-on solutions, ar marketing campaigns, immersive ar marketing, ar brand experiences, ar advertising agency, snap ar lenses for brands, webar experiences no app required, virtual try-on ar for ecommerce, immersive ar marketing examples, snapchat ar filters agency, ar marketing for product launches, branded social ar filters development, cost of snap ar campaigns, ar vr studio, ar xr studio, immersive ar xr experiences, snap ar lens development agency, snapchat ar filters agency, webar marketing agency, virtual try-on ar studio, ar mirrors agency, ar filters beauty brands, digital fashion ar, snap ar filters for beauty, virtual try-on solutions fashion, ar mirrors retail brands, web ar virtual try-on, immersive ar campaigns beauty, custom webar studio, ar xr agency for brands, bespoke snap ar development, virtual try-on ar agency, immersive ar marketing studio, web ar experiences agency, ar brand campaigns development, custom webar development for brands, webar agency vs no-code platform, bespoke webar experiences studio, web ar marketing campaigns agency, virtual try-on and webar for ecommerce, ar studio vs ar platform 2025, cost of custom webar campaigns, hire ar agency for branded webar, snap ar lens development agency, custom branded snapchat lenses, snap ar marketing agency, snapchat ar filters for brands, snap ar campaigns examples, snap ar lens studio partner, how brands use snap ar for marketing, snap ar marketing campaigns examples, custom snap ar lens development for brands, branded snapchat ar lenses agency, snap ar vs instagram ar for brands, cost of custom snap ar campaigns, best snap ar agency 2025, snap ar lens creator marketplace alternative, custom ar xr studio, bespoke ar agency brands, snap ar lens agency, webar immersive campaigns, ar marketing agency alternative, immersive brand experiences studio, ar vs mixed reality platform, custom mixed reality campaigns, immersive ar xr agency, custom ar agency vs ai mixed reality platform, bespoke immersive campaigns for brands 2025, ar xr studio alternative to flam, custom snap ar vs ai generated mr, immersive advertising agency roi, why choose custom ar studio over ai platforms, bespoke ar campaigns examples, ar agency for interactive advertising, ar creator, ar developer, augmented reality creator, snapchat ar developer, instagram ar filter creator, freelance ar developer india, ar effects creator, interactive ar experiences, custom ar filters, webar developer, hire ar creator for brand campaign, freelance snapchat ar developer, instagram ar filter for marketing, ar creator portfolio india, xr developer, ar creative technologist, interactive experience designer, augmented reality portfolio, immersive experience design, spatial computing projects, creative technology portfolio, interactive installations ar, xr developer portfolio, ar creative technologist india, interactive ar experience designer, immersive xr projects portfolio, enterprise creative services, design subscription services, creative as a service caas, ai-powered design services, brand design agency for enterprises, scalable creative teams, on-demand design services, motion graphics production services, social media creative services, web design for enterprise, best creative services for enterprise marketing, ai design services for large brands, outsource brand creative production, how to scale design output for big teams, creative subscription model for enterprise brands, immersive experience design, ar vr creative studio, augmented reality agency, virtual reality production, xr experience design, interactive media studio, webxr experiences, experiential media production, immersive brand experiences, ar/vr for retail, vr installation experiences, xr storytelling and media, ar experience studio for brands, virtual reality production companies, immersive xr solutions for events, best ar creative agency, interactive augmented reality campaigns, webxr for marketing engagements";

    const description = "Arexa is an Official Snap AR Partner and global XR studio specializing in High Fidelity AR, Virtual Try-On, Custom WebAR, and Immersive Brand Experiences. Founded by Chhavi Garg.";

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords);

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Arexa",
      "url": "https://arexa.co",
      "logo": "https://arexa.co/images/logo.png",
      "founder": {
        "@type": "Person",
        "name": "Chhavi Garg",
        "jobTitle": "Founder & CEO",
        "image": "https://arexa.co/images/chhavi.png"
      },
      "employee": {
        "@type": "Person",
        "name": "Brajesh Kumar",
        "jobTitle": "Developer"
      },
      "description": description,
      "sameAs": [
        "https://www.linkedin.com/company/arexa",
        "https://twitter.com/arexa"
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

  return (
      <main className="w-full overflow-x-clip min-h-screen bg-white text-gray-900 font-sans">
        <Header />

        {/* 1. HERO SECTION */}
        <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 px-4 md:px-8 max-w-[1400px] mx-auto" ref={heroRef}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            <motion.div
                initial={{ opacity: 0, x: -100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 uppercase leading-none tracking-tight text-gray-900">
                WHAT IS <br />
                <img
                    src={arexaLogo}
                    alt="Arexa Logo"
                    className="h-12 md:h-16 lg:h-20 w-auto object-contain mt-2 inline-block"
                />
              </h1>

              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  <strong>Arexa</strong> is a global creative technology studio specializing in immersive digital experiences across augmented reality, virtual reality, generative AI, branded games, and interactive content. We help brands transform ideas into high-impact experiences that engage audiences across platforms and touchpoints.
                </p>
                <p>
                  Since our founding, Arexa has collaborated with 600+ brands and 250+ agencies worldwide, delivering scalable and performance-driven immersive solutions. We operate at the intersection of creativity and technology, working with leading platforms to shape the future of digital engagement.
                </p>
              </div>

              {/* NEW CTA IN HERO */}
              <div className="mt-10">
                <PremiumCTA text="Claim Free Consultancy" />
              </div>

            </motion.div>

            {/* HERO IMAGE */}
            <motion.div
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full min-h-[400px] lg:min-h-[500px] rounded-r-3xl lg:rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                  src="/images/about-hero.png"
                  onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&fit=crop"; }}
                  alt="Arexa Team - Official Snap AR Partner"
                  className="w-full h-full object-cover"
              />
            </motion.div>

          </div>
        </section>

        {/* 2. STATS SECTION */}
        <section className="py-20 bg-white border-y border-gray-100" ref={statsRef}>
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 text-center">
              {stats.map((stat, index) => (
                  <motion.div
                      key={stat.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: false }}
                      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                  >
                    <h2 className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#5C4EE5]">
                      {stat.value}
                    </h2>
                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.1em] px-2">
                      {stat.label}
                    </p>
                  </motion.div>
              ))}
            </div>

            {/* NEW CTA IN STATS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-16 flex justify-center"
            >
              <PremiumCTA text="Start Your Campaign" />
            </motion.div>
          </div>
        </section>

        {/* 3. FOUNDER SECTION */}
        <section className="py-24 bg-gray-50" ref={founderRef}>
          <div className="max-w-[1200px] mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Image LEFT */}
              <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                  className="order-1 relative"
              >
                <div className="relative aspect-[4/5] w-full max-w-md mx-auto lg:ml-0 rounded-3xl overflow-hidden shadow-2xl">
                  <img
                      src="/chhavi.webm"
                      alt="Chhavi Garg - Founder of Arexa"
                      className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-bold text-xl">Chhavi Garg</p>
                    <p className="text-sm opacity-90">Founder & CEO</p>
                  </div>
                </div>
                {/* Decorative Element */}
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10" />
              </motion.div>

              {/* Content RIGHT */}
              <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.8 }}
                  className="order-2"
              >
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-purple-600 uppercase bg-purple-100 rounded-full">
                        Leadership
                    </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                  Meet Our Founder
                </h2>
                <h3 className="text-2xl font-bold text-gray-700 mb-6">Chhavi Garg</h3>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                  <p>
                    A visionary in the realm of creative technology, Chhavi has spearheaded Arexa's mission to democratize immersive experiences for brands globally.
                  </p>
                  <p>
                    With a passion for bridging the gap between artistic expression and cutting-edge code, Chhavi leads our diverse team of creators, ensuring that every campaign isn't just technologically sound, but emotionally resonant.
                  </p>
                </div>

                {/* NEW CTA IN FOUNDER SECTION + SOCIALS */}
                <div className="flex flex-wrap items-center gap-6 mt-10">
                  <PremiumCTA text="Book a Strategy Call" />

                  <div className="flex gap-4">
                    <a href="https://www.linkedin.com/in/chhavigg/" target="_blank" rel="noopener noreferrer" className="p-3 bg-white rounded-full shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-md hover:text-blue-600 transition-all">
                      <Linkedin size={20} />
                    </a>
                    <a href="https://x.com/chhavigg" className="p-3 bg-white rounded-full shadow-[0_5px_15px_-5px_rgba(0,0,0,0.1)] hover:shadow-md hover:text-blue-400 transition-all">
                      <Twitter size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* 4. SOLUTIONS SECTION */}
        <section className="bg-white text-gray-900 py-20 lg:py-32" ref={solutionsRef}>

          <div className="text-center mb-20 px-4">
            <motion.h2
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase leading-tight max-w-5xl mx-auto"
            >
              An overview of the creative tech solutions we offer
            </motion.h2>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-24 lg:space-y-32">
            {solutions.map((solution, index) => {
              const isEven = index % 2 === 0;
              return (
                  <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.8 }}
                      className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-24 ${!isEven ? "lg:flex-row-reverse" : ""}`}
                  >
                    {/* TEXT SIDE */}
                    <div className={`flex-1 text-center ${isEven ? "lg:text-left" : "lg:text-right"} z-10`}>
                      <h3 className="text-2xl md:text-4xl font-extrabold mb-6 text-gray-900">
                        {solution.title}
                      </h3>
                      <p className="text-gray-600 text-lg leading-relaxed mb-8 font-medium">
                        {solution.description}
                      </p>

                      <div className={`flex items-center gap-4 ${isEven ? "justify-center lg:justify-start" : "justify-center lg:justify-end"}`}>
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">Explore Now</span>
                        <Link
                            to={solution.link}
                            className="w-12 h-12 rounded-full border-2 border-gray-900 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>

                    {/* IMAGE SIDE */}
                    <div className="flex-1 w-full max-w-[600px] px-4 lg:px-0">
                      <LayeredImage
                          front={solution.imageFront}
                          back={solution.imageBack}
                          alt={solution.title}
                      />
                    </div>

                  </motion.div>
              );
            })}

            {/* NEW CTA AT BOTTOM OF SOLUTIONS */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 flex justify-center"
            >
              <PremiumCTA text="Build Your Custom Solution" />
            </motion.div>
          </div>
        </section>

        {/* 5. VALUES SECTION */}
        <section className="py-0 bg-gray-50 border-t border-gray-100 overflow-visible" ref={valuesRef}>
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={valuesInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.7 }}
                className="text-center mb-8"
            >
              <motion.span
                  initial={{ opacity: 0, x: -40 }}
                  animate={valuesInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1, duration: 0.6 }}
                  className="inline-block text-sm font-medium uppercase tracking-widest text-gray-500 mb-4"
              >
                What Drives Us
              </motion.span>
              <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold"
              >
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#5C4EE5]">Values</span>
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 pb-4">
              {[
                {
                  icon: Target,
                  title: "Mission",
                  description: "To transform how brands connect with their audiences through cutting-edge immersive technology that inspires, engages, and delivers results.",
                },
                {
                  icon: Eye,
                  title: "Vision",
                  description: "A world where digital experiences seamlessly enhance human connection, making technology feel natural, intuitive, and deeply meaningful.",
                },
                {
                  icon: Heart,
                  title: "Culture",
                  description: "We believe in collaboration, continuous learning, and the power of diverse perspectives to create truly innovative solutions.",
                },
              ].map((value, index) => (
                  <motion.div
                      key={value.title}
                      initial={{
                        opacity: 0,
                        x: index === 0 ? -40 : index === 2 ? 40 : 0,
                        y: index === 1 ? 40 : 0,
                        scale: 0.9
                      }}
                      animate={valuesInView ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
                      transition={{ delay: 0.3 + index * 0.15, duration: 0.6 }}
                      className="p-8 rounded-3xl border border-gray-200 bg-white text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.2)] transition-shadow overflow-visible"
                  >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={valuesInView ? { scale: 1 } : {}}
                        transition={{ delay: 0.4 + index * 0.15, duration: 0.5, type: "spring" }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B6B] to-[#5C4EE5] flex items-center justify-center mx-auto mb-6 text-white"
                    >
                      <value.icon className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed font-medium">
                      {value.description}
                    </p>
                  </motion.div>
              ))}
            </div>

            {/* NEW CTA IN VALUES */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex justify-center"
            >
              <PremiumCTA text="Partner With Us" />
            </motion.div>
          </div>
        </section>

        {/* 6. CTA SECTION */}
        <section className="py-0 bg-gray-50 text-center" ref={ctaRef}>
          <div className="px-4 md:px-8 border-t border-gray-200 py-4">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
            >
              Ready to Build the Future?
            </motion.h2>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-gray-600 mb-6 max-w-xl mx-auto text-lg font-medium"
            >
              Connect with our technical experts to map out your next immersive campaign.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex justify-center"
            >
              <PremiumCTA />
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default About;