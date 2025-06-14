
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Specific origins are better for production
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ZiinaPaymentRequest {
  amount: number; // Amount in fils
  currency_code: string; // e.g., "AED"
  message: string; // Description for the payment
  success_url: string;
  cancel_url: string;
  failure_url: string;
  customer_phone?: string; // Optional
  order_id: string; // Your internal order ID
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
      customer_phone, // Ensure this is handled if passed
      order_id 
    }: ZiinaPaymentRequest = await req.json();

    const ziinaApiKey = Deno.env.get("ZIINA_API_KEY");
    
    if (!ziinaApiKey) {
      console.error("ZIINA_API_KEY environment variable not configured.");
      return new Response(
        JSON.stringify({ 
          error: "Payment gateway critical error: API Key not configured. Please contact support." 
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const ziinaPayload = {
      amount: amount, // Expecting amount in fils
      currency_code: currency_code,
      message: message,
      success_url: success_url,
      cancel_url: cancel_url,
      failure_url: failure_url,
      test: true, // Set to false for production after testing
      transaction_source: "directApi",
      allow_tips: false,
      customer_phone: customer_phone || undefined, // Pass if provided
      // metadata: { order_id: order_id } // Ziina might support metadata
    };

    console.log("Creating Ziina payment intent for order:", order_id, "Payload:", {
      amount: ziinaPayload.amount,
      currency: ziinaPayload.currency_code,
      message: ziinaPayload.message,
    });

    const response = await fetch("https://api-v2.ziina.com/api/payment_intent", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ziinaApiKey}`, // Use API key from env
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ziinaPayload)
    });

    const responseBodyText = await response.text(); // Read body once
    console.log("Ziina API Response Status:", response.status);
    console.log("Ziina API Response Body:", responseBodyText);


    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseBodyText);
      } catch (e) {
        errorData = { message: "Unknown error from Ziina API", details: responseBodyText };
      }
      console.error("Ziina API error:", response.status, errorData);
      
      let errorMessage = errorData.message || "Payment processing failed with Ziina";
      if (response.status === 401) {
        errorMessage = "Payment gateway authentication failed. Check API Key.";
      } else if (response.status === 400) {
        errorMessage = `Invalid payment details: ${errorData.details || JSON.stringify(errorData.errors) || ''}`;
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage, details: errorData }),
        { 
          status: response.status, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const ziinaData = JSON.parse(responseBodyText);

    if (ziinaData.payment_url || ziinaData.redirect_url || ziinaData.checkout_url) {
      return new Response(
        JSON.stringify({
          payment_url: ziinaData.payment_url || ziinaData.redirect_url || ziinaData.checkout_url,
          payment_id: ziinaData.id || ziinaData.payment_intent_id, // Ziina uses 'id' for payment intent
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
        JSON.stringify({ error: "Failed to create payment link with Ziina.", details: ziinaData }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error in ziina-payment function:", error.message, error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal server error processing payment." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

