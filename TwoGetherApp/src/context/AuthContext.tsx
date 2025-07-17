import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  partnerId?: string;
  partnerCode?: string;
  color: 'blue' | 'green';
}

interface AuthContextType {
  user: User | null;
  partner: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsPartnerConnection: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  connectPartner: (partnerCode: string) => Promise<void>;
  generatePartnerCode: () => Promise<string>;
  skipPartnerConnection: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartner] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await AsyncStorage.getItem('userData');

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // TODO: Fetch partner data if partnerId exists
        if (parsedUser.partnerId) {
          // Fetch partner data from API
        }
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      // For now, mock login
      const mockUser: User = {
        id: '1',
        name: 'User',
        email,
        color: 'blue',
      };

      await SecureStore.setItemAsync('authToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // TODO: Implement actual API call
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
        color: Math.random() > 0.5 ? 'blue' : 'green',
      };

      await SecureStore.setItemAsync('authToken', 'mock-token');
      await AsyncStorage.setItem('userData', JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setPartner(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const connectPartner = async (partnerCode: string) => {
    try {
      // TODO: Implement actual API call to connect partners
      console.log('Connecting with partner code:', partnerCode);

      // For now, simulate successful connection
      if (user) {
        const updatedUser = { ...user, partnerId: 'partner-' + partnerCode };
        setUser(updatedUser);
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Connect partner error:', error);
      throw error;
    }
  };

  const generatePartnerCode = async (): Promise<string> => {
    // Generate a unique 6-character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    if (user) {
      const updatedUser = { ...user, partnerCode: code };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }

    return code;
  };

  const skipPartnerConnection = async () => {
    if (user) {
      const updatedUser = { ...user, partnerId: 'skipped' };
      setUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    partner,
    isLoading,
    isAuthenticated: !!user,
    needsPartnerConnection: !!user && !user.partnerId,
    login,
    signup,
    logout,
    connectPartner,
    generatePartnerCode,
    skipPartnerConnection,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 