import { ReactNode, useState } from "react";
import axios from "axios";
import { Database } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    LogOut,
    Layers,
    FileText,
    Briefcase,
    Users,
    UserPlus,
    Menu,
    ShieldCheck,
    LayoutDashboard,
    Loader2 // ✅ Added Loader Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
    children: ReactNode;
    title: string;
}

const AdminLayout = ({ children, title }: AdminLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // ✅ NEW: State to track logout status
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Get the current user's role from localStorage
    const storedUser = localStorage.getItem("arexa_admin");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const isSuperAdmin = user?.role === 'super_admin';

    const handleLogout = async () => {
        // 1. Start loading UI
        setIsLoggingOut(true);

        try {
            const token = localStorage.getItem("arexa_token");
            if (token) {
                // 2. Send request to delete session in DB
                await axios.post("https://arexa.co/api/logout.php", {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error("Logout warning:", error);
        } finally {
            // 3. Clear client state & redirect
            localStorage.removeItem("arexa_admin");
            localStorage.removeItem("arexa_token");
            navigate("/arexaPaneladmin");
            setIsLoggingOut(false);
        }
    };

    const navItems = [
        { name: "Dashboard Home", icon: LayoutDashboard, path: "/admin/dashboard?tab=overview" },
        { name: "Insights (Case Studies)", icon: Layers, path: "/admin/dashboard?tab=insights" },
        { name: "Editorial Blogs", icon: FileText, path: "/admin/dashboard?tab=blogs" },
        { name: "Portfolio Works", icon: Briefcase, path: "/admin/dashboard?tab=works" },
        { name: "Partner Network", icon: Users, path: "/admin/dashboard?tab=brands" },
        { name: "Database Analytics", icon: Database, path: "/admin/database-analytics" },

    ];

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex font-sans text-gray-900">
            {/* MOBILE OVERLAY */}
            {isMobileOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileOpen(false)} />
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 
                transform transition-transform duration-200 ease-in-out flex flex-col h-screen
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-600/20">
                        <span className="font-bold text-white text-lg">A</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-gray-900">AREXA <span className="text-blue-600">CMS</span></h1>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Enterprise Admin</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                    <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Main Menu</p>
                    {navItems.map((item) => {
                        const isActive = location.search.includes(item.path.split('?')[1]);
                        return (
                            <button
                                key={item.name}
                                onClick={() => {
                                    navigate(item.path);
                                    setIsMobileOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group font-medium ${
                                    isActive ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon size={20} className={isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}

                    {/* Only show Sidebar Admin Button if user is Super Admin */}
                    {isSuperAdmin && (
                        <div className="pt-6 mt-6 border-t border-gray-100">
                            <p className="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">System</p>
                            <button
                                onClick={() => navigate("/admin/create-admin")}
                                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all font-medium group"
                            >
                                <div className="p-1 bg-gray-100 group-hover:bg-emerald-100 rounded-md transition-colors">
                                    <UserPlus size={16} />
                                </div>
                                <span>Grant Access</span>
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md uppercase">
                            {user?.email?.[0] || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate uppercase">{user?.role?.replace('_', ' ') || 'Admin'}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"/> Online
                            </p>
                        </div>
                    </div>

                    {/* ✅ UPDATED LOGOUT BUTTON */}
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 bg-white border border-red-100 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all shadow-sm font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Signing Out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut size={16} />
                                <span>Sign Out Securely</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F3F4F6]">
                <header className="h-20 flex-shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileOpen(true)} className="lg:hidden text-gray-500">
                            <Menu size={24} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Only show Header Admin Button if user is Super Admin */}
                        {isSuperAdmin && (
                            <Button
                                onClick={() => navigate("/admin/create-admin")}
                                className="hidden md:flex bg-black hover:bg-gray-800 text-white gap-2 h-10 rounded-xl"
                            >
                                <UserPlus size={16} /> Add Admin
                            </Button>
                        )}
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
                            <ShieldCheck size={14} />
                            <span>ENCRYPTED</span>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 pb-20">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;