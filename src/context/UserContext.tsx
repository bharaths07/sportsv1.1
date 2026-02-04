import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/models';
import { users } from '../data/mockData';

interface UserContextType {
  currentUser: User | null;
  updateUser: (user: User) => void;
  updateProfilePhoto: (photoUrl: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize with the first user from mock data (Rahul Kumar)
  const [currentUser, setCurrentUser] = useState<User | null>(users[0]);

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  const updateProfilePhoto = (photoUrl: string) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        profilePhoto: photoUrl
      });
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser, updateProfilePhoto }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
