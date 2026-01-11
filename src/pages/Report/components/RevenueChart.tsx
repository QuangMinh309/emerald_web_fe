import { buildLinearScale, buildPoints } from "@/lib/chart";
// import { cn } from "@/lib/format";

type Point = { label: string; value: number };

const revenue: Point[] = [
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

const expense: Point[] = [
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

export default function RevenueExpenseChart() {
  const width = 1200;
  const height = 280;

  const padding = { l: 44, r: 18, t: 16, b: 42 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;

  const all = [...revenue, ...expense].map((p) => p.value);
  const min = 0;
  const max = Math.max(...all, 4000);

  const x = buildLinearScale(0, revenue.length - 1, padding.l, padding.l + innerW);
  const y = buildLinearScale(min, max, padding.t + innerH, padding.t);

  const revPts = buildPoints(revenue.map((d) => d.value), x, y);
  const expPts = buildPoints(expense.map((d) => d.value), x, y);

  const revPath = toPath(revPts);
  const expPath = toPath(expPts);

  const ticks = [0, 1000, 2000, 3000, 4000];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height + 30}`}
        className="h-[290px] w-full min-w-[720px]"
        role="img"
        aria-label="Doanh thu và chi phí"
      >
        {/* Grid + Y axis labels */}
        {ticks.map((t) => {
          const yy = y(t);
          return (
            <g key={t}>
              <line
                x1={padding.l}
                y1={yy}
                x2={width - padding.r}
                y2={yy}
                className="stroke-neutral-200"
                strokeWidth="1"
              />
              <text
                x={padding.l - 10}
                y={yy + 4}
                textAnchor="end"
                className="fill-neutral-500 text-[12px]"
              >
                {t === 0 ? "0" : `${t / 1000}k`}
              </text>
            </g>
          );
        })}

        {/* X labels */}
        {revenue.map((d, i) => (
          <text
            key={d.label}
            x={x(i)}
            y={height - 16}
            textAnchor="middle"
            className="fill-neutral-500 text-[12px]"
          >
            {d.label}
          </text>
        ))}

        {/* Lines */}
        <path d={revPath} fill="none" className="stroke-emerald-900" strokeWidth="2" />
        <path d={expPath} fill="none" className="stroke-orange-400" strokeWidth="2" />

        {/* Points */}
        {revPts.map((p, idx) => (
          <circle key={`r-${idx}`} cx={p.x} cy={p.y} r="5" className="fill-white stroke-emerald-900" strokeWidth="2" />
        ))}
        {expPts.map((p, idx) => (
          <circle key={`e-${idx}`} cx={p.x} cy={p.y} r="5" className="fill-white stroke-orange-400" strokeWidth="2" />
        ))}

        {/* Legend */}
        <g transform={`translate(${width - 320}, ${height + 30})`}>
          <circle cx="8" cy="-6" r="4" className="fill-emerald-900" />
          <text x="18" y="-2" className="fill-neutral-600 text-[12px]">
            Doanh thu (triệu đồng)
          </text>

          <circle cx="170" cy="-6" r="4" className="fill-orange-400" />
          <text x="180" y="-2" className="fill-neutral-600 text-[12px]">
            Chi phí (triệu đồng)
          </text>
        </g>
      </svg>
    </div>
  );
}

function toPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return "";
  return points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");
}
