import type { TableColumn } from "@/types";
import StatusBadge from "@components/common/StatusBadge";

// data model
export interface BookingCustomerRow {
  id: string;

  customerName: string;
  phone: string;

  bookingDate: string;   // Ngày đặt sân (vd: "2026-01-11")
  price?: number;        // Đơn giá
  unit?: string;         // Đơn vị (vd: "30 phút")

  checkinDate?: string;  // Ngày nhận sân
  startTime?: string;    // Giờ vào (vd: "05:00")
  endTime?: string;      // Giờ ra (vd: "22:00")

  status: "active" | "inactive";
}

// màu có thể dùng type hoặc className
const statusMap: Record<
  string,
  { label: string; type?: "success" | "warning" | "error"; className?: string }
> = {
  active: { label: "Còn hạng", type: "success" },
  inactive: { label: "Hết hạng", type: "error" },
};

export const bookingColumns: TableColumn<BookingCustomerRow>[] = [
  { key: "stt", label: "STT", align: "center"},

  { key: "customerName", label: "Tên khách", sortable: true, width: "180px" },
  { key: "phone", label: "Số điện thoại", width: "120px" },

  { key: "bookingDate", label: "Ngày đặt", sortable: true, width: "140px", align: "center" },

  { key: "price", label: "Đơn giá", sortable: true, width: "110px", align: "center" },
  { key: "unit", label: "Đơn vị", width: "100px", align: "center" },

  { key: "checkinDate", label: "Ngày nhận", sortable: true, width: "140px", align: "center" },

  { key: "startTime", label: "Giờ vào", width: "90px", align: "center" },
  { key: "endTime", label: "Giờ ra", width: "90px", align: "center" },

  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    filterable: true,
    width: "190px",
    filterAccessor: (row) => statusMap[row.status]?.label ?? "Khác",
    render: (row) => {
      const config = statusMap[row.status];
      return <StatusBadge label={config.label} type={config.type} className={config.className} />;
    },
  },

];
