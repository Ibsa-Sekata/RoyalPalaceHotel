import React, { createContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { authApi } from "../api/authApi.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me(token)
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    localStorage.setItem("token", res.data.accessToken);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const wasAdminArea = previousPath.current === "/admin" || previousPath.current.startsWith("/admin/");
    const isAdminArea = location.pathname === "/admin" || location.pathname.startsWith("/admin/");

    if (wasAdminArea && !isAdminArea) {
      logout();
    }
    previousPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}