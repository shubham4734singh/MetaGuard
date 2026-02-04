import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";

const trustPoints = [
  {
    icon: ServerOff,
    title: "Files are not stored permanently",
    description:
      "All files are processed in memory and deleted immediately after processing",
    iconColor: "text-cyan-400",
    glowColor: "shadow-cyan-500/50",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    cardGlow: "shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]",
    cardGlowHover: "hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first processing",
    description:
      "Your data stays yours — we never access or analyze file contents",
    iconColor: "text-blue-400",
    glowColor: "shadow-blue-500/50",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
    cardGlow: "shadow-[0_0_20px_-5px_rgba(59,130,246,0.15)]",
    cardGlowHover: "hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]",
  },
  {
    icon: EyeOff,
    title: "No tracking, no profiling",
    description:
      "We don't track your activity or build user profiles",
    iconColor: "text-purple-400",
    glowColor: "shadow-purple-500/50",
    bgGradient: "from-purple-500/10 to-blue-500/10",
    cardGlow: "shadow-[0_0_20px_-5px_rgba(168,85,247,0.15)]",
    cardGlowHover: "hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]",
  },
  {
    icon: Lock,
    title: "Secure file handling",
    description:
      "End-to-end encryption ensures your files remain protected",
    iconColor: "text-emerald-400",
    glowColor: "shadow-emerald-500/50",
    bgGradient: "from-emerald-500/10 to-cyan-500/10",
    cardGlow: "shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]",
    cardGlowHover: "hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
  },
];

export function TrustSection() {
  return (
    <section
      id="trust"
      className="relative bg-zinc-950 text-white py-16 sm:py-20 lg:py-24 overflow-hidden"
    >
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="hidden md:block absolute top-0 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="hidden md:block absolute bottom-0 right-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            Built on Trust & Security
          </h2>

          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            We take your privacy seriously. Here's how we protect your data.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;

            return (
              <div key={index} className="relative">
                <div
                  className={`
                    relative flex gap-4 sm:gap-6 p-5 sm:p-6 lg:p-8 rounded-2xl
                    bg-zinc-900/70
                    border border-zinc-800
                    transition-all duration-300
                    hover:border-zinc-600
                    hover:-translate-y-[2px]
                    ${point.cardGlow}
                    ${point.cardGlowHover}
                  `}
                >
                  {/* Content */}
                  <div className="flex gap-4 sm:gap-6">
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`
                          group/icon
                          inline-flex p-3 sm:p-4 rounded-lg sm:rounded-xl
                          bg-gradient-to-br ${point.bgGradient}
                          backdrop-blur-sm
                          border border-zinc-700/50
                          shadow-lg ${point.glowColor}
                          transition-all duration-300
                          hover:scale-110
                          hover:shadow-xl hover:${point.glowColor}
                          hover:border-zinc-600
                          relative
                        `}
                      >
                        {/* Inner glow */}
                        <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-300" />
                        
                        <Icon
                          className={`size-6 sm:size-7 ${point.iconColor} relative z-10 drop-shadow-[0_0_8px_currentColor] group-hover/icon:drop-shadow-[0_0_12px_currentColor] transition-all duration-300`}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-2 text-white">
                        {point.title}
                      </h3>
                      <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}