import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API Docs", href: "#api" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  Legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
    { name: "GDPR", href: "#" },
  ],
  Support: [
    { name: "Help Center", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "API Status", href: "#" },
    { name: "Community", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/30 bg-background">
      <div className="absolute inset-0 dot-pattern opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Logo size="lg" className="mb-5" />
              <p className="text-muted-foreground text-base max-w-xs leading-relaxed mb-6">
                Professional email validation API. Protect your sender reputation with real-time verification.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-border/50 bg-card/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="font-display font-semibold text-sm text-foreground mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 transition-all duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MailVet.app. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              to="/access?page=signup"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Get Started
            </Link>
            <a 
              href="#api"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              API Reference
            </a>
            <a 
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
