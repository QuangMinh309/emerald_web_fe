import type { TableColumn } from "@/types";
import type { Resident } from "@/types/resident";

export const residentColumns: TableColumn<Resident>[] = [
  { key: "id", label: "ID", align: "center", width: "60px" },
  { key: "fullName", label: "Họ và tên", sortable: true },
  { key: "citizenId", label: "CCCD", sortable: true },
  {
    key: "dob",
    label: "Ngày sinh",
    sortable: true,
    align: "center",
    render: (row) => new Date(row.dob).toLocaleDateString("vi-VN"),
  },
  {
    key: "gender",
    label: "Giới tính",
    align: "center",
    render: (row) => {
      if (row.gender === "FEMALE") return "Nữ";
      if (row.gender === "MALE") return "Nam";
      return "Khác";
    },
  },
  {
    key: "phoneNumber",
    label: "Số điện thoại",
    align: "center",
    sortable: true,
  },
  {
    key: "account",
    label: "Email",
    render: (row) => row.account.email,
  },
];
