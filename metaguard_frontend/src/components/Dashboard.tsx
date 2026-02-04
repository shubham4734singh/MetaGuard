import { useState, useEffect } from "react";
import {
  Shield,
  FileText,
  AlertTriangle,
  CreditCard,
  Upload,
  Bell,
  ChevronDown,
  TrendingUp,
  X,
  Settings as SettingsIcon,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";
import { historyApi, type FileHistory } from "../services/api";


type RiskLevel = "Low" | "Medium" | "High";

interface FileRecord {
  id: string;
  name: string;
  type: string;
  risk: RiskLevel;
  metadataCount: number;
  date: string;
}

interface UserFileHistory {
  filesAnalyzed: number;
  metadataRemoved: number;
  highRiskFiles: number;
  creditsRemaining: number;
  creditsTotal: number;
  recentFiles: FileRecord[];
  chartData: Array<{
    date: string;
    low: number;
    medium: number;
    high: number;
  }>;
}


export function Dashboard({
  user,
  onUpload,
  onLogout,
  onHistory,
  onSettings,
  onPolicies
}: {
  user: {
    name?: string;
    email?: string;
  } | null;
  onUpload?: () => void;
  onLogout?: () => void;
  onHistory?: () => void;
  onSettings?: () => void;
  onPolicies?: () => void;
}) {

  const SIDEBAR_WIDTH = "1rem";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserFileHistory | null>(null);


  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "High": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const normalizeRiskLevel = (level?: string | null): RiskLevel => {
    const map: Record<string, RiskLevel> = {
      Critical: "High",
      Minimal: "Low",
      None: "Low",
    };
    return (map[level as keyof typeof map] || level || "Low") as RiskLevel;
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await historyApi.getAll();
        const data = response.data;

        const files: FileHistory[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.results)
            ? (data as any).results
            : [];

        // Sort newest first to guarantee we show the latest uploads
        const sortedFiles = [...files].sort((a, b) => {
          const aDate = new Date(a.created_at ?? a.date ?? 0).getTime();
          const bDate = new Date(b.created_at ?? b.date ?? 0).getTime();
          return bDate - aDate;
        });
        
        // Calculate stats from user's files
        const filesAnalyzed = sortedFiles.length;
        const metadataRemoved = sortedFiles.reduce((sum: number, file: any) => {
          return sum + (file.metadata_count || 0);
        }, 0);
        const highRiskFiles = sortedFiles.filter((file: any) => file.risk_level === "High").length;
        
        // Transform files for dashboard display
        const recentFiles: FileRecord[] = sortedFiles.slice(0, 5).map((file: any) => ({
          id: file.id.toString(),
          name: file.file_name,
          type: file.file_type,
          risk: normalizeRiskLevel(file.risk_level),
          metadataCount: file.metadata_count || 0,
          date: file.date,
        }));
        
        // Generate chart data from recent files
        const chartData: { date: string; low: number; medium: number; high: number }[] = [];
        const dates = [...new Set(sortedFiles.map((file: any) => file.date))] as string[];
        dates.sort().slice(-5).forEach((date: string) => {
          const dayFiles = sortedFiles.filter((file: any) => file.date === date);
          const low = dayFiles.filter((file: any) => file.risk_level === "Low").length;
          const medium = dayFiles.filter((file: any) => file.risk_level === "Medium").length;
          const high = dayFiles.filter((file: any) => file.risk_level === "High").length;
          chartData.push({ date, low, medium, high });
        });
        
        setUserData({
          filesAnalyzed,
          metadataRemoved,
          highRiskFiles,
          creditsRemaining: 72, // Mock data for credits
          creditsTotal: 100,
          recentFiles,
          chartData,
        });
        
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtitle,
    color
  }: {
    icon: any;
    label: string;
    value: string | number;
    subtitle: string;
    color: string;
  }) => (
    <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6 hover:border-zinc-700 hover:shadow-lg hover:shadow-zinc-900/20 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-white leading-none tracking-tight">{value}</p>
        <p className="text-sm font-semibold text-zinc-200 leading-tight">{label}</p>
        <p className="text-xs text-zinc-400 leading-relaxed">{subtitle}</p>
      </div>
    </Card>
  );

  const stats = userData || {
    filesAnalyzed: 0,
    metadataRemoved: 0,
    highRiskFiles: 0,
    creditsRemaining: 0,
    creditsTotal: 0,
  };

  const recentFiles = userData?.recentFiles || [];
  const chartData = userData?.chartData || [];

  // Calculate risk counts from recent files
  const riskCounts = {
    high: recentFiles.filter(f => f.risk === "High").length,
    medium: recentFiles.filter(f => f.risk === "Medium").length,
    low: recentFiles.filter(f => f.risk === "Low").length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">


      {/* Main Content Area */}
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* Top Navigation Bar */}
<div className="sticky top-0 z-40 bg-black">
<div
  className="flex items-center justify-between py-3 px-6"
  style={{ paddingLeft: `calc(${SIDEBAR_WIDTH} + 1rem)` }}
>

            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">MetaGuard</span> Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                <Bell className="size-5 text-zinc-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {(user?.name || user?.email || "U")[0].toUpperCase()}
                  </div>
                  <ChevronDown className="size-4 text-zinc-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-2 z-50">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSettings?.();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <SettingsIcon className="size-4" />
                      Settings
                    </button>
                    <div className="border-t border-zinc-800 my-2"></div>
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800 flex items-center gap-2"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6 pb-8">
            
            {/* Stats Overview - 3 Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <StatCard
                icon={FileText}
                label="Files Processed"
                value={isLoading ? "..." : stats.filesAnalyzed}
                subtitle="Total files cleaned"
                color="from-cyan-500/20 to-blue-500/20"
              />
              <StatCard
                icon={AlertTriangle}
                label="High-Risk Files"
                value={isLoading ? "..." : stats.highRiskFiles}
                subtitle="Risk score > 70"
                color="from-red-500/20 to-orange-500/20"
              />
              <StatCard
                icon={FileText}
                label="Audit Records"
                value={isLoading ? "..." : stats.filesAnalyzed}
                subtitle="Files with hash + audit"
                color="from-cyan-500/20 to-teal-500/20"
              />
            </div>

            {/* Metadata Risk Overview Section */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6 hover:border-zinc-700 transition-all duration-300">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-white mb-1">Metadata Risk Overview</h3>
                <p className="text-sm text-zinc-500">What kind of risk exists?</p>
              </div>

              {/* Risk Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* High Risk */}
                <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">High Risk</p>
                      <p className="text-4xl font-bold text-red-400">{riskCounts.high}</p>
                    </div>
                    <AlertTriangle className="size-6 text-red-500/60" />
                  </div>
                  <p className="text-xs text-zinc-500">GPS, Device ID, Author info</p>
                </div>

                {/* Medium Risk */}
                <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-2xl p-6 hover:border-yellow-500/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Medium Risk</p>
                      <p className="text-4xl font-bold text-yellow-400">{riskCounts.medium}</p>
                    </div>
                    <AlertTriangle className="size-6 text-yellow-500/60" />
                  </div>
                  <p className="text-xs text-zinc-500">Timestamps, Software info</p>
                </div>

                {/* Low Risk */}
                <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Low Risk</p>
                      <p className="text-4xl font-bold text-emerald-400">{riskCounts.low}</p>
                    </div>
                    <Shield className="size-6 text-emerald-500/60" />
                  </div>
                  <p className="text-xs text-zinc-500">File format, Size</p>
                </div>
              </div>

              {/* Risk Distribution Bar */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-zinc-300">Risk Distribution</p>
                <div className="flex h-2 gap-1 rounded-full overflow-hidden bg-zinc-800/50">
                  <div
                    className="bg-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/40"
                    style={{ width: `${(riskCounts.low / (riskCounts.low + riskCounts.medium + riskCounts.high)) * 100 || 0}%` }}
                  ></div>
                  <div
                    className="bg-yellow-500 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/40"
                    style={{ width: `${(riskCounts.medium / (riskCounts.low + riskCounts.medium + riskCounts.high)) * 100 || 0}%` }}
                  ></div>
                  <div
                    className="bg-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/40"
                    style={{ width: `${(riskCounts.high / (riskCounts.low + riskCounts.medium + riskCounts.high)) * 100 || 0}%` }}
                  ></div>
                </div>
                <div className="flex gap-6 text-xs">
                  <span className="text-emerald-400">Low: {riskCounts.low}</span>
                  <span className="text-yellow-400">Medium: {riskCounts.medium}</span>
                  <span className="text-red-400">High: {riskCounts.high}</span>
                </div>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden hover:border-zinc-700 transition-all duration-300">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-1">Recent Activity</h3>
                <p className="text-sm text-zinc-400">Your latest processed files (history only - files not stored)</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">File Name</th>
                      <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Type</th>
                      <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Risk Level</th>
                      <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Metadata</th>
                      <th className="text-left text-sm font-semibold text-zinc-300 px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFiles.slice(0, 5).map((file) => (
                      <tr
                        key={file.id}
                        className="border-t border-zinc-800 hover:bg-zinc-900/50 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-cyan-500/10 rounded-lg">
                              <FileText className="size-4 text-cyan-400" />
                            </div>
                            <span className="text-sm font-medium text-white truncate">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-zinc-800/80 text-zinc-300 border-zinc-700">
                            {file.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`${getRiskColor(file.risk)} border text-xs font-medium`}>
                            {file.risk}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {file.metadataCount} fields
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{file.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}