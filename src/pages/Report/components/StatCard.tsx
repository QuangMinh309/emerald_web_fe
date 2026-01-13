import { cn } from "@/lib/format";

type Accent = "emerald" | "red" | "amber";

const accentMap: Record<Accent, string> = {
  emerald: "border-0 border-l-4 border-l-emerald-600 shadow-[0px_0_2px_#00000080]",
  red: "border-0 border-l-4 border-l-red-600 shadow-[0px_0_2px_#00000080]",
  amber: "border-0 border-l-4 border-l-amber-500 shadow-[0px_0_2px_#00000080]",
};

const valueMap: Record<Accent, string> = {
  emerald: "text-emerald-600",
  red: "text-red-600",
  amber: "text-amber-500",
};

export default function StatCard(props: {
  title: string;
  value: string;
  note: string;
  accent: Accent;
  clickable?: boolean;
}) {
  const { title, value, note, accent, clickable } = props;

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm",
        accentMap[accent],
        clickable ? "cursor-pointer hover:bg-neutral-50" : ""
      )}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      <div className="text-base font-semibold">{title}</div>
      <div className={cn("mt-1 text-2xl font-semibold", valueMap[accent])}>
        {value}
      </div>
      <div className="mt-4 text-sm text-neutral-500">{note}</div>
    </div>
  );
}
