import { Info } from "lucide-react";
import type { TableColumn } from "@/types";
import StatusBadge from "@/components/common/StatusBadge";
import type { NotificationData } from "@/types/notification";
import { format } from "date-fns";

const typeMap: Record<string, { label: string; className: string }> = {
  MAINTENANCE: {
    label: "Bảo trì",
    className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
  },
  GENERAL: {
    label: "Thông báo chung",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
  },
  WARNING: {
    label: "Cảnh báo",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
  },
  POLICY: {
    label: "Chính sách",
    className: "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
  },
  default: {
    label: "Khác",
    className: "bg-gray-100 text-gray-700",
  },
};

export const notificationColumns: TableColumn<NotificationData>[] = [
  { key: "stt", label: "STT", align: "center" },
  {
    key: "title",
    label: "Tiêu đề",
    width: "25%",
    filterable: true,

    filterAccessor: (row) => (row.isUrgent ? "Khẩn cấp" : "Thường"),

    render: (row) => (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-gray-900 line-clamp-2" title={row.title}>
          {row.title}
        </span>
        {row.isUrgent && (
          <div className="flex items-center gap-1 text-[11px] text-orange-600 font-bold">
            <Info className="w-3 h-3" />
            <span>Khẩn cấp</span>
          </div>
        )}
      </div>
    ),
  },
  {
    key: "targetScope",
    label: "Phạm vi",
    filterable: true,

    filterAccessor: (row) => {
      switch (row.targetScope) {
        case "ALL":
          return "Toàn chung cư";
        case "BLOCK":
          return "Theo tòa";
        case "FLOOR":
          return "Theo tầng";
        default:
          return "";
      }
    },

    render: (row) => {
      switch (row.targetScope) {
        case "ALL":
          return <span className="font-medium">Toàn chung cư</span>;
        case "BLOCK":
          return <span className="font-medium">Theo tòa</span>;
        case "FLOOR":
          return <span className="font-medium">Theo tầng</span>;
        default:
          return null;
      }
    },
  },
  {
    key: "createdAt",
    label: "Ngày gửi",
    sortable: true,
    align: "center",
    render: (row) => {
      try {
        return <span>{format(new Date(row.createdAt), "dd/MM/yyyy")}</span>;
      } catch {
        return <span>-</span>;
      }
    },
  },
  {
    key: "updatedAt",
    label: "Ngày cập nhật",
    sortable: true,
    align: "center",
    render: (row) => {
      try {
        return <span>{format(new Date(row.updatedAt), "dd/MM/yyyy")}</span>;
      } catch {
        return <span>-</span>;
      }
    },
  },
  {
    key: "type",
    label: "Loại thông báo",
    align: "center",
    width: "180px",
    filterable: true,
    filterAccessor: (row) => typeMap[row.type]?.label || "Khác",
    render: (row) => {
      const config = typeMap[row.type] || typeMap.default;
      return <StatusBadge label={config.label} className={config.className} />;
    },
  },
];
