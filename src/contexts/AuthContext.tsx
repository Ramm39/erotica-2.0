'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';
import Cookies from 'js-cookie';
import { initSocket, disconnectSocket } from '@/lib/socket';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string, language: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.getMe();
      setUser(response.data || response);
      initSocket();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      Cookies.remove('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    Cookies.set('token', response.token, { expires: 7 });
    setUser(response.user);
    initSocket();
  };

  const signup = async (email: string, password: string, displayName: string, language: string) => {
    const response = await api.signup({ email, password, displayName, language });
    Cookies.set('token', response.token, { expires: 7 });
    setUser(response.user);
    initSocket();
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    disconnectSocket();
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return default values during SSR or if provider is not available
    return {
      user: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => {},
      signup: async () => {},
      logout: () => {},
      updateUser: () => {},
    };
  }
  return context;
}

