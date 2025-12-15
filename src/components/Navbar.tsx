import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./ui/button";
import { UseCasesMenu } from "./UseCasesMenu";
import { FeaturesMenu } from "./FeaturesMenu";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [useCasesOpen, setUseCasesOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[hsl(270,50%,15%)/0.5] bg-[hsl(270,100%,2%)/0.85] backdrop-blur-2xl">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="relative z-10">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {isHome ? (
              <a
                href="#pricing"
                className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white px-4 py-2 transition-colors duration-200"
              >
                Pricing
              </a>
            ) : (
              <Link
                to="/#pricing"
                className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white px-4 py-2 transition-colors duration-200"
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
                className="flex items-center gap-1 text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white px-4 py-2 transition-colors duration-200"
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl shadow-2xl z-50"
                  >
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <FeaturesMenu onItemClick={() => setFeaturesOpen(false)} />
                    <div className="px-4 py-3 border-t border-[hsl(270,50%,15%)]">
                      <Link 
                        to="/features" 
                        onClick={() => setFeaturesOpen(false)}
                        className="text-sm text-[hsl(267,100%,60%)] hover:text-[hsl(267,100%,70%)] font-medium"
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
                className="flex items-center gap-1 text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white px-4 py-2 transition-colors duration-200"
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[hsl(270,50%,6%)] border border-[hsl(270,50%,15%)] rounded-xl shadow-2xl z-50"
                  >
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <UseCasesMenu onItemClick={() => setUseCasesOpen(false)} />
                    <div className="px-4 py-3 border-t border-[hsl(270,50%,15%)]">
                      <Link 
                        to="/use-cases" 
                        onClick={() => setUseCasesOpen(false)}
                        className="text-sm text-[hsl(267,100%,60%)] hover:text-[hsl(267,100%,70%)] font-medium"
                      >
                        View all use cases →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3 ml-10">
            <Link to="/access?page=login">
              <Button variant="ghost" size="default" className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white hover:bg-[hsl(270,50%,10%)]">
                Log in
              </Button>
            </Link>
            <Link to="/access?page=signup">
              <Button size="default" className="marketing-cta text-[15px] font-semibold text-white px-6 rounded-full">
                <span className="relative z-10">Get started – 100 Free Credits</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[hsl(270,20%,75%)]"
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
            className="md:hidden bg-[hsl(270,100%,2%)/0.98] backdrop-blur-2xl border-b border-[hsl(270,50%,15%)]"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {isHome ? (
                <a
                  href="#pricing"
                  className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white transition-colors py-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </a>
              ) : (
                <Link
                  to="/#pricing"
                  className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white transition-colors py-3 px-4"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
              )}
              <Link
                to="/features"
                className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white transition-colors py-3 px-4"
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/use-cases"
                className="text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white transition-colors py-3 px-4"
                onClick={() => setIsOpen(false)}
              >
                Use Cases
              </Link>
              <div className="flex flex-col gap-3 pt-4 border-t border-[hsl(270,50%,15%)]">
                <Link to="/access?page=login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full text-[15px] font-medium text-[hsl(270,20%,75%)] hover:text-white hover:bg-[hsl(270,50%,10%)]">Log in</Button>
                </Link>
                <Link to="/access?page=signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full marketing-cta text-[15px] font-semibold text-white rounded-full">
                    <span className="relative z-10">Get started – 100 Free Credits</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
