import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, ScatterChart, Scatter, ZAxis, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    LineChart, Line
} from "recharts";
import {
    Activity, Globe, FileText, Users, Server,
    RefreshCw, Zap, TrendingUp, Map as MapIcon, Cpu, Radio, ShieldCheck,
    ArrowLeft, Navigation, Flag, Compass, MapPin,
    MousePointer, Ghost,
    PenTool, Target, Layers, Star,
    Search, Fingerprint, Crown,
    Filter, ArrowDown, Magnet, ArrowRight, MousePointerClick,
    LayoutDashboard, ChevronDown, ChevronRight
} from "lucide-react";
import { toast } from "sonner";

// ✅ 1. ACQUISITION MODULES (Self-Fetching)
import AcquisitionOverview from "@/components/analytics/AcquisitionOverview";
import AcquisitionUser from "@/components/analytics/AcquisitionUser";
import AcquisitionTraffic from "@/components/analytics/AcquisitionTraffic";

// ✅ 2. ENGAGEMENT MODULES (Self-Fetching)
import EngagementOverview from "@/components/analytics/EngagementOverview";
import EngagementEvents from "@/components/analytics/EngagementEvents";
import EngagementPages from "@/components/analytics/EngagementPages";

// ✅ 3. USER MODULES (Self-Fetching)
import UserOverview from "@/components/analytics/UserOverview";
import UserDemographics from "@/components/analytics/UserDemographics";
import UserAudiences from "@/components/analytics/UserAudiences";

// ✅ 4. TECH MODULES (Self-Fetching)
import TechOverview from "@/components/analytics/TechOverview";
import TechDetails from "@/components/analytics/TechDetails";

// ✅ 5. REALTIME (Pending Granular Split)
import RealtimeWarRoom from "@/components/analytics/RealtimeWarRoom";

// --- TYPES ---
interface DashboardStats { kpi: { total_users: number; total_hits: number; active_countries: number; engagement: number; active_24h: number; }; chart_summary: { "24h": number; "7d": number; "30d": number; "90d": number; }; top_countries: { country_name: string; total_visitors: number }[]; recent_activity: { ip_address: string; country: string; city: string; last_seen: string }[]; }
interface GeoStats { kpi: { countries: number; cities: number; top_region: string; region_count: number; }; charts: { countries: { name: string; value: number }[]; }; city_matrix: { city: string; country_code: string; region: string; unique_ips: number; total_hits: number; }[]; }
interface TrafficStats { kpi: { total_pages: number; total_hits: number; dead_pages: number; avg_hits: number; }; charts: { dominance: { name: string; value: number }[]; }; page_matrix: { page_url: string; visits_24h: number; visits_7d: number; visits_30d: number; total_hits: number; last_visited: string; }[]; graveyard: { page_url: string; total_hits: number; last_visited: string; }[]; }
interface ContentStats { kpi: { total_items: number; total_views: number; avg_views: number; content_velocity: number; }; charts: { scatter: { x: number; y: number; z: number; name: string; type: string; }[]; radar: { subject: string; A: number; fullMark: number; }[]; }; leaderboard: { title: string; category: string; type: string; views: number; velocity: number; date: string; }[]; }
interface LedgerStats { kpi: { total_db: number; currently_online: number; retention_rate: number; power_users: number; }; ledger: { id: number; ip: string; location: string; flag: string; last_seen: string; total_visits: number; tier: string; sparkline: number[]; }[]; }
interface AdvancedStats { active_users?: number; live_feed?: { event_name: string; page_url: string; city: string; country: string; device_type: string; event_timestamp: string }[]; top_pages?: { page_url: string; hits: number }[]; sources?: { source: string; sessions: number; users: number }[]; devices?: { device_type: string; count: number }[]; chart?: { time_label: string; sessions: number }[]; total_sessions?: number; bounce_rate?: number; }
interface ConversionStats { funnel: { step: string; users: number; conversion_rate: number; drop_off: number }[]; cohorts: { week: string; new_users: number; retention: { week_1: number } }[]; }
interface BehaviorStats { scrolls: { page_url: string; total_views: number; s25: number; s50: number; s75: number; s90: number; }[]; clicks: { btn_text: string; clicks: number; }[]; exits: { page_url: string; exits: number; }[]; }

// --- HELPER COMPONENT ---
const TrafficChart = ({ data }: { data: any }) => {
    const chartData = [
        { name: '24h', visits: Number(data["24h"] || 0) },
        { name: '7 Days', visits: Number(data["7d"] || 0) },
        { name: '30 Days', visits: Number(data["30d"] || 0) },
        { name: '90 Days', visits: Number(data["90d"] || 0) },
    ];
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs><linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#9ca3af'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="visits" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

const KpiCard = ({ title, value, icon: Icon, color, subtext }: any) => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}><Icon size={60} /></div>
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}><Icon size={18} className="text-gray-700" /></div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{title}</span>
        </div>
        <div className="text-3xl font-black text-gray-800 font-mono tracking-tight">{value ? value.toLocaleString() : "0"}</div>
        {subtext && <div className="text-[10px] font-medium text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={10} /> {subtext}</div>}
    </motion.div>
);

const DatabaseDashboard = () => {
    const navigate = useNavigate();
    const [activeView, setActiveView] = useState<string>('reports_snapshot');
    const [loading, setLoading] = useState(true);

    const [sections, setSections] = useState({
        missionControl: true,
        lifecycle: true,
        user: true
    });

    const toggleSection = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Data States
    const [data, setData] = useState<DashboardStats | null>(null);
    const [geoData, setGeoData] = useState<GeoStats | null>(null);
    const [trafficData, setTrafficData] = useState<TrafficStats | null>(null);
    const [contentData, setContentData] = useState<ContentStats | null>(null);
    const [ledgerData, setLedgerData] = useState<LedgerStats | null>(null);
    const [advancedData, setAdvancedData] = useState<AdvancedStats | null>(null);
    const [conversionData, setConversionData] = useState<ConversionStats | null>(null);
    const [behaviorData, setBehaviorData] = useState<BehaviorStats | null>(null);

    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [isLive, setIsLive] = useState(false);

    // --- FETCHING LOGIC ---
    const fetchData = async () => {
        try {
            if (['reports_snapshot', 'overview'].includes(activeView) && !data) {
                const res = await axios.get("https://arexa.co/api/get_dashboard_stats.php");
                setData(res.data);
            }
            if (['realtime', 'advanced'].includes(activeView)) {
                const resOverview = await axios.get("https://arexa.co/api/get_advanced_analytics.php?view=overview&range=30d");
                const resRealtime = await axios.get("https://arexa.co/api/get_advanced_analytics.php?view=realtime");
                const resAcq = await axios.get("https://arexa.co/api/get_advanced_analytics.php?view=acquisition");
                setAdvancedData({ ...resOverview.data, ...resRealtime.data, ...resAcq.data });
            }

            // ALL MODULES NOW FETCH THEIR OWN DATA (Acquisition, Engagement, User, Tech)

            if (activeView === 'geo') {
                const res = await axios.get("https://arexa.co/api/get_geo_analytics.php");
                setGeoData(res.data);
            }
            if (activeView === 'traffic') {
                const res = await axios.get("https://arexa.co/api/get_traffic_stats.php");
                setTrafficData(res.data);
            }
            if (activeView === 'content') {
                const res = await axios.get("https://arexa.co/api/get_content_stats.php");
                setContentData(res.data);
            }
            if (activeView === 'users') {
                const res = await axios.get("https://arexa.co/api/get_visitor_ledger.php");
                setLedgerData(res.data);
            }
            if (activeView === 'conversion') {
                const resFunnel = await axios.get("https://arexa.co/api/get_conversion_stats.php?type=funnel");
                const resCohort = await axios.get("https://arexa.co/api/get_conversion_stats.php?type=cohort");
                setConversionData({ funnel: resFunnel.data.funnel, cohorts: resCohort.data.cohorts });
            }
            if (activeView === 'behavior') {
                const res = await axios.get("https://arexa.co/api/get_behavior_stats.php");
                setBehaviorData(res.data);
            }
            setLoading(false);
            if (isLive) toast.success("Data synced");
        } catch (error) {
            console.error("Dashboard Error:", error);
        }
    };

    useEffect(() => {
        fetchData();
        let interval: NodeJS.Timeout;
        if (isLive) interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [isLive, activeView]);

    // --- SIDEBAR INTERNAL COMPONENTS ---
    const MenuItem = ({ id, label, icon: Icon, active, indent = 0 }: any) => (
        <button
            onClick={() => setActiveView(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-all rounded-r-full mr-2
                ${active
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent"
            } 
                ${indent === 1 ? "pl-4" : ""} 
                ${indent === 2 ? "pl-9 text-xs" : ""}
            `}
        >
            {Icon && <Icon size={18} className={active ? "text-blue-600" : "text-gray-500"} />}
            <span className="truncate">{label}</span>
        </button>
    );

    const SectionHeader = ({ label, id, icon: Icon }: any) => (
        <button
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between px-3 py-3 mt-2 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-800 transition-colors"
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} />}
                {label}
            </div>
            {sections[id as keyof typeof sections] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
    );

    const SubHeader = ({ label }: { label: string }) => (
        <div className="px-9 py-2 text-[11px] font-bold text-gray-400 flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
            {label}
        </div>
    );

    return (
        <div className="h-screen flex bg-[#F8F9FB] overflow-hidden font-sans text-gray-900">

            {/* SIDEBAR */}
            <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto py-4 custom-scrollbar flex flex-col">
                <div className="mb-2">
                    <MenuItem id="reports_snapshot" label="Reports snapshot" icon={LayoutDashboard} active={activeView === 'reports_snapshot'} />
                    <MenuItem id="realtime" label="Realtime" icon={Zap} active={activeView === 'realtime'} />
                </div>
                <div className="h-px bg-gray-100 mx-4 my-2" />
                <SectionHeader label="Mission Control" id="missionControl" icon={Target} />
                {sections.missionControl && (
                    <div className="space-y-0.5">
                        <MenuItem id="overview" label="Nexus Overview" icon={LayoutDashboard} active={activeView === 'overview'} indent={1} />
                        <MenuItem id="advanced" label="True Analytics" icon={Radar} active={activeView === 'advanced'} indent={1} />
                        <MenuItem id="conversion" label="Conversion Lab" icon={Magnet} active={activeView === 'conversion'} indent={1} />
                        <MenuItem id="behavior" label="Behavior Intel" icon={MousePointerClick} active={activeView === 'behavior'} indent={1} />
                        <MenuItem id="geo" label="Geo Atlas" icon={Globe} active={activeView === 'geo'} indent={1} />
                        <MenuItem id="traffic" label="Traffic Flow" icon={Activity} active={activeView === 'traffic'} indent={1} />
                        <MenuItem id="content" label="Content ROI" icon={FileText} active={activeView === 'content'} indent={1} />
                        <MenuItem id="users" label="User Ledger" icon={Users} active={activeView === 'users'} indent={1} />
                    </div>
                )}
                <div className="h-px bg-gray-100 mx-4 my-2" />
                <SectionHeader label="Life Cycle" id="lifecycle" icon={Activity} />
                {sections.lifecycle && (
                    <div className="space-y-1">
                        <SubHeader label="Acquisition" />
                        <MenuItem id="acq_overview" label="Overview" active={activeView === 'acq_overview'} indent={2} />
                        <MenuItem id="acq_user" label="User acquisition" active={activeView === 'acq_user'} indent={2} />
                        <MenuItem id="acq_traffic" label="Traffic acquisition" active={activeView === 'acq_traffic'} indent={2} />
                        <SubHeader label="Engagement" />
                        <MenuItem id="eng_overview" label="Overview" active={activeView === 'eng_overview'} indent={2} />
                        <MenuItem id="eng_events" label="Events" active={activeView === 'eng_events'} indent={2} />
                        <MenuItem id="eng_pages" label="Pages and screens" active={activeView === 'eng_pages'} indent={2} />
                    </div>
                )}
                <div className="h-px bg-gray-100 mx-4 my-2" />
                <SectionHeader label="User" id="user" icon={Users} />
                {sections.user && (
                    <div className="space-y-1">
                        <SubHeader label="User attributes" />
                        <MenuItem id="user_overview" label="Overview" active={activeView === 'user_overview'} indent={2} />
                        <MenuItem id="user_demographics" label="Demographic details" active={activeView === 'user_demographics'} indent={2} />
                        <MenuItem id="user_audiences" label="Audiences" active={activeView === 'user_audiences'} indent={2} />
                        <SubHeader label="Tech" />
                        <MenuItem id="tech_overview" label="Overview" active={activeView === 'tech_overview'} indent={2} />
                        <MenuItem id="tech_details" label="Tech details" active={activeView === 'tech_details'} indent={2} />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <h1 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
                            {activeView.replace(/_/g, ' ').toUpperCase()}
                        </h1>
                        {loading && <Cpu size={14} className="animate-spin text-blue-500"/>}
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsLive(!isLive)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${isLive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-gray-500 border-gray-200'}`}>
                            {isLive ? <Radio size={12} className="animate-pulse" /> : <RefreshCw size={12} />} {isLive ? 'LIVE' : 'REFRESH'}
                        </button>
                        <button onClick={() => navigate('/admin/dashboard')} className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-[1600px] mx-auto space-y-8 pb-20">
                        <AnimatePresence mode="wait">

                            {/* ✅ ENTERPRISE MODULAR ROUTING */}
                            {activeView === 'realtime' && <RealtimeWarRoom data={advancedData} />}

                            {/* --- ACQUISITION MODULE --- */}
                            {activeView === 'acq_overview' && <AcquisitionOverview />}
                            {activeView === 'acq_user' && <AcquisitionUser />}
                            {activeView === 'acq_traffic' && <AcquisitionTraffic />}

                            {/* --- ENGAGEMENT MODULE --- */}
                            {activeView === 'eng_overview' && <EngagementOverview />}
                            {activeView === 'eng_events' && <EngagementEvents />}
                            {activeView === 'eng_pages' && <EngagementPages />}

                            {/* --- USER MODULE --- */}
                            {activeView === 'user_overview' && <UserOverview />}
                            {activeView === 'user_demographics' && <UserDemographics />}
                            {activeView === 'user_audiences' && <UserAudiences />}

                            {/* --- TECH MODULE --- */}
                            {activeView === 'tech_overview' && <TechOverview />}
                            {activeView === 'tech_details' && <TechDetails />}

                            {/* --- 🛑 MISSION CONTROL VIEWS --- */}
                            {(activeView === 'reports_snapshot' || activeView === 'overview') && data && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                                        <KpiCard title="Total Fingerprints" value={data.kpi.total_users} icon={Users} color="bg-blue-500" subtext={`+${data.kpi.active_24h} new`} />
                                        <KpiCard title="Request Volume" value={data.kpi.total_hits} icon={Server} color="bg-purple-500" subtext="100% Uptime" />
                                        <KpiCard title="Global Reach" value={data.kpi.active_countries.length} icon={Globe} color="bg-emerald-500" subtext="Regions" />
                                        <KpiCard title="Content Heat" value={data.kpi.engagement} icon={Zap} color="bg-amber-500" subtext="Clicks" />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-6"><div><h3 className="text-lg font-bold text-gray-800">Traffic Velocity</h3></div></div>
                                            <TrafficChart data={data.chart_summary} />
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                            <h3 className="text-lg font-bold text-gray-800 mb-6">Regional Power</h3>
                                            <div className="space-y-4">{data.top_countries.map((c, i) => (<div key={i} className="flex justify-between p-2 hover:bg-gray-50 rounded"><span className="text-sm font-bold text-gray-700">{c.country_name || "Unknown"}</span><span className="text-sm font-mono text-gray-500">{c.total_visitors}</span></div>))}</div>
                                        </div>
                                    </div>
                                    <div className="bg-black text-white rounded-xl p-4 flex items-center gap-4 overflow-hidden relative shadow-xl shadow-blue-900/20">
                                        <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-widest min-w-fit animate-pulse"><ShieldCheck size={14} /> System Secure</div>
                                        <div className="flex-1 overflow-hidden relative h-6"><div className="absolute animate-marquee whitespace-nowrap flex gap-8">{data.recent_activity.map((log, i) => (<span key={i} className="text-xs font-mono text-gray-400"><span className="text-blue-400">[{log.last_seen}]</span> New login from <span className="text-white font-bold">{log.city}, {log.country}</span></span>))}</div></div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'geo' && geoData && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-blue-50 text-blue-600"><Globe size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Active Territories</div>
                                            <div className="text-3xl font-black text-gray-800">{geoData.kpi.countries}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">Countries Reached</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-pink-50 text-pink-600"><MapPin size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">City Footprint</div>
                                            <div className="text-3xl font-black text-gray-800">{geoData.kpi.cities}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">Unique Cities</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-teal-50 text-teal-600"><Navigation size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Top Region</div>
                                            <div className="text-2xl font-black text-gray-800 truncate">{geoData.kpi.top_region}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">{geoData.kpi.region_count} Visitors</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-orange-50 text-orange-600"><Compass size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Expansion Rate</div>
                                            <div className="text-3xl font-black text-gray-800">High</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">New Markets</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Flag size={18} className="text-blue-500" /> Market Dominance</h3>
                                            <div className="h-[400px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart layout="vertical" data={geoData.charts?.countries || []} margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                                                        <XAxis type="number" hide />
                                                        <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fontWeight: 'bold'}} />
                                                        <Tooltip cursor={{fill: '#f8fafc'}} />
                                                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                            <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><MapIcon size={18} className="text-purple-500" /> Urban Density Matrix</h3></div>
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left text-sm">
                                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                                    <tr><th className="p-4 pl-6">City</th><th className="p-4">Region</th><th className="p-4 text-center">Country</th><th className="p-4 text-right">Unique IPs</th><th className="p-4 text-right pr-6">Total Traffic</th></tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-50">
                                                    {(geoData.city_matrix || []).map((city, i) => (
                                                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                                            <td className="p-4 pl-6 font-bold text-gray-700">{city.city}</td>
                                                            <td className="p-4 text-gray-500">{city.region}</td>
                                                            <td className="p-4 text-center"><span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-mono font-bold text-gray-600">{city.country_code}</span></td>
                                                            <td className="p-4 text-right font-mono text-gray-600">{city.unique_ips}</td>
                                                            <td className="p-4 text-right pr-6">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <span className="font-bold text-blue-600">{city.total_hits}</span>
                                                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((city.total_hits / (geoData.city_matrix[0]?.total_hits || 1)) * 100, 100)}%` }} /></div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'users' && ledgerData && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-blue-500 text-blue-500"><Server size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Database Size</div>
                                            <div className="text-3xl font-black text-gray-800">{ledgerData.kpi.total_db}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1"><TrendingUp size={10} /> Total Rows</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-green-500 text-green-500"><Fingerprint size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Currently Online</div>
                                            <div className="text-3xl font-black text-gray-800">{ledgerData.kpi.currently_online}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">Active Now</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-purple-500 text-purple-500"><Crown size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Retention Rate</div>
                                            <div className="text-3xl font-black text-gray-800">{ledgerData.kpi.retention_rate}%</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">Returning Users</div>
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10 bg-amber-500 text-amber-500"><Star size={60} /></div>
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Power Users</div>
                                            <div className="text-3xl font-black text-gray-800">{ledgerData.kpi.power_users}</div>
                                            <div className="text-[10px] font-bold text-green-600 mt-2 flex items-center gap-1">{'>'} 20 Visits</div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Search size={18} /> Live Visitor Log</h3><span className="text-xs text-gray-400">Showing last 50 connections</span></div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                                                <tr><th className="p-4 pl-6">ID</th><th className="p-4">IP Address</th><th className="p-4">Location</th><th className="p-4">Last Seen</th><th className="p-4 text-center">Tier</th><th className="p-4 w-32">Activity (7d)</th><th className="p-4 text-right pr-6">Action</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                {ledgerData.ledger.slice(0, 50).map((u, i) => (
                                                    <tr key={i} onClick={() => setSelectedUser(u)} className="hover:bg-blue-50/50 transition-colors cursor-pointer group">
                                                        <td className="p-4 pl-6 font-mono text-gray-400 text-xs">#{u.id}</td>
                                                        <td className="p-4 font-mono font-bold text-gray-700 text-xs">{u.ip}</td>
                                                        <td className="p-4 flex items-center gap-2 text-gray-700"><Globe size={14} className="text-blue-500" /> {u.location}</td>
                                                        <td className="p-4 text-gray-500 text-xs">{u.last_seen}</td>
                                                        <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${u.tier === 'Fanatic' ? 'bg-purple-100 text-purple-700 border-purple-200' : u.tier === 'VIP' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>{u.tier}</span></td>
                                                        <td className="p-4 w-32"><div className="h-8 w-24"><ResponsiveContainer width="100%" height="100%"><LineChart data={u.sparkline.map((val: number, idx: number) => ({ val, idx }))}><Line type="monotone" dataKey="val" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} /></LineChart></ResponsiveContainer></div></td>
                                                        <td className="p-4 text-right pr-6"><button className="text-blue-600 hover:underline text-xs font-bold">Inspect</button></td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'content' && contentData && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <KpiCard title="Publishing Library" value={contentData.kpi.total_items} icon={Layers} color="bg-blue-500" subtext="Blogs & Insights" />
                                        <KpiCard title="Total Impressions" value={contentData.kpi.total_views.toLocaleString()} icon={Target} color="bg-purple-500" subtext="Cumulative Views" />
                                        <KpiCard title="Engagement Rate" value={contentData.kpi.avg_views.toLocaleString()} icon={Star} color="bg-amber-500" subtext="Avg Views / Post" />
                                        <KpiCard title="Viral Velocity" value={contentData.kpi.content_velocity} icon={Zap} color="bg-rose-500" subtext="Clicks per Day" />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-center mb-6">
                                                <div><h3 className="text-lg font-bold text-gray-800">Viral Matrix</h3><p className="text-xs text-gray-400">Y=Views, X=Age (Days), Size=Velocity</p></div>
                                                <div className="flex gap-2"><span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded">Evergreen</span><span className="px-2 py-1 bg-pink-100 text-pink-600 text-[10px] font-bold rounded">Viral</span></div>
                                            </div>
                                            <div className="h-[350px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#f0f0f0" />
                                                        <XAxis type="number" dataKey="x" name="Age" unit="d" stroke="#9ca3af" fontSize={10} />
                                                        <YAxis type="number" dataKey="y" name="Views" stroke="#9ca3af" fontSize={10} />
                                                        <ZAxis type="number" dataKey="z" range={[50, 400]} name="Velocity" />
                                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                                        <Scatter name="Content" data={contentData.charts.scatter} fill="#8884d8">{contentData.charts.scatter.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.type === 'Blog' ? '#3b82f6' : '#ec4899'} />))}</Scatter>
                                                    </ScatterChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><PenTool size={18} className="text-purple-500" /> Topic Balance</h3>
                                            <div className="h-[300px]">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={contentData.charts.radar}>
                                                        <PolarGrid stroke="#e5e7eb" />
                                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                                                        <Radar name="Topics" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                    </RadarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Star size={18} className="text-amber-500" /> Top Performing Content</h3></div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-50 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                                                <tr><th className="p-4 pl-6">Title</th><th className="p-4">Type</th><th className="p-4">Category</th><th className="p-4 text-right">Total Views</th><th className="p-4 text-right">Velocity</th><th className="p-4 text-right pr-6">Published</th></tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50">
                                                {contentData.leaderboard.map((item, i) => (
                                                    <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                                                        <td className="p-4 pl-6 font-bold text-gray-800 max-w-sm truncate">{item.title}</td>
                                                        <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-600 text-[10px] font-bold rounded uppercase">{item.type}</span></td>
                                                        <td className="p-4 text-gray-500 text-xs">{item.category}</td>
                                                        <td className="p-4 text-right font-mono font-bold text-gray-700">{item.views.toLocaleString()}</td>
                                                        <td className="p-4 text-right"><span className="text-green-600 font-bold text-xs">{item.velocity} / day</span></td>
                                                        <td className="p-4 text-right pr-6 text-xs text-gray-400">{item.date}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'traffic' && trafficData && (<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8"><div className="grid grid-cols-1 md:grid-cols-4 gap-5"><KpiCard title="Pages" value={trafficData.kpi.total_pages} icon={FileText} color="bg-blue-500" subtext="URLs" /><KpiCard title="Interactions" value={trafficData.kpi.total_hits} icon={MousePointer} color="bg-indigo-500" subtext="Clicks" /><KpiCard title="Avg Traffic" value={trafficData.kpi.avg_hits} icon={Activity} color="bg-green-500" subtext="Hits/Page" /><KpiCard title="Dead Content" value={trafficData.kpi.dead_pages} icon={Ghost} color="bg-red-500" subtext="Cleanup" /></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]"><tr><th className="p-4">Page</th><th className="p-4 text-right">Total</th></tr></thead><tbody>{trafficData.page_matrix.map((p,i)=>(<tr key={i} className="border-b border-gray-50"><td className="p-4 truncate max-w-xs">{p.page_url}</td><td className="p-4 text-right font-bold text-blue-600">{p.total_hits}</td></tr>))}</tbody></table></div><div className="lg:col-span-1 space-y-6"><div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"><h3 className="font-bold text-gray-800 mb-4">Dominance</h3><div className="h-[250px]"><ResponsiveContainer width="100%" height="100%"><BarChart layout="vertical" data={trafficData.charts.dominance}><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={80} /><Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></div></div></div></motion.div>)}

                            {activeView === 'conversion' && conversionData && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                                        <div className="flex justify-between items-center mb-8"><div><h3 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Filter className="text-blue-500" size={20} /> Conversion Funnel</h3></div></div>
                                        <div className="flex items-center justify-center gap-4">{conversionData.funnel.map((step, i) => (<div key={i} className="flex flex-1 items-center"><div className="relative flex-1 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center group hover:border-blue-200 transition-all"><div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{step.step}</div><div className="text-3xl font-black text-slate-800 mb-2">{step.users}</div><div className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${step.drop_off > 50 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>{i === 0 ? "Entry" : (<><ArrowDown size={12} /> {step.drop_off}% Drop</>)}</div></div>{i < conversionData.funnel.length - 1 && (<div className="text-gray-300 mx-4"><ArrowRight size={24} /></div>)}</div>))}</div>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'behavior' && behaviorData && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        <div className="p-6 border-b border-gray-100"><h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><ArrowDown className="text-blue-500" size={20} /> Deep Scroll Heatmap</h3></div>
                                        <table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]"><tr><th className="p-4">Page</th><th className="p-4 text-right">Views</th><th className="p-4 text-center">50% Read</th><th className="p-4 text-center">90% Read</th></tr></thead><tbody>{behaviorData.scrolls.map((row, i) => (<tr key={i} className="border-b border-gray-50"><td className="p-4 truncate max-w-xs">{row.page_url.replace('https://arexa.co', '')}</td><td className="p-4 text-right">{row.total_views}</td><td className="p-4 text-center text-blue-600 font-bold">{Math.round((row.s50/row.total_views)*100)}%</td><td className="p-4 text-center text-purple-600 font-bold">{Math.round((row.s90/row.total_views)*100)}%</td></tr>))}</tbody></table>
                                    </div>
                                </motion.div>
                            )}

                            {activeView === 'advanced' && advancedData && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                    <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-40 bg-blue-600/10 blur-[100px] rounded-full"></div>
                                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                            <div>
                                                <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest mb-2"><span className="animate-ping w-2 h-2 bg-green-500 rounded-full"></span> Live Users</div>
                                                <div className="text-8xl font-black tracking-tighter mb-2">{advancedData.active_users || 0}</div>
                                                <p className="text-slate-400 text-sm">Active in last 5 minutes</p>
                                            </div>
                                            <div className="lg:col-span-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                                                <h3 className="font-bold text-slate-300 mb-4 text-sm border-b border-slate-700 pb-2">Realtime Event Stream</h3>
                                                <div className="space-y-2">
                                                    {advancedData.live_feed?.map((log: any, i: number) => (
                                                        <div key={i} className="flex justify-between text-xs p-2 rounded bg-white/5 hover:bg-white/10 transition-colors">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-blue-400 font-mono">{log.event_name}</span>
                                                                <span className="text-slate-300 truncate max-w-[250px]">{log.page_url.replace('https://arexa.co', '')}</span>
                                                            </div>
                                                            <div className="text-slate-500">{log.city}, {log.country}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseDashboard;