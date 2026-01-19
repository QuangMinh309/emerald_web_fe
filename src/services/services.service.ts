import axiosInstance from "@/lib/axios";
import type { Service } from "@/types/service";
import { axiosMultipart } from "@/lib/axios";

export const getServices = async (): Promise<Service[]> => {
  const res = await axiosInstance.get("/services");
  return res.data.data as Service[];
};

export const getServiceById = async (id: number): Promise<Service> => {
  const res = await axiosInstance.get(`/services/${id}`);
  return res.data.data as Service;
};

export type CreateServiceInput = Omit<Service, "id" | "createdAt">;

// POST /services
export const createService = async (payload: FormData): Promise<Service> => {
  const res = await axiosMultipart.post("/services", payload);
  return res.data.data as Service;
};

export const updateService = async (args: { id: number; payload: FormData }) => {
  const res = await axiosMultipart.patch(`/services/${args.id}`, args.payload);
  return res.data.data as Service;
};

export const deleteService = async (id: number) => {
  const res = await axiosInstance.delete(`/services/${id}`);
  return res.data;
};
