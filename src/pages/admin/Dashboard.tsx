import { useSearchParams } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import BlogManager from "./managers/BlogManager";
import InsightManager from "./managers/InsightManager";
import WorkManager from "./managers/WorkManager";
import BrandManager from "./managers/BrandManager";
import DashboardHome from "./managers/DashboardHome"; // ✅ Import the new component

// Design Update: Map technical tab names to professional UI titles
const PAGE_TITLES: Record<string, string> = {
    overview: "Mission Control", // ✅ New Title
    insights: "Case Study Management",
    blogs: "Editorial Console",
    works: "Portfolio Projects",
    brands: "Partner Network",
};

const Dashboard = () => {
    const [searchParams] = useSearchParams();
    // ✅ Change default from "insights" to "overview"
    const tab = searchParams.get("tab") || "overview";

    // UI Logic: Get the professional title or fallback to capitalized tab name
    const displayTitle = PAGE_TITLES[tab] || `${tab.charAt(0).toUpperCase() + tab.slice(1)} Manager`;

    return (
        <AdminLayout title={displayTitle}>
            {/* ✅ Add the Dashboard Home check */}
            {tab === "overview" && <DashboardHome />}
            {tab === "blogs" && <BlogManager />}
            {tab === "insights" && <InsightManager />}
            {tab === "works" && <WorkManager />}
            {tab === "brands" && <BrandManager />}
        </AdminLayout>
    );
};

export default Dashboard;