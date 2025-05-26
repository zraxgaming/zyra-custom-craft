
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, X, Loader2 } from "lucide-react";

interface GiftCardFormProps {
  onGiftCardApply: (giftCard: any) => void;
  onGiftCardRemove: () => void;
  appliedGiftCard: any;
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
    if (!giftCardCode.trim()) return;

    setIsApplying(true);
    try {
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.trim().toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !giftCard) {
        toast({
          title: "Invalid Gift Card",
          description: "The gift card code you entered is not valid or has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check if gift card has expired
      if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
        toast({
          title: "Expired Gift Card",
          description: "This gift card has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check if gift card has sufficient balance
      if (giftCard.amount <= 0) {
        toast({
          title: "No Balance",
          description: "This gift card has no remaining balance.",
          variant: "destructive"
        });
        return;
      }

      onGiftCardApply(giftCard);
      setGiftCardCode("");
      
      toast({
        title: "Gift Card Applied!",
        description: `$${giftCard.amount} gift card balance applied.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply gift card. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplying(false);
    }
  };

  const removeGiftCard = () => {
    onGiftCardRemove();
    toast({
      title: "Gift Card Removed",
      description: "Gift card has been removed from your order.",
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Gift className="h-5 w-5 text-primary" />
          Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedGiftCard ? (
          <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div>
              <p className="font-medium text-purple-800 dark:text-purple-200">
                {appliedGiftCard.code}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                Balance: ${appliedGiftCard.amount}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeGiftCard}
              className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Input
              placeholder="Enter gift card code"
              value={giftCardCode}
              onChange={(e) => setGiftCardCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyGiftCard()}
              className="flex-1"
            />
            <Button
              onClick={applyGiftCard}
              disabled={!giftCardCode.trim() || isApplying}
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

export default GiftCardForm;
