import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useReferrals } from "@/hooks/use-referrals";
import UserProfile from "@/components/user/UserProfile";
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
  const referrals = useReferrals();

  useEffect(() => {
    if (user) {
      // Fetch in descending order (most recent first)
      supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }) // true boolean!
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
            {/* Editable User Profile Section */}
            <UserProfile />
            <Separator />

            {/* Referrals Program section */}
            {/* If you want this as a separate card/component, you can display a Referral dashboard: */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Referrals</h3>
              {/* Add referral stats, copy/share code, etc */}
              {/* You could also import and use <ReferralDashboard /> if it exists */}
            </div>

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
