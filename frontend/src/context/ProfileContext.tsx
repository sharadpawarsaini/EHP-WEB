import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProfileContextType {
  managedMemberId: string | null;
  managedMemberName: string;
  setManagedMember: (id: string | null, name?: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [managedMemberId, setManagedMemberId] = useState<string | null>(localStorage.getItem('managedMemberId'));
  const [managedMemberName, setManagedMemberName] = useState<string>(localStorage.getItem('managedMemberName') || 'Me');

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
    <ProfileContext.Provider value={{ managedMemberId, managedMemberName, setManagedMember }}>
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
