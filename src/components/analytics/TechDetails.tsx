import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Monitor, Cpu, Wifi, AlertCircle } from "lucide-react";

const TechDetails = () => {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        axios.get("https://arexa.co/api/get_tech_details.php")
            .then(res => setData(res.data))
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="h-64 flex items-center justify-center text-red-400 font-mono gap-2"><AlertCircle size={16}/> ERROR LOADING SPECS</div>;
    if (!data) return <div className="h-64 flex items-center justify-center text-gray-400 font-mono text-sm animate-pulse">ANALYZING HARDWARE...</div>;

    const SpecTable = ({ title, icon: Icon, items, color }: any) => (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className={`p-4 border-b border-gray-100 flex items-center gap-2 ${color}`}>
                <Icon size={18} /> <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
            </div>
            <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-gray-50">
                {items && items.length > 0 ? items.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                        <td className="p-3 pl-4 font-mono text-gray-600">{row.name}</td>
                        <td className="p-3 text-right pr-4 font-bold text-gray-800">{Number(row.value).toLocaleString()}</td>
                    </tr>
                )) : (
                    <tr><td colSpan={2} className="p-4 text-center text-gray-400">No data</td></tr>
                )}
                </tbody>
            </table>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SpecTable
                    title="Screen Resolutions"
                    icon={Monitor}
                    items={data.screens}
                    color="text-blue-600"
                />
                <SpecTable
                    title="Operating Systems"
                    icon={Cpu}
                    items={data.os}
                    color="text-purple-600"
                />
                <SpecTable
                    title="GPU Renderers"
                    icon={Cpu}
                    items={data.gpus}
                    color="text-emerald-600"
                />
                <SpecTable
                    title="Connection Type"
                    icon={Wifi}
                    items={data.connections}
                    color="text-orange-600"
                />
            </div>
        </motion.div>
    );
};

export default TechDetails;