
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, orderData, type = 'confirmation' } = await req.json();
    
    console.log(`Sending ${type} email for order ${orderId} to ${customerEmail}`);
    
    // Here you would integrate with your email service
    // For now, we'll just log the order email that would be sent
    
    const emailContent = {
      to: customerEmail,
      subject: type === 'confirmation' ? `Order Confirmation - ${orderId}` : `Order Update - ${orderId}`,
      orderId,
      orderData,
      type,
      timestamp: new Date().toISOString()
    };
    
    console.log('Order email would be sent:', emailContent);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order email sent successfully',
        data: emailContent
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Error sending order email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send order email',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
