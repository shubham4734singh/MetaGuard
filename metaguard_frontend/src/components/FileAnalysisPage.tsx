import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Clock,
  FileText,
  Filter,
  HardDrive,
  Info,
  Loader2,
  Shield,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { historyApi, type FileHistory } from "../services/api";

type RiskLevel = "Minimal" | "Low" | "Medium" | "High" | "Critical";
interface MetadataItem {
  category: string;
  field: string;
  value: string;
  risk: RiskLevel;
  impact?: string;
}

const riskOrder: Record<RiskLevel, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Minimal: 4,
};

export function FileAnalysisPage({
  fileId,
  onBack,
}: {
  fileId?: string;
  onBack?: () => void;
}) {
  const [fileData, setFileData] = useState<FileHistory | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"risk" | "category">("risk");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      if (!fileId) {
        setError("No file selected");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await historyApi.getById(Number(fileId));
        setFileData(res.data);
        setError(null);
      } catch (err: any) {
        console.error("Failed to load file", err);
        setError(err?.response?.data?.detail || "Failed to load file details");
        setFileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFile();
  }, [fileId]);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "Critical":
        return "text-red-200 bg-red-500/20 border-red-500/50";
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Minimal":
        return "text-blue-500 bg-blue-600/15 border-blue-500/40";
      case "Low":
      default:
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const derivedMetadata: MetadataItem[] = useMemo(() => {
    if (!fileData) return [];

    const metadataArray = Array.isArray(fileData.metadata_details?.metadata)
      ? fileData.metadata_details.metadata
      : [];

    return metadataArray
      .filter((item): item is MetadataItem => Boolean(item?.field && item?.value))
      .map((item) => ({
        category: item.category || "General",
        field: item.field,
        value: item.value,
        risk: (item.risk as RiskLevel) || "Low",
        impact: item.impact,
      }));
  }, [fileData]);

  const categories = useMemo(() => {
    const unique = new Set<string>(["All"]);
    derivedMetadata.forEach((item) => unique.add(item.category));
    return Array.from(unique);
  }, [derivedMetadata]);

  const filteredMetadata = useMemo(() => {
    if (filterCategory === "All") return derivedMetadata;
    return derivedMetadata.filter((item) => item.category === filterCategory);
  }, [derivedMetadata, filterCategory]);

  const sortedMetadata = useMemo(() => {
    if (sortBy === "category") {
      return [...filteredMetadata].sort((a, b) => a.category.localeCompare(b.category));
    }
    return [...filteredMetadata].sort((a, b) => {
      const aOrder = riskOrder[a.risk] ?? 99;
      const bOrder = riskOrder[b.risk] ?? 99;
      return aOrder - bOrder;
    });
  }, [filteredMetadata, sortBy]);

  const totalFields = fileData?.metadata_count ?? derivedMetadata.length;
  const highRiskFields = derivedMetadata.filter(
    (item) => item.risk === "High" || item.risk === "Critical"
  ).length;
  const personalIdentifiers = derivedMetadata.filter((item) =>
    ["name", "email", "phone", "id"].some((term) => item.field?.toLowerCase().includes(term))
  ).length;
  const hasLocation = derivedMetadata.some((item) =>
    item.field?.toLowerCase().includes("location") || item.category.toLowerCase().includes("location")
  );

  const hashes = fileData?.metadata_details?.hashes || {};
  const md5Before = hashes.md5_before as string | undefined;
  const md5After = hashes.md5_after as string | undefined;
  const metadataJson = fileData?.metadata_details?.metadata || fileData?.metadata_details || {};
  const md5Changed = useMemo(() => {
    if (!md5Before || !md5After) return null;
    return md5Before !== md5After;
  }, [md5Before, md5After]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6 flex items-center gap-3">
          <Loader2 className="size-5 animate-spin text-cyan-400" />
          <span className="text-sm text-zinc-300">Loading file details...</span>
        </Card>
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
          <p className="text-red-400 font-semibold">{error || "File not found"}</p>
          <p className="text-zinc-400 text-sm mt-2">Please go back and select a file from History.</p>
          <div className="mt-4">
            <Button variant="ghost" onClick={onBack} className="text-zinc-200">
              <ArrowLeft className="size-4 mr-2" /> Back to History
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const {
    file_name: fileName,
    file_type: fileType,
    file_size_display: fileSize,
    date,
    time,
    policy_name: policyName,
    risk_level: overallRisk = "Low",
    status,
    operation,
    mode,
  } = fileData;

  const uploadDisplay = `${date} ${time}`;

  const timeline = [
    { step: "Uploaded", time: uploadDisplay, status: "completed" as const },
    {
      step: "Analyzed",
      time: uploadDisplay,
      status: status === "Failed" ? "pending" : "completed",
    },
    {
      step: operation.includes("clean") ? "Cleaned" : "Reviewed",
      time: status === "Cleaned" ? uploadDisplay : "Pending",
      status: status === "Cleaned" ? "completed" : status === "Failed" ? "pending" : "ready",
    },
    {
      step: "Complete",
      time: status === "Cleaned" ? "Now" : status === "Failed" ? "Failed" : "Pending",
      status: status === "Cleaned" ? "ready" : status === "Failed" ? "pending" : "ready",
    },
  ];

  return (
<div className="space-y-10 p-6">
      <div className="flex items-center justify-end gap-3">
        <h1 className="text-xl font-semibold text-white">{fileName}</h1>
        <Badge className={`${getRiskColor(overallRisk as RiskLevel)} border text-xs px-3 py-1 capitalize`}>
          {mode?.replace("_", " ") || "Mode"} Risk
        </Badge>
      </div>

      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Analysis Timeline</h3>
            <div className="flex items-center justify-between">
              {timeline.map((step, index) => (
                <div key={step.step} className="flex items-center flex-1">
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
                      {step.status === "completed" && <CheckCircle2 className="size-5 text-emerald-400" />}
                      {step.status === "ready" && <Clock className="size-5 text-cyan-400" />}
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">{step.step}</p>
                      <p className="text-xs text-zinc-500">{step.time}</p>
                    </div>
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-emerald-500/50 to-cyan-500/50 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
        </Card>

        <div className="grid grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-cyan-400">{totalFields}</p>
              <p className="text-sm text-zinc-400 mt-1">Total Fields</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{highRiskFields}</p>
              <p className="text-sm text-zinc-400 mt-1">High-Risk Fields</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-400">{personalIdentifiers}</p>
              <p className="text-sm text-zinc-400 mt-1">Personal Identifiers</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-emerald-400">{hasLocation ? "Yes" : "No"}</p>
              <p className="text-sm text-zinc-400 mt-1">Location Data</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6 space-y-4 h-full">
            <h3 className="text-lg font-bold text-white">Hashes</h3>
            {md5Changed !== null && (
              <p className={`text-sm font-medium ${md5Changed ? "text-amber-300" : "text-emerald-300"}`}>
                MD5 {md5Changed ? "changed after cleaning" : "matches after cleaning"}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-sm text-zinc-200 w-full">
              <div className="p-3 rounded border border-zinc-800 bg-zinc-900/50 w-full">
                <p className="text-xs text-zinc-500 mb-1">MD5 Before</p>
                <p className="font-mono break-all text-cyan-300">{md5Before || "Not recorded"}</p>
              </div>
              <div className="p-3 rounded border border-zinc-800 bg-zinc-900/50 w-full">
                <p className="text-xs text-zinc-500 mb-1">MD5 After</p>
                <p className="font-mono break-all text-emerald-300">{md5After || "Not recorded"}</p>
              </div>
            </div>
          </Card>
        </div>

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
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900/60 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:border-zinc-700"
            >
              <Filter className="size-4" />
              Filters
              <ChevronDown className={`size-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl p-3 space-y-2 z-50">
                <button
                  onClick={() => setSortBy("risk")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    sortBy === "risk" ? "bg-cyan-500/10 text-cyan-300" : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  Sort by Risk
                </button>
                <button
                  onClick={() => setSortBy("category")}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    sortBy === "category"
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "text-zinc-300 hover:bg-zinc-800"
                  }`}
                >
                  Sort by Category
                </button>
              </div>
            )}
          </div>
        </div>

        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
          <div className="p-6 border-b border-zinc-800">
            <h3 className="text-lg font-bold text-white">Detected Metadata</h3>
            <p className="text-sm text-zinc-400 mt-1">
              {sortedMetadata.length} items {filterCategory !== "All" && `in ${filterCategory}`}
            </p>
          </div>

          <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
            {sortedMetadata.length === 0 && (
              <div className="text-sm text-zinc-500">No detailed metadata stored for this record.</div>
            )}

            {sortedMetadata.map((item, index) => (
              <div
                key={`${item.field}-${index}`}
                className="p-3 rounded-lg border border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors flex justify-between items-start gap-4 overflow-hidden"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-zinc-400 bg-zinc-900/50 rounded border border-zinc-800 overflow-hidden">
                    <span className="font-semibold text-white block p-2 pb-1">{item.field}</span>
                    <div className="p-2 pt-0">
                      {item.value.includes(" ") || item.value.includes(",") ? (
                        <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-zinc-800/80 text-zinc-200 text-xs">
                          {item.value}
                        </span>
                      ) : (
                        <span className="text-zinc-300 break-all">{item.value}</span>
                      )}
                    </div>
                  </div>
                  {item.impact && <p className="text-xs text-zinc-500 mt-2">{item.impact}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={`${getRiskColor(item.risk)} border text-xs`}>{item.risk} Risk</Badge>
                  <Badge className="bg-zinc-800 text-zinc-300 border-zinc-700 text-xs">{item.category}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Next Actions</h3>
              <p className="text-sm text-zinc-400">
                Status: {status} | Operation: {operation} | Policy: {policyName}
              </p>
            </div>
          </div>
          <details className="mt-4 group">
            <summary className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-3">
                <Shield className="size-5 text-cyan-400" />
                <span className="text-sm font-medium text-white">Security & Compliance Information</span>
              </div>
              <ChevronDown className="size-4 text-zinc-400 group-open:rotate-180 transition-transform" />
            </summary>
            <div className="mt-4 pl-8 space-y-2 text-sm text-zinc-400">
              <p>• No files stored permanently on our servers</p>
              <p>• Processing handled in secure, isolated environment</p>
              <p>• Metadata removal complies with GDPR and privacy best practices</p>
              <p>• Automatic file deletion after 24 hours</p>
            </div>
          </details>
        </Card>
      </div>
    </div>
  );
}