import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarIcon, CreditCard, PackageCheck, Receipt } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch in descending order (most recent first)
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: 'false' })
        .then(({ data, error }) => {
          if (!error) setOrders(data || []);
        });
    }
  }, [user]);

  return (
    <div>
      {/* ... render orders etc., most recent first */}
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Welcome to Your Dashboard
            </CardTitle>
            <CardDescription>
              Manage your orders, profile, and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url as string} />
                <AvatarFallback>
                  {user?.user_metadata?.first_name?.[0]}
                  {user?.user_metadata?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold">
                  {user?.user_metadata?.first_name}{" "}
                  {user?.user_metadata?.last_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            <Separator />

            {/* Order History Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Order History</h3>
              {orders.length === 0 ? (
                <div className="text-center py-4">
                  <PackageCheck className="h-6 w-6 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No orders placed yet.
                  </p>
                  <Button asChild variant="link">
                    <Link to="/shop">Browse Products</Link>
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="bg-muted/50">
                      <CardHeader className="space-y-1">
                        <CardTitle className="text-sm font-semibold flex items-center space-x-2">
                          <Receipt className="h-4 w-4" />
                          Order #{order.id.substring(0, 8)}
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                          Placed on {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Total: ${order.total_amount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4" />
                          <span>
                            Status:{" "}
                            <Badge variant="secondary">{order.status}</Badge>
                          </span>
                        </div>
                        <Button asChild variant="link" className="mt-2">
                          <Link to={`/order/${order.id}`}>View Details</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
