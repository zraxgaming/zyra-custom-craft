
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Gift, Sparkles, Heart, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";

const GiftCards = () => {
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [senderName, setSenderName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
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
      setSelectedAmount(0);
    }
  };

  const getCurrentAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handlePurchase = () => {
    if (!recipientEmail || !senderName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = getCurrentAmount();
    if (!amount || amount < 10) {
      toast({
        title: "Invalid Amount",
        description: "Gift card amount must be at least $10",
        variant: "destructive"
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    toast({
      title: "Gift Card Purchased!",
      description: `Gift card sent to ${recipientEmail}`,
    });
    
    // Reset form
    setRecipientEmail("");
    setSenderName("");
    setMessage("");
    setSelectedAmount(50);
    setCustomAmount("");
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive"
    });
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background py-12">
          <div className="container mx-auto px-4 max-w-md">
            <Button 
              variant="outline" 
              onClick={() => setShowPayment(false)}
              className="mb-6 animate-slide-in-left hover:scale-105 transition-transform duration-300"
            >
              ← Back to Gift Card Details
            </Button>
            
            <ZiinaPayment
              amount={getCurrentAmount()}
              orderData={{
                type: 'gift_card',
                amount: getCurrentAmount(),
                recipientEmail,
                senderName,
                message,
                email: recipientEmail,
                firstName: senderName.split(' ')[0] || senderName,
                lastName: senderName.split(' ')[1] || ''
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full mb-6 animate-bounce">
              <Gift className="h-10 w-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent animate-gradient-flow">
              Gift Cards
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-up">
              Give the perfect gift with our digital gift cards. Instant delivery and never expires!
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gift Card Preview */}
            <div className="space-y-6">
              <Card className="overflow-hidden animate-scale-in hover:shadow-2xl transition-all duration-700 hover:scale-105">
                <div className="relative h-64 bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-6 flex flex-col justify-between animate-gradient-flow">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-float"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-white/90">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <span className="font-medium">Gift Card</span>
                    </div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="text-4xl font-bold text-white mb-2 animate-pulse-glow">
                      ${getCurrentAmount().toFixed(2)}
                    </div>
                    <div className="text-white/80 text-sm">
                      {senderName || "Your Name"} → {recipientEmail || "recipient@email.com"}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 animate-bounce">
                    <Heart className="h-6 w-6 text-white/60" />
                  </div>
                </div>
                <CardContent className="p-6 bg-gradient-to-r from-background/50 to-muted/30">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Personal Message:</p>
                    <p className="italic text-foreground min-h-[3rem] flex items-center justify-center">
                      "{message || "Hope you find something you love!"}"
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent animate-slide-in-left">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2 animate-pulse" />
                  <p className="text-sm font-medium">Instant Delivery</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-transparent animate-scale-in">
                  <Gift className="h-8 w-8 text-purple-500 mx-auto mb-2 animate-bounce" />
                  <p className="text-sm font-medium">Never Expires</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-transparent animate-slide-in-right">
                  <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2 animate-wiggle" />
                  <p className="text-sm font-medium">Perfect Gift</p>
                </div>
              </div>
            </div>

            {/* Purchase Form */}
            <Card className="animate-slide-in-right hover:shadow-xl transition-all duration-500 border-border/50">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-primary animate-pulse" />
                  Purchase Gift Card
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                {/* Amount Selection */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Select Amount</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className={`transition-all duration-300 hover:scale-105 ${
                          selectedAmount === amount ? 'animate-pulse-glow' : 'hover:animate-bounce-subtle'
                        }`}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div>
                    <Label htmlFor="customAmount">Or enter custom amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      min="10"
                      className="form-field"
                    />
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email *</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="recipient@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      required
                      className="form-field"
                    />
                  </div>
                  <div>
                    <Label htmlFor="senderName">Your Name *</Label>
                    <Input
                      id="senderName"
                      placeholder="Your full name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                      className="form-field"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Personal Message (Optional)</Label>
                    <Input
                      id="message"
                      placeholder="Hope you find something you love!"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="form-field"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  className="w-full primary-button text-lg py-6"
                  size="lg"
                >
                  Purchase Gift Card - ${getCurrentAmount().toFixed(2)}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default GiftCards;
