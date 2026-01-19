import { useState } from "react";
import {
  Shield,
  FileText,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Calendar,
  Clock,
  Eye,
  Trash2,
  MoreVertical,
  ChevronDown,
  TrendingUp,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";

type RiskLevel = "Low" | "Medium" | "High";
type ViewMode = "table" | "grid";

interface FileRecord {
  id: string;
  name: string;
  type: string;
  size: string;
  risk: RiskLevel;
  metadataCount: number;
  date: string;
  time: string;
  status: "Cleaned" | "Failed" | "Pending";
}

const mockHistoryData: FileRecord[] = [
  { id: "1", name: "contract_2024.pdf", type: "PDF", size: "2.4 MB", risk: "Medium", metadataCount: 18, date: "Jan 13, 2026", time: "2:30 PM", status: "Cleaned" },
  { id: "2", name: "vacation_photo.jpg", type: "JPG", size: "4.1 MB", risk: "High", metadataCount: 24, date: "Jan 13, 2026", time: "1:15 PM", status: "Cleaned" },
  { id: "3", name: "presentation.pptx", type: "PPTX", size: "8.7 MB", risk: "Low", metadataCount: 8, date: "Jan 12, 2026", time: "5:45 PM", status: "Cleaned" },
  { id: "4", name: "resume.docx", type: "DOCX", size: "156 KB", risk: "Medium", metadataCount: 15, date: "Jan 12, 2026", time: "3:20 PM", status: "Cleaned" },
  { id: "5", name: "project_plan.pdf", type: "PDF", size: "1.8 MB", risk: "Low", metadataCount: 6, date: "Jan 11, 2026", time: "11:30 AM", status: "Cleaned" },
  { id: "6", name: "financial_report.xlsx", type: "XLSX", size: "3.2 MB", risk: "High", metadataCount: 32, date: "Jan 11, 2026", time: "9:00 AM", status: "Cleaned" },
  { id: "7", name: "company_logo.png", type: "PNG", size: "512 KB", risk: "Low", metadataCount: 4, date: "Jan 10, 2026", time: "4:15 PM", status: "Cleaned" },
  { id: "8", name: "meeting_notes.docx", type: "DOCX", size: "89 KB", risk: "Medium", metadataCount: 12, date: "Jan 10, 2026", time: "2:00 PM", status: "Cleaned" },
];

export function HistoryPage({
  onBack,
  onViewFile,
  user,
}: {
  onBack?: () => void;
  onViewFile?: (fileId: string) => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | "All">("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "High": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cleaned": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Failed": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Pending": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      default: return "text-zinc-400 bg-zinc-500/10 border-zinc-500/30";
    }
  };

  // Filter data
  const filteredData = mockHistoryData.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === "All" || file.risk === selectedRisk;
    const matchesType = selectedType === "All" || file.type === selectedType;
    return matchesSearch && matchesRisk && matchesType;
  });

  const fileTypes = ["All", ...Array.from(new Set(mockHistoryData.map((f) => f.type)))];

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredData.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredData.map((f) => f.id));
    }
  };

  // Stats
  const totalFiles = mockHistoryData.length;
  const highRiskFiles = mockHistoryData.filter((f) => f.risk === "High").length;
  const totalMetadataRemoved = mockHistoryData.reduce((sum, f) => sum + f.metadataCount, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentPage="history"
        onNavigate={(page) => {
          if (page === "dashboard" || page === "upload" || page === "settings") {
            onBack?.();
          }
        }}
        onLogout={() => console.log("Logout")}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-white">Analysis History</h1>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                {totalFiles} Files
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
                JD
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl">
                    <FileText className="size-6 text-cyan-400" />
                  </div>
                  <TrendingUp className="size-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{totalFiles}</p>
                  <p className="text-sm text-zinc-400 mt-1">Total Files Analyzed</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <AlertTriangle className="size-6 text-red-400" />
                  </div>
                  <Badge className="text-red-400 bg-red-500/10 border-red-500/30">
                    {highRiskFiles}
                  </Badge>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{highRiskFiles}</p>
                  <p className="text-sm text-zinc-400 mt-1">High Risk Files</p>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Shield className="size-6 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold text-white">{totalMetadataRemoved}</p>
                  <p className="text-sm text-zinc-400 mt-1">Metadata Fields Removed</p>
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search files by name..."
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Filter Toggle */}
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                >
                  <Filter className="size-4 mr-2" />
                  Filters
                  <ChevronDown
                    className={`size-4 ml-2 transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Filter Options */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap gap-4 animate-in slide-in-from-top-2 duration-200">
                  {/* Risk Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm text-zinc-400 mb-2 block">Risk Level</label>
                    <select
                      value={selectedRisk}
                      onChange={(e) => setSelectedRisk(e.target.value as RiskLevel | "All")}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      <option value="All">All Risks</option>
                      <option value="High">High Risk</option>
                      <option value="Medium">Medium Risk</option>
                      <option value="Low">Low Risk</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm text-zinc-400 mb-2 block">File Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    >
                      {fileTypes.map((type) => (
                        <option key={type} value={type}>
                          {type === "All" ? "All Types" : type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Range (Placeholder) */}
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-sm text-zinc-400 mb-2 block">Date Range</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-zinc-500" />
                      <span className="text-sm text-zinc-500">Last 30 days</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Bulk Actions */}
            {selectedFiles.length > 0 && (
              <Card className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                      {selectedFiles.length} selected
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                      onClick={() => setSelectedFiles([])}
                    >
                      Clear Selection
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                    >
                      <Download className="size-4 mr-2" />
                      Export Selected
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Files Table */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">File History</h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Showing {filteredData.length} of {totalFiles} files
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                  >
                    <Download className="size-4 mr-2" />
                    Export All
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="px-6 py-3">
                        <input
                          type="checkbox"
                          checked={selectedFiles.length === filteredData.length && filteredData.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">File Name</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Type</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Size</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Risk</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Metadata</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Date & Time</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Status</th>
                      <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((file) => (
                      <tr
                        key={file.id}
                        className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.includes(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-cyan-400 flex-shrink-0" />
                            <span className="text-sm font-medium text-white truncate max-w-[200px]">
                              {file.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                            {file.type}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">{file.size}</td>
                        <td className="px-6 py-4">
                          <Badge className={`${getRiskColor(file.risk)} border text-xs`}>
                            {file.risk}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-400">
                          {file.metadataCount} fields
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-white">{file.date}</span>
                            <span className="text-xs text-zinc-500">{file.time}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={`${getStatusColor(file.status)} border text-xs`}>
                            {file.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onViewFile?.(file.id)}
                              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-cyan-400"
                              title="View Details"
                            >
                              <Eye className="size-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-emerald-400"
                              title="Download"
                            >
                              <Download className="size-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-red-400"
                              title="More options"
                            >
                              <MoreVertical className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredData.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="size-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-400">No files found matching your filters</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedRisk("All");
                      setSelectedType("All");
                    }}
                    variant="outline"
                    className="mt-4 border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredData.length > 0 && (
                <div className="p-4 border-t border-zinc-800 flex items-center justify-between">
                  <p className="text-sm text-zinc-500">
                    Showing {filteredData.length} of {totalFiles} files
                  </p>
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
              )}
            </Card>

            {/* Security Note */}
            <Card className="bg-zinc-900/30 border-zinc-800 p-4">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Shield className="size-4 text-cyan-400" />
                <span>
                  History records metadata only • Original files are not stored • Analysis data retained for 90 days
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
