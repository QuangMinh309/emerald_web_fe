import type { SystemNotificationPriorityType } from "@/constants/systemNotificationPriority";
import type { SystemNotificationType } from "@/constants/systemNotificationType";
import axiosInstance from "@/lib/axios";

import type { SystemNotification, SystemUserNotification } from "@/types/system-notification";

interface SendSystemNotificationDto {
  title: string;
  content: string;

  type?: SystemNotificationType;
  priority?: SystemNotificationPriorityType;

  targetUserIds?: number[];

  metadata?: Record<string, any>;

  actionUrl?: string;
  actionText?: string;

  isPersistent?: boolean;

  scheduledFor?: string;
  expiresAt?: string;
}

export const sendSystemNotification = async (data: SendSystemNotificationDto) => {
  const response = await axiosInstance.post("/system-notifications/send", data);

  return response.data;
};

/**
 * [ADMIN] Get notification statistics
 */
export const getSystemNotificationStats = async () => {
  const response = await axiosInstance.get("/system-notifications/admin/stats");

  return response.data;
};

/**
 * [ADMIN] Get notification detail
 */
export const getSystemNotificationDetail = async (id: number) => {
  const response = await axiosInstance.get(`/system-notifications/admin/${id}`);

  return response.data as SystemNotification;
};

/* =====================================================
   USER APIs
===================================================== */

/**
 * Get my notifications
 */
export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/system-notifications/my-notifications", {});

  return response.data.data as SystemUserNotification[];
};

/**
 * Get unread notification count
 */
export const getUnreadNotificationCount = async () => {
  const response = await axiosInstance.get("/system-notifications/my-notifications/unread-count");

  return response.data as {
    unreadCount: number;
  };
};

/**
 * Get my notification statistics
 */
export const getMyNotificationStats = async () => {
  const response = await axiosInstance.get("/system-notifications/my-notifications/stats");

  return response.data as {
    total: number;
    unread: number;
    read: number;
  };
};

/**
 * Mark one notification as read
 */
export const markNotificationAsRead = async (notificationId: number) => {
  const response = await axiosInstance.put(
    `/system-notifications/my-notifications/${notificationId}/read`,
  );

  return notificationId;
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = async () => {
  const response = await axiosInstance.put("/system-notifications/my-notifications/mark-all-read");

  return response.data;
};
