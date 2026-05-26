import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Helmet } from "react-helmet-async"; // ADDED FOR SEO
import arexaLogo from "@/assets/arexa-logo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
      <main className="min-h-screen bg-background flex flex-col">
        {/* --- SEO INJECTION: NOINDEX STRATEGY --- */}
        <Helmet>
          <title>Page Not Found | Arexa Private Limited</title>
          <meta name="description" content="The page you are looking for does not exist. Return to Arexa Private Limited homepage for AR/VR services." />
          {/* CRITICAL: Tell Google NOT to index this page, but FOLLOW links back to home */}
          <meta name="robots" content="noindex, follow" />
        </Helmet>
        {/* --- END SEO --- */}

        {/* Simple Header */}
        <header className="section-padding py-6">
          <Link to="/">
            <img src={arexaLogo} alt="Arexa" className="h-8" />
          </Link>
        </header>

        {/* 404 Content */}
        <div className="flex-1 flex items-center justify-center section-padding">
          <div className="text-center max-w-lg">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
            <span className="text-[120px] md:text-[180px] font-bold leading-none gradient-text">
              404
            </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-2xl md:text-3xl font-bold text-foreground mb-4"
            >
              Page Not Found
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-muted-foreground mb-8"
            >
              The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                  to="/"
                  className="gradient-bg text-primary-foreground px-6 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:opacity-90 transition-all duration-300"
              >
                <Home size={18} />
                Back to Home
              </Link>
              <a
                  href="https://www.canva.com/design/DAGb6aicPhw/r5zoHRvS1KM1QoOyHc58HQ/view"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full font-medium border border-border bg-card inline-flex items-center gap-2 hover:bg-muted transition-colors duration-300 text-foreground"
              >
                <ArrowLeft size={18} />
                View Portfolio
              </a>
            </motion.div>
          </div>
        </div>

        {/* Simple Footer */}
        <footer className="section-padding py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arexa Technologies Private Limited
        </footer>
      </main>
  );
};

export default NotFound;