
import React from "react";
import { 
  CardHeader, 
  CardContent, 
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShippingAddress } from "@/types/order";

interface CustomerInfoProps {
  profiles: {
    display_name?: string;
    email?: string;
  } | null;
  shippingAddress: ShippingAddress | null;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ 
  profiles,
  shippingAddress
}) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-medium">
          {profiles?.display_name || "Guest Customer"}
        </p>
        <p className="text-gray-500">
          {profiles?.email || "No email provided"}
        </p>
        
        <Separator className="my-4" />
        
        <div>
          <h4 className="font-medium mb-2">Shipping Address</h4>
          {shippingAddress ? (
            <div className="text-sm">
              <p>{shippingAddress.name}</p>
              <p>{shippingAddress.street}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p>Phone: {shippingAddress.phone}</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No shipping address provided</p>
          )}
        </div>
      </CardContent>
    </>
  );
};

export default CustomerInfo;
