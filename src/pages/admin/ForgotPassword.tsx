import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Mail, Loader2, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://arexa.co/api";

const ForgotPassword = () => {
    // --- LOGIC STARTS (Untouched) ---
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/forgot_password.php`, { email });
            toast.success("Recovery protocol initiated. Check your email.");
            setEmail("");
        } catch {
            toast.error("Request failed.");
        } finally {
            setLoading(false);
        }
    };
    // --- LOGIC ENDS ---

    // --- UPDATED UI (Light Theme Enterprise) ---
    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Back Link */}
                <button
                    onClick={() => navigate("/arexaPaneladmin")}
                    className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={16} className="mr-2"/> Return to Login
                </button>

                {/* Main Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-8">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="space-y-2">
                            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                                <Mail size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Account Recovery</h1>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Enter your authorized email address. We will send you a secure link to reset your credentials.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700 ml-1">Work Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                                    <Input
                                        type="email"
                                        placeholder="admin@arexa.co"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-gray-50 border-gray-200 text-gray-900 pl-10 h-11 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:bg-white transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-lg font-semibold shadow-sm transition-all active:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Send Secure Link"}
                            </Button>
                        </form>
                    </div>

                    {/* Footer Utility */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>This connection is encrypted</span>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-6 text-[10px] text-gray-400">
                    &copy; 2025 AREXA Inc. Security Systems.
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;