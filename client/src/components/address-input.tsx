import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { initGoogleMaps } from "@/lib/maps";

export interface AddressFormData {
  formatted_address?: string;
  propertyType: "single" | "multi";
  hasDriveway: boolean;
  hasLift?: boolean;
  flatNumber?: string;
  floorNumber?: number;
}

interface AddressInputProps {
  label: string;
  name: string;
  value: AddressFormData;
  onChange: (address: AddressFormData) => void;
}

export default function AddressInput({ label, name, value, onChange }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  useEffect(() => {
    initGoogleMaps().then(setIsGoogleLoaded);
  }, []);

  useEffect(() => {
    if (!inputRef.current || !isGoogleLoaded || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address", "geometry"]
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange({
          ...value,
          formatted_address: place.formatted_address,
        });
      }
    });

    return () => {
      window.google.maps.event.clearInstanceListeners(autocomplete);
    };
  }, [onChange, value, isGoogleLoaded]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Input 
          ref={inputRef}
          id={name}
          placeholder="Start typing to search..."
          value={value.formatted_address || ""}
          onChange={(e) => onChange({ ...value, formatted_address: e.target.value })}
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
          <div className="space-y-2">
            <Label>Flat Number</Label>
            <Input 
              value={value.flatNumber || ""}
              onChange={(e) => 
                onChange({ ...value, flatNumber: e.target.value })
              }
            />
          </div>
          <div className="flex items-center space-x-2 mt-8">
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
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val)) {
                  onChange({ 
                    ...value, 
                    floorNumber: Math.min(110, Math.max(0, val))
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}