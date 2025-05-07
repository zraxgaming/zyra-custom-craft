
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  order_id: string;
  customer_email: string;
  status: string;
  customer_name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, customer_email, status, customer_name }: OrderEmailRequest = await req.json();

    // Get a nice status message for the email
    const statusMessage = getStatusMessage(status);
    
    // In a production environment, this would use Resend or another email service
    // For now we're simulating the email sending
    console.log(`Sending order status email to ${customer_email}`);
    console.log(`Order ID: ${order_id}`);
    console.log(`Status: ${status}`);
    console.log(`Customer: ${customer_name || 'Customer'}`);
    
    // Here's what the email content would look like
    const emailContent = `
      <h1>Order Status Update</h1>
      <p>Dear ${customer_name || 'Customer'},</p>
      <p>Your order #${order_id.substring(0, 8)} has been ${statusMessage.action}.</p>
      <p>${statusMessage.description}</p>
      <p>Thank you for shopping with us!</p>
    `;
    
    console.log("Email content:", emailContent);
    
    // Mock email sending response
    const emailResponse = {
      id: `email_${crypto.randomUUID()}`,
      to: customer_email,
      status: "sent",
      message: `Order status update email sent successfully for order ${order_id}`
    };

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-order-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function getStatusMessage(status: string): { action: string, description: string } {
  switch (status) {
    case "pending":
      return { 
        action: "received", 
        description: "We've received your order and are processing it. You'll receive another update when your order is confirmed." 
      };
    case "processing":
      return { 
        action: "confirmed", 
        description: "We're preparing your items for shipping. You'll receive another update when your order is on its way." 
      };
    case "shipped":
      return { 
        action: "shipped", 
        description: "Your order is on its way to you! You can track your delivery status in your account dashboard." 
      };
    case "delivered":
      return { 
        action: "delivered", 
        description: "Your order has been delivered. We hope you enjoy your purchase! If there are any issues, please contact our customer support." 
      };
    case "cancelled":
      return { 
        action: "cancelled", 
        description: "Your order has been cancelled as requested. If you didn't request this cancellation, please contact our customer support immediately." 
      };
    default:
      return { 
        action: "updated", 
        description: "There's been an update to your order. Please check your account dashboard for more details." 
      };
  }
}

serve(handler);
