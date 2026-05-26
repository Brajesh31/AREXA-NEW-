import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Point to your live database
const API_URL = "https://arexa.co/api/cms.php?type=works";

// --- VIDEO CARD COMPONENT (UNTOUCHED) ---
const VideoCard = ({ videoSrc }: { videoSrc: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (unloadTimeoutRef.current) {
              clearTimeout(unloadTimeoutRef.current);
              unloadTimeoutRef.current = null;
            }
            if (!currentSrc) {
              loadTimeoutRef.current = setTimeout(() => setCurrentSrc(videoSrc), 200);
            } else {
              setTimeout(() => { if (videoRef.current) videoRef.current.play().catch(() => {}); }, 0);
            }
          } else {
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
              loadTimeoutRef.current = null;
            }
            if (videoRef.current) videoRef.current.pause();
            unloadTimeoutRef.current = setTimeout(() => {
              setCurrentSrc(undefined);
              setIsLoaded(false);
            }, 10000);
          }
        },
        { threshold: 0.1, rootMargin: "100px" }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      if (unloadTimeoutRef.current) clearTimeout(unloadTimeoutRef.current);
    };
  }, [videoSrc, currentSrc]);

  useEffect(() => {
    if (currentSrc && videoRef.current) {
      setTimeout(() => { if(videoRef.current) videoRef.current.play().catch(() => {}); }, 50);
    }
  }, [currentSrc]);

  return (
      <div ref={containerRef} className="absolute inset-0 bg-transparent">
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/5 transition-opacity duration-300">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )}
        {currentSrc && (
            <video
                ref={videoRef}
                src={currentSrc}
                muted
                loop
                playsInline
                onLoadedData={() => setIsLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        )}
      </div>
  );
};

const Work = () => {
  // --- STATE ---
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ---
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchWorks = async () => {
      try {
        const { data } = await axios.get(API_URL);

        const mappedProjects = data.map((item: any) => ({
          id: item.id,
          category: item.category,
          title: item.title,
          video: item.video_url,
          client: item.client_name || "",
        }));

        setProjects(mappedProjects);
      } catch (error) {
        console.error("Error fetching works:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // --- ANIMATION CONFIG ---
  const cardVariants = {
    hiddenLeft: { opacity: 0, x: -150, scale: 0.9 },
    hiddenRight: { opacity: 0, x: 150, scale: 0.9 },
    hiddenBottomGrow: { opacity: 0, y: 150, scale: 0.5 },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        type: "spring",
        bounce: 0.3
      }
    },
  };

  const getAnimationVariant = (index: number) => {
    const colIndex = index % 5;
    if (colIndex === 0) return "hiddenLeft";
    if (colIndex === 4) return "hiddenRight";
    return "hiddenBottomGrow";
  };

  return (
      <main className="min-h-screen">
        <Helmet>
          <title>Arexa Portfolio | Global AR, VR & CGI Case Studies</title>
          <meta name="description" content="Explore Arexa's global portfolio: Viral Snap Lenses, Enterprise VR Training, and CGI Advertising campaigns for brands in USA, UAE, and Asia. Official Snap Partner." />
          <meta name="keywords" content="AR Portfolio Examples, VR Case Studies, Snap Lens Campaign Examples, CGI Advertising Samples, WebAR Demos for Brands, Enterprise VR Training Projects, Global XR Projects, Official Snap Lens Network Partner Work, Best AR Filters 2026, Virtual Try-On Demos, Official Snap Lens Network Partner, Global AR Agency, Enterprise Augmented Reality Services, CGI Advertising Studio, WebAR for Retail & Luxury, Virtual Try-On Solutions USA, Immersive Brand Activations Dubai, High-Fidelity 3D Product Rendering, VR Showroom Developers, Automotive CGI Configurator, Fashion Virtual Try-On Paris, Metaverse Brand Strategy, Interactive Marketing Agency London, Social AR Campaigns, TikTok Effect House Partner, Instagram Spark AR Studio, Luxury Brand AR Experiences, Cross-Platform AR Development, 3D Asset Creation for Brands, Experiential Marketing Technology, Arexa Snap AR Partner, Official Snap AR Agency, Arexa vs Zappar, Custom WebAR vs DIY, Arexa vs Lenslist, Arexa vs Flam, Chhavi Garg Founder, Brajesh Kumar Developer, Bharat XR Community, Virtual Try On Agency, High Fidelity AR, augmented reality studio, AR experience agency, immersive AR brand experiences, virtual reality campaign studio, AR VR creative agency, Snap AR lens studio, Snapchat AR filter agency, Snap AR campaign development, branded Snapchat lenses, Snap AR experience design, AR marketing agency, immersive brand activation AR, interactive AR campaigns, AR advertising solutions, WebAR experiences, CGI + AR campaigns, AR filters for brands, AR storytelling, experiential marketing AR, interactive brand experiences, virtual try on ar, ar filters for brands, webar agency, xr applications for brands, cgi ar campaigns, ar activation agency, snap ar lens development for brands, ar marketing campaigns examples, virtual try on for ecommerce brands, webar experiences for websites, cost of snapchat ar filters, ar filters for product launches, branded ar experiences agency india, ar vr studio, augmented reality agency, immersive experience studio, ar brand experiences, snap ar lens development, snapchat ar filter agency, snap ar studio, branded snapchat lenses, social ar filters, ar marketing agency, immersive ar campaigns, ar advertising solutions, web ar experiences, virtual try on ar, ar filters for brands, webar agency, xr applications for brands, snap ar lenses, snapchat ar filters, snap ar lens development, social ar filters, branded snapchat lenses, webar experiences, ar for websites, virtual try-on ar, virtual try-on solutions, ar marketing campaigns, immersive ar marketing, ar brand experiences, ar advertising agency, snap ar lenses for brands, webar experiences no app required, virtual try-on ar for ecommerce, immersive ar marketing examples, snapchat ar filters agency, ar marketing for product launches, branded social ar filters development, cost of snap ar campaigns, ar vr studio, ar xr studio, immersive ar xr experiences, snap ar lens development agency, snapchat ar filters agency, webar marketing agency, virtual try-on ar studio, ar mirrors agency, ar filters beauty brands, digital fashion ar, snap ar filters for beauty, virtual try-on solutions fashion, ar mirrors retail brands, web ar virtual try-on, immersive ar campaigns beauty, custom webar studio, ar xr agency for brands, bespoke snap ar development, virtual try-on ar agency, immersive ar marketing studio, web ar experiences agency, ar brand campaigns development, custom webar development for brands, webar agency vs no-code platform, bespoke webar experiences studio, web ar marketing campaigns agency, virtual try-on and webar for ecommerce, ar studio vs ar platform 2025, cost of custom webar campaigns, hire ar agency for branded webar, snap ar lens development agency, custom branded snapchat lenses, snap ar marketing agency, snapchat ar filters for brands, snap ar campaigns examples, snap ar lens studio partner, how brands use snap ar for marketing, snap ar marketing campaigns examples, custom snap ar lens development for brands, branded snapchat ar lenses agency, snap ar vs instagram ar for brands, cost of custom snap ar campaigns, best snap ar agency 2025, snap ar lens creator marketplace alternative, custom ar xr studio, bespoke ar agency brands, snap ar lens agency, webar immersive campaigns, ar marketing agency alternative, immersive brand experiences studio, ar vs mixed reality platform, custom mixed reality campaigns, immersive ar xr agency, custom ar agency vs ai mixed reality platform, bespoke immersive campaigns for brands 2025, ar xr studio alternative to flam, custom snap ar vs ai generated mr, immersive advertising agency roi, why choose custom ar studio over ai platforms, bespoke ar campaigns examples, ar agency for interactive advertising, ar creator, ar developer, augmented reality creator, snapchat ar developer, instagram ar filter creator, freelance ar developer india, ar effects creator, interactive ar experiences, custom ar filters, webar developer, hire ar creator for brand campaign, freelance snapchat ar developer, instagram ar filter for marketing, ar creator portfolio india, xr developer, ar creative technologist, interactive experience designer, augmented reality portfolio, immersive experience design, spatial computing projects, creative technology portfolio, interactive installations ar, xr developer portfolio, ar creative technologist india, interactive ar experience designer, immersive xr projects portfolio, enterprise creative services, design subscription services, creative as a service caas, ai-powered design services, brand design agency for enterprises, scalable creative teams, on-demand design services, motion graphics production services, social media creative services, web design for enterprise, best creative services for enterprise marketing, ai design services for large brands, outsource brand creative production, how to scale design output for big teams, creative subscription model for enterprise brands, immersive experience design, ar vr creative studio, augmented reality agency, virtual reality production, xr experience design, interactive media studio, webxr experiences, experiential media production, immersive brand experiences, ar/vr for retail, vr installation experiences, xr storytelling and media, ar experience studio for brands, virtual reality production companies, immersive xr solutions for events, best ar creative agency, interactive augmented reality campaigns, webxr for marketing engagements" />
          <meta property="og:title" content="Arexa Portfolio | Global AR, VR & CGI Case Studies" />
          <meta property="og:description" content="Watch our Viral Snap Lenses and Enterprise VR Projects. Official Snap Lens Network Partner." />
          <meta property="og:url" content="https://arexa.co/portfolio" />
          <link rel="canonical" href="https://arexa.co/portfolio" />
        </Helmet>

        <Header />

        <section className="pt-32 pb-6 lg:pt-40 lg:pb-10 relative overflow-hidden">
          <div className="section-padding relative z-10">
            <div className="max-w-3xl">
              <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-2"
              >
                Our Portfolio
              </motion.span>
              <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
              >
                Projects That{" "}
                <span className="gradient-text">Inspire</span>
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base lg:text-lg text-muted-foreground max-w-2xl"
              >
                Explore our portfolio of immersive experiences that have transformed
                brands and captivated audiences worldwide.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="pb-10 lg:pb-14">
          <div className="section-padding">
            {loading ? (
                // LOADING SPINNER
                <div className="h-64 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                // GRID
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 overflow-hidden">
                  {projects.map((project, index) => {
                    const variantKey = getAnimationVariant(index);

                    return (
                        <motion.div
                            key={project.id}
                            variants={cardVariants}
                            initial={variantKey}
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.2 }}
                        >
                          <Link
                              to={`/portfolio/${project.id}`}
                              className="group block relative overflow-hidden rounded-xl aspect-[3/5] bg-transparent transform transition-transform"
                          >
                            <VideoCard videoSrc={project.video} />

                            {/* HOVER: Gradient gets darker on hover to support text pop */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-100 group-hover:from-black transition-opacity duration-500" />

                            <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">

                              {/* HOVER LOGIC UPDATED: Client GROWS, Category FADES */}
                              <div className="flex items-center gap-2 mb-1">

                                {/* Client Name: Grows & Bolds on Hover */}
                                {project.client && (
                                    <span className="text-yellow-400 text-[10px] font-bold uppercase tracking-wider transition-all duration-500 origin-left group-hover:text-sm group-hover:font-black">
                                      {project.client}
                                    </span>
                                )}

                                {/* Separator & Category: Fades Out on Hover */}
                                <span className="text-white/70 text-[10px] uppercase tracking-wider transition-all duration-300 group-hover:opacity-0 group-hover:-translate-x-2">
                                  {project.client ? "• " : ""}{project.category}
                                </span>

                              </div>

                              {/* Title: Grows & Bolds (Untouched) */}
                              <h3 className="text-sm lg:text-base font-bold text-white mb-0.5 line-clamp-2 transition-all duration-500 origin-bottom-left group-hover:text-xl group-hover:font-black group-hover:leading-tight">
                                {project.title}
                              </h3>

                            </div>
                          </Link>
                        </motion.div>
                    );
                  })}
                </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default Work;