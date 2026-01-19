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
import api from "../services/api";

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
  onSettings
}: {
  user: {
    name?: string;
    email?: string;
  } | null;
  onUpload?: () => void;
  onLogout?: () => void;
  onHistory?: () => void;
  onSettings?: () => void;
}) {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserFileHistory | null>(null);

  const handleNavigation = (page: string) => {
    switch (page) {
      case "dashboard":
        // Already on dashboard
        break;
      case "upload":
        onUpload?.();
        break;
      case "history":
        onHistory?.();
        break;
      case "settings":
        onSettings?.();
        break;
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "High": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/files/user/history/");
        const files = response.data.files;
        
        // Calculate stats from user's files
        const filesAnalyzed = files.length;
        const metadataRemoved = files.reduce((sum: number, file: any) => {
          return sum + Object.keys(file.metadata_removed || {}).length;
        }, 0);
        const highRiskFiles = files.filter((file: any) => file.risk_level === "High").length;
        
        // Transform files for dashboard display
        const recentFiles: FileRecord[] = files.map((file: any) => ({
          id: file.id,
          name: file.file_name,
          type: file.file_type,
          risk: file.risk_level as RiskLevel,
          metadataCount: Object.keys(file.metadata_raw || {}).length,
          date: new Date(file.scanned_at).toISOString().split('T')[0],
        }));
        
        // Generate chart data from recent files
        const chartData = [];
        const dates = [...new Set(files.map((file: any) => new Date(file.scanned_at).toISOString().split('T')[0]))];
        dates.sort().slice(-5).forEach(date => {
          const dayFiles = files.filter((file: any) => new Date(file.scanned_at).toISOString().split('T')[0] === date);
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
    <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="size-6 text-white" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-zinc-400">{label}</p>
        <p className="text-xs text-zinc-600">{subtitle}</p>
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar
        user={user}                // 🔥 THIS WAS MISSING
        currentPage="dashboard"
        onNavigate={handleNavigation}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center justify-between px-8 py-4">
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
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
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
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* System Alert */}
            {showAlert && (
              <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="size-5 text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-400">
                        You are nearing your daily limit
                      </p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {stats.creditsRemaining} credits remaining out of {stats.creditsTotal}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowAlert(false)} className="text-zinc-500 hover:text-zinc-400">
                    <X className="size-4" />
                  </button>
                </div>
              </Card>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FileText}
                label="Files Analyzed"
                value={isLoading ? "..." : stats.filesAnalyzed}
                subtitle="Total processed files"
                color="from-cyan-500/20 to-blue-500/20"
              />
              <StatCard
                icon={Shield}
                label="Metadata Removed"
                value={isLoading ? "..." : `${stats.metadataRemoved} fields`}
                subtitle="Privacy protection active"
                color="from-emerald-500/20 to-teal-500/20"
              />
              <StatCard
                icon={AlertTriangle}
                label="High-Risk Files"
                value={isLoading ? "..." : stats.highRiskFiles}
                subtitle="Requiring attention"
                color="from-red-500/20 to-orange-500/20"
              />
              <StatCard
                icon={CreditCard}
                label="Credits Remaining"
                value={isLoading ? "..." : `${stats.creditsRemaining} / ${stats.creditsTotal}`}
                subtitle="This billing cycle"
                color="from-purple-500/20 to-pink-500/20"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Risk Activity Chart */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Risk Activity</h3>
                    <p className="text-sm text-zinc-500 mt-1">Last 5 days analysis</p>
                  </div>
                  <TrendingUp className="size-5 text-cyan-400" />
                </div>

                <div className="space-y-4">
                  {chartData.map((data, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{data.date}</span>
                        <span>{data.low + data.medium + data.high} files</span>
                      </div>
                      <div className="flex h-8 gap-1 rounded-lg overflow-hidden">
                        <div
                          className="bg-emerald-500/80 hover:bg-emerald-500 transition-colors"
                          style={{ width: `${(data.low / 25) * 100}%` }}
                          title={`Low: ${data.low}`}
                        ></div>
                        <div
                          className="bg-yellow-500/80 hover:bg-yellow-500 transition-colors"
                          style={{ width: `${(data.medium / 25) * 100}%` }}
                          title={`Medium: ${data.medium}`}
                        ></div>
                        <div
                          className="bg-red-500/80 hover:bg-red-500 transition-colors"
                          style={{ width: `${(data.high / 25) * 100}%` }}
                          title={`High: ${data.high}`}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 mt-6 pt-6 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
                    <span className="text-xs text-zinc-400">Low Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
                    <span className="text-xs text-zinc-400">Medium Risk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <span className="text-xs text-zinc-400">High Risk</span>
                  </div>
                </div>
              </Card>

              {/* Quick Upload Card */}
              <Card className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-6">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30">
                    <Upload className="size-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">Quick Upload</h3>
                    <p className="text-sm text-zinc-400">
                      Analyze a new file for metadata risks
                    </p>
                  </div>
                  <Button
                    onClick={onUpload}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                  >
                    Analyze File
                  </Button>
                  <p className="text-xs text-zinc-600">
                    Files are processed securely and not stored.
                  </p>
                </div>
              </Card>
            </div>

            {/* Recent File Analysis Table */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white">Recent Activity</h3>
                <p className="text-sm text-zinc-400 mt-1">Your latest processed files (history only - files not stored)</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">File Name</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Risk Level</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Metadata</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Date</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentFiles.map((file) => (
                      <tr
                        key={file.id}
                        className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-cyan-400" />
                            <span className="text-sm font-medium text-white">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700">
                            {file.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`${getRiskColor(file.risk)} border text-xs`}>
                            {file.risk}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {file.metadataCount} fields
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-500">{file.date}</td>
                        <td className="px-6 py-4">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 border text-xs">
                            Cleaned
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
                <p className="text-sm text-zinc-500">Showing 5 of {stats.filesAnalyzed} files</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </Card>

            {/* Data Security Note */}
            <Card className="bg-zinc-900/30 border-zinc-800 p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Shield className="size-4 text-cyan-400" />
                <span>Data fetched securely • Files processed on demand • No permanent storage</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}