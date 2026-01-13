"use client";

import PopConfirm from "@/components/common/PopConfirm";
import { useDeleteNotification } from "@/hooks/data/useNotifications";
import type { NotificationData } from "@/types/notification";
import { toast } from "sonner";

interface DeleteNotificationProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedNotification: NotificationData | null | undefined;
}

const DeleteNotification = ({ open, setOpen, selectedNotification }: DeleteNotificationProps) => {
  const { mutate: deleteNoti } = useDeleteNotification();

  const handleDelete = () => {
    if (!selectedNotification?.id) return;

    deleteNoti(selectedNotification.id, {
      onSuccess: () => {
        toast.success("Thông báo đã được xóa thành công");
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error(`Lỗi: ${error?.message || "Không thể xóa thông báo"}`);
      },
    });
  };

  return (
    <PopConfirm title="Xác nhận xóa" open={open} setOpen={setOpen} handleConfirm={handleDelete}>
      <p className="text-sm text-gray-600">
        Bạn có chắc chắn muốn xóa thông báo{" "}
        <span className="font-semibold text-gray-900">"{selectedNotification?.title}"</span> không?
      </p>
    </PopConfirm>
  );
};

export default DeleteNotification;
