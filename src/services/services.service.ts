// src/services/services.service.ts
import axiosInstance from "@/lib/axios";
import type { Service } from "@/types/service";

const USE_MOCK = true;

const mockServices: Service[] = [
  {
    id: 1,
    name: "Bóng bàn",
    description: "Dịch vụ cho thuê sân bóng bàn trong khuôn viên chung cư.",
    openHour: "08:00",
    closeHour: "20:00",
    imageUrl: "/images/services/table-tennis.jpg",
    unitPrice: 70000,
    unitTimeBlock: 30,
    totalSlot: 10,
    createdAt: "2026-01-11T00:00:00Z",
    status: "active",
  },
  {
    id: 2,
    name: "Sân cầu lông",
    description: "Dịch vụ cho thuê sân cầu lông dành cho cư dân.",
    openHour: "00:00",
    closeHour: "23:59",
    imageUrl: "/images/services/badminton.jpg",
    unitPrice: 50000,
    unitTimeBlock: 60,
    totalSlot: 1,
    createdAt: "2026-01-11T00:00:00Z",
    status: "inactive",
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getServices = async (): Promise<Service[]> => {
  if (USE_MOCK) {
    await sleep(200);
    return [...mockServices];
  }

  const res = await axiosInstance.get("/services");
  return res.data.data as Service[];
};

export const getServiceById = async (id: number): Promise<Service> => {
  if (USE_MOCK) {
    await sleep(200);
    const found = mockServices.find((s) => s.id === id);
    if (!found) throw new Error("Service not found");
    return { ...found };
  }

  const res = await axiosInstance.get(`/services/${id}`);
  return res.data.data as Service;
};

export type CreateServiceInput = Omit<Service, "id" | "createdAt">;

// POST /services
export const createService = async (payload: CreateServiceInput): Promise<Service> => {
  if (USE_MOCK) {
    await sleep(200);
    const newItem: Service = {
      id: Math.max(0, ...mockServices.map((s) => s.id)) + 1,
      createdAt: new Date().toISOString(),
      ...payload,
    };
    mockServices.unshift(newItem);
    return newItem;
  }

  const res = await axiosInstance.post("/services", payload);
  return res.data.data as Service;
};

// Payload update: partial
export type UpdateServiceInput = Partial<CreateServiceInput>;

export const updateService = async (args: {
  id: number;
  payload: UpdateServiceInput;
}): Promise<Service> => {
  if (USE_MOCK) {
    await sleep(200);
    const idx = mockServices.findIndex((s) => s.id === args.id);
    if (idx === -1) throw new Error("Service not found");
    mockServices[idx] = { ...mockServices[idx], ...args.payload };
    return mockServices[idx];
  }

  const res = await axiosInstance.patch(`/services/${args.id}`, args.payload);
  return res.data.data as Service;
};

export const deleteService = async (id: number) => {
  if (USE_MOCK) {
    await sleep(200);
    const idx = mockServices.findIndex((s) => s.id === id);
    if (idx >= 0) mockServices.splice(idx, 1);
    return { ok: true };
  }

  const res = await axiosInstance.delete(`/services/${id}`);
  return res.data;
};
