import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

type UserType = 'OWNER' | 'MEMBER';

interface User {
  id: number;
  name: string;
  email?: string;
  phone: string;
  role: UserType;
  isVerified: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  sendOTP: (phone: string, type?: 'LOGIN' | 'SIGNUP' | 'RESET') => Promise<boolean>;
  verifyOTP: (phone: string, otp: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth token on app start
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      loadUserProfile();
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const response = await apiService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      // If profile loading fails, clear stored token
      localStorage.removeItem('authToken');
      setToken(null);
    }
  };

  const sendOTP = async (phone: string, type: 'LOGIN' | 'SIGNUP' | 'RESET' = 'LOGIN'): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.sendOTP(phone, type);
      setIsLoading(false);
      return response.success;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await apiService.verifyOTP(phone, otp);
      if (response.success && response.data) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('authToken', response.data.token);
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    user,
    token,
    sendOTP,
    verifyOTP,
    logout,
    isLoading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};