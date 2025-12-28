import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { ArrowUpRight, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Product: [
    { name: "Features", href: "/features", isRoute: true },
    { name: "Use Cases", href: "/use-cases", isRoute: true },
    { name: "Pricing", href: "/#pricing" },
  ],
  Resources: [
    { name: "Blog", href: "/blog", isRoute: true },
    { name: "Help Center", href: "mailto:contact@mailvet.app" },
  ],
  Company: [
    { name: "About Us", href: "/about", isRoute: true },
    { name: "Contact", href: "/contact", isRoute: true },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy", isRoute: true },
    { name: "Terms of Service", href: "/terms", isRoute: true },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/mailvetapp", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/mailvet", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-[hsl(270,50%,15%)] bg-[hsl(270,100%,2%)]">
      <div className="container mx-auto px-6 relative z-10">
        {/* CTA Section */}
        <div className="py-16 border-b border-[hsl(270,50%,15%)]">
          <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-[hsl(270,50%,25%)] shadow-[0_0_60px_-12px_hsl(267,100%,50%,0.4),0_0_30px_-6px_hsl(267,100%,60%,0.3)]">
            {/* Background */}
            <div className="absolute inset-0 bg-[hsl(270,100%,2%)]" />
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(267,100%,60%)/0.08] via-transparent to-[hsl(212,93%,52%)/0.06]" />
            
            {/* Subtle glow overlay at edges */}
            <div className="absolute inset-0 bg-gradient-to-b from-[hsl(267,100%,60%,0.05)] via-transparent to-[hsl(267,100%,60%,0.05)]" />
            
            {/* Content */}
            <div className="relative z-10 py-16 px-8 text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to clean your email lists?
              </h3>
              <p className="text-[hsl(270,20%,65%)] mb-8">
                Start validating emails today with 100 free credits. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/access?page=signup">
                  <Button size="lg" className="marketing-cta text-white font-semibold px-8 rounded-full">
                    <span className="relative z-10">100 Free Credits</span>
                  </Button>
                </Link>
                <a href="#pricing">
                  <Button size="lg" variant="outline" className="bg-transparent border-[hsl(270,50%,20%)] text-white hover:bg-[hsl(270,50%,10%)] px-8 rounded-full">
                    View Pricing
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Logo size="md" animated className="mb-5" />
              <p className="text-[hsl(270,20%,60%)] text-sm max-w-xs leading-relaxed mb-6">
                Professional email validation API trusted by thousands of businesses worldwide. 
                Protect your sender reputation with real-time verification.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-full border border-[hsl(270,50%,15%)] bg-[hsl(270,50%,8%)] flex items-center justify-center text-[hsl(270,20%,60%)] hover:text-white hover:border-[hsl(267,100%,60%)/0.5] transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className={category === "Resources" ? "lg:col-span-2" : ""}>
                <h4 className="font-semibold text-sm text-white mb-4">{category}</h4>
                <ul className={`space-y-3 ${category === "Resources" ? "grid grid-cols-2 gap-x-6 gap-y-3 space-y-0" : ""}`}>
                  {links.map((link) => (
                    <li key={link.name}>
                      {link.isRoute ? (
                        <Link
                          to={link.href}
                          className="text-sm text-[hsl(270,20%,60%)] hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                        >
                          {link.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-[hsl(270,20%,60%)] hover:text-white transition-colors duration-200 flex items-center gap-1 group"
                        >
                          {link.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[hsl(270,50%,15%)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[hsl(270,20%,50%)]">
            © {new Date().getFullYear()} MailVet.app. All rights reserved. Built for email marketers.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:contact@mailvet.app"
              className="text-xs text-[hsl(270,20%,50%)] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              contact@mailvet.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
