export interface Maintenance {
  id: number;
  maintenanceDate: string; // 2025-10-20
  title: string;
  maintenanceType: string; // Bảo trì định kỳ / Phản ánh cư dân
  technicianName: string;
  cost: number;
}
