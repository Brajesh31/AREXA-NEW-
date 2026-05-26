import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";
import ContentPolicy from "./pages/ContentPolicy";
// Components
import LoadingScreen from "@/components/ui/LoadingScreen";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Work from "./pages/Work";
import Industries from "./pages/Industries";
import About from "./pages/About";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import { useVideoPreload } from "./hooks/useVideoPreload";
import { useVisitorTracker } from "./hooks/useVisitorTracker";
import CookieConsent from "@/components/ui/CookieConsent";

import CaseStudyDetail from "@/pages/CaseStudyDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Sitemap from "./pages/Sitemap";
import DatabaseDashboard from "./pages/admin/DatabaseDashboard";

// --- ADMIN IMPORTS ---
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import CreateAdmin from "./pages/admin/CreateAdmin";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";

// ✅ Import the Intelligent Analytics Engine (Preserved)
import { analytics } from "@/lib/analytics";

const queryClient = new QueryClient();

// 🛡️ STEALTH SECURITY WRAPPER
const ProtectedRoute = () => {
  const isAdmin = localStorage.getItem("arexa_admin");
  return isAdmin ? <Outlet /> : <NotFound />;
};

// 🔗 REDIRECT COMPONENT
const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return <LoadingScreen />;
};

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const pageTransition = {
  type: "tween" as const,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  duration: 1.2,
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { showConsent, updateConsent } = useVisitorTracker();

  // 2. ✅ HYBRID TRACKING SYSTEM (Fixed TS Errors)
  useEffect(() => {
    let active = true;

    const trackMetrics = async () => {
      try {
        if (!active) return;

        const currentUrl = encodeURIComponent(window.location.href);
        await axios.post("https://arexa.co/api/track_visit_log.php");
        await axios.post(`https://arexa.co/api/track_page_hit.php?url=${currentUrl}`);
        analytics.startPageTracking();

        if (!sessionStorage.getItem('arexa_tech_captured')) {
          const canvas = document.createElement('canvas');
          // Fix: Explicitly cast context to prevent TypeScript union errors
          const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

          let gpu = 'Unknown';
          if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
              gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
            // 🧹 CLEANUP: Force context loss to free GPU memory
            // Fix: Added optional chaining and casting to handle potential nulls
            gl.getExtension('WEBGL_lose_context')?.loseContext();
          }

          const nav = navigator as any;
          const connType = nav.connection ? nav.connection.effectiveType : '4g';

          await axios.post('https://arexa.co/api/record_tech_details.php', {
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            pixel_ratio: window.devicePixelRatio,
            gpu_renderer: gpu,
            browser_language: navigator.language,
            connection_type: connType
          });
          sessionStorage.setItem('arexa_tech_captured', 'true');
        }
      } catch (error) {
        console.error("Analytics tracking silent fail");
      }
    };

    trackMetrics();

    return () => { active = false; };
  }, [location.pathname]);

  // SMART PRELOAD: Now using .webm to save bandwidth
  useVideoPreload([
    "/hero-video-1.webm",
    "/hero-video-2.webm",
    "/hero-video-3.webm",
    "/hero-video-4.webm",
    "/hero-video-6.webm",
  ]);

  return (
      <>
        <CookieConsent show={showConsent} onUpdate={updateConsent} />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
              key={location.pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
              style={{ willChange: "transform, opacity" }}
          >
            <Routes location={location}>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/work" element={<Work />} />
              <Route path="/portfolio" element={<Work />} />
              <Route path="/portfolio/:id" element={<Work />} />
              <Route path="/industries" element={<Industries />} />
              <Route path="/about" element={<About />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/casestudy/:id" element={<CaseStudyDetail />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/content-policy" element={<ContentPolicy />} />

              {/* --- FOLDER REDIRECTS --- */}

              {/* 🎮 SPACE GAME ROUTE */}
              <Route path="/spacegame" element={<ExternalRedirect to="/spacegame/index.html" />} />

              <Route path="/arbook" element={<ExternalRedirect to="https://chat.whatsapp.com/K8ZSK9sOARB7j5jCv0etBD" />} />
              <Route path="/armeetup" element={<ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSfDn22hpU0glJCMAv5SNn22exFRc3QLHb0Bks2lakD4GrLBkw/viewform?usp=sf_link" />} />
              <Route path="/chhavigg" element={<ExternalRedirect to="https://www.linkedin.com/in/chhavigg/" />} />
              <Route path="/christmaswonderland" element={<ExternalRedirect to="https://www.instagram.com/ar/1264963668056892" />} />
              <Route path="/comicconfilter" element={<ExternalRedirect to="https://www.instagram.com/ar/1998360747303637/?ch=YzkyNjNmY2NhZjQxNWE4MjYyYzUwMzNlNDU0ZjNmMmM%3D" />} />
              <Route path="/dinoworld" element={<ExternalRedirect to="https://arexa.co/dinoworldar/" />} />
              <Route path="/globalpizzaparty" element={<ExternalRedirect to="https://lens.snap.com/experience/c1f0577a-7384-4cf3-bc22-16204b70dbe3" />} />
              <Route path="/hiring" element={<ExternalRedirect to="https://forms.gle/sC8ybpKmpCaVHaWSA" />} />
              <Route path="/hiringsubmission" element={<ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSc5MWqoLtR7gWOTC2eZVrODoc_kWYjrwVKnOg5_ivtrrPpCEw/viewform?usp=sharing" />} />
              <Route path="/mumbai-creators" element={<ExternalRedirect to="https://snap.bevy.com/e/mpqtn3/" />} />
              <Route path="/mumbai-marketers" element={<ExternalRedirect to="https://snap.bevy.com/e/m634ms/" />} />
              <Route path="/pranjalnahata" element={<ExternalRedirect to="https://www.linkedin.com/in/pranjalnahata/" />} />
              <Route path="/shredderrun" element={<ExternalRedirect to="https://lens.snap.com/experience/2eba5b4c-20e2-465b-8f7e-8429d8558dcc" />} />
              <Route path="/snapardelhi" element={<ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSfDn22hpU0glJCMAv5SNn22exFRc3QLHb0Bks2lakD4GrLBkw/viewform?usp=sf_link" />} />
              <Route path="/snaproadshowdelhi" element={<ExternalRedirect to="https://docs.google.com/forms/d/e/1FAIpQLSd63X1hfbw2PcOweF8E2Za-tjL95VkcClORXDpPHoeWeJs0kw/viewform?usp=sf_link" />} />
              <Route path="/stickar" element={<ExternalRedirect to="https://chat.whatsapp.com/K8ZSK9sOARB7j5jCv0etBD" />} />
              <Route path="/zippirun" element={<ExternalRedirect to="https://lens.snap.com/experience/f80379bb-1173-41c1-b47d-19e1b4e7e98b" />} />

              {/* --- ADMIN ROUTES --- */}
              <Route path="/arexaPaneladmin" element={<Login />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/reset-password" element={<ResetPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/database-analytics" element={<DatabaseDashboard />} />
                <Route path="/admin/create-admin" element={<CreateAdmin />} />
              </Route>

              {/* Catch All - 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Exact 2-second premium loading screen wait
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatePresence mode="wait">
                {isLoading ? (
                    <LoadingScreen key="loader" />
                ) : (
                    <AnimatedRoutes key="app-routes" />
                )}
              </AnimatePresence>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
  );
};

export default App;