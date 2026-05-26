import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Globe, MapPin, AlertCircle, Calendar } from "lucide-react";

const UserDemographics = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    // ✅ NEW: Date State
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

    useEffect(() => {
        // ✅ NEW: Fetch with date params
        axios.get(`https://arexa.co/api/get_user_demographics.php?start_date=${startDate}&end_date=${endDate}`)
            .then(res => setData(res.data))
            .catch(() => setError(true));
    }, [startDate, endDate]);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING GEO DATA</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">MAPPING WORLD...</div>;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* ✅ NEW: DISCRETE DATE FILTER (Right Aligned, Matches Theme) */}
            <div className="flex justify-end">
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                    <Calendar size={14} className="text-gray-400" />
                    <input
                        type="date"
                        value={startDate}
                        max={endDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent border-none text-xs font-medium text-gray-600 focus:ring-0 cursor-pointer p-0"
                    />
                    <span className="text-gray-300">-</span>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent border-none text-xs font-medium text-gray-600 focus:ring-0 cursor-pointer p-0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COUNTRIES TABLE (Your Exact Design) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                        <Globe className="text-blue-500" size={18} /> <h3 className="font-bold text-gray-800">Top Countries</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                        <tr><th className="p-4 pl-6">Country</th><th className="p-4 text-right">Users</th><th className="p-4 text-right pr-6">Last Active</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {data.countries && data.countries.map((c: any, i: number) => (
                            <tr key={i} className="hover:bg-blue-50/20">
                                <td className="p-4 pl-6 font-bold text-gray-700">
                                    {c.country_name}
                                </td>
                                <td className="p-4 text-right font-mono text-blue-600 font-bold">{Number(c.total_visitors).toLocaleString()}</td>
                                <td className="p-4 text-right pr-6 text-gray-400 text-xs">{c.last_active?.split(' ')[0]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* CITIES TABLE (Your Exact Design) */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center gap-2">
                        <MapPin className="text-pink-500" size={18} /> <h3 className="font-bold text-gray-800">Top Cities</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                        <tr><th className="p-4 pl-6">City</th><th className="p-4">Region</th><th className="p-4 text-right pr-6">Sessions</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                        {data.cities && data.cities.map((c: any, i: number) => (
                            <tr key={i} className="hover:bg-pink-50/20">
                                <td className="p-4 pl-6 font-bold text-gray-700">{c.city}</td>
                                <td className="p-4 text-gray-500 text-xs">{c.region}</td>
                                <td className="p-4 text-right pr-6 font-mono text-pink-600 font-bold">{c.sessions}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default UserDemographics;