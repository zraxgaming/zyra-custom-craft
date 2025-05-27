
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerEmail, orderData, type = 'confirmation' } = await req.json();
    
    console.log(`Sending ${type} email for order ${orderId} to ${customerEmail}`);
    
    const subject = type === 'confirmation' 
      ? `Order Confirmation - #${orderId.slice(-8)}` 
      : `Order Update - #${orderId.slice(-8)}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-item { border-bottom: 1px solid #ddd; padding: 15px 0; }
            .total { font-size: 18px; font-weight: bold; color: #667eea; }
            .footer { text-align: center; margin-top: 30px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ${type === 'confirmation' ? 'Order Confirmed!' : 'Order Update'}</h1>
              <p>Thank you for your order #${orderId.slice(-8)}</p>
            </div>
            
            <div class="content">
              <h2>Order Details</h2>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Customer:</strong> ${orderData?.firstName} ${orderData?.lastName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              
              ${orderData?.items ? `
                <h3>Items Ordered:</h3>
                ${orderData.items.map((item: any) => `
                  <div class="order-item">
                    <strong>${item.name}</strong><br>
                    Quantity: ${item.quantity}<br>
                    Price: $${(item.price * item.quantity).toFixed(2)}
                  </div>
                `).join('')}
              ` : ''}
              
              ${orderData?.total ? `
                <div class="total">
                  Total: $${orderData.total.toFixed(2)}
                </div>
              ` : ''}
              
              <div class="footer">
                <p>Thank you for shopping with us!</p>
                <p>If you have any questions, please contact our support team.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Store <onboarding@resend.dev>',
      to: [customerEmail],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('Order email sent successfully:', data);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Order email sent successfully',
        data: data
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
