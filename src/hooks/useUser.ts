import { useState, useEffect } from 'react';
import { authenticatedFetch } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string | null;
  companyName: string;
  emailVerified: boolean;
  credits: number;
  plan: string;
  planUpdatedAt?: string | null;
  totalValidations: number;
  monthlyValidations: number;
  billingStatus: string;
  renewalDate: string | null;
  createdAt: string;
  authMethod?: 'google' | 'password';
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

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authenticatedFetch(`${apiBaseUrl}/v1/account`);

      if (!response.ok) {
        if (response.status === 401) {
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
