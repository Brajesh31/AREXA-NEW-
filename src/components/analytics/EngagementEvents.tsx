import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { MousePointerClick, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const EngagementEvents = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_engagement_events.php?range=30")
            .then(res => {
                if (res.data) setData(res.data);
                else setError(true);
            })
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING EVENTS</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">ANALYZING CLICKS...</div>;

    const events = Array.isArray(data.events) ? data.events : [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <MousePointerClick size={18} className="text-purple-500" /> Top Events
                </h3>
                <p className="text-xs text-gray-400 mb-6">Most frequent user interactions (clicks, scrolls, custom actions).</p>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* CHART */}
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={events} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="event_name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} />
                                    <Bar dataKey="event_count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={30}>
                                        {events.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* TABLE */}
                        <div className="overflow-hidden border border-gray-100 rounded-xl">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                                <tr>
                                    <th className="p-3 pl-4">Event Name</th>
                                    <th className="p-3 text-right">Count</th>
                                    <th className="p-3 text-right pr-4">Uniques</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                {events.map((ev: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50">
                                        <td className="p-3 pl-4 font-bold text-gray-700">{ev.event_name}</td>
                                        <td className="p-3 text-right font-mono">{Number(ev.event_count).toLocaleString()}</td>
                                        <td className="p-3 text-right pr-4 text-purple-600 font-bold">{Number(ev.total_users).toLocaleString()}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center text-gray-400 text-sm">No events recorded yet.</div>
                )}
            </div>
        </motion.div>
    );
};

export default EngagementEvents;