import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, className, type = "text", ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 pt-4 pb-1 text-sm",
            "ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "peer",
            error ? "border-red-500" : "border-input",
          )}
          placeholder=" "
          ref={ref}
          {...props}
        />
        <label
          className={cn(
            "absolute left-3 top-1 z-10 text-xs",
            "peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-focus:top-1 peer-focus:text-xs",
            "transition-all duration-200",
            error ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {label}
        </label>
        {error && (
          <span className="text-xs text-red-500 mt-1 absolute -bottom-5 left-0">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
