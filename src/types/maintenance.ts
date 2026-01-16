import type { MaintenanceResult } from "@/constants/maintenanceResult";
import type { TicketPriority } from "@/constants/TicketPriority";
import type { TicketStatus } from "@/constants/TicketStatus";
import type { TicketType } from "@/constants/TicketType";

export interface MaintenanceTicketListItem {
  id: number;
  title: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;

  assetName?: string;
  blockName?: string;
  floor: number;
  technicianName?: string;

  createdAt: string; // ISO string từ BE
}
export interface MaintenanceTicketDetail {
  id: number;
  title: string;
  type: TicketType;
  priority: TicketPriority;

  description?: string;
  status: TicketStatus;

  // Vị trí
  blockId: number;
  blockName?: string;
  floor: number;

  apartmentId?: number;
  apartmentNumber?: string;

  assetId?: number;
  assetName?: string;
  assetTypeName?: string;

  // Kỹ thuật viên
  technicianId?: number;
  technicianName?: string;
  technicianPhone?: string;

  // Checklist & thời gian
  checklistItems?: MaintenanceChecklistItem[];

  assignedDate?: string; // ISO string
  startedDate?: string;
  completedDate?: string;

  // Kết quả
  result?: MaintenanceResult;
  resultNote?: string;

  hasIssue: boolean;
  issueDetail?: string;

  // Chi phí (BE đã convert sang number)
  materialCost?: number;
  laborCost?: number;
  totalCost?: number;
  estimatedCost?: number;
  actualCost?: number;

  createdAt: string;
}
export interface MaintenanceChecklistItem {
  task: string;
  isChecked: boolean;
}
