import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
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
  isAuthenticated: boolean; // true ONLY if user exists AND emailVerified === true
  hasSession: boolean; // true if user has a valid session (even if unverified)
  error: string | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
  clearSession: () => void; // Clear local session without server logout
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  // Clear local session state without calling server logout
  // Used when starting a new signup flow to prevent redirect issues
  const clearSession = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setHasSession(false);
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
        hasSession,
        error,
        login,
        logout,
        refetch,
        clearSession,
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
