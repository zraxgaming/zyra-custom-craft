
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ShoppingBag, ArrowRight, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        navigate("/");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              product:product_id (
                name,
                images
              )
            )
          `)
          .eq("id", orderId)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error: any) {
        console.error("Error fetching order:", error);
        toast({
          title: "Error fetching order",
          description: "Could not find your order.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Container className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </Container>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Container className="py-16">
        <div className="bg-card p-8 rounded-lg shadow-sm border max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-foreground">Order Confirmed!</h1>
            <p className="text-muted-foreground max-w-md">
              Thank you for your order. We've received your payment and will begin processing your order right away.
            </p>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Order number</h3>
                <p className="font-semibold text-foreground">{order.id.substring(0, 8)}...</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Date placed</h3>
                <p className="font-semibold text-foreground">{format(new Date(order.created_at), "MMM d, yyyy")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total amount</h3>
                <p className="font-semibold text-foreground">${order.total_amount.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Payment method</h3>
                <p className="font-semibold text-foreground capitalize">{order.payment_method}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Order Details</h2>
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/30 px-6 py-3 border-b">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium text-muted-foreground">
                  <span>Product</span>
                  <span className="text-right">Quantity</span>
                  <span className="text-right">Price</span>
                </div>
              </div>
              <div className="divide-y">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="px-6 py-4">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <img
                              className="h-10 w-10 rounded object-cover"
                              src={item.product.images[0]}
                              alt=""
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-medium text-foreground">
                          {item.product?.name}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        {item.quantity}
                      </div>
                      <div className="text-right text-sm font-medium text-foreground">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-muted/30 px-6 py-3 border-t">
                <div className="grid grid-cols-3 gap-4">
                  <div></div>
                  <div className="text-right text-sm font-semibold text-foreground">Total</div>
                  <div className="text-right text-sm font-semibold text-foreground">
                    ${order.total_amount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 p-6 rounded-lg mb-8">
            <h2 className="text-lg font-semibold mb-4 text-foreground">Shipping Information</h2>
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.shipping_address?.name}</p>
              <p>{order.shipping_address?.street}</p>
              <p>
                {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
              </p>
              <p>{order.shipping_address?.country}</p>
              {order.shipping_address?.phone && <p>Phone: {order.shipping_address.phone}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/shop">
              <Button variant="outline" className="w-full">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/track-order">
              <Button className="w-full">
                Track Your Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default OrderSuccess;
