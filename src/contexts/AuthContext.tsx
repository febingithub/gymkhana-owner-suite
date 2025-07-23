import React, { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'owner' | 'member';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  userType: UserType;
  // Owner specific
  username?: string;
  gymName?: string;
  // Member specific
  membershipId?: string;
  approvedGyms?: string[];
}

interface AuthContextType {
  user: User | null;
  loginOwner: (username: string, password: string) => Promise<boolean>;
  loginMember: (phone: string, otp: string) => Promise<boolean>;
  sendOTP: (phone: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(false);

  const loginOwner = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock API call for owner login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username && password) {
      const mockUser: User = {
        id: '1',
        name: username,
        username: username,
        gymName: 'PowerHouse Fitness',
        email: `${username}@gym.com`,
        userType: 'owner'
      };
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const sendOTP = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock API call to send OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Always return true for demo (any phone number works)
    return phone.length >= 10;
  };

  const loginMember = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock API call for member login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (phone && otp === '123456') { // Mock OTP verification
      const mockUser: User = {
        id: '2',
        name: 'John Doe',
        phone: phone,
        email: 'john.doe@email.com',
        userType: 'member',
        membershipId: 'M001',
        approvedGyms: ['PowerHouse Fitness', 'Elite Gym']
      };
      setUser(mockUser);
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loginOwner,
    loginMember,
    sendOTP,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};