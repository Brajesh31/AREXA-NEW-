import { motion, useInView, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, TrendingUp } from "lucide-react"; // Added TrendingUp for view icon
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { useAnalytics } from "@/hooks/useAnalytics"; // 👈 IMPORTED TRACKER

// --- CONFIGURATION ---
const API_URL = "https://arexa.co/api/cms.php?type=insights";

// --- INTERFACE (Updated for Hybrid Stats) ---
export interface CaseStudy {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  brandLogo: string;
  image: string;
  heroImage: string;
  date: string;
  isoDate: string;
  created_at: string;
  readTime: string;
  author: string;
  industry: string;
  platform: string;
  content: string;

  // ✅ NEW DB COLUMNS
  manual_base: string | number;
  real_clicks: number;
}

// --- HELPER: FORMAT K NUMBERS ---
const formatViews = (base: string | number | undefined, real: number) => {
  let baseCount = 0;
  const baseStr = String(base || "0").toLowerCase().trim();

  if (baseStr.includes("k")) {
    baseCount = parseFloat(baseStr.replace(/[^0-9.]/g, '')) * 1000;
  } else {
    baseCount = parseInt(baseStr.replace(/[^0-9]/g, '')) || 0;
  }

  const total = baseCount + Number(real || 0);

  if (total >= 1000) return (total / 1000).toFixed(1) + 'k';
  return total;
};

// --- CONSTANTS: Dropdown Options (Preserved) ---
const INDUSTRIES = [
  "View All", "Aviation", "Automotive", "Alcohol", "Banking", "Cosmetics",
  "Consumer Electronics", "E-Commerce", "Education", "Electronics, Phones & More.",
  "Fashion", "Financial Services", "FMCG", "Food Processing", "Food & Beverage",
  "Health Care", "Hospitality", "Home Appliances", "Lifestyle", "Manufacturing",
  "Mobile", "OTT", "Media & Entertainment", "Personal Care", "Publishing",
  "Real Estate", "Retail", "Sport", "Technology", "Tobacco", "Telecommunication",
  "Tourism", "travel", "Transport", "Others"
];

const PLATFORMS = [
  "View All", "Azure Kinect", "Newsfeed SmartApp Games", "Spark AR Camera Filters",
  "SwipeUpGames", "Facebook AR Camera Filters", "Facebook Playable Ads",
  "Instagram AR Camera Filters", "Generative AI", "Flip Tok Games", "Azure Kinect",
  "Oculus Quest VR", "Metaverse", "Client Speak", "Snapchat Lens", "GIFs & Stickers",
  "TikTok", "Website Development", "Whatsapp Sticker", "Facebook Messenger Chatbots"
];

const Insights = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackInsightView } = useAnalytics(); // 👈 GET TRACKER

  const heroRef = useRef(null);
  const articlesRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  // --- FILTER STATE ---
  const [selectedIndustry, setSelectedIndustry] = useState("View All");
  const [selectedPlatform, setSelectedPlatform] = useState("View All");
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // --- FETCH DATA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setCaseStudies(data);
      } catch (error) {
        console.error("Failed to load case studies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const filteredStudies = caseStudies.filter((study) => {
    const sInd = (study.industry || "").toLowerCase();
    const sPlat = (study.platform || "").toLowerCase();
    const fInd = selectedIndustry.toLowerCase();
    const fPlat = selectedPlatform.toLowerCase();

    const industryMatch = selectedIndustry === "View All" || sInd === fInd || sInd.includes(fInd);
    const platformMatch = selectedPlatform === "View All" || sPlat === fPlat || sPlat.includes(fPlat);

    return industryMatch && platformMatch;
  });

  // --- SEO HELPERS ---
  const titleSuffix = selectedIndustry !== "View All" ? ` - ${selectedIndustry}` : "";
  const pageTitle = `Arexa Insights | Innovation & AR Case Studies${titleSuffix}`;
  const pageDesc = "Explore Arexa's portfolio of AR filters, Generative AI campaigns, and immersive web experiences across industries like Retail, FMCG, and Tech.";

  const toggleIndustry = () => {
    setIsIndustryOpen(!isIndustryOpen);
    setIsPlatformOpen(false);
  };

  const togglePlatform = () => {
    setIsPlatformOpen(!isPlatformOpen);
    setIsIndustryOpen(false);
  };

  return (
      <main className="min-h-screen bg-gray-50/50">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDesc} />
          <meta name="keywords" content="AR Case Studies, VR Marketing Examples, Snap Lens ROI, WebAR Campaign Results, Generative AI Business Use Cases, Arexa Insights, Immersive Tech Blog, Digital Transformation Stories" />
          <link rel="canonical" href="https://arexa.co/insights" />

          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": "Arexa Case Studies & Insights",
              "description": pageDesc,
              "url": "https://arexa.co/insights",
              "hasPart": filteredStudies.slice(0, 10).map(study => ({
                "@type": "CreativeWork",
                "headline": study.title,
                "genre": study.category,
                "thumbnailUrl": study.heroImage || study.image,
                "datePublished": study.isoDate,
                "dateCreated": study.created_at,
                "author": { "@type": "Organization", "name": "Arexa Team" },
                "keywords": `${study.industry}, ${study.platform}`
              }))
            })}
          </script>
        </Helmet>

        <Header />

        {/* HERO SECTION */}
        <section className="pt-32 pb-12 lg:pt-40 lg:pb-20 relative overflow-hidden" ref={heroRef}>
          <div className="section-padding relative z-10">
            <div className="max-w-3xl">
              <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="inline-block text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4"
              >
                Insights
              </motion.span>

              <motion.h1
                  initial={{ opacity: 0, x: -60 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Thoughts on{" "}
                <motion.span
                    className="gradient-text"
                    initial={{ opacity: 0, y: 30 }}
                    animate={heroInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Innovation
                </motion.span>
              </motion.h1>

              <motion.p
                  initial={{ opacity: 0, x: 60 }}
                  animate={heroInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="text-lg text-muted-foreground max-w-2xl"
              >
                Explore our latest articles, case studies, and perspectives on
                immersive technology and its impact on business and society.
              </motion.p>
            </div>
          </div>
        </section>

        {/* CASE STUDIES SECTION */}
        <section className="pb-24 lg:pb-32" ref={articlesRef}>
          <div className="section-padding">

            {/* --- FILTER BAR --- */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 pb-4 relative z-20">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Case Studies</h2>

              <div className="flex gap-4 relative">
                {/* INDUSTRY DROPDOWN */}
                <div className="relative">
                  <button
                      onClick={toggleIndustry}
                      className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors py-2"
                      aria-haspopup="listbox"
                      aria-expanded={isIndustryOpen}
                  >
                    {selectedIndustry === "View All" ? "Industry" : selectedIndustry}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isIndustryOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isIndustryOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 md:left-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                            role="listbox"
                        >
                          {INDUSTRIES.map((ind) => (
                              <button
                                  key={ind}
                                  onClick={() => { setSelectedIndustry(ind); setIsIndustryOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${selectedIndustry === ind ? "text-primary font-bold bg-gray-50" : "text-gray-600"}`}
                                  role="option"
                                  aria-selected={selectedIndustry === ind}
                              >
                                {ind}
                              </button>
                          ))}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* PLATFORM DROPDOWN */}
                <div className="relative">
                  <button
                      onClick={togglePlatform}
                      className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors py-2"
                      aria-haspopup="listbox"
                      aria-expanded={isPlatformOpen}
                  >
                    {selectedPlatform === "View All" ? "Platform" : selectedPlatform}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${isPlatformOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isPlatformOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                            role="listbox"
                        >
                          {PLATFORMS.map((plt) => (
                              <button
                                  key={plt}
                                  onClick={() => { setSelectedPlatform(plt); setIsPlatformOpen(false); }}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${selectedPlatform === plt ? "text-primary font-bold bg-gray-50" : "text-gray-600"}`}
                                  role="option"
                                  aria-selected={selectedPlatform === plt}
                              >
                                {plt}
                              </button>
                          ))}
                        </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* GRID */}
            {loading ? (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[400px]">
                  {filteredStudies.length > 0 ? (
                      filteredStudies.map((study, index) => {
                        const remainder = index % 3;
                        let initialAnim = {};
                        if (remainder === 0) initialAnim = { opacity: 0, x: -60 };
                        else if (remainder === 1) initialAnim = { opacity: 0, scale: 0.85, y: 40 };
                        else initialAnim = { opacity: 0, x: 60 };

                        const displayImage = study.heroImage || study.image;

                        return (
                            <motion.div
                                key={study.id}
                                layout
                                initial={initialAnim}
                                animate={{ opacity: 1, x: 0, scale: 1, y: 0 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                                role="article"
                            >
                              <Link
                                  to={`/casestudy/${study.id}`}
                                  className="block h-full flex flex-col"
                                  aria-label={`View case study: ${study.title}`}
                                  onClick={() => trackInsightView(study.id)} // 👈 TRIGGER CLICK ON LINK
                              >
                                {/* Image */}
                                <div className="relative aspect-video overflow-hidden bg-gray-100">
                                  {displayImage ? (
                                      <img
                                          src={displayImage}
                                          alt={study.title}
                                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                          loading="lazy"
                                      />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <span className="text-xs">No Image</span>
                                      </div>
                                  )}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex gap-4 flex-grow">
                                  {study.brandLogo && (
                                      <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full bg-white border border-gray-100 p-1 flex items-center justify-center overflow-hidden">
                                        <img src={study.brandLogo} alt={`${study.author} Logo`} className="w-full h-full object-contain" />
                                      </div>
                                  )}

                                  <div className="flex flex-col items-start w-full">
                                    <div className="w-full flex justify-between items-center mb-2">
                                        <span className="text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-wider">
                                            {study.category}
                                        </span>
                                      {/* ✅ VIEW COUNTER DISPLAY (Added discreetly) */}
                                      <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                        <TrendingUp size={10} />
                                        {formatViews(study.manual_base, study.real_clicks)}
                                      </div>
                                    </div>

                                    <h3 className="text-base md:text-lg font-bold text-gray-900 leading-tight mb-6 line-clamp-3">
                                      {study.title}
                                    </h3>

                                    <div className="mt-auto pt-4 w-full">
                                      <button className="w-full text-xs font-bold uppercase tracking-wider border border-gray-300 py-3 px-4 rounded hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                                        View Case Study
                                        <ArrowRight size={14} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                        );
                      })
                  ) : (
                      <div className="col-span-full py-20 text-center text-gray-500">
                        <p className="text-lg">No case studies found for this selection.</p>
                        <button
                            onClick={() => { setSelectedIndustry("View All"); setSelectedPlatform("View All"); }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                          Clear Filters
                        </button>
                      </div>
                  )}
                </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default Insights;