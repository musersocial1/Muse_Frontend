// src/context/AuthContext.tsx

import React, { createContext, useState } from "react";

interface User {
  email: string;
  name?: string;
  token?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoggedIn: boolean;
  // login: (userData: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
