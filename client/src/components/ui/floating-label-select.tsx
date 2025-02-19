import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FloatingLabelSelectProps extends React.ComponentPropsWithoutRef<typeof Select> {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  error?: boolean;
  required?: boolean;
}

const FloatingLabelSelect = React.forwardRef<
  React.ElementRef<typeof Select>,
  FloatingLabelSelectProps
>(({ label, value, onValueChange, options, error, required, className, ...props }, ref) => {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative">
      <Select value={value} onValueChange={onValueChange} {...props}>
        <SelectTrigger 
          className={cn(
            "w-full h-10 px-3 py-2 text-sm bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-input focus:ring-ring",
            value && "pt-4"
          )}
        >
          <div className="flex items-center gap-2">
            {value && selectedOption?.icon && (
              <div className={cn(
                value === "true" ? "text-green-500" : 
                value === "false" ? "text-red-500" : ""
              )}>
                {selectedOption.icon}
              </div>
            )}
            <SelectValue placeholder={label} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="py-2"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {label && (
        <div
          className={cn(
            "absolute left-3 -top-2.5 px-1 bg-white text-xs transition-all",
            error ? "text-red-500" : "text-gray-500",
            !value && "hidden"
          )}
        >
          {label}
          {required && !value && <span className="text-red-500 ml-0.5">*</span>}
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-1">
          {required ? `${label.replace(' *', '')} is required` : `Please select ${label.toLowerCase()}`}
        </p>
      )}
    </div>
  );
});

FloatingLabelSelect.displayName = "FloatingLabelSelect";

export { FloatingLabelSelect };
