import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { FileText, Download, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/common/PageHeader";

import UpdateNotificationModal from "@/pages/Notifications/update-notification";
import DeleteNotification from "@/pages/Notifications/delete-notification";

import { useNotification } from "@/hooks/data/useNotifications";

const typeMap: Record<string, { label: string; className: string }> = {
  POLICY: {
    label: "Chính sách",
    className: "text-purple-700",
  },
  MAINTENANCE: {
    label: "Bảo trì",
    className: "text-emerald-700",
  },
  WARNING: {
    label: "Cảnh báo",
    className: "text-orange-700",
  },
  GENERAL: {
    label: "Thông báo chung",
    className: "text-blue-700",
  },
  default: {
    label: "Khác",
    className: "text-muted-foreground",
  },
};

const scopeMap: Record<string, string> = {
  ALL: "Toàn chung cư",
  BLOCK: "Theo tòa nhà",
  FLOOR: "Theo tầng",
};

const channelMap: Record<string, string> = {
  APP: "Phần mềm Emerald Tower",
  EMAIL: "Email cư dân",
};

const DetailNotificationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: notification, isLoading } = useNotification(Number(id));

  const typeCfg = typeMap[notification?.type ?? ""] || typeMap.default;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "---";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  // xóa + chỉnh sửa
  const headerActions = (
    <div className="flex items-center gap-2">
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
    </div>
  );

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-gray-500">Đang tải...</div>;
  }

  if (!notification) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <p>Không tìm thấy thông báo.</p>
        <Button variant="link" onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="p-1.5 pt-0 space-y-4">
        <PageHeader title={notification.title} showBack actions={headerActions} />

        <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div className="space-y-6">
              <div>
                <h3 className="display-label">Ngày gửi</h3>
                <p className="display-text">{formatDate(notification.createdAt)}</p>
              </div>
              <div>
                <h3 className="display-label">Loại nội dung</h3>
                <p className={`display-text ${typeCfg.className}`}>{typeCfg.label}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="display-label">Ngày cập nhật</h3>
                <p className="display-text">{formatDate(notification.updatedAt)}</p>
              </div>
              <div>
                <h3 className="display-label">Mức độ ưu tiên</h3>
                <p
                  className={`display-text ${
                    notification.isUrgent ? "text-red-600 font-bold" : ""
                  }`}
                >
                  {notification.isUrgent ? "Khẩn cấp" : "Bình thường"}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100" />

          <div>
            <h2 className="title-text mb-3">Nội dung</h2>
            <div className="display-text">{notification.content}</div>
          </div>

          {notification.fileUrls && notification.fileUrls.length > 0 && (
            <div>
              <h2 className="title-text mb-3">Tài liệu đính kèm</h2>
              <div className="flex flex-col gap-2">
                {notification.fileUrls.map((url: string, index: number) => {
                  const rawFileName = url.split("/").pop() || `File ${index + 1}`;
                  const cleanFileName = rawFileName.split("?")[0];
                  const fileName = decodeURIComponent(cleanFileName);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-md hover:border-green-600/50 transition-colors group bg-white"
                    >
                      <div className="flex items-center gap-3 overflow-hidden min-w-0">
                        <FileText className="w-5 h-5 text-orange-500 shrink-0" />
                        <span className="display-text truncate" title={fileName}>
                          {fileName}
                        </span>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-green-700 ml-4 shrink-0"
                      >
                        <Download size={18} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="w-full h-px bg-gray-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
            <div className="space-y-4">
              <h2 className="title-text">Đối tượng nhận thông báo</h2>

              <div className="space-y-3">
                <div>
                  <p className="display-text">{scopeMap[notification.targetScope || "ALL"]}</p>
                </div>

                {notification.targetScope !== "ALL" && (
                  <div className="mt-4">
                    <h3 className="display-label mb-2 font-medium"> Chi tiết đối tượng</h3>

                    <div className="bg-white rounded-lg border border-gray-300 overflow-hidden shadow-sm">
                      <div className="max-h-60 overflow-y-auto custom-scrollbar divide-y divide-gray-200">
                        {notification.targetBlocks?.map((tb: any, idx: number) => (
                          <div
                            key={idx}
                            className="grid grid-cols-[140px_1fr] gap-4 p-3 transition-colors items-center"
                          >
                            <div className="flex items-center">
                              <span
                                className="inline-flex items-center justify-center px-2.5 py-1 rounded-md bg-third text-main text-sm font-semibold border border-secondary/30 truncate w-full text-center shadow-sm"
                                title={tb.block?.name || `Tòa ${tb.blockId}`}
                              >
                                {tb.block?.name || `Tòa ${tb.blockId}`}
                              </span>
                            </div>

                            <div className="text-sm">
                              {tb.targetFloorNumbers?.length > 0 ? (
                                <span className="flex items-center gap-1.5">
                                  <span className="text-secondary font-medium text-sm">Tầng:</span>
                                  <span className="font-medium text-gray-700">
                                    {tb.targetFloorNumbers.join(", ")}
                                  </span>
                                </span>
                              ) : (
                                <span className=" text-secondary font-medium text-sm">
                                  Toàn bộ tòa
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="title-text">Kênh gửi</h2>
              <div>
                <div className="flex flex-col gap-2">
                  {notification.channels?.map((ch: string) => (
                    <span key={ch} className="display-text">
                      {channelMap[ch] || ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUpdateOpen && (
        <UpdateNotificationModal
          open={isUpdateOpen}
          setOpen={setIsUpdateOpen}
          notificationId={Number(id)}
        />
      )}

      {isDeleteOpen && notification && (
        <DeleteNotification
          open={isDeleteOpen}
          setOpen={setIsDeleteOpen}
          selectedNotification={notification}
          onSuccess={() => navigate("/notifications")}
        />
      )}
    </>
  );
};

export default DetailNotificationPage;
