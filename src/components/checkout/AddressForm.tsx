
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AddressFormProps {
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  onShippingInfoChange: (field: string, value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ shippingInfo, onShippingInfoChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="text-foreground">First Name *</Label>
          <Input
            id="firstName"
            value={shippingInfo.firstName}
            onChange={(e) => onShippingInfoChange("firstName", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="lastName" className="text-foreground">Last Name *</Label>
          <Input
            id="lastName"
            value={shippingInfo.lastName}
            onChange={(e) => onShippingInfoChange("lastName", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="email" className="text-foreground">Email *</Label>
        <Input
          id="email"
          type="email"
          value={shippingInfo.email}
          onChange={(e) => onShippingInfoChange("email", e.target.value)}
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-foreground">Phone *</Label>
        <Input
          id="phone"
          value={shippingInfo.phone}
          onChange={(e) => onShippingInfoChange("phone", e.target.value)}
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div>
        <Label htmlFor="address" className="text-foreground">Street Address *</Label>
        <Input
          id="address"
          value={shippingInfo.address}
          onChange={(e) => onShippingInfoChange("address", e.target.value)}
          required
          className="bg-background text-foreground border-border"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city" className="text-foreground">City *</Label>
          <Input
            id="city"
            value={shippingInfo.city}
            onChange={(e) => onShippingInfoChange("city", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="state" className="text-foreground">State *</Label>
          <Input
            id="state"
            value={shippingInfo.state}
            onChange={(e) => onShippingInfoChange("state", e.target.value)}
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
            value={shippingInfo.zipCode}
            onChange={(e) => onShippingInfoChange("zipCode", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
        <div>
          <Label htmlFor="country" className="text-foreground">Country *</Label>
          <Input
            id="country"
            value={shippingInfo.country}
            onChange={(e) => onShippingInfoChange("country", e.target.value)}
            required
            className="bg-background text-foreground border-border"
          />
        </div>
      </div>
    </div>
  );
};

export default AddressForm;
