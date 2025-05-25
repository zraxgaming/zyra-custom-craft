
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, subject, content, htmlContent } = await req.json()
    
    const brevoApiKey = Deno.env.get('BREVO_API_KEY')
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY is not configured')
    }

    // Get all newsletter subscribers
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: subscribers, error } = await supabase
      .from('newsletter_subscriptions')
      .select('email, name')
      .eq('is_active', true)

    if (error) {
      throw error
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active subscribers found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send email to all subscribers using Brevo
    const emailPromises = subscribers.map(async (subscriber) => {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify({
          sender: {
            name: "Zyra Newsletter",
            email: "newsletter@zyra.com"
          },
          to: [{
            email: subscriber.email,
            name: subscriber.name || subscriber.email
          }],
          subject: subject,
          textContent: content,
          htmlContent: htmlContent || content.replace(/\n/g, '<br>')
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`Failed to send email to ${subscriber.email}:`, errorText)
        throw new Error(`Failed to send email to ${subscriber.email}`)
      }

      return response.json()
    })

    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ 
        message: `Newsletter sent successfully to ${subscribers.length} subscribers` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error sending newsletter:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
