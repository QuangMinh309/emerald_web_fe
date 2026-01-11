import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import ActionDropdown from "@components/common/ActionDropdown";
import CustomTable from "@components/common/CustomTable";
import { TabNavigation } from "@components/common/TabNavigation";
import { SearchBar } from "@/components/common/SearchBar";
import type { Asset } from "./columns";
import { assetColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";

const AssetsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // data mẫu
  const data: Asset[] = [
    {
      id: "1",
      code: "TS-001",
      name: "Thang máy A01",
      type: "Thang máy",
      location: "Tòa A - Sảnh",
      status: "good",
      lastMaintenance: "02/12/2025",
    },
    {
      id: "2",
      code: "TS-002",
      name: "Tủ điện tổng",
      type: "Điện",
      location: "Tòa A - Hầm",
      status: "broken",
      lastMaintenance: "01/12/2025",
    },
  ];

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const normalizedSearch = normalizeString(searchTerm);

    return data.filter((item) => {
      // đang hard code, nhưng nếu nhiều tab, các tab khác cột thì check config columns để dynamic
      return (
        normalizeString(item.name).includes(normalizedSearch) ||
        normalizeString(item.code).includes(normalizedSearch) ||
        normalizeString(item.type).includes(normalizedSearch) ||
        normalizeString(item.location).includes(normalizedSearch)
      );
    });
  }, [data, searchTerm]);

  const handleImport = () => {
    console.log("import");
  };

  // muốn thêm thao tác thì thêm, danger => đỏ
  const actions: ActionOption[] = useMemo(
    () => [
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
      {
        id: "delete_more",
        label: "Xóa nhiều",
        icon: <Trash2 />,
        variant: "danger",
        onClick: () => console.log("Xóa nhiều"),
      },
    ],
    [],
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

            {/* nếu có import thì truyền file */}
            <ActionDropdown
              options={actions}
              sampleFileUrl="/template/asset_import_template.xlsx"
            />
          </div>
        }
      />

      <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* có thể chỉnh kích thước tab */}
          <TabNavigation
            tabs={[
              { id: "all", label: "Tất cả thiết bị" },
              { id: "elevator", label: "Thang máy" },
              { id: "electric", label: "Hệ thống điện" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            // size = "md"
          />
        </div>

        <div className="w-full">
          <SearchBar
            placeholder="Tìm kiếm theo mã, tên tài sản, vị trí..."
            onSearch={setSearchTerm}
          />
        </div>
      </div>

      <CustomTable
        data={filteredData}
        columns={assetColumns}
        defaultPageSize={10}
        onEdit={(row) => console.log("Sửa", row)}
        onDelete={(row) => console.log("Xóa", row)}
        onView={(row) => console.log("Xem", row)}
      />
    </div>
  );
};

export default AssetsPage;
