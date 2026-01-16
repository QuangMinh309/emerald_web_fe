import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import ActionDropdown from "@/components/common/ActionDropdown";
import CustomTable from "@/components/common/CustomTable";
import { SearchBar } from "@/components/common/SearchBar";
import { TabNavigation } from "@/components/common/TabNavigation";

import { maintenanceColumns } from "./columns";
import type { ActionOption } from "@/types";
import { normalizeString } from "@/utils/string";
import { useMaintenanceTickets } from "@/hooks/data/useMaintenance";
import CreateMaintenanceModal from "@/pages/Maintenances/create-maintenance";
import DeleteMaintenanceModal from "@/pages/Maintenances/delete-maintenance";
import UpdateMaintenanceModal from "@/pages/Maintenances/update-maintenance";
import AssignTechnicianModal from "@/pages/Maintenances/assign-technician";
import CompleteMaintenanceModal from "@/pages/Maintenances/complete-maintenance";
import type { MaintenanceTicketListItem } from "@/types/maintenance";
import { useNavigate } from "react-router-dom";

const MaintenancesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("incident");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<MaintenanceTicketListItem>();
  const [selectedTicketId, setSelectedTicketId] = useState<number>();

  // Lấy dữ liệu từ Hooks
  const { data: tickets = [], isLoading, isError, error, refetch } = useMaintenanceTickets();

  // Logic lọc dữ liệu theo tab và search
  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    // Filter by tab (ticket type)
    if (activeTab === "incident") {
      result = result.filter((item) => item.type === "INCIDENT");
    } else if (activeTab === "maintenance") {
      result = result.filter((item) => item.type === "MAINTENANCE");
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = normalizeString(searchTerm);
      result = result.filter(
        (item) =>
          normalizeString(item.title).includes(search) ||
          normalizeString(item.type).includes(search) ||
          normalizeString(item.blockName || "").includes(search) ||
          normalizeString(item.technicianName || "").includes(search) ||
          normalizeString(item.assetName || "").includes(search),
      );
    }

    return result;
  }, [tickets, searchTerm, activeTab]);

  // Actions cho Dropdown
  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "delete_all",
        label: "Xóa tất cả",
        icon: <Trash2 className="w-4 h-4" />,
        variant: "danger",
        onClick: () => confirm("Xóa toàn bộ dữ liệu?") && console.log("Delete All"),
        disabled: tickets.length === 0,
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
        disabled: tickets.length === 0,
      },
    ],
    [tickets.length],
  );

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title="Bảo trì & Sửa chữa"
          subtitle="Quản lý các yêu cầu bảo trì và sửa chữa trong chung cư"
          actions={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Tạo yêu cầu
              </button>

              <ActionDropdown
                options={actions}
                sampleFileUrl="/template/maintenance_import_template.xlsx"
              />
            </div>
          }
        />

        {/* Khu vực lọc & tìm kiếm */}
        <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm space-y-4">
          <TabNavigation
            tabs={[
              { id: "incident", label: "Phản ánh cư dân" },
              { id: "maintenance", label: "Bảo trì định kỳ" },
            ]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSearchTerm("");
            }}
          />

          <SearchBar
            placeholder="Tìm kiếm theo tiêu đề, tòa nhà, kỹ thuật viên..."
            onSearch={setSearchTerm}
          />
        </div>

        {/* Hiển thị nội dung chính */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
              Đang tải dữ liệu yêu cầu bảo trì...
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
              data={filteredTickets}
              columns={maintenanceColumns}
              defaultPageSize={10}
              onEdit={(row) => {
                setIsUpdateOpen(true);
                setSelectedTicketId((row as MaintenanceTicketListItem).id);
              }}
              onDelete={(row) => {
                setIsDeleteOpen(true);
                setSelectedTicket(row as MaintenanceTicketListItem);
              }}
              onView={(row) => navigate(`/maintenances/${row.id}`)}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateMaintenanceModal open={isCreateModalOpen} setOpen={setIsCreateModalOpen} />
      <DeleteMaintenanceModal
        selectedTicket={selectedTicket}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
      <UpdateMaintenanceModal
        open={isUpdateOpen}
        setOpen={setIsUpdateOpen}
        ticketId={selectedTicketId!}
      />
      <AssignTechnicianModal
        open={isAssignOpen}
        setOpen={setIsAssignOpen}
        ticketId={selectedTicketId!}
      />
      <CompleteMaintenanceModal
        open={isCompleteOpen}
        setOpen={setIsCompleteOpen}
        ticketId={selectedTicketId!}
      />
    </>
  );
};

export default MaintenancesPage;
