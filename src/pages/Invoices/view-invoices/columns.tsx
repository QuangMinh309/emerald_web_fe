import type { TableColumn } from "@/types";
import type { Invoice } from "@/types/invoice";
import StatusBadge from "@components/common/StatusBadge";
import { InvoiceStatusMap } from "@/constants/invoiceStatus";
import { formatVND } from "@/utils/money";

export const invoiceColumns: TableColumn<Invoice>[] = [
  { key: "stt", label: "STT", align: "center" },
  { key: "invoiceCode", label: "Mã hóa đơn", sortable: true },
  { key: "apartmentId", label: "Mã căn hộ", sortable: true, align: "center" },
  {
    key: "period",
    label: "Kỳ thanh toán",
    sortable: true,
    render: (row) =>
      new Date(row.period).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
      }),
  },
  {
    key: "totalAmount",
    label: "Tổng tiền",
    align: "right",
    sortable: true,
    render: (row) => formatVND(Number(row.totalAmount)),
  },
  {
    key: "status",
    label: "Trạng thái",
    align: "center",
    width: "150px",
    render: (row) => {
      const config = InvoiceStatusMap[row.status];
      return <StatusBadge label={config.label} type={config.type} />;
    },
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    sortable: true,
    render: (row) => new Date(row.createdAt).toLocaleDateString("vi-VN"),
  },
];
