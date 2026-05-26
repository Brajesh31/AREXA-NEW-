import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Loader2, Save, Calendar, Pencil, X, BookOpen, Eye, Image as ImageIcon, Link as LinkIcon, UploadCloud, Sparkles, Hash } from "lucide-react";

const API = "https://arexa.co/api";

// 1. Updated Interface matching NEW Database Columns
interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    readTime: string;
    date: string;
    image: string;
    category: string;
    hashnodeUrl: string;
    // ✅ CHANGED: Match DB columns
    manual_base: string | number; // The "1.2k" or "1200" you set
    real_clicks: number;          // The actual organic clicks
}

const BlogManager = () => {
    // --- LOGIC STARTS ---
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Default form state
    const [form, setForm] = useState<BlogPost>({
        id: "", title: "", excerpt: "", author: "Arexa", readTime: "5 min read", date: "",
        image: "", category: "", hashnodeUrl: "",
        manual_base: 0,
        real_clicks: 0
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem("arexa_token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleAuthError = (error: unknown) => {
        const err = error as AxiosError;
        // @ts-ignore
        const serverMessage = err.response?.data?.message;

        if (err.response?.status === 401) {
            toast.error("Session Expired. Please login again.");
            localStorage.removeItem("arexa_admin");
            localStorage.removeItem("arexa_token");
            navigate("/arexaPaneladmin");
        } else {
            toast.error(serverMessage || "Operation failed.");
            console.error(err);
        }
    };

    const fetchBlogs = () => {
        axios.get(`${API}/cms.php?type=blogs`, getAuthHeader())
            .then(res => setBlogs(res.data))
            .catch(handleAuthError);
    };

    useEffect(() => { fetchBlogs(); }, []);

    const handleUpload = async (file: File | undefined) => {
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "blogs");

        try {
            const res = await axios.post(`${API}/upload.php`, formData, getAuthHeader());
            if (res.data.status === "success") {
                setForm(prev => ({ ...prev, image: res.data.url }));
                toast.success("Cover image uploaded");
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setUploading(false);
        }
    };

    const startEdit = (blog: BlogPost) => {
        setForm({
            ...blog,
            // Map DB columns to form state
            manual_base: blog.manual_base || 0,
            real_clicks: Number(blog.real_clicks) || 0
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setForm({
            id: "", title: "", excerpt: "", author: "Arexa", readTime: "5 min read", date: "",
            image: "", category: "", hashnodeUrl: "", manual_base: 0, real_clicks: 0
        });
        setIsEditing(false);
    };

    const handleSave = async () => {
        if(!form.title) return toast.error("Title required");
        setLoading(true);

        const finalDate = form.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const payload = { ...form, date: finalDate };

        try {
            await axios.post(`${API}/cms.php?type=blogs`, payload, getAuthHeader());
            toast.success(isEditing ? "Blog Updated!" : "Blog Published!");
            cancelEdit();
            fetchBlogs();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(confirm("Delete this blog?")) {
            try {
                await axios.delete(`${API}/cms.php?type=blogs&id=${id}`, getAuthHeader());
                fetchBlogs();
            } catch (error) {
                handleAuthError(error);
            }
        }
    };

    // --- HELPER: FORMAT K NUMBERS (e.g. 1500 -> 1.5k) ---
    const formatViews = (base: string | number | undefined, real: number) => {
        let baseCount = 0;
        const baseStr = String(base || "0").toLowerCase().trim();

        if (baseStr.includes("k")) {
            baseCount = parseFloat(baseStr.replace(/[^0-9.]/g, '')) * 1000;
        } else {
            baseCount = parseInt(baseStr.replace(/[^0-9]/g, '')) || 0;
        }

        const total = baseCount + Number(real || 0);
        if (total >= 1000) return (total / 1000).toFixed(1) + 'k views';
        return total + ' views';
    };

    // --- LOGIC ENDS ---

    // --- UPDATED UI (Sunset/Editorial Theme) ---
    return (
        <div className="space-y-10 max-w-7xl mx-auto p-2">

            {/* EDITOR CARD */}
            <div className={`bg-white border-2 rounded-[2rem] shadow-xl shadow-orange-100/50 overflow-hidden transition-all duration-300 ${isEditing ? 'border-rose-400' : 'border-orange-100'}`}>
                {/* Header Gradient */}
                <div className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${isEditing ? 'from-rose-500 to-orange-600' : 'from-orange-500 to-rose-500'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm shadow-inner-white">
                            {isEditing ? <Pencil size={22} /> : <BookOpen size={22} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">
                                {isEditing ? "Edit Editorial Post" : "Compose New Article"}
                            </h3>
                            <p className="text-sm text-orange-50 font-medium opacity-90">
                                {isEditing ? "Refine your thoughts." : "Share knowledge with the world."}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {isEditing && (
                            <Button variant="ghost" onClick={cancelEdit} className="text-white hover:bg-white/20 hover:text-white border-white/30 border h-10 rounded-xl">
                                <X size={18} className="mr-2"/> Cancel
                            </Button>
                        )}
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-white text-orange-700 hover:bg-orange-50 font-bold border-none h-10 rounded-xl shadow-lg"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                            {isEditing ? "Update Post" : "Publish Post"}
                        </Button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT: Main Content (Span 2) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-orange-600 uppercase tracking-wider ml-1">Article Headline</label>
                            <Input
                                placeholder="Enter a catchy title..."
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                className="bg-orange-50/30 border-orange-200 text-orange-900 placeholder:text-orange-300 text-lg font-bold h-14 rounded-xl focus-visible:ring-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Short Excerpt</label>
                            <Textarea
                                placeholder="A brief summary for SEO..."
                                value={form.excerpt}
                                onChange={e => setForm({...form, excerpt: e.target.value})}
                                className="bg-gray-50 border-gray-200 text-gray-800 h-40 rounded-xl resize-none focus-visible:ring-orange-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-500 uppercase tracking-wider ml-1">External Link (Hashnode/Medium)</label>
                            <div className="relative">
                                <LinkIcon className="absolute left-3 top-3.5 text-blue-300" size={18} />
                                <Input
                                    placeholder="https://..."
                                    value={form.hashnodeUrl}
                                    onChange={e => setForm({...form, hashnodeUrl: e.target.value})}
                                    className="pl-10 bg-blue-50/30 border-blue-200 text-blue-700 placeholder:text-blue-300 h-12 rounded-xl focus-visible:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Meta & Image (Span 1) */}
                    <div className="space-y-6">

                        {/* ✅ NEW: Hybrid Views Control */}
                        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <label className="text-xs font-bold text-purple-600 uppercase flex items-center gap-2 mb-2 tracking-wider">
                                <Hash size={14}/> View Counter Logic
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Base (Manual)</span>
                                    <Input
                                        type="text"
                                        value={form.manual_base}
                                        onChange={e => setForm({...form, manual_base: e.target.value})}
                                        className="bg-white border-purple-200 font-mono text-center h-10"
                                        placeholder="1.2k or 1200"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Real Clicks</span>
                                    <div className="h-10 flex items-center justify-center bg-white border border-gray-200 rounded-md font-mono text-gray-500 text-sm">
                                        {form.real_clicks}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3 text-center text-xs font-bold text-purple-700 bg-purple-100 py-1.5 rounded-lg border border-purple-200">
                                Live Display: {formatViews(form.manual_base, form.real_clicks)}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-rose-600 uppercase tracking-wider ml-1">Cover Photography</label>
                            <label className="bg-rose-50/30 border-2 border-dashed border-rose-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:bg-rose-50 hover:border-rose-400 transition-all group relative cursor-pointer min-h-[160px] overflow-hidden">
                                {form.image ? (
                                    <img src={form.image} className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" alt="Cover" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                            {uploading ? <Loader2 className="animate-spin text-rose-500" size={24}/> : <UploadCloud size={24} className="text-rose-400"/>}
                                        </div>
                                        <span className="text-xs font-bold text-rose-500">Upload Image</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : undefined;
                                        handleUpload(file);
                                    }}
                                />
                            </label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Category Tag</label>
                            <Input placeholder="e.g. Technology" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="bg-gray-50 border-gray-200 h-11" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Publish Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                                <Input placeholder="Date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="pl-10 bg-gray-50 border-gray-200 h-11" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="Time" value={form.readTime} onChange={e => setForm({...form, readTime: e.target.value})} className="bg-gray-50 border-gray-200 h-11 text-center" />
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOG LIST */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-orange-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="text-orange-500" size={20}/>
                        Published Articles ({blogs.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map(b => (
                        <div key={b.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:border-orange-200 transition-all duration-300 flex flex-col overflow-hidden h-full">

                            {/* Image Area */}
                            <div className="h-48 overflow-hidden relative bg-gray-100">
                                <img src={b.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={b.title} />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-gray-800 shadow-sm">
                                    {b.category}
                                </div>
                                {/* Actions Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button onClick={() => startEdit(b)} className="bg-white text-orange-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg">
                                        <Pencil size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(b.id)} className="bg-white text-red-600 p-2 rounded-full hover:scale-110 transition-transform shadow-lg">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="p-5 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                                    <Calendar size={12} /> {b.date} • <Eye size={12} /> {formatViews(b.manual_base, b.real_clicks)}
                                </div>
                                <h4 className="font-bold text-gray-900 text-lg leading-snug group-hover:text-orange-600 transition-colors mb-2 line-clamp-2">
                                    {b.title}
                                </h4>
                                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4 flex-grow">
                                    {b.excerpt}
                                </p>

                                {/* Footer */}
                                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                                    <span>By {b.author}</span>
                                    <span>{b.readTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default BlogManager;