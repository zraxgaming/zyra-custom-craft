
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend("re_5y517rZC_9KDTPreTXvjjbwwnrVqQ3txF");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterBatchRequest {
  emails: string[];
  subject: string;
  content: string;
  unsubscribeLink?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emails, subject, content, unsubscribeLink }: NewsletterBatchRequest = await req.json();

    // Create batch emails
    const batchEmails = emails.map(email => ({
      from: "Zyra Custom Craft <onboarding@resend.dev>",
      to: [email],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zyra Custom Craft</h1>
            <p style="margin: 5px 0 0; opacity: 0.9;">Premium Custom Products</p>
          </div>
          <div style="padding: 30px; background: #ffffff;">
            ${content}
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
              Thank you for being part of the Zyra family!
            </p>
            ${unsubscribeLink ? `
              <p style="margin: 0; color: #999; font-size: 12px;">
                <a href="${unsubscribeLink}" style="color: #999; text-decoration: underline;">
                  Unsubscribe from newsletter
                </a>
              </p>
            ` : ''}
          </div>
        </div>
      `,
    }));

    // Send batch emails
    const emailResponse = await resend.batch.send(batchEmails);

    console.log("Newsletter batch sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending newsletter batch:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
