
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, X } from "lucide-react";

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

      // Check if gift card is expired
      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        throw new Error('This gift card has expired');
      }

      // Check if gift card has balance
      if (giftCard.amount <= 0) {
        throw new Error('This gift card has no remaining balance');
      }

      onGiftCardApply(giftCard);
      setGiftCardCode("");
      toast({
        title: "Gift card applied",
        description: `Applied $${Math.min(giftCard.amount, orderTotal).toFixed(2)} from your gift card`
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
      description: "The gift card has been removed from your order"
    });
  };

  return (
    <Card className="animate-slide-in-left" style={{animationDelay: '0.3s'}}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedGiftCard ? (
          <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                {appliedGiftCard.code}
              </Badge>
              <span className="text-sm text-purple-700">
                ${Math.min(appliedGiftCard.amount, orderTotal).toFixed(2)} applied
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeGiftCard}
              className="h-6 w-6 p-0 hover:bg-red-100"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <Label htmlFor="giftcard">Enter gift card code</Label>
              <Input
                id="giftcard"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                placeholder="GIFT-XXXXXXXXXX"
                className="mt-1"
                onKeyPress={(e) => e.key === 'Enter' && applyGiftCard()}
              />
            </div>
            <Button 
              onClick={applyGiftCard}
              disabled={isApplying || !giftCardCode.trim()}
              className="w-full"
              variant="outline"
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
