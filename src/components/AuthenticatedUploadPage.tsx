import { useState } from "react";
import { Upload, Shield, FileText, Trash2, Loader2, CheckCircle2, Info, Download, Bell, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";
import api from "../services/api";

type AnalysisState = "upload" | "processing" | "results";
type RiskLevel = "Low" | "Medium" | "High";

interface MetadataItem {
  field: string;
  value: string;
  risk: RiskLevel;
  category: string;
  risk_score: number;
}

export function AuthenticatedUploadPage({ onBack, user }: { onBack?: () => void; user?: { name?: string; email?: string; } | null; }) {
  const [state, setState] = useState<AnalysisState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [processingStep, setProcessingStep] = useState(0);
  const [isCleanFileReady, setIsCleanFileReady] = useState(false);
  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [fileId, setFileId] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setState("processing");
    setProcessingStep(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const response = await api.post("/api/files/user/analyze/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      const responseData = response.data;
      setFileId(responseData.id);
      
      const transformedMetadata = responseData.metadata.map((item: any) => ({
        field: item.tag,
        value: item.value,
        risk: item.risk_level as RiskLevel,
        category: item.category,
        risk_score: 0,
      }));
      
      setMetadata(transformedMetadata);
      
      const steps = [0, 1, 2];
      steps.forEach((step, index) => {
        setTimeout(() => {
          setProcessingStep(step + 1);
          if (step === 2) {
            setTimeout(() => setState("results"), 500);
          }
        }, (index + 1) * 1000);
      });
    } catch (error) {
      console.error("Error analyzing file:", error);
      setState("upload");
    }
  };

  const handleCleanup = async () => {
    if (!selectedFile || !fileId) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("file_id", fileId);
      
      const response = await api.post("/api/files/clean/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `cleaned_${selectedFile.name}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      setIsCleanFileReady(true);
    } catch (error) {
      console.error("Error cleaning file:", error);
    }
  };

  const filteredMetadata = filterCategory === "All" 
    ? metadata 
    : metadata.filter(item => item.category === filterCategory);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "High": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
    }
  };

  const categories = ["All", "Personal", "Location", "Device", "Software"];
  const highRiskCount = metadata.filter(m => m.risk === "High").length;
  const overallRisk: RiskLevel = highRiskCount >= 3 ? "High" : highRiskCount >= 1 ? "Medium" : "Low";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentPage="upload"
        onNavigate={(page) => {
          if (page === "dashboard" || page === "history" || page === "settings") {
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
              <h1 className="text-xl font-bold text-white">File Upload & Analysis</h1>
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
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-4">
                <Shield className="size-4 text-cyan-400" />
                <span className="text-sm text-cyan-400 font-medium">Authenticated Analysis</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                File Metadata Analysis
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                Upload a file to detect and remove hidden metadata with unlimited processing power.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Unlimited uploads • Priority processing</span>
              </div>
            </div>

            {/* Upload Section */}
            {state === "upload" && (
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-8">
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 ${
                    dragActive 
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
                        Supported formats: PDF, DOCX, JPG, PNG, MP4, and more
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
                        className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                        onClick={() => document.getElementById("file-input")?.click()}
                      >
                        Browse Files
                      </Button>
                      {selectedFile && (
                        <Button
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                          onClick={handleAnalyze}
                        >
                          Analyze Metadata
                        </Button>
                      )}
                    </div>

                    <input
                      id="file-input"
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.mp4,.mov,.avi"
                    />
                  </div>
                </div>

                {/* Pro Features Info */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                    <div className="text-cyan-400 font-bold text-xl mb-1">Unlimited</div>
                    <div className="text-xs text-zinc-500">File Uploads</div>
                  </div>
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                    <div className="text-cyan-400 font-bold text-xl mb-1">Priority</div>
                    <div className="text-xs text-zinc-500">Processing Speed</div>
                  </div>
                  <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-center">
                    <div className="text-cyan-400 font-bold text-xl mb-1">Advanced</div>
                    <div className="text-xs text-zinc-500">Analytics</div>
                  </div>
                </div>
              </Card>
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
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                      Priority Processing
                    </Badge>
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
                          {selectedFile.type || "Unknown type"} • {(selectedFile.size / 1024).toFixed(2)} KB • Analyzed just now
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getRiskColor(overallRisk)} border`}>
                      {overallRisk} Risk
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400">{metadata.length}</div>
                      <div className="text-xs text-zinc-500 mt-1">Fields Detected</div>
                    </div>
                    <div className="text-center border-l border-zinc-800">
                      <div className="text-2xl font-bold text-red-400">{highRiskCount}</div>
                      <div className="text-xs text-zinc-500 mt-1">High Risk</div>
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

                {/* Metadata Table */}
                <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 overflow-hidden">
                  <div className="p-6 border-b border-zinc-800">
                    <h3 className="text-lg font-bold text-white">Detected Metadata</h3>
                    <p className="text-sm text-zinc-400 mt-1">
                      {filteredMetadata.length} items {filterCategory !== "All" && `in ${filterCategory}`}
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-zinc-900/50">
                        <tr>
                          <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Metadata Field</th>
                          <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Value</th>
                          <th className="text-left text-xs font-medium text-zinc-400 px-6 py-3">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMetadata.map((item, index) => (
                          <tr
                            key={index}
                            className="border-t border-zinc-800 hover:bg-zinc-900/30 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-white">{item.field}</td>
                            <td className="px-6 py-4 text-sm text-zinc-400 max-w-md truncate">{item.value}</td>
                            <td className="px-6 py-4">
                              <Badge className={`${getRiskColor(item.risk)} border text-xs`}>
                                {item.risk}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Action Area */}
                {!isCleanFileReady ? (
                  <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Info className="size-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-300 font-medium">Ready to clean this file</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Metadata will be removed and file available for immediate download.
                          </p>
                        </div>
                      </div>
                      <Button 
                        onClick={handleCleanup}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Remove Metadata & Download
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <CheckCircle2 className="size-8 text-emerald-400" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">
                          Metadata Successfully Removed
                        </h3>
                        <p className="text-sm text-zinc-400">
                          Your clean file is ready for immediate download
                        </p>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30">
                      <Download className="size-4 mr-2" />
                      Download Clean File
                    </Button>
                  </Card>
                )}

                {/* New Analysis Button */}
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-zinc-800"
                    onClick={() => {
                      setState("upload");
                      setSelectedFile(null);
                      setFilterCategory("All");
                      setIsCleanFileReady(false);
                    }}
                  >
                    Analyze Another File
                  </Button>
                </div>
              </div>
            )}

            {/* Security Note */}
            <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <Shield className="size-4 text-cyan-400" />
                <span>Files processed securely • Real-time analysis • No permanent storage • Automatic deletion after download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}