import { useState, useRef, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface VideoWithSkeletonProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: "auto" | "metadata" | "none";
}

export const VideoWithSkeleton = ({
  src,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  preload = "auto",
}: VideoWithSkeletonProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoaded = () => setIsLoaded(true);
    
    // Check if already loaded
    if (video.readyState >= 3) {
      setIsLoaded(true);
    }

    video.addEventListener("loadeddata", handleLoaded);
    video.addEventListener("canplay", handleLoaded);

    return () => {
      video.removeEventListener("loadeddata", handleLoaded);
      video.removeEventListener("canplay", handleLoaded);
    };
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {/* Skeleton placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <Skeleton className="w-full h-full rounded-lg animate-pulse bg-gradient-to-br from-muted via-muted/80 to-muted" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      )}
      
      {/* Actual video */}
      <video
        ref={videoRef}
        src={src}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={preload}
      />
    </div>
  );
};

// Card skeleton for project cards
export const CardSkeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`rounded-2xl border border-border/50 bg-white/70 backdrop-blur-sm p-4 lg:p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded" />
          <Skeleton className="w-16 h-5 rounded-full" />
        </div>
        <Skeleton className="w-4 h-4 rounded" />
      </div>
      <Skeleton className="w-3/4 h-5 mb-2 rounded" />
      <Skeleton className="w-full h-4 mb-1 rounded" />
      <Skeleton className="w-2/3 h-4 mb-3 rounded" />
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="aspect-[9/16] rounded-lg" />
        ))}
      </div>
      <div className="pt-3 border-t border-border/50">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="text-center">
              <Skeleton className="w-12 h-5 mx-auto mb-1 rounded" />
              <Skeleton className="w-16 h-3 mx-auto rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Hero section skeleton
export const HeroSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className="section-padding pt-20 lg:pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <Skeleton className="w-48 h-8 mx-auto mb-4 rounded-full" />
          <Skeleton className="w-full max-w-2xl h-16 mx-auto mb-4 rounded-lg" />
          <Skeleton className="w-3/4 max-w-xl h-12 mx-auto mb-4 rounded-lg" />
          <Skeleton className="w-2/3 max-w-lg h-6 mx-auto mb-6 rounded" />
          <div className="flex justify-center gap-4">
            <Skeleton className="w-40 h-12 rounded-full" />
            <Skeleton className="w-36 h-12 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4 mt-10">
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton 
            key={i} 
            className={`w-[180px] md:w-[220px] h-[360px] md:h-[440px] rounded-[40px] ${
              i === 2 ? "scale-100" : i === 1 || i === 3 ? "scale-90 opacity-70" : "scale-80 opacity-40"
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

// Section title skeleton
export const SectionTitleSkeleton = () => {
  return (
    <div className="text-center mb-8">
      <Skeleton className="w-24 h-4 mx-auto mb-3 rounded" />
      <Skeleton className="w-48 h-10 mx-auto rounded" />
    </div>
  );
};

// Hexagon skeleton for clients
export const HexagonSkeleton = () => {
  return (
    <div 
      className="w-[100px] h-[115px] md:w-[120px] md:h-[138px] bg-muted/50 animate-pulse"
      style={{
        clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      }}
    />
  );
};

// Partner logo skeleton
export const PartnerLogoSkeleton = () => {
  return (
    <Skeleton className="flex-shrink-0 mx-6 w-40 h-24 rounded-xl" />
  );
};

// AR Story skeleton
export const ARStorySkeleton = () => {
  return (
    <div className="flex-shrink-0 w-[140px] md:w-[160px] lg:w-[180px]">
      <Skeleton className="aspect-[9/16] rounded-2xl" />
    </div>
  );
};

export default VideoWithSkeleton;
