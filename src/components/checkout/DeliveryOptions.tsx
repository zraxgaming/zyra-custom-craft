
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export interface DeliveryOptionsProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const DeliveryOptions: React.FC<DeliveryOptionsProps> = ({ 
  selectedOption, 
  onOptionChange 
}) => {
  const deliveryOptions = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "5-7 business days",
      cost: 15
    },
    {
      id: "express",
      name: "Express Delivery", 
      description: "2-3 business days",
      cost: 25
    },
    {
      id: "overnight",
      name: "Overnight Delivery",
      description: "Next business day",
      cost: 45
    }
  ];

  return (
    <RadioGroup 
      value={selectedOption} 
      onValueChange={onOptionChange}
      className="space-y-3"
    >
      {deliveryOptions.map((option) => (
        <Card key={option.id} className="p-4 bg-card border-border">
          <div className="flex items-center space-x-3">
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-1 cursor-pointer text-foreground">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                <div className="font-medium text-foreground">${option.cost}</div>
              </div>
            </Label>
          </div>
        </Card>
      ))}
    </RadioGroup>
  );
};

export default DeliveryOptions;
