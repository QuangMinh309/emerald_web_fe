"use client";

import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageHeader from "@/components/common/PageHeader";
import ActionDropdown from "@/components/common/ActionDropdown";
import CustomTable from "@/components/common/CustomTable";
import { SearchBar } from "@/components/common/SearchBar";
import PopConfirm from "@/components/common/PopConfirm";
import { TabNavigation } from "@/components/common/TabNavigation";

import CreateNotificationModal from "@/pages/Notifications/create-notification";
import UpdateNotificationModal from "@/pages/Notifications/update-notification";
import DeleteNotification from "@/pages/Notifications/delete-notification";

import { useNotifications, useDeleteManyNotifications } from "@/hooks/data/useNotifications";
import { notificationColumns } from "./columns";
import { normalizeString } from "@/utils/string";
import type { NotificationData } from "@/types/notification";
import type { ActionOption, TabItem } from "@/types";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | undefined>();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<NotificationData | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteManyOpen, setIsDeleteManyOpen] = useState(false);

  const { data: notifications = [], isLoading, isError, error, refetch } = useNotifications();

  const { mutate: deleteMany, isPending: isDeletingMany } = useDeleteManyNotifications();

  const filteredData = useMemo(() => {
    let result = [...notifications];

    // lọc theo tab
    if (activeTab !== "ALL") {
      result = result.filter((item) => item.type === activeTab);
    }

    // lọc theo search
    if (searchTerm.trim()) {
      const search = normalizeString(searchTerm);
      result = result.filter((item) => normalizeString(item.title).includes(search));
    }

    return result;
  }, [notifications, searchTerm, activeTab]);

  // tab
  const tabs: TabItem[] = useMemo(() => {
    const getCount = (type: string) => notifications.filter((n) => n.type === type).length;
    return [
      { id: "ALL", label: "Tất cả", count: notifications.length },
      { id: "GENERAL", label: "Thông báo chung", count: getCount("GENERAL") },
      { id: "MAINTENANCE", label: "Bảo trì", count: getCount("MAINTENANCE") },
      { id: "WARNING", label: "Cảnh báo", count: getCount("WARNING") },
      { id: "POLICY", label: "Chính sách", count: getCount("POLICY") },
    ];
  }, [notifications]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const handleEdit = (item: NotificationData) => {
    setEditingId(item.id);
    setIsUpdateOpen(true);
  };

  const handleDelete = (item: NotificationData) => {
    setDeletingItem(item);
    setIsDeleteOpen(true);
  };

  const handleConfirmDeleteMany = () => {
    if (selectedIds.length === 0) return;
    const idsNumeric = selectedIds.map(Number);

    deleteMany(idsNumeric, {
      onSuccess: () => {
        toast.success(`Đã xóa ${selectedIds.length} thông báo`);
        setSelectedIds([]);
        setIsDeleteManyOpen(false);
      },
      onError: () => {
        toast.error("Lỗi khi xóa nhiều thông báo");
        setIsDeleteManyOpen(false);
      },
    });
  };

  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "print",
        label: "In danh sách",
        icon: <Printer className="w-4 h-4" />,
        onClick: () => window.print(),
        disabled: notifications.length === 0,
      },
      {
        id: "export",
        label: "Xuất Excel",
        icon: <FileDown className="w-4 h-4" />,
        onClick: () => console.log("Exporting..."),
      },
    ],
    [notifications.length],
  );

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title="Thông báo cư dân"
          subtitle="Quản lý tin tức, sự kiện và thông báo bảo trì"
          actions={
            <div className="flex items-center gap-2">
              {selectedIds.length > 0 ? (
                <button
                  onClick={() => setIsDeleteManyOpen(true)}
                  className="flex items-center gap-2 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg hover:bg-destructive/90 transition-colors text-sm font-medium animate-in fade-in zoom-in-95 shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Xóa ({selectedIds.length})
                </button>
              ) : (
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-main/90 transition-colors text-sm font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  Tạo thông báo
                </button>
              )}
              <ActionDropdown options={actions} />
            </div>
          }
        />

        <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm space-y-4">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={(tabId) => {
              setActiveTab(tabId);
              setSearchTerm("");
            }}
            size="md"
          />

          <SearchBar placeholder="Tìm kiếm theo tiêu đề,..." onSearch={setSearchTerm} />
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
              Đang tải dữ liệu thông báo...
            </div>
          ) : isError ? (
            <div className="bg-red-50 border border-red-200 p-8 rounded text-center space-y-3 text-red-600">
              <p className="font-medium">Không thể tải dữ liệu!</p>
              <p className="text-sm">{(error as any)?.message || "Lỗi không xác định"}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                Thử lại ngay
              </button>
            </div>
          ) : (
            <CustomTable
              data={filteredData}
              columns={notificationColumns}
              defaultPageSize={10}
              onSelectionChange={handleSelectionChange}
              selection={selectedIds}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={(row) => navigate(`/notifications/${row.id}`)}
            />
          )}
        </div>
      </div>

      <CreateNotificationModal open={isCreateOpen} setOpen={setIsCreateOpen} />

      {!!editingId && (
        <UpdateNotificationModal
          open={isUpdateOpen}
          setOpen={(v) => {
            setIsUpdateOpen(v);
            if (!v) setEditingId(undefined);
          }}
          notificationId={editingId}
        />
      )}

      <DeleteNotification
        open={isDeleteOpen}
        setOpen={(val) => {
          setIsDeleteOpen(val);
          if (!val) setDeletingItem(null);
        }}
        selectedNotification={deletingItem}
      />

      <PopConfirm
        open={isDeleteManyOpen}
        setOpen={setIsDeleteManyOpen}
        title="Xóa nhiều thông báo"
        handleConfirm={handleConfirmDeleteMany}
        submitText="Xóa ngay"
        onLoading={isDeletingMany}
      >
        <div className="text-sm text-gray-600">
          Bạn có chắc chắn muốn xóa{" "}
          <span className="font-bold text-red-600 text-base">{selectedIds.length}</span> thông báo
          đã chọn không?
          <br />
          <span className="italic text-xs text-gray-500 mt-1 block">
            Hành động này không thể hoàn tác. Dữ liệu sẽ bị xóa vĩnh viễn.
          </span>
        </div>
      </PopConfirm>
    </>
  );
};

export default NotificationsPage;
