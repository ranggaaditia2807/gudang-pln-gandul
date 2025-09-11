
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type UserRole = 'admin' | 'user';

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
  { id: '1', name: 'Admin Gudang', role: 'admin', email: 'admin@gudang.com' },
  { id: '2', name: 'Staff Gudang', role: 'user', email: 'user@gudang.com' }
];

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Update old data with "owner" role to "admin"
        if (parsedUser.role === 'owner') {
          parsedUser.role = 'admin';
          localStorage.setItem('user', JSON.stringify(parsedUser));
        }
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Simple mock login - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'admingudang1') { // Mock password
      setUser(foundUser);
      // Save user to localStorage
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
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
