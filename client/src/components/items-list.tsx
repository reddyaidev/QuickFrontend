import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";
import { useState } from "react";

const PREDEFINED_ITEMS = [
  "Sofa",
  "Bed",
  "Table",
  "Chair",
  "Refrigerator",
  "TV",
  "Washing Machine",
];

interface ItemsListProps {
  onChange: (items: any[]) => void;
}

export default function ItemsList({ onChange }: ItemsListProps) {
  const [items, setItems] = useState<any[]>([]);
  const [customItem, setCustomItem] = useState({
    name: "",
    weight: "",
    dimensions: "",
    quantity: 1,
  });

  const updateItems = (newItems: any[]) => {
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
      dimensions: "",
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
        <div className="grid grid-cols-4 gap-4 mt-2">
          <Input
            placeholder="Item name"
            value={customItem.name}
            onChange={e => setCustomItem({ ...customItem, name: e.target.value })}
          />
          <Input
            placeholder="Weight (kg)"
            type="number"
            value={customItem.weight}
            onChange={e => setCustomItem({ ...customItem, weight: e.target.value })}
          />
          <Input
            placeholder="Dimensions"
            value={customItem.dimensions}
            onChange={e => setCustomItem({ ...customItem, dimensions: e.target.value })}
          />
          <Button onClick={addCustomItem}>Add Item</Button>
        </div>
      </div>

      {items.length > 0 && (
        <div>
          <Label>Added Items</Label>
          <div className="space-y-2 mt-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-2 border rounded-md">
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  {item.weight && (
                    <p className="text-sm text-muted-foreground">
                      {item.weight}kg {item.dimensions && `- ${item.dimensions}`}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newItems = [...items];
                      if (newItems[index].quantity > 1) {
                        newItems[index].quantity--;
                      } else {
                        newItems.splice(index, 1);
                      }
                      updateItems(newItems);
                    }}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const newItems = [...items];
                      newItems[index].quantity++;
                      updateItems(newItems);
                    }}
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => {
                      const newItems = [...items];
                      newItems.splice(index, 1);
                      updateItems(newItems);
                    }}
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
