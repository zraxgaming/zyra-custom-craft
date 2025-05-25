
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/types/cart";

export interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  appliedCoupon?: any;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  discount,
  shipping,
  total,
  appliedCoupon
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={`${item.product.id}-${JSON.stringify(item.customization)}`} 
               className="flex justify-between items-center">
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{item.product.name}</h4>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              {item.customization && (
                <p className="text-xs text-muted-foreground">Customized</p>
              )}
            </div>
            <div className="font-medium text-foreground">
              ${(item.product.price * item.quantity).toFixed(2)}
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
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>
              Discount {appliedCoupon && `(${appliedCoupon.code})`}
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-foreground">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
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
