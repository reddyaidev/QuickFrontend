import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Dimensions {
  length: string;
  width: string;
  height: string;
  unit: 'cm' | 'm' | 'mm';
}

export interface Item {
  name: string;
  weight?: string;
  dimensions?: Dimensions;
  quantity: number;
}

interface ItemsListProps {
  onChange: (items: Item[]) => void;
}

const PREDEFINED_ITEMS = [
  "Sofa",
  "Bed",
  "Table",
  "Chair",
  "Refrigerator",
  "TV",
  "Washing Machine",
];

const DIMENSION_UNITS = [
  { value: 'cm', label: 'Centimeters' },
  { value: 'm', label: 'Meters' },
  { value: 'mm', label: 'Millimeters' },
];

export default function ItemsList({ onChange }: ItemsListProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [customItem, setCustomItem] = useState<Item>({
    name: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: 'cm'
    },
    quantity: 1,
  });

  const updateItems = (newItems: Item[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const addPredefinedItem = (name: string) => {
    const existingItem = items.find(item => item.name === name);
    if (existingItem) {
      updateItems(
        items.map(item =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      updateItems([...items, { name, quantity: 1 }]);
    }
  };

  const addCustomItem = () => {
    if (!customItem.name) return;
    updateItems([...items, { ...customItem }]);
    setCustomItem({
      name: "",
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
        unit: 'cm'
      },
      quantity: 1,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Quick Add</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {PREDEFINED_ITEMS.map(item => (
            <Button
              key={item}
              variant="outline"
              size="sm"
              onClick={() => addPredefinedItem(item)}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              {item}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Label>Custom Item</Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Item name"
            className="flex-1"
            value={customItem.name}
            onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
          />
          <Input
            placeholder="Weight (kg)"
            type="number"
            min="0"
            className="w-24"
            value={customItem.weight}
            onChange={e => setCustomItem({ ...customItem, weight: e.target.value })}
          />
          <div className="flex items-center gap-1">
            <Input
              placeholder="L"
              type="number"
              min="0"
              className="w-16"
              value={customItem.dimensions?.length}
              onChange={e => setCustomItem({
                ...customItem,
                dimensions: {
                  ...customItem.dimensions!,
                  length: e.target.value
                }
              })}
            />
            <span>×</span>
            <Input
              placeholder="W"
              type="number"
              min="0"
              className="w-16"
              value={customItem.dimensions?.width}
              onChange={e => setCustomItem({
                ...customItem,
                dimensions: {
                  ...customItem.dimensions!,
                  width: e.target.value
                }
              })}
            />
            <span>×</span>
            <Input
              placeholder="H"
              type="number"
              min="0"
              className="w-16"
              value={customItem.dimensions?.height}
              onChange={e => setCustomItem({
                ...customItem,
                dimensions: {
                  ...customItem.dimensions!,
                  height: e.target.value
                }
              })}
            />
          </div>
          <Select 
            value={customItem.dimensions?.unit}
            onValueChange={(value: 'cm' | 'm' | 'mm') => setCustomItem({
              ...customItem,
              dimensions: {
                ...customItem.dimensions!,
                unit: value
              }
            })}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {DIMENSION_UNITS.map(unit => (
                <SelectItem key={unit.value} value={unit.value}>
                  {unit.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={addCustomItem}
            disabled={!customItem.name}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}