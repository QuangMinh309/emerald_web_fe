import type { AuthUser } from "@/types/auth";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = (accessToken: string, refreshToken: string) => {
  console.log("Goi toi ham setTokens");
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = () => {
  console.log("Goi toi ham clearTokens");
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const getStoredUser = () => {
  console.log("Goi toi ham getStoredUser");
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const setStoredUser = (user: AuthUser) => {
  console.log("Goi toi ham setStoredUser");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredUser = () => {
  console.log("Goi toi ham clearStoredUser");
  localStorage.removeItem(USER_KEY);
};

export const clearAuthStorage = () => {
  console.log("Goi toi ham clearAuthStorage");
  clearTokens();
  clearStoredUser();
};

export const isJwtExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expMs = payload.exp * 1000;
  console.log("Goi toi ham isJwtExpired, expMs =", expMs);

    return Date.now() >= expMs - 5000; // trừ 5s buffer
  } catch {
    return true;
  }
};
