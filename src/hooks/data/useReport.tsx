import { useQuery } from "@tanstack/react-query";
import { getReports } from "@/services/report.service";
import type { DashboardReport, ReportsParams } from "@/types/report";

export const useReports = (params: ReportsParams, enabled = true) =>
  useQuery<DashboardReport>({
    queryKey: ["reports", params],
    queryFn: () => getReports(params),

    enabled:
      enabled &&
<<<<<<< HEAD
        (Boolean(params.startDate) && Boolean(params.endDate)),
=======
      (params.rangeType !== "custom" || (Boolean(params.startDate) && Boolean(params.endDate))),
>>>>>>> c861f3a7d56d67a90278bd1590ddf07bfd5df77b

    retry: (count, err: any) => {
      const status = err?.response?.status ?? err?.response?.data?.statusCode;
      if (status === 401 || status === 403) return false;
      return count < 2;
    },

    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
