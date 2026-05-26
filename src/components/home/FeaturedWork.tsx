import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Calendar,
  Users,
  TrendingUp,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";

// --- CONFIGURATION ---
const projects = [
  {
    number: "01",
    category: "Retail / Fashion",
    title: "AR Try-On",
    description: "Enabling customers to virtually try products before purchase, reducing uncertainty and increasing buying confidence.",
    videos: ["/work-video-1.mp4", "/work-video-83.mp4", "/work-video-11.mp4"],
    results: [
      { value: "3.8M+", label: "Try-Ons" },
      { value: "42%", label: "Higher Engagement" },
      { value: "2.1x", label: "Purchase Intent" },
    ],
  },
  {
    number: "02",
    category: "Marketing",
    title: "Festive AR",
    description: "Seasonal AR experiences designed to boost brand recall and participation during high-traffic festive campaigns.",
    videos: ["/work-video-33.mp4", "/work-video-21.mp4", "/work-video-32.mp4"],
    results: [
      { value: "6.5M+", label: "Campaign Reach" },
      { value: "3.9M", label: "Interactions" },
      { value: "61%", label: "Brand Recall Lift" },
    ],
  },
  {
    number: "03",
    category: "Gaming",
    title: "Game",
    description: "Interactive AR games crafted to drive repeat usage, social sharing, competitiveness and time spent with the brand.",
    videos: ["/work-video-4.mp4", "/work-video-72.mp4", "/work-video-75.mp4"],
    results: [
      { value: "5.2M+", label: "Game Plays" },
      { value: "2.6x", label: "Repeat Sessions" },
      { value: "4.1M", label: "Social Shares" },
    ],
  },
  {
    number: "04",
    category: "Brand Experience",
    title: "Immersive AR",
    description: "High-fidelity AR experiences that immerse users in storytelling, environments, and interactive brand moments.",
    videos: ["/work-video-5.mp4", "/work-video-49.mp4", "/work-video-8.mp4"],
    results: [
      { value: "9M+", label: "Experience Views" },
      { value: "3.4x", label: "Dwell Time" },
      { value: "88%", label: "Completion Rate" },
    ],
  },
  {
    number: "05",
    category: "Beauty",
    title: "Makeup",
    description: "Real-time AR makeup experiences allowing users to test products with accurate face tracking.",
    videos: ["/work-video-30.mp4", "/work-video-25.mp4", "/work-video-94.mp4"],
    results: [
      { value: "4.9M+", label: "Virtual Trials" },
      { value: "64%", label: "Add-to-Cart Rate" },
      { value: "30%", label: "Reduced Returns" },
    ],
  },
  {
    number: "06",
    category: "Advertising",
    title: "Promotional AR",
    description: "Short-format AR activations built for launches and promotions to maximize reach and interaction.",
    videos: ["/work-video-7.mp4", "/work-video-24.mp4", "/work-video-79.mp4"],
    results: [
      { value: "11M+", label: "Impressions" },
      { value: "5.1%", label: "Interaction Rate" },
      { value: "2.3x", label: "CTR vs Usual Ads" },
    ],
  },
  {
    number: "07",
    category: "E-commerce",
    title: "Product Showcase",
    description: "AR-powered product visualization that lets users explore features, scale, and details before buying.",
    videos: ["/work-video-48.mp4", "/work-video-20.mp4", "/work-video-57.mp4"],
    results: [
      { value: "7.4M+", label: "Product Views" },
      { value: "53%", label: "Higher Engagement" },
      { value: "1.9x", label: "Conversion Lift" },
    ],
  },
  {
    number: "08",
    category: "Social / Creator",
    title: "AR for UGC",
    description: "AR filters and lenses designed to encourage user-generated content and organic brand amplification.",
    videos: ["/work-video-77.mp4", "/work-video-68.mp4", "/work-video-93.mp4"],
    results: [
      { value: "14M+", label: "User Creations" },
      { value: "6.2M", label: "Shares" },
      { value: "72%", label: "Organic Reach" },
    ],
  },
];

// --- Hook: Optimized MatchMedia Breakpoint Identifier ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const listener = (e) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);
  return isMobile;
};

// --- Core Media Engine: Isolated Native Pipeline ---
const LazyVideo = memo(({ src, className, order }: { src: string; className?: string; order: number }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        },
        { rootMargin: "120px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!shouldLoad) {
    return <div ref={videoRef as any} className={`${className} bg-slate-50`} />;
  }

  return (
      <video
          ref={videoRef}
          src={src}
          muted
          loop
          playsInline
          preload="metadata"
          data-stagger-order={order}
          className={`${className} will-change-transform`}
      />
  );
});

// Staggered Layout Matrix (Desktop View)
const StaggeredVideoCard = memo(({ videos }: { videos: string[] }) => {
  return (
      <div className="relative w-full h-[150px] lg:h-[185px] flex items-center justify-center will-change-transform">
        {/* Left Phone Frame */}
        <div className="absolute w-[42%] aspect-[9/16] right-[66%] top-[10%] rounded-[1rem] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.06)] border-4 border-white bg-slate-100 transform -rotate-3 transition-transform duration-500 group-hover:-rotate-6 z-10 will-change-transform">
          <LazyVideo src={videos[1] || videos[0]} order={1} className="w-full h-full object-cover" />
        </div>

        {/* Right Phone Frame */}
        <div className="absolute w-[42%] aspect-[9/16] left-[66%] top-[10%] rounded-[1rem] overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.06)] border-4 border-white bg-slate-100 transform rotate-3 transition-transform duration-500 group-hover:rotate-6 z-10 will-change-transform">
          <LazyVideo src={videos[2] || videos[0]} order={2} className="w-full h-full object-cover" />
        </div>

        {/* Center Phone Frame */}
        <div className="absolute w-[48%] aspect-[9/16] z-20 rounded-[1.25rem] overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.1)] border-4 border-white bg-slate-100 transform transition-transform duration-500 will-change-transform">
          <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-md rounded-full px-1.5 py-0.5 flex items-center gap-1 z-30 pointer-events-none">
            <svg viewBox="0 0 24 24" fill="white" className="w-2.5 h-2.5"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span className="text-[8px] text-white font-medium">12.6K</span>
          </div>
          <LazyVideo src={videos[0]} order={0} className="w-full h-full object-cover" />
        </div>
      </div>
  );
});

// Single Unified Card Component
const ProjectCard = memo(({ project, index }: { project: typeof projects[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const interactiveContainerRef = useRef<HTMLAnchorElement>(null);
  const isCardInView = useInView(cardRef, { once: true, margin: "-30px" });
  const isMobile = useIsMobile();
  const activeTimeouts = useRef<number[]>([]);

  useEffect(() => {
    const triggerNode = interactiveContainerRef.current;
    if (!triggerNode) return;

    const executePlaybackPipeline = () => {
      // Flush any hanging/pending states safely
      activeTimeouts.current.forEach(clearTimeout);
      activeTimeouts.current = [];

      const structuralVideoNodes = Array.from(triggerNode.querySelectorAll("video"));

      // Sequence delivery to mitigate initial layout composition thrashing
      structuralVideoNodes.forEach((video) => {
        const staggerOrderAttr = video.getAttribute("data-stagger-order");
        const parsedOrder = staggerOrderAttr ? parseInt(staggerOrderAttr, 10) : 0;
        const computedDelayValue = parsedOrder * 100;

        const taskToken = window.setTimeout(() => {
          video.play().catch(() => {});
        }, computedDelayValue);

        activeTimeouts.current.push(taskToken);
      });
    };

    const executeHaltPipeline = () => {
      activeTimeouts.current.forEach(clearTimeout);
      activeTimeouts.current = [];

      const structuralVideoNodes = triggerNode.querySelectorAll("video");
      structuralVideoNodes.forEach((video) => {
        video.pause();
      });
    };

    // Fast-path hardware bindings bypassing Virtual DOM diff loops entirely
    triggerNode.addEventListener("mouseenter", executePlaybackPipeline);
    triggerNode.addEventListener("mouseleave", executeHaltPipeline);
    triggerNode.addEventListener("touchstart", executePlaybackPipeline, { passive: true });
    triggerNode.addEventListener("touchend", executeHaltPipeline, { passive: true });

    return () => {
      triggerNode.removeEventListener("mouseenter", executePlaybackPipeline);
      triggerNode.removeEventListener("mouseleave", executeHaltPipeline);
      triggerNode.removeEventListener("touchstart", executePlaybackPipeline);
      triggerNode.removeEventListener("touchend", executeHaltPipeline);
      activeTimeouts.current.forEach(clearTimeout);
    };
  }, [isMobile]);

  const fetchCategorizedMetricIcon = (pos: number) => {
    if (pos === 0) return <Users className="w-[18px] h-[18px] text-[#5C4EE5]" strokeWidth={2.5} />;
    if (pos === 1) return <TrendingUp className="w-[18px] h-[18px] text-[#5C4EE5]" strokeWidth={2.5} />;
    return <Target className="w-[18px] h-[18px] text-[#5C4EE5]" strokeWidth={2.5} />;
  };

  return (
      <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 15 }}
          animate={isCardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{
            duration: 0.4,
            delay: (index % 3) * 0.04,
            ease: "easeOut",
          }}
          className="h-full"
      >
        <Link
            ref={interactiveContainerRef}
            to="/work"
            className="group flex flex-col justify-between h-full rounded-[1.5rem] lg:rounded-[2rem] border border-slate-100 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(92,78,229,0.06)] hover:border-[#5C4EE5]/15 transition-all duration-500 relative overflow-hidden will-change-transform"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 via-transparent to-pink-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {!isMobile ? (
              /* --- DESKTOP RENDER TARGET --- */
              <div className="flex flex-col h-full justify-between flex-1 relative z-10 p-4 lg:p-5">
                <div className="flex flex-row gap-4 flex-1">
                  <div className="w-[45%] flex flex-col items-start pt-1">
                    <div className="flex items-center gap-2 mb-3">
                  <span className="text-[#5C4EE5] bg-white px-2 py-0.5 rounded border border-[#5C4EE5]/20 text-[10px] font-bold shadow-sm">
                    {project.number}
                  </span>
                      <span className="text-[#D946EF] bg-[#D946EF]/10 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide">
                    {project.category}
                  </span>
                    </div>

                    <h3 className="text-[24px] lg:text-[26px] font-extrabold text-[#0F172A] mb-2 leading-tight group-hover:text-[#5C4EE5] transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-[13px] text-slate-500 mb-2 leading-relaxed pr-1">
                      {project.description}
                    </p>
                  </div>

                  <div className="w-[55%] relative flex items-center justify-center mt-0">
                    <StaggeredVideoCard videos={project.videos} />
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between relative z-10">
                  {project.results.map((result, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {fetchCategorizedMetricIcon(i)}
                        <div className="flex flex-col">
                          <span className="text-[14px] lg:text-[15px] font-bold text-[#0F172A] leading-none mb-1.5">{result.value}</span>
                          <span className="text-[11px] lg:text-[12px] text-slate-500 font-medium leading-none">{result.label}</span>
                        </div>
                      </div>
                  ))}
                </div>
              </div>
          ) : (
              /* --- MOBILE RENDER TARGET --- */
              <div className="flex flex-col h-full relative z-10 w-full p-4 pb-4">
                <div className="flex justify-between items-center mb-5">
                  <div className="flex items-center gap-2">
                <span className="text-[#5C4EE5] bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px] font-extrabold shadow-sm">
                  {project.number}
                </span>
                    <span className="text-[#E13684] bg-[#E13684]/10 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide">
                  {project.category}
                </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-[#5C4EE5]">
                      <ArrowUpRight size={14} strokeWidth={2} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-row gap-3 mb-5">
                  <div className="w-[45%] flex flex-col items-start pt-1">
                    <h3 className="text-[20px] font-extrabold text-[#0F172A] mb-3 leading-tight pr-2">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-1.5 mb-4 text-slate-400">
                      <Calendar size={12} className="text-[#5C4EE5]" />
                      <span className="text-[10px] font-bold">Nov 2024 - Jan 2025</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed pr-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="w-[55%] flex flex-row gap-2 h-[210px]">
                    <div className="w-[55%] h-full rounded-[14px] overflow-hidden relative border border-slate-100 will-change-transform">
                      <LazyVideo src={project.videos[0]} order={0} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0F172A" className="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
                        </div>
                      </div>
                    </div>

                    <div className="w-[45%] h-full flex flex-col gap-2">
                      <div className="w-full h-[calc(50%-4px)] rounded-[12px] overflow-hidden relative border border-slate-100 will-change-transform">
                        <LazyVideo src={project.videos[1] || project.videos[0]} order={1} className="w-full h-full object-cover" />
                      </div>
                      <div className="w-full h-[calc(50%-4px)] rounded-[12px] overflow-hidden relative border border-slate-100 will-change-transform">
                        <LazyVideo src={project.videos[2] || project.videos[0]} order={2} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100/60 rounded-[14px] p-4 flex items-center justify-between mt-auto">
                  {project.results.map((result, i) => (
                      <div key={i} className="flex flex-col gap-1 items-start w-1/3 pl-1">
                        <div className="flex items-center gap-1.5">
                          <div className="text-[#E13684]">
                            {i === 0 ? <Users size={14} strokeWidth={2.5} /> : i === 1 ? <TrendingUp size={14} strokeWidth={2.5} /> : <Target size={14} strokeWidth={2.5} />}
                          </div>
                          <span className="text-[14px] font-black text-[#E13684] leading-none tracking-tight">{result.value}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium leading-tight pt-0.5">{result.label}</span>
                      </div>
                  ))}
                </div>
              </div>
          )}
        </Link>
      </motion.div>
  );
});

// Main Section Container
const FeaturedWork = () => {
  const sectionTrackingRef = useRef(null);
  const isSectionInView = useInView(sectionTrackingRef, { once: true, margin: "-100px" });

  return (
      <section
          className="py-12 lg:pt-20 lg:pb-16 bg-[#F8F9FE] relative overflow-hidden"
          ref={sectionTrackingRef}
      >
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-[96%] max-w-[1800px] mx-auto px-2 md:px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 w-full">
            <div className="text-left w-full">
              <motion.h2
                  initial={{ opacity: 0, y: 15 }}
                  animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-3xl md:text-4xl lg:text-[3rem] xl:text-[3.25rem] font-black text-[#1A1A24] leading-tight tracking-tight m-0"
              >
                Immersive Campaigns That Actually <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F55FF] via-[#E13684] to-[#FF004D]">Performed</span>
              </motion.h2>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                className="shrink-0 w-full md:w-auto flex justify-start md:justify-end"
            >
              <Link to="/work" className="inline-flex items-center justify-center gap-3 w-full md:w-auto bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-full font-bold text-sm text-[#0F172A] hover:shadow-md hover:border-slate-300 transition-all group">
                View All Projects
                <div className="bg-[#5C4EE5] text-white p-1.5 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight size={14} strokeWidth={3} />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {projects.map((project, index) => (
                <ProjectCard key={project.number} project={project} index={index} />
            ))}

            {/* Persistent Link Visual Accent (9th Element) */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={isSectionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
                className="h-full hidden md:block"
            >
              <Link
                  to="/work"
                  className="group flex flex-col justify-center items-center h-full rounded-[1.5rem] lg:rounded-[2rem] border-2 border-dashed border-slate-200 bg-transparent hover:bg-[#5C4EE5]/5 hover:border-[#5C4EE5]/30 hover:shadow-lg transition-all duration-500 min-h-[350px] p-6 lg:p-7"
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-white shadow-sm flex items-center justify-center text-[#5C4EE5] group-hover:bg-[#5C4EE5] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <ArrowUpRight size={28} strokeWidth={2.5} />
                </div>
                <h3 className="text-[22px] lg:text-[24px] font-extrabold text-[#0F172A] mb-2 group-hover:text-[#5C4EE5] transition-colors duration-300">
                  View More Projects
                </h3>
                <p className="text-[14px] lg:text-[15px] text-slate-500 text-center max-w-[80%] leading-relaxed">
                  Discover more measurable, high-fidelity immersive campaigns.
                </p>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

export default FeaturedWork;