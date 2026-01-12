import {
  createResident,
  deleteResident,
  getResidentById,
  getResidents,
  updateAsset,
} from "@/services/residents.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Resident Hooks
export const useResidents = () => {
  return useQuery({
    queryKey: ["residents"],
    queryFn: getResidents,
  });
};

export const useGetResidentById = (id: number) => {
  return useQuery({
    queryKey: ["resident", id],
    queryFn: () => getResidentById(id),
    enabled: !!id,
  });
};

export const useCreateResident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
};

export const useUpdateResident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
      queryClient.invalidateQueries({ queryKey: ["resident"] });
    },
  });
};

export const useDeleteResident = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteResident,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["residents"] });
    },
  });
};
