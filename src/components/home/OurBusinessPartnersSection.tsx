import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar } from "lucide-react";

const OurBusinessPartnersSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const uniquePartners = [
        "/partners/partner1.png",
        "/partners/partner2.png",
        "/partners/partner3.png",
        "/partners/partner4.png",
    ];
    const seamlessLogos = Array(6).fill(uniquePartners).flat();

    useEffect(() => {
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Arexa Strategic Business Partners",
            "description": "A list of strategic technology and business partners collaborating with Arexa XR Studio.",
            "numberOfItems": uniquePartners.length,
            "itemListElement": uniquePartners.map((_, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": { "@type": "Organization", "name": `Strategic Partner ${index + 1}` }
            }))
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);
        return () => {
            const existingScript = document.head.querySelector('script[type="application/ld+json"]');
            if (existingScript && existingScript.innerHTML.includes("Arexa Strategic Business Partners")) {
                document.head.removeChild(existingScript);
            }
        };
    }, []);

    return (
        <section className="pt-4 md:pt-6 pb-2 lg:pb-4 section-bg-primary overflow-hidden border-y border-border/20 relative" ref={ref} aria-label="Strategic Business Partners">
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">

                {/* Reduced mb-8 md:mb-12 to mb-4 md:mb-6 to pull logos closer to text */}
                <div className="mb-4 md:mb-6 text-center flex flex-col items-center max-w-3xl mx-auto px-2">
                    <motion.h2 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: 0.5, ease: "easeOut" }} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-tight">
                        Our Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">Partners</span>
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }} className="mt-2 md:mt-3 text-sm sm:text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
                        Powering high-fidelity spatial experiences and intelligent automation for industry-leading organizations across the globe.
                    </motion.p>
                </div>

                <motion.div initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }} className="flex overflow-hidden touch-pan-y py-1" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }} aria-hidden="true">
                    <div className="flex w-max items-center" style={{ animation: 'scroll-left 35s linear infinite' }}>
                        {[...seamlessLogos, ...seamlessLogos].map((logo, index) => (
                            <div key={index} className="group flex-shrink-0 flex items-center justify-center mx-6 md:mx-10 lg:mx-14 w-[101px] h-[66px] md:w-[121px] md:h-[73px] lg:w-[148px] lg:h-[88px] rounded-xl bg-transparent overflow-hidden cursor-pointer">
                                <img src={logo} alt={`Arexa Business Partner ${index}`} className="w-full h-full object-contain pointer-events-none transition-all duration-500 saturate-100 opacity-100 md:saturate-50 md:opacity-60 md:group-hover:saturate-100 md:group-hover:opacity-100" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Reduced mt-10 md:mt-14 to mt-6 md:mt-8 to pull ribbon closer to logos */}
                <div className="mt-6 md:mt-8 w-full mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} className="hidden sm:flex bg-gradient-to-r from-[#5C4EE5]/10 via-transparent to-transparent border border-border/40 rounded-2xl p-4 md:p-5 lg:p-6 items-center justify-between gap-6 relative overflow-hidden group w-full">
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]" />
                        <div className="text-left z-10 pl-4 md:pl-6">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">Ready to Build the Future?</h3>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-1.5 font-medium">Join forces with us to engineer immersive, high-impact XR solutions that redefine your industry.</p>
                        </div>
                        <div className="z-10 shrink-0">
                            <a href="https://calendly.com/chhavigarg/arexa" target="_blank" rel="noopener noreferrer" className="relative group/btn flex items-center justify-center gap-3 bg-[#5C4EE5] text-white md:px-8 md:py-3 lg:py-3.5 rounded-xl md:text-lg font-bold shadow-lg hover:shadow-[#5C4EE5]/40 transition-all duration-300 border border-white/10 overflow-hidden">
                                <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                                <span className="relative z-10 tracking-wide">Explore Partnership</span>
                                <Calendar className="w-5 h-5 text-white/80 group-hover/btn:text-white group-hover/btn:scale-110 transition-all duration-300 relative z-10" />
                            </a>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }} className="flex sm:hidden justify-center w-full px-2">
                        <a href="https://calendly.com/chhavigarg/arexa" target="_blank" rel="noopener noreferrer" className="relative group/btn flex items-center justify-center gap-2 bg-[#5C4EE5] text-white px-6 py-3.5 rounded-xl text-base font-bold shadow-lg hover:shadow-[#5C4EE5]/40 transition-all duration-300 border border-white/10 overflow-hidden w-full max-w-[340px]">
                            <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                            <span className="relative z-10 tracking-wide">Explore Partnership</span>
                            <Calendar className="w-5 h-5 text-white/80 group-hover/btn:text-white transition-all duration-300 relative z-10" />
                        </a>
                    </motion.div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `@keyframes scroll-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}} />
        </section>
    );
};

export default OurBusinessPartnersSection;