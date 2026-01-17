import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import PageHeader from "@components/common/PageHeader";
import CustomTable from "@components/common/CustomTable";
import { SearchBar } from "@/components/common/SearchBar";

import { bookingColumns } from "./columns";
import { normalizeString } from "@/utils/string";

import { useServiceDetail } from "@hooks/data/useServices";
import { useBookingsByServiceId } from "@/hooks/data/useBookings";

const formatVND = (n?: number) =>
  n == null ? "—" : new Intl.NumberFormat("vi-VN").format(n) + " VND";

const formatHour = (time?: string) => {
  if (!time) return "—";
  // hỗ trợ "08:00" hoặc "08:00:00"
  const parts = time.split(":");
  const h = String(Number(parts[0] || 0));
  const m = parts[1] ?? "00";
  if (m === "00") return `${h}h`;
  return `${h}h${m}`;
};

const DetailServicePage = () => {
  const { id } = useParams();
  const serviceId = Number(id);
  const isValidId = Number.isFinite(serviceId) && serviceId > 0;

  // Service query
  const {
    data: service,
    isLoading: serviceLoading,
    isError: serviceError,
    error: serviceErrObj,
    refetch: refetchService,
  } = useServiceDetail(serviceId, isValidId);

  // Bookings query
  const {
    data: bookings = [],
    isLoading: bookingLoading,
    isError: bookingError,
    error: bookingErrObj,
    refetch: refetchBookings,
  } = useBookingsByServiceId(serviceId, isValidId);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = useMemo(() => {
    if (!searchTerm.trim()) return bookings;
    const q = normalizeString(searchTerm);

    return bookings.filter((b) => {
      return (
        normalizeString(b.customerName).includes(q) ||
        normalizeString(b.customerPhone).includes(q) ||
        normalizeString(b.code).includes(q)
      );
    });
  }, [bookings, searchTerm]);

  // 1) validate id (1 lần)
  if (!isValidId) {
    return (
      <div className="p-1.5 pt-0">
        <div className="rounded border border-red-200 bg-red-50 p-6 text-red-600">
          ID dịch vụ không hợp lệ.
        </div>
      </div>
    );
  }

  // 2) Service loading/error
  if (serviceLoading) return <div>Đang tải dữ liệu dịch vụ...</div>;

  if (serviceError) {
    return (
      <div>
        <div className="text-red-600">{String((serviceErrObj as any)?.message ?? "Error")}</div>
        <button onClick={() => refetchService()} className="mt-2 rounded border px-3 py-1">
          Thử lại
        </button>
      </div>
    );
  }

  if (!service) return <div>Không tìm thấy dịch vụ</div>;

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader title={service?.name ?? "Chi tiết dịch vụ"} showBack />

      <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
        {/* Thông tin chung */}
        <div className="space-y-10">
          <div className="space-y-5">
            <h2 className="title-text">Thông tin chung</h2>

            <div className="space-y-2">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl}
                  alt={service.name ?? "Service image"}
                  className="mx-auto w-full max-w-[520px] aspect-[16/9] rounded-xl border object-cover"
                  loading="lazy"
                />
              ) : (
                <p className="display-text"></p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="display-label">Mô tả</h3>
              <p className="display-text">{service.description ?? "—"}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <h3 className="display-label">Đơn giá</h3>
                <p className="display-text">
                  {formatVND(service.unitPrice)} / {service.unitTimeBlock} phút
                </p>
              </div>

              <div>
                <h3 className="display-label">Giờ mở cửa</h3>
                <p className="display-text">{formatHour(service.openHour)}</p>
              </div>

              <div>
                <h3 className="display-label">Giờ đóng cửa</h3>
                <p className="display-text">{formatHour(service.closeHour)}</p>
              </div>

              <div>
                <h3 className="display-label">Sức chứa</h3>
                <p className="display-text">{service.totalSlot} chỗ</p>
              </div>
            </div>
          </div>

          {/* Lịch sử đặt chỗ */}
          <div className="space-y-4">
            <h2 className="title-text">Lịch sử đặt chỗ</h2>
            <div className="w-full">
              <SearchBar
                placeholder="Tìm kiếm theo tên khách hàng, số điện thoại..."
                onSearch={setSearchTerm}
              />
            </div>

            {bookingLoading ? (
              <div className="p-6 text-center text-gray-500">Đang tải booking...</div>
            ) : bookingError ? (
              <div className="bg-red-50 border border-red-200 p-6 rounded text-center space-y-3 text-red-600">
                <p className="font-medium">Không thể tải danh sách booking!</p>
                <p className="text-sm">{String((bookingErrObj as any)?.message ?? "Error")}</p>
                <button
                  type="button"
                  onClick={() => refetchBookings()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <CustomTable
                data={filteredBookings}
                columns={bookingColumns}
                defaultPageSize={10}
              />
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DetailServicePage;
