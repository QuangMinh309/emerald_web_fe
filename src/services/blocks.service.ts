import axiosInstance from "@/lib/axios";
import type { Block, BlockDetail } from "@/types/block";

// nao chi can sua service là xong
export const getBlocks = async () => {
  const response = await axiosInstance.get("/blocks");
  return response.data.data as Block[];
};

export const createBlock = async (data: {
  buildingName: string;
  managerName: string;
  managerPhone: string;
  status: string;
  apartments: {
    roomName: string;
    type: string;
    area: number;
    floor: number;
  }[];
}) => {
  const response = await axiosInstance.post("/blocks", data);
  return response.data.data as Block;
};
export const updateBlock = async ({
  data,
  id,
}: {
  id: number;
  data: {
    buildingName: string;
    managerName: string;
    managerPhone: string;
    status: string;
    apartments: {
      roomName: string;
      type: string;
      area: number;
      floor: number;
    }[];
  };
}) => {
  const response = await axiosInstance.put(`/blocks/${id}`, data);
  return response.data.data as Block;
};
export const deleteBlock = async (id: number) => {
  const response = await axiosInstance.delete(`/blocks/${id}`);
  return response.data.data as Block;
};
export const getBlockById = async (id: number) => {
  const response = await axiosInstance.get(`/blocks/${id}`);
  return response.data.data as BlockDetail;
};
