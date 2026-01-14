type YearPickerProps = {
  value: number;
  onChange: (year: number) => void;
  yearRange?: number;
};

export function YearPicker({ value, onChange, yearRange = 6 }: YearPickerProps) {
  const years = Array.from({ length: yearRange }).map((_, i) => new Date().getFullYear() - i);

  return (
    <select
      className="h-9 rounded-lg border border-neutral-200 bg-white px-3 text-sm"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {years.map((y) => (
        <option key={y} value={y}>
          {y}
        </option>
      ))}
    </select>
  );
}
