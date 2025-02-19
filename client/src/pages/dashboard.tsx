import { auth } from "@/lib/firebase";
import Logo from "@/components/logo";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import OrderForm from "@/components/order-form";
import ProfileForm from "@/components/profile-form";
import SearchOrders from "@/components/search-orders";
import UserNav from "@/components/user-nav";
import { useState, useEffect } from "react";
import { Item } from "@/components/items-list";
import { AddressFormData } from "@/components/address-input";

const defaultAddressData: AddressFormData = {
  formatted_address: undefined,
  propertyType: undefined,
  hasDriveway: undefined,
  unitNumber: undefined,
  level: undefined,
  hasLift: undefined,
  pickupDateTime: undefined,
  notes: undefined
};

const STORAGE_KEYS = {
  PICKUP_ADDRESS: 'orderForm_pickupAddress',
  DROP_ADDRESS: 'orderForm_dropAddress',
  ITEMS: 'orderForm_items',
  DISTANCE: 'orderForm_distance',
  ACTIVE_TAB: 'orderForm_activeTab'
};

export default function Dashboard() {
  const user = auth.currentUser;
  
  // Initialize state from localStorage or default values
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVE_TAB);
    return saved || "order";
  });
  
  const [pickupAddress, setPickupAddress] = useState<AddressFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PICKUP_ADDRESS);
    return saved ? JSON.parse(saved) : defaultAddressData;
  });

  const [dropAddress, setDropAddress] = useState<AddressFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DROP_ADDRESS);
    return saved ? JSON.parse(saved) : defaultAddressData;
  });

  const [items, setItems] = useState<Item[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ITEMS);
    return saved ? JSON.parse(saved) : [];
  });

  const [distance, setDistance] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DISTANCE);
    return saved ? Number(saved) : 0;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PICKUP_ADDRESS, JSON.stringify(pickupAddress));
    localStorage.setItem(STORAGE_KEYS.DROP_ADDRESS, JSON.stringify(dropAddress));
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    localStorage.setItem(STORAGE_KEYS.DISTANCE, String(distance));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_TAB, activeTab);
  }, [pickupAddress, dropAddress, items, distance, activeTab]);

  // Listen for auth state changes to reset form data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        // Reset all state to defaults when user logs out
        setPickupAddress(defaultAddressData);
        setDropAddress(defaultAddressData);
        setItems([]);
        setDistance(0);
        setActiveTab("order");
      }
    });

    return () => unsubscribe();
  }, []);

  // Clear form data after successful submission
  const handleOrderSubmitted = () => {
    localStorage.removeItem(STORAGE_KEYS.PICKUP_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.DROP_ADDRESS);
    localStorage.removeItem(STORAGE_KEYS.ITEMS);
    localStorage.removeItem(STORAGE_KEYS.DISTANCE);
    
    setPickupAddress(defaultAddressData);
    setDropAddress(defaultAddressData);
    setItems([]);
    setDistance(0);
    setActiveTab("bids");
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col">
      <header className="bg-[#1B96FF] border-b sticky top-0 z-50 text-white shadow-md">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <Logo />
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <SearchOrders />
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex flex-wrap gap-2 bg-white p-1 rounded-lg shadow-sm sticky top-[72px] z-40">
            <TabsTrigger 
              className="flex-1 min-w-[120px] data-[state=active]:bg-[#1B96FF] data-[state=active]:text-white rounded-md transition-all" 
              value="order"
            >
              Create Order
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 min-w-[120px] data-[state=active]:bg-[#1B96FF] data-[state=active]:text-white rounded-md transition-all" 
              value="bids"
            >
              Manage Bids
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 min-w-[120px] data-[state=active]:bg-[#1B96FF] data-[state=active]:text-white rounded-md transition-all" 
              value="track"
            >
              Track Delivery
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 min-w-[120px] data-[state=active]:bg-[#1B96FF] data-[state=active]:text-white rounded-md transition-all" 
              value="payments"
            >
              Manage Payments
            </TabsTrigger>
            <TabsTrigger 
              className="flex-1 min-w-[120px] data-[state=active]:bg-[#1B96FF] data-[state=active]:text-white rounded-md transition-all" 
              value="profile"
            >
              Profile
            </TabsTrigger>
          </TabsList>

          <div className="bg-white rounded-lg shadow-sm">
            <TabsContent value="order" className="m-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <OrderForm 
                  onOrderSubmitted={handleOrderSubmitted}
                  pickupAddress={pickupAddress}
                  setPickupAddress={setPickupAddress}
                  dropAddress={dropAddress}
                  setDropAddress={setDropAddress}
                  items={items}
                  setItems={setItems}
                  distance={distance}
                  setDistance={setDistance}
                />
              </div>
            </TabsContent>

            <TabsContent value="bids" className="m-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="text-center p-8 text-muted-foreground">
                  <h3 className="text-lg font-semibold mb-2">No Bids Available</h3>
                  <p>There are no active bids at the moment.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="track" className="m-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="text-center p-8 text-muted-foreground">
                  <h3 className="text-lg font-semibold mb-2">No Active Deliveries</h3>
                  <p>You don't have any active deliveries to track.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="m-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="text-center p-8 text-muted-foreground">
                  <h3 className="text-lg font-semibold mb-2">No Payment History</h3>
                  <p>Your payment history will appear here.</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile" className="m-0">
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <ProfileForm />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
