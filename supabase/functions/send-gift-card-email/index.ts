
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { recipientEmail, recipientName, senderName, amount, code, message } = await req.json()

    // Use SendGrid API with the provided API key
    const sendgridApiKey = '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'
    
    const emailPayload = {
      personalizations: [{
        to: [{ email: recipientEmail, name: recipientName }],
        subject: `You've received a $${amount} gift card from ${senderName}!`
      }],
      from: { email: 'noreply@zyra.com', name: 'Zyra Store' },
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 15px;">
            <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="color: #333; margin-bottom: 20px;">🎁 You've Got a Gift! 🎁</h1>
              <p style="font-size: 18px; color: #555; margin-bottom: 15px;">
                Hello ${recipientName}!
              </p>
              <p style="font-size: 16px; color: #666; margin-bottom: 25px;">
                ${senderName} has sent you a wonderful gift card worth <strong style="color: #667eea; font-size: 24px;">$${amount}</strong>
              </p>
              
              <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 10px; margin: 25px 0;">
                <h2 style="color: white; margin: 0 0 10px 0;">Your Gift Card Code:</h2>
                <div style="background: white; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: bold; color: #333; letter-spacing: 2px;">
                  ${code}
                </div>
              </div>
              
              ${message ? `
              <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 10px 0;">Personal Message:</h3>
                <p style="color: #555; font-style: italic; margin: 0;">"${message}"</p>
              </div>
              ` : ''}
              
              <div style="margin-top: 30px;">
                <a href="https://zyra.com/shop" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                  Start Shopping Now! 🛍️
                </a>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 25px;">
                Use this code at checkout to apply your gift card balance.<br>
                This gift card never expires and can be used multiple times until the balance is zero.
              </p>
            </div>
          </div>
        `
      }]
    }

    console.log('Sending gift card email to:', recipientEmail)

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('SendGrid error:', errorText)
      throw new Error(`SendGrid API error: ${response.status}`)
    }

    console.log('Gift card email sent successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Gift card email sent successfully' }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error sending gift card email:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send gift card email'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
