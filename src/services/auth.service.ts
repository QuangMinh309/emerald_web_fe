import axiosInstance from "@/lib/axios";
import type { AuthResponse, AuthUser } from "@/types/auth";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data.data as AuthResponse;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data.data as AuthUser;
};
