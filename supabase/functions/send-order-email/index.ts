
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

    // In a real implementation, this would use Resend or another email service
    console.log(`Sending email to ${customer_email} for order ${order_id} with status ${status}`);
    
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

serve(handler);
