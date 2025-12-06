import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  { id: '1', email: 'admin@englishcenter.com', password: 'admin123', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'teacher@englishcenter.com', password: 'teacher123', name: 'Sarah Wilson', role: 'teacher', phone: '0123456789' },
  { id: '3', email: 'student@englishcenter.com', password: 'student123', name: 'Jane Doe', role: 'student', phone: '0987654321' },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('englishcenter_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('englishcenter_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('englishcenter_user');
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }): Promise<boolean> => {
    // Check if email already exists
    if (mockUsers.some(u => u.email === data.email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: 'student',
      phone: data.phone,
    };

    mockUsers.push({ ...newUser, password: data.password });
    setUser(newUser);
    localStorage.setItem('englishcenter_user', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}