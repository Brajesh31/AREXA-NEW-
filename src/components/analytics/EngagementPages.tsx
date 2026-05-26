import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, AlertCircle, Clock, Eye } from "lucide-react";

const EngagementPages = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_engagement_pages.php?range=30")
            .then(res => {
                if (res.data) setData(res.data);
                else setError(true);
            })
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING PAGES</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">RANKING CONTENT...</div>;

    const pages = Array.isArray(data.pages) ? data.pages : [];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <FileText size={18} className="text-emerald-500" /> Pages and Screens
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Most viewed content and how long users stay there.</p>
                </div>

                {pages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Page URL</th>
                                <th className="p-4 text-right">Views</th>
                                <th className="p-4 text-right">Users</th>
                                <th className="p-4 text-right pr-6">Avg. Time</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                            {pages.map((row: any, i: number) => (
                                <tr key={i} className="hover:bg-emerald-50/20 transition-colors group">
                                    <td className="p-4 pl-6 font-medium text-gray-700 truncate max-w-xs group-hover:text-emerald-600 transition-colors">
                                        {row.page_url}
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-600">
                                        <div className="flex items-center justify-end gap-1">
                                            <Eye size={12} className="text-gray-300"/> {Number(row.views).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-gray-600">{Number(row.users).toLocaleString()}</td>
                                    <td className="p-4 text-right pr-6">
                                        <div className="flex items-center justify-end gap-2 text-emerald-600 font-bold">
                                            <Clock size={12} /> {row.avg_time}s
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-10 text-center text-gray-400 text-sm">No page views recorded yet.</div>
                )}
            </div>
        </motion.div>
    );
};

export default EngagementPages;