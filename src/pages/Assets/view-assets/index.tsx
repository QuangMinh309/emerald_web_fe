import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ActionDropdown from "@/components/common/ActionDropdown";
import CustomTable from "@/components/common/CustomTable";
import { TabNavigation } from "@/components/common/TabNavigation";
import { SearchBar } from "@/components/common/SearchBar";

import { assetColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useAssets } from "@/hooks/data/useAssests";
import CreateAssetModal from "@/pages/Assets/create-asset";

const AssetsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewModalOpen, setNewIsModalOpen] = useState(false);

  // Lấy dữ liệu từ Hook
  const { data: assets = [], isLoading, isError, error, refetch } = useAssets();

  // Logic lọc dữ liệu tổng hợp (Tab + Search)
  const filteredData = useMemo(() => {
    let result = [...assets];

    // 1. Lọc theo Tab (Dựa trên typeName)
    if (activeTab !== "all") {
      result = result.filter((item) => {
        const type = item.typeName.toLowerCase();
        if (activeTab === "elevator") return type.includes("thang máy");
        if (activeTab === "electric") return type.includes("điện");
        return true;
      });
    }

    // 2. Lọc theo ô tìm kiếm
    if (searchTerm.trim()) {
      const search = normalizeString(searchTerm);
      result = result.filter(
        (item) =>
          normalizeString(item.name).includes(search) ||
          normalizeString(item.typeName).includes(search) ||
          normalizeString(item.blockName).includes(search) ||
          normalizeString(item.locationDetail).includes(search),
      );
    }

    return result;
  }, [assets, activeTab, searchTerm]);

  // Actions cho Dropdown
  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "delete_all",
        label: "Xóa tất cả",
        icon: <Trash2 className="w-4 h-4" />,
        variant: "danger",
        onClick: () => confirm("Xóa toàn bộ dữ liệu?") && console.log("Delete All"),
        disabled: assets.length === 0,
      },
      {
        id: "import",
        label: "Import Excel",
        icon: <FileDown className="w-4 h-4" />,
        onClick: () => console.log("Importing..."),
      },
      {
        id: "print",
        label: "In danh sách",
        icon: <Printer className="w-4 h-4" />,
        onClick: () => window.print(),
        disabled: assets.length === 0,
      },
    ],
    [assets.length],
  );

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title="Tài sản, thiết bị"
          subtitle="Quản lý danh sách các tài sản, thiết bị trong tòa nhà"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setNewIsModalOpen(true)}
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Tạo tài sản
              </button>

              <ActionDropdown
                options={actions}
                sampleFileUrl="/template/asset_import_template.xlsx"
              />
            </div>
          }
        />

        {/* Khu vực lọc & tìm kiếm */}
        <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm space-y-4">
          <TabNavigation
            tabs={[
              { id: "all", label: "Tất cả thiết bị" },
              { id: "elevator", label: "Thang máy" },
              { id: "electric", label: "Hệ thống điện" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <SearchBar placeholder="Tìm kiếm theo tên, loại, vị trí..." onSearch={setSearchTerm} />
        </div>

        {/* Hiển thị nội dung chính */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
              Đang tải dữ liệu tài sản...
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
            <CustomTable
              data={filteredData}
              columns={assetColumns}
              defaultPageSize={10}
              onEdit={(row) => console.log("Sửa", row)}
              onDelete={(row) => console.log("Xóa", row)}
              onView={(row) => console.log("Xem", row)}
            />
          )}
        </div>
      </div>

      <CreateAssetModal open={isNewModalOpen} setOpen={setNewIsModalOpen} />
    </>
  );
};

export default AssetsPage;
