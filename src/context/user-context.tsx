'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
  name: 'Auditor de Seguridad',
  email: 'auditor@vulnforce.local',
  avatar: 'https://picsum.photos/seed/avatar/128/128',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('vulnforce-user');
      if (savedUser) {
        setUserState(JSON.parse(savedUser));
      } else {
        setUserState(defaultUser);
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      setUserState(defaultUser);
    }
  }, []);

  const setUser = (newUser: User) => {
    localStorage.setItem('vulnforce-user', JSON.stringify(newUser));
    setUserState(newUser);
  };
  
  const logout = () => {
    localStorage.removeItem('vulnforce-user');
    setUserState(defaultUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
