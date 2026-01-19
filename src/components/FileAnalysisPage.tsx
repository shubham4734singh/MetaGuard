import { useState } from "react";
import {
  Shield,
  FileText,
  Download,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Clock,
  HardDrive,
  Filter,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

type RiskLevel = "Low" | "Medium" | "High";
type CleanupState = "available" | "processing" | "completed";

interface MetadataItem {
  category: string;
  field: string;
  value: string;
  risk: RiskLevel;
  impact: string;
}

const mockFileData = {
  id: "file_2024_001",
  name: "vacation_photo.jpg",
  type: "JPEG Image",
  uploadDate: "2024-01-12 14:32:45",
  size: "4.2 MB",
  overallRisk: "High" as RiskLevel,
  timeline: [
    { step: "Uploaded", status: "completed", time: "14:32:45" },
    { step: "Metadata extracted", status: "completed", time: "14:32:47" },
    { step: "Risk calculated", status: "completed", time: "14:32:48" },
    { step: "Cleanup available", status: "ready", time: "14:32:49" },
  ],
  summary: {
    totalFields: 24,
    highRiskFields: 6,
    personalIdentifiers: 3,
    locationData: true,
  },
  metadata: [
    {
      category: "Location",
      field: "GPS Coordinates",
      value: "37.7749° N, 122.4194° W",
      risk: "High" as RiskLevel,
      impact: "Reveals exact location where photo was taken",
    },
    {
      category: "Location",
      field: "GPS Altitude",
      value: "52 meters",
      risk: "High" as RiskLevel,
      impact: "Additional location precision",
    },
    {
      category: "Personal",
      field: "Camera Owner Name",
      value: "John Doe",
      risk: "High" as RiskLevel,
      impact: "Identity exposure",
    },
    {
      category: "Device",
      field: "Camera Model",
      value: "Canon EOS 5D Mark IV",
      risk: "Medium" as RiskLevel,
      impact: "Device identification",
    },
    {
      category: "Device",
      field: "Camera Serial Number",
      value: "123456789012",
      risk: "High" as RiskLevel,
      impact: "Unique device tracking",
    },
    {
      category: "Software",
      field: "Editing Software",
      value: "Adobe Photoshop CC 2023",
      risk: "Low" as RiskLevel,
      impact: "Software usage disclosure",
    },
    {
      category: "Personal",
      field: "Copyright",
      value: "© 2024 John Doe",
      risk: "Medium" as RiskLevel,
      impact: "Ownership information",
    },
    {
      category: "Device",
      field: "Lens Model",
      value: "EF 24-70mm f/2.8L II USM",
      risk: "Low" as RiskLevel,
      impact: "Equipment details",
    },
    {
      category: "Software",
      field: "Color Space",
      value: "sRGB",
      risk: "Low" as RiskLevel,
      impact: "Technical configuration",
    },
    {
      category: "Personal",
      field: "Artist",
      value: "John Doe Photography",
      risk: "Medium" as RiskLevel,
      impact: "Professional identity",
    },
    {
      category: "Location",
      field: "Location Description",
      value: "San Francisco, CA",
      risk: "High" as RiskLevel,
      impact: "Geographic location",
    },
    {
      category: "Device",
      field: "Orientation",
      value: "Horizontal (normal)",
      risk: "Low" as RiskLevel,
      impact: "Image orientation",
    },
  ] as MetadataItem[],
};

export function FileAnalysisPage({
  fileId,
  onBack,
}: {
  fileId?: string;
  onBack?: () => void;
}) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [cleanupState, setCleanupState] = useState<CleanupState>("available");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"risk" | "category">("risk");

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const categories = [
    "All",
    "Personal",
    "Location",
    "Device",
    "Software",
  ];

  const filteredMetadata =
    filterCategory === "All"
      ? mockFileData.metadata
      : mockFileData.metadata.filter(
          (item) => item.category === filterCategory
        );

  const sortedMetadata = [...filteredMetadata].sort((a, b) => {
    if (sortBy === "risk") {
      const riskOrder = { High: 0, Medium: 1, Low: 2 };
      return riskOrder[a.risk] - riskOrder[b.risk];
    }
    return a.category.localeCompare(b.category);
  });

  const handleCleanup = () => {
    setCleanupState("processing");
    setTimeout(() => {
      setCleanupState("completed");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Top Navigation Bar - Simplified */}
      <div className="sticky top-0 z-50 bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="text-sm">Back to Dashboard</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="size-5 text-cyan-400" />
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              MetaGuard
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
          <button
            onClick={onBack}
            className="hover:text-cyan-400 transition-colors"
          >
            Dashboard
          </button>
          <ChevronRight className="size-4" />
          <span className="text-white">File Analysis</span>
        </div>

        <div className="space-y-6">
          {/* File Header */}
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                  <FileText className="size-8 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">
                    {mockFileData.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <FileText className="size-4" />
                      {mockFileData.type}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HardDrive className="size-4" />
                      {mockFileData.size}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {mockFileData.uploadDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <Badge
                  className={`${getRiskColor(mockFileData.overallRisk)} border text-base px-4 py-2`}
                >
                  {mockFileData.overallRisk} Risk
                </Badge>
                <p className="text-xs text-zinc-500">
                  Based on detected metadata exposure
                </p>
              </div>
            </div>
          </Card>

          {/* Analysis Status Timeline */}
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Analysis Timeline
            </h3>
            <div className="flex items-center justify-between">
              {mockFileData.timeline.map((step, index) => (
                <div key={index} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === "completed"
                          ? "bg-emerald-500/20 border-2 border-emerald-500"
                          : step.status === "ready"
                          ? "bg-cyan-500/20 border-2 border-cyan-500"
                          : "bg-zinc-800 border-2 border-zinc-700"
                      }`}
                    >
                      {step.status === "completed" && (
                        <CheckCircle2 className="size-5 text-emerald-400" />
                      )}
                      {step.status === "ready" && (
                        <Clock className="size-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">
                        {step.step}
                      </p>
                      <p className="text-xs text-zinc-500">{step.time}</p>
                    </div>
                  </div>
                  {index < mockFileData.timeline.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Metadata Overview Summary */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">
                  {mockFileData.summary.totalFields}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Total Fields</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">
                  {mockFileData.summary.highRiskFields}
                </p>
                <p className="text-sm text-zinc-400 mt-1">High-Risk Fields</p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400">
                  {mockFileData.summary.personalIdentifiers}
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  Personal Identifiers
                </p>
              </div>
            </Card>
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-400">
                  {mockFileData.summary.locationData ? "Yes" : "No"}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Location Data</p>
              </div>
            </Card>
          </div>

          {/* Category Filters & Sort */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterCategory === cat
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                      : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-400 hover:border-zinc-700"
              >
                <Filter className="size-4" />
                Sort: {sortBy === "risk" ? "Risk" : "Category"}
                <ChevronDown className="size-4" />
              </button>
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl py-2 z-10">
                  <button
                    onClick={() => {
                      setSortBy("risk");
                      setShowFilters(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Sort by Risk
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("category");
                      setShowFilters(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-zinc-300 hover:bg-zinc-800"
                  >
                    Sort by Category
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Details Table */}
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white">
                Metadata Details
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {sortedMetadata.length} items detected
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-900/50">
                  <tr>
                    <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">
                      Category
                    </th>
                    <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">
                      Metadata Field
                    </th>
                    <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">
                      Value
                    </th>
                    <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">
                      Risk Level
                    </th>
                    <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">
                      Impact
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMetadata.map((item, index) => (
                    <tr
                      key={index}
                      className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white">
                        {item.field}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-400 max-w-xs truncate">
                        {item.value}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={`${getRiskColor(item.risk)} border text-xs`}
                        >
                          {item.risk}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-500 max-w-md">
                        {item.impact}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Metadata Cleanup Controls */}
          {cleanupState !== "completed" && (
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Metadata Cleanup
                  </h3>
                  <p className="text-sm text-zinc-400 mt-1">
                    Remove all detected metadata from this file
                  </p>
                </div>
                <AlertTriangle className="size-5 text-yellow-400" />
              </div>

              <div className="flex items-center gap-4 p-4 bg-yellow-500/5 border border-yellow-500/30 rounded-lg mb-4">
                <Info className="size-5 text-yellow-400 shrink-0" />
                <p className="text-sm text-zinc-300">
                  Metadata removal is processed in real-time. Clean file will be available for immediate download only.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCleanup}
                  disabled={cleanupState === "processing"}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50"
                >
                  {cleanupState === "processing" ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Trash2 className="size-4 mr-2" />
                      Remove Metadata & Generate Clean File
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {/* Clean File Output */}
          {cleanupState === "completed" && (
            <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                  <CheckCircle2 className="size-8 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">
                    Metadata Successfully Removed
                  </h3>
                  <p className="text-sm text-zinc-400">
                    Your clean file is ready for download
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div>
                  <p className="text-xs text-zinc-500">File Name</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {mockFileData.name.replace(".", "_clean.")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Size</p>
                  <p className="text-sm text-white font-medium mt-1">
                    {mockFileData.size}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500">Processed</p>
                  <p className="text-sm text-white font-medium mt-1">
                    Just now
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                  <Download className="size-4 mr-2" />
                  Download Clean File
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                >
                  Re-analyze Clean File
                </Button>
              </div>
            </Card>
          )}

          {/* Compliance & Security Notes */}
          <Card className="bg-zinc-900/30 border-zinc-800 p-6">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <div className="flex items-center gap-3">
                  <Shield className="size-5 text-cyan-400" />
                  <span className="text-sm font-medium text-white">
                    Security & Compliance Information
                  </span>
                </div>
                <ChevronDown className="size-4 text-zinc-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="mt-4 pl-8 space-y-2 text-sm text-zinc-400">
                <p>• No files stored permanently on our servers</p>
                <p>• Processing handled in secure, isolated environment</p>
                <p>
                  • Metadata removal complies with GDPR and privacy best
                  practices
                </p>
                <p>• All file analysis data encrypted in transit and at rest</p>
                <p>• Automatic file deletion after 24 hours</p>
              </div>
            </details>
          </Card>
        </div>
      </div>
    </div>
  );
}