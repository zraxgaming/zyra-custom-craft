
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface CouponFormProps {
  onApplyCoupon: (code: string) => Promise<void>;
  isLoading: boolean;
  appliedCoupon?: {
    code: string;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
  } | null;
  onRemoveCoupon: () => void;
}

const CouponForm: React.FC<CouponFormProps> = ({
  onApplyCoupon,
  isLoading,
  appliedCoupon,
  onRemoveCoupon
}) => {
  const [couponCode, setCouponCode] = useState("");
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      onApplyCoupon(couponCode.trim());
    }
  };
  
  if (appliedCoupon) {
    return (
      <div className="bg-green-50 p-3 rounded-md border border-green-200 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-green-800">
            Coupon applied: {appliedCoupon.code}
          </p>
          <p className="text-xs text-green-700">
            {appliedCoupon.discountType === 'percentage'
              ? `${appliedCoupon.discountValue}% off`
              : `$${appliedCoupon.discountValue.toFixed(2)} off`
            }
          </p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onRemoveCoupon}
        >
          Remove
        </Button>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleApplyCoupon} className="flex flex-col space-y-2">
      <Label htmlFor="couponCode">Promo Code</Label>
      <div className="flex gap-2">
        <Input
          id="couponCode"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter promo code"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          variant="secondary"
          disabled={!couponCode.trim() || isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
        </Button>
      </div>
    </form>
  );
};

export default CouponForm;
