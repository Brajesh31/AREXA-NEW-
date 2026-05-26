import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, Crown, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const UserAudiences = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_user_audiences.php")
            .then(res => setData(res.data))
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING AUDIENCES</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">SEGMENTING USERS...</div>;

    const COLORS = ['#94a3b8', '#3b82f6', '#8b5cf6', '#f59e0b'];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* SEGMENT CHART */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><Users size={18}/> Loyalty Segments</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.segments}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                            <YAxis axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px'}} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                                {data.segments.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RECENT WHALES */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                    <Crown className="text-amber-500" size={18} /> <h3 className="font-bold text-gray-800">Recent VIP Activity</h3>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                    <tr><th className="p-4 pl-6">IP Address</th><th className="p-4">Location</th><th className="p-4 text-right">Visits</th><th className="p-4 text-right pr-6">Last Seen</th></tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                    {data.whales.map((w: any, i: number) => (
                        <tr key={i} className="hover:bg-amber-50/20">
                            <td className="p-4 pl-6 font-mono text-gray-600 text-xs">{w.ip_address}</td>
                            <td className="p-4 text-gray-700">{w.city}, {w.country}</td>
                            <td className="p-4 text-right font-bold text-amber-600">{w.total_visits}</td>
                            <td className="p-4 text-right pr-6 text-gray-400 text-xs">{w.last_seen}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default UserAudiences;