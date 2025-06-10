
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gift, Check, X, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface GiftCardSectionProps {
  onGiftCardApplied: (giftCard: any) => void;
  appliedGiftCard: any;
  totalAmount: number;
}

const GiftCardSection: React.FC<GiftCardSectionProps> = ({
  onGiftCardApplied,
  appliedGiftCard,
  totalAmount
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const verifyGiftCard = async () => {
    if (!giftCardCode.trim()) {
      toast({
        title: "Invalid Code",
        description: "Please enter a gift card code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', giftCardCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !data) {
        toast({
          title: "Invalid Gift Card",
          description: "Gift card not found or expired",
          variant: "destructive"
        });
        return;
      }

      if (data.amount <= 0) {
        toast({
          title: "Gift Card Empty",
          description: "This gift card has no remaining balance",
          variant: "destructive"
        });
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({
          title: "Gift Card Expired",
          description: "This gift card has expired",
          variant: "destructive"
        });
        return;
      }

      onGiftCardApplied(data);
      setShowInput(false);
      setGiftCardCode('');
      
      toast({
        title: "Gift Card Applied! 🎁",
        description: `$${data.amount} gift card applied to your order`,
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify gift card",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const removeGiftCard = () => {
    onGiftCardApplied(null);
    toast({
      title: "Gift Card Removed",
      description: "Gift card has been removed from your order",
    });
  };

  const remainingAmount = Math.max(0, totalAmount - (appliedGiftCard?.amount || 0));

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
          <Gift className="h-5 w-5 animate-bounce" />
          Gift Card
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedGiftCard ? (
          <div className="space-y-3 animate-fade-in">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 animate-pulse" />
                <span className="font-medium text-green-700 dark:text-green-300">
                  Gift Card Applied
                </span>
              </div>
              <Button
                onClick={removeGiftCard}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Gift Card Code:</span>
                <Badge variant="outline">{appliedGiftCard.code}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Gift Card Value:</span>
                <span className="font-semibold text-green-600">${appliedGiftCard.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining to Pay:</span>
                <span className="font-bold text-lg">${remainingAmount.toFixed(2)}</span>
              </div>
            </div>

            {remainingAmount > 0 && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                  💳 You still need to pay ${remainingAmount.toFixed(2)}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Gift card covers ${Math.min(appliedGiftCard.amount, totalAmount).toFixed(2)} of your total
                </p>
              </div>
            )}

            {remainingAmount <= 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  🎉 Your order is fully covered by the gift card!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {!showInput ? (
              <Button
                onClick={() => setShowInput(true)}
                variant="outline"
                className="w-full border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-all duration-300 hover:scale-105"
              >
                <Gift className="h-4 w-4 mr-2 animate-bounce" />
                Apply Gift Card
              </Button>
            ) : (
              <div className="space-y-3 animate-slide-in-up">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter gift card code"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                    className="border-2 border-purple-300 dark:border-purple-700 focus:border-purple-500"
                  />
                  <Button
                    onClick={verifyGiftCard}
                    disabled={isVerifying}
                    className="bg-purple-600 hover:bg-purple-700 px-6"
                  >
                    {isVerifying ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={() => setShowInput(false)}
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GiftCardSection;
