
import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PromotionBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if banner was already shown in this session
    const bannerShown = sessionStorage.getItem('promotion-banner-shown');
    if (!bannerShown) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('promotion-banner-shown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white py-3 px-4 relative animate-slide-down">
      <div className="container mx-auto flex items-center justify-center text-center">
        <Tag className="h-5 w-5 mr-2 animate-bounce" />
        <span className="font-medium">
          🎉 Special Offer: Use code <strong className="bg-white/20 px-2 py-1 rounded">SAVE20</strong> for 20% off your order!
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-4 text-white hover:bg-white/20 p-1 h-auto"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromotionBanner;
