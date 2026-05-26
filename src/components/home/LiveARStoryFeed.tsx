import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, memo } from "react";
import {
    ArrowRight,
    Eye,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Star,
    ShieldCheck,
    User
} from "lucide-react";
import { Link } from "react-router-dom";

// --- 12 DISTINCT DATA POINTS ---
const ALL_VIDEOS = Array.from({ length: 12 }, (_, i) => `/work-video-${i + 1}.mp4`);

const STORY_DATA = [
    { id: 1, brand: "SUGAR", views: "36.7K", likes: "2.4K", shares: "1.1K" },
    { id: 2, brand: "Flipkart", views: "18.9K", likes: "1.2K", shares: "450" },
    { id: 3, brand: "Arexa", views: "21.8K", likes: "3.1K", shares: "890" },
    { id: 4, brand: "Nike", views: "45.2K", likes: "5.8K", shares: "2.2K" },
    { id: 5, brand: "Sephora", views: "15.3K", likes: "900", shares: "300" },
    { id: 6, brand: "L'Oreal", views: "28.4K", likes: "4.2K", shares: "1.5K" },
    { id: 7, brand: "Adidas", views: "33.1K", likes: "3.7K", shares: "1.8K" },
    { id: 8, brand: "Puma", views: "12.6K", likes: "850", shares: "210" },
    { id: 9, brand: "Myntra", views: "41.5K", likes: "6.1K", shares: "2.9K" },
    { id: 10, brand: "Nykaa", views: "27.9K", likes: "2.8K", shares: "950" },
    { id: 11, brand: "H&M", views: "19.2K", likes: "1.5K", shares: "500" },
    { id: 12, brand: "Zara", views: "38.6K", likes: "5.3K", shares: "2.1K" },
];

// --- OPTIMIZED AUTO-PLAY VIDEO COMPONENT ---
const AutoPlayVideo = memo(({ src, loop, onEnded, isActive }: { src: string; loop: boolean; onEnded?: () => void; isActive: boolean }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!videoRef.current) return;

        if (isActive) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [isActive, src]);

    return (
        <video
            ref={videoRef}
            src={src}
            muted
            loop={loop}
            onEnded={onEnded}
            playsInline
            className="w-full h-full object-cover pointer-events-none data-[loaded=false]:opacity-0 transition-opacity duration-300"
            style={{ willChange: "transform" }}
        />
    );
});

// --- MAIN CAROUSEL COMPONENT ---
const LiveARStoryFeed = () => {
    const [currentIndex, setCurrentIndex] = useState(3);
    const [isMobile, setIsMobile] = useState(false);

    // Track window width safely outside the render loop
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener("resize", checkMobile, { passive: true });
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % STORY_DATA.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + STORY_DATA.length) % STORY_DATA.length);
    };

    return (
        <section className="pt-3 pb-6 lg:pt-1 lg:pb-10 bg-[#F8F9FE] relative overflow-hidden font-sans w-full chunk-gpu">

            <div className="w-[96%] max-w-[1600px] mx-auto px-4 relative z-10">
                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl lg:text-[48px] font-black text-[#0F172A] leading-tight mb-2 tracking-tight">
                            Live AR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#E13684]">Story Feed</span>
                        </h2>
                        <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                            Real campaigns. Real people. Real impact. <br className="hidden md:block" />
                            Explore how brands are creating memorable AR experiences.
                        </p>
                    </div>

                    <Link
                        to="/work"
                        className="hidden md:flex flex-shrink-0 items-center gap-2 bg-white border border-slate-200 px-5 py-2.5 rounded-full text-xs font-bold text-[#0F172A] shadow-sm hover:shadow-md hover:border-[#7B61FF]/30 transition-all group mt-2"
                    >
                        View All Stories
                        <div className="w-5 h-5 rounded-full bg-[#7B61FF] flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                            <ArrowRight size={12} strokeWidth={3} />
                        </div>
                    </Link>
                </div>
            </div>

            {/* --- COMPACT FULL WIDTH CAROUSEL BANNER BAR --- */}
            <div className="relative w-full h-[380px] md:h-[480px] flex items-center justify-center overflow-hidden bg-slate-100/50 select-none">

                {/* Navigation Controls */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 md:left-12 z-[60] w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-slate-100 text-[#0F172A] hover:bg-[#7B61FF] hover:text-white transition-all group"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                    onClick={handleNext}
                    className="absolute right-4 md:right-12 z-[60] w-10 h-10 md:w-14 md:h-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md border border-slate-100 text-[#0F172A] hover:bg-[#7B61FF] hover:text-white transition-all group"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Cards Track Container */}
                <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1500px" }}>
                    <AnimatePresence initial={false} mode="popLayout">
                        {STORY_DATA.map((story, index) => {
                            let distance = index - currentIndex;

                            const totalItems = STORY_DATA.length;
                            if (distance > totalItems / 2) distance -= totalItems;
                            if (distance < -totalItems / 2) distance += totalItems;

                            const isCenter = distance === 0;
                            const isVisible = Math.abs(distance) <= 4;

                            // If card is far off-screen, do not render it to rescue DOM performance
                            if (!isVisible) return null;

                            // Using cached React state instead of polling window.innerWidth inline
                            const xOffset = distance * (isMobile ? 130 : 185);
                            const scale = isCenter ? 1 : Math.max(0.45, 1 - Math.abs(distance) * 0.14);
                            const zIndex = 30 - Math.abs(distance);
                            const opacity = isCenter ? 1 : Math.abs(distance) === 4 ? 0.15 : Math.abs(distance) === 3 ? 0.45 : 0.8;
                            const rotateY = distance * -8;

                            return (
                                <motion.div
                                    key={story.id}
                                    initial={false}
                                    animate={{
                                        x: xOffset,
                                        scale: scale,
                                        zIndex: zIndex,
                                        opacity: opacity,
                                        rotateY: rotateY,
                                    }}
                                    transition={{ type: "spring", stiffness: 180, damping: 24, mass: 0.8 }}
                                    className="absolute h-[340px] md:h-[440px] w-[190px] md:w-[248px] rounded-[2rem] overflow-hidden shadow-xl"
                                    style={{
                                        transformStyle: "preserve-3d",
                                        boxShadow: isCenter ? "0 25px 50px -12px rgba(123, 97, 255, 0.4)" : "0 8px 24px rgba(0,0,0,0.1)",
                                        willChange: "transform, opacity"
                                    }}
                                >
                                    <div className={`w-full h-full relative bg-slate-900 border-[3px] transition-colors duration-300 ${isCenter ? 'border-[#7B61FF]' : 'border-white/20'}`}>

                                        {/* Pass center/visibility check to avoid background video playback load */}
                                        <AutoPlayVideo
                                            src={ALL_VIDEOS[index % ALL_VIDEOS.length]}
                                            loop={!isCenter}
                                            onEnded={isCenter ? handleNext : undefined}
                                            isActive={isCenter || Math.abs(distance) <= 1}
                                        />

                                        {/* --- OVERLAYS --- */}
                                        <div className="absolute top-0 left-0 w-full p-4 hidden md:flex justify-end items-start bg-gradient-to-b from-black/80 to-transparent z-20">
                                            <div className="flex items-center gap-1 bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 border border-white/20">
                                                <Eye className="w-3 h-3 text-white" />
                                                <span className="text-white text-[11px] font-bold">{story.views}</span>
                                            </div>
                                        </div>

                                        {isCenter && (
                                            <div className="absolute right-3 bottom-16 hidden md:flex flex-col items-center gap-3 z-20">
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                                                        <Eye className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-white text-[10px] font-bold drop-shadow-md">{story.views}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                                    </div>
                                                    <span className="text-white text-[10px] font-bold drop-shadow-md">{story.likes}</span>
                                                </div>
                                                <div className="flex flex-col items-center gap-0.5">
                                                    <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-md">
                                                        <Share2 className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-white text-[10px] font-bold drop-shadow-md">{story.shares}</span>
                                                </div>
                                            </div>
                                        )}

                                        {isCenter && (
                                            <div className="absolute bottom-0 left-0 w-full p-3 hidden md:flex justify-end items-end bg-gradient-to-t from-black/70 to-transparent z-20 h-16">
                                                <button className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#7B61FF] to-[#E13684] p-[1.5px] shadow-lg hover:scale-105 transition-transform">
                                                    <div className="w-full h-full rounded-lg bg-slate-900 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-white" />
                                                    </div>
                                                </button>
                                            </div>
                                        )}

                                        {isCenter && (
                                            <div className="absolute top-[52px] right-4 bg-[#E13684] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-sm tracking-wider animate-pulse z-20">
                                                <div className="absolute inset-0 bg-[#E13684] rounded-sm animate-ping opacity-75" />
                                                <span className="relative z-10">LIVE</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* Content Bottom Viewport Wrapper Container */}
            <div className="w-[96%] max-w-[1600px] mx-auto px-4 relative z-10">
                <div className="flex justify-center items-center gap-1.5 mt-4 mb-6">
                    {STORY_DATA.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-[#7B61FF]' : 'w-1.5 bg-[#7B61FF]/30'}`}
                        />
                    ))}
                </div>

                {/* --- BOTTOM CTA BANNER --- */}
                <div className="w-full bg-[#16122C] rounded-[2.5rem] py-5 px-8 md:py-8 md:px-12 relative overflow-hidden flex flex-col xl:flex-row items-center justify-between shadow-2xl border border-white/5">
                    <img
                        src="/card9.png"
                        alt="Background Layout"
                        className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-40 pointer-events-none"
                    />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border-[40px] border-[#7B61FF]/10 blur-md pointer-events-none z-0" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border-[20px] border-[#E13684]/10 blur-xl pointer-events-none z-0" />

                    <div className="w-full xl:w-1/2 relative z-10 text-center xl:text-left mb-4 xl:mb-0">
                        <h3 className="text-3xl md:text-[40px] font-black text-white mb-4 leading-[1.1] tracking-tight">
                            Ready to create your <br className="hidden md:block"/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F55FF] to-[#E13684]">next immersive campaign?</span>
                        </h3>
                        <p className="text-[#94A3B8] text-base md:text-lg max-w-lg mx-auto xl:mx-0 leading-relaxed">
                            We help brands build powerful AR experiences that engage, connect and deliver real results.
                        </p>
                    </div>

                    <div className="w-full xl:w-1/2 relative z-10 flex flex-col items-center xl:items-end gap-6">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <a
                                href="https://calendly.com/chhavigarg/arexa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#7B61FF] to-[#9F55FF] text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all shadow-[0_10px_20px_rgba(123,97,255,0.2)] hover:shadow-[0_15px_30px_rgba(123,97,255,0.4)] hover:-translate-y-1 w-full sm:w-auto"
                            >
                                Map Out Your Strategy
                                <Calendar size={18} />
                            </a>

                            <Link
                                to="/work"
                                className="hidden sm:flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white px-8 py-3.5 rounded-xl text-base font-bold transition-all hover:bg-white/5 w-full sm:w-auto group"
                            >
                                View Full Portfolio
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="hidden sm:flex flex-wrap items-center justify-center xl:justify-end gap-6 md:gap-10 pt-5 border-t border-white/10 w-full sm:w-auto">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#16122C] bg-slate-800 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="User" className="w-full h-full object-cover opacity-80" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[#94A3B8] text-xs font-medium">
                                    500+ brands trust <span className="text-[#7B61FF] font-bold">Arexa</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 p-1.5 rounded-md">
                                    <Star className="w-4 h-4 text-white fill-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white text-xs font-bold leading-tight">4.9/5</span>
                                    <span className="text-[#94A3B8] text-[10px] leading-tight">Clutch Rating</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-white" strokeWidth={1.5} />
                                <div className="flex flex-col">
                                    <span className="text-white text-xs font-bold leading-tight">Trusted by</span>
                                    <span className="text-[#94A3B8] text-[10px] leading-tight">Global Brands</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LiveARStoryFeed;