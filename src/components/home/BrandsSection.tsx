import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import axios from "axios";

// API Endpoint - matches your cms.php logic
const API_URL = "https://arexa.co/api/cms.php?type=brands";

interface Brand {
    id: number;
    name: string;
    logo_url: string;
    is_active: number;
}

const MarqueeRow = ({
                        logos,
                        direction = "left",
                        speed = 30,
                        index,
                        isInView
                    }: {
    logos: Brand[];
    direction?: "left" | "right";
    speed?: number;
    index: number;
    isInView: boolean
}) => {
    const animationDuration = `${speed}s`;
    const seamlessLogos = [...logos, ...logos];

    if (logos.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
            transition={{
                duration: 0.5,
                delay: 0.15 + index * 0.1,
                ease: "easeOut"
            }}
            className="flex overflow-hidden touch-pan-y"
            style={{
                maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}
            aria-hidden="true"
        >
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>

            <div
                className={`flex gap-6 lg:gap-10 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
                style={{
                    animationDuration,
                    willChange: 'transform'
                }}
            >
                {seamlessLogos.map((brand, logoIndex) => (
                    <div
                        key={`${brand.id}-${logoIndex}`}
                        className="group flex-shrink-0 flex items-center justify-center w-[92px] h-[60px] md:w-[110px] md:h-[66px] lg:w-[135px] lg:h-[80px] rounded-xl bg-transparent overflow-hidden cursor-pointer"
                    >
                        <img
                            src={brand.logo_url}
                            alt={`${brand.name} - Arexa Partner`}
                            // MOBILE FIX: Full color on mobile. Muted on desktop (md:) with hover reveal.
                            className="w-full h-full object-contain pointer-events-none transition-all duration-500 saturate-100 opacity-100 md:saturate-50 md:opacity-60 md:group-hover:saturate-100 md:group-hover:opacity-100"
                            loading="lazy"
                            width="135"
                            height="80"
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

const BrandsSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const { data } = await axios.get(API_URL);
                setBrands(data);
            } catch (error) {
                console.error("Error fetching brand partners:", error);
            }
        };
        fetchBrands();
    }, []);

    const splitIntoRows = () => {
        const rowCount = 3;
        const result: Brand[][] = [[], [], []];
        brands.forEach((brand, index) => {
            result[index % rowCount].push(brand);
        });
        return result;
    };

    const [row1, row2, row3] = splitIntoRows();

    useEffect(() => {
        if (brands.length === 0) return;

        const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Arexa Trusted Brand Partners",
            "description": "A showcase of global brands that trust Arexa for XR and AR campaigns.",
            "numberOfItems": brands.length,
            "itemListElement": brands.map((brand, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": brand.name
            }))
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, [brands]);

    return (
        <section
            className="pb-4 pt-4 lg:pb-6 lg:pt-1 section-bg-primary overflow-hidden border-y border-border/20 relative"
            ref={ref}
            aria-label="Trusted Brand Partners"
        >
            <div className="relative z-10 w-full max-w-[1700px] mx-auto px-4 sm:px-6 md:px-8">

                <div className="mb-6 md:mb-10">
                    <div className="text-center flex flex-col items-center gap-2 md:gap-4 max-w-3xl mx-auto">

                        <motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-tight"
                        >
                            Brands We've <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]">Worked With</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                            className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed font-medium px-4"
                        >
                            Powering spatial experiences for industry-leading organizations.
                        </motion.p>
                    </div>
                </div>

                <div className="space-y-4 md:space-y-5">
                    {brands.length > 0 ? (
                        <>
                            <MarqueeRow logos={row1} direction="left" speed={35} index={0} isInView={isInView} />
                            <MarqueeRow logos={row2} direction="right" speed={40} index={1} isInView={isInView} />
                            <MarqueeRow logos={row3} direction="left" speed={45} index={2} isInView={isInView} />
                        </>
                    ) : (
                        <div className="h-16" />
                    )}
                </div>

                <div className="mt-8 md:mt-12 w-full mx-auto">

                    {/* DESKTOP RIBBON */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                        className="hidden sm:flex bg-gradient-to-r from-[#5C4EE5]/10 via-transparent to-transparent border border-border/40 rounded-2xl p-6 md:p-8 lg:p-10 items-center justify-between gap-6 relative overflow-hidden group w-full"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#FF6B6B] via-[#9F55FF] to-[#5C4EE5]" />

                        <div className="text-left z-10 pl-4 md:pl-6">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
                                Ready to scale your reality?
                            </h3>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground mt-2 font-medium">
                                Join the industry leaders engineering the next generation of digital experiences.
                            </p>
                        </div>

                        <div className="z-10 shrink-0">
                            <a
                                href="https://calendly.com/chhavigarg/arexa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group/btn flex items-center justify-center gap-3 bg-[#5C4EE5] text-white md:px-10 md:py-4 lg:py-5 rounded-xl md:rounded-2xl md:text-lg lg:text-xl font-bold shadow-lg hover:shadow-[#5C4EE5]/40 transition-all duration-300 border border-white/10 overflow-hidden"
                            >
                                <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                                <span className="relative z-10 tracking-wide">Build Now</span>
                                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/80 group-hover/btn:text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-300 relative z-10" />
                            </a>
                        </div>
                    </motion.div>

                    {/* MOBILE BUTTON ONLY */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.6, ease: "easeOut" }}
                        className="flex sm:hidden justify-center w-full px-4"
                    >
                        <a
                            href="https://calendly.com/chhavigarg/arexa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative group/btn flex items-center justify-center gap-2 bg-[#5C4EE5] text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:shadow-[#5C4EE5]/40 transition-all duration-300 border border-white/10 overflow-hidden w-full max-w-[280px]"
                        >
                            <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out pointer-events-none" />
                            <span className="relative z-10 tracking-wide">Build Now</span>
                            <ArrowUpRight className="w-4 h-4 text-white/80 group-hover/btn:text-white group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-all duration-300 relative z-10" />
                        </a>
                    </motion.div>

                </div>

            </div>
        </section>
    );
};

export default BrandsSection;