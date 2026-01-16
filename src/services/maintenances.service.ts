import type { MaintenanceResult } from "@/constants/maintenanceResult";
import type { TicketPriority } from "@/constants/ticketPriority";
import type { TicketType } from "@/constants/ticketType";

import axiosInstance from "@/lib/axios";
import type {
  MaintenanceChecklistItem,
  MaintenanceTicketDetail,
  MaintenanceTicketListItem,
} from "@/types/maintenance";

/* =======================
   GET LIST
======================= */

// [ADMIN] Get all tickets
export const getMaintenanceTickets = async () => {
  const response = await axiosInstance.get("/maintenance-tickets");
  return response.data.data as MaintenanceTicketListItem[];
};

// Get tickets by asset
export const getMaintenanceTicketsByAsset = async (assetId: number) => {
  const response = await axiosInstance.get(`/maintenance-tickets/assets/${assetId}`);
  return response.data.data as MaintenanceTicketListItem[];
};

/* =======================
   GET DETAIL
======================= */

export const getMaintenanceTicketDetail = async (id: number) => {
  const response = await axiosInstance.get(`/maintenance-tickets/${id}`);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   CREATE
======================= */

export const createMaintenanceTicket = async (data: {
  title: string;
  description?: string;
  type: TicketType;
  priority?: TicketPriority;
  blockId: number;
  floor: number;
  apartmentId?: number;
  assetId?: number;
  checklistItems?: MaintenanceChecklistItem[];
}) => {
  const response = await axiosInstance.post("/maintenance-tickets", data);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   ASSIGN TECHNICIAN
======================= */

export const assignTechnician = async ({
  id,
  data,
}: {
  id: number;
  data: {
    technicianId: number;
    priority?: TicketPriority;
    assignedDate?: string; // ISO
  };
}) => {
  const response = await axiosInstance.post(`/maintenance-tickets/${id}/assign`, data);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   START WORK
======================= */

export const startMaintenanceWork = async (id: number) => {
  const response = await axiosInstance.post(`/maintenance-tickets/${id}/start`);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   UPDATE PROGRESS
======================= */

export const updateMaintenanceProgress = async ({
  id,
  checklistItems,
}: {
  id: number;
  checklistItems: MaintenanceChecklistItem[];
}) => {
  const response = await axiosInstance.post(`/maintenance-tickets/${id}/progress`, {
    checklistItems,
  });
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   COMPLETE
======================= */

export const completeMaintenanceTicket = async ({
  id,
  data,
}: {
  id: number;
  data: {
    result: MaintenanceResult;
    resultNote?: string;
    hasIssue?: boolean;
    issueDetail?: string;
    materialCost?: number;
    laborCost?: number;
  };
}) => {
  const response = await axiosInstance.post(`/maintenance-tickets/${id}/complete`, data);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   CANCEL
======================= */

export const cancelMaintenanceTicket = async ({ id, reason }: { id: number; reason: string }) => {
  const response = await axiosInstance.post(`/maintenance-tickets/${id}/cancel`, { reason });
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   UPDATE (PATCH)
======================= */

export const updateMaintenanceTicket = async ({
  id,
  data,
}: {
  id: number;
  data: {
    title?: string;
    description?: string;
    priority?: TicketPriority;
    blockId?: number;
    floor?: number;
    apartmentId?: number;
    assetId?: number;
    checklistItems?: MaintenanceChecklistItem[];
  };
}) => {
  const response = await axiosInstance.patch(`/maintenance-tickets/${id}`, data);
  return response.data.data as MaintenanceTicketDetail;
};

/* =======================
   DELETE
======================= */

export const deleteMaintenanceTicket = async (id: number) => {
  const response = await axiosInstance.delete(`/maintenance-tickets/${id}`);
  return response.data.data as { message: string };
};

// Delete many
export const deleteManyMaintenanceTickets = async (ids: number[]) => {
  const response = await axiosInstance.delete(`/maintenance-tickets/batch/delete`, {
    data: { ids },
  });
  return response.data.data as {
    message: string;
    deletedIds: number[];
  };
};
