import type { TableColumn } from "@/types";
import StatusBadge from "@components/common/StatusBadge";
import type { Service } from "@/types/service";
import { formatVND } from "@/utils/money";

const typeMap: Record<string, { label: string; type?: "success" | "warning" | "error" }> = {
  active: { label: "Hoạt động", type: "success" },
  inactive: { label: "Tạm ngừng", type: "error" },
};

export const serviceColumns: TableColumn<Service>[] = [
  { key: "stt", label: "STT", align: "center", width: "60px" },

  { key: "name", label: "Tên dịch vụ", sortable: true, width: "200px" },

  {
    key: "unitPrice",
    label: "Giá",
    sortable: true,
    width: "90px",
    align: "center",
    render: (row) => formatVND(row.unitPrice),
  },
  {
    key: "unitTimeBlock",
    label: "Đơn vị",
    width: "90px",
    align: "center",
    render: (row) => `${row.unitTimeBlock} phút`,
  },

  { key: "openHour", label: "Giờ mở", sortable: true, width: "110px", align: "center" },
  { key: "closeHour", label: "Giờ đóng", sortable: true, width: "110px", align: "center" },

  { key: "totalSlot", label: "Sức chứa", sortable: true, width: "110px", align: "center" },

  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "140px",
    filterable: true,
    filterAccessor: (row) => typeMap[String(row.status)]?.label ?? String(row.status),
    render: (row) => {
      const config = typeMap[String(row.status ?? "NORMAL")] ?? {
        label: String(row.type ?? "NORMAL"),
      };
      return <StatusBadge label={config.label} type={config.type} />;
    },
  },
];
