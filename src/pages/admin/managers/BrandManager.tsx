import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus, Pencil, Building2, Sparkles, UploadCloud, X, Save, Loader2 } from "lucide-react";

const API = "https://arexa.co/api";

// 1. Define Interface (Preserved)
interface Brand {
    id: number;
    name: string;
    logo_url: string;
}

const BrandManager = () => {
    // --- LOGIC STARTS (Untouched) ---
    const [brands, setBrands] = useState<Brand[]>([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);
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

    const fetchBrands = () => {
        axios.get(`${API}/cms.php?type=brands`, getAuthHeader())
            .then(res => setBrands(res.data))
            .catch(handleAuthError);
    };

    useEffect(() => { fetchBrands(); }, []);

    const handleSave = async (file?: File) => {
        if (!name) return toast.error("Name is required");
        setUploading(true);

        try {
            let logoUrl = "";

            if (editId && !file) {
                const existing = brands.find(b => b.id === editId);
                logoUrl = existing ? existing.logo_url : "";
            }

            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("folder", "brands");

                const res = await axios.post(`${API}/upload.php`, formData, getAuthHeader());
                if (res.data.status === "success") logoUrl = res.data.url;
                else throw new Error("Upload failed");
            }

            const payload: any = { name, logo_url: logoUrl };
            if (editId) payload.id = editId;

            await axios.post(`${API}/cms.php?type=brands`, payload, getAuthHeader());

            toast.success(editId ? "Partner Updated" : "Partner Added");

            setName("");
            setEditId(null);
            fetchBrands();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setUploading(false);
        }
    };

    const startEdit = (brand: Brand) => {
        setName(brand.name);
        setEditId(brand.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setName("");
        setEditId(null);
    };

    const handleDelete = async (id: number) => {
        if(confirm("Remove this partner?")) {
            try {
                await axios.delete(`${API}/cms.php?type=brands&id=${id}`, getAuthHeader());
                fetchBrands();
            } catch (error) {
                handleAuthError(error);
            }
        }
    };
    // --- LOGIC ENDS ---

    // --- UPDATED UI (Violet/Fuchsia Theme) ---
    return (
        <div className="space-y-10 max-w-7xl mx-auto p-2">

            {/* EDITOR CARD */}
            <div className={`bg-white border-2 rounded-[2rem] shadow-xl shadow-violet-100/50 overflow-hidden transition-all duration-300 ${editId ? 'border-fuchsia-400' : 'border-violet-100'}`}>
                {/* Header Gradient */}
                <div className={`px-8 py-6 flex justify-between items-center bg-gradient-to-r ${editId ? 'from-fuchsia-600 to-pink-600' : 'from-violet-600 to-fuchsia-600'}`}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/20 text-white backdrop-blur-sm shadow-inner-white">
                            {editId ? <Pencil size={22} /> : <Building2 size={22} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">
                                {editId ? "Edit Partner Details" : "Add New Partner"}
                            </h3>
                            <p className="text-sm text-violet-100 font-medium opacity-90">
                                {editId ? "Update naming or replace logo." : "Expand your network."}
                            </p>
                        </div>
                    </div>
                    {editId && (
                        <Button variant="ghost" onClick={cancelEdit} className="text-white hover:bg-white/20 hover:text-white border-white/30 border h-10 rounded-xl">
                            <X size={18} className="mr-2"/> Cancel
                        </Button>
                    )}
                </div>

                <div className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8 items-end">

                        {/* Name Input */}
                        <div className="flex-grow space-y-2 w-full">
                            <label className="text-xs font-bold text-violet-700 uppercase tracking-wider ml-1">Partner Organization Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Google Cloud"
                                className="bg-violet-50/50 border-violet-200 text-violet-900 placeholder:text-violet-300 focus-visible:ring-2 focus-visible:ring-fuchsia-500 rounded-xl h-14 text-lg font-medium transition-all shadow-sm"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                            {/* Upload Button */}
                            <label className={`cursor-pointer group flex items-center justify-center gap-3 font-bold h-14 px-8 rounded-xl transition-all shadow-lg active:scale-[0.98] hover:scale-[1.02] ${
                                editId
                                    ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:shadow-fuchsia-500/30 text-white"
                                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-violet-500/30 text-white"
                            }`}>
                                {uploading ? (
                                    <Loader2 className="animate-spin" size={20}/>
                                ) : (
                                    <>{editId ? <UploadCloud size={20}/> : <Plus size={20}/>}</>
                                )}

                                <span>
                                    {uploading ? "Processing..." : (editId ? "Upload New Logo" : "Upload Logo & Add")}
                                </span>

                                {/* The Hidden Input that triggers Save logic */}
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : undefined;
                                        handleSave(file);
                                    }}
                                />
                            </label>

                            {/* Save Name Only (Edit Mode Specific) */}
                            {editId && (
                                <Button
                                    onClick={() => handleSave()}
                                    className="h-14 px-6 bg-white border-2 border-fuchsia-100 text-fuchsia-600 hover:bg-fuchsia-50 hover:border-fuchsia-200 font-bold rounded-xl shadow-sm"
                                >
                                    <Save size={18} className="mr-2"/> Save Name Only
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID DISPLAY */}
            <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-black text-violet-900 tracking-tight flex items-center gap-2">
                        <Sparkles className="text-fuchsia-500" size={20}/>
                        Active Partners ({brands.length})
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {brands.map((b) => (
                        // TALLER CARDS: h-56
                        <div key={b.id} className="group relative bg-white rounded-[1.5rem] border-2 border-violet-50 h-56 flex flex-col items-center justify-center p-6 shadow-sm shadow-violet-100/50 hover:shadow-2xl hover:shadow-violet-500/20 hover:border-fuchsia-300 hover:-translate-y-1 transition-all duration-300 cursor-default">

                            {/* Logo Container */}
                            <div className="flex-1 w-full flex items-center justify-center p-2 transition-transform duration-300 group-hover:scale-110">

                                <img
                                    src={b.logo_url}
                                    alt={b.name}
                                    className="max-h-24 max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                />
                            </div>

                            {/* Actions Overlay (Reveals on Hover) */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0">
                                <button
                                    onClick={() => startEdit(b)}
                                    className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-violet-600 hover:text-white hover:bg-violet-600 shadow-lg border border-violet-100 transition-colors"
                                    title="Edit Details"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(b.id)}
                                    className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-pink-500 hover:text-white hover:bg-pink-600 shadow-lg border border-pink-100 transition-colors"
                                    title="Remove Partner"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>

                            {/* Name Label */}
                            <div className="w-full text-center mt-4 border-t border-violet-50 pt-3">
                                <span className="text-xs font-black text-violet-300 uppercase tracking-widest group-hover:text-fuchsia-600 transition-colors">
                                    {b.name}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default BrandManager;