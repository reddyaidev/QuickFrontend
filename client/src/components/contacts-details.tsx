import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { ChevronDown, Plus, X } from "lucide-react";

export interface Contact {
  name: string;
  phone: string;
  email: string;
  type: 'primary' | 'secondary';
}

interface ContactsDetailsProps {
  label?: string;
  contacts: Contact[];
  onChange: (contacts: Contact[]) => void;
  errors?: string[];
}

export default function ContactsDetails({
  label = "Contacts",
  contacts,
  onChange,
  errors = []
}: ContactsDetailsProps) {
  return (
    <Card className="border-t-4 border-t-[#1B96FF] shadow-md">
      <Collapsible>
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faUser} className="h-3.5 w-3.5 text-[#1B96FF]" />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-2">
            {contacts.map((contact, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={contact.name}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].name = e.target.value;
                      onChange(newContacts);
                    }}
                    placeholder="Contact name"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Phone</Label>
                  <Input
                    value={contact.phone}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].phone = e.target.value;
                      onChange(newContacts);
                    }}
                    placeholder="Phone number"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => {
                      const newContacts = [...contacts];
                      newContacts[index].email = e.target.value;
                      onChange(newContacts);
                    }}
                    placeholder="Email address"
                    className="h-9"
                  />
                </div>
                <div>
                  <Label className="text-xs">Contact Type</Label>
                  <Select
                    value={contact.type}
                    onValueChange={(value: 'primary' | 'secondary') => {
                      const newContacts = [...contacts];
                      newContacts[index].type = value;
                      onChange(newContacts);
                    }}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-1">
                  {index === contacts.length - 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        onChange([
                          ...contacts,
                          { name: '', phone: '', email: '', type: 'secondary' }
                        ]);
                      }}
                      className="h-9 w-9 border-[#1B96FF] text-[#1B96FF]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  )}
                  {index > 0 && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 border-red-500 text-red-500"
                      onClick={() => {
                        const newContacts = [...contacts];
                        newContacts.splice(index, 1);
                        onChange(newContacts);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-500 mt-2">{error}</p>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
