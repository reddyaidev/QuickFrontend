import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import AddressInput, { AddressFormData } from "./address-input";
import ItemsList, { Item } from "./items-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const defaultAddressData: AddressFormData = {
  propertyType: "single",
  hasDriveway: false,
};

export default function OrderForm() {
  const [pickupAddress, setPickupAddress] = useState<AddressFormData>(defaultAddressData);
  const [dropAddress, setDropAddress] = useState<AddressFormData>(defaultAddressData);
  const [items, setItems] = useState<Item[]>([]);
  const [distance, setDistance] = useState(0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const updateItemQuantity = (index: number, change: number) => {
    const newItems = [...items];
    const item = newItems[index];

    if (item.quantity + change <= 0) {
      newItems.splice(index, 1);
    } else {
      item.quantity += change;
    }

    setItems(newItems);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Accordion type="multiple" defaultValue={["pickup"]} className="space-y-4">
          <AccordionItem value="pickup">
            <AccordionTrigger>Pickup Address</AccordionTrigger>
            <AccordionContent>
              <AddressInput 
                label="Pickup Address"
                name="pickupAddress"
                value={pickupAddress}
                onChange={setPickupAddress}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="drop">
            <AccordionTrigger>Drop Address</AccordionTrigger>
            <AccordionContent>
              <AddressInput 
                label="Drop Address"
                name="dropAddress"
                value={dropAddress}
                onChange={setDropAddress}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="items">
            <AccordionTrigger>Items</AccordionTrigger>
            <AccordionContent>
              <ItemsList onChange={setItems} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        <div className="space-y-6">
          {/* Addresses Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pickup Address</Label>
              <p className="text-sm text-muted-foreground">
                {pickupAddress.formatted_address || "Not selected"}
                {pickupAddress.formatted_address && (
                  <>
                    <br />
                    {pickupAddress.propertyType === "multi" && (
                      <>
                        Flat: {pickupAddress.flatNumber}, Floor: {pickupAddress.floorNumber}
                        <br />
                      </>
                    )}
                    {pickupAddress.hasDriveway ? "Has driveway" : "No driveway"}
                    {pickupAddress.propertyType === "multi" && (
                      <>, {pickupAddress.hasLift ? "Has lift" : "No lift"}</>
                    )}
                  </>
                )}
              </p>
            </div>

            <div>
              <Label>Drop Address</Label>
              <p className="text-sm text-muted-foreground">
                {dropAddress.formatted_address || "Not selected"}
                {dropAddress.formatted_address && (
                  <>
                    <br />
                    {dropAddress.propertyType === "multi" && (
                      <>
                        Flat: {dropAddress.flatNumber}, Floor: {dropAddress.floorNumber}
                        <br />
                      </>
                    )}
                    {dropAddress.hasDriveway ? "Has driveway" : "No driveway"}
                    {dropAddress.propertyType === "multi" && (
                      <>, {dropAddress.hasLift ? "Has lift" : "No lift"}</>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>

          <Separator />

          {/* Trip Details Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Trip Distance</Label>
              <p className="text-sm text-muted-foreground">{distance} km</p>
            </div>
            <div>
              <Label>Total Items</Label>
              <p className="text-sm text-muted-foreground">{totalItems}</p>
            </div>
          </div>

          <Separator />

          {/* Items List Section */}
          {items.length > 0 && (
            <div>
              <Label>Items</Label>
              <div className="space-y-2 mt-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded-md">
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
                        onClick={() => updateItemQuantity(index, -1)}
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateItemQuantity(index, 1)}
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
                          setItems(newItems);
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

          <Separator />

          {/* Submit Button */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Total Items: {totalItems}
            </p>
            <Button 
              className="w-full bg-[#FFC107] text-black hover:bg-[#FFA000]"
              disabled={!pickupAddress.formatted_address || !dropAddress.formatted_address || items.length === 0}
            >
              Submit Order for Bids
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}