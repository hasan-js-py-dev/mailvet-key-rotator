import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  getAccessToken, 
  setAccessToken, 
  logout as authLogout, 
  fetchUser, 
  subscribeToAuthState,
  checkAuthStatus,
  type User 
} from '@/lib/auth';

interface UseAuthReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean; // true ONLY if user exists AND emailVerified === true
  hasSession: boolean; // true if user has a valid session (even if unverified)
  error: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
  clearSession: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // User is authenticated ONLY if they have a session AND their email is verified
  const isAuthenticated = hasSession && user?.emailVerified === true;

  const loadUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await fetchUser();
      
      if (userData) {
        setUser(userData);
        setHasSession(true);
      } else {
        setUser(null);
        setHasSession(false);
      }
    } catch (err) {
      setUser(null);
      setHasSession(false);
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const hasValidSession = await checkAuthStatus();
      
      if (hasValidSession) {
        await loadUser();
      } else {
        setIsLoading(false);
        setHasSession(false);
      }
    };

    initAuth();
  }, [loadUser]);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((authenticated) => {
      setHasSession(authenticated);
      if (!authenticated) {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    setHasSession(true);
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setHasSession(false);
    navigate('/access?page=login');
  }, [navigate]);

  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setHasSession(false);
  }, []);

  const refetch = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    hasSession,
    error,
    login,
    logout,
    refetch,
    clearSession,
  };
};

/**
 * Hook for protected routes - redirects to login if not authenticated
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading, user, hasSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!hasSession) {
        // No session at all - redirect to login
        const returnUrl = encodeURIComponent(location.pathname + location.search);
        navigate(`/access?page=login&returnUrl=${returnUrl}`);
      } else if (!isAuthenticated && user?.emailVerified === false) {
        // Has session but email not verified - redirect to email-sent
        navigate('/access?page=email-sent');
      }
    }
  }, [isAuthenticated, isLoading, hasSession, user, navigate, location]);

  return { isAuthenticated, isLoading };
};

/**
 * Hook for guest-only routes - redirects to dashboard if already authenticated
 */
export const useGuestOnly = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if FULLY authenticated (has session AND verified email)
    if (!isLoading && isAuthenticated) {
      // Check for return URL
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl');
      navigate(returnUrl ? decodeURIComponent(returnUrl) : '/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return { isAuthenticated, isLoading };
};
