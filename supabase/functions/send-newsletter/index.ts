
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
    const { recipients, subject, content } = await req.json()

    // Use SendGrid API with the provided API key
    const sendgridApiKey = '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'
    
    const emailPayload = {
      personalizations: recipients.map((email: string) => ({
        to: [{ email }]
      })),
      from: { email: 'newsletter@zyra.com', name: 'Zyra Store' },
      subject: subject,
      content: [{
        type: 'text/html',
        value: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 15px 15px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Zyra Store Newsletter</h1>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e0e0e0;">
              ${content}
            </div>
            <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e0e0e0; border-radius: 0 0 15px 15px;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                You received this email because you subscribed to our newsletter.<br>
                <a href="#" style="color: #667eea;">Unsubscribe</a> | <a href="#" style="color: #667eea;">Update Preferences</a>
              </p>
            </div>
          </div>
        `
      }]
    }

    console.log('Sending newsletter to recipients:', recipients.length)

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

    console.log('Newsletter sent successfully to', recipients.length, 'recipients')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Newsletter sent successfully to ${recipients.length} recipients` 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error sending newsletter:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to send newsletter'
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
