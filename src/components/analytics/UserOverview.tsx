import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Repeat, Crown, Clock, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const UserOverview = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_user_overview.php")
            .then(res => {
                // ✅ SAFETY CHECK: Ensure we actually got valid data, not an error object
                if (res.data && res.data.status === "success" && res.data.kpi) {
                    setData(res.data);
                } else {
                    console.error("API Error:", res.data);
                    setError(true);
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setError(true);
            });
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> UNABLE TO LOAD USER STATS</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">ANALYZING PROFILES...</div>;

    const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];
    const distribution = data.distribution || [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><Users size={16}/> Total Users</div>
                    <div className="text-3xl font-black text-gray-800">{Number(data.kpi?.total_users || 0).toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><Repeat size={16}/> Retention</div>
                    <div className="text-3xl font-black text-blue-600">{data.kpi?.retention_rate || 0}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><Crown size={16}/> Power Users</div>
                    <div className="text-3xl font-black text-purple-600">{data.kpi?.power_users || 0}</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider"><Clock size={16}/> Avg Lifetime</div>
                    <div className="text-3xl font-black text-emerald-600">{data.kpi?.avg_lifetime_days || 0} <span className="text-sm font-bold text-gray-400">Days</span></div>
                </div>
            </div>

            {/* DISTRIBUTION */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">User Distribution (by Country)</h3>
                {distribution.length > 0 ? (
                    <>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={distribution} innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value">
                                        {distribution.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 flex-wrap mt-4">
                            {distribution.map((entry: any, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                    {entry.name} ({entry.value})
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No geographic data available yet.</div>
                )}
            </div>
        </motion.div>
    );
};

export default UserOverview;