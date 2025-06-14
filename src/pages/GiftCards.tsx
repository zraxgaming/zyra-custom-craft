
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Gift, CreditCard, Star, Sparkles, Heart, ShoppingBag, Loader2 } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';
import ZiinaPayment from '@/components/checkout/ZiinaPayment';

interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipient_email: string;
  message: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
}

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [userGiftCards, setUserGiftCards] = useState<GiftCard[]>([]);
  
  const [formData, setFormData] = useState({
    amount: '50',
    recipient_email: '',
    recipient_name: '',
    message: 'Hope you enjoy shopping with Zyra!',
    sender_name: ''
  });

  const predefinedAmounts = [25, 50, 100, 200, 500];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (user) {
        fetchUserGiftCards();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [user]);

  const fetchUserGiftCards = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching gift cards:', error);
        return;
      }
      
      setUserGiftCards(data || []);
    } catch (error: any) {
      console.error('Error fetching gift cards:', error);
      toast({
        title: "Error",
        description: "Failed to load your gift cards",
        variant: "destructive",
      });
    }
  };

  const handlePurchase = () => {
    if (!user) {
      navigate('/auth?redirect=/gift-cards');
      return;
    }

    if (!formData.recipient_email || !formData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 5 || amount > 1000) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be between $5 and $1000",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    setPurchasing(true);
    try {
      const code = 'GC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const amount = parseFloat(formData.amount);
      
      const { error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          amount,
          initial_amount: amount,
          recipient_email: formData.recipient_email,
          recipient_name: formData.recipient_name,
          message: formData.message,
          sender_name: formData.sender_name,
          transaction_id: transactionId,
          created_by: user?.id,
          is_active: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        });

      if (error) throw error;

      toast({
        title: "Gift Card Created! 🎁",
        description: `Gift card ${code} has been created and will be sent to ${formData.recipient_email}`,
      });

      setFormData({
        amount: '50',
        recipient_email: '',
        recipient_name: '',
        message: 'Hope you enjoy shopping with Zyra!',
        sender_name: ''
      });
      setShowPayment(false);
      fetchUserGiftCards();
    } catch (error: any) {
      console.error('Error creating gift card:', error);
      toast({
        title: "Error",
        description: "Failed to create gift card",
        variant: "destructive",
      });
    } finally {
      setPurchasing(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
    setShowPayment(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
        <SEOHead 
          title="Gift Cards - Zyra Custom Craft | Perfect Gifts for Everyone"
          description="Purchase gift cards for your loved ones. Perfect for any occasion. Available 24/7 with secure Ziina payments."
          keywords="gift cards, presents, shopping, Zyra, UAE, gifts"
        />
        <Navbar />
        <Container className="py-8">
          <div className="flex justify-center py-16">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading gift cards...</p>
            </div>
          </div>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <SEOHead 
        title="Gift Cards - Zyra Custom Craft | Perfect Gifts for Everyone"
        description="Purchase gift cards for your loved ones. Perfect for any occasion. Available 24/7 with secure Ziina payments."
        keywords="gift cards, presents, shopping, Zyra, UAE, gifts"
      />
      <Navbar />
      
      <Container className="py-12">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Gift Cards
            </h1>
            <Sparkles className="h-8 w-8 text-pink-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share the joy of customization with your loved ones. Perfect for birthdays, holidays, or any special occasion.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Purchase Form */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl animate-slide-in-left">
            <CardHeader className="text-center pb-4">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <ShoppingBag className="h-6 w-6 text-primary" />
                Purchase Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showPayment ? (
                <>
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Choose Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={formData.amount === amount.toString() ? "default" : "outline"}
                          onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                          className="h-12 text-lg font-semibold transition-all duration-300 hover:scale-105"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    <div className="relative">
                      <Label htmlFor="custom-amount" className="text-sm">Custom Amount ($5 - $1000)</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        min="5"
                        max="1000"
                        placeholder="Enter custom amount"
                        value={formData.amount}
                        onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="recipient-email" className="text-base font-medium">Recipient Email *</Label>
                    <Input
                      id="recipient-email"
                      type="email"
                      placeholder="recipient@example.com"
                      value={formData.recipient_email}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipient_email: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="recipient-name" className="text-base font-medium">Recipient Name</Label>
                    <Input
                      id="recipient-name"
                      placeholder="John Doe"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipient_name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="sender-name" className="text-base font-medium">Your Name</Label>
                    <Input
                      id="sender-name"
                      placeholder="Jane Smith"
                      value={formData.sender_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-base font-medium">Personal Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Add a personal touch..."
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handlePurchase}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-300 hover:scale-105"
                    disabled={!formData.amount || !formData.recipient_email}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Purchase Gift Card ${formData.amount}
                  </Button>
                </>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2">Complete Payment</h3>
                    <p className="text-muted-foreground">
                      Gift card for {formData.recipient_email}
                    </p>
                  </div>

                  <ZiinaPayment
                    amount={parseFloat(formData.amount)}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    orderData={{ firstName: formData.sender_name }}
                  />

                  <Button
                    onClick={() => setShowPayment(false)}
                    variant="outline"
                    className="w-full"
                  >
                    Back to Form
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Benefits & Your Gift Cards */}
          <div className="space-y-8 animate-slide-in-right">
            <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Why Choose Our Gift Cards?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 transition-colors hover:text-purple-600">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span>Perfect for any occasion</span>
                </div>
                <div className="flex items-center gap-3 transition-colors hover:text-purple-600">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  <span>Valid for 1 year from purchase</span>
                </div>
                <div className="flex items-center gap-3 transition-colors hover:text-purple-600">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Works on all products</span>
                </div>
                <div className="flex items-center gap-3 transition-colors hover:text-purple-600">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <span>Secure Ziina payments - 24/7 available</span>
                </div>
              </CardContent>
            </Card>

            {user && userGiftCards.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Your Gift Cards ({userGiftCards.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {userGiftCards.map((giftCard) => (
                    <div key={giftCard.id} className="p-4 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="font-mono text-sm">
                          {giftCard.code}
                        </Badge>
                        <span className="font-semibold text-lg text-green-600">
                          ${giftCard.amount}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        For: {giftCard.recipient_email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(giftCard.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires: {new Date(giftCard.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {user && userGiftCards.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="text-center py-8">
                  <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Gift Cards Yet</h3>
                  <p className="text-muted-foreground">
                    Your purchased gift cards will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default GiftCards;
