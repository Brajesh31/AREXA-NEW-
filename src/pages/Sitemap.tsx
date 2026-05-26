import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Map, FileText, Briefcase, Layers, Shield } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async"; // ADDED FOR SEO

const Sitemap = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // document.title = "Sitemap | Arexa Technologies"; // REMOVED: Helmet handles this now
    }, []);

    // Define your site structure here
    const siteStructure = [
        {
            category: "Main",
            icon: Map,
            links: [
                { label: "Home", path: "/" },
                { label: "About Us", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "Get a Quote", path: "/contact" },
            ]
        },
        {
            category: "Our Work",
            icon: Briefcase,
            links: [
                { label: "Portfolio", path: "/work" },
                { label: "Case Studies", path: "/insights" }, // Assuming case studies are in insights/work
                { label: "AR Filters Gallery", path: "/work" },
            ]
        },
        {
            category: "Services",
            icon: Layers,
            links: [
                { label: "Snap AR & WebAR", path: "/services" },
                { label: "Virtual Try-On / VR", path: "/services" },
                { label: "Ad Strategy", path: "/services" },
                { label: "Creative Direction", path: "/services" },
            ]
        },
        {
            category: "Insights",
            icon: FileText,
            links: [
                { label: "Blog", path: "/insights" },
                { label: "AR Marketing Trends", path: "/insights" },
                { label: "Tech Updates", path: "/insights" },
            ]
        },
        {
            category: "Legal & Support",
            icon: Shield,
            links: [
                { label: "Privacy Policy", path: "/privacy-policy" },
                { label: "Terms of Service", path: "/terms-of-service" },
                { label: "Help & Support", path: "/contact" },
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            {/* --- SEO INJECTION: SITE STRUCTURE & GLOBAL NAVIGATION --- */}
            <Helmet>
                <title>Sitemap | Arexa Private Limited | Explore Global AR Services</title>
                <meta name="description" content="Navigate the complete list of Arexa's services and pages. Find links to Snap Lens Development, Enterprise VR Training, and Global CGI Advertising solutions." />
                <meta name="keywords" content="Arexa Sitemap, Site Navigation, List of AR Services, VR Training Pages, Snap Lens Partner Links, Global AR Agency Directory, WebAR Service Pages, Enterprise XR Solutions List, Arexa Pages, Website Map" />
                <link rel="canonical" href="https://arexa.co/sitemap" />
            </Helmet>
            {/* --- END SEO --- */}

            <Header />

            <section className="pt-32 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-16">
            <span className="inline-block text-sm font-medium uppercase tracking-widest text-gray-500 mb-4">
              Overview
            </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Sitemap</h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            A complete overview of Arexa's pages, services, and resources to help you navigate our immersive world.
                        </p>
                    </div>

                    {/* Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {siteStructure.map((section, index) => (
                            <motion.div
                                key={section.category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                                        <section.icon size={18} />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{section.category}</h2>
                                </div>

                                <ul className="space-y-4">
                                    {section.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.path}
                                                className="group flex items-center justify-between text-gray-600 hover:text-primary transition-colors font-medium text-sm"
                                            >
                                                {link.label}
                                                <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default Sitemap;