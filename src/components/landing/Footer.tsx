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
    { name: "Email Validation Guide", href: "/blog/what-is-email-validation", isRoute: true },
    { name: "Reduce Bounce Rate", href: "/blog/reduce-email-bounce-rate", isRoute: true },
    { name: "Email List Hygiene", href: "/blog/email-list-hygiene-best-practices", isRoute: true },
    { name: "Catch-All Emails", href: "/blog/catch-all-emails-explained", isRoute: true },
    { name: "Disposable Email Detection", href: "/blog/disposable-email-detection", isRoute: true },
    { name: "Email Deliverability", href: "/blog/email-deliverability-guide", isRoute: true },
    { name: "Spam Trap Prevention", href: "/blog/spam-trap-prevention", isRoute: true },
    { name: "Bulk Email Validation", href: "/blog/bulk-email-validation-guide", isRoute: true },
    { name: "E-commerce Validation", href: "/blog/email-validation-for-ecommerce", isRoute: true },
    { name: "Real-Time Verification", href: "/blog/real-time-email-verification", isRoute: true },
    { name: "SaaS Email Validation", href: "/blog/email-validation-for-saas", isRoute: true },
    { name: "MX Record Validation", href: "/blog/mx-record-validation", isRoute: true },
    { name: "Email Validation ROI", href: "/blog/email-validation-roi", isRoute: true },
    { name: "Role-Based Emails", href: "/blog/role-based-email-detection", isRoute: true },
    { name: "Agency Guide", href: "/blog/email-validation-for-agencies", isRoute: true },
    { name: "SMTP Verification", href: "/blog/smtp-verification-explained", isRoute: true },
    { name: "Common Mistakes", href: "/blog/email-validation-mistakes", isRoute: true },
    { name: "GDPR Compliance", href: "/blog/gdpr-email-validation", isRoute: true },
    { name: "Email Warm-Up", href: "/blog/email-warm-up-validation", isRoute: true },
    { name: "Integration Guide", href: "/blog/email-validation-integration-guide", isRoute: true },
    { name: "Sender Reputation", href: "/blog/sender-reputation-management", isRoute: true },
    { name: "View All Articles", href: "/blog", isRoute: true },
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
          <div className="grid md:grid-cols-2 lg:grid-cols-7 gap-10">
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
              <div key={category} className={category === "Resources" ? "lg:col-span-2" : ""}>
                <h4 className="font-semibold text-sm text-foreground mb-4">{category}</h4>
                <ul className={`space-y-3 ${category === "Resources" ? "grid grid-cols-2 gap-x-6 gap-y-3 space-y-0" : ""}`}>
                  {links.map((link) => (
                    <li key={link.name}>
                      {link.isRoute ? (
                        <Link
                          to={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
                        >
                          {link.name}
                          <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1 group"
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
        <div className="py-6 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MailVet.app. All rights reserved. Built with ❤️ for email marketers.
          </p>
          <div className="flex items-center gap-4">
            <a 
              href="mailto:contact@mailvet.app"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
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