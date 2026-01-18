// src/hooks/useServices.ts
import {
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/services/system-notifcation.service";
import { useAppDispatch } from "@/store/hooks";
import { markAllRead, markOneRead } from "@/store/slices/notificationSlice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMySystemNotifications = () => {
  return useQuery({
    queryKey: ["systemNotifications"],
    queryFn: getMyNotifications,
  });
};
export const useMarkAsRead = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: (notificationId) => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
      dispatch(markOneRead(notificationId));
    },
  });
};
export const useMarkAllNotificationsAsRead = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["systemNotifications"] });
      dispatch(markAllRead());
    },
  });
};
