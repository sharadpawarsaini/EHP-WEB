import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import api from '../api/api';

interface User {
  _id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: any) => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On app launch, check if a valid token exists
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync('token');
        if (!token) {
          setUser(null);
          return;
        }
        const { data } = await api.get('/profile');
        if (data && (data.userId || data._id)) {
          const role = data.role || 'user';
          await SecureStore.setItemAsync('role', role);
          setUser({ _id: data.userId || data._id, email: data.email || '', role });
        } else {
          setUser(null);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          await SecureStore.deleteItemAsync('token');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (userData: any) => {
    const role = userData.role || 'user';
    const userObj = { _id: userData._id || 'user_id', email: userData.email || '', role };
    setUser(userObj);
    if (userData.token) {
      await SecureStore.setItemAsync('token', userData.token);
    }
    await SecureStore.setItemAsync('role', role);
    await SecureStore.setItemAsync('ehp_biometric_user_data', JSON.stringify({ ...userObj, token: userData.token }));
  };

  const biometricLogin = async (): Promise<boolean> => {
    try {
      const stored = await SecureStore.getItemAsync('ehp_biometric_user_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.token) {
          await SecureStore.setItemAsync('token', parsed.token);
          setUser({ _id: parsed._id, email: parsed.email, role: parsed.role || 'user' });
          return true;
        }
      }
      // If no stored biometric enrollment exists, do NOT login as dummy user
      return false;
    } catch (e) {
      console.log('Biometric login error:', e);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (_) {}
    setUser(null);
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('role');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, biometricLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
