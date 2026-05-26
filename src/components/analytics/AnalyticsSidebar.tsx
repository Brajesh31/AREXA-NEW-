import { useState } from "react";
import {
    ChevronDown, ChevronRight, LayoutDashboard, Zap,
    Activity, Users, Target, Smartphone,
    PieChart, BarChart2, Globe, FileText, MousePointerClick,
    Radar, Magnet, BookOpen, Fingerprint
} from "lucide-react";

interface SidebarProps {
    activeView: string;
    onChangeView: (view: string) => void;
}

const AnalyticsSidebar = ({ activeView, onChangeView }: SidebarProps) => {
    // Toggles for collapsible sections
    // Default: Open everything so you can see all options immediately
    const [sections, setSections] = useState({
        mission_control: true, // YOUR CURRENT MODULES
        lifecycle: true,       // NEW GA4 MODULES
        user: true             // NEW GA4 MODULES
    });

    const toggle = (key: keyof typeof sections) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper for Menu Items
    const MenuItem = ({ id, label, icon: Icon, active, indent = false }: any) => (
        <button
            onClick={() => onChangeView(id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-[13px] font-medium transition-colors rounded-md mb-0.5
                ${active
                ? "text-blue-600 bg-blue-50/80 border-r-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
            } ${indent ? "pl-9" : ""}`}
        >
            {Icon && <Icon size={16} className={active ? "text-blue-600" : "text-gray-400"} />}
            <span className="truncate">{label}</span>
        </button>
    );

    // Helper for Section Headers
    const SectionHeader = ({ label, id, icon: Icon }: any) => (
        <button
            onClick={() => toggle(id)}
            className="w-full flex items-center justify-between px-3 py-2 mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider hover:text-gray-700 transition-colors"
        >
            <div className="flex items-center gap-2">
                {Icon && <Icon size={14} />}
                {label}
            </div>
            {sections[id as keyof typeof sections] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
    );

    return (
        <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200 h-full overflow-y-auto py-4 px-3 custom-scrollbar">

            {/* --- 1. REPORTS SNAPSHOT (Top Level) --- */}
            <div className="mb-2">
                <MenuItem
                    id="reports_snapshot"
                    label="Reports snapshot"
                    icon={LayoutDashboard}
                    active={activeView === 'reports_snapshot'}
                />
                <MenuItem
                    id="realtime"
                    label="Realtime"
                    icon={Zap}
                    active={activeView === 'realtime'}
                />
            </div>

            <div className="h-px bg-gray-100 my-2" />

            {/* --- 2. MISSION CONTROL (YOUR CURRENT MODULES) --- */}
            <SectionHeader label="Mission Control" id="mission_control" icon={Target} />
            {sections.mission_control && (
                <div className="space-y-0.5">
                    {/* The 8 Specific Modules you requested */}
                    <MenuItem id="overview" label="Nexus Overview" icon={LayoutDashboard} active={activeView === 'overview'} indent />
                    <MenuItem id="advanced" label="True Analytics" icon={Radar} active={activeView === 'advanced'} indent />
                    <MenuItem id="conversion" label="Conversion Lab" icon={Magnet} active={activeView === 'conversion'} indent />
                    <MenuItem id="behavior" label="Behavior Intel" icon={MousePointerClick} active={activeView === 'behavior'} indent />
                    <MenuItem id="geo" label="Geo Atlas" icon={Globe} active={activeView === 'geo'} indent />
                    <MenuItem id="traffic" label="Traffic Flow" icon={Activity} active={activeView === 'traffic'} indent />
                    <MenuItem id="content" label="Content ROI" icon={FileText} active={activeView === 'content'} indent />
                    <MenuItem id="users" label="User Ledger" icon={Fingerprint} active={activeView === 'users'} indent />
                </div>
            )}

            <div className="h-px bg-gray-100 my-2" />

            {/* --- 3. LIFE CYCLE (NEW GA4 MODULES) --- */}
            <SectionHeader label="Life cycle" id="lifecycle" icon={Activity} />
            {sections.lifecycle && (
                <div className="space-y-4 mt-2">
                    {/* Acquisition */}
                    <div>
                        <div className="px-9 text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span> Acquisition
                        </div>
                        <MenuItem id="acq_overview" label="Overview" indent active={activeView === 'acq_overview'} />
                        <MenuItem id="acq_user" label="User acquisition" indent active={activeView === 'acq_user'} />
                        <MenuItem id="acq_traffic" label="Traffic acquisition" indent active={activeView === 'acq_traffic'} />
                    </div>

                    {/* Engagement */}
                    <div>
                        <div className="px-9 text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span> Engagement
                        </div>
                        <MenuItem id="eng_overview" label="Overview" indent active={activeView === 'eng_overview'} />
                        <MenuItem id="eng_events" label="Events" indent active={activeView === 'eng_events'} />
                        <MenuItem id="eng_pages" label="Pages and screens" indent active={activeView === 'eng_pages'} />
                    </div>

                    {/* Monetization */}
                    <div>
                        <div className="px-9 text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span> Monetization
                        </div>
                        <MenuItem id="mon_overview" label="Overview" indent active={activeView === 'mon_overview'} />
                        <MenuItem id="mon_purchases" label="Ecommerce purchases" indent active={activeView === 'mon_purchases'} />
                    </div>
                </div>
            )}

            <div className="h-px bg-gray-100 my-2" />

            {/* --- 4. USER (NEW GA4 MODULES) --- */}
            <SectionHeader label="User" id="user" icon={Users} />
            {sections.user && (
                <div className="space-y-4 mt-2">
                    {/* User Attributes */}
                    <div>
                        <div className="px-9 text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span> User attributes
                        </div>
                        <MenuItem id="user_overview" label="Overview" indent active={activeView === 'user_overview'} />
                        <MenuItem id="user_demographics" label="Demographic details" indent active={activeView === 'user_demographics'} />
                        <MenuItem id="user_audiences" label="Audiences" indent active={activeView === 'user_audiences'} />
                    </div>

                    {/* Tech */}
                    <div>
                        <div className="px-9 text-[11px] font-semibold text-gray-400 mb-1 flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span> Tech
                        </div>
                        <MenuItem id="tech_overview" label="Overview" indent active={activeView === 'tech_overview'} />
                        <MenuItem id="tech_details" label="Tech details" indent active={activeView === 'tech_details'} />
                    </div>
                </div>
            )}

        </div>
    );
};

export default AnalyticsSidebar;