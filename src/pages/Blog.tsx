import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { BookOpen, TrendingUp, Calendar, Share2, ArrowUpRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAnalytics } from "@/hooks/useAnalytics";

// --- 1. CONFIGURATION ---
const API_URL = "https://arexa.co/api/cms.php?type=blogs";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
  hashnodeUrl: string;
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

  if (total >= 1000) {
    return (total / 1000).toFixed(1) + 'k views';
  }
  return total + ' views';
};

// --- 2. COMPONENTS ---

// 1. Hero Left Card (Updated to show Views)
const MainHeroCard = ({ post }: { post: BlogPost }) => {
  const { trackBlogView } = useAnalytics();

  return (
      <motion.a
          href={post.hashnodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBlogView(post.id)}
          className="group relative flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500"
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-full aspect-video lg:aspect-auto lg:h-[65%] overflow-hidden">
          <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"/> Featured Story
          </div>
        </div>

        <div className="flex flex-col flex-grow p-5 md:p-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors leading-tight">
            {post.title}
          </h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base line-clamp-3 md:line-clamp-4 flex-grow">
            {post.excerpt}
          </p>

          <div className="mt-auto flex items-center flex-wrap gap-4 text-xs md:text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">A</div>
              <span className="text-gray-900">{post.author}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            {/* ✅ ADDED: View Count */}
            <div className="w-1 h-1 bg-gray-300 rounded-full" />
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>{formatViews(post.manual_base, post.real_clicks)}</span>
            </div>
          </div>
        </div>
      </motion.a>
  );
};

// 2. Hero Right Cards (Already had views, kept it)
const SideHeroCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const { trackBlogView } = useAnalytics();

  return (
      <motion.a
          href={post.hashnodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBlogView(post.id)}
          className="group flex flex-col md:flex-row lg:flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: index * 0.2, type: "spring", bounce: 0.3 }}
      >
        <div className="relative w-full md:w-2/5 lg:w-full aspect-video md:aspect-auto lg:aspect-[2/1] overflow-hidden shrink-0">
          <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5 flex flex-col justify-center w-full">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>

          <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 font-medium mt-auto">
            <span className="truncate max-w-[100px] text-gray-700">{post.author}</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              {/* ✅ Views Display */}
              <span>{formatViews(post.manual_base, post.real_clicks)}</span>
            </div>
          </div>
        </div>
      </motion.a>
  );
};

// 3. Grid Cards (Updated to show Views)
const StandardGridCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const { trackBlogView } = useAnalytics();

  let initialAnim = {};
  const remainder = index % 3;

  if (remainder === 0) {
    initialAnim = { opacity: 0, x: -100 };
  } else if (remainder === 1) {
    initialAnim = { opacity: 0, scale: 0.8, y: 50 };
  } else {
    initialAnim = { opacity: 0, x: 100 };
  }

  return (
      <motion.a
          href={post.hashnodeUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBlogView(post.id)}
          className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
          initial={initialAnim}
          whileInView={{ opacity: 1, x: 0, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="relative aspect-video w-full overflow-hidden">
          <img
              src={post.image}
              alt={`Read ${post.title}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur text-black px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Read Article <ArrowUpRight className="w-4 h-4"/>
            </div>
          </div>
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-3 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider border border-gray-200">
                {post.category}
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {post.excerpt}
          </p>
          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
            <span className="font-semibold text-gray-800">{post.author}</span>
            <div className="flex items-center gap-3">
              {/* ✅ ADDED: View Count */}
              <div className="flex items-center gap-1 text-gray-400">
                <TrendingUp className="w-3 h-3" />
                <span>{formatViews(post.manual_base, post.real_clicks)}</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full" />
              <div className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                <span>{post.readTime}</span>
              </div>
              <Share2 className="w-3 h-3 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </motion.a>
  );
};

// --- 3. MAIN PAGE COMPONENT ---

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(API_URL);
        setPosts(data);
      } catch (error) {
        console.error("Failed to load blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // SEO & Schema
  useEffect(() => {
    if (loading) return;
    document.title = "Arexa Insights | AR, VR, WebXR & Immersive Marketing Blog";
    const metaDesc = document.querySelector('meta[name="description"]');
    const descriptionContent = "Explore the latest trends in Augmented Reality (AR), Virtual Reality (VR), WebXR, and Immersive Marketing...";

    if (metaDesc) {
      metaDesc.setAttribute("content", descriptionContent);
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }
  }, [posts, loading]);

  const mainHeroPost = posts.length > 0 ? posts[0] : null;
  const sideHeroPosts = posts.length > 1 ? posts.slice(1, 3) : [];
  const gridPosts = posts.length > 3 ? posts.slice(3) : [];

  return (
      <main className="min-h-screen bg-[#F8F9FA]">
        <Header />

        <div className="pt-28 pb-20 w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
              <div className="h-[60vh] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium">Loading Insights...</p>
              </div>
          ) : (
              <>
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 w-full">
                  <div className="lg:col-span-2 w-full h-full min-h-[400px] lg:min-h-[500px]">
                    {mainHeroPost && <MainHeroCard post={mainHeroPost} />}
                  </div>
                  <div className="lg:col-span-1 flex flex-col gap-6 lg:gap-8 w-full h-full">
                    {sideHeroPosts.map((post, index) => (
                        <div key={post.id} className="flex-1 min-h-[180px]">
                          <SideHeroCard post={post} index={index} />
                        </div>
                    ))}
                  </div>
                </section>

                <section className="text-center max-w-4xl mx-auto mb-16 px-4">
                  <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                  >
                    <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-4">
                      Our Vision
                    </p>
                    <h2 className="text-gray-800 text-lg md:text-xl lg:text-2xl leading-relaxed font-medium">
                      A future-ready ecosystem built to empower modern-age
                      <span className="text-primary font-bold"> brands & creators</span> through immersive technology.
                      At <span className="text-foreground font-bold">Arexa</span>, we design and deliver credible AR, VR, and XR solutions that make adoption seamless and results-driven,
                      ensuring a truly
                      <span className="italic"> immersive experience</span>.
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mt-8 rounded-full" />
                  </motion.div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
                  {gridPosts.map((post, index) => (
                      <StandardGridCard key={post.id} post={post} index={index} />
                  ))}
                </section>
              </>
          )}
        </div>
        <Footer />
      </main>
  );
};

export default Blog;