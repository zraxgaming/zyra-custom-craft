
import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = 'service_tk4r78b';
const EMAILJS_PUBLIC_KEY = 'ABHeCMny0fMuzV-pd';

// Template IDs
const TEMPLATES = {
  ORDER_CONFIRMATION: 'template_9gawxks',
  NEWSLETTER: 'template_33t5q6p'
};

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderStatus: string;
}

interface NewsletterEmailData {
  email: string;
  content: string;
  unsubscribeLink: string;
}

export const sendOrderConfirmationEmail = async (data: OrderEmailData) => {
  try {
    const templateParams = {
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      order_id: data.orderId,
      order_status: data.orderStatus,
      to_email: data.customerEmail
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATES.ORDER_CONFIRMATION,
      templateParams
    );

    console.log('Order confirmation email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
    return { success: false, error };
  }
};

export const sendNewsletterEmail = async (data: NewsletterEmailData) => {
  try {
    const templateParams = {
      to_email: data.email,
      content: data.content,
      unsubscribe_link: data.unsubscribeLink
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      TEMPLATES.NEWSLETTER,
      templateParams
    );

    console.log('Newsletter email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send newsletter email:', error);
    return { success: false, error };
  }
};

// Helper function to send order status update emails
export const sendOrderStatusUpdateEmail = async (
  customerName: string,
  customerEmail: string,
  orderId: string,
  newStatus: string
) => {
  const statusMessages = {
    processing: 'Your order is being processed',
    shipped: 'Your order has been shipped',
    delivered: 'Your order has been delivered',
    cancelled: 'Your order has been cancelled',
    'ready-for-pickup': 'Your order is ready for pickup'
  };

  const statusMessage = statusMessages[newStatus as keyof typeof statusMessages] || `Order status updated to: ${newStatus}`;

  return sendOrderConfirmationEmail({
    customerName,
    customerEmail,
    orderId,
    orderStatus: statusMessage
  });
};
