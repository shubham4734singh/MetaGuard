import { useState, useEffect } from "react";

import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { ModesOfUsageSection } from "./components/ModesOfUsageSection";
import { TrustSection } from "./components/TrustSection";
import { Footer } from "./components/Footer";

import { AuthPage } from "./components/AuthPage";
import { UploadAnalysisPage } from "./components/UploadAnalysisPage";
import { AuthenticatedUploadPage } from "./components/AuthenticatedUploadPage";
import { Dashboard } from "./components/Dashboard";
import { FileAnalysisPage } from "./components/FileAnalysisPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import { PoliciesPage } from "./components/PoliciesPage";
import { AuthLayout } from "./components/AuthLayout";

import { getCurrentUser } from "./services/auth";

type Page =
  | "home"
  | "auth"
  | "upload"
  | "dashboard"
  | "file-analysis"
  | "history"
  | "settings"
  | "policies";

export default function App() {
  // ---------------- PAGE STATE ----------------
  const [currentPage, setCurrentPage] = useState<Page>("home");

  // ---------------- AUTH STATE ----------------
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("access")
  );

  // ---------------- USER STATE ----------------
  const [user, setUser] = useState<any>(null);

  // ---------------- FILE STATE ----------------
  const [selectedFileId, setSelectedFileId] = useState<string | undefined>();

  // ---------------- LOAD USER WHEN LOGGED IN ----------------
  useEffect(() => {
    if (isAuthenticated) {
      getCurrentUser()
        .then(setUser)
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // ---------------- UNAUTHORIZED HANDLER ----------------
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage("home");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  // ---------------- AUTH HANDLERS ----------------
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    getCurrentUser().then(setUser);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUser(null);
    setCurrentPage("home");
  };

  // ---------------- FILE VIEW ----------------
  const handleViewFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setCurrentPage("file-analysis");
  };

  // ======================================================
  // ====================== PAGES =========================
  // ======================================================

  // -------- AUTH PAGE --------
  if (currentPage === "auth") {
    return (
      <AuthPage
        onBack={() => setCurrentPage("home")}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // -------- UPLOAD - Route based on authentication --------
  if (currentPage === "upload") {
    // If not authenticated, show guest upload page
    if (!isAuthenticated) {
      return (
        <UploadAnalysisPage
          onBack={() => setCurrentPage("home")}
          onSignUp={() => setCurrentPage("auth")}
        />
      );
    }
    
    // If authenticated, show authenticated upload page with sidebar
    return (
      <AuthLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <AuthenticatedUploadPage user={user} />
      </AuthLayout>
    );
  }

  // -------- DASHBOARD --------
  if (currentPage === "dashboard") {
    if (!isAuthenticated) {
      return (
        <AuthPage
          onBack={() => setCurrentPage("home")}
          onAuthSuccess={handleAuthSuccess}
        />
      );
    }

    return (
      <AuthLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <Dashboard
          user={user}
          onLogout={handleLogout}
          onUpload={() => setCurrentPage("upload")}
          onHistory={() => setCurrentPage("history")}
          onSettings={() => setCurrentPage("settings")}
          onPolicies={() => setCurrentPage("policies")}
        />
      </AuthLayout>
    );
  }

  // -------- FILE ANALYSIS --------
  if (currentPage === "file-analysis") {
    return (
      <AuthLayout
        currentPage="dashboard"
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <FileAnalysisPage
          fileId={selectedFileId}
          onBack={() => setCurrentPage("dashboard")}
        />
      </AuthLayout>
    );
  }

  // -------- HISTORY --------
  if (currentPage === "history") {
    return (
      <AuthLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <HistoryPage user={user} onViewFile={handleViewFile} />
      </AuthLayout>
    );
  }

  // -------- SETTINGS --------
  if (currentPage === "settings") {
    return (
      <AuthLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <SettingsPage user={user} />
      </AuthLayout>
    );
  }

  // -------- POLICIES --------
  if (currentPage === "policies") {
    return (
      <AuthLayout
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        user={user}
      >
        <PoliciesPage user={user} />
      </AuthLayout>
    );
  }

  // -------- LANDING PAGE --------
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection
        onSignIn={() =>
          setCurrentPage(isAuthenticated ? "dashboard" : "auth")
        }
        onUpload={() => setCurrentPage("upload")}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <ModesOfUsageSection
        onStartCleaning={() => setCurrentPage("upload")}
        onCreateAccount={() => setCurrentPage("auth")}
      />
      <TrustSection />
      <Footer />
    </div>
  );
}
