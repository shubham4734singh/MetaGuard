import { ShieldCheck, Lock, EyeOff, ServerOff } from "lucide-react";

const trustPoints = [
  {
    icon: ServerOff,
    title: "Files are not stored permanently",
    description: "All files are processed in memory and deleted immediately after processing",
    gradient: "from-cyan-500 to-blue-500",
    iconColor: "text-cyan-400",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first processing",
    description: "Your data stays yours — we never access or analyze file contents",
    gradient: "from-blue-500 to-indigo-500",
    iconColor: "text-blue-400",
  },
  {
    icon: EyeOff,
    title: "No tracking, no profiling",
    description: "We don't track your activity or build user profiles",
    gradient: "from-purple-500 to-pink-500",
    iconColor: "text-purple-400",
  },
  {
    icon: Lock,
    title: "Secure file handling",
    description: "End-to-end encryption ensures your files remain protected",
    gradient: "from-emerald-500 to-cyan-500",
    iconColor: "text-emerald-400",
  },
];

export function TrustSection() {
  return (
    <section className="relative bg-zinc-900 text-white py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 backdrop-blur-sm mb-6 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="size-5 text-emerald-400" />
            <span className="text-sm text-emerald-400 font-semibold">Your Privacy, Guaranteed</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Built on Trust & Security
          </h2>
          <p className="text-zinc-400 text-xl max-w-2xl mx-auto leading-relaxed">
            We take your privacy seriously. Here's our commitment to keeping your data safe.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {trustPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative flex gap-6 p-8 bg-gradient-to-br from-zinc-950/50 to-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl transition-all duration-500 hover:border-transparent hover:-translate-y-1 overflow-hidden">
                  {/* Gradient border effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${point.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`} style={{ margin: '-1px', borderRadius: 'inherit' }} />
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-2xl" />
                  
                  {/* Decorative glow */}
                  <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${point.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex gap-6">
                    <div className="flex-shrink-0">
                      <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-lg group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500`}>
                        <Icon className={`size-7 ${point.iconColor}`} strokeWidth={1.5} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:${point.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}>
                        {point.title}
                      </h3>
                      <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust badges */}
        <div className="mt-20 flex flex-wrap justify-center items-center gap-12">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">256-bit</div>
            <div className="text-sm text-zinc-500 mt-1">Encryption</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ISO 27001</div>
            <div className="text-sm text-zinc-500 mt-1">Certified</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">GDPR</div>
            <div className="text-sm text-zinc-500 mt-1">Compliant</div>
          </div>
          <div className="w-px h-12 bg-zinc-800" />
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">SOC 2</div>
            <div className="text-sm text-zinc-500 mt-1">Type II</div>
          </div>
        </div>
      </div>
    </section>
  );
}
