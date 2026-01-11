import { buildLinearScale } from "@/lib/chart";

const data = [
  { label: "Tennis", value: 360 },
  { label: "BBQ", value: 240 },
  { label: "Cầu lông", value: 180 },
  { label: "Nhà SHC", value: 110 },
];

export default function ServicesBarChart() {
  const width = 520;
  const height = 240;

  const padding = { l: 44, r: 18, t: 10, b: 44 };
  const innerW = width - padding.l - padding.r;
  const innerH = height - padding.t - padding.b;

  const max = Math.max(...data.map((d) => d.value), 400);
  const y = buildLinearScale(0, max, padding.t + innerH, padding.t);

  const ticks = [0, 100, 200, 300, 400].filter((t) => t <= max);

  const gap = 22;
  const barW = (innerW - gap * (data.length - 1)) / data.length;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[240px] w-full min-w-[420px]"
        role="img"
        aria-label="Dịch vụ"
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
          const x = padding.l + i * (barW + gap);
          const h = y(0) - y(d.value);
          const yy = y(d.value);

          return (
            <g key={d.label}>
              <rect
                x={x}
                y={yy}
                width={barW}
                height={h}
                rx="10"
                className="fill-neutral-200"
              />
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
