import { createContext, useContext, useMemo, useState } from "react";
import authService from "@/services/auth/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await authService.login(credentials);

      if (!response.success) {
        throw new Error(response.message);
      }

      setUser(response.data.admin);

      localStorage.setItem(
        "accessToken",
        response.data.token
      );

      setIsAuthenticated(true);

      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await authService.logout();

      localStorage.removeItem("accessToken");

      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};