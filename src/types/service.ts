// src/types/service.ts

export type AmenityType = "NORMAL";

export interface Service {
  id: number;
  name: string; // BBQ, Hồ bơi, Tennis
  description?: string;
  openHour: string; // time, ví dụ "08:00" hoặc "08:00:00"
  closeHour: string; // time
  imageUrl?: string;
  unitPrice: number;
  unitTimeBlock: number; // block tính tiền: 30/60 phút
  totalSlot: number;
  createdAt?: string; // timestamp (ISO string)
  type?: AmenityType; // default NORMAL
  status: "active" | "inactive"; // thêm trạng thái dịch vụ
}
