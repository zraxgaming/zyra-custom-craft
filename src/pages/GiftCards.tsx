
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/ui/container";
import { Gift, Heart, Star, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();

  const predefinedAmounts = [25, 50, 100, 200];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(parseFloat(value) || 0);
    }
  };

  const handleProceedToPayment = () => {
    if (!recipientEmail || !recipientName || !senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (selectedAmount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be at least $10",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const orderData = {
    email: recipientEmail,
    recipientName,
    senderName,
    message,
    amount: selectedAmount,
    type: 'gift_card'
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast({
      title: "Gift Card Purchased!",
      description: "The gift card has been sent to the recipient's email",
    });
    // Reset form
    setSelectedAmount(50);
    setCustomAmount("");
    setRecipientEmail("");
    setRecipientName("");
    setMessage("");
    setSenderName("");
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (showPayment) {
    return (
      <>
        <SEOHead 
          title="Gift Cards Payment - Zyra"
          description="Complete your gift card purchase with Ziina payment"
        />
        <Navbar />
        <Container className="py-12">
          <div className="max-w-2xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setShowPayment(false)}
              className="mb-6"
            >
              ← Back to Gift Card Details
            </Button>
            <Card className="border-purple-200 dark:border-purple-800 bg-card">
              <CardHeader>
                <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Complete Your Gift Card Purchase
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ZiinaPayment
                  amount={selectedAmount}
                  orderData={orderData}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </CardContent>
            </Card>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Gift Cards - Zyra"
        description="Give the gift of creativity with Zyra gift cards. Perfect for any occasion."
        url="https://zyra.lovable.app/gift-cards"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <section className="py-20 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-background">
          <Container>
            <div className="text-center mb-16">
              <Gift className="h-16 w-16 text-purple-600 mx-auto mb-6" />
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent">
                Gift Cards
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Give the perfect gift of creativity and customization. Let your loved ones choose exactly what they want.
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-16">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <Card className="border-purple-200 dark:border-purple-800 bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground">Choose Amount</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {predefinedAmounts.map((amount) => (
                        <Button
                          key={amount}
                          variant={selectedAmount === amount && !customAmount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(amount)}
                          className={`h-16 text-lg font-semibold ${
                            selectedAmount === amount && !customAmount
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                          }`}
                        >
                          ${amount}
                        </Button>
                      ))}
                    </div>
                    
                    <div>
                      <Label htmlFor="custom-amount" className="text-foreground">Custom Amount (min $10)</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter custom amount"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="mt-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                        min="10"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-purple-200 dark:border-purple-800 bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Heart className="h-6 w-6 text-pink-500 mr-3" />
                      <h3 className="text-lg font-semibold text-foreground">Why Choose Our Gift Cards?</h3>
                    </div>
                    <ul className="space-y-3 text-muted-foreground">
                      <li className="flex items-center">
                        <Sparkles className="h-4 w-4 text-purple-500 mr-2" />
                        No expiration date
                      </li>
                      <li className="flex items-center">
                        <Star className="h-4 w-4 text-purple-500 mr-2" />
                        Use across all products
                      </li>
                      <li className="flex items-center">
                        <Gift className="h-4 w-4 text-purple-500 mr-2" />
                        Perfect for any occasion
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="border-purple-200 dark:border-purple-800 bg-card">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-foreground">Gift Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="sender-name" className="text-foreground">Your Name *</Label>
                      <Input
                        id="sender-name"
                        placeholder="Your name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="mt-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="recipient-name" className="text-foreground">Recipient Name *</Label>
                      <Input
                        id="recipient-name"
                        placeholder="Recipient's name"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="mt-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="recipient-email" className="text-foreground">Recipient Email *</Label>
                      <Input
                        id="recipient-email"
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="mt-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-foreground">Personal Message (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Write a personal message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="mt-2 border-purple-200 dark:border-purple-800 focus:border-purple-500"
                        rows={4}
                      />
                    </div>

                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-foreground">Total:</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          ${selectedAmount.toFixed(2)}
                        </span>
                      </div>
                      
                      <Button
                        onClick={handleProceedToPayment}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 transition-all duration-300"
                        size="lg"
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </Container>
        
        <Footer />
      </div>
    </>
  );
};

export default GiftCards;
