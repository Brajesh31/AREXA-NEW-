import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Loader2, User, FileText, Globe, LucideIcon, Sparkles } from "lucide-react";

const API = "https://arexa.co/api";

// 1. ✅ DEFINE THE INTERFACE (Preserved)
interface SectionEditorProps {
    title: string;
    settingKey: string;
    icon: LucideIcon;
    placeholder: string;
}

// Helper to determine color theme based on key (UI Only - No Logic Change)
const getTheme = (key: string) => {
    if (key.includes('content')) return {
        border: 'border-blue-100',
        focusBorder: 'focus-within:border-blue-400',
        headerGrad: 'from-blue-600 to-indigo-600',
        lightBg: 'bg-blue-50/30',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        btnGrad: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
    };
    if (key.includes('founder')) return {
        border: 'border-purple-100',
        focusBorder: 'focus-within:border-purple-400',
        headerGrad: 'from-purple-600 to-fuchsia-600',
        lightBg: 'bg-purple-50/30',
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        btnGrad: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700'
    };
    if (key.includes('seo') || key.includes('meta')) return {
        border: 'border-emerald-100',
        focusBorder: 'focus-within:border-emerald-400',
        headerGrad: 'from-emerald-600 to-teal-600',
        lightBg: 'bg-emerald-50/30',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        btnGrad: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
    };
    // Fallback
    return {
        border: 'border-gray-100',
        focusBorder: 'focus-within:border-gray-400',
        headerGrad: 'from-gray-600 to-gray-800',
        lightBg: 'bg-gray-50',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        btnGrad: 'bg-gray-900 hover:bg-black'
    };
};

// 2. ✅ APPLY THE INTERFACE TO PROPS
const SectionEditor = ({ title, settingKey, icon: Icon, placeholder }: SectionEditorProps) => {
    // --- LOGIC STARTS (Untouched) ---
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const navigate = useNavigate();

    const getAuthHeader = () => {
        const token = localStorage.getItem("arexa_token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleAuthError = (error: unknown) => {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            toast.error("Session Expired. Please login again.");
            localStorage.removeItem("arexa_admin");
            localStorage.removeItem("arexa_token");
            navigate("/arexaPaneladmin");
        } else {
            console.error(err);
        }
    };

    useEffect(() => {
        axios.get(`${API}/cms.php?type=settings&key=${settingKey}`, getAuthHeader())
            .then(res => setContent(res.data?.setting_value || ""))
            .catch(handleAuthError)
            .finally(() => setFetching(false));
    }, [settingKey]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.post(`${API}/cms.php?type=settings`, { key: settingKey, value: content }, getAuthHeader());
            toast.success("Saved Successfully");
        } catch (error) {
            toast.error("Save failed");
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };
    // --- LOGIC ENDS ---

    const theme = getTheme(settingKey);

    if (fetching) return (
        <div className="h-64 bg-gray-50 animate-pulse rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-300" size={30} />
        </div>
    );

    return (
        <div className={`bg-white border-2 ${theme.border} rounded-2xl shadow-lg shadow-gray-100/50 overflow-hidden transition-all duration-300 hover:shadow-xl ${theme.focusBorder}`}>

            {/* Header Area */}
            <div className={`px-6 py-4 bg-gradient-to-r ${theme.headerGrad} flex justify-between items-center`}>
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-md shadow-inner-white">
                        <Icon className="text-white" size={18} />
                    </div>
                    <h3 className="font-bold text-lg text-white tracking-tight">{title}</h3>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                        {settingKey.replace(/_/g, " ")}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className={`p-6 ${theme.lightBg} space-y-4`}>
                <div className="relative group">
                    <Textarea
                        rows={settingKey.includes('seo') ? 4 : 12}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={placeholder}
                        className="bg-white border-gray-200 text-gray-700 placeholder:text-gray-400 focus-visible:ring-0 border shadow-sm rounded-xl text-sm leading-relaxed p-4 resize-none transition-all group-hover:border-gray-300"
                    />
                    {/* Floating corner indicator */}
                    <div className="absolute bottom-3 right-3 opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <PencilIcon themeColor={theme.iconColor} />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                        <Sparkles size={12} />
                        Auto-formatting enabled
                    </span>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className={`${theme.btnGrad} text-white font-bold h-10 px-6 rounded-xl shadow-md transition-transform active:scale-95 border-none`}
                    >
                        {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Updates
                    </Button>
                </div>
            </div>
        </div>
    );
};

// Tiny helper for the pencil icon inside input
const PencilIcon = ({ themeColor }: { themeColor: string }) => (
    <svg className={`w-4 h-4 ${themeColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
);

const AboutManager = () => {
    return (
        <div className="space-y-10 max-w-7xl mx-auto p-2">
            <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-1 rounded-full bg-gradient-to-b from-blue-600 to-purple-600"></div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Company Identity</h2>
                    <p className="text-xs text-gray-500 font-medium">Manage how the world sees Arexa.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Narrative */}
                <div className="space-y-8">
                    <SectionEditor
                        title="Main Company Story"
                        settingKey="about_content"
                        icon={FileText}
                        placeholder="Write the main 'Who We Are' story here. Use HTML tags for formatting if needed..."
                    />
                    <SectionEditor
                        title="Founder's Bio"
                        settingKey="founder_bio"
                        icon={User}
                        placeholder="Enter the founder's biography text..."
                    />
                </div>

                {/* Right Column: SEO & Technical */}
                <div className="space-y-8">
                    <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 mb-4">
                        <h4 className="text-sm font-bold text-emerald-800 mb-1 flex items-center gap-2">
                            <Globe size={16}/> SEO Configuration
                        </h4>
                        <p className="text-xs text-emerald-600 leading-relaxed">
                            These settings control how Arexa appears in Google Search and social media shares. Keep descriptions under 160 characters.
                        </p>
                    </div>

                    <SectionEditor
                        title="Meta Description"
                        settingKey="about_meta_desc"
                        icon={Globe}
                        placeholder="Brief description for Google search results..."
                    />
                    <SectionEditor
                        title="Meta Keywords"
                        settingKey="about_meta_keywords"
                        icon={Globe}
                        placeholder="AR, VR, Snap Partner, etc... (Comma separated)"
                    />
                </div>
            </div>
        </div>
    );
};
export default AboutManager;