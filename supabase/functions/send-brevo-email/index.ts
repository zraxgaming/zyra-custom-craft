
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent?: string;
  templateType?: string;
  templateData?: any;
}

const getEmailTemplate = (templateType: string, data: any) => {
  const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.title || 'Zyra'}</title>
  <style>
    body {
      background-color: #f4f4f7;
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0,0,0,0.05);
    }
    .header {
      background: #ffffff;
      padding: 30px;
      text-align: center;
      border-bottom: 1px solid #eeeeee;
    }
    .header img {
      width: 120px;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content h1 {
      font-size: 26px;
      color: #111111;
      margin-bottom: 15px;
    }
    .content p {
      font-size: 16px;
      color: #555555;
      margin-bottom: 25px;
      line-height: 1.5;
    }
    .button {
      display: inline-block;
      padding: 14px 26px;
      background-color: #7e5bef;
      color: #ffffff !important;
      text-decoration: none;
      font-weight: bold;
      font-size: 15px;
      border-radius: 6px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #6541e4;
    }
    .footer {
      background: #fafafa;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 20px;
      }
      .content h1 {
        font-size: 22px;
      }
      .content p {
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://shopzyra.vercel.app/logo.png" alt="Zyra Logo">
    </div>
    <div class="content">
      <h1>${data.heading || 'Welcome to Zyra!'}</h1>
      <p>${data.message || 'Thank you for joining our community.'}</p>
      ${data.buttonUrl ? `<a href="${data.buttonUrl}" class="button">${data.buttonText || 'Get Started'}</a>` : ''}
    </div>
    <div class="footer">
      ${data.footerText || 'Thank you for being a part of Zyra.'}
      <br>&copy; 2025 Zyra Technologies. All rights reserved.
    </div>
  </div>
</body>
</html>`;

  return baseTemplate;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, htmlContent, templateType, templateData }: EmailRequest = await req.json();
    
    const brevoApiKey = Deno.env.get("BREVO_API_KEY");
    
    if (!brevoApiKey) {
      throw new Error("Brevo API key not found in environment variables");
    }

    let finalHtmlContent = htmlContent;
    
    if (templateType && templateData) {
      finalHtmlContent = getEmailTemplate(templateType, templateData);
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "Zyra",
          email: "noreply@zyra.com"
        },
        to: [
          {
            email: to,
            name: to.split("@")[0]
          }
        ],
        subject: subject,
        htmlContent: finalHtmlContent
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", errorData);
      throw new Error(`Brevo API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Email sent successfully via Brevo:", result);

    return new Response(JSON.stringify({ success: true, messageId: result.messageId }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
