
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  total,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.product_id}-${JSON.stringify(item.customization)}`} 
               className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{item.name}</h4>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              {item.customization && (
                <p className="text-xs text-muted-foreground">Customized</p>
              )}
            </div>
            <div className="font-medium text-foreground">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="border-border" />
      
      <div className="space-y-2">
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-foreground">
          <span>Shipping</span>
          <span>${shippingCost.toFixed(2)}</span>
        </div>
        
        <Separator className="border-border" />
        
        <div className="flex justify-between font-bold text-lg text-foreground">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
