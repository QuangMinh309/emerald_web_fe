import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/types/auth";
import { getProfile, login as loginRequest } from "@/services/auth.service";
import {
  clearAuthStorage,
  getAccessToken,
  getRefreshToken,
  getStoredUser,
  isJwtExpired,
  setStoredUser,
  setTokens,
} from "@/lib/auth-storage";
import axios from "axios";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};
const refreshClient = axios.create({ baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api" });

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      try {
        let access = getAccessToken();
        const refresh = getRefreshToken();

        // ✅ nếu access hết hạn mà có refresh -> refresh ngay khi boot
        if (access && refresh && isJwtExpired(access)) {
          const rr = await refreshClient.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refresh}` } }
          );
          const { accessToken, refreshToken: newRefresh } = rr.data.data;
          setTokens(accessToken, newRefresh);
          access = accessToken;
        }

        if (!access) return;

        try {
        const profile = await getProfile();
        setStoredUser(profile);
        setUser(profile);
        return;
      } catch (e: any) {
        const status = e?.response?.status;

        // Nếu 401 mà có refresh -> refresh rồi lấy profile lại 1 lần
        if (status === 401 && refresh) {
          const rr = await refreshClient.post(
            "/auth/refresh",
            {},
            { headers: { Authorization: `Bearer ${refresh}` } }
          );
          const { accessToken, refreshToken: newRefresh } = rr.data.data;
          setTokens(accessToken, newRefresh);

          const profile = await getProfile();
          setStoredUser(profile);
          setUser(profile);
          return;
        }

        throw e;
      }
    } catch {
      clearAuthStorage();
    } finally {
      setIsLoading(false);
    }
  };


    void boot();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginRequest(email, password);
    const { accessToken, refreshToken, ...profile } = data;
    setTokens(accessToken, refreshToken);
    setStoredUser(profile);
    setUser(profile);
    return profile;
  };

  const logout = () => {
    clearAuthStorage();
    setUser(null);
  };

  const refreshProfile = async () => {
    const profile = await getProfile();
    setStoredUser(profile);
    setUser(profile);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshProfile,
    }),
    [user, isLoading],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
