import { Upload, ScanLine, Download, MoveRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload File",
    description: "Drag & drop supported",
    gradient: "from-cyan-500 to-blue-500",
    color: "text-cyan-400",
  },
  {
    number: "02",
    icon: ScanLine,
    title: "Analyze Metadata",
    description: "Risk score generated",
    gradient: "from-blue-500 to-purple-500",
    color: "text-blue-400",
  },
  {
    number: "03",
    icon: Download,
    title: "Download Clean File",
    description: "Metadata removed",
    gradient: "from-purple-500 to-emerald-500",
    color: "text-emerald-400",
  },
];

export function HowItWorksSection() {
  return (
    <section className="relative bg-zinc-950 text-white py-24 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-zinc-950 to-zinc-950" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 mb-6">
            <span className="text-sm text-cyan-400 font-medium">Simple Process</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Simple, secure, and straightforward — get started in three easy steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/40 to-emerald-500/20 -translate-y-1/2 z-0" />
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative group">
                  <div className="relative bg-gradient-to-br from-zinc-900/80 to-zinc-950/80 backdrop-blur-sm border border-zinc-800 rounded-2xl p-8 h-full transition-all duration-500 hover:border-transparent hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
                    {/* Gradient border on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} style={{ margin: '-1px', borderRadius: 'inherit' }} />
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-2xl" />
                    
                    {/* Glow effect */}
                    <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                    
                    <div className="relative z-10">
                      <div className="mb-8">
                        <div className={`text-7xl font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent opacity-20 mb-6`}>
                          {step.number}
                        </div>
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-500`}>
                          <Icon className={`size-10 ${step.color} drop-shadow-[0_0_10px_currentColor]`} strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      <h3 className={`text-2xl font-bold mb-3 group-hover:bg-gradient-to-r group-hover:${step.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                        {step.title}
                      </h3>
                      <p className="text-zinc-400 group-hover:text-zinc-300 text-lg transition-colors">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Animated arrow between steps */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20 items-center justify-center">
                      <div className="bg-zinc-950 rounded-full p-3 border-2 border-cyan-500/30 shadow-lg shadow-cyan-500/20 group-hover:border-cyan-500 group-hover:scale-110 transition-all duration-300">
                        <MoveRight className="size-5 text-cyan-400" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-zinc-400 mb-4">Ready to protect your files?</p>
          <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}