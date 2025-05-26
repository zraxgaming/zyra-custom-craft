
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Percent, X } from "lucide-react";

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

      // Check if coupon is expired
      if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('This coupon has expired');
      }

      // Check minimum purchase requirement
      if (coupon.min_purchase && orderTotal < coupon.min_purchase) {
        throw new Error(`Minimum purchase of $${coupon.min_purchase} required`);
      }

      // Check usage limit
      if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
        throw new Error('This coupon has reached its usage limit');
      }

      onCouponApply(coupon);
      setCouponCode("");
      toast({
        title: "Coupon applied",
        description: `You saved ${coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : '$' + coupon.discount_value}!`
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
      description: "The coupon has been removed from your order"
    });
  };

  return (
    <Card className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Percent className="h-5 w-5 text-primary" />
          Coupon Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                {appliedCoupon.code}
              </Badge>
              <span className="text-sm text-green-700">
                {appliedCoupon.discount_type === 'percentage' 
                  ? `${appliedCoupon.discount_value}% off`
                  : `$${appliedCoupon.discount_value} off`
                }
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeCoupon}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="coupon">Enter coupon code</Label>
              <Input
                id="coupon"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="SAVE10"
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && applyCoupon()}
              />
            </div>
            <Button 
              onClick={applyCoupon}
              disabled={isApplying || !couponCode.trim()}
              className="w-full"
              variant="outline"
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
