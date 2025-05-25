
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, MapPin, Phone } from "lucide-react";
import { OrderDetail } from "@/types/order";

interface CustomerInfoProps {
  order: OrderDetail;
}

const CustomerInfo = ({ order }: CustomerInfoProps) => {
  return (
    <CardContent className="pt-6">
      <CardTitle className="flex items-center gap-2 mb-4 text-foreground">
        <User className="h-5 w-5" />
        Customer Information
      </CardTitle>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {order.profiles?.email || "No email"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">
            {order.profiles?.display_name || "Guest User"}
          </span>
        </div>

        {order.shipping_address && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-foreground">
                <div className="font-medium">Shipping Address</div>
                <div>{order.shipping_address.name}</div>
                <div>{order.shipping_address.street}</div>
                <div>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                </div>
                <div>{order.shipping_address.country}</div>
                {order.shipping_address.phone && (
                  <div className="flex items-center gap-1 mt-1">
                    <Phone className="h-3 w-3" />
                    {order.shipping_address.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default CustomerInfo;
