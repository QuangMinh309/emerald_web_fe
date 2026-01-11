import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import ActionDropdown from "@components/common/ActionDropdown";
import CustomTable from "@components/common/CustomTable";
import { TabNavigation } from "@components/common/TabNavigation";
import { SearchBar } from "@/components/common/SearchBar";
import type { Service } from "./columns";
import { assetColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useNavigate } from "react-router-dom";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // data mẫu
  const data: Service[] = [
      {
    id: "1",
    code: "TS-001",
    description: "Dịch vụ cho thuê sân bóng bàn trong khuôn viên chung cư.",
    name: "Bóng bàn",
    price: 70000,
    unit: "30 phút",
    start: "08:00",
    end: "20:00",
    max: 10,
    status: "active",
  },
  {
    id: "2",
    code: "TS-002",
    description: "Dịch vụ cho thuê sân cầu lông dành cho cư dân.",
    name: "Sân cầu lông",
    price: 50000,
    unit: "60 phút",
    start: "00:00",
    end: "23:59",
    max: 1,
    status: "inactive",
  },

  ];

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const normalizedSearch = normalizeString(searchTerm);

    return data.filter((item) => {
      return (
        normalizeString(item.name).includes(normalizedSearch) ||
        normalizeString(item.code).includes(normalizedSearch)
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
        title="Danh sách dịch vụ"
        subtitle="Quản lý  danh sách các dịch vụ của chung cư"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Thêm dịch vụ
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
        <div className="w-full">
          <SearchBar
            placeholder="Tìm kiếm theo tên dịch vụ, mã dịch vụ..."
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
        onView={(row) =>
        navigate(`/services/${row.id}`, {
          state: { service: row },
        })
      }
      />
    </div>
  );
};

export default ServicesPage;
