
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Search, CheckCircle, Clock, Truck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { executeSql } from "@/lib/sql-helper";
import BarcodeGenerator from "@/components/barcode/BarcodeGenerator";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const orderStatuses = [
    { status: "pending", label: "Order Received", icon: Clock },
    { status: "processing", label: "Processing", icon: Package },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ];

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast({
        title: "Order ID required",
        description: "Please enter your order ID",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await executeSql(`
        SELECT o.*, 
               json_agg(
                 json_build_object(
                   'id', oi.id,
                   'product_id', oi.product_id,
                   'quantity', oi.quantity,
                   'price', oi.price,
                   'product_name', p.name,
                   'product_image', p.images
                 )
               ) as items
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE o.id = '${orderId}'
        GROUP BY o.id
      `);

      if (result && result.length > 0) {
        setOrder(result[0]);
      } else {
        toast({
          title: "Order not found",
          description: "No order found with that ID",
          variant: "destructive"
        });
        setOrder(null);
      }
    } catch (error: any) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error tracking order",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentStatusIndex = (status: string) => {
    return orderStatuses.findIndex(s => s.status === status);
  };

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Package className="h-16 w-16 text-zyra-purple mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
            <p className="text-gray-600">
              Enter your order ID to see the current status and tracking information
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Order Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  placeholder="Enter your order ID"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleTrackOrder}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </CardContent>
          </Card>

          {order && (
            <Card>
              <CardHeader>
                <CardTitle>Order #{order.id.slice(-8)}</CardTitle>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Order Status Timeline */}
                <div>
                  <h3 className="font-semibold mb-4">Order Status</h3>
                  <div className="space-y-4">
                    {orderStatuses.map((statusItem, index) => {
                      const currentIndex = getCurrentStatusIndex(order.status);
                      const isCompleted = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const IconComponent = statusItem.icon;

                      return (
                        <div key={statusItem.status} className="flex items-center">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent
                              ? 'bg-zyra-purple text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {statusItem.label}
                            </p>
                            {isCurrent && (
                              <p className="text-sm text-zyra-purple">Current status</p>
                            )}
                          </div>
                          {index < orderStatuses.length - 1 && (
                            <div className={`w-px h-8 ml-4 ${
                              isCompleted ? 'bg-green-500' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h3 className="font-semibold mb-4">Order Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-medium">${order.total_amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={`capitalize ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment_status}
                      </span>
                    </div>
                    {order.tracking_number && (
                      <div className="flex justify-between">
                        <span>Tracking Number:</span>
                        <span className="font-mono">{order.tracking_number}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                {order.items && order.items.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Items</h3>
                    <div className="space-y-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            {item.product_image && item.product_image.length > 0 && (
                              <img
                                src={item.product_image[0]}
                                alt={item.product_name}
                                className="w-12 h-12 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium">${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Barcode */}
                <div className="text-center">
                  <h3 className="font-semibold mb-4">Order Barcode</h3>
                  <BarcodeGenerator value={order.id} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default OrderTracking;
