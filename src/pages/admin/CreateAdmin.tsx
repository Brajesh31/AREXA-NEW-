import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, UserPlus, ArrowLeft, Lock, Trash2, Shield, User } from "lucide-react";

const API_BASE = "https://arexa.co/api";

// Expanded Interface to include creation date
interface AdminUser {
    id: string;
    email: string;
    role: 'super_admin' | 'editor' | string;
    created_at: string;
}

const CreateAdmin = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
    const [adminList, setAdminList] = useState<AdminUser[]>([]);

    // Form Data
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRole, setNewRole] = useState("editor");
    const [creatorPassword, setCreatorPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem("arexa_token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    // 1. Initial Load & Auth Check
    useEffect(() => {
        const stored = localStorage.getItem("arexa_admin");
        if (!stored) {
            navigate("/arexaPaneladmin");
            return;
        }
        const user = JSON.parse(stored);

        if (user.role !== 'super_admin') {
            toast.error("Unauthorized: Super Admin access required.");
            navigate("/admin/dashboard");
            return;
        }
        setCurrentUser(user);
        fetchAdmins(); // Load the list immediately
    }, [navigate]);

    // 2. Fetch List of Admins
    const fetchAdmins = async () => {
        try {
            const res = await axios.get(`${API_BASE}/manage_admins.php`, getAuthHeader());
            setAdminList(res.data);
        } catch (err) {
            console.error("Failed to fetch admin list", err);
        }
    };

    // 3. Create New Admin (Existing Logic)
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!currentUser) return;

        try {
            const payload = {
                creator_email: currentUser.email,
                creator_password: creatorPassword,
                new_email: newEmail,
                new_password: newPassword,
                new_role: newRole,
            };

            const { data } = await axios.post(
                `${API_BASE}/create_admin.php`,
                payload,
                getAuthHeader()
            );

            if (data.status === "success") {
                toast.success("New Admin Added Successfully");
                // Reset form
                setNewEmail("");
                setNewPassword("");
                setCreatorPassword("");
                // Refresh list
                fetchAdmins();
            } else {
                toast.error(data.message);
            }
        } catch {
            toast.error("Connection failed or Access Denied.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Handle Role Updates (Promote/Demote)
    const handleRoleChange = async (id: string, newRole: string) => {
        if(!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

        try {
            await axios.post(`${API_BASE}/manage_admins.php`, { id, role: newRole }, getAuthHeader());
            toast.success("User role updated");
            fetchAdmins();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update Failed");
        }
    };

    // 5. Handle Delete
    const handleDelete = async (id: string) => {
        if(!confirm("Are you sure you want to permanently remove this admin?")) return;

        try {
            await axios.delete(`${API_BASE}/manage_admins.php?id=${id}`, getAuthHeader());
            toast.success("User removed access revoked");
            fetchAdmins();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Delete Failed");
        }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 lg:p-8 font-sans">
            {/* Navigation */}
            <button
                onClick={() => navigate("/admin/dashboard")}
                className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors text-sm font-medium"
            >
                <ArrowLeft size={16} className="mr-2"/> Back to Dashboard
            </button>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

                {/* COLUMN 1: Create Form */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)] h-fit">
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-6">
                        <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Grant Access</h1>
                            <p className="text-sm text-gray-500 font-medium">Create new user</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">New User Email</label>
                            <Input
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                                placeholder="user@arexa.co"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Temp Password</label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="bg-gray-50 border-gray-200 h-11 focus:bg-white transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Role</label>
                            <Select onValueChange={setNewRole} defaultValue="editor">
                                <SelectTrigger className="bg-gray-50 border-gray-200 h-11 focus:ring-2 focus:ring-blue-600">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-gray-200 shadow-lg">
                                    <SelectItem value="editor">Editor (Content Only)</SelectItem>
                                    <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-red-50 border border-red-100 rounded-xl p-5 mt-6">
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                                <ShieldAlert size={16} />
                                <span className="text-xs font-bold uppercase tracking-wide">Security Check</span>
                            </div>
                            <p className="text-[11px] text-red-600/80 mb-3 font-medium leading-relaxed">
                                Please confirm your identity to proceed.
                            </p>
                            <div className="relative">
                                <Lock size={14} className="absolute left-3 top-3.5 text-gray-400" />
                                <Input
                                    type="password"
                                    value={creatorPassword}
                                    onChange={(e) => setCreatorPassword(e.target.value)}
                                    className="bg-white border-red-200 text-gray-900 pl-9 h-10 placeholder:text-gray-400 focus-visible:ring-red-500"
                                    placeholder="Your Password"
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-black text-white h-11 font-bold rounded-lg shadow-sm mt-2"
                        >
                            {loading ? "Verifying..." : "Authorize Creation"}
                        </Button>
                    </form>
                </div>

                {/* COLUMN 2 & 3: Management Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 tracking-tight">Active Administrators ({adminList.length})</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Created</th>
                                    <th className="py-4 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {adminList.map((admin) => (
                                    <tr key={admin.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200 uppercase">
                                                    {admin.email[0]}
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">{admin.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                                    admin.role === 'super_admin'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }`}>
                                                    {admin.role === 'super_admin' ? <Shield size={10}/> : <User size={10}/>}
                                                    {admin.role.replace('_', ' ')}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4 text-xs text-gray-400 font-medium">
                                            {new Date(admin.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                {admin.role === 'editor' ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleChange(admin.id, 'super_admin')}
                                                        className="h-8 text-[10px] bg-white border-gray-200 text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                                                    >
                                                        Promote
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleRoleChange(admin.id, 'editor')}
                                                        className="h-8 text-[10px] bg-white border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                                    >
                                                        Demote
                                                    </Button>
                                                )}

                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAdmin;