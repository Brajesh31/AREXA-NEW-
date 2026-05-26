import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    FileText, Layers, Briefcase, Users, ArrowRight,
    Activity, Sparkles, TrendingUp, Eye, BarChart3, Zap,
    Globe, MousePointer, Clock
} from "lucide-react";

// --- Types ---
interface DashboardStats {
    blogs: number;
    insights: number;
    works: number;
    brands: number;
}

interface AnalyticsItem {
    date: string;
    displayDate: string;
    users: number;
    views: number;
}

interface RealtimeItem {
    name: string;
    value: number;
}

// Interface for Page Performance
interface PageStat {
    title: string;
    views: number;
    users: number;
    time: number;
}

interface RealtimeState {
    total_active: number;
    pages: RealtimeItem[];
    events: RealtimeItem[];
    sources: RealtimeItem[];
    countries: RealtimeItem[];
}

const API = "https://arexa.co/api";

const DashboardHome = () => {
    const navigate = useNavigate();

    // CMS Stats State
    const [stats, setStats] = useState<DashboardStats>({ blogs: 0, insights: 0, works: 0, brands: 0 });

    // Analytics State
    const [dailyData, setDailyData] = useState<AnalyticsItem[]>([]);
    const [totalTraffic, setTotalTraffic] = useState({ users: 0, views: 0 });

    // Page Stats State
    const [pageStats, setPageStats] = useState<PageStat[]>([]);

    // Real-Time State
    const [realtime, setRealtime] = useState<RealtimeState>({
        total_active: 0,
        pages: [],
        events: [],
        sources: [],
        countries: []
    });

    const [loading, setLoading] = useState(true);
    const [analyticsError, setAnalyticsError] = useState(false);

    // Helper: Calculate width for progress bars
    const getWidth = (val: number, list: RealtimeItem[]) => {
        const max = Math.max(...list.map(i => i.value)) || 1;
        return `${(val / max) * 100}%`;
    };

    const fetchData = async () => {
        const token = localStorage.getItem("arexa_token");
        const headers = { headers: { Authorization: `Bearer ${token}` } };

        try {
            // 1. CMS Stats
            if (loading) {
                const [blogs, insights, works, brands] = await Promise.all([
                    axios.get(`${API}/cms.php?type=blogs`, headers),
                    axios.get(`${API}/cms.php?type=insights`, headers),
                    axios.get(`${API}/cms.php?type=works`, headers),
                    axios.get(`${API}/cms.php?type=brands`, headers)
                ]);

                setStats({
                    blogs: blogs.data.length || 0,
                    insights: insights.data.length || 0,
                    works: works.data.length || 0,
                    brands: brands.data.length || 0
                });
            }

            // 2. Analytics
            const res = await axios.get(`${API}/traffic_data.php`, headers);

            if (res.data && res.data.status === 'success') {

                // Handle Real-Time
                if (res.data.realtime) {
                    setRealtime({
                        total_active: res.data.realtime.total_active || 0,
                        pages: res.data.realtime.pages || [],
                        events: res.data.realtime.events || [],
                        sources: res.data.realtime.sources || [],
                        countries: res.data.realtime.countries || []
                    });
                }

                // Handle Historical & Page Stats
                if (res.data.historical) {
                    // Update Totals
                    setTotalTraffic({
                        users: res.data.historical.total_users || res.data.historical.total_users_30d || 0,
                        views: res.data.historical.total_views || res.data.historical.total_views_30d || 0
                    });

                    // Update Page Stats Table
                    if (res.data.historical.page_stats) {
                        setPageStats(res.data.historical.page_stats);
                    }

                    // Update Graph
                    if (Array.isArray(res.data.historical.daily_stats)) {
                        const rawData = res.data.historical.daily_stats;
                        const sorted = rawData.sort((a: any, b: any) => a.date.localeCompare(b.date));

                        const formatted: AnalyticsItem[] = sorted.map((item: any) => {
                            const y = item.date.substring(0, 4);
                            const m = item.date.substring(4, 6);
                            const d = item.date.substring(6, 8);
                            return {
                                date: item.date,
                                displayDate: new Date(`${y}-${m}-${d}`).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
                                users: parseInt(item.users),
                                views: parseInt(item.views)
                            };
                        });
                        setDailyData(formatted);
                    }
                }
            } else {
                setAnalyticsError(true);
            }
        } catch (error) {
            console.error("Dashboard Load Failed", error);
            setAnalyticsError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    // ✅ LIVE DATA CALCULATION
    const liveVisitors = totalTraffic.users + realtime.total_active;
    const liveViews = totalTraffic.views + (realtime.total_active);

    // ✅ SAFE CHART SCALING
    const maxViews = dailyData.length > 0 ? Math.max(...dailyData.map(d => d.views)) : 10;

    const cards = [
        { label: "Case Studies", count: stats.insights, icon: Layers, color: "text-teal-600", bg: "bg-teal-50", path: "?tab=insights" },
        { label: "Editorial Blogs", count: stats.blogs, icon: FileText, color: "text-orange-600", bg: "bg-orange-50", path: "?tab=blogs" },
        { label: "Portfolio", count: stats.works, icon: Briefcase, color: "text-indigo-600", bg: "bg-indigo-50", path: "?tab=works" },
        { label: "Partners", count: stats.brands, icon: Users, color: "text-pink-600", bg: "bg-pink-50", path: "?tab=brands" },
    ];

    if (loading) return (
        <div className="max-w-7xl mx-auto p-4 space-y-8 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-3xl w-full"></div>
            <div className="grid grid-cols-3 gap-6">
                <div className="h-40 bg-gray-200 rounded-3xl"></div>
                <div className="h-40 bg-gray-200 rounded-3xl"></div>
                <div className="h-40 bg-gray-200 rounded-3xl"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto p-4 md:p-6 font-sans">

            {/* 1. HERO SECTION */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] text-white p-10 shadow-2xl border border-gray-800">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles size={12} /> Admin Console v2.0
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-white">
                            Welcome back, Admin
                        </h1>
                        <p className="text-slate-400 max-w-lg text-lg">
                            Real-time overview of your ecosystem performance.
                        </p>
                    </div>

                    {/* REAL TIME ACTIVE USERS CARD */}
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl min-w-[200px] shadow-lg shadow-emerald-500/20 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap size={16} className="text-white animate-pulse" fill="currentColor"/>
                            <p className="text-white/90 text-sm font-bold uppercase tracking-wide">Live Active Users</p>
                        </div>
                        <div className="text-5xl font-black text-white">{realtime.total_active}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                            <p className="text-white/70 text-xs">Updating live</p>
                        </div>
                    </div>
                </div>
                {/* Background Decor */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* 2. REAL-TIME DETAILS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Views by Page Title */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <FileText size={16} /> Top Active Pages
                    </h3>
                    <div className="space-y-4 flex-1">
                        {realtime.pages.length > 0 ? realtime.pages.map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                    <span className="truncate pr-2">{item.name}</span>
                                    <span>{item.value}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{width: getWidth(item.value, realtime.pages)}}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs">
                                <FileText size={24} className="mb-2 opacity-20"/> No active pages
                            </div>
                        )}
                    </div>
                </div>

                {/* Event Count */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <MousePointer size={16} /> Top Events
                    </h3>
                    <div className="space-y-4 flex-1">
                        {realtime.events.length > 0 ? realtime.events.map((item, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                                    <span>{item.name}</span>
                                    <span>{item.value}</span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{width: getWidth(item.value, realtime.events)}}></div>
                                </div>
                            </div>
                        )) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs">
                                <MousePointer size={24} className="mb-2 opacity-20"/> No events
                            </div>
                        )}
                    </div>
                </div>

                {/* User Sources */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <Globe size={16} /> Traffic Sources
                    </h3>
                    <div className="mb-6">
                        {realtime.sources.length > 0 ? realtime.sources.map((item, i) => (
                            <div key={i} className="flex justify-between items-center mb-2 text-xs border-b border-gray-50 pb-2 last:border-0">
                                <span className="font-medium text-gray-700">{item.name === '(direct)' ? 'Direct' : item.name}</span>
                                <span className="bg-green-50 px-2 py-0.5 rounded text-green-700 font-bold">{item.value}</span>
                            </div>
                        )) : <p className="text-xs text-gray-300 text-center mt-10">No source data</p>}
                    </div>
                </div>
            </div>

            {/* 3. STATS GRID (CMS) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, idx) => (
                    <button
                        key={idx}
                        onClick={() => navigate(card.path)}
                        className="group relative flex flex-col justify-between p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                    >
                        <div className="flex justify-between items-start w-full mb-4">
                            <div className={`p-3.5 rounded-2xl ${card.bg} ${card.color}`}>
                                <card.icon size={24} />
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                        <div>
                            <span className="text-3xl font-black text-gray-800 tracking-tight">{card.count}</span>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-wide mt-1">{card.label}</p>
                        </div>
                    </button>
                ))}
            </div>

            {/* 4. ANALYTICS CHART & SUMMARY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graph (Fixed: Layout & Colors) */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <BarChart3 className="text-gray-400" size={20}/> Page Views
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">Daily views (Last 30 days)</p>
                        </div>
                        {analyticsError ? (
                            <span className="text-red-500 text-xs font-bold">Offline</span>
                        ) : (
                            <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                                <Activity size={14}/> 30 Day History
                            </span>
                        )}
                    </div>
                    {/* CSS Bar Chart */}
                    <div className="flex items-end justify-between gap-1 h-56 w-full px-2">
                        {dailyData.length > 0 ? (
                            dailyData.map((day, i) => {
                                // ✅ FIX: Min Height 10% to ensure visibility
                                const heightPercent = Math.max((day.views / maxViews) * 100, 10);
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                                        {/* Tooltip */}
                                        <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap z-20 pointer-events-none mb-2">
                                            <span className="font-bold">{day.views}</span> Views
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                        </div>

                                        {/* Bar (Updated to Indigo-500) */}
                                        <div
                                            className="w-full rounded-t-sm bg-indigo-500 group-hover:bg-indigo-600 transition-all duration-300 relative"
                                            style={{ height: `${heightPercent}%` }}
                                        ></div>

                                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider hidden md:block">
                                            {i % 4 === 0 ? day.displayDate.split(' ')[1] : ''}
                                        </span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-sm">No historical data available</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 30-Day Totals Summary (Live) */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Live Performance</h3>
                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-slate-500">
                                    <Users size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Visitors</span>
                                </div>
                                {/* Using liveVisitors for Real-Time Updates */}
                                <div className="text-3xl font-black text-slate-800">{liveVisitors.toLocaleString()}</div>
                                <p className="text-[10px] text-slate-400 mt-1">Unique users + Active Now</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center gap-3 mb-2 text-slate-500">
                                    <Eye size={16} />
                                    <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
                                </div>
                                {/* Using liveViews for Real-Time Updates */}
                                <div className="text-3xl font-black text-slate-800">{liveViews.toLocaleString()}</div>
                                <p className="text-[10px] text-slate-400 mt-1">All pages viewed + Active Now</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. PAGE PERFORMANCE TABLE */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mt-8">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Page Performance Details</h3>
                    <p className="text-xs text-gray-500">Breakdown by Views, Unique Users, and Engagement Time</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4 pl-6">Page Title</th>
                            <th className="p-4 text-right">Views</th>
                            <th className="p-4 text-right">Users</th>
                            <th className="p-4 text-right pr-6">Avg. Time</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {pageStats.length > 0 ? pageStats.map((p, i) => (
                            <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                <td className="p-4 pl-6 font-medium text-gray-700 truncate max-w-xs" title={p.title}>{p.title}</td>
                                <td className="p-4 text-right font-bold text-blue-600">{p.views}</td>
                                <td className="p-4 text-right text-gray-600">{p.users}</td>
                                <td className="p-4 text-right text-gray-400 pr-6 flex justify-end items-center gap-1">
                                    <Clock size={12}/> {p.users > 0 ? Math.round(p.time / p.users) : 0}s
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan={4} className="p-6 text-center text-gray-400">No page data available</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default DashboardHome;