import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async"; // ADDED FOR SEO

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // document.title = "Privacy Policy | Arexa Technologies"; // REMOVED: Helmet handles this now
    }, []);

    return (
        <main className="min-h-screen bg-white text-gray-900 font-sans">
            {/* --- SEO INJECTION: TRUST & SECURITY --- */}
            <Helmet>
                <title>Privacy Policy | Arexa Private Limited | Global Data Security</title>
                <meta name="description" content="Arexa Private Limited Privacy Policy. How we protect data for Global AR/VR clients, Enterprise Partners, and Website Visitors. Compliance with Data Security Standards." />
                <meta name="keywords" content="Arexa Privacy Policy, Data Protection AR Agency, User Data Security, Enterprise XR Data Policy, Mumbai Jurisdiction Privacy, Official Snap Lens Partner Data Safety, Global AR Agency Privacy, Website Cookie Policy" />
                <link rel="canonical" href="https://arexa.co/privacy-policy" />
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
                    <p className="text-gray-500 mb-10">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="prose prose-lg prose-gray max-w-none space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Welcome to <strong>Arexa Technologies Private Limited</strong> ("Arexa," "we," "our," or "us"). We are committed to protecting your privacy and ensuring your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, and protect your data when you visit our website (arexa.co) or engage with our AR/VR services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                We may collect the following types of information:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li><strong>Personal Identification Information:</strong> Name, email address, phone number, and company name when you fill out our contact forms.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, device information, and operating system via analytics tools to improve user experience.</li>
                                <li><strong>Usage Data:</strong> Information on how you interact with our website, such as pages visited and time spent.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We use the collected data for the following purposes:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                                <li>To provide and maintain our Service.</li>
                                <li>To notify you about changes to our Service.</li>
                                <li>To provide customer support and respond to inquiries.</li>
                                <li>To gather analysis or valuable information so that we can improve our Service.</li>
                                <li>To monitor the usage of the Service.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">4. Cookies and Tracking Technologies</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us:
                            </p>
                            <ul className="list-none mt-4 space-y-1 text-gray-700">
                                <li><strong>Email:</strong> connect@arexa.co</li>
                                <li><strong>Address:</strong> WeWork VO-163, Hiranandani Business Park, Saki Vihar Rd, Mumbai, Maharashtra – 400072</li>
                            </ul>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
};

export default PrivacyPolicy;