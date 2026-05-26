import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Timer, Activity, MousePointer2, AlertCircle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const EngagementOverview = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_engagement_overview.php?range=30")
            .then(res => {
                if (res.data) setData(res.data);
                else setError(true);
            })
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING ENGAGEMENT DATA</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">MEASURING STICKINESS...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 bg-blue-500 text-blue-600"><Timer size={60} /></div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Engagement Time</div>
                    <div className="text-4xl font-black text-gray-800">{data.kpi.avg_engagement_time}s</div>
                    <div className="text-[10px] font-bold text-green-600 mt-2">Per Session</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 bg-purple-500 text-purple-600"><MousePointer2 size={60} /></div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Events per Session</div>
                    <div className="text-4xl font-black text-gray-800">{data.kpi.events_per_session}</div>
                    <div className="text-[10px] font-bold text-green-600 mt-2">Interactions</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 bg-emerald-500 text-emerald-600"><Activity size={60} /></div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Events</div>
                    <div className="text-4xl font-black text-gray-800">{Number(data.kpi.total_events).toLocaleString()}</div>
                    <div className="text-[10px] font-bold text-green-600 mt-2">Last 30 Days</div>
                </div>
            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-500" /> Interaction Velocity
                    </h3>
                </div>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.trend}>
                            <defs>
                                <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={(v) => v.split('-')[2]} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                            <Area type="monotone" dataKey="event_count" name="Events" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorEvents)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

export default EngagementOverview;