import { Shield, Lock, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

export function HeroSection({ onSignIn, onUpload }: { onSignIn?: () => void; onUpload?: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden min-h-screen flex items-center">
      {/* Mouse Tracker - Glowing Cursor Follower */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.15), transparent 80%)`,
        }}
      />

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10" />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text + Buttons */}
          <div className="space-y-8 z-10">
            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 backdrop-blur-sm hover:border-cyan-500/60 transition-all duration-300 cursor-pointer group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <Sparkles className="size-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span className="text-sm text-cyan-400 font-semibold">Enterprise Security Platform</span>
              <ArrowRight className="size-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-7xl lg:text-8xl font-black tracking-tight">
                <span className="block bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-transparent drop-shadow-2xl">
                  MetaGuard
                </span>
              </h1>
              
              <h2 className="text-4xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  Protect Your Files.
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient" style={{ animationDelay: '0.5s' }}>
                  Eliminate Metadata.
                </span>
              </h2>
            </div>
            
            <p className="text-xl text-zinc-400 max-w-xl leading-relaxed font-light">
              Advanced AI-powered metadata detection and removal. 
              <span className="text-cyan-400 font-medium"> Analyze, score, and clean</span> your files 
              to protect privacy and stay compliant with enterprise-grade security.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-8">
              <Button 
                size="lg" 
                className="group relative bg-gradient-to-r from-cyan-500 via-cyan-600 to-blue-600 hover:from-cyan-400 hover:via-cyan-500 hover:to-blue-500 text-white shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all duration-500 text-lg px-10 py-7 rounded-xl font-semibold overflow-hidden"
                onClick={onUpload}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <Zap className="size-5 mr-2 group-hover:rotate-12 transition-transform" />
                Start Analyzing
                <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="group border-2 border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm text-zinc-300 hover:bg-zinc-800/80 hover:border-cyan-500/50 hover:text-white transition-all duration-300 text-lg px-10 py-7 rounded-xl font-semibold"
                onClick={onSignIn}
              >
                <Shield className="size-5 mr-2 group-hover:scale-110 transition-transform" />
                Sign In
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-zinc-800/50">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-sm text-zinc-500">Files Analyzed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-zinc-500">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500K+</div>
                <div className="text-sm text-zinc-500">Metadata Removed</div>
              </div>
            </div>
          </div>

          {/* Right: 3D Interactive Graphic */}
          <div className="relative hidden lg:block">
            <div className="relative h-[700px] flex items-center justify-center">
              {/* Animated Background Gradient */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse-slow" />
              </div>

              {/* Rotating Ring */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                <div className="w-[400px] h-[400px] border-2 border-dashed border-cyan-500/30 rounded-full" />
              </div>

              {/* Counter Rotating Ring */}
              <div className="absolute inset-0 flex items-center justify-center animate-spin-reverse">
                <div className="w-[450px] h-[450px] border border-blue-500/20 rounded-full" />
              </div>

              {/* Main Shield Container */}
              <div className="relative z-10 group">
                {/* Outer Glow Rings */}
                <div className="absolute inset-0 flex items-center justify-center animate-ping-slow opacity-30">
                  <div className="w-80 h-80 border-2 border-cyan-500 rounded-full" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center animate-ping-slow opacity-20" style={{ animationDelay: '1s' }}>
                  <div className="w-96 h-96 border-2 border-blue-500 rounded-full" />
                </div>

                {/* Central Card with 3D Effect */}
                <div className="relative transform group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-3xl blur-xl" />
                  <div className="relative bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 backdrop-blur-2xl p-16 rounded-3xl border border-cyan-500/40 shadow-2xl shadow-cyan-500/30 group-hover:border-cyan-500/60 transition-all duration-500">
                    {/* Shield Icon */}
                    <div className="relative">
                      <Shield className="size-48 text-cyan-400/20" strokeWidth={1.5} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="size-24 text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    </div>

                    {/* Scanning Line Effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 right-20 animate-float">
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-cyan-500/50 rounded-2xl p-5 shadow-xl shadow-cyan-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm text-zinc-200 font-semibold">Secure</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-20 left-16 animate-float" style={{ animationDelay: '1s' }}>
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-blue-500/50 rounded-2xl p-5 shadow-xl shadow-blue-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-cyan-400" />
                    <span className="text-sm text-zinc-200 font-semibold">Protected</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 right-10 animate-float" style={{ animationDelay: '2s' }}>
                <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 border border-purple-500/50 rounded-2xl p-5 shadow-xl shadow-purple-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <Sparkles className="size-5 text-purple-400" />
                    <span className="text-sm text-zinc-200 font-semibold">AI-Powered</span>
                  </div>
                </div>
              </div>

              {/* Floating Orbs */}
              <div className="absolute top-16 left-12 w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-xl opacity-70 animate-pulse" />
              <div className="absolute bottom-24 right-24 w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-25px) translateX(10px); }
        }

        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        @keyframes ping-slow {
          0% { transform: scale(0.95); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(0.95); opacity: 0.3; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scan {
          animation: scan 3s linear infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
