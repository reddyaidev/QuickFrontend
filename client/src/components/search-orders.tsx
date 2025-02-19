import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchInput } from "./ui/search-input";

export default function SearchOrders() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Mock data - replace with actual API call
  const recentOrders = [
    { id: "ORD001", address: "123 Main St, Sydney", date: "2024-02-08" },
    { id: "ORD002", address: "456 Park Ave, Melbourne", date: "2024-02-07" },
    { id: "ORD003", address: "789 Queen St, Brisbane", date: "2024-02-06" },
  ];

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start border-[#E5E5E5] text-sm text-muted-foreground sm:w-64 lg:w-80"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="mr-2 h-4 w-4" />
        Search orders...
        <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className="flex items-center border-b px-3">
          <SearchInput
            placeholder="Search all orders..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <CommandList>
          <CommandEmpty>No orders found.</CommandEmpty>
          <CommandGroup heading="Recent Orders">
            {recentOrders.map((order) => (
              <CommandItem
                key={order.id}
                className="flex items-center justify-between"
                onSelect={() => {
                  // Handle order selection
                  setOpen(false);
                }}
              >
                <div>
                  <div className="font-medium">{order.id}</div>
                  <div className="text-sm text-muted-foreground">{order.address}</div>
                </div>
                <div className="text-sm text-muted-foreground">{order.date}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
