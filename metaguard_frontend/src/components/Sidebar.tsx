import { useState } from "react";
import {
  Home,
  Upload,
  History,
  Settings,
  LogOut,
  Sliders,
  Menu,
} from "lucide-react";

type Page =
  | "home"
  | "auth"
  | "upload"
  | "dashboard"
  | "file-analysis"
  | "history"
  | "settings"
  | "policies";

interface SidebarProps {
  currentPage?: Page;
  onNavigate?: (page: Page) => void;
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
  const [open, setOpen] = useState(false);

  const menuItems: Array<{ id: Page; label: string; icon: any }> = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "upload", label: "Upload File", icon: Upload },
    { id: "policies", label: "Policies", icon: Sliders },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* BACKGROUND BLUR */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
          onMouseEnter={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 flex flex-col
          ${open
            ? "w-64 bg-zinc-950 border-r border-zinc-800"
            : "w-16 bg-transparent"
          }
        `}
      >
        {/* MENU ICON */}
        <div className="h-16 flex items-center justify-center shrink-0">
          <Menu size={24} className="text-zinc-300" />
        </div>

        {open && (
          // Content Container
          <div className="flex flex-col flex-1 px-4 pb-10 overflow-hidden">

            {/* MENU ITEMS */}
            <nav className="flex flex-col gap-1 mt-2">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate?.(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${currentPage === id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </nav>

            {/* SPACER - Pushes content down */}
            <div className="flex-1" />

            {/* USER INFO */}
            {user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-zinc-900/60 overflow-hidden shrink-0">
                {/* FIX APPLIED:
                   1. Added 'leading-none' to remove line-height spacing.
                   2. Added 'items-center justify-center' strictly.
                   3. Added 'select-none' to prevent highlighting.
                */}
                <div className="shrink-0">
                  <div
                    className="
                        w-10 h-10
                        rounded-full
                        bg-gradient-to-br from-cyan-500 to-blue-500
                        flex items-center justify-center
                        text-white font-semibold
                        select-none
                        overflow-hidden
                      "
                  >
                    <span className="text-sm leading-none translate-y-[0.5px]">
                      {(user.name || user.email || "U")[0].toUpperCase()}
                    </span>
                  </div>
                </div>



                <div className="leading-tight overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-zinc-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* LOGOUT BUTTON */}
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-8 rounded-lg
                           text-sm font-medium text-red-400
                           hover:bg-red-500/10 transition-all shrink-0"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}