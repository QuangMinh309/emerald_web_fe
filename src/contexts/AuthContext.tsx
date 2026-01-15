import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/types/auth";
import { getProfile, login as loginRequest } from "@/services/auth.service";
import {
  clearAuthStorage,
  getAccessToken,
  getStoredUser,
  setStoredUser,
  setTokens,
} from "@/lib/auth-storage";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      const token = getAccessToken();
      const storedUser = getStoredUser();

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (storedUser) {
        setUser(storedUser);
        setIsLoading(false);
        return;
      }

      try {
        const profile = await getProfile();
        setStoredUser(profile);
        setUser(profile);
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
