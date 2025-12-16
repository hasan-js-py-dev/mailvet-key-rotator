/**
 * Subdomain detection utility
 * In production: routes based on subdomain (e.g., dashboard.mailvet.app)
 * In development: uses path routing (e.g., localhost:8080/dashboard)
 */

export type AppSubdomain = 'main' | 'dashboard';

const DASHBOARD_SUBDOMAIN = 'dashboard';
const PRODUCTION_DOMAINS = ['mailvet.app']; // Add your production domains

/**
 * Detects if we're running in a local development environment
 */
export const isLocalhost = (): boolean => {
  const hostname = window.location.hostname;
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
};

/**
 * Gets the current subdomain from the URL
 * Returns null if no subdomain or if on localhost
 */
export const getSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  // No subdomains on localhost
  if (isLocalhost()) {
    return null;
  }
  
  // Check against production domains
  for (const domain of PRODUCTION_DOMAINS) {
    if (hostname.endsWith(domain)) {
      const subdomain = hostname.replace(`.${domain}`, '');
      // If subdomain equals the full hostname, there's no subdomain
      if (subdomain !== hostname && subdomain.length > 0) {
        return subdomain;
      }
      return null;
    }
  }
  
  // For other domains (like lovable preview), extract subdomain
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
};

/**
 * Determines which app context we're in based on subdomain or path
 */
export const getAppContext = (): AppSubdomain => {
  const subdomain = getSubdomain();
  
  // In production with subdomain
  if (subdomain === DASHBOARD_SUBDOMAIN) {
    return 'dashboard';
  }
  
  // In development or no subdomain - check path
  if (isLocalhost() || !subdomain) {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) {
      return 'dashboard';
    }
  }
  
  return 'main';
};

/**
 * Checks if we're on the dashboard subdomain/context
 */
export const isDashboardContext = (): boolean => {
  return getAppContext() === 'dashboard';
};

/**
 * Generates the correct URL for navigation based on context
 * In production with subdomains: navigates to subdomain
 * In development: uses path-based routing
 */
export const getDashboardUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (isLocalhost()) {
    // Local development - use path routing
    return `/dashboard${cleanPath === '/' ? '' : cleanPath}`;
  }
  
  // Production - check if we should use subdomain
  const hostname = window.location.hostname;
  for (const domain of PRODUCTION_DOMAINS) {
    if (hostname.endsWith(domain) || hostname === domain) {
      const protocol = window.location.protocol;
      return `${protocol}//${DASHBOARD_SUBDOMAIN}.${domain}${cleanPath}`;
    }
  }
  
  // Fallback to path routing for other environments (like lovable preview)
  return `/dashboard${cleanPath === '/' ? '' : cleanPath}`;
};

/**
 * Generates the correct URL for the main site
 */
export const getMainSiteUrl = (path: string = ''): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  if (isLocalhost()) {
    return cleanPath || '/';
  }
  
  // Production - navigate to main domain
  const hostname = window.location.hostname;
  for (const domain of PRODUCTION_DOMAINS) {
    if (hostname.includes(domain)) {
      const protocol = window.location.protocol;
      return `${protocol}//${domain}${cleanPath}`;
    }
  }
  
  return cleanPath || '/';
};

/**
 * Hook-friendly function to get navigation helpers
 */
export const getNavigationHelpers = () => {
  return {
    isLocalhost: isLocalhost(),
    isDashboard: isDashboardContext(),
    getSubdomain: getSubdomain(),
    getDashboardUrl,
    getMainSiteUrl,
  };
};
