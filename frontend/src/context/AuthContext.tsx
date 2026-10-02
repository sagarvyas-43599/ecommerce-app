import React, { createContext, useContext, useState, useEffect } from 'react';
import type { IUser } from '../types';
import { AuthService } from '../services/ecommerce.service';

interface AuthContextType {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  const initAuth = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const res = await AuthService.getProfile();
        if (res?.data) {
          setUser(res.data);
        }
      } catch (err) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (credentials: any) => {
    const res = await AuthService.login(credentials);
    if (res?.data) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setUser(res.data.user);
    }
  };

  const register = async (data: any) => {
    const res = await AuthService.register(data);
    if (res?.data) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('refreshToken', res.data.refreshToken);
      setUser(res.data.user);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    try {
      const res = await AuthService.getProfile();
      if (res?.data) setUser(res.data);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
