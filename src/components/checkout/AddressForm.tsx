
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShippingAddress } from "@/types/order";

export interface AddressFormProps {
  address: ShippingAddress;
  onAddressChange: (address: ShippingAddress) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ address, onAddressChange }) => {
  const handleChange = (field: keyof ShippingAddress, value: string) => {
    onAddressChange({
      ...address,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-foreground">Full Name *</Label>
        <Input
          id="name"
          value={address.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div>
        <Label htmlFor="street" className="text-foreground">Street Address *</Label>
        <Input
          id="street"
          value={address.street}
          onChange={(e) => handleChange("street", e.target.value)}
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="text-foreground">City *</Label>
          <Input
            id="city"
            value={address.city}
            onChange={(e) => handleChange("city", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-foreground">State *</Label>
          <Input
            id="state"
            value={address.state}
            onChange={(e) => handleChange("state", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode" className="text-foreground">ZIP Code *</Label>
          <Input
            id="zipCode"
            value={address.zipCode}
            onChange={(e) => handleChange("zipCode", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="country" className="text-foreground">Country *</Label>
          <Input
            id="country"
            value={address.country}
            onChange={(e) => handleChange("country", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
        <Input
          id="phone"
          value={address.phone || ""}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="bg-background text-foreground border-border"
        />
      </div>
    </div>
  );
};

export default AddressForm;
