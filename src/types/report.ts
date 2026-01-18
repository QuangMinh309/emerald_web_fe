export type RangeType = "month" | "year" | "custom";

export type ReportsParams = {
  // rangeType: RangeType;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
};

export type RevenueBlock = {
  totalRevenue: number;
  percentageComparedToPreviousMonth: number;
};

export type DebtBlock = {
  totalDebt: number;
  totalApartmentsOwing: number;
};

export type MaintenanceBlock = {
  totalAssetsMaintenanced: number;
};

export type RevenueExpenseRawItem = {
  label: string;      // "2026-01-02"
  revenue: number;
  expense: number;
};

export type ServiceBookingRawItem = {
  serviceName: string;
  bookingCount: number;
};

export type AssetStatus = {
  brokenAssets?: number;
  maintenancedAssets?: number;
  workingAssets?: number;
};

export type DashboardReport = {
  revenue?: RevenueBlock;
  debt?: DebtBlock;
  maintenance?: MaintenanceBlock;

  revenueExpenseChart: RevenueExpenseRawItem[];
  serviceBookingChart: ServiceBookingRawItem[];

  assetStatus?: AssetStatus;
};
