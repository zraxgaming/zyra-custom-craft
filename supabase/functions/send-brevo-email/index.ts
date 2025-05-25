
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Hello from send-brevo-email!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    const { to, subject, content, type = "newsletter" } = await req.json();
    
    if (!to || !subject || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: to, subject, content" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!brevoApiKey) {
      return new Response(
        JSON.stringify({ error: "Brevo API key not configured" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    console.log(`Sending ${type} email to:`, to);
    
    // Prepare recipients array
    const recipients = Array.isArray(to) ? to.map(email => ({ email })) : [{ email: to }];
    
    // Send email via Brevo API
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Zyra Store",
          email: "noreply@zyra.store"
        },
        to: recipients,
        subject: subject,
        htmlContent: content,
        textContent: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        tags: [type, "admin-sent"]
      }),
    });
    
    if (!brevoResponse.ok) {
      const errorData = await brevoResponse.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Brevo API error: ${brevoResponse.status} - ${errorData}`);
    }
    
    const result = await brevoResponse.json();
    console.log("Email sent successfully via Brevo:", result);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email sent successfully",
        messageId: result.messageId,
        recipientCount: recipients.length
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
    
  } catch (error) {
    console.error("Error sending email via Brevo:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Failed to send email",
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
