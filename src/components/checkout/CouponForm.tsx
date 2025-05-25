
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export interface CouponFormProps {
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
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsLoading(true);
    // Mock coupon validation - replace with actual API call
    setTimeout(() => {
      if (couponCode.toLowerCase() === "save10") {
        onCouponApply({
          code: couponCode,
          discount_type: "percentage",
          discount_value: 10
        });
      }
      setIsLoading(false);
      setCouponCode("");
    }, 1000);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100">
            {appliedCoupon.code}
          </Badge>
          <span className="text-sm text-foreground">Coupon applied</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCouponRemove}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="bg-background text-foreground border-border"
      />
      <Button
        onClick={handleApplyCoupon}
        disabled={!couponCode.trim() || isLoading}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? "Applying..." : "Apply"}
      </Button>
    </div>
  );
};

export default CouponForm;
