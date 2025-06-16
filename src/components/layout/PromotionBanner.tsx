
import React, { useState, useEffect } from "react";
import { X, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromotionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was already shown in this session
    const bannerShown = sessionStorage.getItem('promotionBannerShown');
    if (!bannerShown) {
      setIsVisible(true);
      sessionStorage.setItem('promotionBannerShown', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 animate-slide-down">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5" />
          <span className="font-medium">
            🎉 Special Offer: Use code <span className="font-bold bg-white/20 px-2 py-1 rounded">SAVE20</span> for 20% off your order!
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="text-white hover:bg-white/10 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionBanner;
