import type { TableColumn } from "@/types";
import StatusBadge from "@components/common/StatusBadge";

// data model
export interface Service {
  id: string;
  code: string;
  description?: string;
  name: string;
  price: number;
  unit: string;
  start: string;
  end: string;
  max: number;
  status: "active" | "inactive";
}

// màu có thể dùng type hoặc className
const statusMap: Record<
  string,
  { label: string; type?: "success" | "warning" | "error"; className?: string }
> = {
  active: { label: "Hoạt động", type: "success" },
  inactive: { label: "Tạm ngừng", type: "error" },
};

export const serviceColumns: TableColumn<Service>[] = [
  { key: "stt", label: "STT", align: "center", width: "60px" },
  { key: "code", label: "Mã dịch vụ", width: "110px"},
  { key: "name", label: "Tên dịch vụ", sortable: true, width: "170px"},
  { key: "price", label: "Giá", sortable: true, width: "90px", align: "center",},
  { key: "unit", label: "Đơn vị", width: "90px", align: "center"},
  { key: "start", label: "Giờ mở", sortable: true, width: "101px", align: "center"},
  { key: "end", label: "Giờ đóng", sortable: true, width: "115px", align: "center"},
  { key: "max", label: "Sức chứa", sortable: true, width: "117px", align: "center"},
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    // width: "150px",
    filterable: true,
    filterAccessor: (row) => statusMap[row.status]?.label || "Khác",

    render: (row) => {
      const config = statusMap[row.status] || { label: "Khác", type: "default" };

      return <StatusBadge label={config.label} type={config.type} className={config.className} />;
    },
  },
];
