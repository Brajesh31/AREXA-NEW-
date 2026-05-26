import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    Trash2, Loader2, Save, Pencil, X, Image as ImageIcon,
    Briefcase, FileText, Globe, Clock, User, UploadCloud, Plus, Type, Hash, Eye
} from "lucide-react";

const API = "https://arexa.co/api";

// --- TYPES ---
interface ContentBlock {
    id: string; // Unique ID for React keys
    type: 'paragraph' | 'image' | 'heading';
    value: string; // Text content OR Image URL
    file?: File; // Temp storage for upload
}

interface InsightItem {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    brandLogo: string;
    heroImage: string;
    readTime: string;
    author: string;
    industry: string;
    platform: string;
    content: string; // Stores the JSON string of blocks
    date?: string;
    isoDate?: string;

    // ✅ NEW: Hybrid View Columns
    manual_base: string | number;
    real_clicks: number;
}

const InsightManager = () => {
    const [items, setItems] = useState<InsightItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    // Loaders
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingHero, setUploadingHero] = useState(false);
    const [uploadingBlockImg, setUploadingBlockImg] = useState<string | null>(null);

    // --- MAIN FORM STATE ---
    const [form, setForm] = useState<InsightItem>({
        id: "", title: "", excerpt: "", category: "",
        brandLogo: "", heroImage: "",
        readTime: "5 min read", author: "Arexa Team",
        industry: "Technology", platform: "General", content: "",
        manual_base: 0,
        real_clicks: 0
    });

    // --- CONTENT BLOCKS STATE ---
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);

    const getAuthHeader = () => {
        const token = localStorage.getItem("arexa_token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const handleAuthError = (error: unknown) => {
        const err = error as AxiosError;
        if (err.response?.status === 401) {
            toast.error("Session Expired");
            localStorage.removeItem("arexa_admin");
            localStorage.removeItem("arexa_token");
            navigate("/arexaPaneladmin");
        } else {
            console.error(err);
        }
    };

    const fetchItems = () => {
        axios.get(`${API}/cms.php?type=insights`, getAuthHeader())
            .then(res => setItems(res.data))
            .catch(handleAuthError);
    };

    useEffect(() => { fetchItems(); }, []);

    // --- HELPER: FORMAT K NUMBERS ---
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

    // --- BLOCK LOGIC ---
    const addBlock = (type: 'paragraph' | 'image' | 'heading') => {
        const newBlock: ContentBlock = {
            id: Date.now().toString() + Math.random(),
            type,
            value: ""
        };
        setBlocks([...blocks, newBlock]);
    };

    const removeBlock = (id: string) => {
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlockValue = (id: string, val: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, value: val } : b));
    };

    // --- UPLOAD HANDLERS ---
    const handleBlockImageUpload = async (id: string, file: File) => {
        if (!file) return;
        setUploadingBlockImg(id);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "insights");

        try {
            const res = await axios.post(`${API}/upload.php`, formData, getAuthHeader());
            if (res.data.status === "success") {
                updateBlockValue(id, res.data.url);
                toast.success("Image added successfully!");
            } else {
                toast.error("Server Error: " + res.data.message);
            }
        } catch (error: any) {
            toast.error("Upload Failed");
        } finally {
            setUploadingBlockImg(null);
        }
    };

    const handleGlobalUpload = async (file: File | undefined, field: keyof InsightItem, loaderSet: any) => {
        if (!file) return;
        loaderSet(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", field === 'brandLogo' ? 'brands' : 'insights');

        try {
            const res = await axios.post(`${API}/upload.php`, formData, getAuthHeader());
            if (res.data.status === "success") {
                setForm(prev => ({ ...prev, [field]: res.data.url }));
                toast.success("Uploaded successfully!");
            } else {
                toast.error("Server Error: " + res.data.message);
            }
        } catch (error: any) {
            toast.error("Upload Failed");
        } finally {
            loaderSet(false);
        }
    };

    // --- MAIN ACTIONS ---
    const startEdit = (item: InsightItem) => {
        setForm({
            ...item,
            manual_base: item.manual_base || 0,
            real_clicks: Number(item.real_clicks) || 0
        });

        try {
            if (item.content && item.content.trim().startsWith("[")) {
                const parsed = JSON.parse(item.content);
                const formatted = parsed.map((p: any) => ({
                    ...p,
                    id: p.id || Math.random().toString()
                }));
                setBlocks(formatted);
            } else {
                setBlocks([{ id: "legacy", type: "paragraph", value: item.content || "" }]);
            }
        } catch (e) {
            setBlocks([]);
        }

        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setForm({
            id: "", title: "", excerpt: "", category: "",
            brandLogo: "", heroImage: "",
            readTime: "5 min read", author: "Arexa Team",
            industry: "", platform: "", content: "",
            manual_base: 0, real_clicks: 0
        });
        setBlocks([]);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if(!form.id || !form.title) return toast.error("ID and Title are required");
        setLoading(true);

        const cleanBlocks = blocks.map(({ type, value }) => ({ type, value }));
        const contentJSON = JSON.stringify(cleanBlocks);
        const today = new Date();
        const payload = {
            ...form,
            content: contentJSON,
            date: form.date || today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            isoDate: form.isoDate || today.toISOString().split('T')[0]
        };

        try {
            await axios.post(`${API}/cms.php?type=insights`, payload, getAuthHeader());
            toast.success(isEditing ? "Updated!" : "Published!");
            cancelEdit();
            fetchItems();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if(confirm("Delete this case study? This cannot be undone.")) {
            try {
                await axios.delete(`${API}/cms.php?type=insights&id=${id}`, getAuthHeader());
                fetchItems();
                toast.success("Deleted");
            } catch (error) {
                handleAuthError(error);
            }
        }
    };

    return (
        <div className="space-y-10 max-w-7xl mx-auto p-4 font-sans text-gray-900">

            {/* EDITOR CARD */}
            <div className={`bg-white border-2 rounded-[2rem] shadow-xl overflow-hidden ${isEditing ? 'border-indigo-400' : 'border-gray-200'}`}>

                {/* Header */}
                <div className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${isEditing ? 'from-indigo-600 to-purple-600' : 'from-gray-800 to-gray-900'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm">
                            {isEditing ? <Pencil size={22} /> : <FileText size={22} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white">
                                {isEditing ? "Editing Case Study" : "New Case Study"}
                            </h3>
                            <p className="text-sm text-gray-300 opacity-90">
                                Content Block Editor Mode
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isEditing && (
                            <Button variant="ghost" onClick={cancelEdit} className="text-white hover:bg-white/20 hover:text-white border-white/30 border h-10 rounded-xl">
                                <X size={18} className="mr-2"/> Cancel
                            </Button>
                        )}
                        <Button onClick={handleSave} disabled={loading} className="bg-white text-black hover:bg-gray-100 font-bold h-10 rounded-xl">
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                            {isEditing ? "Save Changes" : "Publish"}
                        </Button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT: Metadata */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Slug ID</label>
                                <Input placeholder="unique-url-slug" value={form.id} onChange={e => setForm({...form, id: e.target.value})} disabled={isEditing} className="bg-gray-50 font-mono" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Headline</label>
                                <Input placeholder="Case Study Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="bg-gray-50 font-bold" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Excerpt</label>
                            <Textarea placeholder="Short summary..." value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} className="bg-gray-50 min-h-[80px]" />
                        </div>

                        {/* ✅ NEW: Hybrid Views Control */}
                        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                            <label className="text-xs font-bold text-indigo-600 uppercase flex items-center gap-2 mb-2 tracking-wider">
                                <Hash size={14}/> View Counter Logic
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Base (Manual)</span>
                                    <Input
                                        type="text"
                                        value={form.manual_base}
                                        onChange={e => setForm({...form, manual_base: e.target.value})}
                                        className="bg-white border-indigo-200 font-mono text-center h-10"
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
                            <div className="mt-3 text-center text-xs font-bold text-indigo-700 bg-indigo-100 py-1.5 rounded-lg border border-indigo-200">
                                Live Display: {formatViews(form.manual_base, form.real_clicks)}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5 relative">
                                <Briefcase className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <Input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="pl-10" />
                            </div>
                            <div className="space-y-1.5 relative">
                                <Globe className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <Input placeholder="Industry" value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="pl-10" />
                            </div>
                            <div className="space-y-1.5 relative">
                                <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <Input placeholder="Platform" value={form.platform} onChange={e => setForm({...form, platform: e.target.value})} className="pl-10" />
                            </div>
                            <div className="space-y-1.5 relative">
                                <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                <Input placeholder="Read Time" value={form.readTime} onChange={e => setForm({...form, readTime: e.target.value})} className="pl-10" />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Images */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Brand Logo */}
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-blue-400 transition-colors cursor-pointer relative h-32 flex flex-col items-center justify-center">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => handleGlobalUpload(e.target.files?.[0], 'brandLogo', setUploadingLogo)} />
                            {form.brandLogo ? <img src={form.brandLogo} className="h-12 object-contain" alt="Brand Logo" /> : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    {uploadingLogo ? <Loader2 className="animate-spin mb-2"/> : <ImageIcon className="mb-2"/>}
                                    <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                                </div>
                            )}
                        </div>

                        {/* Hero Image */}
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-emerald-400 transition-colors cursor-pointer relative h-40 flex flex-col items-center justify-center overflow-hidden">
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => handleGlobalUpload(e.target.files?.[0], 'heroImage', setUploadingHero)} />
                            {form.heroImage ? <img src={form.heroImage} className="w-full h-full object-cover" alt="Hero" /> : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    {uploadingHero ? <Loader2 className="animate-spin mb-2"/> : <UploadCloud className="mb-2"/>}
                                    <span>{uploadingHero ? "Uploading..." : "Upload Hero Image"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- CONTENT BLOCK BUILDER --- */}
                <div className="px-8 pb-8 pt-4 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                            Story Content
                        </label>
                        <div className="flex gap-2">
                            <Button size="sm" onClick={() => addBlock('heading')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                <Type size={14} className="mr-1"/> Heading
                            </Button>
                            <Button size="sm" onClick={() => addBlock('paragraph')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                <Plus size={14} className="mr-1"/> Text
                            </Button>
                            <Button size="sm" onClick={() => addBlock('image')} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">
                                <ImageIcon size={14} className="mr-1"/> Image
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4 min-h-[200px]">
                        {blocks.length === 0 && (
                            <div className="text-center py-10 text-gray-400 italic border-2 border-dashed border-gray-200 rounded-xl">
                                No content yet. Click buttons above to start writing.
                            </div>
                        )}

                        {blocks.map((block) => (
                            <div key={block.id} className="relative group bg-white border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                <button onClick={() => removeBlock(block.id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 bg-white rounded-full border border-gray-100 shadow-sm z-10">
                                    <X size={14} />
                                </button>
                                {block.type === 'heading' && (
                                    <div>
                                        <span className="text-[10px] font-bold text-blue-500 uppercase mb-1 block">Section Heading</span>
                                        <Input
                                            value={block.value}
                                            onChange={e => updateBlockValue(block.id, e.target.value)}
                                            placeholder="Enter heading..."
                                            className="font-bold text-lg border-transparent hover:border-gray-200 focus:border-blue-500 px-0"
                                        />
                                    </div>
                                )}
                                {block.type === 'paragraph' && (
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Paragraph</span>
                                        <Textarea
                                            value={block.value}
                                            onChange={e => updateBlockValue(block.id, e.target.value)}
                                            placeholder="Type your story here..."
                                            className="min-h-[100px] border-transparent hover:border-gray-200 focus:border-blue-500 resize-y text-gray-700 leading-relaxed px-0 shadow-none"
                                        />
                                    </div>
                                )}
                                {block.type === 'image' && (
                                    <div>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase mb-1 block">Image Insert</span>
                                        {block.value ? (
                                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group/img mt-2">
                                                <img src={block.value} className="w-full h-full object-contain" alt="Block content" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                    <Button size="sm" variant="secondary" className="relative">
                                                        Change Image
                                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleBlockImageUpload(block.id, e.target.files![0])} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-24 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 relative mt-2">
                                                <div className="text-gray-400 flex items-center gap-2">
                                                    {uploadingBlockImg === block.id ? <Loader2 className="animate-spin"/> : <UploadCloud />}
                                                    <span>{uploadingBlockImg === block.id ? "Uploading..." : "Upload Image Here"}</span>
                                                </div>
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => handleBlockImageUpload(block.id, e.target.files![0])} />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* LIST OF EXISTING ITEMS */}
            <div className="grid grid-cols-1 gap-4 mt-10">
                <h2 className="text-xl font-bold">Existing Case Studies</h2>
                {items.map(item => (
                    <div key={item.id} className="flex justify-between p-4 bg-white border border-gray-200 rounded-xl items-center shadow-sm">
                        <div>
                            <span className="font-bold text-gray-800 block">{item.title}</span>
                            {/* ✅ SHOW VIEW COUNT */}
                            <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                <Eye size={12}/> {formatViews(item.manual_base, item.real_clicks)}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(item)}><Pencil size={14}/></Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}><Trash2 size={14}/></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InsightManager;