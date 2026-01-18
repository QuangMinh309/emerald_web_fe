// src/hooks/useServices.ts
import { getMyNotifications } from "@/services/system-notifcation.service";
import { useQuery } from "@tanstack/react-query";

export const useMySystemNotifications = () => {
  return useQuery({
    queryKey: ["systemNotifications"],
    queryFn: getMyNotifications,
  });
};
