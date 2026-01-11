import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import ActionDropdown from "@components/common/ActionDropdown";
import CustomTable from "@components/common/CustomTable";
import { TabNavigation } from "@components/common/TabNavigation";
import { SearchBar } from "@/components/common/SearchBar";

import { assetColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useAssets } from "@/hooks/data/useAssests";

const AssetsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: assets = [], isLoading, isError, error, refetch } = useAssets();

  const filteredData = useMemo(() => {
    if (!assets.length) return [];

    if (!searchTerm.trim()) return assets;

    const normalizedSearch = normalizeString(searchTerm);

    return assets.filter((item) => {
      return (
        normalizeString(item.name).includes(normalizedSearch) ||
        normalizeString(item.code).includes(normalizedSearch) ||
        normalizeString(item.type).includes(normalizedSearch) ||
        normalizeString(item.location).includes(normalizedSearch)
      );
    });
  }, [assets, searchTerm]);

  const handleImport = () => {
    console.log("import");
  };

  const handleDeleteAll = () => {
    if (!assets.length) return;

    if (confirm("Bạn có chắc muốn xóa tất cả?")) {
      console.log("deleting all...");
    }
  };

  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "delete_all",
        label: "Xóa tất cả",
        icon: <Trash2 />,
        variant: "danger",
        onClick: handleDeleteAll,
        disabled: assets.length === 0,
      },
      {
        id: "delete_more",
        label: "Xóa nhiều",
        icon: <Trash2 />,
        variant: "danger",
        onClick: () => console.log("Xóa nhiều"),
        disabled: assets.length === 0,
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
        disabled: assets.length === 0,
      },
    ],
    [assets.length],
  );

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader
        title="Tài sản, thiết bị"
        subtitle="Quản lý danh sách các tài sản, thiết bị trong tòa nhà"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Tạo tài sản
            </button>

            <ActionDropdown
              options={actions}
              sampleFileUrl="/template/asset_import_template.xlsx"
            />
          </div>
        }
      />

      <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <TabNavigation
            tabs={[
              { id: "all", label: "Tất cả thiết bị" },
              { id: "elevator", label: "Thang máy" },
              { id: "electric", label: "Hệ thống điện" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </div>

        <div className="w-full">
          <SearchBar
            placeholder="Tìm kiếm theo mã, tên tài sản, vị trí..."
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      {isLoading && (
        <div className="bg-white p-6 rounded border text-center text-gray-500">
          Đang tải dữ liệu tài sản...
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 p-6 rounded text-red-600 space-y-2">
          <div>Không thể tải dữ liệu tài sản.</div>
          <div className="text-sm">{(error as Error)?.message}</div>
          <button
            onClick={() => refetch()}
            className="mt-2 px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !isError && filteredData.length === 0 && (
        <div className="bg-white p-6 rounded border text-center text-gray-500">
          Không có dữ liệu tài sản.
        </div>
      )}

      {!isLoading && !isError && filteredData.length > 0 && (
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
  );
};

export default AssetsPage;
