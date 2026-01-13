import axiosInstance from "@/lib/axios";
import type { Maintenance } from "@/types/maintenance";
const data: Maintenance[] = [
  {
    id: 1,
    maintenanceDate: "2025-10-20",
    title: "Bảo trì định kỳ thang máy - kiểm tra dây cáp, bôi trơn, test an toàn.",
    maintenanceType: "Bảo trì định kỳ",
    technicianName: "Đạt Văn Tây",
    cost: 3500000,
  },
  {
    id: 2,
    maintenanceDate: "2025-10-30",
    title: "Bàn phím thang máy bị bong tróc",
    maintenanceType: "Phản ánh cư dân",
    technicianName: "Đạt Văn Tây",
    cost: 3500000,
  },
];

export const getMaintenances = async () => {
  return data;
};
