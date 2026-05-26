import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, ArrowRight, ShieldCheck, Lock } from "lucide-react";

const API_BASE = "https://arexa.co/api";

const Login = () => {
    // --- LOGIC STARTS ---
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem("arexa_admin")) navigate("/admin/dashboard");
    }, [navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE}/login.php`, { email, password });

            if (data.status === "success") {
                localStorage.setItem("arexa_admin", JSON.stringify(data.user));
                localStorage.setItem("arexa_token", data.token);

                toast.success("Identity Verified. Welcome back.");
                navigate("/admin/dashboard");
            } else {
                // ✅ UPDATE 1: Handle logical errors (200 OK but error status)
                toast.error(data.message || "Access Denied");
            }
        } catch (error: any) {
            // ✅ UPDATE 2: Handle HTTP errors (401/403 from PHP)
            // This captures "Account Locked" or "Invalid Credentials" messages from the server
            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                toast.error(serverMessage);
            } else {
                toast.error("Connection Error. Please check your network.");
            }
        } finally {
            setLoading(false);
        }
    };
    // --- LOGIC ENDS ---

    // --- UPDATED UI (Light Theme Enterprise) ---
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 md:p-10">

                {/* Header */}
                <div className="text-center space-y-3 mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <span className="text-xl font-bold text-white">A</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">AREXA Admin</h1>
                        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mt-1">
                            Authorized Personnel Only
                        </p>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1">Admin ID</label>
                            <Input
                                type="email"
                                placeholder="Enter your ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1">Security Key</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 transition-all"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer / Utility */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-400 font-medium">
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck size={12} />
                        <span>256-bit Secure</span>
                    </div>
                    <button
                        onClick={() => navigate("/admin/forgot-password")}
                        className="hover:text-blue-600 transition-colors flex items-center gap-1"
                    >
                        <Lock size={10} />
                        Recover Access
                    </button>
                </div>
            </div>

            {/* Copyright / Bottom Text */}
            <div className="fixed bottom-6 text-[10px] text-gray-400 text-center w-full pointer-events-none">
                &copy; 2025 AREXA Enterprise System.
            </div>
        </div>
    );
};

export default Login;