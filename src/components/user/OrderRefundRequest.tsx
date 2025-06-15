
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OrderRefundRequestProps {
  orderId: string;
  totalAmount: number;
  paymentIntentId?: string;
  hasRefundRequest?: boolean;
  refundStatus?: string;
}

const OrderRefundRequest: React.FC<OrderRefundRequestProps> = ({
  orderId,
  totalAmount,
  paymentIntentId,
  hasRefundRequest = false,
  refundStatus
}) => {
  const [isRequestingRefund, setIsRequestingRefund] = useState(false);
  const [refundAmount, setRefundAmount] = useState(totalAmount.toString());
  const [reason, setReason] = useState('');
  const { toast } = useToast();

  const handleRefundRequest = async () => {
    if (!paymentIntentId) {
      toast({
        title: 'Error',
        description: 'Payment information not available for refund',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(refundAmount);
    if (amount <= 0 || amount > totalAmount) {
      toast({
        title: 'Invalid Amount',
        description: `Refund amount must be between $0.01 and $${totalAmount.toFixed(2)}`,
        variant: 'destructive'
      });
      return;
    }

    setIsRequestingRefund(true);
    try {
      const { error } = await supabase
        .from('order_refunds')
        .insert({
          order_id: orderId,
          amount: amount,
          reason: reason,
          status: 'requested',
          ziina_refund_id: `pending_${Date.now()}`
        });

      if (error) throw error;

      toast({
        title: 'Refund Requested',
        description: 'Your refund request has been submitted and will be reviewed by our team.'
      });

      // Refresh the page to show the updated status
      window.location.reload();
    } catch (error: any) {
      console.error('Error requesting refund:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit refund request. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsRequestingRefund(false);
    }
  };

  if (hasRefundRequest) {
    return (
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="h-5 w-5" />
            Refund Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="mb-2">
            {refundStatus || 'Requested'}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Your refund request is being processed. We'll notify you once it's complete.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Request Refund
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="refund-amount">Refund Amount</Label>
          <Input
            id="refund-amount"
            type="number"
            step="0.01"
            max={totalAmount}
            min="0.01"
            value={refundAmount}
            onChange={(e) => setRefundAmount(e.target.value)}
            placeholder="0.00"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Maximum refund: ${totalAmount.toFixed(2)}
          </p>
        </div>

        <div>
          <Label htmlFor="refund-reason">Reason for Refund</Label>
          <Textarea
            id="refund-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Please explain why you're requesting a refund..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleRefundRequest}
          disabled={isRequestingRefund || !paymentIntentId}
          className="w-full"
        >
          {isRequestingRefund ? 'Submitting...' : 'Request Refund'}
        </Button>

        {!paymentIntentId && (
          <p className="text-xs text-red-500">
            This order cannot be refunded (missing payment information)
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderRefundRequest;
