import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Share2, ArrowLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DOMPurify from "dompurify";
import SEO from "@/components/seo/SEO"; // Import the Global SEO Component
import { Helmet } from "react-helmet-async"; // Needed for specific Article Schema
import { useToast } from "@/hooks/use-toast"; // Assuming you have this from previous files

// --- TYPES ---
interface ContentBlock {
    type: 'paragraph' | 'image' | 'heading';
    value: string;
}

interface CaseStudy {
    id: string;
    title: string;
    author: string;
    date: string; // Display Date
    created_at: string; // ✅ ADDED: Database timestamp (Used for SEO only)
    readTime: string;
    brandLogo: string;
    heroImage: string;
    content: string; // JSON String
}

const CaseStudyDetail = () => {
    const { id } = useParams();
    const { toast } = useToast();
    const [data, setData] = useState<CaseStudy | null>(null);
    const [loading, setLoading] = useState(true);

    // --- FETCH DATA ---
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://arexa.co/api/cms.php?type=insights`);
                const allStudies = response.data;
                const found = allStudies.find((s: any) => s.id === id);
                setData(found || null);
            } catch (error) {
                console.error("Error fetching case study:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // --- SHARE FUNCTIONALITY (To flood visitors via social) ---
    const handleShare = async () => {
        if (!data) return;
        const shareData = {
            title: data.title,
            text: `Check out this case study by Arexa: ${data.title}`,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Error sharing", err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({ title: "Link copied to clipboard!" });
        }
    };

    // --- PARSE BLOCKS & GENERATE SEO DESCRIPTION ---
    let blocks: ContentBlock[] = [];
    let seoDescription = "";

    if (data) {
        try {
            if (data.content.trim().startsWith("[")) {
                blocks = JSON.parse(data.content);
                // Extract first paragraph for SEO Description
                const firstPara = blocks.find(b => b.type === 'paragraph');
                seoDescription = firstPara ? firstPara.value.substring(0, 160).replace(/<[^>]*>?/gm, '') + "..." : data.title;
            } else {
                blocks = [{ type: 'paragraph', value: data.content }];
                seoDescription = data.content.substring(0, 160).replace(/<[^>]*>?/gm, '') + "...";
            }
        } catch (e) {
            blocks = [{ type: 'paragraph', value: data.content }];
            seoDescription = data.title;
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!data) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <SEO title="Case Study Not Found | Arexa" description="The requested case study could not be found." />
                <h1 className="text-2xl font-bold">Case Study Not Found</h1>
                <Link to="/insights" className="text-blue-600 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Insights
                </Link>
            </div>
        );
    }

    // --- ARTICLE SCHEMA (CRITICAL FOR GOOGLE DISCOVER) ---
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": data.title,
        "image": [data.heroImage],
        "datePublished": data.created_at, // ✅ Uses the hidden DB date for Freshness Ranking
        "dateModified": data.created_at,
        "author": {
            "@type": "Person",
            "name": data.author || "Arexa Team"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Arexa Private Limited",
            "logo": {
                "@type": "ImageObject",
                "url": "https://arexa.co/assets/logo.png"
            }
        },
        "description": seoDescription
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            {/* 1. DYNAMIC SEO META TAGS */}
            <SEO
                title={`${data.title} | Arexa Case Study`}
                description={seoDescription}
                image={data.heroImage}
                type="article"
                // Generate specific keywords for this article + Global keywords
                keywords={`${data.title}, ${data.author}, AR Case Study, VR Implementation, Arexa Insights, Immersive Marketing Case Study, ${data.title} Analysis`}
            />

            {/* 2. SPECIFIC ARTICLE SCHEMA INJECTION */}
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify(articleSchema)}
                </script>
            </Helmet>

            <Header />

            {/* HERO IMAGE */}
            <section className="pt-24 lg:pt-32 px-4 md:px-8 max-w-[1000px] mx-auto">
                <div className="mb-6">
                    <Link to="/insights" className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-900 transition-colors">
                        <ArrowLeft size={16} className="mr-2" /> Back to Insights
                    </Link>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-sm mb-10 aspect-video relative bg-gray-100">
                    <img
                        src={data.heroImage}
                        alt={data.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            {/* HEADER INFO */}
            <section className="px-4 md:px-8 max-w-3xl mx-auto text-center mb-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    {data.title}
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 font-medium">
                    <div className="flex items-center gap-2">
                        {data.brandLogo && (
                            <img src={data.brandLogo} alt="Author" className="w-6 h-6 rounded-full object-contain bg-gray-100 p-0.5" />
                        )}
                        <span className="text-gray-900">{data.author}</span>
                    </div>
                    <span>•</span>
                    {/* Display user-friendly date, but SEO uses created_at */}
                    <span>{data.date}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{data.readTime}</span>
                    </div>

                    {/* Share Button to boost traffic */}
                    <button
                        onClick={handleShare}
                        className="ml-4 p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                        aria-label="Share this article"
                    >
                        <Share2 size={18} />
                    </button>
                </div>
            </section>

            {/* CONTENT RENDERER */}
            <section className="px-4 md:px-8 max-w-3xl mx-auto pb-12">
                <div className="space-y-8">
                    {blocks.map((block, index) => {
                        // --- IMAGE BLOCK ---
                        if (block.type === 'image') {
                            return (
                                <div key={index} className="my-8 rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                    <img
                                        src={block.value}
                                        alt={`Visual for ${data.title}`}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            );
                        }

                        // --- HEADING BLOCK ---
                        if (block.type === 'heading') {
                            return (
                                <h2 key={index} className="text-2xl md:text-3xl font-bold text-gray-900 mt-12 mb-4">
                                    {block.value}
                                </h2>
                            );
                        }

                        // --- TEXT BLOCK ---
                        return (
                            <div
                                key={index}
                                className="prose prose-lg prose-slate max-w-none text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.value) }}
                            />
                        );
                    })}
                </div>
            </section>

            {/* FOOTER CTA */}
            <section className="px-4 md:px-8 max-w-3xl mx-auto pb-32">
                <div className="border-2 border-indigo-900/10 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
                    <p className="text-sm md:text-base font-bold text-indigo-900 uppercase tracking-wide text-center sm:text-left">
                        Want to build something similar?
                    </p>
                    <Link to="/contact" className="bg-[#1E1B4B] text-white px-8 py-3 rounded-lg text-sm font-bold hover:bg-indigo-900 transition-colors whitespace-nowrap">
                        Contact Us
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
};

export default CaseStudyDetail;