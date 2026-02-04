import { Shield, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const links = [
    { label: "MetaGuard", href: "#" },
    { label: "Powerful Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Modes of Usage", href: "#modes" },
    { label: "Built on Trust & Security", href: "#trust" },
  ];

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="relative bg-zinc-950 text-white border-t border-zinc-800 overflow-hidden">
      {/* Gradient accents */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-14 lg:gap-24 mb-6 sm:mb-8 max-w-6xl mx-auto">
          {/* Logo, Tagline & Social Links */}
          <div className="space-y-3 sm:space-y-4 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg">
                <Shield className="size-5 sm:size-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">MetaGuard</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-sm sm:text-base px-4 md:px-0">
              Metadata protection made simple. Enterprise-grade security for everyone.
            </p>
            <div className="pt-1 sm:pt-2">
              <h3 className="font-semibold mb-2 sm:mb-3 text-white text-sm sm:text-base">Follow Us</h3>
              <div className="flex gap-2 sm:gap-3 justify-center md:justify-start">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className="p-1.5 sm:p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300 group"
                    >
                      <Icon className="size-4 sm:size-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Links - All in One Column */}
          <div className="text-center md:text-left md:pl-8">
            <h3 className="font-semibold mb-3 sm:mb-4 text-white text-sm sm:text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-zinc-400 hover:text-cyan-400 transition-colors duration-300 w-fit text-sm sm:text-base mx-auto md:mx-0"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-zinc-500 text-center md:text-left">
            © {new Date().getFullYear()} MetaGuard. All rights reserved.
          </p>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-zinc-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}