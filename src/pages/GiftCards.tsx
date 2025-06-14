
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
import { Gift, CreditCard, Check, Sparkles, Heart, Star } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('50');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

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

  const handlePurchaseGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to purchase gift cards",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const amount = parseFloat(purchaseAmount);
      if (amount < 10) {
        throw new Error('Minimum gift card amount is $10');
      }

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
      fetchGiftCards();
    } catch (error: any) {
      console.error('Error purchasing gift card:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to purchase gift card",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      
      <div className="py-16">
        <Container>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Gift className="h-12 w-12 text-purple-600 animate-bounce" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Gift Cards
                </h1>
                <Sparkles className="h-12 w-12 text-pink-500 animate-pulse" />
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Give the perfect gift with our beautiful digital gift cards. Perfect for any occasion and any creative soul!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Purchase Gift Card */}
              <Card className="border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-hidden animate-slide-in-left">
                <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white p-8">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <CreditCard className="h-7 w-7 animate-bounce" />
                    Purchase Gift Card
                    <Heart className="h-6 w-6 text-pink-200 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handlePurchaseGiftCard} className="space-y-8">
                    <div>
                      <Label htmlFor="amount" className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-4 block">
                        Select Amount 💰
                      </Label>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {presetAmounts.map(amount => (
                          <Button
                            key={amount}
                            type="button"
                            variant={purchaseAmount === amount.toString() ? "default" : "outline"}
                            onClick={() => setPurchaseAmount(amount.toString())}
                            className={`h-16 text-lg font-bold transition-all duration-300 ${
                              purchaseAmount === amount.toString()
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white transform scale-105 shadow-lg'
                                : 'border-purple-200 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950'
                            }`}
                          >
                            ${amount}
                            {amount === 100 && <Star className="h-4 w-4 ml-2 text-yellow-400" />}
                          </Button>
                        ))}
                      </div>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          value={purchaseAmount}
                          onChange={(e) => setPurchaseAmount(e.target.value)}
                          min="10"
                          step="0.01"
                          placeholder="Custom amount"
                          className="h-14 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-600 font-bold">
                          USD
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Minimum amount: $10</p>
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3 block">
                        Recipient Email (Optional) 📧
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="recipient@example.com"
                        className="h-12 text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-3 block">
                        Personal Message (Optional) 💌
                      </Label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a heartfelt message for your loved one..."
                        rows={4}
                        className="text-lg border-2 border-purple-200 focus:border-purple-500 rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || !purchaseAmount}
                      className="w-full h-16 text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Gift className="h-6 w-6" />
                          Purchase Gift Card ${purchaseAmount}
                          <Sparkles className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Gift Card Preview & Features */}
              <div className="space-y-8">
                {/* Preview Card */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white overflow-hidden animate-scale-in">
                  <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <Gift className="h-8 w-8" />
                          <span className="text-2xl font-bold">Zyra</span>
                        </div>
                        <Sparkles className="h-6 w-6 animate-pulse" />
                      </div>
                      
                      <div className="mb-8">
                        <div className="text-sm opacity-75 mb-2">Gift Card Value</div>
                        <div className="text-4xl font-bold">${purchaseAmount || '50'}</div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm opacity-75 mb-2">Gift Card Code</div>
                        <div className="font-mono text-lg tracking-wider bg-white/20 px-4 py-2 rounded-lg">
                          GC****-****-****
                        </div>
                      </div>
                      
                      <div className="text-sm opacity-75">
                        Valid for 1 year • Digital Delivery
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-right">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-xl text-purple-700 dark:text-purple-300">
                      <Check className="h-6 w-6" />
                      Why Choose Our Gift Cards?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100">Instant Delivery</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">Delivered immediately to email</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-pink-900 dark:text-pink-100">Never Expires</h4>
                        <p className="text-sm text-pink-700 dark:text-pink-300">Valid for 1 full year from purchase</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100">Perfect for Any Occasion</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">Birthdays, holidays, or just because</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Your Gift Cards */}
            {user && giftCards.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold text-center mb-12 text-purple-700 dark:text-purple-300 animate-fade-in">
                  Your Gift Cards
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {giftCards.map((card: any, index) => (
                    <Card key={card.id} className="border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm animate-slide-in-up" style={{animationDelay: `${index * 100}ms`}}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                            {card.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <div className="text-sm text-gray-500">
                            ${card.amount.toFixed(2)}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Code</div>
                            <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded">
                              {card.code}
                            </div>
                          </div>
                          {card.recipient_email && (
                            <div>
                              <div className="text-sm text-gray-500 mb-1">Recipient</div>
                              <div className="text-sm">{card.recipient_email}</div>
                            </div>
                          )}
                          <div>
                            <div className="text-sm text-gray-500 mb-1">Created</div>
                            <div className="text-sm">{new Date(card.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default GiftCards;
