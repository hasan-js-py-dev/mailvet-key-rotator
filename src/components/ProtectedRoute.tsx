import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/components/AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected Route Component
 * Redirects unauthenticated users to login page
 * Shows loading spinner while checking auth status
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save intended destination for redirect after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/access?page=login&returnUrl=${returnUrl}`} replace />;
  }

  return <>{children}</>;
};

/**
 * Guest Only Route Component
 * Redirects authenticated users to dashboard
 * Shows loading spinner while checking auth status
 */
export const GuestOnlyRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    // Check for return URL
    const params = new URLSearchParams(location.search);
    const returnUrl = params.get('returnUrl');
    return <Navigate to={returnUrl ? decodeURIComponent(returnUrl) : '/dashboard'} replace />;
  }

  return <>{children}</>;
};
