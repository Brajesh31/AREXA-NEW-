import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    keywords?: string; // ✅ ADDED: Fixes TS2322 Error globally
    image?: string;
}

const SEO = ({
                 title = "Arexa | Snap AR Partner & Futuristic XR Studio ",
                 description = "Arexa is a top-tier Snap AR & WebAR Agency. We specialize in Custom Virtual Try-On, Immersive Ads, and 3D CGI for global brands. Hire our expert developers for your next Augmented Reality campaign.",
                 canonical = "https://arexa.co/",
                 type = 'website',
                 image = "https://arexa.co/assets/og-image.jpg", // Ensure you have a high-quality OG image here
                 // ✅ ULTIMATE TRAFFIC FLOOD KEYWORD LIST (2026 TRENDS + HIGH VOLUME)
                 keywords = `
        Arexa Snap AR Partner, Official Snap AR Agency,
        Arexa vs Zappar, Custom WebAR vs DIY,
        Arexa vs Lenslist, Arexa vs Flam,
        Chhavi Garg Founder, Brajesh Kumar Developer,
        Bharat XR Community,
        
        // --- 2026 HIGH VOLUME TRENDS ---
        Spatial Computing Agency, Apple Vision Pro Developers,
        Generative Engine Optimization (GEO), Answer Engine Optimization (AEO),
        AI Video Ads Production, Generative AI Marketing Services,
        Agentic AI Solutions, AI-Enhanced Creative Studio,
        Zero-Click Search Optimization, Conversational Search Marketing,
        Social Commerce 2.0, Gamification Marketing Agency,
        
        // --- CORE SERVICES ---
        Virtual Try On Agency, High Fidelity AR, augmented reality studio, 
        AR experience agency, immersive AR brand experiences, 
        virtual reality campaign studio, AR VR creative agency, 
        Snap AR lens studio, Snapchat AR filter agency, 
        Snap AR campaign development, branded Snapchat lenses, 
        Snap AR experience design, AR marketing agency, 
        immersive brand activation AR, interactive AR campaigns, 
        AR advertising solutions, WebAR experiences, CGI + AR campaigns, 
        AR filters for brands, AR storytelling, experiential marketing AR, 
        interactive brand experiences, virtual try on ar, ar filters for brands, 
        webar agency, xr applications for brands, cgi ar campaigns, 
        ar activation agency, snap ar lens development for brands, 
        ar marketing campaigns examples, virtual try on for ecommerce brands, 
        webar experiences for websites, cost of snapchat ar filters, 
        ar filters for product launches, branded ar experiences agency india, 
        ar vr studio, augmented reality agency, immersive experience studio, 
        ar brand experiences, snap ar lens development, 
        snapchat ar filter agency, snap ar studio, branded snapchat lenses, 
        social ar filters, ar marketing agency, immersive ar campaigns, 
        ar advertising solutions, web ar experiences, virtual try on ar, 
        ar filters for brands, webar agency, xr applications for brands, 
        snap ar lenses, snapchat ar filters, snap ar lens development, 
        social ar filters, branded snapchat lenses, webar experiences, 
        ar for websites, virtual try-on ar, virtual try-on solutions, 
        ar marketing campaigns, immersive ar marketing, ar brand experiences, 
        ar advertising agency, snap ar lenses for brands, 
        webar experiences no app required, virtual try-on ar for ecommerce, 
        immersive ar marketing examples, snapchat ar filters agency, 
        ar marketing for product launches, branded social ar filters development, 
        cost of snap ar campaigns, ar vr studio, ar xr studio, 
        immersive ar xr experiences, snap ar lens development agency, 
        snapchat ar filters agency, webar marketing agency, 
        virtual try-on ar studio, ar mirrors agency, ar filters beauty brands, 
        digital fashion ar, snap ar filters for beauty, 
        virtual try-on solutions fashion, ar mirrors retail brands, 
        web ar virtual try-on, immersive ar campaigns beauty, 
        custom webar studio, ar xr agency for brands, 
        bespoke snap ar development, virtual try-on ar agency, 
        immersive ar marketing studio, web ar experiences agency, 
        ar brand campaigns development, custom webar development for brands, 
        webar agency vs no-code platform, bespoke webar experiences studio, 
        web ar marketing campaigns agency, virtual try-on and webar for ecommerce, 
        ar studio vs ar platform 2025, cost of custom webar campaigns, 
        hire ar agency for branded webar, snap ar lens development agency, 
        custom branded snapchat lenses, snap ar marketing agency, 
        snapchat ar filters for brands, snap ar campaigns examples, 
        snap ar lens studio partner, how brands use snap ar for marketing, 
        snap ar marketing campaigns examples, custom snap ar lens development for brands, 
        branded snapchat ar lenses agency, snap ar vs instagram ar for brands, 
        cost of custom snap ar campaigns, best snap ar agency 2025, 
        snap ar lens creator marketplace alternative, custom ar xr studio, 
        bespoke ar agency brands, snap ar lens agency, webar immersive campaigns, 
        ar marketing agency alternative, immersive brand experiences studio, 
        ar vs mixed reality platform, custom mixed reality campaigns, 
        immersive ar xr agency, custom ar agency vs ai mixed reality platform, 
        bespoke immersive campaigns for brands 2025, ar xr studio alternative to flam, 
        custom snap ar vs ai generated mr, immersive advertising agency roi, 
        why choose custom ar studio over ai platforms, bespoke ar campaigns examples, 
        ar agency for interactive advertising, ar creator, ar developer, 
        augmented reality creator, snapchat ar developer, instagram ar filter creator, 
        freelance ar developer india, ar effects creator, interactive ar experiences, 
        custom ar filters, webar developer, hire ar creator for brand campaign, 
        freelance snapchat ar developer, instagram ar filter for marketing, 
        ar creator portfolio india, xr developer, ar creative technologist, 
        interactive experience designer, augmented reality portfolio, 
        immersive experience design, spatial computing projects, 
        creative technology portfolio, interactive installations ar, 
        xr developer portfolio, ar creative technologist india, 
        interactive ar experience designer, immersive xr projects portfolio, 
        enterprise creative services, design subscription services, 
        creative as a service caas, ai-powered design services, 
        brand design agency for enterprises, scalable creative teams, 
        on-demand design services, motion graphics production services, 
        social media creative services, web design for enterprise, 
        best creative services for enterprise marketing, ai design services for large brands, 
        outsource brand creative production, how to scale design output for big teams, 
        creative subscription model for enterprise brands, immersive experience design, 
        ar vr creative studio, augmented reality agency, virtual reality production, 
        xr experience design, interactive media studio, webxr experiences, 
        experiential media production, immersive brand experiences, 
        ar/vr for retail, vr installation experiences, xr storytelling and media, 
        ar experience studio for brands, virtual reality production companies, 
        immersive xr solutions for events, best ar creative agency, 
        interactive augmented reality campaigns, webxr for marketing engagement`
             }: SEOProps) => {

    const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://arexa.co/organization",
                "name": "Arexa",
                "alternateName": ["Arexa Private Limited", "Arexa Studio", "Arexa XR"],
                "url": "https://arexa.co/",
                "logo": "https://arexa.co/assets/logo.png",
                "slogan": "The Future of Immersive Brand Marketing",
                "description": "Official Snap AR Partner & Global XR Studio. We build High-Fidelity AR, VR & CGI for Enterprise Brands using Spatial Computing and Generative AI.",
                // VERIFICATION: SNAP AR PARTNER
                "memberOf": {
                    "@type": "Organization",
                    "name": "Snap AR Partner Network",
                    "url": "https://ar.snap.com/"
                },
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-7678158081",
                    "contactType": "sales",
                    "areaServed": ["US", "GB", "AE", "SA", "IN", "SG", "DE", "FR", "JP", "CN"],
                    "availableLanguage": ["English", "Hindi"]
                },
                // --- ULTIMATE GLOBAL COMPETITOR INTERCEPTION LIST ---
                "competitor": [
                    // Platforms (Global)
                    { "@type": "Organization", "name": "Lenslist" },
                    { "@type": "Organization", "name": "Zappar" },
                    { "@type": "Organization", "name": "FFFACE.ME" },
                    { "@type": "Organization", "name": "Flam" },
                    { "@type": "Organization", "name": "Aircards" },
                    { "@type": "Organization", "name": "8th Wall" }, // Niantic
                    { "@type": "Organization", "name": "Blippar" },
                    { "@type": "Organization", "name": "PlugXR" },
                    // USA (North America Leaders)
                    { "@type": "Organization", "name": "Groove Jones" },
                    { "@type": "Organization", "name": "CitrusBits" },
                    { "@type": "Organization", "name": "Trigger XR" },
                    { "@type": "Organization", "name": "Magnopus" },
                    { "@type": "Organization", "name": "MediaMonks" }, // Global/US
                    { "@type": "Organization", "name": "Zco Corporation" },
                    { "@type": "Organization", "name": "Saritasa" },
                    { "@type": "Organization", "name": "Treeview" },
                    { "@type": "Organization", "name": "Out Origin" }, // Canada
                    { "@type": "Organization", "name": "Tru Agency" }, // Canada
                    // UK & Europe (Creative Hubs)
                    { "@type": "Organization", "name": "UNIT9" }, // UK/Global
                    { "@type": "Organization", "name": "Visualise Immersive" }, // UK
                    { "@type": "Organization", "name": "Nexus Studios" }, // UK
                    { "@type": "Organization", "name": "Takeaway Reality" }, // UK
                    { "@type": "Organization", "name": "Dept" }, // Netherlands/Global
                    { "@type": "Organization", "name": "Innoactive" }, // Germany
                    { "@type": "Organization", "name": "VISARD" }, // France
                    { "@type": "Organization", "name": "Emissive" }, // France
                    { "@type": "Organization", "name": "Nedd" }, // France
                    { "@type": "Organization", "name": "YORD" }, // Czech/Global
                    // Middle East (Dubai/Saudi - Big Spenders)
                    { "@type": "Organization", "name": "GameIN" }, // UAE
                    { "@type": "Organization", "name": "Ortmor Agency" }, // UAE
                    { "@type": "Organization", "name": "DigiTrends" }, // UAE
                    { "@type": "Organization", "name": "Proven Reality" }, // Saudi Arabia
                    // Asia (Tech & Mfg)
                    { "@type": "Organization", "name": "Simbott" }, // India
                    { "@type": "Organization", "name": "Parallax Labs" }, // India
                    { "@type": "Organization", "name": "Tata Elxsi" }, // India
                    { "@type": "Organization", "name": "VizioFly" }, // Singapore
                    { "@type": "Organization", "name": "FXMedia" }, // Singapore
                    { "@type": "Organization", "name": "GIANTY" }, // Japan
                    { "@type": "Organization", "name": "EasyXR" }, // China
                    { "@type": "Organization", "name": "JoyAether" }, // China
                    { "@type": "Organization", "name": "Kivisense" }, // China
                    // Australia & South America
                    { "@type": "Organization", "name": "7DX" }, // Australia
                    { "@type": "Organization", "name": "Chaos Theory" }, // Australia
                    { "@type": "Organization", "name": "VRMonkey" }, // Brazil
                    { "@type": "Organization", "name": "Bugaboo Studio" } // Brazil
                ],
                // FOUNDER: Chhavi Garg
                "founders": [
                    {
                        "@type": "Person",
                        "name": "Chhavi Garg",
                        "jobTitle": "Founder & CEO",
                        "url": "https://www.linkedin.com/in/chhavigarg-profile",
                        "sameAs": ["https://twitter.com/chhavigg"]
                    }
                ],
                // EMPLOYEE: Brajesh Kumar
                "employee": [
                    {
                        "@type": "Person",
                        "name": "Brajesh Kumar",
                        "jobTitle": "Lead Software Engineer",
                        "description": "Full-stack developer and AR engineer working at Arexa and Bharat XR.",
                        "sameAs": [
                            "https://github.com/Brajesh31",
                            "https://www.linkedin.com/in/brajesh-kumar-9b58651a8"
                        ]
                    }
                ],
                // SISTER BRAND: Bharat XR
                "department": {
                    "@type": "Organization",
                    "name": "Bharat XR",
                    "url": "https://bharatxr.co",
                    "description": "The emerging tech community sister brand of Arexa.",
                    "employee": [
                        {
                            "@type": "Person",
                            "name": "Brajesh Kumar",
                            "jobTitle": "Community Developer"
                        }
                    ]
                }
            }
        ]
    };

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonical} />

            {/* KEYWORDS META TAG (Uses Prop or Default) */}
            <meta name="keywords" content={keywords} />

            {/* ROBOTS: AGGRESSIVE INDEXING */}
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

            {/* OPEN GRAPH */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Arexa Private Limited" />
            <meta property="og:locale" content="en_US" />

            {/* TWITTER */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:creator" content="@Arexaxr" />

            {/* SCHEMA INJECTION */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;