import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";

const navLinks = [
  { name: "Pricing", href: "#pricing" },
  { name: "Features", href: "#features" },
  { name: "Use Cases", href: "/use-cases", isRoute: true },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-[hsl(220,20%,8%)]/90 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="relative z-10">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isHome && navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary px-4 py-2 transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 ml-10">
            <Link to="/access?page=login">
              <Button variant="ghost" size="default" className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary hover:bg-transparent">
                Log in
              </Button>
            </Link>
            <Link to="/access?page=signup">
              <Button size="default" className="text-[16px] font-semibold bg-primary hover:bg-primary/90 text-white px-6">
                Start Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[hsl(140,50%,96%)]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[hsl(220,20%,8%)]/98 backdrop-blur-xl border-b border-border/20"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {isHome && navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary transition-colors py-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                <Link to="/access?page=login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary">Log in</Button>
                </Link>
                <Link to="/access?page=signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-[16px] font-semibold bg-primary hover:bg-primary/90 text-white">Start Free</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
