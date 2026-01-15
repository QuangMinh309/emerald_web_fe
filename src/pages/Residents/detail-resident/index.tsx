import PageHeader from "@/components/common/PageHeader";
import Spinner from "@/components/common/Spinner";
import StatusBadge from "@/components/common/StatusBadge";
import { useGetResidentById } from "@/hooks/data/useResidents";
import { useParams } from "react-router-dom";
const livingInformation = [
  {
    apartmentName: "A1",
    relationship: "Chủ hộ",
    dateMovedIn: "2022-01-15",
  },
  {
    apartmentName: "A2",
    relationship: "Chủ hộ",
    dateMovedIn: "2022-01-15",
  },
];

const DetailResidentPage = () => {
  const { id } = useParams();
  const { data: resident, isLoading } = useGetResidentById(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px] ">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader title={resident?.fullName ?? "Chi tiết cư dân"} showBack />

      <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
        {/* Ảnh đại diện và trạng thái */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {resident?.imageUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={resident.imageUrl}
                  alt={resident.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-semibold">
                {resident?.fullName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{resident?.fullName}</h2>
              <p className="text-gray-500">{resident?.account.email}</p>
            </div>
          </div>
          {resident?.isActive ? (
            <StatusBadge label="Hoạt động" type="success" />
          ) : (
            <StatusBadge label="Ngưng hoạt động" type="error" />
          )}
        </div>

        {/* Thông tin cá nhân */}
        <div>
          <h2 className="title-text">Thông tin cá nhân</h2>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h3 className="display-label">CCCD</h3>
              <p className="display-text">{resident?.citizenId}</p>
            </div>

            <div>
              <h3 className="display-label">Ngày sinh</h3>
              <p className="display-text">
                {new Date(resident?.dob || "").toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div>
              <h3 className="display-label">Giới tính</h3>
              <p className="display-text">{resident?.gender}</p>
            </div>

            <div>
              <h3 className="display-label">Quốc tịch</h3>
              <p className="display-text">{resident?.nationality}</p>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div>
          <h2 className="title-text">Thông tin liên hệ</h2>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="display-label">Số điện thoại</h3>
              <p className="display-text">{resident?.phoneNumber}</p>
            </div>

            <div>
              <h3 className="display-label">Email</h3>
              <p className="display-text">{resident?.account.email}</p>
            </div>

            <div>
              <h3 className="display-label">Vai trò tài khoản</h3>
              <p className="display-text">{resident?.account.role}</p>
            </div>
          </div>
        </div>

        {/* Quê quán */}
        <div>
          <h2 className="title-text">Quê quán</h2>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="display-label">Tỉnh/Thành phố</h3>
              <p className="display-text">{resident?.province}</p>
            </div>

            <div>
              <h3 className="display-label">Quận/Huyện</h3>
              <p className="display-text">{resident?.district}</p>
            </div>

            <div>
              <h3 className="display-label">Phường/Xã</h3>
              <p className="display-text">{resident?.ward}</p>
            </div>
          </div>
        </div>

        {/* Thông tin tài khoản */}
        <div>
          <h2 className="title-text">Thông tin tài khoản</h2>
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            <div>
              <h3 className="display-label">Ngày tạo tài khoản</h3>
              <p className="display-text">
                {new Date(resident?.account.createdAt || "").toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div>
              <h3 className="display-label">Cập nhật lần cuối</h3>
              <p className="display-text">
                {new Date(resident?.account.updatedAt || "").toLocaleDateString("vi-VN")}
              </p>
            </div>

            <div>
              <h3 className="display-label">Trạng thái tài khoản</h3>
              <p className="display-text">
                {resident?.account.isActive ? (
                  <StatusBadge label="Kích hoạt" type="success" />
                ) : (
                  <StatusBadge label="Chưa kích hoạt" type="error" />
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin cu tru */}
        <div>
          <h2 className="title-text">Thông tin cư trú </h2>
        </div>
        <div className="flex flex-wrap gap-10">
          {livingInformation.map((info, index) => (
            <Card
              key={index}
              apartmentName={info.apartmentName}
              relationship={info.relationship}
              dateMovedIn={info.dateMovedIn}
            />
          ))}
        </div>

        {/* hoa don */}
        <div>
          <h2 className="title-text">Hóa đơn </h2>
        </div>
      </div>
    </div>
  );
};
interface CardProps {
  apartmentName: string;
  relationship: string;
  dateMovedIn: string;
}
const Card = ({ apartmentName, dateMovedIn, relationship }: CardProps) => {
  return (
    <div className="rounded-lg border p-4 w-[300px]">
      <div className="flex items-center justify-between">
        <h3 className="display-label">Tên tòa</h3>
        <p className="display-text">{apartmentName}</p>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="display-label">Quan hệ chủ hộ</h3>
        <p className="display-text">{relationship}</p>
      </div>
      <div className="flex items-center justify-between">
        <h3 className="display-label">Ngày chuyển đến</h3>
        <p className="display-text">{new Date(dateMovedIn).toLocaleDateString("vi-VN")}</p>
      </div>
    </div>
  );
};
export default DetailResidentPage;
