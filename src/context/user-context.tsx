
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// A simple (and not very secure) hashing function for demonstration purposes.
// In a real application, use a robust library like bcrypt.
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};


interface User {
  name: string;
  email: string;
  avatar: string;
  passwordHash?: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
  logout: (deleteAccount?: boolean) => void;
  login: (name: string, pass: string) => boolean;
  setPassword: (name: string, pass: string) => void;
  hasPassword: () => boolean;
  changePassword: (oldPass: string, newPass: string) => boolean;
  forgotPassword: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUser: User = {
  name: 'Pentester',
  email: 'auditor@vulnforce.local',
  avatar: '',
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User>(defaultUser);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

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
    } finally {
        setIsLoaded(true);
    }
  }, []);

  const setUser = (newUser: User) => {
    // Only update name, email, avatar if password already exists
    if (user.passwordHash) {
       const updatedUser = { ...user, name: newUser.name, email: newUser.email, avatar: newUser.avatar };
       localStorage.setItem('vulnforce-user', JSON.stringify(updatedUser));
       setUserState(updatedUser);
    } else {
        localStorage.setItem('vulnforce-user', JSON.stringify(newUser));
        setUserState(newUser);
    }
  };
  
  const logout = (deleteAccount = false) => {
    sessionStorage.removeItem('vulnforce-authenticated');
    if (deleteAccount) {
      localStorage.removeItem('vulnforce-user');
      // After deleting the user, we set the state back to a default user without a password
      // so the app redirects to the setup page.
      setUserState({ ...defaultUser }); 
    }
    router.push('/');
    router.refresh(); // Force a refresh to re-evaluate the state on the login page
  };

  const login = (name: string, pass: string): boolean => {
    if (!hasPassword()) {
        return false;
    }
    const passHash = simpleHash(pass);
    if (user.name.toLowerCase() === name.toLowerCase() && user.passwordHash === passHash) {
      sessionStorage.setItem('vulnforce-authenticated', 'true');
      return true;
    }
    return false;
  };

  const setPassword = (name: string, pass: string) => {
    const passHash = simpleHash(pass);
    const email = `${name.toLowerCase().replace(/\s/g, '.')}@vulnforce.local`;
    const updatedUser = { ...user, name, email, passwordHash: passHash };
    localStorage.setItem('vulnforce-user', JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };
  
  const changePassword = (oldPass: string, newPass: string): boolean => {
    if (user.passwordHash !== simpleHash(oldPass)) {
      return false;
    }
    const newHash = simpleHash(newPass);
    const updatedUser = { ...user, passwordHash: newHash };
    localStorage.setItem('vulnforce-user', JSON.stringify(updatedUser));
    setUserState(updatedUser);
    return true;
  }
  
  const forgotPassword = () => {
    const updatedUser = { ...user };
    delete updatedUser.passwordHash;
    localStorage.setItem('vulnforce-user', JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };

  const hasPassword = () => !!user.passwordHash;
  
  if (!isLoaded) {
      return null; // or a loading spinner
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, login, setPassword, hasPassword, changePassword, forgotPassword }}>
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
