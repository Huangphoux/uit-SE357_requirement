import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "STUDENT" | "TEACHER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (data : any) => Promise<boolean>;
  logout: () => void;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    email: "admin@englishcenter.com",
    password: "admin123",
    name: "Admin User",
    role: "ADMIN",
  },
  {
    id: "2",
    email: "teacher@englishcenter.com",
    password: "teacher123",
    name: "Sarah Wilson",
    role: "TEACHER",
  },
  {
    id: "3",
    email: "student@englishcenter.com",
    password: "student123",
    name: "Jane Doe",
    role: "STUDENT",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userData: User): Promise<boolean> => {
    setUser(userData);
    console.log("User logged in:", userData);
    
    localStorage.setItem("user", JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    // Check if email already exists
    if (mockUsers.some((u) => u.email === data.email)) {
      return false;
    }

    // Create new user
    const newUser: User = {
      id: String(mockUsers.length + 1),
      email: data.email,
      name: data.name,
      role: "STUDENT",
    };

    mockUsers.push({ ...newUser, password: data.password });
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
