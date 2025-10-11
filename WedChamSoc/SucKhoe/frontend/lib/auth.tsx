/**
 * Simple authentication context and hooks
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import axios from "axios";

interface User {
  id: number;
  email: string;
  full_name: string;
  phone?: string;
  is_active: boolean;
  email_verified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    full_name: string,
    phone?: string
  ) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = Cookies.get("auth_token");
      if (savedToken) {
        setToken(savedToken);
        try {
          // Verify token and get user info
          const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error("Token verification failed:", error);
          // Remove invalid token
          Cookies.remove("auth_token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { access_token, user: userData } = response.data;

      // Save token to cookie
      Cookies.set("auth_token", access_token, { expires: 1 }); // 1 day
      setToken(access_token);
      setUser(userData);

      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(
        error.response?.data?.detail || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    full_name: string,
    phone?: string
  ) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        full_name,
        phone,
      });

      const { access_token, user: userData } = response.data;

      // Save token to cookie
      Cookies.set("auth_token", access_token, { expires: 1 }); // 1 day
      setToken(access_token);
      setUser(userData);

      // Redirect to dashboard
      router.push("/");
    } catch (error: any) {
      console.error("Registration failed:", error);
      throw new Error(
        error.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Remove token from cookie
    Cookies.remove("auth_token");
    setToken(null);
    setUser(null);

    // Redirect to home
    router.push("/");
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// HOC for protected pages
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !user) {
        router.push("/auth/login");
      }
    }, [user, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };
};

// Hook for checking if user is authenticated
export const useUser = () => {
  const { user, isLoading } = useAuth();
  return { user, isLoading, error: null };
};
