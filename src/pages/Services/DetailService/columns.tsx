import type { TableColumn } from "@/types";
import StatusBadge from "@components/common/StatusBadge";
import type { Booking, BookingStatus } from "@/types/booking";
import { formatVND } from "@/utils/money";

const statusMap: Record<string, { label: string; type?: "success" | "warning" | "error" }> = {
  PENDING: { label: "Chờ xác nhận", type: "warning" },
  CONFIRMED: { label: "Đã xác nhận", type: "success" },
  COMPLETED: { label: "Hoàn thành", type: "success" },
  CANCELLED: { label: "Đã huỷ", type: "error" },
};

export const bookingColumns: TableColumn<Booking>[] = [
  { key: "stt", label: "STT", align: "center", width: "60px" },

  { key: "customerName", label: "Tên khách", sortable: true, width: "180px" },
  { key: "customerPhone", label: "Số điện thoại", width: "140px" },

  { key: "bookingDate", label: "Ngày đặt", sortable: true, width: "140px", align: "center" },

  { key: "unitPrice", label: "Đơn giá", sortable: true, width: "110px", align: "center", render: (row) => formatVND(row.unitPrice) },
  // Nếu muốn có cột "Đơn vị" thì bạn cần thêm field unitLabel vào Booking,
  // hoặc bỏ cột này.
  // { key: "unitLabel", label: "Đơn vị", width: "100px", align: "center" },

  { key: "receiveDate", label: "Ngày nhận", sortable: true, width: "140px", align: "center" },
  { key: "checkIn", label: "Giờ vào", width: "90px", align: "center" },
  { key: "checkOut", label: "Giờ ra", width: "90px", align: "center" },

  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "160px",
    filterable: true,
    filterAccessor: (row) => statusMap[String(row.status)]?.label ?? String(row.status),
    render: (row) => {
      const config = statusMap[String(row.status)] ?? { label: String(row.status) };
      return <StatusBadge label={config.label} type={config.type} />;
    },
  },
];
