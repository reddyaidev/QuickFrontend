import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { FloatingLabelSelect } from "@/components/ui/floating-label-select";
import { Loader } from "@googlemaps/js-api-loader";
import { Button } from "@/components/ui/button";
import { X as XIcon, Search as SearchIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faElevator, 
  faRoad,
  faHouse,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  version: "weekly",
  libraries: ["places"]
});

export interface AddressFormData {
  formatted_address?: string;
  propertyType?: "single" | "multi";
  hasDriveway?: boolean;
  unitNumber?: string;
  level?: number;
  hasLift?: boolean;
  notes?: string;
  lat?: number;
  lng?: number;
}

interface AddressInputProps {
  label: string;
  name: string;
  value: AddressFormData;
  onChange: (value: AddressFormData) => void;
  isPickupAddress?: boolean;
  errors?: string[];
}

export default function AddressInput({ label, name, value, onChange, isPickupAddress, errors = [] }: AddressInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [addressInput, setAddressInput] = useState(value.formatted_address || "");
  const [searchValue, setSearchValue] = useState("");
  const [errorsState, setErrors] = useState(errors);

  useEffect(() => {
    loader.load().then(() => {
      setIsLoaded(true);
    }).catch((err) => {
      console.error("Error loading Google Maps:", err);
    });
  }, []);

  useEffect(() => {
    if (!inputRef.current || !isLoaded || !window.google) {
      // If Google Maps fails to load, still allow manual input
      console.warn("Google Maps not loaded - allowing manual address entry");
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "AU" },
      fields: ["formatted_address", "geometry"]
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setAddressInput(place.formatted_address);
        onChange({
          ...value,
          formatted_address: place.formatted_address,
        });
      }
    });

    return () => {
      if (window.google) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onChange, value]);

  // Update local state when value changes externally
  useEffect(() => {
    setAddressInput(value.formatted_address || "");
  }, [value.formatted_address]);

  const handleManualInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setAddressInput(newValue);
    // Update the address value even if it's manual input
    onChange({
      ...value,
      formatted_address: newValue,
    });
  };

  const validateAddress = () => {
    const newErrors = [];
    
    if (!value.formatted_address) {
      newErrors.push(`Enter ${label.toLowerCase()} address`);
    }
    
    if (!value.propertyType) {
      newErrors.push("Select property type");
    }
    
    if (value.propertyType === "multi") {
      if (!value.unitNumber) {
        newErrors.push("Enter unit number");
      }
      if (!value.level) {
        newErrors.push("Enter level");
      }
      // Make lift selection mandatory for levels > 1
      if (value.level && parseInt(value.level.toString()) > 1) {
        if (value.hasLift === undefined) {
          newErrors.push("Lift status is required for levels above ground floor");
        }
      }
    }
    
    if (value.hasDriveway === undefined) {
      newErrors.push("Select if property has driveway");
    }
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  useEffect(() => {
    validateAddress();
  }, [value]);

  const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = e.target.value;
    const levelNum = newLevel ? parseInt(newLevel) : 0;
    
    onChange({
      ...value,
      level: newLevel,
      // Only reset hasLift if going to level 1 or below
      hasLift: levelNum <= 1 ? undefined : value.hasLift
    });
  };

  return (
    <div className="space-y-4">
      <FloatingLabelInput
        label={label}
        value={addressInput}
        onChange={handleManualInput}
        onFocus={() => {
          if (isLoaded && inputRef.current) {
            inputRef.current.select();
          }
        }}
        ref={inputRef}
        error={errorsState.length > 0}
      />
      {errorsState.length > 0 && (
        <p className="text-sm text-red-500 mt-1">
          {errorsState.includes("Enter " + label.toLowerCase() + " address") 
            ? `Please enter a valid ${label.toLowerCase()} address` 
            : errorsState[0]}
        </p>
      )}
      {!isLoaded && addressInput && (
        <p className="text-sm text-[#1B96FF] mt-1">
          Using manually entered address
        </p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <FloatingLabelSelect
          label="Property Type"
          value={value.propertyType || ""}
          onValueChange={(selectedValue) => {
            onChange({
              ...value,
              propertyType: selectedValue as 'single' | 'multi',
              // Reset related fields when property type changes
              unitNumber: undefined,
              level: undefined,
              hasLift: undefined,
            });
          }}
          options={[
            { 
              value: "single", 
              label: "Single Storey", 
              icon: <FontAwesomeIcon icon={faHouse} className="h-4 w-4" /> 
            },
            { 
              value: "multi", 
              label: "Multi Storey", 
              icon: <FontAwesomeIcon icon={faBuilding} className="h-4 w-4" /> 
            }
          ]}
          error={errorsState.includes("Select property type")}
        />

        {value.propertyType === "multi" && (
          <>
            <FloatingLabelInput
              label="Unit Number"
              value={value.unitNumber || ""}
              onChange={(e) => onChange({ ...value, unitNumber: e.target.value })}
              error={errorsState.includes("Enter unit number")}
            />

            <FloatingLabelInput
              label="Level"
              type="number"
              min="1"
              value={value.level || ""}
              onChange={handleLevelChange}
              error={errorsState.includes("Enter level")}
            />

            {value.level && parseInt(value.level.toString()) > 1 && (
              <FloatingLabelSelect
                label="Has Lift *"
                value={value.hasLift === undefined ? "" : String(value.hasLift)}
                onValueChange={(selectedValue) => {
                  onChange({
                    ...value,
                    hasLift: selectedValue === "true",
                  });
                  setTimeout(() => validateAddress(), 0);
                }}
                options={[
                  { 
                    value: "true", 
                    label: "Yes", 
                    icon: <FontAwesomeIcon icon={faElevator} className="h-4 w-4" /> 
                  },
                  { 
                    value: "false", 
                    label: "No", 
                    icon: <FontAwesomeIcon icon={faElevator} className="h-4 w-4" /> 
                  }
                ]}
                error={errorsState.includes("Lift status is required for levels above ground floor")}
                required={true}
              />
            )}
          </>
        )}

        <FloatingLabelSelect
          label="Has Driveway"
          value={value.hasDriveway === undefined ? "" : String(value.hasDriveway)}
          onValueChange={(selectedValue) => {
            onChange({
              ...value,
              hasDriveway: selectedValue === "true",
            });
          }}
          options={[
            { 
              value: "true", 
              label: "Yes", 
              icon: <FontAwesomeIcon icon={faRoad} className="h-4 w-4" /> 
            },
            { 
              value: "false", 
              label: "No", 
              icon: <FontAwesomeIcon icon={faRoad} className="h-4 w-4" /> 
            }
          ]}
          error={errorsState.includes("Select if property has driveway")}
        />
      </div>

      <div className="space-y-2">
        <FloatingLabelInput
          label="Notes (Optional)"
          type="text"
          value={value.notes || ""}
          onChange={(e) => onChange({ ...value, notes: e.target.value })}
        />
      </div>
    </div>
  );
}