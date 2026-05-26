import { motion, useInView } from "framer-motion";
import { Mail, MapPin, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import emailjs from "@emailjs/browser";
import { emailConfig } from "@/config/emailDetails";
import SEO from "@/components/seo/SEO";

const Contact = () => {
  // --- SCROLL TO TOP FIX ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const heroRef = useRef(null);
  const sectionRef = useRef(null);
  const formElementRef = useRef<HTMLFormElement>(null);

  const heroInView = useInView(heroRef, { once: true });
  const formInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // --- SEO: INJECT GLOBAL BUSINESS SCHEMA ---
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "mainEntity": {
        "@type": "Organization",
        "name": "Arexa Private Limited",
        "url": "https://arexa.co",
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-7678158081",
            "contactType": "sales",
            "email": "connect@arexa.co",
            "areaServed": [
              "US", "GB", "AE", "SA", "IN", "SG", "DE", "FR", "JP", "CN",
              "AU", "BR", "CA", "QA", "KW"
            ],
            "availableLanguage": ["English", "Hindi"]
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ground floor, E-7, E Block, Noida Sector 3",
          "addressLocality": "Noida",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201301",
          "addressCountry": "IN"
        }
      }
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
      await emailjs.sendForm(
          emailConfig.serviceId,
          emailConfig.templateId,
          formElementRef.current!,
          emailConfig.publicKey
      );

      toast({
        title: "Inquiry received!",
        description: "Our technical experts will get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast({
        title: "Error sending inquiry",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      // FIX: w-full overflow-x-clip cleanly eliminates horizontal scrollbars from entrance animations
      <main className="w-full overflow-x-clip min-h-screen">
        <SEO
            title="Contact Arexa | Claim Free XR & AI Automation Consultancy"
            description="Book your free strategy call for Custom Snap Lenses, WebAR, CGI campaigns, and Intelligent AI Workflows. Official Snap Partner serving global brands."
            keywords="Hire Snap AR Developer, Cost of AI Automation, WebAR Agency Pricing, AI Workflow Strategy, Custom Internal Tools, Enterprise XR Consultation, Contact Arexa Noida, Hire AR Agency USA, Snap Lens Network Partner Contact, Virtual Try-On Integration, Hire 3D CGI Artist, AI Model Training Agency, Arexa Private Limited Phone Number"
            canonical="https://arexa.co/contact"
        />

        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 lg:pt-40 lg:pb-24 relative overflow-hidden" ref={heroRef}>
          <div className="absolute inset-0">
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 10, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[100px]"
            />
          </div>

          <div className="section-padding relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.6 }}
                  className="inline-block text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4"
              >
                Claim Free Consultancy
              </motion.span>
              <motion.h1
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ delay: 0.1, duration: 0.8 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Let's Innovate with{" "}
                <motion.span
                    className="gradient-text"
                    initial={{ opacity: 0, x: 30 }}
                    animate={heroInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                  XR & AI
                </motion.span>
              </motion.h1>
              <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg text-muted-foreground"
              >
                Ready to transform your brand with immersive experiences or streamline your business with AI?
                Let's discuss your custom roadmap.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="pb-24 lg:pb-32" ref={sectionRef}>
          <div className="section-padding">
            <div className="grid lg:grid-cols-12 gap-16">
              {/* Contact Info Side */}
              <motion.div
                  initial={{ opacity: 0, x: -60 }}
                  animate={formInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7 }}
                  className="lg:col-span-4"
              >
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={formInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="text-2xl font-bold mb-8"
                >
                  Connect with Experts
                </motion.h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">General Inquiries</p>
                      <a href="mailto:connect@arexa.co" className="text-muted-foreground hover:text-foreground transition-colors">
                        connect@arexa.co
                      </a>
                    </div>
                  </div>

                  {/* AI & Automation Specific */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">XR & AI Strategy</p>
                      <p className="text-muted-foreground text-sm">
                        Speak with our technical leads about custom automation and immersive builds.
                      </p>
                    </div>
                  </div>

                  {/* Office Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-medium mb-1">Office Address</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Ground floor, E-7, E Block,<br />
                        Noida Sector 3, Noida,<br />
                        Uttar Pradesh 201301
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Contact Form Side */}
              <motion.div
                  initial={{ opacity: 0, x: 60 }}
                  animate={formInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="lg:col-span-8"
              >
                <form ref={formElementRef} onSubmit={handleSubmit} className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl border border-border/50 shadow-sm space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          placeholder="Your Full Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                          placeholder="Your Email ID"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                        placeholder="Company / Organization"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Your Vision
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                        placeholder="Tell us about your immersive or automation goals..."
                    />
                  </div>

                  <div className="pt-2">
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group inline-flex items-center justify-center gap-3 bg-[#5C4EE5] text-white w-full h-14 rounded-xl text-lg font-extrabold shadow-xl transition-all duration-300 overflow-hidden border-t border-white/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
                      <span className="relative z-10">
                        {isSubmitting ? "Processing Request..." : "Claim My Free Consultancy"}
                      </span>
                      {!isSubmitting && <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
  );
};

export default Contact;