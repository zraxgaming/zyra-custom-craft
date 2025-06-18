
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Get SendGrid API key from site config
    const { data: configData, error: configError } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'sendgrid_api_key')
      .single();

    if (configError || !configData?.value) {
      throw new Error('SendGrid API key not configured');
    }

    const apiKey = configData.value as string;
    const recipients = Array.isArray(emailData.to) ? emailData.to : [emailData.to];

    const sendGridPayload = {
      personalizations: recipients.map(email => ({
        to: [{ email }],
        subject: emailData.subject
      })),
      from: {
        email: emailData.from || 'noreply@shopzyra.com',
        name: 'Zyra Custom Craft'
      },
      content: [
        {
          type: 'text/html',
          value: emailData.html
        }
      ]
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendGridPayload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`SendGrid API error: ${JSON.stringify(errorData)}`);
    }

    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendBatchEmails(emails: EmailData[]): Promise<boolean> {
  try {
    const results = await Promise.allSettled(
      emails.map(email => sendEmail(email))
    );
    
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value === true
    ).length;
    
    console.log(`Batch email results: ${successCount}/${emails.length} sent successfully`);
    return successCount > 0;
  } catch (error) {
    console.error('Batch email error:', error);
    return false;
  }
}

// Template for order confirmation
export function getOrderConfirmationTemplate(order: any): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #7c3aed; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmation</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Thank you for your order!</h2>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Order Number:</strong> #${order.id.slice(-8)}</p>
          <p style="margin: 5px 0;"><strong>Total Amount:</strong> $${order.total_amount.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${order.payment_method}</p>
        </div>
        
        <p>Your order has been received and is being processed. We'll notify you when your order ships.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://shopzyra.vercel.app/dashboard" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order Details
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 14px; text-align: center;">
          Zyra Custom Craft<br>
          <a href="https://shopzyra.vercel.app" style="color: #7c3aed;">shopzyra.vercel.app</a>
        </p>
      </div>
    </div>
  `;
}

// Template for newsletter
export function getNewsletterTemplate(content: string, subject: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #7c3aed; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px;">${subject}</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        ${content}
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        
        <p style="color: #666; font-size: 12px; text-align: center;">
          You're receiving this email because you subscribed to our newsletter.<br>
          <a href="https://shopzyra.vercel.app/unsubscribe?email={{email}}" style="color: #7c3aed;">Unsubscribe</a> | 
          <a href="https://shopzyra.vercel.app" style="color: #7c3aed;">Visit our website</a>
        </p>
      </div>
    </div>
  `;
}
