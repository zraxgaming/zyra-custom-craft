
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderRefund {
  id: string;
  order_id: string;
  ziina_refund_id: string;
  amount: number;
  currency: string;
  reason?: string;
  status: string;
  created_at: string;
  orders?: {
    id: string;
    total_amount: number;
    payment_intent_id?: string;
  };
}

interface ZiinaRefundRequest {
  refund_id: string;
  amount: number;
  reason?: string;
}

interface ZiinaRefundResponse {
  refund_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: string;
}

const OrderRefundList: React.FC = () => {
  const [refunds, setRefunds] = useState<OrderRefund[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newRefund, setNewRefund] = useState({
    order_id: '',
    amount: '',
    reason: ''
  });
  const [refundIdToFetch, setRefundIdToFetch] = useState('');
  const [fetchingRefund, setFetchingRefund] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      const { data, error } = await supabase
        .from('order_refunds')
        .select(`
          *,
          orders!inner (
            id,
            total_amount,
            payment_intent_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRefunds(data || []);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch refunds',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createRefund = async () => {
    if (!newRefund.order_id || !newRefund.amount) {
      toast({
        title: 'Validation Error',
        description: 'Order ID and amount are required',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    try {
      // First get the order to verify payment_intent_id exists
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('payment_intent_id, total_amount')
        .eq('id', newRefund.order_id)
        .single();

      if (orderError || !order?.payment_intent_id) {
        throw new Error('Order not found or missing payment intent ID');
      }

      // Call Ziina Refund API
      const refundResponse = await fetch('/api/ziina-refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent_id: order.payment_intent_id,
          amount: parseFloat(newRefund.amount),
          reason: newRefund.reason
        })
      });

      if (!refundResponse.ok) {
        throw new Error('Failed to create refund with Ziina');
      }

      const ziinaRefund: ZiinaRefundResponse = await refundResponse.json();

      // Store refund in our database
      const { error: dbError } = await supabase
        .from('order_refunds')
        .insert({
          order_id: newRefund.order_id,
          ziina_refund_id: ziinaRefund.refund_id,
          amount: ziinaRefund.amount,
          currency: ziinaRefund.currency,
          reason: newRefund.reason,
          status: ziinaRefund.status
        });

      if (dbError) throw dbError;

      toast({
        title: 'Refund Created',
        description: `Refund ${ziinaRefund.refund_id} created successfully`
      });

      setNewRefund({ order_id: '', amount: '', reason: '' });
      fetchRefunds();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create refund',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  const fetchRefundById = async () => {
    if (!refundIdToFetch) return;

    setFetchingRefund(true);
    try {
      const response = await fetch(`/api/ziina-refund/${refundIdToFetch}`);
      if (!response.ok) throw new Error('Failed to fetch refund from Ziina');

      const ziinaRefund: ZiinaRefundResponse = await response.json();
      
      toast({
        title: 'Refund Details',
        description: `Status: ${ziinaRefund.status}, Amount: ${ziinaRefund.amount} ${ziinaRefund.currency}`
      });

      // Update local record if exists
      const { error } = await supabase
        .from('order_refunds')
        .update({ status: ziinaRefund.status })
        .eq('ziina_refund_id', refundIdToFetch);

      if (!error) fetchRefunds();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch refund details',
        variant: 'destructive'
      });
    } finally {
      setFetchingRefund(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'default';
      case 'pending':
        return 'default';
      case 'failed':
      case 'error':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <RefreshCw className="h-4 w-4" />;
      case 'failed':
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Create Refund */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Create Refund
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="order_id">Order ID</Label>
              <Input
                id="order_id"
                value={newRefund.order_id}
                onChange={(e) => setNewRefund(prev => ({ ...prev, order_id: e.target.value }))}
                placeholder="Enter order ID"
              />
            </div>
            <div>
              <Label htmlFor="amount">Refund Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={newRefund.amount}
                onChange={(e) => setNewRefund(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason (Optional)</Label>
              <Textarea
                id="reason"
                value={newRefund.reason}
                onChange={(e) => setNewRefund(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Refund reason..."
              />
            </div>
            <Button onClick={createRefund} disabled={creating} className="w-full">
              {creating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Refund
            </Button>
          </CardContent>
        </Card>

        {/* Fetch Refund by ID */}
        <Card>
          <CardHeader>
            <CardTitle>Fetch Refund Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="refund_id">Refund ID</Label>
              <Input
                id="refund_id"
                value={refundIdToFetch}
                onChange={(e) => setRefundIdToFetch(e.target.value)}
                placeholder="Enter Ziina refund ID"
              />
            </div>
            <Button onClick={fetchRefundById} disabled={fetchingRefund} className="w-full">
              {fetchingRefund ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : null}
              Fetch Details
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Refunds List */}
      <Card>
        <CardHeader>
          <CardTitle>Refund History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {refunds.map((refund) => (
              <div key={refund.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(refund.status)}>
                      {getStatusIcon(refund.status)}
                      {refund.status}
                    </Badge>
                    <span className="font-mono text-sm text-muted-foreground">
                      {refund.ziina_refund_id}
                    </span>
                  </div>
                  <span className="font-semibold">
                    {refund.amount} {refund.currency}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Order: {refund.order_id}</p>
                  {refund.reason && <p>Reason: {refund.reason}</p>}
                  <p>Created: {new Date(refund.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {refunds.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No refunds found
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderRefundList;
