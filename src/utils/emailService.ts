
interface EmailPayload {
  type: string;
  to: string;
  subject: string;
  name?: string;
  order_id?: string;
  items?: Array<{
    name: string;
    qty: number;
    price: string;
  }>;
  total?: string;
  message?: string;
  [key: string]: any;
}

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/18195840/2jeyebc/";

export const sendEmail = async (payload: EmailPayload): Promise<boolean> => {
  try {
    console.log('Sending email via Zapier webhook:', payload);
    
    const response = await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: JSON.stringify(payload),
    });

    console.log('Email webhook response sent');
    return true;
  } catch (error) {
    console.error('Error sending email via webhook:', error);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (orderData: {
  customerEmail: string;
  customerName: string;
  orderId: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}) => {
  const payload: EmailPayload = {
    type: "order_confirmation",
    to: orderData.customerEmail,
    subject: `Thanks for your order, ${orderData.customerName}!`,
    name: orderData.customerName,
    order_id: `#${orderData.orderId.slice(-8)}`,
    items: orderData.items.map(item => ({
      name: item.name,
      qty: item.quantity,
      price: `$${(item.price * item.quantity).toFixed(2)}`
    })),
    total: `$${orderData.total.toFixed(2)}`,
    message: "We're processing your order and will notify you when it ships."
  };

  return await sendEmail(payload);
};

export const sendContactFormEmail = async (contactData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const payload: EmailPayload = {
    type: "contact_form",
    to: "support@zyra.com",
    subject: `New Contact Form: ${contactData.subject}`,
    name: contactData.name,
    email: contactData.email,
    message: contactData.message,
    submitted_at: new Date().toISOString()
  };

  return await sendEmail(payload);
};

export const sendNewsletterEmail = async (data: {
  to: string;
  subject: string;
  content: string;
  campaign_name?: string;
}) => {
  const payload: EmailPayload = {
    type: "newsletter",
    to: data.to,
    subject: data.subject,
    content: data.content,
    campaign_name: data.campaign_name || "Newsletter",
    sent_at: new Date().toISOString()
  };

  return await sendEmail(payload);
};
