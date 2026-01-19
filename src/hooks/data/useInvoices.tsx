import {
  createInvoiceByAdmin,
  deleteInvoice,
  deleteManyInvoices,
  getInvoiceById,
  getInvoices,
  updateInvoice,
  verifyInvoice,
} from "@/services/invoices.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Invoice Hooks
export const useInvoices = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
};

export const useGetInvoiceById = (id: number) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id,
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoiceByAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
};

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useDeleteManyInvoices = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: number[]) => deleteManyInvoices(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useVerifyInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
};
