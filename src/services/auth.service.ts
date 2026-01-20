import axiosInstance from "@/lib/axios";
import type { AuthResponse, AuthUser, ChangePasswordPayload } from "@/types/auth";

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data.data as AuthResponse;
};

export const getProfile = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data.data as AuthUser;
};

export const logout = async () => {
  await axiosInstance.post("/auth/logout");
};
export async function changePassword(payload: ChangePasswordPayload) {
  const res = await axiosInstance.post("/auth/change-password", payload);
  return res.data.data;
}
