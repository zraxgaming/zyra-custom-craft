
import React from "react";
import { CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Mail } from "lucide-react";
import { format } from "date-fns";
import { OrderItem } from "@/types/order";

interface OrderSummaryProps {
  order: any;
  isUpdating: boolean;
  updateOrder: (field: string, value: string) => Promise<void>;
  sendManualEmail: () => Promise<void>;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  order, 
  isUpdating, 
  updateOrder,
  sendManualEmail
}) => {
  const orderTotal = order.order_items.reduce((acc: number, item: any) => {
    return acc + (item.price * item.quantity);
  }, 0);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>
            Placed on {format(new Date(order.created_at), "MMMM d, yyyy 'at' h:mm a")}
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center" disabled={isUpdating}>
                Update Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => updateOrder("status", "pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateOrder("status", "processing")}>
                Processing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateOrder("status", "shipped")}>
                Shipped
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateOrder("status", "delivered")}>
                Delivered
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => updateOrder("status", "cancelled")}>
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" onClick={sendManualEmail} disabled={isUpdating}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.order_items.map((item: OrderItem) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                          No img
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      {item.customization && (
                        <p className="text-xs text-gray-500">Customized</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Subtotal</TableCell>
              <TableCell className="font-medium">${orderTotal.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Shipping ({order.delivery_type})</TableCell>
              <TableCell className="font-medium">
                ${order.delivery_type === "express" ? "15.00" : "5.00"}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
              <TableCell className="font-bold">${order.total_amount.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </>
  );
};

export default OrderSummary;
