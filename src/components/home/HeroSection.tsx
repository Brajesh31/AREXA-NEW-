import { motion, PanInfo } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, memo, useCallback } from "react";
import axios from "axios";

// TypeScript Interface for our Database structure
interface HeroVideo {
  video_url: string;
  thumbnail_url: string;
  position_index: number;
}

// Fallback data using .webm and thumbnails
const fallbackVideos: HeroVideo[] = [
  { video_url: "/hero-video-1.webm", thumbnail_url: "/hero-video-1-thumbnail.jpg", position_index: 0 },
  { video_url: "/hero-video-2.webm", thumbnail_url: "/hero-video-2-thumbnail.jpg", position_index: 1 },
  { video_url: "/hero-video-3.webm", thumbnail_url: "/hero-video-3-thumbnail.jpg", position_index: 2 },
  { video_url: "/hero-video-4.webm", thumbnail_url: "/hero-video-4-thumbnail.jpg", position_index: 3 },
  { video_url: "/hero-video-6.webm", thumbnail_url: "/hero-video-6-thumbnail.jpg", position_index: 4 },
];

// Memoized Phone Frame
const PhoneFrame = memo(({
                           videoData,
                           position,
                           isCenter,
                           isVisible,
                           isMobile
                         }: {
  videoData: HeroVideo;
  position: number;
  isCenter: boolean;
  isVisible: boolean;
  isMobile: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      const fullVideoPath = videoData.video_url.startsWith('http')
          ? videoData.video_url
          : window.location.origin + videoData.video_url;

      if (video.src !== fullVideoPath) {
        video.src = videoData.video_url;
        video.load();
      }

      if (isCenter) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            video.muted = true;
            video.play().catch(() => {});
          });
        }
      } else {
        video.pause();
        if (video.currentTime !== 0) video.currentTime = 0;
      }
    } else {
      if (video.getAttribute('src')) {
        video.pause();
        video.removeAttribute('src');
        video.load();
        setIsLoaded(false);
      }
    }
  }, [isVisible, position, videoData.video_url, isCenter]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setIsLoaded(true);
    if (video.readyState >= 3) setIsLoaded(true);

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("canplay", handleLoaded);

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("canplay", handleLoaded);
    };
  }, []);

  const getTransform = () => {
    const spacing = isMobile ? 85 : 185;
    const xOffset = position * spacing;

    let scale = 1;
    let opacity = 1;
    const zIndex = isCenter ? 30 : 20 - Math.abs(position);

    if (!isCenter) {
      scale = isMobile ? 0.75 : 0.85;
      opacity = isMobile ? 0.6 : 0.8;

      if (Math.abs(position) > 1) {
        scale = isMobile ? 0.6 : 0.75;
        opacity = 0.3;
      }
    }

    return { xOffset, scale, opacity, zIndex };
  };

  const transform = getTransform();

  if (!isVisible) return null;

  return (
      <motion.div
          className="absolute"
          initial={false}
          animate={{
            x: transform.xOffset,
            scale: transform.scale,
            opacity: transform.opacity,
            zIndex: transform.zIndex,
          }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
          }}
          style={{ willChange: 'transform, opacity' }}
      >
        <div className="relative w-[142px] h-[279px] md:w-[177px] md:h-[349px] lg:w-[217px] lg:h-[429px] transition-all duration-300">

          <div className="absolute inset-0 bg-[#0A0A0A] rounded-[28px] md:rounded-[36px] shadow-2xl ring-1 ring-white/10 border border-white/5">

            <div className="absolute inset-[3px] md:inset-[4px] bg-black rounded-[25px] md:rounded-[32px] overflow-hidden">

              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 md:w-20 h-4 md:h-5 bg-black rounded-b-xl z-20" />

              <img
                  src={videoData.thumbnail_url}
                  alt="Thumbnail"
                  // @ts-ignore
                  fetchPriority={isCenter ? "high" : "low"}
                  loading={isCenter ? "eager" : "lazy"}
                  decoding="sync"
                  className="absolute inset-0 w-full h-full object-cover z-0"
              />

              <video
                  ref={videoRef}
                  muted
                  loop
                  playsInline
                  preload={isCenter ? "auto" : "metadata"}
                  className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              />

              {!isCenter && <div className="absolute inset-0 bg-black/40 z-20" />}
            </div>
          </div>

          {isCenter && (
              <motion.div
                  layoutId="active-glow"
                  className="absolute -inset-4 rounded-[50px] bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent -z-10 blur-xl"
              />
          )}
        </div>
      </motion.div>
  );
});

PhoneFrame.displayName = 'PhoneFrame';

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [videos, setVideos] = useState<HeroVideo[]>(fallbackVideos);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/get_hero_videos.php");
        if (response.data.status === "success" && response.data.data.length > 0 && isMounted) {
          setVideos(response.data.data);
        }
      } catch (error) {
        console.warn("Using fallback videos.");
      }
    };

    fetchVideos();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 13000);
    return () => clearInterval(interval);
  }, [activeIndex, videos.length]);

  const nextSlide = useCallback(() => setActiveIndex((prev) => (prev + 1) % videos.length), [videos.length]);
  const prevSlide = useCallback(() => setActiveIndex((prev) => (prev - 1 + videos.length) % videos.length), [videos.length]);

  const getPosition = (index: number) => {
    let diff = index - activeIndex;
    const total = videos.length;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold) nextSlide();
    else if (info.offset.x > threshold) prevSlide();
  };

  return (
      <section className="relative w-full flex flex-col items-center justify-start bg-background overflow-hidden pt-20 md:pt-24 pb-6 md:pb-8">

        <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(to right, #888888 1px, transparent 1px), linear-gradient(to bottom, #888888 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
        />

        <div className="relative z-10 w-full flex flex-col items-center">

          {/* MARGIN ADJUSTMENT: lg:mb-5 specifically tightens the gap on desktop view only */}
          <div className="w-full max-w-[1500px] mx-auto text-center px-4 md:px-8 mb-6 md:mb-8 lg:mb-5">

            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="text-[clamp(2.2rem,8.5vw,4rem)] lg:text-[clamp(3.4rem,5vw,4.35rem)] xl:text-[4.35rem] font-extrabold tracking-tight text-foreground leading-[1.1] md:leading-[1.15]"
            >
              <span className="hidden lg:block">
                <span className="whitespace-nowrap">
                  Building the Future of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">
                    Immersive
                  </span>
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">
                  XR & AI
                </span>
                {" "}Brand Experiences
              </span>

              <span className="block lg:hidden">
                <span className="block whitespace-nowrap">Building the Future of</span>
                <span className="block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">
                  Immersive XR & AI
                </span>
                <span className="block whitespace-nowrap">Brand Experiences</span>
              </span>

            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 md:mt-5 text-base md:text-lg lg:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed"
            >
              High-fidelity AR, VR, and CGI campaigns. Custom AI workflows.<br className="hidden md:block" /> Engineered for enterprise scale.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 md:mt-8 flex flex-col items-center justify-center gap-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-6 w-full">

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group w-full sm:w-auto relative z-20">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-[#FF6B6B] to-[#5C4EE5] rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition duration-500 pointer-events-none" />

                  <a
                      href="https://calendly.com/chhavigarg/arexa"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Book Call"
                      className="relative flex items-center justify-center gap-2 bg-[#5C4EE5] text-white px-8 md:px-12 py-3 sm:py-4 rounded-2xl text-sm md:text-base font-extrabold shadow-sm transition-all duration-300 w-full sm:w-auto min-w-[180px] md:min-w-[200px] border-t border-white/20"
                  >
                    <Calendar size={18} className="group-hover:scale-110 transition-transform duration-300" />
                    <span>Book Call</span>
                  </a>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="group w-full sm:w-auto relative z-10">
                  <Link
                      to="/work"
                      className="relative flex items-center justify-center gap-2 px-8 md:px-12 py-3 sm:py-4 rounded-2xl bg-background/40 backdrop-blur-xl border border-border text-foreground text-sm md:text-base font-bold hover:bg-muted/60 hover:border-foreground/20 transition-all duration-300 w-full sm:w-auto min-w-[180px] md:min-w-[200px] shadow-sm"
                  >
                    <span>View Work</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>

            </motion.div>
          </div>

          <motion.div
              className="relative w-full max-w-[100vw] overflow-visible"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
          >
            <motion.div
                className="relative h-[300px] md:h-[370px] lg:h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                ref={containerRef}
            >
              {videos.map((videoData, index) => {
                const position = getPosition(index);
                const isVisible = Math.abs(position) <= 2;

                return (
                    <PhoneFrame
                        key={index}
                        videoData={videoData}
                        position={position}
                        isCenter={position === 0}
                        isVisible={isVisible}
                        isMobile={isMobile}
                    />
                );
              })}
            </motion.div>
          </motion.div>

        </div>
      </section>
  );
};

export default HeroSection;