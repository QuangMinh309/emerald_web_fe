import {
  assignTechnician,
  cancelMaintenanceTicket,
  completeMaintenanceTicket,
  createMaintenanceTicket,
  deleteMaintenanceTicket,
  getMaintenanceTicketDetail,
  getMaintenanceTickets,
  startMaintenanceWork,
  updateMaintenanceProgress,
  updateMaintenanceTicket,
} from "@/services/maintenances.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useMaintenanceTickets = () => {
  return useQuery({
    queryKey: ["maintenance-tickets"],
    queryFn: getMaintenanceTickets,
  });
};

export const useGetMaintenanceTicketById = (id: number) => {
  return useQuery({
    queryKey: ["maintenance-ticket", id],
    queryFn: () => getMaintenanceTicketDetail(id),
    enabled: !!id,
  });
};

export const useCreateMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMaintenanceTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
    },
  });
};

export const useUpdateMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMaintenanceTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};

export const useDeleteMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMaintenanceTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
    },
  });
};

export const useAssignTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignTechnician,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};

export const useStartMaintenanceWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startMaintenanceWork,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};

export const useUpdateMaintenanceProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMaintenanceProgress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};

export const useCompleteMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: completeMaintenanceTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};

export const useCancelMaintenanceTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelMaintenanceTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenance-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["maintenance-ticket"] });
    },
  });
};
