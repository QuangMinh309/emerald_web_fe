import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBookingsByServiceId, updateBooking } from "@/services/bookings.service";

/**
 * Lấy list booking của 1 service.
 */
export const useBookingsByServiceId = (serviceId?: number, enabled = true) => {
  const isValidId = Number.isFinite(serviceId) && (serviceId as number) > 0;

  return useQuery({
    queryKey: ["bookings", "service", isValidId ? serviceId : "invalid"],
    queryFn: () => getBookingsByServiceId(serviceId as number),
    enabled: enabled && isValidId,
  });
};

/**
 * Soft delete
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBooking,
    onSuccess: (updated) => {
      // refetch đúng list của service chứa booking đó
      queryClient.invalidateQueries({
        queryKey: ["bookings", "service", updated.serviceId],
      });
    },
  });
};

