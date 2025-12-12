import { Logo } from "@/components/Logo";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  Product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API Documentation", href: "#api" },
    { name: "Use Cases", href: "#use-cases" },
  ],
  Resources: [
    { name: "Blog", href: "#" },
    { name: "Help Center", href: "#" },
    { name: "API Status", href: "#" },
    { name: "Changelog", href: "#" },
  ],
  Company: [
    { name: "About Us", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Partners", href: "#" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-background">
      <div className="absolute inset-0 dot-pattern opacity-5" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* CTA Section */}
        <div className="py-16 border-b border-border/20">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to clean your email lists?
            </h3>
            <p className="text-muted-foreground mb-8">
              Start validating emails today with 100 free credits. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/access?page=signup">
                <Button size="lg" className="bg-cyan hover:bg-cyan/90 text-background font-semibold px-8">
                  Get Started Free
                </Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="border-border/50 hover:bg-card px-8">
                  View Pricing
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Main footer */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10">
            {/* Brand column */}
            <div className="lg:col-span-2">
              <Logo size="md" animated className="mb-5" />
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed mb-6">
                Professional email validation API trusted by thousands of businesses worldwide. 
                Protect your sender reputation with real-time verification.
              </p>
              
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-full border border-border/30 bg-card/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-cyan/50 transition-all duration-300"
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
                <h4 className="font-semibold text-sm text-foreground mb-4">{category}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                      >
                        {link.name}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MailVet.app. All rights reserved. Built with ❤️ for email marketers.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:support@mailvet.app"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3 h-3" />
              support@mailvet.app
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};