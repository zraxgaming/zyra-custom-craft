
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingAddress } from "@/types/order";

interface AddressFormProps {
  existingAddresses: ShippingAddress[];
  formValues: {
    name: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    sameShipping: boolean;
  };
  userEmail?: string;
  onChange: (name: string, value: string | boolean) => void;
  onAddressSelect: (address: ShippingAddress | null) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  existingAddresses,
  formValues,
  userEmail,
  onChange,
  onAddressSelect
}) => {
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name, value);
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    onChange("sameShipping", checked);
  };
  
  // Handle address selection
  const handleAddressSelection = (value: string) => {
    setSelectedAddress(value);
    
    if (value === "") {
      // Selected "Add new address"
      onAddressSelect(null);
    } else {
      // Find and use the selected address
      const address = existingAddresses.find(
        addr => `${addr.street}-${addr.zipCode}` === value
      );
      
      if (address) {
        onAddressSelect(address);
      }
    }
  };
  
  return (
    <>
      {/* Saved addresses */}
      {existingAddresses.length > 0 && (
        <div className="mb-6">
          <Label className="mb-2 block">Select a saved address</Label>
          <RadioGroup 
            value={selectedAddress || ""} 
            onValueChange={handleAddressSelection}
            className="gap-4"
          >
            {existingAddresses.map((address, index) => (
              <div key={index} className="flex items-start space-x-2 border rounded-md p-3">
                <RadioGroupItem 
                  value={`${address.street}-${address.zipCode}`} 
                  id={`address-${index}`} 
                />
                <Label 
                  htmlFor={`address-${index}`}
                  className="font-normal cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{address.name}</p>
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p>Phone: {address.phone}</p>}
                  </div>
                </Label>
              </div>
            ))}
            <div className="flex items-start space-x-2 border rounded-md p-3 border-dashed">
              <RadioGroupItem 
                value="" 
                id="new-address" 
              />
              <Label 
                htmlFor="new-address"
                className="font-normal cursor-pointer"
              >
                <div className="font-medium">Add a new address</div>
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}
      
      {/* Address form */}
      {(!existingAddresses.length || selectedAddress === null || selectedAddress === "") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formValues.email || userEmail || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formValues.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              value={formValues.street}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formValues.city}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="state">State / Province</Label>
            <Input
              id="state"
              name="state"
              value={formValues.state}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="zipCode">ZIP / Postal Code</Label>
            <Input
              id="zipCode"
              name="zipCode"
              value={formValues.zipCode}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formValues.country}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
      )}
      
      {/* Same for billing */}
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="sameShipping" 
            checked={formValues.sameShipping}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="sameShipping">
            Use this address for billing
          </Label>
        </div>
      </div>
    </>
  );
};

export default AddressForm;
