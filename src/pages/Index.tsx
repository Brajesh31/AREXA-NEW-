import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ReactLenis } from "@studio-freight/react-lenis";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import MetricsSection from "@/components/home/MetricsSection";
import BrandsSection from "@/components/home/BrandsSection";
import BrandEssence from "@/components/home/BrandEssence";
import ServicesSnapshot from "@/components/home/ServicesSnapshot";
import SEOContent from "@/components/home/SEOContent";
import OurBusinessPartnersSection from "@/components/home/OurBusinessPartnersSection";
import ExtendedRealitySolutionsSection from "@/components/home/ExtendedRealitySolutionsSection";
import FeaturedWork from "@/components/home/FeaturedWork";
import LiveARStoryFeed from "@/components/home/LiveARStoryFeed";
import ProcessSection from "@/components/home/ProcessSection";
import WhyArexa from "@/components/home/WhyArexa";
import HelpSupport from "@/components/home/HelpSupport";
import SEO from "@/components/seo/SEO";

const Index = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 1024;
            setIsMobile(isTouch || isSmallScreen);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        window.scrollTo(0, 0);

        // Ensure CSS doesn't fight the JS scroll logic
        document.documentElement.style.scrollBehavior = "auto";
        document.body.style.scrollBehavior = "auto";

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // --- THE "BUTTER SMOOTH" CONFIGURATION ---
    const lenisOptions = {
        // 1. Momentum (Smoothness)
        // 0.08 is the absolute sweet spot for feeling lightweight but buttery.
        lerp: 0.08,

        // Notice: 'duration' is completely removed. Let the physics engine do the work naturally!

        // 2. Speed (Fast but controlled)
        // 1.2x speed feels responsive without making users dizzy.
        wheelMultiplier: 1.2,

        // 3. Touchpad Speed
        // 1.5x for laptop trackpads feels native and precise.
        touchMultiplier: 1.5,

        smoothWheel: true,
    };

    const PageContent = () => (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="min-h-screen"
        >
            {/* --- SEO INJECTION: THE AUTHORITY SIGNAL --- */}
            <SEO
                title="Arexa | Official Snap Lens Partner & Global XR Studio (USA, UAE, EU)"
                description="Arexa Private Limited is an Official Snap AR Partner and Global XR Agency. We build High-Fidelity AR, Virtual Try-On, and Spatial Computing solutions for Enterprise Brands worldwide."
            />

            <Header />
            <HeroSection />
            <MetricsSection />
            <BrandsSection />
            <BrandEssence />

            <OurBusinessPartnersSection />
            <ExtendedRealitySolutionsSection />
            <FeaturedWork />
            <LiveARStoryFeed />
            <ProcessSection />
            <WhyArexa />
            <HelpSupport />

            {/* --- HIDDEN SEO CONTENT FOR BOTS --- */}
            <div
                style={{
                    position: 'absolute',
                    width: '1px',
                    height: '1px',
                    padding: '0',
                    margin: '-1px',
                    overflow: 'hidden',
                    clip: 'rect(0, 0, 0, 0)',
                    whiteSpace: 'nowrap',
                    border: '0',
                    opacity: 0
                }}
            >
                {/* These components load text content for Google to read, without cluttering the UI */}
                <ServicesSnapshot />
                <SEOContent />
            </div>

            <Footer />
        </motion.main>
    );

    // Mobile: Use Native Scroll (Smoothest possible on phones)
    if (isMobile) {
        return <PageContent />;
    }

    // Desktop/Laptop: Use Lenis (Fast & Gliding)
    return (
        <ReactLenis root options={lenisOptions}>
            <PageContent />
        </ReactLenis>
    );
};

export default Index;