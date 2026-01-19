import { useState, useEffect } from "react";

import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { TrustSection } from "./components/TrustSection";
import { Footer } from "./components/Footer";

import { AuthPage } from "./components/AuthPage";
import { UploadAnalysisPage } from "./components/UploadAnalysisPage";
import { AuthenticatedUploadPage } from "./components/AuthenticatedUploadPage";
import { Dashboard } from "./components/Dashboard";
import { FileAnalysisPage } from "./components/FileAnalysisPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";

import { getCurrentUser } from "./services/auth";

type Page =
  | "home"
  | "auth"
  | "upload"
  | "dashboard"
  | "file-analysis"
  | "history"
  | "settings";

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
        .then((data) => {
          console.log("USER FROM API:", data);
          setUser(data);
        })
        .catch((err) => {
          console.error("USER API ERROR", err);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, [isAuthenticated]);

  // Handle unauthorized responses
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsAuthenticated(false);
      setUser(null);
      setCurrentPage("home");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);



  // ---------------- AUTH HANDLERS ----------------
  const handleSignIn = () => {
    setCurrentPage(isAuthenticated ? "dashboard" : "auth");
  };

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

  // ---------------- NAVIGATION ----------------
  const handleUpload = () => {
    setCurrentPage("upload");
  };

  const handleViewFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setCurrentPage("file-analysis");
  };

  // ---------------- PAGES ----------------

  // Auth Page
  if (currentPage === "auth") {
    return (
      <AuthPage
        onBack={() => setCurrentPage("home")}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  // Upload Page (Guest)
  if (currentPage === "upload" && !isAuthenticated) {
    return (
      <UploadAnalysisPage
        onBack={() => setCurrentPage("home")}
        onSignUp={() => setCurrentPage("auth")}
      />
    );
  }

  // Upload Page (Authenticated)
  if (currentPage === "upload" && isAuthenticated) {
    return (
      <AuthenticatedUploadPage
        user={user}
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  // Dashboard (Protected)
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
      <Dashboard
        user={user}
        onUpload={() => setCurrentPage("upload")}
        onLogout={handleLogout}
        onHistory={() => setCurrentPage("history")}
        onSettings={() => setCurrentPage("settings")}
      />
    );
  }

  // File Analysis Page
  if (currentPage === "file-analysis") {
    return (
      <FileAnalysisPage
        fileId={selectedFileId}
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  // History Page
  if (currentPage === "history") {
    return (
      <HistoryPage
        user={user}
        onBack={() => setCurrentPage("dashboard")}
        onViewFile={handleViewFile}
      />
    );
  }

  // Settings Page
  if (currentPage === "settings") {
    return (
      <SettingsPage
        user={user}
        onBack={() => setCurrentPage("dashboard")}
      />
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-zinc-950">
      <HeroSection onSignIn={handleSignIn} onUpload={handleUpload} />
      <FeaturesSection />
      <HowItWorksSection />
      <TrustSection />
      <Footer />
    </div>
  );
}
