
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderStatusEditorProps {
  orderId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

const OrderStatusEditor: React.FC<OrderStatusEditorProps> = ({
  orderId,
  currentStatus,
  onStatusUpdate
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-500' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-500' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-purple-500' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-500' },
  ];

  const updateOrderStatus = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });

      onStatusUpdate();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);
  const StatusIcon = currentStatusOption?.icon || Package;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isUpdating}
          className="flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Badge className={`${currentStatusOption?.color || 'bg-gray-500'} text-white`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {currentStatusOption?.label || currentStatus}
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => updateOrderStatus(option.value)}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted transition-colors"
            >
              <Icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default OrderStatusEditor;
