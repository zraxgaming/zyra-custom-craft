
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { to, subject, content, type = 'newsletter' } = await req.json()
    
    console.log('Sending email via Brevo:', { to, subject, type })

    // Get Brevo API key from site_config
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'brevo_api_key')
      .single()

    if (configError || !configData?.value) {
      throw new Error('Brevo API key not configured in site settings')
    }

    const brevoApiKey = configData.value

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
