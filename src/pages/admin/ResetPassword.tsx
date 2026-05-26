import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { LockKeyhole, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";

const API_BASE = "https://arexa.co/api";

const ResetPassword = () => {
    // --- LOGIC STARTS (Untouched) ---
    const [searchParams] = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token || !email) return toast.error("Invalid link.");
        if (password !== confirmPassword) return toast.error("Passwords do not match.");

        setLoading(true);
        try {
            const { data } = await axios.post(`${API_BASE}/reset_password.php`, {
                token, email, new_password: password
            });

            if (data.status === "success") {
                toast.success("Security credentials updated.");
                navigate("/arexaPaneladmin");
            } else {
                toast.error(data.message || "Link expired.");
            }
        } catch {
            toast.error("Update failed.");
        } finally {
            setLoading(false);
        }
    };
    // --- LOGIC ENDS ---

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">

                {/* Header with Icon */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 mb-4">
                        <LockKeyhole size={20} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-900 tracking-tight">Set New Password</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Please create a strong, unique password for your admin account.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleUpdate} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1">New Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="h-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 focus-visible:bg-white transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700 ml-1">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-0 focus-visible:bg-white transition-all"
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm mt-2 transition-all active:scale-[0.98]"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "Update Credentials"}
                    </Button>
                </form>

                {/* Footer Trust Indicator */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                    <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-xs font-medium">
                        <ShieldCheck size={14} />
                        <span>End-to-end Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="fixed bottom-6 text-[10px] text-gray-400 text-center w-full pointer-events-none">
                &copy; 2025 AREXA Inc. Security Systems.
            </div>
        </div>
    );
};

export default ResetPassword;