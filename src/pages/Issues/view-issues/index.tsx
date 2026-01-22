"use client";

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, Printer } from "lucide-react";

import PageHeader from "@/components/common/PageHeader";
import ActionDropdown from "@/components/common/ActionDropdown";
import CustomTable from "@/components/common/CustomTable";
import { SearchBar } from "@/components/common/SearchBar";
import { TabNavigation } from "@/components/common/TabNavigation";
import { Button } from "@/components/ui/button";

import RejectIssueModal from "@/pages/Issues/reject-issue";
import ReceiveIssueModal from "@/pages/Issues/receive-issue";
import UpdateIssueModal from "@/pages/Issues/update-issue";

import { useIssues } from "@/hooks/data/useIssues";
import { getIssueColumns } from "./columns";
import { normalizeString } from "@/utils/string";
import type { IssueListItem } from "@/types/issue";
import type { TabItem } from "@/types";

const IssuesPage = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [receivingItem, setReceivingItem] = useState<IssueListItem | null>(null);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);

  const [rejectingItem, setRejectingItem] = useState<IssueListItem | null>(null);
  const [isRejectOpen, setIsRejectOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<IssueListItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: issues = [], isLoading, isError, refetch } = useIssues();

  // filter
  const filteredData = useMemo(() => {
    let result = [...issues];

    if (activeTab !== "ALL") {
      result = result.filter((item) => item.status === activeTab);
    }

    if (searchTerm.trim()) {
      const search = normalizeString(searchTerm);

      result = result.filter((item) => {
        const blockName = item.block?.name || "";
        const floorPart = item.floor ? `- Tầng ${item.floor}` : "";
        const fullLocation = `${blockName} ${floorPart}`;

        return (
          normalizeString(item.title).includes(search) ||
          normalizeString(item.reporter?.fullName || "").includes(search) ||
          normalizeString(fullLocation).includes(search)
        );
      });
    }

    return result;
  }, [issues, activeTab, searchTerm]);

  const tabs: TabItem[] = useMemo(() => {
    const getCount = (status: string) => issues.filter((i) => i.status === status).length;
    return [
      { id: "ALL", label: "Tất cả", count: issues.length },
      { id: "PENDING", label: "Chờ tiếp nhận", count: getCount("PENDING") },
      { id: "RECEIVED", label: "Đã tiếp nhận", count: getCount("RECEIVED") },
      { id: "PROCESSING", label: "Đang xử lý", count: getCount("PROCESSING") },
      { id: "RESOLVED", label: "Hoàn thành", count: getCount("RESOLVED") },
      { id: "REJECTED", label: "Từ chối", count: getCount("REJECTED") },
    ];
  }, [issues]);

  const handleReceive = (item: IssueListItem) => {
    setReceivingItem(item);
    setIsReceiveOpen(true);
  };

  const handleReject = (item: IssueListItem) => {
    setRejectingItem(item);
    setIsRejectOpen(true);
  };

  const handleEdit = (item: IssueListItem) => {
    setEditingItem(item);
    setIsEditOpen(true);
  };

  const headerActions = [
    {
      id: "print",
      label: "In danh sách",
      icon: <Printer className="w-4 h-4" />,
      onClick: () => window.print(),
    },
    {
      id: "export",
      label: "Xuất Excel",
      icon: <FileDown className="w-4 h-4" />,
      onClick: () => console.log("Exporting..."),
    },
  ];

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title="Phản ánh & Yêu cầu"
          subtitle="Quản lý tất cả phản ánh và yêu cầu từ cư dân"
          actions={
            <div className="flex items-center gap-2">
              <ActionDropdown options={headerActions} label="Thao tác" />
            </div>
          }
        />

        <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-sm space-y-4">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onChange={(id) => {
              setActiveTab(id);
              setSearchTerm("");
              setSelectedIds([]);
            }}
          />
          <SearchBar
            placeholder="Tìm kiếm theo tiêu đề, tên cư dân, tòa,..."
            onSearch={setSearchTerm}
          />
        </div>

        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="bg-white p-12 text-center text-gray-500 border rounded shadow-sm">
              Đang tải dữ liệu phản ánh...
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-sm text-red-500 gap-2">
              <p>Không thể tải dữ liệu.</p>
              <Button variant="outline" onClick={() => refetch()}>
                Thử lại
              </Button>
            </div>
          ) : (
            <CustomTable
              data={filteredData}
              columns={getIssueColumns({
                onView: (row) => navigate(`/issues/${row.id}`),
                onEdit: handleEdit,
                onReceive: handleReceive,
                onReject: handleReject,
              })}
              selection={selectedIds}
              onSelectionChange={(ids) => setSelectedIds(ids as string[])}
              defaultPageSize={10}
            />
          )}
        </div>
      </div>

      {isReceiveOpen && receivingItem && (
        <ReceiveIssueModal
          open={isReceiveOpen}
          setOpen={setIsReceiveOpen}
          issue={receivingItem}
          onSuccess={() => setReceivingItem(null)}
        />
      )}

      {isRejectOpen && rejectingItem && (
        <RejectIssueModal
          open={isRejectOpen}
          setOpen={setIsRejectOpen}
          issue={rejectingItem}
          onSuccess={() => setRejectingItem(null)}
        />
      )}

      {isEditOpen && editingItem && (
        <UpdateIssueModal
          open={isEditOpen}
          setOpen={setIsEditOpen}
          issueId={editingItem.id}
          onSuccess={() => setEditingItem(null)}
        />
      )}
    </>
  );
};

export default IssuesPage;
