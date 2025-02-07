import { TruckIcon } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <TruckIcon className="h-8 w-8 text-[#FFC107]" />
      <div>
        <h1 className="font-bold text-xl leading-none">Moving Baba</h1>
        <p className="text-xs text-muted-foreground">Moving Made Easy</p>
      </div>
    </div>
  );
}
