import axiosInstance from "@/lib/axios";
import type {
  GetUserNotificationsResponse,
  UnreadCountResponse,
  UserNotificationStatsResponse,
  MarkAsReadResponse,
} from "@/types/system-notification";

const BASE = "/system-notifications";

export interface QueryUserNotificationParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: string;
}

export const systemNotificationService = {
  /**
   * Lấy danh sách thông báo của user hiện tại
   */
  getMyNotifications: async (params?: QueryUserNotificationParams) => {
    const response = await axiosInstance.get<GetUserNotificationsResponse>(
      `${BASE}/my-notifications`,
      { params },
    );
    return response.data;
  },

  /**
   * Lấy số lượng thông báo chưa đọc
   */
  getUnreadCount: async () => {
    const response = await axiosInstance.get<UnreadCountResponse>(
      `${BASE}/my-notifications/unread-count`,
    );
    return response.data;
  },

  /**
   * Lấy thống kê thông báo
   */
  getMyStats: async () => {
    const response = await axiosInstance.get<UserNotificationStatsResponse>(
      `${BASE}/my-notifications/stats`,
    );
    return response.data;
  },

  /**
   * Đánh dấu một thông báo là đã đọc
   */
  markAsRead: async (notificationId: number) => {
    const response = await axiosInstance.put<MarkAsReadResponse>(
      `${BASE}/my-notifications/${notificationId}/read`,
    );
    return response.data;
  },

  /**
   * Đánh dấu tất cả thông báo là đã đọc
   */
  markAllAsRead: async () => {
    const response = await axiosInstance.put<MarkAsReadResponse>(
      `${BASE}/my-notifications/mark-all-read`,
    );
    return response.data;
  },
};
