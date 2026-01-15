import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  type?: "date" | "month" | "year";
}

const typeConfig = {
  date: {
    format: "MM/dd/yyyy",
    mode: "single" as const,
  },
  month: {
    format: "MM/yyyy",
    mode: "single" as const,
  },
  year: {
    format: "yyyy",
    mode: "single" as const,
  },
};

export function DatePicker({ value, onChange, placeholder, type = "date" }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const dateValue = value ? new Date(value) : undefined;

  const config = typeConfig[type];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between font-normal text-left h-9 px-3",
            !dateValue && "text-muted-foreground",
          )}
        >
          {dateValue ? (
            format(dateValue, config.format)
          ) : (
            <span>{placeholder ?? config.format}</span>
          )}
          <ChevronDownIcon className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={config.mode}
          captionLayout="dropdown"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
