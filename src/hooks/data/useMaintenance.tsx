import { getMaintenances } from "@/services/maintenance.service";
import { useQuery } from "@tanstack/react-query";

export const useMaintenances = () =>
  useQuery({
    queryKey: ["maintenances"],
    queryFn: getMaintenances,
  });
