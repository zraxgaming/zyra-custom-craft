import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, content, type = 'general' } = await req.json();
    
    console.log(`Sending ${type} email to ${to} with subject: ${subject}`);
    
    // SendGrid API integration
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    if (!sendgridApiKey) {
      throw new Error('SendGrid API key not configured');
    }
    const emailPayload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'noreply@zyra.com', name: 'Zyra Store' },
      subject: subject,
      content: [{ type: 'text/html', value: content }]
    };
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendgridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload)
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error('SendGrid error:', errorText);
      throw new Error(`SendGrid API error: ${response.status}`);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        data: { to, subject, content, type }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
