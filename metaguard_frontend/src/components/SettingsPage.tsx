import { useEffect, useState } from "react";
import {
  Shield,
  User,
  Lock,
  Monitor,
  Settings as SettingsIcon,
  AlertTriangle,
  ChevronRight,
  Mail,
  Building,
  Calendar,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Smartphone,
  Key,
  Eye,
  EyeOff,
  Chrome,
  MapPin,
  Globe,
  Bell,
  Moon,
  Sun,
  Trash2,
  LogOut,
  Clock,
  ChevronDown,
  Home,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sidebar } from "./Sidebar";
import { updateProfile as updateProfileApi, deleteAccount as deleteAccountApi, getProfile as getProfileApi } from "../services/auth";

type SettingsTab = "profile" | "security" | "danger";

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const mockSessions: ActiveSession[] = [
  {
    id: "session_001",
    device: "MacBook Pro",
    browser: "Chrome 120.0",
    ipAddress: "192.168.1.100",
    location: "San Francisco, CA",
    lastActive: "Just now",
    isCurrent: true,
  },
  {
    id: "session_002",
    device: "iPhone 15 Pro",
    browser: "Safari 17.0",
    ipAddress: "192.168.1.105",
    location: "San Francisco, CA",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "session_003",
    device: "Windows Desktop",
    browser: "Firefox 121.0",
    ipAddress: "203.0.113.45",
    location: "New York, NY",
    lastActive: "1 day ago",
    isCurrent: false,
  },
];

function formatDateIST(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date) + " IST";
}

export function SettingsPage({ onBack, onNavigate, onLogout, onDeleteAccount, user }: { 
  onBack?: () => void;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  onDeleteAccount?: () => void;
  user?: { name?: string; email?: string; organization?: string } | null;
}) {
  const SIDEBAR_WIDTH = "1rem";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [emailNotifications, setEmailNotifications] = useState({
    security: true,
    completion: true,
    limits: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    displayName: user?.name || "",
    organization: user?.organization || "",
    role: "Member",
    accountCreated: "",
  });

  useEffect(() => {
    setProfileData((prev) => ({
      ...prev,
      email: user?.email || prev.email,
      displayName: user?.name || prev.displayName,
      organization: user?.organization || prev.organization,
    }));
  }, [user?.email, user?.name, user?.organization]);

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateProfileApi({
        display_name: profileData.displayName,
        organization: profileData.organization,
      });
      setSaveSuccess(true);
      setIsEditingProfile(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    // Fetch latest profile from backend
    getProfileApi()
      .then((res) => {
        setProfileData((prev) => ({
          ...prev,
          email: res.email || prev.email,
          displayName: res.display_name || res.name || prev.displayName,
          organization: res.organization || prev.organization,
          accountCreated: res.created_at || prev.accountCreated,
        }));
      })
      .catch(() => {
        // ignore
      });
  }, []);

  const handleSidebarNavigate = (page: string) => {
    // Navigate to the requested page
    onNavigate?.(page);
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "danger" as const, label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar - Static for consistent visibility */}
      <Sidebar 
        currentPage="settings" 
        onNavigate={handleSidebarNavigate}
        onLogout={onLogout}
        user={user}
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

              <h1 className="text-xl font-bold text-white">Account Settings</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Bell */}
              <div className="relative">
                <Bell size={20} className="text-zinc-400 hover:text-cyan-400 cursor-pointer transition-colors" />
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
                    className={`text-zinc-400 transition-transform duration-300 ${
                      showUserMenu ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl overflow-hidden z-50">
                    <button
                      onClick={() => {
                        onNavigate?.("dashboard");
                        setShowUserMenu(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition-colors flex items-center gap-2 text-zinc-300"
                    >
                      <Home size={16} />
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onLogout?.();
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
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <button
              onClick={onBack}
              className="hover:text-cyan-400 transition-colors"
            >
              Dashboard
            </button>
            <ChevronRight className="size-4" />
            <span className="text-white">Settings</span>
            <ChevronRight className="size-4" />
            <span className="text-white">Profile & Security</span>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Account Settings
            </h1>
            <p className="text-zinc-400">
              Manage your profile, security, and preferences.
            </p>
          </div>

          {/* Save Success Toast */}
          {saveSuccess && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">
                Changes saved successfully
              </span>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6">
            {/* Vertical Tabs Navigation */}
            <div className="col-span-3">
              <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                            : tab.id === "danger"
                            ? "text-red-400 hover:bg-red-500/10"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        }`}
                      >
                        <Icon className="size-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </Card>
            </div>

            {/* Tab Content */}
            <div className="col-span-9 space-y-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <>
                  <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Profile Information
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1">
                          Update your personal details and account information
                        </p>
                      </div>
                      {!isEditingProfile ? (
                        <Button
                          variant="outline"
                          onClick={() => setIsEditingProfile(true)}
                          className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                        >
                          <Edit3 className="size-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={handleSaveProfile}
                            disabled={saving}
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white disabled:opacity-50"
                          >
                            <Save className="size-4 mr-2" />
                            {saving ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setIsEditingProfile(false)}
                            className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                          >
                            <X className="size-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {/* Email (Read-only) */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                          <Mail className="size-4" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          disabled
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-zinc-600 mt-1">
                          Email cannot be changed
                        </p>
                      </div>

                      {/* Display Name */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                          <User className="size-4" />
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={profileData.displayName}
                          disabled={!isEditingProfile}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              displayName: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 border rounded-lg ${
                            isEditingProfile
                              ? "bg-zinc-900 border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      {/* Organization */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                          <Building className="size-4" />
                          Organization
                        </label>
                        <input
                          type="text"
                          value={profileData.organization}
                          disabled={!isEditingProfile}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              organization: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-2 border rounded-lg ${
                            isEditingProfile
                              ? "bg-zinc-900 border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                              : "bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                          }`}
                        />
                      </div>

                      {/* Role (Read-only) */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                          <Shield className="size-4" />
                          Account Role
                        </label>
                        <input
                          type="text"
                          value={profileData.role}
                          disabled
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed"
                        />
                      </div>

                      {/* Account Created (Read-only) */}
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 flex items-center gap-2">
                          <Calendar className="size-4" />
                          Account Created
                        </label>
                        <input
                          type="text"
                          value={formatDateIST(profileData.accountCreated) || "Not available"}
                          disabled
                          className="w-full px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </Card>

                </>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <>
                  {/* Password Management */}
                  <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Password Management
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={passwordData.current}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                current: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                            placeholder="Enter current password"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">
                          New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.new}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              new: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-zinc-400 mb-2 block">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={passwordData.confirm}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirm: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <p className="text-xs text-zinc-500">
                        Minimum 8 characters, strong password recommended
                      </p>
                      <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                        Update Password
                      </Button>
                    </div>
                  </Card>

                  {/* OAuth Connections */}
                  <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-800 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">
                      Connected Accounts
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <Chrome className="size-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Google</p>
                            <p className="text-xs text-zinc-500">
                              {profileData.email}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setGoogleConnected(!googleConnected)}
                          className={
                            googleConnected
                              ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          }
                        >
                          {googleConnected ? "Disconnect" : "Connect"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </>
              )}

              {/* Danger Zone Tab */}
              {activeTab === "danger" && (
                <Card className="bg-gradient-to-br from-red-500/5 to-zinc-950/50 border-red-500/30 p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <AlertTriangle className="size-6 text-red-400" />
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">
                        Delete Account
                      </h3>
                      <p className="text-sm text-zinc-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                    <p className="text-sm text-red-400 mb-4">
                      ⚠️ Warning: This action is irreversible. All your data will
                      be permanently deleted, including:
                    </p>
                    <ul className="text-sm text-zinc-400 space-y-1 ml-6">
                      <li>• All file analysis history</li>
                      <li>• Account settings and preferences</li>
                      <li>• Audit logs and metadata</li>
                      <li>• Any stored configurations</li>
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="delete-confirm"
                      checked={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-red-500 focus:ring-2 focus:ring-red-500/50"
                    />
                    <label
                      htmlFor="delete-confirm"
                      className="text-sm text-zinc-300 cursor-pointer"
                    >
                      I understand that this action is permanent and cannot be
                      undone. All my data will be deleted immediately.
                    </label>
                  </div>

                  <Button
                    disabled={!deleteConfirm || deleting}
                    className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={async () => {
                      try {
                        setDeleting(true);
                        await deleteAccountApi();
                        onLogout?.();
                      } catch (error) {
                        alert("Failed to delete account. Please try again.");
                      } finally {
                        setDeleting(false);
                      }
                    }}
                  >
                    <Trash2 className="size-4 mr-2" />
                    {deleting ? "Deleting..." : "Delete My Account Permanently"}
                  </Button>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}