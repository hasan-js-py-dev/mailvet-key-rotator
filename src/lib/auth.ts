/**
 * Authentication Library
 * 
 * Implements secure token management:
 * - Access tokens: Short-lived (~15 min), stored in memory only
 * - Refresh tokens: Long-lived (~7 days), stored as HttpOnly cookie (handled by backend)
 * 
 * SECURITY: Access tokens are NOT stored in localStorage to prevent XSS attacks
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";

// In-memory token storage (cleared on page refresh - this is intentional for security)
let accessToken: string | null = null;
let tokenRefreshPromise: Promise<string | null> | null = null;

// Event emitter for auth state changes
type AuthStateListener = (isAuthenticated: boolean) => void;
const authStateListeners: Set<AuthStateListener> = new Set();

export const subscribeToAuthState = (listener: AuthStateListener): (() => void) => {
  authStateListeners.add(listener);
  return () => authStateListeners.delete(listener);
};

const notifyAuthStateChange = (isAuthenticated: boolean) => {
  authStateListeners.forEach(listener => listener(isAuthenticated));
};

/**
 * Get the current access token
 * If expired or missing, attempts to refresh using the HttpOnly refresh token cookie
 */
export const getAccessToken = async (): Promise<string | null> => {
  // If we have a token, return it
  if (accessToken) {
    return accessToken;
  }

  // If refresh is already in progress, wait for it
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  // Try to refresh the token
  return refreshAccessToken();
};

/**
 * Set the access token (called after login/signup)
 */
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  notifyAuthStateChange(!!token);
};

/**
 * Refresh the access token using the HttpOnly refresh token cookie
 * The refresh token is automatically sent by the browser
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  // Prevent concurrent refresh requests
  if (tokenRefreshPromise) {
    return tokenRefreshPromise;
  }

  tokenRefreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // Important: sends HttpOnly cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Refresh failed - user needs to login again
        accessToken = null;
        notifyAuthStateChange(false);
        return null;
      }

      const data = await response.json();
      accessToken = data.accessToken;
      notifyAuthStateChange(true);
      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      accessToken = null;
      notifyAuthStateChange(false);
      return null;
    } finally {
      tokenRefreshPromise = null;
    }
  })();

  return tokenRefreshPromise;
};

/**
 * Logout - clear tokens and invalidate refresh token on server
 */
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Logout request failed:', error);
  } finally {
    accessToken = null;
    notifyAuthStateChange(false);
  }
};

/**
 * Check if user is authenticated (has valid refresh token)
 * This attempts a silent refresh to validate the session
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return !!token;
};

/**
 * Make an authenticated API request
 * Automatically handles token refresh on 401 responses
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  let token = await getAccessToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const makeRequest = async (authToken: string) => {
    return fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });
  };

  let response = await makeRequest(token);

  // If token expired, try to refresh and retry once
  if (response.status === 401) {
    const errorData = await response.clone().json().catch(() => ({}));
    
    if (errorData.code === 'TOKEN_EXPIRED') {
      const newToken = await refreshAccessToken();
      
      if (newToken) {
        response = await makeRequest(newToken);
      }
    }
  }

  return response;
};

/**
 * Get user data from API
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  companyName: string;
  emailVerified: boolean;
  credits: number;
  plan: string;
  totalValidations: number;
  monthlyValidations: number;
  billingStatus: string;
  renewalDate: string | null;
  createdAt: string;
}

export const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/v1/account`);
    
    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};
