import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Film, Image as ImageIcon, Pencil, X, Plus, UploadCloud, PlayCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "https://arexa.co/api";

// 1. Define Interface (Preserved)
interface WorkItem {
    id: number | string;
    title: string;
    category: string;
    video_url: string;
    thumbnail_url: string;
    client_name: string;
}

const WorkManager = () => {
    // --- LOGIC STARTS (Untouched) ---
    const [works, setWorks] = useState<WorkItem[]>([]);
    const [form, setForm] = useState<WorkItem>({ id: "", title: "", client_name: "", category: "", video_url: "", thumbnail_url: "" });

    const [uploadingVid, setUploadingVid] = useState(false);
    const [uploadingThumb, setUploadingThumb] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
            toast.error("Operation failed.");
            console.error(err);
        }
    };

    const fetchWorks = () => {
        axios.get(`${API}/cms.php?type=works`, getAuthHeader())
            .then(res => setWorks(res.data))
            .catch(handleAuthError);
    };

    useEffect(() => { fetchWorks(); }, []);

    const handleUpload = async (
        file: File | undefined,
        folder: string,
        field: keyof WorkItem,
        loaderSet: (state: boolean) => void
    ) => {
        if (!file) return;
        loaderSet(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const res = await axios.post(`${API}/upload.php`, formData, getAuthHeader());
            if (res.data.status === "success") {
                setForm(prev => ({ ...prev, [field]: res.data.url }));
                toast.success("Uploaded successfully");
            }
        } catch (error) {
            toast.error("Upload failed");
            handleAuthError(error);
        } finally {
            loaderSet(false);
        }
    };

    const startEdit = (work: WorkItem) => {
        setForm(work);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setForm({ id: "", title: "", client_name: "", category: "", video_url: "", thumbnail_url: "" });
        setIsEditing(false);
    };

    const handleSave = async () => {
        if(!form.title) return toast.error("Title required");

        try {
            await axios.post(`${API}/cms.php?type=works`, form, getAuthHeader());
            toast.success(isEditing ? "Work Updated!" : "Work Added!");
            cancelEdit();
            fetchWorks();
        } catch (error) {
            handleAuthError(error);
        }
    };

    const handleDelete = async (id: number | string) => {
        if(confirm("Are you sure you want to delete this project?")) {
            try {
                await axios.delete(`${API}/cms.php?type=works&id=${id}`, getAuthHeader());
                fetchWorks();
            } catch (error) {
                handleAuthError(error);
            }
        }
    };
    // --- LOGIC ENDS ---

    // --- UPDATED UI (Colorful & Taller) ---
    return (
        <div className="space-y-10 max-w-7xl mx-auto p-2">

            {/* 1. Editor Card (Colorful Gradient Header) */}
            <div className={`bg-white border-2 rounded-[2rem] shadow-xl shadow-indigo-100/50 overflow-hidden transition-all duration-300 ${isEditing ? 'border-purple-400' : 'border-indigo-100'}`}>
                {/* Header - Vibrant Gradient */}
                <div className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${isEditing ? 'from-purple-600 to-pink-500' : 'from-blue-600 to-indigo-600'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm shadow-inner-white">
                            {isEditing ? <Pencil size={22} /> : <Sparkles size={22} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">
                                {isEditing ? "Editing Portfolio Piece" : "Create New Experience"}
                            </h3>
                            <p className="text-sm text-blue-100 font-medium">
                                {isEditing ? "Refining the details." : "Add a new visual story to the collection."}
                            </p>
                        </div>
                    </div>
                    {isEditing && (
                        <Button variant="ghost" onClick={cancelEdit} className="text-white hover:bg-white/20 hover:text-white border-white/30 border h-10 rounded-xl">
                            <X size={18} className="mr-2"/> Cancel
                        </Button>
                    )}
                </div>

                <div className="p-8 space-y-8">
                    {/* Inputs (Colorful labels & borders) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider ml-1">Project Title</label>
                            <Input
                                placeholder="e.g. The Vibrant Future Campaign"
                                value={form.title}
                                onChange={e => setForm({...form, title: e.target.value})}
                                className="bg-indigo-50/50 border-indigo-200 text-indigo-900 placeholder:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 rounded-xl h-12 font-medium transition-all shadow-sm hover:border-indigo-300"
                            />
                        </div>

                        {/* NEW: Client Name Input (Teal Theme) */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-teal-700 uppercase tracking-wider ml-1">Client Name</label>
                            <Input
                                placeholder="e.g. Nike, Pepsi, Snap"
                                value={form.client_name}
                                onChange={e => setForm({...form, client_name: e.target.value})}
                                className="bg-teal-50/50 border-teal-200 text-teal-900 placeholder:text-teal-400 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:border-teal-500 rounded-xl h-12 font-medium transition-all shadow-sm hover:border-teal-300"
                            />
                        </div>

                        {/* Category Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-purple-700 uppercase tracking-wider ml-1">Category Tag</label>
                            <Input
                                placeholder="e.g. 3D Visuals, Motion"
                                value={form.category}
                                onChange={e => setForm({...form, category: e.target.value})}
                                className="bg-purple-50/50 border-purple-200 text-purple-900 placeholder:text-purple-400 focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:border-purple-500 rounded-xl h-12 font-medium transition-all shadow-sm hover:border-purple-300"
                            />
                        </div>
                    </div>

                    {/* Upload Zone (Colorful Dashed Borders) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Video Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-blue-600 uppercase tracking-wider ml-1">Video Asset (MP4)</label>
                            <div className="bg-blue-50/30 border-2 border-dashed border-blue-300/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/80 hover:border-blue-500 transition-all group relative cursor-pointer">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="video/mp4"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : undefined;
                                        handleUpload(file, 'works/video', 'video_url', setUploadingVid);
                                    }}
                                />
                                <div className="p-4 bg-white rounded-full shadow-md shadow-blue-200 mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    {uploadingVid ? <UploadCloud className="animate-bounce text-blue-600" size={28}/> : <Film size={28} className="text-blue-400 group-hover:text-blue-600"/>}
                                </div>
                                <span className="text-sm font-bold text-blue-700 group-hover:text-blue-800">
                                    {uploadingVid ? "Uploading Video..." : form.video_url ? "Replace Video File" : "Drop Video or Click"}
                                </span>
                            </div>
                        </div>

                        {/* Thumbnail Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-pink-600 uppercase tracking-wider ml-1">Cover Image (PNG/JPG)</label>
                            <div className="bg-pink-50/30 border-2 border-dashed border-pink-300/70 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-pink-50/80 hover:border-pink-500 transition-all group relative cursor-pointer">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : undefined;
                                        handleUpload(file, 'works/thumb', 'thumbnail_url', setUploadingThumb);
                                    }}
                                />
                                <div className="p-4 bg-white rounded-full shadow-md shadow-pink-200 mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all">
                                    {uploadingThumb ? <UploadCloud className="animate-bounce text-pink-600" size={28}/> : <ImageIcon size={28} className="text-pink-400 group-hover:text-pink-600"/>}
                                </div>
                                <span className="text-sm font-bold text-pink-700 group-hover:text-pink-800">
                                    {uploadingThumb ? "Uploading Image..." : form.thumbnail_url ? "Replace Cover Image" : "Drop Image or Click"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Previews (Taller aspect ratio for previews too) */}
                    {(form.video_url || form.thumbnail_url) && (
                        <div className="flex gap-6 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            {form.video_url && (
                                <div className="relative group rounded-xl overflow-hidden border-2 border-blue-200 w-40 aspect-[4/5] bg-blue-900 shadow-lg">
                                    <video src={form.video_url} className="w-full h-full object-cover opacity-90" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircle className="text-white drop-shadow-lg" size={32} />
                                    </div>
                                </div>
                            )}
                            {form.thumbnail_url && (
                                <div className="rounded-xl overflow-hidden border-2 border-pink-200 w-40 aspect-[4/5] bg-pink-100 shadow-lg">
                                    <img src={form.thumbnail_url} className="w-full h-full object-cover" alt="Preview" />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions - NO BLACK BUTTONS. Vibrant Gradients. */}
                <div className="px-8 py-6 bg-indigo-50/30 border-t border-indigo-100 flex justify-end">
                    <Button
                        onClick={handleSave}
                        className={`h-12 px-8 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] ${
                            isEditing
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                        }`}
                    >
                        {isEditing ? "Update Portfolio Item" : "Publish to Showcase"}
                        <Sparkles size={18} className="ml-2 text-white/70" />
                    </Button>
                </div>
            </div>

            {/* 2. Grid List (TALLER CARDS & COLORFUL HOVER) */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-indigo-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="text-indigo-500" size={20}/>
                        Live Showcase ({works.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {works.map((w) => (
                        // TALLER ASPECT RATIO: aspect-[4/5]
                        // COLORFUL HOVER BORDER & SHADOW
                        <div key={w.id} className="group relative bg-white rounded-[1.5rem] border-2 border-indigo-50 shadow-md shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-300 transition-all duration-300 overflow-hidden flex flex-col aspect-[4/5]">

                            {/* Media Preview (Takes up most space) */}
                            <div className="relative flex-1 bg-indigo-100 overflow-hidden">
                                {w.thumbnail_url ? (
                                    <img src={w.thumbnail_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={w.title} />
                                ) : (
                                    <video src={w.video_url} className="w-full h-full object-cover opacity-90 mix-blend-multiply" muted loop />
                                )}

                                {/* Overlay Actions - White buttons with colorful icons */}
                                <div className="absolute inset-0 bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                                    <button
                                        onClick={() => startEdit(w)}
                                        className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-indigo-600 hover:text-indigo-800 hover:scale-110 transition-all shadow-xl shadow-indigo-500/30"
                                        title="Edit"
                                    >
                                        <Pencil size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(w.id)}
                                        className="h-12 w-12 bg-white rounded-full flex items-center justify-center text-pink-600 hover:text-red-600 hover:scale-110 transition-all shadow-xl shadow-pink-500/30"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                {/* Category Badge overlay on image for modern look */}
                                <div className="absolute top-4 left-4 flex flex-col items-start gap-1">
                                     <span className="px-3 py-1.5 rounded-full text-[10px] font-black bg-white/90 text-indigo-700 border border-indigo-100 uppercase tracking-wider shadow-sm backdrop-blur-md">
                                        {w.category}
                                    </span>
                                    {/* Added Client Name Badge if exists */}
                                    {w.client_name && (
                                        <span className="px-3 py-1.5 rounded-full text-[10px] font-black bg-teal-500/90 text-white border border-teal-400 uppercase tracking-wider shadow-sm backdrop-blur-md">
                                            {w.client_name}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Info Footer (Colorful Text) */}
                            <div className="p-5 bg-white relative z-10 border-t border-indigo-50">
                                <h4 className="font-bold text-indigo-900 text-lg line-clamp-1 group-hover:text-indigo-700 transition-colors" title={w.title}>
                                    {w.title}
                                </h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkManager;