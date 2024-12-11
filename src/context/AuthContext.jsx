/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("authToken") || null,
    user: null,
    isAuthenticated: !!localStorage.getItem("authToken"),
  });

  // Login function
  const login = useCallback((token, user, expiresIn = 3600) => {
    const expiresAt = new Date().getTime() + expiresIn * 1000; // Calculate expiration time
    setAuth({ token, user, isAuthenticated: true });
    localStorage.setItem("authToken", token);
    localStorage.setItem("expiresAt", expiresAt); // Store expiration time
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setAuth({ token: null, user: null, isAuthenticated: false });
    localStorage.removeItem("authToken");
    localStorage.removeItem("expiresAt");
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const expiresAt = localStorage.getItem("expiresAt");

    if (storedToken && expiresAt) {
      const currentTime = new Date().getTime();
      if (currentTime > expiresAt) {
        // Token expired
        logout();
      } else {
        // Token valid
        setAuth((prev) => ({ ...prev, token: storedToken, isAuthenticated: true }));
      }
    }
  }, [logout]); // Add logout to dependency array

  return (
    <AuthContext.Provider value={{ auth, setAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
