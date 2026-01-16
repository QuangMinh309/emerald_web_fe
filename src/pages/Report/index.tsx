import { useState, useMemo, useEffect } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import type { ActionOption } from "@/types";
import ServicesBarChart, { type BarPoint } from "./components/ServiceBarChart";
import AssetStatusSummary from "./components/AssetStatus";
import RevenueExpenseChart, { type Point } from "./components/RevenueChart";
import StatCard from "../../components/common/StatCard";
import { TabNavigation } from "@/components/common/TabNavigation";
import { MonthPicker } from "./components/MonthPicker";
import { YearPicker } from "./components/YearPicker";
import { DatePicker } from "@/components/common/DatePicker";

type PeriodType = "month" | "year" | "all";
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function startOfYear(year: number) {
  return new Date(year, 0, 1);
}
function endOfYear(year: number) {
  return new Date(year, 11, 31, 23, 59, 59, 999);
}
const mockRevenue: Point[] = [
  { label: "1 Oct", value: 1800 },
  { label: "3 Oct", value: 2600 },
  { label: "7 Oct", value: 2000 },
  { label: "10 Oct", value: 2800 },
  { label: "14 Oct", value: 3900 },
  { label: "20 Oct", value: 1600 },
  { label: "23 Oct", value: 600 },
  { label: "27 Oct", value: 1800 },
  { label: "30 Oct", value: 3800 },
];

const mockExpense: Point[] = [
  { label: "1 Oct", value: 200 },
  { label: "3 Oct", value: 1200 },
  { label: "7 Oct", value: 1500 },
  { label: "10 Oct", value: 800 },
  { label: "14 Oct", value: 2900 },
  { label: "20 Oct", value: 3800 },
  { label: "23 Oct", value: 2900 },
  { label: "27 Oct", value: 3600 },
  { label: "30 Oct", value: 2000 },
];

const mockServices: BarPoint[] = [
  { label: "Tennis", value: 360 },
  { label: "BBQ", value: 240 },
  { label: "Cầu lông", value: 180 },
  { label: "Nhà SHC", value: 110 },
];

const ReportPage = () => {
  const [periodTab, setPeriodTab] = useState<PeriodType>("month");

  //monthValue: string format "yyyy-mm"
  const [monthValue, setMonthValue] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    return `${now.getFullYear()}-${mm}`;
  });

  const [yearValue, setYearValue] = useState(() => {
    return String(new Date().getFullYear());
  });

  const [allFrom, setAllFrom] = useState<Date | undefined>(undefined);
  const [allTo, setAllTo] = useState<Date | undefined>(undefined);

  const dateRange = useMemo(() => {
    if (periodTab === "month") {
      const [y, m] = monthValue.split("-").map(Number);
      const from = new Date(y, (m ?? 1) - 1, 1);
      return { from: from, to: endOfMonth(from), label: `Tháng ${m}-${y}` };
    } else if (periodTab === "year") {
      const y = Number(yearValue);
      return { from: startOfYear(y), to: endOfYear(y), label: `Năm ${y}` };
    } else {
      const label =
        allFrom && allTo
          ? `${allFrom.toLocaleDateString()} - ${allTo.toLocaleDateString()}`
          : "Tất cả";
      return { from: allFrom, to: allTo, label };
    }
  }, [periodTab, monthValue, yearValue, allFrom, allTo]);

  const chartData = [];
  const hasData = mockRevenue.length > 0;

  useEffect(() => {
    if (periodTab !== "all") {
      setAllFrom(undefined);
      setAllTo(undefined);
    }
  }, [periodTab]);

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader
        title="Báo cáo thống kê"
        subtitle="Trang báo cáo tổng hợp"
        actions={
          <div className="flex flex-col align-bottom items-end gap-2">
            <TabNavigation
              tabs={[
                { id: "month", label: "Theo tháng" },
                { id: "year", label: "Theo năm" },
                { id: "all", label: "Tất cả" },
              ]}
              activeTab={periodTab}
              onChange={(tab) => setPeriodTab(tab as any)}
            />
          </div>
        }
      />

      <div className="space-y-4">
        <div className="flex justify-end">
          {periodTab === "month" && <MonthPicker value={monthValue} onChange={setMonthValue} />}
          {periodTab === "year" && (
            <YearPicker value={Number(yearValue)} onChange={(year) => setYearValue(String(year))} />
          )}
          {periodTab === "all" && (
            <div className="flex items-center gap-2">
              <div className="w-[160px]">
                <DatePicker
                  value={allFrom}
                  placeholder="Từ ngày"
                  onChange={(d) => {
                    setAllFrom(d);
                    // nếu user chọn from > to thì tự clear to (hoặc auto set)
                    if (d && allTo && d > allTo) setAllTo(undefined);
                  }}
                />
              </div>
              <span className="text-neutral-500">-</span>
              <div className="w-[160px]">
                <DatePicker
                  value={allTo}
                  placeholder="Đến ngày"
                  onChange={(d) => {
                    // chặn chọn to < from
                    if (d && allFrom && d < allFrom) return;
                    setAllTo(d);
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="Doanh thu"
            value="980 triệu"
            note="+8.2% so với tháng trước"
            accent="emerald"
          />
          <StatCard title="Tổng công nợ" value="245,8 triệu" note="32 căn hộ còn nợ" accent="red" />
          <StatCard
            title="Đã bảo trì"
            value="10 thiết bị"
            note="Xem chi tiết"
            accent="amber"
            clickable
          />
        </div>

        {/* Big chart */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Doanh thu &amp; Chi phí</h2>
            <span className="text-sm text-neutral-500">{dateRange.label}</span>
          </div>
          {hasData ? (
            <RevenueExpenseChart revenue={mockRevenue} expense={mockExpense} />
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-sm text-neutral-600">
              Không có dữ liệu trong khoảng <b>{dateRange.label}</b>. Hãy thử chọn tháng/năm khác
              hoặc chuyển sang “Tất cả”.
            </div>
          )}
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Dịch vụ (lượt)</h3>
            {hasData ? (
              <ServicesBarChart data={mockServices} />
            ) : (
              <div className="text-sm text-neutral-600">Chưa có dữ liệu.</div>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-7 text-sm font-semibold">Tài sản &amp; Thiết bị</h3>
            <AssetStatusSummary data={{ broken: 96, maintaining: 705, good: 1113 }} />
            {/* <AssetStatusSummary data={apiData.assetStatus} loading={isLoading} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
