
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, X, Check } from "lucide-react";

interface CouponFormProps {
  onCouponApply: (coupon: any) => void;
  onCouponRemove: () => void;
  appliedCoupon?: any;
  orderTotal: number;
}

const CouponForm: React.FC<CouponFormProps> = ({
  onCouponApply,
  onCouponRemove,
  appliedCoupon,
  orderTotal
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid coupon",
        description: "Please enter a coupon code",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        throw new Error('Invalid coupon code');
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('This coupon has expired');
      }

      // Check if coupon has reached maximum uses
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        throw new Error('This coupon has reached its usage limit');
      }

      // Check minimum purchase requirement
      if (coupon.min_purchase > orderTotal) {
        throw new Error(`Minimum purchase of $${coupon.min_purchase} required for this coupon`);
      }

      onCouponApply(coupon);
      setCouponCode("");
      
      const discountAmount = coupon.discount_type === 'percentage' 
        ? (orderTotal * coupon.discount_value / 100)
        : coupon.discount_value;
      
      toast({
        title: "Coupon applied successfully",
        description: `You saved $${discountAmount.toFixed(2)}!`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Invalid coupon",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemove();
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order",
      variant: "default"
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
            <Ticket className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          Coupon Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCoupon ? (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    {appliedCoupon.code}
                  </Badge>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {appliedCoupon.discount_type === 'percentage' 
                      ? `${appliedCoupon.discount_value}% off`
                      : `$${appliedCoupon.discount_value} off`
                    }
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="coupon" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter coupon code
              </Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="SAVE10"
                className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              />
            </div>
            <Button 
              onClick={applyCoupon}
              disabled={isApplying || !couponCode.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-300"
            >
              {isApplying ? 'Applying...' : 'Apply Coupon'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponForm;
