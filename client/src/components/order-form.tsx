import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderSchema } from "@shared/schema";
import AddressInput from "./address-input";
import ItemsList from "./items-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react"; // Fix the import
import { 
  ArrowLeft as ArrowLeftIcon,
  Plus as PlusIcon, 
  Minus as MinusIcon,
  X as XIcon,
  Info as InfoIcon,
  Search as SearchIcon,
  Package as PackageIcon,
  Ruler as RulerIcon,
  Scale as ScaleIcon,
  ChevronDown as ChevronDownIcon,
  TreePine as TreePineIcon,
  ShowerHead as ShowerHeadIcon,
  Wine as WineIcon,
  Sofa as SofaIcon,
  BedDouble as BedDoubleIcon,
  Utensils as UtensilsIcon,
  Briefcase as BriefcaseIcon
} from "lucide-react";
import { 
  Bed, 
  Building2, 
  Box, 
  Briefcase, 
  UtensilsCrossed, 
  TreePine, 
  Tv, 
  Sofa, 
  Wine, 
  Package 
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { format, setHours, setMinutes, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { DatePickerInput } from "@/components/ui/date-picker"; // Import DatePickerInput
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckIcon } from "lucide-react"; // Import CheckIcon
import { auth } from "@/lib/firebase"; // Assuming auth is imported from somewhere
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"; // Import Collapsible
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react"; // Import CalendarIcon, ClockIcon, MapPinIcon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faElevator, 
  faRoad,
  faHouse,
  faBuilding,
  faUser,
  faLocationDot,
  faBox
} from "@fortawesome/free-solid-svg-icons";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Checkbox } from "@/components/ui/checkbox";
import AddressDetails from "./address-details";
import ContactsDetails from "./contacts-details";
import { Plus, X, Info } from "lucide-react";
import { 
  validateAddress, 
  validateOrderForm, 
  type OrderFormData 
} from '@/lib/validation-utils';

interface OrderFormProps {
  onOrderSubmitted?: () => void;
  pickupAddress: AddressFormData;
  setPickupAddress: (address: AddressFormData) => void;
  dropAddress: AddressFormData;
  setDropAddress: (address: AddressFormData) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  distance: number;
  setDistance: (distance: number) => void;
}

interface PickupAddress {
  formatted_address?: string;
  pickupDateTime?: Date;
  pickupDate?: Date;
  pickupTime?: Date;
  propertyType?: 'single' | 'multi';
  hasDriveway?: boolean;
  unitNumber?: string;
  level?: number;
  hasLift?: boolean;
  notes?: string;
  lat?: number;
  lng?: number;
}

interface DropAddress {
  formatted_address?: string;
  propertyType?: 'single' | 'multi';
  hasDriveway?: boolean;
  unitNumber?: string;
  level?: number;
  hasLift?: boolean;
  notes?: string;
  lat?: number;
  lng?: number;
}

interface AddressFormData extends PickupAddress, DropAddress {}

interface Contact {
  name: string;
  phone: string;
  email: string;
  type: 'primary' | 'secondary';
}

interface Item {
  name: string;
  category: string;
  weight?: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
    unit?: 'in' | 'cm' | 'm' | 'mm';
  };
  quantity: number;
  description?: string;
}

const STEPS = {
  SHIPPER: 'shipper',
  CONSIGNEE: 'consignee',
  ITEMS: 'items'
} as const;

type Step = typeof STEPS[keyof typeof STEPS];

interface FormState {
  currentStep: typeof STEPS[keyof typeof STEPS];
  openSections: {
    pickup: boolean;
    dropoff: boolean;
    items: boolean;
  };
}

// Keep only one declaration of isAddressComplete at the top level
const isAddressComplete = (address: AddressFormData) => {
  if (!address.formatted_address || !address.propertyType) return false;
  
  if (address.propertyType === "multi") {
    if (!address.unitNumber || !address.level) return false;
    if (address.level && Number(address.level) > 1 && address.hasLift === undefined) return false;
  }
  
  return true;
};

// Add this type definition before using it
type CategoryKey = 
  | 'bedroom' 
  | 'commercial' 
  | 'storage' 
  | 'office' 
  | 'kitchen' 
  | 'outdoor' 
  | 'appliances' 
  | 'living-room' 
  | 'fragile' 
  | 'other';

const categoryColors: Record<CategoryKey, string> = {
  bedroom: '#FF6B6B',    // Coral Red
  commercial: '#4ECDC4', // Turquoise
  storage: '#45B7D1',    // Sky Blue
  office: '#96CEB4',     // Sage Green
  kitchen: '#FFB347',    // Orange
  outdoor: '#87D37C',    // Light Green
  appliances: '#BE90D4', // Light Purple
  'living-room': '#F4D03F', // Yellow
  fragile: '#E08283',    // Rose
  other: '#BDC3C7'       // Gray
};

export default function OrderForm({
  onOrderSubmitted,
  pickupAddress,
  setPickupAddress,
  dropAddress,
  setDropAddress,
  items,
  setItems,
  distance,
  setDistance,
}: OrderFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentStep, setCurrentStep] = useState<Step>('shipper');
  const [openSections, setOpenSections] = useState<{
    items: boolean;
    pickup: boolean;
    dropoff: boolean
  }>({
      items: false,
      pickup: false,
      dropoff: false
  });
  const [resetDialog, setResetDialog] = useState<{
    isOpen: boolean;
    type: 'pickup' | 'drop' | 'items' | null;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: null,
    title: '',
    description: ''
  });
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set());
  const [searchCategory, setSearchCategory] = useState<string>('all'); // Fix the type
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [customItem, setCustomItem] = useState<Item>({
    name: '',
    category: 'other',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: '',
      unit: 'cm'
    },
    quantity: 1,
    description: ''
  });
  const [timePickerOpen, setTimePickerOpen] = useState(false); // Fix the usage
  const [pickupContacts, setPickupContacts] = useState<Contact[]>([
    { name: '', phone: '', email: '', type: 'primary' }
  ]);
  const [dropContacts, setDropContacts] = useState<Contact[]>([
    { name: '', phone: '', email: '', type: 'primary' }
  ]);
  const [lastModifiedCategory, setLastModifiedCategory] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    currentStep: STEPS.SHIPPER,
    openSections: {
      pickup: true,
      dropoff: false,
      items: false
    }
  });

  // Predefined available items for each category
  const [availableItems] = useState<Item[]>([
    // Commercial Items
    {
      name: "CHEP Wooden Pallet",
      category: "commercial",
      weight: "25",
      dimensions: {
        length: "1165",
        width: "1165",
        height: "150",
        unit: 'mm'
      },
      quantity: 1,
      description: "Office equipment, retail items, industrial goods"
    },
    {
      name: "Plastic Pallet HDPE",
      category: "commercial",
      weight: "18",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "150",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Metal Pallet Steel",
      category: "commercial",
      weight: "35",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "150",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Euro Wooden Pallet",
      category: "commercial",
      weight: "22",
      dimensions: {
        length: "1200",
        width: "800",
        height: "150",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "IBC Container",
      category: "commercial",
      weight: "65",
      dimensions: {
        length: "1200",
        width: "1000",
        height: "1160",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Steel Storage Rack",
      category: "commercial",
      weight: "85",
      dimensions: {
        length: "2400",
        width: "900",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Shipping Container 20ft",
      category: "commercial",
      weight: "2300",
      dimensions: {
        length: "6058",
        width: "2438",
        height: "2591",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    // Storage Items
    {
      name: "Large Storage Box",
      category: "storage",
      weight: "5",
      dimensions: {
        length: "600",
        width: "400",
        height: "400",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Filing Cabinet",
      category: "storage",
      weight: "30",
      dimensions: {
        length: "500",
        width: "600",
        height: "1500",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Storage Cabinet",
      category: "storage",
      weight: "45",
      dimensions: {
        length: "900",
        width: "500",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Metal Shelving Unit",
      category: "storage",
      weight: "35",
      dimensions: {
        length: "1200",
        width: "400",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Plastic Storage Bins",
      category: "storage",
      weight: "3",
      dimensions: {
        length: "400",
        width: "300",
        height: "200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    {
      name: "Tool Cabinet",
      category: "storage",
      weight: "55",
      dimensions: {
        length: "680",
        width: "458",
        height: "1020",
        unit: 'mm'
      },
      quantity: 1,
      description: "Items for storage or warehousing"
    },
    // Living Room Items
    {
      name: "3-Seater Sofa",
      category: "living-room",
      weight: "85",
      dimensions: {
        length: "2200",
        width: "950",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "2-Seater Sofa",
      category: "living-room",
      weight: "65",
      dimensions: {
        length: "1800",
        width: "950",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "Coffee Table",
      category: "living-room",
      weight: "15",
      dimensions: {
        length: "1200",
        width: "600",
        height: "450",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "TV Stand",
      category: "living-room",
      weight: "40",
      dimensions: {
        length: "1600",
        width: "400",
        height: "500",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "Side Table",
      category: "living-room",
      weight: "8",
      dimensions: {
        length: "500",
        width: "500",
        height: "550",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "Armchair",
      category: "living-room",
      weight: "35",
      dimensions: {
        length: "900",
        width: "850",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    {
      name: "Entertainment Unit",
      category: "living-room",
      weight: "55",
      dimensions: {
        length: "2000",
        width: "400",
        height: "600",
        unit: 'mm'
      },
      quantity: 1,
      description: "Living room furniture and decorations"
    },
    // Bedroom Items
    {
      name: "Queen Bed Frame",
      category: "bedroom",
      weight: "45",
      dimensions: {
        length: "1650",
        width: "2100",
        height: "1200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "King Bed Frame",
      category: "bedroom",
      weight: "55",
      dimensions: {
        length: "1950",
        width: "2100",
        height: "1200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "Single Bed Frame",
      category: "bedroom",
      weight: "30",
      dimensions: {
        length: "1000",
        width: "2000",
        height: "1200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "Wardrobe",
      category: "bedroom",
      weight: "65",
      dimensions: {
        length: "1800",
        width: "600",
        height: "2100",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "Chest of Drawers",
      category: "bedroom",
      weight: "40",
      dimensions: {
        length: "1000",
        width: "500",
        height: "1200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "Bedside Table",
      category: "bedroom",
      weight: "12",
      dimensions: {
        length: "450",
        width: "450",
        height: "550",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    {
      name: "Dressing Table",
      category: "bedroom",
      weight: "25",
      dimensions: {
        length: "1200",
        width: "400",
        height: "750",
        unit: 'mm'
      },
      quantity: 1,
      description: "Bedroom furniture and accessories"
    },
    // Kitchen Items
    {
      name: "Refrigerator",
      category: "kitchen",
      weight: "90",
      dimensions: {
        length: "900",
        width: "700",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    {
      name: "Dishwasher",
      category: "kitchen",
      weight: "50",
      dimensions: {
        length: "600",
        width: "600",
        height: "850",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    {
      name: "Kitchen Table",
      category: "kitchen",
      weight: "35",
      dimensions: {
        length: "1500",
        width: "900",
        height: "750",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    {
      name: "Kitchen Chairs",
      category: "kitchen",
      weight: "5",
      dimensions: {
        length: "450",
        width: "450",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    {
      name: "Microwave",
      category: "kitchen",
      weight: "15",
      dimensions: {
        length: "500",
        width: "400",
        height: "300",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    {
      name: "Kitchen Cabinet",
      category: "kitchen",
      weight: "30",
      dimensions: {
        length: "600",
        width: "600",
        height: "2100",
        unit: 'mm'
      },
      quantity: 1,
      description: "Kitchen appliances and furniture"
    },
    // Office Items
    {
      name: "Office Desk",
      category: "office",
      weight: "35",
      dimensions: {
        length: "1500",
        width: "750",
        height: "750",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    {
      name: "Office Chair",
      category: "office",
      weight: "15",
      dimensions: {
        length: "650",
        width: "650",
        height: "1200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    {
      name: "Bookshelf",
      category: "office",
      weight: "40",
      dimensions: {
        length: "900",
        width: "300",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    {
      name: "Filing Cabinet",
      category: "office",
      weight: "25",
      dimensions: {
        length: "470",
        width: "620",
        height: "1320",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    {
      name: "Printer Stand",
      category: "office",
      weight: "12",
      dimensions: {
        length: "600",
        width: "400",
        height: "700",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    {
      name: "Monitor Stand",
      category: "office",
      weight: "8",
      dimensions: {
        length: "550",
        width: "250",
        height: "150",
        unit: 'mm'
      },
      quantity: 1,
      description: "Home office and workspace items"
    },
    // Outdoor Items
    {
      name: "BBQ Grill",
      category: "outdoor",
      weight: "45",
      dimensions: {
        length: "1400",
        width: "600",
        height: "1100",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    {
      name: "Garden Table Set",
      category: "outdoor",
      weight: "30",
      dimensions: {
        length: "1500",
        width: "900",
        height: "750",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    {
      name: "Sun Lounger",
      category: "outdoor",
      weight: "15",
      dimensions: {
        length: "1950",
        width: "650",
        height: "300",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    {
      name: "Outdoor Sofa",
      category: "outdoor",
      weight: "40",
      dimensions: {
        length: "2000",
        width: "800",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    {
      name: "Garden Bench",
      category: "outdoor",
      weight: "25",
      dimensions: {
        length: "1500",
        width: "600",
        height: "900",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    {
      name: "Patio Heater",
      category: "outdoor",
      weight: "20",
      dimensions: {
        length: "500",
        width: "500",
        height: "2200",
        unit: 'mm'
      },
      quantity: 1,
      description: "Outdoor and garden furniture"
    },
    // Appliances
    {
      name: "Washing Machine",
      category: "appliances",
      weight: "75",
      dimensions: {
        length: "600",
        width: "600",
        height: "850",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    {
      name: "Dryer",
      category: "appliances",
      weight: "40",
      dimensions: {
        length: "600",
        width: "600",
        height: "850",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    {
      name: "Upright Freezer",
      category: "appliances",
      weight: "70",
      dimensions: {
        length: "600",
        width: "600",
        height: "1700",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    {
      name: "Air Conditioner",
      category: "appliances",
      weight: "35",
      dimensions: {
        length: "900",
        width: "230",
        height: "300",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    {
      name: "Vacuum Cleaner",
      category: "appliances",
      weight: "8",
      dimensions: {
        length: "300",
        width: "400",
        height: "450",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    {
      name: "Wine Fridge",
      category: "appliances",
      weight: "45",
      dimensions: {
        length: "600",
        width: "600",
        height: "850",
        unit: 'mm'
      },
      quantity: 1,
      description: "Household and electrical appliances"
    },
    // Fragile Items
    {
      name: "Large Mirror",
      category: "fragile",
      weight: "15",
      dimensions: {
        length: "1200",
        width: "800",
        height: "40",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    },
    {
      name: "Glass Table Top",
      category: "fragile",
      weight: "25",
      dimensions: {
        length: "1500",
        width: "900",
        height: "10",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    },
    {
      name: "Crystal Chandelier",
      category: "fragile",
      weight: "12",
      dimensions: {
        length: "600",
        width: "600",
        height: "800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    },
    {
      name: "Glass Display Cabinet",
      category: "fragile",
      weight: "45",
      dimensions: {
        length: "1200",
        width: "400",
        height: "1800",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    },
    {
      name: "Glass Dining Table",
      category: "fragile",
      weight: "35",
      dimensions: {
        length: "1800",
        width: "1000",
        height: "750",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    },
    {
      name: "Art Piece",
      category: "fragile",
      weight: "5",
      dimensions: {
        length: "1000",
        width: "100",
        height: "1000",
        unit: 'mm'
      },
      quantity: 1,
      description: "Delicate items requiring special care"
    }
  ]);

  // Calculate total items
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Calculate total items count
  const totalItemsCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  // Function to format the combined date and time without commas
  const getFormattedDateTime = () => {
    if (!pickupAddress.pickupDateTime) return 'Not selected';

    try {
      // Extract individual parts of the date and time
      const dayOfWeek = pickupAddress.pickupDateTime.toLocaleString('en-US', { weekday: 'short' }); // "Wed"
      const month = pickupAddress.pickupDateTime.toLocaleString('en-US', { month: 'short' });       // "Feb"
      const day = pickupAddress.pickupDateTime.getDate();                                           // "12"
      const year = pickupAddress.pickupDateTime.getFullYear();                                      // "2025"
      const time = pickupAddress.pickupDateTime.toLocaleString('en-US', { 
        hour: 'numeric', 
        minute: 'numeric', 
        hour12: false 
      });

      return `${dayOfWeek} ${month} ${day} ${year} at ${time}`;
    } catch (error) {
      console.error('Error formatting date time:', error);
      return 'Invalid date/time';
    }
  };

  // Function to check if a date is today
  const isToday = (date: Date | null | undefined) => {
    if (!date || !(date instanceof Date)) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Function to count items in a category
  const getCategoryItemCount = (category: string) => {
    return items.filter(item => item.category === category)
      .reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  // Function to check if an item is selected
  const isItemSelected = (itemToCheck: Item) => {
    return items.some(item => item.name === itemToCheck.name);
  };

  // Function to get selected item quantity
  const getSelectedItemQuantity = (itemToCheck: Item) => {
    const found = items.find(item => item.name === itemToCheck.name);
    return found ? found.quantity : 0;
  };

  // Function to handle item quantity change
  const handleItemQuantityChange = (item: Item, delta: number) => {
    const existingIndex = items.findIndex(i => i.name === item.name);
    const newItems = [...items];
    
    if (existingIndex >= 0) {
      const newQuantity = (newItems[existingIndex].quantity || 1) + delta;
      if (newQuantity <= 0) {
        newItems.splice(existingIndex, 1);
      } else {
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: newQuantity };
      }
    } else if (delta > 0) {
      newItems.push({ ...item, quantity: 1 });
    }
    
    setItems(newItems);
    setLastModifiedCategory(item.category);
  };

  // Function to check if an item matches the search query
  const itemMatchesSearch = (item: Item) => {
    if (!searchQuery.trim()) return true;
    const search = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.dimensions?.length.toString().includes(search) ||
      item.dimensions?.width.toString().includes(search) ||
      item.dimensions?.height.toString().includes(search) ||
      item.weight?.toString().includes(search)
    );
  };

  // Function to get categories that have matching items
  const getCategoriesWithMatches = () => {
    if (!searchQuery.trim()) return new Set<string>();
    
    const categories = new Set<string>();
    availableItems.forEach(item => {
      if (itemMatchesSearch(item)) {
        categories.add(item.category);
      }
    });
    return categories;
  };

  // Update open categories when search changes
  useEffect(() => {
    const matchingCategories = getCategoriesWithMatches();
    setOpenCategories(matchingCategories);
  }, [searchQuery]);

  const handleNext = () => {
    if (formState.currentStep === STEPS.SHIPPER) {
      if (!isShipperSectionValid()) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      handleStepChange(STEPS.CONSIGNEE);
    } else if (formState.currentStep === STEPS.CONSIGNEE) {
      if (!dropAddress.formatted_address) {
        setErrors({
          dropAddress: "Drop address is required"
        });
        return;
      }
      handleStepChange(STEPS.ITEMS);
    }
    setErrors({});
  };

  const handleBack = () => {
    if (formState.currentStep === STEPS.ITEMS) {
      handleStepChange(STEPS.CONSIGNEE);
    } else if (formState.currentStep === STEPS.CONSIGNEE) {
      handleStepChange(STEPS.SHIPPER);
    }
  };

  const handleSubmit = () => {
    const formData = {
      pickupAddress,
      dropAddress, // Changed from dropoffAddress to match state variable name
      items,
      pickupContacts,
      dropContacts // Changed from dropoffContacts to match state variable name
    };

    const result = validateOrderForm(formData);
    if (!result.success) {
      toast({
        title: "Validation Error",
        description: result.error.errors[0].message,
        variant: "destructive"
      });
      return;
    }
    
    // Proceed with form submission
  };

  const handleReset = (type: 'pickup' | 'drop' | 'items') => {
    let title = '';
    let description = '';
    
    switch (type) {
      case 'pickup':
        title = 'Reset Shipper Address';
        description = 'Are you sure you want to clear the pickup address and its details?';
        break;
      case 'drop':
        title = 'Reset Consignee Address';
        description = 'Are you sure you want to clear the drop address and its details?';
        break;
      case 'items':
        title = 'Reset Items';
        description = 'Are you sure you want to clear all items from the order?';
        break;
    }

    setResetDialog({
      isOpen: true,
      type,
      title,
      description
    });
  };

  const confirmReset = () => {
    switch (resetDialog.type) {
      case 'pickup':
        setPickupAddress({
          formatted_address: undefined,
          pickupDateTime: undefined,
          pickupDate: undefined,
          pickupTime: undefined,
          propertyType: undefined,
          hasDriveway: undefined,
          unitNumber: undefined,
          level: undefined,
          hasLift: undefined,
          notes: undefined
        });
        handleStepChange(STEPS.SHIPPER);
        break;
      case 'drop':
        setDropAddress({
          formatted_address: undefined,
          propertyType: undefined,
          hasDriveway: undefined,
          unitNumber: undefined,
          level: undefined,
          hasLift: undefined,
          notes: undefined
        });
        handleStepChange(STEPS.CONSIGNEE);
        break;
      case 'items':
        setItems([]);
        handleStepChange(STEPS.ITEMS);
        break;
    }
    setResetDialog({ isOpen: false, type: null, title: '', description: '' });
    toast({
      title: "Reset successful",
      description: "The selected section has been cleared.",
    });
  };

  const validateConsigneeStep = () => {
    const errors: string[] = [];
    
    if (!dropAddress.formatted_address) {
      errors.push("Drop address is required");
    }
    
    if (dropContacts.length === 0) {
      errors.push("At least one contact is required");
    }

    return errors;
  };

  const validateShipperStep = () => {
    const errors: string[] = [];
    
    if (!pickupAddress.formatted_address) {
      errors.push("Pickup address is required");
    }
    
    if (!pickupAddress.pickupDateTime) {
      errors.push("Pickup date and time is required");
    }

    if (pickupContacts.length === 0) {
      errors.push("At least one contact is required");
    }

    return errors;
  };

  const validateItemsStep = () => {
    const errors: string[] = [];
    
    if (items.length === 0) {
      errors.push("At least one item is required");
    }

    return errors;
  };

  const getStepStatus = (step: string) => {
    let errors: string[] = [];
    
    switch (step) {
      case 'shipper':
        errors = validateShipperStep();
        break;
      case 'consignee':
        errors = validateConsigneeStep();
        break;
      case 'items':
        errors = validateItemsStep();
        break;
      default:
        break;
    }

    return {
      isComplete: errors.length === 0,
      errors
    };
  };
  const handleStepChange = (newStep: Step) => {
    setFormState((prev) => ({
      ...prev,
      currentStep: newStep,
      openSections: {
        ...prev.openSections,
        pickup: newStep === STEPS.SHIPPER,
        dropoff: newStep === STEPS.CONSIGNEE,
        items: newStep === STEPS.ITEMS
      }
    }));
  };

  const isStepValid = (step: string) => {
    return getStepStatus(step).isComplete;
  };

  const hasStepError = (step: string) => {
    return getStepStatus(step).errors.length > 0;
  };

  // Get min and max time for date picker
  const getTimeRange = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      // If today, min time is 2 hours from now
      const minTime = new Date();
      minTime.setHours(minTime.getHours() + 2);
      return {
        minTime,
        maxTime: new Date(today.setHours(20, 0, 0, 0)) // 8 PM
      };
    } else {
      // For future dates
      const dayStart = new Date(date);
      const dayEnd = new Date(date);
      dayStart.setHours(8, 0, 0, 0); // 8 AM
      dayEnd.setHours(20, 0, 0, 0); // 8 PM
      return {
        minTime: dayStart,
        maxTime: dayEnd
      };
    }
  };

  // Category icons and descriptions mapping
  const categoryInfo = {
    commercial: {
      icon: <PackageIcon className="h-4 w-4" />,
      description: "Office equipment, retail items, industrial goods",
      examples: ["Printers", "Display Units", "Trade Tools"]
    },
    storage: {
      icon: <PackageIcon className="h-4 w-4" />,
      description: "Items for storage or warehousing",
      examples: ["Boxes", "Containers", "Archive Files"]
    },
    "living-room": {
      icon: <SofaIcon className="h-4 w-4" />,
      description: "Living room furniture and decorations",
      examples: ["Sofa", "TV Stand", "Coffee Table"]
    },
    bedroom: {
      icon: <BedDoubleIcon className="h-4 w-4" />,
      description: "Bedroom furniture and accessories",
      examples: ["Bed", "Wardrobe", "Dresser"]
    },
    kitchen: {
      icon: <UtensilsIcon className="h-4 w-4" />,
      description: "Kitchen appliances and furniture",
      examples: ["Refrigerator", "Dining Table", "Cabinets"]
    },
    office: {
      icon: <BriefcaseIcon className="h-4 w-4" />,
      description: "Home office and workspace items",
      examples: ["Desk", "Office Chair", "Bookshelf"]
    },
    outdoor: {
      icon: <TreePineIcon className="h-4 w-4" />,
      description: "Outdoor and garden furniture",
      examples: ["Garden Set", "BBQ", "Plant Pots"]
    },
    appliances: {
      icon: <ShowerHeadIcon className="h-4 w-4" />,
      description: "Household and electrical appliances",
      examples: ["Washing Machine", "Dishwasher", "AC Unit"]
    },
    fragile: {
      icon: <WineIcon className="h-4 w-4" />,
      description: "Delicate items requiring special care",
      examples: ["Glassware", "Artwork", "Mirrors"]
    }
  };

  // Use the categoryInfo object for icons and details
  const getCategoryIcon = (category: string) => {
    return categoryInfo[category as keyof typeof categoryInfo]?.icon || <PackageIcon className="h-4 w-4" />;
  };
  // Use existing categoryIcons object
  const categoryIcons = {
    bedroom: Bed,
    commercial: Building2,
    storage: Box,
    office: Briefcase,
    kitchen: UtensilsCrossed,
    outdoor: TreePine,
    appliances: Tv,
    'living-room': Sofa,
    fragile: Wine,
    other: Package
  };

  // Add validation function
  const isShipperSectionValid = () => {
    const result = validateAddress(pickupAddress);
    if (!result.success) {
      // You can access specific error messages
      console.log(result.error.errors);
      return false;
    }
    return true;
  };

  // Add this helper function to check if address details are complete
  const isAddressComplete = (address: AddressFormData) => {
    if (!address.formatted_address || !address.propertyType) return false;
    
    if (address.propertyType === "multi") {
      if (!address.unitNumber || !address.level) return false;
      if (address.level && Number(address.level) > 1 && address.hasLift === undefined) return false;
    }
    
    return true;
  };

  useEffect(() => {
    if (pickupAddress.formatted_address || 
        pickupAddress.propertyType || 
        pickupAddress.pickupDateTime ||
        pickupAddress.notes) {
      setOpenSections(prev => ({
          ...prev, 
        pickup: true
      }));
    }
  }, [pickupAddress]);

  useEffect(() => {
    if (dropAddress.formatted_address || 
        dropAddress.propertyType ||
        dropAddress.notes) {
      setOpenSections(prev => ({
          ...prev, 
        dropoff: true
        }));
      }
  }, [dropAddress]);

  useEffect(() => {
    if (items.length > 0) {
      setOpenSections(prev => ({
        ...prev, 
        items: true
      }));
    }
  }, [items]);

  // Add isValidDate helper
  const isValidDate = (date: any): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
  };

  // Add helper function to group items by category
  const groupItemsByCategory = (items: Item[]) => {
    const grouped = items.reduce((acc, item) => {
      const category = item.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);

    // Sort with lastModifiedCategory first
    return Object.entries(grouped).sort((a, b) => {
      if (a[0] === lastModifiedCategory) return -1;
      if (b[0] === lastModifiedCategory) return 1;
      return a[0].localeCompare(b[0]);
    });
  };

  // Add category color mapping
  const categoryColors = {
    bedroom: '#FF6B6B',    // Coral Red
    commercial: '#4ECDC4', // Turquoise
    storage: '#45B7D1',    // Sky Blue
    office: '#96CEB4',     // Sage Green
    kitchen: '#FFB347',    // Orange
    outdoor: '#87D37C',    // Light Green
    appliances: '#BE90D4', // Light Purple
    'living-room': '#F4D03F', // Yellow
    fragile: '#E08283',    // Rose
    other: '#BDC3C7'       // Gray
  };

  // Add helper function to calculate category totals
  const getCategoryTotals = (items: Item[]) => {
    const uniqueTypes = new Set(items.map(item => item.name)).size;
    const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return { uniqueTypes, totalQuantity };
  };

  // Update numeric comparisons
  const validateNumericInput = (value: string): boolean => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  // Update dimension state management
  const updateDimensions = (
    dimension: keyof Item['dimensions'],
    value: string
  ) => {
    if (validateNumericInput(value) || value === '') {
      setCustomItem(prev => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [dimension]: value
        }
      }));
    }
  };

  // Update weight handling
  const updateWeight = (value: string) => {
    if (validateNumericInput(value) || value === '') {
      setCustomItem(prev => ({
        ...prev,
        weight: value
      }));
    }
  };

  return (
    <div className="container mx-auto py-6 px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Left section - Form */}
          <div className="lg:col-span-2 mb-6 lg:mb-0">
            <div className="sticky top-6">
              <Card className="shadow-md">
              <div className="mb-8">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStepChange('shipper')}
                        className={cn(
                          "px-4 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === 'shipper' ? "bg-[#1B96FF] text-white" : 
                          "bg-gray-100 text-gray-500 hover:bg-gray-200",
                        )}
                      >
                        Shipper
                      </button>
                      {getStepStatus('shipper').isComplete && (
                        <CheckIcon className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                      )}
                    </div>
                    {currentStep === 'shipper' && !getStepStatus('shipper').isComplete && (
                      <div className="bg-white/80 backdrop-blur-sm border rounded-md py-1 px-2 shadow-sm ml-2">
                        <ul className="text-[10px] text-red-500 list-disc pl-4 space-y-0.5">
                          {getStepStatus('shipper').errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                  </div>
                    )}
                    </div>
                  <div className="h-[2px] flex-1 mx-2 bg-gray-200" />
                  <div className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStepChange('consignee')}
                        className={cn(
                          "px-4 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === 'consignee' ? "bg-[#1B96FF] text-white" : 
                          "bg-gray-100 text-gray-500 hover:bg-gray-200",
                        )}
                      >
                        Consignee
                      </button>
                      {getStepStatus('consignee').isComplete && (
                        <CheckIcon className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                      )}
                    </div>
                    {currentStep === 'consignee' && !getStepStatus('consignee').isComplete && (
                      <div className="bg-white/80 backdrop-blur-sm border rounded-md py-1 px-2 shadow-sm ml-2">
                        <ul className="text-[10px] text-red-500 list-disc pl-4 space-y-0.5">
                          {getStepStatus('consignee').errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="h-[2px] flex-1 mx-2 bg-gray-200" />
                  <div className="flex items-center">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStepChange('items')}
                        className={cn(
                          "px-4 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                          currentStep === 'items' ? "bg-[#1B96FF] text-white" : 
                          "bg-gray-100 text-gray-500 hover:bg-gray-200",
                        )}
                      >
                        Items
                      </button>
                      {getStepStatus('items').isComplete && (
                        <CheckIcon className="h-3.5 w-3.5 text-green-500 stroke-[3]" />
                      )}
                    </div>
                    {currentStep === 'items' && !getStepStatus('items').isComplete && (
                      <div className="bg-white/80 backdrop-blur-sm border rounded-md py-1 px-2 shadow-sm ml-2">
                        <ul className="text-[10px] text-red-500 list-disc pl-4 space-y-0.5">
                          {getStepStatus('items').errors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {currentStep === 'shipper' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <Label className="text-xs">Pickup Date</Label>
                      <DatePickerInput
                        placeholder="Select Pick Date"
                        selected={pickupAddress.pickupDate}
                        onChange={(date: Date | null) => {
                          if (isValidDate(date) && date >= new Date()) {  // Validate date here
                            setPickupAddress({
                              ...pickupAddress,
                              pickupDate: date,
                              pickupTime: undefined,
                              pickupDateTime: undefined
                            });
                            setTimePickerOpen(true);
                          }
                        }}
                        dateFormat="d MMM yyyy"
                        error={!!errors["pickupDateTime"]}
                      />
                    </div>

                    <div className="col-span-1 sm:col-span-2">
  <Label className="text-xs">Pickup Time</Label>
  <DatePickerInput
    placeholder="Select Pickup Time"
    selected={pickupAddress.pickupTime}
    onChange={(time: Date | null) => {
      if (isValidDate(time) && isValidDate(pickupAddress.pickupDate)) {
        const newDateTime = new Date(pickupAddress.pickupDate);
        newDateTime.setHours(time.getHours());
        newDateTime.setMinutes(time.getMinutes());
        
        setPickupAddress({
          ...pickupAddress,
          pickupTime: time,
          pickupDateTime: newDateTime
        });
        setTimePickerOpen(false);
      }
    }}
    dateFormat="HH:mm"
    error={!!errors["pickupDateTime"]}
    disabled={!isValidDate(pickupAddress.pickupDate)}
    showTimeSelectOnly={true} // Add this prop
    timeIntervals={30} // Add this to set 30-minute intervals
  />
</div>
                  </div>

                  <AddressDetails
                    label="Address"
                    address={pickupAddress}
                    onAddressChange={setPickupAddress}
                    isPickupAddress={true}
                    errors={getStepStatus('shipper').errors}
                  >
                    <AddressInput
                      label="Address"
                      name="pickup"
                      value={pickupAddress}
                      onChange={setPickupAddress}
                      isPickupAddress={true}
                      errors={getStepStatus('shipper').errors}
                    />
                  </AddressDetails>

                  <ContactsDetails
                    label="Pickup Contacts"
                    contacts={pickupContacts}
                    onChange={setPickupContacts}
                    errors={getStepStatus('shipper').errors}
                  />

                  <div className="flex justify-end">
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'consignee' && (
                <div className="space-y-6">
                  <AddressDetails
                    label="Address"
                    address={dropAddress}
                    onAddressChange={setDropAddress}
                    errors={getStepStatus('consignee').errors}
                  >
                    <AddressInput
                      label="Address"
                      name="drop"
                      value={dropAddress}
                      onChange={setDropAddress}
                      errors={getStepStatus('consignee').errors}
                    />
                  </AddressDetails>

                  <ContactsDetails
                    label="Drop Contacts"
                    contacts={dropContacts}
                    onChange={setDropContacts}
                    errors={getStepStatus('consignee').errors}
                  />

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeftIcon className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={handleNext}>
                      Next
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 'items' && (
                <div className="space-y-6">
                  <div className="border-2 border-[#1B96FF] rounded-md p-6 space-y-6">
                    {/* Add Custom Item */}
                    <div className="mb-6">
                      <div className="grid grid-cols-[2.5fr_0.9fr_0.8fr_2.5fr_0.8fr_auto] gap-2 items-end">
                        <div>
                          <Label className="text-xs">Item Name</Label>
                          <Input
                            value={customItem.name}
                            onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
                            placeholder="Enter item name"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Category</Label>
                          <Select
                            value={customItem.category}
                            onValueChange={(value) => setCustomItem({ ...customItem, category: value })}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="commercial">Commercial</SelectItem>
                              <SelectItem value="storage">Storage</SelectItem>
                              <SelectItem value="living-room">Living Room</SelectItem>
                              <SelectItem value="bedroom">Bedroom</SelectItem>
                              <SelectItem value="kitchen">Kitchen</SelectItem>
                              <SelectItem value="office">Office</SelectItem>
                              <SelectItem value="outdoor">Outdoor</SelectItem>
                              <SelectItem value="appliances">Appliances</SelectItem>
                              <SelectItem value="fragile">Fragile</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-xs">Weight (kg)</Label>
                          <Input
                            type="number"
                            value={customItem.weight}
                            onChange={(e) => {
                              const value = e.target.value;
                              // Store weight as string to match Item interface
                              setCustomItem({ ...customItem, weight: value });
                            }}
                            min={0}
                            max={99999999}
                            step="0.01"
                            placeholder="0.00"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="text-xs flex items-center gap-1">
                            Built Dimensions (L×W×H)
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            <Input
                              type="number"
                              value={customItem.dimensions?.length}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCustomItem({
                                  ...customItem,
                                  dimensions: {
                                    ...customItem.dimensions,
                                    length: value // Store as string to match Item interface
                                  }
                                });
                              }}
                              min={0}
                              placeholder="Length"
                              className="h-9"
                            />
                            <Input
                              type="number"
                              value={customItem.dimensions?.width}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCustomItem({
                                  ...customItem,
                                  dimensions: {
                                    ...customItem.dimensions,
                                    width: value // Store as string to match Item interface
                                  }
                                });
                              }}
                              min={0}
                              placeholder="Width"
                              className="h-9"
                            />
                            <Input
                              type="number"
                              value={customItem.dimensions?.height}
                              onChange={(e) => {
                                const value = e.target.value;
                                setCustomItem({
                                  ...customItem,
                                  dimensions: {
                                    ...customItem.dimensions,
                                    height: value // Store as string to match Item interface
                                  }
                                });
                              }}
                              min={0}
                              placeholder="Height"
                              className="h-9"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">UOM</Label>
                          <Select
                            value={customItem.dimensions?.unit}
                            onValueChange={(value: 'mm' | 'cm' | 'm' | 'in') => {
                              setCustomItem({
                                ...customItem,
                                dimensions: {
                                  ...customItem.dimensions,
                                  unit: value
                                }
                              });
                            }}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mm">mm</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="m">m</SelectItem>
                              <SelectItem value="in">in</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            if (customItem.name && customItem.category && customItem.dimensions?.unit) {
                              const newItems = [...items];
                              newItems.push({ 
                                ...customItem, 
                                quantity: 1,
                                weight: customItem.weight || ''
                              });
                              setItems(newItems);
                              setCustomItem({
                                name: '',
                                category: '',
                                weight: '',
                                dimensions: {
                                  length: '',
                                  width: '', 
                                  height: '',
                                  unit: 'mm'
                                },
                                quantity: 1  // Add this line to match Item interface
                              });
                              setLastModifiedCategory(customItem.category);
                            }
                          }}
                          className="h-9 w-9 border-[#1B96FF] text-[#1B96FF]"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Categories Section with Left Pane */}
                    <div className="flex gap-6">
                      {/* Left Categories Pane */}
                      <div className="hidden lg:block w-64 shrink-0">
                        <Card className="border-l-4 border-l-[#1B96FF] shadow-md p-4">
                          <div className="space-y-4">
                            {/* Search */}
                            <div className="relative">
                              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#706E6B]" />
                              <Input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 border-[#1B96FF] focus:ring-[#1B96FF]"
                              />
                              {searchQuery && (
                  <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                                  onClick={() => setSearchQuery("")}
                                >
                                  <XIcon className="h-4 w-4 text-[#706E6B]" />
                  </Button>
                              )}
                </div>

                            {/* Most Used Categories */}
                            <div className="space-y-1 mb-4">
                              <h4 className="text-xs font-medium text-[#706E6B] px-3">Most Used</h4>
                              <div className="space-y-1">
                                {Object.entries(categoryInfo)
                                  .filter(([key]) => ['living-room', 'bedroom', 'kitchen'].includes(key))
                                  .map(([key, info]) => {
                                    const itemCount = items.filter(item => item.category === key)
                                      .reduce((sum, item) => sum + (item.quantity || 0), 0);
                                    const hasSearchResults = searchQuery ? 
                                      availableItems.some(item => 
                                        item.category === key && 
                                        itemMatchesSearch(item)
                                      ) : false;
                                    return (
                                      <Button
                                        key={key}
                                        variant="ghost"
                                        className={cn(
                                          "w-full justify-start gap-2 h-9",
                                          activeCategory === key 
                                            ? "bg-[#1B96FF] text-white" 
                                            : hasSearchResults && searchQuery 
                                              ? "bg-[#F8FBFF] border-2 border-[#1B96FF] text-[#1B96FF]"
                                              : "text-[#444444] hover:bg-[#F8FBFF] hover:text-[#1B96FF]"
                                        )}
                                        onClick={() => setActiveCategory(key)}
                                      >
                                        <span className={cn(
                                          activeCategory === key 
                                            ? "text-white" 
                                            : hasSearchResults && searchQuery 
                                              ? "text-[#1B96FF]" 
                                              : "text-[#706E6B]"
                                        )}>
                                          {info.icon}
                                        </span>
                                        <span className="capitalize text-sm">{key.replace('-', ' ')}</span>
                                        {itemCount > 0 && (
                                          <span className={cn(
                                            "ml-auto rounded-full px-2 py-0.5 text-xs",
                                            activeCategory === key ? "bg-white text-[#1B96FF]" : "bg-[#1B96FF] text-white"
                                          )}>
                                            {itemCount}
                                          </span>
                                        )}
                                        {hasSearchResults && searchQuery && (
                                          <span className="ml-auto text-xs text-[#1B96FF] font-medium">
                                            {availableItems.filter(item => 
                                              item.category === key && 
                                              itemMatchesSearch(item)
                                            ).length} results
                                          </span>
                                        )}
                                      </Button>
                                    );
                                  })}
            </div>
          </div>

                            {/* Other Categories */}
                            <div className="space-y-1">
                              {Object.entries(categoryInfo)
                                .filter(([key]) => !['living-room', 'bedroom', 'kitchen'].includes(key))
                                .map(([key, info]) => {
                                  const itemCount = items.filter(item => item.category === key)
                                    .reduce((sum, item) => sum + (item.quantity || 0), 0);
                                  const hasSearchResults = searchQuery ? 
                                    availableItems.some(item => 
                                      item.category === key && 
                                      itemMatchesSearch(item)
                                    ) : false;
                                  return (
                                    <Button
                                      key={key}
                                      variant="ghost"
                                      className={cn(
                                        "w-full justify-start gap-2 h-9",
                                        activeCategory === key 
                                          ? "bg-[#1B96FF] text-white" 
                                          : hasSearchResults && searchQuery 
                                            ? "bg-[#F8FBFF] border-2 border-[#1B96FF] text-[#1B96FF]"
                                            : "text-[#444444] hover:bg-[#F8FBFF] hover:text-[#1B96FF]"
                                      )}
                                      onClick={() => setActiveCategory(key)}
                                    >
                                      <span className={cn(
                                        activeCategory === key 
                                          ? "text-white" 
                                          : hasSearchResults && searchQuery 
                                            ? "text-[#1B96FF]" 
                                            : "text-[#706E6B]"
                                      )}>
                                        {info.icon}
                                      </span>
                                      <span className="capitalize text-sm">{key.replace('-', ' ')}</span>
                                      {itemCount > 0 && (
                                        <span className={cn(
                                          "ml-auto rounded-full px-2 py-0.5 text-xs",
                                          activeCategory === key ? "bg-white text-[#1B96FF]" : "bg-[#1B96FF] text-white"
                                        )}>
                                          {itemCount}
                                        </span>
                                      )}
                                      {hasSearchResults && searchQuery && (
                                        <span className="ml-auto text-xs text-[#1B96FF] font-medium">
                                          {availableItems.filter(item => 
                                            item.category === key && 
                                            itemMatchesSearch(item)
                                          ).length} results
                                        </span>
                                      )}
                                    </Button>
                                  );
                                })}
                            </div>
                          </div>
                        </Card>
        </div>

                      {/* Main Content Area */}
                      <div className="flex-1">
                        <Card className="border-t-4 border-t-[#1B96FF] shadow-md p-4 sm:p-6">
                          {/* Mobile Search (visible on small screens) */}
                          <div className="lg:hidden mb-6">
                            <div className="relative">
                              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#706E6B]" />
                              <Input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 border-[#1B96FF] focus:ring-[#1B96FF]"
                              />
                              {searchQuery && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-1.5 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                                  onClick={() => setSearchQuery("")}
                                >
                                  <XIcon className="h-4 w-4 text-[#706E6B]" />
                                </Button>
                              )}
      </div>
                          </div>

                          {/* Mobile Categories Grid (visible on small screens) */}
                          <div className="lg:hidden mb-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {Object.entries(categoryInfo).map(([key, info]) => {
                                const itemCount = items.filter(item => item.category === key)
                                  .reduce((sum, item) => sum + (item.quantity || 0), 0);
                                const hasSearchResults = searchQuery ? 
                                  availableItems.some(item => 
                                    item.category === key && 
                                    itemMatchesSearch(item)
                                  ) : false;
  return (
                                  <Button
                        key={key}
                                    variant="ghost"
                        className={cn(
                                      "h-auto py-2 justify-start gap-2",
                                      activeCategory === key 
                                        ? "bg-[#1B96FF] text-white" 
                                        : hasSearchResults && searchQuery 
                                          ? "bg-[#F8FBFF] border-2 border-[#1B96FF] text-[#1B96FF]"
                                          : "text-[#444444] hover:bg-[#F8FBFF] hover:text-[#1B96FF]"
                                    )}
                                    onClick={() => setActiveCategory(key)}
                                  >
                                    {info.icon}
                                    <span className="capitalize text-sm">{key.replace('-', ' ')}</span>
                                    {itemCount > 0 && (
                                      <span className={cn(
                                        "ml-auto rounded-full px-1.5 py-0.5 text-xs",
                                        activeCategory === key ? "bg-white text-[#1B96FF]" : "bg-[#1B96FF] text-white"
                                      )}>
                                        {itemCount}
                                      </span>
                                    )}
                                    {hasSearchResults && searchQuery && (
                                      <span className="ml-auto text-xs text-[#1B96FF] font-medium">
                                        {availableItems.filter(item => 
                                          item.category === key && 
                                          itemMatchesSearch(item)
                                        ).length} results
                                      </span>
                                    )}
                                  </Button>
                                );
                              })}
                  </div>
                          </div>

                          {/* Selected Category Items */}
                          {activeCategory ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                  {categoryInfo[activeCategory as keyof typeof categoryInfo].icon}
                                  <span className="capitalize">{activeCategory.replace('-', ' ')}</span>
                                </h3>
                                <p className="text-sm text-[#706E6B]">{categoryInfo[activeCategory as keyof typeof categoryInfo].description}</p>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                                {availableItems
                                  .filter(item => 
                                    item.category === activeCategory && 
                                    (searchQuery ? itemMatchesSearch(item) : true)
                                  )
                                  .map((item, index) => (
                                    <div 
                                      key={index} 
                                      className={`flex flex-col py-2 px-3 rounded-sm bg-white hover:bg-[#F8F8F8] transition-colors ${
                                        index % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-medium">{item.name}</span>
                                        <div className="flex items-center gap-0.5 shrink-0">
                                          {isItemSelected(item) ? (
                                            <div className="flex items-center bg-white rounded-full border border-[#1B96FF] p-0.5">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 rounded-full text-[#1B96FF] hover:text-[#1B96FF] hover:bg-[#F8FBFF]"
                                                onClick={() => handleItemQuantityChange(item, -1)}
                                              >
                                                <MinusIcon className="h-3 w-3" />
                                              </Button>
                                              <span className="w-5 text-center font-medium text-[#1B96FF]">
                                                {getSelectedItemQuantity(item)}
                                              </span>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 rounded-full text-[#1B96FF] hover:text-[#1B96FF] hover:bg-[#F8FBFF]"
                                                onClick={() => handleItemQuantityChange(item, 1)}
                                              >
                                                <PlusIcon className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="h-6 rounded-full text-[#1B96FF] hover:text-[#1B96FF] hover:bg-[#F8FBFF] px-2"
                                              onClick={() => handleItemQuantityChange(item, 1)}
                                            >
                                              <PlusIcon className="h-3 w-3 mr-1" />
                                              <span className="text-xs">Add</span>
                                            </Button>
                                          )}
                </div>
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <div className="flex items-center gap-1 text-xs text-[#706E6B]">
                                          <RulerIcon className="h-3 w-3" />
                                          <span>{item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height} {item.dimensions.unit}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-[#706E6B]">
                                          <ScaleIcon className="h-3 w-3" />
                                          <span>{item.weight}kg</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-12 text-[#706E6B]">
                              <PackageIcon className="mx-auto h-12 w-12 mb-4" />
                              <h3 className="text-lg font-semibold mb-2">Select a Category</h3>
                              <p>Choose a category from the list to view available items</p>
                            </div>
                          )}
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </Card>
            </div>
          </div>

        {/* Right section - Order Summary */}
          <div className="lg:col-span-1">
          <div className="sticky top-6 flex justify-center">
            <Card className="border-t-4 border-t-[#1B96FF] shadow-md p-4 sm:p-6 w-full max-w-xl">
              <h3 className="text-lg font-semibold mb-4 text-center">Order Summary</h3>
              <div className="space-y-4">
                {/* Time and Metrics */}
                <div className="grid grid-cols-4 gap-2">
                  {pickupAddress.pickupDateTime && (
                    <div className="col-span-2">
                      <Label className="text-xs">Pickup Time</Label>
                      <p className="text-sm text-muted-foreground truncate">
                        {pickupAddress.pickupDateTime ? 
                          format(pickupAddress.pickupDateTime, "EEE d MMM yyyy HH:mm") : 
                          "Not selected"}
                      </p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs">Distance</Label>
                    <p className="text-sm text-muted-foreground">{distance} km</p>
                  </div>
                  <div>
                    <Label className="text-xs">Items</Label>
                    <p className="text-sm text-muted-foreground">{totalItemsCount}</p>
                  </div>
                </div>

                {/* Pickup Details Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-[#1B96FF]" />
                      <span>Pickup Details</span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-[#F8F8F8] px-4 pb-4 rounded-b-md border-t border-gray-200">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {pickupAddress.formatted_address || "Not set"}
                        </p>
                        {pickupAddress.propertyType === "multi" && (
                          <div className="flex items-center gap-1.5 text-sm">
                            {pickupAddress.unitNumber && <span>Unit {pickupAddress.unitNumber}, </span>}
                            {pickupAddress.level && <span>Level {pickupAddress.level}, </span>}
                            {pickupAddress.level && pickupAddress.level > 1 && !pickupAddress.hasLift && (
                              <div className="flex items-center gap-1.5 text-red-500">
                                <FontAwesomeIcon icon={faElevator} className="h-3.5 w-3.5" />
                                <span className="font-medium">No lift</span>
                              </div>
                            )}
                            {pickupAddress.hasDriveway === false && (
                              <div className="flex items-center gap-1.5 text-red-500">
                                <FontAwesomeIcon icon={faRoad} className="h-3.5 w-3.5" />
                                <span className="font-medium">No driveway</span>
                              </div>
                            )}
                          </div>
                        )}
                        {pickupAddress.hasDriveway === undefined && pickupAddress.propertyType === "single" && (
                          <div className="flex items-center gap-1.5 text-red-500">
                            <FontAwesomeIcon icon={faRoad} className="h-3.5 w-3.5" />
                            <span className="font-medium">No driveway</span>
                          </div>
                        )}
                        {pickupAddress.notes && (
                          <div className="mt-1 text-[#1B96FF] italic">
                            Note: {pickupAddress.notes}
                          </div>
                        )}
                        {/* Pickup Contacts */}
                        {pickupContacts.length > 0 && (
                          <div className="mt-2 space-y-1 border-l-2 border-[#1B96FF] pl-2">
                            {pickupContacts.map((contact, index) => (
                              <div 
                                key={index} 
                                className="text-sm flex items-center gap-2"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-[#444444]">{contact.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-[#706E6B]">
                                    <span>{contact.phone}</span>
                                    {contact.email && (
                                      <>
                                        <span>•</span>
                                        <span>{contact.email}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Drop Details Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-[#1B96FF]" />
                      <span>Drop Details</span>
                    </div>
                    <ChevronDownIcon className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-[#F8F8F8] px-4 pb-4 rounded-b-md border-t border-gray-200">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {dropAddress.formatted_address || "Not set"}
                        </p>
                        {dropAddress.propertyType === "multi" && (
                          <div className="flex items-center gap-1.5 text-sm">
                            {dropAddress.unitNumber && <span>Unit {dropAddress.unitNumber}, </span>}
                            {dropAddress.level && <span>Level {dropAddress.level}, </span>}
                            {dropAddress.level && dropAddress.level > 1 && !dropAddress.hasLift && (
                              <div className="flex items-center gap-1.5 text-red-500">
                                <FontAwesomeIcon icon={faElevator} className="h-3.5 w-3.5" />
                                <span className="font-medium">No lift</span>
                              </div>
                            )}
                            {dropAddress.hasDriveway !== undefined && (
                              <span className={cn(
                                !dropAddress.hasDriveway && "text-red-500 font-medium"
                              )}>
                                , {!dropAddress.hasDriveway ? "❌ No driveway" : "Has driveway"}
                              </span>
                            )}
                          </div>
                        )}
                        {dropAddress.hasDriveway === undefined && dropAddress.propertyType === "single" && (
                          <div className="flex items-center gap-1.5 text-red-500">
                            <FontAwesomeIcon icon={faRoad} className="h-3.5 w-3.5" />
                            <span className="font-medium">No driveway</span>
                          </div>
                        )}
                        {dropAddress.notes && (
                          <div className="mt-1 text-[#1B96FF] italic">
                            Note: {dropAddress.notes}
                          </div>
                        )}
                        {/* Drop Contacts */}
                        {dropContacts.length > 0 && (
                          <div className="mt-2 space-y-1 border-l-2 border-[#1B96FF] pl-2">
                            {dropContacts.map((contact, index) => (
                              <div 
                                key={index} 
                                className="text-sm flex items-center gap-2"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-[#444444]">{contact.name}</p>
                                  <div className="flex items-center gap-2 text-xs text-[#706E6B]">
                                    <span>{contact.phone}</span>
                                    {contact.email && (
                                      <>
                                        <span>•</span>
                                        <span>{contact.email}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                {/* Items Section */}
                <Collapsible>
                  <CollapsibleTrigger className="flex w-full items-center justify-between py-2 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faBox} className="h-3.5 w-3.5 text-[#1B96FF]" />
                      <span>Items ({totalItemsCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                            size="sm"
                            className="text-red-500 border-red-500 hover:bg-red-50 text-xs h-7 px-2 font-medium"
                  >
                            <XIcon className="h-3.5 w-3.5 mr-1" />
                            Reset
                  </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-semibold">Reset Items</AlertDialogTitle>
                            <AlertDialogDescription className="text-[#444444]">
                              This will remove all items from your order. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="font-medium">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-500 hover:bg-red-600 text-white font-medium"
                              onClick={() => setItems([])}
                            >
                              Reset Items
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ChevronDownIcon className="h-4 w-4" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-[#F8F8F8] px-4 pb-4 rounded-b-md border-t border-gray-200">
                      {items.length > 0 ? (
                        <div className="space-y-2 pt-2">
                          {groupItemsByCategory(items).map(([category, categoryItems]) => {
                            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.other;
                            const { uniqueTypes, totalQuantity } = getCategoryTotals(categoryItems);
                            return (
                              <div key={category} className="space-y-0.5">
                                <div className="text-xs font-medium capitalize px-2 flex items-center gap-2">
                                  <div 
                                    className="w-6 h-6 rounded flex items-center justify-center"
                                    style={{ backgroundColor: categoryColors[category as keyof typeof categoryColors] || categoryColors.other }}
                                  >
                                    <IconComponent className="w-3.5 h-3.5 text-white" />
                                  </div>
                                  <span>{category}</span>
                                  <div className="ml-auto flex items-center gap-2 text-[#706E6B]">
                                    <span>{uniqueTypes} {uniqueTypes === 1 ? 'type' : 'types'}</span>
                                    <span>•</span>
                                    <span>{totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}</span>
                                  </div>
                                </div>
                                {categoryItems.map((item, index) => (
                                  <div 
                                    key={`${category}-${index}`}
                                    className={`flex items-center justify-between py-1 px-2 rounded-sm gap-1 text-sm ${
                                      index % 2 === 0 ? 'bg-[#F8F8F8]' : 'bg-white'
                                    }`}
                                    style={{ 
                                      borderLeft: `2px solid ${categoryColors[category as keyof typeof categoryColors] || categoryColors.other}`,
                                      borderBottom: '1px solid #E2E8F0'
                                    }}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <p className="font-medium text-[#444444] truncate">{item.name}</p>
                                        <p className="text-xs text-[#706E6B] whitespace-nowrap">
                                          {item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height} {item.dimensions?.unit}
                                          {item.weight && ` - ${item.weight}kg`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newItems = [...items];
                                          newItems[index] = {
                                            ...newItems[index],
                                            quantity: Math.max(1, (newItems[index].quantity || 1) - 1)
                                          };
                                          setItems(newItems);
                                          setLastModifiedCategory(category);
                                        }}
                                        className="h-5 w-5 border-[#1B96FF] text-[#1B96FF]"
                                      >
                                        <MinusIcon className="h-2.5 w-2.5" />
                                      </Button>
                                      <span className="text-[#444444] w-4 text-center text-xs">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                          const newItems = [...items];
                                          newItems[index] = {
                                            ...newItems[index],
                                            quantity: (newItems[index].quantity || 1) + 1
                                          };
                                          setItems(newItems);
                                          setLastModifiedCategory(category);
                                        }}
                                        className="h-5 w-5 border-[#1B96FF] text-[#1B96FF]"
                                      >
                                        <PlusIcon className="h-2.5 w-2.5" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-5 w-5 ml-0.5 border-red-500 text-red-500"
                                        onClick={() => {
                                          const newItems = [...items];
                                          newItems.splice(index, 1);
                                          setItems(newItems);
                                          setLastModifiedCategory(category);
                                        }}
                                      >
                                        <XIcon className="h-2.5 w-2.5" />
                  </Button>
                </div>
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-[#706E6B] py-1">
                          No items added
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <Button
                className="w-full mt-6"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Order for Bids"}
              </Button>
              </Card>
            </div>
          </div>

        {/* Reset Confirmation Dialog */}
        <Dialog open={resetDialog.isOpen} onOpenChange={(isOpen) => 
          setResetDialog(prev => ({ ...prev, isOpen }))
        }>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{resetDialog.title}</DialogTitle>
              <DialogDescription>{resetDialog.description}</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setResetDialog(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmReset}
              >
                Reset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
    </div>
  );
}
const CategoryButton = ({ 
  categoryKey, 
  info, 
  isActive, 
  itemCount, 
  onClick 
}: { 
  categoryKey: string;
  info: any;
  isActive: boolean;
  itemCount: number;
  onClick: () => void;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          className={cn(
            "w-full justify-between group hover:border-primary transition-all",
            isActive ? "bg-primary text-primary-foreground" : "",
            "relative overflow-hidden"
          )}
          onClick={onClick}
        >
          <div className="flex items-center gap-2">
            {info.icon}
            <span className="capitalize">{categoryKey.replace('-', ' ')}</span>
      </div>
          {itemCount > 0 && (
            <div className={cn(
              "absolute top-1 right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs",
              isActive ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
            )}>
              {itemCount}
            </div>
          )}
          <div className={cn(
            "absolute inset-0 bg-primary/5 scale-x-0 group-hover:scale-x-100 transition-transform",
            isActive ? "bg-primary/10" : ""
          )} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-64">
        <div className="space-y-2">
          <p className="font-medium">{info.description}</p>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Examples: </span>
            {info.examples.join(", ")}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const ItemCard = ({
  item,
  isSelected,
  quantity,
  onQuantityChange
}: {
  item: any;
  isSelected: boolean;
  quantity: number;
  onQuantityChange: (change: number) => void;
}) => (
  <div className={cn(
    "flex items-center justify-between p-3 rounded-lg border transition-all",
    isSelected ? "border-primary bg-primary/5" : "border-border bg-background",
    "hover:border-primary/50"
  )}>
    <div className="space-y-1">
      <p className="font-medium">{item.name}</p>
      <p className="text-sm text-muted-foreground">
        {item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height} {item.dimensionUnit} - {item.weight}kg
      </p>
    </div>
    <div className="flex items-center gap-0.5 shrink-0">
      {isSelected && (
        <>
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8"
            onClick={() => onQuantityChange(-1)}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="w-4 text-center">{quantity}</span>
        </>
      )}
      <Button
        size="sm"
        variant="outline"
        className="h-8 w-8"
        onClick={() => onQuantityChange(1)}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  </div>
);
