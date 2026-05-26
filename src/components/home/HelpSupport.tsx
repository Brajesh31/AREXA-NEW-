import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Calendar,
  ArrowRight,
  MessageCircleQuestion,
  Layers,
  Clock,
  Box,
  BarChart2,
  DollarSign,
  Plus,
  Minus,
  Send,
  User,
  Mail,
  Building,
  PenTool,
  Lock,
  ShieldCheck,
  Users
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { emailConfig } from "@/config/emailDetails";

// Expanded FAQs with specific icons
const faqs = [
  {
    icon: Layers,
    question: "What platforms do you support for XR and Automation?",
    answer: "We build across Snapchat, TikTok, WebAR, AR Mirrors, iOS, Android, and Web. We also design AI workflows and automation tools tailored to your business infrastructure.",
  },
  {
    icon: Clock,
    question: "How long does it take to deploy an XR or AI project?",
    answer: "Simple AR experiences can be deployed in 1-2 weeks. Complex interactive campaigns, CGI productions, or custom AI automation builds typically take 4-8 weeks depending on the scope.",
  },
  {
    icon: Box,
    question: "What industries do you work with?",
    answer: "We work across fashion, beauty, retail, entertainment, real estate, healthcare, and education. Both our immersive XR solutions and intelligent workflows are adaptable to any industry.",
  },
  {
    icon: BarChart2,
    question: "Do you provide analytics for your campaigns?",
    answer: "Yes, we provide comprehensive analytics for XR campaigns (impressions, engagement, conversions) and measurable ROI/efficiency data for our deployed AI automation workflows.",
  },
  {
    icon: DollarSign,
    question: "What is the typical cost of an engagement?",
    answer: "Project costs vary based on complexity, whether it's an immersive AR campaign or a backend automation build. Contact us for a free consultancy and custom quote tailored to your goals.",
  },
];

const FAQItem = ({ faq, index, isOpen, onToggle, isInView }: {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isInView: boolean;
}) => {
  const Icon = faq.icon;

  return (
      <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          className={`border rounded-[1.25rem] overflow-hidden transition-all duration-300 bg-white ${
              isOpen ? "border-[#5C4EE5]/20 shadow-[0_8px_30px_rgba(92,78,229,0.06)]" : "border-slate-100 shadow-sm"
          }`}
      >
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between p-3.5 lg:p-4 text-left group"
            aria-expanded={isOpen}
        >
          <div className="flex items-center gap-4 pr-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 flex-shrink-0 ${
                isOpen ? "bg-[#5C4EE5]/10 text-[#5C4EE5]" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-[#5C4EE5]"
            }`}>
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
            <span className={`font-semibold text-[14px] lg:text-[15px] transition-colors duration-300 ${
                isOpen ? "text-[#0F172A]" : "text-slate-700 group-hover:text-[#0F172A]"
            }`}>
              {faq.question}
            </span>
          </div>

          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
              isOpen ? "bg-[#5C4EE5]/10 text-[#5C4EE5]" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-[#5C4EE5]"
          }`}>
            {isOpen ? <Minus size={16} strokeWidth={2.5}/> : <Plus size={16} strokeWidth={2.5}/>}
          </div>
        </button>
        <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
        >
          <p className="px-4 pb-4 pt-0 ml-[3.25rem] text-slate-500 text-[13px] lg:text-[14px] leading-relaxed">
            {faq.answer}
          </p>
        </motion.div>
      </motion.div>
  );
};

const HelpSupport = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          {
            name: formData.name,
            email: formData.email,
            reply_to: formData.email,
            company: formData.company,
            message: formData.message,
          },
          emailConfig.publicKey
      );

      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <section
          className="py-12 lg:py-16 bg-[#FAFAFD] relative overflow-hidden"
          ref={ref}
          aria-label="Help and Support"
      >
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="w-[96%] max-w-[1440px] mx-auto px-2 md:px-4 relative z-10">

          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
          >
            {/* Pill explicitly removed */}
            <h2 className="text-3xl md:text-5xl lg:text-[3.5rem] font-extrabold text-[#0F172A] leading-tight tracking-tight mb-3">
              Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF416C] to-[#5C4EE5]">immersive.</span>
            </h2>

            <p className="text-[#64748B] text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
              Whether you're planning an AR campaign, immersive product experience, or AI-powered workflow, our team will help map the right direction.
            </p>
          </motion.div>

          {/* CHANGED: items-stretch makes the columns share equal vertical height */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-12 items-stretch">

            <div className="flex flex-col gap-8 h-full">

              <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="bg-white rounded-[2rem] p-5 lg:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 border border-slate-100 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.05)] relative group hover:shadow-[0_20px_40px_-15px_rgba(92,78,229,0.1)] transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-pink-50 to-purple-50 border border-purple-100 flex items-center justify-center text-[#5C4EE5] flex-shrink-0 z-10">
                    <Calendar strokeWidth={2} className="w-6 h-6" />
                  </div>

                  <div className="flex-1 text-center sm:text-left z-10">
                    <h4 className="text-xl font-extrabold text-[#0F172A] mb-1.5">Book a Strategy Session</h4>
                    <p className="text-[13px] lg:text-[14px] text-slate-500 leading-relaxed pr-0 sm:pr-4">
                      Speak directly with our XR and AI specialists to explore ideas, workflows, timelines, and execution possibilities.
                    </p>
                  </div>

                  <a
                      href="https://calendly.com/chhavigarg/arexa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF416C] to-[#5C4EE5] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex-shrink-0 z-10 sm:self-center"
                  >
                    <ArrowRight strokeWidth={2.5} size={20} />
                  </a>
                </div>
              </motion.div>

              <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3 mb-1 px-2">
                  <div className="w-8 h-8 rounded-full bg-pink-50 text-[#FF416C] flex items-center justify-center">
                    <MessageCircleQuestion size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0F172A]">What teams usually ask us</h3>
                    <p className="text-xs text-slate-400">Answers to the most common questions we get from brands.</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  {faqs.map((faq, index) => (
                      <FAQItem
                          key={index}
                          faq={faq}
                          index={index}
                          isOpen={openIndex === index}
                          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                          isInView={isInView}
                      />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* CHANGED: Added h-full and flex-col for height synchronization */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] p-6 lg:p-8 flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-6 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF416C] to-[#5C4EE5] text-white flex items-center justify-center shadow-md">
                    <Send size={20} className="-ml-1" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-extrabold text-[#0F172A] mb-0.5">Tell us what you're building</h3>
                    <p className="text-[13px] text-slate-500">Share a few details and our team will get back to you within 24 hours.</p>
                  </div>
                </div>
                <div className="bg-purple-50 text-[#5C4EE5] font-bold text-[11px] px-3 py-1 rounded-full hidden sm:block mt-1">
                  1/2
                </div>
              </div>

              {/* CHANGED: Flex-1 applied to form to stretch available space */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-[12px] font-bold text-[#0F172A] ml-1">Full Name</label>
                    <div className="relative">
                      <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
                          required
                          className="bg-slate-50 border-slate-200 text-[13px] h-[48px] rounded-xl pl-4 pr-10 focus-visible:ring-[#5C4EE5]/20 focus-visible:border-[#5C4EE5]/50 transition-all placeholder:text-slate-400"
                      />
                      <User className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-[16px] h-[16px]" strokeWidth={2}/>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[12px] font-bold text-[#0F172A] ml-1">Work Email</label>
                    <div className="relative">
                      <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@company.com"
                          required
                          className="bg-slate-50 border-slate-200 text-[13px] h-[48px] rounded-xl pl-4 pr-10 focus-visible:ring-[#5C4EE5]/20 focus-visible:border-[#5C4EE5]/50 transition-all placeholder:text-slate-400"
                      />
                      <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-[16px] h-[16px]" strokeWidth={2}/>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="company" className="text-[12px] font-bold text-[#0F172A] ml-1">Company Name</label>
                  <div className="relative">
                    <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Your company name"
                        className="bg-slate-50 border-slate-200 text-[13px] h-[48px] rounded-xl pl-4 pr-10 focus-visible:ring-[#5C4EE5]/20 focus-visible:border-[#5C4EE5]/50 transition-all placeholder:text-slate-400"
                    />
                    <Building className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-[16px] h-[16px]" strokeWidth={2}/>
                  </div>
                </div>

                {/* CHANGED: Text area wraps in flex-1 to expand automatically */}
                <div className="flex flex-col gap-1.5 flex-1 pb-2">
                  <label htmlFor="message" className="text-[12px] font-bold text-[#0F172A] ml-1">Tell us about your project</label>
                  <div className="relative flex-1 flex flex-col">
                    <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe your immersive campaign, product idea, or workflow goals..."
                        required
                        className="bg-slate-50 border-slate-200 text-[13px] rounded-xl pl-4 pr-10 py-3 focus-visible:ring-[#5C4EE5]/20 focus-visible:border-[#5C4EE5]/50 transition-all placeholder:text-slate-400 resize-none min-h-[100px] flex-1 h-full"
                    />
                    <PenTool className="absolute right-3.5 bottom-3.5 text-slate-400 w-[16px] h-[16px]" strokeWidth={2}/>
                  </div>
                </div>

                {/* CHANGED: Footer elements grouped inside mt-auto to stay attached to bottom */}
                <div className="mt-auto flex flex-col">
                  <div className="pt-2 flex flex-col gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full h-[52px] rounded-xl flex items-center justify-center gap-2 text-white text-[14px] font-bold bg-gradient-to-r from-[#FF416C] to-[#5C4EE5] hover:opacity-90 transition-opacity shadow-[0_8px_20px_-8px_rgba(92,78,229,0.5)] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? "Processing Request..." : (
                          <>
                            Book Strategy Session
                            <ArrowRight size={16} strokeWidth={2.5}/>
                          </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
                      <Lock size={12} />
                      Your information is secure and will never be shared.
                    </div>
                  </div>

                  {/* CHANGED: Increased the sizes of the Trust Badges as requested */}
                  <div className="mt-4 pt-5 border-t border-slate-100 flex flex-wrap justify-between gap-4">
                    <div className="flex items-center gap-3 w-[45%] md:w-auto">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-[#5C4EE5] flex items-center justify-center flex-shrink-0">
                        <Clock size={16} strokeWidth={2.5}/>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] lg:text-[12px] text-slate-400 font-medium">Replies within</span>
                        <span className="text-[13px] lg:text-[14px] font-bold text-[#0F172A]">24 hours</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-[45%] md:w-auto">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-[#5C4EE5] flex items-center justify-center flex-shrink-0">
                        <ShieldCheck size={16} strokeWidth={2.5}/>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] lg:text-[12px] text-slate-400 font-medium">NDA-friendly</span>
                        <span className="text-[13px] lg:text-[14px] font-bold text-[#0F172A]">Collaboration</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                      <div className="w-10 h-10 rounded-full bg-purple-50 text-[#5C4EE5] flex items-center justify-center flex-shrink-0">
                        <Users size={16} strokeWidth={2.5}/>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] lg:text-[12px] text-slate-400 font-medium">Trusted by</span>
                        <span className="text-[13px] lg:text-[14px] font-bold text-[#0F172A]">Global Brands</span>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </motion.div>
          </div>
        </div>
      </section>
  );
};

export default HelpSupport;