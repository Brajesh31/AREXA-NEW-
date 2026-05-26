import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Shuffle, AlertCircle } from "lucide-react";

const AcquisitionTraffic = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_acquisition_traffic.php?range=30")
            .then(res => {
                if (res.data) setData(res.data);
                else setError(true);
            })
            .catch(err => {
                console.error(err);
                setError(true);
            });
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING TRAFFIC DATA</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">ANALYZING TRAFFIC PATTERNS...</div>;

    // ✅ SAFETY CHECK: Ensure array exists
    const trafficList = Array.isArray(data.traffic) ? data.traffic : [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Shuffle size={18} className="text-orange-500" /> Session Traffic Sources
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Breakdown by specific source/medium (e.g. google / organic).</p>
                </div>

                {trafficList.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Source / Medium</th>
                                <th className="p-4 text-right">Sessions</th>
                                <th className="p-4 text-right">Users</th>
                                <th className="p-4 text-right pr-6">Eng. Rate</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {trafficList.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-orange-50/20 transition-colors group">
                                    <td className="p-4 pl-6 font-bold text-gray-700 group-hover:text-orange-600 transition-colors">
                                        {row.source_medium}
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-600">{row.sessions.toLocaleString()}</td>
                                    <td className="p-4 text-right font-mono text-gray-600">{row.users.toLocaleString()}</td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                                <span className={`text-xs font-bold ${row.engagement_rate > 50 ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {row.engagement_rate}%
                                                </span>
                                            <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${row.engagement_rate > 50 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${row.engagement_rate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center text-gray-400 text-sm">No traffic sources recorded yet.</div>
                )}
            </div>
        </motion.div>
    );
};

export default AcquisitionTraffic;