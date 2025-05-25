
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
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
    const { amount, success_url, cancel_url, test = true } = await req.json()

    // Get Ziina API key from Supabase secrets
    const ziinaApiKey = Deno.env.get('ZIINA_API_KEY')
    if (!ziinaApiKey) {
      throw new Error('Ziina API key not configured')
    }

    // Create payment intent with Ziina
    const ziinaResponse = await fetch('https://api.ziina.com/v1/payment_intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ziinaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        success_url,
        cancel_url,
        test
      })
    })

    if (!ziinaResponse.ok) {
      const errorData = await ziinaResponse.text()
      throw new Error(`Ziina API error: ${errorData}`)
    }

    const paymentData = await ziinaResponse.json()

    return new Response(JSON.stringify(paymentData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Ziina payment error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
