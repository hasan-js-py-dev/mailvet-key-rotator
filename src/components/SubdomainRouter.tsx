import { isDashboardContext, isLocalhost } from "@/lib/subdomain";
import AnimatedRoutes from "./AnimatedRoutes";

/**
 * Main router component that handles subdomain-based routing
 * - In production with dashboard subdomain: shows only dashboard routes
 * - In production on main domain: shows only main site routes
 * - In development (localhost): shows all routes with path-based routing
 */
export const SubdomainRouter = () => {
  // In development, use combined path-based routing
  if (isLocalhost()) {
    return <AnimatedRoutes type="development" />;
  }
  
  // In production, check subdomain context
  if (isDashboardContext()) {
    // On dashboard subdomain - routes are at root level
    return <AnimatedRoutes type="dashboard" />;
  }
  
  // On main site
  return <AnimatedRoutes type="main" />;
};

export default SubdomainRouter;
