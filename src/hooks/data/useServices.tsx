// src/hooks/useServices.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "@/services/services.service";
import type { Service } from "@/types/service";

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });
};

export const useGetServiceById = (id?: number) => {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => getServiceById(id as number),
    enabled: Number.isFinite(id) && (id as number) > 0,
  });
};

export const useServiceDetail = (id: number) => {
  return useQuery({
    queryKey: ["services", id],
    queryFn: () => getServiceById(id),
    enabled: Number.isFinite(id) && id > 0,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createService,
    onSuccess: (newItem) => {
      queryClient.setQueryData(["services"], (old: Service[] = []) => [newItem, ...old]);
      // hoặc vẫn invalidate nếu muốn sync với server:
      // queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateService,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["services", variables.id] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
