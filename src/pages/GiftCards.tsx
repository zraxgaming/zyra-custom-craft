
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Gift, CreditCard, Send, User, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ZiinaPayment from '@/components/checkout/ZiinaPayment';
import SEOHead from '@/components/seo/SEOHead';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  initial_amount: number;
  recipient_email?: string;
  message?: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    recipientEmail: '',
    message: '',
    recipientName: ''
  });

  useEffect(() => {
    if (user) {
      fetchGiftCards();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchGiftCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGiftCards(data || []);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      toast({
        title: "Error",
        description: "Failed to load your gift cards",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateGiftCardCode = () => {
    return 'GC' + Math.random().toString(36).substr(2, 10).toUpperCase();
  };

  const handleCreateGiftCard = async (transactionId: string) => {
    if (!user) return;

    setPurchasing(true);
    try {
      const code = generateGiftCardCode();
      const amount = parseFloat(formData.amount);
      
      const { error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          amount,
          initial_amount: amount,
          created_by: user.id,
          recipient_email: formData.recipientEmail || null,
          message: formData.message || null,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Gift Card Created! 🎁",
        description: `Gift card ${code} has been created successfully`,
      });

      // Reset form and fetch updated list
      setFormData({ amount: '', recipientEmail: '', message: '', recipientName: '' });
      setShowPurchaseForm(false);
      setShowPayment(false);
      await fetchGiftCards();

    } catch (error: any) {
      console.error('Error creating gift card:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create gift card",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayment(false);
  };

  const handleProceedToPayment = () => {
    if (!formData.amount || parseFloat(formData.amount) < 10) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be at least $10",
        variant: "destructive"
      });
      return;
    }
    setShowPayment(true);
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card className="w-full max-w-md animate-scale-in">
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 mx-auto mb-4 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
              <p className="text-muted-foreground mb-6">
                Please sign in to purchase and manage gift cards
              </p>
              <Button asChild className="w-full">
                <a href="/auth">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Gift Cards - Zyra Custom Craft"
        description="Purchase and manage gift cards for Zyra Custom Craft. Perfect gifts for customization enthusiasts."
        keywords="gift cards, gifts, custom products, personalization"
      />
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Gift Cards
            </h1>
            <p className="text-muted-foreground text-lg">
              Give the perfect gift of customization
            </p>
          </div>

          {/* Purchase New Gift Card */}
          <div className="mb-8 animate-slide-in-up">
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary" />
                  Purchase Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showPurchaseForm ? (
                  <div className="text-center py-8">
                    <Gift className="h-16 w-16 mx-auto mb-4 text-primary animate-pulse" />
                    <h3 className="text-xl font-semibold mb-2">Create a New Gift Card</h3>
                    <p className="text-muted-foreground mb-6">
                      Perfect for birthdays, holidays, or any special occasion
                    </p>
                    <Button 
                      onClick={() => setShowPurchaseForm(true)}
                      className="bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Purchase Gift Card
                    </Button>
                  </div>
                ) : showPayment ? (
                  <div className="space-y-6">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Gift Card Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="ml-2 font-semibold">${formData.amount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recipient:</span>
                          <span className="ml-2">{formData.recipientEmail || 'None'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <ZiinaPayment
                      amount={parseFloat(formData.amount)}
                      onSuccess={handleCreateGiftCard}
                      onError={handlePaymentError}
                      orderData={{
                        firstName: user.user_metadata?.first_name || 'Customer',
                        type: 'Gift Card Purchase'
                      }}
                    />
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setShowPayment(false)}
                      className="w-full"
                    >
                      Back to Form
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="10"
                          step="0.01"
                          placeholder="50.00"
                          value={formData.amount}
                          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recipientEmail">Recipient Email (Optional)</Label>
                        <Input
                          id="recipientEmail"
                          type="email"
                          placeholder="recipient@example.com"
                          value={formData.recipientEmail}
                          onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Happy Birthday! Enjoy shopping..."
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button 
                        onClick={handleProceedToPayment}
                        className="flex-1 bg-gradient-to-r from-primary to-purple-600"
                        disabled={!formData.amount || purchasing}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Proceed to Payment
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowPurchaseForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Your Gift Cards */}
          <div className="animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold mb-6">Your Gift Cards</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded mb-4"></div>
                      <div className="h-8 bg-muted rounded mb-2"></div>
                      <div className="h-4 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : giftCards.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Gift className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No Gift Cards Yet</h3>
                  <p className="text-muted-foreground">
                    Purchase your first gift card to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {giftCards.map((giftCard, index) => (
                  <Card 
                    key={giftCard.id} 
                    className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Gift Card</CardTitle>
                        <Badge variant={giftCard.is_active ? "default" : "secondary"}>
                          {giftCard.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Gift Card Code</p>
                        <p className="text-xl font-mono font-bold">{giftCard.code}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Balance:</span>
                          <span className="font-semibold">${giftCard.amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Original:</span>
                          <span className="text-sm">${giftCard.initial_amount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Created:</span>
                          <span className="text-sm">{new Date(giftCard.created_at).toLocaleDateString()}</span>
                        </div>
                        {giftCard.expires_at && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Expires:</span>
                            <span className="text-sm">{new Date(giftCard.expires_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      
                      {giftCard.recipient_email && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Recipient:</p>
                          <p className="text-sm font-medium">{giftCard.recipient_email}</p>
                        </div>
                      )}
                      
                      {giftCard.message && (
                        <div className="p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground mb-1">Message:</p>
                          <p className="text-sm">{giftCard.message}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default GiftCards;
