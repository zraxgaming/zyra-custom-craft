
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
import { OrderDetail } from "@/types/order";

interface PaymentInfoProps {
  order: OrderDetail;
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
  return (
    <>
      <CardHeader>
        <CardTitle>Payment Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Payment Method</h4>
            <p>{order.payment_method === "credit_card" ? "Credit Card" : 
                order.payment_method === "paypal" ? "PayPal" : 
                order.payment_method === "ziina" ? "Ziina" : 
                order.payment_method || "Unknown"}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Payment Status</h4>
            <div className="flex items-center mt-1">
              <Badge className={
                order.payment_status === "paid" ? "bg-green-500" :
                order.payment_status === "refunded" ? "bg-orange-500" :
                "bg-yellow-500"
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
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateOrder("payment_status", "paid")}>
                      Paid
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
            <h4 className="text-sm font-medium">Total Amount</h4>
            <p className="text-lg font-semibold text-zyra-purple">
              {order.total_amount} {order.currency || 'USD'}
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
