import React, { useState, forwardRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { UseCasesMenu } from "./UseCasesMenu";
import { FeaturesMenu } from "./FeaturesMenu";

const navLinks = [
  { name: "Pricing", href: "#pricing" },
];

export const Navbar = forwardRef<HTMLElement>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
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
            {/* Pricing - anchor on home, link on other pages */}
            {isHome ? (
              <a
                href="#pricing"
                className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary px-4 py-2 transition-colors duration-200"
              >
                Pricing
              </a>
            ) : (
              <Link
                to="/#pricing"
                className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary px-4 py-2 transition-colors duration-200"
              >
                Pricing
              </Link>
            )}
            
            {/* Features Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <Link
                to="/features"
                className="flex items-center gap-1 text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary px-4 py-2 transition-colors duration-200"
              >
                Features
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-border/30 rounded-xl shadow-xl z-50"
                  >
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <FeaturesMenu onItemClick={() => setFeaturesOpen(false)} />
                    <div className="px-4 py-3 border-t border-border/20">
                      <Link 
                        to="/features" 
                        onClick={() => setFeaturesOpen(false)}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View all features →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Use Cases Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setUseCasesOpen(true)}
              onMouseLeave={() => setUseCasesOpen(false)}
            >
              <Link
                to="/use-cases"
                className="flex items-center gap-1 text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary px-4 py-2 transition-colors duration-200"
              >
                Use Cases
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${useCasesOpen ? 'rotate-180' : ''}`} />
              </Link>
              
              <AnimatePresence>
                {useCasesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-card border border-border/30 rounded-xl shadow-xl z-50"
                  >
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <UseCasesMenu onItemClick={() => setUseCasesOpen(false)} />
                    <div className="px-4 py-3 border-t border-border/20">
                      <Link 
                        to="/use-cases" 
                        onClick={() => setUseCasesOpen(false)}
                        className="text-sm text-primary hover:underline font-medium"
                      >
                        View all use cases →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 ml-10">
            <Link to="/access?page=login">
              <Button variant="ghost" size="default" className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary hover:bg-transparent">
                Log in
              </Button>
            </Link>
            <Link to="/access?page=signup">
              <Button size="default" className="text-[16px] font-semibold bg-primary hover:bg-primary/90 text-white px-6">
                100 Free Credits
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
              {/* Pricing - anchor on home, link on other pages */}
              {isHome ? (
                <a
                  href="#pricing"
                  className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary transition-colors py-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </a>
              ) : (
                <Link
                  to="/#pricing"
                  className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary transition-colors py-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
              )}
              <Link
                to="/features"
                className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary transition-colors py-3 px-4"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/use-cases"
                className="text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary transition-colors py-3 px-4"
                onClick={() => setIsOpen(false)}
              >
                Use Cases
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-border/20">
                <Link to="/access?page=login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-[16px] font-semibold text-[hsl(140,50%,96%)] hover:text-primary">Log in</Button>
                </Link>
                <Link to="/access?page=signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full text-[16px] font-semibold bg-primary hover:bg-primary/90 text-white">100 Free Credits</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
});

Navbar.displayName = "Navbar";
