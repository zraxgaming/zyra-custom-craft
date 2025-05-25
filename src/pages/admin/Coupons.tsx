
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Plus, Percent, Calendar, TrendingUp } from "lucide-react";

const Coupons = () => {
  return (
    <AdminLayout>
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Coupons & Discounts</h1>
            <p className="text-muted-foreground mt-1">Create and manage promotional codes and discounts</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 btn-animate flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Coupon
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 hover-scale animate-scale-in">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Active Coupons</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 hover-scale animate-scale-in" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Times Used</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 hover-scale animate-scale-in" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Percent className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">$0</p>
                  <p className="text-sm text-muted-foreground">Total Savings</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:shadow-lg transition-all duration-200 hover-scale animate-scale-in" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-sm text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Tag className="h-5 w-5" />
              Coupon Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No coupons created yet</h3>
              <p className="text-muted-foreground mb-6">Start by creating your first promotional coupon to boost sales and customer engagement.</p>
              <Button className="bg-primary hover:bg-primary/90 btn-animate">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Coupon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Coupons;
