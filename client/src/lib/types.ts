export interface AddressData {
  address: string;
  latitude?: number;
  longitude?: number;
  propertyType: "single" | "multi";
  hasDriveway: boolean;
  unitNumber?: string;
  level?: number;
  hasLift?: boolean;
}

export interface OrderData {
  pickupAddress: AddressData;
  pickupDateTime?: Date;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  totalItems: number;
  distance?: number;
  notes?: string;
}
