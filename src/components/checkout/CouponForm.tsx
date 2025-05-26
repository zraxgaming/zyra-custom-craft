
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tag, X, Loader2 } from "lucide-react";

interface CouponFormProps {
  onCouponApply: (coupon: any) => void;
  onCouponRemove: () => void;
  appliedCoupon: any;
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
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim().toUpperCase())
        .eq('active', true)
        .single();

      if (error || !coupon) {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid or has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check if coupon has expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        toast({
          title: "Expired Coupon",
          description: "This coupon has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check if coupon has reached usage limit
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        toast({
          title: "Coupon Limit Reached",
          description: "This coupon has reached its usage limit.",
          variant: "destructive"
        });
        return;
      }

      // Check minimum purchase requirement
      if (coupon.min_purchase && orderTotal < coupon.min_purchase) {
        toast({
          title: "Minimum Purchase Required",
          description: `This coupon requires a minimum purchase of $${coupon.min_purchase}.`,
          variant: "destructive"
        });
        return;
      }

      onCouponApply(coupon);
      setCouponCode("");
      
      toast({
        title: "Coupon Applied!",
        description: `${coupon.discount_value}${coupon.discount_type === 'percentage' ? '%' : '$'} discount applied.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = () => {
    onCouponRemove();
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed from your order.",
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Tag className="h-5 w-5 text-primary" />
          Coupon Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">
                {appliedCoupon.code}
              </p>
              <p className="text-sm text-green-600 dark:text-green-300">
                {appliedCoupon.discount_type === 'percentage' 
                  ? `${appliedCoupon.discount_value}% off`
                  : `$${appliedCoupon.discount_value} off`
                }
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              className="flex-1"
            />
            <Button
              onClick={applyCoupon}
              disabled={!couponCode.trim() || isApplying}
              variant="outline"
            >
              {isApplying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Apply"
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponForm;
