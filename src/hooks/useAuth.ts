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
  isAuthenticated: boolean;
  error: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const loadUser = useCallback(async () => {
    try {
      setError(null);
      const userData = await fetchUser();
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial auth check
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const hasSession = await checkAuthStatus();
      
      if (hasSession) {
        await loadUser();
      } else {
        setIsLoading(false);
        setIsAuthenticated(false);
      }
    };

    initAuth();
  }, [loadUser]);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((authenticated) => {
      setIsAuthenticated(authenticated);
      if (!authenticated) {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (accessToken: string) => {
    setAccessToken(accessToken);
    setIsAuthenticated(true);
    await loadUser();
  }, [loadUser]);

  const logout = useCallback(async () => {
    await authLogout();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/access?page=login');
  }, [navigate]);

  const refetch = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
    login,
    logout,
    refetch,
  };
};

/**
 * Hook for protected routes - redirects to login if not authenticated
 */
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save intended destination
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      navigate(`/access?page=login&returnUrl=${returnUrl}`);
    }
  }, [isAuthenticated, isLoading, navigate, location]);

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
    if (!isLoading && isAuthenticated) {
      // Check for return URL
      const params = new URLSearchParams(location.search);
      const returnUrl = params.get('returnUrl');
      navigate(returnUrl ? decodeURIComponent(returnUrl) : '/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  return { isAuthenticated, isLoading };
};
