// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole, KYCStatus } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  loginAsRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  register: (userData: any, role: UserRole) => Promise<void>;
  completeRegistration: (role: UserRole) => void;
  updateAuthUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a logged-in user in localStorage on initial load
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse auth user from localStorage", error);
      localStorage.removeItem('authUser');
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, pass: string): Promise<void> => {
    console.log(`Attempting to log in with email: ${email}`);
    // Mock login: find user by email. We ignore the password in this mock.
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('authUser', JSON.stringify(foundUser));
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(`Aucun utilisateur trouvé avec l'email: ${email}`));
    }
  };

  const loginAsRole = async (role: UserRole): Promise<void> => {
    console.log(`Attempting to log in as role: ${role}`);
    // Find the first VERIFIED user with the specified role.
    const foundUser = mockUsers.find(u => u.role === role && u.kycStatus === KYCStatus.VERIFIED);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('authUser', JSON.stringify(foundUser));
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(`No verified user found for role: ${role}`));
    }
  };

  const register = async (userData: any, role: UserRole): Promise<void> => {
    console.log('Registering user:', userData.email, role);
    const newUser: User = {
      id: `usr_${Date.now()}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role,
      phone: userData.phone,
      phoneVerified: false,
      kycStatus: KYCStatus.PENDING,
      createdAt: new Date(),
      profilePictureUrl: `https://i.pravatar.cc/150?u=usr_${Date.now()}`,
      bio: '',
      city: userData.city || '',
      address: userData.address || '',
    };
    // In this mock, we set the user immediately to proceed with verification steps.
    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    return Promise.resolve();
  };
  
  const completeRegistration = (role: UserRole) => {
    console.log(`KYC form submitted for user with role: ${role}. Awaiting admin approval.`);
    // In a real app, this would just submit data. Here we simulate the state change.
    updateAuthUser({ kycStatus: KYCStatus.PENDING });
  };

  const updateAuthUser = (updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem('authUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };
  
  const value = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    loginAsRole,
    logout,
    register,
    completeRegistration,
    updateAuthUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};