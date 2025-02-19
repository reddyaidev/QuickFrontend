import React from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card } from "@/components/ui/card";
import { AddressFormData } from "./address-input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown } from "lucide-react";

interface AddressDetailsProps {
  label: string;
  address: AddressFormData;
  onAddressChange: (address: AddressFormData) => void;
  isPickupAddress?: boolean;
  errors?: string[];
  children?: React.ReactNode;
}

export default function AddressDetails({
  label,
  address,
  onAddressChange,
  isPickupAddress,
  errors = [],
  children
}: AddressDetailsProps) {
  return (
    <Card className="border-t-4 border-t-[#1B96FF] shadow-md">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon 
              icon={faLocationDot} 
              className="h-3.5 w-3.5 text-[#1B96FF]" 
            />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
