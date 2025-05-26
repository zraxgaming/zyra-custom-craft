
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
    const { amount, success_url, cancel_url, test = true } = await req.json()

    // For demo purposes, we'll create a mock Ziina payment URL
    // In production, you would integrate with the actual Ziina API
    const paymentData = {
      url: test 
        ? `${success_url}?payment=ziina&status=success&amount=${amount}`
        : `https://api.ziina.com/payment/create`, // Replace with actual Ziina API
      payment_id: `ziina_${Date.now()}`,
      amount,
      currency: 'AED',
      status: 'pending'
    }

    console.log('Ziina payment created:', paymentData)

    return new Response(
      JSON.stringify(paymentData),
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
      JSON.stringify({ error: error.message }),
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
