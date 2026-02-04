import {
  User,
  UserCheck,
  CheckCircle,
  Zap,
  Clock,
  Shield,
  FileText,
  BarChart3,
  Building2,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

interface ModesOfUsageSectionProps {
  onStartCleaning: () => void;
  onCreateAccount: () => void;
}

export function ModesOfUsageSection({
  onStartCleaning,
  onCreateAccount,
}: ModesOfUsageSectionProps) {
  const [hoveredCard, setHoveredCard] = useState<
    "normal" | "account" | null
  >(null);

  return (
    <section id="modes" className="relative bg-zinc-950 text-white py-12 sm:py-16 overflow-hidden">
      {/* Smooth gradient transition from previous section */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-zinc-950 via-zinc-950/50 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              Modes of Usage
            </span>
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed px-4">
            Choose the mode that fits your needs — no login
            required to get started
          </p>
        </div>

        

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 max-w-6xl mx-auto mt-12">
          {/* Normal User Mode Card */}
          <Card
            onMouseEnter={() => setHoveredCard("normal")}
            onMouseLeave={() => setHoveredCard(null)}
            className="
             relative group overflow-hidden
             border-2 border-cyan-500/30
             hover:border-cyan-400/60
             bg-gradient-to-br from-cyan-900/40 via-zinc-900/60 to-cyan-950/50
             backdrop-blur-xl
             p-6 sm:p-8 rounded-2xl
             transition-all duration-500
             hover:-translate-y-1
             hover:scale-[1.02]
             shadow-[0_8px_32px_-8px_rgba(6,182,212,0.3)]
             hover:shadow-[0_12px_48px_-12px_rgba(6,182,212,0.5),0_0_0_1px_rgba(6,182,212,0.3)]
           "
            style={{
              animation: "floatSubtle 6s ease-in-out infinite",
            }}
          >
            {/* Subtle ambient edge glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.08] via-transparent to-cyan-600/[0.05] opacity-60 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/[0.12] via-transparent to-cyan-500/[0.08] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon with circular background */}
              <div className="
                mb-3 sm:mb-4 inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl 
                bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 
                border border-cyan-500/20 
                transition-all duration-500
                group-hover:border-cyan-500/30
                group-hover:-translate-y-1
                group-hover:shadow-[0_4px_12px_-2px_rgba(6,182,212,0.15)]
              ">
                <User
                  className="size-5 sm:size-6 text-cyan-400 transition-transform duration-300"
                  strokeWidth={2}
                />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-1.5 text-white">
                Normal User Mode
              </h3>

              {/* Subtitle */}
              <p className="text-cyan-400 font-semibold mb-4 text-sm">
                No Login Required
              </p>

              {/* Description */}
              <p className="text-zinc-400 leading-relaxed mb-6 text-sm">
                Get started instantly without creating an
                account. Perfect for quick, one-time metadata
                cleaning with complete privacy.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckCircle
                      className="size-4 text-cyan-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      No Account Required
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Start using immediately
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Zap
                      className="size-4 text-cyan-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      Remove All Metadata
                    </p>
                    <p className="text-zinc-500 text-xs">
                      One-click complete removal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Clock
                      className="size-4 text-cyan-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      Daily Limit: 10 Files
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Credit-based usage
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Shield
                      className="size-4 text-cyan-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      No Tracking, No Storage
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Complete anonymity
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="sm"
                onClick={onStartCleaning}
                className="
                  w-full 
                  bg-transparent
                  border-2 border-cyan-400
                  hover:border-cyan-300
                  text-white font-semibold py-4 rounded-xl 
                  shadow-[0_12px_48px_-12px_rgba(6,182,212,0.4),0_0_0_1px_rgba(6,182,212,0.5)]
                  hover:shadow-[0_16px_64px_-16px_rgba(6,182,212,0.6),0_0_48px_-8px_rgba(6,182,212,0.5),0_0_0_1px_rgba(6,182,212,0.7)]
                  transition-all duration-300 
                  hover:scale-[1.05] 
                  active:scale-[0.98]
                  relative overflow-hidden
                  before:absolute before:inset-0 
                  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                  before:translate-x-[-200%] hover:before:translate-x-[200%]
                  before:transition-transform before:duration-700
                  animate-pulse-cyan
                  text-sm
                "
              >
                <span className="relative z-10">Start Cleaning Now</span>
              </Button>
            </div>
          </Card>

          {/* Account Mode Card */}
          <Card
            onMouseEnter={() => setHoveredCard("account")}
            onMouseLeave={() => setHoveredCard(null)}
            className="
             relative group overflow-hidden
             border-2 border-purple-500/50
             hover:border-purple-400/80
             bg-gradient-to-br from-purple-900/50 via-violet-900/40 to-purple-950/60
             backdrop-blur-xl
             p-6 sm:p-8 rounded-2xl
             transition-all duration-500
             hover:-translate-y-1
             hover:scale-[1.02]
             shadow-[0_12px_48px_-12px_rgba(168,85,247,0.4),0_0_0_1px_rgba(168,85,247,0.5)]
             hover:shadow-[0_16px_64px_-16px_rgba(168,85,247,0.6),0_0_48px_-8px_rgba(168,85,247,0.5),0_0_0_1px_rgba(168,85,247,0.7)]
           "
           style={{
             animation: "floatSubtle 6s ease-in-out infinite",
             animationDelay: "0.3s",
           }}
          >
            {/* Subtle ambient edge glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.10] via-violet-500/[0.08] to-purple-600/[0.10] opacity-70 rounded-2xl pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/[0.15] via-violet-400/[0.12] to-purple-500/[0.15] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              {/* Icon and Badge Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                {/* Icon with circular background */}
                <div className="
                  inline-flex p-2.5 sm:p-3 rounded-lg sm:rounded-xl
                  bg-gradient-to-br from-purple-500/10 to-purple-600/10
                  border border-purple-500/30
                  transition-all duration-500
                  group-hover:border-purple-400/50
                  group-hover:-translate-y-1
                  group-hover:shadow-[0_4px_12px_-2px_rgba(168,85,247,0.25)]
                ">
                  <UserCheck
                    className="size-5 sm:size-6 text-purple-400 transition-transform duration-300"
                    strokeWidth={2}
                  />
                </div>

                {/* Recommended Badge */}
                <span className="
                  px-4 sm:px-6 py-2 sm:py-3 
                  bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 
                  text-white text-sm sm:text-xl font-bold rounded-full 
                  border border-purple-300/70 
                  whitespace-nowrap 
                  shadow-[0_0_25px_rgba(168,85,247,0.8),0_0_50px_rgba(168,85,247,0.4)]
                  hover:shadow-[0_0_35px_rgba(168,85,247,1),0_0_70px_rgba(168,85,247,0.6)]
                  transition-all duration-300
                  hover:scale-110
                  active:scale-95
                  cursor-default
                  relative overflow-hidden
                  before:absolute before:inset-0 
                  before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent
                  before:translate-x-[-200%] hover:before:translate-x-[200%]
                  before:transition-transform before:duration-700
                  animate-pulse-badge
                ">
                  <span className="relative z-10">Recommended</span>
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-1.5 text-white">
                Account Mode
              </h3>

              {/* Subtitle */}
              <p className="text-purple-400 font-semibold mb-4 text-sm">
                Advanced Features & Control
              </p>

              {/* Description */}
              <p className="text-zinc-400 leading-relaxed mb-6 text-sm">
                Unlock powerful features with an account. Choose what to clean,
                track history, and access advanced GDPR compliance tools.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckCircle
                      className="size-4 text-purple-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      Selective Metadata Removal
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Choose exactly what to clean
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <FileText
                      className="size-4 text-purple-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      Processing History
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Track all your cleaned files
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <BarChart3
                      className="size-4 text-purple-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      GDPR Compliance Reports
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Detailed analysis & exports
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Building2
                      className="size-4 text-purple-400"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-0.5">
                      Enterprise Options
                    </p>
                    <p className="text-zinc-500 text-xs">
                      Advanced forensic tools
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="sm"
                onClick={onCreateAccount}
                className="
                  w-full 
                  bg-gradient-to-r from-purple-600 via-purple-500 to-purple-600 
                  hover:from-purple-500 hover:via-purple-400 hover:to-purple-500 
                  text-white font-semibold py-4 rounded-xl 
                  shadow-lg shadow-purple-500/30 
                  hover:shadow-[0_0_30px_rgba(168,85,247,0.6),0_0_60px_rgba(168,85,247,0.3)] 
                  transition-all duration-300 
                  hover:scale-[1.05] 
                  active:scale-[0.98]
                  relative overflow-hidden
                  before:absolute before:inset-0 
                  before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                  before:translate-x-[-200%] hover:before:translate-x-[200%]
                  before:transition-transform before:duration-700
                  animate-pulse-slow
                  text-sm
                "
              >
                <span className="relative z-10">Create Account</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Custom keyframes for subtle floating animation */}
      <style>{`
        @keyframes floatSubtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.3);
          }
        }
        
        @keyframes pulse-cyan {
          0%, 100% {
            box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3);
          }
        }
        
        @keyframes pulse-badge {
          0%, 100% {
            box-shadow: 0 0 25px rgba(168, 85, 247, 0.8), 0 0 50px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 35px rgba(168, 85, 247, 1), 0 0 70px rgba(168, 85, 247, 0.6);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-cyan {
          animation: pulse-cyan 3s ease-in-out infinite;
        }
        
        .animate-pulse-badge {
          animation: pulse-badge 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
