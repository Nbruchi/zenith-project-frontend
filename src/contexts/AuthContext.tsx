import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '@/lib/axios';
import { User, LoginFormData, RegisterFormData } from '@/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user state from localStorage if available
    const storedUser = localStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    console.log('Initial user from localStorage:', parsedUser);
    return parsedUser;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      const userData = response.data.data;
      console.log('Fetched user data:', userData);
      setUser(userData);
      // Store user data in localStorage as a fallback
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
    } catch (error: any) {
      // If we get a 401, the token is invalid
      if (error?.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.error('Session expired. Please login again.');
      } else {
        setError(error?.response?.data?.message || 'Failed to fetch user');
        toast.error(error?.response?.data?.message || 'Failed to fetch user');
      }
      setIsLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/login', data);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('Login successful');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Login failed');
      toast.error(error?.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post('/auth/register', data);
      const { token, user } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      toast.success('Registration successful');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Registration failed');
      toast.error(error?.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 