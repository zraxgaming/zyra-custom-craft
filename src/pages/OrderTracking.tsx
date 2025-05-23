
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Package, Truck, CheckCircle, Clock } from "lucide-react";

interface Order {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  tracking_number: string | null;
  shipping_address: any;
  order_items: any[];
}

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      toast({
        title: "Please enter a tracking number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (*)
        `)
        .eq("tracking_number", trackingNumber.trim())
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          setOrder(null);
          toast({
            title: "Order not found",
            description: "Please check your tracking number and try again.",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        setOrder(data);
      }
    } catch (error: any) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Track Your Order</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your tracking number to see the current status of your order
            </p>
          </div>

          <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Search className="h-5 w-5" />
                Order Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Enter your tracking number..."
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                />
                <Button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-zyra-purple hover:bg-zyra-dark-purple text-white"
                >
                  {isLoading ? "Searching..." : "Track"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {hasSearched && !order && !isLoading && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Order Not Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We couldn't find an order with that tracking number. Please check the number and try again.
                </p>
              </CardContent>
            </Card>
          )}

          {order && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
                    <span>Order #{order.id.slice(0, 8)}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Order Date</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Total Amount</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Tracking Number</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-mono">
                        {order.tracking_number}
                      </p>
                    </div>
                  )}

                  {order.shipping_address && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Shipping Address</h4>
                      <div className="text-gray-600 dark:text-gray-400">
                        <p>{order.shipping_address.street}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index;
                      const isCurrent = order.status === status;
                      
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${isActive ? 'bg-zyra-purple' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${isCurrent ? 'text-zyra-purple' : 'text-gray-900 dark:text-gray-100'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {status === 'pending' && 'Your order has been received and is being prepared'}
                              {status === 'processing' && 'Your order is being processed and prepared for shipment'}
                              {status === 'shipped' && 'Your order has been shipped and is on its way'}
                              {status === 'delivered' && 'Your order has been delivered'}
                            </p>
                          </div>
                          {isCurrent && (
                            <Badge variant="outline" className="text-zyra-purple border-zyra-purple">
                              Current
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {order.order_items && order.order_items.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">Item #{item.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default OrderTracking;
