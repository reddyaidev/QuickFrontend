import React from "react";
import { Input } from "./input";
import { Button } from "./button";
import { X as XIcon, Search as SearchIcon } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="text"
          value={value}
          className="h-9 pr-16"
          {...props}
        />
        <div className="absolute right-0 top-0 h-full flex items-center gap-1 pr-3">
          {value && onClear && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={onClear}
            >
              <XIcon className="h-3 w-3" />
            </Button>
          )}
          <SearchIcon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    );
  }
);
