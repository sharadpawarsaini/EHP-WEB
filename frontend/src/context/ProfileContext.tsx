import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface ProfileContextType {
  managedMemberId: string | null;
  managedMemberName: string;
  photoUrl: string | null;
  setManagedMember: (id: string | null, name?: string) => void;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [managedMemberId, setManagedMemberId] = useState<string | null>(localStorage.getItem('managedMemberId'));
  const [managedMemberName, setManagedMemberName] = useState<string>(localStorage.getItem('managedMemberName') || 'Me');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const refreshProfile = async () => {
    try {
      const { data } = await api.get('/profile');
      if (data) {
        setManagedMemberName(data.fullName || 'Me');
        setPhotoUrl(data.photoUrl || null);
      }
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error("Failed to fetch profile in context", err);
      }
    }
  };

  useEffect(() => {
    refreshProfile();
  }, [managedMemberId]);

  const setManagedMember = (id: string | null, name: string = 'Me') => {
    if (id) {
      localStorage.setItem('managedMemberId', id);
    } else {
      localStorage.removeItem('managedMemberId');
    }
    localStorage.setItem('managedMemberName', name);
    
    setManagedMemberId(id);
    setManagedMemberName(name);
    // Reload to ensure all components fetch fresh data for the new managed member
    window.location.reload();
  };

  return (
    <ProfileContext.Provider value={{ managedMemberId, managedMemberName, photoUrl, setManagedMember, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
};
