import { motion } from "framer-motion";
import { Zap, Globe, MapPin, MousePointer2, Smartphone, Monitor } from "lucide-react";

const RealtimeWarRoom = ({ data }: { data: any }) => {
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400">Syncing with Live Stream...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">

            {/* 1. THE HERO SECTION (Live Map Placeholder & Big Counter) */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-40 bg-blue-600/10 blur-[120px] rounded-full"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </span>
                            Users in last 30 minutes
                        </div>
                        <div className="text-[120px] font-black leading-none tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500">
                            {data.active_users || 0}
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Real-time user density across all nodes.</p>
                    </div>

                    {/* Placeholder for the World Map visualization */}
                    <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700 min-h-[350px] flex items-center justify-center relative overflow-hidden">
                        <Globe size={200} className="text-slate-700 opacity-20 animate-pulse" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full border border-blue-500/20 text-xs font-bold">
                                <MapPin size={14} /> LIVE GEOSPATIAL DATA
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. LIVE EVENT TICKER */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" /> Event Stream
                    </h3>
                    <span className="text-[10px] bg-white px-2 py-1 rounded border border-gray-200 font-bold text-gray-400">LIVE FEED</span>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-white shadow-sm text-gray-500 font-bold uppercase text-[10px]">
                        <tr>
                            <th className="p-4 pl-8">Event</th>
                            <th className="p-4">Location</th>
                            <th className="p-4 text-center">Device</th>
                            <th className="p-4 text-right pr-8">Time</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {data.live_feed?.map((log: any, i: number) => (
                            <motion.tr
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                key={i}
                                className="hover:bg-blue-50/30 transition-colors group"
                            >
                                <td className="p-4 pl-8">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800">{log.event_name}</span>
                                        <span className="text-[10px] text-gray-400 truncate max-w-[200px]">{log.page_url}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                        {log.city}, {log.country}
                                    </div>
                                </td>
                                <td className="p-4 text-center">
                                    {log.device_type === 'mobile' ? <Smartphone size={16} className="mx-auto text-purple-400" /> : <Monitor size={16} className="mx-auto text-blue-400" />}
                                </td>
                                <td className="p-4 text-right pr-8 font-mono text-gray-400 text-xs">
                                    {log.event_timestamp.split(' ')[1]}
                                </td>
                            </motion.tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default RealtimeWarRoom;