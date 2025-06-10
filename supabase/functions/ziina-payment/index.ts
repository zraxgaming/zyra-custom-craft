
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ZiinaPaymentRequest {
  amount: number;
  currency_code: string;
  message: string;
  success_url: string;
  cancel_url: string;
  failure_url: string;
  customer_phone?: string;
  order_id: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      amount,
      currency_code,
      message,
      success_url,
      cancel_url,
      failure_url,
      customer_phone,
      order_id
    }: ZiinaPaymentRequest = await req.json();

    // Get Ziina API key from environment
    const ziinaApiKey = Deno.env.get("ZIINA_API_KEY");
    
    if (!ziinaApiKey) {
      console.error("Ziina API key not configured");
      return new Response(
        JSON.stringify({ 
          error: "Payment gateway not configured. Please contact support." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Create Ziina payment intent
    const ziinaPayload = {
      amount: amount, // Amount in fils (already converted)
      currency_code: currency_code,
      message: message,
      success_url: success_url,
      cancel_url: cancel_url,
      failure_url: failure_url,
      test: true, // Set to false for production
      transaction_source: "directApi",
      allow_tips: false,
      customer_phone: customer_phone || null
    };

    console.log("Creating Ziina payment intent:", {
      amount: ziinaPayload.amount,
      currency: ziinaPayload.currency_code,
      message: ziinaPayload.message
    });

    const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer m4+Pg5S4Qu+L4naXkkfCElwkJUr9ykZeafvKPfkDJQOSGnAs/4d7DDeBml9Dwlls`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ziinaPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ziina API error:", response.status, errorText);
      
      let errorMessage = "Payment processing failed";
      if (response.status === 401) {
        errorMessage = "Payment gateway authentication failed";
      } else if (response.status === 400) {
        errorMessage = "Invalid payment details";
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { 
          status: response.status, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const ziinaData = await response.json();
    console.log("Ziina response:", ziinaData);

    if (ziinaData.payment_url || ziinaData.checkout_url) {
      return new Response(
        JSON.stringify({
          payment_url: ziinaData.payment_url || ziinaData.checkout_url,
          payment_id: ziinaData.id || ziinaData.payment_intent_id,
          order_id: order_id
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      console.error("No payment URL in Ziina response:", ziinaData);
      return new Response(
        JSON.stringify({ error: "Failed to create payment link" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in ziina-payment function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
