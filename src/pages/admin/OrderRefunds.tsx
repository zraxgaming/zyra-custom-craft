
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderRefundList from '@/components/admin/order/OrderRefundList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, RefreshCw } from 'lucide-react';

const AdminOrderRefunds = () => {
  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold animate-slide-in-left">Order Refunds</h1>
            <p className="text-muted-foreground animate-slide-in-left" style={{animationDelay: '100ms'}}>
              Manage and track order refunds using Ziina's API
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-in-up">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Refunds</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refund Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AED 0.00</div>
              <p className="text-xs text-muted-foreground">Total refunded</p>
            </CardContent>
          </Card>
        </div>

        <div className="animate-slide-in-up" style={{animationDelay: '200ms'}}>
          <OrderRefundList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderRefunds;
