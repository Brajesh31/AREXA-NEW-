import { useEffect } from "react";
import { ArrowRight, ShieldCheck, Layers, Globe } from "lucide-react";

// Strictly .png assets
const solutions = [
    {
        id: "01",
        title: "Immersive Campaigns",
        desc: "Create unforgettable brand campaigns that captivate, engage and leave a lasting impression.",
        media: "/card1.png",
        featured: true
    },
    {
        id: "02",
        title: "AI Automation",
        desc: "Automate workflows, personalize customer journeys and scale operations with intelligent AI.",
        media: "/card2.png",
    },
    {
        id: "03",
        title: "CGI & 3D Visuals",
        desc: "Stunning CGI visuals and 3D content that bring your ideas to life with realism and impact.",
        media: "/card3.png",
    },
    {
        id: "04",
        title: "AR Filters",
        desc: "Engaging AR filters for social platforms that boost brand awareness and interaction.",
        media: "/card4.png",
    },
    {
        id: "05",
        title: "Virtual Try-On",
        desc: <>Let customers try <br /> before they buy with realistic virtual try-on experiences.</>,
        media: "/card5.png",
    },
    {
        id: "06",
        title: "AR Commerce",
        desc: "Enhance product discovery and boost conversions with interactive AR shopping experiences.",
        media: "/card6.png",
    },
    {
        id: "07",
        title: "AR Swags",
        desc: "Design interactive AR-enabled merchandise and promotional items that leave a lasting brand impression.",
        media: "/card7.png",
    }
];

const ExtendedRealitySolutionsSection = () => {
    useEffect(() => {
        const schemaData = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Arexa Creative Tech Solutions",
            "description": "Comprehensive AR/VR, XR, and AI Automation services offered by Arexa Technologies.",
            "itemListElement": solutions.map((solution, index) => ({
                "@type": "Service",
                "position": index + 1,
                "name": solution.title,
                "url": "https://arexa.co/services"
            }))
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);
        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    return (
        <section
            // Top padding increased (pt-[60px], md:pt-[48px], lg:pt-[40px]) to add breathing room at the very top
            className="pt-[60px] pb-[56px] md:pt-[48px] lg:pt-[40px] md:pb-[72px] relative overflow-hidden bg-[#F8F9FE]"
            aria-label="Our Extended Reality Solutions"
        >
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="w-[96%] max-w-[1800px] mx-auto px-2 md:px-4">

                {/* --- HEADER --- */}
                <div className="text-center max-w-4xl mx-auto mb-[25px] md:mb-[32px]">
                    <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#1A1A24] leading-[1.1] tracking-tight mb-4">
                        Elevate your Brand with <br className="hidden md:block"/>
                        Innovative <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9F55FF] via-[#E13684] to-[#FF004D]">XR & AI</span> Solutions
                    </h2>

                    <p className="text-base md:text-lg text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
                        Combining immersive tech and intelligent automation to build experiences that
                    </p>
                </div>

                {/* --- MASTER GRID CONTAINER --- */}
                <div className="flex flex-col gap-[10px] lg:gap-[16px] relative z-10">

                    {/* --- ROW 1: CARDS 1, 2, 3 --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.2fr_1.2fr] gap-[10px] lg:gap-[16px]">
                        {solutions.slice(0, 3).map((item) => {
                            const isFeatured = item.featured; // Card 1
                            const isCard3 = item.id === "03"; // Card 3

                            return (
                                <div
                                    key={item.id}
                                    className="group bg-white relative rounded-[2rem] border border-slate-100/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-10px_rgba(92,78,229,0.15)] hover:border-[#5C4EE5]/20 transition-all duration-500 overflow-hidden flex flex-col p-[19px] lg:p-[23px] min-h-[230px] lg:min-h-[270px]"
                                >
                                    <div className={`relative z-10 flex flex-col h-full ${isFeatured ? 'w-[55%]' : 'w-[60%]'}`}>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="text-[13px] font-black px-2.5 py-1 rounded-md bg-[#5C4EE5]/10 text-[#5C4EE5]">
                                                {item.id}
                                            </span>
                                            {isFeatured && (
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={`font-extrabold text-[#0F172A] leading-tight mb-2 ${isFeatured ? 'text-[24px] lg:text-[32px]' : 'text-[23px] lg:text-[31px]'}`}>
                                            {item.title}
                                        </h3>

                                        <p className={`text-slate-500 leading-relaxed mb-4 ${isFeatured ? 'text-[14px] lg:text-[16px]' : 'text-[13px] lg:text-[15px]'} ${!isFeatured ? 'max-w-[85%]' : ''}`}>
                                            {item.desc}
                                        </p>

                                        <div className="mt-auto">
                                            <button className="inline-flex items-center text-[13px] font-bold text-[#5C4EE5] group-hover:text-[#9F55FF] group-hover:gap-2 gap-1 transition-all">
                                                Explore more <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 z-0 pointer-events-none rounded-[2rem] overflow-hidden">
                                        <img
                                            src={item.media}
                                            alt={item.title}
                                            className={`
                                                absolute bottom-0 right-0 group-hover:scale-105 transition-transform duration-700
                                                ${isFeatured
                                                ? 'w-[120%] md:w-[75%] h-[150%] object-contain object-right-bottom translate-x-[5%] translate-y-[5%]'
                                                : isCard3
                                                    ? 'w-[95%] h-[90%] object-contain object-right-bottom translate-x-[2%] translate-y-[2%]'
                                                    : 'w-[85%] h-[75%] object-contain object-right-bottom translate-x-[5%] translate-y-[5%]'
                                            }
                                            `}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* --- ROW 2: CARDS 4, 5, 6, 7 --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] lg:gap-[16px]">
                        {solutions.slice(3, 7).map((item) => (
                            <div
                                key={item.id}
                                className="group bg-white relative rounded-[2rem] border border-slate-100/80 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_-10px_rgba(92,78,229,0.15)] hover:border-[#5C4EE5]/20 transition-all duration-500 overflow-hidden flex flex-col p-[19px] lg:p-[23px] min-h-[215px] lg:min-h-[235px]"
                            >
                                <div className="relative z-10 flex flex-col h-full w-[60%]">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-[13px] font-black px-2.5 py-1 rounded-md bg-[#5C4EE5]/10 text-[#5C4EE5]">
                                            {item.id}
                                        </span>
                                    </div>

                                    <h3 className="font-extrabold text-[#0F172A] leading-tight mb-2 text-[20px]">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 leading-relaxed mb-4 text-[13px] lg:text-[14px]">
                                        {item.desc}
                                    </p>

                                    <div className="mt-auto">
                                        <button className="inline-flex items-center text-[13px] font-bold text-[#5C4EE5] group-hover:text-[#9F55FF] group-hover:gap-2 gap-1 transition-all">
                                            Explore more <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="absolute inset-0 z-0 pointer-events-none rounded-[2rem] overflow-hidden">
                                    <img
                                        src={item.media}
                                        alt={item.title}
                                        className="absolute bottom-0 right-0 w-[95%] h-[95%] object-contain object-right-bottom group-hover:scale-105 transition-transform duration-700 translate-x-[3%] translate-y-[3%]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* --- BOTTOM CTA BANNER --- */}
                <div
                    className="mt-[10px] lg:mt-[16px] bg-[#0B0914] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden relative z-10 py-6 px-6 lg:py-8 lg:px-10 flex flex-col xl:flex-row items-center justify-end"
                >
                    {/* Left Side Background Image (/card8.png) */}
                    <div className="absolute left-0 top-0 bottom-0 w-full lg:w-[20%] xl:w-[15%] pointer-events-none -z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0B0914]/80 to-[#0B0914] z-10" />
                        <img
                            src="/card8.png"
                            alt="Immersive Experience Portal"
                            className="w-full h-full object-cover object-bottom opacity-90"
                        />
                    </div>

                    <div className="flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8 w-full lg:pl-[12%] xl:pl-[15%] relative z-20">

                        <div className="flex flex-col text-center xl:text-left flex-1 w-full">
                            <h3 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white mb-1.5 tracking-tight sm:whitespace-nowrap">
                                Ready to build something <span className="text-[#D946EF]">extraordinary?</span>
                            </h3>
                            <p className="text-slate-300 text-sm font-medium">
                                Partner with us to create immersive experiences that drive engagement and accelerate growth.
                            </p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center gap-6 xl:gap-8 shrink-0 mt-4 xl:mt-0">

                            <div className="flex items-center justify-center gap-4 xl:gap-6">
                                <div className="flex items-center gap-2 xl:gap-3">
                                    <ShieldCheck className="w-5 h-5 xl:w-6 xl:h-6 text-white/80" strokeWidth={2}/>
                                    <span className="text-[11px] xl:text-[12px] font-semibold text-white/90 leading-tight text-left">Enterprise<br/>Security</span>
                                </div>
                                <div className="w-px h-8 bg-white/20 hidden md:block" />
                                <div className="flex items-center gap-2 xl:gap-3">
                                    <Layers className="w-5 h-5 xl:w-6 xl:h-6 text-white/80" strokeWidth={2}/>
                                    <span className="text-[11px] xl:text-[12px] font-semibold text-white/90 leading-tight text-left">Scalable<br/>Solutions</span>
                                </div>
                                <div className="w-px h-8 bg-white/20 hidden md:block" />
                                <div className="flex items-center gap-2 xl:gap-3">
                                    <Globe className="w-5 h-5 xl:w-6 xl:h-6 text-white/80" strokeWidth={2}/>
                                    <span className="text-[11px] xl:text-[12px] font-semibold text-white/90 leading-tight text-left">Global<br/>Delivery</span>
                                </div>
                            </div>

                            <a
                                href="https://calendly.com/chhavigarg/arexa"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-500/20 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                Book a Strategy Call <ArrowRight className="w-4 h-4"/>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ExtendedRealitySolutionsSection;