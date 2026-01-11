import type { TableColumn } from "@/types";
import StatusBadge from "@components/common/StatusBadge";

// data model
export interface Asset {
  id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  status: "good" | "broken" | "maintaining" | "monitoring";
  lastMaintenance: string;
}

// màu có thể dùng type hoặc className
const statusMap: Record<
  string,
  { label: string; type?: "success" | "warning" | "error"; className?: string }
> = {
  good: { label: "Tốt", type: "success" },
  broken: { label: "Hỏng", type: "error" },
  maintaining: {
    label: "Cần bảo trì",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  },
  monitoring: {
    label: "Đang theo dõi",
    className: "bg-pink-100 text-pink-600 hover:bg-pink-100/80",
  },
};

export const assetColumns: TableColumn<Asset>[] = [
  { key: "stt", label: "STT", align: "center", width: "60px" },
  { key: "code", label: "Mã tài sản", sortable: true },
  { key: "name", label: "Tên tài sản", sortable: true, filterable: true },
  { key: "type", label: "Loại", filterable: true, align: "center", width: "15%" },
  { key: "location", label: "Vị trí" },
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "150px",
    filterable: true,
    filterAccessor: (row) => statusMap[row.status]?.label || "Khác",

    render: (row) => {
      const config = statusMap[row.status] || { label: "Khác", type: "default" };

      return <StatusBadge label={config.label} type={config.type} className={config.className} />;
    },
  },
  { key: "lastMaintenance", label: "Bảo trì gần nhất", sortable: true, align: "center" },
];
