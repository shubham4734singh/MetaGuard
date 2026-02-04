import { useState } from "react";
import {
  Upload,
  Shield,
  FileText,
  Download,
  Trash2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { API_BASE_URL } from "../services/api";

type AnalysisState = "upload" | "processing" | "select_policy" | "results";
type RiskLevel = "Low" | "Medium" | "High";
type GuestPolicy = "basic" | "external-share" | "gdpr";

interface MetadataItem {
  field: string;
  value: string;
  risk: RiskLevel;
  category: string;
  risk_score: number;
}

export function UploadAnalysisPage({
  onBack,
  onSignUp,
}: {
  onBack?: () => void;
  onSignUp?: () => void;
}) {
  // ================== STATE ==================
  const [state, setState] = useState<AnalysisState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [processingStep, setProcessingStep] = useState(0);

  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [beforeSummary, setBeforeSummary] = useState({ total: 0, privacy: 0 });
  const [afterSummary, setAfterSummary] = useState({
    remaining: 0,
    removed: 0,
  });
  const [hashChanged, setHashChanged] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerItem, setDrawerItem] = useState<MetadataItem | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const categories = ["All", "Personal", "Location", "Device", "Software"];

  // ================== HANDLERS ==================
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      console.log("File selected:", file.name);
      setSelectedFile(file);
    }
  };



  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setProcessingStep(1);          // ✅ ADD
    setState("processing");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("policy", "basic");

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/files/guest/analyze/`,
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Bad response"); // ✅ ADD

      const data = await res.json();

      setMetadata(data.metadata);
      setBeforeSummary(data.before);
      setAfterSummary(data.after);
      setHashChanged(data.hash_changed);

      setProcessingStep(3);        // ✅ ADD
      setState("results");
    } catch {
      alert("Analysis failed");
      setState("upload");
    }
  };


  const handleCleanDownload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    const res = await fetch(
      `${API_BASE_URL}/api/files/guest/clean/`,
      { method: "POST", body: formData }
    );

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaned_${selectedFile.name}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ================== DERIVED ==================
  const filteredMetadata =
    filterCategory === "All"
      ? metadata
      : metadata.filter((m) => m.category === filterCategory);

  const highRiskCount = metadata.filter((m) => m.risk === "High").length;

  const overallRisk: RiskLevel =
    highRiskCount >= 3 ? "High" : highRiskCount >= 1 ? "Medium" : "Low";

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

  const isLongValue = (value: string) => value.length > 80;


  return (


    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header with back button */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="size-4" />
              <span className="text-sm">Back to Home</span>
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
              Guest Mode
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4">
            <Shield className="size-4 text-cyan-400" />
            <span className="text-sm text-cyan-400 font-medium">Secure Analysis</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Metadata Analysis & Cleaning
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Upload a file to detect and remove hidden metadata.
          </p>
          <div className="mt-4 text-sm text-zinc-500">
            Free usage: <span className="text-cyan-400 font-medium">10 files/day</span>
          </div>
        </div>

        {/* Upload Section */}
        {state === "upload" && (
          <>
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-8 mb-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${dragActive
                  ? "border-cyan-500 bg-cyan-500/5"
                  : "border-zinc-700 hover:border-zinc-600"
                  }`}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="relative">
                    <div className="p-6 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-500/20">
                      <Upload className="size-12 text-cyan-400" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-2 bg-zinc-900 rounded-lg border border-cyan-500/30">
                      <Shield className="size-4 text-cyan-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-lg text-zinc-300">
                      {selectedFile ? (
                        <span className="text-cyan-400 font-medium">{selectedFile.name}</span>
                      ) : (
                        "Drag & drop your file here or browse"
                      )}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Supported formats: PDF, DOCX, JPG, PNG, MP4
                    </p>
                    {selectedFile && (
                      <p className="text-xs text-zinc-600">
                        Size: {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      Browse Files
                    </Button>
                    {selectedFile && (
                      <Button
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                        onClick={handleAnalyze}
                      >
                        Analyze File
                      </Button>
                    )}
                  </div>

                  <input
                    id="file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.jpg,.jpeg,.png,.mp4"
                  />
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Processing Section */}
        {state === "processing" && selectedFile && (
          <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-8">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="relative">
                <Loader2 className="size-16 text-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-full blur-xl"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Analyzing Metadata...</h3>
                <p className="text-zinc-400">{selectedFile.name}</p>
              </div>

              <div className="w-full max-w-md space-y-3">
                {[
                  { label: "Reading file", step: 1 },
                  { label: "Extracting metadata", step: 2 },
                  { label: "Calculating risk score", step: 3 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-800">
                    {processingStep > item.step ? (
                      <CheckCircle2 className="size-5 text-emerald-400" />
                    ) : processingStep === item.step ? (
                      <Loader2 className="size-5 text-cyan-400 animate-spin" />
                    ) : (
                      <div className="size-5 rounded-full border-2 border-zinc-700"></div>
                    )}
                    <span className={processingStep >= item.step ? "text-white" : "text-zinc-500"}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Results Section */}
        {state === "results" && selectedFile && (
          <div className="space-y-6">
            {/* Metadata Summary Card */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                    <FileText className="size-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{selectedFile.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {selectedFile.type || "Unknown type"} • {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Badge className={`${getRiskColor(overallRisk)} border`}>
                  {overallRisk} Risk
                </Badge>
              </div>

              <div className="grid grid-cols-4 gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{metadata.length}</div>

                  <div className="text-xs text-zinc-500 mt-1">Fields Detected</div>
                </div>
                <div className="text-center border-l border-zinc-800">
                  <div className="text-2xl font-bold text-red-400">{highRiskCount}</div>
                  <div className="text-xs text-zinc-500 mt-1">High Risk</div>
                </div>
                <div className="text-center border-l border-zinc-800">
                  <div className="text-2xl font-bold text-yellow-400">
                    {metadata.filter(m => m.risk === "Medium").length}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Medium Risk</div>
                </div>
                <div className="text-center border-l border-zinc-800">
                  <div className="text-2xl font-bold text-emerald-400">
                    {metadata.filter(m => m.risk === "Low").length}

                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Low Risk</div>
                </div>
              </div>
            </Card>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${filterCategory === cat
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                    : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:border-zinc-700"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Detected Metadata - Vertical Layout */}
            <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white">Detected Metadata</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  {filteredMetadata.length} items {filterCategory !== "All" && `in ${filterCategory}`}
                </p>
              </div>

              <div className="overflow-y-auto p-6 space-y-2">
                {filteredMetadata.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-zinc-700 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors flex justify-between items-start gap-4 overflow-hidden"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-zinc-400 bg-zinc-900/50 rounded border border-zinc-800 overflow-hidden">
                        <span className="font-semibold text-white block p-2 pb-1">{item.field}</span>
                        <div className="p-2 pt-0">
                          {item.value.includes(' ') || item.value.includes(',') ? (
                            <span className="text-zinc-300 block break-all">{item.value}</span>
                          ) : (
                            <div className="overflow-x-auto">
                              <span className="text-zinc-300 block whitespace-nowrap">{item.value}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getRiskColor(item.risk)} border text-xs flex-shrink-0 mt-1`}>
                      {item.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>


            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                disabled={downloaded}
                onClick={() => {
                  handleCleanDownload();
                  setDownloaded(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="size-4 mr-2" />
                {downloaded ? "Downloaded" : "Download Clean File"}
              </Button>
            </div>

            {/* Action Area */}


            {/* New Analysis Button */}
            <div className="text-center pt-4">
              <Button
                variant="outline"
                className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-zinc-800"
                onClick={() => {
                  setState("upload");
                  setSelectedFile(null);
                  setFilterCategory("All");
                  setDownloaded(false);
                }}
              >
                Analyze Another File
              </Button>
            </div>
          </div>
        )}

        {/* Guest Limit & Upgrade CTA */}
        <div className="mt-12 p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl text-center">
          <p className="text-sm text-zinc-400 mb-2">
            Guest users can analyze up to <span className="text-cyan-400 font-medium">10 files per day</span>.
          </p>
          <button
            onClick={onSignUp}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Create free account for unlimited access →
          </button>
        </div>
      </div>
    </div>
  );
}