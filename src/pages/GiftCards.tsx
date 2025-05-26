
import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gift, CreditCard, Wallet, Smartphone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { executeSql } from "@/lib/sql-helper";

const GiftCards = () => {
  const [amount, setAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ziina");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const predefinedAmounts = [25, 50, 100, 250, 500];

  const generateGiftCardCode = () => {
    return 'GC' + Math.random().toString(36).substr(2, 12).toUpperCase();
  };

  const handlePurchase = async () => {
    if (!user) {
      console.log('Login required for gift card purchase');
      toast({
        title: "Login required",
        description: "Please login to purchase gift cards",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      console.log('Invalid gift card amount');
      toast({
        title: "Invalid amount",
        description: "Please enter a valid gift card amount",
        variant: "destructive"
      });
      return;
    }

    if (!recipientEmail) {
      console.log('Recipient email required');
      toast({
        title: "Recipient email required",
        description: "Please enter the recipient's email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const code = generateGiftCardCode();
      const giftCardAmount = parseFloat(amount);
      
      await executeSql(`
        INSERT INTO gift_cards (code, amount, initial_amount, created_by, recipient_email, message)
        VALUES ('${code}', ${giftCardAmount}, ${giftCardAmount}, '${user.id}', '${recipientEmail}', '${message}')
      `);

      console.log(`Gift card created with ${paymentMethod} payment:`, code);
      toast({
        title: "Gift card created!",
        description: `Gift card ${code} has been created and will be sent to ${recipientEmail}`,
      });

      // Reset form
      setAmount("");
      setRecipientEmail("");
      setMessage("");
      setPaymentMethod("ziina");
    } catch (error: any) {
      console.error("Error creating gift card:", error);
      toast({
        title: "Error creating gift card",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Gift className="h-16 w-16 text-zyra-purple mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Gift Cards</h1>
            <p className="text-gray-600">
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
                      <span>Ziina - Secure digital payment</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="paypal" id="paypal-gift" />
                    <Label htmlFor="paypal-gift" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="h-4 w-4 text-blue-600" />
                      <span>PayPal - Secure online payment</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handlePurchase}
                disabled={isLoading || !amount || !recipientEmail}
                className="w-full"
                size="lg"
              >
                {isLoading ? "Creating Gift Card..." : `Purchase Gift Card - $${amount || "0"}`}
              </Button>
            </CardContent>
          </Card>

          <div className="mt-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Choose an amount or enter a custom value</li>
              <li>• Enter the recipient's email address</li>
              <li>• Select your preferred payment method</li>
              <li>• Add a personal message (optional)</li>
              <li>• The gift card will be sent via email</li>
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
