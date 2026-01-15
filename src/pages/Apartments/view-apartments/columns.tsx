import type { TableColumn } from "@/types";
import type { Apartment } from "@/types/apartment";
import StatusBadge from "@components/common/StatusBadge";

const statusMap: Record<
  string,
  {
    label: string;
    type?: "success" | "warning" | "error" | "default";
    className?: string;
  }
> = {
  "Đang ở": { label: "Đang ở", type: "success" },
  Trống: { label: "Trống", type: "default" },
  "Đang sửa chữa": { label: "Đang sửa chữa", type: "warning" },
};

export const apartmentColumns: TableColumn<Apartment>[] = [
  { key: "id", label: "ID", align: "center", width: "60px" },
  { key: "roomName", label: "Mã căn hộ", sortable: true },
  { key: "type", label: "Loại", sortable: true, filterable: true },
  {
    key: "block",
    label: "Tòa nhà",
    sortable: true,
  },
  {
    key: "floor",
    label: "Tầng",
    align: "center",
    sortable: true,
  },
  {
    key: "area",
    label: "Diện tích (m²)",
    align: "center",
    render: (row) => row.area,
  },
  {
    key: "owner",
    label: "Chủ hộ",
    sortable: true,
  },
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "150px",
    render: (row) => {
      const config = statusMap[row.status] || {
        label: row.status,
        type: "default",
      };
      return <StatusBadge label={config.label} type={config.type} className={config.className} />;
    },
  },
];
