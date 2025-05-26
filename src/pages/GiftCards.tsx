
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gift, Smartphone, CreditCard } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";
import PayPalPayment from "@/components/checkout/PayPalPayment";
import { useToast } from "@/hooks/use-toast";

const GiftCards = () => {
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ziina");
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const predefinedAmounts = [25, 50, 100, 250, 500];

  const generateGiftCardCode = () => {
    return 'GC' + Math.random().toString(36).substr(2, 12).toUpperCase();
  };

  const handleContinueToPay = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to purchase gift cards",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid gift card amount",
        variant: "destructive"
      });
      return;
    }

    if (!recipientEmail) {
      toast({
        title: "Recipient email required",
        description: "Please enter the recipient's email address",
        variant: "destructive"
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    const code = generateGiftCardCode();
    const giftCardAmount = parseFloat(amount);
    
    console.log(`Gift card created with ${paymentMethod} payment:`, {
      code,
      amount: giftCardAmount,
      recipient: recipientEmail,
      method: paymentMethod,
      transactionId
    });

    toast({
      title: "Gift Card Created!",
      description: `Gift card code: ${code} has been sent to ${recipientEmail}`,
    });

    // Reset form
    setAmount("");
    setRecipientEmail("");
    setMessage("");
    setPaymentMethod("ziina");
    setShowPayment(false);
  };

  const handlePaymentError = (error: string) => {
    console.error("Gift card payment failed:", error);
    setShowPayment(false);
  };

  if (showPayment) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Complete Gift Card Purchase
                </CardTitle>
                <Button 
                  variant="outline" 
                  onClick={() => setShowPayment(false)}
                  className="w-fit"
                >
                  ← Back to Details
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p><strong>Amount:</strong> ${amount}</p>
                    <p><strong>Recipient:</strong> {recipientEmail}</p>
                    {message && <p><strong>Message:</strong> {message}</p>}
                  </div>
                </div>
                
                {paymentMethod === 'ziina' ? (
                  <ZiinaPayment
                    amount={parseFloat(amount)}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                ) : (
                  <PayPalPayment
                    amount={parseFloat(amount)}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                )}
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
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Gift className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Gift Cards</h1>
            <p className="text-muted-foreground">
              Give the gift of choice with Zyra gift cards
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Purchase Gift Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <div className="flex gap-2 mb-2">
                  {predefinedAmounts.map((preset) => (
                    <Button
                      key={preset}
                      variant={amount === preset.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAmount(preset.toString())}
                    >
                      ${preset}
                    </Button>
                  ))}
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="recipientEmail">Recipient Email *</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="recipient@example.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Add a personal message for the recipient..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label>Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="ziina" id="ziina-gift" />
                    <Label htmlFor="ziina-gift" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-4 w-4 text-blue-600" />
                      <span>Ziina - Secure digital payment (Default)</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal-gift" />
                    <Label htmlFor="paypal-gift" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span>PayPal - Secure online payment</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handleContinueToPay}
                disabled={!amount || !recipientEmail}
                className="w-full"
                size="lg"
              >
                Continue to Payment - ${amount || "0"}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 bg-muted/30 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Choose an amount or enter a custom value</li>
              <li>• Enter the recipient's email address</li>
              <li>• Select your preferred payment method (Ziina or PayPal)</li>
              <li>• Add a personal message (optional)</li>
              <li>• Complete payment and the gift card will be sent via email</li>
              <li>• Gift cards never expire and can be used for any purchase</li>
            </ul>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default GiftCards;
