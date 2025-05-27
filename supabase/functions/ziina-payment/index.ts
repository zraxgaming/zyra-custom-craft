
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get Ziina API credentials from site_config
    const { data: configData, error: configError } = await supabaseClient
      .from('site_config')
      .select('*')
      .in('key', ['ziina_api_key', 'ziina_merchant_id', 'ziina_base_url'])

    if (configError) {
      console.error('Error fetching Ziina config:', configError)
      throw new Error('Failed to fetch payment configuration')
    }

    const config = configData.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as any)

    const ziinaApiKey = config.ziina_api_key
    const ziinaMerchantId = config.ziina_merchant_id
    const ziinaBaseUrl = config.ziina_base_url || 'https://api-v2.ziina.com'

    if (!ziinaApiKey) {
      throw new Error('Ziina API key not configured')
    }

    const { amount, success_url, cancel_url, order_data } = await req.json()

    // Create payment with real Ziina API
    const paymentPayload = {
      amount: amount, // Amount should already be in fils
      currency_code: 'AED',
      message: `Order payment for ${order_data?.email || 'customer'}`,
      success_url: success_url,
      cancel_url: cancel_url,
      failure_url: cancel_url,
      test: false,
      transaction_source: 'directApi',
      allow_tips: false,
    }

    console.log('Creating Ziina payment with payload:', paymentPayload)

    const ziinaResponse = await fetch(`${ziinaBaseUrl}/api/payment_intent`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ziinaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentPayload)
    })

    const responseText = await ziinaResponse.text()
    console.log('Ziina response status:', ziinaResponse.status)
    console.log('Ziina response text:', responseText)

    if (!ziinaResponse.ok) {
      throw new Error(`Ziina API error: ${ziinaResponse.status} - ${responseText}`)
    }

    let ziinaData
    try {
      ziinaData = JSON.parse(responseText)
    } catch (parseError) {
      throw new Error('Invalid JSON response from Ziina API')
    }

    console.log('Ziina payment created successfully:', ziinaData)

    return new Response(
      JSON.stringify({
        payment_url: ziinaData.payment_url || ziinaData.checkout_url,
        payment_id: ziinaData.id || ziinaData.payment_intent_id,
        amount: amount,
        currency: 'AED',
        status: 'pending'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Ziina payment error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Please ensure Ziina API credentials are configured in admin settings'
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
