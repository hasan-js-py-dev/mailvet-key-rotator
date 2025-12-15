import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  credits: number;
  plan: string;
  totalValidations: number;
  monthlyValidations: number;
  billingStatus: string;
  renewalDate: string | null;
  createdAt: string;
}

interface UseUserReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
  const sessionTokenKey = "mailvet_session";

  const fetchUser = async () => {
    const token = localStorage.getItem(sessionTokenKey);
    
    if (!token) {
      setIsLoading(false);
      setError("Not authenticated");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${apiBaseUrl}/v1/account`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem(sessionTokenKey);
          setError("Session expired");
          return;
        }
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
};
