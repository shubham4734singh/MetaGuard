import { Upload, ScanLine, Download, MoveRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload File",
    description: "Drag & drop supported",
    gradient: "from-cyan-500 to-blue-500",
    color: "text-cyan-400",
    glowColor: "shadow-cyan-500/50",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    cardGlow: "shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]",
    cardGlowHover: "hover:shadow-[0_0_40px_-5px_rgba(6,182,212,0.4)]",
    numberGlow: "drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Analyze Metadata",
    description: "Risk score generated",
    gradient: "from-blue-500 to-purple-500",
    color: "text-blue-400",
    glowColor: "shadow-blue-500/50",
    bgGradient: "from-blue-500/10 to-purple-500/10",
    cardGlow: "shadow-[0_0_25px_-5px_rgba(59,130,246,0.2)]",
    cardGlowHover: "hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.4)]",
    numberGlow: "drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]",
  },
  {
    number: "03",
    icon: Download,
    title: "Download Clean File",
    description: "Metadata removed",
    gradient: "from-purple-500 to-emerald-500",
    color: "text-emerald-400",
    glowColor: "shadow-emerald-500/50",
    bgGradient: "from-emerald-500/10 to-cyan-500/10",
    cardGlow: "shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]",
    cardGlowHover: "hover:shadow-[0_0_40px_-5px_rgba(16,185,129,0.4)]",
    numberGlow: "drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative bg-zinc-950 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-zinc-950 to-zinc-950" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4">
            Simple, secure, and straightforward — get started in three easy steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line - visible on larger screens */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/40 to-emerald-500/20 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className={`
                    relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm 
                    border border-zinc-800 rounded-2xl p-6 sm:p-8 h-full 
                    transition-all duration-500 
                    hover:border-transparent hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-2xl 
                    overflow-hidden
                    ${step.cardGlow}
                    ${step.cardGlowHover}
                  `}>
                    {/* Gradient border on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} style={{ margin: '-1px', borderRadius: 'inherit' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-2xl" />
                    
                    {/* Glow effect */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="mb-6 sm:mb-8">
                        <div className={`text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 mb-4 sm:mb-6 ${step.numberGlow}`}>
                          {step.number}
                        </div>
                        <div className={`
                          group/icon
                          inline-flex p-3 sm:p-4 rounded-xl sm:rounded-2xl 
                          bg-gradient-to-br ${step.bgGradient}
                          backdrop-blur-sm
                          border border-zinc-700/50
                          shadow-lg ${step.glowColor}
                          transition-all duration-500
                          group-hover:scale-110 
                          group-hover:shadow-2xl
                          group-hover:border-zinc-600
                          relative
                        `}>
                          {/* Inner glow overlay */}
                          <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/icon:opacity-100 transition-opacity duration-500" />
                          
                          <Icon 
                            className={`size-8 sm:size-10 ${step.color} relative z-10 drop-shadow-[0_0_10px_currentColor] group-hover:drop-shadow-[0_0_16px_currentColor] transition-all duration-500`} 
                            strokeWidth={1.5} 
                          />
                        </div>
                      </div>
                      
                      <h3 className={`text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:bg-gradient-to-r group-hover:${step.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                        {step.title}
                      </h3>
                      <p className="text-zinc-400 group-hover:text-zinc-300 text-base sm:text-lg transition-colors">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Animated arrow between steps - visible on md+ screens */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 items-center justify-center">
                      <div className="bg-zinc-950 rounded-full p-2 sm:p-3 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-500 group-hover:scale-110 transition-all duration-300">
                        <MoveRight className="size-4 sm:size-5 text-cyan-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}