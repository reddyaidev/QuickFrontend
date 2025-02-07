import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertOrderSchema } from "@shared/schema";
import AddressInput from "./address-input";
import ItemsList from "./items-list";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function OrderForm() {
  const form = useForm({
    resolver: zodResolver(insertOrderSchema),
    defaultValues: {
      propertyType: "single",
      items: [],
    }
  });

  const [distance, setDistance] = useState(0);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Form {...form}>
          <form className="space-y-6">
            <Accordion type="single" defaultValue="pickup" collapsible>
              <AccordionItem value="pickup">
                <AccordionTrigger>Pickup Address</AccordionTrigger>
                <AccordionContent>
                  <AddressInput 
                    name="pickupAddress"
                    onChange={(address) => {
                      form.setValue("pickupAddress", address);
                    }}
                  />
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label>Property Type</Label>
                      <RadioGroup 
                        defaultValue="single"
                        onValueChange={(val) => form.setValue("propertyType", val)}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single Storey</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="multi" id="multi" />
                          <Label htmlFor="multi">Multistorey</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {form.watch("propertyType") === "multi" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Flat Number</Label>
                          <Input />
                        </div>
                        <div>
                          <Label>Floor Number</Label>
                          <Input type="number" />
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="drop">
                <AccordionTrigger>Drop Address</AccordionTrigger>
                <AccordionContent>
                  <AddressInput 
                    name="dropAddress"
                    onChange={(address) => {
                      form.setValue("dropAddress", address);
                    }}
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="items">
                <AccordionTrigger>Items</AccordionTrigger>
                <AccordionContent>
                  <ItemsList
                    onChange={(items) => form.setValue("items", items)}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </form>
        </Form>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <Label>Pickup Address</Label>
            <p className="text-sm text-muted-foreground">
              {form.watch("pickupAddress")?.formatted_address || "Not selected"}
            </p>
          </div>
          
          <div>
            <Label>Drop Address</Label>
            <p className="text-sm text-muted-foreground">
              {form.watch("dropAddress")?.formatted_address || "Not selected"}
            </p>
          </div>

          <div>
            <Label>Distance</Label>
            <p className="text-sm text-muted-foreground">{distance} km</p>
          </div>

          <div>
            <Label>Items</Label>
            <ul className="text-sm text-muted-foreground">
              {form.watch("items")?.map((item: any) => (
                <li key={item.name}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button 
          className="w-full bg-[#FFC107] text-black hover:bg-[#FFA000]"
          disabled={!form.formState.isValid}
        >
          Submit Order for Bids
        </Button>
      </Card>
    </div>
  );
}
