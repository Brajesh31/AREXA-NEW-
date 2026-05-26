import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// 1. Import the provider
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
    // 2. Wrap your App with HelmetProvider to enable dynamic SEO
    <HelmetProvider>
        <App />
    </HelmetProvider>
);