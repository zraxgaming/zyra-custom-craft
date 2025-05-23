
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone } from "lucide-react";

const PaymentMethodsSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                PayPal Payments
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable PayPal as a payment option
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Zina Digital Payments
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable Zina as a payment option
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="pt-4 border-t">
            <Button>Save Payment Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Gateway Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Payment gateway API keys and configurations can be managed in the Supabase dashboard under Edge Functions secrets.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentMethodsSettings;
