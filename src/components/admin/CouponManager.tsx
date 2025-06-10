
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Sparkles } from "lucide-react";

const CouponManager = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-scale-in">
          Coupon Manager
        </h1>
        <p className="text-muted-foreground mt-2 animate-slide-in-right">
          Create and manage discount coupons for your store
        </p>
      </div>

      <Card className="animate-bounce-in border-primary/20 shadow-lg">
        <CardContent className="p-12 text-center">
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-2xl">
              <Gift className="h-16 w-16 mx-auto text-primary mb-4 animate-float" />
              <Sparkles className="h-8 w-8 mx-auto text-purple-500 animate-pulse" />
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Enhanced Coupon System
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                The coupon management system has been moved to the dedicated Coupons page in the admin sidebar. 
                Navigate there to create discount codes, track usage, and manage promotional campaigns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 animate-slide-in-left">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Percentage Discounts</h4>
                <p className="text-sm text-green-600 dark:text-green-400">Create percentage-based coupons</p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800 animate-scale-in">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Fixed Amount</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">Set fixed dollar amount discounts</p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800 animate-slide-in-right">
                <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Usage Tracking</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">Monitor coupon usage and limits</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CouponManager;
