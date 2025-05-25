
import React, { useState } from "react";
import { Order } from "@/types/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface OrdersTableProps {
  orders: Order[];
  onOrderUpdate: () => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onOrderUpdate }) => {
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const { toast } = useToast();

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      onOrderUpdate();
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getCustomerName = (order: Order) => {
    if (!order.profiles) return 'Guest';
    
    const { display_name, first_name, last_name, full_name, email } = order.profiles;
    
    if (display_name) return display_name;
    if (first_name && last_name) return `${first_name} ${last_name}`;
    if (full_name) return full_name;
    if (email) return email;
    
    return 'Guest';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "refunded":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Order ID</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
              <TableHead className="font-semibold">Total</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow 
                key={order.id} 
                className="hover:bg-muted/30 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="font-mono text-sm">
                  #{order.id.slice(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-foreground">
                      {getCustomerName(order)}
                    </p>
                    {order.profiles?.email && (
                      <p className="text-sm text-muted-foreground">{order.profiles.email}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="font-semibold">
                  ${order.total_amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={`${getStatusColor(order.status)} transition-all duration-200 hover:scale-105`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={`${getPaymentStatusColor(order.payment_status || 'pending')} transition-all duration-200 hover:scale-105`}>
                    {order.payment_status || 'pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:bg-muted"
                        disabled={updatingOrder === order.id}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border-border animate-scale-in">
                      <DropdownMenuItem className="cursor-pointer hover:bg-muted transition-colors duration-200">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateOrderStatus(order.id, "processing")}
                        className="cursor-pointer hover:bg-muted transition-colors duration-200"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Mark Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateOrderStatus(order.id, "shipped")}
                        className="cursor-pointer hover:bg-muted transition-colors duration-200"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        className="cursor-pointer hover:bg-muted transition-colors duration-200"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => updateOrderStatus(order.id, "cancelled")}
                        className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {orders.length === 0 && (
        <div className="p-8 text-center text-muted-foreground animate-fade-in">
          <p>No orders found</p>
        </div>
      )}
    </div>
  );
};
