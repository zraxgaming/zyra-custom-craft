import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface DeliveryOptionProps {
  value: 'standard' | 'express';
  onChange: (value: 'standard' | 'express') => void;
}

const DeliveryOption: React.FC<DeliveryOptionProps> = ({ value, onChange }) => (
  <RadioGroup value={value} onValueChange={v => onChange(v as 'standard' | 'express')} className="space-y-4">
    <div className="flex items-center space-x-4 p-4 border-2 border-border rounded-xl cursor-pointer">
      <RadioGroupItem value="standard" id="standard" />
      <Label htmlFor="standard" className="flex-1 cursor-pointer">
        <div className="font-semibold text-lg">Standard Delivery</div>
        <div className="text-sm text-muted-foreground">3-5 business days ($5.00)</div>
      </Label>
    </div>
    <div className="flex items-center space-x-4 p-4 border-2 border-border rounded-xl cursor-pointer">
      <RadioGroupItem value="express" id="express" />
      <Label htmlFor="express" className="flex-1 cursor-pointer">
        <div className="font-semibold text-lg">Express Delivery</div>
        <div className="text-sm text-muted-foreground">1-2 business days ($15.00)</div>
      </Label>
    </div>
  </RadioGroup>
);

export default DeliveryOption;
