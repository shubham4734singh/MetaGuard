import { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  Edit2,
  Plus,
  ChevronRight,
  Zap,
  Globe,
  Lock,
  Eye,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Check,
  MapPin,
  Smartphone,
  User,
  Calendar,
  Code,
  FileText,
  Camera,
  X,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Slider } from "./ui/slider";
import { Sidebar } from "./Sidebar";
import { policyApi, Policy as ApiPolicy } from "../services/api";

/* ----------------------------------
   Types & Mock Data
---------------------------------- */
interface Policy {
  id: string;
  name: string;
  description: string;
  rules: string[];
  icon?: any;
  color?: string;
  isCustom?: boolean;
}

interface MetadataRule {
  id: string;
  label: string;
  description: string;
  icon: any;
  category: "location" | "device" | "personal" | "temporal" | "technical";
}

const metadataRules: MetadataRule[] = [
  {
    id: "gps",
    label: "Remove GPS Location",
    description: "Strip all GPS coordinates",
    icon: MapPin,
    category: "location",
  },
  {
    id: "device-id",
    label: "Remove Device ID",
    description: "Remove device identifiers",
    icon: Smartphone,
    category: "device",
  },
  {
    id: "author",
    label: "Remove Author Info",
    description: "Strip creator metadata",
    icon: User,
    category: "personal",
  },
  {
    id: "creation-date",
    label: "Remove Creation Date",
    description: "Remove timestamps",
    icon: Calendar,
    category: "temporal",
  },
  {
    id: "software",
    label: "Remove Software Info",
    description: "Strip app/software data",
    icon: Code,
    category: "technical",
  },
  {
    id: "exif",
    label: "Strip EXIF Data",
    description: "Remove all EXIF metadata",
    icon: Camera,
    category: "technical",
  },
  {
    id: "comments",
    label: "Remove Comments",
    description: "Strip file comments",
    icon: FileText,
    category: "personal",
  },
];

const policyPresets: Policy[] = [
  {
    id: "internal-share",
    name: "Internal Share",
    description: "Internal Share (Authenticated Users) - Moderate policy for internal use",
    rules: [
      "Remove GPS Location",
      "Remove Device ID",
      "Remove Author Info",
      "Keep Software Info",
      "Smart Filtering",
    ],
    icon: Shield,
    color: "blue",
  },
  {
    id: "external-share",
    name: "External Share",
    description: "External Share - Zero-trust policy for external sharing",
    rules: [
      "Remove All GPS Data",
      "Remove All Device Info",
      "Remove All Author Info",
      "Remove All Timestamps",
      "Strip EXIF Data",
      "Remove All Software Info",
      "Strict Metadata Removal",
    ],
    icon: Eye,
    color: "purple",
  },
  {
    id: "gdpr-article17",
    name: "GDPR Article 17 - Right to Erasure",
    description: "GDPR Article 17 (Right to Erasure) - Comprehensive personal data removal for authenticated users",
    rules: [
      "Remove All Personal Data",
      "Remove GPS Location",
      "Remove Device ID",
      "Remove Author Info",
      "Remove Creation Date",
      "Remove Software Info",
      "Strip EXIF Data",
      "Remove All Identifiers",
      "GDPR Compliance Mode",
    ],
    icon: Lock,
    color: "green",
  },
  {
    id: "forensic",
    name: "Forensic Mode",
    description: "Read-only forensic analysis. Files are never modified; preserves evidentiary integrity.",
    rules: [
      "Preserve Original File",
      "Return Full Metadata",
      "No Cleaning Actions",
      "Hash Preservation",
    ],
    icon: Eye,
    color: "cyan",
  },
];

interface PoliciesPageProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  activePolicy?: Policy;
  onPolicyChange?: (policy: Policy) => void;
  user?: { name?: string; email?: string } | null;
}

export function PoliciesPage({
  onNavigate,
  onLogout,
  activePolicy: externalActivePolicy,
  onPolicyChange,
  user,
}: PoliciesPageProps) {
  const SIDEBAR_WIDTH = "1rem";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Policy Management State
  const [internalActivePolicy, setInternalActivePolicy] = useState<Policy>(
    policyPresets[0]
  );
  const [showPolicySelector, setShowPolicySelector] = useState(false);
  const [policyStrength, setPolicyStrength] = useState<number>(50);

  // New states for custom policy creation
  const [customPolicies, setCustomPolicies] = useState<Policy[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyDescription, setNewPolicyDescription] = useState("");
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activePolicy = externalActivePolicy || internalActivePolicy;
  const allPolicies = [...policyPresets, ...customPolicies];

  // Load policies from API on component mount
  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setIsLoading(true);
      const response = await policyApi.getAll();
      const apiPolicies: Policy[] = response.data.map((p: ApiPolicy) => ({
        id: p.id.toString(),
        name: p.name,
        description: p.description,
        rules: p.rules,
        isCustom: p.is_custom,
        icon: Shield,
        color: "purple",
      }));
      setCustomPolicies(apiPolicies);
      setError(null);
    } catch (err: any) {
      console.error("Error loading policies:", err);
      setError("Failed to load policies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePolicy = async () => {
    if (!newPolicyName.trim()) {
      setError("Policy name is required");
      return;
    }

    if (selectedRules.length === 0) {
      setError("Please select at least one metadata rule");
      return;
    }

    try {
      setIsLoading(true);
      const response = await policyApi.create({
        name: newPolicyName,
        description: newPolicyDescription,
        rules: selectedRules,
      });

      // Add to custom policies list
      const newPolicy: Policy = {
        id: response.data.id.toString(),
        name: response.data.name,
        description: response.data.description,
        rules: response.data.rules,
        isCustom: true,
        icon: Shield,
        color: "purple",
      };

      setCustomPolicies([...customPolicies, newPolicy]);
      
      // Reset form
      setNewPolicyName("");
      setNewPolicyDescription("");
      setSelectedRules([]);
      setShowCreateModal(false);
      setError(null);
    } catch (err: any) {
      console.error("Error creating policy:", err);
      setError(err.response?.data?.name?.[0] || "Failed to create policy");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    try {
      setIsLoading(true);
      await policyApi.delete(Number(policyId));
      setCustomPolicies(customPolicies.filter(p => p.id !== policyId));
      setError(null);
    } catch (err: any) {
      console.error("Error deleting policy:", err);
      setError("Failed to delete policy");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRule = (ruleId: string) => {
    setSelectedRules(prev => 
      prev.includes(ruleId) 
        ? prev.filter(r => r !== ruleId)
        : [...prev, ruleId]
    );
  };

  const handleSidebarNavigate = (page: string) => {
    setSidebarOpen(false);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handlePolicySelect = (policy: Policy) => {
    if (onPolicyChange) {
      onPolicyChange(policy);
    } else {
      setInternalActivePolicy(policy);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar - Static for consistent visibility */}
      <Sidebar
        currentPage="policies"
        onNavigate={onNavigate}
        onLogout={onLogout}
        user={user}
      />

      {/* MAIN CONTENT AREA */}
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: SIDEBAR_WIDTH }}
      >
        {/* TOP NAVIGATION BAR */}
<header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur-sm">
<div
  className="flex items-center justify-between py-3 px-6"
  style={{ paddingLeft: `calc(${SIDEBAR_WIDTH} + 1rem)` }}
>
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">Policies</h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <Bell
                  size={20}
                  className="text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors"
                />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full"></div>
              </div>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all duration-300"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-sm text-white">
                    {(user?.name || user?.email || "?").charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-zinc-400 transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""
                      }`}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        handleSidebarNavigate("settings");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-300"
                    >
                      <Settings size={16} />
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        if (onLogout) {
                          onLogout();
                        }
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-2 text-red-400"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <button
              onClick={() => onNavigate?.("dashboard")}
              className="hover:text-cyan-400 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="size-4" />
            <span className="text-white">Policies</span>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Policy Management
            </h1>
            <p className="text-zinc-400">
              Configure metadata removal policies and apply quick presets
            </p>
          </div>

          {/* QUICK POLICY PRESETS */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Zap size={20} className="text-yellow-400" />
                <h3 className="text-lg font-bold text-white">
                  Quick Policy Presets
                </h3>
              </div>
              <p className="text-sm text-zinc-500">
                Select a commonly used policy to apply it instantly
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPolicies.map((policy) => {
                const Icon = policy.icon || Shield;
                const isActive = activePolicy.id === policy.id;

                return (
                  <button
                    key={policy.id}
                    onClick={() => handlePolicySelect(policy)}
                    className={`
                    text-left p-5 rounded-xl border-2 transition-all duration-300
                    ${isActive
                        ? "bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
                        : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                      }
                  `}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`
                      p-2.5 rounded-lg
                      ${isActive
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-zinc-800 text-zinc-400"
                          }
                    `}
                      >
                        <Icon size={20} />
                      </div>
                      {isActive && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                          Active
                        </Badge>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">
                      {policy.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {policy.description}
                    </p>

                    <div className="space-y-1.5">
                      {policy.rules.slice(0, 3).map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle
                            size={12}
                            className={
                              isActive ? "text-cyan-400" : "text-emerald-400"
                            }
                          />
                          <span className="text-xs text-zinc-400">{rule}</span>
                        </div>
                      ))}
                      {policy.rules.length > 3 && (
                        <p className="text-xs text-zinc-500 pl-5">
                          +{policy.rules.length - 3} more rules
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CREATE CUSTOM POLICY SECTION */}
          <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Plus size={20} className="text-cyan-400" />
                  <h3 className="text-lg font-bold text-white">
                    Custom Policies
                  </h3>
                </div>
                <p className="text-sm text-zinc-500">
                  Create your own metadata removal policies by selecting specific rules
                </p>
              </div>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
              >
                <Plus size={16} className="mr-2" />
                Create Policy
              </Button>
            </div>

            {/* Display custom policies */}
            {customPolicies.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {customPolicies.map((policy) => (
                  <div
                    key={policy.id}
                    className="relative p-5 rounded-xl border-2 border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400">
                        <Shield size={20} />
                      </div>
                      <button
                        onClick={() => handleDeletePolicy(policy.id)}
                        className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">
                      {policy.name}
                    </h4>
                    <p className="text-xs text-zinc-400 mb-3">
                      {policy.description || "Custom metadata removal policy"}
                    </p>

                    <div className="space-y-1.5">
                      {policy.rules.slice(0, 3).map((rule, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle size={12} className="text-purple-400" />
                          <span className="text-xs text-zinc-400">{rule}</span>
                        </div>
                      ))}
                      {policy.rules.length > 3 && (
                        <p className="text-xs text-zinc-500 pl-5">
                          +{policy.rules.length - 3} more rules
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {customPolicies.length === 0 && !isLoading && (
              <div className="text-center py-8 text-zinc-500">
                <Shield size={48} className="mx-auto mb-3 opacity-30" />
                <p>No custom policies yet. Create one to get started!</p>
              </div>
            )}

            {isLoading && (
              <div className="text-center py-8 text-cyan-400">
                Loading policies...
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

          {/* CREATE POLICY MODAL */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div
                className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl flex flex-col"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6, 90, 96, 0.4) 0%, rgba(27, 58, 75, 0.5) 50%, rgba(39, 38, 64, 0.4) 100%)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(0, 212, 216, 0.2)",
                  boxShadow:
                    "0 0 60px rgba(0, 100, 102, 0.3), 0 20px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Create Custom Policy</h2>
                      <button
                        onClick={() => {
                          setShowCreateModal(false);
                          setError(null);
                          setNewPolicyName("");
                          setNewPolicyDescription("");
                          setSelectedRules([]);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-cyan-400 hover:text-cyan-300"
                      >
                        <X size={24} />
                      </button>
                  </div>
                </div>

                {/* Form Content - Scrollable */}
                <div className="p-4 overflow-y-auto flex-1">
                  {/* Policy Name */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Policy Name *
                    </label>
                    <input
                      type="text"
                      value={newPolicyName}
                      onChange={(e) => setNewPolicyName(e.target.value)}
                      placeholder="e.g., My Custom Policy"
                      className="w-full px-3 py-2 text-sm bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>

                  {/* Policy Description */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white mb-1.5">
                      Description (Optional)
                    </label>
                    <textarea
                      value={newPolicyDescription}
                      onChange={(e) => setNewPolicyDescription(e.target.value)}
                      placeholder="Describe what this policy does..."
                      rows={2}
                      className="w-full px-3 py-2 text-sm bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                    />
                  </div>

                  {/* Metadata Rules Selection */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-white mb-2">
                      Select Metadata Rules to Remove *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {metadataRules.map((rule) => {
                          const Icon = rule.icon;
                          const isSelected = selectedRules.includes(rule.id);

                          return (
                            <button
                              key={rule.id}
                              onClick={() => toggleRule(rule.id)}
                              className={`
                                text-left p-3 rounded-lg border-2 transition-all duration-200
                                ${isSelected
                                  ? "bg-cyan-500/20 border-cyan-500/50"
                                  : "bg-zinc-900/30 border-zinc-700 hover:border-cyan-500/30"
                                }
                              `}
                            >
                              <div className="flex items-start gap-2">
                                <div
                                  className={`
                                    p-1.5 rounded-lg flex-shrink-0
                                    ${isSelected
                                      ? "bg-cyan-500/30 text-cyan-400"
                                      : "bg-zinc-800 text-zinc-400"
                                    }
                                  `}
                                >
                                  <Icon size={16} />
                                </div>
                                  <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-semibold text-white text-xs">
                                      {rule.label}
                                    </h4>
                                    {isSelected && (
                                      <Check size={12} className="text-cyan-400" />
                                    )}
                                  </div>
                                  <p className="text-[10px] text-zinc-400 mt-0.5">
                                    {rule.description}
                                  </p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  {error && (
                    <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs">
                      {error}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 flex items-center justify-between flex-shrink-0">
                  <p className="text-xs text-zinc-400">
                    {selectedRules.length} rule{selectedRules.length !== 1 ? 's' : ''} selected
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setShowCreateModal(false);
                        setError(null);
                        setNewPolicyName("");
                        setNewPolicyDescription("");
                        setSelectedRules([]);
                      }}
                      variant="outline"
                      className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-sm px-3 py-1.5 h-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePolicy}
                      disabled={isLoading || !newPolicyName.trim() || selectedRules.length === 0}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm px-3 py-1.5 h-auto"
                    >
                      <Save size={14} className="mr-1.5" />
                      {isLoading ? "Creating..." : "Create Policy"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* POLICY SELECTOR MODAL */}
          {showPolicySelector && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40">
              <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
                <div
                  className="w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(6, 90, 96, 0.4) 0%, rgba(27, 58, 75, 0.5) 50%, rgba(39, 38, 64, 0.4) 100%)",
                    backdropFilter: "blur(24px)",
                    border: "1px solid rgba(0, 212, 216, 0.2)",
                    boxShadow:
                      "0 0 60px rgba(0, 100, 102, 0.3), 0 20px 80px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {/* Header */}
                  <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-white">Select Policy</h2>
                      <button
                        onClick={() => setShowPolicySelector(false)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 text-cyan-400 hover:text-cyan-300"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    <p className="text-sm text-zinc-400">
                      Choose from existing policies to set as active
                    </p>
                  </div>

                  {/* Policy List */}
                  <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="space-y-3">
                      {allPolicies.map((policy) => {
                        const Icon = policy.icon || Shield;
                        const isActive = activePolicy.id === policy.id;

                        return (
                          <button
                            key={policy.id}
                            onClick={() => {
                              handlePolicySelect(policy);
                              setShowPolicySelector(false);
                            }}
                            className="w-full text-left p-4 rounded-xl transition-all duration-200 group relative"
                            style={{
                              background: isActive
                                ? "linear-gradient(135deg, rgba(0, 212, 216, 0.15) 0%, rgba(0, 100, 102, 0.15) 100%)"
                                : "rgba(20, 69, 82, 0.3)",
                              border: isActive
                                ? "1px solid rgba(0, 212, 216, 0.4)"
                                : "1px solid rgba(107, 125, 133, 0.2)",
                              boxShadow: isActive
                                ? "0 0 20px rgba(0, 212, 216, 0.2)"
                                : "none",
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background =
                                  "rgba(27, 58, 75, 0.5)";
                                e.currentTarget.style.borderColor =
                                  "rgba(0, 212, 216, 0.3)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) {
                                e.currentTarget.style.background =
                                  "rgba(20, 69, 82, 0.3)";
                                e.currentTarget.style.borderColor =
                                  "rgba(107, 125, 133, 0.2)";
                              }
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className="p-3 rounded-lg flex-shrink-0"
                                style={{
                                  background: isActive
                                    ? "rgba(0, 212, 216, 0.2)"
                                    : "rgba(27, 58, 75, 0.5)",
                                  color: isActive ? "#00d4d8" : "#6b7d85",
                                }}
                              >
                                <Icon size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-bold text-white">
                                    {policy.name}
                                  </h4>
                                  {isActive && (
                                    <Badge
                                      className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                                      style={{
                                        boxShadow: "0 0 10px rgba(0, 212, 216, 0.3)",
                                      }}
                                    >
                                      <Check size={12} className="mr-1" />
                                      Active
                                    </Badge>
                                  )}
                                  {policy.isCustom && (
                                    <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                                      Custom
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-zinc-400 mb-2">
                                  {policy.description}
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {policy.rules.slice(0, 4).map((rule, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs px-2 py-0.5 rounded"
                                      style={{
                                        background: "rgba(0, 100, 102, 0.2)",
                                        color: "#6dd5ed",
                                      }}
                                    >
                                      {rule}
                                    </span>
                                  ))}
                                  {policy.rules.length > 4 && (
                                    <span className="text-xs text-zinc-500">
                                      +{policy.rules.length - 4} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PoliciesPage;