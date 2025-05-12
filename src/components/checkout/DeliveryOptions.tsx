
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DeliveryOptionsProps {
  selectedOption: string;
  onOptionChange: (value: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({
  selectedOption,
  onOptionChange
}) => {
  return (
    <div className="mt-6">
      <Label className="mb-2 block">Delivery Options</Label>
      <RadioGroup 
        value={selectedOption} 
        onValueChange={onOptionChange}
      >
        <div className="flex items-start space-x-2 border rounded-md p-3">
          <RadioGroupItem value="standard" id="standard-delivery" />
          <Label htmlFor="standard-delivery" className="font-normal cursor-pointer">
            <div className="font-medium">Standard Delivery</div>
            <div className="text-sm text-gray-500">5-7 business days</div>
            <div className="mt-1 font-medium text-sm">$5.00</div>
          </Label>
        </div>
        
        <div className="flex items-start space-x-2 border rounded-md p-3 mt-3">
          <RadioGroupItem value="express" id="express-delivery" />
          <Label htmlFor="express-delivery" className="font-normal cursor-pointer">
            <div className="font-medium">Store PickUp</div>
            <div className="text-sm text-gray-500">2-3 business days</div>
            <div className="mt-1 font-medium text-sm">$0.00</div>
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default DeliveryOptions;
