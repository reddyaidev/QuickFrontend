import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  size?: "sm" | "default";
  className?: string;
}

export function QuantityStepper({ 
  quantity, 
  onQuantityChange,
  size = "default",
  className
}: QuantityStepperProps) {
  const buttonSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";
  const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const counterWidth = size === "sm" ? "w-4" : "w-6";
  
  return (
    <div className={cn(
      "flex items-center bg-white rounded-full border border-[#1B96FF] p-0.5",
      className
    )}>
      <Button
        size="sm"
        variant="outline"
        className={buttonSize}
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
      >
        <MinusIcon className={iconSize} />
      </Button>
      <span className={cn(
        "text-center font-medium text-[#1B96FF]",
        counterWidth,
        textSize
      )}>
        {quantity}
      </span>
      <Button
        size="sm"
        variant="outline"
        className={buttonSize}
        onClick={() => onQuantityChange(quantity + 1)}
      >
        <PlusIcon className={iconSize} />
      </Button>
    </div>
  );
}
