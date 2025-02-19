import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, MinusIcon, XIcon, SearchIcon } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchInput } from "./ui/search-input";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/firebase";

export interface Dimensions {
  length: string;
  width: string;
  height: string;
  unit: 'cm' | 'm' | 'mm' | 'in';
}

export interface Item {
  name: string;
  weight?: string;
  dimensions?: Dimensions;
  quantity: number;
  category: string;
  description?: string;
}

interface ItemsListProps {
  items?: Item[];
  setItems: (items: Item[]) => void;
}

const DIMENSION_UNITS = [
  { value: 'cm', label: 'Centimeters' },
  { value: 'm', label: 'Meters' },
  { value: 'mm', label: 'Millimeters' },
];

const PREDEFINED_ITEMS: Record<string, Item[]> = {
  "Commercial": [
    {
      name: "CHEP Wooden Pallet",
      description: "Hardwood 1165 x 1165mm",
      weight: "25",
      dimensions: {
        length: "1165",
        width: "1165",
        height: "150",
        unit: "mm"
      },
      quantity: 1,
      category: "Commercial"
    },
    {
      name: "Plastic Pallet HDPE",
      description: "1200 x 1000mm",
      weight: "18",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "150",
        unit: "mm"
      },
      quantity: 1,
      category: "Commercial"
    },
    {
      name: "Metal Pallet Steel",
      description: "1200 x 1000mm",
      weight: "35",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "150",
        unit: "mm"
      },
      quantity: 1,
      category: "Commercial"
    },
    {
      name: "Export Wooden Pallet",
      description: "Heat-Treated Timber, 1200 x 1000mm",
      weight: "22",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "150",
        unit: "mm"
      },
      quantity: 1,
      category: "Commercial"
    }
  ],
  "Storage": [
    { name: "Medium Storage Box", dimensions: { length: "50", width: "40", height: "30", unit: "cm" }, weight: "5", quantity: 1, category: "Storage" },
    { name: "Large Storage Box", dimensions: { length: "60", width: "45", height: "40", unit: "cm" }, weight: "10", quantity: 1, category: "Storage" },
    { name: "Extra Large Storage Box", dimensions: { length: "70", width: "50", height: "45", unit: "cm" }, weight: "15", quantity: 1, category: "Storage" },
    { name: "Document Box", dimensions: { length: "40", width: "30", height: "25", unit: "cm" }, weight: "3", quantity: 1, category: "Storage" },
    { name: "Archive Box", dimensions: { length: "45", width: "35", height: "30", unit: "cm" }, weight: "4", quantity: 1, category: "Storage" },
    { name: "Plastic Storage Bin", dimensions: { length: "55", width: "45", height: "35", unit: "cm" }, weight: "8", quantity: 1, category: "Storage" }
  ],
  "Living Room": [
    { name: "2 Seater Sofa", dimensions: { length: "160", width: "85", height: "85", unit: "cm" }, weight: "45", quantity: 1, category: "Living Room" },
    { name: "3 Seater Sofa", dimensions: { length: "210", width: "85", height: "85", unit: "cm" }, weight: "55", quantity: 1, category: "Living Room" },
    { name: "Coffee Table", dimensions: { length: "120", width: "60", height: "45", unit: "cm" }, weight: "25", quantity: 1, category: "Living Room" },
    { name: "TV Stand", dimensions: { length: "160", width: "40", height: "50", unit: "cm" }, weight: "30", quantity: 1, category: "Living Room" },
    { name: "Armchair", dimensions: { length: "85", width: "85", height: "85", unit: "cm" }, weight: "25", quantity: 1, category: "Living Room" },
    { name: "Side Table", dimensions: { length: "45", width: "45", height: "55", unit: "cm" }, weight: "8", quantity: 1, category: "Living Room" },
  ],
  "Dining Room": [
    { name: "2 Seater Dining Table", dimensions: { length: "80", width: "60", height: "75", unit: "cm" }, weight: "20", quantity: 1, category: "Dining Room" },
    { name: "4 Seater Dining Table", dimensions: { length: "120", width: "80", height: "75", unit: "cm" }, weight: "30", quantity: 1, category: "Dining Room" },
    { name: "6 Seater Dining Table", dimensions: { length: "180", width: "90", height: "75", unit: "cm" }, weight: "40", quantity: 1, category: "Dining Room" },
    { name: "8 Seater Dining Table", dimensions: { length: "220", width: "100", height: "75", unit: "cm" }, weight: "50", quantity: 1, category: "Dining Room" },
    { name: "Dining Chair", dimensions: { length: "45", width: "45", height: "90", unit: "cm" }, weight: "5", quantity: 1, category: "Dining Room" },
    { name: "Buffet Cabinet", dimensions: { length: "150", width: "45", height: "85", unit: "cm" }, weight: "45", quantity: 1, category: "Dining Room" },
  ],
  "Bedroom": [
    { name: "King Bed Frame", dimensions: { length: "213", width: "188", height: "100", unit: "cm" }, weight: "60", quantity: 1, category: "Bedroom" },
    { name: "Queen Bed Frame", dimensions: { length: "213", width: "158", height: "100", unit: "cm" }, weight: "55", quantity: 1, category: "Bedroom" },
    { name: "Double Bed Frame", dimensions: { length: "190", width: "135", height: "100", unit: "cm" }, weight: "45", quantity: 1, category: "Bedroom" },
    { name: "Single Bed Frame", dimensions: { length: "190", width: "92", height: "100", unit: "cm" }, weight: "35", quantity: 1, category: "Bedroom" },
    { name: "Bedside Table", dimensions: { length: "45", width: "40", height: "55", unit: "cm" }, weight: "15", quantity: 1, category: "Bedroom" },
    { name: "Chest of Drawers", dimensions: { length: "80", width: "45", height: "120", unit: "cm" }, weight: "40", quantity: 1, category: "Bedroom" },
    { name: "Tallboy", dimensions: { length: "60", width: "45", height: "120", unit: "cm" }, weight: "35", quantity: 1, category: "Bedroom" },
    { name: "Dressing Table", dimensions: { length: "120", width: "45", height: "75", unit: "cm" }, weight: "25", quantity: 1, category: "Bedroom" },
  ],
  "Study/Office": [
    { name: "Office Desk", dimensions: { length: "120", width: "60", height: "75", unit: "cm" }, weight: "30", quantity: 1, category: "Study/Office" },
    { name: "Office Chair", dimensions: { length: "65", width: "65", height: "110", unit: "cm" }, weight: "20", quantity: 1, category: "Study/Office" },
    { name: "Bookshelf", dimensions: { length: "80", width: "30", height: "180", unit: "cm" }, weight: "35", quantity: 1, category: "Study/Office" },
    { name: "Filing Cabinet", dimensions: { length: "45", width: "50", height: "65", unit: "cm" }, weight: "25", quantity: 1, category: "Study/Office" }
  ],
  "Electronics": [
    // TVs
    { name: "32 inch TV", dimensions: { length: "73", width: "8", height: "43", unit: "cm" }, weight: "4", quantity: 1, category: "Electronics", description: "Small bedroom/kitchen TV" },
    { name: "43 inch TV", dimensions: { length: "96", width: "8", height: "56", unit: "cm" }, weight: "8", quantity: 1, category: "Electronics", description: "Medium sized TV" },
    { name: "50 inch TV", dimensions: { length: "112", width: "8", height: "65", unit: "cm" }, weight: "15", quantity: 1, category: "Electronics", description: "Popular living room size" },
    { name: "55 inch TV", dimensions: { length: "123", width: "8", height: "71", unit: "cm" }, weight: "17", quantity: 1, category: "Electronics", description: "Large living room TV" },
    { name: "60 inch TV", dimensions: { length: "135", width: "8", height: "77", unit: "cm" }, weight: "20", quantity: 1, category: "Electronics", description: "Premium size TV" },
    { name: "65 inch TV", dimensions: { length: "146", width: "8", height: "84", unit: "cm" }, weight: "23", quantity: 1, category: "Electronics", description: "Home theater size" },
    { name: "70 inch TV", dimensions: { length: "157", width: "8", height: "90", unit: "cm" }, weight: "25", quantity: 1, category: "Electronics", description: "Large home theater" },
    { name: "75 inch TV", dimensions: { length: "168", width: "8", height: "96", unit: "cm" }, weight: "28", quantity: 1, category: "Electronics", description: "Premium home theater" },
    { name: "85 inch TV", dimensions: { length: "190", width: "8", height: "109", unit: "cm" }, weight: "35", quantity: 1, category: "Electronics", description: "Ultimate home theater" },
    
    // Sound Systems
    { name: "2.0 Bookshelf Speakers", dimensions: { length: "20", width: "25", height: "30", unit: "cm" }, weight: "8", quantity: 1, category: "Electronics", description: "Stereo bookshelf speakers pair" },
    { name: "2.1 Speaker System", dimensions: { length: "40", width: "35", height: "40", unit: "cm" }, weight: "15", quantity: 1, category: "Electronics", description: "Stereo speakers with subwoofer" },
    { name: "5.1 Home Theater", dimensions: { length: "120", width: "40", height: "40", unit: "cm" }, weight: "25", quantity: 1, category: "Electronics", description: "Surround sound system" },
    { name: "7.1 Home Theater", dimensions: { length: "120", width: "40", height: "40", unit: "cm" }, weight: "30", quantity: 1, category: "Electronics", description: "Premium surround sound" },
    { name: "Soundbar 2.0", dimensions: { length: "95", width: "10", height: "6", unit: "cm" }, weight: "3", quantity: 1, category: "Electronics", description: "Basic soundbar" },
    { name: "Soundbar 3.1", dimensions: { length: "110", width: "11", height: "6", unit: "cm" }, weight: "4", quantity: 1, category: "Electronics", description: "Soundbar with center channel" },
    { name: "Soundbar 5.1", dimensions: { length: "115", width: "12", height: "7", unit: "cm" }, weight: "5", quantity: 1, category: "Electronics", description: "Surround soundbar system" },
    { name: "Floor Standing Speakers", dimensions: { length: "30", width: "40", height: "100", unit: "cm" }, weight: "20", quantity: 1, category: "Electronics", description: "Pair of tower speakers" },
    { name: "AV Receiver", dimensions: { length: "43", width: "38", height: "17", unit: "cm" }, weight: "10", quantity: 1, category: "Electronics", description: "Home theater receiver" },
    { name: "Active Subwoofer 10\"", dimensions: { length: "35", width: "35", height: "35", unit: "cm" }, weight: "12", quantity: 1, category: "Electronics", description: "Powered bass speaker" },
    { name: "Active Subwoofer 12\"", dimensions: { length: "40", width: "40", height: "40", unit: "cm" }, weight: "15", quantity: 1, category: "Electronics", description: "Large powered subwoofer" },
    
    // Gaming & Entertainment
    { name: "Gaming Console", dimensions: { length: "30", width: "24", height: "6", unit: "cm" }, weight: "4", quantity: 1, category: "Electronics" },
    { name: "Home Theater System", dimensions: { length: "45", width: "35", height: "35", unit: "cm" }, weight: "15", quantity: 1, category: "Electronics" },
    { name: "Projector", dimensions: { length: "35", width: "25", height: "12", unit: "cm" }, weight: "3", quantity: 1, category: "Electronics" },
    
    // Computers & Accessories
    { name: "Desktop Computer", dimensions: { length: "45", width: "18", height: "40", unit: "cm" }, weight: "8", quantity: 1, category: "Electronics" },
    { name: "27 inch Monitor", dimensions: { length: "62", width: "21", height: "46", unit: "cm" }, weight: "5", quantity: 1, category: "Electronics" },
    { name: "32 inch Monitor", dimensions: { length: "72", width: "23", height: "52", unit: "cm" }, weight: "6", quantity: 1, category: "Electronics" },
    { name: "Printer/Scanner", dimensions: { length: "45", width: "35", height: "20", unit: "cm" }, weight: "7", quantity: 1, category: "Electronics" },
    
    // Kitchen Electronics
    { name: "Microwave", dimensions: { length: "50", width: "40", height: "30", unit: "cm" }, weight: "12", quantity: 1, category: "Electronics" },
    { name: "Coffee Machine", dimensions: { length: "35", width: "25", height: "40", unit: "cm" }, weight: "5", quantity: 1, category: "Electronics" },
    { name: "Air Fryer", dimensions: { length: "40", width: "35", height: "35", unit: "cm" }, weight: "6", quantity: 1, category: "Electronics" },
    
    // Other Electronics
    { name: "Robot Vacuum", dimensions: { length: "35", width: "35", height: "10", unit: "cm" }, weight: "4", quantity: 1, category: "Electronics" },
    { name: "Dehumidifier", dimensions: { length: "30", width: "25", height: "45", unit: "cm" }, weight: "10", quantity: 1, category: "Electronics" },
    { name: "Air Purifier", dimensions: { length: "25", width: "25", height: "50", unit: "cm" }, weight: "8", quantity: 1, category: "Electronics" }
  ],
  "Appliances": [
    // Fridges
    { name: "French Door Fridge 600L", dimensions: { length: "90", width: "75", height: "179", unit: "cm" }, weight: "120", quantity: 1, category: "Appliances", description: "French door design with bottom freezer" },
    { name: "French Door Fridge 800L", dimensions: { length: "92", width: "78", height: "185", unit: "cm" }, weight: "140", quantity: 1, category: "Appliances", description: "Large capacity French door" },
    { name: "Side by Side Fridge 700L", dimensions: { length: "92", width: "73", height: "178", unit: "cm" }, weight: "130", quantity: 1, category: "Appliances", description: "Side by side fridge & freezer" },
    { name: "Top Mount Fridge 400L", dimensions: { length: "68", width: "70", height: "167", unit: "cm" }, weight: "75", quantity: 1, category: "Appliances", description: "Classic top freezer design" },
    { name: "Top Mount Fridge 500L", dimensions: { length: "80", width: "72", height: "175", unit: "cm" }, weight: "85", quantity: 1, category: "Appliances", description: "Large top freezer" },
    { name: "Bottom Mount Fridge 450L", dimensions: { length: "70", width: "70", height: "170", unit: "cm" }, weight: "80", quantity: 1, category: "Appliances", description: "Bottom freezer design" },
    { name: "Bottom Mount Fridge 550L", dimensions: { length: "84", width: "72", height: "175", unit: "cm" }, weight: "90", quantity: 1, category: "Appliances", description: "Large bottom freezer" },
    { name: "Quad Door Fridge 700L", dimensions: { length: "91", width: "75", height: "181", unit: "cm" }, weight: "125", quantity: 1, category: "Appliances", description: "4-door design with flexible zone" },
    { name: "Bar Fridge 120L", dimensions: { length: "50", width: "55", height: "85", unit: "cm" }, weight: "30", quantity: 1, category: "Appliances", description: "Compact bar/office fridge" },
    { name: "Wine Fridge 150L", dimensions: { length: "60", width: "60", height: "82", unit: "cm" }, weight: "40", quantity: 1, category: "Appliances", description: "Dedicated wine storage" },
    { name: "Chest Freezer 200L", dimensions: { length: "95", width: "65", height: "85", unit: "cm" }, weight: "45", quantity: 1, category: "Appliances", description: "Horizontal chest freezer" },
    { name: "Upright Freezer 300L", dimensions: { length: "60", width: "65", height: "170", unit: "cm" }, weight: "65", quantity: 1, category: "Appliances", description: "Vertical freezer storage" },
    
    // Other Appliances
    { name: "Dishwasher", dimensions: { length: "60", width: "60", height: "85", unit: "cm" }, weight: "50", quantity: 1, category: "Appliances" },
    { name: "Portable AC", dimensions: { length: "47", width: "35", height: "75", unit: "cm" }, weight: "20", quantity: 1, category: "Appliances" },
    { name: "Split System AC", dimensions: { length: "85", width: "30", height: "30", unit: "cm" }, weight: "15", quantity: 1, category: "Appliances" },
  ],
  "Office Furniture": [
    { name: "Office Chair", dimensions: { length: "65", width: "65", height: "110", unit: "cm" }, weight: "20", quantity: 1, category: "Office Furniture" },
    { name: "Dining Chair", dimensions: { length: "45", width: "55", height: "90", unit: "cm" }, weight: "15", quantity: 1, category: "Office Furniture" },
    { name: "Office Desk 120cm", dimensions: { length: "120", width: "60", height: "75", unit: "cm" }, weight: "30", quantity: 1, category: "Office Furniture" },
    { name: "Office Desk 140cm", dimensions: { length: "140", width: "60", height: "75", unit: "cm" }, weight: "35", quantity: 1, category: "Office Furniture" },
    { name: "Office Desk 160cm", dimensions: { length: "160", width: "60", height: "75", unit: "cm" }, weight: "40", quantity: 1, category: "Office Furniture" },
    { name: "Corner Office Desk", dimensions: { length: "180", width: "160", height: "75", unit: "cm" }, weight: "50", quantity: 1, category: "Office Furniture" },
    { name: "Electric Stand Desk", dimensions: { length: "140", width: "70", height: "120", unit: "cm" }, weight: "45", quantity: 1, category: "Office Furniture" },
  ],
  "Gardening": [
    { name: "Lawn Mower", dimensions: { length: "170", width: "55", height: "110", unit: "cm" }, weight: "30", quantity: 1, category: "Gardening" },
  ],
  "Musical Instruments": [
    { name: "Upright Piano", dimensions: { length: "150", width: "60", height: "120", unit: "cm" }, weight: "80", quantity: 1, category: "Musical Instruments" }
  ]
};

export default function ItemsList({ items = [], setItems }: ItemsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [customItemName, setCustomItemName] = useState("");
  const [customItemWeight, setCustomItemWeight] = useState("");
  const [customItemQuantity, setCustomItemQuantity] = useState(1);
  const [customItemLength, setCustomItemLength] = useState("");
  const [customItemWidth, setCustomItemWidth] = useState("");
  const [customItemHeight, setCustomItemHeight] = useState("");
  const [customItemUnit, setCustomItemUnit] = useState("cm");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCustomItem = () => {
    const newErrors: Record<string, string> = {};

    if (!customItemName.trim()) {
      newErrors.name = "Item name is required";
    }

    if (!customItemWeight || parseFloat(customItemWeight) <= 0) {
      newErrors.weight = "Valid weight is required";
    }

    if (!customItemQuantity || customItemQuantity < 1) {
      newErrors.quantity = "Quantity must be at least 1";
    }

    if (!customItemLength || parseFloat(customItemLength) <= 0) {
      newErrors.length = "Valid length is required";
    }

    if (!customItemWidth || parseFloat(customItemWidth) <= 0) {
      newErrors.width = "Valid width is required";
    }

    if (!customItemHeight || parseFloat(customItemHeight) <= 0) {
      newErrors.height = "Valid height is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const groupedItems = useMemo(() => {
    // Create an array of [category, items] pairs
    const entries = Object.entries(PREDEFINED_ITEMS);
    
    // Filter items based on search query
    const filteredEntries = entries.map(([category, items]) => [
      category,
      items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      )
    ]);

    // Only keep categories that have matching items
    return filteredEntries.filter(([_, items]) => (items as Item[]).length > 0);
  }, [searchQuery]);

  const isItemSelected = (item: Item) => {
    return items.some((i) => i.name === item.name);
  };

  const getItemQuantity = (item: Item) => {
    const selectedItem = items.find((i) => i.name === item.name);
    return selectedItem?.quantity || 0;
  };

  const addItem = (item: Item) => {
    const existingItem = items.find((i) => i.name === item.name);
    if (existingItem) {
      const newItems = items.filter(i => i.name !== item.name);
      const updatedItem = { ...existingItem, quantity: (existingItem.quantity || 1) + 1 };
      setItems([updatedItem, ...newItems]);
    } else {
      setItems([{ ...item, quantity: 1 }, ...items]);
    }
  };

  const removeItem = (item: Item) => {
    const existingItem = items.find((i) => i.name === item.name);
    if (existingItem && existingItem.quantity > 1) {
      const newItems = items.filter(i => i.name !== item.name);
      const updatedItem = { ...existingItem, quantity: existingItem.quantity - 1 };
      setItems([updatedItem, ...newItems]);
    } else {
      const newItems = items.filter((i) => i.name !== item.name);
      setItems(newItems);
    }
  };

  const addCustomItem = () => {
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!customItemName) errors.name = "Name is required";
    if (!customItemWeight) errors.weight = "Weight is required";
    if (!customItemLength) errors.length = "Length is required";
    if (!customItemWidth) errors.width = "Width is required";
    if (!customItemHeight) errors.height = "Height is required";
    if (!customItemQuantity || customItemQuantity < 1) errors.quantity = "Quantity must be at least 1";

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const newItem: Item = {
      name: customItemName,
      weight: customItemWeight,
      dimensions: {
        length: customItemLength,
        width: customItemWidth,
        height: customItemHeight,
        unit: customItemUnit
      },
      quantity: customItemQuantity,
      category: "Custom"
    };

    setItems([newItem, ...items]);

    // Reset form
    setCustomItemName("");
    setCustomItemWeight("");
    setCustomItemLength("");
    setCustomItemWidth("");
    setCustomItemHeight("");
    setCustomItemQuantity(1);
    setCustomItemUnit("cm");
    setErrors({});
  };

  const isCategoryActive = (categoryItems: Item[]) => {
    return categoryItems.some(item => isItemSelected(item));
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setSearchQuery("");
        setCustomItemName("");
        setCustomItemWeight("");
        setCustomItemLength("");
        setCustomItemWidth("");
        setCustomItemHeight("");
        setCustomItemQuantity(1);
        setCustomItemUnit("cm");
        setErrors({});
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (searchQuery && groupedItems.length === 0) {
      setCustomItemName(searchQuery);
      setErrors({});
    }
  }, [searchQuery, groupedItems]);

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] max-w-full">
      <div className="space-y-4">
        {/* Custom Item Section */}
        <div className="rounded-lg border border-[#E5E5E5] bg-white p-3 sm:p-4">
          <h3 className="font-medium text-sm text-[#444444] mb-3">Add Custom Item</h3>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 sm:col-span-3">
              <Label htmlFor="custom-name" className="text-xs">Item Name <span className="text-red-500">*</span></Label>
              <Input
                id="custom-name"
                placeholder="Enter item name"
                value={customItemName}
                onChange={(e) => {
                  setCustomItemName(e.target.value);
                  if (errors.name) {
                    setErrors({ ...errors, name: "" });
                  }
                }}
                className={cn("h-8 mt-1", errors.name && "border-red-500")}
              />
              {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
            </div>

            <div className="col-span-6 sm:col-span-1">
              <Label htmlFor="custom-weight" className="text-xs">Weight <span className="text-red-500">*</span></Label>
              <Input
                id="custom-weight"
                type="number"
                min="0"
                placeholder="kg"
                value={customItemWeight}
                onChange={(e) => {
                  setCustomItemWeight(e.target.value);
                  if (errors.weight) {
                    setErrors({ ...errors, weight: "" });
                  }
                }}
                className={cn("h-8 mt-1", errors.weight && "border-red-500")}
              />
              {errors.weight && <span className="text-xs text-red-500">{errors.weight}</span>}
            </div>

            <div className="col-span-6 sm:col-span-1">
              <Label htmlFor="custom-quantity" className="text-xs">Qty <span className="text-red-500">*</span></Label>
              <Input
                id="custom-quantity"
                type="number"
                min="1"
                value={customItemQuantity}
                onChange={(e) => {
                  setCustomItemQuantity(parseInt(e.target.value) || 1);
                  if (errors.quantity) {
                    setErrors({ ...errors, quantity: "" });
                  }
                }}
                className={cn("h-8 mt-1", errors.quantity && "border-red-500")}
              />
              {errors.quantity && <span className="text-xs text-red-500">{errors.quantity}</span>}
            </div>

            <div className="col-span-12 sm:col-span-5">
              <Label className="text-xs">Dimensions <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-4 gap-2 mt-1">
                <Input
                  placeholder="L"
                  type="number"
                  min="0"
                  value={customItemLength}
                  onChange={(e) => {
                    setCustomItemLength(e.target.value);
                    if (errors.length) {
                      setErrors({ ...errors, length: "" });
                    }
                  }}
                  className={cn("h-8", errors.length && "border-red-500")}
                />
                <Input
                  placeholder="W"
                  type="number"
                  min="0"
                  value={customItemWidth}
                  onChange={(e) => {
                    setCustomItemWidth(e.target.value);
                    if (errors.width) {
                      setErrors({ ...errors, width: "" });
                    }
                  }}
                  className={cn("h-8", errors.width && "border-red-500")}
                />
                <Input
                  placeholder="H"
                  type="number"
                  min="0"
                  value={customItemHeight}
                  onChange={(e) => {
                    setCustomItemHeight(e.target.value);
                    if (errors.height) {
                      setErrors({ ...errors, height: "" });
                    }
                  }}
                  className={cn("h-8", errors.height && "border-red-500")}
                />
                <Select 
                  value={customItemUnit} 
                  onValueChange={(value) => setCustomItemUnit(value as 'cm' | 'm' | 'mm')}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIMENSION_UNITS.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 mt-1 text-xs">
                {errors.length && <span className="text-red-500">{errors.length}</span>}
                {errors.width && <span className="text-red-500">{errors.width}</span>}
                {errors.height && <span className="text-red-500">{errors.height}</span>}
              </div>
            </div>

            <div className="col-span-12 sm:col-span-1 flex items-end">
              <Button 
                variant="outline"
                size="icon"
                onClick={addCustomItem} 
                className="h-10 w-10 border-[#1B96FF] text-[#1B96FF]"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <SearchInput
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery("")}
        />

        {/* Categories Section - Both Horizontal and Vertical Scrollable */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-3 gap-4 min-w-[900px] pr-4 max-h-[600px] overflow-y-auto">
            {groupedItems.map(([category, categoryItems], index) => (
              <div 
                key={category} 
                className={cn(
                  "rounded-lg border p-3 sm:p-4",
                  isCategoryActive(categoryItems)
                    ? "border-[#1B96FF] bg-white"
                    : "border-[#E5E5E5] bg-white"
                )}
              >
                <h3 className="text-sm font-medium text-[#1B96FF] mb-3 sticky top-0 bg-white py-2">{category}</h3>
                <div className="space-y-1.5">
                  {categoryItems.map((item) => {
                    const selected = isItemSelected(item);
                    const quantity = getItemQuantity(item);
                    return (
                      <div
                        key={item.name}
                        className={cn(
                          "rounded-md border p-1.5 sm:p-2",
                          selected 
                            ? "border-[#1B96FF] bg-[#1B96FF]/5" 
                            : "border-[#E5E5E5] bg-white hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-xs sm:text-sm truncate leading-tight">{item.name}</span>
                              {selected && (
                                <span className="text-[10px] sm:text-xs font-medium text-[#1B96FF] whitespace-nowrap">
                                  x{quantity}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[10px] sm:text-xs text-muted-foreground truncate mt-0.5">
                                {item.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] sm:text-xs text-muted-foreground">
                                {item.weight}kg
                              </span>
                              {item.dimensions && (
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                  {item.dimensions.length}x{item.dimensions.width}x{item.dimensions.height}{item.dimensions.unit}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {selected ? (
                              <div className="flex items-center gap-0.5">
                                <QuantityStepper
                                  quantity={quantity}
                                  onQuantityChange={(newQuantity) => {
                                    const existingItem = items.find((i) => i.name === item.name);
                                    const newItems = items.filter(i => i.name !== item.name);
                                    if (newQuantity === 0) {
                                      setItems(newItems);
                                    } else {
                                      const updatedItem = { 
                                        ...item, 
                                        quantity: newQuantity 
                                      };
                                      setItems([updatedItem, ...newItems]);
                                    }
                                  }}
                                  size="sm"
                                />
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => addItem(item)}
                                className="h-6 w-6 border-[#1B96FF] text-[#1B96FF]"
                              >
                                <PlusIcon className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}