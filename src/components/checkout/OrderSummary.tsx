
import React from "react";
import { CartItem } from "@/components/cart/CartProvider";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount?: number;
  couponCode?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shipping,
  discount = 0,
  couponCode
}) => {
  const total = subtotal + shipping - discount;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>${subtotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping</p>
          <p>${shipping.toFixed(2)}</p>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <p>Discount {couponCode && `(${couponCode})`}</p>
            <p>-${discount.toFixed(2)}</p>
          </div>
        )}
        
        <div className="flex justify-between font-medium text-base mt-4">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
