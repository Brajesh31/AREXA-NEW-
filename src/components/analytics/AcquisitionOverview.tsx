import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, UserPlus, Activity, TrendingUp, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const AcquisitionOverview = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_acquisition_overview.php?range=30")
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">LOADING ACQUISITION SUMMARY...</div>;

    const KpiCard = ({ title, val, icon: Icon, color }: any) => (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 ${color}`}><Icon size={60} /></div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</div>
            <div className="text-3xl font-black text-gray-800">{val}</div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* KPI ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <KpiCard title="Total Users" val={data.kpi.total_users.toLocaleString()} icon={Users} color="text-blue-500" />
                <KpiCard title="New Users (30d)" val={data.kpi.new_users.toLocaleString()} icon={UserPlus} color="text-emerald-500" />
                <KpiCard title="Total Sessions" val={data.kpi.sessions.toLocaleString()} icon={Activity} color="text-purple-500" />
            </div>

            {/* GROWTH CHART */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" /> User Growth Trend
                    </h3>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trend}>
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => v.split('-')[2]} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="new_users" name="New Users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default AcquisitionOverview;