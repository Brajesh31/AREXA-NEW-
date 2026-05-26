import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async"; // ADDED FOR SEO

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // document.title = "Terms of Service | Arexa Technologies"; // REMOVED: Helmet handles this better now
    }, []);

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            {/* --- SEO INJECTION: TRUST & LEGAL AUTHORITY --- */}
            <Helmet>
                <title>Terms of Service | Arexa Private Limited | Global AR Agency</title>
                <meta name="description" content="Read the Terms of Service for Arexa Private Limited. Legal agreements covering Global AR/VR Services, Snap Lens Development, and Intellectual Property rights." />
                <meta name="keywords" content="Arexa Terms of Service, AR Agency Service Agreement, Intellectual Property Rights AR Filters, Snap Lens Network Partner Legal, Corporate XR Services Contract, Arexa Private Limited Legal, Global AR Campaign Terms, Mumbai Jurisdiction Legal Terms" />
                <link rel="canonical" href="https://arexa.co/terms-of-service" />

                {/* NoIndex is NOT used here because legitimate businesses WANT Google to see their legal pages */}
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
                    <p className="text-gray-500 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                By accessing or using the website operated by <strong>Arexa Technologies Private Limited</strong> ("Arexa"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Service and its original content, features, and functionality (including but not limited to AR filters, 3D assets, code, and designs displayed in our portfolio) are and will remain the exclusive property of Arexa Technologies and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of Arexa.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You agree not to use the website for any unlawful purpose or any purpose prohibited under this clause. You agree not to use the website in any way that could damage the website, the Services, or the general business of Arexa Technologies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed">
                                In no event shall Arexa Technologies, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Governing Law</h2>
                            <p className="text-gray-700 leading-relaxed">
                                These Terms shall be governed and construed in accordance with the laws of <strong>India</strong>, without regard to its conflict of law provisions. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the courts located in <strong>Mumbai, Maharashtra</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about these Terms, please contact us at:
                                <br />
                                <span className="font-bold">connect@arexa.co</span>
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default TermsOfService;