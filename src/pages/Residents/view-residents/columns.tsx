import type { TableColumn } from "@/types";
import type { Resident } from "@/types/resident";
import StatusBadge from "@components/common/StatusBadge";

export const residentColumns: TableColumn<Resident>[] = [
  { key: "id", label: "ID", align: "center", width: "60px" },
  { key: "fullName", label: "Họ và tên", sortable: true },
  { key: "citizenId", label: "CCCD", sortable: true },
  {
    key: "dob",
    label: "Ngày sinh",
    sortable: true,
    render: (row) => new Date(row.dob).toLocaleDateString("vi-VN"),
  },
  { key: "gender", label: "Giới tính", align: "center", width: "100px" },
  { key: "phoneNumber", label: "Số điện thoại", sortable: true },
  {
    key: "account",
    label: "Email",
    render: (row) => row.account.email,
  },
  {
    key: "isActive",
    label: "Trạng thái",
    align: "center",
    width: "150px",
    render: (row) =>
      row.isActive ? (
        <StatusBadge label="Hoạt động" type="success" />
      ) : (
        <StatusBadge label="Ngưng hoạt động" type="error" />
      ),
  },
];
