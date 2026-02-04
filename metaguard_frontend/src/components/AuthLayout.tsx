import { Sidebar } from "./Sidebar";

type Page =
  | "home"
  | "auth"
  | "upload"
  | "dashboard"
  | "file-analysis"
  | "history"
  | "settings"
  | "policies";

export function AuthLayout({
  currentPage,
  onNavigate,
  onLogout,
  user,
  children,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  user?: any;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      
      {/* Hamburger menu (floating, does not affect layout) */}
      <div className="fixed top-4 left-4 z-50">
        <Sidebar
          currentPage={currentPage}
          onNavigate={onNavigate}
          onLogout={onLogout}
          user={user}
        />
      </div>

      {/* Page content — NO padding, NO flex, NO height forcing */}
      <main className="relative z-10 w-full">
        {children}
      </main>

    </div>
  );
}
