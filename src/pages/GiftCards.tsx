
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, CreditCard, Star, Sparkles, Heart, Calendar } from "lucide-react";

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [ownedCards, setOwnedCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [formData, setFormData] = useState({
    amount: 50,
    recipientEmail: "",
    recipientName: "",
    senderName: user?.user_metadata?.first_name || "",
    message: "Hope you enjoy shopping with us!"
  });

  const giftCardTemplates = [
    { id: 1, name: "Birthday", icon: "🎂", color: "from-pink-500 to-purple-600" },
    { id: 2, name: "Holiday", icon: "🎄", color: "from-green-500 to-red-600" },
    { id: 3, name: "Anniversary", icon: "❤️", color: "from-red-500 to-pink-600" },
    { id: 4, name: "Thank You", icon: "🙏", color: "from-blue-500 to-purple-600" },
    { id: 5, name: "Congratulations", icon: "🎉", color: "from-yellow-500 to-orange-600" },
  ];

  useEffect(() => {
    if (user) {
      fetchOwnedGiftCards();
    }
  }, [user]);

  const fetchOwnedGiftCards = async () => {
    try {
      const { data, error } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOwnedCards(data || []);
    } catch (error) {
      console.error('Error fetching gift cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to purchase gift cards",
        variant: "destructive"
      });
      return;
    }

    if (!formData.recipientEmail || !formData.recipientName) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setPurchasing(true);
    try {
      // Generate gift card code
      const code = `GC${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Create gift card
      const { data: giftCard, error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          amount: formData.amount,
          user_id: user.id,
          recipient_email: formData.recipientEmail,
          recipient_name: formData.recipientName,
          sender_name: formData.senderName,
          message: formData.message,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Send email to recipient via edge function
      await supabase.functions.invoke('send-gift-card-email', {
        body: {
          recipientEmail: formData.recipientEmail,
          recipientName: formData.recipientName,
          senderName: formData.senderName,
          amount: formData.amount,
          code: code,
          message: formData.message
        }
      });

      toast({
        title: "Gift card purchased!",
        description: "The gift card has been sent to the recipient's email",
      });

      // Reset form
      setFormData({
        amount: 50,
        recipientEmail: "",
        recipientName: "",
        senderName: user?.user_metadata?.first_name || "",
        message: "Hope you enjoy shopping with us!"
      });

      fetchOwnedGiftCards();
    } catch (error: any) {
      console.error('Error purchasing gift card:', error);
      toast({
        title: "Purchase failed",
        description: error.message || "Failed to purchase gift card",
        variant: "destructive"
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <Navbar />
      
      <div className="py-12">
        <Container>
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-full mb-8 animate-bounce-in shadow-2xl">
              <Gift className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent mb-6 animate-text-shimmer">
              Gift Cards
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 animate-slide-in-up max-w-2xl mx-auto" style={{animationDelay: '200ms'}}>
              Give the perfect gift with our digital gift cards. Perfect for any occasion!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Purchase Gift Card */}
            <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-2xl animate-slide-in-left">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  Purchase Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount Selection */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Amount</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[25, 50, 100, 200, 500, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant={formData.amount === amount ? "default" : "outline"}
                        onClick={() => setFormData(prev => ({ ...prev, amount }))}
                        className={`p-4 h-auto ${formData.amount === amount 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                          : 'border-purple-200 hover:border-purple-400'
                        } transition-all duration-300 hover:scale-105`}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold">${amount}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="custom-amount">Custom Amount:</Label>
                    <Input
                      id="custom-amount"
                      type="number"
                      min="10"
                      max="5000"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: parseInt(e.target.value) || 10 }))}
                      className="w-32 border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Recipient Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientName">Recipient Name *</Label>
                    <Input
                      id="recipientName"
                      value={formData.recipientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                      placeholder="Enter recipient's name"
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email *</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, recipientEmail: e.target.value }))}
                      placeholder="Enter recipient's email"
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="senderName">Your Name</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                      placeholder="Your name"
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Personal Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Add a personal message..."
                      rows={3}
                      className="border-purple-200 focus:border-purple-500"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  disabled={purchasing || !user}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  size="lg"
                >
                  {purchasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5 mr-2" />
                      Purchase Gift Card - ${formData.amount}
                    </>
                  )}
                </Button>

                {!user && (
                  <p className="text-sm text-center text-muted-foreground">
                    Please sign in to purchase gift cards
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Gift Card Templates & My Cards */}
            <div className="space-y-8">
              {/* Templates */}
              <Card className="bg-gradient-to-br from-white to-pink-50 dark:from-gray-900 dark:to-pink-950 border-pink-200 dark:border-pink-800 shadow-2xl animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl text-pink-700 dark:text-pink-300">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    Gift Card Themes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {giftCardTemplates.map((template, index) => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-xl bg-gradient-to-br ${template.color} text-white text-center transform hover:scale-105 transition-all duration-300 shadow-lg animate-scale-in`}
                        style={{animationDelay: `${index * 100}ms`}}
                      >
                        <div className="text-2xl mb-2">{template.icon}</div>
                        <div className="font-medium">{template.name}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Gift Cards */}
              {user && (
                <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-950 border-purple-200 dark:border-purple-800 shadow-2xl animate-fade-in" style={{animationDelay: '300ms'}}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl text-purple-700 dark:text-purple-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Heart className="h-5 w-5 text-white" />
                      </div>
                      My Gift Cards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      </div>
                    ) : ownedCards.length === 0 ? (
                      <div className="text-center py-8">
                        <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-muted-foreground">No gift cards yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {ownedCards.map((card, index) => (
                          <div
                            key={card.id}
                            className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg border border-purple-200 dark:border-purple-700 animate-slide-in-up"
                            style={{animationDelay: `${index * 100}ms`}}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-mono text-sm">{card.code}</p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                  ${card.amount}
                                </p>
                              </div>
                              <Badge 
                                variant={card.status === 'active' ? 'default' : 'secondary'}
                                className="capitalize"
                              >
                                {card.status}
                              </Badge>
                            </div>
                            
                            <div className="text-sm text-muted-foreground">
                              <p>To: {card.recipient_name}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(card.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Container>
      </div>
      
      <Footer />
    </div>
  );
};

export default GiftCards;
