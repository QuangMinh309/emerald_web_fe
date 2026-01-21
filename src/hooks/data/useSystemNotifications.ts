import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  systemNotificationService,
  type QueryUserNotificationParams,
} from "@/services/system-notifications.service";
import { toast } from "sonner";

const QUERY_KEY = "system-notifications";

export const useSystemNotifications = (params?: QueryUserNotificationParams) => {
  return useQuery({
    queryKey: [QUERY_KEY, "my-notifications", params],
    queryFn: () => systemNotificationService.getMyNotifications(params),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "unread-count"],
    queryFn: () => systemNotificationService.getUnreadCount(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useNotificationStats = () => {
  return useQuery({
    queryKey: [QUERY_KEY, "stats"],
    queryFn: () => systemNotificationService.getMyStats(),
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number) => systemNotificationService.markAsRead(notificationId),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: () => {
      toast.error("Không thể đánh dấu đã đọc");
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => systemNotificationService.markAllAsRead(),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast.success("Đã đánh dấu tất cả là đã đọc");
    },
    onError: () => {
      toast.error("Không thể đánh dấu tất cả đã đọc");
    },
  });
};
