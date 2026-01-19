import { buildLinearScale, buildNiceTicks } from "@/lib/chart";

export type BarPoint = { label: string; value: number };

type Props = {
  data: BarPoint[];
  width?: number;
  height?: number;
  ariaLabel?: string;
  maxFallback?: number;
};
const MAX_BAR_W = 90;
const MIN_GAP = 18;

export default function ServicesBarChart({
  data,
  width = 520,
  height = 240,
  ariaLabel = "Dịch vụ",
}: Props) {
  const padding = { l: 44, r: 18, t: 10, b: 44 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;

  if (!data || data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-200 p-6 text-sm text-neutral-600">
        Không có dữ liệu để hiển thị.
      </div>
    );
  }
  const n = data.length;
  const totalGap = n > 1 ? (n - 1) * MIN_GAP : 0;
  const barW = Math.min(MAX_BAR_W, (innerW - totalGap) / n);

  const startX = padding.l + 10;
  const rawMax = Math.max(...data.map((d) => Math.round(d.value)), 0);
  const baseMax = rawMax === 0 ? 10 : rawMax;

  const maxWithPad = Math.ceil(baseMax * 1.1);

  const ticks = buildNiceTicks(0, maxWithPad, 5, { minStep: 1, multipleOf: 5 });
  const yMax = ticks[ticks.length - 1] ?? maxWithPad;

  const y = buildLinearScale(0, yMax, padding.t + innerH, padding.t);

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[240px] w-full min-w-[420px]"
        role="img"
        aria-label={ariaLabel}
      >
        {/* Grid + y labels */}
        {ticks.map((t) => {
          const yy = y(t);
          return (
            <g key={t}>
              <line
                x1={padding.l}
                y1={yy}
                x2={width - padding.r}
                y2={yy}
                className="stroke-indigo-200"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding.l - 10}
                y={yy + 4}
                textAnchor="end"
                className="fill-neutral-500 text-[12px]"
              >
                {t}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const x = startX + i * (barW + MIN_GAP);
          const h = y(0) - y(d.value);
          const yy = y(d.value);
          return (
            <g key={d.label}>
              <rect x={x} y={yy} width={barW} height={h} rx="10" className="fill-neutral-200" />
              <text
                x={x + barW / 2}
                y={height - 16}
                textAnchor="middle"
                className="fill-neutral-600 text-[12px]"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
