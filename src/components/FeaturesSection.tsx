import { Search, Shield, Eraser, CheckCircle2, Sparkles, Zap, Lock, Eye } from "lucide-react";
import { Card } from "./ui/card";
import { useState } from "react";

const features = [
  {
    icon: Search,
    title: "AI Metadata Detection",
    description: "Advanced AI algorithms identify hidden metadata embedded deep within your files.",
    gradient: "from-cyan-500 to-blue-500",
    bgGradient: "from-cyan-500/10 to-blue-500/10",
    shadowColor: "shadow-cyan-500/30",
    iconColor: "text-cyan-400",
    badge: "Smart",
  },
  {
    icon: Shield,
    title: "Privacy Risk Scoring",
    description: "Instantly assess privacy exposure with intelligent risk scores and recommendations.",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-500/10 to-indigo-500/10",
    shadowColor: "shadow-blue-500/30",
    iconColor: "text-blue-400",
    badge: "Secure",
  },
  {
    icon: Eraser,
    title: "Secure Removal",
    description: "Remove metadata without damaging file integrity using enterprise-grade algorithms.",
    gradient: "from-purple-500 to-pink-500",
    bgGradient: "from-purple-500/10 to-pink-500/10",
    shadowColor: "shadow-purple-500/30",
    iconColor: "text-purple-400",
    badge: "Safe",
  },
  {
    icon: CheckCircle2,
    title: "Compliance Ready",
    description: "Meet GDPR, HIPAA, and enterprise compliance standards with certified processes.",
    gradient: "from-emerald-500 to-cyan-500",
    bgGradient: "from-emerald-500/10 to-cyan-500/10",
    shadowColor: "shadow-emerald-500/30",
    iconColor: "text-emerald-400",
    badge: "Certified",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process files in seconds with our optimized cloud infrastructure.",
    gradient: "from-yellow-500 to-orange-500",
    bgGradient: "from-yellow-500/10 to-orange-500/10",
    shadowColor: "shadow-yellow-500/30",
    iconColor: "text-yellow-400",
    badge: "Fast",
  },
  {
    icon: Lock,
    title: "Zero Storage",
    description: "Files are processed in real-time and never stored on our servers.",
    gradient: "from-red-500 to-pink-500",
    bgGradient: "from-red-500/10 to-pink-500/10",
    shadowColor: "shadow-red-500/30",
    iconColor: "text-red-400",
    badge: "Private",
  },
  {
    icon: Eye,
    title: "Deep Analysis",
    description: "Comprehensive scanning of EXIF, XMP, IPTC, and custom metadata fields.",
    gradient: "from-indigo-500 to-purple-500",
    bgGradient: "from-indigo-500/10 to-purple-500/10",
    shadowColor: "shadow-indigo-500/30",
    iconColor: "text-indigo-400",
    badge: "Advanced",
  },
  {
    icon: Sparkles,
    title: "Batch Processing",
    description: "Upload and clean multiple files simultaneously with bulk operations.",
    gradient: "from-pink-500 to-rose-500",
    bgGradient: "from-pink-500/10 to-rose-500/10",
    shadowColor: "shadow-pink-500/30",
    iconColor: "text-pink-400",
    badge: "Pro",
  },
];

export function FeaturesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative bg-zinc-950 text-white py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(0,0,0,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 backdrop-blur-sm mb-6 group hover:border-cyan-500/60 transition-all duration-300">
            <Sparkles className="size-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="text-sm text-cyan-400 font-semibold">Core Capabilities</span>
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-white to-zinc-400 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          
          <p className="text-zinc-400 text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Enterprise-grade metadata protection with 
            <span className="text-cyan-400 font-medium"> AI-powered detection</span>, 
            instant risk scoring, and compliance-ready workflows
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;
            
            return (
              <Card
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 backdrop-blur-sm border-zinc-800 p-8 transition-all duration-500 hover:border-transparent hover:-translate-y-3 hover:shadow-2xl cursor-pointer group overflow-hidden"
                style={{
                  transitionDelay: `${index * 30}ms`
                }}
              >
                {/* Animated gradient border on hover */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`}
                  style={{ padding: '2px' }}
                >
                  <div className="absolute inset-[2px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 rounded-lg" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon with badge */}
                  <div className="mb-6 relative">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.bgGradient} border border-zinc-800 group-hover:border-transparent group-hover:shadow-xl ${feature.shadowColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className={`size-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={2} />
                    </div>
                    {/* Badge */}
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r ${feature.gradient} text-white text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-100 scale-90`}>
                      {feature.badge}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-300 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-zinc-500 group-hover:text-zinc-300 transition-colors leading-relaxed flex-1 text-sm">
                    {feature.description}
                  </p>

                  {/* Animated underline on hover */}
                  <div className={`h-1 mt-6 bg-gradient-to-r ${feature.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                </div>

                {/* Decorative elements */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-all duration-700`} />
                <div className={`absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 blur-3xl transition-all duration-700`} />

                {/* Sparkle effect on hover */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" />
                    <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                    <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-zinc-400 mb-6">
            Ready to protect your privacy?
          </p>
          <div className="inline-flex gap-4">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white rounded-xl font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-300">
              <span className="flex items-center gap-2">
                Get Started Free
                <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
