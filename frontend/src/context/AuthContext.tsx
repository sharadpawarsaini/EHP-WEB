import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First try to check if we have a token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
          // If we have a token, we might be logged in. 
          // The API interceptor will include it in the headers.
          const { data } = await api.get('/profile');
          if (data && data.userId) {
            setUser({ _id: data.userId, email: '' }); 
          }
        } else {
          // Fallback to cookie-only check
          const { data } = await api.get('/profile');
          if (data && data.userId) {
            setUser({ _id: data.userId, email: '' }); 
          }
        }
      } catch (error: any) {
        // Silently handle 401 (not logged in)
        if (error.response?.status !== 401) {
          console.error('Auth Check Error:', error);
        }
        setUser(null);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData: any) => {
    setUser({ _id: userData._id, email: userData.email });
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
