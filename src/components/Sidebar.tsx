import { useState } from "react";
import {
  LayoutDashboard,
  Upload,
  History,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  BarChart3,
  TrendingUp,
  Activity,
  Zap,
  UserCircle,
  Lock,
  Bell,
  Palette,
  Search,
  Filter,
  Calendar,
} from "lucide-react";

interface SidebarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  user?: {
    name?: string;
    email?: string;
  } | null;
}


export function Sidebar({
  currentPage = "dashboard",
  onNavigate,
  onLogout,
  user,
}: SidebarProps) {

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleItemClick = (itemId: string, hasSubItems: boolean = false) => {
    if (hasSubItems) {
      toggleMenu(itemId);
    }
    // Also navigate to the main page
    if (onNavigate) {
      onNavigate(itemId);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      subItems: [
        { id: "overview", label: "Overview", icon: Activity },
        { id: "analytics", label: "Analytics", icon: TrendingUp },
        { id: "quick-stats", label: "Quick Stats", icon: Zap },
      ],
    },
    {
      id: "upload",
      label: "Upload File",
      icon: Upload,
      subItems: [
        { id: "new-upload", label: "New Upload", icon: Upload },
        { id: "bulk-upload", label: "Bulk Upload", icon: FileText },
      ],
    },
    {
      id: "history",
      label: "History",
      icon: History,
      subItems: [
        { id: "recent-files", label: "Recent Files", icon: Clock },
        { id: "all-history", label: "All History", icon: FileText },
        { id: "search-history", label: "Search", icon: Search },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      subItems: [
        { id: "profile", label: "Profile", icon: UserCircle },
        { id: "security", label: "Security", icon: Lock },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "preferences", label: "Preferences", icon: Palette },
      ],
    },
  ];

  return (
    <div className="w-64 h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Shield className="size-6 text-cyan-400" />
          <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            MetaGuard
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedMenus.includes(item.id);
            const isActive = currentPage === item.id;

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => handleItemClick(item.id, item.subItems.length > 0)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-5" />
                    {item.label}
                  </div>
                  {item.subItems.length > 0 && (
                    <div className={`transition-transform duration-200 ${isActive ? "text-white" : "text-zinc-500"}`}>
                      {isExpanded ? (
                        <ChevronDown className="size-4" />
                      ) : (
                        <ChevronRight className="size-4" />
                      )}
                    </div>
                  )}
                </button>

                {/* Sub Menu Items */}
                {isExpanded && item.subItems.length > 0 && (
                  <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-zinc-800 pl-4 animate-in slide-in-from-top-2 duration-200">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate(item.id);
                            }
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-cyan-400 hover:bg-zinc-800/50 transition-all"
                        >
                          <SubIcon className="size-4" />
                          {subItem.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-zinc-800/50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
            {(user?.name || user?.email || "?")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">  {user?.name || user?.email || "Loading..."}</p>
            <p className="text-xs text-zinc-500 truncate">Pro Plan</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
