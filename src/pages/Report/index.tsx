import { useState, useMemo } from "react";
import { Plus, Printer, FileDown, Trash2 } from "lucide-react";
import PageHeader from "@components/common/PageHeader";
import ActionDropdown from "@components/common/ActionDropdown";
import type { ActionOption } from "@/types";
import ServicesBarChart from "./components/RevenueExpenseChart";
import AssetStatusSummary from "./components/AssetStatus";
import RevenueExpenseChart from "./components/RevenueChart";
import StatCard from "./components/StatCard";

const ReportPage = () => {
  const handleImport = () => {
    console.log("import");
  };


  const actions: ActionOption[] = useMemo(
    () => [
      {
        id: "import",
        label: "Import Excel",
        icon: <FileDown />,
        onClick: handleImport,
      },
      {
        id: "print",
        label: "In danh sách",
        icon: <Printer />,
        onClick: () => console.log("In"),
      },
    ],
    [],
  );

  return (
    <div className="p-1.5 pt-0 space-y-4">
      <PageHeader
        title="Báo cáo thống kê"
        subtitle="Trang báo cáo tổng hợp"
        actions={
          <div className="flex items-center gap-2">
            {/* nếu có import thì truyền file */}
            <ActionDropdown
              options={actions}
              sampleFileUrl="/template/asset_import_template.xlsx"
            />
          </div>
        }
      />

      <div className="space-y-6">
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
          <h2 className="mb-4 text-xl font-semibold">Doanh thu &amp; Chi phí</h2>
          <RevenueExpenseChart />
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold">Dịch vụ (lượt)</h3>
            <ServicesBarChart />
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-7 text-sm font-semibold">Tài sản &amp; Thiết bị</h3>
            <AssetStatusSummary broken={96} maintaining={705} good={1113} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
