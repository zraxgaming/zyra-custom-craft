
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, CreditCard, Check, Sparkles, Heart, Star, Smartphone } from "lucide-react";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";
import SEOHead from "@/components/seo/SEOHead";

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('50');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showZiinaPayment, setShowZiinaPayment] = useState(false);

  const presetAmounts = [25, 50, 100, 200];

  useEffect(() => {
    if (user) {
      fetchGiftCards();
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
    } catch (error: any) {
      console.error('Error fetching gift cards:', error);
    }
  };

  const handleZiinaSuccess = async (transactionId: string) => {
    try {
      const amount = parseFloat(purchaseAmount);
      const code = `GC${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      const { error } = await supabase
        .from('gift_cards')
        .insert({
          code: code,
          amount: amount,
          initial_amount: amount,
          created_by: user.id,
          recipient_email: recipientEmail || null,
          message: message || null,
          is_active: true,
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success! 🎉",
        description: "Gift card purchased successfully!",
      });

      setPurchaseAmount('50');
      setRecipientEmail('');
      setMessage('');
      setShowZiinaPayment(false);
      fetchGiftCards();
    } catch (error: any) {
      console.error('Error creating gift card:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create gift card",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <SEOHead 
        title="Gift Cards - Zyra Custom Craft"
        description="Purchase digital gift cards for Zyra Custom Craft. The perfect gift for anyone who loves personalized products."
        keywords="gift cards, digital gifts, personalized gifts, custom products"
      />
      <Navbar />
      
      <div className="py-16 animate-fade-in">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-slide-in-up">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Gift className="h-12 w-12 text-purple-600 animate-bounce" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-text-shimmer">
                  Gift Cards
                </h1>
                <Sparkles className="h-12 w-12 text-pink-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto animate-fade-in-delay">
                Give the gift of creativity! Purchase digital gift cards for your loved ones to explore our custom craft collection.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Purchase Form */}
              <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-0 shadow-2xl animate-slide-in-left">
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl font-bold text-purple-700 dark:text-purple-300 flex items-center justify-center gap-2">
                    <CreditCard className="h-6 w-6 animate-bounce" />
                    Purchase Gift Card
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!showZiinaPayment ? (
                    <>
                      <div className="space-y-3">
                        <Label className="text-lg font-semibold text-purple-700 dark:text-purple-300">Choose Amount</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {presetAmounts.map((amount, index) => (
                            <Button
                              key={amount}
                              variant={purchaseAmount === amount.toString() ? "default" : "outline"}
                              onClick={() => setPurchaseAmount(amount.toString())}
                              className={`h-16 text-lg font-semibold transition-all duration-300 animate-fade-in ${
                                purchaseAmount === amount.toString() 
                                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-105 shadow-lg" 
                                  : "hover:scale-105 hover:shadow-md"
                              }`}
                              style={{animationDelay: `${index * 100}ms`}}
                            >
                              ${amount}
                            </Button>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="custom-amount">Or enter custom amount</Label>
                          <Input
                            id="custom-amount"
                            type="number"
                            min="10"
                            max="1000"
                            value={purchaseAmount}
                            onChange={(e) => setPurchaseAmount(e.target.value)}
                            className="text-lg h-12 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="recipient-email">Recipient Email (Optional)</Label>
                          <Input
                            id="recipient-email"
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="recipient@example.com"
                            className="h-12 transition-all duration-300 focus:scale-105"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Personal Message (Optional)</Label>
                          <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Write a personal message..."
                            rows={3}
                            className="transition-all duration-300 focus:scale-105"
                          />
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-6 rounded-xl border border-purple-200 dark:border-purple-700 animate-pulse-slow">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">Total Amount:</span>
                          <span className="text-3xl font-bold text-purple-800 dark:text-purple-200">${parseFloat(purchaseAmount || '0').toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          ≈ {(parseFloat(purchaseAmount || '0') * 3.67).toFixed(2)} AED
                        </p>
                      </div>

                      <Button
                        onClick={() => setShowZiinaPayment(true)}
                        disabled={!user || parseFloat(purchaseAmount) < 10}
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-bounce-in"
                      >
                        <Smartphone className="h-5 w-5 mr-2" />
                        Pay with Ziina
                      </Button>
                    </>
                  ) : (
                    <ZiinaPayment
                      amount={parseFloat(purchaseAmount)}
                      onSuccess={handleZiinaSuccess}
                      onError={(error) => {
                        toast({
                          title: "Payment Error",
                          description: error,
                          variant: "destructive"
                        });
                        setShowZiinaPayment(false);
                      }}
                    />
                  )}

                  {!user && (
                    <div className="text-center p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg border border-yellow-300 dark:border-yellow-700 animate-shake">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        Please sign in to purchase gift cards
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Gift Card Features */}
              <div className="space-y-8 animate-slide-in-right">
                <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-700 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                      <Star className="h-5 w-5 animate-spin-slow" />
                      Why Choose Our Gift Cards?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Check, text: "Valid for 1 year from purchase", delay: "0ms" },
                      { icon: Gift, text: "Perfect for any occasion", delay: "100ms" },
                      { icon: Heart, text: "Personal message included", delay: "200ms" },
                      { icon: Sparkles, text: "Instant digital delivery", delay: "300ms" }
                    ].map((feature, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm animate-fade-in"
                        style={{animationDelay: feature.delay}}
                      >
                        <feature.icon className="h-5 w-5 text-purple-600 animate-pulse" />
                        <span className="text-gray-700 dark:text-gray-300">{feature.text}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Your Gift Cards */}
                {user && giftCards.length > 0 && (
                  <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200 dark:border-green-700 shadow-xl animate-scale-in">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Gift className="h-5 w-5 animate-bounce" />
                        Your Gift Cards
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {giftCards.slice(0, 3).map((card: any, index) => (
                          <div 
                            key={card.id} 
                            className="flex items-center justify-between p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg backdrop-blur-sm animate-slide-in-up"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-gray-200">{card.code}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Created: {new Date(card.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-green-600">${card.amount}</p>
                              <Badge variant={card.is_active ? "default" : "secondary"} className="animate-pulse">
                                {card.is_active ? "Active" : "Used"}
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
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default GiftCards;
