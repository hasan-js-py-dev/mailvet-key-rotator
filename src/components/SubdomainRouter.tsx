import { Routes, Route } from "react-router-dom";
import { isDashboardContext, isLocalhost } from "@/lib/subdomain";

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

// Dashboard pages
import DashboardOverview from "@/pages/dashboard/Overview";
import VerifyEmail from "@/pages/dashboard/VerifyEmail";
import VerifyList from "@/pages/dashboard/VerifyList";
import Reports from "@/pages/dashboard/Reports";
import Plan from "@/pages/dashboard/Plan";
import ApiToken from "@/pages/dashboard/ApiToken";

import NotFound from "@/pages/NotFound";

/**
 * Routes for the main marketing site
 */
const MainSiteRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/access" element={<Access />} />
    <Route path="/use-cases" element={<UseCases />} />
    <Route path="/use-cases/:slug" element={<UseCaseDetail />} />
    <Route path="/features" element={<Features />} />
    <Route path="/features/:slug" element={<FeatureDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/**
 * Routes for the dashboard subdomain
 * In production: dashboard.mailvet.app/
 * In development: localhost:8080/dashboard/
 */
const DashboardRoutes = ({ basePath = "" }: { basePath?: string }) => (
  <Routes>
    <Route path={`${basePath}/`} element={<DashboardOverview />} />
    <Route path={`${basePath}/verify-email`} element={<VerifyEmail />} />
    <Route path={`${basePath}/verify-list`} element={<VerifyList />} />
    <Route path={`${basePath}/reports`} element={<Reports />} />
    <Route path={`${basePath}/plan`} element={<Plan />} />
    <Route path={`${basePath}/api-token`} element={<ApiToken />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/**
 * Combined routes for development (path-based routing)
 * Includes both main site and dashboard routes
 */
const DevelopmentRoutes = () => (
  <Routes>
    {/* Main site routes */}
    <Route path="/" element={<Index />} />
    <Route path="/access" element={<Access />} />
    <Route path="/use-cases" element={<UseCases />} />
    <Route path="/use-cases/:slug" element={<UseCaseDetail />} />
    <Route path="/features" element={<Features />} />
    <Route path="/features/:slug" element={<FeatureDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    
    {/* Dashboard routes with /dashboard prefix */}
    <Route path="/dashboard" element={<DashboardOverview />} />
    <Route path="/dashboard/verify-email" element={<VerifyEmail />} />
    <Route path="/dashboard/verify-list" element={<VerifyList />} />
    <Route path="/dashboard/reports" element={<Reports />} />
    <Route path="/dashboard/plan" element={<Plan />} />
    <Route path="/dashboard/api-token" element={<ApiToken />} />
    
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/**
 * Main router component that handles subdomain-based routing
 * - In production with dashboard subdomain: shows only dashboard routes
 * - In production on main domain: shows only main site routes
 * - In development (localhost): shows all routes with path-based routing
 */
export const SubdomainRouter = () => {
  // In development, use combined path-based routing
  if (isLocalhost()) {
    return <DevelopmentRoutes />;
  }
  
  // In production, check subdomain context
  if (isDashboardContext()) {
    // On dashboard subdomain - routes are at root level
    return <DashboardRoutes />;
  }
  
  // On main site
  return <MainSiteRoutes />;
};

export default SubdomainRouter;
