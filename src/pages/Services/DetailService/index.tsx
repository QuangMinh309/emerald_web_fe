import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import ActionDropdown from "@components/common/ActionDropdown";
import CustomTable from "@components/common/CustomTable";
import { TabNavigation } from "@components/common/TabNavigation";
import { SearchBar } from "@/components/common/SearchBar";
import { bookingColumns, type BookingCustomerRow } from "./columns";
import type { Service } from "../columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useLocation, useParams } from "react-router-dom";
type LocationState = { service?: Service };
const titleStyle = "text-2xl font-bold text-main";
const subtitleStyle = "text-gray-500 text-base mt-1";
const contentStyle = "text-[18px] font-normal text-black";

const DetailServicePage = () => {
  const { id } = useParams();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const service = state?.service;

  const [searchTerm, setSearchTerm] = useState("");

  // data mẫu
  const bookingData: BookingCustomerRow[] = [
    {
      id: "b1",
      customerName: "Nguyễn Văn A",
      phone: "0909123456",
      bookingDate: "2026-01-10",
      price: service?.price,
      unit: service?.unit ?? "30 phút",
      checkinDate: "2026-01-11",
      startTime: "05:00",
      endTime: "22:00",
      status: "active",
    },
    {
      id: "b2",
      customerName: "Trần Thị B",
      phone: "0988777666",
      bookingDate: "2026-01-09",
      price: service?.price,
      unit: service?.unit ?? "30 phút",
      checkinDate: "2026-01-11",
      startTime: "08:00",
      endTime: "09:00",
      status: "inactive",
    },
  ];


  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookingData;
    const q = normalizeString(searchTerm);

    return bookingData.filter((b) => {
      return (
        normalizeString(b.customerName).includes(q) ||
        normalizeString(b.phone).includes(q)
      );
    });
  }, [bookingData, searchTerm]);


  const handleImport = () => {
    console.log("import");
  };

  const handleDeleteAll = () => {
    if (confirm("Bạn có chắc muốn xóa tất cả?")) {
      console.log("deleting all...");
    }
  };

  // muốn thêm thao tác thì thêm, danger => đỏ
  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "delete_all",
        label: "Xóa tất cả",
        icon: <Trash2 />,
        variant: "danger",
        onClick: handleDeleteAll,
      },
      {
        id: "delete_more",
        label: "Xóa nhiều",
        icon: <Trash2 />,
        variant: "danger",
        onClick: () => console.log("Xóa nhiều"),
      },
      {
        id: "import",
        label: "Import Excel",
        icon: <FileDown />,
        onClick: handleImport,
      },
      {
        id: "print",
        label: "In danh sách",
        icon: <Printer />,
        onClick: () => console.log("In"),
      },
    ],
    [],
  );

  // helpers (tuỳ bạn dùng/không)
  const formatVND = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "VND";

  const formatHour = (time: string) => {
    // "08:00" -> "8h", "08:30" -> "8h30"
    const [hRaw, m] = (time || "").split(":");
    const h = String(Number(hRaw || 0)); // bỏ số 0 đầu
    if (!m || m === "00") return `${h}h`;
    return `${h}h${m}`;
  };

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader
        title={service?.name ?? "Chi tiết dịch vụ"}
        // subtitle="Quản lý  danh sách các dịch vụ của chung cư"
        showBack
      />

      <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
        <div className="space-y-8">
          <div className="space-y-2">
            <h2 className={titleStyle}>Thông tin chung</h2>
          </div>
          {/* Mô tả */}
          <div className="space-y-2">
            <h2 className={subtitleStyle}>Mô tả</h2>
            <p className={contentStyle}>
              {service?.description ?? "—"}
            </p>
          </div>

          {/* 4 cột thông tin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className={subtitleStyle}>Đơn giá</h3>
              <p className={contentStyle}>
                {formatVND(service?.price ?? 0)} / {service?.unit}
              </p>
            </div>

            <div>
              <h3 className={subtitleStyle}>Giờ mở cửa</h3>
              <p className={contentStyle}>{formatHour(service?.start ?? "")}</p>
            </div>

            <div>
              <h3 className={subtitleStyle}>Giờ đóng cửa</h3>
              <p className={contentStyle}>{formatHour(service?.end ?? "")}</p>
            </div>

            <div>
              <h3 className={subtitleStyle}>Sức chứa</h3>
              <p className={contentStyle}>
                {service?.max} người / {service?.unit}
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className={titleStyle}>Lịch sử đặt chỗ</h2>
        </div>

        <div className="w-full">
          <SearchBar
            placeholder="Tìm kiếm theo tên khách hàng, số điện thoại..."
            onSearch={setSearchTerm}
          />
        </div>
        <CustomTable
          data={filteredBookings}
          columns={bookingColumns}
          defaultPageSize={10}
          onDelete={(row) => console.log("Xóa", row)}
        />
      </div>


    </div>
  );
};

export default DetailServicePage;
