
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from send-order-email!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    const { order_id, customer_email, status, customer_name } = await req.json();
    
    if (!order_id || !customer_email) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Sending order email for order ${order_id} to ${customer_email}`);
    
    // Here you would typically integrate with an email service like SendGrid
    // For now, we'll just log the email that would be sent
    
    const emailContent = {
      to: customer_email,
      subject: `Your order ${status === "pending" ? "confirmation" : "update"}`,
      body: `
        Hello ${customer_name || "Customer"},
        
        ${status === "pending" 
          ? "Thank you for your order! We're processing it now." 
          : `Your order status has been updated to: ${status}`}
        
        Order ID: ${order_id}
        
        You can view your order details in your account.
        
        Thank you for shopping with us!
        
        Zyra Store Team
      `
    };
    
    console.log("Email would be sent with content:", emailContent);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email notification processed",
        data: {
          order_id,
          customer_email,
          status
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error sending order email:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to process email notification",
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
