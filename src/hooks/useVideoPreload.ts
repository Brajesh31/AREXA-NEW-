import { useEffect } from "react";

// Preload ONLY the critical first video and its thumbnail to save bandwidth
export const useVideoPreload = (videoUrls: string[]) => {
  useEffect(() => {
    if (!videoUrls || videoUrls.length === 0) return;

    // The hero section starts with the 4th video active (index 3)
    const criticalVideo = videoUrls[3] || videoUrls[0];

    // Automatically determine thumbnail name
    const criticalThumbnail = criticalVideo.replace('.webm', '-thumbnail.jpg').replace('.mp4', '-thumbnail.jpg');

    // 1. PRELOAD THUMBNAIL (Highest Priority - Instantly visible)
    const imgLink = document.createElement("link");
    imgLink.rel = "preload";
    imgLink.as = "image";
    imgLink.href = criticalThumbnail;
    // @ts-ignore
    imgLink.fetchPriority = "high";
    document.head.appendChild(imgLink);

    // 2. PRELOAD CRITICAL VIDEO (Starts loading in the background)
    const vidLink = document.createElement("link");
    vidLink.rel = "preload";
    vidLink.as = "video";
    vidLink.href = criticalVideo;
    document.head.appendChild(vidLink);

  }, [videoUrls]);
};

export const preloadVideo = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata"; // Smart cache: only loads the first frame/dimensions
    video.muted = true;
    video.src = url;

    video.onloadeddata = () => resolve();
    video.onerror = () => reject(new Error(`Failed to load video: ${url}`));
  });
};

export default useVideoPreload;