import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("hiremind_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem("hiremind_token") || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify and fetch latest user info on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("hiremind_token");
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          if (res?.data?.user) {
            setUser(res.data.user);
            localStorage.setItem("hiremind_user", JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn("Session expired or invalid token:", err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res?.data?.token && res?.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("hiremind_token", res.data.token);
        localStorage.setItem("hiremind_user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      throw new Error("Invalid response from server.");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      const res = await authAPI.register({ name, email, password });
      if (res?.data?.token && res?.data?.user) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem("hiremind_token", res.data.token);
        localStorage.setItem("hiremind_user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      throw new Error("Invalid response from server.");
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hiremind_token");
    localStorage.removeItem("hiremind_user");
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await userAPI.updateProfile(profileData);
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("hiremind_user", JSON.stringify(res.data.user));
        return { success: true, user: res.data.user };
      }
      return { success: true };
    } catch (err) {
      throw err;
    }
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("hiremind_user", JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
