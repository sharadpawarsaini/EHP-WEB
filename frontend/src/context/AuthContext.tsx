import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
  _id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any, stealth?: boolean) => void;
  logout: () => void;
  loading: boolean;
  isStealthMode: boolean;
  stealthData: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStealthMode, setIsStealthMode] = useState(false);

  // Mock Ghost Data for Stealth Mode
  const stealthData = {
    profile: {
      fullName: "Alex Rivera",
      age: 28,
      bloodGroup: "O+",
      emergencyContact: "9876543210"
    },
    medical: {
      allergies: "None",
      conditions: "Seasonal Hayfever",
      medications: "Vitamin C (Daily)",
      surgeries: "None",
      familyHistory: "No major concerns"
    },
    vitals: [
      { type: "Heart Rate", value: 72, unit: "bpm", date: new Date().toISOString() },
      { type: "Blood Pressure", value: "120/80", unit: "mmHg", date: new Date().toISOString() },
      { type: "SPO2", value: 99, unit: "%", date: new Date().toISOString() }
    ],
    reports: [
      { title: "Routine Health Check", createdAt: new Date().toISOString() }
    ],
    visits: [
      { hospitalName: "General Medical Center", visitDate: new Date().toISOString() }
    ]
  };

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          return;
        }

        // Verify token with backend
        const { data } = await api.get('/profile');
        if (data && (data.userId || data._id)) {
          setUser({ _id: data.userId || data._id, email: data.email || '' }); 
        } else {
          setUser(null);
        }
      } catch (error: any) {
        if (error.response?.status === 401) {
          // Explicitly clear state on 401
          localStorage.removeItem('token');
          setUser(null);
        } else {
          console.error('Auth Check Connectivity Error:', error);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData: any, stealth: boolean = false) => {
    setIsStealthMode(stealth);
    setUser({ _id: userData._id, email: userData.email });
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    if (stealth) {
      localStorage.setItem('isStealth', 'true');
    } else {
      localStorage.removeItem('isStealth');
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
    <AuthContext.Provider value={{ user, login, logout, loading, isStealthMode, stealthData }}>
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
