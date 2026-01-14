import PageHeader from "@/components/common/PageHeader";
import { useGetBlockById } from "@/hooks/data/useBlocks";
import { DetailApartmentMatrix } from "@/pages/Blocks/detail-block/DetailApartmentMatrix";
import { useParams } from "react-router-dom";

const DetailBlockPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: blockData } = useGetBlockById(Number(id));
  if (!id) {
    return (
      <div className="p-1.5 pt-0 space-y-4">
        <div className="bg-red-50 border border-red-200 p-8 rounded text-center text-red-600">
          Không tìm thấy ID tòa nhà
        </div>
      </div>
    );
  }
  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader title={blockData?.buildingName || "Xem chi tiết khối nhà"} showBack />
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
        <div className=" flex gap-5">
          <DisplayCard label="Tên tòa nhà" value={blockData?.buildingName || ""} />
          <DisplayCard label="Tên quản lý" value={blockData?.managerName || ""} />
          <DisplayCard label="Số điện thoại quản lý" value={blockData?.managerPhone || ""} />
          <DisplayCard label="Tổng số tầng" value={blockData?.totalFloors || 0} />
          <DisplayCard label="Tổng số phòng" value={blockData?.totalRooms || 0} />
        </div>
        <DetailApartmentMatrix block={blockData!} />
      </div>
    </div>
  );
};
interface DisplayCardProps {
  label: string;
  value: string | number;
}
const DisplayCard = ({ label, value }: DisplayCardProps) => {
  return (
    <div className="p-4 rounded-lg border min-w-[150px] ">
      <div className="display-label">{label}</div>
      <div className="display-text text-center mt-[10px]">{value}</div>
    </div>
  );
};
export default DetailBlockPage;
