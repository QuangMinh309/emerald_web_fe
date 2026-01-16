import { TicketStatusMap } from "@/constants/TicketStatus";
import type { TableColumn } from "@/types";
import type { MaintenanceTicketListItem } from "@/types/maintenance";
import StatusBadge from "@components/common/StatusBadge";
import { TicketPriorityMap } from "@/constants/ticketPriority";

export const maintenanceColumns: TableColumn<MaintenanceTicketListItem>[] = [
  { key: "id", label: "ID", align: "center", width: "60px" },
  { key: "title", label: "Tiêu đề", sortable: true },
  {
    key: "priority",
    label: "Độ ưu tiên",
    width: "150px",
    align: "center",
    filterable: true,
    render: (row) => {
      const config = TicketPriorityMap[row?.priority!] ?? {
        label: "Không xác định",
        type: "default",
      };
      return <StatusBadge label={config.label} type={config.type} />;
    },
  },
  {
    key: "blockName",
    label: "Tòa nhà",
    width: "150px",
    filterable: true,
  },
  {
    key: "assetName",
    label: "Tài sản",
    render: (row) => row.assetName || "-",
  },
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "150px",
    filterable: true,
    render: (row) => {
      const config = TicketStatusMap[row?.status!] ?? {
        label: "Không xác định",
        type: "default",
      };
      return <StatusBadge label={config.label} type={config.type} />;
    },
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    align: "center",
    sortable: true,
    render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
  },
];
