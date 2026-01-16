import PageHeader from "@/components/common/PageHeader";
import Spinner from "@/components/common/Spinner";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { TicketStatusMap } from "@/constants/ticketStatus";
import {
  useStartMaintenanceWork,
  useCancelMaintenanceTicket,
  useUpdateMaintenanceProgress,
  useMaintenanceTicketDetail,
} from "@/hooks/data/useMaintenance";
import DeleteMaintenanceModal from "@/pages/Maintenances/delete-maintenance";
import UpdateMaintenanceModal from "@/pages/Maintenances/update-maintenance";
import AssignTechnicianModal from "@/pages/Maintenances/assign-technician";
import CompleteMaintenanceModal from "@/pages/Maintenances/complete-maintenance";
import { Edit, Trash2, UserCheck, Play, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { TicketTypeOptions } from "@/constants/ticketType";
import { TicketPriorityOptions } from "@/constants/ticketPriority";
import { MaintenanceResultOptions } from "@/constants/maintenanceResult";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import type { MaintenanceChecklistItem } from "@/types/maintenance";
import PopConfirm from "@/components/common/PopConfirm";

const DetailMaintenancePage = () => {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const { id } = useParams();
  const { data: ticket, isLoading } = useMaintenanceTicketDetail(Number(id));
  const { mutate: startWork, isPending: isStarting } = useStartMaintenanceWork();
  const { mutate: cancelTicket } = useCancelMaintenanceTicket();
  const { mutate: updateProgress, isPending: isUpdatingProgress } = useUpdateMaintenanceProgress();

  const [localChecklist, setLocalChecklist] = useState<MaintenanceChecklistItem[]>([]);

  // Sync local checklist with ticket data
  useState(() => {
    if (ticket?.checklistItems) {
      setLocalChecklist(ticket.checklistItems);
    }
  });

  const handleStartWork = () => {
    if (!id) return;
    startWork(Number(id), {
      onSuccess: () => {
        toast.success("Đã bắt đầu công việc");
      },
      onError: (error) => {
        toast.error(`Lỗi: ${error.message}`);
      },
    });
  };

  const handleCancelTicket = () => {
    if (!id || !cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy");
      return;
    }
    cancelTicket(
      { id: Number(id), reason: cancelReason },
      {
        onSuccess: () => {
          toast.success("Đã hủy yêu cầu");
          setIsCancelOpen(false);
          setCancelReason("");
        },
        onError: (error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      },
    );
  };

  const handleChecklistChange = (index: number, isChecked: boolean) => {
    const newChecklist = [...localChecklist];
    newChecklist[index] = { ...newChecklist[index], isChecked };
    setLocalChecklist(newChecklist);

    // Auto-save progress
    if (id && ticket?.status === "IN_PROGRESS") {
      updateProgress(
        { id: Number(id), checklistItems: newChecklist },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật tiến độ");
          },
          onError: (error) => {
            toast.error(`Lỗi: ${error.message}`);
          },
        },
      );
    }
  };

  if (!id) {
    return (
      <div className="p-1.5 pt-0 space-y-4">
        <div className="bg-red-50 border border-red-200 p-8 rounded text-center text-red-600">
          Không tìm thấy ID yêu cầu bảo trì
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <Spinner />
      </div>
    );
  }

  const typeOption = TicketTypeOptions.find((opt) => opt.value === ticket?.type);
  const priorityOption = TicketPriorityOptions.find((opt) => opt.value === ticket?.priority);
  const resultOption = MaintenanceResultOptions.find((opt) => opt.value === ticket?.result);

  const config = TicketStatusMap[ticket?.status!] ?? {
    label: "Không xác định",
    type: "default",
  };

  const canAssign = ticket?.status === "PENDING";
  const canStart = ticket?.status === "ASSIGNED";
  const canComplete = ticket?.status === "IN_PROGRESS";
  const canCancel = ["PENDING", "ASSIGNED"].includes(ticket?.status || "");
  const canEdit = ["PENDING", "ASSIGNED", "IN_PROGRESS"].includes(ticket?.status || "");

  const headerActions = (
    <div className="flex items-center gap-2">
      {canCancel && (
        <Button
          className="h-9 px-3 bg-orange-600 text-white hover:bg-orange-700"
          onClick={() => setIsCancelOpen(true)}
        >
          <XCircle size={16} className="mr-2" /> Hủy yêu cầu
        </Button>
      )}
      {canAssign && (
        <Button
          className="h-9 px-3 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setIsAssignOpen(true)}
        >
          <UserCheck size={16} className="mr-2" /> Giao việc
        </Button>
      )}
      {canStart && (
        <Button
          className="h-9 px-3 bg-green-600 text-white hover:bg-green-700"
          onClick={handleStartWork}
          disabled={isStarting}
        >
          <Play size={16} className="mr-2" /> Bắt đầu
        </Button>
      )}
      {canComplete && (
        <Button
          className="h-9 px-3 bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => setIsCompleteOpen(true)}
        >
          <CheckCircle size={16} className="mr-2" /> Hoàn thành
        </Button>
      )}
      {canEdit && (
        <>
          <Button
            className="h-9 px-3 bg-red-600 text-white border-red-200 hover:bg-red-700"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 size={16} className="mr-2" /> Xóa
          </Button>
          <Button
            className="h-9 px-4 bg-[#1F4E3D] hover:bg-[#16382b] text-white shadow-sm"
            onClick={() => setIsUpdateOpen(true)}
          >
            <Edit size={16} className="mr-2" /> Chỉnh sửa
          </Button>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader
          title={ticket?.title ?? "Chi tiết yêu cầu bảo trì"}
          showBack
          actions={headerActions}
        />

        <div className="bg-white p-4 pt-6 pb-6 rounded-sm border border-gray-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="title-text">Thông tin chung</h2>
            <StatusBadge label={config.label} type={config.type} />
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div>
                <h3 className="display-label">Loại yêu cầu</h3>
                <p className="display-text">{typeOption?.label || ticket?.type}</p>
              </div>

              <div>
                <h3 className="display-label">Độ ưu tiên</h3>
                <p className="display-text">{priorityOption?.label || "Chưa xác định"}</p>
              </div>

              <div>
                <h3 className="display-label">Tòa nhà</h3>
                <p className="display-text">{ticket?.blockName}</p>
              </div>

              <div>
                <h3 className="display-label">Tầng</h3>
                <p className="display-text">Tầng {ticket?.floor}</p>
              </div>

              <div>
                <h3 className="display-label">Căn hộ</h3>
                <p className="display-text">{ticket?.apartmentNumber || "Không có"}</p>
              </div>

              <div>
                <h3 className="display-label">Tài sản</h3>
                <p className="display-text">{ticket?.assetName || "Không có"}</p>
              </div>

              <div>
                <h3 className="display-label">Loại tài sản</h3>
                <p className="display-text">{ticket?.assetTypeName || "Không có"}</p>
              </div>
            </div>

            {ticket?.description && (
              <div>
                <h3 className="display-label">Mô tả chi tiết</h3>
                <p className="display-text">{ticket.description}</p>
              </div>
            )}
          </div>

          {/* Kỹ thuật viên */}
          {ticket?.technicianId && (
            <>
              <div>
                <h2 className="title-text">Kỹ thuật viên phụ trách</h2>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div>
                    <h3 className="display-label">Tên kỹ thuật viên</h3>
                    <p className="display-text">{ticket.technicianName}</p>
                  </div>

                  <div>
                    <h3 className="display-label">Số điện thoại</h3>
                    <p className="display-text">{ticket.technicianPhone || "Không có"}</p>
                  </div>

                  <div>
                    <h3 className="display-label">Ngày giao việc</h3>
                    <p className="display-text">
                      {ticket.assignedDate
                        ? new Date(ticket.assignedDate).toLocaleString("vi-VN")
                        : "Chưa có"}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Danh sách công việc */}
          {localChecklist && localChecklist.length > 0 && (
            <>
              <div>
                <h2 className="title-text">Danh sách công việc</h2>
              </div>
              <div className="space-y-3">
                {localChecklist.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Checkbox
                      id={`task-${index}`}
                      checked={item.isChecked}
                      onCheckedChange={(checked) =>
                        handleChecklistChange(index, checked as boolean)
                      }
                      disabled={ticket?.status !== "IN_PROGRESS" || isUpdatingProgress}
                    />
                    <label
                      htmlFor={`task-${index}`}
                      className={`text-sm ${
                        item.isChecked ? "line-through text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {item.task}
                    </label>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Thời gian */}
          <div>
            <h2 className="title-text">Thông tin thời gian</h2>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              <div>
                <h3 className="display-label">Ngày tạo</h3>
                <p className="display-text">
                  {new Date(ticket?.createdAt || "").toLocaleString("vi-VN")}
                </p>
              </div>

              <div>
                <h3 className="display-label">Ngày bắt đầu</h3>
                <p className="display-text">
                  {ticket?.startedDate
                    ? new Date(ticket.startedDate).toLocaleString("vi-VN")
                    : "Chưa bắt đầu"}
                </p>
              </div>

              <div>
                <h3 className="display-label">Ngày hoàn thành</h3>
                <p className="display-text">
                  {ticket?.completedDate
                    ? new Date(ticket.completedDate).toLocaleString("vi-VN")
                    : "Chưa hoàn thành"}
                </p>
              </div>
            </div>
          </div>

          {/* Kết quả (nếu đã hoàn thành) */}
          {ticket?.status === "COMPLETED" && (
            <>
              <div>
                <h2 className="title-text">Kết quả bảo trì</h2>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                  <div>
                    <h3 className="display-label">Kết quả</h3>
                    <p className="display-text">{resultOption?.label || ticket.result}</p>
                  </div>

                  <div>
                    <h3 className="display-label">Chi phí vật liệu</h3>
                    <p className="display-text">
                      {ticket.materialCost
                        ? `${ticket.materialCost.toLocaleString("vi-VN")} VNĐ`
                        : "0 VNĐ"}
                    </p>
                  </div>

                  <div>
                    <h3 className="display-label">Chi phí nhân công</h3>
                    <p className="display-text">
                      {ticket.laborCost
                        ? `${ticket.laborCost.toLocaleString("vi-VN")} VNĐ`
                        : "0 VNĐ"}
                    </p>
                  </div>

                  <div>
                    <h3 className="display-label">Tổng chi phí</h3>
                    <p className="display-text font-semibold">
                      {ticket.totalCost
                        ? `${ticket.totalCost.toLocaleString("vi-VN")} VNĐ`
                        : "0 VNĐ"}
                    </p>
                  </div>
                </div>

                {ticket.resultNote && (
                  <div>
                    <h3 className="display-label">Ghi chú kết quả</h3>
                    <p className="display-text">{ticket.resultNote}</p>
                  </div>
                )}

                {ticket.hasIssue && (
                  <div>
                    <h3 className="display-label text-red-600">Vấn đề phát sinh</h3>
                    <p className="display-text text-red-600">{ticket.issueDetail}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <DeleteMaintenanceModal
        selectedTicket={ticket as any}
        open={isDeleteOpen}
        setOpen={setIsDeleteOpen}
      />
      <UpdateMaintenanceModal open={isUpdateOpen} setOpen={setIsUpdateOpen} ticketId={Number(id)} />
      <AssignTechnicianModal open={isAssignOpen} setOpen={setIsAssignOpen} ticketId={Number(id)} />
      <CompleteMaintenanceModal
        open={isCompleteOpen}
        setOpen={setIsCompleteOpen}
        ticketId={Number(id)}
      />

      {/* Cancel Confirmation */}
      <PopConfirm
        title="Xác nhận hủy yêu cầu"
        open={isCancelOpen}
        setOpen={setIsCancelOpen}
        handleConfirm={handleCancelTicket}
      >
        <div className="space-y-3">
          <p>Bạn có chắc chắn muốn hủy yêu cầu này không?</p>
          <div>
            <label className="text-sm font-medium">Lý do hủy:</label>
            <textarea
              className="w-full mt-1 p-2 border rounded-md"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy yêu cầu..."
            />
          </div>
        </div>
      </PopConfirm>
    </>
  );
};

export default DetailMaintenancePage;
