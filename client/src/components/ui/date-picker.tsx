import * as React from "react";
import { cn } from "@/lib/utils";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, Clock } from "lucide-react";

interface DatePickerInputProps {
  error?: boolean;
  placeholder: string;
  label?: string;
  className?: string;
  showTimeSelectOnly?: boolean;
  selected?: Date;
  disabled?: boolean;
  onChange: (date: Date | null) => void;
  dateFormat?: string;
}

const DatePickerInput = ({
  error,
  placeholder,
  label,
  className,
  showTimeSelectOnly,
  ...props
}: DatePickerInputProps) => {
  return (
    <div className="relative">
      <div className="relative">
        {label && (
          <div
            className={cn(
              "absolute left-2 -top-2.5 z-10 px-1 bg-white text-xs transition-all",
              error ? "text-red-500" : "text-gray-500",
              props.selected ? "scale-75" : props.disabled ? "text-gray-400" : ""
            )}
          >
            {label}
          </div>
        )}
        <ReactDatePicker
          placeholderText={placeholder}
          className={cn(
            "flex h-10 w-64 rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10",
            error && "border-red-500 focus-visible:ring-red-500",
            label && "pt-2",
            className
          )}
          calendarClassName={showTimeSelectOnly ? "time-only-picker" : "!bg-white shadow-lg border border-gray-200 rounded-lg"}
          showTimeSelectOnly={showTimeSelectOnly} // Ensure this prop is passed
          timeIntervals={30} // Add this to set 30-minute intervals
          {...props}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          {showTimeSelectOnly ? (
            <Clock className="h-4 w-4" />
          ) : (
            <CalendarIcon className="h-4 w-4" />
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">
          Please select a valid {showTimeSelectOnly ? "time" : "date"}
        </p>
      )}
    </div>
  );
};

// Add custom styles for the date picker calendar
const styles = `
  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker-popper {
    background-color: white;
    z-index: 50;
  }

  .time-only-picker {
    width: 100px !important;
  }

  .time-only-picker .react-datepicker__time-container {
    width: 100px !important;
    border-left: none !important;
  }

  .time-only-picker .react-datepicker__time-box {
    width: 100px !important;
  }

  .time-only-picker .react-datepicker__time-list {
    padding: 0 !important;
  }

  .time-only-picker .react-datepicker__time-list-item {
    padding: 5px 10px !important;
    height: auto !important;
    line-height: 1.2 !important;
  }

  .time-only-picker .react-datepicker__header {
    display: none !important;
  }

  .time-only-picker .react-datepicker__month-container {
    display: none !important;
  }

  .time-only-picker .react-datepicker__navigation {
    display: none !important;
  }

  .time-only-picker .react-datepicker__time-container .react-datepicker__time {
    background: white !important;
  }

  .time-only-picker .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box {
    border-radius: 0.5rem !important;
  }

  .time-only-picker .react-datepicker__time-list-item--selected {
    background-color: #1B96FF !important;
  }

  .time-only-picker .react-datepicker__time-list-item:hover {
    background-color: #F3F3F3 !important;
  }

  .react-datepicker {
    font-family: inherit !important;
    border-radius: 0.5rem !important;
    border: 1px solid #e2e8f0 !important;
    background-color: white !important;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    padding: 0.5rem !important;
  }

  .react-datepicker__header {
    background-color: white !important;
    border-bottom: 1px solid #e2e8f0 !important;
    border-top-left-radius: 0.5rem !important;
    border-top-right-radius: 0.5rem !important;
    padding-top: 0.5rem !important;
  }

  .react-datepicker__month-container {
    background-color: white !important;
    float: none !important;
  }
  
  .react-datepicker__day-names {
    background-color: white !important;
    border-bottom: 1px solid #e2e8f0 !important;
    padding-bottom: 0.5rem !important;
  }

  .react-datepicker__day-name {
    color: #64748b !important;
    font-weight: 500 !important;
  }
  
  .react-datepicker__day {
    margin: 0.166rem !important;
    border-radius: 0.25rem !important;
    color: #1e293b !important;
    font-weight: 400 !important;
    background-color: white !important;
  }
  
  .react-datepicker__day:hover {
    background-color: #f1f5f9 !important;
  }
  
  .react-datepicker__day--selected {
    background-color: #1B96FF !important;
    color: white !important;
    font-weight: 500 !important;
  }
  
  .react-datepicker__day--keyboard-selected {
    background-color: #1B96FF !important;
    color: white !important;
    font-weight: 500 !important;
  }

  .react-datepicker__day--disabled {
    color: #cbd5e1 !important;
    background-color: transparent !important;
  }
  
  .react-datepicker__time-container {
    border-left: 1px solid #e2e8f0 !important;
    background-color: white !important;
    width: 100px !important;
  }

  .react-datepicker__time {
    background-color: white !important;
    border-radius: 0.5rem !important;
  }

  .react-datepicker__time-box {
    border-radius: 0.5rem !important;
    width: 100px !important;
  }

  .react-datepicker__time-list {
    height: 200px !important;
    overflow-y: auto !important;
    padding: 0 !important;
  }

  .react-datepicker__time-list::-webkit-scrollbar {
    width: 6px !important;
  }

  .react-datepicker__time-list::-webkit-scrollbar-track {
    background: #f1f5f9 !important;
    border-radius: 3px !important;
  }

  .react-datepicker__time-list::-webkit-scrollbar-thumb {
    background: #cbd5e1 !important;
    border-radius: 3px !important;
  }
  
  .react-datepicker__time-list-item {
    height: 36px !important;
    line-height: 36px !important;
    color: #1e293b !important;
    background-color: white !important;
    padding: 0 12px !important;
    font-size: 0.875rem !important;
    transition: all 0.2s !important;
    text-align: center !important;
  }

  .react-datepicker__time-list-item:hover:not(.react-datepicker__time-list-item--selected) {
    background-color: #f1f5f9 !important;
    color: #1B96FF !important;
  }
  
  .react-datepicker__time-list-item--selected {
    background-color: #1B96FF !important;
    color: white !important;
    font-weight: 500 !important;
  }

  .react-datepicker__time-list-item--disabled {
    color: #cbd5e1 !important;
    background-color: transparent !important;
    pointer-events: none !important;
  }
  
  .react-datepicker__triangle {
    display: none !important;
  }

  .react-datepicker__navigation {
    top: 8px !important;
  }

  .react-datepicker__navigation-icon::before {
    border-color: #64748b !important;
  }

  .react-datepicker__current-month {
    color: #1e293b !important;
    font-weight: 500 !important;
    margin-bottom: 0.5rem !important;
  }

  .react-datepicker__month {
    background-color: white !important;
    margin: 0 !important;
    padding: 0.5rem 0 !important;
  }

  .react-datepicker__week {
    background-color: white !important;
  }
`;

// Add styles to document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export { DatePickerInput };
