
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Gift, CreditCard, Mail, Heart, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [ownedGiftCards, setOwnedGiftCards] = useState<any[]>([]);

  const predefinedAmounts = [25, 50, 100, 150, 200];

  useEffect(() => {
    if (user) {
      fetchOwnedGiftCards();
    }
  }, [user]);

  const fetchOwnedGiftCards = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('created_by', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOwnedGiftCards(data || []);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    }
  };

  const generateGiftCardCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) result += '-';
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to purchase gift cards",
        variant: "destructive"
      });
      return;
    }

    if (!recipientEmail || !recipientName || !senderName) {
      toast({
        title: "Required Fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (amount < 5 || amount > 1000) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be between $5 and $1000",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create gift card record
      const giftCardCode = generateGiftCardCode();
      const { data: giftCard, error: giftCardError } = await supabase
        .from('gift_cards')
        .insert({
          code: giftCardCode,
          amount: amount,
          initial_amount: amount,
          created_by: user.id,
          recipient_email: recipientEmail,
          message: message || null
        })
        .select()
        .single();

      if (giftCardError) throw giftCardError;

      // Process payment with Ziina
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('ziina-payment', {
        body: {
          amount: amount,
          success_url: `${window.location.origin}/gift-cards?success=true&gift_card_id=${giftCard.id}`,
          cancel_url: `${window.location.origin}/gift-cards`,
          order_data: {
            type: 'gift_card',
            gift_card_id: giftCard.id,
            recipient_email: recipientEmail,
            recipient_name: recipientName,
            sender_name: senderName,
            message: message
          }
        }
      });

      if (paymentError) throw paymentError;
      if (paymentData?.error) throw new Error(paymentData.error);

      if (paymentData?.payment_url) {
        // Store payment info for verification
        localStorage.setItem('pending_gift_card_payment', JSON.stringify({
          payment_id: paymentData.payment_id,
          gift_card_id: giftCard.id,
          amount: amount
        }));
        
        // Redirect to Ziina payment
        window.location.href = paymentData.payment_url;
      } else {
        throw new Error('No payment URL received');
      }

    } catch (error: any) {
      console.error('Gift card purchase error:', error);
      toast({
        title: "Purchase Failed",
        description: error.message || "Failed to process gift card purchase",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <>
      <SEOHead 
        title="Gift Cards - Zyra Store"
        description="Purchase digital gift cards for your loved ones. Perfect for any occasion."
      />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
        <Navbar />
        
        <div className="py-12">
          <Container>
            {/* Header */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 rounded-full mb-8 animate-bounce-in shadow-2xl">
                <Gift className="h-12 w-12 text-white animate-pulse" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 animate-text-shimmer">
                Digital Gift Cards
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-2xl mx-auto" style={{animationDelay: '200ms'}}>
                Give the gift of choice with our digital gift cards. Perfect for any occasion and delivered instantly via email.
              </p>
              <div className="flex items-center justify-center gap-4 mt-6 animate-fade-in" style={{animationDelay: '400ms'}}>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Instant Delivery
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Star className="h-3 w-3 mr-1" />
                  Never Expires
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Heart className="h-3 w-3 mr-1" />
                  Perfect Gift
                </Badge>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Purchase Form */}
              <Card className="animate-slide-in-left card-premium border-gradient">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                    Purchase Gift Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount Selection */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Select Amount</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount ? "default" : "outline"}
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className="h-16 text-lg font-bold hover-3d-lift"
                        >
                          ${amount}
                        </Button>
                      ))}
                      <div className="space-y-2">
                        <Label htmlFor="custom-amount" className="text-sm">Custom Amount</Label>
                        <Input
                          id="custom-amount"
                          type="number"
                          placeholder="$5-$1000"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(0);
                          }}
                          min="5"
                          max="1000"
                          className="hover-magnetic"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">Recipient Information</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="recipient-name">Recipient Name *</Label>
                        <Input
                          id="recipient-name"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="John Doe"
                          className="hover-magnetic"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="recipient-email">Recipient Email *</Label>
                        <Input
                          id="recipient-email"
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="hover-magnetic"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sender Information */}
                  <div>
                    <Label htmlFor="sender-name">Your Name *</Label>
                    <Input
                      id="sender-name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Jane Smith"
                      className="hover-magnetic"
                      required
                    />
                  </div>

                  {/* Personal Message */}
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Happy Birthday! Hope you find something you love..."
                      className="hover-magnetic resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Payment Summary */}
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-semibold">Total Amount:</span>
                      <span className="text-2xl font-bold text-purple-600">
                        ${finalAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>• Gift card will be sent to {recipientEmail || 'recipient email'}</p>
                      <p>• Payment processed securely via Ziina</p>
                      <p>• Digital delivery within minutes</p>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={handlePurchase}
                    disabled={isProcessing || finalAmount < 5 || !recipientEmail || !recipientName || !senderName}
                    className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 hover:from-purple-700 hover:via-pink-700 hover:to-purple-900 shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] animate-bounce-in"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Gift className="h-5 w-5" />
                        Purchase for ${finalAmount.toFixed(2)}
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Preview & Owned Cards */}
              <div className="space-y-8">
                {/* Gift Card Preview */}
                <Card className="animate-slide-in-right card-premium border-gradient">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Mail className="h-6 w-6 text-pink-600" />
                      Gift Card Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800 p-8 rounded-2xl text-white shadow-2xl animate-float">
                      <div className="text-center space-y-4">
                        <Gift className="h-12 w-12 mx-auto animate-pulse" />
                        <h3 className="text-2xl font-bold">Zyra Store Gift Card</h3>
                        <div className="text-4xl font-bold">${finalAmount.toFixed(2)}</div>
                        <div className="bg-white/20 px-4 py-2 rounded-lg">
                          <p className="text-sm opacity-90">To: {recipientName || 'Recipient Name'}</p>
                          <p className="text-sm opacity-90">From: {senderName || 'Your Name'}</p>
                        </div>
                        {message && (
                          <div className="bg-white/10 p-4 rounded-lg">
                            <p className="text-sm italic">"{message}"</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Owned Gift Cards */}
                {user && ownedGiftCards.length > 0 && (
                  <Card className="animate-slide-in-up card-premium border-gradient">
                    <CardHeader>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-600" />
                        Your Gift Cards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {ownedGiftCards.map((card, index) => (
                          <div
                            key={card.id}
                            className="p-4 border rounded-xl hover:shadow-lg transition-all duration-300 animate-fade-in hover-3d-lift"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold">{card.code}</p>
                                <p className="text-sm text-muted-foreground">
                                  Balance: ${Number(card.amount).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  To: {card.recipient_email}
                                </p>
                              </div>
                              <Badge variant={Number(card.amount) > 0 ? "default" : "secondary"}>
                                {Number(card.amount) > 0 ? "Active" : "Used"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </Container>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default GiftCards;
