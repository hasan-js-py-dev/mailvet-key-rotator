import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const refetch = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        error,
        login,
        logout,
        refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
