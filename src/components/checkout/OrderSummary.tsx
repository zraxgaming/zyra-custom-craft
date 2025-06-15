
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/types/cart'; 
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { useCart } from '@/components/cart/CartProvider'; 

interface OrderSummaryProps {
  items: CartItem[];
  deliveryCost?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, deliveryCost = 0 }) => {
  const { subtotal, discount, giftCardAmount, totalPrice } = useCart();

  const finalOrderTotal = typeof totalPrice === "function" ? totalPrice() + deliveryCost : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[200px] pr-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start py-2 border-b last:border-b-0">
              <div className="flex items-start space-x-3">
                <img src={item.image_url || '/placeholder-product.jpg'} alt={item.name} className="w-12 h-12 object-cover rounded" />
                <div>
                  <Link to={`/product/${item.product_id}`} className="font-medium hover:text-primary text-sm line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  {item.customization && (
                    <p className="text-xs text-muted-foreground">Custom: {item.customization.text || 'Yes'}</p>
                  )}
                </div>
              </div>
              <span className="text-sm font-medium">AED {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </ScrollArea>
        <Separator />
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>AED {subtotal?.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount</span>
              <span>- AED {discount.toFixed(2)}</span>
            </div>
          )}
          {giftCardAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Gift Card</span>
              <span>- AED {giftCardAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>AED {deliveryCost.toFixed(2)}</span>
          </div>
        </div>
        <Separator />
      </CardContent>
      <CardFooter className="flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>AED {finalOrderTotal.toFixed(2)}</span>
      </CardFooter>
    </Card>
  );
};

export default OrderSummary;
