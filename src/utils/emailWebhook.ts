
export interface EmailData {
  email: string;
  subject: string;
  html_content: string;
  content: string;
}

export const sendEmailViaWebhook = async (emailData: EmailData): Promise<boolean> => {
  try {
    const response = await fetch('https://hook.eu2.make.com/auficfn4ga7i1q23k8k4qow5w18t703h', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending email via webhook:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (
  customerEmail: string,
  orderDetails: any
): Promise<boolean> => {
  const emailData: EmailData = {
    email: customerEmail,
    subject: `Order Confirmation - Order #${orderDetails.id.slice(-8)}`,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Zyra Custom Craft</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Thank you for your order!</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Order Details</h2>
          <p><strong>Order Number:</strong> #${orderDetails.id.slice(-8)}</p>
          <p><strong>Total:</strong> $${orderDetails.total_amount}</p>
          <p><strong>Status:</strong> ${orderDetails.status}</p>
        </div>
        
        <div style="background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px;">
          <h3 style="color: #333; margin-top: 0;">Items Ordered</h3>
          ${orderDetails.items?.map((item: any) => `
            <div style="border-bottom: 1px solid #f3f4f6; padding: 10px 0;">
              <p style="margin: 0; font-weight: bold;">${item.name}</p>
              <p style="margin: 5px 0; color: #666;">Quantity: ${item.quantity} | Price: $${item.price}</p>
              ${item.customization?.text ? `<p style="margin: 5px 0; color: #7c3aed;">Custom Text: ${item.customization.text}</p>` : ''}
            </div>
          `).join('') || ''}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #7c3aed; color: white; border-radius: 8px;">
          <p style="margin: 0; font-size: 16px;">We'll send you tracking information once your order ships!</p>
        </div>
      </div>
    `,
    content: `Thank you for your order! Order #${orderDetails.id.slice(-8)} has been confirmed. Total: $${orderDetails.total_amount}`
  };

  return sendEmailViaWebhook(emailData);
};

export const sendNewsletterEmail = async (
  email: string,
  subject: string,
  content: string
): Promise<boolean> => {
  const emailData: EmailData = {
    email,
    subject,
    html_content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; margin: 0;">Zyra Custom Craft</h1>
        </div>
        
        <div style="background: #fff; padding: 20px; border-radius: 8px; line-height: 1.6;">
          ${content.replace(/\n/g, '<br>')}
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <p style="margin: 0; color: #666; font-size: 14px;">
            You're receiving this because you subscribed to our newsletter.
          </p>
        </div>
      </div>
    `,
    content
  };

  return sendEmailViaWebhook(emailData);
};
