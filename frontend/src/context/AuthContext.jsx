import { createContext, useState, useMemo, useEffect } from "react";
import { loginApi, logoutApi } from "../api/auth.api";
import { getCurrentUserApi } from "../api/users.api";
import { setAccessToken, clearAccessToken } from "../utils/token.util";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const login = async (credentials) => {
    try {
      setError(null);

      const res = await loginApi(credentials);

      const accessToken = res?.data?.data?.accessToken;

      if (!accessToken) throw new Error("Invalid token");

      setAccessToken(accessToken);

      const userRes = await getCurrentUserApi();
      setUser(userRes?.data?.data);

      return { success: true };
    } catch (err) {
      clearAccessToken();
      setUser(null);

      const response = err?.response?.data;

      if (response?.data && typeof response.data === "object") {
        setError(response.data);
      } else {
        setError(response?.message || "Login failed");
      }

      return { success: false };
    }
  };

  // ================= LOGOUT =================
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout API failed");
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const userRes = await getCurrentUserApi();
        setUser(userRes?.data?.data);
      } catch (err) {
        clearAccessToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const isAuthenticated = Boolean(user);

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated,
      loading,
      error,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
