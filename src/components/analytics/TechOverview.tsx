import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Tablet, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const TechOverview = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_tech_stats.php?range=30")
            .then(res => {
                // ✅ Safety Check: Ensure data exists
                if (res.data && res.data.status === "success") {
                    setData(res.data);
                } else {
                    setError(true);
                }
            })
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING TECH DATA</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">SCANNING DEVICES...</div>;

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // ✅ CRASH PROOF MAPPING
    // Handles null categories or missing values safely
    const deviceData = (data.devices || []).map((d: any) => {
        const rawName = d.category || "Unknown"; // Fallback if null
        return {
            name: rawName.charAt(0).toUpperCase() + rawName.slice(1),
            value: Number(d.sessions || 0)
        };
    });

    const browserData = (data.browsers || []).map((b: any) => ({
        name: b.name || "Unknown",
        sessions: Number(b.sessions || 0)
    }));

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Smartphone size={24} /></div>
                    <div>
                        <div className="text-2xl font-black text-gray-800">
                            {deviceData.find((d:any) => d.name === 'Mobile')?.value.toLocaleString() || 0}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase">Mobile Sessions</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Monitor size={24} /></div>
                    <div>
                        <div className="text-2xl font-black text-gray-800">
                            {deviceData.find((d:any) => d.name === 'Desktop')?.value.toLocaleString() || 0}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase">Desktop Sessions</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Tablet size={24} /></div>
                    <div>
                        <div className="text-2xl font-black text-gray-800">
                            {deviceData.find((d:any) => d.name === 'Tablet')?.value.toLocaleString() || 0}
                        </div>
                        <div className="text-xs font-bold text-gray-400 uppercase">Tablet Sessions</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* DEVICE PIE */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Device Split</h3>
                    {deviceData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                        {deviceData.map((_: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-4 flex-wrap">
                                {deviceData.map((entry: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        {entry.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">No device data found</div>
                    )}
                </div>

                {/* BROWSER BAR */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6">Top Browsers</h3>
                    {browserData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={browserData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="sessions" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">No browser data found</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TechOverview;