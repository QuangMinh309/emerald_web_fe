type MonthPickerProps = {
  value: string; // "YYYY-MM"
  onChange: (value: string) => void;
  yearRange?: number; // số năm lùi lại từ năm hiện tại
};

export function MonthPicker({ value, onChange, yearRange = 6 }: MonthPickerProps) {
  const [yStr, mStr] = value.split("-");
  const year = Number(yStr) || new Date().getFullYear();
  const month = Number(mStr) || new Date().getMonth() + 1;

  const years = Array.from({ length: yearRange }).map((_, i) => new Date().getFullYear() - i);

  return (
    <div className="flex gap-2">
      <select
        className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
        value={month}
        onChange={(e) => {
          const mm = String(e.target.value).padStart(2, "0");
          onChange(`${year}-${mm}`);
        }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const mm = i + 1;
          return (
            <option key={mm} value={mm}>
              Tháng {mm}
            </option>
          );
        })}
      </select>

      <select
        className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
        value={year}
        onChange={(e) => {
          const yy = e.target.value;
          onChange(`${yy}-${String(month).padStart(2, "0")}`);
        }}
      >
        {years.map((yy) => (
          <option key={yy} value={yy}>
            {yy}
          </option>
        ))}
      </select>
    </div>
  );
}
