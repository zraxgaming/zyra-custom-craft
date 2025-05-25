
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar } from "lucide-react";
import { Order } from "@/types/order";

interface CustomerInfoProps {
  order: Order;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ order }) => {
  const getDisplayName = () => {
    if (order.profiles?.display_name) {
      return order.profiles.display_name;
    }
    if (order.profiles?.first_name && order.profiles?.last_name) {
      return `${order.profiles.first_name} ${order.profiles.last_name}`;
    }
    return order.profiles?.email || "Guest Customer";
  };

  return (
    <Card className="bg-card border-border hover:shadow-lg transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="h-5 w-5 text-primary" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg transition-colors duration-200 hover:bg-muted">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">{getDisplayName()}</p>
              <p className="text-sm text-muted-foreground">Customer</p>
            </div>
          </div>
          
          {order.profiles?.email && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg transition-colors duration-200 hover:bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{order.profiles.email}</p>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg transition-colors duration-200 hover:bg-muted">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">Order Date</p>
            </div>
          </div>
        </div>
        
        <div className="pt-2">
          <Badge 
            variant={order.payment_status === 'paid' ? 'default' : 'secondary'}
            className="transition-all duration-200 hover:scale-105"
          >
            {order.payment_status === 'paid' ? 'Verified Customer' : 'Pending Verification'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerInfo;
