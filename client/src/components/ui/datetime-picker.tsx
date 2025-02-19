import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
}

function generateTimeOptions() {
  const options = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 6; j++) {
      const hour = i % 12 || 12; // Convert 0 to 12 for 12 AM
      const period = i < 12 ? 'AM' : 'PM';
      const minute = j * 10;
      const timeString = `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
      const value = `${i.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push({ label: timeString, value });
    }
  }
  return options;
};

export function DateTimePicker({ value, onChange, placeholder }: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [selectedTime, setSelectedTime] = React.useState<string | undefined>(
    value ? format(value, "HH:mm") : undefined
  );

  // Update internal state when external value changes
  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedTime(format(value, "HH:mm"));
    } else {
      setSelectedDate(undefined);
      setSelectedTime(undefined);
    }
  }, [value]);

  const timeOptions = generateTimeOptions();

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const newDate = new Date(date);
      if (selectedTime) {
        const [hours, minutes] = selectedTime.split(':').map(Number);
        newDate.setHours(hours, minutes);
      }
      onChange(newDate);
    } else {
      onChange(undefined);
    }
  };

  const handleTimeChange = (newTimeValue: string) => {
    setSelectedTime(newTimeValue);
    if (selectedDate && newTimeValue) {
      const [hours, minutes] = newTimeValue.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes);
      onChange(newDate);
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : placeholder || "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              // Don't automatically set a time when date is selected
              if (date && !selectedTime) {
                onChange(date);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {selectedDate && (
        <Select
          value={selectedTime}
          onValueChange={handleTimeChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select time">
              {selectedTime ? format(new Date(`2000-01-01T${selectedTime}`), "h:mm a") : "Select time"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="h-[300px]">
            {timeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
