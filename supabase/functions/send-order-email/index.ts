
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend("re_5y517rZC_9KDTPreTXvjjbwwnrVqQ3txF");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  customerName: string;
  customerEmail: string;
  orderId: string;
  status: string;
  totalAmount?: number;
  items?: any[];
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, orderId, status, totalAmount, items }: OrderEmailRequest = await req.json();

    const itemsList = items?.map(item => `${item.name} (Qty: ${item.quantity})`).join(', ') || '';

    const emailResponse = await resend.emails.send({
      from: "Zyra Custom Craft <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Order ${status} - #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Order ${status}</h1>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Hello ${customerName}!</h2>
            <p>Your order #${orderId} status has been updated to: <strong>${status}</strong></p>
            ${totalAmount ? `<p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>` : ''}
            ${itemsList ? `<p><strong>Items:</strong> ${itemsList}</p>` : ''}
            <p>Thank you for shopping with Zyra Custom Craft!</p>
          </div>
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `,
    });

    console.log("Order email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
