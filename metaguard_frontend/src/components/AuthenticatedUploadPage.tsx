import { useState, useEffect, useRef, useCallback } from "react";
import { Upload, Shield, FileText, Trash2, Loader2, CheckCircle2, Info, Download, Eye, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";
import api from "../services/api";

type AnalysisState = "upload" | "processing" | "select_policy" | "results";
type RiskLevel = "Minimal" | "Low" | "Medium" | "High" | "Critical";
type PolicyType = "guest" | "login" | "custom";
type LoginPolicy = "internal-share" | "external-share" | "gdpr" | "forensic" | string;

interface MetadataItem {
  field: string;
  value: string;
  risk: RiskLevel;
  category: string;
  risk_score: number;
}

interface UserPolicy {
  id: number;
  name: string;
  description: string;
  is_custom: boolean;
  is_active: boolean;
  rules: string[];
  created_at: string;
  updated_at: string;
}

export function AuthenticatedUploadPage({ onBack, user, onNavigate, onLogout }: { onBack?: () => void; user?: { name?: string; email?: string; } | null; onNavigate?: (page: string) => void; onLogout?: () => void; }) {
  const SIDEBAR_WIDTH = "1rem";

  const [state, setState] = useState<AnalysisState>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [filterCategory, setFilterCategory] = useState("All");
  const [processingStep, setProcessingStep] = useState(0);
  const [isCleanFileReady, setIsCleanFileReady] = useState(false);
  const [metadata, setMetadata] = useState<MetadataItem[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
  const [backendPolicy, setBackendPolicy] = useState<string | null>(null);
  const [selectedPolicy] = useState<PolicyType>("login");
  const [loginPolicy, setLoginPolicy] = useState<LoginPolicy>("internal-share");
  const [userPolicies, setUserPolicies] = useState<UserPolicy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(false);
  const previousPolicyRef = useRef<LoginPolicy>(loginPolicy);
  const hasAnalyzedRef = useRef(false);
  const policyLabel = 
    loginPolicy === "external-share" 
      ? "External Share (Zero Trust)" 
      : loginPolicy === "gdpr" 
      ? "GDPR Policy" 
      : loginPolicy === "forensic"
      ? "Forensic Mode"
      : loginPolicy === "internal-share"
      ? "Internal Share"
      : userPolicies.find(p => p.id.toString() === loginPolicy)?.name || "Custom Policy";
      
  const policyDetail = 
    loginPolicy === "external-share"
      ? "Strips all personal, device, software, timestamps, and AI markers"
      : loginPolicy === "gdpr"
      ? "GDPR Article 17 - Right to Erasure with compliance reporting"
      : loginPolicy === "forensic"
      ? "View-only forensic metadata analysis. Files are never modified."
      : loginPolicy === "internal-share"
      ? "Removes personal/location, keeps device/software for collaboration"
      : userPolicies.find(p => p.id.toString() === loginPolicy)?.description || "User-defined policy";
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Fetch user policies on component mount
  useEffect(() => {
    const fetchUserPolicies = async () => {
      try {
        setLoadingPolicies(true);
        const response = await api.get("/api/policies/");
        setUserPolicies(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching user policies:", error);
        setUserPolicies([]);
      } finally {
        setLoadingPolicies(false);
      }
    };

    fetchUserPolicies();
  }, []);

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

  const handleAnalyze = useCallback(async () => {
    if (!selectedFile) return;
    
    setState("processing");
    setProcessingStep(0);
    setIsCleanFileReady(false);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      let analyzeEndpoint = "/api/files/login/analyze/";
      let params: any = {};

      if (selectedPolicy === "login") {
        if (loginPolicy === "gdpr") {
          analyzeEndpoint = "/api/files/gdpr/analyze/";
        } else if (loginPolicy === "forensic") {
          // Forensic mode has a dedicated read-only endpoint that returns all metadata
          analyzeEndpoint = "/api/files/forensic/analyze/";
        } else if (loginPolicy === "internal-share") {
          params.policy = "internal-share";
        } else if (loginPolicy === "external-share") {
          params.policy = "external-share";
        } else {
          // Custom policy - use policy ID
          params.policy_id = loginPolicy;
        }
      } else {
        analyzeEndpoint = "/api/files/guest/analyze/";
      }

      console.log("Analyze request", { analyzeEndpoint, loginPolicy, params });
      const response = await api.post(analyzeEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: Object.keys(params).length > 0 ? params : undefined,
      });
      
      const responseData = response.data;
      setBackendPolicy(responseData.policy ?? null);
      const transformedMetadata = (responseData.metadata || []).map((item: any) => ({
        field: item.field || item.tag,
        value: String(item.value ?? ""),
        risk: (item.risk as RiskLevel) || (item.risk_level as RiskLevel) || "Low",
        category: item.category || "Unknown",
        risk_score: Number(item.risk_score ?? 0),
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
  }, [selectedFile, selectedPolicy, loginPolicy]);

  const handleCleanup = async () => {
    if (!selectedFile) return;

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      let cleanEndpoint = "/api/files/login/clean/";
      let params: any = {};

      if (selectedPolicy === "login") {
        if (loginPolicy === "gdpr") {
          cleanEndpoint = "/api/files/gdpr/clean/";
        } else if (loginPolicy === "internal-share") {
          params.policy = "internal-share";
        } else if (loginPolicy === "external-share") {
          params.policy = "external-share";
        } else {
          // Custom policy - use policy ID
          params.policy_id = loginPolicy;
        }
      } else {
        cleanEndpoint = "/api/files/guest/clean/";
      }

      const response = await api.post(cleanEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: Object.keys(params).length > 0 ? params : undefined,
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

  // Watch for policy changes and re-analyze if file is already analyzed
  useEffect(() => {
    // Check if policy actually changed and we're in results state with a file
    if (
      state === "results" && 
      selectedFile && 
      previousPolicyRef.current !== loginPolicy &&
      hasAnalyzedRef.current
    ) {
      console.log("Policy changed from", previousPolicyRef.current, "to", loginPolicy, "- Re-analyzing file");
      previousPolicyRef.current = loginPolicy;
      handleAnalyze();
    } else {
      // Update the ref without triggering re-analysis
      previousPolicyRef.current = loginPolicy;
    }
  }, [loginPolicy, state, selectedFile, handleAnalyze]);

  // Track when analysis completes
  useEffect(() => {
    if (state === "results" && selectedFile) {
      hasAnalyzedRef.current = true;
    } else if (state === "upload") {
      hasAnalyzedRef.current = false;
    }
  }, [state, selectedFile]);

  const filteredMetadata = filterCategory === "All" 
    ? metadata 
    : metadata.filter(item => item.category === filterCategory);

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case "Critical": return "text-red-200 bg-red-500/20 border-red-500/50";
      case "High": return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/30";
      case "Low": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      case "Minimal": return "text-blue-500 bg-blue-600/15 border-blue-500/40";
    }
  };

  const toggleRow = (index: number) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const categories = loginPolicy === "forensic"
    ? [
        "All",
        ...Array.from(new Set(metadata.map((m) => m.category))).sort()
      ]
    : ["All", "Personal", "Location", "Device", "Software", "Temporal", "Document"];
  const criticalCount = metadata.filter(m => m.risk === "Critical").length;
  const highRiskCount = metadata.filter(m => m.risk === "High").length;
  const overallRisk: RiskLevel = criticalCount > 0
    ? "Critical"
    : highRiskCount >= 3
      ? "High"
      : highRiskCount >= 1
        ? "Medium"
        : "Low";

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <Sidebar
        user={user}
        currentPage="upload"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

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
              <h1 className="text-xl font-bold text-white">File Upload & Analysis</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                {(user?.name || user?.email || "?").trim().charAt(0).toUpperCase()}
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
                {loginPolicy === "forensic" ? (
                  <>
                    <Eye className="size-4 text-cyan-400" />
                    <span className="text-sm text-cyan-400 font-medium">Forensic Investigation</span>
                  </>
                ) : (
                  <>
                    <Shield className="size-4 text-cyan-400" />
                    <span className="text-sm text-cyan-400 font-medium">Authenticated Analysis</span>
                  </>
                )}
              </div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                {loginPolicy === "forensic" 
                  ? "Forensic Metadata Inspection" 
                  : loginPolicy === "gdpr"
                  ? "GDPR Compliance Analysis"
                  : "File Metadata Analysis"}
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">
                {loginPolicy === "forensic"
                  ? "Upload a file for read-only forensic analysis. Original files are never modified, preserving evidentiary integrity."
                  : loginPolicy === "gdpr"
                  ? "Upload a file to analyze and remove metadata in compliance with GDPR Article 17 - Right to Erasure."
                  : loginPolicy === "external-share"
                  ? "Upload a file to remove all metadata for zero-trust external sharing with complete privacy protection."
                  : "Upload a file to detect and remove hidden metadata with unlimited processing power."}
              </p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                {loginPolicy === "forensic" ? (
                  <>
                    <Eye className="size-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">Non-destructive • Chain-of-custody preserved</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-medium">Unlimited uploads • Priority processing</span>
                  </>
                )}
              </div>

              {/* Policy selector (Internal vs External Share) */}
              <div className="mt-6 flex flex-col items-center gap-3 text-sm text-zinc-300">
                <span className="text-xs uppercase tracking-[0.08em] text-zinc-500">Choose Policy</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl">
                  {[ 
                    { id: "internal-share", label: "Internal Share", detail: "Keeps device/software metadata for collaboration", icon: "share" },
                    { id: "external-share", label: "External Share (Zero Trust)", detail: "Removes all personal, device, software, and timestamps", icon: "lock" },
                    { id: "gdpr", label: "GDPR Policy", detail: "GDPR Article 17 - Right to Erasure with compliance reporting", icon: "shield" },
                    { id: "forensic", label: "Forensic Mode", detail: "View-only forensic metadata analysis. Files are never modified.", icon: "eye" },
                  ].map(option => {
                    const active = loginPolicy === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setLoginPolicy(option.id as LoginPolicy)}
                        className={`flex flex-col items-start gap-1 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                          active
                            ? "border-cyan-500 bg-gradient-to-br from-cyan-500/20 to-blue-500/10 text-white shadow-lg shadow-cyan-500/30"
                            : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {option.id === "forensic" && <Eye className={`size-3.5 ${active ? "text-cyan-400" : "text-cyan-500/60"}`} />}
                          <span className={`text-xs font-semibold tracking-tight ${active ? "text-cyan-200" : "text-zinc-200"}`}>
                            {option.label}
                          </span>
                          {active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-100">Selected</span>}
                        </div>
                        <span className="text-xs text-zinc-400 leading-relaxed">
                          {option.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* User-Defined Policies Dropdown */}
                {userPolicies.length > 0 && (
                  <div className="mt-4 w-full max-w-5xl">
                    <label className="block text-xs uppercase tracking-[0.08em] text-zinc-500 mb-2">
                      Or Select Custom Policy
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {userPolicies.map((policy) => {
                        const active = loginPolicy === policy.id.toString();
                        return (
                          <button
                            key={policy.id}
                            type="button"
                            onClick={() => setLoginPolicy(policy.id.toString())}
                            className={`flex flex-col items-start gap-1 rounded-lg border-2 px-4 py-2 text-left transition-all duration-200 ${
                              active
                                ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/10 text-white shadow-lg shadow-purple-500/30"
                                : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900 text-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-semibold tracking-tight ${active ? "text-purple-200" : "text-zinc-200"}`}>
                                {policy.name}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-100">
                                Custom
                              </span>
                              {active && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-100">Selected</span>}
                            </div>
                            {policy.description && (
                              <span className="text-xs text-zinc-400 leading-relaxed">
                                {policy.description}
                              </span>
                            )}
                            {policy.rules && policy.rules.length > 0 && (
                              <span className="text-xs text-zinc-500 leading-relaxed">
                                Rules: {policy.rules.join(", ")}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {loadingPolicies && (
                  <div className="mt-2 text-xs text-zinc-500 flex items-center gap-2">
                    <Loader2 className="size-3 animate-spin" />
                    Loading custom policies...
                  </div>
                )}
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
                          disabled={state === "processing"}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleAnalyze}
                        >
                          {state === "processing" ? "Analyzing..." : "Analyze Metadata"}
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
                  {backendPolicy && (
                    <div className="mt-3 text-xs text-zinc-500">
                      Backend policy: <span className="text-cyan-300">{backendPolicy}</span>
                    </div>
                  )}
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
                            <td className="px-6 py-4 text-sm text-zinc-300">
                              <div className={`${expandedRows[index] ? "break-words whitespace-pre-wrap" : "max-h-24 overflow-y-auto break-words whitespace-pre-wrap"}`}>
                                {item.value}
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleRow(index)}
                                className="mt-2 text-xs text-cyan-300 hover:text-cyan-200"
                              >
                                {expandedRows[index] ? "Collapse" : "Expand"}
                              </button>
                            </td>
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
                {loginPolicy === "forensic" ? (
                  <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Eye className="size-6 text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-white">Forensic Mode Active</h3>
                          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/40 text-xs">
                            Read-Only
                          </Badge>
                        </div>
                        <p className="text-sm text-zinc-300 mb-3">
                          All metadata has been extracted and displayed for investigation, auditing, and evidence review.
                        </p>
                        <div className="space-y-2 text-xs text-zinc-400">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Original file hash and timestamps preserved</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Chain-of-custody integrity maintained</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>Non-destructive forensic analysis</span>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="size-4 text-amber-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-200/90">
                              <strong>Warning:</strong> Files analyzed in Forensic Mode remain unchanged and may contain sensitive personal or location data.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : !isCleanFileReady ? (
                  <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Info className="size-5 text-cyan-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-zinc-300 font-medium">Ready to clean this file</p>
                          <p className="text-xs text-zinc-500 mt-1">
                            Metadata will be removed using the selected policy, then ready for download.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-stretch gap-2 w-full md:w-auto">
                        <div className="flex md:justify-end">
                          <span className="text-xs px-3 py-1.5 rounded-md border border-zinc-700 bg-zinc-900/80 text-zinc-200">
                            Active Policy: {policyLabel}
                          </span>
                        </div>
                        <Button 
                          disabled={state !== "results"}
                          onClick={handleCleanup}
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="size-4 mr-2" />
                          Remove Metadata & Download
                        </Button>
                      </div>
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
                      setMetadata([]);
                      setProcessingStep(0);
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