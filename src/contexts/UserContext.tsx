
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'owner' | 'user';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  { id: '1', name: 'Administrator', role: 'owner', email: 'admin@gmail.com' },
  { id: '2', name: 'Staff Gudang', role: 'user', email: 'user@gudang.com' }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      // Special handling for admin account
      if (email === 'admin@gmail.com' && password === 'admingudang1') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      // Default password for other accounts
      if (password === 'password123') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    // Remove user from localStorage
    localStorage.removeItem('user');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return user.role === requiredRole;
  };

  return (
    <UserContext.Provider value={{ user, login, logout, hasPermission }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
