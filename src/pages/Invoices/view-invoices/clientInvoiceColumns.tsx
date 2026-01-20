import type { TableColumn } from "@/types";
import type { InvoiceDetail } from "@/types/invoice";
import { formatVND } from "@/utils/money";

export const clientInvoiceColumns: TableColumn<InvoiceDetail>[] = [
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
  // {
  //   key: "waterIndex",
  //   label: "Chỉ số nước",
  //   align: "center",
  //   sortable: true,
  //   render: (row) => row.invoiceDetails.find((d) => d.feeTypeName === "Tiền nước")?.amount || 0,
  // },
  // {
  //   key: "electricityIndex",
  //   label: "Chỉ số điện",
  //   align: "center",
  //   sortable: true,
  //   render: (row) => row.invoiceDetails.find((d) => d.feeTypeName === "Tiền điện")?.amount || 0,
  // },
  {
    key: "totalAmount",
    label: "Tổng tiền",
    align: "right",
    sortable: true,
    render: (row) => formatVND(Number(row.totalAmount)),
  },
];
