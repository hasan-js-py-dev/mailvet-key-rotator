import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "./PageTransition";
import FloatingParticles from "./FloatingParticles";

// Main site pages
import Index from "@/pages/Index";
import Access from "@/pages/Access";
import UseCases from "@/pages/UseCases";
import UseCaseDetail from "@/pages/UseCaseDetail";
import Features from "@/pages/Features";
import FeatureDetail from "@/pages/FeatureDetail";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import DashboardOverview from "@/pages/dashboard/Overview";
import VerifyEmail from "@/pages/dashboard/VerifyEmail";
import VerifyList from "@/pages/dashboard/VerifyList";
import Reports from "@/pages/dashboard/Reports";
import Plan from "@/pages/dashboard/Plan";
import ApiToken from "@/pages/dashboard/ApiToken";
import AccountSettings from "@/pages/dashboard/AccountSettings";
import CatchAll from "@/pages/dashboard/CatchAll";

interface AnimatedRoutesProps {
  type: "main" | "dashboard" | "development";
  basePath?: string;
}

const MainRoutes = () => {
  const location = useLocation();
  
  return (
    <>
      <FloatingParticles />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/access" element={<PageTransition><Access /></PageTransition>} />
          <Route path="/use-cases" element={<PageTransition><UseCases /></PageTransition>} />
          <Route path="/use-cases/:slug" element={<PageTransition><UseCaseDetail /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
          <Route path="/features/:slug" element={<PageTransition><FeatureDetail /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const DashboardRoutesComponent = ({ basePath = "" }: { basePath?: string }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path={`${basePath}/`} element={<PageTransition><DashboardOverview /></PageTransition>} />
        <Route path={`${basePath}/verify-email`} element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path={`${basePath}/verify-list`} element={<PageTransition><VerifyList /></PageTransition>} />
        <Route path={`${basePath}/reports`} element={<PageTransition><Reports /></PageTransition>} />
        <Route path={`${basePath}/plan`} element={<PageTransition><Plan /></PageTransition>} />
        <Route path={`${basePath}/api-token`} element={<PageTransition><ApiToken /></PageTransition>} />
        <Route path={`${basePath}/account-settings`} element={<PageTransition><AccountSettings /></PageTransition>} />
        <Route path={`${basePath}/catch-all`} element={<PageTransition><CatchAll /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const DevelopmentRoutesComponent = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");
  
  return (
    <>
      {!isDashboard && <FloatingParticles />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Main site routes */}
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/access" element={<PageTransition><Access /></PageTransition>} />
          <Route path="/use-cases" element={<PageTransition><UseCases /></PageTransition>} />
          <Route path="/use-cases/:slug" element={<PageTransition><UseCaseDetail /></PageTransition>} />
          <Route path="/features" element={<PageTransition><Features /></PageTransition>} />
          <Route path="/features/:slug" element={<PageTransition><FeatureDetail /></PageTransition>} />
          <Route path="/about" element={<PageTransition><About /></PageTransition>} />
          <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />
          <Route path="/blog/:slug" element={<PageTransition><BlogPost /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
          <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
          <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<PageTransition><DashboardOverview /></PageTransition>} />
          <Route path="/dashboard/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
          <Route path="/dashboard/verify-list" element={<PageTransition><VerifyList /></PageTransition>} />
          <Route path="/dashboard/reports" element={<PageTransition><Reports /></PageTransition>} />
          <Route path="/dashboard/plan" element={<PageTransition><Plan /></PageTransition>} />
          <Route path="/dashboard/api-token" element={<PageTransition><ApiToken /></PageTransition>} />
          <Route path="/dashboard/account-settings" element={<PageTransition><AccountSettings /></PageTransition>} />
          <Route path="/dashboard/catch-all" element={<PageTransition><CatchAll /></PageTransition>} />
          
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export const AnimatedRoutes = ({ type, basePath }: AnimatedRoutesProps) => {
  switch (type) {
    case "main":
      return <MainRoutes />;
    case "dashboard":
      return <DashboardRoutesComponent basePath={basePath} />;
    case "development":
      return <DevelopmentRoutesComponent />;
    default:
      return <MainRoutes />;
  }
};

export default AnimatedRoutes;
