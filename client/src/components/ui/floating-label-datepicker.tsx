import * as React from "react";
import { cn } from "@/lib/utils";
import DatePicker from "react-datepicker";

interface FloatingLabelDatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  error?: boolean;
  showTimeSelect?: boolean;
  showTimeSelectOnly?: boolean;
  timeIntervals?: number;
  timeCaption?: string;
  dateFormat?: string;
  minDate?: Date;
  className?: string;
}

const FloatingLabelDatePicker = React.forwardRef<
  HTMLDivElement,
  FloatingLabelDatePickerProps
>(({ 
  label, 
  selected, 
  onChange, 
  error,
  showTimeSelect,
  showTimeSelectOnly,
  timeIntervals,
  timeCaption,
  dateFormat,
  minDate,
  className,
  ...props 
}, ref) => {
  const id = React.useId();
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div ref={ref} className="relative">
      <label
        htmlFor={id}
        className={cn(
          "absolute left-3 transition-all duration-200 pointer-events-none",
          (isFocused || selected) 
            ? "-top-2.5 text-xs bg-white px-1 z-10" 
            : "top-2.5 text-sm text-muted-foreground",
          error && "text-red-500"
        )}
      >
        {label}
      </label>
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        showTimeSelect={showTimeSelect}
        showTimeSelectOnly={showTimeSelectOnly}
        timeIntervals={timeIntervals}
        timeCaption={timeCaption}
        dateFormat={dateFormat}
        minDate={minDate}
        className={cn(
          "w-full h-10 px-3 rounded-md border text-sm",
          !selected && "text-[#706E6B]",
          "focus:outline-none focus:ring-2 focus:ring-[#1B96FF]",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
    </div>
  );
});

FloatingLabelDatePicker.displayName = "FloatingLabelDatePicker";

export { FloatingLabelDatePicker };
