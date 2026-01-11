import axiosInstance from "@/lib/axios";
import type { Block } from "@/types/block";

// nao chi can sua service là xong
export const getBlocks = async () => {
  const response = await axiosInstance.get("/blocks");
  return response.data.data as Block[];
};
