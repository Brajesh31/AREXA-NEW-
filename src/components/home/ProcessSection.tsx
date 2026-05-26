import { motion, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Search,
  Lightbulb,
  Code,
  Rocket,
  Calendar,
  ArrowRight,
  Sparkles,
  Target,
  Box,
  Network,
  Megaphone,
  Eye,
  Cpu,
  BarChart3,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery",
    subtitle: "Understand. Analyze. Define.",
    description: "We dive deep into your brand, audience and goals to uncover real opportunities for immersive impact.",
    bullets: ["Brand & Audience Research", "Market & Tech Analysis", "Opportunity Mapping"]
  },
  {
    number: "02",
    icon: Lightbulb,
    title: "Ideation",
    subtitle: "Imagine. Conceptualize. Innovate.",
    description: "We brainstorm and conceptualize bold ideas and immersive experiences that push boundaries.",
    bullets: ["Concept Development", "Experience Design", "Workflow Strategy"]
  },
  {
    number: "03",
    icon: Code,
    title: "Development",
    subtitle: "Build. Engineer. Perfect.",
    description: "We bring concepts to life using cutting-edge technology and intelligent systems with precision.",
    bullets: ["XR Development (AR/VR/MR)", "AI Model & Automation", "3D, Spatial & Backend Build"]
  },
  {
    number: "04",
    icon: Rocket,
    title: "Launch",
    subtitle: "Deploy. Optimize. Scale.",
    description: "We launch, optimize and continuously improve your solution to ensure lasting impact and measurable ROI.",
    bullets: ["Deployment & Integration", "Testing & Optimization", "Analytics & Support"]
  },
];

const ProcessSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Arexa XR & AI Development Process",
      "description": "Our proven 4-step process for creating immersive AR/VR experiences and deploying custom AI automation workflows.",
      "step": steps.map((step, index) => ({
        "@type": "HowToStep",
        "position": index + 1,
        "name": step.title,
        "text": step.description,
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.head.querySelector('script[type="application/ld+json"]');
      if (existingScript && existingScript.innerHTML.includes("HowTo")) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
      <section
          className="pt-4 pb-12 lg:pt-6 lg:pb-16 bg-[#F8F9FE] relative overflow-hidden font-sans w-full"
          ref={ref}
          aria-label="Our Development Process"
      >
        {/* Background Decorative Gradient Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.012] mix-blend-overlay"></div>
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />
          <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-pink-100/30 rounded-full blur-[100px]" />
        </div>

        {/* FULL WIDTH FLUID CONTAINER */}
        <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24 mx-auto relative z-10">

          {/* --- TOP ROW: HERO SECTION (3 Columns) --- */}
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-2 xl:gap-6 mb-8 lg:mb-4 relative z-10">

            {/* LEFT COLUMN */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center relative z-30 order-1">
              <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-2 mb-4"
              >
                <Sparkles className="w-4 h-4 text-[#7B61FF]" />
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#7B61FF]">
                                Workflow Excellence
                            </span>
              </motion.div>

              <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-[44px] xl:text-[52px] font-black text-[#0F172A] leading-[1.15] tracking-tight mb-6 drop-shadow-[0_2px_12px_rgba(248,249,254,0.9)]"
              >
                We Turn Ideas Into <br className="hidden md:block" />
                Immersive <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#E13684]">XR &</span> <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7B61FF] to-[#E13684]">AI Experiences</span>
              </motion.h2>

              <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-slate-700 text-sm xl:text-[15.5px] leading-loose max-w-[420px] mb-6 font-semibold drop-shadow-[0_1px_8px_rgba(248,249,254,0.9)]"
              >
                Our end-to-end process combines creativity, cutting-edge technology and data-driven strategies to deliver measurable impact.
              </motion.p>

              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.03)] border border-slate-100 w-max"
              >
                <div className="flex -space-x-2.5">
                  {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden shadow-sm bg-slate-100">
                        <img src={`https://i.pravatar.cc/100?img=${i+30}`} alt="Client Avatar" className="w-full h-full object-cover" />
                      </div>
                  ))}
                </div>
                <span className="text-[12px] font-bold text-slate-600 pr-1">
                                <span className="text-[#7B61FF] font-black">500+</span> Brands trust Arexa
                            </span>
              </motion.div>
            </div>

            {/* CENTER COLUMN: Hero Visuals */}
            <div className="hidden lg:flex lg:w-[30%] relative flex-col items-center justify-center order-2 lg:-mb-28 min-h-[450px]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] bg-gradient-to-b from-purple-400/20 to-transparent rounded-full blur-3xl z-0 pointer-events-none" />

              <motion.img
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={isInView ? { opacity: 1, scale: 1.45 } : { opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  src="/card10.png"
                  alt="Arexa XR and AI Innovation Center Ring"
                  className="absolute w-full max-w-[800px] xl:max-w-[920px] h-auto object-contain drop-shadow-[0_25px_50px_rgba(123,97,255,0.15)] z-0 pointer-events-none"
              />

              <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: "-50%" }}
                  animate={isInView ? { opacity: 1, scale: 1, x: "-50%" } : { opacity: 0, scale: 0.9, x: "-50%" }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute top-[88%] left-1/2 bg-white/95 backdrop-blur-xl px-6 py-3 rounded-full border border-purple-100 shadow-[0_15px_35px_rgba(123,97,255,0.25)] whitespace-nowrap z-20 pointer-events-auto"
              >
                            <span className="text-[11px] font-black uppercase tracking-widest text-[#7B61FF] flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-[#7B61FF] animate-ping"></span>
                                Our Proven Workflow
                            </span>
              </motion.div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[35%] flex flex-col justify-center items-start lg:items-end relative z-30 gap-3 order-3 mt-4 lg:mt-0">
              <motion.a
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  href="https://calendly.com/chhavigarg/arexa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-[#7B61FF] border border-[#694eff] p-2 pr-6 rounded-full shadow-[0_4px_25px_rgba(123,97,255,0.25)] hover:bg-[#694eff] transition-all duration-300 w-full max-w-md mb-0.5"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <Calendar size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-purple-200 uppercase tracking-wider">Ready to Start?</span>
                    <span className="text-sm font-black text-white transition-colors">Claim Free Consultancy</span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </motion.a>

              {/* Grid Layout Container */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-md">
                {[
                  { icon: Rocket, value: "500+", label: "AR/XR Experiences", color: "text-[#7B61FF]" },
                  { icon: Megaphone, value: "120+", label: "Brand Campaigns", color: "text-[#7B61FF]" },
                  { icon: Eye, value: "2B+", label: "Impressions Gen.", color: "text-[#7B61FF]" },
                  { icon: Cpu, value: "45+", label: "AI Workflows", color: "text-[#7B61FF]" },
                  { icon: BarChart3, value: "3.2x", label: "Avg. ROI Boost", color: "text-[#7B61FF]" },
                  { icon: ShieldCheck, value: "98%", label: "Client Satisfaction", color: "text-[#7B61FF]" }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.5, delay: 0.3 + (idx * 0.08) }}
                        className="bg-white/95 backdrop-blur-md border border-white py-6 px-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:-translate-y-0.5 transition-transform flex flex-row items-center gap-3.5"
                    >
                      <div className="flex-shrink-0">
                        <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h4 className="text-2xl font-black text-[#0F172A] leading-none tracking-tight mb-0.5">{stat.value}</h4>
                        <p className="text-[12px] text-slate-500 font-bold leading-tight">{stat.label}</p>
                      </div>
                    </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* --- MIDDLE SECTION: WORKFLOW STEPS GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 relative mb-12 mt-8 lg:mt-24 z-20">
            <div className="hidden lg:block absolute top-[3rem] left-[12%] right-[12%] h-px bg-gradient-to-r from-[#7B61FF]/10 via-[#7B61FF]/30 to-[#7B61FF]/10 z-0"></div>

            {steps.map((step, index) => (
                <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                    className="relative z-10 flex flex-col"
                >
                  <div className="relative mb-5 self-center lg:self-start">
                    <div className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#7B61FF] text-white flex items-center justify-center text-[9px] font-black shadow-lg shadow-purple-500/25 z-20">
                      {step.number}
                    </div>

                    <div className="w-16 h-16 rounded-full bg-white/95 backdrop-blur-xl shadow-[inset_0_-2px_8px_rgba(123,97,255,0.08),0_8px_25px_rgba(0,0,0,0.04)] border border-white flex items-center justify-center relative z-10 group hover:scale-105 transition-transform duration-300">
                      <div className="absolute inset-1 rounded-full border border-purple-100/40"></div>
                      <step.icon className="w-6 h-6 text-[#7B61FF]" strokeWidth={1.75} />
                    </div>

                    {index !== steps.length - 1 && (
                        <div className="hidden lg:flex absolute top-1/2 -right-8 xl:-right-10 -translate-y-1/2 w-4 h-4 rounded-full bg-[#7B61FF] text-white items-center justify-center shadow-md z-20">
                          <ArrowRight size={9} strokeWidth={3} />
                        </div>
                    )}
                  </div>

                  <div className="bg-white/90 backdrop-blur-md border border-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(123,97,255,0.06)] transition-all flex-1">
                    <h3 className="text-base font-bold text-[#0F172A] mb-0.5">{step.title}</h3>
                    <p className="text-[#7B61FF] text-[11px] font-bold mb-2.5 tracking-wide">{step.subtitle}</p>
                    <p className="text-slate-600 text-[12.5px] leading-relaxed mb-4">
                      {step.description}
                    </p>

                    <ul className="space-y-1.5">
                      {step.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#7B61FF] mt-1.5 flex-shrink-0" />
                            <span className="text-[11px] font-semibold text-slate-700 leading-tight">{bullet}</span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
            ))}
          </div>

          {/* --- BOTTOM SECTION: CORE RIBBON BAR (FIXED TEXT LAYERING & CLIPPING ISSUES) --- */}
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="hidden sm:block w-full bg-[#0C0F1A] border border-white/5 rounded-2xl p-4 shadow-xl relative z-20 -mt-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {[
                { title: "End-to-End Partnership", desc: "We're with you from strategy to success.", icon: Zap, iconColor: "from-[#8B5CF6] to-[#6366F1]" },
                { title: "Scalable Solutions", desc: "Solutions designed to grow with your business.", icon: Users, iconColor: "from-[#EC4899] to-[#D946EF]" },
                { title: "Cutting-Edge Tech", desc: "XR, AI & Spatial computing powering innovation.", icon: Box, iconColor: "from-[#3B82F6] to-[#60A5FA]" },
                { title: "Measurable Impact", desc: "Data-driven insights that maximize your ROI.", icon: Target, iconColor: "from-[#F43F5E] to-[#FB7185]" },
              ].map((feature, idx) => (
                  <div key={idx} className={`flex items-center gap-4 ${idx !== 0 ? 'sm:pl-5 pt-3 sm:pt-0' : ''}`}>
                    {/* Icon container */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.iconColor} p-[1px] flex-shrink-0 shadow-lg shadow-purple-900/20`}>
                      <div className="w-full h-full bg-[#121625] rounded-[11px] flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    {/* Text block isolated with min-w-0 and flex-1 so letters don't overlap or hide */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13.5px] font-bold text-white mb-0.5 tracking-wide truncate block">{feature.title}</h4>
                      <p className="text-[11.5px] text-slate-400 leading-normal pr-1 break-words">{feature.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
  );
};

export default ProcessSection;