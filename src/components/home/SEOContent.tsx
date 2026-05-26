import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"; // Assuming you have shadcn/ui or similar, otherwise standard HTML details/summary works

const SEOContent = () => {
    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4 md:px-8">

                {/* SEO Header: Targets high-level agency keywords */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Why Partner with Arexa for <span className="text-primary">Immersive Brand Experiences?</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        As an <strong>Official Snap AR Partner</strong> and a leading <strong>Augmented Reality Studio</strong>,
                        Arexa bridges the gap between creative storytelling and high-fidelity AR technology.
                        From <strong>Virtual Try-On for Ecommerce</strong> to <strong>Custom WebAR campaigns</strong>,
                        we deliver scalable solutions for global brands.
                    </p>
                </div>

                {/* FAQ Accordion: Targets specific long-tail keywords ("Cost", "Vs", "How to") */}
                <Accordion type="single" collapsible className="w-full">

                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-lg font-semibold text-gray-800">
                            How does Arexa compare to platforms like Zappar, Lenslist, or Flam?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Unlike DIY platforms, Arexa is a full-service <strong>Custom WebAR and Snap AR Agency</strong>. While platforms like <strong>Zappar</strong> or <strong>Flam</strong> offer tools, Arexa provides end-to-end <strong>Snap AR campaign development</strong>, creative strategy, and bespoke development. We don't just host filters; we design <strong>immersive AR brand experiences</strong> that outperform templates found on <strong>Lenslist</strong>.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-lg font-semibold text-gray-800">
                            Do you offer Virtual Try-On solutions for Fashion & Beauty brands?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Yes. We specialize in <strong>Virtual Try-On AR</strong> for ecommerce, including <strong>AR mirrors for retail brands</strong>, <strong>digital fashion AR</strong>, and <strong>Snap AR filters for beauty</strong>. Our <strong>High Fidelity AR</strong> ensures products look realistic, driving higher engagement and conversion rates compared to standard <strong>social AR filters</strong>.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                        <AccordionTrigger className="text-lg font-semibold text-gray-800">
                            What is the cost of a Custom Snap AR or WebAR Campaign?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            The <strong>cost of Snap AR campaigns</strong> varies based on complexity. As a specialized <strong>Snap AR Lens Studio Partner</strong>, we offer scalable options ranging from simple <strong>branded Snapchat lenses</strong> to complex <strong>WebAR experiences (no app required)</strong>. Contact our <strong>AR marketing agency</strong> team for a bespoke quote tailored to your <strong>product launch</strong> or <strong>brand activation</strong>.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                        <AccordionTrigger className="text-lg font-semibold text-gray-800">
                            Who is behind Arexa's creative technology?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Arexa was founded by <strong>Chhavi Garg</strong>, a visionary in the <strong>Bharat XR Community</strong>, and is supported by lead developers like <strong>Brajesh Kumar</strong>. Our team consists of expert <strong>AR Creators</strong>, <strong>Creative Technologists</strong>, and <strong>XR Developers</strong> dedicated to pushing the boundaries of <strong>Spatial Computing</strong> and <strong>Interactive Experience Design</strong>.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                        <AccordionTrigger className="text-lg font-semibold text-gray-800">
                            Do you provide white-label or outsourced AR production services?
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600 leading-relaxed">
                            Absolutely. We offer <strong>Creative as a Service (CaaS)</strong> and <strong>Design Subscription Services</strong> for enterprises. Whether you need to <strong>outsource brand creative production</strong>, scale your design team on-demand, or hire a dedicated <strong>Snapchat AR developer</strong>, Arexa acts as your backend <strong>AR VR Creative Studio</strong>.
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>

                {/* Hidden SEO Footer Link Block (Great for "Near Me" or specific keyword indexing) */}
                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-400">
                    <span>Augmented Reality Agency</span>
                    <span>•</span>
                    <span>Virtual Reality Campaign Studio</span>
                    <span>•</span>
                    <span>WebAR Marketing Agency</span>
                    <span>•</span>
                    <span>Interactive AR Campaigns</span>
                    <span>•</span>
                    <span>CGI + AR Campaigns</span>
                    <span>•</span>
                    <span>Snap AR Lens Development Agency</span>
                    <span>•</span>
                    <span>Freelance AR Developer India</span>
                </div>
            </div>
        </section>
    );
};

export default SEOContent;