import { Input } from "@/components/ui/input";
import { useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";

interface AddressInputProps {
  name: string;
  onChange: (address: google.maps.places.PlaceResult) => void;
}

export default function AddressInput({ name, onChange }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange(place);
    });
  }, [onChange]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Search Address</Label>
      <Input 
        ref={inputRef}
        id={name}
        placeholder="Start typing to search..."
      />
    </div>
  );
}
