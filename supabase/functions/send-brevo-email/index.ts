
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Hello from send-brevo-email!')

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, subject, content, type = 'newsletter' } = await req.json()
    
    console.log('Sending email via Brevo:', { to, subject, type })

    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    // Prepare recipient list
    let recipients = []
    if (Array.isArray(to)) {
      recipients = to.map(email => ({ email }))
    } else {
      recipients = [{ email: to }]
    }

    const emailData = {
      sender: {
        name: "Zyra Store",
        email: "noreply@zyra.store"
      },
      to: recipients,
      subject: subject,
      htmlContent: content
    }

    console.log('Sending to Brevo API:', emailData)

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    const result = await response.json()
    console.log('Brevo API response:', result)

    if (!response.ok) {
      throw new Error(`Brevo API error: ${result.message || 'Unknown error'}`)
    }

    return new Response(
      JSON.stringify({ success: true, messageId: result.messageId }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in send-brevo-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
