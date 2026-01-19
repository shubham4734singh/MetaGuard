import { useState } from "react";
import { Shield, Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import * as TabsPrimitive from "@radix-ui/react-tabs@1.1.3";
import { login } from "../services/auth"; // ✅ ADDED
import { signup } from "../services/auth";
import { GoogleLogin } from "@react-oauth/google";
import api from "../services/api";



export function AuthPage({
  onBack,
  onAuthSuccess,
}: {
  onBack?: () => void;
  onAuthSuccess?: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");

  // ✅ ADDED STATE (LOGIC ONLY)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  // ✅ ADDED HANDLER (LOGIC ONLY)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(username, password);
      onAuthSuccess?.();
    } catch (err) {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signup(username, password);
      onAuthSuccess?.();
    } catch {
      setError("Signup failed");
    }
  };


  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back button */}
      {onBack && (
        <button
          onClick={() => onBack()}
          className="absolute top-6 left-6 flex items-center gap-2 text-zinc-400 hover:text-cyan-400 transition-colors z-50"
        >
          <ArrowLeft className="size-4" />
          <span className="text-sm">Back to Home</span>
        </button>
      )}

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

      {/* Auth Card */}
      <div className="relative w-full max-w-md">
        <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-8">
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-50 rounded-2xl" style={{ margin: '-1px', zIndex: -1 }} />
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl" style={{ zIndex: -1 }} />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                <Shield className="size-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                MetaGuard
              </h1>
            </div>
            <p className="text-sm text-zinc-400">
              Secure access to your privacy dashboard
            </p>
          </div>

          {/* Tabs */}
          <TabsPrimitive.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsPrimitive.List className="grid w-full grid-cols-2 mb-6 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1">
              <TabsPrimitive.Trigger
                value="signin"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === "signin"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-zinc-400 hover:text-zinc-300"
                  }`}
              >
                Sign In
              </TabsPrimitive.Trigger>
              <TabsPrimitive.Trigger
                value="signup"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${activeTab === "signup"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-zinc-400 hover:text-zinc-300"
                  }`}
              >
                Sign Up
              </TabsPrimitive.Trigger>
            </TabsPrimitive.List>

            {/* Sign In Tab */}
            <TabsPrimitive.Content value="signin" className="space-y-6">
              {/* Google Sign In */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await api.post("/api/auth/google/", {
                      token: credentialResponse.credential,
                    });

                    localStorage.setItem("access", res.data.access);
                    localStorage.setItem("refresh", res.data.refresh);

                    onAuthSuccess?.();
                  } catch (err) {
                    alert("Google login failed");
                  }
                }}
                onError={() => {
                  alert("Google login failed");
                }}
                useOneTap={false}
                render={(renderProps) => (
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300 h-11 font-medium"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <svg className="size-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                )}
              />


              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-zinc-900 px-2 text-zinc-500">or sign in with email</span>
                </div>
              </div>

              {/* Email Sign In Form */}
              <form className="space-y-4" onSubmit={handleSignIn}>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="you@example.com"
                    className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />

                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Sign In
                </Button>
              </form>

              <p className="text-center text-sm text-zinc-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signup")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign up
                </button>
              </p>
            </TabsPrimitive.Content>

            {/* Sign Up Tab */}
            <TabsPrimitive.Content value="signup" className="space-y-6">
              {/* Google Sign Up */}
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    const res = await api.post("/api/auth/google/", {
                      token: credentialResponse.credential,
                    });

                    localStorage.setItem("access", res.data.access);
                    localStorage.setItem("refresh", res.data.refresh);

                    onAuthSuccess?.();
                  } catch {
                    alert("Google login failed");
                  }
                }}
                onError={() => alert("Google login failed")}
                useOneTap={false}
                render={(renderProps) => (
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-zinc-100 text-zinc-900 border-zinc-300 h-11 font-medium"
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                  >
                    <svg className="size-5 mr-3" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continue with Google
                  </Button>
                )}
              />


              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-zinc-900 px-2 text-zinc-500">or sign up with email</span>
                </div>
              </div>

              {/* Email Sign Up Form */}
              <form className="space-y-4" onSubmit={handleSignUp}>

                <Input
                  id="signup-email"
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20"
                />


                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-zinc-300">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="bg-zinc-900/50 border-zinc-800 text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:ring-cyan-500/20 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" className="border-zinc-700 data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500" />
                  <label
                    htmlFor="terms"
                    className="text-sm text-zinc-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {error && (
                  <p className="text-center text-sm text-red-400">
                    {error}
                  </p>
                )}


                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300"
                >
                  Create Account
                </Button>
              </form>

              <p className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("signin")}
                  className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </TabsPrimitive.Content>
          </TabsPrimitive.Root>

          {/* Security Reassurance */}
          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
              <Lock className="size-3" />
              <span>Your credentials are encrypted and securely handled.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
