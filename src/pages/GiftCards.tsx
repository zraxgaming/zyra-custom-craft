
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Gift, Sparkles, Heart, Star, CheckCircle, Clock, Mail } from "lucide-react";
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
        <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
          <div className="container mx-auto px-4 max-w-md">
            <Button 
              variant="outline" 
              onClick={() => setShowPayment(false)}
              className="mb-6 animate-slide-in-left hover:scale-105 hover:-translate-x-1 transition-all duration-300 hover:shadow-lg"
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
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12">
        <div className="container mx-auto px-4">
          {/* Enhanced Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full mb-6 animate-float hover:animate-bounce transition-all duration-300">
              <Gift className="h-12 w-12 text-primary animate-pulse hover:animate-spin transition-all duration-500" />
            </div>
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-shift bg-300% hover:animate-pulse-glow transition-all duration-500">
              Perfect Gift Cards
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-in-up leading-relaxed">
              Give the perfect gift with our digital gift cards. Instant delivery, never expires, and always appreciated!
            </p>
            
            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full animate-scale-in hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4 text-green-500 animate-pulse" />
                <span className="text-sm font-medium">Instant Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-full animate-scale-in hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.1s'}}>
                <Clock className="h-4 w-4 text-purple-500 animate-pulse" />
                <span className="text-sm font-medium">Never Expires</span>
              </div>
              <div className="flex items-center gap-2 bg-pink-500/10 px-4 py-2 rounded-full animate-scale-in hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                <Mail className="h-4 w-4 text-pink-500 animate-pulse" />
                <span className="text-sm font-medium">Email Delivery</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Enhanced Gift Card Preview */}
            <div className="space-y-8">
              <Card className="overflow-hidden animate-scale-in hover:shadow-2xl hover:scale-105 transition-all duration-700 hover:rotate-1 group">
                <div className="relative h-80 bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-8 flex flex-col justify-between animate-gradient-shift bg-400%">
                  {/* Animated background patterns */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 left-4 w-8 h-8 bg-white/30 rounded-full animate-float"></div>
                    <div className="absolute top-12 right-8 w-6 h-6 bg-white/20 rounded-full animate-float-reverse"></div>
                    <div className="absolute bottom-8 left-12 w-4 h-4 bg-white/40 rounded-full animate-bounce-subtle"></div>
                    <div className="absolute bottom-4 right-4 w-10 h-10 bg-white/10 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 text-white/90 mb-4">
                      <Sparkles className="h-6 w-6 animate-pulse" />
                      <span className="font-semibold text-lg">Digital Gift Card</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      Powered by Zyra Store
                    </div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className="text-5xl font-bold text-white mb-3 animate-pulse-glow hover:scale-110 transition-transform duration-300">
                      ${getCurrentAmount().toFixed(2)}
                    </div>
                    <div className="text-white/90 text-base font-medium">
                      From: {senderName || "Your Name"}
                    </div>
                    <div className="text-white/80 text-sm">
                      To: {recipientEmail || "recipient@email.com"}
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 animate-bounce hover:animate-spin transition-all duration-500">
                    <Heart className="h-8 w-8 text-white/60" />
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12"></div>
                </div>
                
                <CardContent className="p-8 bg-gradient-to-r from-background/80 to-muted/30 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-3 font-medium">Personal Message:</p>
                    <div className="min-h-[4rem] flex items-center justify-center p-4 bg-muted/30 rounded-lg border-dashed border-2 border-muted-foreground/20">
                      <p className="italic text-foreground text-center leading-relaxed">
                        "{message || "Hope you find something you absolutely love! Enjoy shopping and treat yourself to something special."}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced feature grid */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent animate-slide-in-left hover:scale-110 hover:-rotate-1 transition-all duration-300 hover:shadow-lg group">
                  <Star className="h-10 w-10 text-primary mx-auto mb-3 animate-pulse group-hover:animate-spin transition-all duration-500" />
                  <p className="text-sm font-semibold">Instant Delivery</p>
                  <p className="text-xs text-muted-foreground mt-1">Sent immediately</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent animate-scale-in hover:scale-110 hover:rotate-1 transition-all duration-300 hover:shadow-lg group" style={{animationDelay: '0.1s'}}>
                  <Gift className="h-10 w-10 text-purple-500 mx-auto mb-3 animate-bounce group-hover:animate-pulse transition-all duration-500" />
                  <p className="text-sm font-semibold">Never Expires</p>
                  <p className="text-xs text-muted-foreground mt-1">No time limit</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-500/10 via-pink-500/5 to-transparent animate-slide-in-right hover:scale-110 hover:-rotate-1 transition-all duration-300 hover:shadow-lg group" style={{animationDelay: '0.2s'}}>
                  <Heart className="h-10 w-10 text-pink-500 mx-auto mb-3 animate-wiggle group-hover:animate-bounce transition-all duration-500" />
                  <p className="text-sm font-semibold">Perfect Gift</p>
                  <p className="text-xs text-muted-foreground mt-1">Always appreciated</p>
                </div>
              </div>
            </div>

            {/* Enhanced Purchase Form */}
            <Card className="animate-slide-in-right hover:shadow-2xl transition-all duration-700 border-2 border-muted/50 hover:border-primary/30 bg-gradient-to-br from-background via-background/95 to-muted/10">
              <CardHeader className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 border-b border-muted/20">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Gift className="h-6 w-6 text-primary animate-pulse" />
                  Purchase Gift Card
                  <Sparkles className="h-5 w-5 text-purple-500 animate-bounce" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                {/* Enhanced Amount Selection */}
                <div className="space-y-6">
                  <Label className="text-lg font-semibold flex items-center gap-2">
                    Select Amount
                    <Star className="h-4 w-4 text-yellow-500 animate-pulse" />
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {predefinedAmounts.map((amount, index) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount)}
                        className={`h-14 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                          selectedAmount === amount 
                            ? 'animate-pulse-glow bg-gradient-to-r from-primary to-purple-500' 
                            : 'hover:animate-bounce-subtle hover:border-primary/50'
                        }`}
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="customAmount" className="text-base font-medium">Or enter custom amount</Label>
                    <Input
                      id="customAmount"
                      type="number"
                      placeholder="Enter amount (minimum $10)"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      min="10"
                      className="h-12 text-lg transition-all duration-300 focus:scale-105 focus:shadow-lg border-2 hover:border-primary/30"
                    />
                  </div>
                </div>

                {/* Enhanced Recipient Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Recipient Details
                    <Heart className="h-5 w-5 text-pink-500 animate-pulse" />
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recipientEmail" className="text-base font-medium">Recipient Email *</Label>
                      <Input
                        id="recipientEmail"
                        type="email"
                        placeholder="recipient@example.com"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        required
                        className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg border-2 hover:border-primary/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="senderName" className="text-base font-medium">Your Name *</Label>
                      <Input
                        id="senderName"
                        placeholder="Your full name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                        className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg border-2 hover:border-primary/30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message" className="text-base font-medium">Personal Message (Optional)</Label>
                      <Input
                        id="message"
                        placeholder="Hope you find something you love!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="h-12 transition-all duration-300 focus:scale-105 focus:shadow-lg border-2 hover:border-primary/30"
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handlePurchase}
                  className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/80 hover:via-purple-500/80 hover:to-pink-500/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-gradient-shift bg-300% hover:animate-pulse-glow"
                  size="lg"
                >
                  <Gift className="h-6 w-6 mr-3 animate-bounce" />
                  Purchase Gift Card - ${getCurrentAmount().toFixed(2)}
                  <Sparkles className="h-5 w-5 ml-3 animate-pulse" />
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
