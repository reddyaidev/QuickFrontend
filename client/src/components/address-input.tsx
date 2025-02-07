import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

interface AddressFormData {
  formatted_address?: string;
  propertyType: "single" | "multi";
  hasDriveway: boolean;
  hasLift?: boolean;
  flatNumber?: string;
  floorNumber?: number;
}

interface AddressInputProps {
  name: string;
  value: AddressFormData;
  onChange: (address: AddressFormData) => void;
}

export default function AddressInput({ name, value, onChange }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange({
        ...value,
        formatted_address: place.formatted_address,
      });
    });
  }, [onChange, value]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={name}>Search Address</Label>
        <Input 
          ref={inputRef}
          id={name}
          placeholder="Start typing to search..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor={`${name}-driveway`}>Is driveway available?</Label>
        <Switch
          id={`${name}-driveway`}
          checked={value.hasDriveway}
          onCheckedChange={(checked) => 
            onChange({ ...value, hasDriveway: checked })
          }
        />
      </div>

      <div>
        <Label>Property Type</Label>
        <RadioGroup 
          value={value.propertyType}
          onValueChange={(val: "single" | "multi") => 
            onChange({ ...value, propertyType: val })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="single" id={`${name}-single`} />
            <Label htmlFor={`${name}-single`}>Single Storey</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="multi" id={`${name}-multi`} />
            <Label htmlFor={`${name}-multi`}>Multistorey</Label>
          </div>
        </RadioGroup>
      </div>

      {value.propertyType === "multi" && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Flat Number</Label>
            <Input 
              value={value.flatNumber || ""}
              onChange={(e) => 
                onChange({ ...value, flatNumber: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2 mt-6">
            <Label htmlFor={`${name}-lift`}>Is lift available?</Label>
            <Switch
              id={`${name}-lift`}
              checked={value.hasLift}
              onCheckedChange={(checked) => 
                onChange({ ...value, hasLift: checked })
              }
            />
          </div>
          <div className="col-span-2">
            <Label>Floor Number</Label>
            <Input 
              type="number"
              min={0}
              max={110}
              value={value.floorNumber || ""}
              onChange={(e) => 
                onChange({ 
                  ...value, 
                  floorNumber: Math.min(110, Math.max(0, parseInt(e.target.value) || 0))
                })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}