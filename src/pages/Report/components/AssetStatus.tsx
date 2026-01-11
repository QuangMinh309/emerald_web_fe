// import { cn } from "@/lib/format";

export default function AssetStatusSummary(props: {
  broken: number;
  maintaining: number;
  good: number;
}) {
  const { broken, maintaining, good } = props;
  const total = broken + maintaining + good;

  const brokenPct = total ? (broken / total) * 100 : 0;
  const maintainingPct = total ? (maintaining / total) * 100 : 0;
  const goodPct = total ? (good / total) * 100 : 0;

  return (
    <div className="space-y-5">
      {/* segmented bar */}
      <div className="flex h-10 w-full overflow-hidden rounded-2xl bg-neutral-100">
        <div className="bg-rose-400" style={{ width: `${brokenPct}%` }} />
        <div className="bg-yellow-300" style={{ width: `${maintainingPct}%` }} />
        <div className="bg-emerald-300" style={{ width: `${goodPct}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Metric label="Hư hỏng" value={broken} />
        <Metric label="Đang bảo trì" value={maintaining} />
        <Metric label="Hoạt động tốt" value={good} />
      </div>
    </div>
  );
}

function Metric(props: { label: string; value: number }) {
  const { label, value } = props;
  return (
    <div className="space-y-1">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="flex items-center gap-2 text-xl font-semibold">
        <span>{value.toLocaleString("vi-VN")}</span>
      </div>
    </div>
  );
}
