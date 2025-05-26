
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, DollarSign, Calendar, MapPin } from "lucide-react";
import type { OrderDetail } from "@/types/order";

interface OrderSummaryProps {
  order: OrderDetail;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ order }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Order ID:</span>
            <span className="font-mono text-sm">{order.id}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Status:</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Payment Status:</span>
            <Badge className={getStatusColor(order.payment_status)}>
              {order.payment_status}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Total Amount:</span>
            <span className="text-lg font-bold">${order.total_amount.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Order Details
            </h4>
            <div className="text-sm text-muted-foreground">
              <p>Created: {new Date(order.created_at).toLocaleDateString()}</p>
              {order.updated_at && (
                <p>Updated: {new Date(order.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>

          {order.shipping_address && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Shipping Address
                </h4>
                <div className="text-sm text-muted-foreground">
                  {typeof order.shipping_address === 'string' 
                    ? order.shipping_address 
                    : JSON.stringify(order.shipping_address, null, 2)
                  }
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {order.order_items && order.order_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                    {item.product.images?.[0] || item.product.image_url ? (
                      <img 
                        src={item.product.images?.[0] || item.product.image_url} 
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                    {item.customization && (
                      <p className="text-xs text-muted-foreground">
                        Customization: {JSON.stringify(item.customization)}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">${item.price.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderSummary;
