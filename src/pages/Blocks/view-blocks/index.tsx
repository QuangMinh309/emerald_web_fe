import PageHeader from "@/components/common/PageHeader";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { useBlocks } from "@/hooks/data/useBlocks";
import type { Block } from "@/types/block";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
const statusMap: Record<
  string,
  { label: string; type: "success" | "warning" | "error" | "default" }
> = {
  ACTIVE: { label: "Đang vận hành", type: "success" },
  INACTIVE: { label: "Đang xây dựng", type: "default" },
  MAINTENANCE: { label: "Đang bảo trì", type: "warning" },
};
const BlocksPage = () => {
  const router = useNavigate();
  const { data: blocks, isLoading, isError, error, refetch } = useBlocks();
  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader
        title="Tòa nhà"
        subtitle="Quản lý danh sách các tòa của chung cư"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                router("/blocks/create");
              }}
              className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Tạo tòa
            </button>
          </div>
        }
      />
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
            Đang tải dữ liệu tòa...
          </div>
        ) : isError ? (
          <div className="bg-red-50 border border-red-200 p-8 rounded text-center space-y-3 text-red-600">
            <p className="font-medium">Không thể tải dữ liệu!</p>
            <p className="text-sm">{(error as Error)?.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Thử lại ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-10">
            {blocks?.map((block) => (
              <BlockCard key={block.id} {...block} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const BlockCard = (block: Block) => {
  const cfg = statusMap[block?.status ?? ""] || {
    label: block?.status ?? "Unknown",
    type: "success",
  };
  return (
    <div className="border rounded-lg shadow-sm p-4 bg-white w-[400px]">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[18px]">{block.buildingName}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
        >
          <Edit className="w-4 h-4 stroke-[2]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 stroke-[2]" />
        </Button>
      </div>
      <StatusBadge className="mt-2 mb-4" label={cfg.label} type={cfg.type} />
      <div className="w-full flex items-center justify-between">
        <p className="display-label">Số tầng</p>
        <p className="display-text"> {block.totalFloors}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="display-label">Trưởng tòa</p>
        <p className="display-text"> {block.managerName}</p>
      </div>
      <div className="w-full flex items-center justify-between">
        <p className="display-label">SDT trưởng tòa</p>
        <p className="display-text"> {block.managerPhone}</p>
      </div>
      <div>
        <div className="w-full flex items-center justify-between">
          <p className="display-label">Số phòng</p>
          <p className="display-text">{block.totalRooms}</p>
        </div>

        <div className="relative ml-4 mt-1 pl-4 space-y-1">
          <span className="absolute left-0 top-0 h-1/2 border-l border-gray-300" />

          {block.roomDetails.oneBedroom > 0 && (
            <div className="flex justify-between relative">
              <span className="absolute -left-4 top-1/2 w-3 border-t  border-gray-300" />
              <p className="display-label text-sm text-gray-600">Căn hộ 1 phòng ngủ</p>
              <p className="display-text">{block.roomDetails.oneBedroom}</p>
            </div>
          )}

          {block.roomDetails.twoBedroom > 0 && (
            <div className="flex justify-between relative">
              <span className="absolute -left-4 top-1/2 w-3 border-t border-gray-300" />
              <p className="display-label text-sm text-gray-600">Căn hộ 2 phòng ngủ</p>
              <p className="display-text">{block.roomDetails.twoBedroom}</p>
            </div>
          )}

          {block.roomDetails.studio > 0 && (
            <div className="flex justify-between relative">
              <span className="absolute -left-4 top-1/2 w-3 border-t border-gray-300" />
              <p className="display-label text-sm text-gray-600">Căn hộ studio</p>
              <p className="display-text">{block.roomDetails.studio}</p>
            </div>
          )}

          {block.roomDetails.penthouse > 0 && (
            <div className="flex justify-between relative">
              <span className="absolute -left-4 top-1/2 w-3 border-t border-gray-300" />
              <p className="display-label text-sm text-gray-600">Căn hộ penthouse</p>
              <p className="display-text">{block.roomDetails.penthouse}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default BlocksPage;
