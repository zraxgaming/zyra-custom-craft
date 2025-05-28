
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, X, Check } from "lucide-react";

interface GiftCardFormProps {
  onGiftCardApply: (giftCard: any) => void;
  onGiftCardRemove: () => void;
  appliedGiftCard?: any;
  orderTotal: number;
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({
  onGiftCardApply,
  onGiftCardRemove,
  appliedGiftCard,
  orderTotal
}) => {
  const [giftCardCode, setGiftCardCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const applyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({
        title: "Invalid gift card",
        description: "Please enter a gift card code",
        variant: "destructive"
      });
      return;
    }

    setIsApplying(true);
    try {
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !giftCard) {
        throw new Error('Invalid gift card code');
      }

      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        throw new Error('This gift card has expired');
      }

      if (giftCard.amount <= 0) {
        throw new Error('This gift card has no remaining balance');
      }

      onGiftCardApply(giftCard);
      setGiftCardCode("");
      
      const appliedAmount = Math.min(giftCard.amount, orderTotal);
      toast({
        title: "Gift card applied successfully",
        description: `Applied $${appliedAmount.toFixed(2)} from your gift card`,
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Invalid gift card",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const removeGiftCard = () => {
    onGiftCardRemove();
    toast({
      title: "Gift card removed",
      description: "The gift card has been removed from your order",
      variant: "default"
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedGiftCard ? (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-green-200 dark:border-green-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    {appliedGiftCard.code}
                  </Badge>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ${Math.min(appliedGiftCard.amount, orderTotal).toFixed(2)} applied
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeGiftCard}
                className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="giftcard" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter gift card code
              </Label>
              <Input
                id="giftcard"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                placeholder="GIFT-XXXXXXXXXX"
                className="mt-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                onKeyPress={(e) => e.key === 'Enter' && applyGiftCard()}
              />
            </div>
            <Button 
              onClick={applyGiftCard}
              disabled={isApplying || !giftCardCode.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {isApplying ? 'Applying...' : 'Apply Gift Card'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftCardForm;
