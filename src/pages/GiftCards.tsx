
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Gift, CreditCard, Check } from "lucide-react";

const GiftCards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [giftCards, setGiftCards] = useState([]);
  const [purchaseAmount, setPurchaseAmount] = useState('50');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

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

      // Generate unique gift card code
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
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gift card purchased successfully!",
      });

      // Reset form
      setPurchaseAmount('50');
      setRecipientEmail('');
      setMessage('');
      
      // Refresh gift cards
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <Container className="py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-6">
              <Gift className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Gift Cards</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Give the perfect gift with our digital gift cards. Perfect for any occasion!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Purchase Gift Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Purchase Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePurchaseGiftCard} className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <select
                      id="amount"
                      value={purchaseAmount}
                      onChange={(e) => setPurchaseAmount(e.target.value)}
                      className="w-full p-3 border rounded-md bg-background"
                    >
                      <option value="25">$25</option>
                      <option value="50">$50</option>
                      <option value="100">$100</option>
                      <option value="150">$150</option>
                      <option value="200">$200</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="recipient_email">Recipient Email (Optional)</Label>
                    <Input
                      id="recipient_email"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Input
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Happy Birthday!"
                      maxLength={200}
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span>Gift Card Amount:</span>
                      <span className="font-bold">${purchaseAmount}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span>Processing Fee:</span>
                      <span>$0.00</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${purchaseAmount}</span>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || !user} 
                    className="w-full"
                  >
                    {loading ? 'Processing...' : 'Purchase Gift Card'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* My Gift Cards */}
            <Card>
              <CardHeader>
                <CardTitle>My Gift Cards</CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Please log in to view your gift cards
                    </p>
                    <Button onClick={() => window.location.href = '/auth'}>
                      Log In
                    </Button>
                  </div>
                ) : giftCards.length === 0 ? (
                  <div className="text-center py-8">
                    <Gift className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Gift Cards</h3>
                    <p className="text-muted-foreground">
                      You haven't purchased any gift cards yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {giftCards.map((card: any) => (
                      <div key={card.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-mono text-lg font-bold">{card.code}</p>
                            <p className="text-sm text-muted-foreground">
                              Created: {new Date(card.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">${card.amount}</p>
                            <div className="flex items-center gap-1 text-sm">
                              <Check className="h-4 w-4 text-green-500" />
                              <span className={card.is_active ? 'text-green-600' : 'text-red-600'}>
                                {card.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {card.recipient_email && (
                          <p className="text-sm">
                            <span className="font-medium">Recipient:</span> {card.recipient_email}
                          </p>
                        )}

                        {card.message && (
                          <p className="text-sm">
                            <span className="font-medium">Message:</span> {card.message}
                          </p>
                        )}

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(card.code);
                              toast({ title: "Code copied to clipboard!" });
                            }}
                          >
                            Copy Code
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* How to Use */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How to Use Gift Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Gift className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">1. Purchase</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose an amount and purchase your gift card
                  </p>
                </div>
                
                <div>
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">2. Receive Code</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your unique gift card code immediately
                  </p>
                </div>
                
                <div>
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">3. Redeem</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the code at checkout to apply the balance
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      
      <Footer />
    </div>
  );
};

export default GiftCards;
