import { Shield, Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";


export function HeroSection({
  onSignIn,
  onUpload,
}: {
  onSignIn?: () => void;
  onUpload?: () => void;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () =>
      window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen bg-zinc-950 text-white overflow-hidden flex items-center pt-20 sm:pt-24 lg:pt-16 pb-12 sm:pb-16 lg:pb-0">
      {/* Cursor Glow */}
      <div
        className="pointer-events-none fixed inset-0 z-30 hidden md:block"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6,182,212,0.15), transparent 80%)`,
        }}
      />

      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] sm:bg-[size:4rem_4rem] md:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />

      {/* Floating Orbs - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="hidden md:block absolute bottom-1/4 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="hidden md:block absolute top-1/2 left-1/2 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      />

      {/* CONTENT */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-stretch">
          {/* LEFT SIDE */}
          <div className="flex flex-col gap-4 sm:gap-6 justify-center text-center lg:text-left overflow-visible">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none pb-2">
              <span className="block bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-transparent pb-1">
                MetaGuard
              </span>
            </h1>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-relaxed pb-3">
              <span className="block bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent pb-2">
                Your Files Tell a Story.
              </span>
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent pb-2">
                Decide What They Say.
              </span>
            </h2>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="group relative bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 text-white shadow-2xl shadow-cyan-500/40 hover:shadow-cyan-500/70 transition-all duration-500 text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 rounded-xl font-semibold overflow-hidden w-full sm:w-auto"
                onClick={onUpload}
              >
                <Zap className="size-4 sm:size-5 mr-2" />
                Start Analyzing
                <ArrowRight className="size-4 sm:size-5 ml-2" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm text-zinc-300 hover:bg-zinc-800/80 hover:border-cyan-500/50 hover:text-white transition-all duration-300 text-base sm:text-lg px-6 sm:px-10 py-5 sm:py-7 rounded-xl font-semibold w-full sm:w-auto"
                onClick={onSignIn}
              >
                <Shield className="size-4 sm:size-5 mr-2" />
                Sign In
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE – 3D GRAPHIC */}
          <div className="block relative w-full h-full min-h-[400px] lg:min-h-[600px]">
            <div className="relative w-full h-full flex items-center justify-center">

              {/* Background Glow */}
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse-slow" />
              </div>

              {/* Rotating Rings */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow z-0">
                <div className="w-[400px] h-[400px] border-2 border-dashed border-cyan-500/30 rounded-full" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center animate-spin-reverse z-0">
                <div className="w-[450px] h-[450px] border border-blue-500/20 rounded-full" />
              </div>

              {/* Main Shield */}
              <div className="relative z-10 group">

                {/* Pulse Rings */}
                <div className="absolute inset-0 flex items-center justify-center animate-ping-slow opacity-30">
                  <div className="w-80 h-80 border-2 border-cyan-500 rounded-full" />
                </div>

                <div
                  className="absolute inset-0 flex items-center justify-center animate-ping-slow opacity-20"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="w-96 h-96 border-2 border-blue-500 rounded-full" />
                </div>

                {/* Card */}
                <div className="relative transform group-hover:scale-105 transition-transform duration-500 z-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-3xl blur-xl" />

                  <div className="relative bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-2xl p-16 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-500">

                    {/* Icons */}
                    <div className="relative">
                      <Shield className="size-48 text-cyan-400/20" strokeWidth={1.5} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="size-24 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>

                    {/* Enhanced Scanning Effects */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      {/* Primary Scan Line */}
                      <div 
                        className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80 shadow-[0_0_15px_rgba(6,182,212,0.8)]"
                        style={{
                          top: "0%",
                          animation: "scan 3s linear infinite",
                        }}
                      />
                      
                      {/* Secondary Scan Line (slower) */}
                      <div 
                        className="absolute left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-60"
                        style={{
                          top: "0%",
                          animation: "scan 4s linear infinite",
                          animationDelay: "1.5s",
                        }}
                      />
                      
                      {/* Tertiary Fast Scan Line */}
                      <div 
                        className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50 shadow-[0_0_10px_rgba(6,182,212,0.6)]"
                        style={{
                          top: "0%",
                          animation: "scan 2s linear infinite",
                          animationDelay: "0.5s",
                        }}
                      />
                      
                      {/* Pulse Effect */}
                      <div 
                        className="absolute inset-0 bg-cyan-400/5"
                        style={{
                          animation: "scan-pulse 3s ease-in-out infinite",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Floating Label – Secure */}
                <div 
                  className="absolute z-30"
                  style={{
                    top: "calc(50% - 180px)",
                    left: "calc(50% + 200px)",
                  }}
                >
                  <div 
                    className="animate-float-secure bg-zinc-900/90 border border-cyan-500/50 rounded-2xl px-5 py-3 shadow-xl shadow-cyan-500/30 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-sm text-zinc-200 font-semibold">Secure</span>
                    </div>
                  </div>
                </div>

                {/* Floating Label – Protected */}
                <div
                  className="absolute z-30"
                  style={{
                    top: "calc(50% + 200px)",
                    left: "calc(50% - 240px)",
                  }}
                >
                  <div 
                    className="animate-float-protected bg-zinc-900/90 border border-blue-500/50 rounded-2xl px-5 py-3 shadow-xl shadow-blue-500/30 backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="size-5 text-cyan-400" />
                      <span className="text-sm text-zinc-200 font-semibold">Protected</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: -5%;
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            top: 105%;
            opacity: 0;
          }
        }

        @keyframes float-secure {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-15px) translateX(15px);
            opacity: 1;
          }
          50% {
            transform: translateY(-25px) translateX(0px);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-15px) translateX(-15px);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
        }

        @keyframes float-protected {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          25% {
            transform: translateY(15px) translateX(-15px);
            opacity: 1;
          }
          50% {
            transform: translateY(25px) translateX(0px);
            opacity: 0.9;
          }
          75% {
            transform: translateY(15px) translateX(15px);
            opacity: 1;
          }
          100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
        }

        @keyframes scan-pulse {
          0%, 100% {
            opacity: 0.05;
            background: linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.1) 50%, transparent 100%);
          }
          50% {
            opacity: 0.15;
            background: linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.2) 50%, transparent 100%);
          }
        }

        .animate-float-secure {
          animation: float-secure 5s ease-in-out infinite;
        }

        .animate-float-protected {
          animation: float-protected 5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}
