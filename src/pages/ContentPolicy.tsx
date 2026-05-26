import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const ContentPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            {/* --- SEO INJECTION: TRUST & COMPLIANCE --- */}
            <Helmet>
                <title>Content Policy | Arexa Private Limited | AR & VR Guidelines</title>
                <meta name="description" content="Read the Content Policy for Arexa Private Limited. Guidelines for acceptable AR/VR content, Snap Lenses, User-Generated Content, and intellectual property rights." />
                <meta name="keywords" content="Arexa Content Policy, AR Filters Guidelines, Acceptable Use Policy XR, Snap Lens Content Rules, User Generated Content AR, Brand Safety AR Campaigns, Mumbai Tech Agency Guidelines" />
                <link rel="canonical" href="https://arexa.co/content-policy" />
                <meta name="robots" content="index, follow" />
            </Helmet>
            {/* --- END SEO --- */}

            <Header />

            <section className="pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Content Policy</h1>
                    <p className="text-gray-500 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                At <strong>Arexa Technologies Private Limited</strong> ("Arexa"), we are dedicated to creating safe, engaging, and innovative Augmented Reality (AR) and Virtual Reality (VR) experiences. This Content Policy outlines the standards and rules for all content created, hosted, or distributed through our services, including WebAR experiences, social media filters (Snapchat, Instagram), and client campaigns.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Acceptable Use</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We encourage creativity and brand engagement. Content produced and distributed via Arexa must be:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Lawful, accurate, and respectful of public safety.</li>
                                <li>Compliant with the specific platform guidelines where the AR/VR experience is hosted (e.g., Snap Inc. Lens Studio Guidelines, Meta Spark Policies).</li>
                                <li>Respectful of all intellectual property rights and trademarks.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. Prohibited Content</h2>
                            <p className="text-gray-700 leading-relaxed">
                                To maintain a safe environment for all users, Arexa strictly prohibits the creation or distribution of experiences that contain or promote:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                                <li><strong>Hate Speech & Harassment:</strong> Content that demeans, defames, or promotes violence against individuals or groups based on race, ethnicity, religion, disability, gender, or sexual orientation.</li>
                                <li><strong>Explicit Material:</strong> Sexually explicit content, nudity, or highly suggestive material.</li>
                                <li><strong>Violence & Harm:</strong> Graphic violence, self-harm promotion, or dangerous illegal acts.</li>
                                <li><strong>Deceptive Practices:</strong> Phishing, scams, misinformation, or impersonation of brands and individuals.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. User-Generated Content (UGC)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                For AR campaigns that rely on User-Generated Content, Arexa is not responsible for the photos, videos, or text submitted by end-users. However, clients and brands utilizing our technology must ensure proper moderation and reporting mechanisms are in place to prevent the spread of prohibited content.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You may not use Arexa’s services to create content that infringes upon the copyright, trademark, or other intellectual property rights of third parties. If we receive a valid DMCA or copyright infringement notice regarding an AR experience we host, we reserve the right to remove or disable access to the infringing content immediately.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Enforcement and Takedowns</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Arexa reserves the right to review content at our sole discretion. If we determine that an AR/VR experience or campaign violates this Content Policy, we may take corrective action. This may include issuing a warning, suspending the campaign, removing the content, or terminating the client contract without refund.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you need to report a violation of this Content Policy or have questions regarding our guidelines, please contact us at:
                            </p>
                            <ul className="list-none mt-4 space-y-1 text-gray-700">
                                <li><strong>Email:</strong> connect@arexa.co</li>
                                <li><strong>Address:</strong> WeWork Lightbridge, 6th floor, Hiranandani Business Park, Saki Vihar Rd, Mumbai, Maharashtra – 400072</li>
                            </ul>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default ContentPolicy;