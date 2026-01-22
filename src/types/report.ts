// reports.types.ts
export type RangeType = "month" | "year" | "custom";

export type ReportsParams = {
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string; // "YYYY-MM-DD"
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
  label: string; // "YYYY-MM-DD"
  revenue: number;
  expense: number;
};

export type ServiceBookingRawItem = {
  serviceName: string;
  bookingCount: number;
};

/**
 * API hiện trả về:
 * - brokenAssets
 * - maintenanceAssets
 * - workingAssets
 *
 * File cũ đang có maintenancedAssets (sai key).
 * Để không vỡ code cũ + code mới dùng được, giữ cả 2.
 */
export type AssetStatus = {
  brokenAssets?: number;
  maintenanceAssets?: number;     // ✅ key đúng theo API mới
  maintenancedAssets?: number;    // ✅ giữ lại để trang cũ không lỗi (nếu có)
  workingAssets?: number;
};

export type DashboardReport = {
  revenue?: RevenueBlock;
  debt?: DebtBlock;
  maintenance?: MaintenanceBlock;

  // nên để optional để tránh crash nếu API/old data không trả về 2 mảng này
  revenueExpenseChart?: RevenueExpenseRawItem[];
  serviceBookingChart?: ServiceBookingRawItem[];

  assetStatus?: AssetStatus;
};

/** Nếu bạn có wrapper response chuẩn như ví dụ API */
export type DashboardReportResponse = {
  statusCode: number;
  message: string;
  data: DashboardReport;
  timestamp: string;
  path: string;
  takenTime: string;
};
