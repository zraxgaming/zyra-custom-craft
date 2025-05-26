
import React from "react";
import { 
  CardHeader, 
  CardContent, 
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Order } from "@/types/order";

interface PaymentInfoProps {
  order: Order;
  isUpdating?: boolean;
  updateOrder?: (field: string, value: string) => Promise<void>;
  sendManualEmail?: () => Promise<void>;
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ 
  order,
  isUpdating = false,
  updateOrder,
  sendManualEmail
}) => {
  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "credit_card": return "Credit Card";
      case "paypal": return "PayPal";
      case "ziina": return "Ziina";
      default: return method || "Unknown";
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-foreground">Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground">Payment Method</h4>
            <p className="text-muted-foreground">{getPaymentMethodDisplay(order.payment_method)}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground">Payment Status</h4>
            <div className="flex items-center mt-1">
              <Badge className={
                order.payment_status === "paid" ? "bg-green-500 text-white" :
                order.payment_status === "refunded" ? "bg-orange-500 text-white" :
                order.payment_status === "failed" ? "bg-red-500 text-white" :
                "bg-yellow-500 text-white"
              }>
                {order.payment_status?.charAt(0).toUpperCase() + (order.payment_status?.slice(1) || '')}
              </Badge>
              
              {updateOrder && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 ml-2" disabled={isUpdating}>
                      Change
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "paid")}>
                      Paid
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "failed")}>
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "refunded")}>
                      Refunded
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-foreground">Total Amount</h4>
            <p className="text-lg font-semibold text-primary">
              ${order.total_amount.toFixed(2)} {order.currency || 'USD'}
            </p>
          </div>

          {sendManualEmail && (
            <div className="pt-4">
              <Button 
                onClick={sendManualEmail}
                variant="outline"
                size="sm"
                disabled={isUpdating}
              >
                Send Order Email
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
};

export default PaymentInfo;
